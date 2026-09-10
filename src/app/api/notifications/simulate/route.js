import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import { emitNotification } from "@/lib/notifications/engine";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const { ruleType = "all", qrId } = body;

    // Fetch user's QR or use fallback mock
    let qr = null;
    if (qrId) {
      qr = await QRCode.findOne({ _id: qrId, userId });
    }
    if (!qr) {
      qr = await QRCode.findOne({ userId });
    }
    if (!qr) {
      qr = {
        _id: "mock-sample-qr-id",
        title: "Restaurant Menu QR",
        scansCount: 10000,
        shortSlug: "menu-demo",
        destinationUrl: "https://example.com/menu",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      };
    }

    const todayBucket = new Date().toISOString().slice(0, 10);
    const results = [];

    // All 15 sample simulations
    const scenarios = [
      // 1. QR scan milestone (🟢)
      {
        rule: "qr_milestone",
        params: { qr, threshold: 10000 },
        options: { dedupKey: `sim_milestone_10k_${Date.now()}` },
      },
      // 2. Unusual traffic detected (🔴)
      {
        rule: "unusual_traffic",
        params: {
          qr,
          scanCount: 4200,
          country: "Germany",
          windowMinutes: 30,
          expectedScans: "120–250",
          topDevice: "Android",
        },
        options: { dedupKey: `sim_unusual_traffic_${Date.now()}` },
      },
      // 3. Campaign performance increase (🟢)
      {
        rule: "campaign_performance_increase",
        params: { campaignName: "Summer Campaign", increasePercent: 34 },
        options: { dedupKey: `sim_camp_perf_${Date.now()}` },
      },
      // 4. QR expires tomorrow (🔴)
      {
        rule: "qr_expires_1d",
        params: { qr: { ...qr, title: "Event Ticket QR" } },
        options: { dedupKey: `sim_exp_1d_${Date.now()}` },
      },
      // 5. QR expires in 7 days (🟡)
      {
        rule: "qr_expires_7d",
        params: { qr: { ...qr, title: "VIP Promo Pass" }, daysLeft: 7 },
        options: { dedupKey: `sim_exp_7d_${Date.now()}` },
      },
      // 6. QR expires in 3 days (🟡)
      {
        rule: "qr_expires_3d",
        params: { qr: { ...qr, title: "Conference Badge" }, daysLeft: 3 },
        options: { dedupKey: `sim_exp_3d_${Date.now()}` },
      },
      // 7. QR expired (🔴)
      {
        rule: "qr_expired",
        params: { qr: { ...qr, title: "Spring Clearance QR" } },
        options: { dedupKey: `sim_expired_${Date.now()}` },
      },
      // 8. Traffic spike (🟡)
      {
        rule: "traffic_spike",
        params: {
          qr,
          currentRate: 2400,
          normalRate: "75–120/hr",
          multiplier: 18,
          timeWindow: "hour",
        },
        options: { dedupKey: `sim_spike_${Date.now()}` },
      },
      // 9. Traffic drop (🟡)
      {
        rule: "traffic_drop",
        params: {
          qr,
          dropPercent: 91,
          normalDaily: 500,
          actualDaily: 42,
        },
        options: { dedupKey: `sim_drop_${Date.now()}` },
      },
      // 10. Conversion milestone (🟢)
      {
        rule: "conversion_milestone",
        params: { qr: { ...qr, title: "Fall Catalog QR" }, conversionRate: 12.1, previousRate: 8.4 },
        options: { dedupKey: `sim_conv_${Date.now()}` },
      },
      // 11. Campaign ending soon (🟡)
      {
        rule: "campaign_ending_soon",
        params: { campaignName: "Back to School Promo", daysLeft: 3 },
        options: { dedupKey: `sim_camp_end_${Date.now()}` },
      },
      // 12. A/B test winner detected (🟢)
      {
        rule: "ab_test_winner",
        params: {
          qr,
          winnerVariant: "Variant B",
          marginPercent: 63,
          rateA: "7.2%",
          rateB: "11.8%",
        },
        options: { dedupKey: `sim_ab_winner_${Date.now()}` },
      },
      // 13. Broken destination detected (🔴)
      {
        rule: "broken_destination",
        params: { qr, destinationUrl: qr.destinationUrl || "https://example.com/menu", httpStatus: 404 },
        options: { dedupKey: `sim_broken_dest_${Date.now()}` },
      },
      // 14. Scanability decreased (🟡)
      {
        rule: "scanability_decreased",
        params: { qr, scoreBefore: 96, scoreAfter: 71 },
        options: { dedupKey: `sim_scanability_${Date.now()}` },
      },
      // 15. Usage approaching limit (🟡)
      {
        rule: "usage_approaching_limit",
        params: { percentUsed: 85, current: 850, max: 1000, plan: "Free" },
        options: { dedupKey: `sim_usage_limit_${Date.now()}` },
      },
    ];

    if (ruleType === "all") {
      // Pick top 4-5 signature ones to create a realistic initial inbox
      const initialBatch = scenarios.slice(0, 5);
      for (const item of initialBatch) {
        const res = await emitNotification(userId, item.rule, item.params, item.options);
        results.push(res);
      }
    } else {
      const match = scenarios.find((s) => s.rule === ruleType);
      if (match) {
        const res = await emitNotification(userId, match.rule, match.params, match.options);
        results.push(res);
      } else {
        return NextResponse.json({ error: `Unknown rule scenario: ${ruleType}` }, { status: 400 });
      }
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("POST /api/notifications/simulate error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
