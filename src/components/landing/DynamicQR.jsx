"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

const steps = [
  { num: "01", title: "Create", desc: "Generate a dynamic QR code with a unique short URL", color: "var(--color-secondary)" },
  { num: "02", title: "Publish", desc: "Print it on anything — posters, packaging, menus, cards", color: "var(--color-accent)" },
  { num: "03", title: "Track", desc: "See every scan in real-time with detailed analytics", color: "#7C3AED" },
  { num: "04", title: "Update", desc: "Change where the QR code points — anytime, forever", color: "#10B981" },
];

const features = [
  "Change destination without reprinting",
  "Schedule redirects by time",
  "Expire QR codes on a date",
  "Password-protect content",
  "Device-based routing (iOS → App Store)",
  "Location-based routing (country-specific pages)",
  "A/B testing destinations",
  "Campaign tracking & UTM parameters",
];

export default function DynamicQR() {
  return (
    <section id="dynamic" className="section-padding">
      <div className="container-qraft">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="dynamic-grid"
        >
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.375rem 1rem",
                borderRadius: "var(--radius-pill)",
                background: "rgba(16, 185, 129, 0.1)",
                color: "#10B981",
                fontSize: "0.8125rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              Dynamic QR Engine
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
              One QR. Infinite destinations.
            </h2>
            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-text-secondary)",
                marginBottom: "2rem",
                lineHeight: 1.65,
              }}
            >
              Dynamic QR codes redirect through Qraft&apos;s engine, letting you change the destination, track scans, and apply smart routing rules — all without reprinting.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.625rem",
              }}
            >
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.5rem",
                    fontSize: "0.875rem",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  >
                    <path
                      d="M3 8L6.5 11.5L13 5"
                      stroke="var(--color-success)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {f}
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <Button variant="primary" href="/studio">Create a Dynamic QR</Button>
              <Button variant="ghost" href="/register">Start Free</Button>
            </motion.div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-2xl)",
                padding: "2rem",
                border: "1px solid var(--color-border-light)",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem 0",
                    borderBottom: i < steps.length - 1 ? "1px solid var(--color-border-light)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-md)",
                      background: `${step.color}14`,
                      color: step.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.875rem",
                      fontFamily: "var(--font-mono)",
                      flexShrink: 0,
                    }}
                  >
                    {step.num}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: "var(--color-text)",
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Redirect visualization */}
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1.25rem",
                  background: "var(--color-bg)",
                  borderRadius: "var(--radius-lg)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    color: "var(--color-secondary-dark)",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                  }}
                >
                  qraft.app/r/abc123
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  <ArrowRight size={16} style={{ color: "var(--color-text-muted)" }} />
                  <span
                    style={{
                      padding: "0.25rem 0.75rem",
                      borderRadius: "var(--radius-pill)",
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "var(--color-success)",
                      fontWeight: 500,
                    }}
                  >
                    yoursite.com/menu
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 900px) {
          .dynamic-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
