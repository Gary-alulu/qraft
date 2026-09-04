import SimplePage from "@/components/landing/SimplePage";

export const metadata = { title: "Contact — QRAFT" };

export default function ContactPage() {
  return (
    <SimplePage eyebrow="Contact" title="Let&apos;s talk.">
      <p>
        Have a question about a feature, billing, or a custom QR project? Our team is
        happy to help. Reach us any time and we&apos;ll get back to you within one
        business day.
      </p>
      <p>
        <strong>General &amp; support:</strong>{" "}
        <a href="mailto:support@qraft.app">support@qraft.app</a>
      </p>
      <p>
        <strong>Sales &amp; partnerships:</strong>{" "}
        <a href="mailto:hello@qraft.app">hello@qraft.app</a>
      </p>
      <p>
        Or visit the{" "}
        <a href="/#faq">FAQ section on our homepage</a> for quick answers to common
        questions.
      </p>
    </SimplePage>
  );
}
