import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Headline from '@/components/ui/Headline';
import GradientBlob from '@/components/ui/GradientBlob';

export default function IntroSection({ content, stats = [] }) {
  return (
    <Section id="intro" rhythm="loose">
      <GradientBlob
        tone="pink"
        size={460}
        blur={110}
        className="-right-32 top-10 opacity-60"
      />

      <Container size="wide">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal variant="fade" className="eyebrow flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grad-primary h-px w-8 shrink-0"
              />
              {content.eyebrow}
            </Reveal>

            <Reveal delay={80}>
              <Headline
                as="h2"
                text={content.title}
                className="text-display mt-7 text-ink"
              />
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:pt-4">
            {(content.body ?? []).map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                delay={140 + i * 60}
                className={`text-[1.0625rem] leading-relaxed text-muted ${
                  i > 0 ? 'mt-5' : ''
                }`}
              >
                {paragraph}
              </Reveal>
            ))}

            <Reveal delay={260} className="mt-9">
              <Link
                href={content.linkHref ?? '/about'}
                className="group/link inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-ink"
              >
                <span className="link-underline">{content.linkLabel}</span>
                <span className="grid size-9 place-items-center rounded-full border border-line transition-all duration-500 ease-editorial group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-white">
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Statistic band — a quiet horizontal rule between the two halves. */}
        <div className="mt-20 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 sm:gap-x-10 lg:mt-24 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 90}>
              <p className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink sm:text-[3.25rem]">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
