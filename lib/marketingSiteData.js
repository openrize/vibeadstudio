export const PLATFORM_LINKS = [
  { id: "ai-content", label: "AI Content", outcome: "Publish-ready copy across every channel" },
  { id: "campaign-builder", label: "Campaign Builder", outcome: "Launch coordinated multi-channel campaigns" },
  { id: "social-media", label: "Social Media", outcome: "Schedule posts with brand consistency" },
  { id: "email-marketing", label: "Email Marketing", outcome: "Build sequences that convert" },
  { id: "landing-pages", label: "Landing Pages", outcome: "Publish pages without a dev team" },
  { id: "analytics", label: "Analytics", outcome: "See what's working in real time" },
];

export const SOLUTION_LINKS = [
  { id: "small-business", label: "Small Business" },
  { id: "agencies", label: "Agencies" },
  { id: "startups", label: "Startups" },
  { id: "marketing-teams", label: "Marketing Teams" },
];

export const PROBLEMS = [
  {
    title: "No Content Ideas",
    desc: "Your team stares at blank docs while competitors ship campaigns every week.",
    icon: "💡",
  },
  {
    title: "Too Many Marketing Tools",
    desc: "Content, email, social, ads, and analytics live in five different tabs.",
    icon: "🔀",
  },
  {
    title: "Slow Campaign Creation",
    desc: "Launching one campaign takes days of coordination across channels.",
    icon: "⏳",
  },
  {
    title: "Inconsistent Branding",
    desc: "Every channel sounds different — your brand voice gets lost in the chaos.",
    icon: "🎨",
  },
  {
    title: "Low Marketing ROI",
    desc: "You're spending budget without knowing which campaigns actually drive growth.",
    icon: "📉",
  },
];

export const PLATFORM_MODULES = [
  { label: "Content", icon: "✍️" },
  { label: "Email", icon: "📧" },
  { label: "Social", icon: "📱" },
  { label: "Landing Pages", icon: "📄" },
  { label: "Ads", icon: "📣" },
  { label: "Analytics", icon: "📊" },
  { label: "Automation", icon: "⚡" },
];

export const WORKFLOW_STEPS = [
  { label: "Campaign generated", status: "done" },
  { label: "Content created", status: "done" },
  { label: "Social scheduled", status: "active" },
  { label: "Emails ready", status: "pending" },
  { label: "Landing page published", status: "pending" },
  { label: "Analytics updating", status: "pending" },
];

export const FEATURES = [
  {
    title: "AI Content Generator",
    outcome: "Cut content production time by 80% while keeping your brand voice intact.",
    icon: "✍️",
  },
  {
    title: "Campaign Planner",
    outcome: "Plan full-funnel campaigns in one session instead of scattered spreadsheets.",
    icon: "🗺️",
  },
  {
    title: "Landing Page Builder",
    outcome: "Launch conversion-ready pages without waiting on design or development.",
    icon: "📄",
  },
  {
    title: "Social Scheduler",
    outcome: "Queue a week of on-brand social posts in minutes, not hours.",
    icon: "📱",
  },
  {
    title: "Email Builder",
    outcome: "Build nurture sequences and promos that match your campaign strategy.",
    icon: "📧",
  },
  {
    title: "Brand Voice",
    outcome: "Every asset sounds like you — consistent tone across every channel.",
    icon: "🎯",
  },
  {
    title: "Marketing Calendar",
    outcome: "See every campaign, post, and send in one unified timeline.",
    icon: "📅",
  },
  {
    title: "Performance Analytics",
    outcome: "Know which campaigns drive leads so you can double down on what works.",
    icon: "📊",
  },
  {
    title: "Workflow Automation",
    outcome: "Automate repetitive tasks so your team focuses on strategy, not busywork.",
    icon: "⚡",
  },
];

export const TEMPLATES = [
  { name: "Restaurant Campaign", category: "Local", color: "from-orange-500 to-rose-500" },
  { name: "Black Friday", category: "Promotional", color: "from-slate-800 to-slate-600" },
  { name: "Product Launch", category: "Launch", color: "from-violet-500 to-indigo-600" },
  { name: "Lead Magnet", category: "Lead Gen", color: "from-emerald-500 to-teal-600" },
  { name: "Newsletter", category: "Email", color: "from-blue-500 to-cyan-500" },
  { name: "Google Ads", category: "Paid", color: "from-amber-500 to-orange-500" },
  { name: "LinkedIn Campaign", category: "B2B", color: "from-blue-600 to-indigo-700" },
  { name: "Email Sequence", category: "Nurture", color: "from-purple-500 to-violet-600" },
];

export const SOLUTIONS = [
  {
    id: "small-business",
    title: "Small Business",
    problem: "You're wearing every hat — marketing can't take another full-time job.",
    solution: "One platform to plan, create, and launch campaigns without hiring an agency.",
    cta: "Start Free Trial",
  },
  {
    id: "agencies",
    title: "Marketing Agencies",
    problem: "Client onboarding is slow and every account needs custom strategy fast.",
    solution: "Manage multiple brands, white-label the platform, and deliver campaigns at scale.",
    cta: "Book Strategy Call",
  },
  {
    id: "startups",
    title: "Startups",
    problem: "You need to move fast but don't have a full marketing team yet.",
    solution: "Launch your first campaigns in minutes and iterate based on real performance data.",
    cta: "Start Free Trial",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    problem: "Seasonal promos and product launches eat up your entire marketing calendar.",
    solution: "Spin up product launch, promo, and retargeting campaigns from proven templates.",
    cta: "View Templates",
  },
  {
    id: "saas",
    title: "SaaS Companies",
    problem: "Long sales cycles need consistent nurture content across every touchpoint.",
    solution: "Build authority, conversion, and retargeting campaigns aligned to your funnel.",
    cta: "Watch Demo",
  },
  {
    id: "professional-services",
    title: "Professional Services",
    problem: "Your expertise is strong but marketing feels generic and time-consuming.",
    solution: "Generate thought-leadership content and lead-gen campaigns that reflect your brand.",
    cta: "Start Free Trial",
  },
];

export const OUTCOMES = [
  { label: "Hours Saved Weekly", value: 12, suffix: "hrs", desc: "Average time reclaimed per marketing team" },
  { label: "Campaigns Created", value: 847, suffix: "+", desc: "Multi-channel campaigns launched on platform" },
  { label: "Content Pieces Generated", value: 12400, suffix: "+", desc: "Emails, posts, ads, and pages created" },
  { label: "Brand Consistency Score", value: 94, suffix: "%", desc: "Average brand voice alignment across channels" },
];

export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: { monthly: 29, annual: 23 },
    desc: "For solo marketers launching their first AI-powered campaigns.",
    features: ["100 AI credits/mo", "3 active campaigns", "Basic templates", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: { monthly: 79, annual: 63 },
    desc: "For growing teams that need speed, consistency, and collaboration.",
    features: ["500 AI credits/mo", "Unlimited campaigns", "All templates", "Brand voice profiles", "Team collaboration"],
    popular: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: { monthly: 249, annual: 199 },
    desc: "For agencies managing multiple client brands from one dashboard.",
    features: ["2,000 AI credits/mo", "Multi-brand workspaces", "White-label options", "Client billing tools", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: { monthly: null, annual: null },
    desc: "For organizations needing custom integrations, SSO, and dedicated support.",
    features: ["Unlimited credits", "Custom integrations", "SSO & advanced security", "Dedicated CSM", "SLA guarantee"],
  },
];

export const FAQ_ITEMS = [
  {
    q: "How does AI create campaigns?",
    a: "Paste your website URL and AI Marketing Studio analyzes your brand, audience, and positioning. It then generates a full campaign system — content, emails, social posts, and landing pages — all aligned to your brand voice.",
  },
  {
    q: "Can I customize outputs?",
    a: "Yes. Every piece of content is editable. Regenerate variations, adjust tone, or refine copy until it matches your standards. You stay in control.",
  },
  {
    q: "Can teams collaborate?",
    a: "Growth and Agency plans include team workspaces with role-based access. Assign campaigns, review drafts, and approve content before it goes live.",
  },
  {
    q: "Does it support multiple brands?",
    a: "Agency plans let you manage multiple brand workspaces with separate voice profiles, templates, and analytics — all from one login.",
  },
  {
    q: "Can agencies manage clients?",
    a: "Yes. The Agency tier includes white-label options, client billing markup, and dedicated client portals so you deliver under your own brand.",
  },
  {
    q: "Do I own the content?",
    a: "Absolutely. Everything generated is yours to use, publish, and modify. No licensing restrictions on your marketing assets.",
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

export const DEMO_TYPING_LINES = [
  "Analyzing brand positioning...",
  "Building campaign strategy...",
  "Generating social content...",
  "Scheduling email sequence...",
  "Publishing landing page...",
  "Updating analytics dashboard...",
];
