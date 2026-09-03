"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export function AccordionItem({ title, children, isOpen, onToggle, icon }) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--color-border-light)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "1.125rem 0",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--color-text)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {icon && <span style={{ color: "var(--color-secondary)" }}>{icon}</span>}
          {title}
        </span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M5 7.5L10 12.5L15 7.5"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                paddingBottom: "1.125rem",
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
              }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Accordion({ items = [], className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className={className}>
      {items.map((item, i) => (
        <AccordionItem
          key={i}
          title={item.title}
          icon={item.icon}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  );
}
