"use client";
import { useState } from "react";
import Header from "@/components/Header";
import UrlInput from "@/components/UrlInput";
import LoadingAnimation from "@/components/LoadingAnimation";
import AdGrid from "@/components/AdGrid";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scraped, setScraped] = useState(null);
  const [ads, setAds] = useState([]);
  const [busyMap, setBusyMap] = useState({});
  const [usedAI, setUsedAI] = useState(false);

  async function handleGenerate(rawUrl) {
    setError("");
    setAds([]);
    setScraped(null);
    setLoading(true);
    try {
      const sRes = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: rawUrl }),
      });
      const sJson = await sRes.json();
      if (!sRes.ok) throw new Error(sJson.error || "Failed to scrape");
      setScraped(sJson.scraped);

      await new Promise((r) => setTimeout(r, 600));

      const gRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scraped: sJson.scraped, count: 4 }),
      });
      const gJson = await gRes.json();
      if (!gRes.ok) throw new Error(gJson.error || "Failed to generate ads");

      await new Promise((r) => setTimeout(r, 500));

      setAds((gJson.ads || []).map(withVisualFallback));
      setUsedAI(!!gJson.usedAI);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleAdChange(id, next) {
    setAds((list) => list.map((a) => (a.id === id ? next : a)));
  }

function withVisualFallback(ad) {
  return {
    ...ad,
    image: ad.image || "/placeholder-ad.svg",
    score:
      typeof ad.score === "number"
        ? ad.score
        : Math.floor(Math.random() * 16) + 80,
  };
}

  async function handleAdAction(id, action, tone) {
    const ad = ads.find((a) => a.id === id);
    if (!ad) return;
    setBusyMap((m) => ({ ...m, [id]: action }));
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ad, action, tone, scraped }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setAds((list) =>
        list.map((a) =>
          a.id === id ? withVisualFallback({ ...json.ad, id }) : a
        )
      );
    } catch (err) {
      setError(err.message || "Edit failed");
    } finally {
      setBusyMap((m) => {
        const n = { ...m };
        delete n[id];
        return n;
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Header usedAI={usedAI} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <UrlInput onGenerate={handleGenerate} loading={loading} />

        {error && (
          <div className="max-w-3xl mx-auto mt-6 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 px-4 py-3 text-sm flex items-start gap-2 animate-pop">
            <svg viewBox="0 0 24 24" className="h-4 w-4 mt-0.5 shrink-0" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
              <path d="M12 8v5M12 16.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <div>{error}</div>
          </div>
        )}

        {loading && <LoadingAnimation />}

        {!loading && scraped && (
          <ScrapedSummary scraped={scraped} />
        )}

        {!loading && ads?.length > 0 && (
          <AdGrid
            ads={ads}
            onChange={handleAdChange}
            onAction={handleAdAction}
            busyMap={busyMap}
          />
        )}

        {!loading && ads.length === 0 && !error && !scraped && (
          <FeatureStrip />
        )}
      </main>

      <footer className="border-t border-ink-100/70 bg-white/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between text-xs text-ink-500">
          <div>© {new Date().getFullYear()} Vibe Ad Studio</div>
          <div className="flex items-center gap-3">
            <span>Built with Next.js · Tailwind · OpenAI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ScrapedSummary({ scraped }) {
  const detectedProduct =
    scraped?.title?.split(/[|\-:]/)[0]?.trim() || scraped?.siteName || "Unknown";

  return (
    <section className="max-w-3xl mx-auto mt-8 card p-6 flex items-center gap-4 animate-pop shadow-lg hover:shadow-xl transition rounded-2xl">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-glow">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M4 7h16M4 12h10M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-600 mb-1">
          Detected: <span className="font-semibold text-ink-900">{detectedProduct}</span>
        </div>
        <div className="text-xs text-ink-500 truncate">{scraped.url}</div>
        <div className="font-semibold text-ink-900 truncate">{scraped.title}</div>
        {scraped.description && (
          <div className="text-sm text-ink-600 line-clamp-2">
            {scraped.description}
          </div>
        )}
      </div>
    </section>
  );
}

function FeatureStrip() {
  const items = [
    {
      title: "Reads any page",
      desc: "We extract the title, meta, and key paragraphs to ground every ad.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      title: "Multiple tones",
      desc: "Bold, friendly, premium, urgent — every variant comes with a different angle.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 15.7 7.1 18.2 8 12.7 4 8.8 9.5 8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      title: "Edit like a doc",
      desc: "Click any line to edit. Regenerate, shorten, or change tone in one click.",
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M4 20h4l10-10-4-4L4 16zM14 6l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];
  return (
    <section className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">
      {items.map((it) => (
        <div key={it.title} className="card p-5">
          <div className="h-9 w-9 rounded-xl bg-ink-900 text-white flex items-center justify-center mb-3">
            {it.icon}
          </div>
          <div className="font-semibold text-ink-900">{it.title}</div>
          <div className="text-sm text-ink-600 mt-1">{it.desc}</div>
        </div>
      ))}
    </section>
  );
}
