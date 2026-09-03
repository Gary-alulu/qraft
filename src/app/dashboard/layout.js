import FloatingNav from "@/components/dashboard/FloatingNav";

export default function DashboardLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg)", paddingBottom: "100px" }}>
      {/* Top Header (Optional, for branding) */}
      <header style={{ height: "70px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 700, fontSize: "1.25rem", color: "var(--color-primary)" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "white", fontSize: "0.875rem" }}>Q</span>
          </div>
          QRAFT
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--color-primary-light)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>G</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        {children}
      </main>

      {/* App Shell Navigation */}
      <FloatingNav />
    </div>
  );
}
