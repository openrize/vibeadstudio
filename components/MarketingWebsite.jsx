"use client";
import { useState, useEffect, useMemo } from "react";

export default function MarketingWebsite({ onGenerate, currentRole, logAction }) {
  const [activeTab, setActiveTab] = useState("home");
  
  // 1. AI Demo Experience states
  const [demoBizName, setDemoBizName] = useState("");
  const [demoBizUrl, setDemoBizUrl] = useState("");
  const [demoIndustry, setDemoIndustry] = useState("SaaS / Tech");
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoOutput, setDemoOutput] = useState(null);

  // 2. ROI Calculator states
  const [roiSpend, setRoiSpend] = useState(10000);
  const [roiVolume, setRoiVolume] = useState(15);
  const [roiTeamSize, setRoiTeamSize] = useState(4);
  const [roiCampaigns, setRoiCampaigns] = useState(6);

  // 3. Billing Toggles
  const [billingCycle, setBillingCycle] = useState("monthly");

  // 4. Modals
  const [signupModalOpen, setSignupModalOpen] = useState(false);
  const [signupStep, setSignupStep] = useState(1);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPlan, setSignupPlan] = useState("growth");
  const [signupOrgName, setSignupOrgName] = useState("");

  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoDate, setDemoDate] = useState("");
  const [demoTime, setDemoTime] = useState("");
  const [demoConfirmed, setDemoConfirmed] = useState(false);

  // 5. Conversion Optimizations
  const [exitIntentOpen, setExitIntentOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLogs, setChatLogs] = useState([
    { author: "agent", text: "Hi! I am Vibe support assistant. Looking to scale campaign velocity? Let me know if you need help starting your free trial!" }
  ]);

  // 6. Marketing Telemetry Logs
  const [pixelLogs, setPixelLogs] = useState([]);

  useEffect(() => {
    setPixelLogs([
      { event: "PageView", details: "Loaded anonymous SaaS acquisition homepage", timestamp: new Date().toISOString() }
    ]);
  }, []);

  function triggerPixel(event, details) {
    const nextLog = {
      event,
      details,
      timestamp: new Date().toISOString()
    };
    setPixelLogs(prev => [nextLog, ...prev]);
    
    logAction({
      action: `marketing_pixel_${event.toLowerCase()}`,
      details: `Conversion Tracking Pixel triggered: ${event} (${details})`,
      status: "info"
    });
  }

  // Detect simulated Exit Intent on mouse movement near screen top
  useEffect(() => {
    function handleMouseLeave(e) {
      if (e.clientY < 20) {
        setExitIntentOpen(true);
        triggerPixel("ExitIntent", "User moved cursor towards screen header");
      }
    }
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate ROI projections
  const calculatedROI = useMemo(() => {
    const estimatedSavings = parseFloat((roiSpend * 0.62).toFixed(0)); // 62% average agency/freelancer replacement cost
    const timeSavedHours = (roiVolume * 8) + (roiCampaigns * 12);
    const projectedROIPercent = Math.floor(((estimatedSavings * 3) / roiSpend) * 100);
    return {
      savings: estimatedSavings,
      hours: timeSavedHours,
      roi: projectedROIPercent
    };
  }, [roiSpend, roiVolume, roiCampaigns]);

  // AI Demo run simulator
  function handleRunDemo(e) {
    e.preventDefault();
    if (!demoBizName.trim() || !demoBizUrl.trim()) return;

    setDemoRunning(true);
    triggerPixel("DemoStarted", `Running instant demo copy for brand ${demoBizName}`);

    setTimeout(() => {
      setDemoRunning(false);
      setDemoOutput({
        socialPost: `💡 Discover how ${demoBizName} is reshaping the ${demoIndustry} sector. By deploying custom strategy algorithms, we help businesses market faster and smarter.\n\nRead our launch guidelines here: ${demoBizUrl}\n\n#${demoBizName.replace(/ /g, "")} #AI #Automation`,
        adHeadline: `Scale your ${demoBizName} campaigns in minutes 🚀`,
        adDescription: `Stop wasting hours outlining copies. Define your brand voice, connect your site, and launch campaign assets instantly.`,
        emailSubject: `Important: Upgrade ${demoBizName} acquisition strategy today`,
        emailBody: `Hello team,\n\nWe noticed your brand presence in ${demoIndustry}. Vibe OS enables teams to compile blogs, landing pages, and ad hooks automatically from one dashboard.\n\nClaim your free trial credits here: ${demoBizUrl}/trial`,
        landingHeadline: `${demoBizName} | The Marketing Operating System`
      });
      triggerPixel("DemoCompleted", `Generated custom assets for brand ${demoBizName}`);
    }, 1500);
  }

  // Handlers - Trial Signup Flow
  function handleSignupSubmit(e) {
    e.preventDefault();
    if (signupStep < 3) {
      setSignupStep(prev => prev + 1);
      triggerPixel("SignupStepChange", `Advanced to Step ${signupStep + 1} of onboarding`);
    } else {
      setSignupModalOpen(false);
      triggerPixel("SignupSuccess", `Provisioned trial account for email ${signupEmail} on ${signupPlan.toUpperCase()} tier`);
      alert(`Account successfully provisioned! Welcome to the AI Marketing Studio.`);
      // Launch app automatically by simulating scrape on URL input
      onGenerate(demoBizUrl || "https://acmeretail.com");
    }
  }

  // Handlers - Demo booking
  function handleBookDemo(e) {
    e.preventDefault();
    if (!demoDate || !demoTime) return;

    setDemoConfirmed(true);
    triggerPixel("DemoBooked", `Scheduled support demo on ${demoDate} at ${demoTime}`);
    alert(`Demo confirmed! We sent reminder emails to your contact inbox.`);
  }

  // Handlers - Live Chat
  function handleSendChatMessage(e) {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { author: "user", text: chatMessage };
    setChatLogs(prev => [...prev, userMsg]);
    setChatMessage("");

    triggerPixel("ChatInteraction", `Prospect asked: "${chatMessage.slice(0, 20)}..."`);

    setTimeout(() => {
      setChatLogs(prev => [
        ...prev,
        { author: "agent", text: "Got it! Our trial includes 1,000 free tokens and full CRM attribution tracking. You can start in 10 seconds without any credit cards." }
      ]);
    }, 1000);
  }

  return (
    <div className="space-y-8 animate-fade-in relative pb-16">
      
      {/* 1. MARKETING HEADER */}
      <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-glow">⚡</span>
            <span className="font-black text-slate-900 tracking-tight text-sm">Vibe Strategist</span>
          </a>

          {/* Sub Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: "home", label: "Home" },
              { id: "features", label: "Features" },
              { id: "agency", label: "Agency Solutions" },
              { id: "pricing", label: "Pricing & Plans" },
              { id: "cases", label: "Case Studies" },
              { id: "roi", label: "ROI Calculator" },
              { id: "compare", label: "Compare" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    triggerPixel("NavigationClick", `Switched marketing tab to ${tab.label}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    active 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setDemoModalOpen(true);
              setDemoConfirmed(false);
              triggerPixel("DemoBookingClick", "Clicked header demo request");
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 border px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 transition"
          >
            Book Demo
          </button>
          <button
            onClick={() => {
              setSignupModalOpen(true);
              setSignupStep(1);
              triggerPixel("SignupClick", "Clicked header free trial");
            }}
            className="text-xs font-bold bg-violet-600 hover:bg-violet-750 text-white px-3.5 py-2 rounded-xl shadow transition"
          >
            Start Free Trial
          </button>
        </div>
      </header>

      {/* 2. TABBED SECTIONS */}

      {/* TAB A: HOME & DEMO EXPERIENCE */}
      {activeTab === "home" && (
        <div className="space-y-12">
          {/* HERO */}
          <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-violet-100 text-violet-850 rounded-full">
              🚀 Marketing Operating System for SMBs & Agencies
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Scale Campaign Velocity 10x using Inferred Brand Intelligence
            </h1>
            <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              Scrape your URL, extract buyer personas, generate SEO blogs, compile ad copies, and deploy lead-attributing funnels automatically.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSignupModalOpen(true);
                  setSignupStep(1);
                }}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => setDemoModalOpen(true)}
                className="px-6 py-3 border hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Book Demo Call
              </button>
            </div>
          </div>

          {/* AI DEMO EXPERIENCE */}
          <div className="card p-6 border border-slate-200 bg-white max-w-4xl mx-auto shadow-sm space-y-6">
            <div className="border-b pb-3 text-center">
              <h3 className="font-bold text-slate-800 text-sm">Interactive AI Demo Generator</h3>
              <p className="text-xs text-slate-400 mt-0.5">Show values immediately: Enter brand details to generate sample copy previews instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form Input */}
              <form onSubmit={handleRunDemo} className="md:col-span-1 space-y-3.5">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Retail"
                    value={demoBizName}
                    onChange={(e) => setDemoBizName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://acmeretail.com"
                    value={demoBizUrl}
                    onChange={(e) => setDemoBizUrl(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Industry Segment</label>
                  <select
                    value={demoIndustry}
                    onChange={(e) => setDemoIndustry(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none cursor-pointer"
                  >
                    <option value="SaaS / Tech">SaaS / Tech</option>
                    <option value="Marketing Agency">Marketing Agency</option>
                    <option value="Local E-commerce">Local E-commerce</option>
                    <option value="Restaurant / Food">Restaurant / Food</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={demoRunning}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  {demoRunning ? "AI strategist generating..." : "Run AI Demo"}
                </button>
              </form>

              {/* Output Preview */}
              <div className="md:col-span-2 border border-slate-150 rounded-2xl bg-slate-50 p-4 min-h-[250px] flex flex-col justify-center">
                {demoOutput ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded font-black uppercase text-slate-600 tracking-wider">Sample Social Post (LinkedIn)</span>
                      <p className="mt-1.5 p-2 bg-white border rounded-lg italic text-slate-700 leading-relaxed">&quot;{demoOutput.socialPost}&quot;</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded font-black uppercase text-slate-600 tracking-wider">Sample Ad copy (Meta Ads)</span>
                        <div className="mt-1.5 p-2 bg-white border rounded-lg space-y-1">
                          <span className="font-bold text-slate-900 block">{demoOutput.adHeadline}</span>
                          <span className="text-slate-500 block text-[10px]">{demoOutput.adDescription}</span>
                          <span className="text-indigo-650 font-bold block text-[10px]">{demoOutput.adHeadline.includes("Awareness") ? "Learn More" : "Get Started"}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] bg-slate-200 px-1.5 py-0.5 rounded font-black uppercase text-slate-600 tracking-wider">Sample Email copy (Promo)</span>
                        <div className="mt-1.5 p-2 bg-white border rounded-lg space-y-1">
                          <span className="font-bold text-slate-900 block">Subject: {demoOutput.emailSubject}</span>
                          <p className="text-[10px] text-slate-600 line-clamp-3 leading-relaxed whitespace-pre-wrap">{demoOutput.emailBody}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 space-y-2 py-8">
                    <span className="text-3xl">✨</span>
                    <p className="font-bold">Immediate product demonstration</p>
                    <p className="text-[10px] max-w-xs mx-auto">Fill out the brand URL and click Run AI Demo to render sample email, ad, and social content copies automatically.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: DETAILED FEATURES */}
      {activeTab === "features" && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Dedicated Product Features</h2>
            <p className="text-xs text-slate-500">Every feature is designed to reduce campaign setup time and boost leads output.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {[
              { title: "AI Content Generator", desc: "Write publish-ready SEO blogs, social post series, and custom emails grounding on brand voice definitions.", icon: "✍️" },
              { title: "Campaign Builder", desc: "Deploy step-by-step multi-channel campaigns linking custom CNAMEs, leads form capture, and analytics.", icon: "🚀" },
              { title: "Landing Page Builder", desc: "Scaffold dark-themed cyberpunk or corporate clean pages featuring responsive forms and dynamic assets.", icon: "📄" },
              { title: "AI Brand Assistant", desc: "Streamline brand intelligence extraction and guideline compliance auditing throughout the workspace.", icon: "🤖" },
              { title: "Agency Portal Solutions", desc: "Centralized client portfolios switches, reseller billing models, and white-label custom domain settings.", icon: "💼" },
              { title: "Attribution Analytics", desc: "Measure impressions, click CTR, Cost Per Lead (CPL), estimated ROI, and UTM attribution parameters.", icon: "📊" },
            ].map((f, i) => (
              <div key={i} className="card p-5 border border-slate-200 bg-white space-y-2.5">
                <span className="text-2xl">{f.icon}</span>
                <h4 className="font-extrabold text-slate-950 text-sm">{f.title}</h4>
                <p className="text-slate-500 leading-relaxed font-semibold">{f.desc}</p>
                <button 
                  onClick={() => {
                    setSignupModalOpen(true);
                    triggerPixel("FeatureDetailsClick", `Clicked details for feature: ${f.title}`);
                  }}
                  className="text-violet-650 hover:underline font-bold block pt-1.5"
                >
                  Try this feature free →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: AGENCY SOLUTIONS */}
      {activeTab === "agency" && (
        <div className="space-y-6 max-w-3xl mx-auto text-xs">
          <div className="card p-6 border border-slate-200 bg-white space-y-6">
            <div className="border-b pb-3 text-center">
              <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded uppercase">Resellers & Agencies</span>
              <h3 className="font-bold text-slate-900 text-base mt-1.5">Deliver marketing platforms under your own brand identity</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 leading-relaxed">
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">Centralize Agency Client Portfolios</h4>
                <p className="text-slate-500 font-medium">
                  Switch context instantly between client workspaces. Add custom brand guidelines, connect tenant CNAME domains, and coordinate team editors in one ecosystem.
                </p>
                
                <h4 className="font-extrabold text-slate-900 text-sm">Flexible Reseller Models</h4>
                <p className="text-slate-500 font-medium">
                  Configure custom billing markup profit margins (e.g. 20% overlay margin) on base platform fees. Disptach white-labeled invoices to clients automatically.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">White-Label Branding Services</h4>
                <p className="text-slate-500 font-medium">
                  Set custom domain DNS records, upload agency logo headers, customize app primary colors, and configure tailored client invitations notification email templates.
                </p>

                <div className="p-3 bg-slate-50 border rounded-xl font-mono text-[10px] space-y-1">
                  <div><strong>CNAME Record:</strong> marketing.agency.com</div>
                  <div><strong>Target Host:</strong> whitelabel.vibeadstudio.com</div>
                  <div><strong>Status:</strong> DNS Active Verified</div>
                </div>
              </div>
            </div>

            <div className="text-center pt-3 border-t">
              <button
                onClick={() => {
                  setSignupModalOpen(true);
                  setSignupPlan("agency");
                }}
                className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl font-bold shadow-md transition"
              >
                Launch White-Label Agency Studio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB D: PRICING PAGES */}
      {activeTab === "pricing" && (
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black text-slate-900">Simple, Transparent Pricing</h2>
            <div className="inline-flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  billingCycle === "annual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Annual billing (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {[
              { id: "starter", name: "Starter Tier", price: billingCycle === "monthly" ? "$29" : "$23", period: "/mo", limit: "100 credits/mo", desc: "Best for single creators launching ad copies." },
              { id: "growth", name: "Growth Tier", price: billingCycle === "monthly" ? "$79" : "$63", period: "/mo", limit: "500 credits/mo", desc: "Best for SMBs deploying custom brand guidelines.", active: true },
              { id: "agency", name: "Agency Tier", price: billingCycle === "monthly" ? "$249" : "$199", period: "/mo", limit: "2,000 credits/mo", desc: "Best for agencies managing multiple client sub-accounts." },
              { id: "enterprise", name: "Enterprise Custom", price: "Custom", period: "", limit: "Unlimited tokens", desc: "Best for dedicated teams needing API access." },
            ].map((plan) => (
              <div
                key={plan.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between relative ${
                  plan.active
                    ? "border-violet-600 bg-violet-50/20 shadow-md"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.active && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-violet-600 text-white font-extrabold uppercase text-[8px] px-2 py-0.5 rounded-full">Most Popular</span>
                )}
                <div>
                  <span className="font-extrabold text-slate-800 text-sm block">{plan.name}</span>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-2xl font-black text-slate-950">{plan.price}</span>
                    <span className="text-slate-500 font-bold ml-1">{plan.period}</span>
                  </div>
                  <p className="text-[10px] text-slate-450 mt-1 font-bold">Quota: {plan.limit}</p>
                  <p className="text-slate-500 leading-relaxed font-semibold mt-3">{plan.desc}</p>
                </div>

                <button
                  onClick={() => {
                    setSignupPlan(plan.id);
                    setSignupModalOpen(true);
                    setSignupStep(1);
                    triggerPixel("PricingPlanSelect", `Selected plan: ${plan.name}`);
                  }}
                  className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase text-center transition mt-6 ${
                    plan.active
                      ? "bg-violet-600 hover:bg-violet-750 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E: CASE STUDIES */}
      {activeTab === "cases" && (
        <div className="space-y-8 max-w-4xl mx-auto text-xs">
          <div className="text-center space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">Client Case Success Stories</h2>
            <p className="text-xs text-slate-500">Measurable marketing ROI generated across different industries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Local Boutique E-commerce", challenge: "High freelancer fees for monthly social copies and email promos.", solution: "Integrated Brand Voice rules to scaffold summer campaigns instantly.", result: "Saved $2,400/mo and increased publication output by 300%.", quote: "Vibe OS replaced our content bottleneck within one day." },
              { title: "Growth Marketing Agency Hub", challenge: "Slowing client onboarding speeds and attribution tracking setup delays.", solution: "Deployed White-label reseller CNAME portals and approval queues.", result: "Reduced client onboarding speed to 4 hours and managed 12 active tenants.", quote: "The resale markup pricing handles our client invoice profit margins automatically." },
            ].map((c, i) => (
              <div key={i} className="card p-5 border border-slate-200 bg-white space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm border-b pb-1.5">{c.title}</h4>
                <div className="space-y-1 font-semibold">
                  <p><strong className="text-slate-700">Challenge:</strong> <span className="text-slate-500">{c.challenge}</span></p>
                  <p><strong className="text-slate-700">Solution:</strong> <span className="text-slate-500">{c.solution}</span></p>
                  <p><strong className="text-emerald-700">Results:</strong> <span className="text-emerald-800 font-bold">{c.result}</span></p>
                </div>
                <p className="italic text-slate-500 pt-2 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                  &quot;{c.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB F: ROI CALCULATOR */}
      {activeTab === "roi" && (
        <div className="space-y-6 max-w-3xl mx-auto text-xs">
          <div className="card p-6 border border-slate-200 bg-white space-y-6">
            <div className="border-b pb-3 text-center">
              <span className="text-[9px] bg-violet-100 text-violet-850 font-bold px-2 py-0.5 rounded uppercase">Cost & Time savings</span>
              <h3 className="font-bold text-slate-900 text-base mt-1.5">Calculate your AI ROI Projection</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sliders Input */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Monthly Marketing Spend</span>
                    <span>${roiSpend.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={roiSpend}
                    onChange={(e) => {
                      setRoiSpend(parseInt(e.target.value));
                      triggerPixel("ROICalculatorSpendChange", `Spend adjusted to $${e.target.value}`);
                    }}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Monthly Content Article Volume</span>
                    <span>{roiVolume} articles</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={roiVolume}
                    onChange={(e) => setRoiVolume(parseInt(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Marketing Team Size</span>
                    <span>{roiTeamSize} members</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={roiTeamSize}
                    onChange={(e) => setRoiTeamSize(parseInt(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>Campaign Launches / Month</span>
                    <span>{roiCampaigns} campaigns</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={roiCampaigns}
                    onChange={(e) => setRoiCampaigns(parseInt(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Projections Output */}
              <div className="border border-slate-150 rounded-2xl bg-slate-50 p-5 flex flex-col justify-between space-y-4">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-slate-450 uppercase block">Estimated Monthly Savings</span>
                  <div className="text-3xl font-black text-slate-900 mt-1">${calculatedROI.savings.toLocaleString()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3">
                  <div className="text-center border-r">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Time Saved / Mo</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{calculatedROI.hours} Hours</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">ROI Projection</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 block">{calculatedROI.roi}% ROI</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                  Based on simulated averages of team salary reduction and content velocity benchmarks.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB G: COMPARISONS */}
      {activeTab === "compare" && (
        <div className="space-y-6 max-w-3xl mx-auto text-xs">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Competitive Comparison Matrix</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-150 text-[9px] text-slate-450 font-black uppercase">
                    <th className="pb-2">Feature / Matrix</th>
                    <th className="pb-2 text-violet-700 font-extrabold">Vibe Studio</th>
                    <th className="pb-2">Jasper.ai</th>
                    <th className="pb-2">Copy.ai</th>
                    <th className="pb-2">HubSpot</th>
                  </tr>
                </thead>
                <tbody className="font-medium text-slate-750">
                  {[
                    { f: "Brand Voice compliance", vibe: "Yes (Scraped URL)", jasper: "Yes (Upload files)", copy: "Yes (Text profiles)", hs: "Partial" },
                    { f: "Attribution lead CRM log", vibe: "Yes (Connected)", jasper: "No", copy: "No", hs: "Yes (Premium)" },
                    { f: "White-label custom CNAME", vibe: "Yes (Reseller)", jasper: "No", copy: "No", hs: "No" },
                    { f: "Campaign creation step wizard", vibe: "Yes (Wizard)", jasper: "Template only", copy: "Chat only", hs: "No" },
                    { f: "Starting cost per seat", vibe: "$29 / month", jasper: "$49 / month", copy: "$49 / month", hs: "$800 / month" },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-slate-850">{row.f}</td>
                      <td className="py-2.5 text-violet-700 font-black">{row.vibe}</td>
                      <td className="py-2.5 text-slate-500">{row.jasper}</td>
                      <td className="py-2.5 text-slate-500">{row.copy}</td>
                      <td className="py-2.5 text-slate-500">{row.hs}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. FREE TRIAL SIGNUP FLOW MODAL */}
      {signupModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-scale-in relative text-xs">
            <button
              onClick={() => {
                setSignupModalOpen(false);
                triggerPixel("SignupModalClose", "Closed signup flow early");
              }}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <div className="border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm">Account Registration Wizard</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Step {signupStep} of 3: Onboarding parameters</p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              
              {/* Step 1: Info inputs */}
              {signupStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter name..."
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@business.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Org & Plan setup */}
              {signupStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Company Name</label>
                    <input
                      type="text"
                      placeholder="Acme Enterprise"
                      value={signupOrgName}
                      onChange={(e) => setSignupOrgName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Selected Plan Tier</label>
                    <select
                      value={signupPlan}
                      onChange={(e) => setSignupPlan(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="starter">Starter Plan ($29/mo)</option>
                      <option value="growth">Growth Plan ($79/mo)</option>
                      <option value="agency">Agency Plan ($249/mo)</option>
                      <option value="enterprise">Enterprise Custom</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Step 3: Brand Details */}
              {signupStep === 3 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Brand URL to Scrape</label>
                    <input
                      type="url"
                      placeholder="https://acmecorp.com"
                      value={demoBizUrl}
                      onChange={(e) => setDemoBizUrl(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                    Upon submitting, Vibe OS will scan your site to build target customer profiles and campaigns guidelines automatically.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
              >
                {signupStep < 3 ? "Continue" : "Complete & Launch Studio"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. CALENDLY DEMO BOOKING MODAL */}
      {demoModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-scale-in relative text-xs">
            <button
              onClick={() => {
                setDemoModalOpen(false);
                triggerPixel("DemoModalClose", "Closed demo booking popup");
              }}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-700 font-bold"
            >
              ✕
            </button>

            <div className="border-b pb-2 text-center">
              <h3 className="font-bold text-slate-900 text-sm">Schedule Demo Presentation</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Calendly Direct Integration Simulator</p>
            </div>

            {demoConfirmed ? (
              <div className="text-center py-6 space-y-3">
                <span className="text-2xl">📅</span>
                <h4 className="font-black text-emerald-800">Demo Call Scheduled!</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed max-w-xs mx-auto font-medium">
                  Confirm booking: <strong>{demoDate}</strong> at <strong>{demoTime}</strong>. We dispatched invitations to your email address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookDemo} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Select Date</label>
                  <input
                    type="date"
                    value={demoDate}
                    onChange={(e) => setDemoDate(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Select Time Slot</label>
                  <select
                    value={demoTime}
                    onChange={(e) => setDemoTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none cursor-pointer"
                    required
                  >
                    <option value="">Choose slot...</option>
                    <option value="09:00 AM EST">09:00 AM EST</option>
                    <option value="11:30 AM EST">11:30 AM EST</option>
                    <option value="02:00 PM EST">02:00 PM EST</option>
                    <option value="04:30 PM EST">04:30 PM EST</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition"
                >
                  Confirm Calendar Slot
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. EXIT INTENT POPUP */}
      {exitIntentOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 text-center text-xs animate-scale-in relative">
            <button
              onClick={() => setExitIntentOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
            <span className="text-3xl">🎁</span>
            <h3 className="font-extrabold text-slate-950 text-sm">Wait! Don&apos;t leave empty-handed</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Get an exclusive <strong>20% discount coupon code</strong> on your Growth Plan subscription. Start trial credits now!
            </p>
            <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl font-mono text-xs text-violet-905 font-black uppercase select-all">
              VIBESTUDIO20
            </div>
            <button
              onClick={() => {
                setExitIntentOpen(false);
                setSignupPlan("growth");
                setSignupModalOpen(true);
                setSignupStep(1);
                triggerPixel("ExitIntentCouponClaimed", "Clicked claim coupon in exit intent modal");
              }}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-750 text-white font-bold rounded-xl transition"
            >
              Claim Coupon & Start Trial
            </button>
          </div>
        </div>
      )}

      {/* 6. CONVERSION STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-slate-950 text-white border-t border-slate-900 z-40 px-8 flex items-center justify-between shadow-2xl text-xs">
        <span className="hidden sm:inline font-semibold">Scale campaigns velocity with Vibe Strategist.</span>
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="bg-emerald-500 text-slate-950 text-[8px] font-black uppercase px-1.5 py-0.5 rounded">Offer</span>
          <span className="text-[10px] text-slate-400">1,000 free tokens included.</span>
          <button
            onClick={() => {
              setSignupModalOpen(true);
              setSignupStep(1);
              triggerPixel("StickyCtaClick", "Clicked sticky footer trial button");
            }}
            className="bg-white text-slate-950 hover:bg-slate-100 font-extrabold px-3 py-1.5 rounded-lg text-[10px] transition"
          >
            Start Free
          </button>
        </div>
      </div>

      {/* 7. LIVE SUPPORT CHAT WINDOW */}
      <div className="fixed bottom-16 right-6 z-40 flex flex-col items-end gap-2 text-xs">
        {chatOpen && (
          <div className="bg-white border rounded-2xl shadow-xl w-64 p-4 space-y-3 flex flex-col justify-between animate-scale-in h-80">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-bold text-slate-900">Vibe Support Agent</span>
              <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            {/* Logs */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-1 font-medium text-[11px] leading-relaxed text-slate-650 bg-slate-50 border rounded-xl">
              {chatLogs.map((log, i) => (
                <div key={i} className={`p-2 rounded-lg ${
                  log.author === "user" ? "bg-violet-600 text-white self-end" : "bg-white border text-slate-700"
                }`}>
                  {log.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChatMessage} className="flex gap-1">
              <input
                type="text"
                placeholder="Ask support..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-1 px-2.5 py-1 text-xs border rounded-xl bg-slate-50 outline-none"
                required
              />
              <button className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl">Send</button>
            </form>
          </div>
        )}

        <button
          onClick={() => {
            setChatOpen(!chatOpen);
            triggerPixel("ChatBoxToggled", `Set chat open state to ${!chatOpen}`);
          }}
          className="h-10 w-10 rounded-full bg-slate-950 hover:bg-slate-800 text-white shadow-2xl flex items-center justify-center text-lg transition border"
        >
          💬
        </button>
      </div>

      {/* 8. MARKETING CONVERSION METRIC LEDGER MOCK */}
      <div className="card p-5 border border-slate-200 bg-white max-w-xl mx-auto shadow-sm text-xs space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b pb-1">Marketing Conversion Telemetry Logs</span>
        <div className="space-y-2 max-h-28 overflow-y-auto font-mono text-[9px] text-slate-450">
          {pixelLogs.map((log, i) => (
            <div key={i} className="flex justify-between items-start border-b border-slate-50 pb-1 last:border-0">
              <span className="font-black text-indigo-750">{log.event} pixel event</span>
              <span className="text-slate-600 font-semibold">{log.details}</span>
              <span className="text-slate-400 font-normal">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
