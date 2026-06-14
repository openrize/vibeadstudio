"use client";
import { useState, useMemo } from "react";

// Mock performance data sets
const INITIAL_CAMPAIGNS = [
  { id: "cmp_1", channel: "Meta Ads", imps: "245,000", clicks: "11,200", ctr: "4.57%", leads: 480, spend: 4800, revenue: 18400, roi: "383%", cpl: "$10.00" },
  { id: "cmp_2", channel: "Google Search", imps: "180,000", clicks: "8,400", ctr: "4.67%", leads: 350, spend: 3500, revenue: 15200, roi: "434%", cpl: "$10.00" },
  { id: "cmp_3", channel: "LinkedIn Ads", imps: "80,000", clicks: "2,100", ctr: "2.63%", leads: 110, spend: 4400, revenue: 12000, roi: "272%", cpl: "$40.00" },
  { id: "cmp_4", channel: "Email Outbound", imps: "12,000", clicks: "3,400", ctr: "28.33%", leads: 220, spend: 120, revenue: 9800, roi: "8166%", cpl: "$0.55" },
  { id: "cmp_5", channel: "Organic Blog", imps: "42,000", clicks: "1,850", ctr: "4.40%", leads: 180, spend: 0, revenue: 6400, roi: "∞", cpl: "$0.00" },
];

const INITIAL_REV_METRICS = {
  mrr: 48200,
  arr: 578400,
  arpu: 135,
  ltv: 4800,
  expansion: 4200,
  trialsStarted: 382,
  trialConversions: 142,
  upgrades: 18,
  downgrades: 8,
  cancellations: 12,
};

const SUCCESS_ACCOUNTS = [
  { id: "cs_1", org: "Alpha Retailers", adoption: "94%", features: "Campaign Wizard, Social Studio", health: 98, status: "Healthy" },
  { id: "cs_2", org: "Vertex SaaS LLC", adoption: "88%", features: "Blog Gen, Brand Intelligence", health: 92, status: "Healthy" },
  { id: "cs_3", org: "BlueSky Digital Agency", adoption: "65%", features: "Agency Portal (Multi-Client)", health: 74, status: "Medium Risk" },
  { id: "cs_4", org: "Solo E-com Pro", adoption: "34%", features: "Campaign Wizard", health: 48, status: "High Risk Churn" },
  { id: "cs_5", org: "Prime Ventures", adoption: "91%", features: "Stripe Billing, Landing Builder", health: 96, status: "Healthy" },
];

export default function AnalyticsBibleWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("executive");
  const [attributionModel, setAttributionModel] = useState("multi");
  const [leadScoreThreshold, setLeadScoreThreshold] = useState(70);
  const [forecastAdSpend, setForecastAdSpend] = useState(15000);
  const [forecastConvRate, setForecastConvRate] = useState(2.8);
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [revenueStats, setRevenueStats] = useState(INITIAL_REV_METRICS);
  const [accounts, setAccounts] = useState(SUCCESS_ACCOUNTS);

  // New item forms states
  const [newCampaignChannel, setNewCampaignChannel] = useState("");
  const [newCampaignSpend, setNewCampaignSpend] = useState("");
  const [newCampaignRev, setNewCampaignRev] = useState("");

  const isReadOnly = currentRole === "read_only";

  // Dynamic attribution math
  const attributionData = useMemo(() => {
    switch (attributionModel) {
      case "first":
        return [
          { name: "LinkedIn Ads (First Touch)", value: 45, conversions: 210, color: "bg-indigo-600" },
          { name: "Google Search (First Touch)", value: 30, conversions: 140, color: "bg-blue-500" },
          { name: "Meta Ads (First Touch)", value: 15, conversions: 70, color: "bg-violet-500" },
          { name: "Organic Blog (First Touch)", value: 10, conversions: 46, color: "bg-emerald-500" },
        ];
      case "last":
        return [
          { name: "Email Outbound (Last Touch)", value: 50, conversions: 233, color: "bg-pink-500" },
          { name: "Meta Ads (Last Touch)", value: 30, conversions: 140, color: "bg-violet-500" },
          { name: "Google Search (Last Touch)", value: 15, conversions: 70, color: "bg-blue-500" },
          { name: "LinkedIn Ads (Last Touch)", value: 5, conversions: 23, color: "bg-indigo-600" },
        ];
      case "multi":
      default:
        return [
          { name: "Meta Ads (W-Shaped Attribution)", value: 35, conversions: 163, color: "bg-violet-500" },
          { name: "Google Search (W-Shaped Attribution)", value: 25, conversions: 116, color: "bg-blue-500" },
          { name: "LinkedIn Ads (W-Shaped Attribution)", value: 20, conversions: 93, color: "bg-indigo-600" },
          { name: "Email Outbound (W-Shaped Attribution)", value: 15, conversions: 70, color: "bg-pink-500" },
          { name: "Organic Blog (W-Shaped Attribution)", value: 5, conversions: 24, color: "bg-emerald-500" },
        ];
    }
  }, [attributionModel]);

  // Forecasting math
  const projectedLeads = useMemo(() => {
    // average CPL assumption $15
    const computedLeads = Math.round(forecastAdSpend / 15);
    return computedLeads;
  }, [forecastAdSpend]);

  const projectedRevenue = useMemo(() => {
    // leads * conversion rate * average contract value LTV
    const sales = (projectedLeads * forecastConvRate) / 100;
    const computedRev = Math.round(sales * revenueStats.arpu * 12);
    return computedRev;
  }, [projectedLeads, forecastConvRate, revenueStats.arpu]);

  const projectedRoi = useMemo(() => {
    if (forecastAdSpend === 0) return 0;
    const computedRoi = Math.round(((projectedRevenue - forecastAdSpend) / forecastAdSpend) * 100);
    return computedRoi;
  }, [projectedRevenue, forecastAdSpend]);

  // Aggregate metrics
  const totalCampaignRevenue = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.revenue, 0);
  }, [campaigns]);

  const totalCampaignSpend = useMemo(() => {
    return campaigns.reduce((acc, c) => acc + c.spend, 0);
  }, [campaigns]);

  // Handlers - Campaign addition
  function handleAddCampaign(e) {
    e.preventDefault();
    if (!newCampaignChannel.trim() || isReadOnly) return;

    const spendNum = parseFloat(newCampaignSpend) || 0;
    const revNum = parseFloat(newCampaignRev) || 0;
    const roiNum = spendNum > 0 ? Math.round(((revNum - spendNum) / spendNum) * 100) : 0;
    const computedCtr = "4.20%";
    const computedImps = "100,000";
    const computedClicks = "4,200";
    const computedLeads = Math.round(spendNum / 12);

    const newCmp = {
      id: `cmp_${Date.now()}`,
      channel: newCampaignChannel,
      imps: computedImps,
      clicks: computedClicks,
      ctr: computedCtr,
      leads: computedLeads,
      spend: spendNum,
      revenue: revNum,
      roi: spendNum > 0 ? `${roiNum}%` : "∞",
      cpl: spendNum > 0 ? `$${(spendNum / computedLeads).toFixed(2)}` : "$0.00",
    };

    setCampaigns([...campaigns, newCmp]);

    logAction({
      action: "analytics_campaign_registered",
      details: `Registered performance ledger for '${newCmp.channel}' (Spend: $${spendNum}, Revenue: $${revNum})`,
      status: "success",
      sql: `INSERT INTO "CampaignLedgers" ("channel", "spend", "revenue", "roi") VALUES ('${newCmp.channel}', ${spendNum}, ${revNum}, '${newCmp.roi}')`,
    });

    setNewCampaignChannel("");
    setNewCampaignSpend("");
    setNewCampaignRev("");
    alert("Campaign performance logged in ledger directory.");
  }

  // Handlers - CSV Export
  function handleExportCSV() {
    logAction({
      action: "analytics_report_exported",
      details: `Compiled and downloaded executive analytical summary CSV report`,
      status: "info",
    });

    const header = ["Report Section", "Metric Name", "Value", "Context"];
    const rows = [
      ["Executive Summary", "Monthly Recurring Revenue (MRR)", `$${revenueStats.mrr.toLocaleString()}`, "SaaS Core MRR"],
      ["Executive Summary", "Annual Recurring Revenue (ARR)", `$${revenueStats.arr.toLocaleString()}`, "MRR * 12 Projection"],
      ["Executive Summary", "Campaign Managed Revenue", `$${totalCampaignRevenue.toLocaleString()}`, "North Star Metric"],
      ["Executive Summary", "Aggregate Campaign Spend", `$${totalCampaignSpend.toLocaleString()}`, "Outbound Ad Spend"],
      ["AI Usage Analytics", "Prompts Submitted", "14,820", "Organization Count"],
      ["AI Usage Analytics", "Tokens Consumed", "4.8M", "GPT-4o-mini limits"],
      ["Attribution Analytics", "Attribution Model Selected", attributionModel.toUpperCase(), "Conversion Credit Path"],
      ["Customer Success", "Healthy Accounts Ratio", "80%", "Feature Adoption Indicators"],
    ];

    // Append campaign rows
    campaigns.forEach((c) => {
      rows.push(["Campaign Performance", c.channel, `Spend: $${c.spend} | Rev: $${c.revenue}`, `ROI: ${c.roi}`]);
    });

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [header.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "vibeos_analytics_bible_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">📊</span>
            Analytics Bible Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Transform AI token loads, campaign conversions, subscription funnels, and feature adoption rates into actionable executive insights.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition self-start md:self-center flex items-center gap-2"
        >
          <span>📥</span>
          Export Executive Report
        </button>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">North Star KPI: Campaign Revenue</span>
          <div className="text-xl font-black text-slate-900 mt-1">${totalCampaignRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">
            Avg. ROI: {totalCampaignSpend > 0 ? Math.round(((totalCampaignRevenue - totalCampaignSpend) / totalCampaignSpend) * 100) : 0}%
          </span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">SaaS MRR / ARR</span>
          <div className="text-xl font-black text-slate-900 mt-1">${revenueStats.mrr.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ ${revenueStats.arr.toLocaleString()}</span></div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">ARPU: ${revenueStats.arpu} | LTV: ${revenueStats.ltv}</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">AI Operations Costs</span>
          <div className="text-xl font-black text-slate-900 mt-1">$9,680</div>
          <span className="text-[10px] text-indigo-650 font-bold block mt-1">4.8M Tokens Consumed</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Customer Health Avg</span>
          <div className="text-xl font-black text-slate-900 mt-1">88% Health</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">80% adoption rate</span>
        </div>
      </div>

      {/* Nav Tab switches */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "executive", label: "Executive Summary", icon: "👑" },
          { id: "ai", label: "AI Resource usage", icon: "🤖" },
          { id: "campaigns", label: "Campaign performance", icon: "📢" },
          { id: "attribution", label: "Attribution models", icon: "🎯" },
          { id: "revenue", label: "Subscription Revenue", icon: "💳" },
          { id: "customer_success", label: "Customer Success", icon: "🛡️" },
          { id: "predictive", label: "Predictive Analytics", icon: "🔮" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-all ${
                active
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. EXECUTIVE SUMMARY TAB */}
      {activeSubTab === "executive" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main stats graph mockup */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Revenue Growth Indicators (MRR vs Campaign Sales)</h3>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                    <span>SaaS Subscription MRR ($48,200)</span>
                    <span>Goal: $50,000</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: "96.4%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                    <span>Campaign Attributed Revenue ($61,850)</span>
                    <span>Goal: $80,000</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: "77.3%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-650 mb-1">
                    <span>Expansion / Upgrade ARR ($50,400)</span>
                    <span>Goal: $60,000</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-600" style={{ width: "84.0%" }} />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs text-slate-505 leading-relaxed font-medium">
                💡 <strong>Decision Support:</strong> Campaign Outbound Email and Google Search channels are performing at a 400%+ ROI mark. Meta Ads accounts for the highest raw lead volume (480) but has a slightly higher acquisition cost of $10 CPL.
              </div>
            </div>

            {/* Target Stakeholders checklist */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Executive Reports Status</h3>
              <div className="space-y-3.5 text-xs">
                <div className="p-3 border rounded-xl flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">C-Suite Executive Brief</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Focus: ARR, MRR, ROI, CAC</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[8px] font-black uppercase">Approved</span>
                </div>

                <div className="p-3 border rounded-xl flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">Product & Feature Adoption Map</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Focus: Activation rates, CS health</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
                </div>

                <div className="p-3 border rounded-xl flex items-center justify-between hover:bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">Ops Token consumption & costs</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Focus: AI margins per organization</span>
                  </div>
                  <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[8px] font-black uppercase">Under Audit</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. AI USAGE TAB */}
      {activeSubTab === "ai" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Tokens metrics */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">AI Resource allocation by content type</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase pb-2">
                      <th className="pb-2">Generated Asset</th>
                      <th className="pb-2">Volume Produced</th>
                      <th className="pb-2">Estimated Prompt Count</th>
                      <th className="pb-2">Tokens Consumed</th>
                      <th className="pb-2 text-right">Computed Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: "Blogs & Articles", volume: "184 posts", prompts: "552", tokens: "1.48M", cost: "$2.96" },
                      { type: "Ads & Copy Variants", volume: "450 scripts", prompts: "900", tokens: "0.90M", cost: "$1.80" },
                      { type: "Outbound Marketing Emails", volume: "820 campaigns", prompts: "1,640", tokens: "0.82M", cost: "$1.64" },
                      { type: "Landing Page Headers", volume: "120 segments", prompts: "360", tokens: "0.60M", cost: "$1.20" },
                      { type: "Social Media Posts", volume: "1,200 posts", prompts: "2,400", tokens: "0.50M", cost: "$1.00" },
                      { type: "DALL-E Images", volume: "650 images", prompts: "650", tokens: "N/A (API Call)", cost: "$13.00" },
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{item.type}</td>
                        <td className="py-3 font-semibold text-slate-600">{item.volume}</td>
                        <td className="py-3 text-slate-550 font-mono">{item.prompts}</td>
                        <td className="py-3 font-bold text-indigo-700">{item.tokens}</td>
                        <td className="py-3 text-right font-mono text-emerald-700 font-bold">{item.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Cost per Organization limits monitor */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">AI Margins Monitor</h3>
              <div className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="flex justify-between border-b pb-2">
                  <span>AI Cost Per User (avg):</span>
                  <span className="font-mono text-slate-900">$2.14 / mo</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Gross Profit Margin:</span>
                  <span className="font-mono text-emerald-600">92.4% Profit</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Tokens Rate limit:</span>
                  <span className="font-mono text-slate-900">100k tokens / min</span>
                </div>
                <div className="p-3 border border-indigo-150 bg-indigo-50/20 rounded-xl">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">Compute Node Health</span>
                  <p className="text-[11px] text-slate-500 leading-normal">API nodes responding in 114ms. Zero rate-limit overrides logged on database.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. CAMPAIGNS PERFORMANCE TAB */}
      {activeSubTab === "campaigns" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEDGER GRID */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Campaign Performance Registry</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Outbound Channel</th>
                      <th className="pb-2">Impressions</th>
                      <th className="pb-2">Clicks</th>
                      <th className="pb-2">CTR (%)</th>
                      <th className="pb-2">Leads Count</th>
                      <th className="pb-2">Cost Spend</th>
                      <th className="pb-2">Revenue Generated</th>
                      <th className="pb-2 text-right">ROI (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((cmp) => (
                      <tr key={cmp.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2 font-bold text-slate-850">{cmp.channel}</td>
                        <td className="py-3 text-slate-600">{cmp.imps}</td>
                        <td className="py-3 text-slate-650">{cmp.clicks}</td>
                        <td className="py-3 font-semibold text-slate-500">{cmp.ctr}</td>
                        <td className="py-3 font-bold text-indigo-700">{cmp.leads}</td>
                        <td className="py-3 text-slate-700 font-bold">${cmp.spend}</td>
                        <td className="py-3 text-emerald-800 font-black">${cmp.revenue}</td>
                        <td className={`py-3 text-right font-bold ${cmp.spend > 0 ? "text-indigo-650" : "text-emerald-700"}`}>
                          {cmp.roi}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MANUAL CAMPAIGN REGISTRATION */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Log Campaign Results</h3>
              <form onSubmit={handleAddCampaign} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Outbound Channel</label>
                  <input
                    type="text"
                    placeholder="e.g. YouTube Sponsored Ads"
                    value={newCampaignChannel}
                    onChange={(e) => setNewCampaignChannel(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Total Spend ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 5000"
                      value={newCampaignSpend}
                      onChange={(e) => setNewCampaignSpend(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Revenue Attributed ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={newCampaignRev}
                      onChange={(e) => setNewCampaignRev(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Commit Performance Ledger
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 4. ATTRIBUTION MODELS TAB */}
      {activeSubTab === "attribution" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Switch controls */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Select Attribution Model</h3>
              <p className="text-xs text-slate-400 font-medium">Re-distribute conversion credits across channels to evaluate marketing impact:</p>
              
              <div className="space-y-2.5 pt-2">
                {[
                  { id: "first", name: "First Touch Model", desc: "100% credit to the entry channel source" },
                  { id: "last", name: "Last Touch Model", desc: "100% credit to the conversion closer channel" },
                  { id: "multi", name: "Multi-Touch (W-Shaped)", desc: "Shares credit across multiple engagement stages" },
                ].map((model) => {
                  const active = attributionModel === model.id;
                  return (
                    <button
                      key={model.id}
                      onClick={() => setAttributionModel(model.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition text-xs flex flex-col gap-1 ${
                        active
                          ? "border-violet-600 bg-violet-50/20"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-bold text-slate-850">{model.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{model.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attribution visualization */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Attribution Credit Distribution</h3>
              
              <div className="space-y-4.5">
                {attributionData.map((d, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-650">
                      <span>{d.name}</span>
                      <span>{d.value}% ({d.conversions} conversions)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`h-full ${d.color}`} style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-indigo-50/20 border border-indigo-105 p-3 rounded-xl text-xs text-slate-505 leading-normal font-medium mt-6">
                ✨ <strong>Model Insight:</strong> Under the <strong>{attributionModel === "first" ? "First Touch" : attributionModel === "last" ? "Last Touch" : "Multi-Touch"}</strong> mapping paradigm, 
                {attributionModel === "first" ? " LinkedIn Ads represents the primary hook of raw interest." : 
                 attributionModel === "last" ? " Outbound email marketing campaign closures score the conversion closer." : 
                 " paid Meta Ads and search engines have balanced conversion contributions."}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. SUBSCRIPTION REVENUE TAB */}
      {activeSubTab === "revenue" && (
        <div className="space-y-6 animate-fade-in">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">ARR Runway</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">${revenueStats.arr.toLocaleString()}</div>
            </div>
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Expansion ARR</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">+${revenueStats.expansion.toLocaleString()}</div>
            </div>
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">ARPU / LTV</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">${revenueStats.arpu} <span className="text-xs font-normal text-slate-400">/ ${revenueStats.ltv}</span></div>
            </div>
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Trial Conversions</span>
              <div className="text-lg font-black text-slate-900 mt-0.5">{revenueStats.trialConversions} <span className="text-xs font-normal text-slate-400">({Math.round((revenueStats.trialConversions / revenueStats.trialsStarted)*100)}%)</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Billing Actions log */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">SaaS Subscriptions ledger</h3>
              <div className="space-y-3.5 text-xs">
                {[
                  { name: "Starter Tier Accounts", count: 142, mrr: "$4,118", status: "Active" },
                  { name: "Growth Tier Accounts", count: 205, mrr: "$20,295", status: "Active" },
                  { name: "Agency Reseller Tier Accounts", count: 35, mrr: "$13,790", status: "Active" },
                  { name: "Enterprise Custom Tiers", count: 11, mrr: "$9,997", status: "Active" },
                ].map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 border rounded-xl hover:bg-slate-50">
                    <span className="font-bold text-slate-800">{tier.name} <span className="text-xs font-normal text-slate-400">({tier.count} tenants)</span></span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-slate-700">{tier.mrr} / mo</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[8px] font-black uppercase">{tier.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Performance Logs */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Sub Churn & Upgrades</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="flex justify-between border-b pb-2">
                  <span>Upgrades processed:</span>
                  <span className="font-mono text-emerald-600">+{revenueStats.upgrades} accounts</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Downgrades logged:</span>
                  <span className="font-mono text-amber-600">-{revenueStats.downgrades} accounts</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Cancellations logged:</span>
                  <span className="font-mono text-rose-600">-{revenueStats.cancellations} accounts</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Growth Rate:</span>
                  <span className="font-mono text-emerald-600">+8.4% Net MRR</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. CUSTOMER SUCCESS & ADOPTION TAB */}
      {activeSubTab === "customer_success" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Accounts health */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Organization Adoption & Churn Risk Ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Organization Domain</th>
                      <th className="pb-2">Feature Adoption Rate</th>
                      <th className="pb-2">Primary Core Modules Used</th>
                      <th className="pb-2">Health Score</th>
                      <th className="pb-2 text-right">Churn Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((ac) => (
                      <tr key={ac.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{ac.org}</td>
                        <td className="py-3 text-slate-600 font-semibold">{ac.adoption}</td>
                        <td className="py-3 text-slate-500 font-mono text-[10px]">{ac.features}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${ac.health > 80 ? "bg-emerald-500" : ac.health > 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${ac.health}%` }} />
                            </div>
                            <span className="font-mono font-bold">{ac.health}%</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                            ac.status === "Healthy" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            ac.status === "Medium Risk" ? "bg-amber-50 text-amber-800 border-amber-200 animate-pulse" :
                            "bg-rose-50 text-rose-800 border-rose-200 animate-bounce"
                          }`}>{ac.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Support KPIs & Feature toggles */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4 font-semibold text-slate-650 text-xs">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Customer CS Analytics</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span>Campaign Wizard Usage:</span>
                  <span className="font-mono text-slate-900">92% Activation</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>SEO Blog Gen usage:</span>
                  <span className="font-mono text-slate-900">78% Activation</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Brand Intelligence usage:</span>
                  <span className="font-mono text-slate-900">84% Activation</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Customer Support CSAT:</span>
                  <span className="font-mono text-emerald-600">4.89 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Risk Overrides Logged:</span>
                  <span className="font-mono text-rose-600">1 flagged risk</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 7. PREDICTIVE FORECASTING ROADMAP */}
      {activeSubTab === "predictive" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Forecast parameters panel */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Scenario Modeler Settings</h3>
              
              <div className="space-y-5 py-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-650">
                    <span>Target Ad Spend Budget</span>
                    <span className="font-mono text-slate-900">${forecastAdSpend.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={forecastAdSpend}
                    onChange={(e) => setForecastAdSpend(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">Simulated cost parameter (avg. CPL cost of $15/lead).</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-650">
                    <span>Target Lead-to-Paid Conversion</span>
                    <span className="font-mono text-slate-900">{forecastConvRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={forecastConvRate}
                    onChange={(e) => setForecastConvRate(parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[10px] text-slate-400 font-medium block leading-normal">Assumes average customer contract LTV of $4,800.</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 border rounded-xl space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">Lead Scoring Forecast Matrix</span>
                <div className="flex justify-between text-[11px] border-b pb-1 font-semibold text-slate-650">
                  <span>Threshold Limit:</span>
                  <span>{leadScoreThreshold} score</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={leadScoreThreshold}
                  onChange={(e) => setLeadScoreThreshold(parseInt(e.target.value))}
                  disabled={isReadOnly}
                  className="w-full accent-indigo-600 mb-1"
                />
                <p className="text-[10px] text-slate-400 leading-normal font-medium">Estimated high quality leads: {Math.round(projectedLeads * (1 - leadScoreThreshold / 100))}</p>
              </div>
            </div>

            {/* Projection outputs panel */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Scenario Projections Output</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 border rounded-xl text-center space-y-1 bg-slate-50">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Estimated Leads</span>
                  <div className="text-xl font-black text-indigo-700">{projectedLeads}</div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">Based on $15 CAC CPL</span>
                </div>
                <div className="p-4 border rounded-xl text-center space-y-1 bg-slate-50">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Projected Revenue</span>
                  <div className="text-xl font-black text-emerald-800">${projectedRevenue.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">LTV Contract Value</span>
                </div>
                <div className="p-4 border rounded-xl text-center space-y-1 bg-slate-50">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400">Projected Campaign ROI</span>
                  <div className="text-xl font-black text-violet-850">{projectedRoi}%</div>
                  <span className="text-[10px] text-slate-500 font-medium block mt-1">Revenue vs Ad Spend</span>
                </div>
              </div>

              {/* Predictive Roadmap definitions checklist */}
              <div className="pt-4 border-t space-y-3.5">
                <h4 className="font-bold text-slate-800 text-xs">Predictive Analytics Roadmap Timeline:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                  <div className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <span>1. Lead Scoring Engine</span>
                      <span className="text-[9px] text-slate-450 block font-normal">Classifies prospect priority scores</span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Phase 10 Done</span>
                  </div>
                  <div className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <span>2. Churn Risk Predictor</span>
                      <span className="text-[9px] text-slate-450 block font-normal">Identifies inactive account signals</span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Phase 10 Done</span>
                  </div>
                  <div className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <span>3. Campaign Forecasting</span>
                      <span className="text-[9px] text-slate-450 block font-normal">Outbound ROI predictive graphs</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Operational</span>
                  </div>
                  <div className="p-3 border rounded-xl flex items-center justify-between">
                    <div>
                      <span>4. Revenue Forecasting</span>
                      <span className="text-[9px] text-slate-450 block font-normal">MRR/ARR growth scenario modeler</span>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Operational</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
