export default function CaseStudiesSection() {
  const placeholders = [
    {
      title: "SaaS Landing Page Optimization",
      desc: "R=3 \u2192 R=8 through audience retargeting. 62% reduction in cost per lead.",
    },
    {
      title: "E-commerce Email Campaign",
      desc: "I=9, F=2 \u2192 F=8 through reformatting. Same content, 3.4\u00d7 higher open-to-click ratio.",
    },
    {
      title: "Investor Pitch Deck Redesign",
      desc: 'C score from 26 to 80. From "interesting but confusing" to funded.',
    },
  ];

  return (
    <section id="case-studies" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 08
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        Case <strong className="font-semibold">Studies</strong>{" "}
        <span className="font-mono text-[10px] tracking-[2px] text-[rgba(220,38,38,0.5)] uppercase inline-block ml-2 px-2 py-0.5 border border-[rgba(220,38,38,0.2)] rounded-sm">
          Coming Soon
        </span>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Real-world applications of R IF C scoring with before/after analysis,
        measurable results, and financial impact data. Each case study includes
        full diagnostic scoring, the specific variable that was optimized, and
        the resulting shift in Clarity level.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {placeholders.map((item) => (
          <div
            key={item.title}
            className="bg-surface-card border border-border-light border-dashed rounded-sm p-9 opacity-50"
          >
            <div className="font-mono text-sm font-semibold tracking-[1px] mb-3">
              {item.title}
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-muted">
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
