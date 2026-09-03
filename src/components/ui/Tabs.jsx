"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

export default function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabRefs = useRef([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((t) => t.id === activeTab);
    const el = tabRefs.current[activeIndex];
    if (el) {
      setIndicatorStyle({
        left: el.offsetLeft,
        width: el.offsetWidth,
      });
    }
  }, [activeTab, tabs]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        display: "flex",
        gap: "0.25rem",
        borderBottom: "1px solid var(--color-border-light)",
        paddingBottom: "0",
      }}
    >
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[i] = el)}
          type="button"
          onClick={() => onChange(tab.id)}
          style={{
            padding: "0.625rem 1rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: activeTab === tab.id ? 600 : 400,
            color: activeTab === tab.id ? "var(--color-primary)" : "var(--color-text-muted)",
            transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {tab.icon && <span style={{ marginRight: "0.375rem" }}>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
      <motion.div
        className="tab-indicator"
        animate={indicatorStyle}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  );
}
