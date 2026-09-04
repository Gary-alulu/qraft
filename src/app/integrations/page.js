import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Integrations — QRAFT" };

const integrations = [
  "Shopify — embed QR codes on products and receipts",
  "Mailchimp — add QR to email campaigns",
  "Zapier — automate QR creation and data export",
  "Google Analytics — connect scan events",
  "Slack — scan alerts and reporting",
];

export default function IntegrationsPage() {
  return (
    <SimplePage eyebrow="Integrations" title="Connect Qraft to your stack.">
      <p>Plug Qraft into the tools you already use to automate and scale your QR campaigns.</p>
      <ul style={{ listStyle: "none", padding: 0, marginTop: "1.5rem", lineHeight: 2 }}>
        {integrations.map((i) => (
          <li key={i} style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ color: "var(--color-success)" }}>✓</span> {i}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem" }}>
        Want an integration we don&apos;t list? <Link href="/contact">Let us know</Link>.
      </p>
    </SimplePage>
  );
}
