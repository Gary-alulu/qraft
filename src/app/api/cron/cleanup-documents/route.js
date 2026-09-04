import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import { isSameOrigin } from "@/lib/security";
import { deleteStoredDocument } from "@/lib/supabase-server";

/**
 * Auto-delete stored documents (PDFs) to reclaim storage.
 *
 * A document QR links to a PDF hosted in Supabase Storage. To keep storage
 * usage down, any document older than DOCUMENT_RETENTION_DAYS (7 days) since
 * its last save is automatically removed from storage, and its QR is paused
 * and marked as expired so it never points at a dead file.
 *
 * Invoked by Vercel Cron (see /vercel.json). Protect with CRON_SECRET.
 * When CRON_SECRET is not configured, requires a same-origin request so it can
 * still be triggered manually from the app / local dev for testing.
 */
export const dynamic = "force-dynamic";

const DOCUMENT_RETENTION_DAYS = 7;
const RETENTION_MS = DOCUMENT_RETENTION_DAYS * 24 * 60 * 60 * 1000;

function isAuthorized(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    // Expected: Vercel cron sends `Authorization: Bearer <CRON_SECRET>`.
    const authHeader = req.headers.get("authorization") || "";
    return authHeader === `Bearer ${cronSecret}`;
  }
  // No secret configured → fall back to same-origin so it can run in dev.
  return isSameOrigin(req);
}

export async function GET(req) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();

    const cutoff = new Date(Date.now() - RETENTION_MS);

    // Document QRs that still reference an uploaded file, last saved 7+ days ago.
    const stale = await QRCode.find({
      type: "document",
      "contentData.fileId": { $exists: true, $ne: "" },
      updatedAt: { $lte: cutoff },
    }).select("_id title contentData status");

    let deleted = 0;
    let failed = 0;
    const failures = [];

    for (const qr of stale) {
      const storagePath = qr.contentData?.fileId;
      const { deleted: ok, error } = await deleteStoredDocument(storagePath);

      if (ok) {
        deleted += 1;
        // Clear the live URL so the code can't serve a dead link, keep the
        // filename/path for reference, and pause the code.
        qr.contentData = {
          ...(qr.contentData || {}),
          url: "",
          filename: qr.contentData?.filename || "",
          expired: true,
        };
        qr.status = "paused";
        await qr.save();
      } else {
        failed += 1;
        failures.push({ id: qr._id, path: storagePath, error });
      }
    }

    return NextResponse.json({
      success: true,
      retentionDays: DOCUMENT_RETENTION_DAYS,
      scanned: stale.length,
      deleted,
      failed,
      failures: failures.slice(0, 20),
    });
  } catch (error) {
    console.error("DOCUMENT CLEANUP ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
