"use client";
import { useState, useEffect, useMemo } from "react";

export default function CopySocialStudio({ strategy, currentRole }) {
  const campaigns = useMemo(() => strategy?.campaigns || [], [strategy?.campaigns]);
  const brandIntel = useMemo(() => strategy?.brandIntelligence || {}, [strategy?.brandIntelligence]);
  const hasEditAccess = ["super_admin", "agency_admin", "marketing_manager"].includes(currentRole);

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id || "");
  const [activeSubTab, setActiveSubTab] = useState("ad"); // 'ad', 'social', 'email'
  const [approvalStatus, setApprovalStatus] = useState("draft"); // 'draft', 'edited', 'approved', 'published'

  // ---------------------------------------------------------------------------
  // 1. AD COPY GENERATOR STATE
  // ---------------------------------------------------------------------------
  const [adChannel, setAdChannel] = useState("meta"); // 'google', 'meta', 'linkedin', 'youtube'
  const [adAngle, setAdAngle] = useState("pain_point"); // 'pain_point', 'benefit_led'
  const [headline, setHeadline] = useState("");
  const [primaryText, setPrimaryText] = useState("");
  const [shortCaption, setShortCaption] = useState("");
  const [ctaButton, setCtaButton] = useState("Learn More");

  // ---------------------------------------------------------------------------
  // 2. SOCIAL MEDIA GENERATOR STATE
  // ---------------------------------------------------------------------------
  const [socialPlatform, setSocialPlatform] = useState("linkedin"); // 'linkedin', 'facebook', 'instagram', 'twitter'
  const [socialMode, setSocialMode] = useState("single"); // 'single', 'series'
  const [socialHook, setSocialHook] = useState("");
  const [socialBody, setSocialBody] = useState("");
  const [hashtags, setHashtags] = useState("#marketing #automation");
  const [engagementPrediction, setEngagementPrediction] = useState("High (Expected 4.2% CTR)");

  // Content Series State
  const [seriesPosts, setSeriesPosts] = useState([]);

  // ---------------------------------------------------------------------------
  // 3. EMAIL GENERATOR STATE
  // ---------------------------------------------------------------------------
  const [emailType, setEmailType] = useState("newsletter"); // 'newsletter', 'promo', 'nurture', 'retention'
  const [emailVariant, setEmailVariant] = useState("A"); // 'A', 'B'
  const [emailSubject, setEmailSubject] = useState("");
  const [emailGreeting, setEmailGreeting] = useState("Hi [First Name],");
  const [emailBody, setEmailBody] = useState("");

  // Sync inputs with selected campaign / strategy
  useEffect(() => {
    const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];
    if (activeCampaign) {
      // Ad sync
      setHeadline(activeCampaign.headline || "");
      setPrimaryText(activeCampaign.primaryText || "");
      setShortCaption(activeCampaign.shortCaption || "");
      setCtaButton(activeCampaign.ctaButton || "Learn More");

      // Social sync
      setSocialHook(activeCampaign.socialVersion?.hook || `Attention ${activeCampaign.audience || "businesses"}!`);
      setSocialBody(activeCampaign.socialVersion?.caption || activeCampaign.primaryText || "");
      setHashtags(activeCampaign.socialVersion?.hashtags?.join(" ") || "#startup #marketing #efficiency");
      setEngagementPrediction("High (Estimated 3.8% - 4.5% CTR)");

      // Social content series mock
      setSeriesPosts([
        {
          day: "Day 1: The Problem",
          hook: `Why is ${brandIntel.industry || "your industry"} still using slow, manual campaigns?`,
          body: `Most teams waste hours copying copy across builders. It's time to transition to a unified system aligned to your brand personality.`,
          tags: "#operations #growth"
        },
        {
          day: "Day 3: The Solution",
          hook: `Introducing a smarter way to scale: ${brandIntel.coreOffer || "unified platform"}.`,
          body: `By pulling website signals directly into ad copy and landing page scaffolds, you compress turnaround time to seconds.`,
          tags: "#aimarketing #productivity"
        },
        {
          day: "Day 5: The Case Study",
          hook: `How a lean marketing team achieved target MRR growth in 30 days.`,
          body: `By automating target campaign assets, they boosted conversion volume and cut agency overhead in half.`,
          tags: "#saas #conversion"
        }
      ]);

      // Email sync
      syncEmailCopy(emailType, emailVariant, activeCampaign);
    }
    
    function syncEmailCopy(type, variant, activeCampaign) {
      const name = brandIntel.businessName || "us";
      const category = brandIntel.industry || "your industry";
      
      if (type === "newsletter") {
        if (variant === "A") {
          setEmailSubject(`Monthly Roundup: Optimizing operations for ${category}`);
          setEmailBody(`This month, we are focusing on campaign velocity.\n\nLearn how to unify content creation, ad variants, and landing page scaffolding to hit your target metrics faster.\n\nCheck out the full breakdown below.`);
        } else {
          setEmailSubject(`Strategist Intelligence: Are you marketing faster or just busier?`);
          setEmailBody(`The secret to high-margin recurring revenue isn't more hours—it's automated consistency.\n\nIn this newsletter, we detail how agencies manage multi-client assets under unified voice profiles.\n\nRead more details here.`);
        }
      } else if (type === "promo") {
        if (variant === "A") {
          setEmailSubject(`Exclusive Offer: Unlock automated scaling for ${name}`);
          setEmailBody(`Ready to cut agency costs?\n\nSign up today and get access to the Growth plan. Design landing pages, generate A/B email variants, and build Facebook/Google ads under a single subscription.\n\nClaim your trial now.`);
        } else {
          setEmailSubject(`Limited Window: Scaffold your next launch for free`);
          setEmailBody(`Don't build from scratch. Use our AI Prompt Framework and Template library to deploy custom lead capture assets in minutes.\n\nTake 20% off your first year.`);
        }
      } else {
        // nurture / retention
        setEmailSubject(`Mastering brand personality in ${category}`);
        setEmailBody(`Consistency builds trust.\n\nBy establishing positioning pillars and prohibited words in your guidelines, you protect your brand reputation across all client-facing copy.\n\nRead our guide.`);
      }
    }
  }, [selectedCampaignId, strategy, emailType, emailVariant, campaigns, brandIntel]);

  const activeCampaign = campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0];

  function handleCopy() {
    if (!hasEditAccess) return;
    let copyText = "";
    if (activeSubTab === "ad") {
      copyText = `Channel: ${adChannel.toUpperCase()}\nHeadline: ${headline}\nBody: ${primaryText}\nCTA: ${ctaButton}`;
    } else if (activeSubTab === "social") {
      if (socialMode === "single") {
        copyText = `Platform: ${socialPlatform.toUpperCase()}\nHook: ${socialHook}\nBody: ${socialBody}\nTags: ${hashtags}`;
      } else {
        copyText = seriesPosts.map(p => `${p.day}\nHook: ${p.hook}\nBody: ${p.body}\nTags: ${p.tags}`).join("\n\n");
      }
    } else {
      copyText = `Subject: ${emailSubject}\nGreeting: ${emailGreeting}\nBody: ${emailBody}\nCTA: ${ctaButton}`;
    }
    navigator.clipboard.writeText(copyText);
    setApprovalStatus("published");
    alert("Asset content copied to clipboard! Status updated to Published.");
  }

  if (!activeCampaign) {
    return (
      <div className="card p-8 text-center text-slate-500 border border-slate-100 bg-white">
        Please scrape a business URL first to activate the Copy & Social Studio.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Content & Campaign Studio</h2>
          <p className="text-sm text-slate-500 mt-1">
            Build and optimize ad sets, multi-channel social updates, and email variants.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-455 uppercase">Workflow Status:</span>
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

      {!hasEditAccess && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-xs">
          ⚠️ <strong>Access Denied:</strong> Your active role (<strong>{currentRole.replace("_", " ")}</strong>) is restricted to Read Only. Select another role in the dashboard switcher to edit assets.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Editor Form Panel (Left column) */}
        <div className="xl:col-span-5 space-y-6">
          
          {/* Main settings selector */}
          <div className="card p-6 border border-slate-100 bg-white space-y-5">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">Studio Configuration</h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Campaign Source Context</label>
              <select
                value={selectedCampaignId}
                disabled={!hasEditAccess}
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

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Asset Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "ad", name: "Ad Copy" },
                  { id: "social", name: "Social Post" },
                  { id: "email", name: "Email Copy" },
                ].map((item) => (
                  <button
                    key={item.id}
                    disabled={!hasEditAccess}
                    onClick={() => {
                      setActiveSubTab(item.id);
                      setApprovalStatus("draft");
                    }}
                    className={`px-3 py-2.5 text-xs font-semibold rounded-lg border text-center transition ${
                      activeSubTab === item.id
                        ? "border-violet-650 bg-violet-50 text-violet-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Asset-specific input controllers */}
          <div className="card p-6 border border-slate-100 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">Asset Customizer</h3>

            {/* AD COPY CONTROLS */}
            {activeSubTab === "ad" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ad Channel</label>
                  <select
                    value={adChannel}
                    disabled={!hasEditAccess}
                    onChange={(e) => setAdChannel(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="meta">Meta Ads (FB/IG)</option>
                    <option value="google">Google Search Ad</option>
                    <option value="linkedin">LinkedIn Sponsor Ad</option>
                    <option value="youtube">YouTube Ad Description</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Strategic Angle (Variant)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setAdAngle("pain_point");
                        setHeadline(activeCampaign.headline);
                        setApprovalStatus("edited");
                      }}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        adAngle === "pain_point" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      A: Pain Point Focus
                    </button>
                    <button
                      onClick={() => {
                        setAdAngle("benefit_led");
                        setHeadline(`Achieve your growth target with ${brandIntel.businessName || "us"}`);
                        setApprovalStatus("edited");
                      }}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        adAngle === "benefit_led" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      B: Benefit Led Focus
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setHeadline(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary ad copy</label>
                  <textarea
                    value={primaryText}
                    rows={4}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setPrimaryText(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs leading-relaxed border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Link Caption / Subtext</label>
                  <input
                    type="text"
                    value={shortCaption}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setShortCaption(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                  />
                </div>
              </>
            )}

            {/* SOCIAL COPY CONTROLS */}
            {activeSubTab === "social" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Platform</label>
                  <select
                    value={socialPlatform}
                    disabled={!hasEditAccess}
                    onChange={(e) => setSocialPlatform(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="linkedin">LinkedIn Profile Update</option>
                    <option value="facebook">Facebook Brand Post</option>
                    <option value="instagram">Instagram Grid Caption</option>
                    <option value="twitter">X / Twitter micro-copy</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Generation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSocialMode("single")}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        socialMode === "single" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Single Feed Post
                    </button>
                    <button
                      onClick={() => setSocialMode("series")}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        socialMode === "series" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      3-Post Content Series
                    </button>
                  </div>
                </div>

                {socialMode === "single" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hook</label>
                      <input
                        type="text"
                        value={socialHook}
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          setSocialHook(e.target.value);
                          setApprovalStatus("edited");
                        }}
                        className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Caption Body</label>
                      <textarea
                        value={socialBody}
                        rows={4}
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          setSocialBody(e.target.value);
                          setApprovalStatus("edited");
                        }}
                        className="w-full text-xs leading-relaxed border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hashtags Suggestions</label>
                      <input
                        type="text"
                        value={hashtags}
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          setHashtags(e.target.value);
                          setApprovalStatus("edited");
                        }}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* EMAIL COPY CONTROLS */}
            {activeSubTab === "email" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign Type</label>
                  <select
                    value={emailType}
                    disabled={!hasEditAccess}
                    onChange={(e) => setEmailType(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="newsletter">Monthly Newsletter</option>
                    <option value="promo">Promotional Push</option>
                    <option value="nurture">Lead Nurture Sequence</option>
                    <option value="retention">Customer Retention</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">A/B Testing Variants</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEmailVariant("A")}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        emailVariant === "A" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Variant A (Control)
                    </button>
                    <button
                      onClick={() => setEmailVariant("B")}
                      disabled={!hasEditAccess}
                      className={`py-1.5 px-2.5 rounded-lg border text-[10px] font-bold ${
                        emailVariant === "B" ? "bg-slate-900 border-slate-900 text-white" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      Variant B (Split Test)
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setEmailSubject(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Greeting</label>
                  <input
                    type="text"
                    value={emailGreeting}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setEmailGreeting(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Body</label>
                  <textarea
                    value={emailBody}
                    rows={6}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setEmailBody(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs leading-relaxed border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none"
                  />
                </div>
              </>
            )}

            {/* Actions panel */}
            <div className="pt-4 border-t flex gap-2">
              <button
                disabled={!hasEditAccess}
                onClick={() => setApprovalStatus("approved")}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition disabled:opacity-40"
              >
                Approve Copy
              </button>
              <button
                disabled={!hasEditAccess}
                onClick={handleCopy}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40"
              >
                Publish & Copy
              </button>
            </div>

          </div>
        </div>

        {/* Dynamic Mockup Preview Container (Right column) */}
        <div className="xl:col-span-7 flex flex-col">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center justify-between">
            <span>Interactive Platform Canvas</span>
            {activeSubTab === "social" && (
              <span className="text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded font-semibold">
                Engagement Prediction: {engagementPrediction}
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[480px] bg-slate-100 rounded-2xl border border-slate-200 p-6 sm:p-10 flex items-center justify-center">
            
            {/* AD COPY PREVIEW */}
            {activeSubTab === "ad" && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-slate-800 text-xs font-sans">
                {/* Meta platform header */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Channel: {adChannel} Ad Variant</span>
                  <span className="text-slate-500">Angle: {adAngle.replace("_", " ")}</span>
                </div>
                
                {adChannel !== "google" ? (
                  <>
                    <div className="p-4 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {brandIntel.businessName?.[0] || "A"}
                      </span>
                      <div>
                        <div className="font-bold text-[13px]">{brandIntel.businessName || "Brand Name"}</div>
                        <div className="text-[10px] text-slate-400">Sponsored · {adChannel}</div>
                      </div>
                    </div>
                    <div className="px-4 pb-3 leading-relaxed text-[13px]">{primaryText}</div>
                    <div className="h-48 bg-slate-200 relative flex items-center justify-center select-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-violet-600/20" />
                      <div className="text-slate-500 text-[10px] font-medium text-center z-10 px-4 leading-relaxed">
                        <div className="font-bold uppercase tracking-wider text-slate-700">Suggested Visual Theme</div>
                        <p className="mt-1 text-slate-800 max-w-xs">{activeCampaign.suggestedVisualDirection}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                      <div className="flex-1 truncate">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide truncate">
                          {brandIntel.businessName || "BRAND"}.COM
                        </div>
                        <div className="font-bold text-[14px] text-slate-900 truncate mt-0.5">{headline}</div>
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">{shortCaption}</div>
                      </div>
                      <button className="bg-slate-250 hover:bg-slate-300 text-slate-800 font-bold px-4 py-2 rounded-lg text-xs shrink-0 tracking-wide">
                        {ctaButton}
                      </button>
                    </div>
                  </>
                ) : (
                  // Google Search Mock
                  <div className="p-6 space-y-3 font-sans">
                    <div className="flex items-center gap-2 text-[11px] text-slate-650">
                      <span>Ad · https://www.{brandIntel.businessName?.toLowerCase()?.replace(/\s+/g, "") || "brand"}.com</span>
                    </div>
                    <h4 className="text-blue-800 font-medium text-lg leading-snug hover:underline cursor-pointer">
                      {headline} | {brandIntel.businessName}
                    </h4>
                    <p className="text-slate-650 text-xs leading-relaxed">
                      {primaryText.slice(0, 160)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SOCIAL COPY PREVIEW */}
            {activeSubTab === "social" && (
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-slate-800 text-xs font-sans">
                
                {socialMode === "single" ? (
                  // Single Post
                  <>
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span>Platform: {socialPlatform}</span>
                    </div>
                    <div className="p-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-violet-650 flex items-center justify-center text-white font-bold text-xs">
                        {brandIntel.businessName?.[0] || "A"}
                      </span>
                      <div>
                        <div className="font-bold text-[12px]">{brandIntel.businessName}</div>
                        <div className="text-[9px] text-slate-400">Post generated with AI prompt Framework</div>
                      </div>
                    </div>
                    <div className="px-4 pb-4 leading-relaxed text-[13px] space-y-2">
                      <p className="font-bold text-slate-900">{socialHook}</p>
                      <p className="whitespace-pre-line text-slate-700">{socialBody}</p>
                      <p className="text-indigo-650 font-semibold">{hashtags}</p>
                    </div>
                  </>
                ) : (
                  // Content Calendar Series
                  <div className="p-5 space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b pb-2">3-Post Campaign Calendar</div>
                    <div className="space-y-3">
                      {seriesPosts.map((post, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-1">
                          <span className="text-[9px] bg-violet-100 text-violet-850 px-1.5 py-0.5 rounded font-bold uppercase">{post.day}</span>
                          <h5 className="font-bold text-[11px] text-slate-800 mt-1 leading-snug">{post.hook}</h5>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{post.body}</p>
                          <span className="text-[9px] text-indigo-600 font-semibold block">{post.tags}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* EMAIL COPY PREVIEW */}
            {activeSubTab === "email" && (
              <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-slate-800 text-xs font-sans">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 text-slate-500 space-y-1 text-[10px]">
                  <div><span className="font-semibold">Type:</span> <span className="uppercase font-bold text-slate-700">{emailType}</span> (Variant {emailVariant})</div>
                  <div><span className="font-semibold">Subject:</span> <span className="text-slate-850 font-semibold">{emailSubject}</span></div>
                </div>

                <div className="p-6 space-y-4 leading-relaxed text-[12px] text-slate-700 max-h-[300px] overflow-y-auto">
                  <div>{emailGreeting}</div>
                  <div className="whitespace-pre-line">{emailBody}</div>
                  <div className="pt-2">
                    <span className="inline-block bg-indigo-600 text-white font-bold px-5 py-2.5 rounded-lg shadow cursor-pointer">
                      {ctaButton}
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
