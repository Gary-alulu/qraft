"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Button from "@/components/ui/Button";
import ScanabilityScore from "./ScanabilityScore";
import ExportPanel from "./ExportPanel";
import useMediaQuery from "@/hooks/useMediaQuery";
import { X } from "lucide-react";

export default function QRPreview({ qrRef, scanability, onDownload, type = "website" }) {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 640px)");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "500px", position: "relative" }}>
      <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.75rem", marginTop: isMobile ? "1rem" : "1.5rem", marginBottom: isMobile ? "1rem" : "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, fontFamily: "var(--font-display)" }}>Live Preview</h2>
        <Button size="sm" variant="secondary" onClick={() => setIsExportOpen(true)} style={{ fontWeight: 600, boxShadow: "var(--shadow-sm)" }}>
          Export QR
        </Button>
      </div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: "white",
          padding: isMobile ? "1.25rem" : "2.5rem",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-lg)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: isMobile ? "1.25rem" : "2rem",
          width: "100%",
          aspectRatio: "1/1",
          border: "1px solid var(--color-border-light)",
          position: "relative",
          overflow: isMobile ? "visible" : "hidden"
        }}
      >
        <div ref={qrRef} style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", opacity: isExportOpen ? 0.3 : 1, transition: "opacity 0.3s" }} />

        {/* Desktop: export options overlay the QR card */}
        {!isMobile && (
          <AnimatePresence>
            {isExportOpen && (
              <motion.div
                key="export-sheet-desktop"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255, 255, 255, 0.96)",
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
                    aria-label="Close export options"
                    style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                  <ExportPanel onDownload={onDownload} onClose={() => setIsExportOpen(false)} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>

      {/* Mobile: bottom sheet pinned to the viewport so the export options stay
          usable instead of being squashed into the QR square. Rendered as a
          sibling so no transform/overflow ancestor breaks `position: fixed`. */}
      {isMobile && (
        <AnimatePresence>
          {isExportOpen && (
            <motion.div
              key="export-sheet-mobile"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 80 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "fixed",
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.98)",
                backdropFilter: "blur(10px)",
                padding: "1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom))",
                display: "flex",
                flexDirection: "column",
                zIndex: 50,
                maxHeight: "82vh",
                borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
                boxShadow: "0 -12px 40px rgba(0, 0, 0, 0.18)",
                borderTop: "1px solid var(--color-border-light)",
                touchAction: "pan-y",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "0.5rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "40px",
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--color-border)",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", marginTop: "0.75rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, fontFamily: "var(--font-display)", color: "var(--color-text)" }}>Export Options</h3>
                <button
                  onClick={() => setIsExportOpen(false)}
                  aria-label="Close export options"
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--color-text-muted)",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
                <ExportPanel onDownload={onDownload} onClose={() => setIsExportOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <div style={{ width: "100%" }}>
        <ScanabilityScore score={scanability.score} checks={scanability.checks} />
      </div>
    </div>
  );
}