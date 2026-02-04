import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
