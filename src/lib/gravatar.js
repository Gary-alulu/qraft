/**
 * Gravatar utilities for Qraft.
 *
 * Works in both Node.js (server components, API routes) and the browser
 * (client components via Web Crypto). The hash is computed once and the
 * resulting URL is passed as a prop so no async work is needed in components.
 */

/**
 * MD5 hash using Node's built-in `crypto` module.
 * Call this from server components / route handlers.
 *
 * @param {string} email
 * @returns {string} hex MD5 hash
 */
export function md5Server(email) {
  // Dynamic require so this file stays importable on the client side
  // (the client path never calls this function).
  const crypto = require("crypto");
  return crypto
    .createHash("md5")
    .update(email.trim().toLowerCase())
    .digest("hex");
}

/**
 * Build a Gravatar URL from a pre-computed MD5 hash.
 *
 * @param {string} hash       MD5 hash of the normalised email address
 * @param {number} size       Pixel size (1–2048), default 200
 * @param {string} fallback   Gravatar default fallback type:
 *                              "mp"   – mystery person silhouette (recommended)
 *                              "identicon" – geometric pattern
 *                              "retro"     – pixel-art style
 * @returns {string} HTTPS Gravatar URL
 */
export function gravatarUrl(hash, size = 200, fallback = "mp") {
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${fallback}&r=pg`;
}

/**
 * Convenience: hash + URL in one call (server-only).
 *
 * @param {string} email
 * @param {number} [size=200]
 * @param {string} [fallback="mp"]
 * @returns {string} full Gravatar URL
 */
export function gravatarUrlFromEmail(email, size = 200, fallback = "mp") {
  if (!email) return "";
  const hash = md5Server(email);
  return gravatarUrl(hash, size, fallback);
}
