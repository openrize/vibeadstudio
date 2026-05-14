import LegalPageChrome from "@/components/LegalPageChrome";

export const metadata = {
  title: "Privacy Policy — Vibe Ad Studio",
  description: "How Vibe Ad Studio handles data when you generate campaigns from URLs.",
};

export default function PrivacyPage() {
  return (
    <LegalPageChrome title="Privacy Policy">
      <p className="text-ink-600">
        This policy describes how Vibe Ad Studio (&quot;we&quot;, &quot;the service&quot;) treats information when you use
        the product. Replace bracketed items with your legal entity and contact details before production launch.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">What we process</h2>
      <p>
        When you submit a URL, our servers may fetch publicly available content from that address to extract text signals
        used for analysis and campaign generation. We also process the prompts and outputs required to run the application.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">What we do not do by default</h2>
      <p>
        This tool is not designed to collect passwords, payment card data, or other highly sensitive categories from end
        users of your website. Do not paste confidential URLs or content you are not authorized to process.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Third parties</h2>
      <p>
        If you enable cloud AI features, portions of the scraped text and model instructions may be transmitted to your
        configured AI provider (for example OpenAI) under their terms and privacy policy. Hosting and analytics providers
        you configure (for example Vercel) may also process technical metadata such as IP addresses and request logs.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Retention</h2>
      <p>
        Retention depends on how you deploy the service. In a default stateless deployment, we do not maintain a customer
        database of generated ads unless you add storage. Set retention and logging policies to match your compliance
        program.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Your rights</h2>
      <p>
        Depending on jurisdiction, you may have rights to access, correct, export, or delete personal data. For requests,
        contact the operator using the email on the Contact page.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Changes</h2>
      <p>We may update this policy as the product evolves. Material changes should be communicated to active customers.</p>

      <p className="text-xs text-ink-500 pt-8 border-t border-ink-100 mt-10">
        Disclaimer: this template is informational and not legal advice. Have qualified counsel review before customer use.
      </p>
    </LegalPageChrome>
  );
}
