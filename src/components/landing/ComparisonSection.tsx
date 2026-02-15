import { COMPARISONS } from "@/lib/constants/rifc";

export default function ComparisonSection() {
  return (
    <section id="comparison" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 06
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        R IF C <strong className="font-semibold">vs. Other Frameworks</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        R IF C doesn&apos;t replace existing models &mdash; it fills the
        diagnostic gap they all share. Here&apos;s how it compares.
      </p>

      {COMPARISONS.map((c) => (
        <div
          key={c.model}
          className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-6 py-8 border-b border-border-subtle"
        >
          <div>
            <div className="font-mono text-xl font-semibold text-text-ghost">
              {c.model}
            </div>
            <div className="font-body text-[11px] text-[rgba(232,230,227,0.25)] mt-1">
              {c.full}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Limitation
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-muted">
              {c.weakness}
            </div>
          </div>
          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-[rgba(220,38,38,0.5)] mb-2">
              R IF C Advantage
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-secondary">
              {c.rifc}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
