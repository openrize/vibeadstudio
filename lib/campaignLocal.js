/**
 * Client-safe campaign mock + finalize (no OpenAI import).
 */
import {
  CAMPAIGN_ARCHETYPES,
  buildBrandIntel,
  detectIndustryKey,
  getIndustryPlaybook,
  hashString,
  imageSeedForIndustry,
  pickCtaForArchetype,
} from "./industry.js";
import { TONES, scoreFromText, pickImage, uid, clean } from "./utils.js";

export function buildFallbackCampaigns(scraped, count = 5) {
  const n = Math.min(Math.max(count, 4), 5);
  const brandIntel = buildBrandIntel(scraped);
  const archetypes = CAMPAIGN_ARCHETYPES.slice(0, n);
  return generateCampaignsMock(scraped, brandIntel, archetypes);
}

export function generateCampaignsMock(scraped, brandIntel, archetypes) {
  const playbook = getIndustryPlaybook(brandIntel.industryKey);
  const brand = formatBrandLabel(scraped.siteName);
  const seed = `${scraped.url}|${scraped.title}|${scraped.heroHeadline || ""}`;
  const h = hashString(seed);

  const descBase = truncate(
    scraped.description || (scraped.paragraphs && scraped.paragraphs[0]) || "",
    160
  );
  const ctx = {
    hero: truncate(scraped.heroHeadline || scraped.title || brand, 72),
    desc: descBase,
    benefit: truncate((scraped.benefits && scraped.benefits[0]) || descBase, 120),
    feature: truncate(
      (scraped.featureBullets && scraped.featureBullets[0]) || (scraped.headings && scraped.headings[0]) || "",
      100
    ),
    quote: truncate((scraped.testimonials && scraped.testimonials[0]) || "", 140),
    offer: truncate((scraped.offersOrPricing && scraped.offersOrPricing[0]) || "", 80),
    trust: truncate((scraped.trustSignals && scraped.trustSignals[0]) || "", 80),
    ctaHint: truncate((scraped.ctaSnippets && scraped.ctaSnippets[0]) || "", 32),
  };

  return archetypes.map((arch, i) => {
    const v = (h + i * 7919) % 10000;
    const tone = pickToneSlot(i, seed);
    const cta = pickCtaForArchetype(playbook, i, seed);
    const named = campaignTitleForMock(brandIntel.industryKey, arch, i, v, brand);
    const { headline, body, reasoning, whyThisWorks } = mockAngleCopy(
      arch,
      brandIntel,
      brand,
      ctx,
      v
    );

    return finalizeCampaign(
      {
        campaignName: named,
        campaignType: arch.type,
        campaignTypeLabel: arch.typeLabel,
        goal: arch.goal,
        audience: brandIntel.targetAudience,
        headline,
        body,
        cta,
        tone,
        strategicLabel: arch.strategicLabel,
        reasoning,
        whyThisWorks,
        marketingAngle: arch.typeLabel,
      },
      scraped,
      tone,
      null,
      brandIntel.industryKey,
      i
    );
  });
}

export function finalizeCampaign(fields, scraped, tone, prev, industryKey, imageSlot = 0) {
  const headline = clean(fields.headline || "").slice(0, 80);
  const body = clean(fields.body || "").slice(0, 260);
  const cta = clean(fields.cta || "Learn more").slice(0, 36);
  const finalTone = tone || fields.tone || "Bold";
  let score = scoreFromText(headline, body, cta);
  score = Math.min(100, Math.max(80, score + (hashString(headline + cta) % 5) - 2));
  const image =
    prev?.image ||
    pickImage(
      imageSeedForIndustry(industryKey || detectIndustryKey(scraped), scraped?.siteName, imageSlot) +
        headline.slice(0, 6)
    );

  return {
    id: prev?.id || uid(),
    campaignName: clean(fields.campaignName || "Campaign concept"),
    campaignType: fields.campaignType || "conversion",
    campaignTypeLabel: fields.campaignTypeLabel || "Conversion-focused",
    goal: clean(fields.goal || ""),
    audience: clean(fields.audience || ""),
    headline,
    body,
    cta,
    tone: finalTone,
    score,
    image,
    strategicLabel: clean(fields.strategicLabel || "Brand Awareness"),
    reasoning: clean(fields.reasoning || ""),
    whyThisWorks: clean(fields.whyThisWorks || ""),
    marketingAngle: clean(fields.marketingAngle || fields.campaignTypeLabel || ""),
  };
}

export function editCampaignLocal({ ad, action, tone, scraped }) {
  const next = { ...ad };
  const brand = formatBrandLabel(scraped?.siteName || "this brand");
  switch (action) {
    case "regenerate": {
      const h = hashString(`${ad.id}-${Date.now()}`);
      next.headline =
        h % 2 === 0 ? `${brand}: a fresh angle on the same promise` : `New hook—same trust at ${brand}`;
      next.body = `${truncate(next.body.split(".")[0], 90)}. ${randomSpark()}`;
      next.reasoning = `Shifted emphasis to stay on-brand while avoiding repetitive patterns for ${brand}.`;
      next.whyThisWorks = `Variation testing keeps engagement high without abandoning the strategic angle buyers expect.`;
      break;
    }
    case "shorten": {
      next.headline = ad.headline.split(/[—:,-]/)[0].trim().slice(0, 44);
      next.body = ad.body.split(".")[0].slice(0, 100) + ".";
      next.cta = ad.cta.split(" ").slice(0, 3).join(" ");
      break;
    }
    case "bolder":
    case "more_aggressive": {
      next.headline = ad.headline.replace(/\.$/, "") + "—decide faster.";
      next.body = ad.body.replace(/\bcan\b/gi, "will").replace(/\bmight\b/gi, "will");
      next.tone = "Bold";
      next.whyThisWorks = `Stronger verbs increase confidence for buyers ready to act now.`;
      break;
    }
    case "more_premium": {
      next.headline = "Introducing " + ad.headline.replace(/^Introducing\s+/i, "");
      next.body = `Crafted with care: ${ad.body}`;
      next.tone = "Premium";
      next.strategicLabel = "Premium Audience";
      break;
    }
    case "more_conversion": {
      next.cta = next.cta.includes("now") ? next.cta : `${next.cta} today`;
      next.body = `${ad.body} Limited slots—move while inventory and attention align.`;
      next.tone = "Urgent";
      next.strategicLabel = "High Conversion";
      break;
    }
    case "similar": {
      next.headline = `${ad.headline} (Alt)`;
      next.body = `${ad.body} Another read on the same proof for A/B testing.`;
      next.reasoning = `Adjacent execution preserves the angle while exploring alternate phrasing.`;
      break;
    }
    case "tone": {
      const t = tone || "Friendly";
      next.tone = t;
      if (t === "Playful") next.headline = "Quick win: " + ad.headline.toLowerCase();
      if (t === "Premium") next.headline = ad.headline.replace(/^/, "The refined choice — ");
      if (t === "Urgent") next.headline = ad.headline + " — act today";
      if (t === "Minimal") next.body = ad.body.split(".")[0] + ".";
      if (t === "Inspiring") next.body = ad.body + " Momentum favors the prepared.";
      if (t === "Friendly") next.body = "Here's the simple truth: " + ad.body.toLowerCase();
      break;
    }
    default:
      break;
  }
  return finalizeCampaign(next, scraped || {}, next.tone, ad, detectIndustryKey(scraped || {}), 0);
}

function campaignTitleForMock(industryKey, arch, i, v, brand) {
  const flavor = ["North Star", "Momentum", "Signal", "Edge", "Prime", "Lift", "Pulse"][v % 7];
  if (arch.type === "emotional_lifestyle") return `${brand} ${flavor} Lifestyle`;
  if (arch.type === "feature_focused") return `${brand} Proof Stack`;
  if (arch.type === "conversion") return `${brand} Direct Response`;
  if (arch.type === "premium_authority") return `${brand} Authority Line`;
  return `${brand} Momentum Offer`;
}

function mockAngleCopy(arch, brandIntel, brand, ctx, v) {
  const ind = brandIntel.industryKey;
  const proof = ctx.quote || ctx.trust || ctx.benefit || ctx.desc;
  const feat = ctx.feature || ctx.hero;

  let headline = "";
  let body = "";
  let reasoning = "";
  let why = "";

  if (arch.type === "emotional_lifestyle") {
    headline =
      v % 2 === 0
        ? `${brand}: built around the life buyers want`
        : `Why people choose ${brand}—beyond the transaction`;
    body = `Lead with "${ctx.hero}" as the emotional hook, then echo: ${truncate(proof, 130)}`;
    reasoning = `Lifestyle positioning fits ${brandIntel.detectedIndustry} because purchase motivation is identity-led, not spec-first.`;
    why = `Aspirational framing aligns with ${brandIntel.targetAudience} who compare brands on feeling and fit before details.`;
  } else if (arch.type === "feature_focused") {
    headline =
      v % 2 === 0
        ? `${truncate(feat, 48)}—now the headline, not the footnote`
        : `The proof is in how ${brand} delivers`;
    body = `Anchor on "${ctx.feature || ctx.benefit}" and support with: ${truncate(ctx.desc, 120)}`;
    reasoning = `Feature-led copy reduces skepticism for ${brandIntel.detectedIndustry} buyers who research before they act.`;
    why = `Concrete capabilities sourced from the site make the campaign feel researched, not templated.`;
  } else if (arch.type === "conversion") {
    headline =
      v % 2 === 0
        ? `Ready when you are: ${brand} makes the next step obvious`
        : `Stop scrolling—${brand} is the click that moves the needle`;
    body = `Pair urgency with clarity: ${truncate(ctx.offer || ctx.ctaHint || ctx.desc, 140)}`;
    reasoning = `Conversion angle matches evaluation-stage visitors who need a decisive CTA and risk reducers.`;
    why = `Direct structure + on-page offer language increases perceived relevance and click confidence.`;
  } else if (arch.type === "premium_authority") {
    headline =
      v % 2 === 0
        ? `${brand}: the premium choice for buyers who compare twice`
        : `Trust-first ${brandIntel.detectedIndustry} positioning`;
    body = `Lean on credibility: ${truncate(ctx.trust || proof, 140)}`;
    reasoning = `Authority framing supports premium perception for ${brandIntel.detectedIndustry} where trust is the real product.`;
    why = `Buyers pay more when risk feels low; trust signals from the page reinforce that narrative.`;
  } else {
    headline =
      v % 2 === 0
        ? `Limited window: ${brand} for buyers ready to act`
        : `If timing matters, ${brand} belongs in this week's plan`;
    body = `Offer-led: ${truncate(ctx.offer || ctx.desc, 140)}`;
    reasoning = `Urgency works when tied to a believable incentive; we mirror language found on the page.`;
    why = `Time-bound motivation accelerates decisions without sounding generic when the offer is grounded in site content.`;
  }

  if (ind === "saas" && arch.type === "feature_focused") {
    headline = `${brand} connects the tools you already use`;
    body = `Show workflow wins: ${truncate(ctx.benefit || ctx.desc, 150)}`;
  }
  if (ind === "automotive" && arch.type === "emotional_lifestyle") {
    headline = `Drive the ${brand} standard—performance you feel`;
    body = `Premium performance story tied to: ${truncate(ctx.hero || ctx.desc, 130)}`;
  }

  return { headline, body, reasoning, whyThisWorks: why };
}

export function pickToneSlot(index, seed) {
  const pool = [...TONES];
  const h = hashString(seed + index);
  return pool[h % pool.length];
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function randomSpark() {
  const sparks = [
    "Same brand story—sharper delivery.",
    "Built from what your page actually says.",
    "Proof-first, hype-second.",
    "Reads like strategy, not a template.",
  ];
  return sparks[Math.floor(Math.random() * sparks.length)];
}

export function formatBrandLabel(raw) {
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
