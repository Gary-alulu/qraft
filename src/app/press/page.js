import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Press Kit — QRAFT" };

export default function PressPage() {
  return (
    <SimplePage eyebrow="Press" title="Press kit &amp; media resources.">
      <p>
        Qraft is the premium QR design, deployment, management and intelligence platform.
        Here&apos;s what you need to write about us.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>About us in one line</h3>
      <p>
        Qraft lets anyone create branded, dynamic QR codes that look incredible, work
        everywhere, and deliver real-time analytics.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Brand assets</h3>
      <p>
        The official Qraft logo uses our signature secondary-to-accent gradient. For logo
        files, screenshots or interview requests, email{" "}
        <a href="mailto:press@qraft.app">press@qraft.app</a>.
      </p>
      <p style={{ marginTop: "2rem" }}>
        More context on our story? Read <Link href="/about">About Qraft</Link>.
      </p>
    </SimplePage>
  );
}
