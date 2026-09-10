import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Headline from '@/components/ui/Headline';
import GradientBlob from '@/components/ui/GradientBlob';

/**
 * The breathing section. No cards, no CTA — just typography and space.
 */
export default function Statement({ content }) {
  return (
    <Section rhythm="loose" className="text-center">
      <GradientBlob
        tone="primary"
        size={620}
        blur={120}
        drift
        className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-70"
      />
      <GradientBlob
        tone="pink"
        size={420}
        blur={110}
        className="right-[12%] top-10 opacity-60"
      />

      <Container size="narrow">
        <Reveal variant="fade" className="eyebrow">
          {content.eyebrow}
        </Reveal>

        <Reveal delay={100}>
          <Headline
            as="h2"
            text={content.title}
            breakOn="always"
            className="text-statement mt-9 text-ink"
          />
        </Reveal>

        <Reveal
          as="p"
          delay={220}
          className="mx-auto mt-10 max-w-xl text-[1.0625rem] leading-relaxed text-muted"
        >
          {content.lede}
        </Reveal>
      </Container>
    </Section>
  );
}
