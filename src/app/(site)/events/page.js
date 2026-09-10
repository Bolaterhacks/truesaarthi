import Image from 'next/image';
import { Users, MapPin, Clock } from 'lucide-react';

import {
  getEvents,
  getHomeContent,
  getMedia,
  getPageOrDefault,
  getSite,
  resolveImage,
} from '@/lib/content';
import {
  pageDocMetadata,
  graph,
  eventSchema,
  breadcrumbSchema,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import JsonLd from '@/components/ui/JsonLd';
import PageHero from '@/components/shared/PageHero';
import EventCard from '@/components/cards/EventCard';
import GuideCTA from '@/components/home/GuideCTA';
import FinalCTA from '@/components/home/FinalCTA';
import { HeadlineText } from '@/components/ui/Headline';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/events'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function EventsPage() {
  const [site, media, doc, events, home] = await Promise.all([
    getSite(),
    getMedia(),
    getPageOrDefault('/events'),
    getEvents(),
    getHomeContent(),
  ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};

  const [featured, ...rest] = events;
  const groupImage = resolveImage(media, 'group', 'A private team session');

  return (
    <>
      <JsonLd
        data={graph(
          events.map((event) => eventSchema(site, event, event.image?.src)),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Events', href: '/events' },
          ])
        )}
      />

      <PageHero
        eyebrow={page.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Events', href: '/events' },
        ]}
        title={page.title}
        lede={page.lede}
      />

      {!featured ? (
        <Section rhythm="tight" className="pt-0">
          <Container size="narrow">
            <div className="rounded-[28px] border border-line bg-white p-12 text-center">
              <h2 className="text-[1.5rem] leading-tight text-ink">
                {page.emptyTitle}
              </h2>
              <p className="measure mx-auto mt-4 text-[0.9375rem] leading-relaxed text-muted">
                {page.emptyLede}
              </p>
            </div>
          </Container>
        </Section>
      ) : (
        <>

      {/* -------------------------------------------------- next event */}
      <Section rhythm="tight" className="pt-0">
        <Container size="wide">
          <Reveal variant="scale">
            <article className="relative overflow-hidden rounded-[32px] border border-line bg-white lg:rounded-[40px]">
              <div className="grid lg:grid-cols-12">
                <div className="relative min-h-[280px] lg:col-span-5 lg:min-h-[440px]">
                  <Image
                    src={featured.image.src}
                    alt={featured.image.alt}
                    fill
                    preload
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent"
                  />
                  <span className="grad-primary absolute left-6 top-6 rounded-full px-4 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white">
                    {page.nextUpLabel}
                  </span>
                </div>

                <div className="p-8 sm:p-10 lg:col-span-7 lg:p-14">
                  <div className="flex items-baseline gap-4">
                    <p className="font-display text-[3.5rem] leading-none text-ink">
                      {featured.day}
                    </p>
                    <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.2em] text-muted">
                      {featured.month} {featured.year}
                    </p>
                  </div>

                  <h2 className="text-title mt-6 text-ink">{featured.title}</h2>

                  <p className="measure-wide mt-5 text-[1.0625rem] leading-relaxed text-muted">
                    {featured.excerpt}
                  </p>

                  <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-7 text-[0.9375rem]">
                    <div>
                      <dt className="eyebrow">When</dt>
                      <dd className="mt-2 inline-flex items-center gap-2 text-ink">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {featured.time}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow">Where</dt>
                      <dd className="mt-2 inline-flex items-center gap-2 text-ink">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {featured.locationDetail}
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow">Places</dt>
                      <dd className="mt-2 inline-flex items-center gap-2 text-ink">
                        <Users className="size-3.5" aria-hidden="true" />
                        {featured.seats}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-9 flex flex-wrap items-center gap-5">
                    <Button href={featured.registerHref ?? '/contact'}>
                      Reserve a place
                    </Button>
                    <p className="font-display text-[1.75rem] leading-none text-ink">
                      {featured.price}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        </Container>
      </Section>

      {/* --------------------------------------------------- everything else */}
      <Section>
        <Container size="wide">
          <SectionHeading
            eyebrow={page.upcomingEyebrow}
            title={<HeadlineText text={page.upcomingTitle} />}
            lede={page.upcomingLede}
            aside
          />

          <div className="mt-14 lg:mt-18">
            {rest.map((event, i) => (
              <Reveal key={event.slug} delay={i * 90}>
                <EventCard event={event} />
              </Reveal>
            ))}
            <div className="border-t border-line" />
          </div>
        </Container>
      </Section>
        </>
      )}

      {/* ------------------------------------------------- private events */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Reveal variant="scale" className="relative">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-white">
                  <Image
                    src={groupImage.src}
                    alt={groupImage.alt}
                    fill
                    sizes="(max-width: 1024px) 88vw, 45vw"
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="grad-primary absolute -right-4 -top-4 size-20 rounded-full opacity-70 blur-[4px]"
                />
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:pl-6">
              <Reveal variant="fade" className="eyebrow flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grad-primary h-px w-8 shrink-0"
                />
                For teams
              </Reveal>

              <Reveal as="h2" delay={80} className="text-title mt-7 text-ink">
                Bring one of these
                <br className="hidden sm:block" /> to your{' '}
                <span className="grad-text">team</span>
              </Reveal>

              <Reveal
                as="p"
                delay={150}
                className="measure-wide mt-7 text-[1.0625rem] leading-relaxed text-muted"
              >
                Every workshop runs as a private session for groups of eight to
                twenty-five. Same material, adapted to what is actually
                happening in your team — which is usually not what the brief
                says.
              </Reveal>

              <Reveal delay={220} className="mt-9">
                <Button href="/contact" variant="secondary">
                  Enquire about private sessions
                </Button>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      <GuideCTA content={home.guideCta} />

      <FinalCTA
        content={home.finalCta}
        title="Prefer to talk one to one?"
        lede="Events are a good way in, but the deeper work happens privately. The first conversation is free either way."
      />
    </>
  );
}
