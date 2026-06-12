/**
 * Minimal in-memory fixed-window rate limiter, keyed by IP.
 *
 * Good enough for a demo: state lives per serverless instance, so on Vercel
 * the effective limit is per-instance rather than global. For production,
 * swap for Upstash Redis / Vercel KV.
 */
const WINDOW_MS = 60_000;
const LIMIT = Number(process.env.RATE_LIMIT_PER_MINUTE ?? 10);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function checkRateLimit(key: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= LIMIT) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

// Opportunistic cleanup so the map doesn't grow unbounded on long-lived instances.
setInterval(() => {
  const now = Date.now();
  buckets.forEach((bucket, key) => {
    if (now >= bucket.resetAt) buckets.delete(key);
  });
}, WINDOW_MS).unref?.();
