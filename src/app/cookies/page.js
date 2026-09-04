import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Cookie Policy — QRAFT" };

export default function CookiesPage() {
  return (
    <SimplePage eyebrow="Legal" title="Cookie Policy">
      <p><em>Last updated: {new Date().getFullYear()}</em></p>
      <p>
        Qraft uses cookies and similar technologies to keep you signed in, remember your
        preferences, and understand how the platform is used.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>What are cookies?</h3>
      <p>
        Cookies are small text files stored on your device. We use essential cookies for
        authentication and security, and analytics cookies to improve our product.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Managing cookies</h3>
      <p>
        You can control or delete cookies through your browser settings. Disabling certain
        cookies may affect how the platform functions.
      </p>
      <p>See our <Link href="/privacy">Privacy Policy</Link> for more details.</p>
    </SimplePage>
  );
}
