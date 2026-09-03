"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      className="gradient-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        paddingTop: "8rem",
        paddingBottom: "6rem",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Floating geometric shapes */}
      <div
        className="shape-blob"
        style={{
          width: "500px",
          height: "500px",
          background: "var(--color-secondary)",
          top: "-10%",
          right: "-10%",
          opacity: 0.12,
        }}
      />
      <div
        className="shape-blob"
        style={{
          width: "400px",
          height: "400px",
          background: "var(--color-accent)",
          bottom: "5%",
          left: "-8%",
          opacity: 0.1,
          animationDelay: "-7s",
        }}
      />
      <div
        className="shape-blob"
        style={{
          width: "300px",
          height: "300px",
          background: "var(--color-primary)",
          top: "40%",
          right: "20%",
          opacity: 0.07,
          animationDelay: "-13s",
        }}
      />

      <div className="container-qraft" style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.375rem 1rem",
                  borderRadius: "var(--radius-pill)",
                  background: "rgba(0, 212, 255, 0.1)",
                  color: "var(--color-secondary-dark)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  marginBottom: "1.5rem",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--color-secondary)",
                  }}
                />
                Now with AI-powered design
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                color: "var(--color-text)",
                marginBottom: "1.5rem",
              }}
            >
              QR codes,{" "}
              <span className="gradient-text">redesigned.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: "1.1875rem",
                lineHeight: 1.65,
                color: "var(--color-text-secondary)",
                maxWidth: "520px",
                marginBottom: "2.25rem",
              }}
            >
              Create branded, dynamic QR experiences that look incredible, work
              everywhere, and give you the data to prove they work.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
            >
              <Button variant="primary" size="lg" href="/studio">
                Create a QR Code
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8H13M13 8L9 4M13 8L9 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
              <Button variant="secondary" size="lg" href="#templates">
                Explore Templates
              </Button>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--color-border-light)",
              }}
            >
              <div style={{ display: "flex" }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: `hsl(${200 + i * 30}, 60%, ${50 + i * 5}%)`,
                      border: "2px solid white",
                      marginLeft: i > 1 ? "-8px" : "0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.625rem",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: "2px",
                    marginBottom: "2px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="var(--color-accent)"
                    >
                      <path d="M8 0L10.12 5.26L16 6.15L11.68 10.06L12.83 16L8 13.27L3.17 16L4.32 10.06L0 6.15L5.88 5.26L8 0Z" />
                    </svg>
                  ))}
                </div>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: "var(--color-text-muted)",
                  }}
                >
                  Trusted by <strong style={{ color: "var(--color-text)" }}>12,000+</strong> businesses
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right — QR Studio Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-2xl)",
                boxShadow: "var(--shadow-xl)",
                overflow: "hidden",
                border: "1px solid var(--color-border-light)",
              }}
            >
              {/* Window chrome */}
              <div
                style={{
                  padding: "0.875rem 1.25rem",
                  borderBottom: "1px solid var(--color-border-light)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FF5F57",
                    }}
                  />
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FFBD2E",
                    }}
                  />
                  <span
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#27CA40",
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                  }}
                >
                  QRAFT QR STUDIO
                </div>
              </div>

              {/* Studio content mock */}
              <div style={{ padding: "2rem", textAlign: "center" }}>
                {/* QR Preview */}
                <motion.div
                  animate={{
                    boxShadow: [
                      "0 0 0 0 rgba(0, 212, 255, 0)",
                      "0 0 40px 8px rgba(0, 212, 255, 0.15)",
                      "0 0 0 0 rgba(0, 212, 255, 0)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    display: "inline-block",
                    padding: "1.5rem",
                    background: "white",
                    borderRadius: "var(--radius-xl)",
                    marginBottom: "1.5rem",
                  }}
                >
                  {/* Stylized QR SVG */}
                  <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Top-left eye */}
                    <rect x="10" y="10" width="40" height="40" rx="8" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
                    <rect x="20" y="20" width="20" height="20" rx="10" fill="var(--color-secondary)" />

                    {/* Top-right eye */}
                    <rect x="110" y="10" width="40" height="40" rx="8" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
                    <rect x="120" y="20" width="20" height="20" rx="10" fill="var(--color-secondary)" />

                    {/* Bottom-left eye */}
                    <rect x="10" y="110" width="40" height="40" rx="8" stroke="var(--color-primary)" strokeWidth="4" fill="none" />
                    <rect x="20" y="120" width="20" height="20" rx="10" fill="var(--color-secondary)" />

                    {/* QR data dots */}
                    {[
                      [60, 15], [75, 15], [90, 15],
                      [60, 30], [90, 30],
                      [60, 45], [75, 45], [90, 45],
                      [15, 60], [30, 60], [45, 60], [60, 60], [75, 60], [90, 60], [105, 60], [120, 60], [135, 60],
                      [15, 75], [45, 75], [75, 75], [105, 75], [135, 75],
                      [15, 90], [30, 90], [45, 90], [60, 90], [75, 90], [90, 90], [105, 90], [120, 90], [135, 90],
                      [60, 105], [75, 105], [90, 105],
                      [60, 120], [90, 120], [120, 120], [135, 120],
                      [60, 135], [75, 135], [90, 135], [105, 135], [120, 135], [135, 135],
                    ].map(([x, y], i) => (
                      <motion.rect
                        key={i}
                        x={x}
                        y={y}
                        width="10"
                        height="10"
                        rx="3"
                        fill="var(--color-primary)"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.5 + i * 0.015,
                          ease: [0.34, 1.56, 0.64, 1],
                        }}
                      />
                    ))}

                    {/* Center logo circle */}
                    <circle cx="80" cy="80" r="14" fill="white" />
                    <circle cx="80" cy="80" r="11" fill="var(--color-accent)" />
                    <text x="80" y="84" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">Q</text>
                  </svg>
                </motion.div>

                {/* Mini design controls */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "0.5rem",
                    flexWrap: "wrap",
                  }}
                >
                  {["Pattern", "Colors", "Logo", "Frame"].map((label, i) => (
                    <motion.span
                      key={label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                      style={{
                        padding: "0.375rem 0.875rem",
                        borderRadius: "var(--radius-pill)",
                        background:
                          i === 0
                            ? "var(--color-primary)"
                            : "var(--color-bg)",
                        color:
                          i === 0
                            ? "white"
                            : "var(--color-text-secondary)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {label}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 2.5rem !important;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </section>
  );
}
