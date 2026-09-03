"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";

export default function QRCreatorDemo() {
  const [url, setUrl] = useState("https://qraft.app");
  const [dotType, setDotType] = useState("rounded");
  const [fgColor, setFgColor] = useState("#1E3A5F");
  const qrContainerRef = useRef(null);
  const qrInstanceRef = useRef(null);

  const patterns = [
    { id: "square", label: "Square" },
    { id: "dots", label: "Dots" },
    { id: "rounded", label: "Rounded" },
    { id: "classy-rounded", label: "Classy" },
    { id: "extra-rounded", label: "Smooth" },
  ];

  const colors = [
    "#1E3A5F",
    "#00D4FF",
    "#FF6B2C",
    "#7C3AED",
    "#10B981",
    "#EC4899",
  ];

  const initQR = useCallback(async () => {
    const mod = await import("qr-code-styling");
    const QRCodeStyling = mod.default;
    const instance = new QRCodeStyling({
      width: 220,
      height: 220,
      type: "svg",
      data: url || "https://qraft.app",
      dotsOptions: { color: fgColor, type: dotType },
      cornersSquareOptions: { color: fgColor, type: "extra-rounded" },
      cornersDotOptions: { color: "#00D4FF", type: "dot" },
      backgroundOptions: { color: "#FFFFFF" },
      qrOptions: { errorCorrectionLevel: "M" },
    });
    qrInstanceRef.current = instance;
    if (qrContainerRef.current) {
      qrContainerRef.current.innerHTML = "";
      instance.append(qrContainerRef.current);
    }
  }, []);

  useEffect(() => {
    initQR();
  }, [initQR]);

  useEffect(() => {
    if (qrInstanceRef.current) {
      qrInstanceRef.current.update({
        data: url || "https://qraft.app",
        dotsOptions: { color: fgColor, type: dotType },
        cornersSquareOptions: { color: fgColor, type: "extra-rounded" },
        cornersDotOptions: { color: "#00D4FF", type: "dot" },
      });
    }
  }, [url, dotType, fgColor]);

  return (
    <section id="demo" className="section-padding" style={{ background: "var(--color-surface)" }}>
      <div className="container-qraft">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(0, 212, 255, 0.1)",
              color: "var(--color-secondary-dark)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            Try it now
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
            Create a QR code in seconds
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Type any URL, customize the style, and watch your QR code come alive instantly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "3rem",
            alignItems: "center",
            maxWidth: "800px",
            margin: "0 auto",
            padding: "2.5rem",
            background: "var(--color-bg)",
            borderRadius: "var(--radius-2xl)",
            border: "1px solid var(--color-border-light)",
          }}
          className="demo-grid"
        >
          {/* Controls */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Enter your URL
              </label>
              <input
                className="input-qraft"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{ fontSize: "1rem" }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Pattern
              </label>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {patterns.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDotType(p.id)}
                    style={{
                      padding: "0.4375rem 0.875rem",
                      borderRadius: "var(--radius-pill)",
                      border: "1.5px solid",
                      borderColor:
                        dotType === p.id
                          ? "var(--color-secondary)"
                          : "var(--color-border)",
                      background:
                        dotType === p.id
                          ? "rgba(0, 212, 255, 0.08)"
                          : "transparent",
                      color:
                        dotType === p.id
                          ? "var(--color-primary)"
                          : "var(--color-text-secondary)",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--color-text)",
                }}
              >
                Color
              </label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFgColor(c)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: c,
                      border: fgColor === c ? "3px solid var(--color-secondary)" : "3px solid transparent",
                      cursor: "pointer",
                      transition: "border-color 0.2s, transform 0.2s",
                      transform: fgColor === c ? "scale(1.15)" : "scale(1)",
                    }}
                  />
                ))}
              </div>
            </div>

            <Button variant="primary" size="md" href="/studio">
              Open Full Studio
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>

          {/* QR Preview */}
          <div
            style={{
              padding: "2rem",
              background: "white",
              borderRadius: "var(--radius-xl)",
              boxShadow: "var(--shadow-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div ref={qrContainerRef} style={{ width: "220px", height: "220px" }} />
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        @media (max-width: 700px) {
          .demo-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
