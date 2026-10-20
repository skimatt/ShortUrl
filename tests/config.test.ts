import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getBaseUrl } from "../lib/config";

describe("Config Module", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("prioritizes SITE_URL environment variable and strips trailing slash", () => {
    process.env.SITE_URL = "https://myshort.app/";
    expect(getBaseUrl()).toBe("https://myshort.app");
  });

  it("falls back to NEXT_PUBLIC_SITE_URL if SITE_URL is not provided", () => {
    delete process.env.SITE_URL;
    process.env.NEXT_PUBLIC_SITE_URL = "https://public.myshort.app/";
    expect(getBaseUrl()).toBe("https://public.myshort.app");
  });

  it("extracts host from request headers if env is not set", () => {
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const mockRequest = new Request("http://custom-host.com/some/path", {
      headers: {
        host: "custom-host.com",
        "x-forwarded-proto": "https",
      },
    });

    expect(getBaseUrl(mockRequest)).toBe("https://custom-host.com");
  });

  it("falls back to https://linkskie.vercel.app if nothing is configured", () => {
    delete process.env.SITE_URL;
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    delete process.env.VERCEL_URL;

    expect(getBaseUrl()).toBe("https://linkskie.vercel.app");
  });
});
