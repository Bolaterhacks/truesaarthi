import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { db } from '@/lib/firebase';

const ADMIN_DOC = ['settings', 'admin'];
const COOKIE = 'ts_admin';
const SESSION_DAYS = 7;

/**
 * The password set on first run. It is written to Firestore hashed, exactly
 * like any password the owner sets later — this constant is only ever used to
 * produce that first hash, never compared against at login.
 */
export const DEFAULT_PASSWORD = 'truesaarthi';

/* ------------------------------------------------------------- hashing */

const scrypt = (password, salt) =>
  scryptSync(String(password), salt, 64).toString('hex');

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  return { salt, passwordHash: scrypt(password, salt) };
}

/** Constant-time compare — a length mismatch would otherwise throw. */
function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/* ------------------------------------------------------- the admin record */

/**
 * Reads `settings/admin`, creating it with the default password the first time
 * anyone visits the login screen. Returns `null` only when Firestore itself is
 * unreachable, which the caller reports rather than treating as a bad password.
 */
export async function getAdminRecord({ create = true } = {}) {
  try {
    const ref = doc(db, ...ADMIN_DOC);
    const snap = await getDoc(ref);

    if (snap.exists() && snap.data()?.passwordHash) {
      return snap.data();
    }

    if (!create) return null;

    const seeded = {
      ...hashPassword(DEFAULT_PASSWORD),
      isDefaultPassword: true,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(ref, seeded, { merge: true });
    return seeded;
  } catch (error) {
    console.error('[admin] could not read settings/admin:', error.message);
    return null;
  }
}

export async function setAdminPassword(password) {
  const record = {
    ...hashPassword(password),
    isDefaultPassword: false,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(doc(db, ...ADMIN_DOC), record, { merge: true });
  return record;
}

export async function verifyPassword(password) {
  const record = await getAdminRecord();
  if (!record) return { ok: false, reason: 'unreachable' };

  const candidate = scrypt(password, record.salt);
  return safeEqual(candidate, record.passwordHash)
    ? { ok: true, record }
    : { ok: false, reason: 'invalid' };
}

/* -------------------------------------------------------------- sessions */

/**
 * The signing key is the stored password hash itself, which means changing the
 * password logs every existing session out for free — no secret to configure,
 * no session store to keep.
 */
const sign = (payload, key) =>
  createHmac('sha256', key).update(payload).digest('hex');

function makeToken(record) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload, record.passwordHash)}`;
}

export async function createSession(record) {
  const jar = await cookies();
  jar.set(COOKIE, makeToken(record), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/** True only for a well-formed, unexpired, correctly signed cookie. */
export async function isAuthenticated() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;

  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;

  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const record = await getAdminRecord({ create: false });
  if (!record?.passwordHash) return false;

  return safeEqual(signature, sign(payload, record.passwordHash));
}

/** For the dashboard banner nudging the owner off the shipped default. */
export async function usingDefaultPassword() {
  const record = await getAdminRecord({ create: false });
  return record?.isDefaultPassword === true;
}
