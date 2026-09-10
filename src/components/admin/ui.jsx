/**
 * Small, shared building blocks for the admin panel.
 *
 * The panel deliberately looks nothing like the marketing site: dense, plain
 * and fast to scan. It borrows the colour tokens and nothing else.
 */

export const inputClass =
  'w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25';

export const labelClass =
  'block text-[0.8125rem] font-semibold text-ink';

export const hintClass = 'mt-1 text-[0.75rem] leading-relaxed text-muted';

export function Button({
  as: Tag = 'button',
  variant = 'primary',
  className = '',
  ...rest
}) {
  const variants = {
    primary:
      'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary:
      'border border-line bg-white text-ink hover:border-primary hover:text-primary disabled:opacity-50',
    danger:
      'border border-pink bg-white text-pink hover:bg-pink hover:text-white disabled:opacity-50',
    ghost: 'text-muted hover:text-ink disabled:opacity-50',
  };

  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[0.875rem] font-semibold transition-colors disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    />
  );
}

/** Inline success / error strip used by every form in the panel. */
export function Notice({ tone = 'info', children }) {
  if (!children) return null;

  const tones = {
    success: 'border-primary/30 bg-lavender text-primary-dark',
    error: 'border-pink/50 bg-pink-soft/40 text-ink',
    info: 'border-line bg-white text-muted',
    warning: 'border-pink/40 bg-pink-soft/30 text-ink',
  };

  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-4 py-3 text-[0.875rem] ${tones[tone]}`}
    >
      {children}
    </p>
  );
}

export function Card({ className = '', children }) {
  return (
    <div
      className={`rounded-xl border border-line bg-white p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

export function PageTitle({ title, description, children }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
      <div className="min-w-0">
        <h1 className="font-display text-[1.75rem] leading-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {children ? <div className="flex shrink-0 gap-2">{children}</div> : null}
    </div>
  );
}
