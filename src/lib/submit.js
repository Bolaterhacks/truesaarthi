'use server';

import { addDoc, collection } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/firebase';
import { sendSubmissionEmail } from '@/lib/mail';

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

  const entry = { kind, name, email, program, message };

  // Store in the admin inbox and email it in parallel. The visitor only sees
  // an error if both fail, so one outage never loses the message.
  const [stored, mailed] = await Promise.allSettled([
    addDoc(collection(db, 'messages'), {
      ...entry,
      read: false,
      createdAt: new Date().toISOString(),
    }),
    sendSubmissionEmail(entry),
  ]);

  if (stored.status === 'rejected') {
    console.error('[submit] could not store message:', stored.reason?.message);
  } else {
    revalidatePath('/admin/messages');
  }
  if (mailed.status === 'rejected') {
    console.error('[submit] could not send email:', mailed.reason?.message);
  }

  if (stored.status === 'rejected' && mailed.status === 'rejected') {
    return {
      error: 'Something went wrong sending that. Please email me directly.',
    };
  }
  return { success: true };
}
