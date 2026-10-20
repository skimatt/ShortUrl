import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

export interface UrlMapping {
  slug: string;
  destinationUrl: string;
  createdAt: number;
}

export class StorageConfigurationError extends Error {
  constructor(message = "Storage service error.") {
    super(message);
    this.name = "StorageConfigurationError";
  }
}

export const KEY_PREFIX = "url:";

// Optional Upstash Redis / Vercel KV singleton
let redisInstance: Redis | null = null;

export function getUpstashCredentials(): { url: string; token: string } | null {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (url && token) {
    return { url, token };
  }
  return null;
}

export function hasUpstashConfigured(): boolean {
  return Boolean(getUpstashCredentials());
}

export function isStorageConfigured(): boolean {
  // Always true because built-in storage is active as fallback!
  return true;
}

export function getRedisClient(): Redis | null {
  const creds = getUpstashCredentials();
  if (!creds) {
    return null;
  }

  if (redisInstance) {
    return redisInstance;
  }

  redisInstance = new Redis({
    url: creds.url,
    token: creds.token,
  });

  return redisInstance;
}

// Local file-backed storage fallback (uses /tmp on Vercel serverless to prevent EROFS errors)
const LOCAL_STORAGE_FILE =
  process.env.VERCEL === "1"
    ? path.join("/tmp", "urls.json")
    : path.join(process.cwd(), "urls.json");

// In-memory cache synced with disk
let localCache: Record<string, UrlMapping> | null = null;

function loadLocalStore(): Record<string, UrlMapping> {
  if (localCache) {
    return localCache;
  }

  try {
    if (fs.existsSync(LOCAL_STORAGE_FILE)) {
      const content = fs.readFileSync(LOCAL_STORAGE_FILE, "utf-8");
      localCache = JSON.parse(content || "{}");
    } else {
      localCache = {};
      fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(localCache, null, 2));
    }
  } catch (err) {
    console.error("Local storage initialization error:", err);
    localCache = {};
  }

  return localCache || {};
}

function saveLocalStore(data: Record<string, UrlMapping>): void {
  try {
    fs.writeFileSync(LOCAL_STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed writing to local storage file:", err);
  }
}

/**
 * Saves a new URL mapping.
 * Uses Upstash Redis if configured; otherwise uses built-in persistent local storage.
 */
export async function saveUrlMapping(
  slug: string,
  destinationUrl: string
): Promise<{ success: boolean; collision?: boolean; mapping?: UrlMapping }> {
  const mapping: UrlMapping = {
    slug,
    destinationUrl,
    createdAt: Date.now(),
  };

  const redis = getRedisClient();
  if (redis) {
    const key = `${KEY_PREFIX}${slug}`;
    const result = await redis.set(key, JSON.stringify(mapping), { nx: true });
    if (result === "OK") {
      return { success: true, mapping };
    }
    return { success: false, collision: true };
  }

  // Built-in storage (zero external config required)
  const store = loadLocalStore();
  if (store[slug]) {
    return { success: false, collision: true };
  }

  store[slug] = mapping;
  saveLocalStore(store);

  return { success: true, mapping };
}

/**
 * Retrieves a stored URL mapping by slug.
 */
export async function getUrlMapping(slug: string): Promise<UrlMapping | null> {
  const redis = getRedisClient();
  if (redis) {
    const key = `${KEY_PREFIX}${slug}`;
    const data = await redis.get<UrlMapping | string>(key);
    if (!data) return null;

    if (typeof data === "string") {
      try {
        return JSON.parse(data) as UrlMapping;
      } catch {
        return null;
      }
    }
    return data;
  }

  // Built-in storage
  const store = loadLocalStore();
  return store[slug] || null;
}
