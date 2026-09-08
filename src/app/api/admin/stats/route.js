import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await dbConnect();

    const now = Date.now();
    const todayStart = new Date(new Date(now).setHours(0, 0, 0, 0));
    const oneDayAgo = new Date(now - 1 * DAY_MS);
    const sevenDaysAgo = new Date(now - 7 * DAY_MS);
    const thirtyDaysAgo = new Date(now - 30 * DAY_MS);

    const [totalUsers, totalCodes, totalScans] = await Promise.all([
      User.countDocuments(),
      QRCode.countDocuments(),
      Scan.countDocuments(),
    ]);

    const scansToday = await Scan.countDocuments({ createdAt: { $gte: todayStart } });
    const scansLast7 = await Scan.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
    const scansLast30 = await Scan.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    const dynamicCodes = await QRCode.countDocuments({ isDynamic: true });

    // 14-day platform scan series
    const seriesRaw = await Scan.aggregate([
      { $match: { createdAt: { $gte: new Date(now - 14 * DAY_MS) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, scans: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const series = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now - i * DAY_MS);
      const key = d.toISOString().split("T")[0];
      const found = seriesRaw.find((item) => item._id === key);
      series.push({
        name: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        scans: found ? found.scans : 0,
      });
    }

    // Device distribution (all scans)
    const deviceRaw = await Scan.aggregate([
      { $group: { _id: "$deviceType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const devices = deviceRaw.map((d) => ({
      name: (String(d._id || "unknown")).charAt(0).toUpperCase() + String(d._id || "unknown").slice(1),
      value: d.count,
    }));

    // Top countries
    const countryRaw = await Scan.aggregate([
      { $match: { country: { $ne: null, $ne: "" } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);
    const countries = countryRaw.map((c) => ({ name: c._id, count: c.count }));

    // Plan distribution
    const planRaw = await User.aggregate([
      { $group: { _id: "$plan", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const plans = planRaw.map((p) => ({ name: p._id || "unknown", value: p.count }));

    // Recently joined users + their code counts
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(8).lean();

    const recentUserIds = recentUsers.map((u) => u._id);
    const codeCounts = await QRCode.aggregate([
      { $match: { userId: { $in: recentUserIds } } },
      { $group: { _id: "$userId", codes: { $sum: 1 } } },
    ]);
    const codeCountMap = {};
    codeCounts.forEach((c) => { codeCountMap[c._id.toString()] = c.codes; });

    const recentUsersFormatted = recentUsers.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role || "user",
      plan: u.plan || "free",
      joined: u.createdAt.toISOString().split("T")[0],
      codes: codeCountMap[u._id.toString()] || 0,
    }));

    // Top codes by scan count
    const topCodes = await QRCode.find().sort({ scansCount: -1 }).limit(8).lean();
    const topUserIds = [...new Set(topCodes.map((c) => c.userId && c.userId.toString()))].filter(Boolean);
    const topUsers = await User.find({ _id: { $in: topUserIds } }).select("name email").lean();
    const topUserMap = {};
    topUsers.forEach((u) => { topUserMap[u._id.toString()] = u; });

    const topCodesFormatted = topCodes.map((c) => {
      const owner = topUserMap[c.userId && c.userId.toString()] || {};
      return {
        id: c._id.toString(),
        title: c.title,
        type: c.type,
        status: c.status,
        isDynamic: !!c.isDynamic,
        scans: c.scansCount || 0,
        owner: owner.email || c._id.toString(),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totals: { users: totalUsers, qrCodes: totalCodes, scans: totalScans, dynamicCodes },
        scans: { today: scansToday, last7: scansLast7, last30: scansLast30 },
        series,
        devices,
        countries,
        plans,
        recentUsers: recentUsersFormatted,
        topCodes: topCodesFormatted,
      },
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}