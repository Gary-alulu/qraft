"use client";

import { motion } from "motion/react";

export default function Toggle({ checked = false, onChange, label, className = "" }) {
  return (
    <label
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.625rem",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange?.(!checked)}
        style={{
          position: "relative",
          width: "44px",
          height: "24px",
          borderRadius: "var(--radius-pill)",
          background: checked ? "var(--color-secondary)" : "var(--color-border)",
          border: "none",
          cursor: "pointer",
          transition: "background 0.25s",
          padding: 0,
        }}
      >
        <motion.div
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{
            position: "absolute",
            top: "2px",
            left: "2px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "white",
            boxShadow: "var(--shadow-sm)",
          }}
        />
      </button>
      {label && (
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--color-text)" }}>
          {label}
        </span>
      )}
    </label>
  );
}
