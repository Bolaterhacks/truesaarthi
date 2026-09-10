import Image from 'next/image';

import {
  getHomeContent,
  getMedia,
  getPageOrDefault,
  getPhilosophy,
  getSite,
  getTestimonials,
  resolveImage,
} from '@/lib/content';
import { interpolate } from '@/lib/text';
import {
  pageDocMetadata,
  graph,
  personSchema,
  breadcrumbSchema,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import GradientBlob from '@/components/ui/GradientBlob';
import JsonLd from '@/components/ui/JsonLd';
import PageHero from '@/components/shared/PageHero';
import TestimonialCard from '@/components/cards/TestimonialCard';
import FinalCTA from '@/components/home/FinalCTA';
import Headline, { HeadlineText } from '@/components/ui/Headline';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/about'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function AboutPage() {
  const [site, media, doc, principles, testimonials, home] = await Promise.all([
    getSite(),
    getMedia(),
    getPageOrDefault('/about'),
    getPhilosophy(),
    getTestimonials(),
    getHomeContent(),
  ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};

  const tokens = { name: site.name, coachName: site.coach?.name };
  const studio = resolveImage(media, 'studio', page.studioName);
  const journey = resolveImage(media, 'aboutJourney', site.coach?.name);

  return (
    <>
      <JsonLd
        data={graph(
          personSchema(site),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'About', href: '/about' },
          ])
        )}
      />

      <PageHero
        eyebrow={page.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
        title={page.title}
        lede={interpolate(page.lede, tokens)}
      >
        <div className="flex flex-wrap gap-3.5">
          <Button href={page.primaryCta?.href ?? '/contact'}>
            {page.primaryCta?.label}
          </Button>
          <Button
            href={page.secondaryCta?.href ?? '/programs'}
            variant="secondary"
          >
            {page.secondaryCta?.label}
          </Button>
        </div>
      </PageHero>

      {/* ------------------------------------------------ portrait band */}
      <Section rhythm="tight" className="pt-0">
        <Container size="wide">
          <Reveal variant="scale" className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[32px] bg-lavender sm:aspect-[16/8] lg:rounded-[40px]">
              <Image
                src={studio.src}
                alt={studio.alt}
                fill
                preload
                sizes="(max-width: 1560px) 92vw, 1440px"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
              />
            </div>

            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 px-5 py-4 backdrop-blur-md sm:bottom-8 sm:left-8">
              <p className="text-[0.8125rem] font-semibold text-ink">
                {page.studioName}
              </p>
              <p className="mt-1 text-[0.75rem] text-muted">
                {site.address?.locality}, {site.address?.region}
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- the story */}
      <Section>
        <GradientBlob
          tone="sky"
          size={480}
          blur={110}
          className="-right-32 top-20 opacity-60"
        />

        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
            <div className="lg:col-span-5">
              <Reveal variant="scale" className="relative lg:sticky lg:top-32">
                <div className="mask-arch relative aspect-[4/5] overflow-hidden bg-lavender">
                  <Image
                    src={journey.src}
                    alt={journey.alt}
                    fill
                    sizes="(max-width: 1024px) 88vw, 36vw"
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="grad-primary absolute -right-5 top-12 size-16 rounded-full opacity-75 blur-[3px]"
                />
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal variant="fade" className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grad-primary h-px w-8 shrink-0"
                />
                {page.storyEyebrow}
              </Reveal>

              <Reveal delay={80}>
                <Headline
                  as="h2"
                  text={page.storyTitle}
                  className="text-title mt-7 text-ink"
                />
              </Reveal>

              <div className="measure-wide mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
                {(page.storyBody ?? []).map((paragraph, i) => (
                  <Reveal as="p" key={i} delay={140 + i * 40}>
                    {paragraph}
                  </Reveal>
                ))}
              </div>

              {/* --------------------------------------------- timeline */}
              <ul className="mt-14 border-t border-line">
                {(page.timeline ?? []).map((entry, i) => (
                  <Reveal
                    as="li"
                    key={entry.year}
                    delay={i * 80}
                    className="group/tl grid gap-2 border-b border-line py-7 sm:grid-cols-12 sm:gap-8"
                  >
                    <span className="font-display text-[1.5rem] leading-none text-muted/60 transition-colors duration-500 group-hover/tl:text-primary sm:col-span-3">
                      {entry.year}
                    </span>
                    <div className="sm:col-span-9">
                      <h3 className="text-[1.25rem] leading-tight text-ink">
                        {entry.title}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">
                        {entry.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- what I believe */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <SectionHeading
            eyebrow={page.beliefsEyebrow}
            title={<HeadlineText text={page.beliefsTitle} />}
            lede={page.beliefsLede}
            aside
          />

          <div className="mt-14 grid gap-x-10 gap-y-1 sm:grid-cols-2 lg:mt-18">
            {(page.beliefs ?? []).map((belief, i) => (
              <Reveal
                key={belief}
                delay={i * 70}
                className="flex items-baseline gap-5 border-b border-line py-6"
              >
                <span className="shrink-0 text-[0.6875rem] font-semibold tracking-[0.18em] text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-[1.125rem] leading-snug text-ink lg:text-[1.25rem]">
                  {belief}
                </p>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 lg:grid-cols-4">
            {(site.stats ?? []).map((stat, i) => (
              <Reveal key={stat.label} delay={i * 90}>
                <p className="font-display text-[2.75rem] leading-none text-ink sm:text-[3.25rem]">
                  {stat.value}
                </p>
                <p className="mt-3 text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
                  {stat.label}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------ approach */}
      <Section>
        <Container size="wide">
          <SectionHeading
            eyebrow={page.approachEyebrow}
            title={<HeadlineText text={page.approachTitle} />}
            align="center"
            lede={page.approachLede}
          />

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:mt-20 lg:gap-7">
            {principles.map((principle, i) => (
              <Reveal key={principle.id} delay={i * 100} className="h-full">
                <div className="group/pr h-full rounded-[24px] border border-line bg-white p-8 transition-all duration-[700ms] ease-editorial hover:-translate-y-1.5 hover:border-primary/35 lg:p-10">
                  <span className="relative block font-display text-[2.5rem] leading-none">
                    <span className="block text-muted/35 transition-opacity duration-500 group-hover/pr:opacity-0">
                      {principle.number}
                    </span>
                    <span
                      aria-hidden="true"
                      className="grad-text absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/pr:opacity-100"
                    >
                      {principle.number}
                    </span>
                  </span>

                  <h3 className="mt-6 text-[1.5rem] leading-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* -------------------------------------------------- testimonials */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <SectionHeading
            eyebrow="In their words"
            title={
              <>
                What working together
                <br className="hidden sm:block" /> actually{' '}
                <span className="grad-text">felt like</span>
              </>
            }
            aside
            lede="Shared with permission, lightly trimmed for length and nothing else."
          />

          <div className="mt-14 grid gap-6 lg:mt-18 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, i) => (
              <Reveal key={testimonial.id} delay={i * 110} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <FinalCTA
        content={home.finalCta}
        title={'Let’s find out if this\nis a good fit.'}
        lede="Thirty minutes, no charge, no pitch. If I am not the right coach for you I will say so, and usually I can point you at someone who is."
      />
    </>
  );
}
