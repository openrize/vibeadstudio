"use client";

export default function OverviewDashboard({ strategy, onNavigate }) {
  const campaignsCount = strategy?.campaigns?.length || 0;
  
  // KPI summary statistics
  const stats = [
    { label: "Target MRR (Goal)", value: "$10,000", change: "+12.4% / mo", type: "success" },
    { label: "Campaigns Active", value: campaignsCount, change: "Full-Funnel Ready", type: "info" },
    { label: "Content Assets In Studio", value: campaignsCount * 4 || 0, change: "Generated via AI", type: "purple" },
    { label: "Avg. Target Conversion", value: "3.85%", change: "Optimized Layouts", type: "cyan" },
  ];

  const funnelStages = [
    { name: "1. Awareness (Cold)", percentage: "100%", description: "Introducing core offer to market", color: "bg-violet-600" },
    { name: "2. Interest (Scraped Signals)", percentage: "62%", description: "Engaged by brand positioning", color: "bg-indigo-500" },
    { name: "3. Action (Conversion)", percentage: "24%", description: "Clicking target page CTAs", color: "bg-fuchsia-500" },
    { name: "4. Loyalty / Authority", percentage: "8.5%", description: "Retargeted with client proof", color: "bg-cyan-500" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Marketing Operating System Dashboard</h2>
        <p className="text-sm text-slate-500 mt-1">
          High-margin recurring revenue strategy, target KPIs, and full-funnel content velocity.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div key={idx} className="card p-6 border border-slate-100 bg-white/70 backdrop-blur-md shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{stat.value}</div>
            <div className="mt-2 text-xs flex items-center gap-1.5 font-medium text-slate-500">
              <span className={`h-1.5 w-1.5 rounded-full ${
                stat.type === "success" ? "bg-emerald-500" :
                stat.type === "info" ? "bg-indigo-500" :
                stat.type === "purple" ? "bg-fuchsia-500" : "bg-cyan-400"
              }`} />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Funnel Velocity Panel */}
        <div className="lg:col-span-2 card p-6 border border-slate-100 bg-white">
          <h3 className="font-bold text-slate-900 text-lg mb-2">Full-Funnel Acquisition Velocity</h3>
          <p className="text-xs text-slate-500 mb-6">Visualizing target conversion stages from first impression to closed deal.</p>
          
          <div className="space-y-5">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{stage.name}</span>
                  <span className="font-bold">{stage.percentage}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                  <div className={`h-full rounded-full transition-all duration-1000 ${stage.color}`} style={{ width: stage.percentage }} />
                </div>
                <div className="text-[10px] text-slate-400">{stage.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Focus Panel */}
        <div className="card p-6 border border-slate-100 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg mb-2">Core Product Modules</h3>
            <p className="text-xs text-slate-500 mb-4">Select an active module to generate or refine your assets.</p>

            <div className="space-y-2.5">
              <button onClick={() => onNavigate("campaigns")} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-violet-50/50 hover:border-violet-200 transition text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Campaign Builder</span>
                <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded">6 Active</span>
              </button>
              
              <button onClick={() => onNavigate("copy")} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-indigo-50/50 hover:border-indigo-200 transition text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Copy & Social Studio</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-850 px-2 py-0.5 rounded">Ad + Social + Email</span>
              </button>

              <button onClick={() => onNavigate("landing")} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-cyan-50/50 hover:border-cyan-200 transition text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Landing Page Builder</span>
                <span className="text-[10px] bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">Scaffolder</span>
              </button>

              <button onClick={() => onNavigate("brand")} className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 hover:border-slate-350 transition text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Brand Voice Manager</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Custom Intel</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 text-xs text-slate-400 leading-relaxed">
            Connected to the <span className="font-semibold text-slate-600">Openrize SaaS Ecosystem</span>. Brand intelligence shares context globally.
          </div>
        </div>

      </div>

      {/* Target Revenue Strategy Model */}
      <div className="card p-6 border border-slate-100 bg-gradient-to-r from-violet-600/10 via-indigo-50/50 to-cyan-50/30">
        <h3 className="font-bold text-slate-900 text-base mb-1">Target Revenue Strategy Tiers</h3>
        <p className="text-xs text-slate-500 mb-4">Approved operational phase pricing models for launching AI Marketing Studio.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/90 p-4 rounded-xl border border-slate-100/80">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Starter</span>
            <div className="text-xl font-bold text-slate-900 mt-1">$29/mo</div>
            <p className="text-[10px] text-slate-500 mt-1">Single creators, base AI copy generation features.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-slate-100/80">
            <span className="text-[10px] font-bold text-violet-600 uppercase">Growth</span>
            <div className="text-xl font-bold text-slate-900 mt-1">$79/mo</div>
            <p className="text-[10px] text-slate-500 mt-1">SMBs, full landing pages + custom brand profiles.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-slate-100/80">
            <span className="text-[10px] font-bold text-indigo-600 uppercase">Agency</span>
            <div className="text-xl font-bold text-slate-900 mt-1">$249/mo</div>
            <p className="text-[10px] text-slate-500 mt-1">Multi-clients sub-accounts, white-label client portals.</p>
          </div>
          <div className="bg-white/90 p-4 rounded-xl border border-slate-100/80">
            <span className="text-[10px] font-bold text-cyan-600 uppercase">Enterprise</span>
            <div className="text-xl font-bold text-slate-900 mt-1">Custom</div>
            <p className="text-[10px] text-slate-500 mt-1">Dedicated support, advanced integrations & raw APIs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
