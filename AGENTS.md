# AGENTS.md — Personal URL Shortener

## 1. Project Objective

Build a production-ready personal URL shortener using **Next.js and Vercel**.

The application must be extremely simple: anyone can open the website, enter a long URL, and generate a short URL without creating an account or logging in.

This is a public URL-shortening service with my personal branding. Every generated short link must use the same global Open Graph (OG) image and consistent metadata belonging to my website.

The priority is simplicity, speed, visual quality, security, and reliability. Do not overengineer the application.

## 2. Core Requirements

- One homepage only.
- No login page.
- No authentication.
- No admin panel or dashboard.
- No user registration.
- No unnecessary pages or complex analytics.
- No relational database.
- No complicated multi-step workflows.
- Anyone can shorten a URL without an account.
- Every generated short URL uses the same production domain.
- Every short URL uses the same personal OG image and branding.
- Short links must continue working after deployment and across serverless function instances.
- The website must be responsive, accessible, and fast on mobile and desktop.

Do not add features outside this scope unless they are essential for security, reliability, or core functionality.

## 3. Technology Stack

Use the following stack:

- Next.js with App Router.
- TypeScript with strict type checking.
- React.
- Tailwind CSS.
- Vercel for deployment.
- A persistent serverless-compatible key-value store, preferably Upstash Redis or another compatible Vercel-supported storage service.
- Zod or an equivalent schema validation library for server-side input validation.

Use current stable, mutually compatible package versions. Review the existing project before changing dependencies or configuration.

Do not store URL mappings in local variables, in-memory objects, browser storage, or temporary files. Serverless instances are not guaranteed to share memory, and temporary state is not a reliable data store.

## 4. Homepage and User Experience

The entire application must be centered around one beautiful, minimal homepage.

The homepage contains:

1. A small personal brand or wordmark.
2. A concise headline explaining the URL-shortening service.
3. A single URL input field.
4. A prominent “Shorten URL” button.
5. A loading state while the URL is processed.
6. A result area displaying the generated short URL.
7. A copy button with clear success feedback.
8. An unobtrusive validation and error message area.
9. A minimal footer.

Example headline:

“Long links. Short and simple.”

Example description:

“Shorten your links instantly. Share them anywhere.”

Example input placeholder:

“Paste your long URL here…”

Example generated URL:

`https://your-domain.vercel.app/a8Kx2mQ`

The example domain and slug are illustrative. Use the actual configured production domain and generated slug in the finished application.

### Interaction requirements

- Allow submission using the Enter key.
- Disable duplicate submissions while a request is processing.
- Show a subtle loading indicator.
- Display validation errors without disruptive browser alerts.
- Provide a one-click copy function.
- Show a clear confirmation after copying.
- Preserve a clean layout when results or errors appear.
- Ensure keyboard accessibility and visible focus states.
- Respect reduced-motion preferences.
- Do not reload the entire page unnecessarily after shortening a URL.

Do not add a dashboard, history page, user profile, account menu, or separate authentication interface.

## 5. Visual Design

Create a premium, modern, restrained interface.

### Design direction

- Background: white or a very subtle warm off-white.
- Main text: near-black.
- Secondary text: neutral gray.
- Accent color: terracotta `#D97757`.
- Typography: Inter, with a reliable system-font fallback.
- Layout: centered, spacious, and balanced.
- Corners: moderately rounded, not excessively pill-shaped.
- Shadows: subtle and used only when useful.
- Borders: light and restrained.
- Animation: smooth, fast, and purposeful.

Avoid blue as the primary accent color.

Do not use excessive gradients, excessive glassmorphism, oversized decorative illustrations, emoji decorations, excessive cards, or generic AI-generated design patterns.

The interface should feel like a carefully designed independent product, not a complicated SaaS dashboard.

Optimize the design for mobile first, then scale appropriately to desktop.

## 6. URL Shortening Workflow

Implement the following workflow:

1. A visitor enters a destination URL.
2. The frontend submits the URL to a server-side endpoint.
3. The server validates and normalizes the URL.
4. The server generates a cryptographically secure random slug.
5. The server stores the slug-to-destination mapping in persistent key-value storage.
6. The server returns the generated short URL.
7. The frontend displays the short URL and copy button.
8. When someone opens the short URL, the server resolves the slug and handles the request according to the crawler and browser behavior described below.

Use short, URL-safe slugs, for example, 7–10 characters from a suitable alphabet.

Use a cryptographically secure random generator, such as Node.js `crypto.randomBytes`, rather than `Math.random()`.

Provide sufficient randomness to make guessing and collision attacks impractical. Use at least 96 bits of randomness where practical, encoded into a URL-safe slug.

Before storing a new mapping, handle the possibility of a slug collision. Generate a new slug and retry a limited number of times if the slug already exists.

Do not derive slugs directly from the destination URL, because doing so can reveal information and create predictable identifiers.

## 7. Persistent Storage

Use a persistent key-value store to store mappings such as:

- `slug`
- `destinationUrl`
- `createdAt`

Store each mapping under a unique key, for example:

`url:<slug>`

Use atomic operations where supported to prevent concurrent requests from overwriting an existing slug.

The application must continue to work across separate requests, serverless instances, and deployments.

Do not require a relational database, database administration interface, or user management system.

Provide clear setup instructions for the storage provider and environment variables in the README.

If storage is not configured, show a clear server-side error. Do not silently fall back to in-memory storage or pretend that a URL has been saved when it has not.

## 8. Open Graph and Personal Branding

This is one of the most important requirements.

Every generated short URL must share the same global personal branding, regardless of the destination URL.

Create one high-quality OG image for the website, ideally at 1200 × 630 pixels.

The image should contain my personal brand or wordmark and a clean, professional visual identity consistent with the homepage.

Use a neutral background, strong typography, and the chosen terracotta accent. Avoid unnecessary text and decorative elements.

Store the image in the Next.js public directory, for example:

`public/og-image.png`

The exact file may be replaced later with my final personal branding artwork.

### Global metadata

Configure the website's root metadata with:

- A consistent title.
- A concise description.
- `metadataBase` set to the actual production origin.
- Open Graph title, description, image, image dimensions, and image alternative text.
- Twitter/X card metadata using a large image card.
- Appropriate canonical URL settings for the homepage.
- A favicon and application icon where appropriate.

Use Next.js Metadata API and follow current framework conventions.

All generated short links must use the same global OG image and branding. Do not generate a different OG image for each destination.

### Social media crawler behavior

A short URL must work for both social media previews and normal visitors.

When a supported social media crawler requests a short URL, return HTML containing the appropriate OG and Twitter/X metadata. The HTML must reference the global OG image using an absolute HTTPS URL based on the configured production domain.

When an ordinary human visitor opens the same short URL, redirect them to the saved destination URL.

Implement crawler detection carefully and keep it isolated in a dedicated, testable module. Account for common crawlers such as Facebook's crawler, WhatsApp's link-preview crawler, and Twitter/X's crawler. Use a maintainable user-agent matching strategy and avoid brittle checks.

Do not assume that all social platforms behave identically. Some platforms may cache previews, ignore certain metadata, or handle redirects differently. Document these limitations.

Do not create an unrestricted open redirect endpoint that accepts an arbitrary destination URL from the request. A redirect must resolve only a previously stored slug.

## 9. URL Validation and Security

The service is public and requires no authentication. Therefore, server-side validation and abuse prevention are mandatory.

Implement the following safeguards:

### Input validation

- Accept only valid absolute `http://` and `https://` URLs.
- Reject empty, malformed, or excessively long input.
- Reject unsupported URL schemes such as `javascript:`, `data:`, `file:`, and other non-HTTP protocols.
- Reject URLs containing embedded username/password credentials.
- Normalize valid URLs using the standard `URL` API.
- Enforce a documented maximum URL length.
- Return clear, non-sensitive error messages.
- Never trust frontend validation alone.

### SSRF prevention

The application must not fetch or crawl the destination URL merely to shorten it.

Do not make server-side HTTP requests to user-supplied destination URLs for validation or metadata extraction.

If any future functionality requires fetching destinations, implement explicit SSRF protections, including blocking loopback, private, link-local, and reserved IP ranges, and validating DNS resolution and redirects.

### Abuse prevention

- Implement server-side rate limiting for URL creation.
- Use a shared, persistent rate-limit mechanism suitable for serverless deployments.
- Do not rely exclusively on in-memory counters.
- Limit requests per IP or another appropriately designed identifier.
- Handle missing or spoofed forwarding headers safely; only trust headers provided by the deployment platform's trusted proxy.
- Set sensible request body and URL length limits.
- Return HTTP 429 when the rate limit is exceeded.
- Add basic bot and spam resistance without making ordinary usage difficult.
- Avoid collecting unnecessary personal data.
- Do not expose internal errors, secrets, storage credentials, or stack traces.

Use configurable rate limits and document how to tune them for the actual deployment.

### Destination safety

A URL shortener can be abused to distribute phishing or malicious links. Design the service to make abuse manageable.

Where practical, provide a lightweight mechanism for reporting abusive short links and document how the owner can disable or remove an abusive mapping through the storage provider. Do not build an admin dashboard for this purpose.

Do not claim the service is completely safe or immune to abuse.

## 10. Redirect Behavior

For a valid, existing slug:

- Ordinary browser requests should redirect to the stored destination.
- Use an appropriate temporary redirect status, normally HTTP 302 or 307, unless there is a documented reason to choose otherwise.
- Avoid permanent redirects that can make changes difficult because browsers and intermediaries may cache them.
- Do not trust a destination URL supplied in query parameters.
- Do not redirect unknown slugs to an arbitrary external URL.

For an unknown slug, return a proper 404 response.

For a storage failure, return an appropriate server error without exposing implementation details.

For crawler requests, return the OG metadata HTML where supported by the architecture.

Ensure the crawler HTML and browser redirect use the same stored slug mapping and do not introduce inconsistent behavior.

## 11. Environment Configuration

Use environment variables for configuration.

Document the necessary variables, including the production origin and storage credentials, using the actual variable names selected in the implementation.

For example:

- `NEXT_PUBLIC_SITE_URL` — the canonical public website origin, if needed by client-side code.
- `SITE_URL` — the canonical public website origin for server-side metadata and redirects.
- Storage-provider credentials required by the chosen key-value service.

Use the canonical production domain for all generated short URLs.

Do not hardcode a development URL into production behavior.

Never expose storage credentials or other secrets through variables prefixed with `NEXT_PUBLIC_`.

Provide a `.env.example` containing placeholder values only. Never commit real credentials.

## 12. Performance and Reliability

- Use server components by default.
- Use client components only where interaction requires them.
- Keep JavaScript bundles small.
- Avoid unnecessary dependencies.
- Avoid unnecessary API requests.
- Use asynchronous operations appropriately.
- Configure caching carefully so URL mappings do not become stale.
- Do not cache newly created mappings incorrectly.
- Handle storage timeouts and failures gracefully.
- Ensure short-link resolution is fast.
- Avoid unnecessary third-party scripts and trackers.
- Optimize fonts, images, and layout stability.
- Ensure the application works correctly on Vercel's serverless infrastructure.

Do not use local filesystem persistence for production URL mappings.

## 13. Suggested Project Structure

Adapt this structure to the current Next.js version and actual implementation:

- `app/page.tsx` — single public homepage.
- `app/layout.tsx` — root layout and global metadata.
- `app/globals.css` — global styles.
- `app/api/shorten/route.ts` — URL creation endpoint.
- `app/[slug]/route.ts` or another appropriate route handler — short-link resolution and crawler responses.
- `lib/storage.ts` — persistent key-value storage adapter.
- `lib/url-validation.ts` — URL validation and normalization.
- `lib/slug.ts` — secure slug generation.
- `lib/rate-limit.ts` — rate limiting.
- `lib/crawler.ts` — social crawler detection.
- `public/og-image.png` — global OG image.
- `public/favicon.ico` — favicon, if used.
- `.env.example` — environment configuration template.
- `README.md` — setup, deployment, and maintenance documentation.

This is a suggested structure, not a requirement to create unnecessary files. Keep the code modular enough to test without overengineering.

## 14. Error Handling

Handle at least these cases:

- Empty URL.
- Invalid URL.
- Unsupported protocol.
- URL exceeds the maximum length.
- Rate limit exceeded.
- Slug collision.
- Unknown slug.
- Storage unavailable.
- Unexpected server error.
- Clipboard access failure.
- Network failure in the frontend.

Provide concise user-facing messages and appropriate HTTP status codes.

Never show raw stack traces or sensitive infrastructure details to visitors.

## 15. Testing and Quality Assurance

Write meaningful tests for the core behavior.

At minimum, verify:

1. Valid HTTP and HTTPS URLs are accepted.
2. Invalid URLs and unsupported protocols are rejected.
3. Embedded URL credentials are rejected.
4. Slugs are generated securely and collisions are handled.
5. Created mappings persist and can be retrieved.
6. Unknown slugs return 404.
7. Human requests redirect to the correct stored destination.
8. Supported crawler requests receive HTML containing the global OG image URL.
9. Rate limits are enforced.
10. Storage failures are handled safely.
11. The homepage supports loading, success, error, and copy states.
12. Production metadata uses the configured canonical origin.

Run the available linting, type checking, automated tests, and production build commands. Fix all errors introduced by the implementation.

Do not claim tests passed unless they were actually executed.

## 16. README and Deployment

The README must explain:

- Prerequisites.
- Local development setup.
- Dependency installation.
- Environment variable configuration.
- How to configure persistent key-value storage.
- How to run the application locally.
- How to run tests and build for production.
- How to deploy to Vercel.
- How to configure the canonical production domain.
- How to verify OG metadata and social previews.
- How to adjust rate limits.
- How to remove an abusive or unwanted mapping through the storage provider.
- Known limitations of social preview caching and crawler behavior.

Provide exact commands that match the package manager and scripts used by the project.

## 17. Implementation Workflow

Before writing code:

1. Inspect the existing project files and dependencies.
2. Determine the installed Next.js version and existing conventions.
3. Identify any existing functionality that should be preserved.
4. Check which environment variables and storage integrations are already configured.
5. Plan the smallest reliable implementation that meets these requirements.

Then implement the application end to end.

Do not stop after creating a mockup or a static homepage. URL creation, persistent storage, short-link resolution, crawler metadata, and rate limiting must actually work.

After implementation:

1. Run linting and TypeScript checks.
2. Run relevant tests.
3. Run a production build.
4. Fix issues found.
5. Review the responsive design.
6. Verify security-sensitive server-side behavior.
7. Summarize the completed implementation, configuration still required, test results, and deployment steps.

If an external service requires credentials that are not available, implement the integration correctly, provide an `.env.example`, and clearly identify the remaining setup steps. Do not invent credentials or claim the service is operational without them.

## 18. Final Acceptance Criteria

The project is complete only when:

- Anyone can open the homepage without logging in.
- The homepage contains a functional URL-shortening form.
- A successful request produces a short URL.
- The URL mapping is stored persistently.
- The short URL resolves correctly after separate requests and deployments.
- Social preview crawlers receive the global personal OG image and metadata.
- Ordinary visitors are redirected to the saved destination.
- Public creation endpoints have server-side validation and rate limiting.
- There is no login page, admin panel, or unnecessary dashboard.
- The interface is polished, responsive, and accessible.
- Linting, type checking, tests, and production build have been run and their results documented.
- Setup and deployment instructions are complete.

**Final principle:** Build a single-page, publicly accessible, personal-branded URL shortener. Keep it simple for visitors, secure on the server, persistent across deployments, and consistent in its Open Graph branding. Do not introduce authentication or an admin dashboard.
