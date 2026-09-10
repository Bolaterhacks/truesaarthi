import { site } from './site';
import { media } from './media';
import { programs } from './programs';
import { events } from './events';
import { posts } from './posts';
import { testimonials } from './testimonials';
import { pageTable } from './pageTable';
import {
  coachingAreas,
  episodes,
  philosophy,
  podcast,
  transformationAreas,
} from './lists';

/**
 * The complete default content set, keyed by the exact Firestore location it
 * seeds. It serves two jobs at once:
 *
 *   1. the payload the seed action writes on first run, and
 *   2. the fallback every reader deep-merges over, so a missing document, a
 *      newly added field or an unreachable Firestore never renders a blank
 *      page — the site degrades to these values instead.
 *
 * Singles live at `settings/<key>`; collections live at `<key>/<id>`.
 *
 * Page copy is *not* a single any more: every page is a row in `page_tb`
 * carrying its own meta, content and FAQs, so a page can be added from the
 * admin panel without a deploy.
 */
export const DEFAULTS = {
  singles: {
    site,
    media,
    podcast,
  },
  collections: {
    page_tb: pageTable,
    programs,
    events,
    posts,
    testimonials,
    transformationAreas,
    coachingAreas,
    philosophy,
    episodes,
  },
};

/**
 * A URL path to a Firestore document id.
 *
 * Firestore ids cannot contain `/`, so `/programs/detail` becomes
 * `programs-detail` and the site root becomes `home`. The `path` field stays
 * the authority on what the URL actually is — this is only the filing name.
 */
export function pathToId(path) {
  const clean = String(path ?? '')
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();

  if (!clean) return 'home';
  return clean.replace(/[^a-z0-9/-]+/g, '-').replace(/\//g, '-');
}

/** Normalises whatever an editor typed into a leading-slash path. */
export function normalisePath(path) {
  const clean = String(path ?? '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/^\/+|\/+$/g, '')
    .toLowerCase();

  return clean ? `/${clean}` : '/';
}

/** Firestore document id for a collection row, in seed order. */
export const seedId = (row, index) =>
  row.path
    ? pathToId(row.path)
    : (row.slug ?? row.id ?? String(index + 1).padStart(3, '0'));
