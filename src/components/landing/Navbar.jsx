"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Button from "@/components/ui/Button";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: "1rem",
          left: 0,
          right: 0,
          zIndex: "var(--z-nav)",
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
      <nav
        style={{
          pointerEvents: "auto",
          width: "min(92%, 900px)",
          padding: "0.625rem 1.25rem",
          borderRadius: "var(--radius-pill)",
          background: scrolled
            ? "rgba(255, 255, 255, 0.85)"
            : "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: scrolled
            ? "1px solid rgba(209, 217, 230, 0.6)"
            : "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: scrolled ? "var(--shadow-md)" : "none",
          transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
          }}
        >
          <Image
            src="/images/nav-logo.png"
            alt="QRAFT"
            width={3652}
            height={1418}
            priority
            style={{ height: "22px", width: "auto", display: "block" }}
          />
        </a>

        {/* Desktop Links (pinned to true center of the frame) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          className="nav-links-desktop"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="link-hover"
              style={{
                padding: "0.5rem 0.875rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--color-text-secondary)",
                textDecoration: "none",
                borderRadius: "var(--radius-pill)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-primary)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-text-secondary)")
              }
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          className="nav-ctas-desktop"
        >
          <Button variant="ghost" size="sm" href="/login">
            Log in
          </Button>
          <Button variant="primary" size="sm" href="/studio">
            Create QR
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nav-hamburger"
          style={{
            display: "none",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.625rem",
            minWidth: "44px",
            minHeight: "44px",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Toggle menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <motion.path
              d={mobileOpen ? "M6 6L18 18" : "M4 7H20"}
              stroke="var(--color-text)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <motion.path
              d={mobileOpen ? "M6 18L18 6" : "M4 17H20"}
              stroke="var(--color-text)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {!mobileOpen && (
              <path
                d="M4 12H20"
                stroke="var(--color-text)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="nav-mobile-menu"
            style={{
              position: "fixed",
              top: "5rem",
              left: "4%",
              right: "4%",
              zIndex: 99,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-xl)",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  padding: "0.875rem 1rem",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--color-text)",
                  textDecoration: "none",
                  borderRadius: "var(--radius-md)",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--color-surface-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {link.label}
              </a>
            ))}
            <hr style={{ border: "none", borderTop: "1px solid var(--color-border-light)", margin: "0.5rem 0" }} />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" size="md" href="/login" style={{ flex: 1 }}>
                Log in
              </Button>
              <Button variant="primary" size="md" href="/studio" style={{ flex: 1 }}>
                Create QR
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .nav-links-desktop,
          .nav-ctas-desktop {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .nav-mobile-menu {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
