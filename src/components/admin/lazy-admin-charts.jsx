"use client";

import dynamic from "next/dynamic";

function ChartFallback() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "220px" }}>
      <div className="skeleton" style={{ width: "100%", height: "220px" }} />
    </div>
  );
}

export const LazyAdminScansChart = dynamic(() => import("./AdminScansChart"), {
  ssr: false,
  loading: ChartFallback,
});