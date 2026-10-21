import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";

import { readFirebaseConfig } from "./config";

// Lazy so that importing this module never opens a connection; the first caller that needs Firestore
// or Auth decides when the SDK starts. Reads stay read-only by rule (docs/steering/rules.md).
export function getFirebaseApp(): FirebaseApp {
  if (getApps().length) return getApp();
  const result = readFirebaseConfig({
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
  if (!result.ok) throw new Error(`Firebase belum dikonfigurasi; isi ${result.missing.join(", ")} di .env.local.`);
  return initializeApp(result.config);
}
