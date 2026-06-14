"use client";

const ORGANIZATIONS = [
  { id: "org_acme", name: "Acme Enterprise Corp", plan: "growth" },
  { id: "org_horizon", name: "Horizon Agency Hub (12 clients)", plan: "agency" },
  { id: "org_solo", name: "Solo Creator Studio", plan: "starter" },
];

const ROLES = [
  { id: "super_admin", name: "Super Admin (Full Access)" },
  { id: "agency_admin", name: "Agency Admin (Org Manager)" },
  { id: "marketing_manager", name: "Marketing Manager (Edit Assets)" },
  { id: "read_only", name: "Read Only (Viewer)" },
];

export default function RbacSwitcher({
  currentOrg,
  setCurrentOrg,
  currentRole,
  setCurrentRole,
  logAction,
}) {
  function handleOrgChange(orgId) {
    const org = ORGANIZATIONS.find((o) => o.id === orgId);
    if (org) {
      setCurrentOrg(org);
      logAction({
        action: "organization_switched",
        details: `Switched active tenant to ${org.name} (Plan: ${org.plan.toUpperCase()})`,
        status: "success",
      });
    }
  }

  function handleRoleChange(roleId) {
    setCurrentRole(roleId);
    const roleName = ROLES.find((r) => r.id === roleId)?.name || roleId;
    logAction({
      action: "role_switched",
      details: `Active user role updated to ${roleName}`,
      status: "info",
    });
  }

  // Get permissions list for visual indicators
  const permissions = {
    super_admin: ["Read Assets", "Write/Edit Assets", "Approve Assets", "Manage Billing", "Admin Control"],
    agency_admin: ["Read Assets", "Write/Edit Assets", "Approve Assets", "Manage Billing"],
    marketing_manager: ["Read Assets", "Write/Edit Assets", "Approve Assets"],
    read_only: ["Read Assets"],
  };

  const activePerms = permissions[currentRole] || [];

  return (
    <div className="card p-5 border border-slate-200 bg-white space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-slate-600">👤</span>
          SaaS Workspace & RBAC Simulator
        </h4>
        <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">
          Client Session Context
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tenant Switcher */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Tenant (Organization)</label>
          <select
            value={currentOrg.id}
            onChange={(e) => handleOrgChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-violet-400"
          >
            {ORGANIZATIONS.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name} ({org.plan.toUpperCase()} plan)
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Simulate Role (RBAC Preview)</label>
          <select
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700 outline-none focus:ring-1 focus:ring-violet-400"
          >
            {ROLES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Permissions tags indicator */}
      <div className="pt-2 border-t">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Granted API permissions for role
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["Read Assets", "Write/Edit Assets", "Approve Assets", "Manage Billing", "Admin Control"].map((perm) => {
            const hasIt = activePerms.includes(perm);
            return (
              <span
                key={perm}
                className={`px-2 py-1 rounded text-[10px] font-semibold tracking-wide border transition ${
                  hasIt
                    ? "bg-indigo-50 border-indigo-150 text-indigo-900"
                    : "bg-slate-50 border-slate-100 text-slate-400 opacity-60 line-through"
                }`}
              >
                {perm}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
