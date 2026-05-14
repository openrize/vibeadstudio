import OpenAI from "openai";
import { uid, clean } from "./utils.js";
import {
  buildBrandIntel,
  detectIndustryKey,
  getIndustryPlaybook,
  getStrategicCampaignType,
  pickCtaForArchetype,
  selectCampaignTypesForRun,
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
You read enriched website signals and invent DISTINCT strategic campaign concepts—not template ads.
Rules:
- Each campaign must match its assigned strategic category (brand awareness vs conversion vs luxury, etc.) in voice, proof style, and CTA posture.
- Ground claims in provided excerpts only; do not invent product facts not hinted in the source.
- Headlines: <= 62 characters, no trailing ellipsis abuse, no emoji unless tone demands.
- Body: 2 sentences max, 120-200 characters, concrete and brand-specific.
- CTA: 2-5 words, action-first, must differ across campaigns and align with the category's CTA strategy.
- Every campaign MUST include explicit strategic reasoning fields (goal, audience, positioning, why this works, competitive angle).
- Return STRICT JSON only.`;

function buildRichBriefing(scraped) {
  const lines = [
    `URL: ${scraped.url || ""}`,
    `Site name: ${scraped.siteName || ""}`,
    `Title: ${scraped.title || ""}`,
    `Meta: ${scraped.description || ""}`,
    `Hero headline: ${scraped.heroHeadline || ""}`,
    `Hero sections (scraped): ${(scraped.heroSectionSummaries || []).slice(0, 5).join(" || ")}`,
    `Feature sections (H2/H3 + proof): ${(scraped.featureSectionSummaries || []).slice(0, 8).join(" || ")}`,
    `Subheadings / taglines: ${(scraped.subheadings || []).slice(0, 10).join(" | ")}`,
    `Service descriptions (scraped): ${(scraped.serviceDescriptions || []).slice(0, 6).join(" || ")}`,
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
  const n = Math.min(Math.max(count, 4), 7);
  const strategicTypes = selectCampaignTypesForRun(scraped, n);
  const brandIntel = buildBrandIntel(scraped);

  if (hasAI()) {
    try {
      const aiList = await generateCampaignsWithAI(scraped, brandIntel, strategicTypes);
      const merged = ensureCampaigns(aiList, scraped, brandIntel, strategicTypes);
      return { ads: merged, brandIntel };
    } catch (err) {
      console.error("OpenAI generation failed, falling back to mock:", err?.message);
    }
  }
  return {
    ads: generateCampaignsMock(scraped, brandIntel, strategicTypes),
    brandIntel,
  };
}

async function generateCampaignsWithAI(scraped, brandIntel, strategicTypes) {
  const briefing = buildRichBriefing(scraped);
  const angles = strategicTypes
    .map(
      (a, i) =>
        `${i + 1}. campaignTypeId="${a.id}" | category="${a.label}" | defaultGoal="${a.goal}" | ctaPosture="${a.ctaStrategy}" | strategicLabel="${a.strategicLabel}" | visualMode="${a.visualMode}"`
    )
    .join("\n");

  const userPrompt = `You are building ${strategicTypes.length} DISTINCT strategic campaign concepts for this business.

Brand intelligence (respect strictly):
- Industry: ${brandIntel.detectedIndustry}
- Tone direction: ${brandIntel.toneDirection}
- Audience: ${brandIntel.targetAudience}
- Positioning read: ${brandIntel.positioningHint || brandIntel.recommendedCampaignDirection}
- Strategic direction: ${brandIntel.recommendedCampaignDirection}

Enriched page signals:
"""
${briefing}
"""

Required strategic categories (generate exactly one campaign per line, SAME ORDER — do not skip or reorder):
${angles}

For each campaign return:
- campaignName: evocative strategist title (not "Ad 1"), 3-7 words
- campaignType: MUST equal the line's campaignTypeId exactly (one of: brand_awareness | conversion | retargeting | promotional | luxury_positioning | emotional_campaign | seasonal_offer)
- headline, body, cta, tone (one of: Bold, Friendly, Playful, Premium, Minimal, Urgent, Inspiring) — tone must fit the category
- goal: one sentence (may refine the defaultGoal but must stay category-true)
- audience: one short phrase tied to THIS category and this business
- positioning: one sentence — how the brand should be framed in-market for this category
- reasoning: one sentence — why this category fits the extracted signals
- whyThisWorks: one sentence — psychology / mechanism ("why this works")
- competitiveAngle: one sentence — how this beats generic competitor messaging in this category
- strategicLabel: reuse the line's strategicLabel unless you have a materially better label (still human-readable)
- ctaStrategy: one short sentence echoing how the CTA should behave for this category (mirrors the line's ctaPosture but brand-specific)

Return JSON:
{ "campaigns": [ { ...fields } ] }`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const raw = data.campaigns || data.ads || [];
  return raw.map((c, i) => mapAiCampaign(c, scraped, brandIntel, strategicTypes[i], i));
}

function mapAiCampaign(c, scraped, brandIntel, arch, index) {
  const archSafe = arch || getStrategicCampaignType(clean(c.campaignType) || "conversion");
  const typeId = clean(c.campaignType) || archSafe.id;
  const def = getStrategicCampaignType(typeId);
  const tone = clean(c.tone) || pickToneSlot(index, scraped?.url || "");
  const headline = clean(c.headline);
  const body = clean(c.body);
  const cta =
    clean(c.cta) || pickCtaForArchetype(getIndustryPlaybook(brandIntel.industryKey), index, `${scraped?.url}|${def.id}`);
  return finalizeCampaign(
    {
      campaignName: clean(c.campaignName) || def.defaultName,
      campaignType: def.id,
      campaignTypeLabel: def.label,
      goal: clean(c.goal) || def.goal,
      audience: clean(c.audience) || brandIntel.targetAudience,
      headline,
      body,
      cta,
      tone,
      strategicLabel: clean(c.strategicLabel) || def.strategicLabel,
      reasoning: clean(c.reasoning),
      whyThisWorks: clean(c.whyThisWorks),
      marketingAngle: clean(c.marketingAngle) || def.label,
      positioning: clean(c.positioning),
      competitiveAngle: clean(c.competitiveAngle),
      ctaStrategy: clean(c.ctaStrategy) || def.ctaStrategy,
      visualMode: def.visualMode,
    },
    scraped,
    tone,
    null,
    brandIntel.industryKey,
    index
  );
}

function ensureCampaigns(list, scraped, brandIntel, strategicTypes) {
  const target = strategicTypes.length;
  const normalized = (Array.isArray(list) ? list : []).filter((x) => x && x.headline);
  if (normalized.length >= target) return normalized.slice(0, target);
  const mock = generateCampaignsMock(scraped, brandIntel, strategicTypes);
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
      instruction = `Rewrite this entire campaign with a clearly different creative angle and different sentence patterns. Keep campaignType "${ad.campaignType}". Do not reuse headline: "${ad.headline}". Refresh positioning, competitiveAngle, reasoning, and whyThisWorks to match the new angle.`;
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
      instruction = `Generate an adjacent variation: same strategic category (${ad.campaignTypeLabel}) but fresh headline/body/cta and updated reasoning, whyThisWorks, positioning, and competitiveAngle.`;
      break;
    case "more_premium":
      instruction = `Elevate language to premium, understated luxury voice. Softer claims, higher craft. Prefer "Premium" or "Minimal" tone feel.`;
      nextTone = "Premium";
      break;
    case "more_conversion":
      instruction = `Rewrite for maximum conversion clarity: direct benefits, friction reducers, imperative CTA. Slight urgency ok.`;
      nextTone = "Urgent";
      break;
    case "more_emotional":
      instruction = `Rewrite for deeper emotional resonance: identity, belonging, aspiration—still grounded in briefing quotes. Softer sell, stronger feeling. Prefer "Inspiring" or "Friendly" tone. Refresh whyThisWorks and competitiveAngle to explain the emotional lever.`;
      nextTone = "Inspiring";
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
    positioning: ad.positioning,
    reasoning: ad.reasoning,
    whyThisWorks: ad.whyThisWorks,
    competitiveAngle: ad.competitiveAngle,
    strategicLabel: ad.strategicLabel,
    ctaStrategy: ad.ctaStrategy,
  })}

Briefing:
"""
${briefing}
"""

Return JSON:
{ "campaign": { "campaignName", "headline", "body", "cta", "tone", "goal", "audience", "positioning", "reasoning", "whyThisWorks", "competitiveAngle", "strategicLabel", "ctaStrategy" } }`;

  const data = await jsonChat([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt },
  ]);

  const c = data.campaign || data.ad || {};
  const def = getStrategicCampaignType(ad.campaignType);
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
      positioning: c.positioning || ad.positioning,
      competitiveAngle: c.competitiveAngle || ad.competitiveAngle,
      ctaStrategy: c.ctaStrategy || ad.ctaStrategy,
      visualMode: def.visualMode,
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
