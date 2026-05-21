/**
 * Strategy-first data model, normalization, and fallbacks.
 */
import { buildBrandIntel, detectIndustryKey, getIndustryPlaybook } from "./industry.js";
import { clean, uid } from "./utils.js";

export const CAMPAIGN_TYPE_ORDER = [
  "awareness",
  "conversion",
  "retargeting",
  "promotional",
  "emotional",
  "authority",
];

export const CAMPAIGN_TYPE_META = {
  awareness: {
    id: "awareness",
    type: "Awareness Campaign",
    visualMode: "awareness",
    goal: "Introduce the brand to cold audiences and create curiosity.",
    psychology: "Curiosity, discovery, aspiration, identity.",
    toneDefault: "Educational, inspiring, premium, clear.",
    ctaStrategy: "Use low-friction CTAs such as Learn More, Explore the Brand, or See How It Works.",
  },
  conversion: {
    id: "conversion",
    type: "Conversion Campaign",
    visualMode: "conversion",
    goal: "Turn interested visitors into leads, bookings, signups, or purchases.",
    psychology: "Clarity, confidence, proof, reduced friction.",
    toneDefault: "Direct, benefit-driven, trust-building.",
    ctaStrategy: "Action CTA: Get Started, Book a Demo, Shop Now, Request a Quote.",
  },
  retargeting: {
    id: "retargeting",
    type: "Retargeting Campaign",
    visualMode: "retargeting",
    goal: "Bring back people who already visited, clicked, or showed interest.",
    psychology: "Reminder, reassurance, social proof, objection handling.",
    toneDefault: "Familiar, persuasive, confidence-building.",
    ctaStrategy: "Return CTA: Come Back, Finish Your Order, Take Another Look.",
  },
  promotional: {
    id: "promotional",
    type: "Promotional Campaign",
    visualMode: "promotional",
    goal: "Drive urgency around an offer, discount, launch, or seasonal push.",
    psychology: "Urgency, scarcity, value, deadline.",
    toneDefault: "Energetic, clear, action-focused.",
    ctaStrategy: "Urgency CTA: Claim the Offer, Limited Time Only, Get the Deal.",
  },
  emotional: {
    id: "emotional",
    type: "Emotional Campaign",
    visualMode: "emotional",
    goal: "Create emotional connection with the audience.",
    psychology: "Aspiration, transformation, belonging, pain-to-solution.",
    toneDefault: "Human, story-driven, emotional, memorable.",
    ctaStrategy: "Emotion-led CTA: Start Your Transformation, Feel the Difference.",
  },
  authority: {
    id: "authority",
    type: "Authority Campaign",
    visualMode: "authority",
    goal: "Build credibility, expertise, and trust.",
    psychology: "Proof, expertise, leadership, credibility.",
    toneDefault: "Confident, professional, expert, educational.",
    ctaStrategy: "Trust CTA: See the Results, View Testimonials, Talk to an Expert.",
  },
};

const TYPE_ALIASES = {
  brand_awareness: "awareness",
  brand_awareness_campaign: "awareness",
  awareness_campaign: "awareness",
  conversion_campaign: "conversion",
  retargeting_campaign: "retargeting",
  promotional_campaign: "promotional",
  emotional_campaign: "emotional",
  authority_campaign: "authority",
  emotional: "emotional",
  luxury_positioning: "awareness",
  seasonal_offer: "promotional",
  product_launch: "promotional",
};

export function normalizeCampaignTypeId(id) {
  if (!id) return "conversion";
  const k = String(id).toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  if (TYPE_ALIASES[k]) return TYPE_ALIASES[k];
  if (CAMPAIGN_TYPE_META[k]) return k;
  for (const [typeId, meta] of Object.entries(CAMPAIGN_TYPE_META)) {
    if (meta.type.toLowerCase().replace(/\s+/g, "_") === k) return typeId;
  }
  return "conversion";
}

export function getCampaignMeta(id) {
  return CAMPAIGN_TYPE_META[normalizeCampaignTypeId(id)] || CAMPAIGN_TYPE_META.conversion;
}

/** @returns {import('./strategy').ExtractedContent} */
export function buildExtractedContent(scraped) {
  const heroMessaging = uniqueList([
    scraped?.heroHeadline,
    ...(scraped?.heroSectionSummaries || []),
    ...(scraped?.subheadings || []).slice(0, 4),
    scraped?.title,
  ]);

  const productsServices = uniqueList([
    ...(scraped?.productNames || []),
    ...(scraped?.serviceDescriptions || []).slice(0, 6),
    ...(scraped?.featureSectionSummaries || []).slice(0, 6),
    ...(scraped?.headings || []).slice(0, 6),
  ]);

  const testimonials = uniqueList([...(scraped?.testimonials || [])]);
  const pricing = uniqueList([...(scraped?.offersOrPricing || [])]);
  const offers = uniqueList([
    ...(scraped?.offersOrPricing || []).filter((t) =>
      /\b(save|off|deal|bundle|limited|free|trial|discount)\b/i.test(t)
    ),
    ...(scraped?.offersOrPricing || []).slice(0, 3),
  ]);
  const featureBlocks = uniqueList([
    ...(scraped?.featureSectionSummaries || []),
    ...(scraped?.featureBullets || []).slice(0, 8),
    ...(scraped?.benefits || []).slice(0, 6),
  ]);
  const trustSignals = uniqueList([...(scraped?.trustSignals || [])]);
  const ctaSections = uniqueList([...(scraped?.ctaSnippets || [])]);

  return {
    heroMessaging: fillIfEmpty(heroMessaging, inferHeroFallback(scraped)),
    productsServices: fillIfEmpty(productsServices, inferProductsFallback(scraped)),
    testimonials: fillIfEmpty(testimonials, inferTestimonialsFallback(scraped)),
    pricing: fillIfEmpty(pricing, inferPricingFallback(scraped)),
    offers: fillIfEmpty(offers, inferOffersFallback(scraped)),
    featureBlocks: fillIfEmpty(featureBlocks, inferFeaturesFallback(scraped)),
    trustSignals: fillIfEmpty(trustSignals, inferTrustFallback(scraped)),
    ctaSections: fillIfEmpty(ctaSections, ["Learn More", "Get Started", "Contact Us"]),
  };
}

/** @returns {import('./strategy').BrandIntelligence} */
export function buildStrategyBrandIntelligence(scraped, legacyIntel) {
  const legacy = legacyIntel || buildBrandIntel(scraped);
  const key = legacy.industryKey || detectIndustryKey(scraped);
  const pb = getIndustryPlaybook(key);
  const extracted = buildExtractedContent(scraped);

  const trustList = extracted.trustSignals.length
    ? extracted.trustSignals
    : legacy.benefitsSummary?.length
      ? legacy.benefitsSummary.slice(0, 4)
      : ["Professional presentation", "Clear value proposition on site"];

  const pricingStyle =
    extracted.pricing.length || extracted.offers.length
      ? /\b(free|trial|\$0)\b/i.test([...extracted.pricing, ...extracted.offers].join(" "))
        ? "Value-led / trial-friendly"
        : /\b(premium|luxury|bespoke|private)\b/i.test(legacy.detectedIndustry + legacy.positioningHint)
          ? "Premium / value-backed"
          : "Transparent / offer-visible"
      : key === "luxury" || key === "fashion"
        ? "Premium / value-backed"
        : "Inferred from category — confirm on live site";

  return {
    industry: legacy.detectedIndustry || pb.label,
    audience: legacy.targetAudience || pb.audience,
    positioning: legacy.positioningHint || inferPositioningFromExtracted(extracted, scraped),
    brandPersonality: inferBrandPersonality(key, legacy.toneDirection),
    emotionalTone: inferEmotionalTone(key, extracted),
    trustSignals: trustList,
    pricingStyle,
    coreOffer:
      extracted.productsServices[0] ||
      legacy.mainServiceProduct ||
      legacy.businessName ||
      "Core offer inferred from homepage positioning",
    recommendedCampaignDirection:
      legacy.recommendedCampaignDirection ||
      legacy.suggestedCampaignDirection ||
      pb.campaignDirection,
    industryKey: key,
    businessName: legacy.businessName,
  };
}

export function resolveVisualSkin(industryKey, campaignTypeId) {
  const typeId = normalizeCampaignTypeId(campaignTypeId);
  if (typeId === "promotional") return "promotional";
  if (["luxury", "fashion"].includes(industryKey) && ["awareness", "emotional"].includes(typeId)) {
    return "luxury";
  }
  if (industryKey === "saas" && ["awareness", "emotional", "authority"].includes(typeId)) {
    return "saas";
  }
  if (industryKey === "fitness" && ["awareness", "emotional", "conversion"].includes(typeId)) {
    return "fitness";
  }
  return getCampaignMeta(typeId).visualMode;
}

export function buildSuggestedVisualDirection(industryKey, typeId, scraped) {
  const skin = resolveVisualSkin(industryKey, typeId);
  const brand = scraped?.siteName || "the brand";
  const directions = {
    luxury: `Premium dark gradient background, cinematic product close-up for ${brand}, elegant serif headline, soft gold accent, trust badge section near CTA.`,
    saas: `Modern productivity layout, clean dashboard UI mock, blue/purple gradients, geometric cards, trust metrics strip, glassmorphism accents.`,
    fitness: `High-energy action imagery, bold condensed typography, strong contrast blocks, transformation before/after zone, energetic CTA bar.`,
    promotional: `Urgency-focused design, bold offer block, high-contrast CTA, sale badge, countdown-inspired visual language for ${brand}.`,
    awareness: `Open aspirational layout, editorial hero, discovery-focused whitespace, soft gradient, category problem callout.`,
    conversion: `Direct action layout, benefit stack, proof row, prominent primary CTA, friction-reducer microcopy.`,
    retargeting: `Familiar brand colors, reassurance headline, testimonial strip, return-path CTA, objection-handling bullet row.`,
    emotional: `Human-centered photography, story-led headline, transformation narrative panel, warm palette, belonging cues.`,
    authority: `Expert-led layout, results/case study cards, certification row, structured proof hierarchy, professional typography.`,
  };
  return directions[skin] || directions[getCampaignMeta(typeId).visualMode] || directions.conversion;
}

/** Normalize API/AI payload into CampaignStrategy */
export function normalizeCampaign(raw, scraped, brandIntel, index = 0) {
  const typeId = normalizeCampaignTypeId(
    raw.typeId || raw.campaignType || raw.type || CAMPAIGN_TYPE_ORDER[index]
  );
  const meta = getCampaignMeta(typeId);
  const industryKey = brandIntel?.industryKey || detectIndustryKey(scraped);

  const headline = clean(raw.headline || "");
  const primaryText = clean(raw.primaryText || raw.body || raw.primary_text || "");
  const shortCaption = clean(raw.shortCaption || raw.short_caption || "");
  const ctaButton = clean(raw.ctaButton || raw.cta || "Learn More");

  return {
    id: raw.id || uid(),
    type: meta.type,
    typeId,
    goal: clean(raw.goal) || meta.goal,
    audience: clean(raw.audience) || brandIntel?.audience || "",
    positioning: clean(raw.positioning) || brandIntel?.positioning || "",
    ctaStrategy: clean(raw.ctaStrategy || raw.cta_strategy) || meta.ctaStrategy,
    competitiveAngle:
      clean(raw.competitiveAngle || raw.competitive_angle) ||
      `Differentiates ${brandIntel?.businessName || "this brand"} with a ${meta.type.replace(" Campaign", "")}-specific angle versus category-generic messaging.`,
    whyThisWorks:
      clean(raw.whyThisWorks || raw.why_this_works) ||
      `${meta.psychology} — applied deliberately for this funnel stage.`,
    psychology: clean(raw.psychology) || meta.psychology,
    tone: clean(raw.tone) || meta.toneDefault,
    headline: headline || `Discover a better way with ${brandIntel?.businessName || "this brand"}`,
    primaryText:
      primaryText ||
      `Strategic messaging grounded in ${brandIntel?.coreOffer || "the core offer"} and on-page signals.`,
    shortCaption:
      shortCaption ||
      truncate(`${brandIntel?.businessName || "Brand"} — ${meta.type.replace(" Campaign", "")} angle`, 90),
    ctaButton,
    suggestedVisualDirection:
      clean(raw.suggestedVisualDirection || raw.suggested_visual_direction) ||
      buildSuggestedVisualDirection(industryKey, typeId, scraped),
    visualMode: resolveVisualSkin(industryKey, typeId),
    socialVersion: raw.socialVersion || null,
  };
}

export function ensureSixCampaigns(campaigns, scraped, brandIntel) {
  const normalized = (Array.isArray(campaigns) ? campaigns : [])
    .map((c, i) => normalizeCampaign(c, scraped, brandIntel, i))
    .filter((c) => c.headline);

  const byType = Object.fromEntries(
    normalized.map((c) => [normalizeCampaignTypeId(c.typeId), c])
  );

  return CAMPAIGN_TYPE_ORDER.map((typeId, index) => {
    if (byType[typeId]) return { ...byType[typeId], typeId, type: getCampaignMeta(typeId).type };
    return buildFallbackCampaign(typeId, scraped, brandIntel, index);
  });
}

export function buildFallbackCampaign(typeId, scraped, brandIntel, index) {
  const meta = getCampaignMeta(typeId);
  const extracted = buildExtractedContent(scraped);
  const brand = brandIntel?.businessName || scraped?.siteName || "Your brand";
  const hero = extracted.heroMessaging[0] || brand;
  const proof = extracted.testimonials[0] || extracted.trustSignals[0] || "";
  const offer = extracted.offers[0] || extracted.pricing[0] || "";
  const product = extracted.productsServices[0] || brandIntel?.coreOffer || "";

  let headline = "";
  let primaryText = "";
  let shortCaption = "";
  let ctaButton = "Learn More";
  let competitiveAngle = "";
  let whyThisWorks = "";
  let positioning = brandIntel?.positioning || "";

  switch (typeId) {
    case "awareness":
      headline = `Discover ${brand}: ${truncate(hero, 40)}`;
      primaryText = `Introduce ${brand} to new audiences with "${truncate(hero, 80)}". ${proof ? `Proof texture: ${truncate(proof, 100)}` : ""}`;
      shortCaption = `A smarter first impression for ${truncate(product, 50) || "your category"}.`;
      ctaButton = "Explore the Brand";
      competitiveAngle = `Leads with story and category problem—not feature parity—so ${brand} earns recall before comparison.`;
      whyThisWorks = `Awareness-first sequencing lowers resistance and improves downstream conversion quality.`;
      break;
    case "conversion":
      headline = `Ready to act with ${brand}?`;
      primaryText = `${truncate(product, 120)} ${offer ? `Offer signal: ${truncate(offer, 80)}` : "Clear next step with on-page proof."}`;
      shortCaption = `Turn interest into action—built from live site signals.`;
      ctaButton = extracted.ctaSections[0] || "Get Started";
      competitiveAngle = `Mirrors real on-page CTAs and benefits instead of generic "learn more" drift.`;
      whyThisWorks = `Direct structure + credible proof increases click confidence at decision stage.`;
      break;
    case "retargeting":
      headline = `Still thinking about ${brand}?`;
      primaryText = `Pick up where you left off. ${proof ? truncate(proof, 140) : `Revisit what makes ${brand} worth another look.`}`;
      shortCaption = `A warm return path—not a cold pitch.`;
      ctaButton = "Take Another Look";
      competitiveAngle = `Treats retargeting as an update with new proof, not repetitive stalking.`;
      whyThisWorks = `Returning visitors convert when messaging acknowledges prior interest.`;
      break;
    case "promotional":
      headline = offer ? `Limited window: ${truncate(offer, 50)}` : `${brand} — timely value push`;
      primaryText = `${offer ? truncate(offer, 140) : `Align urgency to what ${brand} actually publishes.`} ${truncate(product, 80)}`;
      shortCaption = `Offer-led, deadline-aware, still brand-safe.`;
      ctaButton = "Claim the Offer";
      competitiveAngle = `Tethers promotion to verifiable site language—not manufactured hype.`;
      whyThisWorks = `Buyers reward offers that feel legitimate and specific.`;
      break;
    case "emotional":
      headline = `${brand} — chosen when the story feels personal`;
      primaryText = `Connect identity to outcome: ${truncate(hero, 100)}. ${proof ? `Human proof: ${truncate(proof, 90)}` : ""}`;
      shortCaption = `Feeling-first, proof-backed.`;
      ctaButton = "Start Your Transformation";
      competitiveAngle = `Wins against rational-only competitors by owning aspiration and belonging.`;
      whyThisWorks = `Emotion lifts recall; on-page proof keeps it believable.`;
      break;
    case "authority":
      headline = `Why experts trust ${brand}`;
      primaryText = `${proof ? truncate(proof, 150) : `Authority built from ${truncate(extracted.trustSignals.join("; "), 120) || "published expertise and results"}.`}`;
      shortCaption = `Credibility before the hard ask.`;
      ctaButton = "See the Results";
      competitiveAngle = `Stacks proof density where competitors lead with unsubstantiated claims.`;
      whyThisWorks = `Trust compresses evaluation time for high-consideration decisions.`;
      break;
    default:
      break;
  }

  return normalizeCampaign(
    {
      type: meta.type,
      typeId,
      goal: meta.goal,
      audience: brandIntel?.audience,
      positioning,
      ctaStrategy: meta.ctaStrategy,
      competitiveAngle,
      whyThisWorks,
      psychology: meta.psychology,
      tone: meta.toneDefault,
      headline,
      primaryText,
      shortCaption,
      ctaButton,
      suggestedVisualDirection: buildSuggestedVisualDirection(
        brandIntel?.industryKey,
        typeId,
        scraped
      ),
    },
    scraped,
    brandIntel,
    index
  );
}

export function buildStrategyOutput(scraped, campaigns, brandIntelOverride) {
  const brandIntelligence = buildStrategyBrandIntelligence(scraped, brandIntelOverride);
  const extractedContent = buildExtractedContent(scraped);
  const campaignsNormalized = ensureSixCampaigns(campaigns, scraped, brandIntelligence);
  return { brandIntelligence, extractedContent, campaigns: campaignsNormalized };
}

function uniqueList(arr) {
  const seen = new Set();
  const out = [];
  for (const raw of arr) {
    const t = clean(raw);
    if (!t || t.length < 3) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

function fillIfEmpty(list, fallback) {
  return list.length ? list : fallback;
}

function truncate(s, n) {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s;
}

function inferHeroFallback(scraped) {
  const t = clean(scraped?.description || scraped?.title);
  return t ? [t] : ["Homepage hero messaging will be inferred from brand category."];
}

function inferProductsFallback(scraped) {
  const d = clean(scraped?.description);
  return d ? [d.slice(0, 200)] : ["Products and services inferred from site category and positioning."];
}

function inferTestimonialsFallback(scraped) {
  const q = (scraped?.paragraphs || []).find((p) => /"|said|customer/i.test(p));
  return q ? [truncate(q, 200)] : ["Social proof will be strengthened when testimonials appear on the live site."];
}

function inferPricingFallback(scraped) {
  return ["Pricing style inferred from category; verify on live site before publishing."];
}

function inferOffersFallback(scraped) {
  const desc = clean(scraped?.description);
  if (desc && /\b(offer|deal|sale|discount|trial|free)\b/i.test(desc)) {
    return [truncate(desc, 160)];
  }
  return ["Offer structure inferred from category—confirm live promotions before publishing."];
}

function inferFeaturesFallback(scraped) {
  return (scraped?.paragraphs || []).slice(0, 2).map((p) => truncate(p, 160));
}

function inferTrustFallback(scraped) {
  return ["Brand credibility signals inferred from positioning and category best practices."];
}

function inferPositioningFromExtracted(extracted, scraped) {
  const hero = extracted.heroMessaging[0];
  const feat = extracted.featureBlocks[0];
  if (hero && feat) return `${hero} — anchored by ${truncate(feat, 100)}`;
  return clean(scraped?.description) || "Premium, trustworthy solution in its category.";
}

function inferBrandPersonality(industryKey, toneDirection) {
  const map = {
    luxury: "Elegant, calm, expert, refined, trustworthy.",
    saas: "Precise, innovative, reliable, forward-thinking.",
    fitness: "Energetic, motivating, disciplined, authentic.",
    fashion: "Expressive, confident, trend-aware, aspirational.",
    general: "Clear, credible, customer-centric, professional.",
  };
  return map[industryKey] || `${toneDirection || "Professional"}, brand-safe, credible.`;
}

function inferEmotionalTone(industryKey) {
  const map = {
    luxury: "Confidence, self-care, aspiration, transformation.",
    fitness: "Determination, empowerment, transformation, pride.",
    saas: "Control, momentum, confidence, growth.",
    restaurant: "Warmth, craving, belonging, celebration.",
    general: "Trust, clarity, optimism, forward motion.",
  };
  return map[industryKey] || "Confidence, trust, aspiration.";
}
