import Link from "next/link";

const FOOTER_LINKS = {
  Platform: [
    { href: "/#platform", label: "AI Content" },
    { href: "/#platform", label: "Campaign Builder" },
    { href: "/#platform", label: "Social Media" },
    { href: "/#platform", label: "Email Marketing" },
    { href: "/#platform", label: "Landing Pages" },
    { href: "/#platform", label: "Analytics" },
  ],
  Solutions: [
    { href: "/#solutions", label: "Small Business" },
    { href: "/#solutions", label: "Agencies" },
    { href: "/#solutions", label: "Startups" },
    { href: "/#solutions", label: "Marketing Teams" },
  ],
  Company: [
    { href: "/#pricing", label: "Pricing" },
    { href: "/#templates", label: "Templates" },
    { href: "/#outcomes", label: "Case Studies" },
    { href: "/#faq", label: "Resources" },
    { href: "/contact", label: "Book Demo" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Use" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink-100/70 bg-white/60 backdrop-blur mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-600 text-white text-xs">◆</span>
              <span className="font-bold text-slate-900 text-sm">AI Marketing Studio</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your AI Marketing Team — create, launch, and scale campaigns in minutes, not days.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">{group}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-xs text-slate-600 hover:text-violet-700 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-400">
          <div>© {new Date().getFullYear()} AI Marketing Studio</div>
          <div className="flex items-center gap-4">
            <Link href="/#pricing" className="hover:text-slate-700 transition-colors">Login</Link>
            <Link href="/#pricing" className="hover:text-slate-700 transition-colors font-semibold text-violet-600">Start Free Trial</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
