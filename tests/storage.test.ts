import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const mockSet = vi.fn();
const mockGet = vi.fn();

vi.mock("@upstash/redis", () => {
  return {
    Redis: class {
      set = mockSet;
      get = mockGet;
    },
  };
});

describe("Storage Adapter", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("detects when external Upstash is not configured but local storage is available", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { hasUpstashConfigured, isStorageConfigured, getRedisClient } =
      await import("../lib/storage");

    expect(hasUpstashConfigured()).toBe(false);
    expect(isStorageConfigured()).toBe(true);
    expect(getRedisClient()).toBeNull();
  });

  it("persists and retrieves using built-in storage without Upstash", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;

    const { saveUrlMapping, getUrlMapping } = await import("../lib/storage");

    const slug = "local" + Math.random().toString(36).substring(2, 6);
    const saveRes = await saveUrlMapping(slug, "https://example.com/local-test");
    expect(saveRes.success).toBe(true);
    expect(saveRes.mapping?.slug).toBe(slug);

    const getRes = await getUrlMapping(slug);
    expect(getRes).not.toBeNull();
    expect(getRes?.destinationUrl).toBe("https://example.com/local-test");
  });

  it("handles storage operations with Upstash Redis when configured", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";

    mockSet.mockResolvedValue("OK");
    mockGet.mockResolvedValue(
      JSON.stringify({
        slug: "test1234",
        destinationUrl: "https://example.com",
        createdAt: 1700000000000,
      })
    );

    const { saveUrlMapping, getUrlMapping, hasUpstashConfigured } = await import(
      "../lib/storage"
    );

    expect(hasUpstashConfigured()).toBe(true);

    const saveRes = await saveUrlMapping("test1234", "https://example.com");
    expect(saveRes.success).toBe(true);
    expect(saveRes.mapping?.slug).toBe("test1234");
    expect(mockSet).toHaveBeenCalledWith(
      "url:test1234",
      expect.stringContaining("test1234"),
      { nx: true }
    );

    const getRes = await getUrlMapping("test1234");
    expect(getRes).not.toBeNull();
    expect(getRes?.destinationUrl).toBe("https://example.com");
  });

  it("detects collision when atomic set fails", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
    process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";

    mockSet.mockResolvedValue(null);

    const { saveUrlMapping } = await import("../lib/storage");

    const saveRes = await saveUrlMapping("test1234", "https://example.com");
    expect(saveRes.success).toBe(false);
    expect(saveRes.collision).toBe(true);
  });
});
