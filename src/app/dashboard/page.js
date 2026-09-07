import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import Folder from "@/models/Folder";
import MetricsRow from "@/components/dashboard/MetricsRow";
import ScansChart from "@/components/dashboard/ScansChart";
import RecentCodesTable from "@/components/dashboard/RecentCodesTable";
import ActiveCampaigns from "@/components/dashboard/ActiveCampaigns";

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const userId = session.user.id;

  // Fetch real data
  const totalCodes = await QRCode.countDocuments({ userId, status: { $ne: "archived" } });
  const activeCampaigns = await QRCode.countDocuments({ userId, isDynamic: true, status: "active" });
  const totalFolders = await Folder.countDocuments({ userId });
  
  // Aggregate total scans from all user's codes
  const userCodes = await QRCode.find({ userId }).select("_id");
  const codeIds = userCodes.map(c => c._id);
  const totalScans = await Scan.countDocuments({ qrCodeId: { $in: codeIds } });

  // Real last-7-day time series for the scan graph (accurate, from Scan events)
  const sevenDaysAgo = new Date(Date.now() - 7 * DAY_MS);
  const dailyRaw = await Scan.aggregate([
    { $match: { qrCodeId: { $in: codeIds }, createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        scans: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const chartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY_MS);
    const key = d.toISOString().split("T")[0];
    const found = dailyRaw.find((item) => item._id === key);
    chartData.push({
      name: d.toLocaleDateString("en-US", { weekday: "short" }),
      scans: found ? found.scans : 0,
    });
  }

  // Active campaigns (dynamic codes) with real numbers & projections
  const campaignQrs = await QRCode.find({ userId, isDynamic: true, status: "active" })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const campaignIds = campaignQrs.map((c) => c._id);
  const thirtyDaysAgo = new Date(Date.now() - 30 * DAY_MS);

  const perCodeLast7 = await Scan.aggregate([
    { $match: { qrCodeId: { $in: campaignIds }, createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: "$qrCodeId", count: { $sum: 1 } } },
  ]);
  const perCodeLast30 = await Scan.aggregate([
    { $match: { qrCodeId: { $in: campaignIds }, createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: "$qrCodeId", count: { $sum: 1 } } },
  ]);

  const last7Map = {};
  perCodeLast7.forEach((r) => { last7Map[r._id.toString()] = r.count; });
  const last30Map = {};
  perCodeLast30.forEach((r) => { last30Map[r._id.toString()] = r.count; });

  const campaigns = campaignQrs.map((code) => {
    const totalScansForCode = code.scansCount || 0;
    const last7 = last7Map[code._id.toString()] || 0;
    const last30 = last30Map[code._id.toString()] || 0;

    const ageDays = Math.max(1, Math.ceil((Date.now() - code.createdAt.getTime()) / DAY_MS));
    const windowDays = Math.min(30, ageDays);
    // Real daily average over the last month (or since creation for newer codes)
    const dailyAvg = windowDays > 0 ? last30 / windowDays : 0;
    // Projection: keep today's scanning rate for the next 30 days
    const projected30 = Math.round(dailyAvg * 30);

    return {
      id: code._id.toString(),
      title: code.title,
      totalScans: totalScansForCode,
      last7,
      last30,
      dailyAvg: Math.round(dailyAvg * 10) / 10,
      projected30,
      slug: code.shortSlug,
      destinationUrl: code.destinationUrl,
    };
  }).sort((a, b) => b.projected30 - a.projected30);

  // Get recent codes
  const recentCodes = await QRCode.find({ userId, status: { $ne: "archived" } })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();
    
  // Format codes for the client component
  const formattedCodes = recentCodes.map(code => ({
    id: code._id.toString(),
    name: code.title,
    type: code.type,
    scans: code.scansCount || 0,
    status: code.status,
    isDynamic: !!code.isDynamic,
    date: code.createdAt.toISOString().split("T")[0]
  }));

  const metrics = {
    totalCodes,
    totalScans,
    activeCampaigns,
    totalFolders
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>
          Good morning, {session.user.name.split(" ")[0]}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>
          Here&apos;s what&apos;s happening with your QR codes today.
        </p>
      </div>

      <MetricsRow metrics={metrics} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginTop: "2rem" }}>
        <ActiveCampaigns campaigns={campaigns} />
        <ScansChart data={chartData} />
        <RecentCodesTable codes={formattedCodes} />
      </div>
    </div>
  );
}
