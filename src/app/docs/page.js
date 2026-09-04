import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Documentation — QRAFT" };

export default function DocsPage() {
  return (
    <SimplePage eyebrow="Documentation" title="Getting started with Qraft.">
      <p>
        Qraft makes it easy to create, design, deploy and track QR codes. Here&apos;s a
        quick overview of the core concepts.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Quick start</h3>
      <ol>
        <li>
          Open the <Link href="/studio">QR Studio</Link> and choose a QR type — from a
          simple URL to a vCard, event or payment.
        </li>
        <li>
          Customize the look: add a logo, a gradient, custom colors and rounded corners.
        </li>
        <li>
          Download your code in PNG, JPG, WebP or SVG at any size up to print quality.
        </li>
        <li>
          Create a <em>dynamic</em> QR to change its destination anytime and track scans.
        </li>
      </ol>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Dynamic codes &amp; analytics</h3>
      <p>
        Dynamic QR codes redirect through Qraft&apos;s engine, letting you change the
        destination, schedule redirects, expire codes, and apply device- or location-based
        routing — all without reprinting.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Documents &amp; storage</h3>
      <p>
        Document QR codes let you upload a PDF (up to 10&nbsp;MB) and link a QR code to
        it. To keep storage lean, uploaded documents are automatically deleted{" "}
        <strong>7 days after they are saved</strong>. The QR code is paused and marked
        as expired once its file is removed, so it never points at a dead link. Re-saving
        a document QR code restarts the 7-day window.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>API</h3>
      <p>
        Automate QR generation with our REST API. Head to <Link href="/api-docs">API
        reference</Link> for endpoints, authentication and examples.
      </p>
      <p style={{ marginTop: "2rem" }}>
        Need more help? <Link href="/contact">Contact our team</Link>.
      </p>
    </SimplePage>
  );
}
