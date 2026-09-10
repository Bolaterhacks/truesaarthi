import Reveal from './Reveal';

/**
 * The section header pattern used site-wide: micro-label, display heading,
 * optional lede — with an optional right-hand slot for asymmetric layouts.
 */
export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'left',
  size = 'display',
  as: Tag = 'h2',
  aside,
  className = '',
}) {
  const centered = align === 'center';
  const titleSize = size === 'title' ? 'text-title' : 'text-display';

  return (
    <div
      className={`${
        aside
          ? 'grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-16'
          : centered
            ? 'flex flex-col items-center text-center'
            : ''
      } ${className}`}
    >
      <div className={aside ? 'lg:col-span-7' : centered ? 'max-w-3xl' : ''}>
        {eyebrow ? (
          <Reveal
            variant="fade"
            /* The Reveal is a full-width flex row inside the centred column,
               so text-center alone leaves the label hanging on the left. */
            className={`eyebrow flex items-center gap-3 ${
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

        <Reveal
          as={Tag}
          delay={80}
          className={`${titleSize} mt-5 text-ink`}
        >
          {title}
        </Reveal>

        {lede && !aside ? (
          <Reveal
            as="p"
            delay={160}
            className={`measure-wide mt-7 text-[1.0625rem] leading-relaxed text-muted ${
              centered ? 'mx-auto' : ''
            }`}
          >
            {lede}
          </Reveal>
        ) : null}
      </div>

      {aside ? (
        <Reveal delay={160} className="lg:col-span-5 lg:pb-2">
          {lede ? (
            <p className="measure text-[1.0625rem] leading-relaxed text-muted">
              {lede}
            </p>
          ) : null}
          {aside}
        </Reveal>
      ) : null}
    </div>
  );
}
