/**
 * Server component. Marks an element for the global reveal engine
 * (see components/ui/RevealEngine.jsx) — no per-instance client JS.
 *
 * variant: 'up' | 'fade' | 'right' | 'scale'
 * delay:   milliseconds, staggered by the caller
 */
export default function Reveal({
  as: Tag = 'div',
  variant = 'up',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      data-reveal={variant}
      className={className}
      style={delay ? { ...style, '--reveal-delay': `${delay}ms` } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
