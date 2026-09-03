"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Button from "@/components/ui/Button";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started with static QR codes.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    highlight: false,
    features: [
      "5 static QR codes",
      "Basic patterns & colors",
      "PNG download",
      "Standard support",
    ],
    cta: "Get Started Free",
    ctaVariant: "secondary",
  },
  {
    name: "Pro",
    description: "For creators & small businesses who need dynamic QR.",
    monthlyPrice: 12,
    yearlyPrice: 9,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited QR codes",
      "Dynamic QR with redirects",
      "All design patterns & effects",
      "Logo upload & branding",
      "SVG & PDF export",
      "Scan analytics (30 days)",
      "5 folders",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "primary",
  },
  {
    name: "Business",
    description: "For teams that need campaigns, routing & full analytics.",
    monthlyPrice: 39,
    yearlyPrice: 29,
    highlight: false,
    features: [
      "Everything in Pro",
      "Unlimited folders & campaigns",
      "Smart routing (device, location, time)",
      "Landing page builder",
      "Full analytics (all time)",
      "Team workspace (5 members)",
      "Brand kit & asset library",
      "API access",
      "Dedicated support",
    ],
    cta: "Start Business Trial",
    ctaVariant: "primary",
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section
      id="pricing"
      className="section-padding"
      style={{ background: "var(--color-bg)", position: "relative", overflow: "hidden" }}
    >
      {/* Background blobs */}
      <div
        className="shape-blob"
        style={{
          width: "400px",
          height: "400px",
          background: "var(--color-secondary)",
          top: "10%",
          left: "-12%",
          opacity: 0.06,
        }}
      />
      <div
        className="shape-blob"
        style={{
          width: "350px",
          height: "350px",
          background: "var(--color-accent)",
          bottom: "5%",
          right: "-8%",
          opacity: 0.05,
          animationDelay: "-8s",
        }}
      />

      <div className="container-qraft" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255, 107, 44, 0.1)",
              color: "var(--color-accent)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-accent)",
              }}
            />
            Simple, transparent pricing
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "var(--color-text)",
              lineHeight: 1.15,
              marginBottom: "1rem",
            }}
          >
            Plans that grow{" "}
            <span className="gradient-text">with you</span>
          </h2>
          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            Start free, upgrade when you need dynamic codes, analytics, and team features.
          </p>

          {/* Billing toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "var(--color-surface)",
              padding: "0.375rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <button
              onClick={() => setIsYearly(false)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                background: !isYearly ? "var(--color-primary)" : "transparent",
                color: !isYearly ? "white" : "var(--color-text-secondary)",
                transition: "all 0.25s ease",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "var(--radius-pill)",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                background: isYearly ? "var(--color-primary)" : "transparent",
                color: isYearly ? "white" : "var(--color-text-secondary)",
                transition: "all 0.25s ease",
              }}
            >
              Yearly
              <span
                style={{
                  marginLeft: "0.5rem",
                  padding: "0.125rem 0.5rem",
                  borderRadius: "var(--radius-pill)",
                  background: isYearly ? "rgba(255,255,255,0.2)" : "rgba(16, 185, 129, 0.15)",
                  color: isYearly ? "white" : "var(--color-success)",
                  fontSize: "0.6875rem",
                  fontWeight: 700,
                }}
              >
                Save 25%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Cards */}
        <div
          className="pricing-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.5rem",
            alignItems: "stretch",
          }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                position: "relative",
                background: plan.highlight
                  ? "linear-gradient(135deg, var(--color-primary) 0%, #0D2137 100%)"
                  : "var(--color-surface)",
                borderRadius: "var(--radius-2xl)",
                padding: "2.5rem 2rem",
                border: plan.highlight
                  ? "1px solid rgba(0, 212, 255, 0.3)"
                  : "1px solid var(--color-border-light)",
                boxShadow: plan.highlight
                  ? "0 20px 60px rgba(0, 212, 255, 0.15)"
                  : "var(--shadow-sm)",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="card-hover"
            >
              {plan.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "0.375rem 1.25rem",
                    borderRadius: "var(--radius-pill)",
                    background: "linear-gradient(135deg, var(--color-accent), var(--color-accent-light))",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                    boxShadow: "var(--shadow-glow-orange)",
                  }}
                >
                  {plan.badge}
                </span>
              )}

              <div style={{ marginBottom: "1.5rem" }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    color: plan.highlight ? "white" : "var(--color-text)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: plan.highlight
                      ? "rgba(255,255,255,0.7)"
                      : "var(--color-text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {plan.description}
                </p>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "3rem",
                      fontWeight: 800,
                      color: plan.highlight ? "white" : "var(--color-text)",
                      lineHeight: 1,
                    }}
                  >
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span
                      style={{
                        fontSize: "0.9375rem",
                        color: plan.highlight
                          ? "rgba(255,255,255,0.6)"
                          : "var(--color-text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      /mo
                    </span>
                  )}
                </div>
                {isYearly && plan.yearlyPrice > 0 && (
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: plan.highlight
                        ? "var(--color-secondary-light)"
                        : "var(--color-success)",
                      fontWeight: 500,
                    }}
                  >
                    Billed ${plan.yearlyPrice * 12}/year
                  </span>
                )}
                {plan.monthlyPrice === 0 && (
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: plan.highlight
                        ? "rgba(255,255,255,0.6)"
                        : "var(--color-text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    Free forever
                  </span>
                )}
              </div>

              <ul style={{ listStyle: "none", padding: 0, marginBottom: "2rem", flex: 1 }}>
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      marginBottom: "0.875rem",
                      fontSize: "0.9375rem",
                      color: plan.highlight ? "rgba(255,255,255,0.85)" : "var(--color-text-secondary)",
                      lineHeight: 1.45,
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      style={{ flexShrink: 0, marginTop: "2px" }}
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="9"
                        fill={
                          plan.highlight
                            ? "rgba(0, 212, 255, 0.2)"
                            : "rgba(16, 185, 129, 0.12)"
                        }
                      />
                      <path
                        d="M5.5 9L8 11.5L12.5 7"
                        stroke={plan.highlight ? "var(--color-secondary)" : "var(--color-success)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "accent" : plan.ctaVariant}
                size="lg"
                href="/register"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  ...(plan.highlight
                    ? {
                        background: "var(--color-secondary)",
                        color: "var(--color-primary-dark)",
                      }
                    : {}),
                }}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Responsive */}
      <style jsx global>{`
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
}
