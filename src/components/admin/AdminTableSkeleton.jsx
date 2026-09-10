import { motion } from "motion/react";

const CELLS = [40, 20, 24, 16, 16, 24];

export default function AdminTableSkeleton({ rows = 8 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        padding: "1rem",
      }}
      role="status"
      aria-label="Loading"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem 1rem", borderBottom: "1px solid var(--color-border-light)" }}>
        <div className="skeleton" style={{ width: "90px", height: "14px" }} />
        <div className="skeleton" style={{ width: "60px", height: "14px" }} />
        <div className="skeleton" style={{ width: "70px", height: "14px" }} />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.875rem 1rem", borderBottom: "1px solid var(--color-border-light)" }}>
          {CELLS.map((w, j) => (
            <div
              key={j}
              className="skeleton"
              style={{ width: `${w}%`, height: j === 0 ? "34px" : "14px", flexShrink: 0 }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}