import { notFound } from 'next/navigation';

import {
  getMedia,
  getPage,
  getPages,
  getSite,
  resolveImage,
} from '@/lib/content';
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  pageDocMetadata,
  robotsTag,
} from '@/lib/seo';
import { PAGE_TEMPLATES } from '@/lib/admin/schema';

import JsonLd from '@/components/ui/JsonLd';
import Button from '@/components/ui/Button';
import PageHero from '@/components/shared/PageHero';
import PageSections from '@/components/site/PageSections';
import Section from '@/components/ui/Section';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';

/**
 * Serves every page an editor creates in the admin panel.
 *
 * Next resolves static segments before this catch-all, so the hand-built
 * routes (`/about`, `/programs/…`) are unaffected — this only ever picks up
 * URLs that have no file of their own. A page whose template is one of the
 * built-in ones is *not* rendered here: those belong to their own route, and
 * serving a second copy from this one would duplicate the URL.
 */
export async function generateStaticParams() {
  const pages = await getPages();

  return pages
    .filter((page) => !PAGE_TEMPLATES[page.template]?.builtIn)
    .map((page) => ({
      slug: String(page.path ?? '').replace(/^\/+/, '').split('/').filter(Boolean),
    }))
    .filter((entry) => entry.slug.length > 0);
}

async function load(slug) {
  const path = `/${(slug ?? []).join('/')}`;
  const page = await getPage(path);

  // A built-in template has its own route; reaching it here means the editor
  // pointed a custom page at a path the site already owns.
  if (!page || PAGE_TEMPLATES[page.template]?.builtIn) return null;
  return page;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [site, page, media] = await Promise.all([
    getSite(),
    load(slug),
    getMedia(),
  ]);

  if (!page) return { title: 'Page not found', robots: robotsTag(true) };

  return pageDocMetadata(site, page, {
    image: page.meta?.ogImage
      ? resolveImage(media, page.meta.ogImage).src
      : undefined,
  });
}

export default async function CustomPage({ params }) {
  const { slug } = await params;
  const [site, page, media] = await Promise.all([
    getSite(),
    load(slug),
    getMedia(),
  ]);

  if (!page) notFound();

  const content = page.content ?? {};
  const faqs = (page.faqs ?? []).filter((faq) => faq?.q);

  // Blocks store an image *key*; resolve them here so the renderer stays a
  // presentational component like every other one on the site.
  const sections = (page.sections ?? []).map((block) =>
    block?.type === 'image'
      ? { ...block, image: resolveImage(media, block.image, block.caption ?? '') }
      : block
  );

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: page.label ?? page.path, href: page.path },
          ]),
          faqSchema(faqs)
        )}
      />

      <PageHero
        eyebrow={content.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: page.label ?? page.path, href: page.path },
        ]}
        title={content.title || page.label}
        lede={content.lede}
      >
        {content.primaryCta?.label || content.secondaryCta?.label ? (
          <div className="flex flex-wrap gap-3.5">
            {content.primaryCta?.label ? (
              <Button href={content.primaryCta.href || '/contact'}>
                {content.primaryCta.label}
              </Button>
            ) : null}
            {content.secondaryCta?.label ? (
              <Button href={content.secondaryCta.href || '/programs'} variant="secondary">
                {content.secondaryCta.label}
              </Button>
            ) : null}
          </div>
        ) : null}
      </PageHero>

      <PageSections sections={sections} />

      {/* Page-level questions render after the blocks, unless a block already
          shows its own FAQ list — two question lists on one page is a mistake,
          not a layout. */}
      {faqs.length && !sections.some((block) => block?.type === 'faq') ? (
        <Section className="bg-lavender/40">
          <Container size="wide">
            <h2 className="text-display text-ink">Questions</h2>
            <div className="mt-12 grid gap-x-12 gap-y-2 lg:grid-cols-2">
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
      ) : null}
    </>
  );
}
