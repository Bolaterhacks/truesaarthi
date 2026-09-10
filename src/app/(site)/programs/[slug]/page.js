import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Check, Clock, Sparkles, Target } from 'lucide-react';

import {
  getHomeContent,
  getProgram,
  getPrograms,
  getSite,
  getTestimonials,
} from '@/lib/content';
import {
  pageMetadata,
  graph,
  serviceSchema,
  breadcrumbSchema,
  shouldIndex,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import GradientBlob from '@/components/ui/GradientBlob';
import JsonLd from '@/components/ui/JsonLd';
import TestimonialCard from '@/components/cards/TestimonialCard';
import FinalCTA from '@/components/home/FinalCTA';

export async function generateStaticParams() {
  const programs = await getPrograms();
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [site, program] = await Promise.all([getSite(), getProgram(slug)]);

  if (!program) return {};

  return pageMetadata(site, {
    title: `${program.title} — ${program.duration}`,
    description: program.excerpt,
    path: `/programs/${program.slug}`,
    image: program.image?.src,
    noindex: !shouldIndex(program),
  });
}

export default async function ProgramDetailPage({ params }) {
  const { slug } = await params;
  const [site, programs, testimonials, home] = await Promise.all([
    getSite(),
    getPrograms(),
    getTestimonials(),
    getHomeContent(),
  ]);

  const program = programs.find((item) => item.slug === slug);
  if (!program) notFound();

  const others = programs.filter((item) => item.slug !== program.slug);
  const quote = testimonials.find((item) => item.program === program.title);

  return (
    <>
      <JsonLd
        data={graph(
          serviceSchema(site, program),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Programs', href: '/programs' },
            { name: program.title, href: `/programs/${program.slug}` },
          ])
        )}
      />

      {/* ------------------------------------------------------ masthead */}
      <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-44">
        <GradientBlob
          tone="lavender"
          size={560}
          blur={110}
          drift
          className="-left-32 -top-28 opacity-80"
        />

        <Container size="wide">
          <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
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
                        href="/programs"
                        className="link-underline transition-colors hover:text-ink"
                      >
                        Programs
                      </Link>
                    </li>
                    <li aria-hidden="true" className="text-line">
                      /
                    </li>
                    <li aria-current="page" className="text-ink">
                      {program.title}
                    </li>
                  </ol>
                </nav>
              </Reveal>

              <Reveal
                variant="fade"
                delay={60}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <span className="grad-primary rounded-full px-3.5 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white">
                  Program {program.index}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-[0.75rem] text-muted">
                  <Clock className="size-3" aria-hidden="true" />
                  {program.duration}
                </span>
              </Reveal>

              <Reveal as="h1" delay={120} className="text-display mt-7 text-ink">
                {program.title}
              </Reveal>

              <Reveal
                as="p"
                delay={190}
                className="measure-wide mt-7 text-[1.0625rem] leading-relaxed text-muted"
              >
                {program.summary}
              </Reveal>

              <Reveal
                delay={260}
                className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="grad-text font-display text-[3rem] leading-none">
                    {program.priceLabel}
                  </span>
                  <span className="text-[0.8125rem] text-muted">
                    {program.priceNote}
                  </span>
                </div>
                <Button href="/contact" size="lg">
                  Book {program.title}
                </Button>
              </Reveal>

              <Reveal delay={320} className="mt-6 text-[0.8125rem] text-muted">
                {program.format} · Free 30-minute call first, always.
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal variant="scale" className="relative">
                <div className="mask-arch relative aspect-[4/5] overflow-hidden bg-lavender">
                  <Image
                    src={program.image.src}
                    alt={program.image.alt}
                    fill
                    preload
                    sizes="(max-width: 1024px) 88vw, 38vw"
                    className="object-cover object-center"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="grad-primary absolute -left-5 bottom-16 size-16 rounded-full opacity-75 blur-[3px]"
                />
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------- the detail */}
      <Section className="bg-lavender/40">
        <Container size="wide">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Target className="size-4 text-primary" aria-hidden="true" />
                <h2 className="eyebrow text-ink">Who it is for</h2>
              </div>
              <ul className="mt-7 space-y-4">
                {(program.forWho ?? []).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[1.0625rem] leading-snug text-ink"
                  >
                    <span
                      aria-hidden="true"
                      className="grad-primary mt-2.5 h-px w-5 shrink-0"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={100} className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-primary" aria-hidden="true" />
                <h2 className="eyebrow text-ink">What is included</h2>
              </div>
              <ul className="mt-7 space-y-4">
                {(program.includes ?? []).map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-muted"
                  >
                    <Check
                      className="mt-[3px] size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200} className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <Sparkles className="size-4 text-primary" aria-hidden="true" />
                <h2 className="eyebrow text-ink">What you leave with</h2>
              </div>
              <ul className="mt-7 space-y-4">
                {(program.outcomes ?? []).map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl border border-line bg-white px-5 py-4 text-[0.9375rem] leading-relaxed text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* ------------------------------------------------------- quote */}
      {quote ? (
        <Section rhythm="tight">
          <Container size="narrow">
            <Reveal className="mx-auto max-w-2xl">
              <TestimonialCard testimonial={quote} />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ------------------------------------------------ other programs */}
      <Section rhythm="tight">
        <Container size="wide">
          <h2 className="text-title text-ink">Other ways in</h2>

          <ul className="mt-10 border-t border-line">
            {others.map((other, i) => (
              <Reveal
                as="li"
                key={other.slug}
                delay={i * 90}
                className="border-b border-line"
              >
                <Link
                  href={`/programs/${other.slug}`}
                  className="group/other flex flex-wrap items-center justify-between gap-6 py-8"
                >
                  <div className="min-w-0">
                    <h3 className="font-display text-[1.75rem] leading-none tracking-[-0.02em] text-ink transition-transform duration-[600ms] ease-editorial group-hover/other:translate-x-2 sm:text-[2.25rem]">
                      {other.title}
                    </h3>
                    <p className="measure mt-3 text-[0.9375rem] text-muted">
                      {other.excerpt}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-display text-[1.75rem] leading-none text-ink">
                      {other.priceLabel}
                    </span>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-500 ease-editorial group-hover/other:-translate-y-1 group-hover/other:translate-x-1 group-hover/other:border-transparent group-hover/other:bg-ink group-hover/other:text-white">
                      <ArrowUpRight className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <FinalCTA
        content={home.finalCta}
        title="Ready when you are."
        lede={`${program.title} starts with the same free half hour as everything else. Book it, and we will decide together whether this is the right shape.`}
      />
    </>
  );
}
