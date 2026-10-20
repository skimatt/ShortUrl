# lnks. — Personal URL Shortener

A fast, production-ready, minimalist personal URL shortener built with **Next.js (App Router)**, **Tailwind CSS**, and **Upstash Redis**, designed for seamless deployment on **Vercel**.

Every generated short link uses the same global Open Graph (OG) image and personal branding, returning social metadata previews for crawlers and temporary 307 redirects for human visitors.

---

## Features

- **Single Homepage Experience:** No login, no accounts, no multi-step workflows, no dashboard bloat.
- **Consistent Personal Branding:** Every short link shares global Open Graph and Twitter/X metadata (`/og-image.png`).
- **Smart Crawler Detection:** Social crawlers (WhatsApp, X, Facebook, LinkedIn, Discord, Telegram, etc.) receive rich link previews; human visitors are redirected directly.
- **Persistent Key-Value Storage:** Serverless-compatible persistence via Upstash Redis with atomic collision-safe writes.
- **Cryptographic Security:** 8-character URL-safe slugs generated via `crypto.randomBytes` with zero modulo bias.
- **Abuse Prevention & Rate Limiting:** Sliding-window rate limiter per client IP powered by `@upstash/ratelimit`.
- **SSRF Safe & Strict Validation:** Server-side validation rejecting invalid schemes, credentials, and non-HTTP protocols. No arbitrary fetching.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS (Terracotta `#D97757` palette, Inter typography)
- **Storage:** Upstash Redis (`@upstash/redis`)
- **Rate Limiting:** Upstash Ratelimit (`@upstash/ratelimit`)
- **Validation:** Zod
- **Testing:** Vitest

---

## Prerequisites

- **Node.js:** v20+ or v24+
- **Package Manager:** `npm` (or `pnpm` / `yarn`)
- **Upstash Redis Account:** A free Redis database from [Upstash](https://console.upstash.com) or via Vercel Marketplace.

---

## Quick Start (Local Development)

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd ShortUrl
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
# Canonical public website origin
SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Upstash Redis credentials
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_upstash_rest_token"

# Rate limiting
RATE_LIMIT_REQUESTS=15
RATE_LIMIT_WINDOW_SECONDS=60
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing & Quality Assurance

Run the test suite:

```bash
npm test
```

Run TypeScript verification and ESLint:

```bash
npx tsc --noEmit
npm run lint
```

Build for production:

```bash
npm run build
```

---

## Configuring Persistent Storage (Upstash Redis)

1. Log in to the [Upstash Console](https://console.upstash.com).
2. Click **Create Database**.
3. Choose your primary region (ideally matching your Vercel deployment region for lowest latency).
4. Once created, navigate to the **REST API** section of your database details.
5. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
6. Add these credentials to `.env.local` locally and into **Project Settings → Environment Variables** on Vercel.

> **Note:** If storage credentials are not provided, the API will fail safely with a `503 Service Unavailable` response rather than silently losing data or storing in ephemeral server memory.

---

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and configure the environment variables when requested.

### Option 2: Vercel Dashboard (Git Integration)

1. Push this repository to GitHub or GitLab.
2. In the Vercel dashboard, click **Add New → Project** and import the repository.
3. Under **Environment Variables**, add:
   - `SITE_URL`: `https://your-custom-domain.com` (or your `*.vercel.app` domain)
   - `NEXT_PUBLIC_SITE_URL`: `https://your-custom-domain.com`
   - `UPSTASH_REDIS_REST_URL`: Your Upstash REST URL
   - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash REST token
4. Click **Deploy**.

---

## Production Domain & Canonical URL Configuration

For link preview cards to render properly across WhatsApp, Twitter/X, and Facebook:
- Set `SITE_URL` to your live domain (e.g. `https://links.yourbrand.com`).
- Do not include trailing slashes; the app automatically formats canonical and OG image URLs.
- The global OG image is located at `public/og-image.png`. You can replace this file anytime with your branded artwork (recommended dimension: `1200 x 630` pixels).

---

## Verifying Social Previews & Metadata

You can verify that crawlers receive the correct OG tags using official debugger tools:
- **X / Twitter Card Validator:** Use third-party preview checkers or compose a draft post on X.
- **Facebook Sharing Debugger:** [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)
- **LinkedIn Post Inspector:** [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)
- **Command Line Check:**
  ```bash
  curl -A "Twitterbot/1.0" -i https://your-domain.vercel.app/<slug>
  ```
  The response will be HTML containing `<meta property="og:image" ...>` and `<meta name="twitter:card" ...>`.

---

## Adjusting Rate Limits

Rate limits prevent automated abuse on the public creation endpoint (`/api/shorten`). You can adjust them via environment variables:

- `RATE_LIMIT_REQUESTS`: Maximum requests allowed (default: `15`)
- `RATE_LIMIT_WINDOW_SECONDS`: Sliding window duration in seconds (default: `60`)

Example in Vercel:
```
RATE_LIMIT_REQUESTS=30
RATE_LIMIT_WINDOW_SECONDS=60
```

---

## Managing and Removing Abusive Links

In keeping with the minimal architecture, there is no admin dashboard. If a malicious link is reported:

1. Open your [Upstash Console](https://console.upstash.com).
2. Select your database and open the **Data Browser**.
3. Search for the key:
   ```
   url:<slug>
   ```
4. Click **Delete** on the key.
5. The short link will immediately return `404 Link Not Found` upon the next request.

---

## Social Preview Caching & Limitations

- **Platform Caching:** Social platforms (especially Facebook, LinkedIn, and Telegram) heavily cache link metadata for hours or days. If you change your global OG image, use their respective debuggers/inspectors to refresh their cache.
- **Redirect vs Scraping:** Crawlers look at metadata only and do not execute JavaScript redirects. Human visitors will be redirected with HTTP 307 to preserve caching freedom.

---

## License

MIT
