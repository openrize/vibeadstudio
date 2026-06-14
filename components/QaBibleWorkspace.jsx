"use client";
import { useState, useMemo } from "react";

// Mock validation results
const INITIAL_TESTS = [
  { id: "t_1", suite: "Prompt Templates", name: "Brand Context Injection Test", status: "Passed", metric: "99.4% Match" },
  { id: "t_2", suite: "Content Quality", name: "Blog Readability & SEO Audit", status: "Passed", metric: "84 Flesch-Kincaid" },
  { id: "t_3", suite: "Campaign Flow", name: "Form Submission Lead Capture Sync", status: "Passed", metric: "380ms Latency" },
  { id: "t_4", suite: "Billing Engine", name: "Growth Plan Stripe Downgrade Logic", status: "Passed", metric: "100% Invoiced" },
  { id: "t_5", suite: "Security Node", name: "Tenant Isolation Context Separation", status: "Passed", metric: "Zero Leakage" },
];

const INITIAL_SECURITY_LOGS = [
  { id: "sec_1", timestamp: "2026-06-13T21:00:12Z", actor: "IAM_USER_382", action: "Token verification", status: "Passed", details: "Tenant isolation scope validated for Acme Enterprise Corp" },
  { id: "sec_2", timestamp: "2026-06-13T21:05:42Z", actor: "API_GATEWAY", action: "RBAC validation", status: "Passed", details: "Marketing Manager session authenticated for blog publish" },
  { id: "sec_3", timestamp: "2026-06-13T21:10:05Z", actor: "ENCRYPTION_NODE", action: "Data isolation audit", status: "Passed", details: "Verified all outbound campaign leads payloads are TLS 1.3 encrypted" },
];

export default function QaBibleWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("lifecycle");
  const [pipelineStep, setPipelineStep] = useState(3); // default to QA Validation stage
  const [isRunningSuite, setIsRunningSuite] = useState(false);
  const [suiteProgress, setSuiteProgress] = useState(0);
  const [testResults, setTestResults] = useState(INITIAL_TESTS);
  const [securityLogs, setSecurityLogs] = useState(INITIAL_SECURITY_LOGS);

  // Performance knobs
  const [simulatedPageLoad, setSimulatedPageLoad] = useState(1.4);
  const [simulatedApiDelay, setSimulatedApiDelay] = useState(124);

  // Release Gates checklist
  const [gates, setGates] = useState({
    qaApproved: true,
    securityVerified: true,
    billingVerified: true,
    aiValidated: false,
    noCriticalBugs: true,
    rollbackReady: false,
  });

  const [releaseStatus, setReleaseStatus] = useState("Draft");

  const isReadOnly = currentRole === "read_only";

  // Check if all release checklist items are approved
  const isReleaseReady = useMemo(() => {
    return Object.values(gates).every((v) => v === true);
  }, [gates]);

  // Handlers - Gate Toggles
  function handleGateToggle(key) {
    if (isReadOnly || releaseStatus === "Released" || releaseStatus === "Deploying") return;
    const nextGates = { ...gates, [key]: !gates[key] };
    setGates(nextGates);

    logAction({
      action: "qa_release_gate_mutated",
      details: `Toggled release gate: '${key}' -> ${nextGates[key] ? "APPROVED" : "PENDING"}`,
      status: "info",
      sql: `UPDATE "ReleaseGates" SET "${key}" = ${nextGates[key]} WHERE "releaseVersion" = 'v1.4.0'`,
    });
  }

  // Handlers - Run simulation suite
  function handleRunSuite() {
    if (isReadOnly || isRunningSuite) return;

    setIsRunningSuite(true);
    setSuiteProgress(0);

    logAction({
      action: "qa_suite_triggered",
      details: "Initiated automated AI validation and prompt context regression suite run.",
      status: "info",
    });

    const interval = setInterval(() => {
      setSuiteProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setIsRunningSuite(false);
          setTestResults([
            ...testResults,
            { id: `t_${Date.now()}`, suite: "Automated Regression", name: "Dynamic Prompt Template Injection check", status: "Passed", metric: "100% compliant" }
          ]);
          logAction({
            action: "qa_suite_completed",
            details: "Validation tests completed. 6/6 test suites passed successfully with zero defects.",
            status: "success",
            sql: `INSERT INTO "QaSuiteRuns" ("testCount", "passedCount", "status") VALUES (6, 6, 'PASSED')`,
          });
          alert("Validation suite run complete! All tests passed.");
          return 100;
        }
        return p + 25;
      });
    }, 400);
  }

  // Handlers - Trigger Release Deploy
  function handleDeployRelease() {
    if (!isReleaseReady || isReadOnly || releaseStatus !== "Draft") return;

    setReleaseStatus("Deploying");
    logAction({
      action: "qa_release_deployment_started",
      details: "Initiated release rollout pipeline for bundle build v1.4.0 (Rollback scripts mapped).",
      status: "info",
    });

    setTimeout(() => {
      setReleaseStatus("Released");
      logAction({
        action: "qa_release_deployment_completed",
        details: "Production release deployment successful. Routing traffic to blue-green node clusters.",
        status: "success",
        sql: `INSERT INTO "DeploymentLogs" ("version", "status", "rollbackChecksum") VALUES ('v1.4.0', 'RELEASED', 'sha256_e3b0c442')`,
      });
      alert("App deployment successful! Version v1.4.0 is live in production.");
    }, 2000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">🛡️</span>
            QA Bible Operations
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Validate prompt injection integrity, security isolation checks, API delay telemetries, and release checklist compliance gates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-550">Deployment Pipeline Synced</span>
        </div>
      </div>

      {/* Primary KPI widgets strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Critical Bugs Tracker</span>
          <div className="text-xl font-black text-rose-600 mt-1">0 Critical <span className="text-xs font-normal text-slate-400">/ 2 Low</span></div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Release block criteria: Clean</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">AI Accuracy Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">99.4% Accuracy</div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Checked on prompt regression suites</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Release Success Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">100% Success</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">18 successful deployments</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Platform Availability</span>
          <div className="text-xl font-black text-slate-900 mt-1">99.98% Uptime</div>
          <span className="text-[10px] text-indigo-650 font-bold block mt-1">Page load: {simulatedPageLoad}s avg</span>
        </div>
      </div>

      {/* Sub tabs switches */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "lifecycle", label: "QA Lifecycle & Suites", icon: "🔄" },
          { id: "prompts", label: "AI Output & Prompt Testing", icon: "🧠" },
          { id: "security", label: "Security & Multi-Tenant", icon: "🔐" },
          { id: "performance", label: "Performance & Loads", icon: "⚡" },
          { id: "releases", label: "Release Readiness gates", icon: "🚀" },
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

      {/* 1. QA LIFECYCLE TAB */}
      {activeSubTab === "lifecycle" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* STAGES ROW */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">QA Lifecycle Pipeline Stages</h3>
              
              <div className="flex flex-col md:flex-row md:justify-between gap-2.5">
                {[
                  { step: 1, label: "Dev Complete" },
                  { step: 2, label: "Unit Testing" },
                  { step: 3, label: "QA Validation" },
                  { step: 4, label: "Bug Fixes" },
                  { step: 5, label: "Regression" },
                  { step: 6, label: "Release Appr." },
                  { step: 7, label: "Prod Verif." },
                ].map((s) => {
                  const active = pipelineStep === s.step;
                  const passed = pipelineStep > s.step;
                  return (
                    <button
                      key={s.step}
                      onClick={() => !isReadOnly && setPipelineStep(s.step)}
                      disabled={isReadOnly}
                      className={`flex-1 p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-0.5 ${
                        active ? "border-indigo-600 bg-indigo-50/20 font-black" :
                        passed ? "border-emerald-200 bg-emerald-50/20 text-emerald-800 font-semibold" :
                        "border-slate-100 text-slate-400 font-semibold hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-mono">{s.step}</span>
                      <span className="text-[9px] uppercase tracking-wide block">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-slate-50 p-4 border rounded-xl text-xs space-y-2 font-semibold text-slate-650">
                <span className="font-black text-slate-850 block">Lifecycle Stage Details</span>
                <p className="leading-relaxed font-medium text-slate-500">
                  {pipelineStep === 1 && "Developers complete coding. Automated webhooks pull the branch and deploy to review sandboxes."}
                  {pipelineStep === 2 && "Pre-deploy unit testing suites running on CI/CD runner node blocks (requires 100% success rate)."}
                  {pipelineStep === 3 && "Reviewers perform manual and prompt-injection testing checks on mock and live AI strategist models."}
                  {pipelineStep === 4 && "Developers clear bug boards. Requires verification audits logs confirmation prior to retesting."}
                  {pipelineStep === 5 && "Complete regression check of all core components (AI stratey generator, billing, workspace, publish connections)."}
                  {pipelineStep === 6 && "Verification gate compliance validation. Requires reviews, and approvals checklist triggers."}
                  {pipelineStep === 7 && "Rollout package to production cluster domains. Executing post-deploy validation tests."}
                </p>
              </div>
            </div>

            {/* TEST RUN TRIGGER */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Regression Testing Simulator</h3>
              <p className="text-xs text-slate-400 font-medium">Trigger a simulated validation test run across prompt configurations and security layers:</p>
              
              {isRunningSuite ? (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between text-xs font-bold text-indigo-700">
                    <span>Validating codebase layers...</span>
                    <span>{suiteProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 animate-pulse" style={{ width: `${suiteProgress}%` }} />
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleRunSuite}
                  disabled={isReadOnly}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                >
                  Run Code Validation Suite
                </button>
              )}

              <div className="pt-2 text-[10px] text-slate-400 font-semibold space-y-1.5 border-t">
                <span>Latest check: {isRunningSuite ? "Running..." : "Passed (6 suites, 0 defects)"}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. AI & PROMPT TESTING TAB */}
      {activeSubTab === "prompts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* VERIFICATIONS LIST */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">AI Output & Prompt Injection checks ledger</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase pb-2">
                      <th className="pb-2">Test Area</th>
                      <th className="pb-2">Audit Check Description</th>
                      <th className="pb-2">Metric Value</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((t) => (
                      <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 font-bold text-slate-800">{t.suite}</td>
                        <td className="py-3 text-slate-600 font-semibold">{t.name}</td>
                        <td className="py-3 font-mono text-indigo-700 font-bold">{t.metric}</td>
                        <td className="py-3 text-right">
                          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-emerald-200">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prompt Compliance parameters */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4 text-xs font-semibold text-slate-650">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Content Quality Metrics</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between border-b pb-1.5">
                  <span>Grammar Check:</span>
                  <span className="font-mono text-slate-900">Passed (100% compliant)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Ad relevance score:</span>
                  <span className="font-mono text-slate-900">9.2 / 10.0 avg</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>SEO compliance keyword:</span>
                  <span className="font-mono text-slate-900">98% compliance</span>
                </div>
                <div className="flex justify-between">
                  <span>CTA strategy checks:</span>
                  <span className="font-mono text-emerald-600">Active</span>
                </div>
                <div className="p-3 border border-indigo-150 bg-indigo-50/20 rounded-xl leading-normal text-[11px] font-medium text-slate-500">
                  ⚠️ <strong>Injection Shield:</strong> All incoming prompt templates are scrubbed for instruction overrides (such as requests to leak parent API contexts).
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. SECURITY & MULTI-TENANT TAB */}
      {activeSubTab === "security" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Audit log streams */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Authentication & RBAC security logs</h3>
              
              <div className="space-y-3 font-mono text-[10px] leading-relaxed">
                {securityLogs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-xl space-y-1 hover:bg-slate-50 bg-slate-950 text-slate-100 border-slate-850">
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold border-b border-slate-800 pb-1">
                      <span>Actor: {log.actor} | {log.timestamp}</span>
                      <span className="text-emerald-400 font-black uppercase">[{log.status}]</span>
                    </div>
                    <p className="font-semibold text-indigo-300">Action: {log.action}</p>
                    <p className="text-slate-350 text-[9px] leading-normal">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tenant Separation Checklists */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4 text-xs font-semibold text-slate-650">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">SaaS Security Protocols</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center p-2 border border-emerald-100 bg-emerald-50/20 rounded-xl">
                  <span>Tenant Data Separation:</span>
                  <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded">PASSED</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-emerald-100 bg-emerald-50/20 rounded-xl">
                  <span>RBAC Isolation checks:</span>
                  <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded">PASSED</span>
                </div>
                <div className="flex justify-between items-center p-2 border border-emerald-100 bg-emerald-50/20 rounded-xl">
                  <span>Stripe Webhooks Hash signature:</span>
                  <span className="text-[8px] font-black uppercase bg-emerald-100 text-emerald-800 border px-1.5 py-0.5 rounded">VERIFIED</span>
                </div>
                <div className="p-3 border rounded-xl bg-slate-50 text-[11px] leading-normal font-medium text-slate-500">
                  🔒 <strong>Encryption Node:</strong> Databases enforce row-level tenant keys and local variables scopes. Outbound browser contexts use strict CORS policies.
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. PERFORMANCE & LOAD TAB */}
      {activeSubTab === "performance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Performance telemetry logs */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Platform Response Latency</h3>
              
              <div className="space-y-5 py-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-650">
                    <span>Core Page Load Speed</span>
                    <span className="font-mono text-slate-900">{simulatedPageLoad} seconds</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${simulatedPageLoad < 2.0 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${(simulatedPageLoad / 4) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">Goal: &lt; 3.0 Seconds (LCP metrics compliant)</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-slate-650">
                    <span>API Gateway Latency</span>
                    <span className="font-mono text-slate-900">{simulatedApiDelay} ms</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${simulatedApiDelay < 300 ? "bg-emerald-500" : "bg-amber-500"}`} style={{ width: `${(simulatedApiDelay / 500) * 100}%` }} />
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">Goal: &lt; 500ms API response</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 border rounded-xl text-xs text-slate-550 leading-relaxed font-medium">
                🔥 <strong>Load Testing Simulation:</strong> Under high user volumes (1,500 simultaneous sessions executing AI prompts), API latency peaked at 410ms with zero server memory errors.
              </div>
            </div>

            {/* Knob sliders */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Adjust Telemetry knobs</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Page load delay (s)</label>
                  <input
                    type="range"
                    min="0.5"
                    max="4.0"
                    step="0.1"
                    value={simulatedPageLoad}
                    onChange={(e) => setSimulatedPageLoad(parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400">API Gateway latency (ms)</label>
                  <input
                    type="range"
                    min="50"
                    max="600"
                    step="10"
                    value={simulatedApiDelay}
                    onChange={(e) => setSimulatedApiDelay(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. RELEASE READY GATES */}
      {activeSubTab === "releases" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GATES CHECKLIST */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Release Readiness Gates Compliance</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "qaApproved", label: "QA Validation Approved", desc: "Automated regression tests passed" },
                  { key: "securityVerified", label: "Security & Isolation verified", desc: "Multi-tenant context logs verified" },
                  { key: "billingVerified", label: "Stripe Billing verified", desc: "Upgrades and Downgrades invoiced properly" },
                  { key: "aiValidated", label: "AI Output compliance verified", desc: "Prompt template context validation passes" },
                  { key: "noCriticalBugs", label: "No critical bugs logged", desc: "Zero release blockers in support ticket board" },
                  { key: "rollbackReady", label: "Rollback Plan documented", desc: "PostgreSQL schema restore scripts mapped" },
                ].map((gate) => {
                  const approved = gates[gate.key];
                  return (
                    <button
                      key={gate.key}
                      onClick={() => handleGateToggle(gate.key)}
                      disabled={isReadOnly || releaseStatus === "Released" || releaseStatus === "Deploying"}
                      className={`p-3 border rounded-xl text-left transition flex items-center justify-between gap-3 ${
                        approved
                          ? "border-emerald-200 bg-emerald-50/10"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-800 block">{gate.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium block leading-normal">{gate.desc}</span>
                      </div>
                      <span className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-xs ${
                        approved ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-500"
                      }`}>
                        {approved ? "✓" : "!"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Rollback plans outlines */}
              <div className="pt-4 border-t space-y-2 text-xs">
                <span className="font-bold text-slate-850 block">Rollback Action Plan (v1.4.0)</span>
                <p className="text-slate-450 leading-relaxed font-medium">
                  In the event of database latency or template parse errors, the release pipeline immediately reverts traffic weights to the blue staging cluster. Database migrations support safe rollback scripts via pre-logged rollback checksum keys.
                </p>
              </div>
            </div>

            {/* DEPLOY RELEASE ACTION */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Deploy Production Release</h3>
              
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between border-b pb-2 font-semibold text-slate-650">
                  <span>Version target:</span>
                  <span className="font-mono text-slate-900 font-bold">v1.4.0-release</span>
                </div>
                <div className="flex justify-between border-b pb-2 font-semibold text-slate-650">
                  <span>Compliance Check:</span>
                  <span className={`font-bold uppercase ${isReleaseReady ? "text-emerald-600 animate-pulse" : "text-amber-600"}`}>
                    {isReleaseReady ? "READY FOR DEPLOY" : "GATES PENDING"}
                  </span>
                </div>
                <div className="flex justify-between pb-2 font-semibold text-slate-650">
                  <span>Release status:</span>
                  <span className="px-2 py-0.5 bg-slate-100 border rounded font-bold uppercase tracking-wider text-[9px] text-slate-600">{releaseStatus}</span>
                </div>
              </div>

              {releaseStatus === "Draft" ? (
                <button
                  onClick={handleDeployRelease}
                  disabled={!isReleaseReady || isReadOnly}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                >
                  Approve Release to Production
                </button>
              ) : releaseStatus === "Deploying" ? (
                <div className="space-y-3 pt-2 text-center">
                  <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" />
                  <span className="text-xs font-bold text-indigo-700 block animate-pulse">Running deploy scripts...</span>
                </div>
              ) : (
                <div className="p-3 border border-emerald-100 bg-emerald-50/20 text-emerald-800 font-black text-center text-xs rounded-xl">
                  🚀 v1.4.0 LIVE IN PRODUCTION
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
