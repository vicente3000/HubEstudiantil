import { env } from "../config/env.js";
import { ensureCacheReady, valkeyClient } from "./connection.js";

export type CacheValue = string | number | boolean | Record<string, unknown> | Array<unknown> | null;

function withPrefix(key: string): string {
  return `${env.VALKEY_KEY_PREFIX}:${key}`;
}

export function buildCacheKey(...segments: Array<string | number | null | undefined>): string {
  const normalizedSegments = segments
    .filter((segment): segment is string | number => segment !== null && segment !== undefined)
    .map((segment) => String(segment).trim())
    .filter((segment) => segment.length > 0);

  return normalizedSegments.join(":");
}

export async function getCache(key: string): Promise<string | null> {
  await ensureCacheReady();
  return valkeyClient.get(withPrefix(key));
}

export async function getCacheJson<T>(key: string): Promise<T | null> {
  const rawValue = await getCache(key);

  if (rawValue === null) {
    return null;
  }

  return JSON.parse(rawValue) as T;
}

export async function setCache(
  key: string,
  value: string,
  ttlSeconds = env.VALKEY_DEFAULT_TTL_SECONDS
): Promise<void> {
  await ensureCacheReady();

  if (ttlSeconds > 0) {
    await valkeyClient.set(withPrefix(key), value, { EX: ttlSeconds });
    return;
  }

  await valkeyClient.set(withPrefix(key), value);
}

export async function setCacheJson(
  key: string,
  value: CacheValue,
  ttlSeconds = env.VALKEY_DEFAULT_TTL_SECONDS
): Promise<void> {
  await setCache(key, JSON.stringify(value), ttlSeconds);
}

export async function deleteCache(...keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  await ensureCacheReady();
  await valkeyClient.del(keys.map((key) => withPrefix(key)));
}

export async function rememberCacheJson<T>(
  key: string,
  resolver: () => Promise<T>,
  ttlSeconds = env.VALKEY_DEFAULT_TTL_SECONDS
): Promise<T> {
  const cachedValue = await getCacheJson<T>(key);

  if (cachedValue !== null) {
    return cachedValue;
  }

  const freshValue = await resolver();
  await setCacheJson(key, freshValue as CacheValue, ttlSeconds);
  return freshValue;
}

export async function deleteCacheByPattern(pattern: string): Promise<number> {
  await ensureCacheReady();

  const prefixedPattern = withPrefix(pattern);
  let cursor = "0";
  let deletedKeysCount = 0;

  do {
    const scanResult = await valkeyClient.scan(cursor, {
      MATCH: prefixedPattern,
      COUNT: 100
    });

    cursor = scanResult.cursor;

    if (scanResult.keys.length > 0) {
      deletedKeysCount += await valkeyClient.del(scanResult.keys);
    }
  } while (cursor !== "0");

  return deletedKeysCount;
}
