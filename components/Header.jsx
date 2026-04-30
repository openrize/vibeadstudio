export default function Header({ usedAI }) {
  return (
    <header className="w-full border-b border-ink-100/70 bg-white/70 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
              <path
                d="M5 19 L12 5 L19 19 M8 14 H16"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="font-semibold text-ink-900">Vibe Ad Studio</div>
            <div className="text-[11px] text-ink-500 -mt-0.5">
              AI ads from any URL
            </div>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <span
            className={`tone-tag ${
              usedAI
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200"
            }`}
            title={
              usedAI
                ? "OPENAI_API_KEY detected — using GPT"
                : "Demo mode — set OPENAI_API_KEY to use GPT"
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                usedAI ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
            {usedAI ? "AI: OpenAI" : "Demo mode"}
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex btn-ghost"
          >
            Docs
          </a>
        </div>
      </div>
    </header>
  );
}
