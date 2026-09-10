import {
  getCoachingAreas,
  getHomeContent,
  getPageOrDefault,
  getPrograms,
  getSite,
  getTestimonials,
} from '@/lib/content';
import {
  pageDocMetadata,
  graph,
  serviceSchema,
  breadcrumbSchema,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/ui/JsonLd';
import Button from '@/components/ui/Button';
import PageHero from '@/components/shared/PageHero';
import ProgramCard from '@/components/cards/ProgramCard';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import { HeadlineText } from '@/components/ui/Headline';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/programs'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function ProgramsPage() {
  const [site, doc, programs, subjects, home, testimonials] =
    await Promise.all([
      getSite(),
      getPageOrDefault('/programs'),
      getPrograms(),
      getCoachingAreas(),
      getHomeContent(),
      getTestimonials(),
    ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};

  return (
    <>
      <JsonLd
        data={graph(
          programs.map((program) => serviceSchema(site, program)),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Programs', href: '/programs' },
          ])
        )}
      />

      <PageHero
        eyebrow={page.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Programs', href: '/programs' },
        ]}
        title={page.title}
        lede={page.lede}
      >
        <div className="flex flex-wrap gap-3.5">
          <Button href={page.primaryCta?.href ?? '/contact'}>
            {page.primaryCta?.label}
          </Button>
          <Button
            href={page.secondaryCta?.href ?? '/pricing'}
            variant="secondary"
          >
            {page.secondaryCta?.label}
          </Button>
        </div>
      </PageHero>

      <Section rhythm="tight">
        <Container size="wide">
          {/* The cards carry h3s. Without this the outline jumps h1 -> h3,
              which is exactly the skip screen-reader users navigate by. */}
          <h2 className="sr-only">The three coaching programs</h2>

          <div className="grid gap-6 lg:grid-cols-3 lg:gap-7">
            {programs.map((program, i) => (
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

      {/* ------------------------------------------------- how it works */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <SectionHeading
            eyebrow={page.processEyebrow}
            title={<HeadlineText text={page.processTitle} />}
            lede={page.processLede}
            aside
          />

          <div className="mt-14 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:mt-18 lg:grid-cols-4">
            {(page.process ?? []).map((step, i) => (
              <Reveal key={step.number} delay={i * 100}>
                <div className="border-t border-line pt-7">
                  <span className="grad-text font-display text-[2.5rem] leading-none">
                    {step.number}
                  </span>
                  <h3 className="mt-5 text-[1.375rem] leading-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* --------------------------------------------------- what we cover */}
      <Section>
        <Container size="wide">
          <SectionHeading
            eyebrow={page.subjectsEyebrow}
            title={<HeadlineText text={page.subjectsTitle} />}
            align="center"
            lede={page.subjectsLede}
          />

          <div className="mt-14 flex flex-wrap justify-center gap-3 lg:mt-16">
            {subjects.map((area, i) => (
              <Reveal key={area.id} delay={i * 60} variant="fade">
                <span className="inline-flex items-baseline gap-2.5 rounded-full border border-line bg-white px-5 py-3 transition-colors duration-500 hover:border-primary/40 hover:bg-lavender/60">
                  <span className="text-[1rem] text-ink">{area.title}</span>
                  <span className="text-[0.75rem] text-muted">
                    {area.note}
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Testimonials content={home.testimonials} testimonials={testimonials} />

      <FinalCTA
        content={home.finalCta}
        title={page.ctaTitle}
        lede={page.ctaLede}
      />
    </>
  );
}
