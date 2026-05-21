export type BrandIntelligence = {
  industry: string;
  audience: string;
  positioning: string;
  brandPersonality: string;
  emotionalTone: string;
  trustSignals: string[];
  pricingStyle: string;
  coreOffer: string;
  recommendedCampaignDirection: string;
  industryKey?: string;
  businessName?: string;
};

export type ExtractedContent = {
  heroMessaging: string[];
  productsServices: string[];
  testimonials: string[];
  pricing: string[];
  offers: string[];
  featureBlocks: string[];
  trustSignals: string[];
  ctaSections: string[];
};

export type CampaignTypeLabel =
  | "Awareness Campaign"
  | "Conversion Campaign"
  | "Retargeting Campaign"
  | "Promotional Campaign"
  | "Emotional Campaign"
  | "Authority Campaign";

export type CampaignStrategy = {
  id: string;
  type: CampaignTypeLabel;
  typeId?: string;
  goal: string;
  audience: string;
  positioning: string;
  ctaStrategy: string;
  competitiveAngle: string;
  whyThisWorks: string;
  psychology: string;
  tone: string;
  headline: string;
  primaryText: string;
  shortCaption: string;
  ctaButton: string;
  suggestedVisualDirection: string;
  visualMode?: string;
  socialVersion?: {
    hook: string;
    caption: string;
    cta: string;
    hashtags?: string[];
  } | null;
};

export type StrategyOutput = {
  brandIntelligence: BrandIntelligence;
  extractedContent: ExtractedContent;
  campaigns: CampaignStrategy[];
};
