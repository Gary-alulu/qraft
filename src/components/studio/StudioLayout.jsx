"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function StudioLayout({ 
  leftPanel, 
  centerPanel, 
  rightPanel 
}) {
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const [activeTab, setActiveTab] = useState("content");

  if (isMobile) {
    return (
      <div style={{ height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>
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
          <div style={{ display: activeTab === "preview" ? "flex" : "none", height: "100%", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
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
