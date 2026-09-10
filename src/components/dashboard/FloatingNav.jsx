"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { LayoutDashboard, QrCode, TrendingUp, Settings, Plus, LogOut, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import { useSession } from "@/components/providers/AuthProvider";

export default function FloatingNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My QR Codes", href: "/dashboard/codes", icon: QrCode },
    { name: "Analytics", href: "/dashboard/analytics", icon: TrendingUp },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  if (user?.role === "admin") {
    navItems.push({ name: "Admin", href: "/admin", icon: Shield });
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        position: "fixed",
        bottom: "1rem",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        padding: "0 0.75rem",
      }}
    >
    <div
      className="floating-nav-pill"
      style={{
        pointerEvents: "auto",
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
        maxWidth: "100%",
        overflowX: "auto",
        scrollbarWidth: "none",
        WebkitOverflowScrolling: "touch",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href} style={{ textDecoration: "none" }}>
              <motion.div
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
                  transition: "background 0.2s var(--ease-smooth), color 0.2s var(--ease-smooth)",
                  cursor: "pointer",
                }}
              >
                <item.icon size={18} />
                <span className="nav-label" style={{ display: "none" }}>{item.name}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div style={{ width: "1px", height: "24px", background: "var(--color-border)", margin: "0 0.5rem" }} />

      <Button href="/studio" variant="primary" style={{ borderRadius: "100px", padding: "0.75rem 1.25rem" }}>
        <Plus size={18} className="nav-create-icon" />
        <span className="nav-label" style={{ display: "none" }}>Create</span>
      </Button>

      <div style={{ width: "1px", height: "24px", background: "var(--color-border)", margin: "0 0.5rem" }} />
      
<motion.button
        onClick={handleSignOut}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          width: "40px", height: "40px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--color-text-muted)",
          transition: "color 0.2s ease, background 0.2s ease"
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-error)"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; e.currentTarget.style.background = "transparent"; }}
        title="Sign Out"
      >
        <LogOut size={18} />
      </motion.button>

      <style jsx>{`
        @media (min-width: 768px) {
          .nav-label {
            display: inline-block !important;
          }
          .nav-create-icon {
            display: none !important;
          }
        }
        .floating-nav-pill::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
    </motion.div>
  );
}
