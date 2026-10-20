import { NextRequest, NextResponse } from "next/server";
import { validateAndNormalizeUrl } from "@/lib/url-validation";
import { generateSecureSlug, MAX_COLLISION_RETRIES } from "@/lib/slug";
import {
  saveUrlMapping,
  isStorageConfigured,
  StorageConfigurationError,
} from "@/lib/storage";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getBaseUrl } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    // 1. Storage Configuration Verification
    if (!isStorageConfigured()) {
      return NextResponse.json(
        {
          error:
            "Storage service is not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.",
        },
        { status: 503 }
      );
    }

    // 2. Server-side Rate Limiting
    const clientIp = getClientIp(request.headers);
    const rateLimit = await checkRateLimit(clientIp);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Too many requests. Please slow down and try again later.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
          },
        }
      );
    }

    // 3. Body Parsing & Input Validation
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || !("url" in body)) {
      return NextResponse.json(
        { error: "Destination URL is required." },
        { status: 400 }
      );
    }

    const rawUrl = (body as { url: unknown }).url;
    const validation = validateAndNormalizeUrl(rawUrl);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const normalizedUrl = validation.normalizedUrl;

    // 4. Secure Slug Generation & Collision Retry Loop
    let assignedSlug = "";
    let saved = false;

    for (let attempt = 0; attempt < MAX_COLLISION_RETRIES; attempt++) {
      const candidateSlug = generateSecureSlug(8);
      const saveResult = await saveUrlMapping(candidateSlug, normalizedUrl);

      if (saveResult.success) {
        assignedSlug = candidateSlug;
        saved = true;
        break;
      }
    }

    if (!saved) {
      return NextResponse.json(
        {
          error:
            "Unable to generate a unique short link at this moment. Please try again.",
        },
        { status: 500 }
      );
    }

    // 5. Construct Short URL Response
    const baseUrl = getBaseUrl(request);
    const shortUrl = `${baseUrl}/${assignedSlug}`;

    return NextResponse.json(
      {
        slug: assignedSlug,
        shortUrl,
        destinationUrl: normalizedUrl,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof StorageConfigurationError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503 }
      );
    }

    console.error("API error creating short URL:", error);
    return NextResponse.json(
      { error: "An unexpected server error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
