"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, Flame, ArrowRight, X, ShieldAlert, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

export default function SmartAlertsBanner() {
  const [alerts, setAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await fetch("/api/notifications?unreadOnly=true&limit=10");
        if (!res.ok) return;
        const data = await res.json();
        // Priority to critical/warning or high performance items
        const prominent = (data.notifications || []).filter(
          (n) => n.priority === "critical" || n.priority === "warning" || n.type === "campaign_performance_increase"
        );
        setAlerts(prominent.slice(0, 2));
      } catch (e) {
        // quiet error
      }
    }
    loadAlerts();
  }, []);

  const handleDismiss = (id) => {
    setDismissed((prev) => [...prev, id]);
  };

  const visibleAlerts = alerts.filter((a) => !dismissed.includes(a._id));
  if (visibleAlerts.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
      <AnimatePresence>
        {visibleAlerts.map((alert) => {
          const isCritical = alert.priority === "critical";
          const isPerf = alert.type === "campaign_performance_increase" || alert.type === "qr_milestone";

          const bg = isCritical
            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255, 107, 44, 0.06) 100%)"
            : isPerf
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(0, 212, 255, 0.06) 100%)"
            : "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(30, 58, 95, 0.04) 100%)";

          const border = isCritical
            ? "rgba(239, 68, 68, 0.25)"
            : isPerf
            ? "rgba(16, 185, 129, 0.25)"
            : "rgba(245, 158, 11, 0.25)";

          const tagColor = isCritical
            ? "var(--color-error)"
            : isPerf
            ? "var(--color-success)"
            : "var(--color-warning)";

          const tagTitle = isCritical
            ? "ATTENTION REQUIRED"
            : isPerf
            ? "PERFORMANCE"
            : "UPCOMING ACTION";

          const IconComponent = isCritical ? AlertTriangle : isPerf ? Flame : AlertTriangle;

          return (
            <motion.div
              key={alert._id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="smart-alert"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
                position: "relative",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", flex: "1 1 240px", minWidth: 0 }}>
                <div
                  style={{
                    color: tagColor,
                    padding: "0.5rem",
                    background: "var(--color-surface)",
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "var(--shadow-sm)",
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={20} />
                </div>
                <div style={{ minWidth: 0, overflowWrap: "break-word" }}>
                  <div
                    style={{
                      fontSize: "0.6875rem",
                      fontWeight: 800,
                      letterSpacing: "0.06em",
                      color: tagColor,
                      marginBottom: "0.25rem",
                    }}
                  >
                    {tagTitle}
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.25rem" }}>
                    {alert.title}
                  </h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.4, margin: 0 }}>
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="smart-alert-actions" style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0, flexWrap: "wrap" }}>
                {alert.actionUrl && (
                  <Button
                    variant="primary"
                    size="sm"
                    href={alert.actionUrl}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                  >
                    {alert.actionLabel || "Review"} <ArrowRight size={13} />
                  </Button>
                )}
                <button
                  onClick={() => handleDismiss(alert._id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-text-muted)",
                    cursor: "pointer",
                    padding: "0.375rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "var(--radius-sm)",
                  }}
                  title="Dismiss alert"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      <style jsx>{`
        @media (max-width: 640px) {
          .smart-alert {
            padding: 1rem !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
