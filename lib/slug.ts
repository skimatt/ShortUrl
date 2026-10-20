import crypto from "crypto";

// URL-safe alphabet (alphanumeric base62: 0-9, a-z, A-Z)
const SLUG_ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const ALPHABET_LENGTH = SLUG_ALPHABET.length; // 62

export const DEFAULT_SLUG_LENGTH = 8;
export const MIN_SLUG_LENGTH = 7;
export const MAX_SLUG_LENGTH = 10;
export const MAX_COLLISION_RETRIES = 5;

/**
 * Validates whether a slug conforms to URL-safe alphanumeric format.
 */
export function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== "string") return false;
  return /^[0-9a-zA-Z]{5,16}$/.test(slug);
}

/**
 * Generates a cryptographically secure, URL-safe random slug.
 * Uses rejection sampling on random bytes to ensure zero modulo bias.
 * 
 * @param length Desired slug length (default: 8, range: 7-10)
 * @returns Cryptographically secure random slug string
 */
export function generateSecureSlug(length: number = DEFAULT_SLUG_LENGTH): string {
  const targetLength = Math.min(
    Math.max(length, MIN_SLUG_LENGTH),
    MAX_SLUG_LENGTH
  );

  // For 62 characters, 256 - (256 % 62) = 248 is the limit for unbiased selection
  const maxUnbiasedByte = 256 - (256 % ALPHABET_LENGTH); // 248
  let result = "";

  while (result.length < targetLength) {
    const bytesNeeded = (targetLength - result.length) * 2;
    const randomBuffer = crypto.randomBytes(bytesNeeded);

    for (let i = 0; i < randomBuffer.length && result.length < targetLength; i++) {
      const byte = randomBuffer[i];
      if (byte < maxUnbiasedByte) {
        result += SLUG_ALPHABET[byte % ALPHABET_LENGTH];
      }
    }
  }

  return result;
}
