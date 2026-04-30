import * as cheerio from "cheerio";
import { clean } from "./utils.js";

const UA =
  "Mozilla/5.0 (compatible; VibeAdStudioBot/1.0; +https://vibe-ad-studio.local)";

export async function scrapeUrl(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    // 12s soft cap via AbortController
    signal: AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch URL (${res.status})`);
  }

  const ctype = res.headers.get("content-type") || "";
  if (!ctype.includes("text/html") && !ctype.includes("application/xhtml")) {
    throw new Error("URL did not return HTML content");
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Drop noise
  $("script, style, noscript, svg, nav, footer, header, form, iframe").remove();

  const title =
    clean($('meta[property="og:title"]').attr("content")) ||
    clean($("title").first().text()) ||
    clean($("h1").first().text());

  const description =
    clean($('meta[name="description"]').attr("content")) ||
    clean($('meta[property="og:description"]').attr("content")) ||
    "";

  const siteName =
    clean($('meta[property="og:site_name"]').attr("content")) ||
    new URL(url).hostname.replace(/^www\./, "");

  const ogImage =
    clean($('meta[property="og:image"]').attr("content")) ||
    clean($('meta[name="twitter:image"]').attr("content")) ||
    "";

  // Get main paragraph content
  const paragraphs = [];
  $("p").each((_, el) => {
    const t = clean($(el).text());
    if (t && t.length > 60) paragraphs.push(t);
  });

  // Fallback: if not enough <p>, grab body text chunks
  if (paragraphs.length < 3) {
    const body = clean($("body").text());
    body
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.length > 60)
      .slice(0, 6)
      .forEach((s) => paragraphs.push(s));
  }

  const keyParagraphs = paragraphs.slice(0, 5);

  return {
    url,
    siteName,
    title: title || siteName,
    description,
    ogImage,
    paragraphs: keyParagraphs,
  };
}
