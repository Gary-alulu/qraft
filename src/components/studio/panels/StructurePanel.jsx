"use client";

import { QR_PATTERNS, QR_EYE_FRAMES, QR_EYE_BALLS } from "@/lib/qr-engine";

export default function StructurePanel({ options, updateOptions }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Data Pattern / Modules</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {QR_PATTERNS.map((p) => (
            <button
              key={p.id}
              onClick={() => updateOptions({ dotsOptions: { type: p.value } })}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: options.dotsOptions?.type === p.value ? "var(--color-primary)" : "var(--color-border)",
                background: options.dotsOptions?.type === p.value ? "rgba(30, 58, 95, 0.05)" : "transparent",
                color: options.dotsOptions?.type === p.value ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: options.dotsOptions?.type === p.value ? 600 : 400,
                cursor: "pointer",
                textAlign: "center",
                fontSize: "0.875rem"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Eye Frame (Outer)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {QR_EYE_FRAMES.map((p) => (
            <button
              key={p.id}
              onClick={() => updateOptions({ cornersSquareOptions: { type: p.value } })}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: options.cornersSquareOptions?.type === p.value ? "var(--color-primary)" : "var(--color-border)",
                background: options.cornersSquareOptions?.type === p.value ? "rgba(30, 58, 95, 0.05)" : "transparent",
                color: options.cornersSquareOptions?.type === p.value ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: options.cornersSquareOptions?.type === p.value ? 600 : 400,
                cursor: "pointer",
                textAlign: "center",
                fontSize: "0.875rem"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Eye Center (Inner)</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {QR_EYE_BALLS.map((p) => (
            <button
              key={p.id}
              onClick={() => updateOptions({ cornersDotOptions: { type: p.value } })}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: options.cornersDotOptions?.type === p.value ? "var(--color-primary)" : "var(--color-border)",
                background: options.cornersDotOptions?.type === p.value ? "rgba(30, 58, 95, 0.05)" : "transparent",
                color: options.cornersDotOptions?.type === p.value ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: options.cornersDotOptions?.type === p.value ? 600 : 400,
                cursor: "pointer",
                textAlign: "center",
                fontSize: "0.875rem"
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Quiet Zone (Padding)</label>
        <input 
          type="range" 
          min="0" 
          max="20" 
          value={options.margin ?? 10} 
          onChange={(e) => updateOptions({ margin: parseInt(e.target.value) })}
          style={{ width: "100%", accentColor: "var(--color-primary)" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--color-text-light)", marginTop: "0.25rem" }}>
          <span>None</span>
          <span>{options.margin ?? 10}px</span>
          <span>Large</span>
        </div>
      </div>
    </div>
  );
}
