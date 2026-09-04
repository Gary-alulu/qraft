"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function ScanabilityScore({ score = 100, checks = [] }) {
  let color = "var(--color-success)";
  let bg = "rgba(16, 185, 129, 0.1)";
  let statusText = "Ready to scan";
  
  if (score < 70) {
    color = "var(--color-error)";
    bg = "rgba(239, 68, 68, 0.1)";
    statusText = "Action required";
  } else if (score < 90) {
    color = "var(--color-warning)";
    bg = "rgba(245, 158, 11, 0.1)";
    statusText = "Scannable with recommendations";
  }

  // Prioritize fails and warnings first
  const sortedChecks = [...checks].sort((a, b) => {
    const order = { fail: 0, warn: 1, pass: 2 };
    return (order[a.status] ?? 3) - (order[b.status] ?? 3);
  });

  return (
    <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Scanability</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: bg, color: color, padding: "0.25rem 0.75rem", borderRadius: "var(--radius-pill)", fontWeight: 700 }}>
          {score} / 100
        </div>
      </div>
      <div style={{ fontSize: "0.75rem", color: color, fontWeight: 600, marginBottom: "1rem" }}>
        {statusText}
      </div>
      
      <div style={{ width: "100%", height: "6px", background: "var(--color-border)", borderRadius: "3px", overflow: "hidden", marginBottom: "1.25rem" }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.3 }}
          style={{ height: "100%", background: color }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {sortedChecks.map((check, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.8125rem", color: check.status === "fail" ? "var(--color-error)" : "var(--color-text-secondary)", alignItems: "flex-start", lineHeight: "1.35" }}>
            <span style={{ display: "inline-flex", marginTop: "1px", flexShrink: 0, color: check.status === "pass" ? "var(--color-success)" : check.status === "warn" ? "var(--color-warning)" : "var(--color-error)" }}>
              {check.status === "pass" ? <CheckCircle2 size={15} /> : check.status === "warn" ? <AlertTriangle size={15} /> : <XCircle size={15} />}
            </span>
            <span>{check.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
