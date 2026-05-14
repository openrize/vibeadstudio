import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-ink-100/70 bg-white/60 backdrop-blur mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-ink-500">
        <div>© {new Date().getFullYear()} Vibe Ad Studio</div>
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Legal and contact">
          <Link href="/#how-it-works" className="hover:text-ink-800 transition-colors">
            How it works
          </Link>
          <Link href="/#sample-output" className="hover:text-ink-800 transition-colors">
            Sample output
          </Link>
          <Link href="/#limitations" className="hover:text-ink-800 transition-colors">
            AI limitations
          </Link>
          <span className="hidden sm:inline text-ink-200" aria-hidden>
            |
          </span>
          <Link href="/privacy" className="hover:text-ink-800 transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-ink-800 transition-colors">
            Terms of Use
          </Link>
          <Link href="/contact" className="hover:text-ink-800 transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
