import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { getRedisClient, hasUpstashConfigured } from "./storage";

let ratelimitInstance: Ratelimit | null = null;

// Configurable requests limit (default: 30 requests per 60 seconds)
const REQUEST_LIMIT = parseInt(process.env.RATE_LIMIT_REQUESTS || "30", 10);
const WINDOW_DURATION: Duration = (process.env.RATE_LIMIT_WINDOW || "60 s") as Duration;

// Local in-memory sliding window when external Redis is not configured
const localRateLimitMap = new Map<string, number[]>();

export function getRatelimit(): Ratelimit | null {
  if (!hasUpstashConfigured()) {
    return null;
  }

  if (!ratelimitInstance) {
    try {
      const redis = getRedisClient();
      if (!redis) return null;

      ratelimitInstance = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(REQUEST_LIMIT, WINDOW_DURATION),
        analytics: false,
        prefix: "ratelimit:shorten",
      });
    } catch {
      return null;
    }
  }

  return ratelimitInstance;
}

/**
 * Extracts client IP securely from incoming request headers.
 */
export function getClientIp(headers: Headers): string {
  const xForwardedFor = headers.get("x-forwarded-for");
  if (xForwardedFor) {
    const firstIp = xForwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const xRealIp = headers.get("x-real-ip");
  if (xRealIp?.trim()) {
    return xRealIp.trim();
  }

  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp?.trim()) {
    return cfConnectingIp.trim();
  }

  return "127.0.0.1";
}

export interface RateLimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

/**
 * Checks rate limit for given client IP.
 */
export async function checkRateLimit(clientIp: string): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  if (limiter) {
    try {
      const res = await limiter.limit(clientIp);
      return {
        success: res.success,
        limit: res.limit,
        remaining: res.remaining,
        reset: res.reset,
      };
    } catch (error) {
      console.error("Upstash rate limit check error:", error);
      return { success: true };
    }
  }

  // Local sliding window check
  const now = Date.now();
  const windowMs = 60 * 1000;
  const clientTimestamps = localRateLimitMap.get(clientIp) || [];

  // Filter timestamps within current window
  const activeTimestamps = clientTimestamps.filter((ts) => now - ts < windowMs);

  if (activeTimestamps.length >= REQUEST_LIMIT) {
    return {
      success: false,
      limit: REQUEST_LIMIT,
      remaining: 0,
    };
  }

  activeTimestamps.push(now);
  localRateLimitMap.set(clientIp, activeTimestamps);

  return {
    success: true,
    limit: REQUEST_LIMIT,
    remaining: REQUEST_LIMIT - activeTimestamps.length,
  };
}
