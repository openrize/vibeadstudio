"use client";
import { useState, useMemo } from "react";

const INITIAL_CLIENTS = [
  { id: "cli_acme", name: "Acme Retailers Ltd", domain: "acmeretail.com", status: "active", campaigns: 3, contentCount: 12, health: 94, revenue: 1200, onboardingDate: "2026-05-10", logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60", colors: { primary: "#6366f1", secondary: "#10b981" } },
  { id: "cli_horizon", name: "Horizon Logistics Hub", domain: "horizonship.com", status: "active", campaigns: 5, contentCount: 22, health: 88, revenue: 2400, onboardingDate: "2026-05-15", logo: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=80&auto=format&fit=crop&q=60", colors: { primary: "#3b82f6", secondary: "#f59e0b" } },
  { id: "cli_apex", name: "Apex SaaS Solutions", domain: "apexsaas.io", status: "active", campaigns: 1, contentCount: 4, health: 76, revenue: 800, onboardingDate: "2026-06-01", logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=80&auto=format&fit=crop&q=60", colors: { primary: "#ec4899", secondary: "#8b5cf6" } },
  { id: "cli_vintage", name: "Vintage Clothing Outlet", domain: "vintageapparel.com", status: "archived", campaigns: 0, contentCount: 0, health: 0, revenue: 0, onboardingDate: "2026-04-01", logo: "", colors: { primary: "#14b8a6", secondary: "#ef4444" } },
];

const INITIAL_TEAM = [
  { id: "tm_1", name: "Alice Smith", email: "alice@horizon.io", role: "Agency Owner", status: "active" },
  { id: "tm_2", name: "Marcus Aurelius", email: "marcus@horizon.io", role: "Agency Manager", status: "active" },
  { id: "tm_3", name: "Julia Roberts", email: "julia@horizon.io", role: "Content Creator", status: "active" },
  { id: "tm_4", name: "Steve Jobs", email: "steve@horizon.io", role: "Designer", status: "active" },
  { id: "tm_5", name: "Keanu Reeves", email: "keanu@horizon.io", role: "Account Manager", status: "disabled" },
];

const INITIAL_APPROVAL_ASSETS = [
  { id: "appr_1", clientId: "cli_acme", type: "Blog Post", title: "10 Disruptive E-commerce Trends in 2026", contentPreview: "E-commerce is changing faster than ever. Here is how your online brand can leverage AI pipelines...", status: "submitted", feedback: "", lastUpdated: "2026-06-13T10:00:00Z" },
  { id: "appr_2", clientId: "cli_horizon", type: "Ad Campaign", title: "Horizon Supply Chain Launch Ads", preview: "Ship anywhere in the world with Horizon Logistics. Quick, cheap, and secure door-to-door delivery...", status: "revision_requested", feedback: "Please swap 'cheap' with 'cost-effective' in all primary display headlines.", lastUpdated: "2026-06-12T14:30:00Z" },
  { id: "appr_3", clientId: "cli_acme", type: "Email Newsletter", title: "Acme Summer Solstice Promotion", contentPreview: "Summer is officially here and so is our biggest sale of the season. Save up to 50% on selected items...", status: "approved", feedback: "", lastUpdated: "2026-06-13T18:00:00Z" },
  { id: "appr_4", clientId: "cli_apex", type: "Social Post", title: "Apex SaaS Platform Launch Announcement", contentPreview: "Deploy serverless nodes globally with single click deployments. Introducing true scalability...", status: "draft", feedback: "", lastUpdated: "2026-06-13T12:00:00Z" },
];

const INITIAL_INVOICES = [
  { id: "INV-AG101", clientName: "Horizon Logistics Hub", planName: "Agency Premium", date: "2026-06-01", baseAmount: 2000, markupAmount: 400, total: 2400, status: "Paid" },
  { id: "INV-AG102", clientName: "Acme Retailers Ltd", planName: "Growth Starter", date: "2026-06-01", baseAmount: 1000, markupAmount: 200, total: 1200, status: "Paid" },
  { id: "INV-AG103", clientName: "Apex SaaS Solutions", planName: "Starter Tier", date: "2026-06-01", baseAmount: 666.67, markupAmount: 133.33, total: 800, status: "Pending" },
];

export default function AgencyPortal({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("dashboard");
  
  // Simulated state stores
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [team, setTeam] = useState(INITIAL_TEAM);
  const [approvalAssets, setApprovalAssets] = useState(INITIAL_APPROVAL_ASSETS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  
  // Selected contexts
  const [activeClientId, setActiveClientId] = useState("cli_acme");

  // Form states - New Client Onboarding
  const [newCliName, setNewCliName] = useState("");
  const [newCliDomain, setNewCliDomain] = useState("");
  const [newCliRevenue, setNewCliRevenue] = useState(1000);
  const [newCliLogo, setNewCliLogo] = useState("");
  const [newCliPrimaryColor, setNewCliPrimaryColor] = useState("#4f46e5");
  const [newCliVoice, setNewCliVoice] = useState("Professional, innovative, action-oriented");

  // Form states - New Team Member
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamEmail, setNewTeamEmail] = useState("");
  const [newTeamRole, setNewTeamRole] = useState("Content Creator");

  // White label customization settings
  const [wlAgencyName, setWlAgencyName] = useState("Horizon Agency Hub");
  const [wlDomain, setWlDomain] = useState("marketing.horizonagency.io");
  const [wlLogoName, setWlLogoName] = useState("Horizon White-Label Header Logo");
  const [wlColor, setWlColor] = useState("#6366f1");
  const [wlEmailTemplate, setWlEmailTemplate] = useState(
    "Hello {{client_name}},\n\nYour campaign assets for {{campaign_name}} have been generated and are ready for review.\n\nPlease log in here: https://{{agency_domain}}/approval/{{asset_id}}\n\nThanks,\n{{agency_name}} Content Team"
  );

  // Billing configurations
  const [wlMarkup, setWlMarkup] = useState(20);

  // Revision Modal/Form State
  const [revisionAssetId, setRevisionAssetId] = useState(null);
  const [revisionText, setRevisionText] = useState("");

  // Report generation state
  const [selectedReportRange, setSelectedReportRange] = useState("last_30_days");
  const [scheduledEmail, setScheduledEmail] = useState("");

  const activeClient = useMemo(() => clients.find(c => c.id === activeClientId) || clients[0], [clients, activeClientId]);

  // Authorization Security Gate Check
  const hasAgencyAccess = ["super_admin", "agency_admin"].includes(currentRole);

  if (!hasAgencyAccess) {
    return (
      <div className="card p-8 border border-amber-200 bg-amber-50 text-amber-900 space-y-4 rounded-2xl shadow-sm max-w-2xl mx-auto my-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚫</span>
          <div>
            <h3 className="text-lg font-bold">Access Denied: Agency Admin Gate</h3>
            <p className="text-sm text-amber-700 mt-0.5">
              The Agency Portal dashboard contains white-label reseller controls, client assets, and team collaboration settings.
            </p>
          </div>
        </div>
        <div className="p-3 bg-amber-150/40 rounded-xl text-xs text-amber-800 leading-relaxed">
          <strong>Security Constraint:</strong> Your active session role is configured as <strong>{currentRole.replace("_", " ").toUpperCase()}</strong>. 
          Please use the <strong>SaaS Workspace & RBAC Simulator</strong> switcher panel below to switch your role to <strong>Agency Admin</strong> or <strong>Super Admin</strong>.
        </div>
      </div>
    );
  }

  // Aggregate Metrics & KPIs
  const totalActiveClients = clients.filter(c => c.status === "active").length;
  const runningCampaigns = clients.reduce((acc, c) => acc + (c.status === "active" ? c.campaigns : 0), 0);
  const totalContentGenerated = clients.reduce((acc, c) => acc + (c.status === "active" ? c.contentCount : 0), 0);
  const revenueManaged = clients.reduce((acc, c) => acc + (c.status === "active" ? c.revenue : 0), 0);
  const averageClientHealth = Math.floor(
    clients.filter(c => c.status === "active").reduce((acc, c) => acc + c.health, 0) / totalActiveClients
  );

  // Handlers - Onboard Client
  function handleOnboardClient(e) {
    e.preventDefault();
    if (!newCliName.trim() || !newCliDomain.trim()) return;

    const newId = `cli_${newCliName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now().toString().slice(-3)}`;
    const newClient = {
      id: newId,
      name: newCliName,
      domain: newCliDomain,
      status: "active",
      campaigns: 1,
      contentCount: 0,
      health: 100,
      revenue: parseInt(newCliRevenue) || 1000,
      onboardingDate: new Date().toISOString().slice(0, 10),
      logo: newCliLogo || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60",
      colors: { primary: newCliPrimaryColor, secondary: "#10b981" }
    };

    setClients([...clients, newClient]);
    setActiveClientId(newId);

    logAction({
      action: "agency_client_onboarded",
      details: `Onboarded new client '${newClient.name}' under white-label domain: ${newClient.domain}`,
      status: "success",
      sql: `INSERT INTO "Clients" ("id", "name", "domain", "status", "revenue") VALUES ('${newClient.id}', '${newClient.name}', '${newClient.domain}', 'active', ${newClient.revenue})`
    });

    // Reset Form
    setNewCliName("");
    setNewCliDomain("");
    setNewCliRevenue(1000);
    setNewCliLogo("");
    setNewCliPrimaryColor("#4f46e5");
    setNewCliVoice("Professional, innovative, action-oriented");
    alert("New client successfully onboarded!");
  }

  // Handlers - Toggle archive
  function handleToggleArchiveClient(cliId, cliName, isArchived) {
    setClients(prev =>
      prev.map(c => {
        if (c.id === cliId) {
          const nextStatus = isArchived ? "active" : "archived";
          
          logAction({
            action: isArchived ? "client_reactivated" : "client_archived",
            details: `Mutated status of client '${cliName}' to '${nextStatus}'`,
            status: isArchived ? "success" : "warning",
            sql: `UPDATE "Clients" SET "status" = '${nextStatus}' WHERE "id" = '${cliId}'`
          });

          return {
            ...c,
            status: nextStatus,
            revenue: nextStatus === "archived" ? 0 : 1000 // zero out billing if archived
          };
        }
        return c;
      })
    );
  }

  // Handlers - Team Collaboration
  function handleAddTeamMember(e) {
    e.preventDefault();
    if (!newTeamName.trim() || !newTeamEmail.trim()) return;

    const newTm = {
      id: `tm_${Date.now().toString().slice(-4)}`,
      name: newTeamName,
      email: newTeamEmail,
      role: newTeamRole,
      status: "active"
    };

    setTeam([...team, newTm]);

    logAction({
      action: "agency_team_invited",
      details: `Added new agency team collaborator '${newTm.name}' as ${newTm.role}`,
      status: "success",
      sql: `INSERT INTO "TeamMembers" ("name", "email", "role") VALUES ('${newTm.name}', '${newTm.email}', '${newTm.role}')`
    });

    setNewTeamName("");
    setNewTeamEmail("");
    setNewTeamRole("Content Creator");
    alert("New team member added!");
  }

  function handleToggleTeamStatus(tmId, tmName, isCurrentlyActive) {
    setTeam(prev =>
      prev.map(t => {
        if (t.id === tmId) {
          const nextStatus = isCurrentlyActive ? "disabled" : "active";
          logAction({
            action: isCurrentlyActive ? "team_member_disabled" : "team_member_activated",
            details: `Updated team collaborator '${tmName}' status to: ${nextStatus.toUpperCase()}`,
            status: isCurrentlyActive ? "warning" : "success",
            sql: `UPDATE "TeamMembers" SET "status" = '${nextStatus}' WHERE "id" = '${tmId}'`
          });
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  }

  // Handlers - Approvals Pipeline
  function handleApproveAsset(assetId, assetTitle) {
    setApprovalAssets(prev =>
      prev.map(a => {
        if (a.id === assetId) {
          logAction({
            action: "agency_client_approved",
            details: `Client approved asset: '${assetTitle}'`,
            status: "success",
            sql: `UPDATE "ApprovalAssets" SET "status" = 'approved' WHERE "id" = '${assetId}'`
          });
          return { ...a, status: "approved", feedback: "" };
        }
        return a;
      })
    );
  }

  function handlePublishAsset(assetId, assetTitle) {
    setApprovalAssets(prev =>
      prev.map(a => {
        if (a.id === assetId) {
          logAction({
            action: "agency_asset_published",
            details: `Asset published to client live channel: '${assetTitle}'`,
            status: "success",
            sql: `UPDATE "ApprovalAssets" SET "status" = 'published' WHERE "id" = '${assetId}'`
          });
          return { ...a, status: "published" };
        }
        return a;
      })
    );
  }

  function handleRequestRevision(e) {
    e.preventDefault();
    if (!revisionText.trim() || !revisionAssetId) return;

    setApprovalAssets(prev =>
      prev.map(a => {
        if (a.id === revisionAssetId) {
          logAction({
            action: "agency_revision_requested",
            details: `Client requested revision on: '${a.title}'. Notes: "${revisionText}"`,
            status: "warning",
            sql: `UPDATE "ApprovalAssets" SET "status" = 'revision_requested', "feedback" = '${revisionText}' WHERE "id" = '${revisionAssetId}'`
          });
          return { ...a, status: "revision_requested", feedback: revisionText };
        }
        return a;
      })
    );

    setRevisionAssetId(null);
    setRevisionText("");
    alert("Revision request successfully sent back to creators queue.");
  }

  // Handlers - Report Exports
  function triggerExportReport(format) {
    logAction({
      action: `agency_report_${format}_exported`,
      details: `Generated performance export for client '${activeClient.name}' in ${format.toUpperCase()} format. Date range: ${selectedReportRange}`,
      status: "info"
    });

    const reportHeaders = ["Asset Title", "Type", "Status", "Last Updated"];
    const reportRows = approvalAssets
      .filter(a => a.clientId === activeClientId)
      .map(a => [a.title, a.type, a.status, new Date(a.lastUpdated).toISOString().slice(0, 10)]);

    let fileContent = "";
    if (format === "csv") {
      fileContent = "\uFEFF" + [reportHeaders.join(","), ...reportRows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
      const blob = new Blob([fileContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `performance-report-${activeClient.name.toLowerCase().replace(/ /g, "_")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      alert(`Simulated PDF export compiled successfully for client: ${activeClient.name}`);
    }
  }

  function handleScheduleReports(e) {
    e.preventDefault();
    if (!scheduledEmail.trim()) return;

    logAction({
      action: "agency_reports_scheduled",
      details: `Scheduled weekly reporting automation logs for '${activeClient.name}' to email: ${scheduledEmail}`,
      status: "success",
      sql: `INSERT INTO "ScheduledReports" ("clientId", "email", "frequency") VALUES ('${activeClientId}', '${scheduledEmail}', 'weekly')`
    });

    setScheduledEmail("");
    alert("Automated weekly performance reports scheduled!");
  }

  // Handlers - Markup configuration
  function handleSaveMarkup(e) {
    e.preventDefault();
    logAction({
      action: "agency_markup_updated",
      details: `Updated agency client reseller markup setting to ${wlMarkup}% margin fee`,
      status: "info"
    });

    // Recalculate billing values in simulated table
    setInvoices(prev =>
      prev.map(inv => {
        const base = inv.baseAmount;
        const nextMarkup = parseFloat((base * (wlMarkup / 100)).toFixed(2));
        return {
          ...inv,
          markupAmount: nextMarkup,
          total: parseFloat((base + nextMarkup).toFixed(2))
        };
      })
    );
    alert(`Markup updated. All invoices recalculated at ${wlMarkup}% margin fee.`);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">💼</span>
            {wlAgencyName} Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Centrally manage clients, branding assets, team collaboration roles, white-label configs, and markup billing.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase mr-1">Active Client Context:</span>
          <select
            value={activeClientId}
            onChange={(e) => {
              setActiveClientId(e.target.value);
              logAction({
                action: "agency_client_context_switched",
                details: `Switched active client profile workspace filter to '${clients.find(c => c.id === e.target.value)?.name}'`,
                status: "info"
              });
            }}
            className="text-xs font-black text-indigo-700 bg-transparent outline-none cursor-pointer"
          >
            {clients.filter(c => c.status === "active").map((cli) => (
              <option key={cli.id} value={cli.id}>{cli.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "dashboard", label: "Agency Dashboard", icon: "📈" },
          { id: "clients", label: "Client Workspace", icon: "🏢" },
          { id: "whitelabel", label: "White-Label Setup", icon: "🎨" },
          { id: "team", label: "Team Collaborators", icon: "👥" },
          { id: "approvals", label: "Approvals Queue", icon: "✓" },
          { id: "reports", label: "Reports & Billing resale", icon: "📊" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setRevisionAssetId(null);
              }}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                active
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. AGENCY DASHBOARD TAB */}
      {activeSubTab === "dashboard" && (
        <div className="space-y-6">
          {/* Metrics grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Clients</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalActiveClients}</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 100% retention</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Campaigns Active</span>
              <div className="text-xl font-black text-slate-900 mt-1">{runningCampaigns}</div>
              <span className="text-[10px] text-indigo-600 font-bold block mt-1">across all tenants</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Content Assets</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalContentGenerated}</div>
              <span className="text-[10px] text-violet-600 font-bold block mt-1">Generated this month</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Managed Revenue</span>
              <div className="text-xl font-black text-slate-900 mt-1">${revenueManaged.toLocaleString()}/mo</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ client value growth</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Client Health Score</span>
              <div className="text-xl font-black text-slate-900 mt-1">{averageClientHealth}%</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Strong campaign scores</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health detail list */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                <span>Client Health Status</span>
                <span className="text-[10px] text-slate-400 font-bold">Token Health Metrics</span>
              </h3>
              <div className="space-y-4">
                {clients.filter(c => c.status === "active").map((cli) => (
                  <div key={cli.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{cli.name}</span>
                      <span className={`font-black ${
                        cli.health > 90 ? "text-emerald-600" : cli.health > 80 ? "text-indigo-600" : "text-amber-600"
                      }`}>{cli.health}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          cli.health > 90 ? "bg-emerald-500" : cli.health > 80 ? "bg-indigo-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${cli.health}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Activity Feed */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2">Agency Team Activity</h3>
              <div className="space-y-3.5 text-xs text-slate-650">
                <div className="flex gap-2">
                  <span className="text-slate-400">🕒 10:15 AM</span>
                  <p><strong>Julia Roberts</strong> (Creator) submitted <em>&quot;10 E-commerce Trends&quot;</em> to Acme Retailers queue.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400">🕒 Yesterday</span>
                  <p><strong>Steve Jobs</strong> (Designer) updated logo layouts inside <strong>Horizon Logistics</strong> brand assets.</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-slate-400">🕒 Yesterday</span>
                  <p><strong>Marcus Aurelius</strong> (Manager) approved markup updates settings to 20% globally.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CLIENT WORKSPACE & ONBOARDING */}
      {activeSubTab === "clients" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* CLIENT REGISTER */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Client Portfolio Management</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Client Brand</th>
                      <th className="pb-2">Domain</th>
                      <th className="pb-2">Running Campaigns</th>
                      <th className="pb-2">Retainer Revenue</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((cli) => (
                      <tr key={cli.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-2">
                            {cli.logo ? (
                              <img src={cli.logo} alt={cli.name} className="h-6 w-6 rounded-md object-cover border" />
                            ) : (
                              <div className="h-6 w-6 rounded-md bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400">CL</div>
                            )}
                            <div>
                              <span className="font-bold text-slate-800 block">{cli.name}</span>
                              <span className="text-[9px] text-slate-400 block mt-0.5">Onboarded: {cli.onboardingDate}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono text-[10px] text-slate-550">{cli.domain}</td>
                        <td className="py-3 text-slate-650 font-bold">{cli.campaigns} campaigns</td>
                        <td className="py-3 text-slate-800 font-bold">${cli.revenue}/mo</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            cli.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            {cli.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5 whitespace-nowrap font-bold">
                          <button
                            onClick={() => {
                              setActiveClientId(cli.id);
                              logAction({
                                action: "agency_client_context_switched",
                                details: `Switched active client profile workspace filter to '${cli.name}'`,
                                status: "info"
                              });
                              alert(`Active workspace switched to client: ${cli.name}`);
                            }}
                            disabled={cli.status === "archived"}
                            className="text-indigo-650 hover:underline disabled:opacity-40"
                          >
                            Activate Workspace
                          </button>
                          <button
                            onClick={() => handleToggleArchiveClient(cli.id, cli.name, cli.status === "archived")}
                            className={`hover:underline ${cli.status === "archived" ? "text-emerald-650" : "text-amber-650"}`}
                          >
                            {cli.status === "archived" ? "Restore" : "Archive"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ONBOARD NEW CLIENT FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Onboard Client Brand</h3>
              <form onSubmit={handleOnboardClient} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Client Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Vintage Apparel"
                    value={newCliName}
                    onChange={(e) => setNewCliName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Connect Domain / Website</label>
                  <input
                    type="text"
                    placeholder="vintageclothing.com"
                    value={newCliDomain}
                    onChange={(e) => setNewCliDomain(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Import Brand Logo URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://domain.com/logo.png"
                    value={newCliLogo}
                    onChange={(e) => setNewCliLogo(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Retainer Fee ($)</label>
                    <input
                      type="number"
                      value={newCliRevenue}
                      onChange={(e) => setNewCliRevenue(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Brand Color Hex</label>
                    <div className="flex items-center gap-1.5 mt-1">
                      <input
                        type="color"
                        value={newCliPrimaryColor}
                        onChange={(e) => setNewCliPrimaryColor(e.target.value)}
                        className="h-8 w-8 rounded border p-0.5 bg-slate-50 outline-none cursor-pointer"
                      />
                      <span className="text-xs font-mono uppercase text-slate-500">{newCliPrimaryColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Define Brand Voice</label>
                  <textarea
                    placeholder="Describe tone guidelines, primary vocabulary, and exclusions..."
                    value={newCliVoice}
                    onChange={(e) => setNewCliVoice(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-20"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                >
                  Confirm Onboard Workspace
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 3. WHITE-LABEL CAPABILITIES */}
      {activeSubTab === "whitelabel" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SETTINGS FORM */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-6">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                <span>White-Label Branding Settings</span>
                <span className="bg-violet-100 text-violet-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Active custom domain</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Custom Agency App Name</label>
                  <input
                    type="text"
                    value={wlAgencyName}
                    onChange={(e) => setWlAgencyName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Custom Brand Domain</label>
                  <input
                    type="text"
                    value={wlDomain}
                    onChange={(e) => setWlDomain(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Header Agency Logo Name</label>
                  <input
                    type="text"
                    value={wlLogoName}
                    onChange={(e) => setWlLogoName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Theme Primary Color Accent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={wlColor}
                      onChange={(e) => setWlColor(e.target.value)}
                      className="h-8 w-8 rounded border p-0.5 bg-slate-50 outline-none cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase text-slate-500">{wlColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Custom Client Invitation Email Template</label>
                <textarea
                  value={wlEmailTemplate}
                  onChange={(e) => setWlEmailTemplate(e.target.value)}
                  className="w-full mt-1 px-3 py-2 font-mono text-[10px] border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-32 leading-relaxed"
                  required
                />
              </div>

              <button
                onClick={() => {
                  logAction({
                    action: "agency_whitelabel_saved",
                    details: `Saved white-label branding definitions: custom domain=${wlDomain}, theme primary=${wlColor}`,
                    status: "success",
                    sql: `UPDATE "WhiteLabelConfigs" SET "appName"='${wlAgencyName}', "domain"='${wlDomain}', "primaryColor"='${wlColor}'`
                  });
                  alert("Custom agency white-label settings deployed to servers.");
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
              >
                Save White-Label Deployment
              </button>
            </div>

            {/* DNS CNAME CHECKLIST */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Custom Domain CNAME Configuration</h3>
              <div className="space-y-4 text-xs">
                <p className="text-slate-500 leading-relaxed font-medium">
                  Point your domain&apos;s DNS settings to our servers to route white-label app requests:
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border font-mono text-[10px] space-y-1">
                  <div><strong>Type:</strong> CNAME</div>
                  <div><strong>Host / Name:</strong> marketing</div>
                  <div><strong>Value:</strong> whitelabel.vibeadstudio.com</div>
                  <div><strong>TTL:</strong> Automatic / 3600</div>
                </div>

                <div className="flex items-center gap-2 text-emerald-600 font-bold border border-emerald-100 bg-emerald-50/20 p-2.5 rounded-xl">
                  <span>✅ CNAME Verification Connected</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. TEAM COLLABORATION */}
      {activeSubTab === "team" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* TEAM REGISTER */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Agency Staff Roster</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2">Agency Role</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((t) => (
                      <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{t.name}</td>
                        <td className="py-3 font-mono text-[10px] text-slate-500">{t.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            t.role === "Agency Owner" ? "bg-red-50 border border-red-100 text-red-800" :
                            t.role === "Agency Manager" ? "bg-amber-50 border border-amber-100 text-amber-800" :
                            t.role === "Content Creator" ? "bg-blue-50 border border-blue-100 text-blue-800" : "bg-slate-100 text-slate-650"
                          }`}>
                            {t.role}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            t.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                          }`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold">
                          <button
                            onClick={() => handleToggleTeamStatus(t.id, t.name, t.status === "active")}
                            className={`hover:underline ${t.status === "active" ? "text-amber-650" : "text-emerald-650"}`}
                          >
                            {t.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* INVITE STAFF MEMBER FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Invite Staff Member</h3>
              <form onSubmit={handleAddTeamMember} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Work Email Address</label>
                  <input
                    type="email"
                    placeholder="john@horizon.io"
                    value={newTeamEmail}
                    onChange={(e) => setNewTeamEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Agency Role</label>
                  <select
                    value={newTeamRole}
                    onChange={(e) => setNewTeamRole(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="Agency Owner">Agency Owner (Full Billing Access)</option>
                    <option value="Agency Manager">Agency Manager (Client Manager)</option>
                    <option value="Content Creator">Content Creator (Generate Assets)</option>
                    <option value="Designer">Designer (Modify visual directions)</option>
                    <option value="Account Manager">Account Manager (Publish status toggle)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                >
                  Send Access Invitation
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 5. CLIENT APPROVALS QUEUE */}
      {activeSubTab === "approvals" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Client Campaign Approval Queue</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Filter: Active Client workspace</span>
            </div>

            {revisionAssetId && (
              /* REVISION MODAL / DRAWER */
              <form onSubmit={handleRequestRevision} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-amber-900 uppercase">Write Client Feedback notes</h4>
                  <button type="button" onClick={() => setRevisionAssetId(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
                </div>
                <div>
                  <textarea
                    placeholder="Specify edits required (e.g. swap words, edit visual style guidelines)..."
                    value={revisionText}
                    onChange={(e) => setRevisionText(e.target.value)}
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white outline-none focus:ring-1 focus:ring-amber-400 h-20"
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRevisionAssetId(null)}
                    className="px-3 py-1.5 bg-white border rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-[10px] font-bold hover:bg-amber-700"
                  >
                    Submit Revision Feedback
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                    <th className="pb-2">Marketing Asset</th>
                    <th className="pb-2">Client Brand</th>
                    <th className="pb-2">Asset Details</th>
                    <th className="pb-2">Approval Status</th>
                    <th className="pb-2 text-right">Approvals pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {approvalAssets.filter(a => a.clientId === activeClientId).map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 pr-2">
                        <span className="font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wide block mt-0.5">{item.type}</span>
                      </td>
                      <td className="py-3 font-medium text-slate-500 font-mono text-[10px]">
                        {clients.find(c => c.id === item.clientId)?.name}
                      </td>
                      <td className="py-3 pr-4 max-w-xs md:max-w-sm">
                        <p className="text-slate-650 italic leading-relaxed line-clamp-2">
                          &quot;{item.contentPreview || item.preview}&quot;
                        </p>
                        {item.feedback && (
                          <div className="mt-1.5 p-2 rounded bg-amber-50 border border-amber-100 text-[10px] text-amber-800">
                            <strong>Client Revision Notes:</strong> &quot;{item.feedback}&quot;
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          item.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          item.status === "revision_requested" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                          item.status === "submitted" ? "bg-blue-100 text-blue-800" :
                          item.status === "published" ? "bg-violet-100 text-violet-850" : "bg-slate-100 text-slate-700"
                        }`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                        {item.status === "submitted" || item.status === "revision_requested" ? (
                          <>
                            <button
                              onClick={() => handleApproveAsset(item.id, item.title)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRevisionAssetId(item.id);
                                setRevisionText("");
                              }}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-lg transition"
                            >
                              Request Revision
                            </button>
                          </>
                        ) : item.status === "approved" ? (
                          <button
                            onClick={() => handlePublishAsset(item.id, item.title)}
                            className="px-2 py-1 bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-800 text-[10px] font-bold rounded-lg transition"
                          >
                            Publish Live
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide px-2 py-1">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {approvalAssets.filter(a => a.clientId === activeClientId).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                        No assets in the approval queue for this client. Invite team members to generate campaigns!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. CLIENT REPORTING & RESELLER BILLING */}
      {activeSubTab === "reports" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* PERFORMANCE REPORT CARD */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-6">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                <span>Client Performance Analytics</span>
                <span className="text-[10px] text-slate-450 font-bold">Automated client reporting</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Reporting Time Period</label>
                  <select
                    value={selectedReportRange}
                    onChange={(e) => setSelectedReportRange(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="this_quarter">This Quarter</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => triggerExportReport("csv")}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition text-center"
                  >
                    Export CSV Report
                  </button>
                  <button
                    onClick={() => triggerExportReport("pdf")}
                    className="flex-1 py-2 border hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition text-center"
                  >
                    Export PDF Summary
                  </button>
                </div>
              </div>

              {/* Weekly Automation Form */}
              <form onSubmit={handleScheduleReports} className="border-t pt-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">Automate Scheduled Weekly Reports</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="client-contact@acmeretail.com"
                    value={scheduledEmail}
                    onChange={(e) => setScheduledEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition"
                  >
                    Schedule Automation
                  </button>
                </div>
              </form>
            </div>

            {/* RESELLER BILLING CONFIG */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Reseller Markup Configuration</h3>
              <form onSubmit={handleSaveMarkup} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Reseller Profit Margin Markup (%)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={wlMarkup}
                      onChange={(e) => setWlMarkup(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                    <span className="text-xs font-bold text-slate-500">% markup on platform fees</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Recalculate Invoices
                </button>
              </form>

              {/* CLIENT INVOICE LIST */}
              <div className="border-t pt-4 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Agency Markup Invoice History</span>
                <div className="space-y-2.5">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-slate-800">{inv.clientName}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Date: {inv.date} ({inv.planName})</p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900">${inv.total.toFixed(2)}</span>
                        <span className="block text-[8px] text-emerald-600 font-bold uppercase">{inv.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
