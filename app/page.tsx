"use client";

import { useState, useRef, useEffect } from "react";
import {
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  X,
  RotateCcw,
  Link2,
} from "lucide-react";
import CuteCharacter from "@/components/cute-character";

interface ShortenResponse {
  slug: string;
  shortUrl: string;
  destinationUrl: string;
}

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark";
      setTheme(isDark ? "dark" : "light");
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setError(null);
    setCopied(false);

    const trimmed = url.trim();
    if (!trimmed) {
      setError("Please paste a destination URL.");
      inputRef.current?.focus();
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      setError("URL must begin with http:// or https://");
      inputRef.current?.focus();
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL. Please try again.");
      }

      setResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected network error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.shortUrl) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = result.shortUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch {
        setError("Unable to copy to clipboard.");
      }
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
    setError(null);
    setCopied(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative app-texture text-foreground transition-colors duration-200 overflow-hidden">
      {/* 3D Animated Playground with Day/Night Celestial Sun & Moon */}
      <CuteCharacter theme={theme} />

      {/* Subtle top terracotta accent */}
      <div
        style={{ backgroundColor: "var(--terracotta)" }}
        className="w-full h-[2px] relative z-10"
      />

      {/* Header */}
      <header className="w-full max-w-xl mx-auto px-5 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Brand SVG Mark */}
          <div className="w-6 h-6 rounded-lg overflow-hidden flex items-center justify-center shadow-xs border border-black/5 dark:border-white/10 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            links<span style={{ color: "var(--terracotta)" }}>.</span>
          </span>
        </div>

        {/* Minimal Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
            color: "var(--muted)",
          }}
          className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer hover:opacity-80 backdrop-blur-xs"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-700" />
            )
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse" />
          )}
        </button>
      </header>

      {/* Main SaaS Card Container */}
      <main className="w-full max-w-lg mx-auto px-5 py-8 flex-1 flex flex-col justify-center relative z-10">
        {/* Compact Hero */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Long links.{" "}
            <span style={{ color: "var(--terracotta)" }}>Short and simple.</span>
          </h1>
          <p
            style={{ color: "var(--muted)" }}
            className="text-xs sm:text-sm max-w-xs sm:max-w-sm mx-auto leading-normal"
          >
            Shorten your links instantly.
          </p>
        </div>

        {/* Sleek Input Card */}
        <div
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--card-border)",
          }}
          className="rounded-xl border p-1.5 shadow-sm transition-all backdrop-blur-xs"
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-1.5">
            <div className="relative flex-1 flex items-center">
              <Link2 className="w-3.5 h-3.5 absolute left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Paste your long URL here (https://...)"
                disabled={isLoading}
                aria-label="Destination URL"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--input-border)",
                  color: "var(--fg)",
                }}
                className="w-full h-10 pl-8 pr-8 font-sans text-xs sm:text-sm tracking-normal rounded-lg border focus:outline-none focus:ring-1 focus:ring-[#d46a4a] transition-all disabled:opacity-50 placeholder:font-normal placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              {url.length > 0 && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl("")}
                  aria-label="Clear input"
                  className="absolute right-2.5 p-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              style={{
                backgroundColor: "var(--terracotta)",
              }}
              className="h-10 px-4 rounded-lg font-sans font-medium text-xs sm:text-sm text-white hover:opacity-90 active:opacity-100 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0 shadow-xs"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="mt-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-1.5 animate-in fade-in duration-150"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Result Area */}
        {result && (
          <div
            style={{
              backgroundColor: "var(--card)",
              borderColor: "var(--card-border)",
            }}
            className="mt-4 p-4 rounded-xl border shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xs"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-medium tracking-wide text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Ready</span>
              </span>

              <button
                type="button"
                onClick={handleReset}
                style={{ color: "var(--muted)" }}
                className="text-[11px] hover:opacity-80 flex items-center gap-1 cursor-pointer transition-opacity"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>New</span>
              </button>
            </div>

            {/* Compact Short URL Item */}
            <div
              style={{
                backgroundColor: "var(--input-bg)",
                borderColor: "var(--input-border)",
              }}
              className="flex items-center justify-between gap-2 p-2.5 rounded-lg border"
            >
              <span className="font-mono text-xs sm:text-sm font-medium truncate select-all px-1">
                {result.shortUrl}
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    borderColor: "var(--card-border)",
                    color: "var(--fg)",
                  }}
                  className="h-8 px-2.5 rounded-md border text-xs font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                  title="Visit link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Visit</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`h-8 px-3 rounded-md font-medium text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${copied
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90"
                    }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Destination Preview */}
            <div
              style={{ color: "var(--muted)" }}
              className="mt-2 text-[11px] flex items-center gap-1 truncate"
            >
              <span className="shrink-0 font-medium opacity-80">To:</span>
              <span className="font-mono truncate">{result.destinationUrl}</span>
            </div>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer
        style={{
          borderColor: "var(--card-border)",
          color: "var(--muted)",
        }}
        className="w-full max-w-xl mx-auto px-5 py-5 border-t text-[11px] flex items-center justify-between relative z-10"
      >
        <span className="font-medium">
          links<span style={{ color: "var(--terracotta)" }}>.</span>
        </span>
        <a
          href="https://instagram.com/skimatt_"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--muted)" }}
          className="flex items-center gap-1.5 transition-colors hover:text-[#d46a4a]"
          title="Instagram @skimatt_"
        >
          <InstagramIcon className="w-3.5 h-3.5" />

        </a>
      </footer>
    </div>
  );
}
