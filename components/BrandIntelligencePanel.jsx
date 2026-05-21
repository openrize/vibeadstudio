"use client";

export default function BrandIntelligencePanel({ intel, phase = "complete" }) {
  if (!intel) return null;
  const building = phase === "building";
  const trustSignals = Array.isArray(intel.trustSignals) ? intel.trustSignals : [];

  const fields = [
    { label: "Industry", value: intel.industry },
    { label: "Audience", value: intel.audience },
    { label: "Positioning", value: intel.positioning },
    { label: "Brand Personality", value: intel.brandPersonality },
    { label: "Emotional Tone", value: intel.emotionalTone },
    { label: "Pricing Style", value: intel.pricingStyle },
    { label: "Core Offer", value: intel.coreOffer },
  ];

  return (
    <section className="max-w-6xl mx-auto mt-10 animate-pop">
      <div className="rounded-2xl border border-violet-100/80 bg-white/95 backdrop-blur-md shadow-xl overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-violet-100/60 bg-gradient-to-r from-violet-600/10 via-indigo-50/80 to-fuchsia-50/60">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M12 3v4M12 17v4M4 12h4M16 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            <div>
              <h2 className="text-xl font-bold text-ink-900 tracking-tight">AI Brand Intelligence Engine</h2>
              <p className="text-sm text-ink-600 mt-0.5">
                {building
                  ? "Analyzing brand signals before campaign strategies are composed…"
                  : "Deep business readout — audience, positioning, trust, and strategic direction."}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <InsightCard key={f.label} label={f.label} value={f.value} />
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Trust Signals</div>
            <div className="flex flex-wrap gap-2">
              {trustSignals.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white border border-emerald-100 text-emerald-900"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-800 mb-2">
              Recommended Campaign Direction
            </div>
            <p className="text-sm text-ink-800 leading-relaxed">{intel.recommendedCampaignDirection}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightCard({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-ink-50/40 p-4 hover:border-violet-200/80 transition-colors">
      <div className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{label}</div>
      <p className="text-sm font-semibold text-ink-900 mt-1.5 leading-relaxed">{value || "—"}</p>
    </div>
  );
}
