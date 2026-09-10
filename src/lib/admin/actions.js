'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import { CONTENT_TAG, mergeDefaults } from '@/lib/content';
import { DEFAULTS, normalisePath, pathToId, seedId } from '@/content';
import {
  createSession,
  destroySession,
  isAuthenticated,
  setAdminPassword,
  verifyPassword,
} from './auth';
import { PAGE_TEMPLATES, SECTIONS } from './schema';

/** Every write funnels through here, so no action can skip the auth check. */
async function requireAuth() {
  if (!(await isAuthenticated())) {
    throw new Error('Not signed in.');
  }
}

/**
 * Firestore rejects `undefined` outright, and a form always produces some:
 * a field the schema added but the document never had, an optional block the
 * editor left alone. Drop those keys rather than writing nulls, so the
 * defaults still show through on read.
 *
 * `id` goes too — it is the document's name, not one of its fields.
 */
function clean(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => item !== undefined).map(clean);
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key, item]) => item !== undefined && key !== 'id')
        .map(([key, item]) => [key, clean(item)])
    );
  }
  return value;
}

/**
 * Drop the cached content and repaint the public site.
 *
 * `revalidatePath('/', 'layout')` is deliberately broad: the header, footer and
 * SEO graph read brand data, so almost any edit can touch almost any page.
 */
function refresh() {
  revalidateTag(CONTENT_TAG);
  revalidatePath('/', 'layout');
}

/* ------------------------------------------------------------------ auth */

export async function loginAction(_prev, formData) {
  const password = String(formData.get('password') ?? '');
  if (!password) return { error: 'Enter your password.' };

  const result = await verifyPassword(password);

  if (!result.ok) {
    return {
      error:
        result.reason === 'unreachable'
          ? 'Could not reach the database. Check your connection and Firestore rules.'
          : 'That password is not right.',
    };
  }

  await createSession(result.record);
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}

export async function changePasswordAction(_prev, formData) {
  await requireAuth();

  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (next.length < 8) {
    return { error: 'Use at least 8 characters.' };
  }
  if (next !== confirm) {
    return { error: 'The two new passwords do not match.' };
  }

  const check = await verifyPassword(current);
  if (!check.ok) return { error: 'Your current password is not right.' };

  const record = await setAdminPassword(next);
  // The session is signed with the old hash, so it is now invalid — reissue it
  // rather than logging the owner out of the screen they are standing on.
  await createSession(record);

  return { success: 'Password changed.' };
}

/* -------------------------------------------------------------- content */

/** Save a singleton document (`settings/<key>`). */
export async function saveSingleAction(key, values) {
  await requireAuth();

  const section = SECTIONS[key];
  if (!section || (section.kind !== 'single' && section.kind !== 'media')) {
    return { error: `Unknown section "${key}".` };
  }

  try {
    await setDoc(
      doc(db, 'settings', key),
      { ...clean(values), updatedAt: new Date().toISOString() },
      { merge: true }
    );
    refresh();
    return { success: 'Saved.' };
  } catch (error) {
    return { error: `Could not save: ${error.message}` };
  }
}

/** Create or update one row of a collection. */
export async function saveItemAction(key, id, values) {
  await requireAuth();

  const section = SECTIONS[key];
  if (!section || section.kind !== 'collection') {
    return { error: `Unknown collection "${key}".` };
  }

  // The slug is the document id for slug-keyed collections, so renaming one
  // means writing a new document and removing the old — otherwise the URL and
  // the id silently drift apart.
  const idField = section.idField;
  const nextId = idField ? String(values[idField] ?? id).trim() : id;

  if (!nextId) return { error: 'An id or slug is required.' };

  try {
    await setDoc(
      doc(db, key, nextId),
      { ...clean(values), updatedAt: new Date().toISOString() },
      { merge: true }
    );

    if (nextId !== id && id) {
      await deleteDoc(doc(db, key, id));
    }

    refresh();
    return { success: 'Saved.', id: nextId };
  } catch (error) {
    return { error: `Could not save: ${error.message}` };
  }
}

export async function deleteItemAction(key, id) {
  await requireAuth();

  try {
    await deleteDoc(doc(db, key, id));
    refresh();
    return { success: 'Deleted.' };
  } catch (error) {
    return { error: `Could not delete: ${error.message}` };
  }
}

/* ----------------------------------------------------------------- pages */

/**
 * Save one row of `page_tb`.
 *
 * A page is identified by its URL, and the document id is derived from it, so
 * changing the URL moves the document. That is deliberate: it keeps the id and
 * the address from drifting apart the way a free-form id would. The old
 * document is removed only after the new one is written, so an interrupted
 * save loses nothing.
 */
export async function savePageAction(id, values) {
  await requireAuth();

  const path = normalisePath(values?.path);
  const nextId = pathToId(path);

  if (!nextId) return { error: 'A URL is required.' };

  const template = values?.template;
  if (template && !PAGE_TEMPLATES[template]) {
    return { error: `Unknown template "${template}".` };
  }

  try {
    // Two pages on one URL would silently overwrite each other, so a clash
    // with a *different* document is refused rather than resolved.
    if (nextId !== id) {
      const clash = await getDoc(doc(db, 'page_tb', nextId));
      if (clash.exists()) {
        return { error: `Another page already uses ${path}.` };
      }
    }

    const payload = { ...clean(values), path, updatedAt: new Date().toISOString() };

    // `meta.noindex` is the field `meta.indexFollow` replaced. It is read as a
    // fallback, but a merge write would leave it sitting there for ever and it
    // outranks the new one — so re-checking the box on a page hidden under the
    // old name would not actually un-hide it. Saving is where it goes away.
    if (payload.meta) {
      payload.meta = { ...payload.meta, noindex: deleteField() };
    }

    await setDoc(doc(db, 'page_tb', nextId), payload, { merge: true });

    if (id && nextId !== id) {
      await deleteDoc(doc(db, 'page_tb', id));
    }

    refresh();
    return { success: 'Saved.', id: nextId, path };
  } catch (error) {
    return { error: `Could not save: ${error.message}` };
  }
}

export async function deletePageAction(id) {
  await requireAuth();

  try {
    await deleteDoc(doc(db, 'page_tb', id));
    refresh();
    return { success: 'Page deleted.' };
  } catch (error) {
    return { error: `Could not delete: ${error.message}` };
  }
}

/** Persist a drag-free reorder as explicit `order` numbers. */
export async function reorderAction(key, orderedIds) {
  await requireAuth();

  try {
    const batch = writeBatch(db);
    orderedIds.forEach((id, index) => {
      batch.set(doc(db, key, id), { order: index + 1 }, { merge: true });
    });
    await batch.commit();
    refresh();
    return { success: 'Order saved.' };
  } catch (error) {
    return { error: `Could not reorder: ${error.message}` };
  }
}

/* -------------------------------------------------------------- inbox */

export async function markMessageAction(id, read) {
  await requireAuth();
  try {
    await setDoc(doc(db, 'messages', id), { read }, { merge: true });
    revalidatePath('/admin/messages');
    return { success: 'Updated.' };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteMessageAction(id) {
  await requireAuth();
  try {
    await deleteDoc(doc(db, 'messages', id));
    revalidatePath('/admin/messages');
    return { success: 'Deleted.' };
  } catch (error) {
    return { error: error.message };
  }
}

/* --------------------------------------------------------------- seeding */

/**
 * Writes the shipped default content into Firestore.
 *
 * `overwrite: false` (the default) only fills in what is missing, so it is safe
 * to run against a live site to pick up newly added sections. `overwrite: true`
 * is the "reset everything" button and says so in the UI.
 */
export async function seedAction(overwrite = false) {
  await requireAuth();

  const stamp = new Date().toISOString();
  const written = { singles: 0, created: 0, repaired: 0, untouched: 0 };

  try {
    for (const [key, value] of Object.entries(DEFAULTS.singles)) {
      const ref = doc(db, 'settings', key);

      if (overwrite) {
        await setDoc(ref, { ...clean(value), updatedAt: stamp });
      } else {
        // Fill in what is missing without discarding what is there: the stored
        // document is layered *over* the defaults, so an edited headline wins
        // and a field that never got written appears for the first time.
        const snap = await getDoc(ref);
        const merged = snap.exists()
          ? mergeDefaults(value, snap.data())
          : value;
        await setDoc(ref, { ...clean(merged), updatedAt: stamp });
      }
      written.singles += 1;
    }

    for (const [key, rows] of Object.entries(DEFAULTS.collections)) {
      const existing = await getDocs(collection(db, key));
      const stored = new Map(existing.docs.map((d) => [d.id, d.data()]));

      // Firestore caps a batch at 500 writes; these collections are far
      // smaller, but chunking keeps that true if the seed grows.
      const batch = writeBatch(db);

      rows.forEach((row, index) => {
        const id = seedId(row, index);
        const current = stored.get(id);

        if (overwrite || !current) {
          batch.set(doc(db, key, id), { ...clean(row), updatedAt: stamp });
          written.created += 1;
          return;
        }

        // A row that is already complete is left alone — rewriting it would
        // only churn `updatedAt` and invalidate the cache for no reason.
        const merged = mergeDefaults(row, current);
        const missing = Object.keys(row).filter((field) => !(field in current));

        if (!missing.length) {
          written.untouched += 1;
          return;
        }

        batch.set(doc(db, key, id), { ...clean(merged), updatedAt: stamp });
        written.repaired += 1;
      });

      await batch.commit();
    }

    refresh();

    if (overwrite) {
      return {
        success: `Reset to defaults — ${written.singles} settings and ${written.created} items rewritten.`,
      };
    }

    const parts = [`${written.created} added`];
    if (written.repaired) parts.push(`${written.repaired} completed`);
    if (written.untouched) parts.push(`${written.untouched} left as they were`);

    return { success: `Starter content loaded: ${parts.join(', ')}.` };
  } catch (error) {
    return { error: `Seeding failed: ${error.message}` };
  }
}
