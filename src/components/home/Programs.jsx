import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';
import Button from '@/components/ui/Button';
import ProgramCard from '@/components/cards/ProgramCard';
import GradientBlob from '@/components/ui/GradientBlob';

export default function Programs({ content, programs = [] }) {
  return (
    <Section className="bg-lavender/40">
      <GradientBlob
        tone="sky"
        size={480}
        blur={110}
        className="-left-32 bottom-0 opacity-70"
      />

      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside={
            <div className="mt-7">
              <Button href={content.ctaHref ?? '/programs'} variant="secondary">
                {content.ctaLabel}
              </Button>
            </div>
          }
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-3 lg:gap-7">
          {programs.map((program, i) => (
            /* The offset lives on a wrapper: Reveal resets `transform` to
               none once shown, which would otherwise cancel it. */
            <div
              key={program.slug}
              className={program.featured ? 'lg:-mt-5 lg:mb-5' : ''}
            >
              <Reveal delay={i * 120} className="h-full">
                <ProgramCard program={program} />
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
