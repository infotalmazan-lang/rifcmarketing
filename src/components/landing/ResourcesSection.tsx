import { FileText, BarChart3, ClipboardList, BookOpen } from "lucide-react";

const RESOURCES = [
  {
    title: "White Paper (Source Code)",
    desc: "The complete R IF C Protocol \u2014 philosophy, methodology, scoring system, and implementation guide. The foundational document.",
    icon: <FileText size={28} />,
    status: "available" as const,
  },
  {
    title: "Scoring Template",
    desc: "Ready-to-use spreadsheet with automated C score calculation, Relevance Gate trigger, and financial impact estimation per campaign.",
    icon: <BarChart3 size={28} />,
    status: "coming_soon" as const,
  },
  {
    title: "Quick Diagnostic Card",
    desc: "One-page printable reference. The equation, variable definitions, scoring scale, and 4-question checklist. Pin it to your wall.",
    icon: <ClipboardList size={28} />,
    status: "coming_soon" as const,
  },
  {
    title: "Scientific Paper",
    desc: "Peer-reviewed academic publication with empirical validation, methodology, and comparative analysis against existing frameworks.",
    icon: <BookOpen size={28} />,
    status: "in_development" as const,
  },
];

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  available: { text: "Available", color: "#059669" },
  coming_soon: { text: "Coming Soon", color: "rgba(220,38,38,0.5)" },
  in_development: { text: "In Development", color: "rgba(220,38,38,0.5)" },
};

export default function ResourcesSection() {
  return (
    <section id="resources" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Downloads
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        <strong className="font-semibold">Resources</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Everything you need to implement R IF C in your marketing operations.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {RESOURCES.map((r) => {
          const statusInfo = STATUS_LABELS[r.status];
          return (
            <div
              key={r.title}
              className="bg-surface-card border border-border-light rounded-sm p-9 transition-all duration-400 hover:border-border-red-subtle hover:bg-surface-card-hover hover:-translate-y-0.5"
            >
              <div className="text-text-muted mb-4">{r.icon}</div>
              <div className="font-mono text-sm font-semibold tracking-[1px] mb-3">
                {r.title}
              </div>
              <div className="font-body text-sm leading-[1.7] text-text-muted">
                {r.desc}
              </div>
              <div className="mt-4">
                <span
                  className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-3 py-1 border rounded-sm"
                  style={{
                    borderColor: `${statusInfo.color}80`,
                    color: statusInfo.color,
                  }}
                >
                  {statusInfo.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
