import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Status — QRAFT" };

export default function StatusPage() {
  return (
    <SimplePage eyebrow="System Status" title="All systems operational.">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "1rem 1.25rem",
          borderRadius: "var(--radius-lg)",
          background: "rgba(16, 185, 129, 0.1)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          color: "var(--color-success)",
          fontWeight: 600,
          margin: "2rem 0",
        }}
      >
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--color-success)" }} />
        All services operational
      </div>
      <p>
        QR generation, dynamic redirects and analytics are all running normally. Historical
        uptime is available on request.
      </p>
      <p>
        Something looks wrong? <Link href="/contact">Report an issue</Link>.
      </p>
    </SimplePage>
  );
}
