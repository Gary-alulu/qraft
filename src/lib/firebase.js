"use client";

import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

/**
 * Firebase client configuration.
 *
 * We only use Firebase Storage here (to host PDF files uploaded directly from
 * the browser, bypassing Vercel's 4.5MB serverless request limit).
 * Authentication remains NextAuth's — Firebase is NOT used for auth.
 *
 * The config values are public by design (they live in the browser). Do NOT
 * store Firebase service-account secrets client-side.
 *
 * Set FIREBASE_API_KEY / FIREBASE_AUTH_DOMAIN / FIREBASE_PROJECT_ID /
 * FIREBASE_STORAGE_BUCKET / FIREBASE_MESSAGING_SENDER_ID / FIREBASE_APP_ID in
 * your Vercel environment (or .env.local locally).
 */

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Lazy singleton — avoid re-initializing on every import / hot reload.
let app;
let storage;

if (
  typeof window !== "undefined" &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId
) {
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  storage = getStorage(app);
} else {
  storage = null;
}

export function isFirebaseConfigured() {
  return Boolean(storage);
}

export { storage };
