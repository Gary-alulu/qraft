"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/ui/Button";
import ScanabilityScore from "./ScanabilityScore";
import ExportPanel from "./ExportPanel";
import { Download, X } from "lucide-react";

export default function QRPreview({ qrRef, scanability, onDownload, type = "website" }) {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "500px", position: "relative" }}>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>Live Preview</h2>
        <Button size="sm" variant="primary" onClick={() => setIsExportOpen(true)} style={{ display: "flex", gap: "0.5rem" }}>
          <Download size={16} />
          Export
        </Button>
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "white",
          padding: "2.5rem",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "2rem",
          width: "100%",
          aspectRatio: "1/1",
          border: "1px solid var(--color-border-light)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div ref={qrRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: isExportOpen ? 0.3 : 1, transition: "opacity 0.3s" }} />

        {/* Export Panel Overlay */}
        <AnimatePresence>
          {isExportOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                zIndex: 10
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Export Options</h3>
                <button 
                  onClick={() => setIsExportOpen(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
                >
                  <X size={20} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                <ExportPanel onDownload={onDownload} onClose={() => setIsExportOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div style={{ width: "100%" }}>
        <ScanabilityScore score={scanability.score} checks={scanability.checks} />
      </div>
    </div>
  );
}
