"use client";
import { useState, useMemo } from "react";

// Mock seed data
const INITIAL_PROJECTS = [
  { id: "proj_1", name: "Summer Campaign Launch", status: "In Progress", deadline: "2026-06-25", members: ["Pratik", "Alice"], progress: 65 },
  { id: "proj_2", name: "Product Feature Video", status: "Review", deadline: "2026-06-18", members: ["Bob", "Diana"], progress: 90 },
  { id: "proj_3", name: "Q2 Newsletter Blast", status: "Completed", deadline: "2026-06-12", members: ["Charlie"], progress: 100 },
  { id: "proj_4", name: "TikTok Ad Testing", status: "Planning", deadline: "2026-07-02", members: ["Alice", "Bob"], progress: 20 },
];

const INITIAL_ASSETS = [
  { id: "ast_1", type: "Blog", title: "10 Growth Strategies for SaaS in 2026", folder: "Summer Launch", tags: ["SaaS", "SEO"], content: "SEO in 2026 is driven by semantic brand signals, user experience, and full-funnel content loops. In this guide, we break down how to implement...", version: 2, history: ["Version 1 (2026-06-12): Initial seed draft.", "Version 2 (2026-06-13): Optimized headings and keywords using AI strategist."], date: "2026-06-13" },
  { id: "ast_2", type: "Ad", title: "Facebook Lead Magnet Promo", folder: "Paid Ads", tags: ["Leads", "Facebook"], content: "Get more leads in 5 minutes with our free marketing strategy template. Ready-to-use hooks, structures, and CTAs. Download free now!", version: 1, history: ["Version 1 (2026-06-12): First saved template."], date: "2026-06-12" },
  { id: "ast_3", type: "Email", title: "Summer Launch Invitation", folder: "Summer Launch", tags: ["Newsletter", "Promo"], content: "Hey there! We are excited to announce our brand new AI marketing studio release. You can now manage multi-clients, white-labels, and collaboration...", version: 3, history: ["Version 1: Draft email.", "Version 2: Refined body copy to causal tone.", "Version 3 (2026-06-13): Added landing page links and CTA button."], date: "2026-06-13" },
  { id: "ast_4", type: "Social Post", title: "LinkedIn Launch Announcement", folder: "Social Queue", tags: ["LinkedIn", "Launch"], content: "Big news today! We just deployed Phase 4 and 5 updates to the AI Marketing Studio ecosystem. Centralized governance, resale invoice logs, CNAME custom domains, and collaboration comments...", version: 1, history: ["Version 1 (2026-06-13): Saved LinkedIn copy."], date: "2026-06-13" },
  { id: "ast_5", type: "Landing Page", title: "Acme Cyberpunk LP Sections", folder: "Paid Ads", tags: ["Landing Page", "Acme"], content: "Feature Grid section, CTA buttons, and high-converting testimonial banners grounding on scraped brand signals...", version: 1, history: ["Version 1 (2026-06-12): Default canvas scaffold."], date: "2026-06-12" },
];

const INITIAL_CHANNELS = [
  { id: "wp", name: "WordPress Website", status: "Connected", url: "https://acmeretail.com/blog" },
  { id: "linkedin", name: "LinkedIn Page", status: "Connected", url: "https://linkedin.com/company/acme" },
  { id: "facebook", name: "Facebook Business", status: "Connected", url: "https://facebook.com/acmepromo" },
  { id: "instagram", name: "Instagram Business", status: "Disconnected", url: "" },
  { id: "twitter", name: "X / Twitter Account", status: "Connected", url: "https://x.com/acmepromo" },
  { id: "mailchimp", name: "Mailchimp Newsletter", status: "Connected", url: "https://us12.admin.mailchimp.com" },
];

const INITIAL_SCHEDULE = [
  { id: "sch_1", assetId: "ast_4", channelId: "linkedin", time: "2026-06-15T09:00:00Z", status: "Scheduled" },
  { id: "sch_2", assetId: "ast_3", channelId: "mailchimp", time: "2026-06-16T14:00:00Z", status: "Scheduled" },
];

const INITIAL_COLLAB = {
  tasks: [
    { id: "tsk_1", text: "Refine landing page primary CTA copy", done: false, assigned: "Alice" },
    { id: "tsk_2", text: "Approve summer promotional email layout", done: true, assigned: "Pratik" },
    { id: "tsk_3", text: "Submit Facebook leads copy to compliance queue", done: false, assigned: "Bob" },
  ],
  comments: [
    { id: "com_1", author: "Alice Smith", text: "This blog post looks great! Should we add a couple more keywords around semantic SEO?", timestamp: "2026-06-13T12:00:00Z", assetTitle: "10 Growth Strategies for SaaS" },
    { id: "com_2", author: "Pratik Patel", text: "Agreed. I escalated this to the team review desk. Let's optimize heading 2.", timestamp: "2026-06-13T12:45:00Z", assetTitle: "10 Growth Strategies for SaaS" },
  ]
};

const INITIAL_ALERTS = [
  { id: "alt_1", type: "approval", text: "Approval Needed: Julia Roberts submitted Facebook Lead Magnet Promo", read: false },
  { id: "alt_2", type: "publish", text: "Content Published: LinkedIn Launch Announcement has been deployed live", read: true },
  { id: "alt_3", type: "usage", text: "Usage Alert: Organization has consumed 84% of standard monthly token credits", read: false },
  { id: "alt_4", type: "system", text: "System Update: Version 1.2.0 deployed. Fixed Stripe webhook sync latency", read: true },
];

export default function CustomerWorkspace({ strategy, onNavigate, currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Local state registers
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [channels, setChannels] = useState(INITIAL_CHANNELS);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULE);
  const [collab, setCollab] = useState(INITIAL_COLLAB);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Brand Center Form Settings
  const [brandVoice, setBrandVoice] = useState("Casual, authoritative, friendly yet technically precise.");
  const [brandMission, setBrandMission] = useState("Empower businesses to launch AI marketing campaigns in minutes.");
  const [brandProducts, setBrandProducts] = useState("Campaign Studio, Copy Social Generator, Landing Page Builder");
  const [brandServices, setBrandServices] = useState("Growth Audits, Custom Strategy Formulation");
  const [brandAudience, setBrandAudience] = useState("SaaS teams, agencies, and e-commerce creators.");
  const [brandCompetitors, setBrandCompetitors] = useState("Marketo, Hubspot, CopyAI");
  const [brandPrimaryColor, setBrandPrimaryColor] = useState("#6366f1");
  const [brandSecondaryColor, setBrandSecondaryColor] = useState("#10b981");
  const [brandFontFamily, setBrandFontFamily] = useState("Outfit, sans-serif");
  const [brandLogoName, setBrandLogoName] = useState("VibeStudio Icon Logo");

  // Content Library search and filter state
  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryTypeFilter, setLibraryTypeFilter] = useState("all");
  const [selectedAssetId, setSelectedAssetId] = useState(null);
  const [editingAssetContent, setEditingAssetContent] = useState("");

  // AI Chat Assistant state
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", text: "Hello! I am your AI Marketing Assistant. Ask me to write ad copies, suggest SEO keyword groups, compile campaign strategies, or review your brand guidelines." }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // Form state - Schedule Asset Post
  const [schAssetId, setSchAssetId] = useState("ast_1");
  const [schChannelId, setSchChannelId] = useState("wp");
  const [schTime, setSchTime] = useState("");

  // Form state - Add Collab Task
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskAssigned, setNewTaskAssigned] = useState("Alice");

  // Form state - Add Collab Comment
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentAsset, setNewCommentAsset] = useState("10 Growth Strategies for SaaS");

  const campaignsCount = strategy?.campaigns?.length || 0;
  const isReadOnly = currentRole === "read_only";

  // Calculate metrics
  const activeProjectsCount = projects.filter(p => p.status !== "Completed").length;
  const totalContentGenerated = assets.length;
  const scheduledCount = schedules.filter(s => s.status === "Scheduled").length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  // Handlers - Brand Center
  function handleSaveBrandCenter(e) {
    e.preventDefault();
    if (isReadOnly) return;

    logAction({
      action: "brand_center_updated",
      details: `Saved customer branding profile settings. Voice: "${brandVoice.slice(0, 30)}..."`,
      status: "success",
      sql: `UPDATE "Brands" SET "voice"='${brandVoice}', "mission"='${brandMission}', "colors"='{"primary": "${brandPrimaryColor}"}'`
    });

    alert("Brand Center guidelines successfully updated. New generation templates will inherit these rules.");
  }

  // Handlers - Project CRUD
  function handleCreateProject(name, deadline, members) {
    if (isReadOnly) return;
    const newProj = {
      id: `proj_${Date.now()}`,
      name,
      status: "Planning",
      deadline,
      members: members.split(",").map(m => m.trim()),
      progress: 0
    };
    setProjects([...projects, newProj]);

    logAction({
      action: "project_created",
      details: `Created new workspace project: ${newProj.name}`,
      status: "success",
      sql: `INSERT INTO "Projects" ("name", "status", "deadline") VALUES ('${newProj.name}', 'Planning', '${newProj.deadline}')`
    });
  }

  // Handlers - Content Library CRUD
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(librarySearch.toLowerCase()) || 
                            a.content.toLowerCase().includes(librarySearch.toLowerCase());
      const matchesType = libraryTypeFilter === "all" || a.type === libraryTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [assets, librarySearch, libraryTypeFilter]);

  const selectedAsset = useMemo(() => {
    return assets.find(a => a.id === selectedAssetId);
  }, [assets, selectedAssetId]);

  function handleSaveAssetEdit() {
    if (!selectedAssetId || isReadOnly) return;

    setAssets(prev =>
      prev.map(a => {
        if (a.id === selectedAssetId) {
          const nextVersion = a.version + 1;
          const nextHistory = [
            `Version ${nextVersion} (${new Date().toISOString().slice(0, 10)}): Updated by user ${currentRole.replace("_", " ")}`,
            ...a.history
          ];
          
          logAction({
            action: "content_asset_updated",
            details: `Updated asset library file: '${a.title}' to Version ${nextVersion}`,
            status: "success",
            sql: `UPDATE "ContentAssets" SET "content"='{...}', "version"=${nextVersion} WHERE "id"='${a.id}'`
          });

          return {
            ...a,
            content: editingAssetContent,
            version: nextVersion,
            history: nextHistory
          };
        }
        return a;
      })
    );

    alert("Asset changes saved successfully!");
  }

  // Handlers - AI Chat Assistant
  async function handleSendChatMessage(e) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: "user", text: chatInput };
    setChatHistory(prev => [...prev, userMessage]);
    setChatInput("");
    setChatLoading(true);

    logAction({
      action: "ai_assistant_chat_requested",
      details: `Dispatched chat request: "${chatInput.slice(0, 30)}..."`,
      status: "info"
    });

    // Simulate AI generation delay
    setTimeout(() => {
      let responseText = "";
      const lower = userMessage.text.toLowerCase();
      if (lower.includes("idea") || lower.includes("campaign")) {
        responseText = "Campaign Idea suggestion:\n\n1. Target Audience: SaaS teams experiencing high drop-offs.\n2. Strategy: 'Scale Fast' full-funnel challenge.\n3. Channel Mix: LinkedIn positioning posts + retargeting Lead Magnets.\n4. Headline recommendation: 'Deploy full campaign funnels in 10 minutes.'";
      } else if (lower.includes("seo") || lower.includes("keywords")) {
        responseText = "SEO Keyword suggestions:\n\n- Primary: 'AI marketing strategist software' (SV: 2,400, Difficulty: Low)\n- LSI: 'multi-tenant campaign manager', 'on-page brand intelligence extraction'\n- Strategy: Structure heading 2 around semantic query matches.";
      } else if (lower.includes("ad") || lower.includes("copy")) {
        responseText = "Suggested Ad Copy:\n\nPrimary Text: 'Stop spending weeks designing marketing funnels. Scrape your site guides, target customer personas, and generate blogs, social copies, and landing pages instantly.'\n\nHeadline: 'Deploy full campaigns in seconds ⚡'\n\nCTA: Learn More";
      } else {
        responseText = "Based on your Brand Center rules ('" + brandVoice.slice(0, 20) + "...'), I recommend focusing on clear value propositions. Highlight how you increase campaign output by 10x while maintaining complete brand guidelines compliance.";
      }

      setChatHistory(prev => [...prev, { role: "assistant", text: responseText }]);
      setChatLoading(false);

      logAction({
        action: "ai_assistant_chat_responded",
        details: "Compiled chat assistant recommendation output.",
        status: "success"
      });
    }, 1500);
  }

  // Handlers - Publishing Center
  function handleSchedulePost(e) {
    e.preventDefault();
    if (!schTime || isReadOnly) return;

    const newSch = {
      id: `sch_${Date.now()}`,
      assetId: schAssetId,
      channelId: schChannelId,
      time: schTime,
      status: "Scheduled"
    };

    setSchedules([...schedules, newSch]);

    const assetTitle = assets.find(a => a.id === schAssetId)?.title || schAssetId;
    const channelName = channels.find(c => c.id === schChannelId)?.name || schChannelId;

    logAction({
      action: "content_publishing_scheduled",
      details: `Scheduled asset '${assetTitle}' to post on channel '${channelName}' at ${new Date(schTime).toLocaleString()}`,
      status: "success",
      sql: `INSERT INTO "ScheduledPosts" ("assetId", "channelId", "time") VALUES ('${schAssetId}', '${schChannelId}', '${schTime}')`
    });

    setSchTime("");
    alert("Post scheduled successfully in publishing calendar queue.");
  }

  function handleDisconnectChannel(id, name, connected) {
    if (isReadOnly) return;
    setChannels(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = connected ? "Disconnected" : "Connected";
          logAction({
            action: connected ? "channel_disconnected" : "channel_connected",
            details: `Mutated publishing channel connection context for: ${name} to '${nextStatus}'`,
            status: connected ? "warning" : "success"
          });
          return { ...c, status: nextStatus, url: nextStatus === "Connected" ? "https://site.com" : "" };
        }
        return c;
      })
    );
  }

  // Handlers - Collaboration Tasks
  function handleAddTask(e) {
    e.preventDefault();
    if (!newTaskText.trim() || isReadOnly) return;

    const newTsk = {
      id: `tsk_${Date.now()}`,
      text: newTaskText,
      done: false,
      assigned: newTaskAssigned
    };

    setCollab(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTsk]
    }));

    logAction({
      action: "collab_task_created",
      details: `Created workflow task: "${newTsk.text}" (Assigned: ${newTsk.assigned})`,
      status: "info",
      sql: `INSERT INTO "Tasks" ("text", "done", "assigned") VALUES ('${newTsk.text}', false, '${newTsk.assigned}')`
    });

    setNewTaskText("");
  }

  function handleToggleTask(tskId, tskText, isDone) {
    if (isReadOnly) return;
    setCollab(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === tskId) {
          logAction({
            action: isDone ? "collab_task_uncompleted" : "collab_task_completed",
            details: `Marked task "${tskText}" as ${!isDone ? "COMPLETED" : "UNFINISHED"}`,
            status: "success",
            sql: `UPDATE "Tasks" SET "done" = ${!isDone} WHERE "id" = '${tskId}'`
          });
          return { ...t, done: !isDone };
        }
        return t;
      })
    }));
  }

  // Handlers - Collaboration Comments
  function handleAddComment(e) {
    e.preventDefault();
    if (!newCommentText.trim() || isReadOnly) return;

    const newCom = {
      id: `com_${Date.now()}`,
      author: "Pratik Patel (You)",
      text: newCommentText,
      timestamp: new Date().toISOString(),
      assetTitle: newCommentAsset
    };

    setCollab(prev => ({
      ...prev,
      comments: [...prev.comments, newCom]
    }));

    logAction({
      action: "collab_comment_added",
      details: `Added feedback comment to asset '${newCom.assetTitle}': "${newCom.text.slice(0, 30)}..."`,
      status: "success",
      sql: `INSERT INTO "Comments" ("author", "text", "assetTitle") VALUES ('${newCom.author}', '${newCom.text}', '${newCom.assetTitle}')`
    });

    setNewCommentText("");
  }

  // Handlers - Notifications read
  function handleMarkAllAlertsRead() {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
    logAction({
      action: "notifications_cleared",
      details: "Marked all active notification alerts as read.",
      status: "info"
    });
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-sm shadow">💻</span>
            Customer Operations Workspace
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Centralized marketing operations environment to define brands, organize assets, chat with AI, publish to networks, and collaborate.
          </p>
        </div>
        
        {/* Notifications badge */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveSubTab("collaboration")}
            className="relative p-2 bg-white rounded-xl border shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            <span className="text-xs">🔔</span>
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">Alerts</span>
            {unreadAlerts > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "overview", label: "Operations Dashboard", icon: "📊" },
          { id: "brandcenter", label: "Brand Center", icon: "🎨" },
          { id: "library", label: "Content Library", icon: "📁" },
          { id: "assistant", label: "AI Chat Assistant", icon: "💬" },
          { id: "publishing", label: "Publishing Center", icon: "📤" },
          { id: "collaboration", label: "Collaboration & Alerts", icon: "🤝" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setSelectedAssetId(null);
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

      {/* 1. OPERATIONS DASHBOARD */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Projects</span>
              <div className="text-xl font-black text-slate-900 mt-1">{activeProjectsCount}</div>
              <span className="text-[10px] text-indigo-650 font-bold block mt-1">Plan: In Progress</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Content Assets</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalContentGenerated}</div>
              <span className="text-[10px] text-violet-650 font-bold block mt-1">Generated by AI</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Scheduled Posts</span>
              <div className="text-xl font-black text-slate-900 mt-1">{scheduledCount}</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">Ready in calendar</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Target Conversion</span>
              <div className="text-xl font-black text-slate-900 mt-1">3.85%</div>
              <span className="text-[10px] text-cyan-600 font-bold block mt-1">Optimized by layouts</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Recent projects status */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2">Active Project Tracking</h3>
              
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1.5 border border-slate-100 p-3 rounded-xl bg-slate-50 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800 block">{proj.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Deadline: {proj.deadline} | Members: {proj.members.join(", ")}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          proj.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                          proj.status === "Review" ? "bg-amber-100 text-amber-800" :
                          proj.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-slate-200 text-slate-700"
                        }`}>{proj.status}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            proj.progress === 100 ? "bg-emerald-500" : proj.progress > 50 ? "bg-blue-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="font-bold text-[10px] text-slate-600">{proj.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Summary Metrics */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                <span>Performance Summary</span>
                <span className="text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black uppercase">Live KPIs</span>
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-650 font-medium">
                <div className="flex justify-between border-b pb-1.5">
                  <span>Content Produced</span>
                  <span className="font-bold text-slate-900">{campaignsCount * 4 || 12} assets</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Campaign Performance</span>
                  <span className="font-bold text-slate-900">↑ 14.8% CTR</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Leads Inferred</span>
                  <span className="font-bold text-slate-900">842 conversions</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span>Engagement rate</span>
                  <span className="font-bold text-slate-900">4.9% LinkedIn</span>
                </div>
                <div className="flex justify-between">
                  <span>SaaS Conversions</span>
                  <span className="font-bold text-slate-900">3.85% goal</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. BRAND CENTER TAB */}
      {activeSubTab === "brandcenter" && (
        <form onSubmit={handleSaveBrandCenter} className="card p-5 border border-slate-200 bg-white space-y-6">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
            <span>Brand Center Guideline Database</span>
            {isReadOnly && (
              <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-bold">⚠️ Read Only Context</span>
            )}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Core Guidelines */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Brand Voice Tone rules</label>
                <textarea
                  value={brandVoice}
                  onChange={(e) => setBrandVoice(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-20"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Brand Mission statement</label>
                <textarea
                  value={brandMission}
                  onChange={(e) => setBrandMission(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-20"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Products Offered</label>
                  <input
                    type="text"
                    value={brandProducts}
                    onChange={(e) => setBrandProducts(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    disabled={isReadOnly}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Services Offered</label>
                  <input
                    type="text"
                    value={brandServices}
                    onChange={(e) => setBrandServices(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    disabled={isReadOnly}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Audience & Styles */}
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Target Audience profile</label>
                <input
                  type="text"
                  value={brandAudience}
                  onChange={(e) => setBrandAudience(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400">Core Competitors list</label>
                <input
                  type="text"
                  value={brandCompetitors}
                  onChange={(e) => setBrandCompetitors(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  disabled={isReadOnly}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Brand Fonts Family</label>
                  <input
                    type="text"
                    value={brandFontFamily}
                    onChange={(e) => setBrandFontFamily(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    disabled={isReadOnly}
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Logo Header Asset</label>
                  <input
                    type="text"
                    value={brandLogoName}
                    onChange={(e) => setBrandLogoName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    disabled={isReadOnly}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Primary Color Hex</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={brandPrimaryColor}
                      onChange={(e) => setBrandPrimaryColor(e.target.value)}
                      disabled={isReadOnly}
                      className="h-8 w-8 rounded border p-0.5 bg-slate-50 outline-none cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase text-slate-500">{brandPrimaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Secondary Color Hex</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={brandSecondaryColor}
                      onChange={(e) => setBrandSecondaryColor(e.target.value)}
                      disabled={isReadOnly}
                      className="h-8 w-8 rounded border p-0.5 bg-slate-50 outline-none cursor-pointer"
                    />
                    <span className="text-xs font-mono uppercase text-slate-500">{brandSecondaryColor}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isReadOnly}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
          >
            Deploy Brand Guidelines
          </button>
        </form>
      )}

      {/* 3. CONTENT LIBRARY TAB */}
      {activeSubTab === "library" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* DIRECTORY LISTING */}
            <div className="lg:col-span-1 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Folder directories</h3>
              
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="🔍 Search files..."
                  value={librarySearch}
                  onChange={(e) => setLibrarySearch(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                />
                <select
                  value={libraryTypeFilter}
                  onChange={(e) => setLibraryTypeFilter(e.target.value)}
                  className="px-2 py-1 text-xs border rounded-xl bg-slate-50 outline-none"
                >
                  <option value="all">All types</option>
                  <option value="Blog">Blogs</option>
                  <option value="Ad">Ads</option>
                  <option value="Email">Emails</option>
                  <option value="Social Post">Socials</option>
                  <option value="Landing Page">Landings</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[350px] overflow-y-auto pt-1">
                {filteredAssets.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      setSelectedAssetId(asset.id);
                      setEditingAssetContent(asset.content);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition text-xs flex items-center justify-between ${
                      selectedAssetId === asset.id
                        ? "border-violet-600 bg-violet-50/20"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-800 block line-clamp-1">{asset.title}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Folder: {asset.folder} | Ver: {asset.version}</span>
                    </div>
                    <span className="text-[8px] bg-slate-200 px-1 py-0.5 rounded text-slate-650 uppercase font-black">{asset.type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FILE EDITOR & VERSION HISTORY */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              {selectedAsset ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start border-b pb-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{selectedAsset.title}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedAsset.tags.map((t) => (
                          <span key={t} className="text-[8px] bg-violet-100 text-violet-850 px-1 py-0.5 rounded font-bold">#{t}</span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-450 font-bold">Last Edited: {selectedAsset.date}</span>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Asset Document Canvas</label>
                    <textarea
                      value={editingAssetContent}
                      onChange={(e) => setEditingAssetContent(e.target.value)}
                      disabled={isReadOnly}
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 font-medium outline-none focus:ring-1 focus:ring-violet-400 h-44 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    {/* Version History Trigger */}
                    <div className="space-y-1 max-w-xs">
                      <span className="text-[9px] font-bold uppercase text-slate-450 tracking-wider block">Document Version History log</span>
                      <div className="text-[9px] text-slate-400 space-y-0.5">
                        {selectedAsset.history.map((h, i) => (
                          <p key={i} className="line-clamp-1">• {h}</p>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleSaveAssetEdit}
                      disabled={isReadOnly}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                    >
                      Save Version {selectedAsset.version + 1}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  📁 Select a file from the folder directory to launch the document canvas and inspect version history.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 4. AI CHAT ASSISTANT TAB */}
      {activeSubTab === "assistant" && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
              <span>Persistent AI Chat Assistant</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </h3>

            {/* Conversation Log */}
            <div className="space-y-4 min-h-[250px] max-h-[350px] overflow-y-auto p-2 border rounded-xl bg-slate-50/50">
              {chatHistory.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-violet-600 text-white rounded-br-none" 
                      : "bg-white border text-slate-700 rounded-bl-none shadow-sm font-medium"
                  }`}>
                    {msg.text.split("\n").map((line, j) => (
                      <p key={j} className={j > 0 ? "mt-1.5" : ""}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5 text-xs text-slate-450 font-bold">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce delay-75">•</span>
                    <span className="animate-bounce delay-150">•</span>
                    <span>AI assistant compiling copy suggestions...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input and Templates */}
            <form onSubmit={handleSendChatMessage} className="space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask for ad copy ideas, SEO suggestions, target competitor analysis..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  required
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Send
                </button>
              </div>

              {/* Template Buttons */}
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 block mb-1.5">Quick template prompts</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Generate Summer Campaign Ideas",
                    "List high SV SEO keyword suggestions",
                    "Compile Facebook Ad Copy hooks",
                    "Draft competitor marketing recommendations",
                  ].map((temp) => (
                    <button
                      key={temp}
                      type="button"
                      onClick={() => setChatInput(temp)}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-lg transition"
                    >
                      {temp}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. PUBLISHING CENTER */}
      {activeSubTab === "publishing" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* CHANNELS INTEGRATIONS */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Publishing Channels Connected</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((chan) => {
                  const connected = chan.status === "Connected";
                  return (
                    <div key={chan.id} className="p-3.5 border border-slate-150 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-800">{chan.name}</span>
                          <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-slate-350"}`} />
                        </div>
                        {connected ? (
                          <span className="text-[10px] text-slate-450 font-mono block mt-0.5 line-clamp-1">{chan.url}</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 block mt-0.5">Integrations available</span>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => handleDisconnectChannel(chan.id, chan.name, connected)}
                          disabled={isReadOnly}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition ${
                            connected
                              ? "bg-slate-150 hover:bg-slate-200 text-slate-650"
                              : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-700"
                          }`}
                        >
                          {connected ? "Disconnect" : "Connect"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SCHEDULE POST FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Schedule Campaign Post</h3>
              <form onSubmit={handleSchedulePost} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Select Asset</label>
                  <select
                    value={schAssetId}
                    onChange={(e) => setSchAssetId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    {assets.map((ast) => (
                      <option key={ast.id} value={ast.id}>{ast.title} ({ast.type})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Publish Channel</label>
                  <select
                    value={schChannelId}
                    onChange={(e) => setSchChannelId(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    {channels.filter(c => c.status === "Connected").map((chan) => (
                      <option key={chan.id} value={chan.id}>{chan.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Launch Date & Time</label>
                  <input
                    type="datetime-local"
                    value={schTime}
                    onChange={(e) => setSchTime(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4 disabled:opacity-40"
                >
                  Schedule to Queue
                </button>
              </form>
            </div>

          </div>

          {/* SCHEDULED POSTS QUEUE */}
          <div className="card p-5 border border-slate-200 bg-white space-y-3 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Calendar Launches</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((sch) => {
                const asset = assets.find(a => a.id === sch.assetId);
                const chan = channels.find(c => c.id === sch.channelId);
                return (
                  <div key={sch.id} className="p-3 border border-slate-150 bg-slate-50/50 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block line-clamp-1">{asset?.title || sch.assetId}</span>
                      <span className="text-[9px] text-slate-450 block mt-0.5">Channel: {chan?.name} | Time: {new Date(sch.time).toLocaleString()}</span>
                    </div>
                    <span className="bg-indigo-100 text-indigo-750 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-indigo-200">
                      {sch.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 6. COLLABORATION & ALERTS */}
      {activeSubTab === "collaboration" && (
        <div className="space-y-6">
          
          {/* NOTIFICATION FEED */}
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Notifications Center Alerts</h3>
              <button 
                onClick={handleMarkAllAlertsRead}
                className="text-[10px] font-bold text-violet-650 hover:underline"
              >
                Mark all as read
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
              {alerts.map((alt) => (
                <div 
                  key={alt.id} 
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    alt.read 
                      ? "bg-slate-50 border-slate-100 text-slate-450" 
                      : "bg-violet-50/20 border-violet-100 text-slate-800 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{
                      alt.type === "approval" ? "🎟️" :
                      alt.type === "publish" ? "📤" :
                      alt.type === "usage" ? "⚠️" : "⚙️"
                    }</span>
                    <p>{alt.text}</p>
                  </div>
                  {!alt.read && (
                    <span className="h-2 w-2 rounded-full bg-violet-600 shrink-0 ml-2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* TASKS LIST */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Workflow Tasks Checklist</h3>
              
              <div className="space-y-3.5 max-h-[300px] overflow-y-auto">
                {collab.tasks.map((tsk) => (
                  <div key={tsk.id} className="flex items-start gap-2.5 text-xs">
                    <input
                      type="checkbox"
                      checked={tsk.done}
                      onChange={() => handleToggleTask(tsk.id, tsk.text, tsk.done)}
                      disabled={isReadOnly}
                      className="mt-0.5 rounded text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${tsk.done ? "line-through text-slate-400" : "text-slate-850"}`}>{tsk.text}</p>
                      <span className="text-[9px] text-slate-450 font-bold block mt-0.5">Assigned to: {tsk.assigned}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="pt-3 border-t space-y-2.5">
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    placeholder="New task details..."
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                  <select
                    value={newTaskAssigned}
                    onChange={(e) => setNewTaskAssigned(e.target.value)}
                    className="px-2 py-1 text-xs border rounded-xl bg-slate-50 outline-none"
                  >
                    <option value="Alice">Alice</option>
                    <option value="Pratik">Pratik</option>
                    <option value="Bob">Bob</option>
                    <option value="Diana">Diana</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-40"
                >
                  Create Task
                </button>
              </form>
            </div>

            {/* COMMENTS BOARD */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Team Comments & Approvals feedback</h3>
              
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {collab.comments.map((com) => (
                  <div key={com.id} className="p-3 border rounded-xl bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between items-center text-slate-450 font-bold text-[9px]">
                      <span>Author: {com.author}</span>
                      <span>{new Date(com.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-semibold">&quot;{com.text}&quot;</p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[9px] text-slate-400 uppercase font-black">Asset:</span>
                      <span className="bg-violet-100 text-violet-850 px-1.5 py-0.5 rounded text-[8px] font-bold">{com.assetTitle}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="pt-3 border-t space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Feedback Comment</label>
                    <input
                      type="text"
                      placeholder="Discuss asset revision notes..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Target Asset Ref</label>
                    <select
                      value={newCommentAsset}
                      onChange={(e) => setNewCommentAsset(e.target.value)}
                      className="w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    >
                      {assets.map((ast) => (
                        <option key={ast.id} value={ast.title}>{ast.title.slice(0, 20)}...</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isReadOnly}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-40"
                >
                  Post Comment
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
