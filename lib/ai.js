import OpenAI from "openai";
import { uid, clean } from "./utils.js";
import {
  CAMPAIGN_ARCHETYPES,
  buildBrandIntel,
  detectIndustryKey,
  getIndustryPlaybook,
  pickCtaForArchetype,
} from "./industry.js";
import {
  generateCampaignsMock,
  finalizeCampaign,
  editCampaignLocal,
  pickToneSlot,
} from "./campaignLocal.js";
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

const SYSTEM_PROMPT = `You are a principal brand strategist and performance marketer (Vibe-style workflow).
You read enriched website signals and invent DISTINCT multi-angle campaign concepts—not repetitive ad variants.
Rules:
- Each campaign must feel strategically different (goals, structure, CTA, proof style).
- Ground claims in provided excerpts only; do not invent product facts not hinted in the source.
- Headlines: <= 62 characters, no trailing ellipsis abuse, no emoji unless tone demands.
- Body: 2 sentences max, 120-200 characters, concrete and brand-specific.
- CTA: 2-5 words, action-first, must differ across campaigns.
- Return STRICT JSON only.`;

function buildRichBriefing(scraped) {
  const lines = [
    `URL: ${scraped.url || ""}`,
    `Site name: ${scraped.siteName || ""}`,
    `Title: ${scraped.title || ""}`,
    `Meta: ${scraped.description || ""}`,
    `Hero headline: ${scraped.heroHeadline || ""}`,
    `Section headings: ${(scraped.headings || []).slice(0, 10).join(" | ")}`,
    `Product/service names: ${(scraped.productNames || []).join(" | ")}`,
    `Benefit lines: ${(scraped.benefits || []).join(" | ")}`,
    `Feature bullets: ${(scraped.featureBullets || []).slice(0, 10).join(" | ")}`,
    `Testimonials: ${(scraped.testimonials || []).join(" | ")}`,
    `Offers/pricing: ${(scraped.offersOrPricing || []).join(" | ")}`,
    `Trust signals: ${(scraped.trustSignals || []).join(" | ")}`,
    `On-page CTAs seen: ${(scraped.ctaSnippets || []).slice(0, 8).join(" | ")}`,
    `Key paragraphs:`,
    ...(scraped.paragraphs || []).slice(0, 5).map((p) => `• ${p}`),
  ];
  return lines.filter(Boolean).join("\n").slice(0, 9000);
}

async function jsonChat(messages) {
  const client = getClient();
  if (!client) throw new Error("OPENAI_API_KEY not set");
  const res = await client.chat.completions.create({
    model: MODEL,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.88,
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

/** @returns {{ ads: object[], brandIntel: object }} */
export async function generateAds(scraped, count = 5) {
  const n = Math.min(Math.max(count, 4), 5);
  const archetypes = CAMPAIGN_ARCHETYPES.slice(0, n);
  const brandIntel = buildBrandIntel(scraped);

  if (hasAI()) {
    try {
      const aiList = await generateCampaignsWithAI(scraped, brandIntel, archetypes);
      const merged = ensureCampaigns(aiList, scraped, brandIntel, archetypes);
      return { ads: merged, brandIntel };
    } catch (err) {
      console.error("OpenAI generation failed, falling back to mock:", err?.message);
    }
  }
  return {
    ads: generateCampaignsMock(scraped, brandIntel, archetypes),
    brandIntel,
  };
}

async function generateCampaignsWithAI(scraped, brandIntel, archetypes) {
  const briefing = buildRichBriefing(scraped);
  const angles = archetypes
    .map(
      (a, i) =>
        `${i + 1}. type=${a.type} | label="${a.typeLabel}" | goal="${a.goal}" | defaultStrategicLabel="${a.strategicLabel}"`
    )
    .join("\n");

  const userPrompt = `You are building ${archetypes.length} DISTINCT campaign concepts for this business.

Brand intelligence (respect strictly):
- Industry: ${brandIntel.detectedIndustry}
- Tone direction: ${brandIntel.toneDirection}
- Audience: ${brandIntel.targetAudience}
- Strategic direction: ${brandIntel.recommendedCampaignDirection}

Enriched page signals:
"""
${briefing}
"""

Required campaign angles (generate exactly one campaign per line, same order):
${angles}

For each campaign return:
- campaignName: evocative campaign title (not "Ad 1"), 3-6 words
- campaignType: one of: emotional_lifestyle | feature_focused | conversion | premium_authority | urgency_offer
- headline, body, cta, tone (one of: Bold, Friendly, Playful, Premium, Minimal, Urgent, Inspiring)
- goal: one sentence
- audience: one short phrase tied to this angle
- reasoning: one sentence on why this angle fits THIS brand's signals
- whyThisWorks: one sentence explaining the psychology/strategy ("Why this works: ..." style but without the prefix if redundant)
- strategicLabel: one of: High conversion | Brand awareness | Retargeting | Premium audience (match the angle)

Return JSON:
{ "campaigns": [ { ...fields } ] }`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const raw = data.campaigns || data.ads || [];
  return raw.map((c, i) => mapAiCampaign(c, scraped, brandIntel, archetypes[i], i));
}

function mapAiCampaign(c, scraped, brandIntel, arch, index) {
  const archSafe = arch || CAMPAIGN_ARCHETYPES[Math.min(index, CAMPAIGN_ARCHETYPES.length - 1)];
  const tone = clean(c.tone) || pickToneSlot(index, scraped?.url || "");
  const headline = clean(c.headline);
  const body = clean(c.body);
  const cta = clean(c.cta) || pickCtaForArchetype(getIndustryPlaybook(brandIntel.industryKey), index, scraped?.url);
  return finalizeCampaign(
    {
      campaignName: clean(c.campaignName) || archSafe.defaultName,
      campaignType: clean(c.campaignType) || archSafe.type,
      campaignTypeLabel: archSafe.typeLabel,
      goal: clean(c.goal) || archSafe.goal,
      audience: clean(c.audience) || brandIntel.targetAudience,
      headline,
      body,
      cta,
      tone,
      strategicLabel: clean(c.strategicLabel) || archSafe.strategicLabel,
      reasoning: clean(c.reasoning),
      whyThisWorks: clean(c.whyThisWorks),
      marketingAngle: clean(c.marketingAngle) || archSafe.typeLabel,
    },
    scraped,
    tone,
    null,
    brandIntel.industryKey,
    index
  );
}

function ensureCampaigns(list, scraped, brandIntel, archetypes) {
  const target = archetypes.length;
  const normalized = (Array.isArray(list) ? list : []).filter((x) => x && x.headline);
  if (normalized.length >= target) return normalized.slice(0, target);
  const mock = generateCampaignsMock(scraped, brandIntel, archetypes);
  const merged = [...normalized];
  let i = 0;
  while (merged.length < target) {
    merged.push({ ...mock[merged.length % mock.length], id: uid() });
    i++;
  }
  return merged.slice(0, target);
}

export async function editAd({ ad, action, tone, scraped }) {
  if (hasAI()) {
    try {
      return await editAdWithAI({ ad, action, tone, scraped });
    } catch (err) {
      console.error("OpenAI edit failed, falling back to mock:", err?.message);
    }
  }
  return editCampaignLocal({ ad, action, tone, scraped });
}

async function editAdWithAI({ ad, action, tone, scraped }) {
  const briefing = buildRichBriefing(scraped || {});
  let instruction = "";
  let nextTone = ad.tone;
  switch (action) {
    case "regenerate":
      instruction = `Rewrite this entire campaign with a clearly different creative angle and different sentence patterns. Keep campaignType "${ad.campaignType}". Do not reuse headline: "${ad.headline}". Update reasoning and whyThisWorks to match the new angle.`;
      break;
    case "shorten":
      instruction = `Shorten headline (<= 44 chars) and body (<= 100 chars). Keep tone ${ad.tone}. Preserve strategic intent.`;
      break;
    case "bolder":
    case "more_aggressive":
      instruction = `Make copy noticeably bolder and more assertive. Stronger verbs, confident voice—still truthful vs briefing.`;
      nextTone = "Bold";
      break;
    case "tone":
      instruction = `Rewrite in "${tone}" tone. Keep same strategic goal.`;
      nextTone = tone || ad.tone;
      break;
    case "similar":
      instruction = `Generate a adjacent variation: same strategic angle (${ad.campaignTypeLabel}) but fresh headline/body/cta and updated reasoning + whyThisWorks.`;
      break;
    case "more_premium":
      instruction = `Elevate language to premium, understated luxury voice. Softer claims, higher craft. Prefer "Premium" or "Minimal" tone feel.`;
      nextTone = "Premium";
      break;
    case "more_conversion":
      instruction = `Rewrite for maximum conversion clarity: direct benefits, friction reducers, imperative CTA. Slight urgency ok.`;
      nextTone = "Urgent";
      break;
    default:
      instruction = `Improve clarity and conversion while keeping the same campaign angle.`;
  }

  const userPrompt = `${instruction}

Current campaign:
${JSON.stringify({
    campaignName: ad.campaignName,
    campaignType: ad.campaignType,
    headline: ad.headline,
    body: ad.body,
    cta: ad.cta,
    tone: ad.tone,
    goal: ad.goal,
    audience: ad.audience,
    reasoning: ad.reasoning,
    whyThisWorks: ad.whyThisWorks,
    strategicLabel: ad.strategicLabel,
  })}

Briefing:
"""
${briefing}
"""

Return JSON:
{ "campaign": { "campaignName", "headline", "body", "cta", "tone", "goal", "audience", "reasoning", "whyThisWorks", "strategicLabel" } }`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const c = data.campaign || data.ad || {};
  return finalizeCampaign(
    {
      campaignName: c.campaignName || ad.campaignName,
      campaignType: ad.campaignType,
      campaignTypeLabel: ad.campaignTypeLabel,
      goal: c.goal || ad.goal,
      audience: c.audience || ad.audience,
      headline: c.headline || ad.headline,
      body: c.body || ad.body,
      cta: c.cta || ad.cta,
      tone: c.tone || nextTone,
      strategicLabel: c.strategicLabel || ad.strategicLabel,
      reasoning: c.reasoning || ad.reasoning,
      whyThisWorks: c.whyThisWorks || ad.whyThisWorks,
      marketingAngle: ad.marketingAngle,
    },
    scraped || {},
    c.tone || nextTone,
    ad,
    detectIndustryKey(scraped || {}),
    0
  );
}

/** Back-compat helper for older imports */
export function detectAdIntelligence(scraped) {
  const intel = buildBrandIntel(scraped);
  return {
    industry: intel.detectedIndustry,
    audience: intel.targetAudience,
    tone: intel.toneDirection,
  };
}
