import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Help Center — QRAFT" };

const topics = [
  "Creating and designing a QR code",
  "Making a QR code dynamic",
  "Downloading in print quality (PNG, SVG, PDF)",
  "Reading scan analytics",
  "Billing, plans and upgrading",
];

export default function HelpPage() {
  return (
    <SimplePage eyebrow="Help Center" title="How can we help?">
      <p>Browse common topics, or reach our support team for anything else.</p>
      <ul style={{ marginTop: "1.5rem", paddingLeft: "1.25rem", lineHeight: 2 }}>
        {topics.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem" }}>
        Still stuck? Check the <Link href="/#faq">FAQ</Link> or{" "}
        <Link href="/contact">contact support</Link>.
      </p>
    </SimplePage>
  );
}
