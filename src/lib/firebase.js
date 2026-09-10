/**
 * Single Firebase entry point for the whole app.
 *
 * The web config is public by design (it identifies the project, it does not
 * authorise anything — Firestore/Storage rules do that), so the values are
 * inlined as defaults and can still be overridden per-environment.
 *
 * `getApps()` is checked because Next re-evaluates modules across the server
 * and client bundles, and `initializeApp` throws on a duplicate name.
 */
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyB6urY-1STfUUP-i3cIJ_pPDiM64u1BEro',
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'truesaarthi-34984.firebaseapp.com',
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'truesaarthi-34984',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'truesaarthi-34984.firebasestorage.app',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '765318436346',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    '1:765318436346:web:eb71e691b2d73455394043',
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-9NVCYMPBLY',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export { firebaseConfig };
export default app;
