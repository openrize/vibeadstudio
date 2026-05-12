import * as cheerio from "cheerio";
import { clean } from "./utils.js";

const UA =
  "Mozilla/5.0 (compatible; VibeAdStudioBot/1.0; +https://vibe-ad-studio.local)";

function uniqueStrings(arr, max = 20, minLen = 2) {
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const t = clean(raw);
    if (!t || t.length < minLen) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function looksLikeBenefit(text) {
  const t = text.toLowerCase();
  return (
    /^(save|get|enjoy|unlock|boost|reduce|faster|secure|easy|free|unlimited|24\/7|award|trusted)/.test(t) ||
    /\b(no credit card|money[- ]back|guarantee|certified|rated|reviews?)\b/.test(t)
  );
}

function looksLikePricing(text) {
  return /\$|€|£|\b(usd|eur|gbp)\b|\b(per month|\/mo|monthly|annual|yearly)\b|\b\d+%\s*off\b|\bfree trial\b/i.test(
    text
  );
}

export async function scrapeUrl(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
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

  // Keep structure for hero/headings; strip heavy noise first
  $("script, style, noscript, svg, iframe").remove();

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

  const h1Texts = [];
  $("h1").each((_, el) => {
    const t = clean($(el).text());
    if (t && t.length > 2) h1Texts.push(t);
  });
  const heroHeadline = h1Texts[0] || title || siteName;

  const headings = [];
  $("h2, h3").each((_, el) => {
    const t = clean($(el).text());
    if (t && t.length > 8 && t.length < 180) headings.push(t);
  });

  // Product / service names: strong cards, feature grid titles
  const productNames = [];
  $("[class*='product'], [class*='plan'], [class*='pricing'] h3, .card-title, [data-product]").each(
    (_, el) => {
      const t = clean($(el).text());
      if (t && t.length > 2 && t.length < 80) productNames.push(t);
    }
  );

  // CTA snippets from buttons and primary links
  const ctaSnippets = [];
  $("a, button").each((_, el) => {
    const t = clean($(el).text());
    if (t && t.length >= 2 && t.length <= 48) ctaSnippets.push(t);
  });

  // List items → benefits / features
  const benefitCandidates = [];
  const featureBullets = [];
  $("li").each((_, el) => {
    const t = clean($(el).text());
    if (t.length < 20 || t.length > 220) return;
    if (looksLikeBenefit(t)) benefitCandidates.push(t);
    else if (t.length < 140) featureBullets.push(t);
  });

  // Testimonials / reviews
  const testimonials = [];
  $("blockquote").each((_, el) => {
    const t = clean($(el).text());
    if (t.length > 40) testimonials.push(t);
  });
  $("[class*='testimonial'], [class*='review'], [itemprop='reviewBody']").each((_, el) => {
    const t = clean($(el).text());
    if (t.length > 40 && t.length < 500) testimonials.push(t);
  });

  // Trust signals
  const trustSignals = [];
  const trustSelectors = [
    "[class*='trust']",
    "[class*='badge']",
    "[class*='logo-bar']",
    "[class*='partner']",
    "[class*='award']",
    "[class*='ssl']",
    "[class*='secure']",
  ];
  trustSelectors.forEach((sel) => {
    $(sel).each((_, el) => {
      const t = clean($(el).text());
      if (t.length > 8 && t.length < 120) trustSignals.push(t);
    });
  });

  // Offers / pricing lines
  const offersOrPricing = [];
  const bodyTextEarly = clean($("body").text()).slice(0, 8000);
  bodyTextEarly.split(/\n+/).forEach((line) => {
    const t = clean(line);
    if (t.length > 12 && t.length < 200 && looksLikePricing(t)) offersOrPricing.push(t);
  });

  // Remove chrome for paragraph extraction
  $("nav, footer, form").remove();

  const paragraphs = [];
  $("p").each((_, el) => {
    const t = clean($(el).text());
    if (t && t.length > 60) paragraphs.push(t);
  });

  if (paragraphs.length < 3) {
    const body = clean($("body").text());
    body
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.length > 60)
      .slice(0, 6)
      .forEach((s) => paragraphs.push(s));
  }

  const keyParagraphs = paragraphs.slice(0, 6);

  return {
    url,
    siteName,
    title: title || siteName,
    description,
    ogImage,
    heroHeadline,
    headings: uniqueStrings(headings, 14),
    productNames: uniqueStrings(productNames, 12),
    benefits: uniqueStrings(benefitCandidates, 10),
    featureBullets: uniqueStrings(featureBullets, 12),
    testimonials: uniqueStrings(testimonials, 5),
    offersOrPricing: uniqueStrings(offersOrPricing, 6),
    trustSignals: uniqueStrings(trustSignals, 10),
    ctaSnippets: uniqueStrings(ctaSnippets, 12),
    paragraphs: keyParagraphs,
  };
}
