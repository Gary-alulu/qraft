"use client";

import dynamic from "next/dynamic";

function ChartFallback() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "220px", display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}>
      <div className="skeleton" style={{ width: "100%", height: "220px" }} />
    </div>
  );
}

export const LazyScansChart = dynamic(() => import("./ScansChart"), {
  ssr: false,
  loading: ChartFallback,
});