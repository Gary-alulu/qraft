"use client";

import { motion } from "motion/react";
import Button from "@/components/ui/Button";
import {
  Globe,
  Link2,
  FileText,
  User,
  Smartphone,
  Contact,
  Phone,
  Mail,
  MessageSquare,
  MessageCircle,
  Building2,
  Star,
  Utensils,
  Package,
  ClipboardList,
  Calendar,
  CalendarDays,
  CheckCircle2,
  Ticket,
  CreditCard,
  Landmark,
  Banknote,
  Wifi,
  MapPin,
  StickyNote,
  Paperclip,
} from "lucide-react";

const categories = [
  {
    name: "Links",
    color: "#00D4FF",
    items: [
      { Icon: Globe, label: "Website", desc: "Link to any URL" },
      { Icon: Link2, label: "Dynamic URL", desc: "Changeable destination" },
      { Icon: FileText, label: "Landing Page", desc: "Qraft-hosted page" },
      { Icon: User, label: "Social Profile", desc: "All social links" },
      { Icon: Smartphone, label: "App Link", desc: "App store redirect" },
    ],
  },
  {
    name: "Contact",
    color: "#7C3AED",
    items: [
      { Icon: Contact, label: "vCard", desc: "Digital business card" },
      { Icon: Phone, label: "Phone", desc: "Direct call" },
      { Icon: Mail, label: "Email", desc: "Pre-filled email" },
      { Icon: MessageSquare, label: "SMS", desc: "Text message" },
      { Icon: MessageCircle, label: "WhatsApp", desc: "WhatsApp message" },
    ],
  },
  {
    name: "Business",
    color: "#FF6B2C",
    items: [
      { Icon: Building2, label: "Business Profile", desc: "Company info" },
      { Icon: Star, label: "Reviews", desc: "Get customer reviews" },
      { Icon: Utensils, label: "Menu", desc: "Restaurant menu" },
      { Icon: Package, label: "Product", desc: "Product details" },
      { Icon: ClipboardList, label: "Feedback", desc: "Collect feedback" },
    ],
  },
  {
    name: "Events",
    color: "#10B981",
    items: [
      { Icon: Calendar, label: "Event", desc: "Event details" },
      { Icon: CalendarDays, label: "Calendar", desc: "Add to calendar" },
      { Icon: CheckCircle2, label: "RSVP", desc: "Event registration" },
      { Icon: Ticket, label: "Ticket", desc: "Event ticket" },
    ],
  },
  {
    name: "Payments",
    color: "#EC4899",
    items: [
      { Icon: CreditCard, label: "Payment Link", desc: "Accept payments" },
      { Icon: Landmark, label: "M-Pesa", desc: "Mobile money" },
      { Icon: Banknote, label: "PayPal", desc: "PayPal payment" },
    ],
  },
  {
    name: "Utilities",
    color: "#F59E0B",
    items: [
      { Icon: Wifi, label: "Wi-Fi", desc: "Share Wi-Fi access" },
      { Icon: MapPin, label: "Location", desc: "Map location" },
      { Icon: StickyNote, label: "Text", desc: "Plain text" },
      { Icon: Paperclip, label: "PDF / File", desc: "File download" },
    ],
  },
];

export default function QRTypes() {
  return (
    <section id="features" className="section-padding">
      <div className="container-qraft">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "3.5rem" }}
        >
          <span
            style={{
              display: "inline-block",
              padding: "0.375rem 1rem",
              borderRadius: "var(--radius-pill)",
              background: "rgba(255, 107, 44, 0.1)",
              color: "var(--color-accent)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              marginBottom: "1rem",
            }}
          >
            30+ QR Types
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "var(--color-text)",
              marginBottom: "0.75rem",
            }}
          >
            Every QR code you&apos;ll ever need
          </h2>
          <p
            style={{
              fontSize: "1.0625rem",
              color: "var(--color-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
            }}
          >
            From simple URLs to complex vCards, events, payments, and more — all beautifully designed.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {categories.map((cat, ci) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: ci * 0.08 }}
              style={{
                background: "var(--color-surface)",
                borderRadius: "var(--radius-xl)",
                border: "1px solid var(--color-border-light)",
                overflow: "hidden",
              }}
              className="card-hover"
            >
              <div
                style={{
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--color-border-light)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: cat.color,
                  }}
                />
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "var(--color-text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {cat.name}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.75rem",
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                  }}
                >
                  {cat.items.length} types
                </span>
              </div>
              <div style={{ padding: "0.5rem" }}>
                {cat.items.map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.625rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--color-surface-hover)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        width: "38px",
                        height: "38px",
                        flexShrink: 0,
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "var(--radius-md)",
                        background: cat.color + "1A",
                        color: cat.color,
                      }}
                    >
                      <item.Icon size={18} strokeWidth={2} />
                    </span>
                    <div>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          color: "var(--color-text)",
                        }}
                      >
                        {item.label}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--color-text-muted)",
                        }}
                      >
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Button variant="primary" size="lg" href="/studio">Build Your QR Code</Button>
        </div>
      </div>
    </section>
  );
}
