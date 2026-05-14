"use client";

/**
 * @param {{ phase?: "building" | "complete" }} props
 * phase=building while campaigns are still generating (shows strategist framing).
 */
export default function BrandIntelligencePanel({ intel, phase = "complete" }) {
  if (!intel) return null;
  const building = phase === "building";
  return (
    <section className="max-w-6xl mx-auto mt-8 animate-pop">
      <div className="rounded-2xl border border-ink-100 bg-white/90 backdrop-blur-sm shadow-soft overflow-hidden">
        <div className="px-5 sm:px-7 py-4 border-b border-ink-100 bg-gradient-to-r from-brand-50/80 via-white to-accent-50/60">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-600">
            AI brand analysis
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            {building
              ? "Industry engine locked in from page signals—campaign deck is being composed."
              : "How we read this business before composing strategic campaigns (not ad templates)."}
          </p>
        </div>
        <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
          <IntelBlock label="Detected industry" value={intel.detectedIndustry} accent="from-violet-500 to-fuchsia-500" />
          <IntelBlock label="Detected audience" value={intel.targetAudience} accent="from-emerald-500 to-teal-500" />
          <IntelBlock label="Detected tone" value={intel.toneDirection} accent="from-brand-500 to-accent-500" />
          <IntelBlock label="Positioning read" value={intel.positioningHint || "—"} accent="from-amber-500 to-orange-500" />
          <div className="md:col-span-2 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-1">
              Suggested campaign direction
            </div>
            <p className="text-sm text-ink-800 leading-relaxed">
              {intel.suggestedCampaignDirection || intel.recommendedCampaignDirection}
            </p>
            <p className="text-xs text-ink-500 mt-2">Model confidence: {intel.confidence}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntelBlock({ label, value, accent }) {
  return (
    <div className="rounded-xl border border-ink-100 p-4 bg-white shadow-sm">
      <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${accent} mb-3`} />
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</div>
      <div className="text-base font-semibold text-ink-900 mt-1">{value}</div>
    </div>
  );
}
