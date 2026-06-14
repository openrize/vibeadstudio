"use client";
import { useState, useMemo } from "react";

// Mock lead lifecycle dataset
const INITIAL_LEADS = [
  { id: "ld_1", name: "David Miller", email: "david@vertexsaas.com", company: "Vertex SaaS LLC", stage: "Trial User", source: "SEO", score: 85, date: "2026-06-12" },
  { id: "ld_2", name: "Sarah Connor", email: "sconnor@cyberdyne.org", company: "Cyberdyne Systems", stage: "SQL", source: "Paid Ads", score: 78, date: "2026-06-11" },
  { id: "ld_3", name: "Bruce Wayne", email: "bruce@waynecorp.com", company: "Wayne Enterprises", stage: "Customer", source: "Referrals", score: 95, date: "2026-06-08" },
  { id: "ld_4", name: "Elena Rostova", email: "elena@rostovmarketing.ru", company: "Rostov Marketing Solutions", stage: "MQL", source: "Social Media", score: 62, date: "2026-06-13" },
  { id: "ld_5", name: "John Doe", email: "jdoe@unknown.com", company: "Doe Consultants", stage: "Lead", source: "Direct Outreach", score: 45, date: "2026-06-13" },
];

// Mock sales pipeline deals
const INITIAL_DEALS = [
  { id: "dl_1", title: "Acme Enterprise License", value: 12000, stage: "Proposal", winRate: 75, cycle: "14 days" },
  { id: "dl_2", title: "Horizon White Label Portal", value: 24000, stage: "Negotiation", winRate: 90, cycle: "28 days" },
  { id: "dl_3", title: "Nova Reseller Onboarding", value: 6800, stage: "Discovery", winRate: 40, cycle: "5 days" },
  { id: "dl_4", title: "Prime Custom Integration", value: 18500, stage: "Demo", winRate: 60, cycle: "12 days" },
];

// Mock trials activations
const INITIAL_TRIALS = [
  { id: "tr_1", tenant: "Alpha Retailers", start: "2026-06-05", end: "2026-06-19", progress: 80, brandSetup: "Complete", campaignSetup: "Complete", aiTokensUsed: "145k" },
  { id: "tr_2", tenant: "Delta E-com Group", start: "2026-06-10", end: "2026-06-24", progress: 40, brandSetup: "Complete", campaignSetup: "Pending", aiTokensUsed: "48k" },
  { id: "tr_3", tenant: "Beta Agency Partners", start: "2026-06-12", end: "2026-06-26", progress: 20, brandSetup: "Pending", campaignSetup: "Pending", aiTokensUsed: "8k" },
];

// Mock renewals & success checklist
const INITIAL_RENEWALS = [
  { id: "rn_1", org: "Alpha Retailers", plan: "Growth", renewalDate: "2026-07-05", health: 96, status: "Healthy", trend: "Upward" },
  { id: "rn_2", org: "Wayne Enterprises", plan: "Enterprise", renewalDate: "2026-08-08", health: 94, status: "Healthy", trend: "Stable" },
  { id: "rn_3", org: "Cyberdyne Systems", plan: "Growth", renewalDate: "2026-07-11", health: 65, status: "Medium Risk", trend: "Declining" },
  { id: "rn_4", org: "Rostov Marketing Solutions", plan: "Starter", renewalDate: "2026-06-28", health: 38, status: "High Churn Risk", trend: "Low Usage" },
];

// Mock partner referrals ledger
const INITIAL_PARTNERS = [
  { id: "pt_1", partner: "Horizon Digital Agency", type: "Agency Partner", referrals: 12, revenue: 18400, tier: "Gold Reseller" },
  { id: "pt_2", partner: "SaaS Consultants Inc", type: "Consultant", referrals: 6, revenue: 9200, tier: "Silver Affiliate" },
  { id: "pt_3", partner: "Ecom Gateway Solutions", type: "Technology Provider", referrals: 4, revenue: 14800, tier: "Integration Partner" },
];

export default function CrmBibleWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("leads");
  
  // Local state registers
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [deals, setDeals] = useState(INITIAL_DEALS);
  const [trials, setTrials] = useState(INITIAL_TRIALS);
  const [renewals, setRenewals] = useState(INITIAL_RENEWALS);
  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  // Form states
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadCompany, setNewLeadCompany] = useState("");
  const [newLeadSource, setNewLeadSource] = useState("SEO");

  const [newDealTitle, setNewDealTitle] = useState("");
  const [newDealValue, setNewDealValue] = useState("");
  const [newDealStage, setNewDealStage] = useState("Discovery");

  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerType, setNewPartnerType] = useState("Agency Partner");

  const isReadOnly = currentRole === "read_only";

  // Handlers - Lead Stage mutation & sync
  function handleLeadStageChange(id, nextStage) {
    if (isReadOnly) return;
    const previous = leads.find((l) => l.id === id);
    if (!previous) return;

    setLeads(leads.map((l) => (l.id === id ? { ...l, stage: nextStage } : l)));

    logAction({
      action: "crm_lead_lifecycle_updated",
      details: `Transitioned Lead '${previous.name}' stage: ${previous.stage} -> ${nextStage} (Synced to HubSpot CRM)`,
      status: "success",
      sql: `UPDATE "CrmLeads" SET "lifecycleStage" = '${nextStage}', "updatedAt" = NOW() WHERE "id" = '${id}'`,
    });
    alert(`Lead stage updated to ${nextStage} and synced to HubSpot.`);
  }

  // Handlers - Add Lead
  function handleAddLead(e) {
    e.preventDefault();
    if (!newLeadName.trim() || isReadOnly) return;

    const newL = {
      id: `ld_${Date.now()}`,
      name: newLeadName,
      email: newLeadEmail || "n/a",
      company: newLeadCompany || "Unknown",
      stage: "Lead",
      source: newLeadSource,
      score: 50,
      date: new Date().toISOString().slice(0, 10),
    };

    setLeads([...leads, newL]);

    logAction({
      action: "crm_lead_registered",
      details: `Created new lifecycle lead target: '${newL.name}' (${newL.company}) via Source: ${newL.source}`,
      status: "success",
      sql: `INSERT INTO "CrmLeads" ("name", "email", "company", "lifecycleStage", "source") VALUES ('${newL.name}', '${newL.email}', '${newL.company}', 'Lead', '${newL.source}')`,
    });

    setNewLeadName("");
    setNewLeadEmail("");
    setNewLeadCompany("");
    alert("Lead added to lifecycle directory.");
  }

  // Handlers - Sales Deal mutate
  function handleAddDeal(e) {
    e.preventDefault();
    if (!newDealTitle.trim() || isReadOnly) return;

    const valNum = parseInt(newDealValue) || 5000;
    const newD = {
      id: `dl_${Date.now()}`,
      title: newDealTitle,
      value: valNum,
      stage: newDealStage,
      winRate: newDealStage === "Discovery" ? 20 : newDealStage === "Demo" ? 40 : newDealStage === "Proposal" ? 70 : 85,
      cycle: "1 day",
    };

    setDeals([...deals, newD]);

    logAction({
      action: "crm_deal_registered",
      details: `Registered sales pipeline deal: '${newD.title}' (Value: $${valNum}, Stage: ${newD.stage})`,
      status: "success",
      sql: `INSERT INTO "CrmDeals" ("title", "value", "stage", "winRate") VALUES ('${newD.title}', ${valNum}, '${newD.stage}', ${newD.winRate})`,
    });

    setNewDealTitle("");
    setNewDealValue("");
    alert("Sales pipeline deal registered.");
  }

  // Handlers - Renewals override triggers
  function handleRenewalAction(id, action) {
    if (isReadOnly) return;
    const prev = renewals.find((r) => r.id === id);
    if (!prev) return;

    let nextHealth = prev.health;
    let nextStatus = prev.status;
    let details = "";

    if (action === "Upgrade") {
      nextHealth = 98;
      nextStatus = "Healthy";
      details = `Upgraded subscription for ${prev.org} to Enterprise plan tier.`;
    } else if (action === "Cancel") {
      nextHealth = 0;
      nextStatus = "Cancelled";
      details = `Terminated subscription billing cycle for organization ${prev.org}.`;
    } else if (action === "Renew") {
      nextHealth = 95;
      nextStatus = "Healthy";
      details = `Renewed subscription cycle for ${prev.org}.`;
    }

    setRenewals(
      renewals.map((r) =>
        r.id === id ? { ...r, health: nextHealth, status: nextStatus, trend: action === "Upgrade" ? "Upward" : "Stable" } : r
      )
    );

    logAction({
      action: `crm_subscription_${action.toLowerCase()}`,
      details,
      status: "success",
      sql: `UPDATE "CrmSubscriptions" SET "healthScore" = ${nextHealth}, "status" = '${nextStatus}' WHERE "id" = '${id}'`,
    });
    alert(`Renewal action '${action}' processed successfully!`);
  }

  // Handlers - Partner referral
  function handleAddPartner(e) {
    e.preventDefault();
    if (!newPartnerName.trim() || isReadOnly) return;

    const newP = {
      id: `pt_${Date.now()}`,
      partner: newPartnerName,
      type: newPartnerType,
      referrals: 1,
      revenue: 2500,
      tier: "Affiliate Associate",
    };

    setPartners([...partners, newP]);

    logAction({
      action: "crm_partner_registered",
      details: `Registered partner affiliate: '${newP.partner}' (${newP.type})`,
      status: "success",
      sql: `INSERT INTO "CrmPartners" ("partnerName", "partnerType", "tier") VALUES ('${newP.partner}', '${newP.type}', '${newP.tier}')`,
    });

    setNewPartnerName("");
    alert("Partner node added to referral ledger.");
  }

  // Aggregate stats
  const totalPipelineValue = useMemo(() => {
    return deals.reduce((acc, d) => acc + d.value, 0);
  }, [deals]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">🤝</span>
            CRM Bible Lifecycle Desk
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Track lead stages, sales deals, onboarding velocities, customer reviews, renewals status, and reseller/affiliate partners in a centralized portal.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">HubSpot & Stripe Synced</span>
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Sales Deals Value</span>
          <div className="text-xl font-black text-slate-900 mt-1">${totalPipelineValue.toLocaleString()}</div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">{deals.length} active opportunities</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Average Deal Win Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">66.2% Win</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Average cycle: 14 days</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Trial Users</span>
          <div className="text-xl font-black text-slate-900 mt-1">{trials.length} trials</div>
          <span className="text-[10px] text-indigo-650 font-bold block mt-1">Target conversion: 37%</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Partner Referral Rev</span>
          <div className="text-xl font-black text-slate-900 mt-1">${partners.reduce((a,c)=>a+c.revenue, 0).toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">{partners.length} program nodes</span>
        </div>
      </div>

      {/* Nav Tab switches */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "leads", label: "Lead Lifecycle", icon: "🌱" },
          { id: "deals", label: "Agency Sales Pipeline", icon: "💼" },
          { id: "trials", label: "Trial Activations", icon: "⌛" },
          { id: "success", label: "Customer Success reviews", icon: "🗓️" },
          { id: "renewals", label: "Subscription Renewals", icon: "🔄" },
          { id: "partners", label: "Partner Program", icon: "🧬" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs font-bold rounded-lg transition-all ${
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

      {/* 1. LEAD LIFECYCLE TAB */}
      {activeSubTab === "leads" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEADS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">HubSpot Synced Lead Lifecycle</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Lead Name / Company</th>
                      <th className="pb-2">Source</th>
                      <th className="pb-2">Score</th>
                      <th className="pb-2">Added Date</th>
                      <th className="pb-2">Lifecycle Stage</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((ld) => (
                      <tr key={ld.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-slate-850 block">{ld.name}</span>
                          <span className="text-[10px] text-slate-450 block mt-0.5">{ld.email} | {ld.company}</span>
                        </td>
                        <td className="py-3 font-semibold text-slate-650">{ld.source}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ld.score >= 80 ? "bg-emerald-50 text-emerald-800" :
                            ld.score >= 60 ? "bg-indigo-50 text-indigo-800" : "bg-slate-100 text-slate-600"
                          }`}>{ld.score} pts</span>
                        </td>
                        <td className="py-3 text-slate-500 font-mono text-[10px]">{ld.date}</td>
                        <td className="py-3 font-bold uppercase text-[10px] text-indigo-700">{ld.stage}</td>
                        <td className="py-3 text-right">
                          <select
                            value={ld.stage}
                            onChange={(e) => handleLeadStageChange(ld.id, e.target.value)}
                            disabled={isReadOnly}
                            className="text-[10px] font-bold border rounded-lg p-1 bg-white"
                          >
                            <option value="Lead">Lead</option>
                            <option value="MQL">MQL</option>
                            <option value="SQL">SQL</option>
                            <option value="Trial User">Trial User</option>
                            <option value="Customer">Customer</option>
                            <option value="Advocate">Advocate</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD LEAD FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Register Lead Profile</h3>
              <form onSubmit={handleAddLead} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Prospect Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Elena Rostova"
                    value={newLeadName}
                    onChange={(e) => setNewLeadName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. elena@rostov.ru"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Company</label>
                    <input
                      type="text"
                      placeholder="Wayne Corp"
                      value={newLeadCompany}
                      onChange={(e) => setNewLeadCompany(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Source Channel</label>
                    <select
                      value={newLeadSource}
                      onChange={(e) => setNewLeadSource(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="SEO">SEO</option>
                      <option value="Paid Ads">Paid Ads</option>
                      <option value="Social Media">Social Media</option>
                      <option value="Referrals">Referrals</option>
                      <option value="Direct Outreach">Direct Outreach</option>
                      <option value="Website Forms">Website Forms</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Create HubSpot Lead Node
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 2. AGENCY SALES PIPELINE TAB */}
      {activeSubTab === "deals" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* STAGES BOARD */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Sales Pipeline deals ledger</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Discovery", "Demo", "Proposal", "Negotiation"].map((stage) => {
                  const stageDeals = deals.filter((d) => d.stage === stage);
                  const stageSum = stageDeals.reduce((a,c) => a + c.value, 0);
                  return (
                    <div key={stage} className="p-3 border border-slate-100 bg-slate-50 rounded-xl space-y-3">
                      <div className="flex justify-between items-center border-b pb-1.5">
                        <span className="text-[10px] font-extrabold uppercase text-slate-550">{stage}</span>
                        <span className="text-[10px] font-black text-indigo-700 bg-white border px-1.5 py-0.5 rounded-full">${stageSum.toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {stageDeals.length === 0 ? (
                          <span className="text-[10px] text-slate-400 block italic">No deals</span>
                        ) : (
                          stageDeals.map((d) => (
                            <div key={d.id} className="p-2 border border-slate-200 bg-white rounded-lg space-y-1 hover:shadow-sm">
                              <span className="font-bold text-[11px] text-slate-800 block truncate">{d.title}</span>
                              <div className="flex justify-between text-[9px] font-semibold text-slate-500">
                                <span>LTV: ${d.value}</span>
                                <span>{d.winRate}% win</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ADD DEAL FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Create Deal pipeline opportunity</h3>
              <form onSubmit={handleAddDeal} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Deal Title / Account name</label>
                  <input
                    type="text"
                    placeholder="e.g. Horizon Reseller Portal"
                    value={newDealTitle}
                    onChange={(e) => setNewDealTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Deal Value ($)</label>
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      value={newDealValue}
                      onChange={(e) => setNewDealValue(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                      disabled={isReadOnly}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Pipeline Stage</label>
                    <select
                      value={newDealStage}
                      onChange={(e) => setNewDealStage(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="Discovery">Discovery</option>
                      <option value="Demo">Demo</option>
                      <option value="Proposal">Proposal</option>
                      <option value="Negotiation">Negotiation</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Log Pipeline Deal
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 3. TRIAL ACTIVATIONS TAB */}
      {activeSubTab === "trials" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active Trial Activations progress tracker</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {trials.map((tr) => (
                <div key={tr.id} className="p-4 border rounded-xl space-y-4 hover:shadow-sm bg-slate-50/50">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-slate-850 text-xs block">{tr.tenant}</span>
                    <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Active Trial</span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Timeline:</span>
                      <span className="font-mono text-slate-800">{tr.start} to {tr.end}</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>Activation Progress:</span>
                        <span>{tr.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${tr.progress}%` }} />
                      </div>
                    </div>

                    <div className="flex justify-between text-slate-500 font-semibold mt-1">
                      <span>Brand Guideline Setup:</span>
                      <span className={`font-bold ${tr.brandSetup === "Complete" ? "text-emerald-600" : "text-amber-600 animate-pulse"}`}>{tr.brandSetup}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Campaign Configuration:</span>
                      <span className={`font-bold ${tr.campaignSetup === "Complete" ? "text-emerald-600" : "text-amber-600 animate-pulse"}`}>{tr.campaignSetup}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>AI Tokens Consumed:</span>
                      <span className="font-mono text-slate-800 font-bold">{tr.aiTokensUsed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. CUSTOMER SUCCESS REVIEWS TAB */}
      {activeSubTab === "success" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Milestones CS Check-ins board (30 / 60 / 90 Days)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { milestone: "30-Day Check-in", desc: "Lock down Brand voice contexts & setup initial campaigns.", done: ["Alpha Retailers", "Wayne Enterprises", "Vertex SaaS LLC"], pending: ["Cyberdyne Systems"] },
                { milestone: "60-Day Success Review", desc: "A/B test campaign conversions and evaluate ROI ratios.", done: ["Wayne Enterprises"], pending: ["Alpha Retailers", "Vertex SaaS LLC"] },
                { milestone: "90-Day Success Expansion", desc: "Upsell white-label resellers limits & increase API tokens bounds.", done: [], pending: ["Wayne Enterprises"] },
              ].map((cs, idx) => (
                <div key={idx} className="p-4 border rounded-xl space-y-3 bg-slate-50/50 hover:shadow-sm">
                  <span className="font-bold text-xs text-indigo-850 block">{cs.milestone}</span>
                  <p className="text-[10px] text-slate-400 font-medium leading-normal">{cs.desc}</p>
                  
                  <div className="space-y-2 pt-2 border-t text-xs">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block">Completed Checkpoint:</span>
                    <div className="flex flex-wrap gap-1">
                      {cs.done.length === 0 ? (
                        <span className="text-[10px] text-slate-450 italic">None completed</span>
                      ) : (
                        cs.done.map((org, oidx) => (
                          <span key={oidx} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[9px] font-bold">{org}</span>
                        ))
                      )}
                    </div>
                    
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold block mt-2">Checkpoints Pending:</span>
                    <div className="flex flex-wrap gap-1">
                      {cs.pending.map((org, pidx) => (
                        <span key={pidx} className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-100 rounded text-[9px] font-bold animate-pulse">{org}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBSCRIPTION RENEWALS TAB */}
      {activeSubTab === "renewals" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active Stripe subscription renewals ledger</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                    <th className="pb-2">Organization Name</th>
                    <th className="pb-2">Allocated Plan</th>
                    <th className="pb-2">Renewal Date</th>
                    <th className="pb-2">Customer Health</th>
                    <th className="pb-2">Usage Trend</th>
                    <th className="pb-2 text-right">Lifecycle Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {renewals.map((rn) => (
                    <tr key={rn.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 font-bold text-slate-850">{rn.org}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 bg-slate-100 border rounded text-[9px] font-bold uppercase text-slate-650">{rn.plan}</span>
                      </td>
                      <td className="py-3 text-slate-500 font-mono text-[10px]">{rn.renewalDate}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${rn.health > 80 ? "bg-emerald-500" : rn.health > 50 ? "bg-amber-500" : "bg-rose-500"}`} style={{ width: `${rn.health}%` }} />
                          </div>
                          <span className="font-mono font-bold">{rn.health}%</span>
                        </div>
                      </td>
                      <td className="py-3 font-semibold text-slate-600">{rn.trend}</td>
                      <td className="py-3 text-right space-x-1">
                        <button
                          onClick={() => handleRenewalAction(rn.id, "Renew")}
                          disabled={isReadOnly || rn.status === "Cancelled"}
                          className="px-2 py-0.5 bg-slate-900 text-white rounded text-[9px] font-bold hover:bg-slate-800 disabled:opacity-40"
                        >
                          Renew
                        </button>
                        <button
                          onClick={() => handleRenewalAction(rn.id, "Upgrade")}
                          disabled={isReadOnly || rn.status === "Cancelled"}
                          className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[9px] font-bold hover:bg-indigo-500 disabled:opacity-40"
                        >
                          Upgrade
                        </button>
                        <button
                          onClick={() => handleRenewalAction(rn.id, "Cancel")}
                          disabled={isReadOnly || rn.status === "Cancelled"}
                          className="px-2 py-0.5 bg-rose-600 text-white rounded text-[9px] font-bold hover:bg-rose-500 disabled:opacity-40"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. PARTNER PROGRAM TAB */}
      {activeSubTab === "partners" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* PARTNERS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Referrals & Affiliates program registry</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Partner Entity</th>
                      <th className="pb-2">Partner Type</th>
                      <th className="pb-2">Total Referrals</th>
                      <th className="pb-2">Referred Revenue</th>
                      <th className="pb-2 text-right">Partner Tier Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map((pt) => (
                      <tr key={pt.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-850">{pt.partner}</td>
                        <td className="py-3 font-semibold text-slate-650">{pt.type}</td>
                        <td className="py-3 font-bold text-indigo-700">{pt.referrals} accounts</td>
                        <td className="py-3 font-bold text-emerald-800">${pt.revenue}</td>
                        <td className="py-3 text-right">
                          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 rounded text-[9px] font-black uppercase text-indigo-850">
                            {pt.tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD PARTNER FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Register Partner affiliate</h3>
              <form onSubmit={handleAddPartner} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Partner Node Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Tech Providers"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Partner Type</label>
                  <select
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="Agency Partner">Agency Partner</option>
                    <option value="Consultant">Consultant</option>
                    <option value="Technology Provider">Technology Provider</option>
                    <option value="Affiliate">Affiliate</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Confirm Partner Setup
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
