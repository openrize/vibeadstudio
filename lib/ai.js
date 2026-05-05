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
- Never invent product features that aren't supported by the source content.
- Include brand name naturally when available.
- Keep each ad structurally different (do not reuse the same sentence pattern).`;

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
  const intelligence = detectAdIntelligence(scraped);
  if (hasAI()) {
    try {
      const aiAds = await generateAdsWithAI(scraped, tones, intelligence);
      return ensureMinimumAds(aiAds, scraped, tones);
    } catch (err) {
      console.error("OpenAI generation failed, falling back to mock:", err?.message);
    }
  }
  return ensureMinimumAds(generateAdsMock(scraped, tones), scraped, tones);
}

async function generateAdsWithAI(scraped, tones, intelligence) {
  const briefing = buildBriefingFromScraped(scraped);
  const stylePlan = [
    "Premium / Brand trust",
    "Performance / Product capability",
    "Action / Conversion",
    "Offer / Urgency",
  ]
    .slice(0, tones.length)
    .join(", ");
  const userPrompt = `Generate ${tones.length} distinct ad creatives based on the following webpage.
Each ad should target a different angle and use a different tone from this list (one each, in order): ${tones.join(", ")}.
Use this style order exactly: ${stylePlan}.
Detected Industry: ${intelligence.industry}
Target Audience: ${intelligence.audience}
Tone Direction: ${intelligence.tone}

Webpage briefing:
"""
${briefing}
"""

Return STRICT JSON matching:
{
  "ads": [
    { "headline": string, "body": string, "cta": string, "tone": string, "angle": string, "creativeConfidence": string }
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
  const category = detectCategory(scraped);
  const intelligence = detectAdIntelligence(scraped);
  const brand = scraped.siteName || "your brand";
  const displayBrand = formatBrandLabel(brand);
  const categoryTemplates =
    (CATEGORY_TEMPLATE_BUILDERS[category] || CATEGORY_TEMPLATE_BUILDERS.general)(displayBrand);
  const desc =
    scraped.description ||
    (scraped.paragraphs && scraped.paragraphs[0]) ||
    `Discover what ${brand} can do for you.`;
  const noun = guessNoun(scraped);

  const templates = [
    ...categoryTemplates,
    {
      headline: `${displayBrand} — ${noun}, without the friction`,
      body: `${truncate(desc, 150)} Built for teams that want clarity and speed.`,
      cta: "Get started",
    },
    {
      headline: `Stop wrestling with ${noun}`,
      body: `${displayBrand} turns slow workflows into momentum. ${truncate(desc, 110)}`,
      cta: "Try it free",
    },
    {
      headline: `${displayBrand}: a sharper way to win`,
      body: `Teams choose ${displayBrand} for ${noun}. ${truncate(desc, 110)}`,
      cta: "Book a demo",
    },
    {
      headline: `Your ${noun}, dialed in at ${displayBrand}`,
      body: `${truncate(desc, 150)} See why customers keep coming back.`,
      cta: "Start free trial",
    },
    {
      headline: `Still juggling clunky ${noun}?`,
      body: `${displayBrand} keeps it simple, fast, and on-brand. ${truncate(desc, 90)}`,
      cta: "Explore now",
    },
  ];

  return tones.map((tone, i) => {
    const t = templates[i % templates.length];
    return finalizeAd(
      {
        ...t,
        tone,
        creativeConfidence: i % 2 === 0 ? "High-performing variation" : "Optimized for conversions",
        angle: intelligence.defaultAngles[i % intelligence.defaultAngles.length],
      },
      scraped,
      tone
    );
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
      instruction = `Rewrite this ad with a clearly different angle and sentence structure but the same tone (${ad.tone}). Keep it about the same length. Do not reuse this headline: "${ad.headline}".`;
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
        `Why ${formatBrandLabel(scraped?.siteName || "this brand")} stands out`,
        `Built for buyers ready to act now`,
        `A premium choice for drivers who expect more`,
        `Move from browsing to booking with confidence`,
      ];
      const pick = variants[Math.floor(Math.random() * variants.length)];
      next.headline = pick === ad.headline ? `${pick} today` : pick;
      next.body = `${ad.body.split(".")[0]}. ${randomSpark()}`;
      next.creativeConfidence =
        Math.random() > 0.5 ? "High-performing variation" : "Optimized for conversions";
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
  const category = detectCategory(scraped);
  const seed = `${category}-${scraped?.siteName || "vibe"}-${finalTone}`.slice(0, 48);
  const image = prev?.image || pickImage(seed);
  return {
    id: prev?.id || uid(),
    headline,
    body,
    cta,
    tone: finalTone,
    score,
    image,
    creativeConfidence: ad.creativeConfidence || "Optimized for conversions",
    angle: ad.angle || "",
  };
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

function detectCategory(scraped) {
  const text = [
    scraped?.url || "",
    scraped?.title || "",
    scraped?.description || "",
    ...(scraped?.paragraphs || []),
  ]
    .join(" ")
    .toLowerCase();

  if (/(cadillac|automotive|auto|car|dealer|vehicle|suv|sedan)/.test(text)) return "automotive";
  if (/(real estate|property|homes|realtor|mortgage)/.test(text)) return "real-estate";
  if (/(restaurant|food|dining|cafe|menu|delivery)/.test(text)) return "food";
  if (/(fitness|gym|workout|health|wellness)/.test(text)) return "fitness";
  if (/(saas|software|platform|app|cloud|api|automation)/.test(text)) return "software";
  return "general";
}

function ensureMinimumAds(ads, scraped, tones) {
  const normalized = Array.isArray(ads) ? ads.filter(Boolean) : [];
  const targetCount = Math.max(4, tones?.length || 4);
  const fallback = generateAdsMock(scraped || {}, tones || pickTones(targetCount));
  const merged = [...normalized];
  let idx = 0;
  while (merged.length < targetCount) {
    merged.push(fallback[idx % fallback.length]);
    idx += 1;
  }
  return merged.slice(0, targetCount);
}

function formatBrandLabel(raw) {
  if (!raw) return "Your brand";
  let s = String(raw).trim().replace(/^www\./, "");
  s = s.split(".")[0] || s;
  s = s.replace(/[-_]+/g, " ");
  s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const CATEGORY_TEMPLATE_BUILDERS = {
  automotive: (b) => [
    {
      headline: `Experience the ${b} standard`,
      body: `Explore the latest models with refined luxury, advanced safety features, and confidence engineered for every drive.`,
      cta: "Explore Inventory",
    },
    {
      headline: `Precision performance meets luxury`,
      body: `Discover ${b} vehicles designed with cutting-edge technology, smooth handling, and comfort that elevates every mile.`,
      cta: "View Models",
    },
    {
      headline: `Drive your ${b} today`,
      body: `Browse available models and schedule a test drive to experience premium performance and standout design.`,
      cta: "Book a Test Drive",
    },
    {
      headline: `Find your next luxury vehicle`,
      body: `Explore current inventory and discover premium vehicles ready for immediate delivery in your area.`,
      cta: "Check Availability",
    },
  ],
  "real-estate": (b) => [
    {
      headline: `Homes that fit your life — ${b}`,
      body: `Browse listings with clear photos, neighborhood context, and pricing signals so you compare with confidence.`,
      cta: "View listings",
    },
    {
      headline: `Tour-ready properties near you`,
      body: `${b} helps you shortlist faster: schools, commute, and lifestyle fit—without the spreadsheet chaos.`,
      cta: "Schedule a tour",
    },
    {
      headline: `Sell with a sharper story`,
      body: `Position your home with market-aware pricing and marketing that highlights what buyers actually value.`,
      cta: "Get a valuation",
    },
    {
      headline: `First-time buyer? Start here`,
      body: `Step-by-step guidance from pre-approval to keys, with plain-language explanations at every milestone.`,
      cta: "Talk to an agent",
    },
  ],
  food: (b) => [
    {
      headline: `Tonight’s table at ${b}`,
      body: `Seasonal ingredients, consistent execution, and dishes guests photograph before the first bite.`,
      cta: "Reserve a table",
    },
    {
      headline: `Delivery & pickup, still restaurant-quality`,
      body: `Packaging that travels well and flavors that arrive hot—${b} built for real weeknights, not just weekends.`,
      cta: "Order now",
    },
    {
      headline: `The menu regulars order on repeat`,
      body: `Chef-driven staples and weekly specials that reward loyal guests without feeling predictable.`,
      cta: "See the menu",
    },
    {
      headline: `Private events, zero guesswork`,
      body: `Catering portions, dietary notes, and timeline coordination handled so hosts can enjoy the room.`,
      cta: "Plan an event",
    },
  ],
  fitness: (b) => [
    {
      headline: `Train with a plan at ${b}`,
      body: `Structured progressions, form coaching, and accountability that turns “I should” into “I did.”`,
      cta: "Start a trial",
    },
    {
      headline: `Strength that fits your schedule`,
      body: `Efficient sessions, smart recovery, and programming that respects soreness and real life.`,
      cta: "Book a class",
    },
    {
      headline: `Metrics you can feel, not just track`,
      body: `Beyond the scale: energy, sleep, and performance markers ${b} uses to keep you improving.`,
      cta: "See programs",
    },
    {
      headline: `Coaching that meets you where you are`,
      body: `Beginner-friendly onboarding and advanced options—same team, same standard of care.`,
      cta: "Meet coaches",
    },
  ],
  software: (b) => [
    {
      headline: `${b} cuts busywork across your team`,
      body: `Automate handoffs, reduce context switching, and ship updates with fewer meetings and fewer mistakes.`,
      cta: "Start free trial",
    },
    {
      headline: `One workspace. Fewer “where is that file?” moments`,
      body: `Centralize projects, permissions, and approvals so everyone works from the same source of truth.`,
      cta: "Get a demo",
    },
    {
      headline: `Integrations that actually stick`,
      body: `Connect the tools you already use—${b} is built to sync data, not duplicate it.`,
      cta: "See integrations",
    },
    {
      headline: `Security-minded by default`,
      body: `Role-based access, audit-friendly workflows, and guardrails that help teams scale without sprawl.`,
      cta: "Talk to sales",
    },
  ],
  general: (b) => [
    {
      headline: `${b} — offers your audience will notice`,
      body: `Lead with a clear promise, specific proof points, and a next step that feels obvious, not salesy.`,
      cta: "See what’s new",
    },
    {
      headline: `Turn clicks into qualified interest`,
      body: `Copy tuned to your page signals at ${b}, so visitors see relevance in the first line—not generic fluff.`,
      cta: "Get started",
    },
    {
      headline: `Built from your site, not a template farm`,
      body: `Headlines and body lines reference what you actually sell, so ads feel grounded and trustworthy.`,
      cta: "Explore offers",
    },
    {
      headline: `Launch campaigns that feel on-brand`,
      body: `Consistent voice, stronger CTAs, and creative that matches the story already on your website.`,
      cta: "View details",
    },
  ],
};

export function detectAdIntelligence(scraped) {
  const category = detectCategory(scraped);
  const automotiveLuxury = /(cadillac|lexus|mercedes|bmw|audi|lincoln|infiniti|acura)/i.test(
    [scraped?.url || "", scraped?.title || "", scraped?.description || ""].join(" ")
  );
  if (category === "automotive" && automotiveLuxury) {
    return {
      industry: "Automotive (Luxury Vehicles)",
      audience: "High-income buyers / local dealership customers",
      tone: "Premium / Performance / Trust",
      defaultAngles: ["Premium", "Performance", "Conversion", "Offer"],
    };
  }
  const map = {
    automotive: {
      industry: "Automotive",
      audience: "In-market car buyers",
      tone: "Performance / Trust / Value",
      defaultAngles: ["Brand", "Performance", "Conversion", "Urgency"],
    },
    "real-estate": {
      industry: "Real Estate",
      audience: "Home buyers and sellers",
      tone: "Trust / Guidance / Action",
      defaultAngles: ["Lifestyle", "Proof", "Action", "Urgency"],
    },
    food: {
      industry: "Food & Hospitality",
      audience: "Local diners and delivery customers",
      tone: "Taste / Convenience / Urgency",
      defaultAngles: ["Experience", "Menu", "Conversion", "Offer"],
    },
    fitness: {
      industry: "Fitness & Wellness",
      audience: "Goal-oriented health seekers",
      tone: "Motivation / Performance / Confidence",
      defaultAngles: ["Emotion", "Performance", "Action", "Urgency"],
    },
    software: {
      industry: "Software / SaaS",
      audience: "Operators and decision-makers",
      tone: "Efficiency / Credibility / Growth",
      defaultAngles: ["Pain point", "Feature", "Conversion", "Offer"],
    },
    general: {
      industry: "General Business",
      audience: "Prospective customers",
      tone: "Clarity / Trust / Action",
      defaultAngles: ["Brand", "Benefit", "Action", "Urgency"],
    },
  };
  return map[category] || map.general;
}
