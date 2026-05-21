export default function Header({ usedAI }) {
  return (
    <header className="w-full border-b border-white/70 bg-white/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-glow"
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
            <div className="font-semibold text-ink-900">Vibe Strategist</div>
            <div className="text-[11px] text-ink-500 -mt-0.5">AI Marketing Strategist System</div>
          </div>
        </a>

        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex text-xs font-medium px-3 py-1 rounded-full bg-violet-50 text-violet-800 border border-violet-100">
            Brand Intelligence Engine
          </span>
          {usedAI ? (
            <span className="tone-tag bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full mr-1.5 bg-emerald-500" />
              AI Strategist Active
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
