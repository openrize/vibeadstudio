"use client";
import { useState } from "react";
import { ensureUrl } from "@/lib/utils";

const SAMPLES = [
  "https://stripe.com",
  "https://linear.app",
  "https://vercel.com",
  "https://glossier.com",
];

const INVALID_URL_MSG =
  "Please enter a valid website URL (e.g. https://yourbrand.com).";

export default function UrlInput({ onGenerate, loading, disabled }) {
  const [url, setUrl] = useState("");
  const [validationError, setValidationError] = useState("");

  function submit(e) {
    e?.preventDefault?.();
    const trimmed = url.trim();
    if (!trimmed || loading) return;

    const valid = ensureUrl(trimmed);
    if (!valid) {
      setValidationError(INVALID_URL_MSG);
      return;
    }

    setValidationError("");
    onGenerate(valid);
  }

  function handleChange(value) {
    setUrl(value);
    if (validationError) setValidationError("");
  }

  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border border-violet-200 bg-violet-50 text-violet-800">
          AI Marketing Strategist · Brand Intelligence Engine
        </span>
        <h1 className="mt-5 text-3xl sm:text-5xl font-extrabold tracking-tight text-ink-900 leading-tight">
          Build a Full AI Marketing Strategy From Any Business Website
        </h1>
        <p className="mt-4 text-base sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
          Enter a website URL and the AI strategist will analyze the brand, audience, positioning, trust
          signals, and campaign direction before generating full-funnel campaign strategies.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto mt-8 card p-2 sm:p-3 flex flex-col sm:flex-row gap-2 sm:items-stretch shadow-xl border-violet-100/60 rounded-2xl"
        noValidate
      >
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-1 px-4 py-2">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-violet-500 shrink-0" fill="none" aria-hidden>
              <path
                d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="url"
              inputMode="url"
              placeholder="https://your-business.com"
              value={url}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled || loading}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? "url-error" : undefined}
              className={`flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-ink-400 ${
                validationError ? "text-rose-900" : ""
              }`}
            />
          </div>
          {validationError && (
            <p id="url-error" className="px-4 pb-2 text-xs text-rose-700 font-medium">
              {validationError}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={disabled || loading || !url.trim()}
          className="btn-primary px-6 py-3.5 text-[15px] sm:w-auto w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 border-0"
        >
          {loading ? (
            <>
              <Spinner /> Building Strategy…
            </>
          ) : (
            <>
              <Spark /> Build Strategy
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-500">
        <span className="text-ink-400">Try:</span>
        {SAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setUrl(s);
              setValidationError("");
            }}
            className="btn-chip"
            disabled={loading}
          >
            {s.replace(/^https?:\/\//, "")}
          </button>
        ))}
      </div>
    </section>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
