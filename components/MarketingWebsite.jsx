"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  PLATFORM_LINKS,
  SOLUTION_LINKS,
  PROBLEMS,
  PLATFORM_MODULES,
  WORKFLOW_STEPS,
  FEATURES,
  TEMPLATES,
  SOLUTIONS,
  OUTCOMES,
  PRICING_PLANS,
  FAQ_ITEMS,
  TRUSTED_LOGOS,
  DEMO_TYPING_LINES,
} from "@/lib/marketingSiteData";

function useCountUp(target, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    function tick(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);
  return value;
}

function TypingDemo() {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [done, setDone] = useState([]);

  useEffect(() => {
    const line = DEMO_TYPING_LINES[lineIdx];
    if (!line) return;
    if (charIdx < line.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 28);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setDone((d) => [...d, line]);
      setLineIdx((i) => i + 1);
      setCharIdx(0);
    }, 400);
    return () => clearTimeout(t);
  }, [lineIdx, charIdx]);

  useEffect(() => {
    if (lineIdx >= DEMO_TYPING_LINES.length) {
      const t = setTimeout(() => {
        setDone([]);
        setLineIdx(0);
        setCharIdx(0);
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [lineIdx]);

  const current = DEMO_TYPING_LINES[lineIdx] || "";

  return (
    <div className="font-mono text-[11px] space-y-1.5 min-h-[140px]">
      {done.map((l, i) => (
        <div key={i} className="flex items-center gap-2 text-emerald-600">
          <span className="text-emerald-500">✓</span>
          <span>{l}</span>
        </div>
      ))}
      {lineIdx < DEMO_TYPING_LINES.length && (
        <div className="flex items-center gap-2 text-violet-600">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse-soft" />
          <span>
            {current.slice(0, charIdx)}
            <span className="typing-cursor">|</span>
          </span>
        </div>
      )}
    </div>
  );
}

function WorkflowVisual({ activeStep }) {
  return (
    <div className="space-y-0">
      {WORKFLOW_STEPS.map((step, i) => {
        const isActive = i === activeStep;
        const isDone = i < activeStep;
        return (
          <div key={step.label} className="flex items-stretch gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all duration-500 ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                    ? "bg-violet-600 border-violet-600 text-white shadow-glow scale-110"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </div>
              {i < WORKFLOW_STEPS.length - 1 && (
                <div
                  className={`w-0.5 flex-1 min-h-[20px] transition-colors duration-500 ${
                    isDone ? "bg-emerald-400" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            <div
              className={`pb-4 pt-1 transition-all duration-500 ${
                isActive ? "opacity-100 translate-x-0" : isDone ? "opacity-70" : "opacity-40"
              }`}
            >
              <span className={`text-xs font-semibold ${isActive ? "text-violet-700" : "text-slate-600"}`}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OutcomeStat({ label, value, suffix, desc, visible }) {
  const count = useCountUp(value, 2200, visible);
  return (
    <div className="glass-panel rounded-2xl p-6 text-center space-y-2 hover:shadow-soft transition-shadow">
      <div className="text-3xl md:text-4xl font-black text-slate-900 tabular-nums">
        {count.toLocaleString()}
        <span className="text-violet-600">{suffix}</span>
      </div>
      <div className="text-sm font-bold text-slate-800">{label}</div>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function MarketingWebsite({ onGenerate, currentRole, logAction }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [workflowStep, setWorkflowStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [outcomesVisible, setOutcomesVisible] = useState(false);
  const outcomesRef = useRef(null);

  const [signupOpen, setSignupOpen] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPlan, setSignupPlan] = useState("growth");
  const [signupOrg, setSignupOrg] = useState("");
  const [signupUrl, setSignupUrl] = useState("");

  const [demoOpen, setDemoOpen] = useState(false);
  const [demoConfirmed, setDemoConfirmed] = useState(false);
  const [demoBusiness, setDemoBusiness] = useState("");
  const [demoTeamSize, setDemoTeamSize] = useState("");
  const [demoBudget, setDemoBudget] = useState("");
  const [demoChallenge, setDemoChallenge] = useState("");
  const [demoTools, setDemoTools] = useState("");
  const [demoDate, setDemoDate] = useState("");
  const [demoTime, setDemoTime] = useState("");

  const track = useCallback(
    (event, details) => {
      logAction({
        action: event,
        details,
        status: "info",
      });
    },
    [logAction]
  );

  useEffect(() => {
    track("page_view", "Loaded AI Marketing Studio homepage");
  }, [track]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWorkflowStep((s) => (s + 1) % WORKFLOW_STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const el = outcomesRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setOutcomesVisible(true);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpenMenu(null);
  }

  function openTrial(plan = "growth") {
    setSignupPlan(plan);
    setSignupStep(1);
    setSignupOpen(true);
    track("trial_signup", `Opened trial signup for ${plan} plan`);
  }

  function openDemo() {
    setDemoOpen(true);
    setDemoConfirmed(false);
    track("demo_request", "Opened strategy call booking form");
  }

  function handleSignupSubmit(e) {
    e.preventDefault();
    if (signupStep < 2) {
      setSignupStep((s) => s + 1);
    } else {
      setSignupOpen(false);
      track("trial_signup", `Completed trial signup: ${signupEmail} on ${signupPlan}`);
      onGenerate(signupUrl || "https://example.com");
    }
  }

  function handleDemoSubmit(e) {
    e.preventDefault();
    setDemoConfirmed(true);
    track("demo_request", `Booked strategy call for ${demoBusiness}, team ${demoTeamSize}`);
  }

  return (
    <div className="min-h-screen">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 text-white text-sm shadow-glow">
              ◆
            </span>
            <span className="font-bold text-slate-900 text-sm tracking-tight">AI Marketing Studio</span>
          </a>

          <nav className="hidden lg:flex items-center gap-1">
            <button onClick={() => scrollTo("hero")} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition">
              Home
            </button>

            <div className="relative" onMouseEnter={() => setOpenMenu("platform")} onMouseLeave={() => setOpenMenu(null)}>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1">
                Platform <span className="text-[10px]">▾</span>
              </button>
              {openMenu === "platform" && (
                <div className="absolute top-full left-0 pt-2 w-72">
                  <div className="glass-panel rounded-2xl p-3 shadow-soft grid gap-0.5">
                    {PLATFORM_LINKS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => scrollTo("platform")}
                        className="text-left px-3 py-2.5 rounded-xl hover:bg-violet-50 transition group"
                      >
                        <span className="text-xs font-bold text-slate-800 group-hover:text-violet-700 block">{l.label}</span>
                        <span className="text-[10px] text-slate-500">{l.outcome}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" onMouseEnter={() => setOpenMenu("solutions")} onMouseLeave={() => setOpenMenu(null)}>
              <button className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition flex items-center gap-1">
                Solutions <span className="text-[10px]">▾</span>
              </button>
              {openMenu === "solutions" && (
                <div className="absolute top-full left-0 pt-2 w-56">
                  <div className="glass-panel rounded-2xl p-2 shadow-soft">
                    {SOLUTION_LINKS.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => scrollTo("solutions")}
                        className="block w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition"
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {[
              { id: "pricing", label: "Pricing" },
              { id: "templates", label: "Templates" },
              { id: "outcomes", label: "Case Studies" },
              { id: "faq", label: "Resources" },
            ].map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  scrollTo(l.id);
                  if (l.id === "pricing") track("pricing_view", "Viewed pricing section");
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={openDemo} className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition">
              Book Demo
            </button>
            <button onClick={() => openTrial()} className="btn-primary text-xs font-bold px-4 py-2">
              Start Free Trial
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section id="hero" className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-violet-100/80 text-violet-800 rounded-full border border-violet-200/60">
                AI Marketing Platform · Marketing Operating System
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-black text-slate-900 tracking-tight leading-[1.08]">
                Launch Better Marketing Campaigns in{" "}
                <span className="gradient-text">Minutes, Not Days.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
                AI Marketing Studio helps businesses plan, create, optimize, and manage marketing campaigns from one intelligent platform.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <button onClick={() => openTrial()} className="btn-primary text-sm font-bold px-6 py-3">
                  Start Free Trial
                </button>
                <button
                  onClick={() => {
                    scrollTo("demo");
                    track("campaign_preview", "Clicked Watch Demo from hero");
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 px-6 py-3 rounded-xl border border-slate-200 bg-white/80 hover:bg-white transition"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs">▶</span>
                  Watch Demo
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Your AI Marketing Team — create, launch, and scale campaigns without juggling five tools.
              </p>
            </div>

            {/* Hero dashboard visual */}
            <div className="glass-panel rounded-2xl p-5 shadow-soft border border-white/80">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-2">Campaign OS</span>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Campaigns", val: "6", color: "text-violet-600" },
                  { label: "Content", val: "24", color: "text-blue-600" },
                  { label: "Scheduled", val: "18", color: "text-emerald-600" },
                ].map((m) => (
                  <div key={m.label} className="bg-slate-50/80 rounded-xl p-3 text-center border border-slate-100">
                    <div className={`text-xl font-black ${m.color}`}>{m.val}</div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>
              <WorkflowVisual activeStep={workflowStep} />
            </div>
          </div>
        </section>

        {/* ── TRUSTED BY ── */}
        <section className="border-y border-slate-100/80 bg-white/50 backdrop-blur-sm py-8">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Trusted by Modern Marketing Teams</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {TRUSTED_LOGOS.map((name) => (
                <span key={name} className="text-sm font-bold text-slate-300 hover:text-slate-500 transition-colors">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ── */}
        <section id="problems" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Marketing Shouldn&apos;t Feel Like Five Full-Time Jobs.
            </h2>
            <p className="text-slate-500 mt-3 text-sm leading-relaxed">
              This could replace hours of marketing work every week — not just write blog posts.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="card p-6 hover:shadow-soft hover:-translate-y-0.5 transition-all group">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="font-bold text-slate-900 mt-3 text-sm">{p.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PLATFORM OVERVIEW ── */}
        <section id="platform" className="py-20 bg-gradient-to-b from-violet-50/40 to-transparent">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">One Platform. Every Channel.</h2>
              <p className="text-slate-500 mt-3 text-sm">Your marketing operating system — one dashboard orchestrates everything.</p>
            </div>
            <div className="relative max-w-lg mx-auto">
              <div className="glass-panel rounded-2xl p-8 text-center shadow-soft border-2 border-violet-200/50 relative z-10">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-white text-2xl shadow-glow mb-4">
                  ◆
                </div>
                <h3 className="font-black text-slate-900 text-lg">Central Dashboard</h3>
                <p className="text-xs text-slate-500 mt-1">Plan · Create · Launch · Measure</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {PLATFORM_MODULES.map((m, i) => (
                  <div
                    key={m.label}
                    className="card p-4 text-center hover:shadow-soft transition-all workflow-module"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <div className="text-[11px] font-bold text-slate-700 mt-2">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── AI WORKFLOW DEMO ── */}
        <section id="demo" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600">Live Workflow</span>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2 mb-3">Watch a Campaign Build Itself</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                From strategy to published assets — see how AI Marketing Studio orchestrates your entire campaign workflow in real time.
              </p>
            </div>
            <div className="glass-panel rounded-2xl p-6 shadow-soft border border-slate-100">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                <span className="text-xs font-bold text-slate-600">AI Campaign Builder — Running</span>
              </div>
              <TypingDemo />
              <button
                onClick={() => {
                  track("campaign_preview", "Clicked preview campaign from demo section");
                  openTrial();
                }}
                className="mt-4 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
              >
                Preview Your Campaign →
              </button>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" className="py-20 bg-white/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Everything Your Marketing Team Needs</h2>
              <p className="text-slate-500 mt-3 text-sm">Each feature creates a real business outcome — not just another tool in the stack.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <div key={f.title} className="card p-6 hover:shadow-soft hover:border-violet-200/60 transition-all group">
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="font-bold text-slate-900 mt-3 text-sm group-hover:text-violet-700 transition-colors">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{f.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEMPLATES ── */}
        <section id="templates" className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Start With Proven Templates</h2>
            <p className="text-slate-500 mt-3 text-sm">Real campaign templates — launch faster with structures that already work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) => (
              <button
                key={t.name}
                onClick={() => {
                  track("template_view", `Viewed template: ${t.name}`);
                  openTrial();
                }}
                className="group text-left rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                <div className={`h-24 bg-gradient-to-br ${t.color} relative`}>
                  <span className="absolute bottom-2 left-3 text-[10px] font-bold uppercase tracking-wider text-white/90">{t.category}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors">{t.name}</h3>
                  <span className="text-[10px] text-violet-600 font-semibold mt-1 inline-block">Use template →</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── SOLUTIONS ── */}
        <section id="solutions" className="py-20 bg-gradient-to-b from-blue-50/30 to-transparent">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Built for How You Work</h2>
              <p className="text-slate-500 mt-3 text-sm">Every business has different marketing challenges. We solve yours.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {SOLUTIONS.map((s) => (
                <div key={s.id} className="card p-6 flex flex-col hover:shadow-soft transition-all">
                  <h3 className="font-black text-slate-900 text-base">{s.title}</h3>
                  <div className="mt-4 space-y-3 flex-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-rose-500 tracking-wider">Problem</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.problem}</p>
                    </div>
                    <div className="text-center text-slate-300 text-lg">↓</div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-600 tracking-wider">Solution</span>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.solution}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (s.cta.includes("Demo") || s.cta.includes("Call")) openDemo();
                      else if (s.cta.includes("Template")) scrollTo("templates");
                      else openTrial();
                    }}
                    className="mt-5 w-full py-2.5 text-xs font-bold rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-50 transition"
                  >
                    {s.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OUTCOMES ── */}
        <section id="outcomes" ref={outcomesRef} className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Expected Business Outcomes</h2>
            <p className="text-slate-500 mt-3 text-sm">Real metrics from teams using AI Marketing Studio. Replace with case studies as customers grow.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {OUTCOMES.map((o) => (
              <OutcomeStat key={o.label} {...o} visible={outcomesVisible} />
            ))}
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-20 bg-white/60">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Simple, Transparent Pricing</h2>
              <p className="text-slate-500 mt-3 text-sm">Start free. Scale as your marketing grows.</p>
            </div>
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingCycle("annual")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${billingCycle === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
                >
                  Annual <span className="text-emerald-600">-20%</span>
                </button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {PRICING_PLANS.map((plan) => {
                const price = plan.price[billingCycle];
                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl p-6 flex flex-col border transition-all hover:shadow-soft ${
                      plan.popular ? "border-violet-400 bg-violet-50/30 shadow-soft relative" : "border-slate-200 bg-white"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <h3 className="font-black text-slate-900">{plan.name}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      {price ? (
                        <>
                          <span className="text-3xl font-black text-slate-900">${price}</span>
                          <span className="text-slate-500 text-xs font-semibold">/mo</span>
                        </>
                      ) : (
                        <span className="text-2xl font-black text-slate-900">Custom</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">{plan.desc}</p>
                    <ul className="mt-4 space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => {
                        track("pricing_view", `Selected ${plan.name} plan`);
                        if (plan.id === "enterprise") openDemo();
                        else openTrial(plan.id);
                      }}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                        plan.popular ? "btn-primary" : "bg-slate-900 hover:bg-slate-800 text-white"
                      }`}
                    >
                      {plan.id === "enterprise" ? "Contact Sales" : "Start Free Trial"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="max-w-3xl mx-auto px-5 sm:px-8 py-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="card border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition"
                >
                  <span className="text-sm font-bold text-slate-800 pr-4">{item.q}</span>
                  <span className={`text-slate-400 shrink-0 transition-transform ${faqOpen === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {faqOpen === i && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-10 md:p-14 text-center text-white shadow-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
            <div className="relative z-10 space-y-5">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                Replace Hours of Marketing Work Every Week
              </h2>
              <p className="text-violet-100 text-sm max-w-lg mx-auto leading-relaxed">
                Join teams using AI Marketing Studio as their marketing operating system. Start your free trial or book a strategy call.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => openTrial()}
                  className="px-6 py-3 bg-white text-violet-700 rounded-xl text-sm font-bold hover:bg-violet-50 transition shadow-soft"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={openDemo}
                  className="px-6 py-3 border border-white/30 text-white rounded-xl text-sm font-bold hover:bg-white/10 transition"
                >
                  Book Strategy Call
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── SIGNUP MODAL ── */}
      {signupOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-pop relative">
            <button onClick={() => setSignupOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold">✕</button>
            <div>
              <h3 className="font-black text-slate-900">Start Your Free Trial</h3>
              <p className="text-xs text-slate-500 mt-1">Step {signupStep} of 2 — No credit card required</p>
            </div>
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              {signupStep === 1 && (
                <>
                  <input type="text" placeholder="Full name" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                  <input type="email" placeholder="Work email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                </>
              )}
              {signupStep === 2 && (
                <>
                  <input type="text" placeholder="Company name" value={signupOrg} onChange={(e) => setSignupOrg(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                  <input type="url" placeholder="Website URL (we'll build your first campaign)" value={signupUrl} onChange={(e) => setSignupUrl(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                </>
              )}
              <button type="submit" className="w-full py-2.5 btn-primary text-sm font-bold">
                {signupStep < 2 ? "Continue" : "Launch AI Marketing Studio →"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── DEMO / STRATEGY CALL MODAL ── */}
      {demoOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-pop relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setDemoOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold">✕</button>
            {demoConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-3xl">✓</span>
                <h3 className="font-black text-emerald-700">Strategy Call Booked!</h3>
                <p className="text-xs text-slate-500">We&apos;ll reach out to {demoBusiness} to confirm your call on {demoDate} at {demoTime}.</p>
              </div>
            ) : (
              <>
                <div>
                  <h3 className="font-black text-slate-900">Book Strategy Call</h3>
                  <p className="text-xs text-slate-500 mt-1">Tell us about your marketing — we&apos;ll show you how to save hours every week.</p>
                </div>
                <form onSubmit={handleDemoSubmit} className="space-y-3">
                  <input type="text" placeholder="Business name" value={demoBusiness} onChange={(e) => setDemoBusiness(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                  <select value={demoTeamSize} onChange={(e) => setDemoTeamSize(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none" required>
                    <option value="">Team size</option>
                    <option value="1">Just me</option>
                    <option value="2-5">2–5 people</option>
                    <option value="6-15">6–15 people</option>
                    <option value="16+">16+ people</option>
                  </select>
                  <select value={demoBudget} onChange={(e) => setDemoBudget(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none" required>
                    <option value="">Monthly marketing budget</option>
                    <option value="<1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 – $5,000</option>
                    <option value="5k-20k">$5,000 – $20,000</option>
                    <option value="20k+">$20,000+</option>
                  </select>
                  <input type="text" placeholder="Biggest marketing challenge" value={demoChallenge} onChange={(e) => setDemoChallenge(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" required />
                  <input type="text" placeholder="Current tools (e.g. HubSpot, Canva, Mailchimp)" value={demoTools} onChange={(e) => setDemoTools(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-violet-300" />
                  <input type="date" value={demoDate} onChange={(e) => setDemoDate(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none" required />
                  <select value={demoTime} onChange={(e) => setDemoTime(e.target.value)} className="w-full px-3 py-2.5 text-sm border rounded-xl bg-slate-50 outline-none" required>
                    <option value="">Preferred time</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                  </select>
                  <button type="submit" className="w-full py-2.5 btn-primary text-sm font-bold">Book Strategy Call</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
