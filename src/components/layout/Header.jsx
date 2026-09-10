'use client';

import { useCallback, useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import MobileMenu from './MobileMenu';

export default function Header({ site, logo }) {
  const navLinks = site?.navLinks ?? [];
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // A single passive listener flipping one boolean — the class change itself
  // is what animates, so scrolling never runs layout work.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the overlay whenever the route changes — including back/forward,
  // which never fires the links' own onClick. Adjusting state during render
  // rather than in an effect avoids a second paint with the menu still open.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (menuOpen) setMenuOpen(false);
  }

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-[background-color,border-color,backdrop-filter,box-shadow] duration-500 ease-editorial ${
          scrolled
            ? 'border-b border-line/80 bg-canvas/80 shadow-[0_1px_24px_-16px_rgba(23,21,37,0.4)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <Container
          size="wide"
          className={`flex items-center justify-between transition-[padding] duration-500 ease-editorial ${
            scrolled ? 'py-3.5' : 'py-5 lg:py-7'
          }`}
        >
          <Logo site={site} logo={logo} preload />

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const active =
                  link.href === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      className={`group/nav relative block px-3.5 py-2 text-[0.9375rem] font-medium transition-colors duration-300 ${
                        active
                          ? 'text-ink'
                          : 'text-muted hover:text-ink'
                      }`}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={`grad-primary absolute inset-x-3.5 bottom-1 h-px origin-left transition-transform duration-500 ease-editorial ${
                          active
                            ? 'scale-x-100'
                            : 'scale-x-0 group-hover/nav:scale-x-100'
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/contact"
              className="grad-primary group/cta hidden items-center gap-2 rounded-xl bg-[length:200%_100%] bg-[position:0%_0%] px-6 py-3.5 text-[0.875rem] font-semibold text-white shadow-[0_10px_28px_-14px_rgba(109,74,255,0.7)] transition-all duration-500 ease-editorial hover:-translate-y-0.5 hover:bg-[position:100%_0%] sm:inline-flex"
            >
              Book a Session
              <span
                aria-hidden="true"
                className="transition-transform duration-500 ease-editorial group-hover/cta:translate-x-1"
              >
                →
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="grid size-11 place-items-center rounded-full border border-line bg-white/60 text-ink backdrop-blur-sm transition-colors duration-300 hover:border-primary hover:text-primary lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        pathname={pathname}
        site={site}
        logo={logo}
      />
    </>
  );
}
