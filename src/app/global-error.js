"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[QRAFT] Unhandled client error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#F8FAFC", color: "#0A1628", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ maxWidth: 480, textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#1E3A5F", marginBottom: "0.5rem" }}>QRAFT</div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: "0 0 0.5rem" }}>Something went wrong</h1>
            <p style={{ fontSize: "0.95rem", color: "#4A5568", lineHeight: 1.55, margin: "0 0 1.5rem" }}>
              We hit an unexpected error on this page. Try reloading — if it keeps happening, contact support.
            </p>
            <button
              onClick={reset}
              style={{
                background: "#1E3A5F",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9999px",
                padding: "0.65rem 1.75rem",
                fontSize: "0.95rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}