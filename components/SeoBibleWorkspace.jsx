"use client";
import { useState, useMemo } from "react";

const INITIAL_KEYWORDS = [
  { id: "kw_1", keyword: "AI marketing platform", tier: "Tier 1", volume: "18,400", difficulty: "72 (Hard)", intent: "Commercial", targetPage: "Homepage" },
  { id: "kw_2", keyword: "AI marketing software", tier: "Tier 1", volume: "9,200", difficulty: "68 (Hard)", intent: "Commercial", targetPage: "Homepage" },
  { id: "kw_3", keyword: "marketing automation platform", tier: "Tier 1", volume: "14,500", difficulty: "75 (Hard)", intent: "Commercial", targetPage: "Homepage" },
  { id: "kw_4", keyword: "AI content generator", tier: "Tier 2", volume: "45,000", difficulty: "84 (Very Hard)", intent: "Transactional", targetPage: "Features: Content" },
  { id: "kw_5", keyword: "AI ad generator", tier: "Tier 2", volume: "12,100", difficulty: "62 (Hard)", intent: "Transactional", targetPage: "Features: Campaigns" },
  { id: "kw_6", keyword: "AI landing page builder", tier: "Tier 2", volume: "8,800", difficulty: "58 (Medium)", intent: "Transactional", targetPage: "Features: Landings" },
  { id: "kw_7", keyword: "best AI marketing tools", tier: "Tier 3", volume: "5,400", difficulty: "42 (Medium)", intent: "Informational", targetPage: "Blog Cluster" },
  { id: "kw_8", keyword: "AI marketing for agencies", tier: "Tier 3", volume: "3,200", difficulty: "38 (Medium)", intent: "Informational", targetPage: "Features: Agency Solutions" },
];

const INITIAL_SCHEMAS = {
  SoftwareApplication: `{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AI Marketing Studio",
  "operatingSystem": "All",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD"
  }
}`,
  Organization: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AI Marketing Studio Ltd",
  "url": "https://vibeadstudio.com",
  "logo": "https://vibeadstudio.com/logo.png",
  "sameAs": [
    "https://linkedin.com/company/vibeadstudio",
    "https://x.com/vibeadstudio"
  ]
}`,
  FAQ: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How does Vibe OS maintain brand voice consistency?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Vibe OS scrapes brand guidelines and URLs to lock down voice contexts globally."
    }
  }]
}`,
  Article: `{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "10 Growth Strategies for SaaS in 2026",
  "datePublished": "2026-06-13T12:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Pratik Patel"
  }
}`,
  Review: `{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "SoftwareApplication",
    "name": "AI Marketing Studio"
  },
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.9",
    "bestRating": "5"
  },
  "author": {
    "@type": "Person",
    "name": "Alice Smith"
  }
}`,
  Breadcrumb: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://vibeadstudio.com"
  }, {
    "@type": "ListItem",
    "position": 2,
    "name": "Pricing",
    "item": "https://vibeadstudio.com/pricing"
  }]
}`
};

const INITIAL_BLOGS = [
  { id: "blg_1", category: "AI Marketing", title: "How AI Improves Marketing Campaign Velocity", wordCount: 1840, status: "Indexed", date: "2026-06-12", outline: "Pillar post. Discusses LLM strategists and conversion attributions." },
  { id: "blg_2", category: "Content Creation", title: "The Ultimate AI Content Generation Guide", wordCount: 2420, status: "Indexed", date: "2026-06-10", outline: "Focuses on Brand Voice templates and SEO blog indexing." },
  { id: "blg_3", category: "Automation", title: "Trigger-Action Rules: AI Campaign Automation", wordCount: 2150, status: "Indexed", date: "2026-06-08", outline: "Discusses webhook triggers, welcome sequences, and CRM syncing." },
  { id: "blg_4", category: "Advertising", title: "A/B Testing: AI Ad Creation Best Practices", wordCount: 1980, status: "Pending Index", date: "2026-06-13", outline: "Covers CTR variant testing and Meta Ads headline strategies." },
  { id: "blg_5", category: "Lead Generation", title: "Topical Authority: Generating Qualified Trial Signups", wordCount: 2200, status: "Indexed", date: "2026-06-05", outline: "Focuses on long-tail informational queries and CTA structures." },
];

const INITIAL_LINKS = [
  { id: "lnk_1", source: "Homepage (Pillar node)", destination: "Features: AI Content Generator", anchor: "AI content generator", status: "Active" },
  { id: "lnk_2", source: "Features: AI Content Generator", destination: "Blog: Content Generation Guide", anchor: "content creation guide", status: "Active" },
  { id: "lnk_3", source: "Blog: Campaign Automation", destination: "Features: Campaign Builder", anchor: "campaign studio builder", status: "Active" },
  { id: "lnk_4", source: "Case Studies: Agency Success", destination: "Pricing Page", anchor: "pricing plan tiers", status: "Active" },
  { id: "lnk_5", source: "Features: Agency Solutions", destination: "Onboarding trial signup flow", anchor: "start free trial", status: "Active" },
];

const INITIAL_BACKLINKS = [
  { id: "bl_1", domain: "marketingland.com", authority: "DR 78", path: "/future-of-ai-marketing", status: "Active" },
  { id: "bl_2", domain: "techcrunch.com", authority: "DR 92", path: "/vibeadstudio-series-a", status: "Active" },
  { id: "bl_3", domain: "agencydirectory.org", authority: "DR 54", path: "/listing/horizon-agency", status: "Active" },
];

export default function SeoBibleWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("keywords");
  
  // Local state registers
  const [keywords, setKeywords] = useState(INITIAL_KEYWORDS);
  const [selectedSchemaKey, setSelectedSchemaKey] = useState("SoftwareApplication");
  const [blogs, setBlogs] = useState(INITIAL_BLOGS);
  const [links, setLinks] = useState(INITIAL_LINKS);
  const [backlinks, setBacklinks] = useState(INITIAL_BACKLINKS);

  // Form states
  const [newKw, setNewKw] = useState("");
  const [newKwTier, setNewKwTier] = useState("Tier 2");
  const [newKwVolume, setNewKwVolume] = useState("");
  const [newKwPage, setNewKwPage] = useState("Homepage");

  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogCategory, setNewBlogCategory] = useState("AI Marketing");
  const [newBlogWords, setNewBlogWords] = useState(2000);

  const [newLinkSource, setNewLinkSource] = useState("");
  const [newLinkDest, setNewLinkDest] = useState("");
  const [newLinkAnchor, setNewLinkAnchor] = useState("");

  const isReadOnly = currentRole === "read_only";

  // Schema code helper
  const activeSchemaCode = useMemo(() => {
    return INITIAL_SCHEMAS[selectedSchemaKey] || "";
  }, [selectedSchemaKey]);

  // Handlers - Keyword map
  function handleAddKeyword(e) {
    e.preventDefault();
    if (!newKw.trim() || isReadOnly) return;

    const newId = `kw_${Date.now()}`;
    const newEntry = {
      id: newId,
      keyword: newKw,
      tier: newKwTier,
      volume: newKwVolume || "N/A",
      difficulty: "Medium",
      intent: "Commercial",
      targetPage: newKwPage
    };

    setKeywords([...keywords, newEntry]);

    logAction({
      action: "seo_keyword_mapped",
      details: `Mapped new keyword target: '${newEntry.keyword}' (${newEntry.tier} -> Target: ${newEntry.targetPage})`,
      status: "success",
      sql: `INSERT INTO "SeoKeywords" ("keyword", "tier", "volume", "targetPage") VALUES ('${newEntry.keyword}', '${newEntry.tier}', '${newEntry.volume}', '${newEntry.targetPage}')`
    });

    setNewKw("");
    setNewKwVolume("");
    alert("Keyword added to mapping directory.");
  }

  // Handlers - Blog Manager
  function handlePublishBlog(e) {
    e.preventDefault();
    if (!newBlogTitle.trim() || isReadOnly) return;

    const newBl = {
      id: `blg_${Date.now()}`,
      category: newBlogCategory,
      title: newBlogTitle,
      wordCount: parseInt(newBlogWords) || 2000,
      status: "Pending Index",
      date: new Date().toISOString().slice(0, 10),
      outline: "Manual workspace creation. Optimizing topic cluster structure."
    };

    setBlogs([newBl, ...blogs]);

    logAction({
      action: "seo_blog_published",
      details: `Published SEO blog article: '${newBl.title}' (Category: ${newBl.category}, Wordcount: ${newBl.wordCount})`,
      status: "success",
      sql: `INSERT INTO "SeoBlogs" ("title", "category", "wordCount", "status") VALUES ('${newBl.title}', '${newBl.category}', ${newBl.wordCount}, 'Pending Index')`
    });

    setNewBlogTitle("");
    setNewBlogWords(2000);
    alert(`Article '${newBl.title}' saved to publishing queue!`);
  }

  // Handlers - Internal Links
  function handleCreateLink(e) {
    e.preventDefault();
    if (!newLinkSource.trim() || !newLinkDest.trim() || !newLinkAnchor.trim() || isReadOnly) return;

    const newLn = {
      id: `lnk_${Date.now()}`,
      source: newLinkSource,
      destination: newLinkDest,
      anchor: newLinkAnchor,
      status: "Active"
    };

    setLinks([...links, newLn]);

    logAction({
      action: "seo_internal_link_created",
      details: `Mapped internal link pathway: [${newLn.source}] -(${newLn.anchor})-> [${newLn.destination}]`,
      status: "success",
      sql: `INSERT INTO "SeoLinks" ("source", "destination", "anchor") VALUES ('${newLn.source}', '${newLn.destination}', '${newLn.anchor}')`
    });

    setNewLinkSource("");
    setNewLinkDest("");
    setNewLinkAnchor("");
    alert("Internal link audit pathway logged.");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-sm shadow">📜</span>
            SEO Bible Operations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Topic clusters planning, keyword registries, structured JSON-LD schema auditors, internal link pathway mapping, and organic search reporting.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Google Search Console Sync Active</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "keywords", label: "Keyword mappings", icon: "🔑" },
          { id: "schemas", label: "JSON-LD structured data", icon: "⚙️" },
          { id: "clusters", label: "Content Clusters & Pillars", icon: "🕸️" },
          { id: "blogs", label: "Blog categories queue", icon: "✍️" },
          { id: "links", label: "Internal Link Audits", icon: "🔗" },
          { id: "reporting", label: "Search Console Telemetry", icon: "📈" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. KEYWORD MAPS TAB */}
      {activeSubTab === "keywords" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* KEYWORDS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Primary Keyword Strategy Registry</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Target Keyword</th>
                      <th className="pb-2">Tier Segment</th>
                      <th className="pb-2">Search Volume (SV)</th>
                      <th className="pb-2">Difficulty index</th>
                      <th className="pb-2">Search Intent</th>
                      <th className="pb-2 text-right">Target Page Mapping</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw) => (
                      <tr key={kw.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2 font-bold text-slate-850">{kw.keyword}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            kw.tier === "Tier 1" ? "bg-red-50 border border-red-100 text-red-800" :
                            kw.tier === "Tier 2" ? "bg-indigo-50 border border-indigo-100 text-indigo-800" : "bg-slate-100 text-slate-650"
                          }`}>{kw.tier}</span>
                        </td>
                        <td className="py-3 text-slate-700 font-bold">{kw.volume}</td>
                        <td className="py-3 text-slate-600 font-semibold">{kw.difficulty}</td>
                        <td className="py-3 font-semibold uppercase text-slate-500 text-[10px]">{kw.intent}</td>
                        <td className="py-3 text-right font-mono text-[10px] text-indigo-700 font-bold">{kw.targetPage}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD KEYWORD FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Map Keyword Target</h3>
              <form onSubmit={handleAddKeyword} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Target Keyword Phrase</label>
                  <input
                    type="text"
                    placeholder="e.g. AI marketing platform"
                    value={newKw}
                    onChange={(e) => setNewKw(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Tier Segment</label>
                    <select
                      value={newKwTier}
                      onChange={(e) => setNewKwTier(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="Tier 1">Tier 1 (High volume)</option>
                      <option value="Tier 2">Tier 2 (Specific tools)</option>
                      <option value="Tier 3">Tier 3 (Long-tail)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Monthly Volume (SV)</label>
                    <input
                      type="text"
                      placeholder="18,400"
                      value={newKwVolume}
                      onChange={(e) => setNewKwVolume(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Target Page Destination</label>
                  <select
                    value={newKwPage}
                    onChange={(e) => setNewKwPage(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="Homepage">Homepage</option>
                    <option value="Features: Content">Features: Content</option>
                    <option value="Features: Campaigns">Features: Campaigns</option>
                    <option value="Features: Landings">Features: Landings</option>
                    <option value="Features: Agency Solutions">Features: Agency Solutions</option>
                    <option value="Blog Cluster">Blog Cluster</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Confirm Keyword Map
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 2. JSON-LD STRUCTURED DATA AUDITOR */}
      {activeSubTab === "schemas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SCHEMAS LIST */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-3">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active structured JSON-LD schemas</h3>
              <p className="text-xs text-slate-400 font-medium">Select a schema type to inspect structured scripts outputs:</p>
              
              <div className="space-y-2 pt-2">
                {[
                  { key: "SoftwareApplication", label: "SoftwareApplication Schema", desc: "For rich App features in SERP" },
                  { key: "Organization", label: "Organization Brand Schema", desc: "For logo and social connections" },
                  { key: "FAQ", label: "FAQ Page Accordion Schema", desc: "For direct answer blocks in search" },
                  { key: "Article", label: "NewsArticle Blog Schema", desc: "For Google News carousel crawls" },
                  { key: "Review", label: "Review Rating Star Schema", desc: "For review rating stars details" },
                  { key: "Breadcrumb", label: "Breadcrumb Navigation Schema", desc: "For routing hierarchies" },
                ].map((s) => {
                  const active = selectedSchemaKey === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSchemaKey(s.key)}
                      className={`w-full text-left p-3 rounded-xl border transition text-xs flex flex-col gap-0.5 ${
                        active
                          ? "border-violet-600 bg-violet-50/20"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-bold text-slate-800">{s.label}</span>
                      <span className="text-[10px] text-slate-450">{s.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SCRIPT PREVIEW */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h3 className="font-bold text-slate-800 text-sm">JSON-LD Script tag code block</h3>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeSchemaCode);
                    alert("JSON-LD schema script copied to clipboard!");
                  }}
                  className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition"
                >
                  Copy Script
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-[10px] leading-relaxed overflow-x-auto">
                <pre>{activeSchemaCode}</pre>
              </div>

              <div className="flex items-center gap-2 text-emerald-600 font-bold border border-emerald-100 bg-emerald-50/20 p-2.5 rounded-xl text-xs">
                <span>✅ Schema verification matches Schema.org standards (100% compliant)</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. CONTENT CLUSTERS & pillars */}
      {activeSubTab === "clusters" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* TOPICAL CLUSTER NETWORK */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Topical cluster network maps</h3>
              <p className="text-xs text-slate-400 font-medium">Topic clusters structure mapping supporting articles around the primary pillar:</p>

              {/* Graphical cluster block */}
              <div className="p-6 bg-slate-950 rounded-2xl flex flex-col justify-between space-y-6 text-white min-h-[300px]">
                
                {/* Pillar node */}
                <div className="flex justify-center">
                  <div className="p-3 bg-violet-600 border border-violet-400 rounded-xl text-xs font-black uppercase text-center shadow-lg shadow-violet-900/30">
                    👑 Pillar Core Node: AI Marketing Platform
                  </div>
                </div>

                {/* Connecting lines */}
                <div className="flex justify-between px-8 text-slate-500 font-bold text-sm">
                  <span>↙️</span>
                  <span>↓</span>
                  <span>↓</span>
                  <span>↘️</span>
                </div>

                {/* Supporting nodes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-bold text-center">
                  <div className="p-2 border border-slate-800 bg-slate-900/60 rounded-lg">
                    📖 Guide: How AI Improves Marketing
                  </div>
                  <div className="p-2 border border-slate-800 bg-slate-900/60 rounded-lg">
                    📖 Guide: AI Content Generation
                  </div>
                  <div className="p-2 border border-slate-800 bg-slate-900/60 rounded-lg">
                    📖 Guide: AI Campaign Automation
                  </div>
                  <div className="p-2 border border-slate-800 bg-slate-900/60 rounded-lg">
                    📖 Guide: Social Media Strategies
                  </div>
                </div>
              </div>
            </div>

            {/* PROGRAMMATIC TEMPLATES DIRECTORY */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Programmatic templates scale</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Generate programmatic landing pages to scale organic search traffic efficiently:
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Industry Templates</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">e.g. AI marketing for SaaS</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Campaign Playbooks</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">e.g. Lead generation funnel roadmap</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
                </div>

                <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">Landing Page Templates</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">e.g. Product launch hero layouts</span>
                  </div>
                  <span className="bg-slate-250 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">In Queue</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. BLOGS QUEUE */}
      {activeSubTab === "blogs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* BLOGS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Content Calendar articles queue</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Article Title</th>
                      <th className="pb-2">Category</th>
                      <th className="pb-2">Word Count</th>
                      <th className="pb-2">Published Date</th>
                      <th className="pb-2 text-right">Indexing Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-slate-850 block">{b.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{b.outline}</span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 bg-slate-100 border rounded text-[9px] font-bold uppercase text-slate-600">{b.category}</span>
                        </td>
                        <td className="py-3 text-slate-700 font-bold">{b.wordCount} words</td>
                        <td className="py-3 text-slate-500 font-mono text-[10px]">{b.date}</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            b.status === "Indexed" ? "bg-emerald-105 text-emerald-800 border border-emerald-200" :
                            "bg-amber-100 text-amber-800 border border-amber-200 animate-pulse"
                          }`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD BLOG ARTICLE FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Publish SEO article</h3>
              <form onSubmit={handlePublishBlog} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Article Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 E-commerce conversion hacks"
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Category</label>
                    <select
                      value={newBlogCategory}
                      onChange={(e) => setNewBlogCategory(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="AI Marketing">AI Marketing</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Advertising">Advertising</option>
                      <option value="Automation">Automation</option>
                      <option value="Lead Generation">Lead Generation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Word Count</label>
                    <input
                      type="number"
                      value={newBlogWords}
                      onChange={(e) => setNewBlogWords(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Deploy Article to Site
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 5. INTERNAL LINK AUDIT PATHWAYS */}
      {activeSubTab === "links" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LINKS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Internal link audit pathway checks</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Source Origin page</th>
                      <th className="pb-2">Anchor Text</th>
                      <th className="pb-2">Destination Target page</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {links.map((lnk) => (
                      <tr key={lnk.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2 font-bold text-slate-800">{lnk.source}</td>
                        <td className="py-3 font-semibold text-violet-750 italic">&quot;{lnk.anchor}&quot;</td>
                        <td className="py-3 font-bold text-slate-700">{lnk.destination}</td>
                        <td className="py-3 text-right">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-emerald-200">
                            {lnk.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE INTERNAL LINK FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Add Audit Pathway</h3>
              <form onSubmit={handleCreateLink} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Source Anchor Text</label>
                  <input
                    type="text"
                    placeholder="e.g. content creation guide"
                    value={newLinkAnchor}
                    onChange={(e) => setNewLinkAnchor(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-semibold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Source Origin URL/Page</label>
                  <input
                    type="text"
                    placeholder="e.g. Blog: Content Generation Guide"
                    value={newLinkSource}
                    onChange={(e) => setNewLinkSource(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Destination Target Page</label>
                  <input
                    type="text"
                    placeholder="e.g. Features: AI Content Generator"
                    value={newLinkDest}
                    onChange={(e) => setNewLinkDest(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Register Audit Pathway
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 6. GOOGLE SEARCH CONSOLE TELEMETRY */}
      {activeSubTab === "reporting" && (
        <div className="space-y-6 animate-fade-in">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Organic Sessions / Clicks</span>
              <div className="text-xl font-black text-slate-900 mt-1">12,480 <span className="text-xs font-normal text-slate-500">/ 598 clicks</span></div>
              <span className="text-[10px] text-indigo-650 font-bold block mt-1">Average Position: #14.2</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Average CTR</span>
              <div className="text-xl font-black text-slate-900 mt-1">4.79% CTR</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ +0.82% this week</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">GA4 Conversions</span>
              <div className="text-xl font-black text-slate-900 mt-1">142 signups</div>
              <span className="text-[10px] text-violet-650 font-bold block mt-1">2.3% Session-to-Trial rate</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SEO Backlinks</span>
              <div className="text-xl font-black text-slate-900 mt-1">{backlinks.length} referring</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Average DR: 74</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Referring domain backlinks */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Referring Backlink Ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase pb-1.5">
                      <th className="pb-1.5">Source Domain</th>
                      <th className="pb-1.5">Domain Rating (DR)</th>
                      <th className="pb-1.5">Target link path</th>
                      <th className="pb-1.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backlinks.map((bl) => (
                      <tr key={bl.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-2.5 font-bold text-slate-800">{bl.domain}</td>
                        <td className="py-2.5 font-semibold text-indigo-700">{bl.authority}</td>
                        <td className="py-2.5 text-slate-500 font-mono text-[10px]">{bl.path}</td>
                        <td className="py-2.5 text-right">
                          <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">
                            {bl.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Organic Keyword target ranks */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-1 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Organic Keyword Positions</h3>
              
              <div className="space-y-3.5 text-xs text-slate-650 font-medium">
                <div className="flex justify-between border-b pb-1.5">
                  <span>AI marketing platform</span>
                  <span className="font-bold text-slate-900">Rank: #6 (↑ 2)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>AI content generator</span>
                  <span className="font-bold text-slate-900">Rank: #18 (↑ 5)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>best AI marketing tools</span>
                  <span className="font-bold text-slate-900">Rank: #4 (↑ 1)</span>
                </div>
                <div className="flex justify-between">
                  <span>AI marketing for agencies</span>
                  <span className="font-bold text-slate-900">Rank: #9 (↑ 1)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
