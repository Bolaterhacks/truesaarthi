import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const base =
  'group/btn relative inline-flex items-center justify-center gap-2.5 rounded-xl text-[0.9375rem] font-semibold leading-none transition-all duration-500 ease-editorial disabled:cursor-not-allowed disabled:opacity-60';

const sizes = {
  md: 'px-7 py-4',
  sm: 'px-5 py-3 text-sm',
  lg: 'px-8 py-[1.15rem]',
};

const variants = {
  // Gradient sits on a pseudo-less second layer so the hover shift animates
  // background-position rather than repainting a new gradient.
  primary:
    'grad-primary bg-[length:200%_100%] bg-[position:0%_0%] text-white shadow-[0_10px_30px_-12px_rgba(109,74,255,0.65)] hover:bg-[position:100%_0%] hover:shadow-[0_16px_38px_-12px_rgba(109,74,255,0.55)] hover:-translate-y-0.5',
  secondary:
    'border border-line bg-transparent text-ink hover:border-primary hover:bg-primary hover:text-white hover:-translate-y-0.5',
  light:
    'bg-white text-ink shadow-[0_10px_30px_-16px_rgba(23,21,37,0.4)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-16px_rgba(23,21,37,0.35)]',
  ghost:
    'border border-white/35 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-ink hover:-translate-y-0.5',
};

export default function Button({
  href,
  variant = 'primary',
  size = 'md',
  withArrow = true,
  className = '',
  children,
  ...rest
}) {
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="size-[1.05em] shrink-0 transition-transform duration-500 ease-editorial group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {content}
    </button>
  );
}
