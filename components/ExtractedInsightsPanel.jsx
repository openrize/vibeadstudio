"use client";

const SECTIONS = [
  { key: "heroMessaging", label: "Hero Messaging" },
  { key: "productsServices", label: "Products / Services" },
  { key: "testimonials", label: "Testimonials" },
  { key: "pricing", label: "Pricing" },
  { key: "offers", label: "Offers" },
  { key: "featureBlocks", label: "Feature Blocks" },
  { key: "trustSignals", label: "Trust Signals" },
  { key: "ctaSections", label: "CTA Sections" },
];

export default function ExtractedInsightsPanel({ extracted, partialNote }) {
  if (!extracted) return null;

  return (
    <section className="max-w-6xl mx-auto mt-8 animate-pop">
      <div className="rounded-2xl border border-ink-100 bg-white shadow-lg overflow-hidden">
        <div className="px-6 sm:px-8 py-4 border-b border-ink-100 bg-ink-50/50">
          <h2 className="text-lg font-bold text-ink-900">Extracted Website Insights</h2>
          <p className="text-sm text-ink-600 mt-1">
            Signals pulled from the live page to ground every campaign strategy.
          </p>
          {partialNote && (
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
              {partialNote}
            </p>
          )}
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {SECTIONS.map(({ key, label }) => {
            const items = Array.isArray(extracted[key]) ? extracted[key] : [];
            return (
              <div key={key} className="rounded-xl border border-ink-100 p-4 bg-white">
                <div className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">{label}</div>
                {items.length ? (
                  <ul className="space-y-2">
                    {items.slice(0, 4).map((item, i) => (
                      <li key={`${key}-${i}`} className="text-sm text-ink-800 leading-snug flex gap-2">
                        <span className="text-violet-400 shrink-0">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-ink-500 italic">Inferred from brand category and available signals.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
