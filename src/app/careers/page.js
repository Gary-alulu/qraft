import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Careers — QRAFT" };

export default function CareersPage() {
  return (
    <SimplePage eyebrow="Careers" title="Come build the future of QR.">
      <p>
        We&apos;re a small, design-obsessed team building the premium QR platform. We care
        about craft, measurable outcomes and shipping beautiful software.
      </p>
      <p>
        We&apos;re always looking for great engineers, designers and marketers. Open roles
        are posted as they become available.
      </p>
      <p style={{ marginTop: "2rem" }}>
        Introduce yourself at <a href="mailto:jobs@qraft.app">jobs@qraft.app</a> — we&apos;d
        love to hear from you. Or learn more <Link href="/about">about Qraft</Link>.
      </p>
    </SimplePage>
  );
}
