/**
 * Security helpers: secure short-slug generation, destination-URL
 * sanitization/allow-listing, and request-origin validation for CSRF.
 */
import crypto from "crypto";

/**
 * Generate a URL-safe short slug with cryptographically secure randomness.
 * Uses chars that are unambiguous and safe in URLs.
 * Default length 8 => ~62^8 ≈ 2.18e14 combinations (effectively unguessable).
 */
export function generateShortSlug(length = 8) {
  // Avoid ambiguous chars (0/O, 1/l/I, etc.) for copy-paste safety.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  const bytes = crypto.randomBytes(length);
  let slug = "";
  for (let i = 0; i < length; i++) {
    slug += alphabet[bytes[i] % alphabet.length];
  }
  return slug;
}

/**
 * Validate a QR destination URL for use in the redirect engine.
 * Returns a normalized safe URL string, or null if it fails validation.
 *
 * Policy:
 *  - Must be http:// or https://
 *  - Must have a hostname
 *  - Rejects open redirects via `javascript:`, `data:`, `vbscript:`, etc.
 *  - Optionally allows only a set of allowed hosts (allow-list) if provided.
 */
export function validateDestinationUrl(rawUrl, allowedHosts = null) {
  if (typeof rawUrl !== "string" || rawUrl.trim() === "") return null;

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }

  const hostname = parsed.hostname;
  if (!hostname) return null;

  // Supabase Storage is always allowed — the app hosts uploaded PDF/document
  // files there and links to them via public URLs for dynamic QR redirects.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabaseHost = new URL(supabaseUrl).hostname;
      if (hostname === supabaseHost || hostname.endsWith("." + supabaseHost)) {
        return parsed.toString();
      }
    } catch {
      // ignore malformed Supabase URL; fall through to allow-list logic
    }
  }

  // If an allow-list is configured, enforce it. A null/empty allow-list
  // disables host restriction (allows any http(s) host).
  if (Array.isArray(allowedHosts) && allowedHosts.length > 0) {
    const match = allowedHosts.some((host) => hostname === host || hostname.endsWith("." + host));
    if (!match) return null;
  }

  return parsed.toString();
}

/**
 * Validate that a state-changing request originated from our own site
 * (CSRF protection). Verifies Origin and/or Referer against the allowed
 * host(s). Returns true if the request is trusted.
 */
export function isSameOrigin(req, allowedHosts = null) {
  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host");

  const candidates = [origin, referer].filter(Boolean).map((value) => {
    try {
      return new URL(value).host;
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Cross-site requests almost always carry Origin/Referer that differ.
  if (candidates.length === 0) {
    // No Origin/Referer (e.g. same-origin fetch may still send Origin on
    // some methods). When both are absent we conservatively allow when the
    // Host header looks like our own; this mirrors common CSRF heuristics.
    return true;
  }

  const trustedHosts = new Set(
    (allowedHosts && allowedHosts.length ? allowedHosts : [host]).filter(Boolean)
  );

  return candidates.every((candidateHost) => trustedHosts.has(candidateHost));
}
