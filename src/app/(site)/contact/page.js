import Image from 'next/image';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

import {
  getMedia,
  getPageOrDefault,
  getPrograms,
  getSite,
  resolveImage,
} from '@/lib/content';
import {
  pageDocMetadata,
  graph,
  organizationSchema,
  breadcrumbSchema,
} from '@/lib/seo';

import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import GradientBlob from '@/components/ui/GradientBlob';
import JsonLd from '@/components/ui/JsonLd';
import SocialIcon from '@/components/ui/SocialIcon';
import PageHero from '@/components/shared/PageHero';
import ContactForm from '@/components/shared/ContactForm';

export async function generateMetadata() {
  const [site, doc] = await Promise.all([
    getSite(),
    getPageOrDefault('/contact'),
  ]);

  return pageDocMetadata(site, doc);
}

export default async function ContactPage() {
  const [site, media, doc, programs] = await Promise.all([
    getSite(),
    getMedia(),
    getPageOrDefault('/contact'),
    getPrograms(),
  ]);

  // The document carries meta and FAQs; the template renders its content.
  const page = doc.content ?? {};

  const studioDetail = resolveImage(media, 'studioDetail', site.name);

  const details = [
    {
      icon: Mail,
      label: 'Email',
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: site.phone,
      href: `tel:${site.phoneHref}`,
    },
    {
      icon: MapPin,
      label: 'Studio',
      value: `${site.address?.street}, ${site.address?.locality}`,
    },
    { icon: Clock, label: page.hoursLabel, value: page.hours },
  ];

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(site),
          breadcrumbSchema(site, [
            { name: 'Home', href: '/' },
            { name: 'Contact', href: '/contact' },
          ])
        )}
      />

      <PageHero
        eyebrow={page.eyebrow}
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
        title={page.title}
        lede={page.lede}
      />

      <Section rhythm="tight" className="pt-0">
        <GradientBlob
          tone="sky"
          size={480}
          blur={110}
          className="-right-32 top-20 opacity-55"
        />

        <Container size="wide">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            {/* ------------------------------------------------- form */}
            <div className="lg:col-span-7">
              <Reveal>
                <div className="rounded-[28px] border border-line bg-white p-7 sm:p-10 lg:p-12">
                  <h2 className="text-[1.75rem] leading-tight text-ink">
                    {page.formTitle}
                  </h2>
                  <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    {page.formLede}
                  </p>

                  <div className="mt-9">
                    <ContactForm programs={programs} content={page} />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* -------------------------------------------- sidebar */}
            <div className="lg:col-span-5">
              <Reveal variant="scale" delay={100}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-lavender">
                  <Image
                    src={studioDetail.src}
                    alt={studioDetail.alt}
                    fill
                    sizes="(max-width: 1024px) 88vw, 38vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={160}>
                <ul className="mt-10 space-y-1">
                  {details.map((detail) => {
                    const Icon = detail.icon;
                    const content = (
                      <>
                        <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line text-primary transition-colors duration-300 group-hover/detail:border-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="eyebrow block">{detail.label}</span>
                          <span className="mt-1.5 block text-[0.9375rem] leading-relaxed text-ink">
                            {detail.value}
                          </span>
                        </span>
                      </>
                    );

                    return (
                      <li key={detail.label}>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            className="group/detail flex items-start gap-4 border-b border-line py-5 transition-colors duration-300 hover:text-primary"
                          >
                            {content}
                          </a>
                        ) : (
                          <div className="group/detail flex items-start gap-4 border-b border-line py-5">
                            {content}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </Reveal>

              <Reveal delay={220} className="mt-9">
                <p className="eyebrow">Elsewhere</p>
                <div className="mt-4 flex gap-2.5">
                  {(site.socials ?? []).map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${site.name} on ${social.label}`}
                      className="grid size-11 place-items-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                    >
                      <SocialIcon name={social.icon} />
                    </a>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={280}>
                <div className="grad-soft mt-10 rounded-[24px] border border-line p-7">
                  <p className="font-display text-[1.375rem] leading-snug text-ink">
                    Not ready to book?
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
                    That is completely fine. Read a few pieces in the journal
                    first, or come to a workshop — most people take a while, and
                    the ones who take a while tend to do the best work.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
