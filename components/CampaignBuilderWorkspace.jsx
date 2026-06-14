"use client";
import { useState, useMemo } from "react";

const INITIAL_CAMPAIGNS = [
  { id: "cmp_1", name: "Summer SaaS Launch", goal: "Lead Generation", status: "Active", channels: ["linkedin", "facebook", "email", "landing"], leads: 342, conversions: 48, cost: 680, clicks: 1200, impressions: 24000, revenue: 3840 },
  { id: "cmp_2", name: "Product Video Promo", goal: "Brand Awareness", status: "Active", channels: ["facebook", "instagram"], leads: 82, conversions: 12, cost: 240, clicks: 450, impressions: 8900, revenue: 960 },
  { id: "cmp_3", name: "Q2 Newsletter Drive", goal: "Customer Retention", status: "Completed", channels: ["email"], leads: 154, conversions: 24, cost: 50, clicks: 780, impressions: 1500, revenue: 1920 },
];

const INITIAL_LEADS = [
  { id: "ld_1", name: "Pratik Patel", email: "pratik@vibeadstudio.com", phone: "555-0199", company: "VibeStudio", source: "linkedin", medium: "organic", campaign: "Summer SaaS Launch", date: "2026-06-13T12:00:00Z" },
  { id: "ld_2", name: "Elon Musk", email: "elon@tesla.com", phone: "555-0100", company: "Tesla", source: "google", medium: "cpc", campaign: "Product Video Promo", date: "2026-06-13T15:20:00Z" },
  { id: "ld_3", name: "Jeff Bezos", email: "jeff@amazon.com", phone: "555-0122", company: "Amazon", source: "email", medium: "newsletter", campaign: "Q2 Newsletter Drive", date: "2026-06-12T09:40:00Z" },
];

const INITIAL_RULES = [
  { id: "rul_1", trigger: "Form Submission", action: "Send Welcome Email & Create CRM Task", active: true },
  { id: "rul_2", trigger: "Email Open", action: "Notify Account Manager in Slack", active: true },
  { id: "rul_3", trigger: "Link Click", action: "Launch Retargeting Sequence Sequence", active: false },
  { id: "rul_4", trigger: "Purchase", action: "Dispatch Customer Invoice & Upgrade Tier", active: true },
];

export default function CampaignBuilderWorkspace({ strategy, onNavigate, currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("wizard");

  // Local state registers
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [leadsList, setLeadsList] = useState(INITIAL_LEADS);
  const [rules, setRules] = useState(INITIAL_RULES);

  // Campaign Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizGoal, setWizGoal] = useState("Lead Generation");
  const [wizAudience, setWizAudience] = useState("SaaS developers & project managers looking to scale");
  const [wizChannels, setWizChannels] = useState(["linkedin", "email", "landing"]);
  const [wizName, setWizName] = useState("");
  const [wizHeadline, setWizHeadline] = useState("");
  const [wizDescription, setWizDescription] = useState("");
  const [wizCta, setWizCta] = useState("Get Started Free");

  // Landing Page configuration state
  const [lpTemplate, setLpTemplate] = useState("Cyberpunk Premium Dark");
  const [lpFields, setLpFields] = useState(["Name", "Email", "Company"]);
  const [lpTitle, setLpTitle] = useState("Supercharge Campaign Setup using AI Operating System");

  // Lead Capture Simulator Form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadUtmSource, setLeadUtmSource] = useState("google");
  const [leadUtmMedium, setLeadUtmMedium] = useState("cpc");
  const [leadUtmCampaign, setLeadUtmCampaign] = useState("Summer SaaS Launch");

  // A/B variant test state
  const [abWinningVariant, setAbWinningVariant] = useState("Variant B");

  // Rule creation states
  const [newRuleTrigger, setNewRuleTrigger] = useState("Form Submission");
  const [newRuleAction, setNewRuleAction] = useState("Send Email");

  const isReadOnly = currentRole === "read_only";

  // Calculate Metrics
  const totalLeads = leadsList.length;
  const totalClicks = campaigns.reduce((acc, c) => acc + c.clicks, 0);
  const totalImpressions = campaigns.reduce((acc, c) => acc + c.impressions, 0);
  const totalSpent = campaigns.reduce((acc, c) => acc + c.cost, 0);
  const totalRevenue = campaigns.reduce((acc, c) => acc + c.revenue, 0);
  const averageCPL = totalSpent / totalLeads;
  const totalROI = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent) * 100 : 0;

  // Handlers - Wizard Steps navigation
  function handleNextWizardStep() {
    if (wizardStep === 4) {
      // Step 4 is Generate: Infer copy suggestions using Goal/Audience
      let inferredHeadline = "Automate Full-Funnel Campaigns Instantly";
      let inferredDescription = "Deploy custom landing pages, ad copies, and email automations grounding on brand guidelines in minutes.";
      let inferredCta = "Launch Your Strategy";

      if (wizGoal === "Brand Awareness") {
        inferredHeadline = "Introducing the Marketing OS Ecosystem";
        inferredDescription = "Scale content output, maintain absolute brand consistency, and reach custom target audiences.";
        inferredCta = "Learn More";
      } else if (wizGoal === "Customer Retention") {
        inferredHeadline = "Special Growth Perks for Premium Users";
        inferredDescription = "Upgrade to Agency tier, set custom markups domain reseller, and unlock unlimited tokens.";
        inferredCta = "Claim Reward";
      }

      setWizHeadline(inferredHeadline);
      setWizDescription(inferredDescription);
      setWizCta(inferredCta);
      setWizName(`${wizGoal.split(" ")[0]} Campaign - ${new Date().toISOString().slice(0, 10)}`);
    }
    setWizardStep(prev => Math.min(6, prev + 1));
  }

  function handlePrevWizardStep() {
    setWizardStep(prev => Math.max(1, prev - 1));
  }

  // Handlers - Launch Campaign
  function handleLaunchCampaign() {
    if (isReadOnly) return;
    const newCamp = {
      id: `cmp_${Date.now()}`,
      name: wizName,
      goal: wizGoal,
      status: "Active",
      channels: wizChannels,
      leads: 0,
      conversions: 0,
      cost: 100, // standard base spend
      clicks: 0,
      impressions: 0,
      revenue: 0
    };

    setCampaigns([newCamp, ...campaigns]);

    logAction({
      action: "campaign_launched",
      details: `Created & launched multi-channel campaign: '${newCamp.name}' (Goal: ${newCamp.goal}, Channels: ${newCamp.channels.join(", ")})`,
      status: "success",
      sql: `INSERT INTO "Campaigns" ("name", "goal", "status", "cost") VALUES ('${newCamp.name}', '${newCamp.goal}', 'Active', 100)`
    });

    // Reset Wizard
    setWizardStep(1);
    setWizGoal("Lead Generation");
    setWizAudience("");
    setWizChannels(["linkedin", "email", "landing"]);
    alert(`Campaign '${newCamp.name}' successfully deployed to channels and attribution active!`);
    setActiveSubTab("monitor");
  }

  // Handlers - Toggle Channel checkbox
  function handleToggleWizChannel(channelId) {
    if (wizChannels.includes(channelId)) {
      setWizChannels(wizChannels.filter(c => c !== channelId));
    } else {
      setWizChannels([...wizChannels, channelId]);
    }
  }

  // Handlers - Lead Capture Simulation Submit
  function handleLeadSubmit(e) {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;

    const newLead = {
      id: `ld_${Date.now()}`,
      name: leadName,
      email: leadEmail,
      phone: leadPhone || "N/A",
      company: leadCompany || "N/A",
      source: leadUtmSource,
      medium: leadUtmMedium,
      campaign: leadUtmCampaign,
      date: new Date().toISOString()
    };

    setLeadsList([newLead, ...leadsList]);

    logAction({
      action: "lead_captured_crm",
      details: `Attribution Tracked: Captured lead '${newLead.name}' (Source: ${newLead.source}, Medium: ${newLead.medium}, Campaign: ${newLead.campaign})`,
      status: "success",
      sql: `INSERT INTO "Leads" ("name", "email", "phone", "company", "utmSource", "utmMedium") VALUES ('${newLead.name}', '${newLead.email}', '${newLead.phone}', '${newLead.company}', '${newLead.source}', '${newLead.medium}')`
    });

    // Increment metrics on the selected campaign
    setCampaigns(prev =>
      prev.map(c => {
        if (c.name === leadUtmCampaign) {
          return {
            ...c,
            leads: c.leads + 1,
            conversions: c.conversions + 1,
            clicks: c.clicks + 3, // mock clicks increments
            impressions: c.impressions + 12,
            revenue: c.revenue + 80 // mock average conversion LTV
          };
        }
        return c;
      })
    );

    setLeadName("");
    setLeadEmail("");
    setLeadPhone("");
    setLeadCompany("");
    alert("Lead successfully captured and synced to CRM table.");
  }

  // Handlers - Automations Toggle Rule
  function handleToggleRule(ruleId, ruleTrigger, activeState) {
    if (isReadOnly) return;
    setRules(prev =>
      prev.map(r => {
        if (r.id === ruleId) {
          logAction({
            action: activeState ? "automation_rule_disabled" : "automation_rule_enabled",
            details: `Mutated automation rule for trigger: '${ruleTrigger}' to ${!activeState ? "ENABLED" : "DISABLED"}`,
            status: !activeState ? "success" : "warning",
            sql: `UPDATE "AutomationRules" SET "active" = ${!activeState} WHERE "id" = '${ruleId}'`
          });
          return { ...r, active: !activeState };
        }
        return r;
      })
    );
  }

  function handleCreateRule(e) {
    e.preventDefault();
    if (isReadOnly) return;

    const newRule = {
      id: `rul_${Date.now()}`,
      trigger: newRuleTrigger,
      action: newRuleAction,
      active: true
    };

    setRules([...rules, newRule]);

    logAction({
      action: "automation_rule_created",
      details: `Created automation rule: When '${newRule.trigger}' then do '${newRule.action}'`,
      status: "success",
      sql: `INSERT INTO "AutomationRules" ("trigger", "action", "active") VALUES ('${newRule.trigger}', '${newRule.action}', true)`
    });

    alert("New automation trigger action saved.");
  }

  // Handlers - Landing Page Form toggle
  function handleToggleLpField(field) {
    if (lpFields.includes(field)) {
      setLpFields(lpFields.filter(f => f !== field));
    } else {
      setLpFields([...lpFields, field]);
    }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-sm shadow">🚀</span>
            Campaign Studio Workspace
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Build multi-channel campaign flows, optimize funnel conversions, manage landing page forms, configure triggers, and track CRM leads.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Attribution Attribution Logs Active</span>
        </div>
      </div>

      {/* Portal tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "wizard", label: "Campaign Wizard", icon: "🧙‍♂️" },
          { id: "monitor", label: "Active Campaigns", icon: "📋" },
          { id: "funnel", label: "Funnels & A/B testing", icon: "🌪️" },
          { id: "landing", label: "Landing Pages", icon: "📄" },
          { id: "automations", label: "Automations triggers", icon: "⚙️" },
          { id: "crm", label: "Lead Capture CRM", icon: "👤" },
          { id: "analytics", label: "Attribution Analytics", icon: "📈" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
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

      {/* 1. CAMPAIGN CREATION WIZARD */}
      {activeSubTab === "wizard" && (
        <div className="card p-6 border border-slate-200 bg-white space-y-6 max-w-3xl mx-auto">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase text-slate-450 tracking-wider">
              <span>Step {wizardStep} of 6: {
                wizardStep === 1 ? "Select Campaign Goal" :
                wizardStep === 2 ? "Select Target Audience" :
                wizardStep === 3 ? "Select Marketing Channels" :
                wizardStep === 4 ? "Review Generated AI Assets" :
                wizardStep === 5 ? "Configure Automation triggers" : "Launch & Deploy Campaign"
              }</span>
              <span>{Math.floor((wizardStep / 6) * 100)}% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-violet-600 rounded-full transition-all duration-300" style={{ width: `${(wizardStep / 6) * 100}%` }} />
            </div>
          </div>

          <div className="min-h-[220px] py-4">
            {/* STEP 1: Goal Select */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campaign Goal</span>
                <p className="text-xs text-slate-500 font-medium">Select the primary business outcome you want to generate with this campaign:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Lead Generation",
                    "Brand Awareness",
                    "Product Launch",
                    "Event Promotion",
                    "Customer Retention",
                    "Referral Campaigns",
                  ].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setWizGoal(goal)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition ${
                        wizGoal === goal
                          ? "border-violet-600 bg-violet-50/20 text-violet-900"
                          : "border-slate-200 hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Target Audience */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Buyer Persona</span>
                <p className="text-xs text-slate-500 font-medium">Describe your ideal target audience segment to orient the AI strategist engine:</p>
                <textarea
                  value={wizAudience}
                  onChange={(e) => setWizAudience(e.target.value)}
                  placeholder="e.g. Small business owners in North America needing lead generation tools..."
                  className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-28 leading-relaxed font-semibold text-slate-800"
                />
              </div>
            )}

            {/* STEP 3: Channels checkboxes */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Marketing Channels</span>
                <p className="text-xs text-slate-500 font-medium">Choose channels to broadcast campaign assets and track UTM attribution:</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { id: "linkedin", label: "LinkedIn Social Posts" },
                    { id: "facebook", label: "Facebook Target Ads" },
                    { id: "instagram", label: "Instagram Visuals" },
                    { id: "twitter", label: "X / Twitter Threads" },
                    { id: "email", label: "Email Newsletter Blast" },
                    { id: "landing", label: "Landing Capture Page" },
                  ].map((chan) => {
                    const checked = wizChannels.includes(chan.id);
                    return (
                      <button
                        key={chan.id}
                        type="button"
                        onClick={() => handleToggleWizChannel(chan.id)}
                        className={`p-3 rounded-xl border text-left font-bold transition flex items-center justify-between ${
                          checked
                            ? "border-violet-600 bg-violet-50/20 text-violet-900"
                            : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>{chan.label}</span>
                        <span>{checked ? "✅" : "➕"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Review Copy Preview */}
            {wizardStep === 4 && (
              <div className="space-y-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Copy Assets generated</span>
                <p className="text-slate-500 font-medium leading-relaxed">The AI strategy engine compiled these channel assets for your target goal:</p>

                <div className="border border-slate-100 p-4 rounded-xl bg-slate-50 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Campaign Name</label>
                    <input
                      type="text"
                      value={wizName}
                      onChange={(e) => setWizName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-violet-400 font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Suggested Headline</label>
                    <input
                      type="text"
                      value={wizHeadline}
                      onChange={(e) => setWizHeadline(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-violet-400 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Suggested Description / Body Copy</label>
                    <textarea
                      value={wizDescription}
                      onChange={(e) => setWizDescription(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-violet-400 h-20 leading-relaxed"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Call To Action (CTA)</label>
                    <input
                      type="text"
                      value={wizCta}
                      onChange={(e) => setWizCta(e.target.value)}
                      className="w-2/3 mt-1 px-3 py-1.5 border rounded-lg bg-white outline-none focus:ring-1 focus:ring-violet-400 font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Automations Trigger */}
            {wizardStep === 5 && (
              <div className="space-y-4 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Automate Campaign Sequence</span>
                <p className="text-slate-500 font-medium">Select the automation trigger sequence to link to this campaign:</p>
                
                <div className="space-y-3.5">
                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Trigger: Form Submission</span>
                      <p className="text-[10px] text-slate-450 block mt-0.5">When a prospect signs up on your landing page forms</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Send Welcome Email</span>
                  </div>

                  <div className="p-3 border rounded-xl bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Action: Task Assignment</span>
                      <p className="text-[10px] text-slate-450 block mt-0.5">Auto-create task inside team collaboration panel</p>
                    </div>
                    <span className="bg-indigo-150 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Notify Account Manager</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Launch */}
            {wizardStep === 6 && (
              <div className="space-y-4 text-center py-6">
                <span className="text-3xl">🚀</span>
                <h4 className="font-bold text-slate-900 text-sm">Campaign Setup Complete!</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  We are ready to deploy assets to your connected channels (WordPress, LinkedIn, Mailchimp) and launch UTM attribution trackers.
                </p>
                {isReadOnly && (
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-800 max-w-xs mx-auto">
                    ⚠️ Your preview session role is configured as <strong>Read Only</strong>. Switch role to launch campaigns.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              type="button"
              onClick={handlePrevWizardStep}
              disabled={wizardStep === 1}
              className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Back
            </button>
            {wizardStep < 6 ? (
              <button
                type="button"
                onClick={handleNextWizardStep}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLaunchCampaign}
                disabled={isReadOnly}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-750 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
              >
                Launch Campaign Live
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. ACTIVE CAMPAIGNS MONITOR */}
      {activeSubTab === "monitor" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Operational Campaigns Queue</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                    <th className="pb-2">Campaign Name</th>
                    <th className="pb-2">Goal Outcome</th>
                    <th className="pb-2">Channels Active</th>
                    <th className="pb-2">Impressions / Clicks</th>
                    <th className="pb-2">Leads / Revenue</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 pr-2">
                        <span className="font-bold text-slate-850 block">{c.name}</span>
                        <span className="text-[10px] text-slate-450 block mt-0.5">Budget Spend: ${c.cost}</span>
                      </td>
                      <td className="py-3 font-semibold text-slate-600">{c.goal}</td>
                      <td className="py-3">
                        <div className="flex gap-1.5 flex-wrap">
                          {c.channels.map((chan) => (
                            <span key={chan} className="px-1.5 py-0.5 bg-slate-100 border rounded text-[8px] font-bold uppercase text-slate-500">{chan}</span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800">{c.impressions.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-400 block">{c.clicks.toLocaleString()} clicks</span>
                      </td>
                      <td className="py-3">
                        <span className="font-bold text-slate-800">{c.leads} leads</span>
                        <span className="text-[10px] text-emerald-600 font-bold block">${c.revenue} LTV</span>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          c.status === "Active" ? "bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse" :
                          "bg-slate-200 text-slate-600"
                        }`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. FUNNELS & A/B TESTING */}
      {activeSubTab === "funnel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* FUNNEL DROP-OFFS */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Full-Funnel Drop-Off Velocities</h3>
              
              <div className="space-y-5 py-2">
                {[
                  { stage: "1. Impressions (Traffic)", val: "100%", count: "24,000 users", desc: "Viewed ads or search listings", color: "bg-violet-600" },
                  { stage: "2. Landing Clicks (Leads)", val: "5.6%", count: "1,344 clicks", desc: "Engaged to review value proposition", color: "bg-indigo-500" },
                  { stage: "3. Form Submission (Nurture)", val: "1.4%", count: "342 leads", desc: "Submitted Name/Email form fields", color: "bg-fuchsia-500" },
                  { stage: "4. Sale / Client Convert (LTV)", val: "0.2%", count: "48 conversions", desc: "Upgraded subscription plan check", color: "bg-cyan-500" },
                ].map((s, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center font-bold text-slate-850">
                      <span>{s.stage}</span>
                      <div className="text-right">
                        <span>{s.val}</span>
                        <span className="text-[10px] text-slate-450 font-normal block">{s.count}</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: s.val }} />
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* A/B TEST SUITE */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Headline Variant A/B testing</h3>
              
              <div className="space-y-4 text-xs leading-relaxed">
                <div>
                  <span className="text-[9px] font-bold text-slate-450 uppercase block">Test Title</span>
                  <span className="font-bold text-slate-800 block">Lead Capture LP Title Optimisation</span>
                </div>

                <div className="space-y-3">
                  <div className="border border-slate-150 p-2.5 rounded-xl bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Variant A (Control)</span>
                      <span className="text-[10px] text-slate-400 font-bold">CTR: 3.2%</span>
                    </div>
                    <p className="italic text-slate-500 mt-1">&quot;Refine Campaign Setup Instantly&quot;</p>
                  </div>

                  <div className="border border-indigo-200 p-2.5 rounded-xl bg-indigo-50/10">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-900 flex items-center gap-1">Variant B (Winner) ⭐</span>
                      <span className="text-[10px] text-indigo-700 font-bold">CTR: 5.6%</span>
                    </div>
                    <p className="italic text-slate-650 mt-1">&quot;Deploy AI marketing funnels in minutes&quot;</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Set Winning Variant</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setAbWinningVariant("Variant A");
                        logAction({
                          action: "ab_test_winner_set",
                          details: "Selected Variant A as primary headline copy in brand guidelines",
                          status: "info"
                        });
                        alert("Variant A set as primary.");
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${
                        abWinningVariant === "Variant A" ? "bg-slate-900 border-slate-900 text-white" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      Use Variant A
                    </button>
                    <button
                      onClick={() => {
                        setAbWinningVariant("Variant B");
                        logAction({
                          action: "ab_test_winner_set",
                          details: "Selected Variant B as primary headline copy in brand guidelines",
                          status: "success"
                        });
                        alert("Variant B set as primary.");
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold transition ${
                        abWinningVariant === "Variant B" ? "bg-slate-900 border-slate-900 text-white" : "hover:bg-slate-50 text-slate-700"
                      }`}
                    >
                      Use Variant B
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. LANDING PAGES */}
      {activeSubTab === "landing" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CONFIG PANEL */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Page Layout Customization</h3>
              
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Template Style</label>
                  <select
                    value={lpTemplate}
                    onChange={(e) => setLpTemplate(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="Cyberpunk Premium Dark">Cyberpunk Premium Dark</option>
                    <option value="Minimal Corporate Clean">Minimal Corporate Clean</option>
                    <option value="Neon Creative Glassmorphism">Neon Creative Glassmorphism</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Landing page Header Title</label>
                  <input
                    type="text"
                    value={lpTitle}
                    onChange={(e) => setLpTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded-xl bg-slate-50 font-medium outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Lead Capture Form fields</span>
                  <div className="space-y-2 font-semibold text-slate-650">
                    {["Name", "Email", "Phone", "Company"].map((fld) => {
                      const checked = lpFields.includes(fld);
                      return (
                        <div key={fld} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`fld-${fld}`}
                            checked={checked}
                            onChange={() => handleToggleLpField(fld)}
                            className="rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                          />
                          <label htmlFor={`fld-${fld}`} className="cursor-pointer">{fld} Field</label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    logAction({
                      action: "landing_template_saved",
                      details: `Saved landing page layout settings (Template: ${lpTemplate}, Fields: ${lpFields.join(", ")})`,
                      status: "success"
                    });
                    alert("Landing page settings saved. Layout scaffold refreshed.");
                  }}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Save Canvas Settings
                </button>
              </div>
            </div>

            {/* LIVE CANVAS PREVIEW */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                <span>Layout Canvas Preview Mockup</span>
                <span className="bg-slate-100 border px-2 py-0.5 rounded text-[8px] font-black uppercase text-slate-500">Live Canvas Rendering</span>
              </h3>

              {/* Mockup LP rendering */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-950 text-white space-y-6 font-sans">
                {/* LP Header */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 border-b border-slate-900 pb-3">
                  <span className="font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">⚡ AI Marketing Studio</span>
                  <div className="flex gap-3 font-semibold">
                    <span>Features</span>
                    <span>Pricing</span>
                    <span>Contact</span>
                  </div>
                </div>

                {/* Hero section */}
                <div className="text-center space-y-3.5 py-6">
                  <h1 className="text-xl md:text-2xl font-black bg-gradient-to-r from-white via-indigo-100 to-cyan-300 bg-clip-text text-transparent tracking-tight leading-tight">
                    {lpTitle}
                  </h1>
                  <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
                    Connected to the platform ecosystem. Attributing campaign UTM analytics parameters directly into CRM dashboard.
                  </p>
                </div>

                {/* Lead Form */}
                <div className="max-w-xs mx-auto bg-slate-900/60 p-5 rounded-xl border border-slate-900 space-y-3.5">
                  <h4 className="text-xs font-bold text-slate-350 text-center uppercase tracking-wide">Request Access Demo</h4>
                  <div className="space-y-2 text-[10px]">
                    {lpFields.map((field) => (
                      <div key={field}>
                        <input
                          type="text"
                          placeholder={`Enter your ${field.toLowerCase()}...`}
                          className="w-full bg-slate-950 border border-slate-900 rounded-lg px-2.5 py-2 text-slate-100 outline-none placeholder:text-slate-600 focus:border-violet-600"
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] font-bold shadow-md shadow-violet-900/20">
                    {wizCta}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. AUTOMATIONS */}
      {activeSubTab === "automations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* RULES LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Trigger Action Workflow Sequences</h3>
              
              <div className="space-y-3">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-3 border border-slate-150 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">Trigger: {rule.trigger}</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${rule.active ? "bg-emerald-500" : "bg-slate-350"}`} />
                      </div>
                      <span className="text-[10px] text-slate-450 block mt-0.5">Action: {rule.action}</span>
                    </div>

                    <div>
                      <button
                        onClick={() => handleToggleRule(rule.id, rule.trigger, rule.active)}
                        disabled={isReadOnly}
                        className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
                          rule.active ? "bg-violet-600 justify-end" : "bg-slate-200 justify-start"
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE RULE FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Create Trigger Action Rule</h3>
              <form onSubmit={handleCreateRule} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Trigger Condition</label>
                  <select
                    value={newRuleTrigger}
                    onChange={(e) => setNewRuleTrigger(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="Form Submission">Form Submission</option>
                    <option value="Email Open">Email Open</option>
                    <option value="Link Click">Link Click</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Inactivity">Inactivity</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Automated Action</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="Send Welcome Email">Send Welcome Email</option>
                    <option value="Create Task & Assign member">Create Task & Assign member</option>
                    <option value="Notify Team in Slack">Notify Team in Slack</option>
                    <option value="Launch Retargeting Sequence">Launch Retargeting Sequence</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Save Automation Rule
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 6. CRM LEADS & ATTRIBUTION */}
      {activeSubTab === "crm" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* LEADS REGISTER */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Attribution CRM Lead Database</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Name / Company</th>
                      <th className="pb-2">Contact details</th>
                      <th className="pb-2">UTM Source / Medium</th>
                      <th className="pb-2">Campaign Origin</th>
                      <th className="pb-2 text-right">Capture Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leadsList.map((lead) => (
                      <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-slate-800 block">{lead.name}</span>
                          <span className="text-[10px] text-slate-450 font-bold block mt-0.5">{lead.company}</span>
                        </td>
                        <td className="py-3">
                          <span className="font-bold text-slate-850 block">{lead.email}</span>
                          <span className="text-[10px] text-slate-450 block mt-0.5">Phone: {lead.phone}</span>
                        </td>
                        <td className="py-3">
                          <span className="bg-indigo-50 border border-indigo-100 text-indigo-750 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase">{lead.source}</span>
                          <span className="text-[10px] text-slate-500 font-semibold uppercase block mt-1">{lead.medium}</span>
                        </td>
                        <td className="py-3 font-semibold text-slate-600">{lead.campaign}</td>
                        <td className="py-3 text-right text-slate-500 font-mono text-[10px]">
                          {new Date(lead.date).toISOString().replace("T", " ").slice(0, 16)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIMULATE LEAD CAPTURE FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Simulate Form Capture</h3>
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Prospect Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@work.com"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Phone</label>
                    <input
                      type="text"
                      placeholder="555-0100"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Company</label>
                    <input
                      type="text"
                      placeholder="InnoCorp"
                      value={leadCompany}
                      onChange={(e) => setLeadCompany(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t pt-3 mt-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">UTM Source</label>
                    <select
                      value={leadUtmSource}
                      onChange={(e) => setLeadUtmSource(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="google">google</option>
                      <option value="linkedin">linkedin</option>
                      <option value="facebook">facebook</option>
                      <option value="email">email</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">UTM Medium</label>
                    <select
                      value={leadUtmMedium}
                      onChange={(e) => setLeadUtmMedium(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="cpc">cpc</option>
                      <option value="organic">organic</option>
                      <option value="newsletter">newsletter</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Origin Attribution Campaign</label>
                  <select
                    value={leadUtmCampaign}
                    onChange={(e) => setLeadUtmCampaign(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none"
                  >
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                >
                  Capture Lead
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 7. ATTRIBUTION ANALYTICS */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Impressions / Clicks</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalImpressions.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ {totalClicks.toLocaleString()}</span></div>
              <span className="text-[10px] text-indigo-650 font-bold block mt-1">CTR: {((totalClicks / totalImpressions) * 100).toFixed(2)}% avg</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Leads CRM</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalLeads} leads</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">14% landing conversions</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Cost Per Lead (CPL)</span>
              <div className="text-xl font-black text-slate-900 mt-1">${averageCPL.toFixed(2)}</div>
              <span className="text-[10px] text-violet-650 font-bold block mt-1">Target cap: &lt; $5.00</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Estimated ROI</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalROI.toFixed(0)}% ROI</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">LTV revenue: ${totalRevenue}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* UTM Source breakdown charts */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2">UTM Source Traffic attribution</h3>
              
              <div className="space-y-4 text-xs font-semibold py-2">
                {[
                  { source: "LinkedIn Organic", val: "42%", color: "bg-violet-600" },
                  { source: "Google CPC (Google Ads)", val: "28%", color: "bg-indigo-500" },
                  { source: "Email Newsletter", val: "20%", color: "bg-fuchsia-500" },
                  { source: "Direct / Referral", val: "10%", color: "bg-cyan-500" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-slate-800">
                      <span>{item.source}</span>
                      <span>{item.val}</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: item.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign conversion stats */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2">Campaign conversions</h3>
              <div className="space-y-3.5 text-xs text-slate-650 font-medium">
                <div className="flex justify-between border-b pb-1.5">
                  <span>CPC Average Spend</span>
                  <span className="font-bold text-slate-900">$0.84</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Average Lead Score</span>
                  <span className="font-bold text-slate-900">High-intent (84)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>SQL Conversion rate</span>
                  <span className="font-bold text-slate-900">14.03%</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span>Attributed Revenue</span>
                  <span className="font-bold text-emerald-600">$6,720 USD</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
