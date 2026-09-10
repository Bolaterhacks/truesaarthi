import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Headline from '@/components/ui/Headline';
import GradientBlob from '@/components/ui/GradientBlob';

export default function Hero({ content, image }) {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-36 lg:min-h-[92vh] lg:pb-28 lg:pt-44">
      <GradientBlob
        tone="lavender"
        size={640}
        blur={110}
        drift
        className="-left-40 -top-32 opacity-90"
      />
      <GradientBlob
        tone="sky"
        size={520}
        blur={100}
        className="-right-24 top-1/3 opacity-70"
      />

      <Container size="wide">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
          {/* ---------------------------------------------------- copy */}
          <div className="lg:col-span-6 xl:col-span-6">
            <Reveal variant="fade" className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="grad-primary h-px w-10 shrink-0"
              />
              <p className="eyebrow">{content.eyebrow}</p>
            </Reveal>

            <Reveal delay={90}>
              <Headline
                as="h1"
                text={content.title}
                breakOn="always"
                className="text-hero mt-7 text-ink"
              />
            </Reveal>

            <Reveal
              as="p"
              delay={180}
              className="measure mt-8 text-[1.0625rem] leading-relaxed text-muted sm:text-lg"
            >
              {content.lede}
            </Reveal>

            <Reveal
              delay={260}
              className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <Button href={content.primaryCta?.href ?? '/contact'} size="lg">
                {content.primaryCta?.label}
              </Button>
              <Button
                href={content.secondaryCta?.href ?? '/programs'}
                variant="secondary"
                size="lg"
              >
                {content.secondaryCta?.label}
              </Button>
            </Reveal>

            <Reveal
              delay={340}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-line pt-8"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-3.5 fill-pink text-pink"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted">
                  <span className="font-semibold text-ink">
                    {content.ratingValue}
                  </span>{' '}
                  {content.ratingLabel}
                </p>
              </div>
              <p className="text-sm text-muted">
                <span className="font-semibold text-ink">
                  {content.experienceLabel}
                </span>{' '}
                {content.experienceNote}
              </p>
            </Reveal>
          </div>

          {/* --------------------------------------------------- image */}
          <div className="relative lg:col-span-6 xl:col-span-6 xl:pl-8">
            <Reveal
              variant="scale"
              delay={140}
              className="relative mx-auto max-w-[440px] sm:max-w-[500px] lg:mr-0 lg:max-w-none"
            >
              {/* Glow sits behind the portrait, deliberately larger than it. */}
              <div
                aria-hidden="true"
                className="grad-tri absolute -inset-6 -z-10 rounded-[999px] opacity-25 blur-[60px]"
              />

              <div className="mask-organic relative aspect-[4/5] overflow-hidden bg-lavender">
                {image?.src ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    preload
                    fetchPriority="high"
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 500px, 46vw"
                    className="object-cover object-center"
                  />
                ) : null}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-primary-dark/25 via-transparent to-pink/15"
                />
              </div>

              {/* Floating badge — overlaps the portrait edge on purpose. */}
              <div
                className="absolute -left-3 bottom-12 flex items-center gap-3 rounded-2xl border border-line/80 bg-white/90 px-4 py-3.5 shadow-[0_18px_44px_-22px_rgba(23,21,37,0.45)] backdrop-blur-md sm:-left-8 sm:px-5"
                style={{ animation: 'float-badge 6s ease-in-out infinite' }}
              >
                <span className="grad-primary grid size-9 shrink-0 place-items-center rounded-xl">
                  <Sparkles className="size-4 text-white" aria-hidden="true" />
                </span>
                <span className="leading-tight">
                  <span className="block text-[0.8125rem] font-semibold text-ink">
                    {content.badgeTitle}
                  </span>
                  <span className="block text-[0.6875rem] text-muted">
                    {content.badgeNote}
                  </span>
                </span>
              </div>

              {/* Small decorative orbs */}
              <span
                aria-hidden="true"
                className="grad-primary absolute -right-2 top-10 size-16 rounded-full opacity-80 blur-[2px] sm:-right-5 sm:size-20"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-2 right-12 size-8 rounded-full bg-sky/70 sm:size-10"
              />
              <span
                aria-hidden="true"
                className="absolute left-6 -top-3 size-3 rounded-full bg-pink"
              />
            </Reveal>

            {content.quote ? (
              <Reveal
                variant="fade"
                delay={420}
                className="mt-10 hidden items-center gap-4 lg:flex"
              >
                <span aria-hidden="true" className="h-px w-12 bg-line" />
                <p className="measure text-sm leading-relaxed text-muted">
                  “{content.quote}”
                </p>
              </Reveal>
            ) : null}
          </div>
        </div>
      </Container>

      {/* -------------------------------------------- scroll indicator */}
      <Container size="wide" className="mt-16 hidden lg:mt-20 lg:block">
        <a
          href="#intro"
          className="group/scroll inline-flex items-center gap-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-muted transition-colors duration-300 hover:text-primary"
        >
          <span
            aria-hidden="true"
            className="relative block h-10 w-px overflow-hidden bg-line"
          >
            <span
              className="grad-primary absolute inset-x-0 h-1/2"
              style={{ animation: 'scroll-hint 2.4s ease-in-out infinite' }}
            />
          </span>
          {content.scrollLabel}
        </a>
      </Container>
    </section>
  );
}
