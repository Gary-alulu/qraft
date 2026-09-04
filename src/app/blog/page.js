import SimplePage from "@/components/landing/SimplePage";
import Link from "next/link";

export const metadata = { title: "Blog — QRAFT" };

const posts = [
  { title: "The rise of branded QR codes in 2026", date: "August 2026" },
  { title: "5 ways dynamic codes beat static ones", date: "July 2026" },
  { title: "Designing QR codes people actually scan", date: "June 2026" },
  { title: "QR analytics demystified: total vs unique scans", date: "May 2026" },
];

export default function BlogPage() {
  return (
    <SimplePage eyebrow="Blog" title="News, tips &amp; ideas from Qraft.">
      <p>Practical guides on designing, deploying and measuring QR campaigns that perform.</p>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, marginTop: "2rem" }}>
        {posts.map((p) => (
          <li
            key={p.title}
            style={{
              padding: "1.25rem 0",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <Link href="/blog" style={{ textDecoration: "none" }}>
              <span style={{ fontWeight: 700, color: "var(--color-text)", fontSize: "1.0625rem" }}>
                {p.title}
              </span>
            </Link>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              {p.date}
            </div>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "2rem" }}>
        Want more? <Link href="/contact">Get in touch</Link>.
      </p>
    </SimplePage>
  );
}
