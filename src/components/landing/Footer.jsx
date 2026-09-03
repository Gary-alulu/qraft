"use client";

import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "QR Studio", href: "/studio" },
    { label: "Templates", href: "/#templates" },
    { label: "Dynamic QR", href: "/#dynamic" },
    { label: "Analytics", href: "/#analytics" },
    { label: "Pricing", href: "/#pricing" },
    { label: "API", href: "/api-docs" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
    { label: "Press Kit", href: "/press" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Integrations", href: "/integrations" },
    { label: "Changelog", href: "/changelog" },
    { label: "Status", href: "/status" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "GDPR", href: "/gdpr" },
  ],
};

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/qraft",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com/qraft",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/qraft",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/qraft",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--color-primary-dark)",
        color: "rgba(255, 255, 255, 0.7)",
        paddingTop: "5rem",
        paddingBottom: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent, var(--color-secondary), var(--color-accent), transparent)",
        }}
      />

      <div className="container-qraft">
        {/* Top — CTA + Social */}
        <div
          className="footer-top"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "3rem",
            marginBottom: "4rem",
            flexWrap: "wrap",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "340px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1.25rem",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--color-secondary), var(--color-accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 800,
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Q
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "white",
                }}
              >
                QRAFT
              </span>
            </div>
            <p
              style={{
                fontSize: "0.9375rem",
                lineHeight: 1.65,
                color: "rgba(255, 255, 255, 0.55)",
                marginBottom: "1.5rem",
              }}
            >
              The premium QR design, deployment, management and intelligence platform. Create beautiful QR codes that work everywhere.
            </p>

            {/* Social */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255, 255, 255, 0.55)",
                    transition: "all 0.2s ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.55)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div
            className="footer-links"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2.5rem",
              flex: 1,
              maxWidth: "680px",
            }}
          >
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "1.25rem",
                  }}
                >
                  {category}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {links.map((link) => (
                    <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                      <Link
                        href={link.href}
                        style={{
                          fontSize: "0.875rem",
                          color: "rgba(255, 255, 255, 0.5)",
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "rgba(255, 255, 255, 0.5)";
                        }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255, 255, 255, 0.08)",
            marginBottom: "2rem",
          }}
        />

        {/* Bottom */}
        <div
          className="footer-bottom"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.4)" }}>
            &copy; {new Date().getFullYear()} Qraft. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link
              href="/privacy"
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255, 255, 255, 0.4)",
                textDecoration: "none",
              }}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255, 255, 255, 0.4)",
                textDecoration: "none",
              }}
            >
              Terms
            </Link>
            <Link
              href="/cookies"
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255, 255, 255, 0.4)",
                textDecoration: "none",
              }}
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .footer-top {
            flex-direction: column;
          }
          .footer-links {
            grid-template-columns: repeat(2, 1fr) !important;
            max-width: 100% !important;
          }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
