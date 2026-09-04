import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Terms of Service — QRAFT" };

export default function TermsPage() {
  return (
    <SimplePage eyebrow="Legal" title="Terms of Service">
      <p><em>Last updated: {new Date().getFullYear()}</em></p>
      <p>
        These Terms govern your use of the Qraft platform. By creating an account or using
        our services, you agree to these terms.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Use of the service</h3>
      <p>
        You agree not to use Qraft to create codes that direct to unlawful, fraudulent or
        harmful content, or to misuse the platform in any way that could damage our
        services.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Accounts</h3>
      <p>
        You are responsible for safeguarding your account credentials and for all activity
        under your account.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Contact</h3>
      <p>
        Questions about these terms? <Link href="/contact">Contact us</Link>.
      </p>
    </SimplePage>
  );
}
