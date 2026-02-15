import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, BarChart3, ClipboardList, BookOpen, Download } from "lucide-react";

export const metadata: Metadata = createMetadata({
  title: "Resources — R IF C Downloads & Templates",
  description:
    "Download the R IF C white paper, scoring templates, diagnostic cards, and more. Everything you need to implement the framework.",
  path: "/resources",
});

const RESOURCES = [
  {
    title: "White Paper (Source Code)",
    desc: "The complete R IF C Protocol \u2014 philosophy, methodology, scoring system, and implementation guide. The foundational document.",
    icon: <FileText size={32} />,
    status: "available" as const,
  },
  {
    title: "Scoring Template",
    desc: "Ready-to-use spreadsheet with automated C score calculation, Relevance Gate trigger, and financial impact estimation per campaign.",
    icon: <BarChart3 size={32} />,
    status: "coming_soon" as const,
  },
  {
    title: "Quick Diagnostic Card",
    desc: "One-page printable reference. The equation, variable definitions, scoring scale, and 4-question checklist. Pin it to your wall.",
    icon: <ClipboardList size={32} />,
    status: "coming_soon" as const,
  },
  {
    title: "Scientific Paper",
    desc: "Peer-reviewed academic publication with empirical validation, methodology, and comparative analysis against existing frameworks.",
    icon: <BookOpen size={32} />,
    status: "in_development" as const,
  },
];

const STATUS_MAP = {
  available: { text: "Download", color: "#059669", canDownload: true },
  coming_soon: { text: "Coming Soon", color: "rgba(220,38,38,0.5)", canDownload: false },
  in_development: { text: "In Development", color: "rgba(220,38,38,0.5)", canDownload: false },
};

export default function ResourcesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-content mx-auto">
        <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
          Downloads
        </span>
        <h1 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-4">
          <strong className="font-semibold">Resources</strong>
        </h1>
        <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-12 font-light">
          Everything you need to implement R IF C in your marketing operations.
          Download the foundational documents or use the online tools.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RESOURCES.map((r) => {
            const statusInfo = STATUS_MAP[r.status];
            return (
              <div
                key={r.title}
                className="bg-surface-card border border-border-light rounded-sm p-10 transition-all duration-400 hover:border-border-red-subtle hover:bg-surface-card-hover"
              >
                <div className="text-text-muted mb-5">{r.icon}</div>
                <h2 className="font-mono text-base font-semibold tracking-[1px] mb-3">
                  {r.title}
                </h2>
                <p className="font-body text-sm leading-[1.7] text-text-muted mb-6">
                  {r.desc}
                </p>
                {statusInfo.canDownload ? (
                  <button className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-6 py-3 bg-rifc-green text-surface-bg border border-rifc-green rounded-sm transition-all duration-300 hover:opacity-90">
                    <Download size={14} /> {statusInfo.text}
                  </button>
                ) : (
                  <span
                    className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border rounded-sm"
                    style={{
                      borderColor: `${statusInfo.color}80`,
                      color: statusInfo.color,
                    }}
                  >
                    {statusInfo.text}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
