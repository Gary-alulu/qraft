import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import QRCode from "@/models/QRCode";
import Scan from "@/models/Scan";
import TimeSeriesChart from "@/components/dashboard/analytics/TimeSeriesChart";
import DevicePieChart from "@/components/dashboard/analytics/DevicePieChart";
import TopCountriesTable from "@/components/dashboard/analytics/TopCountriesTable";

export default async function AnalyticsPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  await dbConnect();
  const userId = session.user.id;

  // 1. Get all user's active QR codes
  const userCodes = await QRCode.find({ userId, status: { $ne: "archived" } }).select("_id title");
  const codeIds = userCodes.map(c => c._id);

  if (codeIds.length === 0) {
    return (
      <div style={{ padding: "4rem", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>No Data Yet</h2>
        <p style={{ color: "var(--color-text-secondary)" }}>Create and share a dynamic QR code to see analytics here.</p>
      </div>
    );
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // 2. Aggregate Time Series Data (last 30 days)
  const timeSeriesRaw = await Scan.aggregate([
    { $match: { qrCodeId: { $in: codeIds }, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        scans: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Fill in missing days with 0 scans
  const timeSeries = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const found = timeSeriesRaw.find(item => item._id === dateStr);
    timeSeries.push({
      date: new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      scans: found ? found.scans : 0
    });
  }

  // 3. Aggregate Device Distribution
  const deviceRaw = await Scan.aggregate([
    { $match: { qrCodeId: { $in: codeIds } } },
    { $group: { _id: "$deviceType", count: { $sum: 1 } } }
  ]);
  
  const devices = deviceRaw.map(d => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    value: d.count
  }));

  // 4. Aggregate Top Countries
  const countryRaw = await Scan.aggregate([
    { $match: { qrCodeId: { $in: codeIds } } },
    { $group: { _id: "$country", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const countries = countryRaw.map(c => ({
    name: c._id === "unknown" ? "Unknown Region" : c._id,
    scans: c.count
  }));

  // Total scans overall
  const totalScans = await Scan.countDocuments({ qrCodeId: { $in: codeIds } });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>
          Analytics Overview
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
          Track the performance of your dynamic QR codes across the world.
        </p>
      </div>

      <div style={{ 
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" 
      }}>
        <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Total Scans (All Time)</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginTop: "0.5rem" }}>{totalScans.toLocaleString()}</div>
        </div>
        <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Active Dynamic Codes</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginTop: "0.5rem" }}>{codeIds.length}</div>
        </div>
        <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
          <div style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500 }}>Top Device</div>
          <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", marginTop: "0.5rem" }}>
            {devices.length > 0 ? devices.sort((a,b) => b.value - a.value)[0].name : "-"}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", minHeight: "350px" }}>
           <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1.5rem" }}>Scans Over Time (30 Days)</h3>
           <TimeSeriesChart data={timeSeries} />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", flex: 1 }}>
             <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1.5rem" }}>Devices</h3>
             <DevicePieChart data={devices} />
          </div>
          
          <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", flex: 1 }}>
             <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1.5rem" }}>Top Regions</h3>
             <TopCountriesTable data={countries} />
          </div>
        </div>
      </div>
    </div>
  );
}
