import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getHomeContent, getPosts, getSite } from '@/lib/content';
import {
  pageMetadata,
  graph,
  articleSchema,
  breadcrumbSchema,
  shouldIndex,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import JsonLd from '@/components/ui/JsonLd';
import GradientBlob from '@/components/ui/GradientBlob';
import BlogCard from '@/components/cards/BlogCard';
import GuideCTA from '@/components/home/GuideCTA';
import FinalCTA from '@/components/home/FinalCTA';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [site, posts] = await Promise.all([getSite(), getPosts()]);
  const post = posts.find((item) => item.slug === slug);

  if (!post) return {};

  return pageMetadata(site, {
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.image?.src,
    type: 'article',
    publishedTime: post.date,
    keywords: [post.category, 'life coaching', 'personal development'],
    noindex: !shouldIndex(post),
  });
}

/** Renders one typed content block. Keeps all article typography here. */
function Block({ block }) {
  switch (block.type) {
    case 'lead':
      return (
        <Reveal
          as="p"
          variant="fade"
          className="text-[1.25rem] leading-relaxed text-ink lg:text-[1.375rem]"
        >
          {block.text}
        </Reveal>
      );

    case 'h2':
      return (
        <Reveal
          as="h2"
          className="mt-14 text-[1.75rem] leading-tight text-ink lg:text-[2.125rem]"
        >
          {block.text}
        </Reveal>
      );

    case 'quote':
      return (
        <Reveal as="figure" className="my-12">
          <blockquote className="border-l-2 border-transparent pl-7 [border-image:linear-gradient(180deg,var(--color-primary),var(--color-pink))_1]">
            <p className="font-display text-[1.5rem] leading-snug tracking-[-0.02em] text-ink lg:text-[1.875rem]">
              {block.text}
            </p>
          </blockquote>
        </Reveal>
      );

    case 'list':
      return (
        <Reveal as="ul" className="mt-7 space-y-4">
          {block.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-4 text-[1.0625rem] leading-relaxed text-muted"
            >
              <span
                aria-hidden="true"
                className="grad-primary mt-3 h-px w-5 shrink-0"
              />
              {item}
            </li>
          ))}
        </Reveal>
      );

    default:
      return (
        <Reveal
          as="p"
          className="mt-6 text-[1.0625rem] leading-relaxed text-muted"
        >
          {block.text}
        </Reveal>
      );
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const [site, posts, home] = await Promise.all([
    getSite(),
    getPosts(),
    getHomeContent(),
  ]);

  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  // Same category first, then anything else, so the rail is never empty.
  const related = [
    ...posts.filter((p) => p.slug !== post.slug && p.category === post.category),
    ...posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ].slice(0, 3);

  return (
    <>
      <JsonLd
        data={graph(
          articleSchema(site, post, post.image?.src),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Journal', href: '/blog' },
            { name: post.title, href: `/blog/${post.slug}` },
          ])
        )}
      />

      <article>
        {/* ---------------------------------------------------- masthead */}
        <section className="relative isolate overflow-hidden pb-12 pt-32 sm:pt-36 lg:pt-44">
          <GradientBlob
            tone="lavender"
            size={520}
            blur={110}
            drift
            className="-left-32 -top-24 opacity-75"
          />

          <Container size="narrow">
            <Reveal variant="fade">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.14em] text-muted">
                  <li>
                    <Link
                      href="/"
                      className="link-underline transition-colors hover:text-ink"
                    >
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-line">
                    /
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="link-underline transition-colors hover:text-ink"
                    >
                      Journal
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-line">
                    /
                  </li>
                  <li aria-current="page" className="text-ink">
                    {post.category}
                  </li>
                </ol>
              </nav>
            </Reveal>

            <Reveal
              variant="fade"
              delay={60}
              className="mt-8 flex flex-wrap items-center gap-4 text-[0.75rem] uppercase tracking-[0.14em] text-muted"
            >
              <span className="grad-primary rounded-full px-3.5 py-1.5 text-[0.625rem] font-semibold tracking-[0.16em] text-white">
                {post.category}
              </span>
              <time dateTime={post.date}>{post.dateLabel}</time>
              <span aria-hidden="true" className="h-px w-5 bg-line" />
              <span>{post.readingTime}</span>
            </Reveal>

            <Reveal as="h1" delay={120} className="text-title mt-7 text-ink">
              {post.title}
            </Reveal>

            <Reveal
              delay={200}
              className="mt-9 flex items-center gap-4 border-t border-line pt-7"
            >
              <span
                aria-hidden="true"
                className="grad-primary grid size-11 shrink-0 place-items-center rounded-full text-[0.8125rem] font-semibold text-white"
              >
                {(site.coach?.name ?? '')
                  .split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
              <span>
                <span className="block text-[0.9375rem] font-semibold text-ink">
                  {site.coach?.name}
                </span>
                <span className="block text-[0.8125rem] text-muted">
                  {site.coach?.role}
                </span>
              </span>
            </Reveal>
          </Container>
        </section>

        {/* ------------------------------------------------------- image */}
        <Container size="wide">
          <Reveal variant="scale">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[28px] bg-lavender lg:aspect-[16/7] lg:rounded-[36px]">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                fill
                preload
                sizes="(max-width: 1560px) 92vw, 1440px"
                className="object-cover object-center"
              />
            </div>
          </Reveal>
        </Container>

        {/* ------------------------------------------------------- body */}
        <Section>
          <Container size="narrow">
            <div className="mx-auto max-w-[680px]">
              {(post.body ?? []).map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>

            <Reveal className="mx-auto mt-16 max-w-[680px] border-t border-line pt-8">
              <p className="text-[0.9375rem] text-muted">
                Written by{' '}
                <Link
                  href="/about"
                  className="link-underline font-semibold text-ink"
                >
                  {site.coach?.name}
                </Link>
                . If this landed, the{' '}
                <Link
                  href="/programs"
                  className="link-underline font-semibold text-ink"
                >
                  coaching programs
                </Link>{' '}
                are where it gets applied to your specific situation.
              </p>
            </Reveal>
          </Container>
        </Section>
      </article>

      <GuideCTA content={home.guideCta} />

      {/* ----------------------------------------------------- related */}
      <Section>
        <Container size="wide">
          <div className="flex items-baseline justify-between gap-6 border-b border-line pb-6">
            <h2 className="font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink">
              Keep reading
            </h2>
            <Link
              href="/blog"
              className="link-underline text-[0.8125rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
            >
              All articles
            </Link>
          </div>

          <div className="mt-14 grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item, i) => (
              <Reveal key={item.slug} delay={i * 110} className="h-full">
                <BlogCard post={item} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <FinalCTA content={home.finalCta} />
    </>
  );
}
