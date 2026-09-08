"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Loader2, ExternalLink } from "lucide-react";

const STATUS_STYLES = {
  active: { color: "var(--color-success)", background: "rgba(16, 185, 129, 0.12)" },
  paused: { color: "var(--color-text-muted)", background: "var(--color-border-light)" },
  archived: { color: "var(--color-text-muted)", background: "var(--color-border-light)" },
};

export default function AdminQRCodesPage() {
  const [codes, setCodes] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/admin/qrcodes", { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load codes");
        setCodes(data.data);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid rgba(239,68,68,0.2)" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-error)", marginBottom: "0.5rem" }}>Failed to load QR codes</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>{error}</p>
      </div>
    );
  }

  if (!codes) {
    return (
      <div style={{ height: "40vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 700, color: "var(--color-text)" }}>QR Codes</h1>
        <p style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem" }}>{codes.length} most recent codes across the platform.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ textAlign: "left", color: "var(--color-text-secondary)", borderBottom: "1px solid var(--color-border-light)", background: "rgba(0,0,0,0.015)" }}>
              <th style={{ padding: "0.75rem 1rem" }}>Code</th>
              <th style={{ padding: "0.75rem 1rem" }}>Owner</th>
              <th style={{ padding: "0.75rem 1rem" }}>Type</th>
              <th style={{ padding: "0.75rem 1rem" }}>Status</th>
              <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Scans</th>
              <th style={{ padding: "0.75rem 1rem" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <div style={{ color: "var(--color-text)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {c.title}
                    {c.shortSlug && (
                      <a href={`/r/${c.shortSlug}`} target="_blank" rel="noopener noreferrer" style={{ color: "var(--color-text-muted)", display: "inline-flex" }} title={`/r/${c.shortSlug}`}>
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                  <div style={{ color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>{c.type}</div>
                </td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-secondary)" }}>{c.owner}</td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-secondary)" }}>{c.isDynamic ? "Dynamic" : "Static"}</td>
                <td style={{ padding: "0.75rem 1rem" }}>
                  <span style={{ textTransform: "capitalize", fontSize: "0.8125rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "100px", ...(STATUS_STYLES[c.status] || STATUS_STYLES.active) }}>{c.status}</span>
                </td>
                <td style={{ padding: "0.75rem 1rem", textAlign: "right", color: "var(--color-text)", fontWeight: 600 }}>{c.scans.toLocaleString()}</td>
                <td style={{ padding: "0.75rem 1rem", color: "var(--color-text-secondary)", fontSize: "0.8125rem" }}>{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}