"use client";

import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for Storage (PDF hosting). Only Storage is used here;
 * auth remains NextAuth. The anon/public key is safe to embed client-side.
 *
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your
 * environment (.env.local locally, Vercel env vars for deployment).
 *
 * The anon key is gated by your Storage bucket's RLS policies (see the
 * supabase.sql / storage rules docs).
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export function isSupabaseConfigured() {
  return Boolean(supabase);
}

export { supabase, supabaseUrl };

// Bucket used for uploaded QR documents/PDFs.
export const DOCUMENTS_BUCKET = "documents";
