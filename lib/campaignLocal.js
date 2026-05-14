/**
 * Client-safe campaign mock + finalize (no OpenAI import).
 */
import {
  buildBrandIntel,
  detectIndustryKey,
  getIndustryPlaybook,
  getStrategicCampaignType,
  hashString,
  imageSeedForIndustry,
  pickCtaForArchetype,
  resolveCampaignVisualMode,
  selectCampaignTypesForRun,
} from "./industry.js";
import { TONES, scoreFromText, pickImage, uid, clean } from "./utils.js";

export function buildFallbackCampaigns(scraped, count = 5) {
  const n = Math.min(Math.max(count, 4), 7);
  const brandIntel = buildBrandIntel(scraped);
  const strategicTypes = selectCampaignTypesForRun(scraped, n);
  return generateCampaignsMock(scraped, brandIntel, strategicTypes);
}

export function generateCampaignsMock(scraped, brandIntel, strategicTypes) {
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
    heroBlock: truncate((scraped.heroSectionSummaries && scraped.heroSectionSummaries[0]) || "", 140),
    desc: descBase,
    benefit: truncate((scraped.benefits && scraped.benefits[0]) || descBase, 120),
    feature: truncate(
      (scraped.featureSectionSummaries && scraped.featureSectionSummaries[0]) ||
        (scraped.featureBullets && scraped.featureBullets[0]) ||
        (scraped.headings && scraped.headings[0]) ||
        "",
      120
    ),
    quote: truncate((scraped.testimonials && scraped.testimonials[0]) || "", 140),
    offer: truncate((scraped.offersOrPricing && scraped.offersOrPricing[0]) || "", 80),
    trust: truncate((scraped.trustSignals && scraped.trustSignals[0]) || "", 80),
    ctaHint: truncate((scraped.ctaSnippets && scraped.ctaSnippets[0]) || "", 32),
    subline: truncate((scraped.subheadings && scraped.subheadings[0]) || "", 100),
    product: truncate((scraped.productNames && scraped.productNames[0]) || "", 48),
  };

  return strategicTypes.map((typeDef, i) => {
    const v = (h + i * 7919) % 10000;
    const tone = pickToneForStrategicType(typeDef, i, seed);
    const cta = pickCtaForStrategicType(typeDef, playbook, i, seed);
    const named = campaignTitleForMock(brand, typeDef, i, v);
    const { headline, body, reasoning, whyThisWorks, positioning, competitiveAngle } = mockStrategicCopy(
      typeDef,
      brandIntel,
      brand,
      ctx,
      v
    );

    return finalizeCampaign(
      {
        campaignName: named,
        campaignType: typeDef.id,
        campaignTypeLabel: typeDef.label,
        goal: typeDef.goal,
        audience: audienceForType(typeDef, brandIntel, ctx, v),
        headline,
        body,
        cta,
        tone,
        strategicLabel: typeDef.strategicLabel,
        reasoning,
        whyThisWorks,
        marketingAngle: typeDef.label,
        positioning,
        competitiveAngle,
        ctaStrategy: typeDef.ctaStrategy,
        visualMode: typeDef.visualMode,
      },
      scraped,
      tone,
      null,
      brandIntel.industryKey,
      i
    );
  });
}

function audienceForType(typeDef, brandIntel, ctx, v) {
  const base = brandIntel.targetAudience;
  switch (typeDef.id) {
    case "retargeting":
      return `Warm audiences who already know the brand — ${truncate(base, 95)}`;
    case "luxury_positioning":
      return `High-discernment buyers comparing craft and peer perception — ${truncate(base, 85)}`;
    case "emotional_campaign":
      return `Values-led buyers choosing brands that mirror how they want to feel — ${truncate(base, 85)}`;
    case "seasonal_offer":
      return `Time-sensitive buyers motivated by calendar moments — ${truncate(base, 85)}`;
    case "brand_awareness":
      return `Upper-funnel browsers building a mental model — ${truncate(base, 90)}`;
    case "promotional":
      return `Offer-sensitive shoppers comparing incentives — ${truncate(base, 85)}`;
    case "conversion":
      return `Lower-funnel buyers ready to act if risk feels low — ${truncate(base, 90)}`;
    default:
      return v % 2 === 0 ? base : `${truncate(ctx.hero, 40)} buyers — ${truncate(base, 70)}`;
  }
}

function pickToneForStrategicType(typeDef, index, seed) {
  const bias = typeDef.toneBias && typeDef.toneBias.length ? typeDef.toneBias : [...TONES];
  const hi = hashString(`${seed}-tone-${index}`);
  return bias[hi % bias.length];
}

function pickCtaForStrategicType(typeDef, playbook, index, seed) {
  const soft = ["Explore the story", "See the work", "Discover more", "View the edit", "Step inside"];
  const warm = ["Continue where you left off", "See what’s new for you", "Pick up your plan", "Return & save"];
  if (typeDef.id === "luxury_positioning") {
    const pool = ["Request access", "Discover the line", "Book a private viewing", "Explore craftsmanship"];
    return pool[hashString(seed + index) % pool.length];
  }
  if (typeDef.id === "brand_awareness" || typeDef.id === "emotional_campaign") {
    return soft[hashString(seed + index) % soft.length];
  }
  if (typeDef.id === "retargeting") {
    return warm[hashString(seed + index) % warm.length];
  }
  return pickCtaForArchetype(playbook, index, `${seed}|${typeDef.id}`);
}

export function finalizeCampaign(fields, scraped, tone, prev, industryKey, imageSlot = 0) {
  const headline = clean(fields.headline || "").slice(0, 80);
  const body = clean(fields.body || "").slice(0, 260);
  const cta = clean(fields.cta || "Learn more").slice(0, 36);
  const finalTone = tone || fields.tone || "Bold";
  let score = scoreFromText(headline, body, cta);
  score = Math.min(100, Math.max(80, score + (hashString(headline + cta) % 5) - 2));
  const baseVisual = fields.visualMode || getStrategicCampaignType(fields.campaignType).visualMode;
  const industry = industryKey || detectIndustryKey(scraped);
  const visualMode = resolveCampaignVisualMode(baseVisual, industry, fields.campaignType);
  const image =
    prev?.image ||
    pickImage(
      imageSeedForIndustry(industry, scraped?.siteName, imageSlot, visualMode) + headline.slice(0, 6),
      visualMode
    );

  return {
    id: prev?.id || uid(),
    campaignName: clean(fields.campaignName || "Campaign concept"),
    campaignType: fields.campaignType || "conversion",
    campaignTypeLabel: fields.campaignTypeLabel || "Conversion",
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
    positioning: clean(fields.positioning || ""),
    competitiveAngle: clean(fields.competitiveAngle || ""),
    ctaStrategy: clean(fields.ctaStrategy || ""),
    visualMode,
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
      next.competitiveAngle = `Differentiates on clarity and proof density versus category boilerplate—grounded in what ${brand} actually publishes.`;
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
      next.competitiveAngle = `Out-competes vague competitors by naming the outcome and removing hedging language.`;
      break;
    }
    case "more_premium": {
      next.headline = "Introducing " + ad.headline.replace(/^Introducing\s+/i, "");
      next.body = `Crafted with care: ${ad.body}`;
      next.tone = "Premium";
      next.strategicLabel = "Premium Audience";
      next.visualMode = "premium";
      next.positioning = `Elevated ${brand} as a considered choice rather than a commodity swap.`;
      break;
    }
    case "more_conversion": {
      next.cta = next.cta.includes("now") ? next.cta : `${next.cta} today`;
      next.body = `${ad.body} Limited slots—move while inventory and attention align.`;
      next.tone = "Urgent";
      next.strategicLabel = "High Conversion";
      next.visualMode = "conversion";
      next.ctaStrategy = "Direct imperative with light scarcity—only when credible for this brand.";
      break;
    }
    case "more_emotional": {
      next.body = `Picture the outcome: ${ad.body} This is less about specs—and more about the life on the other side of "yes."`;
      next.tone = "Inspiring";
      next.strategicLabel = "Brand Awareness";
      next.visualMode = "editorial";
      next.reasoning = `Leans into identity and aspiration so ${brand} feels human, not transactional.`;
      next.whyThisWorks = `Emotional priming lifts recall and preference before rational comparison kicks in—especially in crowded categories.`;
      next.competitiveAngle = `Out-maneuvers feature-parity competitors by owning the feeling-state the buyer wants to occupy.`;
      next.ctaStrategy = "Soft invitation: curiosity and belonging first, hard ask second.";
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

function campaignTitleForMock(brand, typeDef, i, v) {
  const flavor = ["North Star", "Signal", "Edge", "Prime", "Lift", "Pulse", "Vector"][v % 7];
  const map = {
    brand_awareness: `${brand} ${flavor} Awareness`,
    conversion: `${brand} Conversion Sprint`,
    retargeting: `${brand} Warm Return`,
    promotional: `${brand} Promo Surge`,
    luxury_positioning: `${brand} Atelier Line`,
    emotional_campaign: `${brand} Heartline`,
    seasonal_offer: `${brand} Seasonal Window`,
  };
  return map[typeDef.id] || `${brand} ${flavor} Campaign ${i + 1}`;
}

function mockStrategicCopy(typeDef, brandIntel, brand, ctx, v) {
  const ind = brandIntel.industryKey;
  const proof = ctx.quote || ctx.trust || ctx.benefit || ctx.desc;
  const feat = ctx.feature || ctx.hero;
  const heroLead = ctx.heroBlock || ctx.hero;

  let headline = "";
  let body = "";
  let reasoning = "";
  let why = "";
  let positioning = "";
  let competitiveAngle = "";

  const id = typeDef.id;

  if (id === "brand_awareness") {
    headline =
      v % 2 === 0
        ? `${brand}: the story buyers remember before they compare`
        : `Why ${brand} feels different—in one clear narrative frame`;
    body = `Lead with "${truncate(heroLead, 70)}"${ctx.subline ? ` and the line: "${ctx.subline}"` : ""}. Proof: ${truncate(proof, 100)}`;
    positioning = `Owns the emotional entry point: ${truncate(brandIntel.positioningHint || ctx.desc, 140)}`;
    competitiveAngle = `Wins attention where competitors lead with specs—this angle leads with identity and recall.`;
    reasoning = `Awareness-first sequencing matches ${brandIntel.detectedIndustry} journeys where consideration starts with “who are you?” not “how much?”.`;
    why = `Editorial pacing + on-page language makes the brand feel authored, not generated—critical for memorability.`;
  } else if (id === "conversion") {
    headline =
      v % 2 === 0
        ? `Ready when you are: ${brand} makes the next step obvious`
        : `Stop comparing—${brand} is the decisive click`;
    body = `Pair urgency with clarity: ${truncate(ctx.offer || ctx.ctaHint || ctx.desc, 140)}`;
    positioning = `Positions ${brand} as the default choice once intent is high: ${truncate(ctx.benefit || ctx.feature, 110)}`;
    competitiveAngle = `Beats soft CTAs by mirroring real on-page offers and proof, not generic “learn more” drift.`;
    reasoning = `Conversion angle matches evaluation-stage visitors who need a decisive CTA and risk reducers.`;
    why = `Direct structure + on-page offer language increases perceived relevance and click confidence.`;
  } else if (id === "retargeting") {
    headline =
      v % 2 === 0
        ? `Still thinking about ${brand}? Here’s what changed since your last visit`
        : `Pick up where you left off—${brand} saved your momentum`;
    body = `Reminder + fresh proof: ${truncate(ctx.trust || ctx.quote || ctx.benefit, 140)}`;
    positioning = `Acknowledges familiarity; reframes value using ${truncate(ctx.feature || ctx.hero, 100)}`;
    competitiveAngle = `Uses “return path” psychology—most competitors treat retargeting as repetition; this treats it as an update.`;
    reasoning = `Retargeting should feel like continuity, not stalking—grounding in trust signals from the page keeps it credible.`;
    why = `Returning visitors convert when the message acknowledges prior interest and adds a new reason to act.`;
  } else if (id === "promotional") {
    headline =
      v % 2 === 0
        ? `This week’s move: ${brand} with an incentive you can verify`
        : `If you’re price-aware, ${brand} just made the math easier`;
    body = `Offer-led: ${truncate(ctx.offer || ctx.desc, 140)}`;
    positioning = `Anchors the promotion to real language from the site so urgency feels legitimate, not manufactured.`;
    competitiveAngle = `Outflanks vague “sale” banners by tying the incentive to a specific buyer outcome and proof.`;
    reasoning = `Promotional lift works when incentives map to what the page actually promises.`;
    why = `Buyers discount hype; they reward offers that feel tethered to real terms and product truth.`;
  } else if (id === "luxury_positioning") {
    headline =
      v % 2 === 0
        ? `${brand}: quiet confidence for buyers who compare twice`
        : `Craft, not clutter—${brand} for discerning ${brandIntel.detectedIndustry} buyers`;
    body = `Understated proof: ${truncate(ctx.trust || proof, 140)}`;
    positioning = `Rarity + craft narrative: ${truncate(heroLead, 120)}`;
    competitiveAngle = `Separates from loud discount competitors by elevating discretion, detail, and invitation—not pressure.`;
    reasoning = `Luxury framing supports premium perception where trust and taste are the real product.`;
    why = `Affluent buyers respond to restraint; the page’s trust signals become the “jewelry” of the message.`;
  } else if (id === "emotional_campaign") {
    headline =
      v % 2 === 0
        ? `${brand} isn’t bought—it’s chosen when the story feels like yours`
        : `The real product is how ${brand} makes people feel walking away`;
    body = `Lead with lived emotion tied to: ${truncate(heroLead, 90)}. Proof as texture: ${truncate(proof, 110)}`;
    positioning = `Centers belonging and aspiration: ${truncate(brandIntel.positioningHint || ctx.desc, 130)}`;
    competitiveAngle = `Wins against rational-only competitors by making the brand the mirror of the buyer’s self-image.`;
    reasoning = `Emotional campaigns work when they still echo real page language—never hollow inspiration.`;
    why = `People remember feelings before facts; grounding emotion in on-page proof keeps it believable, not saccharine.`;
  } else if (id === "seasonal_offer") {
    headline =
      v % 2 === 0
        ? `Seasonal fit: ${brand} for the moment buyers are already planning`
        : `Timing favors ${brand}—here’s the seasonal hook that matches the page`;
    body = `Calendar-aware push using: ${truncate(ctx.offer || ctx.benefit || ctx.desc, 140)}`;
    positioning = `Connects the brand’s natural buying cycle in ${brandIntel.detectedIndustry} to a timely nudge.`;
    competitiveAngle = `Steals share from ever-green competitors by making the CTA feel event-driven and specific.`;
    reasoning = `Seasonal relevance lifts conversion without extra discounting if the timing story is believable.`;
    why = `Buyers are already mentally “in season”; aligning copy to that state lowers cognitive friction.`;
  } else {
    headline = `${brand}: sharpened for the moment`;
    body = truncate(ctx.desc, 200);
    positioning = brandIntel.positioningHint || truncate(ctx.desc, 120);
    competitiveAngle = `Differentiates through sharper specificity versus category-generic claims.`;
    reasoning = `Fallback angle still maps to detected category signals.`;
    why = `Specificity from extracted content beats template language for trust.`;
  }

  if (ind === "saas" && id === "conversion") {
    headline = `${brand} removes workflow friction—start closer to “done”`;
    body = `Show the workflow win: ${truncate(ctx.benefit || ctx.desc, 150)}`;
  }
  if (ind === "automotive" && id === "brand_awareness") {
    headline = `Feel the ${brand} standard before you configure options`;
    body = `Performance story tied to: ${truncate(ctx.hero || ctx.desc, 130)}`;
  }

  return { headline, body, reasoning, whyThisWorks: why, positioning, competitiveAngle };
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
