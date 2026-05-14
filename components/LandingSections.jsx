export function HowItWorksSection() {
  const steps = [
    {
      n: "1",
      title: "Paste a live URL",
      body: "We fetch public page content—hero copy, headings, benefits, CTAs, and trust signals your visitors already see.",
    },
    {
      n: "2",
      title: "Read the business context",
      body: "Industry playbooks combine with on-page language so campaigns align with how you position the product—not generic filler.",
    },
    {
      n: "3",
      title: "Generate and refine",
      body: "You get multiple strategic campaign angles. Edit tone, shorten, push premium or conversion, then export when ready.",
    },
  ];
  return (
    <section className="mt-20 scroll-mt-24" id="how-it-works" aria-labelledby="how-heading">
      <h2 id="how-heading" className="text-lg font-bold text-ink-900 mb-2">
        How it works
      </h2>
      <p className="text-sm text-ink-600 max-w-2xl mb-8">
        Vibe Ad Studio turns a URL into structured campaign concepts. It is built for teams who need speed without abandoning
        brand accuracy.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {steps.map((s) => (
          <div key={s.n} className="card p-6 border border-ink-100/90">
            <div className="text-xs font-bold text-brand-600 mb-2">Step {s.n}</div>
            <h3 className="font-semibold text-ink-900">{s.title}</h3>
            <p className="text-sm text-ink-600 mt-2 leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SampleOutputSection() {
  return (
    <section className="mt-20 scroll-mt-24" id="sample-output" aria-labelledby="sample-heading">
      <h2 id="sample-heading" className="text-lg font-bold text-ink-900 mb-2">
        Sample output
      </h2>
      <p className="text-sm text-ink-600 max-w-2xl mb-6">
        Illustrative layout only—not tied to your URL. Your real cards use the same structure: headline, body, CTA, and
        strategic reasoning blocks.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <article className="rounded-2xl border border-stone-200 bg-[#fcfaf7] shadow-soft overflow-hidden">
          <div className="h-36 bg-gradient-to-br from-stone-800 to-stone-600 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 to-transparent" />
            <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-white/90">
              Brand awareness
            </span>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-xs text-stone-500">Example SaaS brand</div>
            <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug">
              The quiet upgrade your ops team notices first
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              Fewer handoffs, clearer ownership—without ripping out what already works.
            </p>
            <div className="pt-2">
              <span className="inline-flex rounded-xl bg-stone-900 text-white text-sm font-semibold px-5 py-2.5">
                Book a walkthrough
              </span>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-orange-100 bg-white shadow-soft overflow-hidden">
          <div className="h-36 bg-gradient-to-br from-orange-700 to-rose-700 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/60 to-transparent" />
            <span className="absolute bottom-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-white/90">
              Conversion
            </span>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-xs text-orange-800/80">Example retail brand</div>
            <h3 className="text-lg font-extrabold text-ink-900 leading-snug">Ship today. Smile when it fits.</h3>
            <p className="text-sm text-ink-700 leading-relaxed">
              Free returns, real-time tracking, and sizes that match what you ordered.
            </p>
            <div className="pt-2">
              <span className="inline-flex rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 text-white text-sm font-extrabold px-5 py-2.5">
                Shop best sellers
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export function LimitationsSection() {
  const items = [
    "Outputs depend on what is publicly visible on the URL you provide; sparse or gated pages yield thinner context.",
    "Industry and tone reads are heuristic—they should be reviewed by a human before external use.",
    "Model behavior can vary by temperature and model version; always proofread before publishing or spending media budget.",
    "We do not guarantee lift metrics, legal compliance in your jurisdiction, or platform-specific ad policy approval.",
    "Scraping may fail for some sites (robots, bot protection, or heavy client-side rendering); in those cases signals are limited.",
  ];
  return (
    <section className="mt-20 mb-6 scroll-mt-24" id="limitations" aria-labelledby="lim-heading">
      <h2 id="lim-heading" className="text-lg font-bold text-ink-900 mb-2">
        Limitations of AI results
      </h2>
      <p className="text-sm text-ink-600 max-w-2xl mb-5">
        AI-assisted creative is a starting point. Treat every line as draft copy until your team validates claims, offers,
        and legal requirements.
      </p>
      <ul className="card p-6 space-y-3 text-sm text-ink-700 list-disc pl-5 max-w-3xl">
        {items.map((t) => (
          <li key={t} className="leading-relaxed">
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LandingTrustSections() {
  return (
    <>
      <HowItWorksSection />
      <SampleOutputSection />
      <LimitationsSection />
    </>
  );
}
