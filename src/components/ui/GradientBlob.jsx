const tones = {
  primary: 'rgba(109,74,255,0.42)',
  pink: 'rgba(240,138,203,0.42)',
  sky: 'rgba(125,216,247,0.45)',
  lavender: 'rgba(181,160,255,0.38)',
};

/**
 * Purely decorative depth. Always `aria-hidden`, always `pointer-events-none`,
 * and the parent must clip — these deliberately sit outside their grid.
 */
export default function GradientBlob({
  tone = 'primary',
  size = 520,
  blur = 90,
  drift = false,
  className = '',
  style,
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 30%, ${tones[tone]} 0%, transparent 68%)`,
        filter: `blur(${blur}px)`,
        ...(drift
          ? { animation: 'drift 16s ease-in-out infinite' }
          : null),
        ...style,
      }}
    />
  );
}
