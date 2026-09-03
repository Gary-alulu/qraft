/**
 * QRAFT Next.js configuration.
 * Includes security HTTP response headers applied globally.
 *
 * NOTE: A strict Content-Security-Policy is applied only in production.
 * During `next dev`, Fast Refresh / HMR inject inline scripts and open a
 * WebSocket that a strict CSP can block — which manifests as a blank page.
 */

const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const isProd = process.env.NODE_ENV === "production";

const productionCSP = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  // 'unsafe-inline' required by Next.js inlined scripts; 'unsafe-eval' needed
  // by qr-code-styling canvas rendering at runtime.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  // blob: needed for QR code downloads (canvas.toBlob URL.createObjectURL)
  // data: needed for inline SVG / font fallbacks
  "connect-src 'self' blob: data:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = isProd
  ? [
      ...baseSecurityHeaders,
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "Content-Security-Policy", value: productionCSP },
    ]
  : baseSecurityHeaders;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Mongoose is a C++-addon package that must not be bundled into edge / client
  // chunks. Next.js will keep it as an external require in the server runtime.
  serverExternalPackages: ["mongoose"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Allow PDFs to be opened inline in the browser
        source: "/api/files/:id*",
        headers: [
          { key: "Content-Disposition", value: "inline" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
