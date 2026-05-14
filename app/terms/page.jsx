import LegalPageChrome from "@/components/LegalPageChrome";

export const metadata = {
  title: "Terms of Use — Vibe Ad Studio",
  description: "Terms governing use of Vibe Ad Studio.",
};

export default function TermsPage() {
  return (
    <LegalPageChrome title="Terms of Use">
      <p className="text-ink-600">
        By accessing or using Vibe Ad Studio, you agree to these terms. Replace bracketed placeholders with your company
        legal name, governing law, and support contacts.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Service description</h2>
      <p>
        Vibe Ad Studio generates marketing-oriented campaign concepts from public URL content and related signals. Output is
        assistive and may be incomplete, inaccurate, or unsuitable for regulated industries without human review.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Acceptable use</h2>
      <p>You agree not to use the service to scrape or target sites you do not own or lack permission to analyze.</p>
      <p className="mt-3">
        You agree not to use generated content to mislead consumers, impersonate individuals, violate advertising platform
        policies, or infringe third-party intellectual property.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">No warranties</h2>
      <p>
        The service is provided &quot;as is&quot;. We disclaim implied warranties of merchantability, fitness for a
        particular purpose, and non-infringement to the fullest extent permitted by law.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, neither Vibe Ad Studio nor its suppliers will be liable for any indirect,
        incidental, special, consequential, or punitive damages, or loss of profits or data, arising from your use of the
        service.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Indemnity</h2>
      <p>
        You will defend and indemnify the operator against claims arising from your use of the service, your content, or
        your violation of these terms.
      </p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Termination</h2>
      <p>We may suspend or terminate access for abuse, security risk, or non-payment if you are on a paid plan.</p>

      <h2 className="text-base font-semibold text-ink-900 mt-10 mb-2">Governing law</h2>
      <p>
        Specify your governing law and venue here (for example: State of Delaware, USA). Until then, interpret these terms
        according to the laws applicable where the operator is established.
      </p>

      <p className="text-xs text-ink-500 pt-8 border-t border-ink-100 mt-10">
        Disclaimer: this template is informational and not legal advice. Have qualified counsel review before customer use.
      </p>
    </LegalPageChrome>
  );
}
