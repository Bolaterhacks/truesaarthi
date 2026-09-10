import Link from 'next/link';
import { ArrowRight, Check, Clock } from 'lucide-react';

const accents = {
  primary: {
    chip: 'bg-primary/12 text-primary-dark',
    tick: 'text-primary',
    edge: 'from-primary via-pink to-sky',
  },
  pink: {
    chip: 'bg-pink/20 text-primary-dark',
    tick: 'text-pink',
    edge: 'from-pink via-pink to-sky',
  },
  sky: {
    chip: 'bg-sky/25 text-primary-dark',
    tick: 'text-primary',
    edge: 'from-sky via-sky to-primary',
  },
};

export default function ProgramCard({ program, showPrice = true }) {
  const accent = accents[program.accent] ?? accents.primary;
  const { featured } = program;

  return (
    <article
      className={`group/prog relative flex h-full flex-col overflow-hidden rounded-[26px] p-8 transition-all duration-[700ms] ease-editorial hover:-translate-y-1.5 lg:p-9 ${
        featured
          ? 'grad-primary text-white shadow-[0_28px_60px_-30px_rgba(109,74,255,0.7)]'
          : 'border border-line bg-white hover:border-primary/35 hover:shadow-[0_28px_60px_-38px_rgba(23,21,37,0.45)]'
      }`}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/15 blur-[50px]"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-gradient-to-r transition-transform duration-[700ms] ease-editorial group-hover/prog:scale-x-100 ${accent.edge}`}
        />
      )}

      <div className="relative flex items-center justify-between gap-4">
        <span
          className={`font-display text-[2.75rem] leading-none ${
            featured ? 'text-white/45' : 'text-muted/35'
          }`}
        >
          {program.index}
        </span>
        <span
          className={`rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] ${
            featured ? 'bg-white/20 text-white' : accent.chip
          }`}
        >
          {program.kicker}
        </span>
      </div>

      <h3
        className={`relative mt-7 text-[1.875rem] leading-tight lg:text-[2.125rem] ${
          featured ? 'text-white' : 'text-ink'
        }`}
      >
        {program.title}
      </h3>

      <p
        className={`relative mt-4 text-[0.9375rem] leading-relaxed ${
          featured ? 'text-white/80' : 'text-muted'
        }`}
      >
        {program.excerpt}
      </p>

      <div
        className={`relative mt-6 flex items-center gap-2 text-[0.8125rem] ${
          featured ? 'text-white/75' : 'text-muted'
        }`}
      >
        <Clock className="size-3.5 shrink-0" aria-hidden="true" />
        {program.duration}
      </div>

      <ul
        className={`relative mt-7 space-y-3 border-t pt-7 ${
          featured ? 'border-white/25' : 'border-line'
        }`}
      >
        {program.includes.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-3 text-[0.9375rem]">
            <Check
              className={`mt-[3px] size-4 shrink-0 ${
                featured ? 'text-white' : accent.tick
              }`}
              aria-hidden="true"
            />
            <span className={featured ? 'text-white/85' : 'text-muted'}>
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-9">
        {showPrice ? (
          <div className="flex items-baseline gap-2">
            <span
              className={`font-display text-[2.5rem] leading-none ${
                featured ? 'text-white' : 'text-ink'
              }`}
            >
              {program.priceLabel}
            </span>
            <span
              className={`text-[0.8125rem] ${
                featured ? 'text-white/70' : 'text-muted'
              }`}
            >
              {program.priceNote}
            </span>
          </div>
        ) : null}

        <Link
          href={`/programs/${program.slug}`}
          className={`mt-6 flex items-center justify-between gap-4 rounded-xl px-6 py-4 text-[0.9375rem] font-semibold transition-all duration-500 ease-editorial ${
            featured
              ? 'bg-white text-ink hover:bg-white/90'
              : 'bg-ink text-white hover:bg-primary'
          }`}
        >
          Explore this program
          <ArrowRight
            className="size-4 shrink-0 transition-transform duration-500 ease-editorial group-hover/prog:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
