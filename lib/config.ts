/**
 * Site configuration helper.
 * Manages production origin, site metadata, and defaults.
 */

export const SITE_NAME = "links.";
export const SITE_TITLE = "links. — Long links. Short and simple.";
export const SITE_DESCRIPTION =
  "Shorten your links instantly. Share them anywhere with consistent personal branding.";

/**
 * Returns the canonical base URL of the deployment.
 * Prioritizes SITE_URL, then NEXT_PUBLIC_SITE_URL, then Vercel deployment URL, then request headers or localhost.
 */
export function getBaseUrl(request?: Request): string {
  const envUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  // Auto-detect Vercel deployment URL
  const vercelUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim()) {
    return `https://${vercelUrl.trim().replace(/\/+$/, "")}`;
  }

  if (request) {
    const proto =
      request.headers.get("x-forwarded-proto") ||
      (request.url.startsWith("https") ? "https" : "http");
    const host =
      request.headers.get("x-forwarded-host") || request.headers.get("host");

    if (host) {
      return `${proto}://${host}`.replace(/\/+$/, "");
    }
  }

  return "http://localhost:3000";
}
