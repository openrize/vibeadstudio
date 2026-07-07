"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import UrlInput from "@/components/UrlInput";
import { trackMarketingEvent } from "@/lib/analytics";
import {
  BRAND_NAME,
  HOW_IT_WORKS_STEPS,
  URL_ANALYZER_LINES,
  SAMPLE_STRATEGY_CARDS,
  USE_CASES,
  WHAT_YOU_GET,
  PLATFORM_FEATURES,
  WHO_ITS_FOR,
  AI_LIMITATIONS,
  BETA_PRICING_PLANS,
  TRUSTED_LOGOS,
} from "@/lib/marketingSiteData";

function UrlAnalyzerDemo() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState([]);

  useEffect(() => {
    const line = URL_ANALYZER_LINES[lineIdx];
    if (!line) return;
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 26);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone((d) => [...d, line]);
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 380);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx]);

  useEffect(() => {
    if (lineIdx >= URL_ANALYZER_LINES.length) {
      const t = setTimeout(() => {
        setDone([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  const current = URL_ANALYZER_LINES[lineIdx] || "";

  return (
    <div className="font-mono text-[11px] space-y-1.5 min-h-[148px]">
      {done.map((l, i) => (
        <div key={i} className="flex items-center gap-2 text-emerald-600">
          <span className="text-emerald-500 shrink-0">✓</span>
          <span>{l}</span>
        </div>
      ))}
      {lineIdx < URL_ANALYZER_LINES.length && (
        <div className="flex items-center gap-2 text-brand-600">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft shrink-0" />
          <span>
            {current.slice(0, charIdx)}
            <span className="typing-cursor">|</span>
          </span>
        </div>
      )}
    </div>
  );
}

function StrategyPreviewCard({ card, index }) {
  const isEmail = card.id === "email";

  return (
    <article
      className={`rounded-2xl border bg-white overflow-hidden shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 animate-campaign-card ${card.accent}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`h-28 bg-gradient-to-br ${card.visual} relative`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${card.badge}`}>
          {card.type}
        </span>
        <span className="absolute bottom-3 left-4 text-[10px] font-medium text-white/80">{card.goal}</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">{card.psychology}</div>
        {isEmail ? (
          <div className="space-y-2">
            <h3 className="font-bold text-ink-900 text-sm">{card.headline}</h3>
            {card.emails?.map((e) => (
              <div key={e.n} className="rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2">
                <div className="text-[10px] font-bold text-brand-600">Email {e.n}</div>
                <div className="text-xs font-semibold text-ink-900 mt-0.5">{e.subject}</div>
                <div className="text-[11px] text-ink-500 mt-0.5">{e.preview}</div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <h3 className="font-bold text-ink-900 text-base leading-snug">{card.headline}</h3>
            <p className="text-sm text-ink-600 leading-relaxed">{card.body}</p>
          </>
        )}
        <div className="pt-1">
          <span className="inline-flex rounded-xl bg-ink-900 text-white text-xs font-bold px-4 py-2">
            {card.cta}
          </span>
        </div>
      </div>
    </article>
  );
}

function SectionHeader({ eyebrow, title, subtitle, align = "center" }) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl mb-12 ${alignClass}`}>
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{eyebrow}</span>
      )}
      <h2 className="text-3xl md:text-4xl font-black text-ink-900 tracking-tight mt-2">{title}</h2>
      {subtitle && <p className="text-slate-500 mt-3 text-sm leading-relaxed">{subtitle}</p>}
    </div>
  );
}

export default function MarketingWebsite({ onGenerate, logAction }) {
  const [betaOpen, setBetaOpen] = useState(false);
  const [betaPlan, setBetaPlan] = useState("pro");
  const [betaName, setBetaName] = useState("");
  const [betaEmail, setBetaEmail] = useState("");
  const [betaOrg, setBetaOrg] = useState("");
  const [betaConfirmed, setBetaConfirmed] = useState(false);
  const outputRef = useRef(null);
  const pricingRef = useRef(null);
  const trackedSections = useRef({ output: false, pricing: false });

  const track = useCallback(
    (event, details) => trackMarketingEvent(event, details, logAction),
    [logAction]
  );

  useEffect(() => {
    track("page_view", { page: "homepage" });
  }, [track]);

  useEffect(() => {
    const sections = [
      { ref: outputRef, event: "sample_output_view", key: "output" },
      { ref: pricingRef, event: "pricing_view", key: "pricing" },
    ];
    const observers = sections.map(({ ref, event, key }) => {
      const el = ref.current;
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !trackedSections.current[key]) {
            trackedSections.current[key] = true;
            track(event, { source: "scroll" });
          }
        },
        { threshold: 0.25 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, [track]);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function viewSampleOutput() {
    track("sample_output_view", { source: "hero_cta" });
    scrollTo("output-preview");
  }

  function openBeta(plan = "pro") {
    setBetaPlan(plan);
    setBetaConfirmed(false);
    setBetaOpen(true);
    track("beta_request", { plan, source: "modal_open" });
  }

  function handleBetaSubmit(e) {
    e.preventDefault();
    setBetaConfirmed(true);
    track("beta_request", { plan: betaPlan, email: betaEmail, org: betaOrg });
  }

  function handlePricingAction(plan) {
    track("pricing_view", { plan: plan.id });
    if (plan.action === "demo") {
      scrollTo("hero");
    } else if (plan.action === "contact") {
      track("contact_click", { source: "pricing_custom" });
      window.location.href = "/contact";
    } else {
      openBeta(plan.id);
    }
  }

  return (
    <div className="min-h-screen">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 text-white text-sm shadow-glow">
              ◆
            </span>
            <span className="font-bold text-ink-900 text-sm tracking-tight">{BRAND_NAME}</span>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: "how-it-works", label: "How It Works" },
              { id: "output-preview", label: "Sample Output" },
              { id: "what-you-get", label: "What You Get" },
              { id: "who-its-for", label: "Who It's For" },
              { id: "pricing", label: "Pricing" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  scrollTo(l.id);
                  if (l.id === "pricing") track("pricing_view", { source: "nav" });
                  if (l.id === "output-preview") track("sample_output_view", { source: "nav" });
                }}
                className="px-3 py-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-100 transition"
              >
                {l.label}
              </button>
            ))}
            <Link
              href="/contact"
              onClick={() => track("contact_click", { source: "nav" })}
              className="px-3 py-1.5 text-xs font-semibold text-ink-600 hover:text-ink-900 rounded-lg hover:bg-ink-100 transition"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                track("sample_output_view", { source: "nav_cta" });
                viewSampleOutput();
              }}
              className="hidden sm:inline-flex text-xs font-semibold text-ink-600 hover:text-ink-900 px-3 py-2 rounded-xl border border-ink-200 bg-white hover:bg-ink-50 transition"
            >
              View Sample
            </button>
            <button
              onClick={() => {
                track("build_strategy_click", { source: "nav" });
                scrollTo("hero");
              }}
              className="btn-primary text-xs font-bold px-4 py-2"
            >
              Build Strategy
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section id="hero" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(49,99,255,0.12),transparent)] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-20 text-center relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-brand-50 text-brand-800 rounded-full border border-brand-200/60">
              AI Strategy Workspace
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-[3.25rem] font-black text-ink-900 tracking-tight leading-[1.08]">
              Turn Any Website Into a{" "}
              <span className="gradient-text">Full-Funnel Marketing Strategy.</span>
            </h1>
            <p className="mt-5 text-base md:text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto">
              {BRAND_NAME} analyzes a brand&apos;s website, audience, positioning, and trust signals to generate
              campaign ideas, messaging angles, and growth strategy in minutes.
            </p>

            <div className="mt-10 max-w-2xl mx-auto">
              <UrlInput
                variant="embedded"
                onGenerate={onGenerate}
                onBuildStrategyClick={() => track("build_strategy_click", { source: "hero_form" })}
                onUrlSubmitted={(url) => track("url_submitted", { url })}
              />
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <button
                onClick={() => {
                  track("build_strategy_click", { source: "hero_cta" });
                  scrollTo("hero");
                  document.querySelector('input[type="url"]')?.focus();
                }}
                className="btn-primary text-sm font-bold px-6 py-3"
              >
                Build Strategy
              </button>
              <button
                onClick={viewSampleOutput}
                className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700 px-6 py-3 rounded-xl border border-ink-200 bg-white/80 hover:bg-white transition"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-brand-700 text-xs">
                  ▶
                </span>
                View Sample Output
              </button>
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ── */}
        <section className="border-y border-ink-100/80 bg-white/50 backdrop-blur-sm py-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-5">
              Built for strategy-first marketing teams
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {TRUSTED_LOGOS.map((name) => (
                <span key={name} className="text-sm font-bold text-ink-300 hover:text-ink-500 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── URL ANALYZER DEMO ── */}
        <section id="analyzer" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">URL Analyzer</span>
              <h2 className="text-3xl font-black text-ink-900 tracking-tight mt-2 mb-3">
                See What the Strategist Extracts
              </h2>
              <p className="text-sm text-ink-500 leading-relaxed">
                Paste any business URL and the workspace maps public signals — hero messaging, offers, trust
                indicators, and funnel gaps — before composing campaign direction.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-6 shadow-soft border border-white/80">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-ink-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-xs font-bold text-ink-600">Analyzing https://example-brand.com</span>
              </div>
              <UrlAnalyzerDemo />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" className="py-20 bg-gradient-to-b from-brand-50/30 to-transparent scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeader
              eyebrow="How It Works"
              title="From URL to Strategy in Three Steps"
              subtitle="No generic ad variations — a structured strategy workspace grounded in what the site actually says."
            />
            <div className="grid md:grid-cols-3 gap-5">
              {HOW_IT_WORKS_STEPS.map((s, i) => (
                <div
                  key={s.step}
                  className="card p-6 hover:shadow-soft hover:-translate-y-0.5 transition-all workflow-module"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-xs font-black text-brand-600">Step {s.step}</span>
                  </div>
                  <h3 className="font-bold text-ink-900 text-base">{s.title}</h3>
                  <p className="text-sm text-ink-500 mt-2 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUTPUT PREVIEW ── */}
        <section id="output-preview" ref={outputRef} className="max-w-6xl mx-auto px-5 sm:px-8 py-20 scroll-mt-20">
          <SectionHeader
            eyebrow="Output Preview"
            title="Strategy Cards, Not Generic Ad Copy"
            subtitle="Illustrative samples — your real output leads with goal, psychology, and competitive angle, then creative copy."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_STRATEGY_CARDS.map((card, i) => (
              <StrategyPreviewCard key={card.id} card={card} index={i} />
            ))}
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section id="use-cases" className="py-20 bg-white/60 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeader
              eyebrow="Use Cases"
              title="Where Strategy-First Wins"
              subtitle="A starting point for pitches, launches, audits, and client onboarding — not a replacement for human judgment."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {USE_CASES.map((u) => (
                <div key={u.title} className="card p-6 hover:shadow-soft transition-all group">
                  <span className="text-2xl">{u.icon}</span>
                  <h3 className="font-bold text-ink-900 mt-3 text-sm group-hover:text-brand-700 transition-colors">
                    {u.title}
                  </h3>
                  <p className="text-xs text-ink-500 mt-2 leading-relaxed">{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT YOU GET ── */}
        <section id="what-you-get" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 scroll-mt-20">
          <SectionHeader
            eyebrow="What You Get"
            title="Every Analysis Delivers"
            subtitle="Structured deliverables you can drop into a deck, brief, or client presentation."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {WHAT_YOU_GET.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-ink-100 bg-white p-5 hover:border-brand-200 hover:shadow-soft transition-all"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-700 text-sm font-bold">
                  {item.icon}
                </span>
                <h3 className="font-bold text-ink-900 mt-3 text-sm">{item.title}</h3>
                <p className="text-xs text-ink-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-20 bg-gradient-to-b from-ink-950 to-ink-900 text-white scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300">Platform</span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-2">
                A Serious Strategy Workspace
              </h2>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Product-led tooling for marketers who need direction before creative — not another generic AI writer.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {PLATFORM_FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-brand-500/30 transition-all"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="font-bold text-white mt-3 text-sm">{f.title}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHO IT'S FOR ── */}
        <section id="who-its-for" className="max-w-6xl mx-auto px-5 sm:px-8 py-20 scroll-mt-20">
          <SectionHeader
            eyebrow="Who It's For"
            title="Built for People Who Ship Strategy"
            subtitle="Whether you're pitching clients, launching a product, or auditing a competitor — start with structured direction."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHO_ITS_FOR.map((w) => (
              <div key={w.title} className="card p-6 text-center hover:shadow-soft transition-all">
                <span className="text-3xl">{w.icon}</span>
                <h3 className="font-black text-ink-900 mt-3">{w.title}</h3>
                <p className="text-xs text-ink-500 mt-2 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI LIMITATIONS / TRUST ── */}
        <section id="limitations" className="py-20 bg-brand-50/40 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">Trust & Transparency</span>
                <h2 className="text-3xl font-black text-ink-900 tracking-tight mt-2">
                  AI Output Is a Starting Point
                </h2>
                <p className="text-sm text-ink-600 mt-3 leading-relaxed">
                  We believe in showing limitations upfront. Every strategy card is draft direction until your team
                  validates claims, offers, and legal requirements.
                </p>
                <div className="mt-6 flex items-center gap-3 text-xs text-ink-500">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-ink-200 text-brand-600 font-bold">
                    ✓
                  </span>
                  <span>Human review recommended before publishing or ad spend.</span>
                </div>
              </div>
              <div className="space-y-3">
                {AI_LIMITATIONS.map((item) => (
                  <div key={item.title} className="card p-4 border border-ink-100/80">
                    <h3 className="text-sm font-bold text-ink-900">{item.title}</h3>
                    <p className="text-xs text-ink-600 mt-1 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BETA / PRICING ── */}
        <section id="pricing" ref={pricingRef} className="py-20 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <SectionHeader
              eyebrow="Beta Access"
              title="Simple Plans. Strategy-First."
              subtitle="Start with the free demo today. Join the beta for full AI-powered analyses."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BETA_PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 flex flex-col border transition-all hover:shadow-soft ${
                    plan.popular
                      ? "border-brand-400 bg-brand-50/40 shadow-soft relative"
                      : "border-ink-200 bg-white"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-black text-ink-900">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-ink-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-ink-500 text-xs font-semibold">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-500 mt-2 leading-relaxed">{plan.desc}</p>
                  <ul className="mt-4 space-y-2 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-ink-600 flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handlePricingAction(plan)}
                    className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                      plan.popular ? "btn-primary" : "bg-ink-900 hover:bg-ink-800 text-white"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-ink-900 via-brand-900 to-accent-600 p-10 md:p-14 text-center text-white shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 space-y-5">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Turn Your Next URL Into a Growth Plan
              </h2>
              <p className="text-brand-100 text-sm max-w-lg mx-auto leading-relaxed">
                Paste a website, review the strategy cards, and refine before you spend a dollar on creative or media.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    track("build_strategy_click", { source: "final_cta" });
                    scrollTo("hero");
                  }}
                  className="px-6 py-3 bg-white text-brand-700 rounded-xl text-sm font-bold hover:bg-brand-50 transition shadow-soft"
                >
                  Build Strategy
                </button>
                <button
                  onClick={() => openBeta("pro")}
                  className="px-6 py-3 border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition"
                >
                  Join Beta
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── BETA MODAL ── */}
      {betaOpen && (
        <div className="fixed inset-0 bg-ink-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-pop relative">
            <button
              onClick={() => setBetaOpen(false)}
              className="absolute top-4 right-4 text-ink-400 hover:text-ink-700 font-bold"
            >
              ✕
            </button>
            {betaConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-3xl">✓</span>
                <h3 className="font-black text-emerald-700">You&apos;re on the list!</h3>
                <p className="text-xs text-ink-500">
                  We&apos;ll reach out to {betaEmail} about {betaPlan} access soon.
                </p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-black text-ink-900">Request Beta Access</h3>
                  <p className="text-xs text-ink-500 mt-1">
                    Join the waitlist for {betaPlan === "agency" ? "Agency" : "Pro"} — we&apos;ll notify you when spots open.
                  </p>
                </div>
                <form onSubmit={handleBetaSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Full name"
                    value={betaName}
                    onChange={(e) => setBetaName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-ink-50 outline-none focus:ring-2 focus:ring-brand-300"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Work email"
                    value={betaEmail}
                    onChange={(e) => setBetaEmail(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-ink-50 outline-none focus:ring-2 focus:ring-brand-300"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Company or agency name"
                    value={betaOrg}
                    onChange={(e) => setBetaOrg(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border rounded-xl bg-ink-50 outline-none focus:ring-2 focus:ring-brand-300"
                    required
                  />
                  <button type="submit" className="w-full py-2.5 btn-primary text-sm font-bold">
                    Request Access
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
