'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';

const HOVER_TARGETS =
  'a, button, [role="button"], input, textarea, select, [data-cursor="grow"]';

const FINE_POINTER = '(pointer: fine)';
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

/**
 * Subscribed rather than read once: a laptop docked to a touchscreen, or a
 * mid-session change to the reduced-motion setting, both flip this live.
 */
const subscribe = (onChange) => {
  const queries = [
    window.matchMedia(FINE_POINTER),
    window.matchMedia(REDUCED_MOTION),
  ];
  queries.forEach((q) => q.addEventListener('change', onChange));
  return () =>
    queries.forEach((q) => q.removeEventListener('change', onChange));
};

const getSnapshot = () =>
  window.matchMedia(FINE_POINTER).matches &&
  !window.matchMedia(REDUCED_MOTION).matches;

// The server cannot know the pointer type, so it renders nothing and the
// client fills it in — no hydration mismatch either way.
const getServerSnapshot = () => false;

/**
 * A soft trailing ring, desktop pointers only. It never captures pointer
 * events and the native cursor is left intact, so nothing about usability
 * depends on this rendering.
 */
export default function Cursor() {
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const enabled = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  useEffect(() => {
    if (!enabled) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let raf = 0;
    let visible = false;
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 };
    const trail = { ...pointer };

    const frame = () => {
      // Lerp toward the pointer for a soft lag; the dot tracks exactly.
      trail.x += (pointer.x - trail.x) * 0.16;
      trail.y += (pointer.y - trail.y) * 0.16;
      ring.style.transform = `translate3d(${trail.x}px, ${trail.y}px, 0) translate(-50%, -50%) scale(var(--ring-scale, 1))`;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = '1';
        dot.style.opacity = '1';
      }
    };

    const onOver = (event) => {
      const grow = event.target.closest?.(HOVER_TARGETS);
      ring.style.setProperty('--ring-scale', grow ? '2.1' : '1');
      ring.style.borderColor = grow
        ? 'rgba(109,74,255,0.75)'
        : 'rgba(109,74,255,0.35)';
      ring.style.backgroundColor = grow
        ? 'rgba(109,74,255,0.08)'
        : 'transparent';
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = '0';
      dot.style.opacity = '0';
    };

    raf = requestAnimationFrame(frame);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] size-9 rounded-full border opacity-0 transition-[opacity,border-color,background-color] duration-300 max-lg:hidden"
        style={{ borderColor: 'rgba(109,74,255,0.35)' }}
      />
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] size-1 rounded-full bg-primary opacity-0 transition-opacity duration-300 max-lg:hidden"
      />
    </div>
  );
}
