"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Check, ShieldAlert, AlertTriangle, Sparkles, Clock, Globe, Smartphone, Activity } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from "@/lib/notifications/rules";

export default function NotificationDetailModal({ notification, isOpen, onClose, onMarkRead }) {
  if (!notification || !isOpen) return null;

  const category = NOTIFICATION_CATEGORIES[notification.category] || { label: notification.category, icon: "🔔" };
  const priority = NOTIFICATION_PRIORITIES[notification.priority] || NOTIFICATION_PRIORITIES.info;
  const meta = notification.metadata || {};

  const handleAction = () => {
    if (onMarkRead && !notification.read) {
      onMarkRead(notification._id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const getPriorityBadgeVariant = (p) => {
    switch (p) {
      case "critical": return "error";
      case "warning": return "warning";
      case "success": return "success";
      default: return "default";
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(10, 22, 40, 0.45)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            background: "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-light)",
            boxShadow: "0 24px 60px rgba(10, 22, 40, 0.2)",
            maxWidth: "540px",
            width: "100%",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid var(--color-border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(180deg, rgba(240,244,248,0.5) 0%, rgba(255,255,255,0) 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "1.25rem" }}>{category.icon}</span>
              <Badge variant={getPriorityBadgeVariant(notification.priority)}>
                {priority.label.toUpperCase()}
              </Badge>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", fontWeight: 500 }}>
                {category.label}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                padding: "0.375rem",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text)";
                e.currentTarget.style.background = "var(--color-surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.background = "none";
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div style={{ padding: "1.5rem" }}>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-text)",
                fontFamily: "var(--font-display)",
                marginBottom: "0.5rem",
              }}
            >
              {notification.title}
            </h3>

            {notification.resourceName && (
              <p style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 600, marginBottom: "0.75rem" }}>
                Target: {notification.resourceName}
              </p>
            )}

            <p style={{ fontSize: "0.9375rem", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "1.25rem" }}>
              {notification.message}
            </p>

            {/* Rich Telemetry Grid */}
            {Object.keys(meta).length > 0 && (
              <div
                style={{
                  background: "var(--color-bg)",
                  borderRadius: "var(--radius-lg)",
                  padding: "1rem",
                  border: "1px solid var(--color-border-light)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                  gap: "0.75rem",
                  marginBottom: "1.25rem",
                }}
              >
                {meta.detectedTraffic !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Detected</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-error)" }}>
                      {Number(meta.detectedTraffic).toLocaleString()} scans
                    </strong>
                  </div>
                )}
                {meta.expectedTraffic && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Expected</span>
                    <strong style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
                      {meta.expectedTraffic}
                    </strong>
                  </div>
                )}
                {meta.differencePercent && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Difference</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-error)" }}>
                      {meta.differencePercent}
                    </strong>
                  </div>
                )}
                {meta.topSource && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Top Country</span>
                    <strong style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
                      {meta.topSource}
                    </strong>
                  </div>
                )}
                {meta.topDevice && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Top Device</span>
                    <strong style={{ fontSize: "0.9375rem", color: "var(--color-text)" }}>
                      {meta.topDevice}
                    </strong>
                  </div>
                )}
                {meta.milestone !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Milestone</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-success)" }}>
                      {Number(meta.milestone).toLocaleString()} scans
                    </strong>
                  </div>
                )}
                {meta.multiplier && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Velocity</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-warning)" }}>
                      {meta.multiplier}× normal
                    </strong>
                  </div>
                )}
                {meta.daysLeft !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Time Left</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-warning)" }}>
                      {meta.daysLeft} days
                    </strong>
                  </div>
                )}
                {meta.httpStatus && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>HTTP Status</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-error)" }}>
                      {meta.httpStatus} Error
                    </strong>
                  </div>
                )}
                {meta.scoreBefore !== undefined && meta.scoreAfter !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Scanability</span>
                    <strong style={{ fontSize: "0.9375rem", color: "var(--color-warning)" }}>
                      {meta.scoreBefore} → {meta.scoreAfter}
                    </strong>
                  </div>
                )}
                {meta.conversionRate !== undefined && (
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", display: "block" }}>Conversion</span>
                    <strong style={{ fontSize: "1rem", color: "var(--color-success)" }}>
                      {meta.conversionRate}%
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Action */}
            {meta.recommendedAction && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.06)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.875rem",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-error)", display: "block", marginBottom: "0.25rem" }}>
                  Recommended Action
                </span>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", lineHeight: 1.4 }}>
                  {meta.recommendedAction}
                </p>
              </div>
            )}

            {/* Timestamp */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
              <Clock size={13} />
              <span>
                Detected: {new Date(notification.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* Modal Actions */}
          <div
            style={{
              padding: "1rem 1.5rem",
              background: "var(--color-bg)",
              borderTop: "1px solid var(--color-border-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              {!notification.read && (
                <button
                  onClick={() => onMarkRead(notification._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.8125rem",
                    color: "var(--color-text-secondary)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    fontWeight: 500,
                  }}
                >
                  <Check size={14} /> Mark as read
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
              {notification.actionUrl && (
                <Button variant="primary" size="sm" onClick={handleAction} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}>
                  {notification.actionLabel || "View"} <ExternalLink size={13} />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
