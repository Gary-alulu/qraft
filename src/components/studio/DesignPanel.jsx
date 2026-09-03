"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import { QR_PATTERNS, QR_EYE_FRAMES, QR_EYE_BALLS } from "@/lib/qr-engine";
import LogoUploader from "./LogoUploader";
import FrameSelector from "./FrameSelector";

export default function DesignPanel({ options, updateOptions }) {
  const [activeTab, setActiveTab] = useState("pattern");

  const renderPattern = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Data Pattern</label>
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
    </div>
  );

  const renderColors = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Foreground Color</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["#000000", "#1E3A5F", "#00D4FF", "#FF6B2C", "#7C3AED", "#10B981"].map((c) => (
            <button
              key={c}
              onClick={() => updateOptions({ 
                dotsOptions: { color: c }, 
                cornersSquareOptions: { color: c },
                cornersDotOptions: { color: c }
              })}
              style={{
                width: "32px", height: "32px", borderRadius: "50%", background: c,
                border: options.dotsOptions?.color === c ? "2px solid var(--color-border)" : "2px solid transparent",
                outline: options.dotsOptions?.color === c ? "2px solid var(--color-primary)" : "none",
                outlineOffset: "2px", cursor: "pointer"
              }}
            />
          ))}
        </div>
        <div style={{ marginTop: "1rem" }}>
           <input type="color" value={options.dotsOptions?.color || "#000000"} onChange={(e) => updateOptions({ 
                dotsOptions: { color: e.target.value }, 
                cornersSquareOptions: { color: e.target.value },
                cornersDotOptions: { color: e.target.value }
              })} style={{ cursor: "pointer" }} />
        </div>
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Background Color</label>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["#FFFFFF", "#F0F4F8", "#FFF5F0", "#F0FAFF", "#F5F3FF"].map((c) => (
            <button
              key={c}
              onClick={() => updateOptions({ backgroundOptions: { color: c } })}
              style={{
                width: "32px", height: "32px", borderRadius: "50%", background: c,
                border: "1px solid var(--color-border)",
                outline: options.backgroundOptions?.color === c ? "2px solid var(--color-primary)" : "none",
                outlineOffset: "2px", cursor: "pointer"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>Design Studio</h2>
      
      <Tabs 
        tabs={[
          { id: "pattern", label: "Pattern" },
          { id: "colors", label: "Colors" },
          { id: "logo", label: "Logo" },
          { id: "frame", label: "Frame" }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        style={{ marginBottom: "1.5rem" }}
      />

      <div style={{ flex: 1, paddingTop: "1rem" }}>
        {activeTab === "pattern" && renderPattern()}
        {activeTab === "colors" && renderColors()}
        {activeTab === "logo" && <LogoUploader options={options} updateOptions={updateOptions} />}
        {activeTab === "frame" && <FrameSelector options={options} updateOptions={updateOptions} />}
      </div>
    </div>
  );
}
