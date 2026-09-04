import Link from "next/link";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Templates", href: "/#templates" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function SimplePage({ title, eyebrow, children }) {
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
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 0" }}
        >
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "9px",
                background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "white", fontWeight: 800, fontFamily: "var(--font-display)" }}>Q</span>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--color-text)" }}>
              QRAFT
            </span>
          </Link>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
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
              }}
            >
              Open Studio
            </Link>
          </div>
        </div>
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
    </main>
  );
}
