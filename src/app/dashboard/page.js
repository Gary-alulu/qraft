import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import Folder from "@/models/Folder";
import MetricsRow from "@/components/dashboard/MetricsRow";
import ScansChart from "@/components/dashboard/ScansChart";
import RecentCodesTable from "@/components/dashboard/RecentCodesTable";

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
        <ScansChart />
        <RecentCodesTable codes={formattedCodes} />
      </div>
    </div>
  );
}
