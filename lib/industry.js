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
  "agency",
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
  {
    key: "agency",
    // High precision: explicit "X agency" labels, clear self-ID, or case studies tied to campaign/creative outcomes.
    // Avoids lone "portfolio", "our work", "client work", or bare "retainer" (common on SaaS, dev, and corporate sites).
    re: /(creative\s+agency|digital\s+agency|marketing\s+agency|branding\s+agency|media\s+agency|design\s+agency|advertising\s+agency|ad\s+agency|full[-\s]?service\s+agency|growth\s+agency|inbound\s+agency|performance\s+agency|pr\s+agency|seo\s+agency|boutique\s+agency|content\s+agency|social\s+media\s+agency|\bwe\s+are\s+(?:a|an)\s+agency\b|\bwe'?re\s+(?:a|an)\s+agency\b|award[-\s]winning\s+agency|\bagency\s+of\s+record\b|\bagency\s+partners?\b|creative\s+partnerships?\s+for\s+brands|case\s+stud(?:y|ies)[\s\S]{0,240}?\b(campaign|rebrand|creative|brand\s+refresh|go-?to-?market|activation)\b)/i,
  },
];

const PLAYBOOKS = {
  automotive: {
    label: "Automotive",
    audience: "In-market buyers comparing models and financing options",
    toneDirection: "Premium / Performance / Trust",
    campaignDirection: "Luxury + trust + performance proof with clear next steps to inventory or test drive",
    ctas: ["Schedule Test Drive", "Explore Inventory", "View Models", "Check Availability", "Book Appointment"],
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
    toneDirection: "Automation / Productivity / Growth",
    campaignDirection: "Pain-to-outcome arcs with demos, trials, and integration proof—efficiency as the hero",
    ctas: [
      "Start free trial",
      "Book demo",
      "Automate your workflow",
      "See integrations",
      "Calculate ROI",
    ],
    imageMood: "saas-dashboard",
  },
  fitness: {
    label: "Fitness & Wellness",
    audience: "Goal-driven members seeking accountability and measurable progress",
    toneDirection: "Transformation / Motivation / Energy",
    campaignDirection: "Before/after energy with coaching credibility and low-friction trial CTAs",
    ctas: ["Join today", "Start your transformation", "Start training", "Book a class", "Claim trial"],
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
  agency: {
    label: "Agency & Creative Services",
    audience: "Marketing leaders and founders hiring craft, speed, and strategic taste",
    toneDirection: "Confident / Creative / Outcome-led",
    campaignDirection: "Proof via work + process clarity; CTAs that invite a conversation, not a commodity quote",
    ctas: ["See our work", "Book a strategy call", "Start a project", "View case studies", "Meet the team"],
    imageMood: "agency-studio",
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

/**
 * True strategic campaign categories — each maps to a distinct visual + CTA posture.
 * `visualMode` drives card chrome: editorial (awareness), premium (luxury), conversion (performance).
 */
export const STRATEGIC_CAMPAIGN_TYPES = [
  {
    id: "brand_awareness",
    label: "Brand Awareness Campaign",
    visualMode: "editorial",
    defaultName: "Brand Awareness Narrative",
    goal: "Build recognition and emotional recall before the buyer is in-market",
    ctaStrategy: "Invite exploration—editorial CTAs that feel like a story’s next chapter, not a hard sell",
    strategicLabel: "Brand Awareness",
    toneBias: ["Inspiring", "Minimal", "Premium"],
  },
  {
    id: "conversion",
    label: "Conversion Campaign",
    visualMode: "conversion",
    defaultName: "Direct Response Push",
    goal: "Convert high-intent visitors with a decisive next step",
    ctaStrategy: "Imperative, outcome-first CTA with friction reducers pulled from on-page proof",
    strategicLabel: "High Conversion",
    toneBias: ["Bold", "Urgent", "Minimal"],
  },
  {
    id: "retargeting",
    label: "Retargeting Campaign",
    visualMode: "conversion",
    defaultName: "Warm Return Path",
    goal: "Re-engage people who already know the brand and need a reason to return now",
    ctaStrategy: "Reminder + fresh benefit; CTAs that acknowledge prior interest (“continue”, “pick up where you left off”)",
    strategicLabel: "Retargeting",
    toneBias: ["Friendly", "Bold", "Urgent"],
  },
  {
    id: "promotional",
    label: "Promotional Campaign",
    visualMode: "conversion",
    defaultName: "Promotional Blitz",
    goal: "Lift short-term demand with a clear incentive tied to real on-page offers",
    ctaStrategy: "Offer-led imperative; urgency only when the page supports it with real terms",
    strategicLabel: "High Conversion",
    toneBias: ["Urgent", "Bold", "Playful"],
  },
  {
    id: "luxury_positioning",
    label: "Premium / Luxury Campaign",
    visualMode: "premium",
    defaultName: "Luxury Craft Line",
    goal: "Signal rarity, craft, and status—purchase as membership in a tier",
    ctaStrategy: "Understated invitation: private access, discover, request—never loud discount language",
    strategicLabel: "Premium Audience",
    toneBias: ["Premium", "Minimal", "Inspiring"],
  },
  {
    id: "emotional_campaign",
    label: "Emotional Campaign",
    visualMode: "editorial",
    defaultName: "Emotional Connection Line",
    goal: "Win hearts first—tie the brand to identity, belonging, and the life buyers want to feel",
    ctaStrategy: "Feeling-led invitation: discover, feel, belong—soft CTA that still moves curiosity forward",
    strategicLabel: "Brand Awareness",
    toneBias: ["Inspiring", "Friendly", "Premium"],
  },
  {
    id: "seasonal_offer",
    label: "Seasonal Campaign",
    visualMode: "conversion",
    defaultName: "Seasonal Window",
    goal: "Tie the ask to a timely moment buyers already have top-of-mind",
    ctaStrategy: "Time-bound CTA aligned to season or calendar hook implied by the brand/category",
    strategicLabel: "High Conversion",
    toneBias: ["Urgent", "Friendly", "Bold"],
  },
];

const TYPE_BY_ID = Object.fromEntries(STRATEGIC_CAMPAIGN_TYPES.map((t) => [t.id, t]));

/** Map legacy / AI drift ids to canonical types */
const TYPE_ALIASES = {
  product_launch: "emotional_campaign",
  emotional: "emotional_campaign",
  luxury: "luxury_positioning",
  premium_luxury: "luxury_positioning",
  brand_awareness_campaign: "brand_awareness",
  conversion_campaign: "conversion",
};

export function getStrategicCampaignType(id) {
  if (!id) return STRATEGIC_CAMPAIGN_TYPES[1];
  const canon = TYPE_ALIASES[id] || id;
  return TYPE_BY_ID[canon] || STRATEGIC_CAMPAIGN_TYPES[1];
}

/**
 * Final card visual mode: SaaS businesses get a distinct “product UI” skin on story-led campaigns.
 */
export function resolveCampaignVisualMode(baseVisualMode, industryKey, campaignTypeId) {
  const base = baseVisualMode || "editorial";
  if (industryKey === "saas") {
    if (campaignTypeId === "brand_awareness" || campaignTypeId === "emotional_campaign") {
      return "saas";
    }
  }
  return base;
}

/**
 * Pick `count` distinct campaign types in an order that changes materially by URL/domain
 * so different businesses feel like different strategic mixes.
 */
export function selectCampaignTypesForRun(scraped, count = 5) {
  const n = Math.min(Math.max(count, 4), 7);
  const seedStr = [scraped?.url, scraped?.siteName, scraped?.title, scraped?.heroHeadline]
    .filter(Boolean)
    .join("|");
  const seed = hashString(seedStr || "default");
  const pool = [...STRATEGIC_CAMPAIGN_TYPES];
  // Fisher–Yates shuffle with seeded PRNG for stable-but-URL-specific order
  let s = seed;
  function rnd() {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  // Ensure the first slot often contrasts awareness vs conversion for immediate visual variety
  const hasAwareness = pool.slice(0, n).some((t) => t.id === "brand_awareness");
  const hasConversion = pool.slice(0, n).some((t) => t.id === "conversion");
  if (!hasAwareness || !hasConversion) {
    const iBa = pool.findIndex((t) => t.id === "brand_awareness");
    const iCv = pool.findIndex((t) => t.id === "conversion");
    if (iBa >= 0 && iCv >= 0) {
      const rest = pool.filter((_, idx) => idx !== iBa && idx !== iCv);
      return [pool[iBa], pool[iCv], ...rest].slice(0, n);
    }
  }
  return pool.slice(0, n);
}

/** @deprecated use STRATEGIC_CAMPAIGN_TYPES + selectCampaignTypesForRun */
export const CAMPAIGN_ARCHETYPES = STRATEGIC_CAMPAIGN_TYPES.slice(0, 5).map((t) => ({
  type: t.id,
  typeLabel: t.label,
  defaultName: t.defaultName,
  goal: t.goal,
  strategicLabel: t.strategicLabel,
}));

function gatherSignals(scraped) {
  const parts = [
    scraped?.url,
    scraped?.siteName,
    scraped?.title,
    scraped?.description,
    scraped?.heroHeadline,
    ...(scraped?.heroSectionSummaries || []).slice(0, 4),
    ...(scraped?.featureSectionSummaries || []).slice(0, 6),
    ...(scraped?.subheadings || []).slice(0, 8),
    ...(scraped?.serviceDescriptions || []).slice(0, 6),
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

  const positioningHint = inferPositioningHint(scraped);

  return {
    industryKey: key,
    detectedIndustry: industryLabel,
    toneDirection: pb.toneDirection,
    targetAudience: pb.audience,
    recommendedCampaignDirection: pb.campaignDirection,
    suggestedCampaignDirection: pb.campaignDirection,
    positioningHint,
    confidence:
      key === "general"
        ? "Moderate — broaden angles using on-page language"
        : "High — strong category signals in page content",
    ...overrides,
  };
}

function inferPositioningHint(scraped) {
  const hero = cleanSnippet(scraped?.heroHeadline || scraped?.title);
  const sub = cleanSnippet(scraped?.description)?.slice(0, 160);
  const tag = (scraped?.subheadings && scraped.subheadings[0]) || "";
  const feat = (scraped?.featureSectionSummaries || [])[0];
  if (hero && tag) return `${hero} — ${cleanSnippet(tag).slice(0, 100)}`;
  if (hero && sub) return `${hero} — ${sub}`;
  if (feat) return `${hero || "This brand"} centers on: ${cleanSnippet(feat).slice(0, 140)}`;
  if (hero) return hero;
  return "Positioning inferred from category signals and on-page language.";
}

function cleanSnippet(s) {
  return String(s || "")
    .replace(/\s+/g, " ")
    .trim();
}

export function pickCtaForArchetype(playbook, archetypeIndex, seedStr) {
  const pool = playbook.ctas || PLAYBOOKS.general.ctas;
  const h = hashString(`${seedStr}-${archetypeIndex}`);
  return pool[h % pool.length];
}

export function imageSeedForIndustry(industryKey, siteName, archetypeIndex, visualMode = "") {
  const pb = getIndustryPlaybook(industryKey);
  const vm = visualMode ? `${visualMode}-` : "";
  return `${vm}${pb.imageMood}-${(siteName || "brand").slice(0, 24)}-${archetypeIndex}`;
}

export function hashString(s) {
  let h = 0;
  const str = String(s || "");
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
