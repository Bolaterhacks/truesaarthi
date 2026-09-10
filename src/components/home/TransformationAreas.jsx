import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';

export default function TransformationAreas({ content, areas = [] }) {
  return (
    <Section className="bg-lavender/40">
      <Container size="wide">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={<HeadlineText text={content.title} />}
          lede={content.lede}
          aside
        />

        <div className="mt-16 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {areas.map((area, i) => (
            /* Alternating offset breaks the grid into an editorial rhythm
               instead of four identical boxes in a row. It lives on a
               wrapper because Reveal resets `transform` once shown. */
            <div
              key={area.id}
              className={i % 2 === 1 ? 'lg:mt-14 lg:-mb-14' : ''}
            >
            <Reveal delay={i * 110} className="h-full">
              <Link
                href={area.href}
                className="group/card block h-full focus:outline-none"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[26px] bg-white">
                  <Image
                    src={area.image.src}
                    alt={area.image.alt}
                    fill
                    sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 22vw"
                    className="object-cover transition-transform duration-[900ms] ease-editorial group-hover/card:scale-[1.05]"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/5 to-transparent"
                  />
                  {/* Gradient accent fades in only on hover. */}
                  <div
                    aria-hidden="true"
                    className="grad-tri absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-700 group-hover/card:opacity-70"
                  />

                  <span className="absolute left-5 top-5 font-display text-[2.5rem] leading-none text-white/85">
                    {area.number}
                  </span>

                  <span className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-white/90 text-ink backdrop-blur-sm transition-all duration-500 ease-editorial group-hover/card:-translate-y-1 group-hover/card:translate-x-1 group-hover/card:bg-primary group-hover/card:text-white">
                    <ArrowUpRight className="size-5" aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-7 text-[1.5rem] leading-tight text-ink transition-colors duration-300 group-hover/card:text-primary">
                  {area.title}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                  {area.description}
                </p>
              </Link>
            </Reveal>
            </div>
          ))}
        </div>

        {/* Reserve the space the offset column borrows, so nothing collides. */}
        <div aria-hidden="true" className="hidden lg:block lg:h-14" />
      </Container>
    </Section>
  );
}
