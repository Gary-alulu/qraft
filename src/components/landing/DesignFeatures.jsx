"use client";

import { motion } from "motion/react";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.5" cy="17.5" r="3.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Custom Patterns",
    desc: "Choose from 10+ dot patterns including rounded, dots, diamond, star, and heart shapes.",
    color: "var(--color-secondary)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
    ),
    title: "Eye Customization",
    desc: "Independently style eye frames and eye balls with custom shapes, colors, and corner radii.",
    color: "var(--color-accent)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2" />
        <path d="M2 12H22" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2L12 22" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Gradients & Colors",
    desc: "Apply linear, radial, or conic gradients. Set custom foreground and background colors.",
    color: "#7C3AED",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15 8.5L22 9.27L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9.27L9 8.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
    title: "Logo Embedding",
    desc: "Upload your brand logo directly into the QR code with adjustable size, padding, and opacity.",
    color: "var(--color-primary)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M3 18V20C3 20 3 22 12 22C21 22 21 20 21 20V18" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Designer Frames",
    desc: "Add frames with call-to-action text like 'Scan Me', 'Visit Us', or your custom message.",
    color: "#10B981",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    title: "Scanability Score",
    desc: "Real-time analysis ensures your QR always works. Auto-optimize with one click.",
    color: "#EC4899",
  },
];

export default function DesignFeatures() {
  return (
    <section className="section-padding" style={{ background: "var(--color-surface)" }}>
      <div className="container-qraft">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(124, 58, 237, 0.1)",
              color: "#7C3AED",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Design Engine
          </span>
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
            Design QR codes that match your brand
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            Total creative control. Every pixel of your QR code is customizable.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card-hover"
              style={{
                background: "var(--color-bg)",
                borderRadius: "var(--radius-xl)",
                padding: "1.75rem",
                border: "1px solid var(--color-border-light)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-lg)",
                  background: `${feat.color}14`,
                  color: feat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                {feat.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--color-text)",
                  marginBottom: "0.5rem",
                }}
              >
                {feat.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
