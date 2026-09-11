"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function StudioLayout({ 
  leftPanel, 
  centerPanel, 
  rightPanel,
  activeTab: controlledTab,
  onTabChange: onControlledTabChange,
}) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  // Use controlled tab if provided, otherwise fall back to internal state.
  const [internalTab, setInternalTab] = useState("content");
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = onControlledTabChange || setInternalTab;

  if (isMobile) {
    return (
      <div className="studio-frame">
        <div style={{ padding: "0 1rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)" }}>
          <Tabs
            tabs={[
              { id: "content", label: "Content" },
              { id: "preview", label: "Preview" },
              { id: "design", label: "Design" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", background: activeTab === "preview" ? "var(--color-bg)" : "var(--color-surface)" }}>
          <div style={{ display: activeTab === "content" ? "block" : "none", padding: "1rem" }}>
            {leftPanel}
          </div>
          <div style={{ display: activeTab === "preview" ? "block" : "none", padding: "1rem" }}>
            {centerPanel}
          </div>
          <div style={{ display: activeTab === "design" ? "block" : "none", padding: "1rem" }}>
            {rightPanel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-grid">
      <div className="studio-panel">{leftPanel}</div>
      <div className="studio-preview">{centerPanel}</div>
      <div className="studio-panel">{rightPanel}</div>
    </div>
  );
}
