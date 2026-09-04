import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Privacy Policy — QRAFT" };

export default function PrivacyPage() {
  return (
    <SimplePage eyebrow="Legal" title="Privacy Policy">
      <p><em>Last updated: {new Date().getFullYear()}</em></p>
      <p>
        This Privacy Policy explains how Qraft (&quot;we&quot;, &quot;us&quot;) collects,
        uses and protects your information when you use our platform.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>What we collect</h3>
      <p>
        When you register or use our services, we may collect your name, email address,
        account preferences and the QR codes you create and manage. Scan analytics are
        aggregated where possible.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>How we use it</h3>
      <p>
        We use your information to operate the platform, provide support, improve our
        product, and communicate important updates. We do not sell your personal data.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Contact</h3>
      <p>
        Questions about your data? <Link href="/contact">Contact us</Link> or write to{" "}
        <a href="mailto:privacy@qraft.app">privacy@qraft.app</a>.
      </p>
    </SimplePage>
  );
}
