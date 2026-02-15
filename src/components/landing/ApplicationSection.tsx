import { ZONES } from "@/lib/constants/rifc";

export default function ApplicationSection() {
  return (
    <section id="application" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 04
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        Application <strong className="font-semibold">Matrix</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        R IF C is not a theory for one channel. It&apos;s a universal diagnostic
        language that works from an Instagram story to a &euro;10 million pitch
        deck. Here&apos;s what each variable means across every major marketing
        touchpoint.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-10">
        {ZONES.map((z) => (
          <div
            key={z.name}
            className="border border-border-light rounded-sm p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-[3px]"
            style={{ borderColor: `${z.color}20` }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: z.color }}
            />
            <div
              className="font-mono text-[13px] font-semibold tracking-[1px] mb-5 uppercase"
              style={{ color: z.color }}
            >
              {z.name}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted mb-1.5">
              <b className="text-text-secondary">R:</b> {z.r}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted mb-1.5">
              <b className="text-text-secondary">I:</b> {z.i}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted mb-1.5">
              <b className="text-text-secondary">F:</b> {z.f}
            </div>
            <div
              className="font-mono text-[11px] mt-4 pt-4 border-t border-border-light tracking-[1px]"
              style={{ color: z.color }}
            >
              Common archetype: {z.archetype}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-[60px] h-px bg-border-red-medium my-20" />

      {/* 3 Steps */}
      <h3 className="font-mono text-[13px] tracking-[3px] uppercase text-rifc-red mb-6">
        Universal Diagnostic: 3 Steps
      </h3>

      <div className="my-10">
        {[
          {
            num: "01",
            title: "Identify the Weak Variable",
            desc: "Don\u2019t try to fix everything simultaneously. Use the scoring grid and find the variable with the lowest score. That\u2019s your leverage point.",
          },
          {
            num: "02",
            title: "Apply Priority Rule: R > I > F",
            desc: "If R is below threshold, don\u2019t invest in I or F. If R is solid but I is weak, don\u2019t compensate through F. The hierarchy matters.",
          },
          {
            num: "03",
            title: "Re-score After Optimization",
            desc: "Calculate the new C. If it hasn\u2019t moved to the upper Clarity zone, repeat the process on the next weak variable.",
          },
        ].map((step) => (
          <div
            key={step.num}
            className="grid grid-cols-[60px_1fr] gap-6 py-6 border-b border-border-subtle"
          >
            <div className="font-mono text-[32px] font-light text-[rgba(220,38,38,0.3)]">
              {step.num}
            </div>
            <div>
              <div className="font-medium text-text-primary mb-2 text-[17px]">
                {step.title}
              </div>
              <div className="font-body text-sm leading-[1.7] text-text-muted">
                {step.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
