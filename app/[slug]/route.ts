import { NextRequest, NextResponse } from "next/server";
import { getUrlMapping, isStorageConfigured } from "@/lib/storage";
import { isSocialCrawler } from "@/lib/crawler";
import { getBaseUrl, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/config";
import { isValidSlug } from "@/lib/slug";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    if (!slug || !isValidSlug(slug)) {
      return new NextResponse(
        renderNotFoundHtml("Link Not Found", "The link you followed is invalid or has expired."),
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    if (!isStorageConfigured()) {
      return new NextResponse(
        renderErrorHtml("Service Unavailable", "Storage service is currently not configured."),
        {
          status: 503,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    const mapping = await getUrlMapping(slug);

    if (!mapping) {
      return new NextResponse(
        renderNotFoundHtml("Link Not Found", "The short link you requested does not exist or has been removed."),
        {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        }
      );
    }

    const userAgent = request.headers.get("user-agent");
    const isCrawler = isSocialCrawler(userAgent);

    if (isCrawler) {
      const baseUrl = getBaseUrl(request);
      const shortUrl = `${baseUrl}/${slug}`;
      const ogImageUrl = `${baseUrl}/Og.png`;

      const crawlerHtml = renderCrawlerHtml({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        pageUrl: shortUrl,
        imageUrl: ogImageUrl,
        destinationUrl: mapping.destinationUrl,
      });

      return new NextResponse(crawlerHtml, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    // Human visitor: temporary redirect (HTTP 307)
    return NextResponse.redirect(mapping.destinationUrl, {
      status: 307,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error resolving short slug:", error);
    return new NextResponse(
      renderErrorHtml("Server Error", "An error occurred while resolving this link. Please try again later."),
      {
        status: 500,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderCrawlerHtml(meta: {
  title: string;
  description: string;
  pageUrl: string;
  imageUrl: string;
  destinationUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(meta.title)}</title>
  <meta name="description" content="${escapeHtml(meta.description)}">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(meta.pageUrl)}">
  <meta property="og:title" content="${escapeHtml(meta.title)}">
  <meta property="og:description" content="${escapeHtml(meta.description)}">
  <meta property="og:image" content="${escapeHtml(meta.imageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeHtml(meta.title)}">

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapeHtml(meta.pageUrl)}">
  <meta name="twitter:title" content="${escapeHtml(meta.title)}">
  <meta name="twitter:description" content="${escapeHtml(meta.description)}">
  <meta name="twitter:image" content="${escapeHtml(meta.imageUrl)}">

  <!-- Fallback redirect for browsers without javascript executing crawler handler -->
  <meta http-equiv="refresh" content="0;url=${escapeHtml(meta.destinationUrl)}">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf8; color: #18181b;">
  <p>Redirecting to <a href="${escapeHtml(meta.destinationUrl)}" style="color: #d97757;">destination</a>...</p>
</body>
</html>`;
}

function renderNotFoundHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>404 — ${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #fafaf8;
      color: #18181b;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .badge {
      display: inline-block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #d97757;
      background: #fdf5f2;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    p {
      color: #71717a;
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0 0 1.5rem 0;
    }
    a.btn {
      display: inline-block;
      background-color: #d97757;
      color: #ffffff;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
      transition: background-color 0.15s ease;
    }
    a.btn:hover {
      background-color: #c56647;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">404 Error</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/" class="btn">Return to Homepage</a>
  </div>
</body>
</html>`;
}

function renderErrorHtml(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #fafaf8;
      color: #18181b;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-radius: 12px;
      padding: 2.5rem;
      max-width: 440px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 0.5rem 0;
      letter-spacing: -0.02em;
    }
    p {
      color: #71717a;
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0 0 1.5rem 0;
    }
    a.btn {
      display: inline-block;
      background-color: #d97757;
      color: #ffffff;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.625rem 1.25rem;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(message)}</p>
    <a href="/" class="btn">Return to Homepage</a>
  </div>
</body>
</html>`;
}
