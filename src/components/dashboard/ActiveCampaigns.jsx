"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Activity, ExternalLink, TrendingUp } from "lucide-react";

export default function ActiveCampaigns({ campaigns = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={18} color="var(--color-success)" /> Active Campaigns
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.25rem" }}>
            Real scan counts &amp; 30-day projections from your recent scan rate.
          </p>
        </div>
        <Link href="/dashboard/analytics" style={{ color: "var(--color-primary)", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", whiteSpace: "nowrap" }}>
          View Analytics
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div style={{ padding: "2.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.9375rem", color: "var(--color-text-secondary)", marginBottom: "0.25rem" }}>
            No active campaigns yet.
          </p>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>
            Create a dynamic QR code in the studio and share it to start tracking scans.
          </p>
          <Link href="/studio" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-primary)", textDecoration: "none" }}>
            Open Studio →
          </Link>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)" }}>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>Campaign</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Total Scans</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Last 7 Days</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Daily Avg</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Projected (30 Days)</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.75rem", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 500, color: "var(--color-text)" }}>{campaign.title || "Untitled QR Code"}</td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600, textAlign: "right" }}>{campaign.totalScans.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-secondary)", textAlign: "right" }}>{campaign.last7.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-secondary)", textAlign: "right" }}>{campaign.dailyAvg.toLocaleString()}</td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontWeight: 700, color: "var(--color-success)" }}>
                      <TrendingUp size={14} /> {campaign.projected30.toLocaleString()}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", color: "var(--color-text-muted)" }}>
                      {campaign.slug && (
                        <a href={`/r/${campaign.slug}`} target="_blank" rel="noreferrer" title="Open QR link" style={{ color: "inherit", textDecoration: "none" }}>
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Link href={`/studio?edit=${campaign.id}`} title="Edit campaign" style={{ color: "inherit", textDecoration: "none" }}>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}