"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Bell,
  Check,
  Trash2,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import NotificationDetailModal from "./NotificationDetailModal";
import { NOTIFICATION_CATEGORIES, NOTIFICATION_PRIORITIES } from "@/lib/notifications/rules";

export default function NotificationsView() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== "all" && activeCategory !== "unread") {
        params.set("category", activeCategory);
      }
      if (activeCategory === "unread" || unreadOnly) {
        params.set("unreadOnly", "true");
      }
      if (searchQuery.trim()) {
        params.set("search", searchQuery.trim());
      }
      params.set("limit", "100");

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
      setCategoryCounts(data.categoryCounts || {});
    } catch (err) {
      console.error("Notifications fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeCategory, unreadOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotifications();
  };

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

  const handleClearRead = async () => {
    try {
      const res = await fetch("/api/notifications", { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => !n.read));
      }
    } catch (err) {
      console.error("Failed to clear read:", err);
    }
  };

  const handleToggleRead = async (id, currentRead) => {
    try {
      const newRead = !currentRead;
      await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: newRead }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: newRead } : n))
      );
      setUnreadCount((c) => (newRead ? Math.max(0, c - 1) : c + 1));
    } catch (err) {
      console.error("Failed to toggle read:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const handleSimulate = async (ruleType = "all") => {
    setSimulating(true);
    try {
      const res = await fetch("/api/notifications/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleType }),
      });
      if (res.ok) {
        await fetchNotifications();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setSimulating(false);
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "performance", label: "📊 Performance", count: categoryCounts.performance?.unread },
    { id: "expiration", label: "⏰ Expiration", count: categoryCounts.expiration?.unread },
    { id: "security", label: "🚨 Security", count: categoryCounts.security?.unread },
    { id: "campaign", label: "🎯 Campaign", count: categoryCounts.campaign?.unread },
    { id: "analytics", label: "📈 Analytics", count: categoryCounts.analytics?.unread },
    { id: "system", label: "⚙️ System", count: categoryCounts.system?.unread },
    { id: "account", label: "💳 Account", count: categoryCounts.account?.unread },
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1.5rem 0" }}>
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              color: "var(--color-text)",
            }}
          >
            Notifications
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Smart telemetry alerts, scan milestones, security detections, and expiration warnings.
          </p>
        </div>

        {/* Global Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
              <Check size={14} /> Mark all read
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={handleClearRead}>
            <Trash2 size={14} /> Clear read
          </Button>
          <Button
            variant="accent"
            size="sm"
            onClick={() => handleSimulate("all")}
            disabled={simulating}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
          >
            <Sparkles size={14} />
            {simulating ? "Generating..." : "Simulate Triggers"}
          </Button>
        </div>
      </div>

      {/* Search Bar & Filters */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <form onSubmit={handleSearch} style={{ flex: "1 1 200px", minWidth: "200px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search notifications by title, message, or QR name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.625rem 1rem 0.625rem 2.25rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "0.875rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
            }}
          />
        </form>
      </div>

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          marginBottom: "1.5rem",
          scrollbarWidth: "none",
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.45rem 0.875rem",
                borderRadius: "var(--radius-pill)",
                border: "1px solid",
                borderColor: isActive ? "var(--color-primary)" : "var(--color-border-light)",
                background: isActive ? "var(--color-primary)" : "var(--color-surface)",
                color: isActive ? "white" : "var(--color-text-secondary)",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "var(--color-accent)",
                    color: "white",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    padding: "0.05rem 0.35rem",
                    borderRadius: "999px",
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 0.75rem" }} />
            <p style={{ fontSize: "0.875rem" }}>Loading your notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
            }}
          >
            <Bell size={40} style={{ margin: "0 auto 1rem", color: "var(--color-text-muted)", opacity: 0.4 }} />
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--color-text)" }}>
              No notifications found
            </h3>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", marginTop: "0.375rem", marginBottom: "1.5rem" }}>
              {activeCategory !== "all"
                ? `No notifications currently in this filter category.`
                : `Your QR codes and campaigns are running quietly.`}
            </p>
            <Button variant="primary" onClick={() => handleSimulate("all")} disabled={simulating}>
              <Sparkles size={16} /> Simulate Sample Smart Notifications
            </Button>
          </div>
        ) : (
          notifications.map((item) => {
            const cat = NOTIFICATION_CATEGORIES[item.category] || { label: item.category, icon: "🔔" };
            const priority = NOTIFICATION_PRIORITIES[item.priority] || NOTIFICATION_PRIORITIES.info;

            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-light)",
                  borderLeft: `4px solid ${priority.color}`,
                  padding: "1.25rem",
                  boxShadow: item.read ? "none" : "0 2px 8px rgba(0, 212, 255, 0.08)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  transition: "all 0.15s ease",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedNotification(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--color-border-light)";
                }}
              >
                {/* Category Icon */}
                <div
                  style={{
                    fontSize: "1.5rem",
                    lineHeight: 1,
                    padding: "0.5rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-bg)",
                    flexShrink: 0,
                  }}
                >
                  {cat.icon}
                </div>

                {/* Main Content Area */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.6875rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        color: priority.color,
                        background: priority.badgeBg,
                        padding: "0.15rem 0.5rem",
                        borderRadius: "var(--radius-pill)",
                      }}
                    >
                      {priority.label}
                    </span>

                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      • {cat.label}
                    </span>

                    {item.resourceName && (
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-primary)",
                          fontWeight: 600,
                          background: "rgba(30, 58, 95, 0.05)",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        {item.resourceName}
                      </span>
                    )}

                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                        marginLeft: "auto",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <Clock size={12} />
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: item.read ? 600 : 700,
                      color: "var(--color-text)",
                      marginBottom: "0.375rem",
                    }}
                  >
                    {item.title}
                  </h4>

                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.45,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {item.message}
                  </p>

                  {/* Actions Row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.actionUrl && (
                      <Button
                        variant="primary"
                        size="sm"
                        href={item.actionUrl}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem" }}
                      >
                        {item.actionLabel || "View"} <ExternalLink size={13} />
                      </Button>
                    )}

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedNotification(item)}
                    >
                      Inspect Details
                    </Button>

                    <button
                      onClick={() => handleToggleRead(item._id, item.read)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "0.8125rem",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      <CheckCircle2 size={14} color={item.read ? "var(--color-success)" : "var(--color-text-muted)"} />
                      {item.read ? "Mark unread" : "Mark read"}
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--color-text-muted)",
                        cursor: "pointer",
                        padding: "0.375rem",
                        borderRadius: "var(--radius-sm)",
                        marginLeft: "auto",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-error)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
                      title="Delete notification"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          isOpen={Boolean(selectedNotification)}
          onClose={() => setSelectedNotification(null)}
          onMarkRead={(id) => handleToggleRead(id, false)}
        />
      )}
    </div>
  );
}
