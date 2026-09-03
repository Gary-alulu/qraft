"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {label && (
        <label style={{ fontWeight: 500, fontSize: "0.875rem", color: "var(--color-text)" }}>
          {label}
        </label>
      )}
      <div ref={ref} style={{ position: "relative" }}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="input-qraft"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            textAlign: "left",
            color: selected ? "var(--color-text)" : "var(--color-text-muted)",
          }}
        >
          <span>{selected ? selected.label : placeholder}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                right: 0,
                background: "var(--color-surface)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-lg)",
                zIndex: 50,
                maxHeight: "240px",
                overflowY: "auto",
              }}
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => { onChange(option.value); setOpen(false); }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.625rem 1rem",
                    textAlign: "left",
                    border: "none",
                    background: option.value === value ? "rgba(0, 212, 255, 0.08)" : "transparent",
                    color: option.value === value ? "var(--color-primary)" : "var(--color-text)",
                    fontWeight: option.value === value ? 600 : 400,
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-hover)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = option.value === value ? "rgba(0, 212, 255, 0.08)" : "transparent"; }}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
