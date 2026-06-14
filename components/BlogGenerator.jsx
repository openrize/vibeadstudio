"use client";
import { useState } from "react";

export default function BlogGenerator({ strategy, currentRole }) {
  const brandIntel = strategy?.brandIntelligence || {};
  const hasEditAccess = ["super_admin", "agency_admin", "marketing_manager"].includes(currentRole);

  // Form input state
  const [topic, setTopic] = useState("How AI is Transforming Modern Business Growth");
  const [keywords, setKeywords] = useState("ai marketing, digital strategy, automation");
  const [tone, setTone] = useState("educational");
  const [length, setLength] = useState("medium");
  const [audience, setAudience] = useState(brandIntel.audience || "Small Business Owners");

  // Output generated state
  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState(null);

  // Asset approval state
  const [approvalStatus, setApprovalStatus] = useState("draft"); // 'draft', 'edited', 'approved', 'published'
  const [activeFaq, setActiveFaq] = useState(null);

  // Editable body fields
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDescription, setEditableDescription] = useState("");
  const [editableContent, setEditableContent] = useState("");

  function handleGenerate() {
    if (!topic.trim() || !hasEditAccess) return;
    setLoading(true);
    setApprovalStatus("draft");

    // Simulate AI generation delay
    setTimeout(() => {
      const generatedTitle = `${topic} | The Ultimate Strategic Guide`;
      const generatedDesc = `Discover how to leverage ${keywords.split(",")[0] || "automation"} to scale your brand velocity and optimize conversions. Read our complete guide.`;
      
      const parsedKeywords = keywords.split(",").map(k => k.trim());
      const primaryKeyword = parsedKeywords[0] || "AI systems";
      const secondaryKeyword = parsedKeywords[1] || "marketing scaling";

      const paragraphs = [
        `In today's fast-moving commercial landscape, leveraging ${primaryKeyword} is no longer a luxury—it is an operational necessity. As teams look to optimize overhead and compress campaign velocity, automated platforms enable rapid testing and precise targeting at scale.`,
        `By aligning your brand voice with structured ${secondaryKeyword} workflows, businesses can scale content production by 10x without sacrificing quality. The key is establishing a central Brand Intelligence engine that guides all outputs deterministically.`,
        `To start implementing these protocols, outline your core business goals, identify target customer personas, and structure a multi-channel funnel strategy. In doing so, you maintain brand consistency and capture high-margin recurring value.`,
      ];

      const generatedBlog = {
        title: generatedTitle,
        description: generatedDesc,
        outline: [
          "1. The Shift to Automated Workflows",
          `2. Implementing ${primaryKeyword} in Your Core Strategy`,
          "3. Scaling Output While Protecting Brand Voice",
          "4. Measuring Lift Metrics & ROI",
        ],
        paragraphs,
        faqs: [
          {
            q: `How does ${primaryKeyword} ensure brand alignment?`,
            a: `By feeding a structured Brand Profile—complete with personality guidelines, positioning pillars, and prohibited words—the AI generator restricts its vocabulary to remain on-brand.`,
          },
          {
            q: "What is the typical ramp-up time for this process?",
            a: "Most SMBs and agencies can set up a unified brand profile and launch their first full-funnel ad and social campaigns in under an hour.",
          },
        ],
      };

      setBlogData(generatedBlog);
      setEditableTitle(generatedTitle);
      setEditableDescription(generatedDesc);
      setEditableContent(paragraphs.join("\n\n"));
      setLoading(false);
    }, 1200);
  }

  function handleCopy() {
    if (!blogData || !hasEditAccess) return;
    const textToCopy = `Title: ${editableTitle}\nDescription: ${editableDescription}\n\nContent:\n${editableContent}`;
    navigator.clipboard.writeText(textToCopy);
    setApprovalStatus("published");
    alert("Blog post copied to clipboard! Status updated to Published.");
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI SEO Blog Post Generator</h2>
        <p className="text-sm text-slate-500 mt-1">
          Compose publish-ready, search-optimized articles guided by your brand voice rules.
        </p>
      </div>

      {!hasEditAccess && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-xs">
          ⚠️ <strong>Access Denied:</strong> Your active role (<strong>{currentRole.replace("_", " ")}</strong>) is restricted to Read Only. Select another role in the dashboard switcher to test content generation.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Editor Form (Left side) */}
        <div className="xl:col-span-5 space-y-6">
          <div className="card p-6 border border-slate-100 bg-white space-y-5">
            <h3 className="font-bold text-slate-800 text-sm border-b pb-2.5">Generator Parameters</h3>
            
            {/* Topic Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Blog Topic</label>
              <input
                type="text"
                value={topic}
                disabled={!hasEditAccess}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-violet-400 outline-none"
                placeholder="e.g. How to scale customer retention"
              />
            </div>

            {/* Keywords Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Keywords</label>
              <input
                type="text"
                value={keywords}
                disabled={!hasEditAccess}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-violet-400 outline-none"
                placeholder="Keywords, separated by commas"
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Writing Tone</label>
              <select
                value={tone}
                disabled={!hasEditAccess}
                onChange={(e) => setTone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-violet-400"
              >
                <option value="educational">Educational & Informative</option>
                <option value="conversational">Conversational & Human</option>
                <option value="professional">Professional & Credible</option>
                <option value="bold">Bold & Authoritative</option>
              </select>
            </div>

            {/* Length Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Article Length</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "short", name: "Short (~800w)" },
                  { id: "medium", name: "Medium (~1500w)" },
                  { id: "long", name: "Long (~2500w)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    disabled={!hasEditAccess}
                    onClick={() => setLength(item.id)}
                    className={`px-2 py-2 text-[10px] font-semibold rounded-lg border text-center transition ${
                      length === item.id
                        ? "border-violet-600 bg-violet-50 text-violet-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Audience</label>
              <input
                type="text"
                value={audience}
                disabled={!hasEditAccess}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 focus:ring-1 focus:ring-violet-400 outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !hasEditAccess}
              className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "Composing Article..." : hasEditAccess ? "Generate Blog Post" : "Generate (Requires Editor role)"}
            </button>
          </div>
        </div>

        {/* Output Canvas (Right side) */}
        <div className="xl:col-span-7 flex flex-col space-y-6">
          
          {/* Workflow Status Bar */}
          {blogData && (
            <div className="card p-4 border border-slate-100 bg-white flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Approval State:</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  approvalStatus === "draft" ? "bg-amber-100 text-amber-800" :
                  approvalStatus === "edited" ? "bg-indigo-100 text-indigo-850" :
                  approvalStatus === "approved" ? "bg-emerald-100 text-emerald-800" :
                  "bg-slate-900 text-white"
                }`}>
                  {approvalStatus}
                </span>
              </div>
              
              {hasEditAccess ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setApprovalStatus("edited")}
                    className="px-3 py-1.5 border rounded-lg text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Mark Edited
                  </button>
                  <button
                    onClick={() => setApprovalStatus("approved")}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-xs font-bold hover:bg-emerald-100 transition"
                  >
                    Approve Asset
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                  >
                    Publish & Copy
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic font-semibold">Read-only preview mode</span>
              )}
            </div>
          )}

          {/* Generator Preview Container */}
          <div className="flex-1 min-h-[480px] bg-slate-100 border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
            
            {loading && (
              <div className="text-center space-y-4 py-12">
                <div className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full mx-auto" />
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider animate-pulse">
                  AI writing SEO outline, meta tags, and FAQ sections...
                </p>
              </div>
            )}

            {!loading && !blogData && (
              <div className="text-center text-slate-400 text-xs py-12 space-y-2">
                <svg className="w-8 h-8 mx-auto stroke-current opacity-60" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>Configure options and click generate to build the article.</p>
              </div>
            )}

            {!loading && blogData && (
              <div className="space-y-6">
                
                {/* Metatags */}
                <div className="bg-white border rounded-xl p-4 space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1.5">SEO Meta Tags</div>
                  <div className="space-y-1.5 text-xs">
                    <div>
                      <span className="font-bold text-slate-500">Title: </span>
                      <input
                        type="text"
                        value={editableTitle}
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          setEditableTitle(e.target.value);
                          setApprovalStatus("edited");
                        }}
                        className="w-full mt-0.5 border border-slate-100 rounded p-1.5 outline-none focus:ring-1 focus:ring-violet-400 font-semibold text-slate-800"
                      />
                    </div>
                    <div>
                      <span className="font-bold text-slate-500">Description: </span>
                      <textarea
                        value={editableDescription}
                        rows={2}
                        disabled={!hasEditAccess}
                        onChange={(e) => {
                          setEditableDescription(e.target.value);
                          setApprovalStatus("edited");
                        }}
                        className="w-full mt-0.5 border border-slate-100 rounded p-1.5 outline-none focus:ring-1 focus:ring-violet-400 text-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Outline */}
                <div className="bg-white border rounded-xl p-4 space-y-2 text-xs">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1.5">Article Structure (Outline)</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 font-semibold">
                    {blogData.outline.map((o, i) => (
                      <div key={i} className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded">
                        <span>{o}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Body */}
                <div className="bg-white border rounded-xl p-5 space-y-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1.5">Generated Content Body</div>
                  <textarea
                    value={editableContent}
                    rows={8}
                    disabled={!hasEditAccess}
                    onChange={(e) => {
                      setEditableContent(e.target.value);
                      setApprovalStatus("edited");
                    }}
                    className="w-full text-xs leading-relaxed text-slate-700 border-none outline-none resize-none focus:ring-0 p-0"
                  />
                </div>

                {/* FAQ Section */}
                <div className="bg-white border rounded-xl p-4 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1.5">FAQ Accordion Section</div>
                  <div className="space-y-2">
                    {blogData.faqs.map((faq, idx) => {
                      const expanded = activeFaq === idx;
                      return (
                        <div key={idx} className="border rounded-lg overflow-hidden text-xs">
                          <button
                            onClick={() => setActiveFaq(expanded ? null : idx)}
                            className="w-full bg-slate-50 hover:bg-slate-100/80 px-3 py-2 flex items-center justify-between text-left font-bold text-slate-800 focus:outline-none"
                          >
                            <span>{faq.q}</span>
                            <span>{expanded ? "−" : "+"}</span>
                          </button>
                          {expanded && (
                            <div className="p-3 bg-white text-slate-650 leading-relaxed border-t">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
