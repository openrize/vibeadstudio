export const BRAND_NAME = "Vibe Strategist";

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Paste a live URL",
    body: "We analyze public page content — hero copy, offers, trust signals, CTAs, and positioning language visitors already see.",
    icon: "🔗",
  },
  {
    step: "02",
    title: "Extract brand intelligence",
    body: "Industry playbooks combine with on-page signals to map audience, tone, competitive angle, and funnel opportunities.",
    icon: "🧠",
  },
  {
    step: "03",
    title: "Generate strategy cards",
    body: "Receive full-funnel campaign ideas — awareness through authority — with messaging angles, psychology, and CTA direction.",
    icon: "📋",
  },
];

export const URL_ANALYZER_LINES = [
  "Fetching page structure and hero messaging…",
  "Mapping audience signals and trust indicators…",
  "Detecting positioning and offer language…",
  "Scoring funnel gaps across awareness → conversion…",
  "Composing campaign angles and CTA recommendations…",
  "Strategy workspace ready.",
];

export const SAMPLE_STRATEGY_CARDS = [
  {
    id: "awareness",
    type: "Awareness",
    goal: "Introduce the brand to cold audiences",
    psychology: "Curiosity gap · pattern interrupt",
    headline: "The quiet upgrade your ops team notices first",
    body: "Fewer handoffs, clearer ownership — without ripping out what already works.",
    cta: "Book a walkthrough",
    visual: "from-slate-800 via-indigo-900 to-slate-900",
    accent: "border-violet-200/60",
    badge: "bg-violet-100 text-violet-800",
  },
  {
    id: "conversion",
    type: "Conversion",
    goal: "Drive sign-ups from high-intent visitors",
    psychology: "Risk reversal · social proof",
    headline: "Ship today. Smile when it fits.",
    body: "Free returns, real-time tracking, and sizes that match what you ordered.",
    cta: "Shop best sellers",
    visual: "from-emerald-700 via-teal-700 to-emerald-900",
    accent: "border-emerald-200/60",
    badge: "bg-emerald-100 text-emerald-800",
  },
  {
    id: "retargeting",
    type: "Retargeting",
    goal: "Re-engage visitors who didn't convert",
    psychology: "Loss aversion · reminder",
    headline: "Still thinking it over? Your cart remembers.",
    body: "Pick up where you left off — same price, same perks, checkout in under 60 seconds.",
    cta: "Complete purchase",
    visual: "from-indigo-700 via-blue-800 to-indigo-950",
    accent: "border-indigo-200/60",
    badge: "bg-indigo-100 text-indigo-800",
  },
  {
    id: "authority",
    type: "Authority",
    goal: "Build credibility with decision-makers",
    psychology: "Expertise · proof stacking",
    headline: "How 2,400 teams cut reporting time by 40%",
    body: "A practical playbook from operators who replaced five spreadsheets with one source of truth.",
    cta: "Read the playbook",
    visual: "from-ink-900 via-slate-800 to-brand-900",
    accent: "border-brand-200/40",
    badge: "bg-brand-100 text-brand-800",
  },
  {
    id: "email",
    type: "Email Sequence",
    goal: "Nurture leads through the funnel",
    psychology: "Progressive commitment",
    headline: "3-email nurture sequence",
    body: null,
    cta: "Start free trial",
    visual: "from-violet-700 via-purple-800 to-indigo-900",
    accent: "border-violet-200/60",
    badge: "bg-violet-100 text-violet-800",
    emails: [
      { n: 1, subject: "The one workflow change teams notice in week one", preview: "Quick win without a full rip-and-replace." },
      { n: 2, subject: "What high-performing ops teams automate first", preview: "Three handoffs you can eliminate this quarter." },
      { n: 3, subject: "Your strategy session is ready", preview: "See how your stack maps to a full-funnel plan." },
    ],
  },
];

export const USE_CASES = [
  {
    title: "Launch faster",
    desc: "Go from blank doc to a structured campaign plan in minutes — not a week of workshops.",
    icon: "🚀",
  },
  {
    title: "Pitch with confidence",
    desc: "Agencies walk into client calls with brand reads, angles, and funnel ideas already drafted.",
    icon: "🎯",
  },
  {
    title: "Align messaging",
    desc: "Founders and marketers get one shared strategy layer before writing ads, emails, or landing copy.",
    icon: "📣",
  },
  {
    title: "Audit any site",
    desc: "Paste a competitor or client URL to surface positioning gaps, trust signals, and CTA opportunities.",
    icon: "🔍",
  },
  {
    title: "Scale client work",
    desc: "Freelancers deliver strategy-first deliverables without starting from a generic template every time.",
    icon: "⚡",
  },
  {
    title: "Local growth plans",
    desc: "Turn a local business website into awareness, promo, and retargeting angles that match their offer.",
    icon: "📍",
  },
];

export const WHAT_YOU_GET = [
  { title: "Brand Positioning Analysis", desc: "How the business positions itself vs. alternatives.", icon: "◎" },
  { title: "Audience Insights", desc: "Who the messaging is built for and what they care about.", icon: "👥" },
  { title: "Campaign Angles", desc: "Distinct creative directions — not generic ad variations.", icon: "💡" },
  { title: "Funnel Strategy", desc: "Awareness, conversion, retargeting, and authority plays.", icon: "🔀" },
  { title: "Ad Concepts", desc: "Headlines, body copy, and CTA ideas grounded in site signals.", icon: "📢" },
  { title: "CTA Recommendations", desc: "Action language aligned to offer type and funnel stage.", icon: "👉" },
  { title: "Landing Page Feedback", desc: "Hero, trust, and offer gaps pulled from public page content.", icon: "📄" },
];

export const PLATFORM_FEATURES = [
  {
    title: "URL-first workflow",
    outcome: "Start every strategy session with a live website — not a blank brief.",
    icon: "🔗",
  },
  {
    title: "Brand intelligence layer",
    outcome: "Industry, audience, tone, and trust reads in one structured panel.",
    icon: "🧠",
  },
  {
    title: "Full-funnel campaigns",
    outcome: "Six strategically differentiated campaign cards per analysis.",
    icon: "📋",
  },
  {
    title: "Workflow refinements",
    outcome: "Regenerate similar, more premium, emotional, or retargeting versions per card.",
    icon: "✨",
  },
  {
    title: "Export-ready output",
    outcome: "Download strategy as CSV for decks, briefs, or client delivery.",
    icon: "📥",
  },
  {
    title: "Demo mode included",
    outcome: "Works without an API key — explore the strategist flow immediately.",
    icon: "⚙️",
  },
];

export const WHO_ITS_FOR = [
  { title: "Agencies", desc: "Onboard clients faster with strategy-first deliverables.", icon: "🏢" },
  { title: "Founders", desc: "Turn your site into a growth plan before hiring a team.", icon: "🌱" },
  { title: "Marketers", desc: "Skip the blank page — start with angles and funnel direction.", icon: "📊" },
  { title: "Freelancers", desc: "Deliver premium strategy work without starting from scratch.", icon: "✍️" },
  { title: "SaaS Teams", desc: "Map positioning to awareness, conversion, and nurture plays.", icon: "💻" },
  { title: "Local Businesses", desc: "Get promo and trust-based campaigns from your existing site.", icon: "🏪" },
];

export const AI_LIMITATIONS = [
  {
    title: "Public page dependency",
    body: "Outputs depend on what is publicly visible on the URL you provide. Sparse or gated pages yield thinner context.",
  },
  {
    title: "Human review required",
    body: "Industry and tone reads are heuristic — always review before external use or media spend.",
  },
  {
    title: "Model variability",
    body: "AI behavior can vary by model version and settings. Proofread claims, offers, and compliance requirements.",
  },
  {
    title: "No performance guarantees",
    body: "We do not guarantee lift metrics, legal compliance, or platform-specific ad policy approval.",
  },
  {
    title: "Scrape limitations",
    body: "Some sites block extraction (robots, bot protection, heavy client-side rendering). Signals may be limited.",
  },
];

export const BETA_PRICING_PLANS = [
  {
    id: "demo",
    name: "Free Demo",
    price: "$0",
    period: "",
    desc: "Explore the strategist workspace with sample URLs and demo mode.",
    features: ["Unlimited demo analyses", "Sample strategy cards", "Export preview", "No credit card"],
    cta: "Try Demo",
    popular: false,
    action: "demo",
  },
  {
    id: "pro",
    name: "Pro",
    price: "Beta",
    period: "pricing TBD",
    desc: "For solo marketers and founders building strategy at scale.",
    features: ["Full URL analyses", "AI-powered strategy", "Campaign refinements", "CSV export", "Priority support"],
    cta: "Join Beta",
    popular: true,
    action: "beta",
  },
  {
    id: "agency",
    name: "Agency",
    price: "Beta",
    period: "pricing TBD",
    desc: "For teams delivering strategy across multiple client brands.",
    features: ["Multi-brand workspaces", "Client-ready exports", "Team collaboration", "White-label options", "Dedicated onboarding"],
    cta: "Request Access",
    popular: false,
    action: "beta",
  },
  {
    id: "custom",
    name: "Custom",
    price: "Let's talk",
    period: "",
    desc: "Enterprise integrations, SSO, and custom workflow requirements.",
    features: ["Custom integrations", "SSO & security review", "Dedicated support", "SLA options", "Volume pricing"],
    cta: "Contact Sales",
    popular: false,
    action: "contact",
  },
];

export const TRUSTED_LOGOS = [
  "Brightpath Co.",
  "Northline Digital",
  "Scalehouse",
  "Meridian Labs",
  "Atlas Growth",
  "Clearview Agency",
];

// Legacy exports kept for any remaining imports
export const WORKFLOW_STEPS = [
  { label: "URL analyzed", status: "done" },
  { label: "Brand intelligence mapped", status: "done" },
  { label: "Campaign angles generated", status: "active" },
  { label: "Funnel strategy composed", status: "pending" },
  { label: "CTA recommendations ready", status: "pending" },
];

export const DEMO_TYPING_LINES = URL_ANALYZER_LINES;
