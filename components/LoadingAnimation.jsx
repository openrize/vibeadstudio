"use client";
import { useEffect, useState } from "react";

const STAGES = [
  { label: "Analyzing website...", detail: "Extracting key messaging and context" },
  { label: "Understanding product...", detail: "Learning offer, audience, and value" },
  {
    label: "Generating high-converting ads...",
    detail: "Creating hooks, body copy, and CTA variants",
  },
];

export default function LoadingAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1300);
    return () => clearInterval(id);
  }, []);

  const idx = tick % STAGES.length;

  return (
    <section className="max-w-3xl mx-auto mt-10 animate-pop">
      <div className="card p-6 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-12 shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 opacity-90 animate-floaty" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30" />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <svg className="h-6 w-6 animate-spin-slow" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-ink-500">Working on it</div>
            <div className="text-lg font-semibold text-ink-900">
              {STAGES[idx]?.label}
            </div>
            <div className="text-sm text-ink-500">{STAGES[idx]?.detail}</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="h-2 w-full bg-ink-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 bg-[length:200%_100%] animate-gradient transition-all duration-700"
              style={{ width: `${((idx + 1) / STAGES.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-500">
            {STAGES.map((s, i) => (
              <span
                key={s.label}
                className={i <= idx ? "text-ink-700 font-medium" : ""}
              >
                {s.label.replace("…", "")}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-ink-100 bg-white overflow-hidden"
            >
              <div className="h-28 bg-ink-100 relative overflow-hidden">
                <div className="absolute inset-0 shimmer" />
              </div>
              <div className="p-4 space-y-2">
                <div className="h-3 w-3/4 bg-ink-100 rounded relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-3 w-full bg-ink-100 rounded relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
                <div className="h-3 w-5/6 bg-ink-100 rounded relative overflow-hidden">
                  <div className="absolute inset-0 shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
