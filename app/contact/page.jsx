import LegalPageChrome from "@/components/LegalPageChrome";

export const metadata = {
  title: "Contact — Vibe Ad Studio",
  description: "Contact the Vibe Ad Studio operator.",
};

export default function ContactPage() {
  const email = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim();

  return (
    <LegalPageChrome title="Contact">
      <p>
        For privacy requests, security reports, billing on paid plans, or enterprise evaluation, reach the team operating
        this deployment.
      </p>

      {email ? (
        <p className="mt-6">
          <span className="font-semibold text-ink-900">Email: </span>
          <a href={`mailto:${encodeURIComponent(email)}`} className="text-brand-600 hover:underline font-medium">
            {email}
          </a>
        </p>
      ) : (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold text-ink-900 mb-1">Configure contact email</p>
          <p>
            Set <code className="text-xs bg-white/80 px-1 py-0.5 rounded">NEXT_PUBLIC_CONTACT_EMAIL</code> in your
            environment (for example in Vercel project settings) so customers see a working address here.
          </p>
        </div>
      )}

      <p className="mt-8 text-ink-600">
        Typical response time depends on your support tier. For urgent security issues, include &quot;Security&quot; in
        the subject line.
      </p>
    </LegalPageChrome>
  );
}
