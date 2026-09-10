import { getSite } from '@/lib/content';

export default async function robots() {
  const site = await getSite();

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // The admin panel is behind a password, but keeping it out of the index
      // means the login screen never shows up in a search result either.
      { userAgent: '*', disallow: '/admin' },
    ],
    sitemap: new URL('/sitemap.xml', site.url).toString(),
    host: site.url,
  };
}
