"use client";
import { useState, useMemo } from "react";

// Mock Epics Catalog
const PRODUCT_EPICS = [
  { id: "EPIC-1", title: "AI Content Engine", businessValue: "Automates copy and blogs creation, reducing customer CAC.", owner: "Pratik Patel (AI Eng Lead)" },
  { id: "EPIC-2", title: "Campaign Builder", businessValue: "Multi-channel funnel setup wizard to scale lead generation.", owner: "Alice Smith (Product Owner)" },
  { id: "EPIC-3", title: "Landing Page Builder", businessValue: "Rich theme templates to optimize user conversion ratios.", owner: "Bob Johnson (Frontend Lead)" },
  { id: "EPIC-4", title: "Brand Intelligence", businessValue: "Brand voice and styles extraction to ensure consistent AI outputs.", owner: "Carol White (AI Engineer)" },
  { id: "EPIC-5", title: "Customer Workspace", businessValue: "Centralized assets library and 연결 WordPress integration.", owner: "Alice Smith (Product Owner)" },
  { id: "EPIC-6", title: "Agency Portal", businessValue: "White-label customization and reseller markup billing systems.", owner: "Dave Miller (Backend Lead)" },
  { id: "EPIC-7", title: "Analytics & Reporting", businessValue: "Executive search telemetries and conversion attributions.", owner: "Eva Green (Data Analyst)" },
  { id: "EPIC-8", title: "CRM & Customer Success", businessValue: "HubSpot integrations and trial activations checklist desk.", owner: "Frank Wright (CS Lead)" },
  { id: "EPIC-9", title: "Billing & Subscriptions", businessValue: "Stripe multi-tier checkouts and overage calculations.", owner: "Dave Miller (Backend Lead)" },
  { id: "EPIC-10", title: "Integrations & Automation", businessValue: "Automated outgoing webhooks and outbound CRM sync systems.", owner: "Dave Miller (Backend Lead)" },
];

// Mock Jira Tasks
const INITIAL_TASKS = [
  { id: "AIMS-101", summary: "Scaffold Analytics Bible metrics tables", epic: "EPIC-7", assignee: "Dave Miller", estimate: "3 pts", priority: "High", stage: "Done" },
  { id: "AIMS-102", summary: "Integrate stripe invoice webhook handlers", epic: "EPIC-9", assignee: "Dave Miller", estimate: "5 pts", priority: "Critical", stage: "Released" },
  { id: "AIMS-103", summary: "Build prompt validation sanitizers", epic: "EPIC-1", assignee: "Carol White", estimate: "3 pts", priority: "High", stage: "In Progress" },
  { id: "AIMS-104", summary: "Add white-label domain CNAME checkers", epic: "EPIC-6", assignee: "Bob Johnson", estimate: "8 pts", priority: "Medium", stage: "QA" },
  { id: "AIMS-105", summary: "Map CRM trial lifecycle status flow", epic: "EPIC-8", assignee: "Frank Wright", estimate: "2 pts", priority: "Low", stage: "Ready" },
  { id: "AIMS-106", summary: "Refactor multi-region replica restore", epic: "EPIC-10", assignee: "Dave Miller", estimate: "5 pts", priority: "Critical", stage: "Backlog" },
];

export default function JiraRoadmapWorkspace({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("kanban");
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // Story Template Creator states
  const [storyUser, setStoryUser] = useState("Marketing Manager");
  const [storyFeature, setStoryFeature] = useState("AI Campaign Wizard template presets");
  const [storyBenefit, setStoryBenefit] = useState("launch outbound lead funnels in minutes");
  const [storyValue, setStoryValue] = useState("Reduces setup time by 90%");
  const [storyOwner, setStoryOwner] = useState("Bob Johnson");
  const [storyEstimate, setStoryEstimate] = useState("3 pts");
  const [storyEpic, setStoryEpic] = useState("EPIC-2");
  
  const [customStories, setCustomStories] = useState([]);

  // Prioritization Matrix states
  const [selectedPriorEpic, setSelectedPriorEpic] = useState("EPIC-1");
  const [scoreRevenue, setScoreRevenue] = useState(8);
  const [scoreRetention, setScoreRetention] = useState(6);
  const [scoreAdoption, setScoreAdoption] = useState(7);
  const [scoreEfficiency, setScoreEfficiency] = useState(9);
  
  const [matrixScores, setMatrixScores] = useState({});

  // V4 Completion checklist
  const [v4Checklist, setV4Checklist] = useState({
    partsComplete: true,
    architectureApproved: true,
    marketingApproved: true,
    operationsApproved: true,
    roadmapApproved: true,
  });

  const isReadOnly = currentRole === "read_only";

  const isV4Complete = useMemo(() => {
    return Object.values(v4Checklist).every((v) => v === true);
  }, [v4Checklist]);

  // Handlers - Move Kanban Task
  function handleMoveTask(id, nextStage) {
    if (isReadOnly) return;
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    setTasks(tasks.map((t) => (t.id === id ? { ...t, stage: nextStage } : t)));

    logAction({
      action: "jira_task_stage_transition",
      details: `Transitioned issue '${task.id}' (${task.summary}) stage: ${task.stage} -> ${nextStage}`,
      status: "success",
      sql: `UPDATE "JiraIssues" SET "stage" = '${nextStage}', "updatedAt" = NOW() WHERE "issueKey" = '${id}'`,
    });
    alert(`Jira ticket ${id} transitioned to ${nextStage}.`);
  }

  // Handlers - Create Story
  function handleCreateStory(e) {
    e.preventDefault();
    if (!storyUser.trim() || !storyFeature.trim() || isReadOnly) return;

    const newStory = {
      id: `AIMS-ST-${Date.now().toString().slice(-4)}`,
      user: storyUser,
      feature: storyFeature,
      benefit: storyBenefit,
      value: storyValue,
      owner: storyOwner,
      estimate: storyEstimate,
      epic: storyEpic,
    };

    setCustomStories([newStory, ...customStories]);

    logAction({
      action: "jira_story_scaffolded",
      details: `Scaffolded User Story: 'As a ${newStory.user}, I want ${newStory.feature}...' (Epic: ${newStory.epic}, Estimate: ${newStory.estimate})`,
      status: "success",
      sql: `INSERT INTO "JiraIssues" ("issueKey", "summary", "issueType", "epicKey", "assignee", "estimate") VALUES ('${newStory.id}', 'As a ${newStory.user}, I want ${newStory.feature}', 'Story', '${newStory.epic}', '${newStory.owner}', '${newStory.estimate}')`,
    });

    setStoryFeature("");
    setStoryBenefit("");
    alert(`Story ${newStory.id} generated and injected into sprint backlog.`);
  }

  // Handlers - Priority Matrix Calculation
  const computedPriorityScore = useMemo(() => {
    // Score formula = (Revenue * 0.4) + (Retention * 0.3) + (Adoption * 0.2) + (Efficiency * 0.1)
    const score = (scoreRevenue * 0.4) + (scoreRetention * 0.3) + (scoreAdoption * 0.2) + (scoreEfficiency * 0.1);
    return score.toFixed(1);
  }, [scoreRevenue, scoreRetention, scoreAdoption, scoreEfficiency]);

  function handleSavePriorityScore() {
    if (isReadOnly) return;
    setMatrixScores({
      ...matrixScores,
      [selectedPriorEpic]: computedPriorityScore,
    });

    logAction({
      action: "jira_priority_registered",
      details: `Logged Priority Score for Epic ${selectedPriorEpic}: Score ${computedPriorityScore} (Rev: ${scoreRevenue}, Ret: ${scoreRetention})`,
      status: "success",
      sql: `UPDATE "ProductEpics" SET "priorityScore" = ${computedPriorityScore} WHERE "epicKey" = '${selectedPriorEpic}'`,
    });
    alert(`Epic priority score saved: ${computedPriorityScore} pts.`);
  }

  // Handlers - Checklist Toggles
  function handleChecklistToggle(key) {
    if (isReadOnly) return;
    const nextChecklist = { ...v4Checklist, [key]: !v4Checklist[key] };
    setV4Checklist(nextChecklist);

    logAction({
      action: "v4_completion_checklist_mutated",
      details: `Toggled completion gate: '${key}' -> ${nextChecklist[key] ? "APPROVED" : "PENDING"}`,
      status: "info",
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-sm shadow">📋</span>
            Execution & Roadmaps Framework
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Scaffold sprint user stories, prioritize product epics, configure 30/60/90 roadmap targets, and compile the Enterprise Bible V4.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl">
          <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Sprint 12 Active</span>
        </div>
      </div>

      {/* Primary KPI widgets strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Sprint Velocity</span>
          <div className="text-xl font-black text-slate-900 mt-1">45 Story pts</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Goal achieved: 94% success</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Epics Scope Coverage</span>
          <div className="text-xl font-black text-slate-900 mt-1">10 Epics mapped</div>
          <span className="text-[10px] text-indigo-650 font-bold block mt-1">100% of Volume 4 scope</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Release Success Rate</span>
          <div className="text-xl font-black text-slate-900 mt-1">100% Success</div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-1">Zero hotfixes required</span>
        </div>
        <div className="card p-4 border border-slate-200 bg-white">
          <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Enterprise V4 Status</span>
          <div className="text-xl font-black text-slate-900 mt-1">{isV4Complete ? "V4 Approved" : "Gates Pending"}</div>
          <span className="text-[10px] text-indigo-600 font-bold block mt-1">Volume 4 certification</span>
        </div>
      </div>

      {/* Sub tabs switches */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "kanban", label: "Sprint Kanban board", icon: "🛹" },
          { id: "epics", label: "Epics & Story Templates", icon: "📖" },
          { id: "prioritization", label: "Priority Matrix", icon: "🎯" },
          { id: "roadmap", label: "Product Roadmaps", icon: "🗺️" },
          { id: "completion", label: "Volume 4 Completion Check", icon: "🎓" },
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

      {/* 1. SPRINT KANBAN BOARD */}
      {activeSubTab === "kanban" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Jira Project Board (Key: AIMS)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              {["Backlog", "Ready", "In Progress", "QA", "Done", "Released"].map((stage) => {
                const stageTasks = tasks.filter((t) => t.stage === stage);
                return (
                  <div key={stage} className="p-2.5 border border-slate-100 bg-slate-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b pb-1">
                      <span className="text-[10px] font-extrabold uppercase text-slate-500">{stage}</span>
                      <span className="text-[9px] font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded-full border">{stageTasks.length}</span>
                    </div>

                    <div className="space-y-2">
                      {stageTasks.length === 0 ? (
                        <span className="text-[9px] text-slate-400 block italic text-center py-4">Empty</span>
                      ) : (
                        stageTasks.map((t) => (
                          <div key={t.id} className="p-2 border border-slate-200 bg-white rounded-lg space-y-1.5 hover:shadow-sm">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-[9px] text-slate-450 block">{t.id}</span>
                              <span className={`px-1 rounded text-[8px] font-black uppercase ${
                                t.priority === "Critical" ? "bg-rose-50 text-rose-800" :
                                t.priority === "High" ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-600"
                              }`}>{t.priority}</span>
                            </div>
                            <span className="font-bold text-[10px] text-slate-850 block leading-tight">{t.summary}</span>
                            <div className="flex justify-between text-[9px] font-semibold text-slate-400">
                              <span>Est: {t.estimate}</span>
                              <span>{t.assignee.split(" ")[0]}</span>
                            </div>
                            
                            <select
                              value={t.stage}
                              onChange={(e) => handleMoveTask(t.id, e.target.value)}
                              disabled={isReadOnly}
                              className="text-[9px] font-bold border rounded p-0.5 w-full bg-white mt-1.5"
                            >
                              <option value="Backlog">Backlog</option>
                              <option value="Ready">Ready</option>
                              <option value="In Progress">In Progress</option>
                              <option value="QA">QA</option>
                              <option value="Done">Done</option>
                              <option value="Released">Released</option>
                            </select>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. EPICS & STORY TEMPLATES */}
      {activeSubTab === "epics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* EPICS CATALOG */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Platform Epics Catalog (1 through 10)</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase pb-1.5">
                      <th className="pb-1.5">Epic Key</th>
                      <th className="pb-1.5">Title Name</th>
                      <th className="pb-1.5">Strategic Business Value target</th>
                      <th className="pb-1.5 text-right">Epic Owner</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRODUCT_EPICS.map((ep) => (
                      <tr key={ep.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-2.5 font-mono font-bold text-indigo-700">{ep.id}</td>
                        <td className="py-2.5 font-bold text-slate-850">{ep.title}</td>
                        <td className="py-2.5 text-slate-600 font-semibold leading-relaxed">{ep.businessValue}</td>
                        <td className="py-2.5 text-right font-bold text-slate-550">{ep.owner.split(" (")[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* STORY TEMPLATE GENERATOR */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">User Story Template Builder</h3>
              <form onSubmit={handleCreateStory} className="space-y-3 text-xs font-semibold text-slate-650">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">As a [User Type]</label>
                  <input
                    type="text"
                    value={storyUser}
                    onChange={(e) => setStoryUser(e.target.value)}
                    placeholder="e.g. Marketing Manager"
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">I want [Feature]</label>
                  <input
                    type="text"
                    value={storyFeature}
                    onChange={(e) => setStoryFeature(e.target.value)}
                    placeholder="e.g. AI campaign wizards"
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">So that [Business Benefit]</label>
                  <input
                    type="text"
                    value={storyBenefit}
                    onChange={(e) => setStoryBenefit(e.target.value)}
                    placeholder="e.g. increase lead conversions"
                    className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    required
                    disabled={isReadOnly}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Epic Mapping</label>
                    <select
                      value={storyEpic}
                      onChange={(e) => setStoryEpic(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    >
                      {PRODUCT_EPICS.map((ep) => (
                        <option key={ep.id} value={ep.id}>{ep.id} - {ep.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Owner Assignee</label>
                    <select
                      value={storyOwner}
                      onChange={(e) => setStoryOwner(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                    >
                      <option value="Alice Smith">Alice Smith</option>
                      <option value="Bob Johnson">Bob Johnson</option>
                      <option value="Carol White">Carol White</option>
                      <option value="Dave Miller">Dave Miller</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition mt-4 disabled:opacity-40"
                >
                  Generate backlogs User Story
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 3. PRIORITIZATION MATRIX */}
      {activeSubTab === "prioritization" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* INPUT MATRIX */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Prioritization Framework Settings</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-650 py-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Target Epic</label>
                  <select
                    value={selectedPriorEpic}
                    onChange={(e) => setSelectedPriorEpic(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 outline-none"
                  >
                    {PRODUCT_EPICS.map((ep) => (
                      <option key={ep.id} value={ep.id}>{ep.id} - {ep.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Revenue Impact (P1)</span>
                    <span className="font-mono text-slate-900">{scoreRevenue} pts</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scoreRevenue}
                    onChange={(e) => setScoreRevenue(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Customer Retention (P2)</span>
                    <span className="font-mono text-slate-900">{scoreRetention} pts</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scoreRetention}
                    onChange={(e) => setScoreRetention(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>User Adoption (P3)</span>
                    <span className="font-mono text-slate-900">{scoreAdoption} pts</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scoreAdoption}
                    onChange={(e) => setScoreAdoption(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Operational Efficiency (P4)</span>
                    <span className="font-mono text-slate-900">{scoreEfficiency} pts</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={scoreEfficiency}
                    onChange={(e) => setScoreEfficiency(parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full accent-indigo-600"
                  />
                </div>

                <div className="pt-2 border-t flex justify-between items-center">
                  <span className="font-bold text-slate-700">Priority Score:</span>
                  <span className="text-lg font-black text-indigo-700">{computedPriorityScore} / 10.0</span>
                </div>

                <button
                  onClick={handleSavePriorityScore}
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition disabled:opacity-40"
                >
                  Commit Priority Score
                </button>
              </div>
            </div>

            {/* RANKING MATRIX */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Scored priority Matrix</h3>
              
              <div className="space-y-3 text-xs">
                {PRODUCT_EPICS.map((ep) => {
                  const savedScore = matrixScores[ep.id] || "N/A";
                  return (
                    <div key={ep.id} className="flex justify-between items-center p-2.5 border rounded-xl hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-800">{ep.id} - {ep.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{ep.businessValue}</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-xl text-[10px] font-black font-mono">
                        {savedScore} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 4. PRODUCT ROADMAP */}
      {activeSubTab === "roadmap" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Product roadmap horizons</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-semibold text-slate-650">
              
              {/* 30 DAYS */}
              <div className="p-4 border rounded-xl bg-slate-50/50 hover:shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-slate-850 block text-xs">30-Day Core Foundation</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-slate-500 font-medium">
                  <li>Deploy AI Content Engine (Epics 1, 4)</li>
                  <li>Scaffold Customer workspace Center (Epic 5)</li>
                  <li>Implement Stripe Billing checkout (Epic 9)</li>
                  <li>Build initial scraper components</li>
                </ul>
              </div>

              {/* 60 DAYS */}
              <div className="p-4 border rounded-xl bg-slate-50/50 hover:shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-slate-850 block text-xs">60-Day Growth Features</span>
                  <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Active</span>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-slate-500 font-medium">
                  <li>Release Multi-Channel Campaign builder (Epic 2)</li>
                  <li>Integrate Landing Page templates (Epic 3)</li>
                  <li>Scaffold white-label Agency portal (Epic 6)</li>
                  <li>Deploy initial SEO tracking graphs</li>
                </ul>
              </div>

              {/* 90 DAYS */}
              <div className="p-4 border rounded-xl bg-slate-50/50 hover:shadow-sm space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="font-bold text-slate-850 block text-xs">90-Day Scale & Optimization</span>
                  <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Staged</span>
                </div>
                <ul className="space-y-2 list-disc pl-4 text-slate-500 font-medium">
                  <li>Deploy AI Campaign Automation (Epic 10)</li>
                  <li>Advanced Analytics & CS dashboards (Epics 7, 8)</li>
                  <li>Partner referrals affiliate module</li>
                  <li>Custom domain CNAME mapping</li>
                </ul>
              </div>

            </div>

            {/* 12 MONTH VISION */}
            <div className="p-4 border border-slate-100 bg-slate-50 rounded-xl space-y-3 text-xs leading-relaxed font-medium">
              <span className="font-bold text-slate-850 block">12-Month Product Vision: Leading AI Marketing Operating System</span>
              <p className="text-slate-500 font-medium">
                Phase 1 MVP launch captures local agency trials. Phase 2 extends white-label resellers markup features. Phase 3 introduces enterprise IAM policies, single sign-on authentication, and dedicated cluster nodes. Phase 4 establishes AI Platform Leadership as a unified operating system for digital agencies globally.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. VOLUME 4 COMPLETION CHECKLIST */}
      {activeSubTab === "completion" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GATES CHECKLIST */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Volume 4 Completion Criteria</h3>
              <p className="text-xs text-slate-400 font-medium">Toggle stakeholder approvals checklist to compile the final Enterprise Bible V4:</p>
              
              <div className="space-y-2.5 pt-2 text-xs">
                {[
                  { key: "partsComplete", label: "All 14 Parts Complete", desc: "All system modules scaffolded" },
                  { key: "architectureApproved", label: "Architecture Approved", desc: "Node structures verified" },
                  { key: "marketingApproved", label: "Marketing Approved", desc: "ROI calculations completed" },
                  { key: "operationsApproved", label: "Operations Approved", desc: "Deploy configurations mapped" },
                  { key: "roadmapApproved", label: "Roadmap Approved", desc: "Sprints priority matrices committed" },
                ].map((item) => {
                  const approved = v4Checklist[item.key];
                  return (
                    <button
                      key={item.key}
                      onClick={() => handleChecklistToggle(item.key)}
                      disabled={isReadOnly}
                      className={`w-full p-3 border rounded-xl text-left transition flex items-center justify-between gap-3 ${
                        approved
                          ? "border-emerald-200 bg-emerald-50/10"
                          : "border-slate-250 hover:bg-slate-50"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs text-slate-800 block">{item.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium block leading-normal">{item.desc}</span>
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
            </div>

            {/* CERTIFICATE DISPLAY */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4 flex flex-col justify-center">
              {isV4Complete ? (
                <div className="border-4 border-double border-indigo-600 p-8 rounded-2xl text-center space-y-4 bg-indigo-50/20 shadow-md">
                  <span className="text-3xl block">🏆</span>
                  <h3 className="font-black text-slate-900 tracking-tight text-lg uppercase bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                    AI Marketing Studio Enterprise Bible V4
                  </h3>
                  <div className="h-0.5 bg-indigo-200 w-24 mx-auto" />
                  <p className="text-xs text-slate-650 leading-relaxed font-semibold max-w-md mx-auto">
                    This certifies that the complete **AI Marketing Studio Ecosystem** has been fully scaffolded, verified, and approved across all 14 parts of the Enterprise Roadmap.
                  </p>
                  <div className="flex justify-between max-w-sm mx-auto pt-6 text-[10px] text-slate-400 font-bold font-mono">
                    <div>
                      <span className="block border-b border-slate-300 pb-1">Architecture Team</span>
                      <span className="block mt-1 uppercase text-indigo-700">VERIFIED</span>
                    </div>
                    <div>
                      <span className="block border-b border-slate-300 pb-1">Operations Team</span>
                      <span className="block mt-1 uppercase text-indigo-700">APPROVED</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed rounded-2xl text-center text-xs text-slate-400 italic font-medium">
                  Complete all stakeholder approval checklist items to compile and view the Official Enterprise Bible V4 certificate.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
