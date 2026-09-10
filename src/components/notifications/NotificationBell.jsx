"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, ExternalLink, ArrowRight, Clock } from "lucide-react";
import NotificationDetailModal from "./NotificationDetailModal";
import { NOTIFICATION_CATEGORIES } from "@/lib/notifications/rules";

// Utility for relative time strings
function formatRelativeTime(dateString) {
  const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) {
    const mins = Math.floor(diff / 60);
    return `${mins}m ago`;
  }
  if (diff < 86400) {
    const hours = Math.floor(diff / 3600);
    return `${hours}h ago`;
  }
  const days = Math.floor(diff / 86400);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Utility for grouping notifications into TODAY, YESTERDAY, EARLIER
function groupNotificationsByDay(notifications) {
  const today = [];
  const yesterday = [];
  const earlier = [];

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;

  notifications.forEach((item) => {
    const itemTime = new Date(item.createdAt).getTime();
    if (itemTime >= startOfToday) {
      today.push(item);
    } else if (itemTime >= startOfYesterday) {
      yesterday.push(item);
    } else {
      earlier.push(item);
    }
  });

  const groups = [];
  if (today.length > 0) groups.push({ label: "TODAY", items: today });
  if (yesterday.length > 0) groups.push({ label: "YESTERDAY", items: yesterday });
  if (earlier.length > 0) groups.push({ label: "EARLIER", items: earlier });

  return groups;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=15");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAllRead" }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleMarkSingleRead = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handleItemClick = (notif) => {
    if (!notif.read) {
      handleMarkSingleRead(notif._id);
    }
    setSelectedNotification(notif);
  };

  const grouped = groupNotificationsByDay(notifications);

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          border: "1px solid var(--color-border-light)",
          background: isOpen ? "var(--color-surface-hover)" : "var(--color-surface)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: unreadCount > 0 ? "var(--color-primary)" : "var(--color-text-secondary)",
          position: "relative",
          transition: "all 0.2s ease",
          boxShadow: "var(--shadow-sm)",
        }}
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              background: "var(--color-accent)",
              color: "white",
              fontSize: "0.6875rem",
              fontWeight: 700,
              minWidth: "18px",
              height: "18px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              boxShadow: "0 2px 6px rgba(255, 107, 44, 0.4)",
              border: "2px solid var(--color-surface)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Flyout Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: "380px",
              maxWidth: "90vw",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "0 20px 45px rgba(10, 22, 40, 0.15)",
              zIndex: 100,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--color-border-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(180deg, rgba(240,244,248,0.4) 0%, rgba(255,255,255,0) 100%)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--color-text)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "rgba(0, 212, 255, 0.15)",
                      color: "var(--color-primary)",
                      padding: "0.125rem 0.5rem",
                      borderRadius: "var(--radius-pill)",
                    }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--color-primary)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                  }}
                >
                  <Check size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* Notification List with Timeline grouping */}
            <div style={{ maxHeight: "380px", overflowY: "auto" }}>
              {notifications.length === 0 ? (
                <div style={{ padding: "2.5rem 1.5rem", textAlign: "center", color: "var(--color-text-muted)" }}>
                  <Bell size={28} style={{ margin: "0 auto 0.5rem", opacity: 0.4 }} />
                  <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>All caught up!</p>
                  <p style={{ fontSize: "0.75rem", marginTop: "0.25rem" }}>No notifications at this moment.</p>
                </div>
              ) : (
                grouped.map((group) => (
                  <div key={group.label}>
                    {/* Section Header */}
                    <div
                      style={{
                        padding: "0.5rem 1.25rem",
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        color: "var(--color-text-muted)",
                        background: "rgba(240, 244, 248, 0.5)",
                        borderTop: "1px solid var(--color-border-light)",
                        borderBottom: "1px solid var(--color-border-light)",
                      }}
                    >
                      {group.label}
                    </div>

                    {/* Section Items */}
                    {group.items.map((item) => {
                      const cat = NOTIFICATION_CATEGORIES[item.category] || { icon: "🔔" };
                      return (
                        <div
                          key={item._id}
                          onClick={() => handleItemClick(item)}
                          style={{
                            padding: "0.875rem 1.25rem",
                            borderBottom: "1px solid var(--color-border-light)",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "0.75rem",
                            cursor: "pointer",
                            background: item.read ? "transparent" : "rgba(0, 212, 255, 0.03)",
                            transition: "background 0.15s ease",
                            position: "relative",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--color-surface-hover)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = item.read
                              ? "transparent"
                              : "rgba(0, 212, 255, 0.03)";
                          }}
                        >
                          {/* Unread Blue Indicator Dot */}
                          {!item.read && (
                            <span
                              style={{
                                position: "absolute",
                                left: "6px",
                                top: "18px",
                                width: "6px",
                                height: "6px",
                                borderRadius: "50%",
                                background: "#00D4FF",
                              }}
                            />
                          )}

                          {/* Icon */}
                          <div
                            style={{
                              fontSize: "1.125rem",
                              lineHeight: 1,
                              flexShrink: 0,
                              marginTop: "2px",
                            }}
                          >
                            {cat.icon}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: "0.875rem",
                                fontWeight: item.read ? 600 : 700,
                                color: "var(--color-text)",
                                marginBottom: "0.15rem",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.title}
                              </span>
                              <span
                                style={{
                                  fontSize: "0.6875rem",
                                  fontWeight: 500,
                                  color: "var(--color-text-muted)",
                                  flexShrink: 0,
                                  marginLeft: "0.5rem",
                                }}
                              >
                                {formatRelativeTime(item.createdAt)}
                              </span>
                            </p>
                            <p
                              style={{
                                fontSize: "0.8125rem",
                                color: "var(--color-text-secondary)",
                                lineHeight: 1.35,
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {item.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "0.75rem 1.25rem",
                borderTop: "1px solid var(--color-border-light)",
                background: "var(--color-bg)",
                textAlign: "center",
              }}
            >
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-primary)",
                  textDecoration: "none",
                }}
              >
                View all notifications <ArrowRight size={13} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={Boolean(selectedNotification)}
          onClose={() => setSelectedNotification(null)}
          onMarkRead={handleMarkSingleRead}
        />
      )}
    </div>
  );
}
