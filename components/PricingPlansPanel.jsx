"use client";
import { useState } from "react";

const PLAN_CARDS = [
  {
    id: "starter",
    name: "Starter",
    price: "$29",
    billing: "user / month",
    description: "Ideal for individual freelancers and content creators starting out with AI copy generation.",
    features: [
      "Core AI content generators",
      "Standard Social & Ad formats",
      "50 generated assets / month",
      "1 Brand voice profile",
      "Standard community support",
    ],
    cta: "Start Creator Trial",
    popular: false,
    colorClass: "border-slate-200 bg-white text-slate-800",
    btnClass: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    id: "growth",
    name: "Growth",
    price: "$79",
    billing: "workspace / month",
    description: "Perfect for small businesses needing landing page scaffolding and advanced campaign builder.",
    features: [
      "All Starter features",
      "Landing Page Builder & Scaffolding",
      "Unlimited copy/social assets",
      "3 Brand voice profiles",
      "3 Team collaborator seats",
      "Priority email support",
    ],
    cta: "Launch Growth Free",
    popular: true,
    colorClass: "border-violet-300 ring-2 ring-violet-100 bg-white text-slate-800 relative",
    btnClass: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-200 hover:opacity-95",
  },
  {
    id: "agency",
    name: "Agency",
    price: "$249",
    billing: "workspace / month",
    description: "Designed for marketing agencies delivering high-volume multi-client deliverables.",
    features: [
      "All Growth features",
      "Multi-Client sub-accounts",
      "White-label client dashboards",
      "Client approval portal access",
      "Custom domain mapping",
      "10 Brand voice profiles",
      "Dedicated strategist support",
    ],
    cta: "Deploy Agency Workspace",
    popular: false,
    colorClass: "border-slate-200 bg-white text-slate-800",
    btnClass: "bg-slate-900 text-white hover:bg-slate-800",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    billing: "annual contracts",
    description: "Built for enterprise marketing teams requiring SSO, bespoke models, and dedicated capacity.",
    features: [
      "Custom model training options",
      "Unlimited Brand voice profiles",
      "Single Sign-On (SSO / SAML)",
      "Bespoke database integrations",
      "Direct API raw endpoint access",
      "Dedicated success manager",
      "99.9% uptime SLA",
    ],
    cta: "Contact Enterprise Sales",
    popular: false,
    colorClass: "border-slate-200 bg-slate-950 text-white",
    btnClass: "bg-white text-slate-950 hover:bg-slate-100",
  },
];

export default function PricingPlansPanel() {
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [billingCycle, setBillingCycle] = useState("monthly"); // 'monthly', 'annual'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Flexible, Value-Aligned Plans</h2>
        <p className="text-sm text-slate-500">
          Unlock the complete marketing operating system. Scale your production, agency workspaces, and integrations seamlessly.
        </p>

        {/* Annual Billing Cycle Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-semibold ${billingCycle === "monthly" ? "text-slate-800" : "text-slate-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="w-11 h-6 rounded-full bg-slate-200 p-1 flex items-center transition duration-200 relative focus:outline-none"
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition duration-200 ${
                billingCycle === "annual" ? "translate-x-5 bg-violet-600" : ""
              }`}
            />
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === "annual" ? "text-slate-800" : "text-slate-400"}`}>
            Yearly Save 20%
            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full uppercase">
              Promo
            </span>
          </span>
        </div>
      </div>

      {/* Plans Card Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {PLAN_CARDS.map((plan) => {
          const active = selectedPlan === plan.id;
          const isEnterprise = plan.id === "enterprise";
          
          // Compute price display
          let priceDisplay = plan.price;
          if (billingCycle === "annual" && !isEnterprise) {
            const numericVal = parseInt(plan.price.replace("$", ""));
            priceDisplay = `$${Math.round(numericVal * 0.8)}`;
          }

          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`card p-6 flex flex-col justify-between border cursor-pointer transition hover:scale-[1.01] hover:shadow-lg ${plan.colorClass} ${
                active ? "ring-2 ring-violet-500" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 right-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{plan.name}</h3>
                  <p className={`text-xs mt-1 leading-relaxed ${plan.id === "enterprise" ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-current/10">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold tracking-tight">{priceDisplay}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${plan.id === "enterprise" ? "text-slate-400" : "text-slate-500"}`}>
                      / {plan.billing}
                    </span>
                  </div>
                </div>

                <ul className="pt-4 space-y-2.5 text-xs">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="opacity-90">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-current/10">
                <button className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition ${plan.btnClass}`}>
                  {plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Features highlights table */}
      <div className="card p-6 border border-slate-100 bg-white max-w-4xl mx-auto space-y-4">
        <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5 text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900">Are there limits on the number of generated landing pages?</h4>
            <p className="text-slate-500 leading-relaxed">
              Starter plans allow page previews, while Growth and Agency plans support unlimited landing page scaffolding and asset downloads.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900">Can I connect my own domain for client workspaces?</h4>
            <p className="text-slate-500 leading-relaxed">
              Yes, custom domain mapping is supported out of the box on our Agency and Enterprise tiers.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900">How do the AI usage credits work?</h4>
            <p className="text-slate-500 leading-relaxed">
              Each generated campaign card or content modification uses credits. Additional credit packs can be added to any subscription plan.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900">How is the Openrize ecosystem integration structured?</h4>
            <p className="text-slate-500 leading-relaxed">
              AI Marketing Studio accounts can be linked to other Openrize services, sharing assets and brand guidelines across the workspace automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
