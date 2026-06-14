"use client";
import { useState, useEffect, useMemo } from "react";

const TEMPLATES = [
  { id: "saas", name: "SaaS Modern (Dark Cyber)" },
  { id: "luxury", name: "Luxury / Premium (Elegant)" },
  { id: "fitness", name: "High-Contrast (Bold Action)" },
  { id: "corporate", name: "Minimalist Clean (Professional)" },
];

const PAGE_TYPES = [
  { id: "lead_gen", name: "Lead Generation Page" },
  { id: "launch", name: "Product Launch Page" },
  { id: "webinar", name: "Webinar Registration" },
  { id: "service", name: "Service Details Page" },
];

export default function LandingPageBuilder({ strategy }) {
  const campaigns = useMemo(() => strategy?.campaigns || [], [strategy?.campaigns]);
  const extracted = useMemo(() => strategy?.extractedContent || {}, [strategy?.extractedContent]);
  const brandIntel = useMemo(() => strategy?.brandIntelligence || {}, [strategy?.brandIntelligence]);

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || "");
  const [templateId, setTemplateId] = useState("saas");
  const [pageType, setPageType] = useState("lead_gen"); // 'lead_gen', 'launch', 'webinar', 'service'
  const [approvalStatus, setApprovalStatus] = useState("draft"); // 'draft', 'edited', 'approved', 'published'

  // Page editable state
  const [headline, setHeadline] = useState("");
  const [subheading, setSubheading] = useState("");
  const [ctaText, setCtaText] = useState("Get Started");
  const [features, setFeatures] = useState([]);
  const [testimonial, setTestimonial] = useState("");
  const [testimonialAuthor, setTestimonialAuthor] = useState("Happy Customer");

  // Sync copy based on selected campaign and Page Type
  useEffect(() => {
    const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
    if (activeCampaign) {
      const name = brandIntel.businessName || "us";
      
      let computedHeadline = activeCampaign.headline || "";
      let computedSub = activeCampaign.primaryText || "";
      let computedCta = activeCampaign.ctaButton || "Get Started";
      let computedFeatures = extracted.featureBlocks?.slice(0, 3) || [];

      // Customize output based on Page Type
      if (pageType === "lead_gen") {
        computedHeadline = `Get the ${brandIntel.industry || "Marketing"} Growth Playbook`;
        computedSub = `Learn how to implement target positioning pillars and avoid off-brand copy traps. Free download from ${name}.`;
        computedCta = "Download Free Guide";
        computedFeatures = [
          "Complete Brand voice cheat-sheet",
          "6 Full-funnel campaign templates",
          "Metrics tracking checklist",
        ];
      } else if (pageType === "launch") {
        computedHeadline = `Introducing the Next Generation of ${brandIntel.industry || "Marketing"}`;
        computedSub = `Experience speed, velocity, and consistency in a single unified operating workspace. Built by ${name}.`;
        computedCta = "Claim Early Access";
        computedFeatures = [
          "Zero-friction template builder",
          "Automated platform calendar sync",
          "Real-time team approval flows",
        ];
      } else if (pageType === "webinar") {
        computedHeadline = `Live Workshop: How to scale customer acquisitions in 30 days`;
        computedSub = `Join our strategist team on June 25th for a step-by-step breakdown on optimizing LTV and MRR metrics.`;
        computedCta = "Secure My Free Seat";
        computedFeatures = [
          "Interactive campaign build session",
          "Q&A with senior operations leads",
          "Exclusive templates bundle access",
        ];
      } else if (pageType === "service") {
        computedHeadline = `Bespoke Campaign Operations & Strategy`;
        computedSub = `Let our experts build, deploy, and monitor your full-funnel content workflow. Powered by Brand Intelligence.`;
        computedCta = "Request Strategy Consultation";
      }

      setHeadline(computedHeadline);
      setSubheading(computedSub);
      setCtaText(computedCta);
      setFeatures(computedFeatures.length ? computedFeatures : ["Feature 1", "Feature 2", "Feature 3"]);
      setTemplateId(activeCampaign.visualMode || "saas");
    }
  }, [selectedCampaignId, strategy, pageType, extracted, brandIntel, campaigns]);

  // Load initial testimonial from scraped data
  useEffect(() => {
    if (extracted) {
      setTestimonial(extracted.testimonials?.[0] || "This completely shifted how we approach client campaigns.");
    }
  }, [strategy, extracted]);

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  function handleDownloadHtml() {
    const styles = {
      saas: `
        body { background-color: #030712; color: #f3f4f6; font-family: sans-serif; }
        .hero { background: radial-gradient(circle at top, #1e1b4b 0%, #030712 100%); }
        .btn { background: linear-gradient(to right, #06b6d4, #6366f1); color: white; }
        .card { background-color: #111827; border: 1px solid #1f2937; }
      `,
      luxury: `
        body { background-color: #faf9f6; color: #1c1917; font-family: serif; }
        .hero { background-color: #f5f4f0; }
        .btn { background-color: #1c1917; color: white; letter-spacing: 0.1em; text-transform: uppercase; }
        .card { background-color: white; border: 1px solid #e7e5e4; }
      `,
      fitness: `
        body { background-color: #18181b; color: #f4f4f5; font-family: sans-serif; }
        .hero { background: linear-gradient(135deg, #18181b 0%, #3f1010 100%); }
        .btn { background-color: #ea580c; color: white; font-weight: 900; text-transform: uppercase; }
        .card { background-color: #27272a; border-left: 4px solid #ea580c; }
      `,
      corporate: `
        body { background-color: #ffffff; color: #334155; font-family: sans-serif; }
        .hero { background-color: #f8fafc; }
        .btn { background-color: #2563eb; color: white; }
        .card { background-color: #f8fafc; border: 1px solid #e2e8f0; }
      `
    };

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${brandIntel?.businessName || "AI Marketing Studio"} - ${pageType}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${styles[templateId] || styles.saas}
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <header class="border-b border-gray-800/10 p-5 flex items-center justify-between max-w-6xl mx-auto w-full">
    <div class="font-bold text-lg tracking-tight">${brandIntel?.businessName || "AI Landing"}</div>
  </header>

  <main class="flex-1">
    <!-- Hero Section -->
    <section class="hero px-6 py-20 text-center flex flex-col items-center justify-center">
      <div class="max-w-3xl">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">${headline}</h1>
        <p class="mt-6 text-lg opacity-85 max-w-2xl mx-auto leading-relaxed">${subheading}</p>
        <div class="mt-10">
          <a href="#" class="btn px-8 py-4 rounded-xl text-base font-bold inline-block shadow-lg hover:opacity-95 transition">${ctaText}</a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-5xl mx-auto px-6 py-20">
      <h2 class="text-2xl font-bold text-center mb-12">Core Highlights</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${features.map((feat, idx) => `
        <div class="card p-6 rounded-2xl shadow-sm">
          <div class="text-lg font-bold mb-2">Benefit 0${idx + 1}</div>
          <p class="text-sm opacity-80 leading-relaxed">${feat}</p>
        </div>
        `).join("")}
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="border-t border-gray-800/10 bg-opacity-40 py-16 text-center px-6">
      <div class="max-w-2xl mx-auto">
        <div class="text-5xl text-indigo-500/20 font-serif leading-none">“</div>
        <p class="text-xl italic font-medium -mt-4 leading-relaxed">"${testimonial}"</p>
        <div class="mt-4 font-bold text-sm tracking-wider uppercase opacity-75">— ${testimonialAuthor}</div>
      </div>
    </section>
  </main>

  <footer class="border-t border-gray-800/10 py-10 text-center text-xs opacity-60">
    &copy; 2026 ${brandIntel?.businessName || "AI Landing"}. Scaffolded by AI Marketing Studio.
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `landing-${pageType}-${templateId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setApprovalStatus("published");
  }

  if (!activeCampaign) {
    return (
      <div className="card p-8 text-center text-slate-500 border border-slate-100 bg-white">
        Please scrape a business URL first to activate the Landing Page Builder.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Landing Page Scaffolder</h2>
          <p className="text-sm text-slate-500 mt-1">
            Build and export responsive landing pages tuned directly to campaign conversion targets.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-450 uppercase">Workflow Status:</span>
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            approvalStatus === "draft" ? "bg-amber-100 text-amber-800" :
            approvalStatus === "edited" ? "bg-indigo-100 text-indigo-850" :
            approvalStatus === "approved" ? "bg-emerald-100 text-emerald-800" :
            "bg-slate-900 text-white"
          }`}>
            {approvalStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Editor Settings (Left/Sidebar in the template builder) */}
        <div className="xl:col-span-5 space-y-6 flex flex-col">
          
          <div className="card p-6 border border-slate-100 bg-white space-y-5">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">1. Target Funnel & Style</h3>
            
            {/* Page Type Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Landing Page Type</label>
              <select
                value={pageType}
                onChange={(e) => {
                  setPageType(e.target.value);
                  setApprovalStatus("draft");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-violet-400"
              >
                {PAGE_TYPES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Source Campaign</label>
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-violet-400"
              >
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.type}
                  </option>
                ))}
              </select>
            </div>

            {/* Template Skin Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Visual Theme</label>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`px-3 py-2 text-[10px] font-semibold rounded-lg border text-left transition ${
                      templateId === t.id
                        ? "border-violet-600 bg-violet-50 text-violet-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6 border border-slate-100 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">2. Page Content Customization</h3>

            {/* Headline */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => {
                  setHeadline(e.target.value);
                  setApprovalStatus("edited");
                }}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Subheading */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hero Paragraph</label>
              <textarea
                value={subheading}
                rows={3}
                onChange={(e) => {
                  setSubheading(e.target.value);
                  setApprovalStatus("edited");
                }}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none"
              />
            </div>

            {/* CTA Button Text */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CTA Button Text</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => {
                  setCtaText(e.target.value);
                  setApprovalStatus("edited");
                }}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Testimonial */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Social Proof Quote</label>
              <textarea
                value={testimonial}
                rows={2}
                onChange={(e) => {
                  setTestimonial(e.target.value);
                  setApprovalStatus("edited");
                }}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none"
              />
            </div>

            {/* Actions panel */}
            <div className="pt-4 border-t flex gap-2">
              <button
                onClick={() => setApprovalStatus("approved")}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition"
              >
                Approve Scaffold
              </button>
              <button
                onClick={handleDownloadHtml}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Download HTML
              </button>
            </div>
          </div>

        </div>

        {/* Live Device Render (Right side preview) */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
            <span>Live Layout Sandbox</span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Dynamic Sandbox
            </span>
          </div>

          <div className={`flex-1 rounded-2xl border border-slate-200 shadow-xl overflow-hidden min-h-[480px] flex flex-col`}>
            {/* Browser top-bar chrome */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <div className="bg-white rounded-md text-[10px] font-medium text-slate-400 px-3 py-0.5 ml-4 flex-1 truncate max-w-sm">
                https://{brandIntel?.businessName || "ailanding"}.com/lp/{pageType}/{activeCampaign.typeId}
              </div>
            </div>

            {/* Sandbox Workspace */}
            <div className={`flex-1 p-6 sm:p-10 overflow-y-auto ${
              templateId === "saas" ? "bg-slate-950 text-slate-100" :
              templateId === "luxury" ? "bg-[#faf9f6] text-stone-900 font-serif" :
              templateId === "fitness" ? "bg-zinc-900 text-white" : "bg-white text-slate-800"
            }`}>
              
              {/* Fake Nav */}
              <div className="flex items-center justify-between border-b border-current/10 pb-4">
                <div className="font-bold text-sm">{brandIntel?.businessName || "AI Landing"}</div>
                <div className="h-2.5 w-12 bg-current opacity-20 rounded" />
              </div>

              {/* Hero content */}
              <div className="py-12 text-center max-w-lg mx-auto space-y-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  {headline}
                </h1>
                <p className="text-xs opacity-85 leading-relaxed">
                  {subheading}
                </p>
                <div className="pt-2">
                  <span className={`inline-flex px-4 py-2 rounded-lg text-xs font-bold shadow-md cursor-pointer ${
                    templateId === "saas" ? "bg-gradient-to-r from-cyan-400 to-indigo-500 text-white" :
                    templateId === "luxury" ? "bg-stone-900 text-white uppercase tracking-wider" :
                    templateId === "fitness" ? "bg-orange-600 text-white uppercase font-extrabold" : "bg-blue-600 text-white"
                  }`}>
                    {ctaText}
                  </span>
                </div>
              </div>

              {/* Features section grid */}
              <div className="border-t border-current/10 pt-10 mt-6 space-y-4">
                <div className="text-center text-xs font-bold uppercase tracking-wider mb-6">Page Highlights ({pageType.replace("_", " ")})</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {features.map((feat, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${
                      templateId === "saas" ? "bg-slate-900 border-slate-800" :
                      templateId === "luxury" ? "bg-white border-stone-200" :
                      templateId === "fitness" ? "bg-zinc-800 border-l-4 border-l-orange-500 border-zinc-700" : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="text-[10px] font-bold opacity-60">Benefit 0{idx + 1}</div>
                      <p className="text-[10px] mt-1 leading-relaxed opacity-90">{feat}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Testimonial block */}
              {testimonial && (
                <div className="border-t border-current/10 pt-8 mt-8 text-center max-w-md mx-auto">
                  <div className="text-2xl text-violet-500/30 leading-none">“</div>
                  <p className="text-xs italic font-medium -mt-2 leading-relaxed">
                    {testimonial}
                  </p>
                  <div className="text-[9px] uppercase tracking-wider opacity-60 font-bold mt-2">
                    — {testimonialAuthor}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
