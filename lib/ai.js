import OpenAI from "openai";
import { buildBrandIntel } from "./industry.js";
import {
  buildExtractedContent,
  buildStrategyBrandIntelligence,
  buildStrategyOutput,
  CAMPAIGN_TYPE_ORDER,
  ensureSixCampaigns,
  getCampaignMeta,
  normalizeCampaign,
} from "./strategy.js";
import { generateStrategyMock, editCampaignLocal } from "./campaignLocal.js";

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const STRATEGIST_SYSTEM = `You are an expert AI marketing strategist. Analyze business website content deeply.
Extract brand intelligence, audience, positioning, trust signals, pricing style, offers, and core messaging.
Generate a full-funnel campaign strategy system — NOT generic ad variations.
Create six strategically different campaigns: Awareness, Conversion, Retargeting, Promotional, Emotional, and Authority.
Each campaign must have distinct goal, audience angle, psychology, tone, CTA strategy, competitive angle, why-it-works, suggested visual direction, and copy.
Ground every claim in provided website excerpts. Do not invent testimonials, prices, or statistics not hinted in source.
Return STRICT JSON only matching the requested schema.`;

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

function buildBriefing(scraped, extracted, brandIntel) {
  return [
    `URL: ${scraped.url}`,
    `Business: ${brandIntel.businessName}`,
    `Industry: ${brandIntel.industry}`,
    `Audience: ${brandIntel.audience}`,
    `Positioning: ${brandIntel.positioning}`,
    `Brand personality: ${brandIntel.brandPersonality}`,
    `Emotional tone: ${brandIntel.emotionalTone}`,
    `Trust signals: ${(brandIntel.trustSignals || []).join(" | ")}`,
    `Pricing style: ${brandIntel.pricingStyle}`,
    `Core offer: ${brandIntel.coreOffer}`,
    `Campaign direction: ${brandIntel.recommendedCampaignDirection}`,
    `Hero messaging: ${extracted.heroMessaging.join(" || ")}`,
    `Products/services: ${extracted.productsServices.join(" || ")}`,
    `Testimonials: ${extracted.testimonials.join(" || ")}`,
    `Pricing: ${extracted.pricing.join(" || ")}`,
    `Offers: ${extracted.offers.join(" || ")}`,
    `Features: ${extracted.featureBlocks.join(" || ")}`,
    `CTAs on page: ${extracted.ctaSections.join(" | ")}`,
    `Paragraphs: ${(scraped.paragraphs || []).slice(0, 4).join(" • ")}`,
  ]
    .join("\n")
    .slice(0, 10000);
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
    const m = raw.match(/\{[\s\S]*\}$/);
    if (m) return JSON.parse(m[0]);
    throw new Error("Model returned invalid JSON");
  }
}

export function hasAI() {
  return !!process.env.OPENAI_API_KEY;
}

/** @returns {{ strategy: object, usedAI: boolean }} */
export async function generateStrategy(scraped) {
  const legacyIntel = buildBrandIntel(scraped);
  const brandIntel = buildStrategyBrandIntelligence(scraped, legacyIntel);
  const extracted = buildExtractedContent(scraped);

  if (hasAI()) {
    try {
      const strategy = await generateStrategyWithAI(scraped, brandIntel, extracted);
      return { strategy, usedAI: true };
    } catch (err) {
      console.error("OpenAI strategy generation failed:", err?.message);
    }
  }

  const mockCampaigns = generateStrategyMock(scraped, brandIntel);
  const strategy = buildStrategyOutput(scraped, mockCampaigns, brandIntel);
  return { strategy, usedAI: false };
}

async function generateStrategyWithAI(scraped, brandIntel, extracted) {
  const briefing = buildBriefing(scraped, extracted, brandIntel);
  const typeLines = CAMPAIGN_TYPE_ORDER.map((id, i) => {
    const m = getCampaignMeta(id);
    return `${i + 1}. typeId="${id}" displayType="${m.type}" goal="${m.goal}" psychology="${m.psychology}"`;
  }).join("\n");

  const userPrompt = `Analyze this business and return a complete StrategyOutput JSON.

Website briefing:
"""
${briefing}
"""

Generate EXACTLY six campaigns in this order (one per typeId):
${typeLines}

Return JSON:
{
  "brandIntelligence": {
    "industry": string,
    "audience": string,
    "positioning": string,
    "brandPersonality": string,
    "emotionalTone": string,
    "trustSignals": string[],
    "pricingStyle": string,
    "coreOffer": string,
    "recommendedCampaignDirection": string
  },
  "extractedContent": {
    "heroMessaging": string[],
    "productsServices": string[],
    "testimonials": string[],
    "pricing": string[],
    "offers": string[],
    "featureBlocks": string[],
    "trustSignals": string[],
    "ctaSections": string[]
  },
  "campaigns": [
    {
      "typeId": "awareness|conversion|retargeting|promotional|emotional|authority",
      "type": "Awareness Campaign" (etc),
      "goal": string,
      "audience": string,
      "positioning": string,
      "ctaStrategy": string,
      "competitiveAngle": string,
      "whyThisWorks": string,
      "psychology": string,
      "tone": string,
      "headline": string (<=62 chars),
      "primaryText": string (2 sentences, website-specific),
      "shortCaption": string,
      "ctaButton": string (2-5 words),
      "suggestedVisualDirection": string
    }
  ]
}

Each campaign must feel strategically different — not minor rewrites. Reference actual extracted content when available.`;

  const data = await jsonChat([
    { role: "system", content: STRATEGIST_SYSTEM },
    { role: "user", content: userPrompt },
  ]);

  const mergedIntel = data.brandIntelligence
    ? { ...brandIntel, ...data.brandIntelligence, industryKey: brandIntel.industryKey }
    : brandIntel;

  const campaigns = (data.campaigns || []).map((c, i) =>
    normalizeCampaign({ ...c, typeId: c.typeId || CAMPAIGN_TYPE_ORDER[i] }, scraped, mergedIntel, i)
  );

  const strategy = buildStrategyOutput(scraped, campaigns, mergedIntel);
  if (data.brandIntelligence) {
    strategy.brandIntelligence = { ...strategy.brandIntelligence, ...data.brandIntelligence };
  }
  if (data.extractedContent) {
    strategy.extractedContent = mergeExtracted(strategy.extractedContent, data.extractedContent);
  }
  strategy.campaigns = ensureSixCampaigns(strategy.campaigns, scraped, strategy.brandIntelligence);
  return strategy;
}

function mergeExtracted(base, ai) {
  const out = { ...base };
  for (const key of Object.keys(out)) {
    const aiList = Array.isArray(ai?.[key]) ? ai[key].filter(Boolean) : [];
    if (aiList.length) out[key] = aiList;
  }
  return out;
}

/** Back-compat alias */
export async function generateAds(scraped, count = 6) {
  const { strategy, usedAI } = await generateStrategy(scraped);
  return {
    ads: strategy.campaigns,
    campaigns: strategy.campaigns,
    brandIntel: strategy.brandIntelligence,
    strategy,
    usedAI,
  };
}

/** @returns {{ ad: object, usedAI: boolean }} */
export async function editAd({ ad, action, tone, scraped }) {
  if (hasAI()) {
    try {
      const next = await editAdWithAI({ ad, action, tone, scraped });
      return { ad: next, usedAI: true };
    } catch (err) {
      console.error("OpenAI edit failed:", err?.message);
    }
  }
  return { ad: editCampaignLocal({ ad, action, tone, scraped }), usedAI: false };
}

async function editAdWithAI({ ad, action, tone, scraped }) {
  const brandIntel = buildStrategyBrandIntelligence(scraped || {});
  const extracted = buildExtractedContent(scraped || {});
  const briefing = buildBriefing(scraped || {}, extracted, brandIntel);

  let instruction = "";
  switch (action) {
    case "regenerate":
    case "regenerate_similar":
    case "similar":
      instruction = `Regenerate a similar version: same campaign type "${ad.type}" and goal, fresh headline/primaryText/shortCaption/ctaButton, updated competitiveAngle and whyThisWorks. Do not reuse headline: "${ad.headline}".`;
      break;
    case "more_premium":
      instruction = "Rewrite more premium: refined, polished, high-end, understated luxury voice.";
      break;
    case "more_emotional":
      instruction = "Rewrite more emotional: storytelling, aspiration, transformation, human connection.";
      break;
    case "more_aggressive":
    case "bolder":
      instruction = "Rewrite more aggressive: stronger CTA, direct conversion focus, confident verbs—never spammy.";
      break;
    case "create_social":
      instruction = `Create social version: add socialVersion object with hook (<=80 chars), caption (<=220 chars), cta, hashtags (array, 3-5). Keep campaign strategy fields aligned.`;
      break;
    case "create_retargeting":
      instruction = `Transform into retargeting angle: reminder, objection handling, trust signal, strong return CTA. Update type to "Retargeting Campaign", typeId retargeting.`;
      break;
    case "shorten":
      instruction = "Shorten headline and primaryText while preserving strategy.";
      break;
    case "tone":
      instruction = `Rewrite in tone: ${tone || ad.tone}`;
      break;
    default:
      instruction = "Improve clarity and strategic coherence.";
  }

  const userPrompt = `${instruction}

Current campaign:
${JSON.stringify(ad, null, 2)}

Briefing:
"""
${briefing}
"""

Return JSON: { "campaign": { ...all campaign fields, optional "socialVersion": { hook, caption, cta, hashtags } } }`;

  const data = await jsonChat([
    { role: "system", content: STRATEGIST_SYSTEM },
    { role: "user", content: userPrompt },
  ]);

  const c = data.campaign || data.ad || {};
  return normalizeCampaign({ ...ad, ...c, id: ad.id }, scraped || {}, brandIntel);
}

export function detectAdIntelligence(scraped) {
  const intel = buildStrategyBrandIntelligence(scraped);
  return {
    industry: intel.industry,
    audience: intel.audience,
    tone: intel.emotionalTone,
  };
}
