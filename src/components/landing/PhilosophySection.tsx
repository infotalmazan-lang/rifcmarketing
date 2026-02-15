export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 01
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        The <strong className="font-semibold">Philosophy</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Unlike classical models (AIDA, RACE) that pursue conversion as their
        primary goal, R IF C asserts that{" "}
        <strong className="text-text-primary font-medium">
          people act naturally when the message is clear
        </strong>
        . Conversion isn&apos;t forced through manipulation &mdash; it&apos;s the
        logical final step of understanding.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {[
          {
            title: "Cognitive Economy",
            color: "#DC2626",
            desc: 'The human brain rejects confusion to conserve energy. An unclear message is perceived as "wasteful resource consumption" and is automatically filtered by the client\'s anti-advertising shield.',
          },
          {
            title: "Anxiety Elimination",
            color: "#2563EB",
            desc: "Confusion generates fear and hesitation. Clarity eliminates psychological barriers, providing safety and confidence to the buyer. No friction, no anxiety, no lost sale.",
          },
          {
            title: "Irrevocability of Action",
            color: "#059669",
            desc: "Once Relevance is established and Interest is amplified by Form, Clarity inevitably leads to action. The conversion becomes a natural consequence, not a manipulation endpoint.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-surface-card border border-border-light rounded-sm p-9 transition-all duration-400 hover:border-border-red-subtle hover:bg-surface-card-hover hover:-translate-y-0.5"
          >
            <div
              className="font-mono text-sm font-semibold tracking-[1px] mb-3"
              style={{ color: card.color }}
            >
              {card.title}
            </div>
            <div className="font-body text-sm leading-[1.7] text-text-muted">
              {card.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
