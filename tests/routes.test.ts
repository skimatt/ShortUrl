import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";

const mockSet = vi.fn();
const mockGet = vi.fn();

vi.mock("@upstash/redis", () => {
  return {
    Redis: class {
      set = mockSet;
      get = mockGet;
      evalsha = vi.fn().mockResolvedValue([1, 15, Date.now() + 60000]);
      eval = vi.fn().mockResolvedValue([1, 15, Date.now() + 60000]);
    },
  };
});

describe("API & Slug Route Handlers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("POST /api/shorten", () => {
    it("works immediately out-of-the-box even without external Upstash configured", async () => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;

      const { POST } = await import("../app/api/shorten/route");
      const req = new NextRequest("http://localhost:3000/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.com/built-in-test" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.slug).toBeDefined();
      expect(json.shortUrl).toContain(json.slug);
      expect(json.destinationUrl).toBe("https://example.com/built-in-test");
    });

    it("returns 400 if request body has invalid destination URL", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";

      const { POST } = await import("../app/api/shorten/route");
      const req = new NextRequest("http://localhost:3000/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url: "javascript:alert(1)" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.error).toContain("Only HTTP and HTTPS");
    });

    it("returns 201 with generated shortUrl on successful request with Redis", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";
      process.env.SITE_URL = "https://short.link";

      mockSet.mockResolvedValue("OK");

      const { POST } = await import("../app/api/shorten/route");
      const req = new NextRequest("http://localhost:3000/api/shorten", {
        method: "POST",
        body: JSON.stringify({ url: "https://example.com/target-page" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.slug).toBeDefined();
      expect(json.shortUrl).toContain("https://short.link/");
      expect(json.destinationUrl).toBe("https://example.com/target-page");
    });
  });

  describe("GET /[slug]", () => {
    it("returns 404 for unknown slug", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";

      mockGet.mockResolvedValue(null);

      const { GET } = await import("../app/[slug]/route");
      const req = new NextRequest("http://localhost:3000/unknown12");
      const res = await GET(req, { params: Promise.resolve({ slug: "unknown12" }) });

      expect(res.status).toBe(404);
      const text = await res.text();
      expect(text).toContain("404");
    });

    it("returns 307 temporary redirect for human visitor", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";

      mockGet.mockResolvedValue(
        JSON.stringify({
          slug: "target12",
          destinationUrl: "https://example.com/destination",
          createdAt: 1700000000000,
        })
      );

      const { GET } = await import("../app/[slug]/route");
      const req = new NextRequest("http://localhost:3000/target12", {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36",
        },
      });

      const res = await GET(req, { params: Promise.resolve({ slug: "target12" }) });
      expect(res.status).toBe(307);
      expect(res.headers.get("location")).toBe("https://example.com/destination");
    });

    it("returns HTML with Open Graph metadata when accessed by social crawler", async () => {
      process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
      process.env.UPSTASH_REDIS_REST_TOKEN = "mock_token";
      process.env.SITE_URL = "https://short.link";

      mockGet.mockResolvedValue(
        JSON.stringify({
          slug: "social12",
          destinationUrl: "https://example.com/destination",
          createdAt: 1700000000000,
        })
      );

      const { GET } = await import("../app/[slug]/route");
      const req = new NextRequest("http://localhost:3000/social12", {
        headers: {
          "user-agent": "facebookexternalhit/1.1",
        },
      });

      const res = await GET(req, { params: Promise.resolve({ slug: "social12" }) });
      expect(res.status).toBe(200);
      const text = await res.text();
      expect(text).toContain('property="og:image"');
      expect(text).toContain("https://short.link/Og.png");
      expect(text).toContain('property="og:title"');
      expect(text).toContain('name="twitter:card"');
    });
  });
});
