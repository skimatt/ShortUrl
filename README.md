# links.

> Long links. Short and simple.

A minimalist personal URL shortener built with **Next.js**, **Three.js**, and **Tailwind CSS**. Every short link shares unified Open Graph branding for social crawlers while instantly redirecting human visitors.

---

## ✨ Highlights

- **Zero Friction**: Single-page app. No login, sign-up, or dashboard clutter.
- **Unified Branding**: Every link displays consistent personal Open Graph & Twitter card previews.
- **3D Celestial Playground**: Interactive Three.js scene with characters (Mochi, Pip & Chirp), toy ball, and buttery-smooth Day/Night transitions (Sun & Moon).
- **Security Built-In**: Cryptographic 8-char slugs, IP rate limiting, and SSRF prevention.
- **Zero-Config Storage**: Works out-of-the-box locally, seamlessly connects to Upstash Redis for Vercel deployments.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) & React 19
- **3D Graphics**: Three.js
- **Styling**: Tailwind CSS (Terracotta `#d46a4a` theme, Dark/Light modes)
- **Validation**: Zod & Node.js `crypto`
- **Storage**: Upstash Redis + Local JSON fallback
- **Testing**: Vitest (31 tests)

---

## 🚀 Getting Started

```bash
# Clone repository
git clone https://github.com/skimatt/ShortUrl.git
cd ShortUrl

# Install dependencies
npm install

# Run locally (zero-config, works immediately)
npm run dev
```

Visit [https://linkskie.vercel.app](https://linkskie.vercel.app) (or `http://localhost:3000` for local development).

---

## ⚙️ Environment Variables (Optional for Production)

For local development, no `.env` file is required. When deploying to Vercel, configure:

```env
SITE_URL="https://linkskie.vercel.app"
UPSTASH_REDIS_REST_URL="https://your-database.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

---

## 🧪 Commands

- `npm run dev` — Start development server
- `npm test` — Run Vitest test suite
- `npm run build` — Build production bundle
- `npm run lint` — Run ESLint

---

## 📄 License

MIT © [skimatt](https://github.com/skimatt)
