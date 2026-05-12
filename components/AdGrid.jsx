"use client";
import AdCard from "./AdCard";

export default function AdGrid({
  ads,
  productName,
  generationNote,
  onChange,
  onAction,
  busyMap,
  compareIds = [],
  onToggleCompare,
  winnerIds = [],
  onToggleWinner,
  onSaveWinners,
  onExportAds,
  onToggleFavorite,
  favoriteIds = [],
}) {
  if (!ads?.length) return null;
  return (
    <section className="mt-10">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 px-1">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-ink-900 tracking-tight">Campaign concepts</h2>
          <p className="text-sm text-ink-600 mt-2 leading-relaxed">
            Five strategic angles tailored to{" "}
            <span className="font-semibold text-ink-900">{productName}</span>—each with a different
            structure, CTA, and proof style so outputs diverge meaningfully between URLs.
          </p>
          <p className="text-sm font-medium text-brand-800 mt-2">
            {generationNote || "Grounded in extracted page signals and category playbooks."}
          </p>
          <p className="text-xs text-ink-500 mt-2">
            Click any headline or body to edit inline. Use workflow actions to iterate like a creative
            partner.
          </p>
        </div>
        <span className="text-xs text-ink-600 font-semibold px-3 py-1.5 rounded-full bg-white border border-ink-100 shadow-sm self-start">
          {ads.length} concepts
        </span>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium">
          A/B compare: {compareIds.length}/2
        </span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
          Winners: {winnerIds.length}
        </span>
        <button type="button" className="btn-ghost transition-transform duration-150 active:scale-[0.97]" onClick={onSaveWinners}>
          Save winners
        </button>
        <button
          type="button"
          className="inline-flex items-center rounded-xl border border-ink-200 bg-ink-900 text-white px-4 py-2 text-sm font-semibold hover:bg-ink-800 transition-all active:scale-[0.97]"
          onClick={onExportAds}
        >
          Export campaigns (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-7">
        {ads.map((ad, i) => (
          <AdCard
            key={ad.id}
            ad={ad}
            index={i}
            busy={busyMap?.[ad.id]}
            isComparing={compareIds.includes(ad.id)}
            isWinner={winnerIds.includes(ad.id)}
            isFavorite={favoriteIds.includes(ad.id)}
            onToggleCompare={() => onToggleCompare?.(ad.id)}
            onToggleWinner={() => onToggleWinner?.(ad.id)}
            onToggleFavorite={() => onToggleFavorite?.(ad)}
            onChange={(next) => onChange(ad.id, next)}
            onAction={(action, tone) => onAction(ad.id, action, tone)}
          />
        ))}
      </div>
    </section>
  );
}
