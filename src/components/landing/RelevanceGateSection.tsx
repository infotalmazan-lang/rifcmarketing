import { AlertTriangle } from "lucide-react";

export default function RelevanceGateSection() {
  return (
    <section id="relevance-gate" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Critical Rule
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        The <strong className="font-semibold">Relevance Gate</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        The formula operates under a fundamental condition: Relevance functions
        as an entry filter. This is the circuit breaker that prevents wasted
        investment.
      </p>

      <div className="border-2 border-border-red-medium rounded-sm p-12 my-12 bg-[rgba(220,38,38,0.02)] relative">
        <div className="absolute -top-4 left-10 bg-surface-bg px-4">
          <AlertTriangle size={24} className="text-rifc-red" />
        </div>

        <div className="font-mono text-sm tracking-[2px] text-rifc-red mb-5">
          IF R &lt; 3 &rarr; AUTOMATIC CRITICAL FAILURE
        </div>
        <p className="font-body text-base leading-[1.8] text-text-muted">
          A message delivered to the wrong audience cannot be saved by creativity
          or design. No execution is good enough to compensate for the lack of
          relevance. The Relevance Gate overrides any I &times; F score.
        </p>

        <div className="mt-6 p-5 bg-[rgba(0,0,0,0.3)] rounded-sm font-mono text-[13px] leading-[1.8] text-text-muted">
          <span className="text-text-ghost">Example:</span> Cinematic video
          campaign (F=9) + fascinating promise (I=8) &rarr; I&times;F = 72. But
          sent to completely wrong audience (R=2) &rarr;{" "}
          <span className="text-rifc-red">
            Gate activates &rarr; Critical Failure. Budget burned.
          </span>
        </div>
      </div>
    </section>
  );
}
