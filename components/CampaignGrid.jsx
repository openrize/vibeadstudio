"use client";
import CampaignCard from "./CampaignCard";

export default function CampaignGrid({
  campaigns,
  generationNote,
  onChange,
  onAction,
  busyMap,
  onExport,
}) {
  if (!campaigns?.length) return null;

  return (
    <section className="mt-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight">Strategic Campaign System</h2>
          <p className="text-sm sm:text-base text-ink-600 mt-2 leading-relaxed">
            Six full-funnel campaign strategies built from the brand&apos;s audience, positioning, trust signals,
            offer structure, and campaign goals.
          </p>
          {generationNote && (
            <p className="text-sm text-violet-800 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 mt-3">
              {generationNote}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onExport}
          className="self-start inline-flex items-center rounded-xl border border-ink-200 bg-ink-900 text-white px-4 py-2.5 text-sm font-semibold hover:bg-ink-800 transition active:scale-[0.98]"
        >
          Export strategy (CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {campaigns.map((campaign, i) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            index={i}
            busy={busyMap?.[campaign.id]}
            onChange={(next) => onChange(campaign.id, next)}
            onAction={(action) => onAction(campaign.id, action)}
          />
        ))}
      </div>
    </section>
  );
}
