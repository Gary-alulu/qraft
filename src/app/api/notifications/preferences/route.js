import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import NotificationPreference from "@/models/NotificationPreference";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let prefs = await NotificationPreference.findOne({ userId: session.user.id });

    if (!prefs) {
      prefs = await NotificationPreference.create({ userId: session.user.id });
    }

    return NextResponse.json({ preferences: prefs });
  } catch (error) {
    console.error("GET /api/notifications/preferences error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json().catch(() => ({}));
    const allowedKeys = [
      "inApp",
      "email",
      "push",
      "qrMilestones",
      "trafficSpikes",
      "trafficDrops",
      "conversionMilestones",
      "expiration7d",
      "expiration3d",
      "expiration24h",
      "expirationWhenExpired",
      "suspiciousTraffic",
      "destinationIssues",
      "securityWarnings",
      "campaignMilestones",
      "campaignPerformance",
      "abTestResults",
      "scanabilityAlerts",
      "usageAlerts",
    ];

    const updateFields = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        updateFields[key] = Boolean(body[key]);
      }
    }

    const prefs = await NotificationPreference.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updateFields },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, preferences: prefs });
  } catch (error) {
    console.error("PATCH /api/notifications/preferences error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
