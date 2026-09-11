import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import { evaluateUserExpirations } from "@/lib/notifications/evaluator";
import { isSameOrigin } from "@/lib/security";

/**
 * QR tracking notifications sweep.
 *
 * Runs the smart-notification evaluators for every user's QR codes so they get
 * dashboard (and email) notifications about:
 *   - Active QR codes (scan milestones, traffic spikes) — also emitted live at
 *     scan time from the redirect engine; the sweeps here are a safety net.
 *   - QR codes about to be terminated (expiring in 7/3/1 days).
 *   - QR codes that have been terminated (expired / past expiresAt).
 *
 * Invoked by Vercel Cron (see /vercel.json). Protect with CRON_SECRET.
 * When CRON_SECRET is not configured, requires a same-origin request so it can
 * still be triggered manually from the app / local dev for testing.
 */
export const dynamic = "force-dynamic";

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

    // Users who own at least one QR with an expiration date and that isn't
    // archived. These are the only users who can receive expiration alerts.
    const affectedUserIds = await QRCode.distinct("userId", {
      expiresAt: { $exists: true, $ne: null },
      status: { $ne: "archived" },
    });

    const results = [];
    for (const userId of affectedUserIds) {
      const emitted = await evaluateUserExpirations(userId);
      results.push({
        userId: userId.toString(),
        evaluated: true,
        emitted: emitted.length,
      });
    }

    return NextResponse.json({
      success: true,
      usersEvaluated: results.length,
      results,
    });
  } catch (error) {
    console.error("QR NOTIFICATIONS CRON ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}