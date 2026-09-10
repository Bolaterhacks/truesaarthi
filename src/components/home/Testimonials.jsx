'use client';

import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import GradientBlob from '@/components/ui/GradientBlob';
import { HeadlineText } from '@/components/ui/Headline';

/**
 * Editorial rather than a slider: one large quote holds the stage, the names
 * sit beneath as a selectable index. No transform track, no drag library —
 * the active quote simply cross-fades.
 */
export default function Testimonials({ content = {}, testimonials = [] }) {
  const [active, setActive] = useState(0);
  const total = testimonials.length;

  const go = useCallback(
    (next) => setActive((current) => (current + next + total) % total),
    [total]
  );

  // Clamp rather than index blindly: the list is editable, so it can shrink
  // underneath a selection that was valid a moment ago — or be emptied.
  const current = total ? testimonials[Math.min(active, total - 1)] : null;

  if (!current) return null;

  return (
    <Section rhythm="loose" className="bg-lavender/40">
      <GradientBlob
        tone="pink"
        size={520}
        blur={120}
        className="-right-32 top-0 opacity-60"
      />

      <Container size="wide">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grad-primary h-px w-8 shrink-0"
              />
              {content.eyebrow}
            </p>
            <h2 className="text-display mt-7 text-ink">
              <HeadlineText text={content.title} />
            </h2>
          </div>

          <div className="shrink-0 sm:text-right">
            <div className="flex items-center gap-2 sm:justify-end">
              <span className="flex" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-pink text-pink"
                    strokeWidth={0}
                  />
                ))}
              </span>
              <span className="font-display text-[1.5rem] leading-none text-ink">
                {content.ratingValue}
              </span>
            </div>
            <p className="mt-2.5 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
              {content.ratingLabel}
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-12 lg:mt-18 lg:grid-cols-12 lg:gap-16">
          {/* ------------------------------------------- active quote */}
          <div className="lg:col-span-8">
            <blockquote
              aria-live="polite"
              className="min-h-[13rem] sm:min-h-[15rem] lg:min-h-[17rem]"
            >
              <p
                key={current.id}
                className="font-display text-[1.75rem] leading-[1.25] tracking-[-0.02em] text-ink sm:text-[2.25rem] lg:text-[2.75rem]"
                style={{ animation: 'quote-in 0.6s var(--ease-editorial) both' }}
              >
                “{current.quote}”
              </p>
            </blockquote>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
              <div>
                <p className="text-[1.0625rem] font-semibold text-ink">
                  {current.name}
                </p>
                <p className="mt-1 text-[0.875rem] text-muted">
                  {current.role} · {current.program}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <p className="text-[0.8125rem] tracking-[0.14em] text-muted">
                  <span className="text-ink">
                    {String(active + 1).padStart(2, '0')}
                  </span>
                  {' / '}
                  {String(total).padStart(2, '0')}
                </p>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label="Previous story"
                    className="grid size-12 place-items-center rounded-full border border-line text-ink transition-all duration-500 ease-editorial hover:border-transparent hover:bg-ink hover:text-white"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label="Next story"
                    className="grid size-12 place-items-center rounded-full border border-line text-ink transition-all duration-500 ease-editorial hover:border-transparent hover:bg-ink hover:text-white"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------- name index */}
          <div className="lg:col-span-4">
            <p className="eyebrow">{content.selectLabel}</p>
            <ul className="mt-6 space-y-1">
              {testimonials.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-current={isActive ? 'true' : undefined}
                      className="group/name flex w-full items-center gap-4 py-3 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-px shrink-0 transition-all duration-[600ms] ease-editorial ${
                          isActive
                            ? 'grad-primary w-10'
                            : 'w-4 bg-line group-hover/name:w-8'
                        }`}
                      />
                      <span
                        className={`min-w-0 flex-1 truncate text-[1.0625rem] transition-colors duration-300 ${
                          isActive
                            ? 'font-semibold text-ink'
                            : 'text-muted group-hover/name:text-ink'
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="hidden shrink-0 text-[0.75rem] uppercase tracking-[0.14em] text-muted sm:block">
                        {item.program}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
