/**
 * Industry detection + playbooks for campaign tone, CTAs, and variation.
 * Order of rules matters: more specific industries are checked first.
 */

export const INDUSTRY_KEYS = [
  "luxury",
  "automotive",
  "fashion",
  "ecommerce",
  "saas",
  "fitness",
  "restaurant",
  "real_estate",
  "local_business",
  "general",
];

const RULES = [
  {
    key: "luxury",
    re: /(luxury|bespoke|concierge|haute|private\s+jewelry|estate\s+jewelry|five\s*star|vip\s+experience|yacht|private\s+aviation)/i,
  },
  {
    key: "automotive",
    re: /(automotive|auto\s+dealer|dealership|test\s*drive|inventory|suv|sedan|vehicle|car\s+dealer|bmw|mercedes|audi|lexus|cadillac|ford\s+motor|chevrolet|toyota\s+dealer)/i,
  },
  {
    key: "fashion",
    re: /(fashion|apparel|clothing|runway|couture|boutique|wearables|streetwear|lookbook|size\s+guide|collection\s+drop)/i,
  },
  {
    key: "saas",
    re: /(saas|software\s+as\s+a\s+service|api\b|cloud\s+platform|free\s+trial|book\s+a\s+demo|integration|workflow\s+automation|subscription\s+plan|dashboard|\bdeploy(?:ment)?s?\b|serverless|developer\s+(?:platform|tools|experience)|\bci\s*\/\s*cd\b|continuous\s+integration|observability|kubernetes|\bcdn\b|edge\s+(?:network|computing)|infrastructure|frontend\s+cloud|build\s+and\s+deploy|preview\s+deploy|git\b|from\s+git|framework|sdk\b|cli\b|\/docs\b|documentation)/i,
  },
  {
    key: "ecommerce",
    re: /(add\s+to\s+cart|checkout|free\s+shipping|sku|shop\s+now|buy\s+online|e-?commerce|your\s+cart|order\s+tracking)/i,
  },
  {
    key: "fitness",
    re: /(fitness|gym|workout|personal\s+training|crossfit|wellness\s+studio|membership\s+plans|nutrition\s+coaching|train\s+with)/i,
  },
  {
    key: "restaurant",
    // Avoid false positives from tech/marketing sites: nav "Menu", "catering to …",
    // "content delivery network", generic "delivery" / bare "menu".
    re: /(restaurant|\bcafe\b|\bdining\b|(?:food|drink|wine|dinner|brunch|lunch)\s+menu|restaurant\s+menu|menu\s+prices|view\s+(?:our\s+)?menu|chef'?s?\s+table|head\s+chef|reservations?|order\s+online|takeout|(?:event|wedding|party)\s+catering|catering\s+(?:menu|packages|services)|catering(?!\s+to\b)|\bdelivery\b(?!\s+network)|food\s+delivery)/i,
  },
  {
    key: "real_estate",
    re: /(real\s+estate|realtor|listings?|mortgage|homes\s+for\s+sale|property\s+search|open\s+house|beds?\s*baths?)/i,
  },
  {
    key: "local_business",
    re: /(plumber|hvac|electrician|roofing|locally\s+owned|near\s+me|same-?day\s+service|get\s+a\s+quote|service\s+area)/i,
  },
];

const PLAYBOOKS = {
  automotive: {
    label: "Automotive",
    audience: "In-market buyers comparing models and financing options",
    toneDirection: "Premium / Performance / Trust",
    campaignDirection: "Luxury + trust + performance proof with clear next steps to inventory or test drive",
    ctas: ["Schedule test drive", "Explore inventory", "View models", "Check availability", "Book appointment"],
    imageMood: "auto-showroom",
  },
  luxury: {
    label: "Luxury",
    audience: "Affluent buyers who value craftsmanship, status, and discretion",
    toneDirection: "Refined / Exclusive / Confident",
    campaignDirection: "Aspirational storytelling with understated proof and invitation-only CTAs",
    ctas: ["Request access", "Discover the collection", "Book a private viewing", "Explore craftsmanship", "Join the waitlist"],
    imageMood: "luxury-minimal",
  },
  fashion: {
    label: "Fashion & Apparel",
    audience: "Style-led shoppers seeking fit, trend, and brand identity",
    toneDirection: "Expressive / Trend-forward / Confident",
    campaignDirection: "Lifestyle-first visuals with seasonal urgency and social proof",
    ctas: ["Shop the drop", "Find your fit", "See new arrivals", "Build your look", "Unlock member perks"],
    imageMood: "fashion-editorial",
  },
  ecommerce: {
    label: "E-commerce",
    audience: "High-intent online shoppers comparing value and shipping confidence",
    toneDirection: "Direct / Benefit-led / Trust-building",
    campaignDirection: "Conversion-led offers with risk reducers and clear shipping/returns cues",
    ctas: ["Shop best sellers", "See deals", "Start checkout", "Get free shipping", "View bundles"],
    imageMood: "product-flatlay",
  },
  saas: {
    label: "SaaS & Software",
    audience: "Operators and buyers evaluating time savings, integrations, and security",
    toneDirection: "Automation / Productivity / Credibility",
    campaignDirection: "Pain-to-outcome arcs with demos, trials, and integration proof",
    ctas: ["Start free trial", "Book demo", "See integrations", "Calculate ROI", "Talk to sales"],
    imageMood: "saas-dashboard",
  },
  fitness: {
    label: "Fitness & Wellness",
    audience: "Goal-driven members seeking accountability and measurable progress",
    toneDirection: "Transformation / Motivation / Energy",
    campaignDirection: "Before/after energy with coaching credibility and low-friction trial CTAs",
    ctas: ["Join today", "Start training", "Book a class", "Claim trial", "Meet coaches"],
    imageMood: "gym-training",
  },
  restaurant: {
    label: "Restaurant & Hospitality",
    audience: "Local diners and delivery customers choosing where to spend tonight",
    toneDirection: "Taste / Warmth / Immediacy",
    campaignDirection: "Sensory hooks plus reservation or order paths tuned to peak times",
    ctas: ["Reserve a table", "Order now", "See the menu", "Book an event", "Join the list"],
    imageMood: "food-plating",
  },
  real_estate: {
    label: "Real Estate",
    audience: "Buyers, sellers, and relocators needing guidance and neighborhood clarity",
    toneDirection: "Trust / Guidance / Local expertise",
    campaignDirection: "Lifestyle + neighborhood proof with agent credibility and tour CTAs",
    ctas: ["View listings", "Schedule a tour", "Get a valuation", "Talk to an agent", "See neighborhoods"],
    imageMood: "modern-home",
  },
  local_business: {
    label: "Local Services",
    audience: "Nearby homeowners and businesses needing fast, reliable help",
    toneDirection: "Reliable / Human / Fast response",
    campaignDirection: "Trust badges, service area, and quote-first conversion",
    ctas: ["Get a quote", "Call now", "Book service", "See coverage area", "Read reviews"],
    imageMood: "local-service",
  },
  general: {
    label: "General Business",
    audience: "Prospective customers evaluating fit and credibility",
    toneDirection: "Clarity / Trust / Action",
    campaignDirection: "Clear value proposition with proof pulled from the site and a decisive CTA",
    ctas: ["Get started", "Learn more", "See pricing", "Explore offers", "Talk to us"],
    imageMood: "brand-abstract",
  },
};

/** Five strategic campaign angles — order is fixed for UI consistency */
export const CAMPAIGN_ARCHETYPES = [
  {
    type: "emotional_lifestyle",
    typeLabel: "Emotional / Lifestyle",
    defaultName: "Lifestyle Story Campaign",
    goal: "Build desire and emotional connection with the brand",
    strategicLabel: "Brand Awareness",
  },
  {
    type: "feature_focused",
    typeLabel: "Feature-focused",
    defaultName: "Proof & Capability Campaign",
    goal: "Translate differentiators into concrete reasons to believe",
    strategicLabel: "Premium Audience",
  },
  {
    type: "conversion",
    typeLabel: "Conversion-focused",
    defaultName: "Performance Conversion Campaign",
    goal: "Drive immediate clicks, signups, or purchases",
    strategicLabel: "High Conversion",
  },
  {
    type: "premium_authority",
    typeLabel: "Premium / Authority",
    defaultName: "Authority & Trust Campaign",
    goal: "Signal leadership, quality, and low-risk choice",
    strategicLabel: "Brand Awareness",
  },
  {
    type: "urgency_offer",
    typeLabel: "Urgency / Offer",
    defaultName: "Offer & Momentum Campaign",
    goal: "Create timely motivation with incentives or scarcity",
    strategicLabel: "Retargeting",
  },
];

function gatherSignals(scraped) {
  const parts = [
    scraped?.url,
    scraped?.siteName,
    scraped?.title,
    scraped?.description,
    scraped?.heroHeadline,
    ...(scraped?.headings || []).slice(0, 12),
    ...(scraped?.productNames || []),
    ...(scraped?.benefits || []).slice(0, 8),
    ...(scraped?.featureBullets || []).slice(0, 8),
    ...(scraped?.testimonials || []).slice(0, 3),
    ...(scraped?.offersOrPricing || []).slice(0, 4),
    ...(scraped?.trustSignals || []).slice(0, 6),
    ...(scraped?.ctaSnippets || []).slice(0, 6),
    ...(scraped?.paragraphs || []),
  ];
  return cleanSignals(parts.join(" \n "));
}

function cleanSignals(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);
}

/**
 * Detect primary industry key from enriched scrape payload.
 */
export function detectIndustryKey(scraped) {
  const blob = gatherSignals(scraped).toLowerCase();
  if (!blob) return "general";

  // Automotive + luxury OEMs → still automotive but caller can refine tone
  for (const rule of RULES) {
    if (rule.re.test(blob)) return rule.key;
  }

  // Soft signals: fashion brand without explicit "fashion" word
  if (/(shoes|sneakers|handbag|jewelry|watch|denim|knitwear)/i.test(blob)) return "fashion";
  if (/(\.shop|store\.|boutique)/i.test(scraped?.url || "") && /(cart|shipping|collection)/i.test(blob))
    return "ecommerce";

  return "general";
}

export function getIndustryPlaybook(key) {
  return PLAYBOOKS[key] || PLAYBOOKS.general;
}

/**
 * Full brand intelligence object for UI + prompts.
 */
export function buildBrandIntel(scraped, overrides = {}) {
  const key = overrides.industryKey || detectIndustryKey(scraped);
  const pb = getIndustryPlaybook(key);
  const automotiveLuxury = /(cadillac|lexus|mercedes|bmw|audi|lincoln|infiniti|acura|porsche|maserati)/i.test(
    [scraped?.url, scraped?.title, scraped?.description].filter(Boolean).join(" ")
  );

  let industryLabel = pb.label;
  if (key === "automotive" && automotiveLuxury) {
    industryLabel = "Luxury Automotive";
  }

  return {
    industryKey: key,
    detectedIndustry: industryLabel,
    toneDirection: pb.toneDirection,
    targetAudience: pb.audience,
    recommendedCampaignDirection: pb.campaignDirection,
    confidence:
      key === "general"
        ? "Moderate — broaden angles using on-page language"
        : "High — strong category signals in page content",
    ...overrides,
  };
}

export function pickCtaForArchetype(playbook, archetypeIndex, seedStr) {
  const pool = playbook.ctas || PLAYBOOKS.general.ctas;
  const h = hashString(`${seedStr}-${archetypeIndex}`);
  return pool[h % pool.length];
}

export function imageSeedForIndustry(industryKey, siteName, archetypeIndex) {
  const pb = getIndustryPlaybook(industryKey);
  return `${pb.imageMood}-${(siteName || "brand").slice(0, 24)}-${archetypeIndex}`;
}

export function hashString(s) {
  let h = 0;
  const str = String(s || "");
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
