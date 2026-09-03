"use client";

import { useState } from "react";

export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  icon,
  helpText,
  required = false,
  className = "",
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {label && (
        <label
          style={{
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "var(--color-text)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          {label}
          {required && <span style={{ color: "var(--color-accent)" }}>*</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: focused ? "var(--color-secondary)" : "var(--color-text-muted)",
              transition: "color 0.2s",
              display: "flex",
            }}
          >
            {icon}
          </span>
        )}
        <input
          className="input-qraft"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            paddingLeft: icon ? "2.75rem" : "1rem",
            borderColor: error ? "var(--color-error)" : undefined,
          }}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: "0.8125rem", color: "var(--color-error)" }}>{error}</span>
      )}
      {helpText && !error && (
        <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{helpText}</span>
      )}
    </div>
  );
}
