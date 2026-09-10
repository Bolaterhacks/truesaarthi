import {
  getCoachingAreas,
  getEpisodes,
  getEvents,
  getMedia,
  getPageOrDefault,
  getPhilosophy,
  getPodcast,
  getPosts,
  getPrograms,
  getSite,
  getTestimonials,
  getTransformationAreas,
  resolveImage,
} from '@/lib/content';
import {
  pageDocMetadata,
  graph,
  serviceSchema,
  eventSchema,
} from '@/lib/seo';
import JsonLd from '@/components/ui/JsonLd';

import Hero from '@/components/home/Hero';
import IntroSection from '@/components/home/IntroSection';
import TransformationAreas from '@/components/home/TransformationAreas';
import AboutCoach from '@/components/home/AboutCoach';
import Philosophy from '@/components/home/Philosophy';
import Statement from '@/components/home/Statement';
import CoachingAreas from '@/components/home/CoachingAreas';
import Programs from '@/components/home/Programs';
import Events from '@/components/home/Events';
import Testimonials from '@/components/home/Testimonials';
import Podcast from '@/components/home/Podcast';
import Pricing from '@/components/home/Pricing';
import GuideCTA from '@/components/home/GuideCTA';
import BlogPreview from '@/components/home/BlogPreview';
import FinalCTA from '@/components/home/FinalCTA';

export async function generateMetadata() {
  const [site, page, media] = await Promise.all([
    getSite(),
    getPageOrDefault('/'),
    getMedia(),
  ]);

  return pageDocMetadata(site, page, {
    image: page.meta?.ogImage
      ? resolveImage(media, page.meta.ogImage).src
      : undefined,
  });
}

export default async function HomePage() {
  const [
    site,
    media,
    page,
    podcast,
    programs,
    events,
    posts,
    testimonials,
    areas,
    subjects,
    principles,
    episodes,
  ] = await Promise.all([
    getSite(),
    getMedia(),
    getPageOrDefault('/'),
    getPodcast(),
    getPrograms(),
    getEvents(),
    getPosts(),
    getTestimonials(),
    getTransformationAreas(),
    getCoachingAreas(),
    getPhilosophy(),
    getEpisodes(),
  ]);

  // Everything below reads the home page's own content block.
  const home = page.content ?? {};

  return (
    <>
      <JsonLd
        data={graph(
          programs.map((program) => serviceSchema(site, program)),
          events
            .slice(0, 3)
            .map((event) => eventSchema(site, event, event.image?.src))
        )}
      />

      {/*
        Section rhythm is deliberate: image → whitespace → typography →
        asymmetric grid → breathing statement → cards → CTA. Two adjacent
        sections never share a background tone.
      */}
      <Hero
        content={home.hero}
        image={resolveImage(media, 'heroPortrait', site.name)}
      />
      <IntroSection content={home.intro} stats={site.stats} />
      <TransformationAreas content={home.transformation} areas={areas} />
      <AboutCoach
        content={home.aboutCoach}
        site={site}
        portrait={resolveImage(media, 'coachPortrait', site.coach?.name)}
        secondary={resolveImage(media, 'coachSecondary', site.coach?.name)}
      />
      <Philosophy content={home.philosophy} principles={principles} />
      <Statement content={home.statement} />
      <CoachingAreas content={home.coachingAreas} areas={subjects} />
      <Programs content={home.programs} programs={programs} />
      <Events content={home.events} events={events} />
      <Testimonials content={home.testimonials} testimonials={testimonials} />
      <Podcast
        content={podcast}
        episodes={episodes}
        image={resolveImage(media, podcast.image, podcast.name)}
      />
      <Pricing
        eyebrow={home.pricing?.eyebrow}
        title={home.pricing?.title}
        lede={home.pricing?.lede}
        programs={programs}
      />
      <GuideCTA content={home.guideCta} />
      <BlogPreview content={home.blogPreview} posts={posts} />
      <FinalCTA content={home.finalCta} />
    </>
  );
}
