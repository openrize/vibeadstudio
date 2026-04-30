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
  const toneRef = useRef(null);

  useEffect(() => {
    function onDoc(e) {
      if (toneRef.current && !toneRef.current.contains(e.target)) setOpenTone(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function update(field, value) {
    onChange({ ...ad, [field]: value });
  }

  const scoreColor =
    ad.score >= 95
      ? "text-emerald-600"
      : ad.score >= 88
      ? "text-brand-600"
      : "text-amber-600";

  const ringColor =
    ad.score >= 95
      ? "stroke-emerald-500"
      : ad.score >= 88
      ? "stroke-brand-500"
      : "stroke-amber-500";

  return (
    <article
      className={`card overflow-hidden flex flex-col animate-pop p-0 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition rounded-2xl ${
        busy ? "opacity-70 animate-pulse" : ""
      } ${isComparing ? "ring-2 ring-indigo-300" : ""} ${
        isWinner ? "ring-2 ring-emerald-300" : ""
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative h-44 bg-ink-100 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image || "/placeholder-ad.svg"}
          alt=""
          className="rounded-xl mb-3 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`tone-tag ${TONE_STYLES[ad.tone] || TONE_STYLES.Minimal}`}>
            {ad.tone || "Tone"}
          </span>
          <button
            type="button"
            onClick={onToggleFavorite}
            className={`h-7 w-7 rounded-full border flex items-center justify-center ${
              isFavorite
                ? "bg-amber-50 border-amber-200 text-amber-600"
                : "bg-white/90 border-white text-ink-600"
            }`}
            aria-label="Toggle favorite"
          >
            <IconStar />
          </button>
        </div>
        <div className="absolute top-3 right-3">
          <ScoreBadge score={ad.score} ringColor={ringColor} scoreColor={scoreColor} />
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex-1 flex flex-col gap-4">
        <span className="text-green-600 text-sm font-semibold">
          Score: {ad.score}/100
        </span>
        <label className="inline-flex items-center gap-2 text-xs text-ink-600">
          <input type="checkbox" checked={!!isComparing} onChange={onToggleCompare} />
          Add to A/B compare
        </label>
        <label className="inline-flex items-center gap-2 text-xs text-emerald-700 font-medium">
          <input type="checkbox" checked={!!isWinner} onChange={onToggleWinner} />
          Mark as winner
        </label>
        <Editable
          as="h3"
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
          className="text-sm text-gray-600 leading-relaxed editable px-1 -mx-1"
          placeholder="Body copy…"
          maxLength={240}
          multiline
        />
        <div className="mt-1 flex items-center justify-between gap-3">
          <Editable
            value={ad.cta}
            onChange={(v) => update("cta", v)}
            className="inline-flex items-center text-[13px] font-medium text-white bg-blue-600 px-3 py-1.5 rounded-lg editable shadow-sm"
            placeholder="CTA"
            maxLength={30}
          />
          <span className="text-xs text-ink-500">Tap to edit</span>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-ink-100 bg-gradient-to-r from-white to-indigo-50/40 px-3 py-3 flex flex-wrap items-center gap-2">
        <ActionButton
          busy={busy === "regenerate"}
          disabled={!!busy}
          onClick={() => onAction("regenerate")}
          icon={<IconRefresh />}
          label="Regenerate"
        />
        <ActionButton
          busy={busy === "shorten"}
          disabled={!!busy}
          onClick={() => onAction("shorten")}
          icon={<IconScissors />}
          label="Shorten"
        />
        <ActionButton
          busy={busy === "bolder"}
          disabled={!!busy}
          onClick={() => onAction("bolder")}
          icon={<IconBold />}
          label="Make Bold"
        />

        <div className="relative ml-auto" ref={toneRef}>
          <button
            type="button"
            onClick={() => setOpenTone((o) => !o)}
            className="btn-ghost"
            disabled={!!busy}
          >
            <IconWand />
            <span>Change tone</span>
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
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm hover:bg-ink-100 ${
                    t === ad.tone ? "bg-ink-100/60 font-medium" : ""
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ActionButton({ onClick, icon, label, busy, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-ghost hover:scale-[1.02] active:scale-[0.98]"
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

/* ----------------- icons ----------------- */
function IconRefresh() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M21 12a9 9 0 1 1-3-6.7M21 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconScissors() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9 8 L20 19 M9 16 L20 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBold() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
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
