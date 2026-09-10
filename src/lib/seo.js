import { plainText } from '@/lib/text';

/**
 * Every schema builder takes the brand document rather than importing it, so
 * renaming the business or moving the domain in the admin panel flows straight
 * through canonical URLs, Open Graph tags and the JSON-LD graph.
 */

export const absoluteUrl = (site, path = '/') =>
  new URL(path, site?.url ?? 'https://truesaarthi.com').toString();

/**
 * The site's one robots directive.
 *
 * Hiding a page is a single decision, not two: `noindex` switches follow off in
 * the same move, so a hidden page reads `NOINDEX, NOFOLLOW` in an SEO inspector
 * rather than half-hiding itself and still bleeding link equity. Visible pages
 * emit the tag explicitly too — an auditor that finds no robots meta is left
 * guessing at the default.
 */
/**
 * Whether something opts into being indexed.
 *
 * The switch is stored positively — `indexFollow` — and is *on* unless someone
 * deliberately turns it off. That matters for more than readability: a page
 * written before the field existed has no value stored for it, and the safe
 * reading of "no value" is index, not hide. Only an explicit `false` hides a
 * page, so nothing falls out of Google because a document is simply old.
 *
 * `noindex` is the negative field this replaced. A page hidden under the old
 * name stays hidden, so the rename cannot quietly re-publish anything.
 */
export function shouldIndex(meta) {
  if (typeof meta?.indexFollow === 'boolean') return meta.indexFollow;
  return meta?.noindex !== true;
}

export function robotsTag(noindex = false) {
  if (noindex) {
    const hidden = { index: false, follow: false, noimageindex: true };
    return { ...hidden, nocache: true, googleBot: hidden };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}

/**
 * Builds a complete Metadata object for a page. Every page passes through here
 * so canonical URLs, OG and Twitter cards can never fall out of sync.
 */
export function pageMetadata(
  site,
  {
    title,
    description,
    path = '/',
    image,
    type = 'website',
    publishedTime,
    keywords,
    noindex = false,
  }
) {
  const url = absoluteUrl(site, path);
  const clean = plainText(title) || site?.name;
  const ogImage = image || `${site?.url ?? ''}/opengraph-image`;

  return {
    title: clean,
    description,
    // Next drops an empty array, so a page with no keywords set simply omits
    // the tag rather than emitting `keywords=""`.
    keywords: keywords?.length ? keywords : undefined,
    alternates: { canonical: url },
    robots: robotsTag(noindex),
    openGraph: {
      type,
      url,
      siteName: site?.name,
      title: clean,
      description,
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: clean }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: clean,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Metadata straight from a `page_tb` row.
 *
 * This is the only path built-in routes use, so the title, description,
 * keywords and social image an editor types in the SEO tab are exactly what
 * ships — with the brand description as the backstop when a field is left
 * blank rather than an empty tag.
 */
export function pageDocMetadata(site, page, { image } = {}) {
  const meta = page?.meta ?? {};

  return pageMetadata(site, {
    title: meta.title || page?.label || site?.name,
    description: meta.description || site?.description,
    path: page?.path ?? '/',
    keywords: meta.keywords,
    image,
    noindex: !shouldIndex(meta),
  });
}

const postalAddress = (site) => ({
  '@type': 'PostalAddress',
  streetAddress: site?.address?.street,
  addressLocality: site?.address?.locality,
  addressRegion: site?.address?.region,
  postalCode: site?.address?.postalCode,
  addressCountry: site?.address?.country,
});

export const organizationSchema = (site) => ({
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#organization`,
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  description: site.description,
  email: site.email,
  telephone: site.phone,
  foundingDate: site.founded,
  priceRange: '$$',
  address: postalAddress(site),
  areaServed: 'Worldwide',
  sameAs: (site.socials ?? []).map((s) => s.href),
  founder: { '@id': `${site.url}/#coach` },
});

export const websiteSchema = (site) => ({
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { '@id': `${site.url}/#organization` },
  inLanguage: 'en-IN',
});

export const personSchema = (site) => ({
  '@type': 'Person',
  '@id': `${site.url}/#coach`,
  name: site.coach?.name,
  jobTitle: site.coach?.role,
  description: `${site.coach?.role} and founder of ${site.legalName}. ${site.coach?.credential}.`,
  url: absoluteUrl(site, '/about'),
  email: site.email,
  telephone: site.phone,
  worksFor: { '@id': `${site.url}/#organization` },
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'Professional Certification',
    name: site.coach?.credential,
  },
  knowsAbout: [
    'Life coaching',
    'Leadership coaching',
    'Career transition',
    'Confidence building',
    'Work-life balance',
  ],
});

export const serviceSchema = (site, program) => ({
  '@type': 'Service',
  '@id': `${site.url}/programs/${program.slug}#service`,
  name: program.title,
  serviceType: 'Life coaching programme',
  description: program.excerpt,
  url: absoluteUrl(site, `/programs/${program.slug}`),
  provider: { '@id': `${site.url}/#organization` },
  areaServed: 'Worldwide',
  offers: {
    '@type': 'Offer',
    price: String(program.price ?? ''),
    priceCurrency: site.currency ?? 'INR',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl(site, `/programs/${program.slug}`),
  },
});

export const eventSchema = (site, event, image) => ({
  '@type': 'Event',
  '@id': `${site.url}/events#${event.slug}`,
  name: event.title,
  description: event.excerpt,
  startDate: event.iso,
  endDate: event.endIso,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode:
    event.attendanceMode === 'online'
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
  location:
    event.attendanceMode === 'online'
      ? { '@type': 'VirtualLocation', url: absoluteUrl(site, '/events') }
      : {
          '@type': 'Place',
          name: event.locationDetail,
          address: postalAddress(site),
        },
  organizer: { '@id': `${site.url}/#organization` },
  performer: { '@id': `${site.url}/#coach` },
  ...(image ? { image } : {}),
  offers: {
    '@type': 'Offer',
    price:
      event.price === 'Free' ? '0' : String(event.price ?? '').replace(/[^0-9.]/g, ''),
    priceCurrency: site.currency ?? 'INR',
    availability: 'https://schema.org/InStock',
    url: absoluteUrl(site, '/events'),
  },
});

export const articleSchema = (site, post, image) => ({
  '@type': 'Article',
  '@id': `${site.url}/blog/${post.slug}#article`,
  headline: post.title,
  description: post.excerpt,
  ...(image ? { image } : {}),
  datePublished: post.date,
  dateModified: post.updatedAt ?? post.date,
  articleSection: post.category,
  author: { '@id': `${site.url}/#coach` },
  publisher: { '@id': `${site.url}/#organization` },
  mainEntityOfPage: absoluteUrl(site, `/blog/${post.slug}`),
  inLanguage: 'en-IN',
});

export const faqSchema = (faqs) => {
  const questions = (faqs ?? []).filter((faq) => faq?.q && faq?.a);
  if (!questions.length) return null;

  return {
    '@type': 'FAQPage',
    mainEntity: questions.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };
};

export const breadcrumbSchema = (site, crumbs) => ({
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: crumb.name,
    item: absoluteUrl(site, crumb.href),
  })),
});

/** Wraps any set of nodes into a single @graph document. */
export const graph = (...nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.flat().filter(Boolean),
});
