"use client";

import { motion } from "motion/react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

export default function ScanabilityScore({ score = 100, checks = [] }) {
  let color = "var(--color-success)";
  let bg = "rgba(16, 185, 129, 0.1)";
  
  if (score < 70) {
    color = "var(--color-error)";
    bg = "rgba(239, 68, 68, 0.1)";
  } else if (score < 90) {
    color = "var(--color-warning)";
    bg = "rgba(245, 158, 11, 0.1)";
  }

  return (
    <div style={{ background: "var(--color-surface)", padding: "1.5rem", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Scanability</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: bg, color: color, padding: "0.25rem 0.75rem", borderRadius: "var(--radius-pill)", fontWeight: 700 }}>
          {score} / 100
        </div>
      </div>
      
      <div style={{ width: "100%", height: "6px", background: "var(--color-border)", borderRadius: "3px", overflow: "hidden", marginBottom: "1.5rem" }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          style={{ height: "100%", background: color }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {checks.map((check, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
            <span style={{ display: "inline-flex", marginTop: "2px", color: check.status === 'pass' ? 'var(--color-success)' : check.status === 'warn' ? 'var(--color-warning)' : 'var(--color-error)' }}>
              {check.status === 'pass' ? <CheckCircle2 size={16} /> : check.status === 'warn' ? <AlertTriangle size={16} /> : <XCircle size={16} />}
            </span>
            {check.message}
          </div>
        ))}
      </div>
    </div>
  );
}
