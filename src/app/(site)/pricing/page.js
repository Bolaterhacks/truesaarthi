import {
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
  faqSchema,
  breadcrumbSchema,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/ui/JsonLd';
import PageHero from '@/components/shared/PageHero';
import Pricing from '@/components/home/Pricing';
import Testimonials from '@/components/home/Testimonials';
import FinalCTA from '@/components/home/FinalCTA';
import { HeadlineText } from '@/components/ui/Headline';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/pricing'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function PricingPage() {
  const [site, doc, programs, testimonials, home] = await Promise.all([
    getSite(),
    getPageOrDefault('/pricing'),
    getPrograms(),
    getTestimonials(),
    getHomeContent(),
  ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};
  const faqs = doc.faqs ?? [];

  return (
    <>
      <JsonLd
        data={graph(
          programs.map((program) => serviceSchema(site, program)),
          faqSchema(faqs),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Pricing', href: '/pricing' },
          ])
        )}
      />

      <PageHero
        eyebrow={page.eyebrow}
        align="center"
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Pricing', href: '/pricing' },
        ]}
        title={page.title}
        lede={page.lede}
      />

      <Pricing
        eyebrow={page.plansEyebrow}
        title={page.plansTitle}
        lede={page.plansLede}
        programs={programs}
      />

      {/* ----------------------------------------------------------- FAQ */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <SectionHeading
            eyebrow={page.faqEyebrow}
            title={<HeadlineText text={page.faqTitle} />}
            lede={page.faqLede}
            aside
          />

          <div className="mt-14 grid gap-x-12 gap-y-2 lg:mt-18 lg:grid-cols-2">
            {faqs.map((faq, i) => (
              <Reveal
                key={faq.q ?? i}
                delay={(i % 2) * 90}
                className="border-b border-line py-8"
              >
                <h3 className="text-[1.25rem] leading-snug text-ink">
                  {faq.q}
                </h3>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  {faq.a}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Testimonials content={home.testimonials} testimonials={testimonials} />

      <FinalCTA
        content={home.finalCta}
        title="Start with the free half hour."
        lede="It costs nothing, commits you to nothing, and is the only reliable way to find out whether this is worth your money."
      />
    </>
  );
}
