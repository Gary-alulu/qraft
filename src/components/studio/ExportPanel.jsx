"use client";

import { useState } from "react";
import { useSession } from "@/components/providers/AuthProvider";
import Button from "@/components/ui/Button";
import useMediaQuery from "@/hooks/useMediaQuery";
import { Download } from "lucide-react";

const formats = [
  { id: "png", label: "PNG", description: "Best for digital use" },
  { id: "jpeg", label: "JPG", description: "Smaller file size" },
  { id: "webp", label: "WebP", description: "Next-gen web format" },
  { id: "svg", label: "SVG", description: "Infinite scale, good for print" },
];

const sizes = [
  { id: 256, label: "Small (256px)" },
  { id: 512, label: "Medium (512px)" },
  { id: 1024, label: "Large (1024px)" },
  { id: 2048, label: "Print (2048px)" },
];

const qualities = [
  { id: 0.6, label: "Low", hint: "Smallest file" },
  { id: 0.8, label: "Medium", hint: "Balanced" },
  { id: 0.95, label: "High", hint: "Best quality" },
];

export default function ExportPanel({ onDownload, onClose }) {
  const [format, setFormat] = useState("png");
  const [size, setSize] = useState(1024);
  const [quality, setQuality] = useState(0.95);
  const { status } = useSession();
  const isReady = status === "authenticated";
  const isLoading = status === "loading";
  const isSmall = useMediaQuery("(max-width: 640px)");

  const formatGrid = isSmall
    ? { display: "flex", flexDirection: "column", gap: "0.5rem" }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" };

  const optionGrid = isSmall
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }
    : { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" };

  // Quality only applies to lossy raster formats; PNG is lossless and SVG is
  // vector, so those are unaffected by the quality setting.
  const qualityApplies = format === "jpeg" || format === "webp";

  const handleExport = () => {
    onDownload(format, `qraft-qr-${size}`, size, quality);
    if (onClose) onClose();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
          File Format
        </label>
        <div style={formatGrid}>
          {formats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFormat(f.id);
                if (f.id === "svg" && qualityApplies) setQuality(0.95);
              }}
              style={{
                padding: isSmall ? "0.875rem" : "0.75rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: format === f.id ? "var(--color-primary)" : "var(--color-border)",
                background: format === f.id ? "rgba(30, 58, 95, 0.05)" : "var(--color-surface)",
                textAlign: "left",
                cursor: "pointer",
                minHeight: "52px",
                transition: "all 0.15s ease",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: format === f.id ? "var(--color-primary)" : "var(--color-border)",
                    flexShrink: 0,
                  }}
                />
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: format === f.id ? "var(--color-primary)" : "var(--color-text)" }}>
                  {f.label}
                </div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginLeft: "1.25rem" }}>
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
        <div style={optionGrid}>
          {sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSize(s.id)}
              disabled={format === "svg"} // SVG is infinite scale
              style={{
                padding: isSmall ? "0.75rem 0.5rem" : "0.625rem",
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
                minHeight: "44px",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
          {format === "svg" ? "Resolution doesn't apply to vector formats like SVG." : `Exported at ${size}×${size}px${qualityApplies ? ` in ${qualities.find((q) => q.id === quality)?.label.toLowerCase() || "high"} quality` : ""}.`}
        </p>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
          File Quality
        </label>
        <div style={optionGrid}>
          {qualities.map((q) => {
            const disabled = !qualityApplies;
            const active = quality === q.id && !disabled;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setQuality(q.id)}
                disabled={disabled}
                style={{
                  padding: "0.625rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid",
                  borderColor: active ? "var(--color-primary)" : "var(--color-border)",
                  background: active ? "rgba(30, 58, 95, 0.05)" : "transparent",
                  opacity: disabled ? 0.45 : 1,
                  color: active ? "var(--color-primary)" : "var(--color-text)",
                  cursor: disabled ? "not-allowed" : "pointer",
                  textAlign: "center",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div style={{ fontSize: "0.8125rem", fontWeight: active ? 700 : 500 }}>{q.label}</div>
                <div style={{ fontSize: "0.6875rem", color: "var(--color-text-muted)" }}>{q.hint}</div>
              </button>
            );
          })}
        </div>
        {!qualityApplies && (
          <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
            {format === "png" ? "PNG is lossless — quality stays at its best." : "Vector formats aren't affected by quality."}
          </p>
        )}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        {isReady ? (
          <Button variant="primary" style={{ width: "100%", justifyContent: "center", gap: "0.5rem" }} onClick={handleExport}>
            <Download size={18} />
            Download {format.toUpperCase()}
          </Button>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              padding: "1.25rem",
              borderRadius: "var(--radius-lg)",
              background: "rgba(0, 212, 255, 0.06)",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              textAlign: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
              Create a free account to export your QR code
            </p>
            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
              New here? Sign up free. Already registered? Sign in to continue.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Button variant="primary" href="/register" size="md" style={{ flex: 1, justifyContent: "center", fontWeight: 600 }} disabled={isLoading}>
                Sign up free
              </Button>
              <Button variant="secondary" href="/login" size="md" style={{ flex: 1, justifyContent: "center", fontWeight: 600 }} disabled={isLoading}>
                Sign in
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}