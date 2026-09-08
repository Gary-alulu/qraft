import FloatingNav from "@/components/dashboard/FloatingNav";
import Image from "next/image";
import { auth } from "@/auth";
import UserAvatar from "@/components/ui/UserAvatar";
import { gravatarUrlFromEmail } from "@/lib/gravatar";

export default async function DashboardLayout({ children }) {
  const session = await auth();
  const displayName = session?.user?.name || "User";
  const email = session?.user?.email || "";
  const gravatarSrc = email ? gravatarUrlFromEmail(email, 80) : "";

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingBottom: "100px" }}>
      {/* Top Header */}
      <header style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Image src="/images/nav-logo.png" alt="QRAFT" width={3652} height={1418} style={{ height: "22px", width: "auto", display: "block" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <a href="/dashboard/settings" style={{ textDecoration: "none", display: "flex" }} title="Account Settings">
            <UserAvatar
              name={displayName}
              gravatarSrc={gravatarSrc}
              size={36}
              style={{
                border: "2px solid var(--color-border-light)",
                boxShadow: "0 2px 8px rgba(30,58,95,0.12)",
                transition: "box-shadow 0.2s ease",
              }}
            />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="app-main" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {children}
      </main>

      {/* App Shell Navigation */}
      <FloatingNav />
    </div>
  );
}
