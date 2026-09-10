import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import {
  getHomeContent,
  getPageOrDefault,
  getPosts,
  getSite,
} from '@/lib/content';
import {
  pageDocMetadata,
  graph,
  breadcrumbSchema,
  absoluteUrl,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/ui/JsonLd';
import PageHero from '@/components/shared/PageHero';
import BlogCard from '@/components/cards/BlogCard';
import GuideCTA from '@/components/home/GuideCTA';
import FinalCTA from '@/components/home/FinalCTA';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/blog'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function BlogPage() {
  const [site, doc, posts, home] = await Promise.all([
    getSite(),
    getPageOrDefault('/blog'),
    getPosts(),
    getHomeContent(),
  ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};

  // The featured flag wins; otherwise the first article leads.
  const lead = posts.find((post) => post.featured) ?? posts[0];
  const others = posts.filter((post) => post.slug !== lead?.slug);

  const listSchema = {
    '@type': 'CollectionPage',
    name: 'Journal',
    url: absoluteUrl(site, '/blog'),
    hasPart: posts.map((post) => ({
      '@type': 'Article',
      headline: post.title,
      url: absoluteUrl(site, `/blog/${post.slug}`),
      datePublished: post.date,
    })),
  };

  return (
    <>
      <JsonLd
        data={graph(
          listSchema,
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Journal', href: '/blog' },
          ])
        )}
      />

      <PageHero
        eyebrow="The journal"
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/blog' },
        ]}
        title={page.title}
        lede={page.lede}
      />

      {/* ------------------------------------------------- lead article */}
      {lead ? (
      <Section rhythm="tight" className="pt-0">
        <Container size="wide">
          <Reveal variant="scale">
            <article className="group/lead">
              <Link
                href={`/blog/${lead.slug}`}
                className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-16"
              >
                <div className="lg:col-span-7">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-lavender lg:rounded-[32px]">
                    <Image
                      src={lead.image.src}
                      alt={lead.image.alt}
                      fill
                      preload
                      sizes="(max-width: 1024px) 92vw, 55vw"
                      className="object-cover transition-transform duration-[900ms] ease-editorial group-hover/lead:scale-[1.04]"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
                      {lead.category}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <p className="eyebrow">{page.featuredLabel}</p>

                  <h2 className="text-title mt-5 text-ink transition-colors duration-300 group-hover/lead:text-primary">
                    {lead.title}
                  </h2>

                  <p className="measure mt-6 text-[1.0625rem] leading-relaxed text-muted">
                    {lead.excerpt}
                  </p>

                  <div className="mt-8 flex items-center gap-4 text-[0.75rem] uppercase tracking-[0.14em] text-muted">
                    <time dateTime={lead.date}>{lead.dateLabel}</time>
                    <span aria-hidden="true" className="h-px w-5 bg-line" />
                    <span>{lead.readingTime}</span>
                  </div>

                  <span className="mt-9 inline-flex items-center gap-3 text-[0.9375rem] font-semibold text-ink">
                    <span className="link-underline">Read the article</span>
                    <span className="grid size-10 place-items-center rounded-full border border-line transition-all duration-500 ease-editorial group-hover/lead:-translate-y-1 group-hover/lead:translate-x-1 group-hover/lead:border-transparent group-hover/lead:bg-primary group-hover/lead:text-white">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          </Reveal>
        </Container>
      </Section>
      ) : null}

      {/* ----------------------------------------------------- the rest */}
      <Section>
        <Container size="wide">
          <div className="flex items-baseline justify-between gap-6 border-b border-line pb-6">
            <h2 className="font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink">
              {page.allEyebrow}
            </h2>
            <p className="text-[0.8125rem] uppercase tracking-[0.14em] text-muted">
              {posts.length} pieces
            </p>
          </div>

          <div className="mt-14 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 110} className="h-full">
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <GuideCTA content={home.guideCta} />

      <FinalCTA
        content={home.finalCta}
        title="Reading only gets you so far."
        lede="Everything here is genuinely useful and none of it is a substitute for someone asking you the question you keep dodging."
      />
    </>
  );
}
