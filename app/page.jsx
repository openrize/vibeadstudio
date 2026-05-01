"use client";
import { useEffect, useState } from "react";
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
  const [favorites, setFavorites] = useState([]);
  const [recentUrls, setRecentUrls] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [winnerIds, setWinnerIds] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const productName =
    scraped?.title?.split(/[|\-:]/)[0]?.trim() || scraped?.siteName || "Unknown product";

  useEffect(() => {
    try {
      const rawFav = localStorage.getItem("vibe-favorites");
      const rawRecent = localStorage.getItem("vibe-recent-urls");
      const rawTop = localStorage.getItem("vibe-top-performers");
      if (rawFav) setFavorites(JSON.parse(rawFav));
      if (rawRecent) setRecentUrls(JSON.parse(rawRecent));
      if (rawTop) setTopPerformers(JSON.parse(rawTop));
    } catch {
      // Ignore malformed local storage data.
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vibe-favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("vibe-recent-urls", JSON.stringify(recentUrls));
  }, [recentUrls]);

  useEffect(() => {
    localStorage.setItem("vibe-top-performers", JSON.stringify(topPerformers));
  }, [topPerformers]);

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
      setRecentUrls((prev) => {
        const next = [rawUrl, ...prev.filter((u) => u !== rawUrl)];
        return next.slice(0, 6);
      });

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
      setCompareIds([]);
      setWinnerIds([]);
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
      image: ad.image || "https://via.placeholder.com/400x200",
      score:
        typeof ad.score === "number"
          ? ad.score
          : Math.floor(Math.random() * 16) + 80,
    };
  }

  function toggleFavorite(ad) {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === ad.id);
      if (exists) return prev.filter((item) => item.id !== ad.id);
      return [
        {
          id: ad.id,
          headline: ad.headline,
          tone: ad.tone,
          score: ad.score,
        },
        ...prev,
      ].slice(0, 20);
    });
  }

  function toggleCompare(id) {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((v) => v !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  }

  function toggleWinner(id) {
    setWinnerIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  }

  function saveWinnersToTopPerformers() {
    const winners = ads.filter((ad) => winnerIds.includes(ad.id));
    if (!winners.length) return;
    setTopPerformers((prev) => {
      const merged = [...winners, ...prev];
      const unique = [];
      for (const item of merged) {
        if (!unique.some((u) => u.id === item.id)) unique.push(item);
      }
      return unique.slice(0, 20);
    });
  }

  function toCsvValue(value) {
    const safe = String(value ?? "").replace(/"/g, '""');
    return `"${safe}"`;
  }

  function exportCSV() {
    if (!ads.length) return;
    const rows = ads.map((ad) =>
      [ad.headline, ad.body, ad.cta, ad.score].map(toCsvValue).join(",")
    );
    const csvContent = ["Headline,Body,CTA,Score", ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ads.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-slate-50 to-indigo-50/30">
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

        {!loading && recentUrls.length > 0 && (
          <RecentUrls urls={recentUrls} onSelect={handleGenerate} />
        )}

        {!loading && scraped && (
          <ScrapedSummary scraped={scraped} />
        )}

        {!loading && ads?.length > 0 && (
          <AdGrid
            ads={ads}
            productName={productName}
            onChange={handleAdChange}
            onAction={handleAdAction}
            busyMap={busyMap}
            compareIds={compareIds}
            onToggleCompare={toggleCompare}
            winnerIds={winnerIds}
            onToggleWinner={toggleWinner}
            onSaveWinners={saveWinnersToTopPerformers}
            onExportAds={exportCSV}
            onToggleFavorite={toggleFavorite}
            favoriteIds={favorites.map((f) => f.id)}
          />
        )}

        {!loading && favorites.length > 0 && (
          <FavoritesStrip favorites={favorites} />
        )}

        {!loading && topPerformers.length > 0 && (
          <TopPerformersStrip performers={topPerformers} />
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

function RecentUrls({ urls, onSelect }) {
  return (
    <section className="max-w-3xl mx-auto mt-6">
      <div className="text-xs font-semibold uppercase tracking-wide text-ink-500 mb-2">
        Recent generations
      </div>
      <div className="flex flex-wrap gap-2">
        {urls.map((url) => (
          <button
            key={url}
            type="button"
            className="btn-chip"
            onClick={() => onSelect(url)}
          >
            {url.replace(/^https?:\/\//, "")}
          </button>
        ))}
      </div>
    </section>
  );
}

function FavoritesStrip({ favorites }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink-800">Saved favorites</h3>
        <span className="text-xs text-ink-500">{favorites.length} saved</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {favorites.slice(0, 4).map((item) => (
          <div key={item.id} className="card p-4">
            <div className="text-sm font-semibold text-ink-900 line-clamp-1">
              {item.headline}
            </div>
            <div className="mt-1 text-xs text-ink-600">
              {item.tone} · Score {item.score}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TopPerformersStrip({ performers }) {
  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink-800">Top performers</h3>
        <span className="text-xs text-ink-500">{performers.length} saved winners</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {performers.slice(0, 4).map((item) => (
          <div key={item.id} className="card p-4">
            <div className="text-sm font-semibold text-ink-900 line-clamp-1">
              {item.headline}
            </div>
            <div className="mt-1 text-xs text-ink-600">
              {item.tone} · Score {item.score}
            </div>
          </div>
        ))}
      </div>
    </section>
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
        <div key={it.title} className="card p-5 hover:shadow-lg transition">
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
