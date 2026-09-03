/**
 * Lightweight in-memory sliding-window rate limiter.
 * Suitable for serverless/Node runtimes where a single process handles
 * requests (or per-instance limiting is acceptable). For strict
 * distributed enforcement, back this with Redis/Upstash in production.
 */

const buckets = new Map();

// Default: 10 attempts per 60 seconds per key
const DEFAULTS = {
  limit: 10,
  windowMs: 60_000,
};

/**
 * Check whether a request is within the allowed rate.
 * @param {string} key - unique identifier (e.g. IP + route, or IP + email)
 * @param {{limit?:number, windowMs?:number}} opts
 * @returns {{ allowed: boolean, retryAfterMs: number, remaining: number }}
 */
export function checkRateLimit(key, opts = {}) {
  const { limit = DEFAULTS.limit, windowMs = DEFAULTS.windowMs } = opts;
  const now = Date.now();

  let entry = buckets.get(key);
  if (!entry || now - entry.startedAt >= windowMs) {
    entry = { startedAt: now, count: 0 };
    buckets.set(key, entry);
  }

  // prune old entries occasionally to avoid unbounded memory growth
  if (buckets.size > 10_000) prune(now, windowMs);

  if (entry.count >= limit) {
    const retryAfterMs = entry.startedAt + windowMs - now;
    return { allowed: false, retryAfterMs: Math.max(0, retryAfterMs), remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0, remaining: Math.max(0, limit - entry.count) };
}

function prune(now, windowMs) {
  for (const [key, entry] of buckets) {
    if (now - entry.startedAt >= windowMs) buckets.delete(key);
  }
}

/**
 * Best-effort IP extraction. On the edge (Vercel/Next) the real client IP is
 * exposed as `x-forwarded-for`. Never trust it for security beyond rate
 * limiting; it is only a coarse throttle key.
 */
export function getClientIp(req) {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    // take the left-most address (the original client)
    return fwd.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}
