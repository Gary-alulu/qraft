"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";

const templates = [
  { name: "Minimal Business", cat: "Business", color: "#1E3A5F" },
  { name: "Cafe Menu", cat: "Restaurant", color: "#FF6B2C" },
  { name: "Tech Event", cat: "Events", color: "#7C3AED" },
  { name: "Boutique Sale", cat: "Retail", color: "#EC4899" },
  { name: "Luxury Estate", cat: "Real Estate", color: "#10B981" },
  { name: "App Download", cat: "Marketing", color: "#00D4FF" },
];

export default function Templates() {
  return (
    <section id="templates" className="section-padding" style={{ background: "var(--color-bg)" }}>
      <div className="container-qraft">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Start with a beautiful template
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Don't want to design from scratch? Choose from our curated library of professional QR templates for any industry.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-hover"
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                padding: "1.5rem",
                border: "1px solid var(--color-border-light)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
              }}
            >
              <div style={{ width: "120px", height: "120px", background: `${tpl.color}15`, borderRadius: "var(--radius-lg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                 <svg width="60" height="60" viewBox="0 0 160 160" fill="none">
                    <rect x="10" y="10" width="40" height="40" rx="8" stroke={tpl.color} strokeWidth="8" fill="none" />
                    <rect x="25" y="25" width="10" height="10" rx="2" fill={tpl.color} />
                    <rect x="110" y="10" width="40" height="40" rx="8" stroke={tpl.color} strokeWidth="8" fill="none" />
                    <rect x="125" y="25" width="10" height="10" rx="2" fill={tpl.color} />
                    <rect x="10" y="110" width="40" height="40" rx="8" stroke={tpl.color} strokeWidth="8" fill="none" />
                    <rect x="25" y="125" width="10" height="10" rx="2" fill={tpl.color} />
                 </svg>
              </div>
              <span style={{ fontSize: "0.75rem", color: tpl.color, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>{tpl.cat}</span>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--color-text)" }}>{tpl.name}</h3>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Button variant="primary" size="lg" href="/studio">Browse All Templates</Button>
        </div>
      </div>
    </section>
  );
}
