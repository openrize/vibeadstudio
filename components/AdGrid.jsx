"use client";
import AdCard from "./AdCard";

export default function AdGrid({ ads, onChange, onAction, busyMap }) {
  if (!ads?.length) return null;
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-semibold text-ink-900">Generated ads</h2>
          <p className="text-sm text-ink-500">
            Click any text to edit. Use the actions below each card to refine.
          </p>
        </div>
        <span className="text-xs text-ink-500">{ads.length} variants</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {ads.map((ad, i) => (
          <AdCard
            key={ad.id}
            ad={ad}
            index={i}
            busy={busyMap?.[ad.id]}
            onChange={(next) => onChange(ad.id, next)}
            onAction={(action, tone) => onAction(ad.id, action, tone)}
          />
        ))}
      </div>
    </section>
  );
}
