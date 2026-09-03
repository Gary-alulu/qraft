"use client";

import { motion } from "motion/react";

export default function Card({
  children,
  glass = false,
  hover = true,
  padding = "1.5rem",
  className = "",
  style = {},
  onClick,
  ...props
}) {
  return (
    <motion.div
      className={`${glass ? "glass" : ""} ${hover ? "card-hover" : ""} ${className}`}
      style={{
        background: glass ? undefined : "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        padding,
        boxShadow: "var(--shadow-sm)",
        border: glass ? undefined : "1px solid var(--color-border-light)",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
      whileHover={hover ? { y: -4 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
