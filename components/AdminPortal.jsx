"use client";
import { useState, useMemo } from "react";

// Initial mock data to simulate database records
const INITIAL_ORGS = [
  { id: "org_acme", name: "Acme Enterprise Corp", plan: "growth", status: "active", userCount: 8, usage: 12480, mrr: 79, arr: 948, limit: 100000, overageBilling: true },
  { id: "org_horizon", name: "Horizon Agency Hub", plan: "agency", status: "active", userCount: 15, usage: 35600, mrr: 249, arr: 2988, limit: 250000, overageBilling: true },
  { id: "org_solo", name: "Solo Creator Studio", plan: "starter", status: "active", userCount: 1, usage: 4920, mrr: 29, arr: 348, limit: 50000, overageBilling: false },
  { id: "org_mega", name: "Mega Corp", plan: "enterprise", status: "suspended", userCount: 45, usage: 125000, mrr: 1500, arr: 18000, limit: 1000000, overageBilling: true },
];

const INITIAL_USERS = [
  { id: "usr_1", name: "Pratik Patel", email: "pratik@vibeadstudio.com", role: "super_admin", orgId: "org_acme", status: "active" },
  { id: "usr_2", name: "Alice Smith", email: "alice@horizon.io", role: "agency_admin", orgId: "org_horizon", status: "active" },
  { id: "usr_3", name: "Bob Jones", email: "bob@acme.com", role: "marketing_manager", orgId: "org_acme", status: "active" },
  { id: "usr_4", name: "Charlie Brown", email: "charlie@solo.net", role: "read_only", orgId: "org_solo", status: "active" },
  { id: "usr_5", name: "Diana Prince", email: "diana@megacorp.com", role: "business_owner", orgId: "org_mega", status: "disabled" },
];

const INITIAL_TICKETS = [
  { id: "TCK-102", orgId: "org_acme", subject: "API Timeout during blog generation", priority: "high", status: "open", description: "Getting a 504 gateway timeout when generating 3000-word SEO articles.", createdAt: "2026-06-13T10:15:00Z", assignedTo: "Super Admin" },
  { id: "TCK-103", orgId: "org_solo", subject: "Double charge on subscription upgrade", priority: "medium", status: "assigned", description: "Simulated Stripe invoice charged twice for creator package upgrade.", createdAt: "2026-06-13T14:30:00Z", assignedTo: "Billing Team" },
  { id: "TCK-104", orgId: "org_horizon", subject: "Urgent: Need campaign token increase", priority: "critical", status: "escalated", description: "Our client launches tomorrow and we've reached our 250k token cap.", createdAt: "2026-06-13T18:45:00Z", assignedTo: "Super Admin" },
  { id: "TCK-105", orgId: "org_mega", subject: "MFA Device Synchronization", priority: "low", status: "resolved", description: "Super Admin needs to reset the TOTP authenticator seed.", createdAt: "2026-06-12T09:00:00Z", assignedTo: "Security Desk" },
];

const INITIAL_MODERATION = [
  { id: "MOD-301", orgId: "org_acme", type: "Blog", title: "10 Disruptive SaaS Growth Hacks", preview: "Generate explosive loops by exploiting undocumented open APIs. This method guarantees 1000% users...", status: "pending", createdAt: "2026-06-13T20:00:00Z" },
  { id: "MOD-302", orgId: "org_horizon", type: "Ad Copy", title: "Cure Anxiety Instantly With Our Pill", preview: "FDA approved* treatment for instant zen. Drop out of life and experience true happiness now...", status: "flagged", createdAt: "2026-06-13T19:12:00Z" },
  { id: "MOD-303", orgId: "org_solo", type: "Email Campaign", title: "Earn $5000/hr From Home Today", preview: "No experience needed! Just send us $10 to get started on your path to financial freedom...", status: "flagged", createdAt: "2026-06-13T17:40:00Z" },
  { id: "MOD-304", orgId: "org_acme", type: "Image Generation", title: "Acme Logo Futuristic Cyberpunk", preview: "Photorealistic rendering of a glowing holographic neon logo in rain-slicked Tokyo streets...", status: "approved", createdAt: "2026-06-13T15:22:00Z" },
];

const INITIAL_AUDIT_LOGS = [
  { id: "LOG-01", timestamp: "2026-06-13T20:10:15Z", actor: "pratik@vibeadstudio.com", action: "permission_changed", details: "Elevated user Alice Smith to Agency Admin role", target: "usr_2", orgId: "org_horizon" },
  { id: "LOG-02", timestamp: "2026-06-13T19:55:20Z", actor: "alice@horizon.io", action: "content_creation", details: "Generated campaign assets for 10x Growth Plan", target: "camp_883", orgId: "org_horizon" },
  { id: "LOG-03", timestamp: "2026-06-13T19:22:40Z", actor: "pratik@vibeadstudio.com", action: "billing_changes", details: "Suspended Organization: Mega Corp due to overage threshold", target: "org_mega", orgId: "org_mega" },
  { id: "LOG-04", timestamp: "2026-06-13T18:30:10Z", actor: "charlie@solo.net", action: "logins", details: "Successful MFA login from IP 192.168.1.84", target: "usr_4", orgId: "org_solo" },
  { id: "LOG-05", timestamp: "2026-06-13T17:05:00Z", actor: "bob@acme.com", action: "publishing_actions", details: "Exported campaign strategy to external CSV format", target: "camp_acme_2", orgId: "org_acme" },
];

const INITIAL_FLAGS = [
  { id: "flag_beta_templates", name: "Beta Campaign Templates", description: "Unlocks advanced layout modules and canvas elements in campaign builder", active: true, rollout: "specific_plans", targetPlan: "agency" },
  { id: "flag_gpt4o_precision", name: "GPT-4o Precision strategist", description: "Force strategists to use high-capacity GPT-4o output formats", active: false, rollout: "all" },
  { id: "flag_brand_voice", name: "Custom Brand Voice Training", description: "Enables multi-file branding guidelines context upload capabilities", active: true, rollout: "specific_orgs", targetOrg: "org_horizon" },
  { id: "flag_overage_billing", name: "Overage Billing Safeguard", description: "Blocks prompt generation if organization invoice payment status is pending", active: true, rollout: "all" },
];

export default function AdminPortal({ currentRole, logAction }) {
  const [activeSubTab, setActiveSubTab] = useState("overview");

  // Database Simulator Local States
  const [organizations, setOrganizations] = useState(INITIAL_ORGS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [moderationItems, setModerationItems] = useState(INITIAL_MODERATION);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [flags, setFlags] = useState(INITIAL_FLAGS);

  // Form states
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgPlan, setNewOrgPlan] = useState("starter");
  const [newOrgLimit, setNewOrgLimit] = useState(100000);
  
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("marketing_manager");
  const [newUserOrg, setNewUserOrg] = useState("org_acme");

  const [newTicketSubject, setNewTicketSubject] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");
  const [newTicketPriority, setNewTicketPriority] = useState("medium");
  const [newTicketOrg, setNewTicketOrg] = useState("org_acme");

  const [announcementSubject, setAnnouncementSubject] = useState("");
  const [announcementAudience, setAnnouncementAudience] = useState("all");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementsList, setAnnouncementsList] = useState([
    { id: "ann_1", subject: "Database Scheduled Maintenance", audience: "all", content: "Platform database indexing on Sunday, June 14, 02:00 UTC.", timestamp: "2026-06-13T12:00:00Z" }
  ]);

  // Modifying controllers state
  const [editingOrg, setEditingOrg] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Platform Telemetry Simulation Data (Static + random jitter)
  const healthMetrics = useMemo(() => ({
    apiGateway: { status: "healthy", latency: "114ms", uptime: "99.98%" },
    aiGeneration: { status: "healthy", latency: "1,420ms", uptime: "98.84%" },
    database: { status: "healthy", load: "38%", uptime: "100.00%" },
    storage: { status: "healthy", capacity: "54%", uptime: "100.00%" },
    billingSystem: { status: "healthy", sync: "Synced", uptime: "99.99%" },
  }), []);

  // Check super_admin access gate
  const isSuperAdmin = currentRole === "super_admin";

  if (!isSuperAdmin) {
    return (
      <div className="card p-8 border border-red-200 bg-red-50 text-red-900 space-y-4 rounded-2xl shadow-sm max-w-2xl mx-auto my-12">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚫</span>
          <div>
            <h3 className="text-lg font-bold">Access Denied: Super Admin Gate</h3>
            <p className="text-sm text-red-700 mt-0.5">
              The Platform Admin Portal contains cross-tenant billing operations, governance limits, and system moderation queues.
            </p>
          </div>
        </div>
        <div className="p-3 bg-red-150/40 rounded-xl text-xs text-red-800 leading-relaxed">
          <strong>Security Constraint:</strong> Your active session role is configured as <strong>{currentRole.replace("_", " ").toUpperCase()}</strong>. 
          Please use the <strong>SaaS Workspace & RBAC Simulator</strong> switcher panel below to elevate your role preview to <strong>Super Admin</strong>.
        </div>
      </div>
    );
  }

  // Calculate platform metrics
  const totalOrgs = organizations.length;
  const activeUsers = users.filter(u => u.status === "active").length;
  const totalMRR = organizations.reduce((acc, o) => o.status === "active" ? acc + o.mrr : acc, 0);
  const totalARR = totalMRR * 12;
  const totalAIRequests = organizations.reduce((acc, o) => acc + Math.floor(o.usage / 8), 0);
  const totalTokensConsumed = organizations.reduce((acc, o) => acc + o.usage, 0);
  const openSupportTickets = tickets.filter(t => t.status !== "resolved").length;

  // Organization CRUD Handlers
  function handleCreateOrg(e) {
    e.preventDefault();
    if (!newOrgName.trim()) return;
    const newId = `org_${newOrgName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now().toString().slice(-4)}`;
    
    const newOrg = {
      id: newId,
      name: newOrgName,
      plan: newOrgPlan,
      status: "active",
      userCount: 0,
      usage: 0,
      mrr: newOrgPlan === "starter" ? 29 : newOrgPlan === "growth" ? 79 : newOrgPlan === "agency" ? 249 : 1500,
      arr: (newOrgPlan === "starter" ? 29 : newOrgPlan === "growth" ? 79 : newOrgPlan === "agency" ? 249 : 1500) * 12,
      limit: parseInt(newOrgLimit) || 100000,
      overageBilling: true
    };

    setOrganizations([...organizations, newOrg]);
    
    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "billing_changes",
      details: `Created new organization: ${newOrg.name} on ${newOrg.plan.toUpperCase()} tier`,
      target: newOrg.id,
      orgId: newOrg.id
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    logAction({
      action: "organization_created",
      details: `Created tenant ${newOrg.name} (Plan: ${newOrg.plan.toUpperCase()}, Token Limit: ${newOrg.limit})`,
      status: "success",
      sql: `INSERT INTO "Organizations" ("id", "name", "plan", "status", "limit") VALUES ('${newOrg.id}', '${newOrg.name}', '${newOrg.plan}', 'active', ${newOrg.limit})`
    });

    setNewOrgName("");
    setNewOrgPlan("starter");
    setNewOrgLimit(100000);
  }

  function handleToggleOrgSuspension(orgId) {
    setOrganizations(prevOrgs => 
      prevOrgs.map(o => {
        if (o.id === orgId) {
          const nextStatus = o.status === "suspended" ? "active" : "suspended";
          
          logAction({
            action: nextStatus === "suspended" ? "tenant_suspended" : "tenant_activated",
            details: `Mutated status of organization ${o.name} to '${nextStatus}'`,
            status: nextStatus === "suspended" ? "warning" : "success",
            sql: `UPDATE "Organizations" SET "status" = '${nextStatus}' WHERE "id" = '${orgId}'`
          });

          // Log to audit
          const auditEntry = {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString(),
            actor: "pratik@vibeadstudio.com",
            action: "billing_changes",
            details: `${nextStatus === "suspended" ? "Suspended" : "Activated"} organization: ${o.name}`,
            target: o.id,
            orgId: o.id
          };
          setAuditLogs(prev => [auditEntry, ...prev]);

          return { ...o, status: nextStatus };
        }
        return o;
      })
    );
  }

  function handleDeleteOrg(orgId, orgName) {
    if (!confirm(`Are you sure you want to permanently delete organization '${orgName}'? This will archive all client campaign models.`)) return;
    
    setOrganizations(prev => prev.filter(o => o.id !== orgId));
    
    logAction({
      action: "tenant_deleted",
      details: `Permanently removed organization ${orgName} and de-allocated PostgreSQL schemas`,
      status: "error",
      sql: `DELETE FROM "Organizations" WHERE "id" = '${orgId}'`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "billing_changes",
      details: `Permanently deleted organization: ${orgName}`,
      target: orgId,
      orgId: orgId
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
  }

  function handleSaveOrgEdit(e) {
    e.preventDefault();
    if (!editingOrg) return;
    
    setOrganizations(prev => 
      prev.map(o => {
        if (o.id === editingOrg.id) {
          const mrrValue = editingOrg.plan === "starter" ? 29 : editingOrg.plan === "growth" ? 79 : editingOrg.plan === "agency" ? 249 : 1500;
          return {
            ...o,
            name: editingOrg.name,
            plan: editingOrg.plan,
            limit: editingOrg.limit,
            overageBilling: editingOrg.overageBilling,
            mrr: mrrValue,
            arr: mrrValue * 12
          };
        }
        return o;
      })
    );

    logAction({
      action: "tenant_updated",
      details: `Modified limits/plan settings for organization: ${editingOrg.name}`,
      status: "info",
      sql: `UPDATE "Organizations" SET "name"='${editingOrg.name}', "plan"='${editingOrg.plan}', "limit"=${editingOrg.limit} WHERE "id"='${editingOrg.id}'`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "billing_changes",
      details: `Updated settings/limits for organization: ${editingOrg.name}`,
      target: editingOrg.id,
      orgId: editingOrg.id
    };
    setAuditLogs(prev => [auditEntry, ...prev]);
    setEditingOrg(null);
  }

  // User CRUD Handlers
  function handleCreateUser(e) {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newId = `usr_${Date.now().toString().slice(-4)}`;
    
    const newUser = {
      id: newId,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      orgId: newUserOrg,
      status: "active"
    };

    setUsers([...users, newUser]);

    // Update tenant user counts
    setOrganizations(prev => prev.map(o => o.id === newUserOrg ? { ...o, userCount: o.userCount + 1 } : o));

    logAction({
      action: "user_created",
      details: `Provisioned user account for ${newUser.name} with role ${newUser.role.replace("_", " ")}`,
      status: "success",
      sql: `INSERT INTO "Users" ("id", "name", "email", "role", "organizationId") VALUES ('${newUser.id}', '${newUser.name}', '${newUser.email}', '${newUser.role}', '${newUser.orgId}')`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "permission_changed",
      details: `Provisioned user ${newUser.name} as ${newUser.role.replace("_", " ")} inside organization ${newUser.orgId}`,
      target: newUser.id,
      orgId: newUser.orgId
    };
    setAuditLogs([auditEntry, ...auditLogs]);

    setNewUserName("");
    setNewUserEmail("");
    setNewUserRole("marketing_manager");
  }

  function handleToggleUserStatus(userId) {
    setUsers(prev => 
      prev.map(u => {
        if (u.id === userId) {
          const nextStatus = u.status === "disabled" ? "active" : "disabled";
          
          logAction({
            action: nextStatus === "disabled" ? "user_deactivated" : "user_activated",
            details: `Mutated user account ${u.name} status to ${nextStatus}`,
            status: nextStatus === "disabled" ? "warning" : "success",
            sql: `UPDATE "Users" SET "status" = '${nextStatus}' WHERE "id" = '${userId}'`
          });

          const auditEntry = {
            id: `LOG-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toISOString(),
            actor: "pratik@vibeadstudio.com",
            action: "permission_changed",
            details: `${nextStatus === "disabled" ? "Deactivated" : "Activated"} user: ${u.name}`,
            target: u.id,
            orgId: u.orgId
          };
          setAuditLogs(p => [auditEntry, ...p]);

          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  }

  function handleResetPassword(userId, userName) {
    logAction({
      action: "auth_password_reset",
      details: `Triggered crypt-secured secure password reset flow for target: ${userName}`,
      status: "info",
      sql: `UPDATE "Users" SET "passwordResetToken" = 'sim_token_xyz' WHERE "id" = '${userId}'`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "logins",
      details: `Initiated administrative password reset link dispatch for: ${userName}`,
      target: userId,
      orgId: users.find(u => u.id === userId)?.orgId
    };
    setAuditLogs(p => [auditEntry, ...p]);
    alert(`MFA-approved reset email simulated for ${userName}.`);
  }

  function handleSaveUserRole(userId, nextRole) {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: nextRole } : u));
    
    logAction({
      action: "user_role_mutated",
      details: `Administrative override of user role to: ${nextRole}`,
      status: "warning",
      sql: `UPDATE "Users" SET "role" = '${nextRole}' WHERE "id" = '${userId}'`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "permission_changed",
      details: `Changed role of user ${users.find(u => u.id === userId)?.name} to ${nextRole.replace("_", " ")}`,
      target: userId,
      orgId: users.find(u => u.id === userId)?.orgId
    };
    setAuditLogs(p => [auditEntry, ...p]);
  }

  // Support Ticketing Handlers
  function handleCreateTicket(e) {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDesc.trim()) return;
    const newId = `TCK-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket = {
      id: newId,
      orgId: newTicketOrg,
      subject: newTicketSubject,
      description: newTicketDesc,
      priority: newTicketPriority,
      status: "open",
      createdAt: new Date().toISOString(),
      assignedTo: "Super Admin"
    };

    setTickets([newTicket, ...tickets]);

    logAction({
      action: "support_ticket_created",
      details: `New simulated support ticket opened: ${newTicket.subject} (Priority: ${newTicket.priority.toUpperCase()})`,
      status: "info",
      sql: `INSERT INTO "SupportTickets" ("id", "organizationId", "subject", "priority", "status") VALUES ('${newTicket.id}', '${newTicket.orgId}', '${newTicket.subject}', '${newTicket.priority}', 'open')`
    });

    setNewTicketSubject("");
    setNewTicketDesc("");
    setNewTicketPriority("medium");
  }

  function handleMutateTicketStatus(ticketId, nextStatus) {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: nextStatus } : t));

    logAction({
      action: "support_ticket_updated",
      details: `Ticket ID ${ticketId} status changed to: ${nextStatus.toUpperCase()}`,
      status: "success",
      sql: `UPDATE "SupportTickets" SET "status" = '${nextStatus}' WHERE "id" = '${ticketId}'`
    });
  }

  function handleMutateTicketPriority(ticketId, nextPriority) {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority: nextPriority } : t));

    logAction({
      action: "support_ticket_priority_escalated",
      details: `Ticket ID ${ticketId} priority mutated to: ${nextPriority.toUpperCase()}`,
      status: "warning",
      sql: `UPDATE "SupportTickets" SET "priority" = '${nextPriority}' WHERE "id" = '${ticketId}'`
    });
  }

  // Content Moderation Queue Handlers
  function handleModerateItem(itemId, nextStatus) {
    setModerationItems(prev => prev.map(item => item.id === itemId ? { ...item, status: nextStatus } : item));

    logAction({
      action: `content_${nextStatus}`,
      details: `Moderator action: ${nextStatus.toUpperCase()} on item ID: ${itemId}`,
      status: nextStatus === "approved" ? "success" : nextStatus === "flagged" ? "warning" : "error",
      sql: `UPDATE "ContentAssets" SET "moderationStatus" = '${nextStatus}' WHERE "id" = '${itemId}'`
    });

    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "content_creation",
      details: `Moderated generated marketing asset: ${nextStatus.toUpperCase()} (ID: ${itemId})`,
      target: itemId,
      orgId: moderationItems.find(m => m.id === itemId)?.orgId
    };
    setAuditLogs(p => [auditEntry, ...p]);
  }

  // Feature Flag & Rollout Handlers
  function handleToggleFeatureFlag(flagId) {
    setFlags(prev => 
      prev.map(f => {
        if (f.id === flagId) {
          const nextActive = !f.active;
          logAction({
            action: "feature_flag_toggled",
            details: `Global system feature flag '${f.name}' set to ${nextActive ? "ENABLED" : "DISABLED"}`,
            status: nextActive ? "success" : "warning",
            sql: `UPDATE "FeatureFlags" SET "active" = ${nextActive} WHERE "id" = '${flagId}'`
          });
          return { ...f, active: nextActive };
        }
        return f;
      })
    );
  }

  // Announcement Center Handlers
  function handlePublishAnnouncement(e) {
    e.preventDefault();
    if (!announcementSubject.trim() || !announcementContent.trim()) return;

    const newAnn = {
      id: `ann_${Date.now()}`,
      subject: announcementSubject,
      audience: announcementAudience,
      content: announcementContent,
      timestamp: new Date().toISOString()
    };

    setAnnouncementsList([newAnn, ...announcementsList]);

    logAction({
      action: "announcement_published",
      details: `Broadcasted notification: ${newAnn.subject} to audience: ${newAnn.audience.toUpperCase()}`,
      status: "success",
      sql: `INSERT INTO "Announcements" ("id", "subject", "audience", "content") VALUES ('${newAnn.id}', '${newAnn.subject}', '${newAnn.audience}', '${newAnn.content}')`
    });

    // Write to audit log
    const auditEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      actor: "pratik@vibeadstudio.com",
      action: "publishing_actions",
      details: `Broadcasted platform announcement: ${newAnn.subject} (${newAnn.audience})`,
      target: newAnn.id,
      orgId: "platform"
    };
    setAuditLogs(prev => [auditEntry, ...prev]);

    setAnnouncementSubject("");
    setAnnouncementContent("");
    setAnnouncementAudience("all");
    alert("Announcement successfully dispatched to targeted tenants.");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white text-sm shadow">🛡️</span>
            Platform Admin Portal
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Global governance controls, multi-tenant billing statistics, API server health gauges, and support ticket desks.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Live Telemetry System Active</span>
        </div>
      </div>

      {/* Portal Tabs Sub-navigation */}
      <div className="flex flex-wrap border-b border-slate-200 gap-1 bg-white p-1 rounded-xl shadow-sm">
        {[
          { id: "overview", label: "Dashboard", icon: "📊" },
          { id: "organizations", label: "Organizations", icon: "🏢" },
          { id: "users", label: "User Accounts", icon: "👥" },
          { id: "governance", label: "AI Governance", icon: "🤖" },
          { id: "moderation", label: "Content Queue", icon: "🔍" },
          { id: "tickets", label: "Support Tickets", icon: "🎟️" },
          { id: "health", label: "System Health & Flags", icon: "⚡" },
          { id: "audit", label: "Audit Logs", icon: "📜" },
        ].map((tab) => {
          const active = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id);
                setEditingOrg(null);
                setEditingUser(null);
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

      {/* 1. OVERVIEW DASHBOARD TAB */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Organizations</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalOrgs}</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ +2 this week</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Users</span>
              <div className="text-xl font-black text-slate-900 mt-1">{activeUsers}</div>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">↑ 92% retention</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total MRR / ARR</span>
              <div className="text-xl font-black text-slate-900 mt-1">${totalMRR.toLocaleString()} <span className="text-xs text-slate-450 font-normal">/ yr: ${totalARR.toLocaleString()}</span></div>
              <span className="text-[10px] text-indigo-600 font-bold block mt-1">SaaS growth active</span>
            </div>
            <div className="card p-4 border border-slate-200 bg-white">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">AI Token Requests</span>
              <div className="text-xl font-black text-slate-900 mt-1">{totalAIRequests.toLocaleString()} <span className="text-xs text-slate-450 font-normal">({(totalTokensConsumed / 1000).toFixed(1)}k tokens)</span></div>
              <span className="text-[10px] text-violet-600 font-bold block mt-1">API Cost: ${(totalTokensConsumed * 0.000002).toFixed(4)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health indicators summaries */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                <span>Platform Telemetry Indicators</span>
                <span className="bg-emerald-150 text-emerald-800 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Online</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">API Gateway Latency</span>
                  <span className="font-bold text-slate-800">{healthMetrics.apiGateway.latency}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">AI Generation Engine</span>
                  <span className="font-bold text-slate-800">{healthMetrics.aiGeneration.latency}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">PostgreSQL DB Cluster</span>
                  <span className="font-bold text-slate-800">Load: {healthMetrics.database.load}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Object Storage Pool</span>
                  <span className="font-bold text-slate-800">{healthMetrics.storage.capacity} capacity</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Stripe Billing Webhook</span>
                  <span className="font-bold text-slate-800">{healthMetrics.billingSystem.sync}</span>
                </div>
              </div>
              <button 
                onClick={() => setActiveSubTab("health")} 
                className="w-full text-center py-2 border rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Go to Health telemetry node & Flags
              </button>
            </div>

            {/* Quick action tickets list */}
            <div className="card p-5 border border-slate-200 bg-white lg:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 border-b pb-2 flex items-center justify-between">
                <span>Active Support Requests ({openSupportTickets})</span>
                <button 
                  onClick={() => setActiveSubTab("tickets")} 
                  className="text-violet-650 hover:underline text-[10px] font-bold"
                >
                  Manage desk
                </button>
              </h3>
              <div className="space-y-3">
                {tickets.slice(0, 3).map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800">{t.id}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          t.priority === "critical" ? "bg-red-100 text-red-800" :
                          t.priority === "high" ? "bg-orange-100 text-orange-800" : "bg-slate-200 text-slate-700"
                        }`}>
                          {t.priority}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-[10px] text-slate-500">Org: {t.orgId.replace("org_", "")}</span>
                      </div>
                      <p className="font-medium text-slate-700 mt-1 line-clamp-1">{t.subject}</p>
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === "open" ? "bg-red-100 text-red-700 border border-red-200" :
                        t.status === "assigned" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ORGANIZATIONS TAB */}
      {activeSubTab === "organizations" && (
        <div className="space-y-6">
          {editingOrg ? (
            /* EDIT ORG FORM */
            <form onSubmit={handleSaveOrgEdit} className="card p-5 border border-slate-200 bg-white space-y-4 max-w-xl">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                <span>Configure Organization Settings</span>
                <button type="button" onClick={() => setEditingOrg(null)} className="text-slate-400 text-xs hover:text-slate-600">✕ Cancel</button>
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Organization Name</label>
                  <input
                    type="text"
                    value={editingOrg.name}
                    onChange={(e) => setEditingOrg({ ...editingOrg, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Subscription Tier</label>
                    <select
                      value={editingOrg.plan}
                      onChange={(e) => setEditingOrg({ ...editingOrg, plan: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    >
                      <option value="starter">Starter Plan ($29/mo)</option>
                      <option value="growth">Growth Plan ($79/mo)</option>
                      <option value="agency">Agency Plan ($249/mo)</option>
                      <option value="enterprise">Enterprise Custom ($1,500/mo)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">AI Token Cap Limit</label>
                    <input
                      type="number"
                      value={editingOrg.limit}
                      onChange={(e) => setEditingOrg({ ...editingOrg, limit: parseInt(e.target.value) || 0 })}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="editOverage"
                    checked={editingOrg.overageBilling}
                    onChange={(e) => setEditingOrg({ ...editingOrg, overageBilling: e.target.checked })}
                    className="rounded text-violet-600 focus:ring-violet-500"
                  />
                  <label htmlFor="editOverage" className="text-xs text-slate-650 font-medium">Enable Overage Billing ($0.002 per 1k tokens)</label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setEditingOrg(null)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          ) : (
            /* ORG LIST & CREATE */
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* ORG LISTING */}
              <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Active Tenants Register</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                        <th className="pb-2">Organization</th>
                        <th className="pb-2">Plan</th>
                        <th className="pb-2">Users</th>
                        <th className="pb-2">AI Usage</th>
                        <th className="pb-2">Status</th>
                        <th className="pb-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizations.map((org) => (
                        <tr key={org.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                          <td className="py-3 pr-2">
                            <span className="font-bold text-slate-800 block">{org.name}</span>
                            <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{org.id}</span>
                          </td>
                          <td className="py-3 font-semibold uppercase text-slate-600">{org.plan}</td>
                          <td className="py-3 text-slate-700">{org.userCount} user(s)</td>
                          <td className="py-3">
                            <span className="font-bold text-slate-800">{(org.usage / 1000).toFixed(1)}k</span>
                            <span className="text-[10px] text-slate-400 block">Cap: {(org.limit / 1000).toFixed(0)}k</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              org.status === "active" ? "bg-emerald-100 text-emerald-800" :
                              org.status === "suspended" ? "bg-red-150 text-red-900" : "bg-slate-200 text-slate-700"
                            }`}>
                              {org.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => setEditingOrg(org)}
                              className="text-indigo-650 hover:underline font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleToggleOrgSuspension(org.id)}
                              className={`font-bold hover:underline ${
                                org.status === "suspended" ? "text-emerald-650" : "text-amber-650"
                              }`}
                            >
                              {org.status === "suspended" ? "Reactivate" : "Suspend"}
                            </button>
                            <button
                              onClick={() => handleDeleteOrg(org.id, org.name)}
                              className="text-rose-650 hover:underline font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CREATE ORG FORM */}
              <div className="card p-5 border border-slate-200 bg-white space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center gap-1.5">
                  <span>Create Organization</span>
                </h3>
                <form onSubmit={handleCreateOrg} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Organization Name</label>
                    <input
                      type="text"
                      placeholder="e.g. InnoTech Ltd"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Plan Assignment</label>
                    <select
                      value={newOrgPlan}
                      onChange={(e) => setNewOrgPlan(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    >
                      <option value="starter">Starter Plan ($29/mo)</option>
                      <option value="growth">Growth Plan ($79/mo)</option>
                      <option value="agency">Agency Plan ($249/mo)</option>
                      <option value="enterprise">Enterprise Custom ($1,500/mo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Initial Token Cap</label>
                    <input
                      type="number"
                      value={newOrgLimit}
                      onChange={(e) => setNewOrgLimit(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                  >
                    Deploy New Tenant
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. USER ACCOUNTS TAB */}
      {activeSubTab === "users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* USER LISTING */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Global IAM Users Register</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                      <th className="pb-2">User</th>
                      <th className="pb-2">Organization</th>
                      <th className="pb-2">Assigned Role</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                        <td className="py-3 pr-2">
                          <span className="font-bold text-slate-800 block">{user.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{user.email}</span>
                        </td>
                        <td className="py-3 text-slate-600 font-mono text-[10px]">
                          {organizations.find(o => o.id === user.orgId)?.name || user.orgId}
                        </td>
                        <td className="py-3">
                          <select
                            value={user.role}
                            onChange={(e) => handleSaveUserRole(user.id, e.target.value)}
                            className="bg-transparent border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-violet-400"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="agency_admin">Agency Admin</option>
                            <option value="business_owner">Business Owner</option>
                            <option value="marketing_manager">Marketing Manager</option>
                            <option value="read_only">Read Only</option>
                          </select>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            user.status === "active" ? "bg-emerald-100 text-emerald-800" : "bg-red-150 text-red-900"
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={`font-bold hover:underline ${
                              user.status === "disabled" ? "text-emerald-650" : "text-amber-650"
                            }`}
                          >
                            {user.status === "disabled" ? "Enable" : "Disable"}
                          </button>
                          <button
                            onClick={() => handleResetPassword(user.id, user.name)}
                            className="text-indigo-650 hover:underline font-bold"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CREATE USER FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Create User Account</h3>
              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">User Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@acme.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Tenant Organization</label>
                  <select
                    value={newUserOrg}
                    onChange={(e) => setNewUserOrg(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">System Role Assignment</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="super_admin">Super Admin</option>
                    <option value="agency_admin">Agency Admin</option>
                    <option value="business_owner">Business Owner</option>
                    <option value="marketing_manager">Marketing Manager</option>
                    <option value="read_only">Read Only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                >
                  Provision IAM Credentials
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI GOVERNANCE TAB */}
      {activeSubTab === "governance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* GOVERNANCE SUMMARY PANEL */}
            <div className="lg:col-span-2 card p-5 border border-slate-200 bg-white space-y-6">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5 flex items-center justify-between">
                <span>AI Governance Limits & Overage billing</span>
                <span className="text-[10px] text-slate-450 font-bold">Standard Cap Limit Tracker</span>
              </h3>
              
              <div className="space-y-4">
                {organizations.map((org) => {
                  const percent = Math.min(100, Math.floor((org.usage / org.limit) * 100));
                  return (
                    <div key={org.id} className="space-y-1.5 border border-slate-100 p-3 rounded-xl">
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-800">{org.name}</span>
                          <span className="text-[9px] font-semibold text-slate-450 uppercase block">{org.plan} Plan</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-slate-800">{(org.usage / 1000).toFixed(1)}k</span>
                          <span className="text-slate-400"> / {(org.limit / 1000).toFixed(0)}k tokens</span>
                          <span className="text-[10px] text-slate-450 block font-bold mt-0.5">{(org.usage * 0.000002).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 4 })} Cost</span>
                        </div>
                      </div>

                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                        <div 
                          className={`h-full rounded-full ${
                            percent > 90 ? "bg-rose-500" : percent > 70 ? "bg-amber-500" : "bg-violet-600"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] text-slate-450 font-bold">{percent}% of limit consumed</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            id={`overage-${org.id}`}
                            checked={org.overageBilling}
                            onChange={(e) => {
                              setOrganizations(prev => prev.map(o => o.id === org.id ? { ...o, overageBilling: e.target.checked } : o));
                              logAction({
                                action: "governance_limit_override",
                                details: `Overage billing toggle set to ${e.target.checked ? "ENABLED" : "DISABLED"} for ${org.name}`,
                                status: "info",
                                sql: `UPDATE "Organizations" SET "overageBilling" = ${e.target.checked} WHERE "id" = '${org.id}'`
                              });
                            }}
                            className="rounded h-3 w-3 text-violet-600 border-slate-200"
                          />
                          <label htmlFor={`overage-${org.id}`} className="text-[10px] text-slate-500 font-bold">Overage Billing</label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI METRICS & SETTINGS */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Global AI Engine Telemetry</h3>
              
              <div className="space-y-4 text-xs">
                <div className="border-b pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Aggregate Usage Today</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">{totalTokensConsumed.toLocaleString()} Tokens</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Est. API cost: ${(totalTokensConsumed * 0.000002).toFixed(4)} USD</span>
                </div>

                <div className="border-b pb-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Prompt Response Time</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">1.42 seconds</div>
                  <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Within acceptable limits (&lt; 2.5s)</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">System-wide Rate Limiter Cap</span>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">60 requests/min</div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Overrides apply during high-traffic campaign windows.</span>
                  
                  <div className="flex gap-2 mt-3">
                    <button 
                      onClick={() => {
                        logAction({
                          action: "governance_override",
                          details: "Temporarily boosted system rate limits to 120req/min for high-load campaigns queue",
                          status: "warning",
                          sql: "UPDATE SystemConfig SET rate_limit = 120"
                        });
                        alert("Rate limit capacity elevated globally.");
                      }}
                      className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px]"
                    >
                      Boost Limits (120/min)
                    </button>
                    <button 
                      onClick={() => {
                        logAction({
                          action: "governance_override",
                          details: "Restored default system rate limits to 60req/min",
                          status: "info",
                          sql: "UPDATE SystemConfig SET rate_limit = 60"
                        });
                        alert("Rate limit capacity restored.");
                      }}
                      className="flex-1 py-1.5 border hover:bg-slate-50 font-bold rounded-lg text-[10px] text-slate-700"
                    >
                      Restore (60/min)
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 5. CONTENT MODERATION QUEUE TAB */}
      {activeSubTab === "moderation" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Automated Compliance & Flagging Queue</h3>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-bold">Requires Super Admin Review</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                    <th className="pb-2">Generated Asset</th>
                    <th className="pb-2">Organization</th>
                    <th className="pb-2">Content Preview snippet</th>
                    <th className="pb-2">Audit Status</th>
                    <th className="pb-2 text-right">Moderator Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {moderationItems.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 pr-2">
                        <span className="font-bold text-slate-800 block">{item.title}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wide block mt-0.5">{item.type}</span>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-slate-500">
                        {organizations.find(o => o.id === item.orgId)?.name || item.orgId}
                      </td>
                      <td className="py-3 pr-4 max-w-xs md:max-w-sm lg:max-w-md">
                        <p className="text-slate-600 leading-relaxed italic line-clamp-2">&quot;{item.preview}&quot;</p>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          item.status === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                          item.status === "flagged" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                          item.status === "pending" ? "bg-slate-100 text-slate-700" : "bg-rose-100 text-rose-800"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleModerateItem(item.id, "approved")}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleModerateItem(item.id, "flagged")}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-lg transition"
                        >
                          Flag
                        </button>
                        <button
                          onClick={() => handleModerateItem(item.id, "removed")}
                          className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-850 text-[10px] font-bold rounded-lg transition"
                        >
                          Remove
                        </button>
                        <button
                          onClick={() => handleModerateItem(item.id, "archived")}
                          className="px-2 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition"
                        >
                          Archive
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

      {/* 6. SUPPORT TICKETS TAB */}
      {activeSubTab === "tickets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* TICKETS LIST */}
            <div className="xl:col-span-2 card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Operations Helpdesk Queue</h3>
              
              <div className="space-y-3">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-150 bg-slate-50 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-800 text-sm">{t.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                            t.priority === "critical" ? "bg-red-100 text-red-800 border border-red-200" :
                            t.priority === "high" ? "bg-orange-100 text-orange-850" :
                            t.priority === "medium" ? "bg-amber-100 text-amber-800" : "bg-slate-200 text-slate-600"
                          }`}>
                            {t.priority}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Org: {organizations.find(o => o.id === t.orgId)?.name || t.orgId}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mt-1">{t.subject}</h4>
                      </div>
                      
                      <div>
                        <select
                          value={t.status}
                          onChange={(e) => handleMutateTicketStatus(t.id, e.target.value)}
                          className="bg-white border rounded-lg px-2 py-1 text-[10px] font-bold text-slate-700 outline-none focus:ring-1 focus:ring-violet-400"
                        >
                          <option value="open">Open</option>
                          <option value="assigned">Assigned</option>
                          <option value="escalated">Escalated</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3 border border-slate-100 rounded-lg">
                      {t.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-450 font-bold pt-1">
                      <span>Submitted: {new Date(t.createdAt).toLocaleString()}</span>
                      <div className="flex items-center gap-2">
                        <span>Assignee:</span>
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold uppercase">{t.assignedTo}</span>
                        
                        <div className="flex gap-1">
                          {["critical", "high", "medium", "low"].map((prio) => (
                            <button
                              key={prio}
                              onClick={() => handleMutateTicketPriority(t.id, prio)}
                              className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase transition ${
                                t.priority === prio
                                  ? "bg-violet-600 text-white"
                                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                              }`}
                            >
                              {prio.slice(0, 3)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CREATE TICKET FORM */}
            <div className="card p-5 border border-slate-200 bg-white space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b pb-2">File Operations Ticket</h3>
              <form onSubmit={handleCreateTicket} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Reporter Organization</label>
                  <select
                    value={newTicketOrg}
                    onChange={(e) => setNewTicketOrg(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Subject / Issue Title</label>
                  <input
                    type="text"
                    placeholder="Short description of the failure"
                    value={newTicketSubject}
                    onChange={(e) => setNewTicketSubject(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Ticket Priority</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                  >
                    <option value="critical">Critical (Service down)</option>
                    <option value="high">High (Major blocks)</option>
                    <option value="medium">Medium (Regular requests)</option>
                    <option value="low">Low (Tweak suggestions)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400">Incident Details</label>
                  <textarea
                    placeholder="Describe what occurred, steps to reproduce, or diagnostic alerts..."
                    value={newTicketDesc}
                    onChange={(e) => setNewTicketDesc(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-28"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                >
                  Submit Ticket to Ops
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* 7. SYSTEM HEALTH, FEATURE FLAGS, & ANNOUNCEMENTS */}
      {activeSubTab === "health" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* TELEMETRY NODES AND FEATURE FLAGS */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* TELEMETRY */}
              <div className="card p-5 border border-slate-200 bg-white space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2 flex items-center justify-between">
                  <span>Server Telemetry Channels</span>
                  <span className="text-[10px] text-slate-400">Response Jitter & Load Nodes</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: "API Gateway (Vercel Edge)", val: healthMetrics.apiGateway.latency, uptime: healthMetrics.apiGateway.uptime, status: "Healthy" },
                    { title: "AI Strategy Node (OpenAI API)", val: healthMetrics.aiGeneration.latency, uptime: healthMetrics.aiGeneration.uptime, status: "Healthy" },
                    { title: "PostgreSQL DB Cluster (Supabase)", val: healthMetrics.database.load, uptime: healthMetrics.database.uptime, status: "Healthy", label: "CPU Load" },
                    { title: "Object Asset Storage (AWS S3)", val: healthMetrics.storage.capacity, uptime: healthMetrics.storage.uptime, status: "Healthy", label: "Capacity" },
                  ].map((node, i) => (
                    <div key={i} className="p-3 border border-slate-150 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{node.title}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">Uptime: {node.uptime}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-850 block">{node.val}</span>
                        <span className="text-[9px] text-emerald-600 font-bold uppercase">{node.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FEATURE FLAGS */}
              <div className="card p-5 border border-slate-200 bg-white space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Global Feature Flag Integrations</h3>
                
                <div className="space-y-4">
                  {flags.map((flag) => (
                    <div key={flag.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0 text-xs">
                      <div className="pr-4 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">{flag.name}</span>
                          <span className="bg-slate-100 text-slate-550 border border-slate-200 px-1 rounded text-[8px] font-bold tracking-wide uppercase">
                            Rollout: {flag.rollout.replace("_", " ")}
                            {flag.targetPlan && ` (${flag.targetPlan.toUpperCase()})`}
                            {flag.targetOrg && ` (${flag.targetOrg.replace("org_", "")})`}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{flag.description}</p>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => handleToggleFeatureFlag(flag.id)}
                          className={`w-14 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
                            flag.active ? "bg-violet-600 justify-end" : "bg-slate-200 justify-start"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-full bg-white shadow-sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ANNOUNCEMENT CENTER */}
            <div className="space-y-6">
              <div className="card p-5 border border-slate-200 bg-white space-y-4">
                <h3 className="font-bold text-slate-800 text-sm border-b pb-2">Announcement Broadcast Center</h3>
                <form onSubmit={handlePublishAnnouncement} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Target Audience</label>
                    <select
                      value={announcementAudience}
                      onChange={(e) => setAnnouncementAudience(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                    >
                      <option value="all">All Tenant Users</option>
                      <option value="starter">Starter Plan Only</option>
                      <option value="growth">Growth Plan Only</option>
                      <option value="agency">Agency Plan Only</option>
                      <option value="enterprise">Enterprise Plan Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Subject / Alert Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Scheduled Service Maintenance"
                      value={announcementSubject}
                      onChange={(e) => setAnnouncementSubject(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400">Content / Release Notes</label>
                    <textarea
                      placeholder="Write markdown or text broadcast alert..."
                      value={announcementContent}
                      onChange={(e) => setAnnouncementContent(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs border rounded-xl bg-slate-50 outline-none focus:ring-1 focus:ring-violet-400 h-28"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition mt-4"
                  >
                    Broadcast Announcement
                  </button>
                </form>
              </div>

              {/* BROADCASTED LIST */}
              <div className="card p-5 border border-slate-200 bg-white space-y-3 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Broadcast History</span>
                <div className="space-y-2.5">
                  {announcementsList.map((ann) => (
                    <div key={ann.id} className="border-b pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-bold text-slate-800 line-clamp-1">{ann.subject}</span>
                        <span className="bg-slate-100 text-slate-650 px-1 py-0.5 rounded text-[8px] font-bold uppercase font-mono">{ann.audience}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 8. AUDIT LOGS TAB */}
      {activeSubTab === "audit" && (
        <div className="space-y-6">
          <div className="card p-5 border border-slate-200 bg-white space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-slate-800 text-sm">Security & Compliance Audit Ledger</h3>
              <span className="text-[10px] text-slate-450 font-bold">Immutable Ledger Simulator</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase">
                    <th className="pb-2">Timestamp (UTC)</th>
                    <th className="pb-2">Actor (Identity)</th>
                    <th className="pb-2">Event Action</th>
                    <th className="pb-2">Target Ref</th>
                    <th className="pb-2">Incident Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                      <td className="py-3 pr-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                        {new Date(log.timestamp).toISOString().replace("T", " ").slice(0, 19)}
                      </td>
                      <td className="py-3 font-semibold text-slate-700">{log.actor}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          log.action === "permission_changed" ? "bg-amber-100 text-amber-800" :
                          log.action === "billing_changes" ? "bg-violet-100 text-violet-850" :
                          log.action === "content_creation" ? "bg-blue-100 text-blue-800" : "bg-slate-150 text-slate-600"
                        }`}>
                          {log.action.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[10px] text-slate-450">{log.target}</td>
                      <td className="py-3 text-slate-600 font-medium pr-2">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
