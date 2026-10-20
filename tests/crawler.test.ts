import { describe, it, expect } from "vitest";
import { isSocialCrawler } from "../lib/crawler";

describe("Social Media Crawler Detection", () => {
  it("detects major social media crawlers", () => {
    const crawlerUserAgents = [
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "Facebot",
      "Twitterbot/1.0",
      "WhatsApp/2.21.12.21 A",
      "TelegramBot (like TwitterBot)",
      "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)",
      "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)",
      "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
      "Slack-ImgBatcher 1.0",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
      "Applebot/0.1",
      "Pinterest/0.2 (+http://www.pinterest.com/bot.html)",
    ];

    for (const ua of crawlerUserAgents) {
      expect(isSocialCrawler(ua)).toBe(true);
    }
  });

  it("does not flag standard human browser user agents as crawlers", () => {
    const humanUserAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
    ];

    for (const ua of humanUserAgents) {
      expect(isSocialCrawler(ua)).toBe(false);
    }
  });

  it("handles null, undefined, and empty string safely", () => {
    expect(isSocialCrawler(null)).toBe(false);
    expect(isSocialCrawler(undefined)).toBe(false);
    expect(isSocialCrawler("")).toBe(false);
  });
});
