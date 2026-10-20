import { describe, it, expect } from "vitest";
import {
  generateSecureSlug,
  isValidSlug,
  DEFAULT_SLUG_LENGTH,
  MIN_SLUG_LENGTH,
  MAX_SLUG_LENGTH,
} from "../lib/slug";

describe("Secure Slug Generator", () => {
  it("generates a slug of the default length (8 chars)", () => {
    const slug = generateSecureSlug();
    expect(slug).toHaveLength(DEFAULT_SLUG_LENGTH);
    expect(isValidSlug(slug)).toBe(true);
  });

  it("generates slugs using only URL-safe alphanumeric characters", () => {
    for (let i = 0; i < 50; i++) {
      const slug = generateSecureSlug();
      expect(slug).toMatch(/^[0-9a-zA-Z]+$/);
    }
  });

  it("respects custom slug lengths within allowed range", () => {
    expect(generateSecureSlug(7)).toHaveLength(7);
    expect(generateSecureSlug(9)).toHaveLength(9);
    expect(generateSecureSlug(10)).toHaveLength(10);
  });

  it("clamps slug length if requested outside bounds", () => {
    expect(generateSecureSlug(3)).toHaveLength(MIN_SLUG_LENGTH);
    expect(generateSecureSlug(50)).toHaveLength(MAX_SLUG_LENGTH);
  });

  it("produces unique slugs across multiple iterations", () => {
    const set = new Set<string>();
    const count = 1000;
    for (let i = 0; i < count; i++) {
      set.add(generateSecureSlug());
    }
    // With 8 characters base62 (2.18e14 space), 1000 random slugs will have 0 duplicates
    expect(set.size).toBe(count);
  });

  it("validates valid and invalid slugs", () => {
    expect(isValidSlug("abc12345")).toBe(true);
    expect(isValidSlug("aB8xQ2m")).toBe(true);
    expect(isValidSlug("short")).toBe(true); // 5 chars
    expect(isValidSlug("")).toBe(false);
    expect(isValidSlug("bad-slug!")).toBe(false);
    expect(isValidSlug("slug with spaces")).toBe(false);
    expect(isValidSlug(null)).toBe(false);
    expect(isValidSlug(undefined)).toBe(false);
  });
});
