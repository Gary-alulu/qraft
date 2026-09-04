"use client";

import { useState } from "react";
import Tabs from "@/components/ui/Tabs";
import LogoUploader from "./LogoUploader";
import FrameSelector from "./FrameSelector";
import StructurePanel from "./panels/StructurePanel";
import ColorPanel from "./panels/ColorPanel";

export default function DesignPanel({ options, updateOptions }) {
  const [activeTab, setActiveTab] = useState("structure");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "1.5rem" }}>Design Studio</h2>
      
      <div style={{ overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
        <Tabs 
          tabs={[
            { id: "structure", label: "Structure" },
            { id: "colors", label: "Colors" },
            { id: "logo", label: "Logo" },
            { id: "frame", label: "Frame" }
          ]} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      <div style={{ flex: 1, paddingTop: "0.5rem" }}>
        {activeTab === "structure" && <StructurePanel options={options} updateOptions={updateOptions} />}
        {activeTab === "colors" && <ColorPanel options={options} updateOptions={updateOptions} />}
        {activeTab === "logo" && <LogoUploader options={options} updateOptions={updateOptions} />}
        {activeTab === "frame" && <FrameSelector options={options} updateOptions={updateOptions} />}
      </div>
    </div>
  );
}
