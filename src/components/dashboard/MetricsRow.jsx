"use client";

import { motion } from "motion/react";
import { QrCode, Scan, Activity, Folder } from "lucide-react";

export default function MetricsRow({ metrics }) {
  const cards = [
    { title: "Total QR Codes", value: metrics?.totalCodes || "0", icon: QrCode, color: "var(--color-primary)" },
    { title: "Total Scans", value: metrics?.totalScans || "0", icon: Scan, color: "var(--color-secondary)" },
    { title: "Active Campaigns", value: metrics?.activeCampaigns || "0", icon: Activity, color: "var(--color-success)" },
    { title: "Folders", value: metrics?.totalFolders || "0", icon: Folder, color: "var(--color-warning)" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          style={{
            background: "var(--color-surface)",
            padding: "1.5rem",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            alignItems: "center",
            gap: "1.25rem",
          }}
        >
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: `${card.color}15`,
            color: card.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <card.icon size={24} />
          </div>
          <div>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500, marginBottom: "0.25rem" }}>{card.title}</p>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-text)" }}>{card.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
