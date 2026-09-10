import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';

export default function Philosophy({ content, principles = [] }) {
  return (
    <Section className="bg-lavender/40">
      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside
        />

        <ul className="mt-16 lg:mt-20">
          {principles.map((principle, i) => (
            <Reveal
              as="li"
              key={principle.id}
              delay={i * 90}
              className="group/row border-t border-line last:border-b"
            >
              <div className="grid gap-4 py-9 transition-transform duration-[600ms] ease-editorial group-hover/row:translate-x-2 sm:grid-cols-12 sm:gap-8 lg:py-11">
                {/* Two stacked layers cross-fade, so the gradient number
                    keeps its -webkit-background-clip without a hover-only
                    property swap that Safari renders unreliably. */}
                <span
                  aria-hidden="true"
                  className="relative block font-display text-[2.25rem] leading-none sm:col-span-2 sm:text-[2.75rem]"
                >
                  <span className="block text-muted/45 transition-opacity duration-500 group-hover/row:opacity-0">
                    {principle.number}
                  </span>
                  <span className="grad-text absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/row:opacity-100">
                    {principle.number}
                  </span>
                </span>

                <h3 className="text-[1.5rem] leading-tight text-ink sm:col-span-4 lg:text-[1.75rem]">
                  {principle.title}
                </h3>

                <p className="text-[0.9375rem] leading-relaxed text-muted sm:col-span-6 lg:text-base">
                  {principle.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
