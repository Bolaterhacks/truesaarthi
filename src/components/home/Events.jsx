import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';
import Button from '@/components/ui/Button';
import EventCard from '@/components/cards/EventCard';

export default function Events({ content, events = [] }) {
  const limit = content?.limit ?? 3;
  return (
    <Section>
      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside={
            <div className="mt-7">
              <Button href={content.ctaHref ?? '/events'} variant="secondary">
                {content.ctaLabel}
              </Button>
            </div>
          }
        />

        <div className="mt-14 lg:mt-18">
          {events.slice(0, limit).map((event, i) => (
            <Reveal key={event.slug} delay={i * 90}>
              <EventCard event={event} />
            </Reveal>
          ))}
          <div className="border-t border-line" />
        </div>
      </Container>
    </Section>
  );
}
