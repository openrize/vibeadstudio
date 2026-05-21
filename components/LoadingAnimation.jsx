"use client";
import { useEffect, useState } from "react";

const STAGES = [
  "Analyzing brand…",
  "Detecting audience…",
  "Extracting trust signals…",
  "Mapping positioning…",
  "Building campaign strategies…",
  "Optimizing messaging…",
  "Finalizing creative direction…",
];

/** @param {{ step?: number }} props — 0–6 synced to scrape/generate pipeline */
export default function LoadingAnimation({ step = 0 }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    setAnimated(0);
  }, [step]);

  useEffect(() => {
    const id = setInterval(() => setAnimated((a) => (a < step ? step : a < STAGES.length - 1 ? a + 1 : a)), 850);
    return () => clearInterval(id);
  }, [step]);

  const active = Math.max(animated, Math.min(step, STAGES.length - 1));
  const progress = ((active + 1) / STAGES.length) * 100;

  return (
    <section className="max-w-3xl mx-auto mt-10 animate-pop">
      <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative h-14 w-14 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-500 animate-pulse-soft" />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg className="h-7 w-7 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-violet-700">AI Marketing Strategist</div>
            <div className="text-lg font-bold text-ink-900 mt-0.5">{STAGES[active]}</div>
            <div className="text-sm text-ink-500">Building your full-funnel campaign system</div>
          </div>
        </div>

        <div className="h-2 rounded-full bg-ink-100 overflow-hidden mb-6">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-indigo-500 to-fuchsia-500 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="space-y-2">
          {STAGES.map((label, i) => {
            const done = i < active;
            const current = i === active;
            return (
              <li
                key={label}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all ${
                  current
                    ? "bg-violet-50 border border-violet-100 text-violet-900 font-semibold"
                    : done
                      ? "text-ink-700"
                      : "text-ink-400"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                    done
                      ? "bg-emerald-500 text-white"
                      : current
                        ? "bg-violet-600 text-white animate-pulse"
                        : "bg-ink-100 text-ink-400"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
