"use client";

import { QR_FRAMES } from "@/lib/qr-engine";

export default function FrameSelector({ options, updateOptions }) {
  // Since the qr-code-styling library does not natively support advanced text frames,
  // we simulate frame selection for the UI. If you build a custom wrapper or
  // switch to a different engine, this state can map to the actual frame rendering.
  
  // For now, we'll store the frame choice in a custom property on options 
  // so we know which one is selected, even if the base library doesn't render it directly yet.
  const activeFrame = options?.frameOptions?.type || "none";
  const frameText = options?.frameOptions?.text || "SCAN ME";

  const handleFrameChange = (frameId) => {
    updateOptions({
      frameOptions: { ...options?.frameOptions, type: frameId }
    });
  };

  const handleTextChange = (e) => {
    updateOptions({
      frameOptions: { ...options?.frameOptions, text: e.target.value }
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Frame Styles */}
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
          Frame Style
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {QR_FRAMES.map((f) => {
            const isActive = activeFrame === f.id;
            return (
              <button
                key={f.id}
                onClick={() => handleFrameChange(f.id)}
                style={{
                  padding: "0.75rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid",
                  borderColor: isActive ? "var(--color-primary)" : "var(--color-border)",
                  background: isActive ? "rgba(30, 58, 95, 0.05)" : "transparent",
                  color: isActive ? "var(--color-primary)" : "var(--color-text)",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  textAlign: "center",
                  fontSize: "0.875rem",
                  transition: "all 0.15s ease"
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Text & Customization (Only show if a frame is selected) */}
      {activeFrame !== "none" && (
        <>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
              Frame Text
            </label>
            <input
              type="text"
              value={frameText}
              onChange={handleTextChange}
              maxLength={20}
              placeholder="e.g. SCAN ME"
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color: "var(--color-text)",
                fontSize: "0.9375rem",
                outline: "none"
              }}
            />
            <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Maximum 20 characters
            </p>
          </div>

          {/* Text Color */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
              Text Color
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="color"
                value={options?.frameOptions?.textColor || "#FFFFFF"}
                onChange={(e) => updateOptions({ frameOptions: { ...options?.frameOptions, textColor: e.target.value } })}
                style={{ width: "40px", height: "40px", padding: 0, border: "1px solid var(--color-border)", borderRadius: "8px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.875rem", fontFamily: "monospace", color: "var(--color-text-light)" }}>
                {(options?.frameOptions?.textColor || "#FFFFFF").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Frame Background Color */}
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>
              Frame Background
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <input
                type="color"
                value={options?.frameOptions?.backgroundColor || "#1E3A5F"}
                onChange={(e) => updateOptions({ frameOptions: { ...options?.frameOptions, backgroundColor: e.target.value } })}
                style={{ width: "40px", height: "40px", padding: 0, border: "1px solid var(--color-border)", borderRadius: "8px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "0.875rem", fontFamily: "monospace", color: "var(--color-text-light)" }}>
                {(options?.frameOptions?.backgroundColor || "#1E3A5F").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Font Size */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-text)" }}>Font Size</label>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "monospace" }}>
                {options?.frameOptions?.fontSize || 14}px
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="24"
              value={options?.frameOptions?.fontSize || 14}
              onChange={(e) => updateOptions({ frameOptions: { ...options?.frameOptions, fontSize: parseInt(e.target.value) } })}
              style={{ width: "100%", accentColor: "var(--color-primary)", cursor: "pointer" }}
            />
          </div>
        </>
      )}
    </div>
  );
}
