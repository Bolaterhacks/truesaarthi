import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import Headline from '@/components/ui/Headline';

/**
 * Shared closing band. Pages that want their own words pass `title`/`lede`;
 * everything else falls back to the copy in `settings/home`.
 */
export default function FinalCTA({ content, title, lede }) {
  const heading = title ?? content?.title;
  const body = lede ?? content?.lede;
  return (
    <Section rhythm="tight" className="pb-0">
      <Container size="wide">
        <div className="grad-tri relative overflow-hidden rounded-[32px] px-7 py-20 text-center text-white sm:px-12 lg:rounded-[40px] lg:px-20 lg:py-28">
          {/* Organic shapes — clipped by the card, never by the page. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-20 -top-24 size-[380px] rounded-full bg-white/18 blur-[70px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 right-[-6rem] size-[440px] rounded-full bg-white/14 blur-[80px]"
          />
          <div
            aria-hidden="true"
            className="mask-organic pointer-events-none absolute -right-10 top-1/2 size-52 -translate-y-1/2 border border-white/25"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-10 bottom-10 size-24 rounded-full border border-white/20"
          />

          <div className="relative mx-auto max-w-3xl">
            <Reveal variant="fade" className="eyebrow text-white/65">
              {content?.eyebrow ?? 'Let’s begin'}
            </Reveal>

            <Reveal delay={90}>
              <Headline
                as="h2"
                text={heading}
                className="text-display mt-7 text-white"
              />
            </Reveal>

            <Reveal
              as="p"
              delay={170}
              className="mx-auto mt-8 max-w-xl text-[1.0625rem] leading-relaxed text-white/75"
            >
              {body}
            </Reveal>

            <Reveal
              delay={250}
              className="mt-11 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
            >
              <Button
                href={content?.primaryCta?.href ?? '/contact'}
                variant="light"
                size="lg"
              >
                {content?.primaryCta?.label ?? 'Book A Discovery Call'}
              </Button>
              <Button
                href={content?.secondaryCta?.href ?? '/programs'}
                variant="ghost"
                size="lg"
              >
                {content?.secondaryCta?.label ?? 'Explore Programs'}
              </Button>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
