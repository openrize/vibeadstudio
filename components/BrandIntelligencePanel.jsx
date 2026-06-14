"use client";
import { useState } from "react";

export default function BrandIntelligencePanel({ intel, onChange }) {
  const [newSignal, setNewSignal] = useState("");
  const [newProhibited, setNewProhibited] = useState("");
  const [newPillar, setNewPillar] = useState("");

  if (!intel) return null;
  const trustSignals = Array.isArray(intel.trustSignals) ? intel.trustSignals : [];
  const prohibitedWords = Array.isArray(intel.prohibitedWords) 
    ? intel.prohibitedWords 
    : ["cheap", "lowest-cost", "clickbait"];
  const positioningPillars = Array.isArray(intel.positioningPillars)
    ? intel.positioningPillars
    : ["Speed & Velocity", "Consistent Branding", "AI Automation Quality"];

  function updateField(key, val) {
    if (onChange) {
      onChange({
        ...intel,
        [key]: val,
      });
    }
  }

  function addTrustSignal() {
    if (!newSignal.trim()) return;
    const next = [...trustSignals, newSignal.trim()];
    updateField("trustSignals", next);
    setNewSignal("");
  }

  function removeTrustSignal(idx) {
    const next = trustSignals.filter((_, i) => i !== idx);
    updateField("trustSignals", next);
  }

  function addProhibitedWord() {
    if (!newProhibited.trim()) return;
    const next = [...prohibitedWords, newProhibited.trim()];
    updateField("prohibitedWords", next);
    setNewProhibited("");
  }

  function removeProhibitedWord(idx) {
    const next = prohibitedWords.filter((_, i) => i !== idx);
    updateField("prohibitedWords", next);
  }

  function addPillar() {
    if (!newPillar.trim()) return;
    const next = [...positioningPillars, newPillar.trim()];
    updateField("positioningPillars", next);
    setNewPillar("");
  }

  function removePillar(idx) {
    const next = positioningPillars.filter((_, i) => i !== idx);
    updateField("positioningPillars", next);
  }

  const fields = [
    { label: "Business Name", value: intel.businessName || "New Brand", key: "businessName" },
    { label: "Detected Industry", value: intel.industry, key: "industry" },
    { label: "Target Audience", value: intel.audience, key: "audience" },
    { label: "Brand Personality", value: intel.brandPersonality, key: "brandPersonality" },
    { label: "Emotional Tone", value: intel.emotionalTone, key: "emotionalTone" },
    { label: "Pricing Style", value: intel.pricingStyle, key: "pricingStyle" },
    { label: "Core Offer Description", value: intel.coreOffer, key: "coreOffer" },
    { label: "Brand Tagline", value: intel.tagline || "Market smarter, faster, and more profitably using AI.", key: "tagline" },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-violet-600/5 to-indigo-50/50">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-650 text-white shadow-md">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                <path d="M12 3v4M12 17v4M4 12h4M16 12h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Brand Profile & Guidelines Editor</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review and update brand personality, target positioning pillars, and prohibited words.
              </p>
            </div>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5 focus-within:border-violet-300 transition-colors">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{f.label}</label>
                <input
                  type="text"
                  value={f.value || ""}
                  onChange={(e) => updateField(f.key, e.target.value)}
                  className="w-full text-xs font-semibold text-slate-800 bg-transparent border-none outline-none focus:ring-0 p-0"
                />
              </div>
            ))}
          </div>

          {/* Trust Signals */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/20 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Trust Signals & Certifications</div>
            <div className="flex flex-wrap gap-2">
              {trustSignals.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-emerald-100 text-emerald-900"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTrustSignal(idx)}
                    className="text-emerald-500 hover:text-emerald-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSignal}
                placeholder="Add trust signal (e.g. 5-star review, certified)"
                onChange={(e) => setNewSignal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTrustSignal()}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button
                type="button"
                onClick={addTrustSignal}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Positioning Pillars */}
          <div className="rounded-xl border border-violet-100 bg-violet-50/20 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-800">Positioning Pillars</div>
            <div className="flex flex-wrap gap-2">
              {positioningPillars.map((p, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-violet-100 text-violet-900"
                >
                  {p}
                  <button
                    type="button"
                    onClick={() => removePillar(idx)}
                    className="text-violet-500 hover:text-violet-750 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newPillar}
                placeholder="Add brand pillar..."
                onChange={(e) => setNewPillar(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addPillar()}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-violet-400"
              />
              <button
                type="button"
                onClick={addPillar}
                className="bg-violet-600 hover:bg-violet-750 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Prohibited Words */}
          <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-800">Prohibited Words (Off-Brand)</div>
            <div className="flex flex-wrap gap-2">
              {prohibitedWords.map((word, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-rose-100 text-rose-950"
                >
                  {word}
                  <button
                    type="button"
                    onClick={() => removeProhibitedWord(idx)}
                    className="text-rose-500 hover:text-rose-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newProhibited}
                placeholder="Add prohibited word..."
                onChange={(e) => setNewProhibited(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addProhibitedWord()}
                className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none focus:ring-1 focus:ring-rose-400"
              />
              <button
                type="button"
                onClick={addProhibitedWord}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
              >
                Add
              </button>
            </div>
          </div>

          {/* Recommended direction */}
          <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-5 space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Recommended Campaign Direction
            </label>
            <textarea
              value={intel.recommendedCampaignDirection || ""}
              rows={3}
              onChange={(e) => updateField("recommendedCampaignDirection", e.target.value)}
              className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2 focus:ring-1 focus:ring-violet-400 outline-none resize-none bg-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
