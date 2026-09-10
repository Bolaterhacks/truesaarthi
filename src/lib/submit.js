'use server';

import { addDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/firebase';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Trim, collapse whitespace and cap length before anything is stored. */
const clean = (value, max) =>
  String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

/**
 * Stores a public form submission in `messages`, where the admin inbox reads
 * it. Validation is repeated here rather than trusted from the client, because
 * the client-side check is a convenience and this one is the actual gate.
 */
export async function submitMessage(payload) {
  const name = clean(payload?.name, 120);
  const email = clean(payload?.email, 200);
  const program = clean(payload?.program, 120);
  const kind = payload?.kind === 'guide' ? 'guide' : 'contact';
  // Newlines carry meaning in a message, so only the ends are trimmed.
  const message = String(payload?.message ?? '').trim().slice(0, 5000);

  if (kind === 'contact') {
    if (!name) return { error: 'Please tell me your name.' };
    if (message.length < 10) {
      return { error: 'A sentence or two is plenty — just not empty.' };
    }
  }
  if (!EMAIL.test(email)) {
    return { error: 'Please enter a valid email address.' };
  }

  try {
    await addDoc(collection(db, 'messages'), {
      kind,
      name,
      email,
      program,
      message,
      read: false,
      createdAt: new Date().toISOString(),
    });

    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    console.error('[submit] could not store message:', error.message);
    return {
      error: 'Something went wrong sending that. Please email me directly.',
    };
  }
}
