"use client";

import { motion } from "motion/react";

const metrics = [
  { label: "Total Scans", value: "24,891" },
  { label: "Unique Scanners", value: "18,204" },
  { label: "Active Codes", value: "94" },
];

const countries = [
  { name: "Kenya", code: "KE", count: "8,201", pct: 45 },
  { name: "Uganda", code: "UG", count: "4,203", pct: 25 },
  { name: "Tanzania", code: "TZ", count: "2,921", pct: 15 },
  { name: "UK", code: "GB", count: "1,542", pct: 10 },
];

const devices = [
  { name: "iPhone", pct: 48, color: "#1E3A5F" },
  { name: "Android", pct: 42, color: "#00D4FF" },
  { name: "Desktop", pct: 10, color: "#FF6B2C" },
];

export default function Analytics() {
  return (
    <section className="section-padding" style={{ background: "var(--color-bg-dark)", color: "white" }}>
      <div className="container-qraft">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="analytics-grid"
        >
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.375rem 1rem",
                borderRadius: "var(--radius-pill)",
                background: "rgba(0, 212, 255, 0.15)",
                color: "var(--color-secondary)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Professional Analytics
            </span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "white",
                marginBottom: "0.75rem",
              }}
            >
              Know exactly what happens after the scan.
            </h2>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "2rem",
                lineHeight: 1.65,
              }}
            >
              Get deep insights into your audience. Track total scans, unique visitors, devices, locations, and time of day in a beautiful, real-time dashboard.
            </p>

            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                "Real-time scan tracking",
                "Geographic location mapping",
                "Device and browser breakdown",
                "Time-of-day scan analysis"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "rgba(255,255,255,0.9)", fontSize: "0.9375rem" }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="rgba(0, 212, 255, 0.2)" />
                    <path d="M6 10L9 13L14 7" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Right - Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-2xl)",
              padding: "1.5rem",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Metrics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    padding: "1rem",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "0.25rem", fontWeight: 600, textTransform: "uppercase" }}>{m.label}</div>
                  <div style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>{m.value}</div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Location */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "1.25rem",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>Top Locations</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {countries.map((c) => (
                    <div key={c.code}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "0.25rem" }}>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>{c.name}</span>
                        <span>{c.count}</span>
                      </div>
                      <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${c.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.8 }}
                          style={{ height: "100%", background: "var(--color-secondary)" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Devices */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "1.25rem",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div style={{ fontSize: "0.875rem", fontWeight: 600, marginBottom: "1rem" }}>Devices</div>
                <div style={{ display: "flex", alignItems: "flex-end", height: "100px", gap: "10%", paddingBottom: "10px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  {devices.map((d, i) => (
                    <div key={d.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: `${d.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.9 + i * 0.1 }}
                        style={{ width: "100%", background: d.color, borderRadius: "4px 4px 0 0" }}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.625rem", color: "rgba(255,255,255,0.5)" }}>
                  {devices.map(d => <span key={d.name}>{d.name}</span>)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 900px) {
          .analytics-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
