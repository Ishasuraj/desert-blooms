type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_BUCKETS = 10_000;

export function checkServerRateLimit(key: string, max: number) {
  const now = Date.now();

  for (const [bucketKey, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }

  if (buckets.size >= MAX_BUCKETS && !buckets.has(key)) {
    return { limited: true, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  if (bucket.count >= max) {
    return {
      limited: true,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { limited: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
}