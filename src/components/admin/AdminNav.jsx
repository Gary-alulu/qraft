"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Shield, Users, QrCode, ArrowLeft } from "lucide-react";

const tabs = [
  { name: "Overview", href: "/admin", icon: Shield },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "QR Codes", href: "/admin/qrcodes", icon: QrCode },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2rem" }}>
      {tabs.map((tab) => {
        const isActive = tab.href === "/admin" ? pathname === "/admin" : pathname.startsWith(tab.href);
        return (
          <Link key={tab.name} href={tab.href} style={{ textDecoration: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "100px",
                background: isActive ? "var(--color-surface)" : "transparent",
                border: `1px solid ${isActive ? "var(--color-primary)" : "var(--color-border-light)"}`,
                color: isActive ? "var(--color-primary)" : "var(--color-text-secondary)",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
                transition: "all 0.2s ease",
              }}
            >
              <tab.icon size={16} />
              {tab.name}
            </div>
          </Link>
        );
      })}
      <div style={{ flex: 1 }} />
      <Link href="/dashboard" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--color-text-secondary)", fontSize: "0.875rem", fontWeight: 500, padding: "0.6rem 1.1rem", borderRadius: "100px", border: "1px solid var(--color-border-light)" }}>
        <ArrowLeft size={15} />
        Back to app
      </Link>
    </div>
  );
}