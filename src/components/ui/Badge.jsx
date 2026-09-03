"use client";

const badgeStyles = {
  active: { bg: "rgba(16, 185, 129, 0.1)", color: "var(--color-success)", dot: "var(--color-success)" },
  draft: { bg: "rgba(245, 158, 11, 0.1)", color: "var(--color-warning)", dot: "var(--color-warning)" },
  archived: { bg: "rgba(148, 163, 184, 0.1)", color: "var(--color-text-muted)", dot: "var(--color-text-muted)" },
  new: { bg: "rgba(0, 212, 255, 0.1)", color: "var(--color-secondary-dark)", dot: "var(--color-secondary)" },
  pro: { bg: "rgba(255, 107, 44, 0.1)", color: "var(--color-accent)", dot: "var(--color-accent)" },
};

export default function Badge({ children, variant = "active", dot = true, className = "" }) {
  const s = badgeStyles[variant] || badgeStyles.active;
  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.25rem 0.75rem",
        borderRadius: "var(--radius-pill)",
        background: s.bg,
        color: s.color,
        fontSize: "0.75rem",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {dot && (
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: s.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}
