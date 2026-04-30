"use client";
import { useState } from "react";

const SAMPLES = [
  "https://stripe.com",
  "https://linear.app",
  "https://vercel.com",
  "https://notion.so",
];

export default function UrlInput({ onGenerate, loading, disabled }) {
  const [url, setUrl] = useState("");

  function submit(e) {
    e?.preventDefault?.();
    if (!url.trim() || loading) return;
    onGenerate(url.trim());
  }

  return (
    <section className="w-full">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-ink-100 px-3 py-1 text-xs text-ink-600 shadow-soft animate-pop">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
          New — generate ads from any URL
        </div>

        <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold tracking-tight">
          Turn any website into{" "}
          <span className="gradient-text">scroll-stopping ads</span>
        </h1>
        <p className="mt-4 text-ink-600 text-base sm:text-lg max-w-2xl mx-auto">
          Paste a URL. We&apos;ll read the page and generate on-brand ad creatives
          you can edit, regenerate, and ship — in seconds.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto mt-8 card p-2 sm:p-2.5 flex flex-col sm:flex-row gap-2 sm:items-center"
      >
        <div className="flex items-center gap-2 flex-1 px-3">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-ink-400 shrink-0"
            fill="none"
          >
            <path
              d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="url"
            inputMode="url"
            placeholder="https://your-website.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={disabled || loading}
            className="flex-1 bg-transparent py-3 text-[15px] outline-none placeholder:text-ink-400"
          />
        </div>
        <button
          type="submit"
          disabled={disabled || loading || !url.trim()}
          className="btn-primary px-5 py-3 text-[15px] sm:w-auto w-full"
        >
          {loading ? (
            <>
              <Spinner /> Generating…
            </>
          ) : (
            <>
              <Spark /> Generate Ads
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
            onClick={() => setUrl(s)}
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
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
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
