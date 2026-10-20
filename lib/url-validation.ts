import { z } from "zod";

export const MAX_URL_LENGTH = 2048;

export type UrlValidationResult =
  | { success: true; normalizedUrl: string }
  | { success: false; error: string };

/**
 * Validates and normalizes destination URLs according to security guidelines:
 * - Must be an absolute URL with http or https protocol.
 * - Rejects non-HTTP schemes (javascript:, data:, file:, etc.).
 * - Rejects URLs with embedded credentials (user:pass@).
 * - Enforces a maximum length limit of 2048 characters.
 * - Normalizes via standard URL API.
 */
export function validateAndNormalizeUrl(rawInput: unknown): UrlValidationResult {
  if (typeof rawInput !== "string" || !rawInput.trim()) {
    return {
      success: false,
      error: "Please enter a valid destination URL.",
    };
  }

  const trimmed = rawInput.trim();

  if (trimmed.length > MAX_URL_LENGTH) {
    return {
      success: false,
      error: `URL is too long. Maximum allowed length is ${MAX_URL_LENGTH} characters.`,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return {
      success: false,
      error: "Malformed URL. Please make sure to include http:// or https://",
    };
  }

  // Scheme validation: strictly http or https
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return {
      success: false,
      error: "Only HTTP and HTTPS URLs are supported.",
    };
  }

  // Check for host validity
  if (!parsed.hostname || parsed.hostname.length === 0) {
    return {
      success: false,
      error: "Invalid hostname in destination URL.",
    };
  }

  // Reject embedded username/password credentials (e.g. https://user:pass@example.com)
  if (parsed.username || parsed.password) {
    return {
      success: false,
      error: "URLs with embedded username or password credentials are not permitted.",
    };
  }

  return {
    success: true,
    normalizedUrl: parsed.href,
  };
}

export const shortenRequestSchema = z.object({
  url: z
    .string({
      error: "Destination URL is required.",
    })
    .min(1, "Destination URL is required.")
    .max(
      MAX_URL_LENGTH,
      `URL is too long. Maximum allowed length is ${MAX_URL_LENGTH} characters.`
    ),
});
