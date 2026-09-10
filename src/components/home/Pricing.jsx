import Link from 'next/link';
import { Check } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';

/**
 * Thin borders, no shadow stack. The featured plan is marked with a hairline
 * gradient ring rather than a heavier card.
 */
export default function Pricing({ eyebrow, title, lede, programs = [] }) {
  return (
    <Section>
      <Container size="wide">
        <SectionHeading
          eyebrow={eyebrow}
          title={<HeadlineText text={title} />}
          lede={lede}
          align="center"
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {programs.map((plan, i) => {
            const featured = plan.featured;

            return (
              <Reveal key={plan.slug} delay={i * 110} className="h-full">
                <div
                  className={`relative flex h-full flex-col rounded-[26px] p-8 transition-all duration-[700ms] ease-editorial hover:-translate-y-1.5 lg:p-10 ${
                    featured
                      ? 'grad-ring shadow-[0_28px_60px_-38px_rgba(109,74,255,0.55)]'
                      : 'border border-line bg-white hover:border-primary/35'
                  }`}
                >
                  {featured ? (
                    <span className="grad-primary absolute -top-3 left-10 rounded-full px-3.5 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white">
                      Most chosen
                    </span>
                  ) : null}

                  <h3 className="text-[1.625rem] leading-tight text-ink">
                    {plan.title}
                  </h3>
                  <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {plan.excerpt}
                  </p>

                  <div className="mt-8 flex items-baseline gap-2.5 border-t border-line pt-8">
                    <span
                      className={`font-display text-[3.25rem] leading-none ${
                        featured ? 'grad-text' : 'text-ink'
                      }`}
                    >
                      {plan.priceLabel}
                    </span>
                    <span className="text-[0.8125rem] text-muted">
                      {plan.priceNote}
                    </span>
                  </div>

                  <p className="mt-3 text-[0.8125rem] text-muted">
                    {plan.format}
                  </p>

                  <ul className="mt-8 space-y-3.5">
                    {(plan.includes ?? []).map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9375rem] text-muted"
                      >
                        <Check
                          className="mt-[3px] size-4 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-10">
                    <Link
                      href="/contact"
                      className={`flex items-center justify-center rounded-xl px-6 py-4 text-[0.9375rem] font-semibold transition-all duration-500 ease-editorial ${
                        featured
                          ? 'grad-primary bg-[length:200%_100%] bg-[position:0%_0%] text-white hover:bg-[position:100%_0%]'
                          : 'border border-line text-ink hover:border-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      Start with {plan.title}
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-12 text-center text-[0.875rem] text-muted">
          Sliding-scale places are held on every program.{' '}
          <Link
            href="/contact"
            className="link-underline font-semibold text-ink"
          >
            Ask about one
          </Link>
          .
        </p>
      </Container>
    </Section>
  );
}
