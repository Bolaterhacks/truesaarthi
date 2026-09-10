import Link from 'next/link';
import Container from '@/components/ui/Container';
import Reveal from '@/components/ui/Reveal';
import GradientBlob from '@/components/ui/GradientBlob';
import { HeadlineText } from '@/components/ui/Headline';

/**
 * The masthead every inner page opens with. Keeps the H1, breadcrumb and
 * top spacing consistent across routes.
 *
 * `title` accepts either a node or a string from the database — a string runs
 * through the *asterisk* / newline convention the rest of the site uses.
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
  align = 'left',
}) {
  const centered = align === 'center';

  return (
    <section className="relative isolate overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-20 lg:pt-44">
      <GradientBlob
        tone="lavender"
        size={560}
        blur={110}
        drift
        className="-left-32 -top-28 opacity-80"
      />
      <GradientBlob
        tone="pink"
        size={420}
        blur={110}
        className="-right-24 top-8 opacity-55"
      />

      <Container size="wide">
        <div className={centered ? 'mx-auto max-w-3xl text-center' : ''}>
          {crumbs.length ? (
            <Reveal variant="fade">
              <nav aria-label="Breadcrumb">
                <ol
                  className={`flex flex-wrap items-center gap-2 text-[0.75rem] uppercase tracking-[0.14em] text-muted ${
                    centered ? 'justify-center' : ''
                  }`}
                >
                  {crumbs.map((crumb, i) => (
                    <li key={crumb.href} className="flex items-center gap-2">
                      {i > 0 ? (
                        <span aria-hidden="true" className="text-line">
                          /
                        </span>
                      ) : null}
                      {i === crumbs.length - 1 ? (
                        <span aria-current="page" className="text-ink">
                          {crumb.name}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="link-underline transition-colors duration-300 hover:text-ink"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </Reveal>
          ) : null}

          {eyebrow ? (
            <Reveal
              variant="fade"
              delay={60}
              className={`eyebrow mt-8 flex items-center gap-3 ${
                centered ? 'justify-center' : ''
              }`}
            >
              {!centered ? (
                <span
                  aria-hidden="true"
                  className="grad-primary h-px w-8 shrink-0"
                />
              ) : null}
              {eyebrow}
            </Reveal>
          ) : null}

          <Reveal as="h1" delay={120} className="text-display mt-6 text-ink">
            {typeof title === 'string' ? <HeadlineText text={title} /> : title}
          </Reveal>

          {lede ? (
            <Reveal
              as="p"
              delay={200}
              className={`measure-wide mt-8 text-[1.0625rem] leading-relaxed text-muted ${
                centered ? 'mx-auto' : ''
              }`}
            >
              {lede}
            </Reveal>
          ) : null}

          {children ? (
            <Reveal delay={280} className="mt-10">
              {children}
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
