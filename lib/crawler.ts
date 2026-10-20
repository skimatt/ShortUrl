/**
 * Social media crawler detection module.
 * Identifies bots and preview crawlers requesting link metadata.
 */

const KNOWN_CRAWLER_SUBSTRINGS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "whatsapp",
  "telegrambot",
  "linkedinbot",
  "discordbot",
  "slackbot",
  "slack-imgbatcher",
  "skypeuripreview",
  "applebot",
  "pinterest",
  "googlebot",
  "bingbot",
  "duckduckbot",
  "vkshare",
  "redditbot",
  "mastodon",
  "line-poker",
  "bytespider",
  "yandexbot",
  "baiduspider",
];

/**
 * Checks whether the incoming User-Agent matches any known social preview or web crawler.
 */
export function isSocialCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent || typeof userAgent !== "string") {
    return false;
  }

  const normalized = userAgent.toLowerCase();

  return KNOWN_CRAWLER_SUBSTRINGS.some((bot) => normalized.includes(bot));
}
