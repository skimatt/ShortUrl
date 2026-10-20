import { describe, it, expect } from "vitest";
import {
  validateAndNormalizeUrl,
  MAX_URL_LENGTH,
} from "../lib/url-validation";

describe("URL Validation and Normalization", () => {
  it("accepts valid HTTPS URLs", () => {
    const res = validateAndNormalizeUrl("https://example.com/blog/article?ref=social");
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.normalizedUrl).toBe("https://example.com/blog/article?ref=social");
    }
  });

  it("accepts valid HTTP URLs", () => {
    const res = validateAndNormalizeUrl("http://example.org/home");
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.normalizedUrl).toBe("http://example.org/home");
    }
  });

  it("normalizes URLs by adding trailing slash to bare origins", () => {
    const res = validateAndNormalizeUrl("https://example.com");
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.normalizedUrl).toBe("https://example.com/");
    }
  });

  it("rejects non-HTTP protocols (javascript:, data:, file:, ftp:)", () => {
    const nonHttp = [
      "javascript:alert(1)",
      "data:text/html,Hello",
      "file:///etc/passwd",
      "ftp://example.com/file.txt",
      "ssh://git@github.com",
    ];

    for (const item of nonHttp) {
      const res = validateAndNormalizeUrl(item);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toMatch(/Only HTTP and HTTPS|Malformed/i);
      }
    }
  });

  it("rejects URLs with embedded credentials", () => {
    const credUrls = [
      "https://user:password@example.com",
      "http://admin:secret@domain.org/path",
      "https://token@sub.example.com",
    ];

    for (const item of credUrls) {
      const res = validateAndNormalizeUrl(item);
      expect(res.success).toBe(false);
      if (!res.success) {
        expect(res.error).toContain("embedded username or password");
      }
    }
  });

  it("rejects empty or whitespace-only URLs", () => {
    expect(validateAndNormalizeUrl("").success).toBe(false);
    expect(validateAndNormalizeUrl("   ").success).toBe(false);
    expect(validateAndNormalizeUrl(null).success).toBe(false);
    expect(validateAndNormalizeUrl(undefined).success).toBe(false);
  });

  it("rejects URLs exceeding MAX_URL_LENGTH", () => {
    const longUrl = "https://example.com/" + "a".repeat(MAX_URL_LENGTH + 10);
    const res = validateAndNormalizeUrl(longUrl);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error).toContain("URL is too long");
    }
  });

  it("rejects malformed URLs missing hostname or scheme", () => {
    const malformed = [
      "not-a-url",
      "htp://typo.com",
      "https://",
      "//missing-protocol.com",
    ];

    for (const item of malformed) {
      const res = validateAndNormalizeUrl(item);
      expect(res.success).toBe(false);
    }
  });
});
