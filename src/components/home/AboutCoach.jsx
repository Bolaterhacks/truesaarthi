import Image from 'next/image';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Headline from '@/components/ui/Headline';
import GradientBlob from '@/components/ui/GradientBlob';

export default function AboutCoach({ content, site, portrait, secondary }) {
  return (
    <Section rhythm="loose">
      <GradientBlob
        tone="primary"
        size={520}
        blur={110}
        className="-left-40 top-1/4 opacity-60"
      />

      <Container size="wide">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-20">
          {/* ------------------------------------------ image cluster */}
          <div className="lg:col-span-5">
            <Reveal variant="scale" className="relative">
              <div className="mask-arch relative aspect-[4/5] overflow-hidden bg-lavender">
                <Image
                  src={portrait.src}
                  alt={portrait.alt}
                  fill
                  sizes="(max-width: 1024px) 88vw, 38vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Secondary frame overlapping the main portrait. */}
              <div className="absolute -bottom-10 -right-4 hidden w-[42%] overflow-hidden rounded-[22px] border-4 border-canvas bg-lavender sm:-right-8 sm:block">
                <div className="relative aspect-[4/5]">
                  <Image
                    src={secondary.src}
                    alt={secondary.alt}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Statistic chip, deliberately breaking the left edge. */}
              <div className="absolute -left-4 top-10 rounded-2xl border border-line/80 bg-white/90 px-5 py-4 shadow-[0_18px_44px_-24px_rgba(23,21,37,0.45)] backdrop-blur-md sm:-left-8">
                <p className="font-display text-[2rem] leading-none text-ink">
                  {content.statValue}
                </p>
                <p className="mt-1.5 whitespace-pre-line text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
                  {content.statLabel}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="grad-primary absolute -left-6 bottom-24 size-14 rounded-full opacity-70 blur-[3px]"
              />
            </Reveal>
          </div>

          {/* -------------------------------------------------- copy */}
          <div className="lg:col-span-7 lg:pl-6">
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
                className="text-title mt-7 text-ink"
              />
            </Reveal>

            {(content.body ?? []).map((paragraph, i) => (
              <Reveal
                as="p"
                key={i}
                delay={150 + i * 60}
                className={`measure-wide text-[1.0625rem] leading-relaxed text-muted ${
                  i === 0 ? 'mt-8' : 'mt-5'
                }`}
              >
                {paragraph}
              </Reveal>
            ))}

            <Reveal delay={270} className="mt-10 flex flex-wrap gap-3.5">
              <Button href={content.primaryCta?.href ?? '/about'}>
                {content.primaryCta?.label}
              </Button>
              <Button
                href={content.secondaryCta?.href ?? '/contact'}
                variant="secondary"
              >
                {content.secondaryCta?.label}
              </Button>
            </Reveal>

            <Reveal
              delay={330}
              className="mt-12 flex items-center gap-5 border-t border-line pt-8"
            >
              <p className="font-display text-[1.6rem] leading-none text-ink">
                {site.coach?.name}
              </p>
              <span aria-hidden="true" className="h-6 w-px bg-line" />
              <p className="text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
                {site.coach?.credential}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
