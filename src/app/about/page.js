import SimplePage from "@/components/landing/SimplePage";

export const metadata = { title: "About — QRAFT" };

export default function AboutPage() {
  return (
    <SimplePage eyebrow="About Qraft" title="We craft QR codes that feel premium.">
      <p>
        Qraft is the premium QR design, deployment, management and intelligence platform.
        We believe a QR code is more than a black-and-white square — it&apos;s the first
        impression of your brand in the physical world.
      </p>
      <p>
        That&apos;s why we built a design-first QR platform: beautiful, branded codes with
        gradients, logos and custom shapes, plus dynamic redirects, real-time analytics and
        smart routing rules — all in one place.
      </p>
      <p>
        Whether you&apos;re a small business printing your first menu or an enterprise
        running campaigns across twenty countries, Qraft gives you the tools to create codes
        people actually want to scan.
      </p>
    </SimplePage>
  );
}
