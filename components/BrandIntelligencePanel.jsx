"use client";

/**
 * @param {{ phase?: "building" | "complete" }} props
 * phase=building while campaigns are still generating (shows strategist framing).
 */
export default function BrandIntelligencePanel({ intel, phase = "complete" }) {
  if (!intel) return null;
  const building = phase === "building";
  const benefits = Array.isArray(intel.benefitsSummary) ? intel.benefitsSummary : [];
  const ctas = Array.isArray(intel.suggestedCtas) ? intel.suggestedCtas : [];

  const compliance = [
    "No fake testimonials — we do not fabricate quotes or customer names.",
    "No incorrect pricing — offers and numbers must match your live page or your manual edits.",
    "No invented claims — statistics, awards, guarantees, and certifications must appear in source signals or your edits.",
  ];

  return (
    <section className="max-w-6xl mx-auto mt-8 animate-pop">
      <div className="rounded-2xl border border-ink-100 bg-white/90 backdrop-blur-sm shadow-soft overflow-hidden">
        <div className="px-5 sm:px-7 py-4 border-b border-ink-100 bg-gradient-to-r from-brand-50/80 via-white to-accent-50/60">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-600">
            Business & brand readout
          </h2>
          <p className="text-xs text-ink-500 mt-1">
            {building
              ? "Locked from page signals—full campaign deck is being composed."
              : "Structured context we use before writing campaigns. Review every field before external use."}
          </p>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          <div className="rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-800/90">Business name</div>
            <div className="text-lg font-bold text-ink-900 mt-0.5">{intel.businessName || "—"}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <IntelBlock label="Main service / product line" value={intel.mainServiceProduct || "—"} accent="from-violet-500 to-fuchsia-500" />
            <IntelBlock label="Detected industry" value={intel.detectedIndustry} accent="from-slate-600 to-slate-400" />
            <IntelBlock label="Target audience" value={intel.targetAudience} accent="from-emerald-500 to-teal-500" />
            <IntelBlock label="Tone of the brand" value={intel.toneDirection} accent="from-brand-500 to-accent-500" />
            <IntelBlock label="Positioning read" value={intel.positioningHint || "—"} accent="from-amber-500 to-orange-500" />
            <IntelBlock
              label="Correct CTA posture (from playbook)"
              value={ctas.length ? ctas.join(" · ") : "—"}
              accent="from-cyan-500 to-blue-500"
            />
          </div>

          <div className="rounded-xl border border-ink-100 bg-ink-50/50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">Benefits observed on page</div>
            {benefits.length ? (
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-ink-800">
                {benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-600">No explicit benefit bullets were extracted—lean on positioning and industry defaults.</p>
            )}
            {intel.audiencePlaybookNote && intel.audiencePlaybookNote !== intel.targetAudience && (
              <p className="text-xs text-ink-500 mt-3">
                Industry playbook default audience (for reference): {intel.audiencePlaybookNote}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-900/80 mb-2">Production guardrails</div>
            <ul className="space-y-2 text-sm text-emerald-950/90">
              {compliance.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-emerald-600 font-bold shrink-0" aria-hidden>
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-1">Suggested campaign direction</div>
            <p className="text-sm text-ink-800 leading-relaxed">
              {intel.suggestedCampaignDirection || intel.recommendedCampaignDirection}
            </p>
            <p className="text-xs text-ink-500 mt-2">Signal confidence: {intel.confidence}</p>
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
      <div className="text-sm font-semibold text-ink-900 mt-1 leading-snug">{value}</div>
    </div>
  );
}
