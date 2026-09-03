"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Download } from "lucide-react";

export default function ExportPanel({ onDownload, onClose }) {
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState(1024);

  const formats = [
    { id: "png", label: "PNG", description: "Best for digital use" },
    { id: "svg", label: "SVG", description: "Infinite scale, good for print" },
    { id: "jpeg", label: "JPG", description: "Smaller file size" },
    { id: "webp", label: "WebP", description: "Next-gen web format" },
  ];

  const sizes = [
    { id: 256, label: "Small (256px)" },
    { id: 512, label: "Medium (512px)" },
    { id: 1024, label: "Large (1024px)" },
    { id: 2048, label: "Print (2048px)" },
  ];

  const handleExport = () => {
    onDownload(format, `qraft-qr-${size}`, size);
    if (onClose) onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
          File Format
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {formats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              style={{
                padding: "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: format === f.id ? "var(--color-primary)" : "var(--color-border)",
                background: format === f.id ? "rgba(30, 58, 95, 0.05)" : "var(--color-surface)",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <div style={{ fontSize: "0.875rem", fontWeight: 600, color: format === f.id ? "var(--color-primary)" : "var(--color-text)", marginBottom: "0.25rem" }}>
                {f.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                {f.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
          Resolution
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {sizes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSize(s.id)}
              disabled={format === "svg"} // SVG is infinite scale
              style={{
                padding: "0.625rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: size === s.id && format !== "svg" ? "var(--color-primary)" : "var(--color-border)",
                background: size === s.id && format !== "svg" ? "rgba(30, 58, 95, 0.05)" : "transparent",
                color: size === s.id && format !== "svg" ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: size === s.id && format !== "svg" ? 600 : 400,
                opacity: format === "svg" ? 0.5 : 1,
                cursor: format === "svg" ? "not-allowed" : "pointer",
                textAlign: "center",
                fontSize: "0.8125rem",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        {format === "svg" && (
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            Resolution doesn't apply to vector formats like SVG.
          </p>
        )}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <Button variant="primary" style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }} onClick={handleExport}>
          <Download size={18} />
          Download {format.toUpperCase()}
        </Button>
      </div>
    </div>
  );
}
