'use client';

import { useEffect } from 'react';

/**
 * One IntersectionObserver for the whole document. Server components opt in
 * by rendering `data-reveal`; this engine flips `data-shown` once and then
 * unobserves, so scrolling stays free of listeners entirely.
 *
 * A MutationObserver picks up nodes that arrive with client-side navigation.
 */
export default function RevealEngine() {
  useEffect(() => {
    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduced) {
      document
        .querySelectorAll('[data-reveal]')
        .forEach((el) => el.setAttribute('data-shown', ''));
      return;
    }

    // Elements awaiting reveal, so a jump can be reconciled in one pass.
    const pending = new Set();

    const show = (el) => {
      el.setAttribute('data-shown', '');
      pending.delete(el);
      io.unobserve(el);
    };

    /**
     * Reveal anything that has reached the fold, whether or not the observer
     * saw it cross. An instant jump — End key, hash link, or scroll
     * restoration on refresh — skips intermediate positions entirely, so
     * without this sweep those elements would stay at opacity 0 forever.
     */
    const sweepPassed = () => {
      if (!pending.size) return;
      const fold = window.innerHeight;
      for (const el of [...pending]) {
        if (el.getBoundingClientRect().top < fold) show(el);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show(entry.target);
        }
        sweepPassed();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 }
    );

    const observe = (root) => {
      const nodes =
        root instanceof Element && root.matches('[data-reveal]')
          ? [root]
          : root.querySelectorAll?.('[data-reveal]') ?? [];

      nodes.forEach((el) => {
        if (el.hasAttribute('data-shown') || pending.has(el)) return;
        pending.add(el);
        io.observe(el);
      });

      sweepPassed();
    };

    // Scroll restoration lands after paint, so reconcile once more.
    const onLoad = () => sweepPassed();
    window.addEventListener('load', onLoad);

    observe(document);

    const mo = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === 1) observe(node);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('load', onLoad);
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
