"use client";
import { useState } from "react";
import Header from "@/components/Header";
import UrlInput from "@/components/UrlInput";
import LoadingAnimation from "@/components/LoadingAnimation";
import BrandIntelligencePanel from "@/components/BrandIntelligencePanel";
import ExtractedInsightsPanel from "@/components/ExtractedInsightsPanel";
import CampaignGrid from "@/components/CampaignGrid";
import SiteFooter from "@/components/SiteFooter";
import { LandingTrustSections } from "@/components/LandingSections";
import { buildStrategyOutput } from "@/lib/strategy";
import { buildFallbackCampaigns } from "@/lib/campaignLocal";
import { ensureUrl } from "@/lib/utils";

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
      } else {
        scrapedPayload = buildFallbackScraped(validUrl);
        setGenerationNote(FALLBACK_NOTE);
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
      } else {
        const fallback = buildStrategyOutput(
          scrapedPayload,
          buildFallbackCampaigns(scrapedPayload),
          null
        );
        setStrategy(fallback);
        setUsedAI(false);
        setGenerationNote((prev) => prev || FALLBACK_NOTE);
        if (gJson?.error) {
          setError(
            "Strategy generation used inference mode. " +
              (gJson.error.includes("OPENAI") ? "Add OPENAI_API_KEY for live AI strategist output." : gJson.error)
          );
        }
      }

      setLoadingStep(6);
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
  const brandIntel = strategy?.brandIntelligence;
  const extracted = strategy?.extractedContent;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <Header usedAI={usedAI} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <UrlInput onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div
            className="max-w-3xl mx-auto mt-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm flex items-start justify-between gap-3"
            role="alert"
          >
            <span>{error}</span>
            {strategy && (
              <button
                type="button"
                className="shrink-0 text-xs font-semibold underline hover:no-underline"
                onClick={() => setError("")}
              >
                Dismiss
              </button>
            )}
          </div>
        )}

        {loading && <LoadingAnimation step={loadingStep} />}

        {(loading || showResults) && brandIntel && (
          <BrandIntelligencePanel intel={brandIntel} phase={loading ? "building" : "complete"} />
        )}

        {(loading || showResults) && extracted && (
          <ExtractedInsightsPanel extracted={extracted} partialNote={loading ? null : generationNote} />
        )}

        {showResults && (
          <CampaignGrid
            campaigns={strategy.campaigns}
            generationNote={generationNote}
            onChange={handleCampaignChange}
            onAction={handleCampaignAction}
            busyMap={busyMap}
            onExport={exportCSV}
          />
        )}

        {!loading && !strategy && <LandingTrustSections />}
      </main>

      <SiteFooter />
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
