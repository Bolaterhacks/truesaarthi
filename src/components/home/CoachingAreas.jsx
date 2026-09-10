import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';

/**
 * Line-based rather than card-based: each subject is a full-bleed row that
 * fills with gradient on hover.
 */
export default function CoachingAreas({ content, areas = [] }) {
  return (
    <Section>
      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside
        />

        <ul className="mt-14 border-t border-line lg:mt-18">
          {areas.map((area, i) => (
            <Reveal
              as="li"
              key={area.id}
              delay={i * 55}
              className="border-b border-line"
            >
              <Link
                href="/programs"
                className="group/area relative flex items-center justify-between gap-6 overflow-hidden px-1 py-6 sm:px-5 lg:py-8"
              >
                {/* Gradient wash slides in from the left on hover. */}
                <span
                  aria-hidden="true"
                  className="grad-soft absolute inset-0 -z-10 origin-left scale-x-0 transition-transform duration-[700ms] ease-editorial group-hover/area:scale-x-100"
                />

                <div className="flex min-w-0 items-baseline gap-4 sm:gap-7">
                  <span className="shrink-0 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="truncate font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink transition-transform duration-[600ms] ease-editorial group-hover/area:translate-x-2 sm:text-[2.25rem] lg:text-[2.75rem]">
                    {area.title}
                  </h3>
                </div>

                <div className="flex shrink-0 items-center gap-5">
                  <span className="hidden text-sm text-muted transition-colors duration-300 group-hover/area:text-ink lg:block">
                    {area.note}
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 ease-editorial group-hover/area:-translate-y-1 group-hover/area:translate-x-1 group-hover/area:border-transparent group-hover/area:bg-ink group-hover/area:text-white sm:size-11">
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
