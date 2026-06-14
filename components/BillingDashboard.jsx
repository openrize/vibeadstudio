"use client";
import { useState } from "react";

const STRIPE_PLANS = [
  { id: "starter", name: "Starter Tier", price: "$29/mo", credits: "100 credits/mo" },
  { id: "growth", name: "Growth Tier", price: "$79/mo", credits: "500 credits/mo" },
  { id: "agency", name: "Agency Tier", price: "$249/mo", credits: "2,000 credits/mo" },
  { id: "enterprise", name: "Enterprise Custom", price: "Custom/yr", credits: "Unlimited" },
];

export default function BillingDashboard({ currentOrg, currentRole, logAction }) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState(null);

  // Invoices mock
  const [invoices, setInvoices] = useState([
    { id: "INV-9201", date: "2026-06-01", amount: "$79.00", status: "Paid" },
    { id: "INV-8039", date: "2026-05-01", amount: "$79.00", status: "Paid" },
  ]);

  const hasBillingAccess = ["super_admin", "agency_admin"].includes(currentRole);

  function triggerCheckout(plan) {
    if (!hasBillingAccess) return;
    setSelectedUpgradePlan(plan);
    setCheckoutLoading(true);

    logAction({
      action: "stripe_checkout_initiated",
      details: `Stripe Checkout session requested for organizationId: ${currentOrg.id}, Plan: ${plan.name}`,
      status: "info",
      sql: `INSERT INTO "Subscriptions" ("organizationId", "planId", "status") VALUES ('${currentOrg.id}', '${plan.id}', 'checkout_pending')`,
    });

    // Simulate Stripe Checkout redirection and webhook trigger
    setTimeout(() => {
      setCheckoutLoading(false);
      
      // Update invoices list
      const nextInv = {
        id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().slice(0, 10),
        amount: plan.price,
        status: "Paid",
      };
      setInvoices([nextInv, ...invoices]);

      logAction({
        action: "stripe_webhook_received",
        details: `Webhook stripe Event: invoice.payment_succeeded. Subscription updated to Plan: ${plan.name} (active)`,
        status: "success",
        sql: `UPDATE "Subscriptions" SET "planId" = '${plan.id}', "status" = 'active' WHERE "organizationId" = '${currentOrg.id}'`,
      });

      alert(`Plan successfully upgraded to ${plan.name}! Subscribed via simulated Stripe Checkout.`);
      setSelectedUpgradePlan(null);
    }, 2000);
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Billing & Subscriptions Manager</h2>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your usage credits, review Stripe checkout invoice history, and manage agency upgrade options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upgrade options (Left/Middle panels) */}
        <div className="lg:col-span-2 card p-6 border border-slate-200 bg-white space-y-6">
          <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">SaaS Billing Upgrade Options</h3>
          
          {!hasBillingAccess && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-xs">
              ⚠️ <strong>Access Denied:</strong> Your simulated role (<strong>{currentRole.replace("_", " ")}</strong>) does not have Billing Management privileges. Select <strong>Super Admin</strong> or <strong>Agency Admin</strong> above to test upgrades.
            </div>
          )}

          {checkoutLoading ? (
            <div className="text-center py-12 space-y-4">
              <div className="animate-spin h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
                Redirecting to Stripe Checkout for {selectedUpgradePlan?.name}...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRIPE_PLANS.map((plan) => {
                const isActive = currentOrg.plan === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      isActive
                        ? "border-violet-600 bg-violet-50/20"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{plan.name}</span>
                        {isActive && (
                          <span className="bg-violet-100 text-violet-850 px-2 py-0.5 rounded text-[9px] font-bold uppercase">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-bold text-slate-900 mt-1">{plan.price}</div>
                      <p className="text-[10px] text-slate-450 mt-1">Quota limits: {plan.credits}</p>
                    </div>

                    <button
                      type="button"
                      disabled={isActive || !hasBillingAccess}
                      onClick={() => triggerCheckout(plan)}
                      className={`w-full mt-4 py-2 rounded-lg text-xs font-bold text-center transition ${
                        isActive
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40"
                      }`}
                    >
                      {isActive ? "Current Active Plan" : `Upgrade to ${plan.name.split(" ")[0]}`}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Invoice list panel */}
        <div className="card p-6 border border-slate-200 bg-white flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">Stripe Invoices History</h3>
            
            <div className="mt-4 space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{inv.id}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{inv.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">{inv.amount}</span>
                    <span className="block text-[9px] text-emerald-600 font-bold uppercase">{inv.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t mt-6 text-[10px] text-slate-400 leading-relaxed">
            Stripe webhooks automatically register payments and update user permission limits inside the database schema.
          </div>
        </div>

      </div>
    </div>
  );
}
