/**
 * Demo strategist engine (no OpenAI).
 */
import {
  buildFallbackCampaign,
  buildStrategyBrandIntelligence,
  CAMPAIGN_TYPE_ORDER,
  normalizeCampaign,
} from "./strategy.js";
import { buildBrandIntel } from "./industry.js";
import { clean, uid } from "./utils.js";

export function buildFallbackCampaigns(scraped) {
  const brandIntel = buildStrategyBrandIntelligence(scraped, buildBrandIntel(scraped));
  return generateStrategyMock(scraped, brandIntel);
}

export function generateStrategyMock(scraped, brandIntel) {
  return CAMPAIGN_TYPE_ORDER.map((typeId, index) =>
    buildFallbackCampaign(typeId, scraped, brandIntel, index)
  );
}

export function editCampaignLocal({ ad, action, tone, scraped }) {
  const brandIntel = buildStrategyBrandIntelligence(scraped || {});
  const next = { ...ad };

  switch (action) {
    case "regenerate":
    case "regenerate_similar":
    case "similar":
      next.headline = `${ad.headline.replace(/\s*\(Alt\)\s*$/, "")} — refreshed angle`;
      next.primaryText = `${ad.primaryText.split(".")[0]}. Strategic variation grounded in live brand signals.`;
      next.competitiveAngle = `Alternate execution preserves ${ad.type} psychology while testing new phrasing.`;
      break;
    case "more_premium":
      next.headline = ad.headline.replace(/^/, "The refined choice — ");
      next.primaryText = `Crafted with intention: ${ad.primaryText}`;
      next.tone = "Premium, understated, authoritative";
      next.suggestedVisualDirection =
        "Premium dark gradient, cinematic close-up, elegant serif headline, soft gold accent, minimal copy density.";
      next.visualMode = "luxury";
      break;
    case "more_emotional":
      next.primaryText = `Picture the outcome: ${ad.primaryText} This is about identity and transformation—not specs alone.`;
      next.tone = "Human, story-driven, inspiring";
      next.whyThisWorks = "Emotional priming lifts recall before rational comparison.";
      next.visualMode = "emotional";
      break;
    case "more_aggressive":
    case "bolder":
      next.headline = ad.headline.replace(/\.$/, "") + " — act now";
      next.ctaButton = next.ctaButton.includes("Now") ? next.ctaButton : `${next.ctaButton} Now`;
      next.tone = "Bold, direct, conversion-focused";
      next.ctaStrategy = "Direct imperative CTA with confidence and clear next step.";
      break;
    case "create_social":
      next.socialVersion = {
        hook: truncate(ad.headline, 80),
        caption: truncate(`${ad.shortCaption} ${ad.primaryText}`, 220),
        cta: ad.ctaButton,
        hashtags: inferHashtags(brandIntel),
      };
      break;
    case "create_retargeting":
      next.type = "Retargeting Campaign";
      next.typeId = "retargeting";
      next.goal = "Bring back warm audiences who already engaged with the brand.";
      next.headline = `Still thinking about ${brandIntel.businessName || "us"}?`;
      next.primaryText = `You were close—here's what you may have missed: ${truncate(ad.primaryText, 140)}`;
      next.ctaButton = "Take Another Look";
      next.ctaStrategy = "Return-path CTA with reassurance and proof.";
      next.psychology = "Reminder, reassurance, social proof, objection handling.";
      next.visualMode = "retargeting";
      break;
    case "shorten":
      next.headline = ad.headline.slice(0, 48);
      next.primaryText = ad.primaryText.split(".")[0] + ".";
      break;
    case "tone":
      next.tone = tone || ad.tone;
      break;
    default:
      break;
  }

  return normalizeCampaign({ ...next, id: ad.id }, scraped || {}, brandIntel);
}

function inferHashtags(brandIntel) {
  const base = ["#MarketingStrategy", "#BrandGrowth"];
  const ind = (brandIntel?.industry || "").toLowerCase();
  if (ind.includes("saas") || ind.includes("software")) base.push("#SaaS", "#B2B");
  if (ind.includes("fitness") || ind.includes("wellness")) base.push("#Fitness", "#Wellness");
  if (ind.includes("luxury") || ind.includes("beauty")) base.push("#PremiumBrand");
  return base.slice(0, 5);
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

/** @deprecated */
export function generateCampaignsMock(scraped, brandIntel) {
  return generateStrategyMock(scraped, brandIntel);
}

export function finalizeCampaign(fields, scraped, tone, prev, industryKey, imageSlot = 0) {
  const brandIntel = buildStrategyBrandIntelligence(scraped);
  return normalizeCampaign(
    {
      ...fields,
      id: prev?.id || fields.id || uid(),
      tone: tone || fields.tone,
    },
    scraped,
    brandIntel
  );
}

export function pickToneSlot() {
  return "Bold";
}

export function formatBrandLabel(raw) {
  if (!raw) return "Your brand";
  let s = String(raw).trim().replace(/^www\./, "");
  s = s.split(".")[0] || s;
  s = s.replace(/[-_]+/g, " ");
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}
