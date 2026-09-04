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
