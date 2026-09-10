import Image from 'next/image';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import GradientBlob from '@/components/ui/GradientBlob';
import { HeadlineText } from '@/components/ui/Headline';

/**
 * Renders the blocks a custom page is built from.
 *
 * Each block type maps to one of the layouts the hand-built pages already use,
 * so a page assembled in the admin panel sits inside the same design system
 * rather than looking like a form dump. An unrecognised type renders nothing —
 * a stale block left in the database is invisible, never a crash.
 */

const Header = ({ block, align = 'left' }) =>
  block.eyebrow || block.title || block.lede ? (
    <SectionHeading
      eyebrow={block.eyebrow}
      title={<HeadlineText text={block.title} />}
      lede={block.lede}
      align={align}
      aside={align === 'left' ? true : undefined}
    />
  ) : null;

function RichText({ block }) {
  return (
    <Container size="wide">
      <Header block={block} />
      <div className="measure-wide mt-10 space-y-5 lg:mt-14">
        {(block.body ?? []).map((paragraph, i) => (
          <Reveal
            as="p"
            key={i}
            delay={i * 60}
            className="text-[1.0625rem] leading-relaxed text-muted"
          >
            {paragraph}
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Cards({ block }) {
  return (
    <Container size="wide">
      <Header block={block} />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-18 lg:grid-cols-3 lg:gap-7">
        {(block.items ?? []).map((item, i) => (
          <Reveal key={i} delay={i * 90} className="h-full">
            <div className="h-full rounded-[24px] border border-line bg-white p-8 transition-all duration-[700ms] ease-editorial hover:-translate-y-1.5 hover:border-primary/35">
              <h3 className="text-[1.375rem] leading-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Steps({ block }) {
  return (
    <Container size="wide">
      <Header block={block} />
      <div className="mt-14 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:mt-18 lg:grid-cols-4">
        {(block.items ?? []).map((item, i) => (
          <Reveal key={i} delay={i * 100}>
            <div className="border-t border-line pt-7">
              <span className="grad-text font-display text-[2.5rem] leading-none">
                {item.number || String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-5 text-[1.375rem] leading-tight text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                {item.text}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Stats({ block }) {
  return (
    <Container size="wide">
      <Header block={block} />
      <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
        {(block.items ?? []).map((item, i) => (
          <Reveal key={i} delay={i * 90}>
            <p className="font-display text-[2.75rem] leading-none tracking-[-0.03em] text-ink sm:text-[3.25rem]">
              {item.value}
            </p>
            <p className="mt-3 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
              {item.label}
            </p>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Faq({ block }) {
  return (
    <Container size="wide">
      <Header block={block} />
      <div className="mt-14 grid gap-x-12 gap-y-2 lg:mt-18 lg:grid-cols-2">
        {(block.items ?? []).map((item, i) => (
          <Reveal
            key={item.q ?? i}
            delay={(i % 2) * 90}
            className="border-b border-line py-8"
          >
            <h3 className="text-[1.25rem] leading-snug text-ink">{item.q}</h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              {item.a}
            </p>
          </Reveal>
        ))}
      </div>
    </Container>
  );
}

function Picture({ block }) {
  if (!block.image?.src) return null;

  return (
    <Container size="wide">
      <Reveal variant="scale">
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-lavender lg:aspect-[16/8] lg:rounded-[36px]">
            <Image
              src={block.image.src}
              alt={block.image.alt}
              fill
              sizes="(max-width: 1560px) 92vw, 1440px"
              className="object-cover object-center"
            />
          </div>
          {block.caption ? (
            <figcaption className="mt-4 text-center text-[0.875rem] text-muted">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      </Reveal>
    </Container>
  );
}

function Cta({ block }) {
  return (
    <Container size="wide">
      <div className="grad-tri relative overflow-hidden rounded-[32px] px-7 py-20 text-center text-white sm:px-12 lg:rounded-[40px] lg:px-20 lg:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-24 size-[380px] rounded-full bg-white/18 blur-[70px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 right-[-6rem] size-[440px] rounded-full bg-white/14 blur-[80px]"
        />

        <div className="relative mx-auto max-w-3xl">
          {block.eyebrow ? (
            <Reveal variant="fade" className="eyebrow text-white/65">
              {block.eyebrow}
            </Reveal>
          ) : null}

          <Reveal as="h2" delay={90} className="text-display mt-7 text-white">
            <HeadlineText text={block.title} />
          </Reveal>

          {block.lede ? (
            <Reveal
              as="p"
              delay={170}
              className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-white/75"
            >
              {block.lede}
            </Reveal>
          ) : null}

          <Reveal
            delay={250}
            className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
          >
            {block.primaryCta?.label ? (
              <Button href={block.primaryCta.href || '/contact'} variant="light" size="lg">
                {block.primaryCta.label}
              </Button>
            ) : null}
            {block.secondaryCta?.label ? (
              <Button
                href={block.secondaryCta.href || '/programs'}
                variant="ghost"
                size="lg"
              >
                {block.secondaryCta.label}
              </Button>
            ) : null}
          </Reveal>
        </div>
      </div>
    </Container>
  );
}

const RENDERERS = {
  richText: RichText,
  cards: Cards,
  steps: Steps,
  stats: Stats,
  faq: Faq,
  image: Picture,
  cta: Cta,
};

export default function PageSections({ sections = [] }) {
  return sections.map((block, i) => {
    const Renderer = RENDERERS[block?.type];
    if (!Renderer) return null;

    // The CTA carries its own colour, so it never takes a section tone; the
    // rest alternate so two adjacent bands are never the same.
    const tinted = block.type !== 'cta' && i % 2 === 1;

    return (
      <Section key={i} className={tinted ? 'bg-lavender/40' : undefined}>
        {i % 3 === 0 ? (
          <GradientBlob
            tone={i % 2 ? 'sky' : 'lavender'}
            size={480}
            blur={110}
            className={i % 2 ? '-right-32 top-10 opacity-60' : '-left-32 bottom-0 opacity-70'}
          />
        ) : null}
        <Renderer block={block} />
      </Section>
    );
  });
}
