export default function EquationSection() {
  const variables = [
    {
      letter: "R",
      color: "#DC2626",
      label: "Relevance = Foundation",
      desc: "If the soil is sandy (wrong audience), the building sinks. Relevance opens the door and gives permission to be heard.",
    },
    {
      letter: "I",
      color: "#2563EB",
      label: "Interest = Steel Structure",
      desc: 'The skeleton, substance, and promise of the message. It\'s "what you say" \u2014 the reason they stay.',
    },
    {
      letter: "F",
      color: "#D97706",
      label: "Form = Architecture",
      desc: "The Amplifier. Design, format, tonality. A superb facade makes the building visible, but without steel, it\u2019s fragile decoration.",
    },
    {
      letter: "C",
      color: "#059669",
      label: "Clarity = Property Value",
      desc: 'The final result that determines the client\'s decision to "move in" \u2014 to invest, to buy, to act.',
    },
  ];

  return (
    <section id="equation" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 02
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        The <strong className="font-semibold">Universal Equation</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        Visualize your marketing as a solid building construction. Each variable
        plays a structural role that determines whether the building stands or
        collapses.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-[2px] my-12">
        {variables.map((v) => (
          <div
            key={v.letter}
            className="py-8 px-6 text-center border border-border-subtle transition-all duration-300 hover:bg-[rgba(255,255,255,0.02)]"
          >
            <div
              className="font-mono text-[28px] font-semibold mb-2"
              style={{ color: v.color }}
            >
              {v.letter}
            </div>
            <div className="font-body text-xs tracking-[2px] uppercase text-text-faint mb-3">
              {v.label}
            </div>
            <div className="text-[15px] text-text-muted leading-[1.6]">
              {v.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Maximum score display */}
      <div className="text-center mt-[60px] mb-5 font-mono text-[13px] text-text-ghost tracking-[3px]">
        MAXIMUM SCORE
      </div>
      <div className="text-center font-mono text-[clamp(24px,4vw,48px)] font-light tracking-[4px]">
        <span className="text-rifc-red">10</span>
        <span className="text-text-invisible"> + (</span>
        <span className="text-rifc-blue">10</span>
        <span className="text-text-invisible"> &times; </span>
        <span className="text-rifc-amber">10</span>
        <span className="text-text-invisible">) = </span>
        <span className="text-rifc-green">110</span>
      </div>
      <div className="text-center font-body text-sm text-text-ghost mt-3">
        The 10 bonus points appear at absolute Relevance (R=10) &mdash; the Cult
        Brand Zone.
      </div>
    </section>
  );
}
