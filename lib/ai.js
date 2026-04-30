import OpenAI from "openai";
import { TONES, scoreFromText, pickImage, uid, clean } from "./utils.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

const SYSTEM_PROMPT = `You are a senior performance-marketing copywriter.
You write scroll-stopping ad creatives for paid social and display.
You always respond with STRICT JSON matching the requested schema.
Rules:
- Headlines: punchy, <= 60 characters, no trailing punctuation, no emojis unless tone calls for it.
- Body: 1-2 sentences, 110-180 characters, benefit-led, concrete, no buzzword salad.
- CTA: 2-4 words, action verb first (e.g. "Start free trial", "Get the demo").
- Match the requested tone exactly.
- Never invent product features that aren't supported by the source content.`;

function buildBriefingFromScraped(scraped) {
  const paras = (scraped.paragraphs || []).join("\n").slice(0, 1800);
  return [
    `Site: ${scraped.siteName || ""}`,
    `URL: ${scraped.url || ""}`,
    `Page title: ${scraped.title || ""}`,
    `Meta description: ${scraped.description || ""}`,
    `Key page content:`,
    paras,
  ]
    .filter(Boolean)
    .join("\n");
}

async function jsonChat(messages) {
  const client = getClient();
  if (!client) throw new Error("OPENAI_API_KEY not set");
  const res = await client.chat.completions.create({
    model: MODEL,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.85,
  });
  const raw = res.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(raw);
  } catch {
    // Fallback: try to extract JSON
    const m = raw.match(/\{[\s\S]*\}$/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Model returned invalid JSON");
  }
}

export function hasAI() {
  return !!process.env.OPENAI_API_KEY;
}

/* ----------------------- Generate ads ----------------------- */

export async function generateAds(scraped, count = 4) {
  const tones = pickTones(count);
  if (hasAI()) {
    try {
      return await generateAdsWithAI(scraped, tones);
    } catch (err) {
      console.error("OpenAI generation failed, falling back to mock:", err?.message);
    }
  }
  return generateAdsMock(scraped, tones);
}

async function generateAdsWithAI(scraped, tones) {
  const briefing = buildBriefingFromScraped(scraped);
  const userPrompt = `Generate ${tones.length} distinct ad creatives based on the following webpage.
Each ad should target a different angle and use a different tone from this list (one each, in order): ${tones.join(", ")}.

Webpage briefing:
"""
${briefing}
"""

Return STRICT JSON matching:
{
  "ads": [
    { "headline": string, "body": string, "cta": string, "tone": string, "angle": string }
  ]
}`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const ads = (data.ads || []).slice(0, tones.length).map((a, i) => finalizeAd(a, scraped, tones[i]));
  if (ads.length === 0) return generateAdsMock(scraped, tones);
  return ads;
}

function generateAdsMock(scraped, tones) {
  const brand = scraped.siteName || "your brand";
  const desc =
    scraped.description ||
    (scraped.paragraphs && scraped.paragraphs[0]) ||
    `Discover what ${brand} can do for you.`;
  const noun = guessNoun(scraped);

  const templates = [
    {
      headline: `Meet ${capitalize(brand)} — ${noun}, simplified`,
      body: `${truncate(desc, 150)} Built for teams that ship.`,
      cta: "Get started",
    },
    {
      headline: `Stop wrestling with ${noun}`,
      body: `${capitalize(brand)} turns hours into minutes. ${truncate(desc, 110)}`,
      cta: "Try it free",
    },
    {
      headline: `${capitalize(brand)}: the unfair advantage`,
      body: `Smart teams pick ${capitalize(brand)} for ${noun}. ${truncate(desc, 110)}`,
      cta: "Book a demo",
    },
    {
      headline: `Your ${noun}, ten times faster`,
      body: `${truncate(desc, 150)} See why thousands switched to ${capitalize(brand)}.`,
      cta: "Start free trial",
    },
    {
      headline: `Tired of clunky ${noun}?`,
      body: `${capitalize(brand)} keeps it simple, fast, and beautiful. ${truncate(desc, 90)}`,
      cta: "Explore now",
    },
  ];

  return tones.map((tone, i) => {
    const t = templates[i % templates.length];
    return finalizeAd({ ...t, tone }, scraped, tone);
  });
}

/* ----------------------- Edit single ad ----------------------- */

export async function editAd({ ad, action, tone, scraped }) {
  if (hasAI()) {
    try {
      return await editAdWithAI({ ad, action, tone, scraped });
    } catch (err) {
      console.error("OpenAI edit failed, falling back to mock:", err?.message);
    }
  }
  return editAdMock({ ad, action, tone, scraped });
}

async function editAdWithAI({ ad, action, tone, scraped }) {
  const briefing = buildBriefingFromScraped(scraped || {});
  let instruction = "";
  let nextTone = ad.tone;
  switch (action) {
    case "regenerate":
      instruction = `Rewrite this ad with a different angle but the same tone (${ad.tone}). Keep it about the same length.`;
      break;
    case "shorten":
      instruction = `Shorten this ad meaningfully. Headline must be <= 40 characters and body <= 90 characters. Keep tone ${ad.tone}.`;
      break;
    case "bolder":
      instruction = `Rewrite the ad in a noticeably bolder, punchier voice. Stronger verbs, more confident claims (still truthful).`;
      nextTone = "Bold";
      break;
    case "tone":
      instruction = `Rewrite the ad in a "${tone}" tone. Keep the offer the same.`;
      nextTone = tone || ad.tone;
      break;
    default:
      instruction = `Improve this ad's clarity and conversion potential.`;
  }

  const userPrompt = `${instruction}

Current ad:
${JSON.stringify({ headline: ad.headline, body: ad.body, cta: ad.cta, tone: ad.tone })}

Webpage briefing for context:
"""
${briefing}
"""

Return STRICT JSON: { "ad": { "headline": string, "body": string, "cta": string, "tone": string } }`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const next = data.ad || {};
  return finalizeAd(
    {
      headline: next.headline || ad.headline,
      body: next.body || ad.body,
      cta: next.cta || ad.cta,
      tone: next.tone || nextTone,
    },
    scraped || {},
    next.tone || nextTone,
    ad
  );
}

function editAdMock({ ad, action, tone, scraped }) {
  const next = { ...ad };
  switch (action) {
    case "regenerate": {
      const variants = [
        `${ad.headline.split(" ").reverse().slice(0, 6).join(" ")} — reimagined`,
        `Why teams switch to ${scraped?.siteName || "us"}`,
        `${ad.headline.split("—")[0].trim()} that just works`,
      ];
      next.headline = variants[Math.floor(Math.random() * variants.length)].slice(0, 60);
      next.body = `${ad.body.split(".")[0]}. ${randomSpark()}`;
      break;
    }
    case "shorten": {
      next.headline = ad.headline.split(/[—:,-]/)[0].trim().slice(0, 40);
      next.body = ad.body.split(".")[0].slice(0, 90) + ".";
      next.cta = ad.cta.split(" ").slice(0, 2).join(" ");
      break;
    }
    case "bolder": {
      next.headline = ad.headline.replace(/\.$/, "") + ". Period.";
      next.body = ad.body.replace(/\bcan\b/gi, "will").replace(/\btry\b/gi, "switch");
      next.tone = "Bold";
      break;
    }
    case "tone": {
      const t = tone || "Friendly";
      next.tone = t;
      if (t === "Playful") next.headline = "Pssst… " + ad.headline.toLowerCase();
      if (t === "Premium") next.headline = "Introducing " + ad.headline;
      if (t === "Urgent") next.headline = ad.headline + " — today only";
      if (t === "Minimal") next.body = ad.body.split(".")[0] + ".";
      if (t === "Inspiring") next.body = ad.body + " The future favors the bold.";
      if (t === "Friendly") next.body = "Hey — " + ad.body.toLowerCase();
      break;
    }
  }
  return finalizeAd(next, scraped || {}, next.tone, ad);
}

/* ----------------------- helpers ----------------------- */

function pickTones(count) {
  const pool = [...TONES];
  const out = [];
  while (out.length < count) {
    const idx = Math.floor(Math.random() * pool.length);
    out.push(pool.splice(idx, 1)[0]);
    if (pool.length === 0) pool.push(...TONES);
  }
  return out;
}

function finalizeAd(ad, scraped, tone, prev = null) {
  const headline = clean(ad.headline || "").slice(0, 80);
  const body = clean(ad.body || "").slice(0, 240);
  const cta = clean(ad.cta || "Learn more").slice(0, 30);
  const finalTone = tone || ad.tone || "Bold";
  const score = scoreFromText(headline, body, cta);
  const seed = (scraped?.siteName || "vibe") + "-" + headline.slice(0, 16);
  const image = prev?.image || pickImage(seed);
  return {
    id: prev?.id || uid(),
    headline,
    body,
    cta,
    tone: finalTone,
    score,
    image,
  };
}

function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}
function guessNoun(scraped) {
  const text = `${scraped.title || ""} ${scraped.description || ""}`.toLowerCase();
  const candidates = [
    ["analytics", "your data"],
    ["design", "your design workflow"],
    ["shop", "shopping"],
    ["store", "shopping"],
    ["learn", "learning"],
    ["course", "learning"],
    ["finance", "your money"],
    ["bank", "your money"],
    ["travel", "your next trip"],
    ["food", "ordering"],
    ["fitness", "your training"],
    ["hire", "hiring"],
    ["recruit", "hiring"],
    ["marketing", "campaigns"],
    ["ads", "ad creative"],
    ["video", "video"],
    ["chat", "support"],
    ["support", "support"],
    ["code", "shipping code"],
    ["dev", "shipping code"],
  ];
  for (const [k, v] of candidates) if (text.includes(k)) return v;
  return "the work";
}
function randomSpark() {
  const sparks = [
    "No setup. No learning curve.",
    "Loved by teams from startups to F500.",
    "Yes, it really is that simple.",
    "Built for the way modern teams ship.",
    "Pricing that won't make ops cry.",
  ];
  return sparks[Math.floor(Math.random() * sparks.length)];
}
