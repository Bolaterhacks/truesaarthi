import { getMedia, getPrograms, getSite, resolveImage } from '@/lib/content';
import {
  graph,
  organizationSchema,
  personSchema,
  robotsTag,
  websiteSchema,
} from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import RevealEngine from '@/components/ui/RevealEngine';
import Cursor from '@/components/ui/Cursor';
import JsonLd from '@/components/ui/JsonLd';

/**
 * Metadata is generated rather than exported as a constant because the brand
 * now lives in Firestore — a rename in the admin panel has to reach the title
 * template and the OG tags without a redeploy.
 */
export async function generateMetadata() {
  const site = await getSite();

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    applicationName: site.name,
    authors: [{ name: site.coach?.name, url: `${site.url}/about` }],
    creator: site.coach?.name,
    publisher: site.legalName,
    keywords: [
      'life coach',
      'life coaching',
      'leadership coaching',
      'career coaching',
      'confidence coaching',
      'work life balance',
      'personal development',
      site.name,
      site.coach?.name,
    ].filter(Boolean),
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      url: site.url,
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} — ${site.tagline}`,
      description: site.description,
    },
    robots: robotsTag(),
    formatDetection: { telephone: false },
  };
}

export default async function SiteLayout({ children }) {
  const [site, media, programs] = await Promise.all([
    getSite(),
    getMedia(),
    getPrograms(),
  ]);

  const logo = resolveImage(media, 'logo', site.name);

  return (
    <>
      <JsonLd
        data={graph(
          organizationSchema(site),
          websiteSchema(site),
          personSchema(site)
        )}
      />
      <Header site={site} logo={logo} />
      <main id="main">{children}</main>
      <Footer site={site} logo={logo} programs={programs} />
      <RevealEngine />
      <Cursor />
    </>
  );
}
