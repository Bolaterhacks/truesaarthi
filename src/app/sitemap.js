import { getPages, getPosts, getPrograms, getSite } from '@/lib/content';
import { shouldIndex } from '@/lib/seo';

/**
 * Built from `page_tb`, so a page an editor adds is in the sitemap the moment
 * it is published — and one they unpublish, or whose "Index, follow" switch
 * they turn off, drops out without anyone remembering to edit a list here.
 */
export default async function sitemap() {
  const [site, pages, programs, posts] = await Promise.all([
    getSite(),
    getPages(),
    getPrograms(),
    getPosts(),
  ]);

  const url = (path) => new URL(path, site.url).toString();
  const now = new Date();

  // How often each URL is worth re-crawling. Anything not listed gets the
  // middle-of-the-road default rather than being left out.
  const cadence = {
    '/': ['monthly', 1],
    '/programs': ['monthly', 0.9],
    '/about': ['yearly', 0.8],
    '/events': ['weekly', 0.8],
    '/pricing': ['monthly', 0.8],
    '/blog': ['weekly', 0.7],
    '/contact': ['yearly', 0.7],
    '/privacy': ['yearly', 0.2],
    '/terms': ['yearly', 0.2],
  };

  const pageRoutes = pages
    .filter((page) => shouldIndex(page.meta))
    .map((page) => {
      const [changeFrequency, priority] = cadence[page.path] ?? ['monthly', 0.6];
      return {
        url: url(page.path),
        lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
        changeFrequency,
        priority,
      };
    });

  // Articles and programs carry the same switch on the row itself rather than
  // under a `meta` key, so the sitemap and the robots tag always agree.
  const programRoutes = programs.filter(shouldIndex).map((program) => ({
    url: url(`/programs/${program.slug}`),
    lastModified: program.updatedAt ? new Date(program.updatedAt) : now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postRoutes = posts.filter(shouldIndex).map((post) => ({
    url: url(`/blog/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [...pageRoutes, ...programRoutes, ...postRoutes];
}
