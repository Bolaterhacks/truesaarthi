import { unstable_cache } from 'next/cache';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { dateParts, longDate } from '@/lib/text';
import { DEFAULTS, normalisePath, seedId } from '@/content';

/** Every read is tagged with this, so one `revalidateTag` clears the site. */
export const CONTENT_TAG = 'truesaarthi-content';

const isPlainObject = (value) =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value);

/**
 * Overlay Firestore data on top of the defaults.
 *
 * Arrays are replaced wholesale rather than merged — an editor who deletes the
 * fourth philosophy row means to have three, not to fall back to the seeded
 * fourth. Objects recurse, so a field added to the defaults later still
 * appears on a document that was seeded before it existed.
 */
export function mergeDefaults(base, override) {
  if (override === undefined || override === null) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return override;

  const out = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] = key in base ? mergeDefaults(base[key], value) : value;
  }
  return out;
}

/** Firestore Timestamps and nested maps → plain, serialisable JSON. */
function plain(value) {
  if (value === null || value === undefined) return value;
  if (typeof value?.toDate === 'function') return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(plain);
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, plain(v)])
    );
  }
  return value;
}

/**
 * A cleared number field arrives as an empty string, so `order` is coerced
 * rather than trusted — `'' - 3` is NaN, which makes the whole sort erratic.
 */
const rank = (row) => {
  const value = Number(row?.order);
  return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
};

const byOrder = (a, b) => rank(a) - rank(b);

/* ------------------------------------------------------------------ reads */

async function readSingle(key) {
  const fallback = DEFAULTS.singles[key] ?? {};
  try {
    const snap = await getDoc(doc(db, 'settings', key));
    if (!snap.exists()) return fallback;
    return mergeDefaults(fallback, plain(snap.data()));
  } catch (error) {
    // A blank page is a worse outcome than slightly stale copy, so an
    // unreachable Firestore falls through to the seeded content.
    console.error(`[content] settings/${key} read failed:`, error.message);
    return fallback;
  }
}

/**
 * Collections whose seeded rows are always present, whether or not the
 * database has them.
 *
 * `page_tb` is the only one: the built-in pages have hand-written routes, so
 * `/about` exists whether or not a document does. Without this, adding the
 * first custom page would make every un-seeded built-in page vanish from the
 * admin list and the sitemap while still being served.
 *
 * Every other collection is purely stored data — unioning there would
 * resurrect a row the owner deliberately deleted.
 */
const UNION_WITH_SEEDS = new Set(['page_tb']);

async function readCollection(key) {
  const seeds = (DEFAULTS.collections[key] ?? []).map((row, i) => ({
    id: seedId(row, i),
    ...row,
  }));
  const fallback = seeds.slice().sort(byOrder);

  try {
    const snap = await getDocs(collection(db, key));
    if (snap.empty) return fallback;

    // Each stored row is merged over its seeded twin, matched by id — the same
    // protection singles already had. Without it a document holding only the
    // fields someone happened to save (a bare `order` from a reorder, say)
    // would shadow the defaults entirely and render an empty card.
    const byId = new Map(seeds.map((row) => [row.id, row]));

    const rows = snap.docs.map((d) => {
      const stored = { id: d.id, ...plain(d.data()) };
      const seed = byId.get(d.id);
      return seed ? mergeDefaults(seed, stored) : stored;
    });

    if (UNION_WITH_SEEDS.has(key)) {
      const storedIds = new Set(rows.map((row) => row.id));
      rows.push(...seeds.filter((seed) => !storedIds.has(seed.id)));
    }

    // Ordering happens here rather than in the query so a document that
    // predates the `order` field still renders instead of being dropped.
    return rows.sort(byOrder);
  } catch (error) {
    console.error(`[content] ${key} read failed:`, error.message);
    return fallback;
  }
}

/* ---------------------------------------------------------------- caching */

const cached = (key, reader) =>
  unstable_cache(reader, ['truesaarthi', key], {
    tags: [CONTENT_TAG],
    revalidate: 300,
  });

export const getSingle = (key) => cached(`single:${key}`, () => readSingle(key))();

export const getCollection = (key) =>
  cached(`collection:${key}`, () => readCollection(key))();

/* ------------------------------------------------------------- convenience */

export const getSite = () => getSingle('site');
export const getMedia = () => getSingle('media');
export const getPodcast = () => getSingle('podcast');

/** Published rows only — the admin panel sees everything, the site does not. */
export async function getPublished(key) {
  const rows = await getCollection(key);
  return rows.filter((row) => row.published !== false);
}

/* ----------------------------------------------------------------- pages */

/**
 * `meta.noindex` was the negative form of today's `meta.indexFollow`. A page
 * written before the rename still carries it, so it is folded into the positive
 * field here, on read — the robots tag, the sitemap and the checkbox in the
 * admin panel then all read one canonical value instead of disagreeing.
 *
 * The old field wins where both are present. It has to: the seeded default
 * supplies `indexFollow: true`, and were that allowed to outrank a stored
 * `noindex: true`, renaming the field would quietly put a page the owner had
 * deliberately hidden back into Google. `savePageAction` drops the old key the
 * next time the page is saved, which is what eventually ends the ambiguity.
 */
function withCanonicalRobots(row) {
  const meta = row?.meta;
  if (!meta || !('noindex' in meta)) return row;

  const { noindex, ...rest } = meta;
  return {
    ...row,
    meta: {
      ...rest,
      indexFollow: noindex === true ? false : meta.indexFollow ?? true,
    },
  };
}

/** Every row of `page_tb`, including unpublished ones. Admin panel only. */
export const getAllPages = async () =>
  (await getCollection('page_tb')).map(withCanonicalRobots);

/** Published pages, in menu order — used by the sitemap and the page list. */
export const getPages = async () =>
  (await getPublished('page_tb')).map(withCanonicalRobots);

/**
 * One page by URL.
 *
 * The stored document is merged over the seeded default for the same path, so
 * a page written before a template gained a field still renders that field
 * instead of a hole. A page the editor created has no default, which is fine —
 * the merge simply has nothing to add.
 *
 * Returns `null` for an unknown or unpublished path so the caller can 404.
 */
async function findPage(path) {
  const wanted = normalisePath(path);
  const rows = await getCollection('page_tb');
  const stored = rows.find((row) => normalisePath(row.path) === wanted);
  const fallback = DEFAULTS.collections.page_tb.find(
    (row) => normalisePath(row.path) === wanted
  );

  if (!stored) return fallback ? withCanonicalRobots(fallback) : null;
  return withCanonicalRobots(
    fallback ? mergeDefaults(fallback, stored) : stored
  );
}

export async function getPage(path) {
  const row = await findPage(path);
  return row?.published === false ? null : row;
}

/**
 * The same, but never null — built-in routes always have a seeded default, and
 * a template rendering `undefined.eyebrow` is a 500 nobody wants over a page
 * an editor merely unpublished by accident.
 *
 * Unpublished is deliberately not the same as absent here. A built-in route
 * renders whether or not its row says "live", so dropping to the seed would
 * throw away the title, description and robots setting the owner actually
 * typed — and a page they had marked noindex would go back to advertising
 * itself as indexable. The stored row is kept; only the `published` flag is
 * ignored, because this caller has already decided it is rendering.
 */
export async function getPageOrDefault(path) {
  const wanted = normalisePath(path);
  const seed = DEFAULTS.collections.page_tb.find(
    (row) => normalisePath(row.path) === wanted
  );
  return (
    (await findPage(wanted)) ??
    (seed ? withCanonicalRobots(seed) : null) ?? {
      path: wanted,
      meta: {},
      content: {},
      faqs: [],
    }
  );
}

/**
 * The home page's content block.
 *
 * The shared closing CTA and free-guide band appear on several routes, and all
 * of them take their copy from the home page rather than repeating it — so the
 * detail pages reach for this instead of loading the whole document.
 */
export async function getHomeContent() {
  const page = await getPageOrDefault('/');
  return page.content ?? {};
}

/**
 * Published rows with their `image` key already resolved to `{ src, alt }`.
 *
 * Hydrating here rather than in each component means the cards keep taking a
 * plain item and never need to know that media lives in its own document.
 */
async function getHydrated(key, transform) {
  const [rows, media] = await Promise.all([getPublished(key), getMedia()]);
  return rows.map((row) => {
    const item = {
      ...row,
      image: resolveImage(media, row.image, row.title ?? ''),
    };
    return transform ? transform(item) : item;
  });
}

export const getPrograms = () => getHydrated('programs');
export const getTestimonials = () => getPublished('testimonials');

/**
 * Articles, with the written date filled in from the machine one when the
 * editor left it blank — a new article otherwise renders an empty `<time>` on
 * its card and in its header.
 */
export const getPosts = () =>
  getHydrated('posts', (post) => ({
    ...post,
    dateLabel: post.dateLabel || longDate(post.date),
  }));

/** Events additionally carry the date parts their chip renders. */
export const getEvents = () =>
  getHydrated('events', (event) => ({ ...event, ...dateParts(event.iso) }));

export async function getProgram(slug) {
  const rows = await getPrograms();
  return rows.find((row) => row.slug === slug) ?? null;
}

export async function getPost(slug) {
  const rows = await getPosts();
  return rows.find((row) => row.slug === slug) ?? null;
}

/** The list sections, images resolved the same way. */
export const getTransformationAreas = () => getHydrated('transformationAreas');
export const getCoachingAreas = () => getPublished('coachingAreas');
export const getPhilosophy = () => getPublished('philosophy');
export const getEpisodes = () => getPublished('episodes');

/**
 * Resolves an image reference to `{ src, alt }`.
 *
 * Content documents store a *key* into `settings/media` rather than a URL, so
 * re-shooting the art direction is a one-document change. A value that already
 * looks like a URL or an absolute path is passed straight through, which is
 * what a Firebase Storage upload from the admin panel produces.
 */
/**
 * Never returns an empty `src`. An editor who clears an image field would
 * otherwise crash `next/image`, which refuses an empty source — the visible
 * placeholder is a far better failure than a 500 on the home page.
 */
export const IMAGE_PLACEHOLDER = '/placeholder.svg';

export function resolveImage(media, ref, fallbackAlt = '') {
  const out = (src, alt) => ({ src: src || IMAGE_PLACEHOLDER, alt: alt ?? '' });

  if (!ref) return out('', fallbackAlt);
  if (typeof ref === 'object') return out(ref.src, ref.alt ?? fallbackAlt);
  if (/^(https?:|\/|data:)/.test(ref)) return out(ref, fallbackAlt);

  const entry = media?.[ref];
  return out(entry?.src, entry?.alt ?? fallbackAlt);
}

/* ------------------------------------------------------------- messages */

/** Contact-form submissions, newest first. Admin panel only. */
export async function getMessages({ unreadOnly = false } = {}) {
  try {
    const ref = collection(db, 'messages');
    const snap = await getDocs(
      unreadOnly ? query(ref, where('read', '==', false)) : ref
    );
    return snap.docs
      .map((d) => ({ id: d.id, ...plain(d.data()) }))
      .sort((a, b) => String(b.createdAt ?? '').localeCompare(String(a.createdAt ?? '')));
  } catch (error) {
    console.error('[content] messages read failed:', error.message);
    return [];
  }
}
