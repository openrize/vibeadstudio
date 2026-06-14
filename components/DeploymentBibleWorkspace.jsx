"use client";
import { useState, useMemo } from "react";

// Mock environments profiles
const ENVIRONMENTS_CONFIG = {
  dev: {
    dbHost: "dev-db.vibeadstudio.internal",
    secretsKey: "env_secret_dev_3821",
    billingNode: "Stripe Testmode (Sandbox)",
    aiKey: "OpenAI Sandbox (Mock Mode)",
    status: "Healthy",
  },
  staging: {
    dbHost: "staging-db-replica.vibeadstudio.internal",
    secretsKey: "env_secret_staging_7294",
    billingNode: "Stripe Testmode (Mock Sync)",
    aiKey: "OpenAI Live Staging Sandbox",
    status: "Healthy",
  },
  prod: {
    dbHost: "prod-db-primary.vibeadstudio.com",
    secretsKey: "env_secret_prod_9941_encrypted",
    billingNode: "Stripe Production Live Gateway",
    aiKey: "OpenAI Live Production Cluster",
    status: "Healthy",
  },
};

const INITIAL_INCIDENTS = [
  { id: "inc_1", title: "P1 Critical: Platform Unavailable", status: "Resolved", rto: "14 mins", date: "2026-06-11" },
  { id: "inc_2", title: "P2 Major: Campaign Builder Outage", status: "Resolved", rto: "45 mins", date: "2026-06-08" },
  { id: "inc_3", title: "P3 Minor: Linter warning in CRM page", status: "Active", rto: "N/A", date: "2026-06-13" },
];

export default function DeploymentBibleWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("environments");
  const [selectedEnv, setSelectedEnv] = useState("prod");
  
  // Cost controls states
  const [aiCostCap, setAiCostCap] = useState(12000);
  const [dbStorageCap, setDbStorageCap] = useState(80);
  
  // Incidents board
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  
  // DR Drill Simulation states
  const [drillActive, setDrillActive] = useState(false);
  const [drillProgress, setDrillProgress] = useState(0);
  const [drillType, setDrillType] = useState("");
  const [drillRtoOutput, setDrillRtoOutput] = useState("");

  const isReadOnly = currentRole === "read_only";

  const activeEnvConfig = useMemo(() => {
    return ENVIRONMENTS_CONFIG[selectedEnv] || ENVIRONMENTS_CONFIG.prod;
  }, [selectedEnv]);

  // Handlers - Trigger DR Drill
  function handleTriggerDrill(type) {
    if (isReadOnly || drillActive) return;

    setDrillActive(true);
    setDrillType(type);
    setDrillProgress(0);
    setDrillRtoOutput("");

    logAction({
      action: "deploy_dr_drill_started",
      details: `Initiated disaster recovery failover drill: '${type}'`,
      status: "info",
    });

    const interval = setInterval(() => {
      setDrillProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDrillActive(false);
          
          let computedRto = "";
          if (type === "Database Failure") {
            computedRto = "14 minutes (RTO Target: <4 hrs)";
          } else if (type === "OpenAI Outage") {
            computedRto = "8 seconds (API Failover Staging)";
          } else {
            computedRto = "22 minutes (CNAME Rollback)";
          }
          
          setDrillRtoOutput(computedRto);
          logAction({
            action: "deploy_dr_drill_completed",
            details: `DR Failover drill '${type}' completed successfully. RTO: ${computedRto}.`,
            status: "success",
            sql: `INSERT INTO "DrillLogs" ("drillType", "rto", "status") VALUES ('${type}', '${computedRto}', 'SUCCESS')`,
          });
          alert(`Disaster Recovery failover drill complete! RTO: ${computedRto}`);
          return 100;
        }
        return p + 20;
      });
    }, 300);
  }

  // Handlers - Save Cost caps
  function handleSaveCostCaps(e) {
    e.preventDefault();
    if (isReadOnly) return;

    logAction({
      action: "deploy_cost_limits_saved",
      details: `Updated cloud resource caps: AI Cap: $${aiCostCap}/mo | DB storage limit: ${dbStorageCap}GB`,
      status: "success",
      sql: `UPDATE "CloudConfigs" SET "aiCostCap" = ${aiCostCap}, "dbStorageCap" = ${dbStorageCap} WHERE "orgId" = 'platform_root'`,
    });
    alert("Cloud resource parameters updated in production cluster.");
  }

  // Handlers - Backups restore test
  function handleBackupRestoreTest() {
    if (isReadOnly) return;
    
    logAction({
      action: "deploy_backup_restore_tested",
      details: `Executed quarterly database restore test from primary S3 bucket to staging backup node`,
      status: "info",
      sql: `SELECT pg_restore_test('/backups/daily/db-backup-latest.dump')`,
    });
    alert("Restoration check complete. Integrity verification matches (100% data recovered).");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">⚙️</span>
            Deployment Bible Panel
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Configure dev/staging/prod environment clusters, monitor container health latencies, set cost caps, and run disaster recovery drills.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">99.98% platform uptime</span>
        </div>
      </div>

      {/* Primary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Frontend Route</span>
          <div className="text-xl font-black text-slate-900 mt-1">Next.js Cloud</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">LCP: 1.4s avg</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Backend API node</span>
          <div className="text-xl font-black text-slate-900 mt-1">Node.js API</div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Latency: 124ms avg</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Python AI Services</span>
          <div className="text-xl font-black text-slate-900 mt-1">Kubernetes Pods</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Uptime: 100% active</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">PostgreSQL DB Node</span>
          <div className="text-xl font-black text-slate-900 mt-1">AWS RDS Aurora</div>
          <span className="text-[10px] text-indigo-650 font-bold block mt-1">Connections: 42 active</span>
        </div>
      </div>

      {/* Nav Tab switches */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "environments", label: "Environments Strategy", icon: "🌐" },
          { id: "ai_monitoring", label: "AI Operations & Pods", icon: "🤖" },
          { id: "observability", label: "Observability Alertstream", icon: "📈" },
          { id: "costs", label: "Cost Management", icon: "💰" },
          { id: "backups", label: "Backup & Recovery logs", icon: "💾" },
          { id: "incidents", label: "Incident Escalation Desk", icon: "🚨" },
          { id: "dr", label: "Disaster Recovery drills", icon: "🔮" },
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

      {/* 1. ENVIRONMENTS STRATEGY TAB */}
      {activeSubTab === "environments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* SWITCH ENVIRONMENTAL CONTROLS */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Select Active Cluster</h3>
              <p className="text-xs text-slate-400 font-medium">Verify credentials separation and secret allocations across strategic environments:</p>
              
              <div className="space-y-2 pt-2">
                {[
                  { id: "dev", name: "Development (Local Sandbox)", desc: "Isolated dev DB and fake credentials" },
                  { id: "staging", name: "Staging (Pre-Release)", desc: "Mirror prod database replica, separate keys" },
                  { id: "prod", name: "Production (Live Node)", desc: "Customer database, Stripe live webhooks" },
                ].map((env) => {
                  const active = selectedEnv === env.id;
                  return (
                    <button
                      key={env.id}
                      onClick={() => setSelectedEnv(env.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition text-xs flex flex-col gap-1 ${
                        active
                          ? "border-violet-600 bg-violet-50/20"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-bold text-slate-855">{env.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{env.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ENVIRONMENT DETAIL SPEC */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Environment Configuration Parameters</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-650">
                <div className="flex justify-between border-b pb-2">
                  <span>Database Host URL:</span>
                  <span className="font-mono text-slate-900">{activeEnvConfig.dbHost}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Secrets Encryption Key:</span>
                  <span className="font-mono text-indigo-700 font-bold">{activeEnvConfig.secretsKey}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Stripe Gateway mode:</span>
                  <span className="font-mono text-slate-900">{activeEnvConfig.billingNode}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>OpenAI credentials:</span>
                  <span className="font-mono text-slate-900">{activeEnvConfig.aiKey}</span>
                </div>
                <div className="flex justify-between">
                  <span>Node Status:</span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[9px] font-black uppercase">{activeEnvConfig.status}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. AI OPERATIONS MONITORING */}
      {activeSubTab === "ai_monitoring" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Kubernetes AI Pod Health & Telemetry</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { name: "Content Generation Services", latency: "1,450ms", errors: "0.02%", tokens: "1.48M tokens", cpu: "24% load" },
                { name: "Image Generation Pods", latency: "4,200ms", errors: "0.10%", tokens: "650 calls", cpu: "45% load" },
                { name: "Prompt Inject Validator", latency: "85ms", errors: "0.00%", tokens: "14.8k calls", cpu: "12% load" },
                { name: "Brand Intelligence Pods", latency: "820ms", errors: "0.04%", tokens: "382 calls", cpu: "18% load" },
              ].map((pod, idx) => (
                <div key={idx} className="p-3.5 border rounded-xl bg-slate-50 space-y-2.5 text-xs hover:shadow-sm">
                  <span className="font-bold text-slate-800 block truncate">{pod.name}</span>
                  <div className="space-y-1 font-semibold text-slate-650">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Latency:</span>
                      <span className="font-mono text-indigo-700">{pod.latency}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Error rate:</span>
                      <span className="font-mono text-rose-600">{pod.errors}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Total volume:</span>
                      <span className="font-mono text-slate-900">{pod.tokens}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">CPU Usage:</span>
                      <span className="font-mono text-slate-900">{pod.cpu}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. OBSERVABILITY ALERT STREAM */}
      {activeSubTab === "observability" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Status indicators */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active Service Node Observability</h3>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { name: "API Gateway (Latency avg 124ms)", status: "Active", uptime: "99.99% Uptime", color: "bg-emerald-500" },
                  { name: "AWS RDS Aurora PostgreSQL DB", status: "Active", uptime: "99.98% Uptime", color: "bg-emerald-500" },
                  { name: "Stripe Billing checkout syncing", status: "Active", uptime: "100.00% Uptime", color: "bg-emerald-500" },
                  { name: "Campaign Automation Cron processor", status: "Active", uptime: "99.95% Uptime", color: "bg-emerald-500" },
                ].map((node, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 border rounded-xl hover:bg-slate-50">
                    <span className="font-bold text-slate-800">{node.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-500 font-semibold">{node.uptime}</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[8px] font-black uppercase">{node.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active alert logs stream */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Observability Alerts stream</h3>
              
              <div className="space-y-3 font-mono text-[9px] text-slate-400">
                <div className="p-2.5 border border-slate-100 bg-slate-50 rounded-lg hover:shadow-sm">
                  <div className="flex justify-between text-indigo-700 font-bold mb-1">
                    <span>API_ALERT_7294</span>
                    <span>12 mins ago</span>
                  </div>
                  <p className="text-slate-600 font-medium">Successfully completed backup dump of main PostgreSQL database node.</p>
                </div>

                <div className="p-2.5 border border-slate-100 bg-slate-50 rounded-lg hover:shadow-sm">
                  <div className="flex justify-between text-rose-700 font-bold mb-1">
                    <span>AI_SERVICE_OVERAGE_WARN</span>
                    <span>1 hour ago</span>
                  </div>
                  <p className="text-slate-600 font-medium">Organization Acme Enterprise tokens consumption reached 80% limit warning.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. COST OPERATIONS CENTER */}
      {activeSubTab === "costs" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Limit adjustments knobs */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Adjust Cloud Spending Caps</h3>
              <form onSubmit={handleSaveCostCaps} className="space-y-5 py-2">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-650">
                    <span>AI Monthly Cost Cap</span>
                    <span className="font-mono text-slate-900">${aiCostCap.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={aiCostCap}
                    onChange={(e) => setAiCostCap(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[9px] text-slate-400 font-medium block">Sets automatic rate limit triggers if threshold cost is reached.</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-650">
                    <span>Database Storage cap limit</span>
                    <span className="font-mono text-slate-900">{dbStorageCap} GB</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={dbStorageCap}
                    onChange={(e) => setDbStorageCap(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                  <span className="text-[9px] text-slate-400 font-medium block">Allocated SSD volumes for object store database configurations.</span>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                >
                  Confirm Cloud Spending Caps
                </button>
              </form>
            </div>

            {/* Cost Ledger logs */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Cloud resource spending ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase pb-2">
                      <th className="pb-2">Resource Element</th>
                      <th className="pb-2">Monthly Spend</th>
                      <th className="pb-2">Remaining Budget Allocation</th>
                      <th className="pb-2 text-right">Cost Alert status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "OpenAI API strategy gen tokens", spend: "$2,960", remaining: "$9,040 remaining", status: "Clean" },
                      { name: "AWS Aurora DB node instances", spend: "$1,450", remaining: "$1,550 remaining", status: "Clean" },
                      { name: "Frontend CDN static page delivery", spend: "$380", remaining: "$620 remaining", status: "Clean" },
                      { name: "Cloud S3 backups object store", spend: "$120", remaining: "$380 remaining", status: "Clean" },
                    ].map((item, index) => (
                      <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{item.name}</td>
                        <td className="py-3 text-slate-700 font-mono font-bold">{item.spend}</td>
                        <td className="py-3 text-slate-500 font-semibold">{item.remaining}</td>
                        <td className="py-3 text-right">
                          <span className="bg-emerald-105 text-emerald-800 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-emerald-200">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. BACKUP & RECOVERY LOGS */}
      {activeSubTab === "backups" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Backup logs */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Backup Schedule Logs</h3>
              
              <div className="space-y-3.5 text-xs">
                {[
                  { schedule: "Daily Database snapshot", time: "Every day at 02:00 UTC", retention: "30 Days retention", status: "Success" },
                  { schedule: "Weekly DB snapshot & code archive", time: "Sunday at 00:00 UTC", retention: "90 Days retention", status: "Success" },
                  { schedule: "Monthly S3 assets archive", time: "1st of month at 00:00 UTC", retention: "365 Days retention", status: "Success" },
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2.5 border rounded-xl hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{item.schedule}</span>
                      <span className="text-[10px] text-slate-450 block font-medium">{item.time}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-550 font-semibold">{item.retention}</span>
                      <span className="bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded text-[8px] font-black uppercase">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Backup restore verification */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4 text-xs">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Quarterly Restore validation</h3>
              <p className="text-slate-400 font-medium leading-normal">
                Verifies database restoration scripts against staging node replicas. Matches RPO targets &lt; 1 hour.
              </p>
              
              <button
                onClick={handleBackupRestoreTest}
                disabled={isReadOnly}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition disabled:opacity-40"
              >
                Run Restore Validation Test
              </button>

              <div className="p-3 border border-indigo-150 bg-indigo-50/20 rounded-xl leading-normal text-[11px] font-medium text-slate-500">
                🔒 <strong>Restoration Status:</strong> Verified on 2026-06-12. Integrity check matches (100% database recovery successful).
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. INCIDENT RESPONSE DESK */}
      {activeSubTab === "incidents" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Incident Tickets & Escalation Board</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold text-slate-650">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-4 border rounded-xl bg-slate-50/50 hover:shadow-sm space-y-3.5">
                  <div className="flex justify-between items-center border-b pb-2">
                    <span className="font-bold text-slate-850 block truncate">{inc.title}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                      inc.status === "Resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                      "bg-rose-50 text-rose-800 border-rose-200 animate-pulse"
                    }`}>{inc.status}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Logged Date:</span>
                      <span className="font-mono text-slate-900 font-bold">{inc.date}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-semibold">
                      <span>Restoration Time (RTO):</span>
                      <span className="font-mono text-slate-900 font-bold">{inc.rto}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border border-indigo-100 bg-indigo-50/20 rounded-xl space-y-2 text-xs text-slate-500 leading-normal font-medium mt-4">
              <span className="font-bold text-indigo-800 block">Incident Escalation Rules:</span>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Severity P1 (Platform Down):</strong> Escalates automatically to DevOps lead and Platform Administrator. Target RTO: &lt; 4 Hours.</li>
                <li><strong>Severity P2 (Core Service Outage):</strong> Escalates to on-call Engineering Lead. Target RTO: &lt; 12 Hours.</li>
                <li><strong>Severity P3 (Minor Feature Bug):</strong> Queued for the weekly development release lifecycle board.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 7. DISASTER RECOVERY DRILLS */}
      {activeSubTab === "dr" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Failover simulator dials */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Trigger failover simulation drill</h3>
              <p className="text-xs text-slate-400 font-medium">Verify system redundancy by simulating outages and tracking the target Recovery Time Objective (RTO):</p>
              
              <div className="space-y-3 pt-2">
                {[
                  { name: "Database Failure", desc: "Aurora DB failover to replica node" },
                  { name: "OpenAI Outage", desc: "Failover API endpoints routing" },
                  { name: "Stripe Downtime", desc: "Simulate caching billing webhook payload queues" },
                ].map((drill, index) => (
                  <button
                    key={index}
                    onClick={() => handleTriggerDrill(drill.name)}
                    disabled={isReadOnly || drillActive}
                    className="w-full p-3.5 border rounded-xl text-left hover:bg-slate-50 transition text-xs flex justify-between items-center gap-4 disabled:opacity-40"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-800 block">{drill.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">{drill.desc}</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">Run Drill</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Simulation outputs panel */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Drill Simulation Output</h3>
              
              {drillActive ? (
                <div className="space-y-3 pt-4 text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                  <span className="text-xs font-bold text-indigo-700 block animate-pulse">Simulating failover sequences for: {drillType}...</span>
                  <div className="w-48 bg-slate-100 h-2 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-indigo-600" style={{ width: `${drillProgress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-5 pt-2 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-xl text-center space-y-1 bg-slate-50">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">RTO Target limits</span>
                      <div className="text-lg font-black text-slate-900">Less Than 4 Hours</div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Recovery Time Objective</span>
                    </div>
                    <div className="p-4 border rounded-xl text-center space-y-1 bg-slate-50">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400">RPO Target limits</span>
                      <div className="text-lg font-black text-slate-900">Less Than 1 Hour</div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-1">Recovery Point Objective</span>
                    </div>
                  </div>

                  {drillRtoOutput && (
                    <div className="p-3 border border-emerald-100 bg-emerald-50/20 text-emerald-800 font-bold rounded-xl flex items-center justify-between">
                      <span>✅ Drill execution successful! RTO achieved:</span>
                      <span className="font-mono text-emerald-950 font-black">{drillRtoOutput}</span>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 border rounded-xl space-y-2 font-semibold text-slate-650">
                    <span className="font-bold text-slate-850 block">Disaster Recovery Strategy:</span>
                    <ul className="list-disc pl-5 space-y-1 text-slate-500 font-medium">
                      <li><strong>Multi-Region Replica:</strong> Production databases are mirrored to backup regions, allowing automatic failovers.</li>
                      <li><strong>Credential Rotation:</strong> Secrets are rotated dynamically. In transit payloads are TLS 1.3 encrypted.</li>
                      <li><strong>Quarterly Recovery Drills:</strong> Verifies restoration scripts to maintain target standards.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
