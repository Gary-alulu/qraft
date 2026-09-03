"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { LayoutDashboard, QrCode, TrendingUp, Settings, Plus, LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { signOut } from "next-auth/react";

export default function FloatingNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My QR Codes", href: "/dashboard/codes", icon: QrCode },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: "fixed",
        bottom: "2rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.5)",
        borderRadius: "100px",
        padding: "0.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.08)",
        zIndex: 50,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.25rem",
                  borderRadius: "100px",
                  background: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "white" : "var(--color-text-secondary)",
                  fontSize: "0.875rem",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={18} />
                <span className="nav-label" style={{ display: "none" }}>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--color-border)", margin: "0 0.5rem" }} />

      <Button href="/studio" variant="primary" style={{ borderRadius: "100px", padding: "0.75rem 1.5rem" }}>
        <Plus size={18} style={{ marginRight: "0.5rem" }} />
        <span className="nav-label" style={{ display: "none" }}>Create</span>
      </Button>

      <div style={{ width: "1px", height: "24px", background: "var(--color-border)", margin: "0 0.5rem" }} />
      
      <button 
        onClick={() => signOut({ callbackUrl: "/" })}
        style={{ 
          width: "40px", height: "40px", borderRadius: "50%", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--color-text-muted)",
          transition: "color 0.2s ease"
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-error)"}
        onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
        title="Sign Out"
      >
        <LogOut size={18} />
      </button>

      <style jsx>{`
        @media (min-width: 768px) {
          .nav-label {
            display: inline-block !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
