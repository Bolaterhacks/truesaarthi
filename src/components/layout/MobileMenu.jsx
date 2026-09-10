'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { X, Mail, Phone } from 'lucide-react';
import Logo from './Logo';
import SocialIcon from '@/components/ui/SocialIcon';

export default function MobileMenu({ open, onClose, pathname, site, logo }) {
  const navLinks = site?.navLinks ?? [];
  const socials = site?.socials ?? [];
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  // Lock the page behind the overlay without the layout shift that comes
  // from simply setting overflow: hidden on a scrollbar-bearing document.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    body.style.overflow = 'hidden';
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    return () => {
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
    };
  }, [open]);

  // Escape to dismiss, and keep Tab inside the panel while it is open.
  useEffect(() => {
    if (!open) return;

    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      );
      if (!focusables?.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      inert={!open}
      /* The whole overlay fades as one unit. Fading only the backdrop left
         the close button painted over the header's hamburger while shut. */
      className={`fixed inset-0 z-[70] transition-opacity duration-500 ease-editorial lg:hidden ${
        open
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-canvas">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            className="absolute -right-24 -top-24 size-[380px] rounded-full opacity-70 blur-[80px]"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(109,74,255,0.4), transparent 70%)',
            }}
          />
          <div
            className="absolute -bottom-28 -left-20 size-[340px] rounded-full opacity-70 blur-[80px]"
            style={{
              background:
                'radial-gradient(circle at 40% 40%, rgba(240,138,203,0.42), transparent 70%)',
            }}
          />
        </div>
      </div>

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between px-6 pt-5 sm:px-8">
          <div
            className={`transition-all duration-500 ${
              open ? 'opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <Logo site={site} logo={logo} />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-11 place-items-center rounded-full border border-line bg-white/70 text-ink transition-colors duration-300 hover:border-primary hover:text-primary"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-1 flex-col justify-center overflow-y-auto px-6 py-8 sm:px-8"
        >
          <ul className="space-y-1">
            {navLinks.map((link, i) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);

              return (
                <li
                  key={link.href}
                  className={`transition-all duration-[600ms] ease-editorial ${
                    open
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-6 opacity-0'
                  }`}
                  style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    aria-current={active ? 'page' : undefined}
                    className="group/item flex items-baseline gap-4 py-2.5"
                  >
                    <span className="w-6 shrink-0 text-[0.625rem] font-semibold tracking-[0.18em] text-muted">
                      0{i + 1}
                    </span>
                    <span
                      className={`font-display text-[2.35rem] leading-[1.08] tracking-[-0.03em] transition-colors duration-300 sm:text-[2.9rem] ${
                        active
                          ? 'grad-text'
                          : 'text-ink group-hover/item:text-primary'
                      }`}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`border-t border-line/70 px-6 py-6 transition-all duration-500 sm:px-8 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ transitionDelay: open ? '480ms' : '0ms' }}
        >
          <Link
            href="/contact"
            onClick={onClose}
            className="grad-primary flex w-full items-center justify-center rounded-xl px-6 py-4 text-[0.9375rem] font-semibold text-white"
          >
            Book a Session
          </Link>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1.5 text-sm">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-primary"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                {site.email}
              </a>
              <a
                href={`tel:${site.phoneHref}`}
                className="flex items-center gap-2 text-muted transition-colors hover:text-primary"
              >
                <Phone className="size-3.5" aria-hidden="true" />
                {site.phone}
              </a>
            </div>
            <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full border border-line text-muted transition-colors duration-300 hover:border-primary hover:text-primary"
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
