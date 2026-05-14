import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";

export default function LegalPageChrome({ title, children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="border-b border-ink-100/80 bg-white/80 backdrop-blur">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-ink-900 hover:text-brand-600 transition-colors">
            ← Vibe Ad Studio
          </Link>
        </div>
      </header>
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 mb-8">{title}</h1>
        <div className="max-w-none text-ink-700 space-y-4 text-sm leading-relaxed">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
