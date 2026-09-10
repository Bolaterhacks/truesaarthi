import Image from 'next/image';
import { Play, Headphones } from 'lucide-react';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { HeadlineText } from '@/components/ui/Headline';

export default function Podcast({ content: podcast, episodes = [], image }) {
  return (
    <Section rhythm="loose" className="bg-ink text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-0 -z-10 size-[520px] rounded-full opacity-60 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(109,74,255,0.55), transparent 68%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 right-0 -z-10 size-[440px] rounded-full opacity-50 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(240,138,203,0.5), transparent 68%)',
        }}
      />

      <Container size="wide">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          {/* --------------------------------------------------- image */}
          <div className="lg:col-span-5">
            <Reveal variant="scale" className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] bg-white/5">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1024px) 88vw, 38vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-tr from-ink/70 via-ink/10 to-transparent"
                />
                <span className="absolute bottom-5 left-5 inline-flex items-center gap-2.5 rounded-full bg-white/12 px-4 py-2 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                  <Headphones className="size-3.5" aria-hidden="true" />
                  {podcast.name}
                </span>
              </div>

              <span
                aria-hidden="true"
                className="grad-primary absolute -right-4 -top-5 size-20 rounded-full opacity-80 blur-[4px]"
              />
            </Reveal>
          </div>

          {/* ---------------------------------------------------- copy */}
          <div className="lg:col-span-7 lg:pl-6">
            <Reveal
              variant="fade"
              className="eyebrow flex items-center gap-3 text-white/55"
            >
              <span
                aria-hidden="true"
                className="grad-primary h-px w-8 shrink-0"
              />
              {podcast.eyebrow}
            </Reveal>

            <Reveal as="h2" delay={80} className="text-title mt-7 text-white">
              <HeadlineText text={podcast.title} />
            </Reveal>

            <Reveal
              as="p"
              delay={150}
              className="measure-wide mt-7 text-[1.0625rem] leading-relaxed text-white/65"
            >
              {podcast.description}
            </Reveal>

            <Reveal delay={220} className="mt-10">
              <Button href={podcast.href} variant="ghost">
                {podcast.ctaLabel}
              </Button>
            </Reveal>

            <ul className="mt-12 border-t border-white/12">
              {episodes.map((episode, i) => (
                <Reveal
                  as="li"
                  key={episode.id}
                  delay={280 + i * 80}
                  className="border-b border-white/12"
                >
                  <a
                    href={episode.href || podcast.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group/ep flex items-center gap-5 py-5"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 text-white transition-all duration-500 ease-editorial group-hover/ep:border-transparent group-hover/ep:bg-white group-hover/ep:text-ink">
                      <Play
                        className="size-3.5 translate-x-px fill-current"
                        strokeWidth={0}
                        aria-hidden="true"
                      />
                    </span>

                    <span className="shrink-0 text-[0.75rem] font-semibold tracking-[0.16em] text-white/45">
                      EP {episode.number}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[1.0625rem] text-white transition-transform duration-500 ease-editorial group-hover/ep:translate-x-1">
                        {episode.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.8125rem] text-white/50">
                        {episode.guest}
                      </span>
                    </span>

                    <span className="shrink-0 text-[0.8125rem] text-white/50">
                      {episode.duration}
                    </span>
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
