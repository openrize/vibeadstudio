"use client";
import { useEffect, useState } from "react";

const SKINS = {
  luxury: {
    shell: "bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/40 border-amber-500/30 text-stone-100",
    accent: "from-amber-400 to-amber-600",
    badge: "bg-amber-500/20 text-amber-100 border-amber-400/40",
    label: "text-amber-200/80",
    body: "text-stone-200",
    strategy: "bg-white/5 border-white/10",
    cta: "bg-amber-500 text-zinc-950 font-bold hover:bg-amber-400",
    bar: "border-amber-500/20 bg-zinc-900/80",
  },
  saas: {
    shell: "bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-cyan-500/30 text-slate-100",
    accent: "from-cyan-400 to-indigo-500",
    badge: "bg-cyan-500/15 text-cyan-100 border-cyan-400/30",
    label: "text-cyan-200/70",
    body: "text-slate-300",
    strategy: "bg-white/5 border-cyan-500/15",
    cta: "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold",
    bar: "border-cyan-500/20 bg-slate-900/80",
  },
  fitness: {
    shell: "bg-gradient-to-br from-zinc-900 via-rose-950 to-orange-950 border-orange-500/40 text-white",
    accent: "from-orange-500 to-rose-600",
    badge: "bg-orange-500/20 text-orange-100 border-orange-400/40",
    label: "text-orange-200/80",
    body: "text-orange-50/90",
    strategy: "bg-black/20 border-orange-500/20",
    cta: "bg-orange-600 text-white font-extrabold hover:bg-orange-500",
    bar: "border-orange-500/30 bg-black/30",
  },
  promotional: {
    shell: "bg-white border-rose-200 ring-2 ring-rose-100 text-ink-900",
    accent: "from-rose-600 to-orange-500",
    badge: "bg-rose-600 text-white border-rose-700",
    label: "text-rose-700",
    body: "text-ink-700",
    strategy: "bg-rose-50 border-rose-100",
    cta: "bg-gradient-to-r from-rose-600 to-orange-500 text-white font-extrabold shadow-lg",
    bar: "border-rose-100 bg-rose-50/50",
  },
  awareness: {
    shell: "bg-gradient-to-br from-stone-50 to-violet-50/30 border-violet-100 text-ink-900",
    accent: "from-violet-500 to-indigo-500",
    badge: "bg-violet-100 text-violet-800 border-violet-200",
    label: "text-ink-500",
    body: "text-ink-700",
    strategy: "bg-white/80 border-ink-100",
    cta: "bg-violet-700 text-white font-semibold hover:bg-violet-800",
    bar: "border-violet-100 bg-white/60",
  },
  conversion: {
    shell: "bg-white border-emerald-200 shadow-lg text-ink-900",
    accent: "from-emerald-500 to-teal-600",
    badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
    label: "text-ink-500",
    body: "text-ink-700",
    strategy: "bg-emerald-50/50 border-emerald-100",
    cta: "bg-emerald-600 text-white font-bold hover:bg-emerald-700",
    bar: "border-emerald-100 bg-emerald-50/30",
  },
  retargeting: {
    shell: "bg-gradient-to-br from-indigo-50 to-sky-50 border-indigo-200 text-ink-900",
    accent: "from-indigo-500 to-sky-500",
    badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
    label: "text-ink-500",
    body: "text-ink-700",
    strategy: "bg-white border-indigo-100",
    cta: "bg-indigo-600 text-white font-semibold",
    bar: "border-indigo-100 bg-white/70",
  },
  emotional: {
    shell: "bg-gradient-to-br from-fuchsia-50 via-rose-50 to-amber-50 border-fuchsia-200 text-ink-900",
    accent: "from-fuchsia-500 to-rose-500",
    badge: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200",
    label: "text-ink-500",
    body: "text-ink-700",
    strategy: "bg-white/70 border-fuchsia-100",
    cta: "bg-fuchsia-700 text-white font-semibold",
    bar: "border-fuchsia-100 bg-white/50",
  },
  authority: {
    shell: "bg-white border-slate-300 shadow-md text-ink-900",
    accent: "from-slate-700 to-slate-900",
    badge: "bg-slate-800 text-white border-slate-700",
    label: "text-slate-500",
    body: "text-slate-700",
    strategy: "bg-slate-50 border-slate-200",
    cta: "bg-slate-900 text-white font-semibold",
    bar: "border-slate-200 bg-slate-50",
  },
};

function skinFor(campaign) {
  return SKINS[campaign.visualMode] || SKINS[campaign.typeId] || SKINS.awareness;
}

const WORKFLOW_ACTIONS = [
  { id: "regenerate_similar", label: "Regenerate Similar" },
  { id: "more_premium", label: "More Premium" },
  { id: "more_emotional", label: "More Emotional" },
  { id: "more_aggressive", label: "More Aggressive" },
  { id: "create_social", label: "Create Social Version" },
  { id: "create_retargeting", label: "Create Retargeting Version" },
];

const STRATEGY_FIELDS = [
  { key: "goal", label: "Goal" },
  { key: "audience", label: "Audience" },
  { key: "positioning", label: "Positioning" },
  { key: "ctaStrategy", label: "CTA Strategy" },
  { key: "competitiveAngle", label: "Competitive Angle" },
  { key: "whyThisWorks", label: "Why This Works" },
  { key: "psychology", label: "Psychology" },
  { key: "tone", label: "Tone" },
];

export default function CampaignCard({ campaign, index, onChange, onAction, busy }) {
  const [flash, setFlash] = useState(false);
  const skin = skinFor(campaign);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [campaign.headline, campaign.primaryText, campaign.type]);

  function update(field, value) {
    onChange({ ...campaign, [field]: value });
  }

  return (
    <article
      className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl ${skin.shell} ${flash ? "ring-2 ring-violet-400/60" : ""} animate-campaign-card`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`h-1.5 w-full bg-gradient-to-r ${skin.accent}`} />

      <div className="p-5 sm:p-6 flex-1 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${skin.badge}`}>
            {campaign.type}
          </span>
          <span className={`text-[10px] font-semibold uppercase ${skin.label}`}>
            {campaign.visualMode?.replace(/_/g, " ") || "strategic"} mode
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STRATEGY_FIELDS.map(({ key, label }) => (
            <div key={key} className={`rounded-lg px-3 py-2.5 border text-xs sm:col-span-2 sm:[&:nth-child(-n+2)]:col-span-1 ${skin.strategy}`}>
              <div className={`font-bold uppercase tracking-wider text-[10px] ${skin.label}`}>{label}</div>
              <p className={`mt-1 leading-snug text-sm ${skin.body}`}>{campaign[key] || "—"}</p>
            </div>
          ))}
        </div>

        <div className={`rounded-xl px-3 py-3 border text-xs ${skin.strategy}`}>
          <div className={`font-bold uppercase tracking-wider text-[10px] ${skin.label}`}>Suggested Visual Direction</div>
          <p className={`mt-1 text-sm leading-relaxed ${skin.body}`}>{campaign.suggestedVisualDirection}</p>
        </div>

        <div className="border-t border-dashed border-current/10 pt-4">
          <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${skin.label}`}>Creative Output</div>

          <Editable
            as="h4"
            value={campaign.headline}
            onChange={(v) => update("headline", v)}
            className={`text-lg font-bold leading-snug editable ${skin.body}`}
            placeholder="Headline"
            maxLength={80}
          />
          <Editable
            as="p"
            value={campaign.primaryText}
            onChange={(v) => update("primaryText", v)}
            className={`text-sm mt-2 leading-relaxed editable ${skin.body}`}
            placeholder="Primary text…"
            maxLength={320}
            multiline
          />
          <Editable
            as="p"
            value={campaign.shortCaption}
            onChange={(v) => update("shortCaption", v)}
            className={`text-xs mt-2 italic editable ${skin.label}`}
            placeholder="Short caption…"
            maxLength={120}
          />
          <div className="mt-4">
            <span className={`inline-flex px-5 py-2.5 rounded-xl text-sm ${skin.cta}`}>{campaign.ctaButton}</span>
          </div>
        </div>

        {campaign.socialVersion && (
          <div className={`rounded-xl border p-4 text-sm ${skin.strategy}`}>
            <div className={`font-bold text-xs uppercase mb-2 ${skin.label}`}>Social Version</div>
            <p className={skin.body}>
              <strong>Hook:</strong> {campaign.socialVersion.hook}
            </p>
            <p className={`mt-2 ${skin.body}`}>
              <strong>Caption:</strong> {campaign.socialVersion.caption}
            </p>
            <p className={`mt-2 ${skin.body}`}>
              <strong>CTA:</strong> {campaign.socialVersion.cta}
            </p>
            {campaign.socialVersion.hashtags?.length > 0 && (
              <p className={`mt-2 text-xs ${skin.label}`}>{campaign.socialVersion.hashtags.join(" ")}</p>
            )}
          </div>
        )}
      </div>

      <div className={`px-4 py-4 border-t flex flex-wrap gap-2 ${skin.bar}`}>
        {WORKFLOW_ACTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            disabled={!!busy}
            onClick={() => onAction(id)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-current/10 bg-white/10 hover:bg-white/20 text-inherit disabled:opacity-50 transition active:scale-[0.97]"
          >
            {busy === id ? "…" : label}
          </button>
        ))}
      </div>

      {busy && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none rounded-2xl">
          <span className="text-sm font-medium bg-white px-3 py-1.5 rounded-lg shadow">Refining strategy…</span>
        </div>
      )}
    </article>
  );
}

function Editable({ as = "div", value, onChange, className, placeholder, maxLength, multiline }) {
  const Tag = as;
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => {
        let v = e.currentTarget.innerText;
        if (maxLength && v.length > maxLength) {
          v = v.slice(0, maxLength);
          e.currentTarget.innerText = v;
        }
        onChange(v);
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
      data-placeholder={placeholder}
      className={`${className} relative empty:before:content-[attr(data-placeholder)] empty:before:opacity-50 outline-none focus:ring-1 focus:ring-violet-400/50 rounded px-1 -mx-1`}
    >
      {value}
    </Tag>
  );
}
