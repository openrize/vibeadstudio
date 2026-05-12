"use client";
import { useEffect, useRef, useState } from "react";

const TONES = [
  "Bold",
  "Friendly",
  "Playful",
  "Premium",
  "Minimal",
  "Urgent",
  "Inspiring",
];
const QUICK_TONES = ["Bold", "Premium", "Playful"];

const TONE_STYLES = {
  Bold: "bg-rose-50 text-rose-700 border border-rose-200",
  Friendly: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Playful: "bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200",
  Premium: "bg-ink-900 text-white border border-ink-900",
  Minimal: "bg-ink-100 text-ink-700 border border-ink-200",
  Urgent: "bg-amber-50 text-amber-700 border border-amber-200",
  Inspiring: "bg-brand-50 text-brand-700 border border-brand-200",
};

export default function AdCard({
  ad,
  index,
  onChange,
  onAction,
  busy,
  isComparing,
  isWinner,
  isFavorite,
  onToggleCompare,
  onToggleWinner,
  onToggleFavorite,
}) {
  const [openTone, setOpenTone] = useState(false);
  const [flash, setFlash] = useState(false);
  const [copying, setCopying] = useState(false);
  const toneRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (toneRef.current && !toneRef.current.contains(e.target)) setOpenTone(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    setFlash(true);
    const id = setTimeout(() => setFlash(false), 400);
    return () => clearTimeout(id);
  }, [ad.headline, ad.body, ad.cta, ad.tone, ad.score, ad.image, ad.campaignName]);

  function update(field, value) {
    onChange({ ...ad, [field]: value });
  }

  async function handleCopy() {
    try {
      setCopying(true);
      const lines = [
        `Campaign: ${ad.campaignName || "Concept"}`,
        `Type: ${ad.campaignTypeLabel || ""}`,
        `Goal: ${ad.goal || ""}`,
        `Audience: ${ad.audience || ""}`,
        `Headline: ${ad.headline}`,
        `Body: ${ad.body}`,
        `CTA: ${ad.cta}`,
        `Score: ${ad.score}/100`,
        `Strategic label: ${ad.strategicLabel || ""}`,
        `Reasoning: ${ad.reasoning || ""}`,
        `Why this works: ${ad.whyThisWorks || ""}`,
      ];
      await navigator.clipboard.writeText(lines.join("\n"));
    } finally {
      setTimeout(() => setCopying(false), 900);
    }
  }

  const scoreColor =
    ad.score >= 95 ? "text-emerald-600" : ad.score >= 88 ? "text-brand-600" : "text-amber-600";
  const ringColor =
    ad.score >= 95 ? "stroke-emerald-500" : ad.score >= 88 ? "stroke-brand-500" : "stroke-amber-500";

  const layoutVariant = index % 2 === 0 ? "border-l-4 border-l-violet-400" : "border-l-4 border-l-teal-400";

  return (
    <article
      className={`relative bg-white rounded-2xl shadow-lg border border-ink-100/90 overflow-hidden flex flex-col
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:-translate-y-0.5 hover:border-brand-200/80
        ${busy ? "opacity-85" : ""} ${isComparing ? "ring-2 ring-indigo-300" : ""} ${
        isWinner ? "ring-2 ring-emerald-300" : ""
      } animate-ad-card ${flash ? "ring-2 ring-brand-400/50" : ""} ${layoutVariant}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative h-48 bg-gradient-to-br from-ink-100 to-ink-50 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image || "https://via.placeholder.com/400x200"}
          alt=""
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <span className={`tone-tag ${TONE_STYLES[ad.tone] || TONE_STYLES.Minimal}`}>{ad.tone || "Tone"}</span>
            {ad.strategicLabel && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/95 text-violet-800 border border-violet-100 shadow-sm">
                {ad.strategicLabel}
              </span>
            )}
            {ad.campaignTypeLabel && (
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/90 text-ink-800 border border-white/80 shadow-sm">
                {ad.campaignTypeLabel}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ScoreBadge score={ad.score} ringColor={ringColor} scoreColor={scoreColor} />
            <button
              type="button"
              onClick={onToggleFavorite}
              className={`h-8 w-8 rounded-full border flex items-center justify-center shadow-sm ${
                isFavorite ? "bg-amber-50 border-amber-200 text-amber-600" : "bg-white/95 border-white text-ink-600"
              }`}
              aria-label="Toggle favorite"
            >
              <IconStar />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-3 p-6 sm:p-7">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-ink-900 leading-snug">{ad.campaignName || "Campaign concept"}</h3>
          {ad.marketingAngle && <p className="text-xs text-ink-500 mt-1 font-medium uppercase tracking-wide">{ad.marketingAngle}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-xl bg-ink-50/80 border border-ink-100 px-3 py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Goal</div>
            <p className="text-ink-800 mt-0.5 leading-snug">{ad.goal || "—"}</p>
          </div>
          <div className="rounded-xl bg-ink-50/80 border border-ink-100 px-3 py-2.5">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-500">Audience</div>
            <p className="text-ink-800 mt-0.5 leading-snug">{ad.audience || "—"}</p>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-[11px] text-ink-600">
          <input type="checkbox" checked={!!isComparing} onChange={onToggleCompare} />
          Add to A/B compare
        </label>
        <label className="inline-flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
          <input type="checkbox" checked={!!isWinner} onChange={onToggleWinner} />
          Mark as winner
        </label>

        <Editable
          as="h4"
          value={ad.headline}
          onChange={(v) => update("headline", v)}
          className="text-lg font-semibold leading-snug text-ink-900 editable px-1 -mx-1"
          placeholder="Headline"
          maxLength={80}
        />
        <Editable
          as="p"
          value={ad.body}
          onChange={(v) => update("body", v)}
          className="text-sm text-ink-600 leading-relaxed editable px-1 -mx-1"
          placeholder="Body copy…"
          maxLength={260}
          multiline
        />

        {ad.reasoning && (
          <p className="text-xs text-ink-500 leading-relaxed border-l-2 border-ink-200 pl-3">
            <span className="font-semibold text-ink-700">Strategy: </span>
            {ad.reasoning}
          </p>
        )}

        {ad.whyThisWorks && (
          <div className="rounded-xl bg-gradient-to-br from-brand-50/90 to-accent-50/50 border border-brand-100/80 px-3 py-3">
            <div className="text-[11px] font-bold uppercase tracking-wide text-brand-800">Why this works</div>
            <p className="text-sm text-ink-800 mt-1 leading-relaxed">{ad.whyThisWorks}</p>
          </div>
        )}

        <div className="mt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-lg
              bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600
              hover:brightness-110 hover:shadow-xl hover:scale-[1.02] active:scale-[0.97]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 transition-all"
          >
            {ad.cta}
          </button>
          <span className="text-[11px] text-ink-500">Editable headline & body</span>
        </div>
      </div>

      <div className="border-t border-ink-100 bg-gradient-to-r from-white via-indigo-50/30 to-white px-4 py-4 sm:px-5 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <PrimaryActionButton busy={false} disabled={!!busy} onClick={handleCopy} icon={<IconCopy />} label={copying ? "Copied" : "Copy"} />
          <PrimaryActionButton
            busy={busy === "regenerate"}
            disabled={!!busy}
            onClick={() => onAction("regenerate")}
            icon={<IconRefresh />}
            label="Regenerate"
          />
          <ActionButton busy={busy === "similar"} disabled={!!busy} onClick={() => onAction("similar")} icon={<IconLayers />} label="Similar" />
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton busy={busy === "shorten"} disabled={!!busy} onClick={() => onAction("shorten")} icon={<IconScissors />} label="Shorten" />
          <ActionButton busy={busy === "bolder"} disabled={!!busy} onClick={() => onAction("bolder")} icon={<IconBold />} label="Bolder" />
          <ActionButton
            busy={busy === "more_aggressive"}
            disabled={!!busy}
            onClick={() => onAction("more_aggressive")}
            icon={<IconZap />}
            label="More aggressive"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <ActionButton
            busy={busy === "more_premium"}
            disabled={!!busy}
            onClick={() => onAction("more_premium")}
            icon={<IconCrown />}
            label="More premium"
          />
          <ActionButton
            busy={busy === "more_conversion"}
            disabled={!!busy}
            onClick={() => onAction("more_conversion")}
            icon={<IconTarget />}
            label="More conversion"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK_TONES.map((tone) => (
            <button
              key={tone}
              type="button"
              disabled={!!busy}
              onClick={() => onAction("tone", tone)}
              className={`px-3 py-1.5 rounded-lg text-xs border transition-all duration-150 active:scale-[0.96] ${
                ad.tone === tone ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
              }`}
            >
              {tone}
            </button>
          ))}
        </div>

        <div className="relative flex justify-end" ref={toneRef}>
          <button type="button" onClick={() => setOpenTone((o) => !o)} className="btn-ghost" disabled={!!busy}>
            <IconWand />
            <span>All tones</span>
          </button>
          {openTone && (
            <div className="absolute right-0 bottom-full mb-2 w-44 rounded-xl border border-ink-100 bg-white shadow-soft p-1 z-20 animate-pop">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setOpenTone(false);
                    onAction("tone", t);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-ink-100 ${t === ad.tone ? "bg-ink-100/60 font-medium" : ""}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {busy && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-ink-700 bg-white border border-ink-200 rounded-lg px-3 py-1.5 shadow-soft">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
              <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            Refining campaign…
          </div>
        </div>
      )}
    </article>
  );
}

function ActionButton({ onClick, icon, label, busy, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-ghost transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.96] text-xs"
    >
      {busy ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
}

function PrimaryActionButton({ onClick, icon, label, busy, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-800 transition-all duration-150 hover:bg-indigo-100 active:scale-[0.97] disabled:opacity-60"
    >
      {busy ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        icon
      )}
      <span>{label}</span>
    </button>
  );
}

function ScoreBadge({ score, ringColor, scoreColor }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  return (
    <div className="relative h-12 w-12 rounded-full bg-white/95 shadow-soft border border-ink-100 flex items-center justify-center">
      <svg className="absolute inset-0" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r={r} stroke="#e5e7eb" strokeWidth="3" fill="none" />
        <circle
          cx="20"
          cy="20"
          r={r}
          className={ringColor}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform="rotate(-90 20 20)"
        />
      </svg>
      <div className="text-center leading-none">
        <div className={`text-[13px] font-bold ${scoreColor}`}>{score}</div>
        <div className="text-[8px] text-ink-500 uppercase tracking-wider">score</div>
      </div>
    </div>
  );
}

function Editable({ as = "div", value, onChange, className, placeholder, maxLength, multiline }) {
  const Tag = as;
  function onInput(e) {
    let v = e.currentTarget.innerText;
    if (maxLength && v.length > maxLength) {
      v = v.slice(0, maxLength);
      e.currentTarget.innerText = v;
      placeCaretAtEnd(e.currentTarget);
    }
    onChange(v);
  }
  function onKeyDown(e) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  }
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      onKeyDown={onKeyDown}
      data-placeholder={placeholder}
      className={`${className} relative empty:before:content-[attr(data-placeholder)] empty:before:text-ink-400`}
      spellCheck={true}
    >
      {value}
    </Tag>
  );
}

function placeCaretAtEnd(el) {
  el.focus();
  if (typeof window === "undefined") return;
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconScissors() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 8 L20 19 M9 16 L20 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconBold() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
function IconWand() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M4 20 L14 10 M14 4l1.5 3L19 8.5 15.5 10 14 13l-1.5-3L9 8.5 12.5 7z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconStar() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M12 3.8l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.5l5.4-.8z" />
    </svg>
  );
}
function IconCopy() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M12 4L4 8l8 4 8-4-8-4zM4 12l8 4 8-4M4 16l8 4 8-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconZap() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconCrown() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path d="M4 10l4-3 4 3 4-3 4 3v10H4V10z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}
