"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function SimplePage({ title, eyebrow, children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", background: "var(--color-bg)" }}>
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border-light)",
        }}
      >
        <div
          className="container-qraft"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0", gap: "1rem" }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <Image src="/images/nav-logo.png" alt="QRAFT" width={3652} height={1418} style={{ height: "22px", width: "auto", display: "block" }} />
          </Link>

          <div className="sp-nav-desktop" style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", textDecoration: "none" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/studio"
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                background: "var(--color-primary)",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Open Studio
            </Link>
          </div>

          <button
            type="button"
            className="sp-nav-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{
              display: "none",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d={mobileOpen ? "M6 6L18 18" : "M4 7H20"} stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" />
              <path d={mobileOpen ? "M6 18L18 6" : "M4 17H20"} stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" />
              {!mobileOpen && <path d="M4 12H20" stroke="var(--color-text)" strokeWidth="2" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div
            className="sp-nav-mobile"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              padding: "0.5rem 0 1.25rem",
            }}
          >
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: "0.9375rem", color: "var(--color-text)", textDecoration: "none", padding: "0.6rem 0.75rem", borderRadius: "var(--radius-md)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/studio"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "white",
                background: "var(--color-primary)",
                padding: "0.6rem 0.75rem",
                borderRadius: "var(--radius-pill)",
                textDecoration: "none",
                textAlign: "center",
                marginTop: "0.25rem",
              }}
            >
              Open Studio
            </Link>
          </div>
        )}
      </nav>

      <div className="container-qraft" style={{ padding: "4rem 1.25rem", maxWidth: "760px" }}>
        {eyebrow && (
          <span
            style={{
              display: "inline-block",
              padding: "0.3125rem 0.875rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(0, 212, 255, 0.1)",
              color: "var(--color-secondary-dark)",
              fontSize: "0.78125rem",
              fontWeight: 600,
              marginBottom: "1.25rem",
            }}
          >
            {eyebrow}
          </span>
        )}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--color-text)",
            marginBottom: "1.5rem",
          }}
        >
          {title}
        </h1>
        <div style={{ color: "var(--color-text-secondary)", lineHeight: 1.75 }}>{children}</div>
      </div>

      <footer
        style={{
          borderTop: "1px solid var(--color-border-light)",
          padding: "2rem 0",
          textAlign: "center",
          color: "var(--color-text-muted)",
          fontSize: "0.8125rem",
        }}
      >
        <div className="container-qraft">
          &copy; {new Date().getFullYear()} Qraft. All rights reserved.
        </div>
      </footer>

      <style jsx global>{`
        @media (max-width: 640px) {
          .sp-nav-desktop {
            display: none !important;
          }
          .sp-nav-toggle {
            display: flex !important;
          }
        }
        @media (min-width: 641px) {
          .sp-nav-mobile {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}