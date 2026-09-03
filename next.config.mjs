/**
 * QRAFT Next.js configuration.
 * Includes security HTTP response headers applied globally.
 *
 * NOTE: A strict Content-Security-Policy is applied only in production.
 * During `next dev`, Fast Refresh / HMR inject inline scripts and open a
 * WebSocket that a strict CSP can block — which manifests as a blank page.
 * We therefore send a relaxed (or no) CSP in development and reserve the
 * hardened policy for production builds.
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
  // Google fonts used by next/font/google from the layout
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self'",
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
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
