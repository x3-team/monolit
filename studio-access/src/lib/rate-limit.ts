/**
 * Minimal in-memory fixed-window rate limiter.
 *
 * Good enough for a single-instance pilot deployment to slow down password
 * brute-forcing / mass registration. It is NOT shared across processes or
 * containers — if StudioGate is ever scaled horizontally, replace this with
 * a shared store (Redis, etc).
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Avoid unbounded memory growth from unique keys (e.g. many distinct IPs).
const MAX_BUCKETS = 5000;

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_BUCKETS) buckets.clear();
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterMs: bucket.resetAt - now };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

/** Best-effort client IP from proxy headers (Nginx/Docker) or a fallback. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}
