import SimplePage from "@/components/landing/SimplePage";

export const metadata = { title: "API — QRAFT" };

export default function ApiDocsPage() {
  return (
    <SimplePage eyebrow="API Reference" title="Build with the Qraft API.">
      <p>
        The Qraft API lets you create, manage and analyse QR codes programmatically.
        This lightweight reference covers the essentials.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Authentication</h3>
      <p>
        Authenticate requests with an API key sent in the{" "}
        <code style={{ background: "var(--color-surface)", padding: "0.125rem 0.375rem", borderRadius: "6px" }}>
          Authorization: Bearer &lt;token&gt;
        </code>{" "}
        header. Full key management is coming to the dashboard.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Create a QR code</h3>
      <p>
        <code style={{ background: "var(--color-surface)", padding: "0.125rem 0.375rem", borderRadius: "6px" }}>
          POST /api/qrcodes
        </code>
      </p>
      <p>
        Pass a <code>type</code> and the relevant payload (e.g. <code>url</code> for a
        website code). Returns the generated code with its <code>id</code> and download
        URL.
      </p>
      <h3 style={{ color: "var(--color-text)", marginTop: "2rem" }}>Analytics</h3>
      <p>
        Query scan data for dynamic codes via the dashboard&apos;s analytics views. See
        per-code totals, unique scanners, geographic and device breakdowns.
      </p>
      <p style={{ marginTop: "2rem" }}>
        Full interactive documentation is in development. Questions?{" "}
        <a href="/contact">Get in touch</a>.
      </p>
    </SimplePage>
  );
}
