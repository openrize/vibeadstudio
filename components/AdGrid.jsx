"use client";
import AdCard from "./AdCard";

export default function AdGrid({
  ads,
  productName,
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
      <div className="flex items-end justify-between mb-5 px-1">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Generated ads</h2>
          <p className="text-sm text-ink-500">
            Click any text to edit. Use the actions below each card to refine.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Detected: {productName}
          </p>
        </div>
        <span className="text-xs text-ink-600 font-medium px-2.5 py-1 rounded-full bg-white border border-ink-100">
          {ads.length} variants
        </span>
      </div>
      <div className="mb-4 flex items-center gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
          A/B compare: {compareIds.length}/2 selected
        </span>
        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
          Winners: {winnerIds.length}
        </span>
        <button type="button" className="btn-ghost" onClick={onSaveWinners}>
          Save Winners
        </button>
        <button
          type="button"
          className="border px-4 py-2 rounded-lg text-sm bg-white hover:bg-gray-50 transition-colors"
          onClick={onExportAds}
        >
          Export Ads
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
