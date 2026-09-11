"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, QrCode, Activity, Radar, TrendingUp, Loader2 } from "lucide-react";
import { LazyAdminScansChart } from "@/components/admin/lazy-admin-charts";

const EMPTY_SERIES = Array.from({ length: 7 }, (_, i) => ({ name: `Day ${i + 1}`, scans: 0 }));

function MetricCard({ icon: Icon, label, value, sub, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border-light)",
        borderRadius: "var(--radius-xl)",
        padding: "1.5rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <div style={{ width: 38, height: 38, borderRadius: "10px", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} />
        </div>
        <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-text)", lineHeight: 1 }}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      {sub && <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>{sub}</div>}
    </motion.div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load stats");
        setStats(data.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-error)", marginBottom: "0.5rem" }}>Failed to load stats</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ height: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  const { totals, scans, series, devices, countries, plans, recentUsers, topCodes } = stats;
  const chartData = Array.isArray(series) && series.length > 0 ? series : EMPTY_SERIES;
  const maxDevice = Math.max(...devices.map((d) => d.value), 1);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>Platform Overview</h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>Key metrics across the entire QRAFT platform.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <MetricCard icon={Users} label="Total Users" value={totals.users} delay={0} />
        <MetricCard icon={QrCode} label="QR Codes" value={totals.qrCodes} sub={`${totals.dynamicCodes} dynamic`} delay={0.05} />
        <MetricCard icon={Activity} label="Total Scans" value={totals.scans} delay={0.1} />
        <MetricCard icon={TrendingUp} label="Scans (last 7 days)" value={scans.last7} sub={`${scans.today.toLocaleString()} today`} delay={0.15} />
      </div>

      <div className="q-split" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)", height: "360px" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)" }}>Scans Over Time</h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>Platform-wide, last 14 days</p>
          <div style={{ width: "100%", height: "270px", overflow: "hidden", marginLeft: "4px" }}>
            <LazyAdminScansChart data={chartData} />
          </div>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1rem" }}>Devices</h3>
            {devices.length === 0 && <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>No scans yet.</p>}
            {devices.map((d, i) => (
              <div key={d.name} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: "var(--color-text)" }}>{d.name}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{d.value.toLocaleString()}</span>
                </div>
                <div style={{ height: 6, background: "var(--color-border-light)", borderRadius: 100, overflow: "hidden" }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(d.value / maxDevice) * 100}%` }} transition={{ delay: 0.3 + i * 0.05, duration: 0.5 }}
                    style={{ height: "100%", background: "linear-gradient(90deg, var(--color-primary), var(--color-secondary))", borderRadius: 100 }} />
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1rem" }}>Plans</h3>
            {plans.map((p) => (
              <div key={p.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border-light)", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--color-text)", textTransform: "capitalize", fontWeight: 500 }}>{p.name}</span>
                <span style={{ color: "var(--color-text-secondary)" }}>{p.value}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="q-pair" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1rem" }}>
            <Radar size={16} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "var(--color-primary)" }} />
            Top Countries
          </h3>
          {countries.length === 0 && <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>No geo data yet.</p>}
          {countries.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border-light)", fontSize: "0.875rem" }}>
              <span style={{ color: "var(--color-text)", fontWeight: 500 }}>{c.name}</span>
              <span style={{ color: "var(--color-text-secondary)" }}>{c.count.toLocaleString()}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)" }}>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1rem" }}>Recent Signups</h3>
          {recentUsers.map((u) => (
            <div key={u.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid var(--color-border-light)", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--color-primary-light)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: "0.8125rem" }}>
                  {(u.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ color: "var(--color-text)", fontWeight: 500 }}>{u.name}</div>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem", overflowWrap: "break-word", wordBreak: "break-word", minWidth: 0 }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>{u.joined}</span>
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-text-muted)", background: "var(--color-border-light)", padding: "0.15rem 0.5rem", borderRadius: "100px" }}>{u.codes}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
        style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", marginTop: "1.5rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", marginBottom: "1rem" }}>Top QR Codes</h3>
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <table className="topcodes-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", minWidth: "560px" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-text-secondary)", borderBottom: "1px solid var(--color-border-light)" }}>
              <th style={{ padding: "0.5rem" }}>Code</th>
              <th style={{ padding: "0.5rem" }}>Owner</th>
              <th style={{ padding: "0.5rem" }}>Type</th>
              <th style={{ padding: "0.5rem" }}>Status</th>
              <th style={{ padding: "0.5rem", textAlign: "right" }}>Scans</th>
            </tr>
          </thead>
          <tbody>
            {topCodes.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td data-label="Code" style={{ padding: "0.5rem", color: "var(--color-text)", fontWeight: 500 }}>{c.title}</td>
                <td data-label="Owner" style={{ padding: "0.5rem", color: "var(--color-text-secondary)" }}>{c.owner}</td>
                <td data-label="Type" style={{ padding: "0.5rem", color: "var(--color-text-secondary)" }}>{c.type}{c.isDynamic ? " · dynamic" : ""}</td>
                <td data-label="Status" style={{ padding: "0.5rem" }}>
                  <span style={{ textTransform: "capitalize", fontSize: "0.8125rem", fontWeight: 600, color: c.status === "active" ? "var(--color-success)" : "var(--color-text-muted)" }}>{c.status}</span>
                </td>
                <td data-label="Scans" style={{ padding: "0.5rem", textAlign: "right", color: "var(--color-text)", fontWeight: 600 }}>{c.scans.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            .topcodes-table {
              min-width: 0 !important;
              display: block;
            }
            .topcodes-table thead {
              display: none;
            }
            .topcodes-table tbody {
              display: block;
            }
            .topcodes-table tr {
              display: block;
              padding: 0.75rem 0.5rem;
              border-bottom: 1px solid var(--color-border-light);
            }
            .topcodes-table td {
              display: block;
              padding: 0.3rem 0.75rem !important;
              text-align: left !important;
              border: none;
            }
            .topcodes-table td[data-label]::before {
              content: attr(data-label);
              display: block;
              font-size: 0.6875rem;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: var(--color-text-muted);
              font-weight: 600;
              margin-bottom: 0.25rem;
            }
            .topcodes-table td[data-label="Code"]::before {
              content: none;
            }
            .topcodes-table td[data-label="Code"] {
              padding: 0.3rem 0.75rem !important;
            }
          }
        `}</style>
      </motion.div>
    </div>
  );
}