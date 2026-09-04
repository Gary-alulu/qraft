"use client";

import { useState } from "react";

export default function ColorPanel({ options, updateOptions }) {
  const PRESET_COLORS = ["#000000", "#1E3A5F", "#00D4FF", "#FF6B2C", "#7C3AED", "#10B981", "#E11D48", "#2563EB"];
  const PRESET_BGS = ["#FFFFFF", "#F0F4F8", "#FFF5F0", "#F0FAFF", "#F5F3FF", "#FEF2F2", "#F0FDF4"];

  const [activeElement, setActiveElement] = useState("dots"); // dots, bg, eyeFrame, eyeCenter

  const getColor = () => {
    switch(activeElement) {
      case "dots": return options.dotsOptions?.color || "#000000";
      case "bg": return options.backgroundOptions?.color || "#FFFFFF";
      case "eyeFrame": return options.cornersSquareOptions?.color || options.dotsOptions?.color || "#000000";
      case "eyeCenter": return options.cornersDotOptions?.color || options.dotsOptions?.color || "#000000";
      default: return "#000000";
    }
  };

  const updateColor = (color) => {
    switch(activeElement) {
      case "dots":
        updateOptions({ dotsOptions: { color } });
        break;
      case "bg":
        updateOptions({ backgroundOptions: { color } });
        break;
      case "eyeFrame":
        updateOptions({ cornersSquareOptions: { color } });
        break;
      case "eyeCenter":
        updateOptions({ cornersDotOptions: { color } });
        break;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>Element to Color</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { id: "dots", label: "Modules (Pattern)" },
            { id: "bg", label: "Background" },
            { id: "eyeFrame", label: "Eye Frame" },
            { id: "eyeCenter", label: "Eye Center" }
          ].map(el => (
            <button
              key={el.id}
              onClick={() => setActiveElement(el.id)}
              style={{
                padding: "0.5rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid",
                borderColor: activeElement === el.id ? "var(--color-primary)" : "var(--color-border)",
                background: activeElement === el.id ? "rgba(30, 58, 95, 0.05)" : "transparent",
                color: activeElement === el.id ? "var(--color-primary)" : "var(--color-text)",
                fontWeight: activeElement === el.id ? 600 : 400,
                cursor: "pointer",
                textAlign: "center",
                fontSize: "0.875rem"
              }}
            >
              {el.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 600 }}>
          {activeElement === "bg" ? "Background Color" : "Foreground Color"}
        </label>
        
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {(activeElement === "bg" ? PRESET_BGS : PRESET_COLORS).map((c) => (
            <button
              key={c}
              onClick={() => updateColor(c)}
              style={{
                width: "32px", height: "32px", borderRadius: "50%", background: c,
                border: "1px solid var(--color-border)",
                outline: getColor() === c ? "2px solid var(--color-primary)" : "none",
                outlineOffset: "2px", cursor: "pointer"
              }}
            />
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input 
            type="color" 
            value={getColor()} 
            onChange={(e) => updateColor(e.target.value)} 
            style={{ 
              cursor: "pointer", 
              width: "48px", 
              height: "48px", 
              padding: "0", 
              border: "1px solid var(--color-border)",
              borderRadius: "8px"
            }} 
          />
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: "0.875rem", color: "var(--color-text-light)" }}>Custom Hex</span>
            <div style={{ fontSize: "1rem", fontWeight: 500, fontFamily: "monospace" }}>{getColor().toUpperCase()}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "1rem", background: "rgba(30, 58, 95, 0.02)", borderRadius: "var(--radius-md)", border: "1px dashed var(--color-border)" }}>
        <p style={{ fontSize: "0.875rem", color: "var(--color-text-light)", margin: 0, textAlign: "center" }}>
          Pro Tip: Maintain high contrast between modules and background for reliable scanning.
        </p>
      </div>
    </div>
  );
}
