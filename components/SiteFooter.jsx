import Link from "next/link";

const FOOTER_LINKS = {
  Product: [
    { href: "/#how-it-works", label: "How It Works" },
    { href: "/#output-preview", label: "Sample Output" },
    { href: "/#what-you-get", label: "What You Get" },
    { href: "/#features", label: "Features" },
    { href: "/#pricing", label: "Pricing" },
  ],
  Audience: [
    { href: "/#who-its-for", label: "Agencies" },
    { href: "/#who-its-for", label: "Founders" },
    { href: "/#who-its-for", label: "Marketers" },
    { href: "/#who-its-for", label: "SaaS Teams" },
    { href: "/#who-its-for", label: "Local Businesses" },
  ],
  Company: [
    { href: "/#limitations", label: "Trust & AI Limits" },
    { href: "/#pricing", label: "Join Beta" },
    { href: "/contact", label: "Contact" },
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
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-600 to-accent-600 text-white text-xs">
                ◆
              </span>
              <span className="font-bold text-ink-900 text-sm">Vibe Strategist</span>
            </div>
            <p className="text-xs text-ink-500 leading-relaxed">
              An AI strategy workspace that turns any website into full-funnel campaign ideas, messaging, and growth
              direction.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-ink-400 mb-3">{group}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-xs text-ink-600 hover:text-brand-700 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-ink-400">
          <div>© {new Date().getFullYear()} Vibe Strategist</div>
          <div className="flex items-center gap-4">
            <Link href="/#pricing" className="hover:text-ink-700 transition-colors">
              Join Beta
            </Link>
            <Link href="/#hero" className="hover:text-ink-700 transition-colors font-semibold text-brand-600">
              Build Strategy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
