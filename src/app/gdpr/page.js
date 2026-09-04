import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "GDPR — QRAFT" };

export default function GdprPage() {
  return (
    <SimplePage eyebrow="Legal" title="GDPR Compliance">
      <p><em>Last updated: {new Date().getFullYear()}</em></p>
      <p>
        Qraft is committed to protecting the personal data of users in the European
        Economic Area and beyond, in line with the General Data Protection Regulation
        (GDPR).
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Your rights</h3>
      <p>
        You have the right to access, correct, export and delete your personal data, and
        to object to or restrict certain processing. Where we rely on consent, you may
        withdraw it at any time.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Data protection</h3>
      <p>
        We apply appropriate technical and organisational measures to keep your data safe,
        and we only process data for the purposes described in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Contact</h3>
      <p>
        To exercise any of your rights or ask about GDPR,{" "}
        <Link href="/contact">contact our team</Link> or email{" "}
        <a href="mailto:privacy@qraft.app">privacy@qraft.app</a>.
      </p>
    </SimplePage>
  );
}
