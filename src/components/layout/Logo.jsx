import Image from 'next/image';
import Link from 'next/link';

/**
 * The wordmark. Falls back to the gradient monogram if no logo image is set,
 * so the header never renders empty while the owner is mid-upload.
 */
export default function Logo({
  site,
  logo,
  tone = 'dark',
  className = '',
  // Only the header's copy is worth preloading — the footer and the mobile
  // menu render the same tiny image further down or behind an overlay.
  preload = false,
}) {
  const text = tone === 'light' ? 'text-white' : 'text-ink';
  const sub = tone === 'light' ? 'text-white/55' : 'text-muted';
  const name = site?.name ?? 'Truesaarthi';

  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={`group/logo inline-flex items-center gap-3 ${className}`}
    >
      {/* The wordmark is a wide image (~2.7:1), so its box tracks that ratio
          instead of a square — a square crop left it looking half-size. */}
      {logo?.src ? (
        <span className="relative block h-10 w-[110px] shrink-0 transition-transform duration-500 ease-editorial group-hover/logo:scale-105 sm:h-12 sm:w-[132px]">
          <Image
            src={logo.src}
            alt=""
            fill
            sizes="132px"
            className="object-contain object-left"
            preload={preload}
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="grad-tri relative grid size-9 shrink-0 place-items-center rounded-[13px] transition-transform duration-500 ease-editorial group-hover/logo:rotate-[8deg]"
        >
          <span className="size-[9px] rounded-full bg-white/95" />
        </span>
      )}

      {/* <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.35rem] tracking-[-0.02em] ${text}`}
        >
          {name}
        </span>
        <span
          className={`mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.24em] ${sub}`}
        >
          {site?.tagline ?? 'Life Coaching'}
        </span>
      </span> */}
    </Link>
  );
}
