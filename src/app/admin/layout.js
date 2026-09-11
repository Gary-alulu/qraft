import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { getAdminSession } from "@/lib/admin";

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingBottom: "100px" }}>
      <header style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 clamp(1rem, 4vw, 2rem)", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.25rem", minWidth: 0 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Image src="/images/nav-logo.png" alt="QRAFT" width={3652} height={1418} style={{ height: "22px", width: "auto", display: "block", flexShrink: 0 }} />
          </Link>
          <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-secondary)", background: "var(--color-primary-light)", padding: "0.2rem 0.6rem", borderRadius: "100px", flexShrink: 0 }}>Admin</span>
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginLeft: "0.75rem" }}>
          {session.user.email}
        </div>
      </header>

      <main className="app-main" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <AdminNav />
        {children}
      </main>
    </div>
  );
}