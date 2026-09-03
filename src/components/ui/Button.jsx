"use client";

import { motion } from "motion/react";

const variants = {
  primary: "btn-pill btn-primary",
  secondary: "btn-pill btn-secondary",
  accent: "btn-pill btn-accent",
  ghost: "btn-pill btn-ghost",
};

const sizes = {
  sm: { padding: "0.5rem 1.25rem", fontSize: "0.8125rem" },
  md: { padding: "0.75rem 1.75rem", fontSize: "0.9375rem" },
  lg: { padding: "0.875rem 2.25rem", fontSize: "1rem" },
  xl: { padding: "1rem 2.75rem", fontSize: "1.0625rem" },
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  href,
  ...props
}) {
  const baseClass = variants[variant] || variants.primary;
  const sizeStyle = sizes[size] || sizes.md;

  const content = (
    <>
      {loading && (
        <svg
          className="animate-spin"
          style={{ width: "1em", height: "1em" }}
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
          />
        </svg>
      )}
      {!loading && icon && <span style={{ display: "flex" }}>{icon}</span>}
      <span>{children}</span>
      {iconRight && <span style={{ display: "flex" }}>{iconRight}</span>}
    </>
  );

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      className={`${baseClass} ${className}`}
      style={{
        ...sizeStyle,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled || loading ? "none" : "auto",
      }}
      onClick={onClick}
      href={href}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {content}
    </Tag>
  );
}
