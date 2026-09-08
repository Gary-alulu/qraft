import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { getAdminSession } from "@/lib/admin";

export default async function AdminLayout({ children }) {
  const session = await getAdminSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingBottom: "100px" }}>
      <header style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-primary)" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "0.875rem" }}>Q</span>
          </div>
          QRAFT <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-secondary)", background: "var(--color-primary-light)", padding: "0.2rem 0.6rem", borderRadius: "100px", marginLeft: "0.25rem" }}>Admin</span>
        </div>
        <div style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
          {session.user.email}
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <AdminNav />
        {children}
      </main>
    </div>
  );
}