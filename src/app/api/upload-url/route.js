import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

/**
 * Returns a short-lived signed upload URL for the PDF bucket plus the public
 * download URL. The client uploads the file directly to Supabase using the
 * signed URL — bypassing Vercel's 4.5MB serverless request body limit.
 *
 * Uses the SERVICE_ROLE key server-side (never exposed to the browser) so it
 * is not subject to anonymous RLS policies.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY;

const BUCKET = "pdf";
const MAX_SIZE = 10 * 1024 * 1024;
const MAX_FILENAME_LENGTH = 255;

// Reject path traversal / injection attempts in the filename long before any
// storage layer sees it.
const SAFE_FILENAME_RE = /^[a-zA-Z0-9._-]+$/;

export async function POST(req) {
  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return NextResponse.json(
      { error: "Supabase is not configured (missing service role key)" },
      { status: 500 }
    );
  }

  try {
    const { filename, size } = await req.json().catch(() => ({}));

    if (typeof filename !== "string" || filename.trim() === "") {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }
    if (filename.length > MAX_FILENAME_LENGTH) {
      return NextResponse.json(
        { error: "Filename is too long" },
        { status: 400 }
      );
    }

    const numericSize = Number(size);
    if (
      !Number.isFinite(numericSize) ||
      numericSize <= 0 ||
      numericSize > MAX_SIZE
    ) {
      return NextResponse.json(
        { error: "File must be under 10MB" },
        { status: 400 }
      );
    }

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "");
    if (!safeName || !SAFE_FILENAME_RE.test(safeName)) {
      return NextResponse.json(
        { error: "Invalid filename" },
        { status: 400 }
      );
    }

    // Unique path per upload: timestamp + random suffix prevents two uploads
    // of the same-named file (rapid retries, multiple tabs) from silently
    // overwriting each other, which would corrupt or orphan the previous file.
    const storagePath = `${Date.now()}-${randomBytes(6).toString("hex")}-${safeName}`;

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Signed upload URL (10 min expiry) — lets the browser PUT the PDF direct.
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(storagePath);

    if (error) {
      console.error("SUPABASE signed url error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const publicUrl = supabase.storage
      .from(BUCKET)
      .getPublicUrl(storagePath).data?.publicUrl;

    return NextResponse.json(
      {
        signedUrl: data.signedUrl,
        token: data.token,
        path: data.path,
        publicUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("SIGNED URL ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
