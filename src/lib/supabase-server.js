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

/**
 * List every object currently stored in the documents bucket.
 * Used by the cleanup cron to find objects no QR references anymore (failed,
 * replaced or deleted uploads) that would otherwise leak storage forever.
 */
export async function listStoredDocuments() {
  const client = getAdmin();
  if (!client) {
    return { objects: [], error: "Supabase is not configured (missing service role key)" };
  }

  const objects = [];
  try {
    for (let offset = 0; offset < 10000; offset += 1000) {
      const { data, error } = await client.storage
        .from(DOCUMENTS_BUCKET)
        .list("", { limit: 1000, offset });

      if (error) {
        return { objects: [], error: error.message || "List failed" };
      }
      if (!data || data.length === 0) break;
      objects.push(...data);
      if (data.length < 1000) break;
    }
  } catch (err) {
    return { objects: [], error: err.message || "List failed" };
  }

  return { objects, error: null };
}

/**
 * Verify a storage object actually exists and is readable, and that its size
 * matches the expected byte count. Used at save time so a document QR is never
 * persisted pointing at a missing/corrupt file even if the client-side check
 * was skipped or bypassed.
 */
export async function verifyStoredDocument(storagePath, expectedSize) {
  if (!storagePath || typeof storagePath !== "string") {
    return { ok: false, error: "No storage path provided" };
  }
  const client = getAdmin();
  if (!client) {
    return { ok: false, error: "Supabase is not configured (missing service role key)" };
  }

  const { data, error } = await client.storage
    .from(DOCUMENTS_BUCKET)
    .info(storagePath);

  if (error || !data) {
    return { ok: false, error: error?.message || "File not found in storage" };
  }

  const storedSize = Number(data.metadata?.size ?? data.size);
  if (
    expectedSize &&
    Number.isFinite(storedSize) &&
    Number.isFinite(expectedSize) &&
    storedSize !== expectedSize
  ) {
    return {
      ok: false,
      error: `Stored file is ${storedSize} bytes but ${expectedSize} were expected`,
    };
  }

  return { ok: true, error: null };
}

/**
 * Convenience wrapper used at save time in the QR create/update routes: when a
 * document QR carries a storage fileId, verify the object still exists before
 * we persist (or re-persist) the code. Guards against saving a QR that points
 * at a file that was already cleaned up or never landed — the server-side
 * source of truth even if the client-side upload check was bypassed.
 *
 * Returns { valid: true } when the QR has no fileId (nothing to check) or the
 * file exists. Returns { valid: false, error } when it references a missing
 * object.
 */
export async function validateDocumentFileId(fileId) {
  if (!fileId || typeof fileId !== "string" || fileId.trim() === "") {
    return { valid: true }; // nothing to verify
  }

  const { ok, error } = await verifyStoredDocument(fileId);
  if (!ok) {
    return { valid: false, error: error || "Uploaded file is no longer available" };
  }

  return { valid: true };
}
