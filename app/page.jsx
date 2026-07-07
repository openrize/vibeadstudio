"use client";
import { useState } from "react";
import Header from "@/components/Header";
import LoadingAnimation from "@/components/LoadingAnimation";
import BrandIntelligencePanel from "@/components/BrandIntelligencePanel";
import ExtractedInsightsPanel from "@/components/ExtractedInsightsPanel";
import CampaignBuilderWorkspace from "@/components/CampaignBuilderWorkspace";
import SiteFooter from "@/components/SiteFooter";
import { buildStrategyOutput } from "@/lib/strategy";
import { buildFallbackCampaigns } from "@/lib/campaignLocal";
import { ensureUrl } from "@/lib/utils";

// Import workspace modules
import Sidebar from "@/components/Sidebar";
import CustomerWorkspace from "@/components/CustomerWorkspace";
import LandingPageBuilder from "@/components/LandingPageBuilder";
import CopySocialStudio from "@/components/CopySocialStudio";
import PricingPlansPanel from "@/components/PricingPlansPanel";
import BlogGenerator from "@/components/BlogGenerator";
import AdminPortal from "@/components/AdminPortal";
import AgencyPortal from "@/components/AgencyPortal";
import MarketingWebsite from "@/components/MarketingWebsite";
import SeoBibleWorkspace from "@/components/SeoBibleWorkspace";
import AnalyticsBibleWorkspace from "@/components/AnalyticsBibleWorkspace";
import CrmBibleWorkspace from "@/components/CrmBibleWorkspace";
import QaBibleWorkspace from "@/components/QaBibleWorkspace";
import DeploymentBibleWorkspace from "@/components/DeploymentBibleWorkspace";
import JiraRoadmapWorkspace from "@/components/JiraRoadmapWorkspace";

// Import SaaS simulation debuggers
import RbacSwitcher from "@/components/RbacSwitcher";
import ApiTerminal from "@/components/ApiTerminal";
import BillingDashboard from "@/components/BillingDashboard";

const FALLBACK_NOTE =
  "We could not extract every section from the website, so we used available brand signals and strategic inference to complete the campaign system.";

const SUCCESS_NOTE =
  "Six strategically differentiated full-funnel campaigns—grounded in extracted website signals and brand intelligence.";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [strategy, setStrategy] = useState(null);
  const [scraped, setScraped] = useState(null);
  const [busyMap, setBusyMap] = useState({});
  const [usedAI, setUsedAI] = useState(false);
  const [generationNote, setGenerationNote] = useState("");
  
  // Navigation active tab
  const [activeTab, setActiveTab] = useState("overview");

  // ---------------------------------------------------------------------------
  // SaaS Multi-Tenant & RBAC State Simulator
  // ---------------------------------------------------------------------------
  const [currentOrg, setCurrentOrg] = useState({ id: "org_acme", name: "Acme Enterprise Corp", plan: "growth" });
  const [currentRole, setCurrentRole] = useState("super_admin");
  const [logs, setLogs] = useState([]);

  function logAction(log) {
    const nextLog = {
      ...log,
      timestamp: new Date().toISOString(),
    };
    setLogs((prev) => [...prev, nextLog]);
  }

  async function handleGenerate(rawUrl) {
    const validUrl = ensureUrl(rawUrl);
    if (!validUrl) {
      setError("Please enter a valid website URL (e.g. https://yourbrand.com).");
      return;
    }

    setError("");
    setGenerationNote("");
    setStrategy(null);
    setScraped(null);
    setLoading(true);
    setLoadingStep(0);

    logAction({
      action: "scrape_requested",
      details: `Initiated website extraction for URL: ${validUrl}`,
      status: "info",
      sql: `INSERT INTO "AuditLogs" ("userId", "organizationId", "action") VALUES ('sim_user_1', '${currentOrg.id}', 'scrape_requested')`,
    });

    try {
      setLoadingStep(1);
      let scrapedPayload = null;
      const sRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: validUrl }),
      });
      const sJson = await sRes.json();

      if (sRes.ok && sJson?.scraped) {
        scrapedPayload = sJson.scraped;
        logAction({
          action: "scrape_succeeded",
          details: `DOM extraction complete for ${sJson.scraped.siteName || "target site"}. Loaded ${sJson.scraped.headings?.length || 0} headings.`,
          status: "success",
          sql: `SELECT * FROM "Brands" WHERE "websiteUrl" = '${validUrl}'`,
        });
      } else {
        scrapedPayload = buildFallbackScraped(validUrl);
        setGenerationNote(FALLBACK_NOTE);
        logAction({
          action: "scrape_failed",
          details: `Target block or bot protection. Falling back to category profile generators.`,
          status: "error",
        });
        if (sJson?.error && sRes.status === 400) {
          setError(sJson.error);
          setLoading(false);
          return;
        }
      }

      setLoadingStep(3);
      setScraped(scrapedPayload);
      setStrategy(buildStrategyOutput(scrapedPayload, [], null));

      setLoadingStep(4);
      const gRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scraped: scrapedPayload }),
      });
      const gJson = await gRes.json();

      setLoadingStep(5);

      if (gRes.ok && gJson.strategy) {
        setStrategy(gJson.strategy);
        setUsedAI(!!gJson.usedAI);
        setGenerationNote((prev) => prev || SUCCESS_NOTE);
        logAction({
          action: "ai_generation_succeeded",
          details: `Successfully compiled 6 full-funnel ad campaigns via OpenAI gpt-4o-mini`,
          status: "success",
          sql: `INSERT INTO "AIUsage" ("organizationId", "tokenCount", "generationCost") VALUES ('${currentOrg.id}', 1480, 0.00296)`,
        });
      } else {
        const fallback = buildStrategyOutput(
          scrapedPayload,
          buildFallbackCampaigns(scrapedPayload),
          null
        );
        setStrategy(fallback);
        setUsedAI(false);
        setGenerationNote((prev) => prev || FALLBACK_NOTE);
        logAction({
          action: "ai_generation_failed",
          details: `Strategist engine failed. Scaffolding fallback local campaigns.`,
          status: "error",
        });
        if (gJson?.error) {
          setError(
            "Strategy generation used inference mode. " +
              (gJson.error.includes("OPENAI") ? "Add OPENAI_API_KEY for live AI strategist output." : gJson.error)
          );
        }
      }

      setLoadingStep(6);
      setActiveTab("overview"); // reset to dashboard overview on success
    } catch (err) {
      const message =
        err?.message === "Failed to fetch"
          ? "We couldn't reach the server. Check your connection and try again."
          : err?.message || "Something went wrong while building your strategy. Please try again.";

      setError(message);

      try {
        const fallbackScraped = buildFallbackScraped(validUrl);
        setScraped(fallbackScraped);
        setStrategy(buildStrategyOutput(fallbackScraped, buildFallbackCampaigns(fallbackScraped), null));
        setUsedAI(false);
        setGenerationNote(FALLBACK_NOTE);
        setLoadingStep(6);
        setActiveTab("overview");
      } catch {
        setStrategy(null);
        setScraped(null);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleCampaignChange(id, next) {
    setStrategy((prev) =>
      prev
        ? {
            ...prev,
            campaigns: prev.campaigns.map((c) => (c.id === id ? next : c)),
          }
        : prev
    );
  }

  async function handleCampaignAction(id, action) {
    const campaign = strategy?.campaigns?.find((c) => c.id === id);
    if (!campaign) return;
    setBusyMap((m) => ({ ...m, [id]: action }));

    logAction({
      action: "asset_edit_requested",
      details: `Initiated asset refinement (Action: ${action}) for campaign ID: ${id}`,
      status: "info",
    });

    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad: campaign, action, scraped }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");
      handleCampaignChange(id, { ...json.ad, id });
      if (typeof json.usedAI === "boolean") setUsedAI(json.usedAI);
      logAction({
        action: "asset_edit_completed",
        details: `Asset refinement successfully updated in database.`,
        status: "success",
        sql: `UPDATE "ContentAssets" SET "content" = '{...}' WHERE "id" = '${id}'`,
      });
    } catch (err) {
      setError(err.message || "Could not refine this campaign. Please try again.");
    } finally {
      setBusyMap((m) => {
        const n = { ...m };
        delete n[id];
        return n;
      });
    }
  }

  function exportCSV() {
    if (!strategy?.campaigns?.length) return;
    const header = [
      "Campaign Type",
      "Goal",
      "Audience",
      "Positioning",
      "CTA Strategy",
      "Competitive Angle",
      "Why This Works",
      "Psychology",
      "Tone",
      "Suggested Visual Direction",
      "Headline",
      "Primary Text",
      "Short Caption",
      "CTA Button",
    ];
    const rows = strategy.campaigns.map((c) =>
      [
        c.type,
        c.goal,
        c.audience,
        c.positioning,
        c.ctaStrategy,
        c.competitiveAngle,
        c.whyThisWorks,
        c.psychology,
        c.tone,
        c.suggestedVisualDirection,
        c.headline,
        c.primaryText,
        c.shortCaption,
        c.ctaButton,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = "\uFEFF" + [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-marketing-strategy-export.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const showResults = !loading && strategy;

  // View state: before scrape
  if (!showResults && !loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <MarketingWebsite
          onGenerate={handleGenerate}
          currentRole={currentRole}
          logAction={logAction}
        />
        <SiteFooter />
      </div>
    );
  }

  // View state: loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-white justify-center items-center">
        <div className="max-w-md w-full px-6 text-center space-y-6">
          <div className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto" />
          <LoadingAnimation step={loadingStep} />
          {error && (
            <div className="text-rose-400 text-xs border border-rose-950 bg-rose-950/20 p-3 rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  // View state: active studio dashboard
  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-800">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentRole={currentRole} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Minimal header for studio workspace */}
        <header className="h-16 border-b border-slate-200 bg-white/70 backdrop-blur px-8 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-600 border">
              Tenant: {currentOrg.name} ({currentOrg.plan.toUpperCase()})
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-violet-100 text-violet-850 border">
              Role preview: {currentRole.replace("_", " ")}
            </span>
          </div>
          <button
            onClick={() => {
              setStrategy(null);
              setScraped(null);
              setActiveTab("overview");
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 border px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 transition"
          >
            Scrape Another Site
          </button>
        </header>

        {/* Tab content panel */}
        <main className="flex-1 p-8 max-w-6xl w-full mx-auto space-y-8">
          
          {activeTab === "overview" && (
            <div className="space-y-8">
              <CustomerWorkspace strategy={strategy} onNavigate={setActiveTab} currentRole={currentRole} logAction={logAction} />
              
              <RbacSwitcher
                currentOrg={currentOrg}
                setCurrentOrg={setCurrentOrg}
                currentRole={currentRole}
                setCurrentRole={setCurrentRole}
                logAction={logAction}
              />
              
              <ApiTerminal logs={logs} onClear={() => setLogs([])} />
            </div>
          )}

          {activeTab === "brand" && (
            <div className="space-y-8 animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Brand Intelligence Engine</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Extracted target customer personas, competitive brand positioning, tone, and recommendations.
                </p>
              </div>
              <BrandIntelligencePanel
                intel={strategy.brandIntelligence}
                onChange={(nextIntel) => {
                  setStrategy((prev) => ({ ...prev, brandIntelligence: nextIntel }));
                  logAction({
                    action: "brand_profile_updated",
                    details: `Guidelines modified for brandId: ${strategy.brandIntelligence.businessName || "Acme"}. Updated tagline and positioning pillars.`,
                    status: "info",
                    sql: `UPDATE "Brands" SET "tagline" = '${nextIntel.tagline || ""}', "audience" = '${nextIntel.audience || ""}' WHERE "id" = 'brand_1'`,
                  });
                }}
              />
              <ExtractedInsightsPanel extracted={strategy.extractedContent} partialNote={generationNote} />
            </div>
          )}

          {activeTab === "campaigns" && (
            <div className="animate-fade-in">
              <CampaignBuilderWorkspace
                strategy={strategy}
                onNavigate={setActiveTab}
                currentRole={currentRole}
                logAction={logAction}
              />
            </div>
          )}

          {activeTab === "blog" && (
            <BlogGenerator strategy={strategy} currentRole={currentRole} />
          )}

          {activeTab === "copy" && (
            <CopySocialStudio strategy={strategy} currentRole={currentRole} />
          )}

          {activeTab === "landing" && (
            <LandingPageBuilder strategy={strategy} currentRole={currentRole} />
          )}

          {activeTab === "seo" && (
            <SeoBibleWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "analytics" && (
            <AnalyticsBibleWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "crm" && (
            <CrmBibleWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "qa" && (
            <QaBibleWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "deployment" && (
            <DeploymentBibleWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "jira" && (
            <JiraRoadmapWorkspace currentRole={currentRole} logAction={logAction} />
          )}

          {activeTab === "pricing" && (
            <div className="space-y-8">
              <BillingDashboard
                currentOrg={currentOrg}
                currentRole={currentRole}
                logAction={logAction}
              />
              <ApiTerminal logs={logs} onClear={() => setLogs([])} />
            </div>
          )}

          {activeTab === "admin" && (
            <div className="space-y-8">
              <AdminPortal
                currentRole={currentRole}
                logAction={logAction}
              />
              <ApiTerminal logs={logs} onClear={() => setLogs([])} />
            </div>
          )}

          {activeTab === "agency" && (
            <div className="space-y-8">
              <AgencyPortal
                currentRole={currentRole}
                logAction={logAction}
              />
              <ApiTerminal logs={logs} onClear={() => setLogs([])} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function buildFallbackScraped(rawUrl) {
  const normalized = ensureUrl(rawUrl) || rawUrl;
  let host = "your-site.com";
  try {
    host = new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    /* keep default */
  }
  const name = host.split(".")[0] || "your brand";
  return {
    url: normalized,
    siteName: name,
    title: `${name} | Strategic brand presence`,
    description: "Brand signals inferred from URL to continue strategy building.",
    heroHeadline: "",
    headings: [],
    paragraphs: [],
    heroSectionSummaries: [],
    featureSectionSummaries: [],
    benefits: [],
    featureBullets: [],
    testimonials: [],
    offersOrPricing: [],
    trustSignals: [],
    ctaSnippets: [],
    productNames: [],
    subheadings: [],
    serviceDescriptions: [],
  };
}
