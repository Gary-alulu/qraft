import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Changelog — QRAFT" };

const releases = [
  { version: "v1.4", date: "August 2026", note: "Improved export scaling for print-quality downloads." },
  { version: "v1.3", date: "July 2026", note: "New templates, gradient presets and rounded-corner controls." },
  { version: "v1.2", date: "June 2026", note: "Dynamic routing: device- and location-based redirects." },
  { version: "v1.1", date: "May 2026", note: "Real-time scan analytics with geographic breakdowns." },
  { version: "v1.0", date: "April 2026", note: "Launch — the Qraft QR Studio goes live." },
];

export default function ChangelogPage() {
  return (
    <SimplePage eyebrow="Changelog" title="What&apos;s new at Qraft.">
      <p>A running log of product updates and improvements.</p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "2rem" }}>
        {releases.map((r) => (
          <li
            key={r.version}
            style={{ padding: "1.25rem 0", borderBottom: "1px solid var(--color-border-light)" }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 800, color: "var(--color-text)" }}>{r.version}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)" }}>{r.date}</span>
            </div>
            <div style={{ marginTop: "0.25rem", color: "var(--color-text-secondary)" }}>{r.note}</div>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem" }}>
        Questions about a release? <Link href="/contact">Contact us</Link>.
      </p>
    </SimplePage>
  );
}
