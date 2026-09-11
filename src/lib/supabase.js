"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for Storage (PDF hosting). Only Storage is used here;
 * auth remains NextAuth. The anon key is safe to embed client-side.
 *
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your
 * environment (.env.local locally, Vercel env vars for deployment).
 *
 * Uploads use signed URLs obtained from /api/upload-url (service role),
 * so the browser never needs anonymous write access.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase && supabaseUrl);
}

export { supabase, supabaseUrl };

// Bucket used for uploaded QR documents/PDFs. Must be all-lowercase — Supabase
// has known issues with uppercase bucket names. Match the dashboard exactly.
export const DOCUMENTS_BUCKET = "pdf";

/**
 * Verify a freshly uploaded file is actually served from storage before its
 * URL is allowed to become the QR's data. Guards against truncated/partial
 * uploads and expired signed URLs, which would otherwise produce a QR that
 * encodes a missing or corrupt file.
 *
 * Compares the HTTP Content-Length against the locally-known size so we never
 * trust an upload that reads back as a different byte count. HEAD is used to
 * avoid downloading the payload. Returns true when the file is reachable and
 * the byte count matches.
 */
export async function verifyUploadedFile(publicUrl, expectedSize) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(publicUrl, { method: "HEAD", signal: controller.signal });

    if (!res.ok) {
      throw new Error(
        `Upload verification failed: file is not readable from storage (HTTP ${res.status}). Please try again.`
      );
    }

    const storedLength = Number(res.headers.get("content-length"));
    if (
      expectedSize &&
      Number.isFinite(storedLength) &&
      Number.isFinite(expectedSize) &&
      storedLength !== expectedSize
    ) {
      throw new Error(
        `Upload verification failed: stored file is ${storedLength} bytes but ${expectedSize} were sent. The file may be truncated. Please try again.`
      );
    }

    return true;
  } finally {
    clearTimeout(timeout);
  }
}
