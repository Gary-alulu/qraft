import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (service role). Never import this from a
 * Client Component — the service-role key must stay server-side only.
 */
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

let supabaseAdmin = null;

function getAdmin() {
  if (!SUPABASE_URL || !SERVICE_ROLE) return null;
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseAdmin;
}

export const DOCUMENTS_BUCKET = "pdf";

/**
 * Delete a stored document (PDF) from Supabase Storage by its storage path.
 * Returns { deleted, error }. Idempotent — removing a non-existent object is
 * treated as success so re-running cleanup is safe.
 */
export async function deleteStoredDocument(storagePath) {
  if (!storagePath || typeof storagePath !== "string") {
    return { deleted: false, error: "No storage path provided" };
  }
  const client = getAdmin();
  if (!client) {
    return { deleted: false, error: "Supabase is not configured (missing service role key)" };
  }

  const { error } = await client.storage
    .from(DOCUMENTS_BUCKET)
    .remove([storagePath]);

  if (error) {
    // Treat "not found" as already-removed success so cleanup stays idempotent.
    const message = error.message || "";
    if (message.toLowerCase().includes("not found") || error.statusCode === 400) {
      return { deleted: true, error: null };
    }
    return { deleted: false, error: error.message || "Delete failed" };
  }

  return { deleted: true, error: null };
}
