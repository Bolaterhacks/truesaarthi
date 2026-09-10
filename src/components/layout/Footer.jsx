import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import Container from '@/components/ui/Container';
import Logo from './Logo';
import SocialIcon from '@/components/ui/SocialIcon';

const FooterLink = ({ href, children }) => (
  <li>
    <Link
      href={href}
      className="link-underline text-[0.9375rem] text-muted transition-colors duration-300 hover:text-ink"
    >
      {children}
    </Link>
  </li>
);

export default function Footer({ site, logo, programs = [] }) {
  const year = new Date().getFullYear();
  // The footer column mirrors the main menu minus Home, which the logo covers.
  const pages = (site?.navLinks ?? []).filter((link) => link.href !== '/');
  const socials = site?.socials ?? [];

  return (
    <footer className="relative isolate overflow-hidden border-t border-line bg-lavender/45">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 -top-32 -z-10 size-[420px] rounded-full opacity-60 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(109,74,255,0.24), transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-0 -z-10 size-[420px] rounded-full opacity-60 blur-[100px]"
        style={{
          background:
            'radial-gradient(circle at 40% 40%, rgba(125,216,247,0.28), transparent 70%)',
        }}
      />

      <Container size="wide" className="py-20 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Logo site={site} logo={logo} />
            <p className="measure mt-7 text-[0.9375rem] leading-relaxed text-muted">
              {site.description}
            </p>
            <p className="mt-6 text-[0.8125rem] text-muted/80">
              {site.coach.credential}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-8 lg:pl-10">
            <div>
              <h2 className="eyebrow text-ink">Pages</h2>
              <ul className="mt-6 space-y-3.5">
                {pages.map((page) => (
                  <FooterLink key={page.href} href={page.href}>
                    {page.label}
                  </FooterLink>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="eyebrow text-ink">Programs</h2>
              <ul className="mt-6 space-y-3.5">
                {programs.map((program, i) => (
                  <FooterLink
                    key={program.slug || i}
                    href={`/programs/${program.slug}`}
                  >
                    {program.title}
                  </FooterLink>
                ))}
                <FooterLink href="/events">Workshops & Retreats</FooterLink>
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h2 className="eyebrow text-ink">Contact</h2>
              <ul className="mt-6 space-y-3.5 text-[0.9375rem] text-muted">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-underline inline-flex items-start gap-2.5 transition-colors duration-300 hover:text-ink"
                  >
                    <Mail
                      className="mt-1 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {site.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${site.phoneHref}`}
                    className="link-underline inline-flex items-start gap-2.5 transition-colors duration-300 hover:text-ink"
                  >
                    <Phone
                      className="mt-1 size-3.5 shrink-0"
                      aria-hidden="true"
                    />
                    {site.phone}
                  </a>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-1 size-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region}{' '}
                    {site.address.postalCode}
                  </span>
                </li>
              </ul>

              <div className="mt-7 flex gap-2.5">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${site.name} on ${social.label}`}
                    className="grid size-10 place-items-center rounded-full border border-line bg-white/60 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                  >
                    <SocialIcon name={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-5 border-t border-line pt-8 text-[0.8125rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <div className="flex gap-7">
            <Link
              href="/privacy"
              className="link-underline transition-colors duration-300 hover:text-ink"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="link-underline transition-colors duration-300 hover:text-ink"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
