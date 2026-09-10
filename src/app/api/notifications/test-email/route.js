import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { renderNotificationEmail } from "@/lib/email/templates";
import { sendEmail, getLastSentEmail } from "@/lib/email/client";
import { SMART_RULES } from "@/lib/notifications/rules";

export const dynamic = "force-dynamic";

/**
 * Preview rendered email template in browser
 * Example: GET /api/notifications/test-email?type=unusual_traffic
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "qr_milestone";

    const rule = SMART_RULES[type] || SMART_RULES.qr_milestone;

    const mockQr = {
      _id: "preview-qr-123",
      title: "Restaurant Menu QR",
      shortSlug: "menu-preview",
      scansCount: 10000,
      destinationUrl: "https://example.com/menu",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    let params = { qr: mockQr, threshold: 10000 };

    if (type === "unusual_traffic") {
      params = {
        qr: mockQr,
        scanCount: 4200,
        country: "Germany",
        windowMinutes: 30,
        expectedScans: "120–250",
        topDevice: "Android",
      };
    } else if (type === "broken_destination") {
      params = {
        qr: mockQr,
        destinationUrl: "https://example.com/menu",
        httpStatus: 404,
      };
    } else if (type === "qr_expires_1d" || type === "qr_expires_7d") {
      params = { qr: mockQr, daysLeft: type === "qr_expires_1d" ? 1 : 7 };
    } else if (type === "campaign_performance_increase") {
      params = { campaignName: "Summer Campaign", increasePercent: 34 };
    }

    const payload = rule.buildNotification(params);
    const mockUser = { name: "Gary User", email: "gary@qraft.app" };

    const { html, subject } = renderNotificationEmail({
      notification: { ...payload, createdAt: new Date() },
      user: mockUser,
      baseUrl: new URL(req.url).origin,
    });

    return new Response(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Email-Subject": encodeURIComponent(subject),
      },
    });
  } catch (error) {
    console.error("GET /api/notifications/test-email error:", error);
    return NextResponse.json({ error: "Failed to render email preview" }, { status: 500 });
  }
}

/**
 * Dispatch test email to currently authenticated user
 * Example: POST /api/notifications/test-email { type: "unusual_traffic" }
 */
export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Must be signed in to send a test email" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const type = body.type || "qr_milestone";
    const rule = SMART_RULES[type] || SMART_RULES.qr_milestone;

    const mockQr = {
      _id: "test-qr-id",
      title: "Sample Dynamic QR",
      shortSlug: "sample-qr",
      scansCount: 10000,
      destinationUrl: "https://qraft.app",
    };

    let params = { qr: mockQr, threshold: 10000 };
    if (type === "unusual_traffic") {
      params = {
        qr: mockQr,
        scanCount: 4200,
        country: "Germany",
        windowMinutes: 30,
        expectedScans: "120–250",
        topDevice: "Android",
      };
    } else if (type === "broken_destination") {
      params = {
        qr: mockQr,
        destinationUrl: "https://example.com/dead-link",
        httpStatus: 404,
      };
    }

    const payload = rule.buildNotification(params);
    const { subject, html } = renderNotificationEmail({
      notification: { ...payload, createdAt: new Date() },
      user: session.user,
      baseUrl: new URL(req.url).origin,
    });

    const result = await sendEmail({
      to: session.user.email,
      subject: `[Test] ${subject}`,
      html,
    });

    return NextResponse.json({
      success: true,
      recipient: session.user.email,
      result,
      lastSent: getLastSentEmail(),
    });
  } catch (error) {
    console.error("POST /api/notifications/test-email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
