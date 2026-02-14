import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ROAST_DIRECTORY_KEY = "roasts:directory";

export async function getCache<T>(key: string): Promise<T | undefined> {
  const value = await redis.get<T>(key);
  return value ?? undefined;
}

export async function setCache<T>(key: string, value: T, ttlMs: number) {
  await redis.set(key, value, { px: ttlMs });
}

/**
 * Manually clears a cache entry.
 * Currently unused in production, but kept for manual cache invalidation
 * during debugging or future admin functionality.
 */
export async function clearCache(key: string) {
  await redis.del(key);
}

/**
 * Track a roasted username in a sorted set (score = timestamp for recency).
 * If the username already exists, it updates the score to the latest timestamp.
 */
export async function trackRoast(username: string) {
  await redis.zadd(ROAST_DIRECTORY_KEY, {
    score: Date.now(),
    member: username.toLowerCase(),
  });
}

/**
 * Get the most recently roasted usernames, ordered newest first.
 */
export async function getRecentRoasts(limit: number = 50): Promise<string[]> {
  const results = await redis.zrange<string[]>(
    ROAST_DIRECTORY_KEY,
    0,
    limit - 1,
    { rev: true }
  );
  return results;
}

