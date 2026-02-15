export default function ImplementationSection() {
  const checks = [
    {
      mark: "[R]",
      title: "Audit R:",
      desc: "Is this message the #1 priority of my client RIGHT NOW? If you\u2019re addressing yesterday\u2019s problem, your Relevance is already decaying.",
    },
    {
      mark: "[I]",
      title: "Audit I:",
      desc: 'What tension, curiosity, or "brutal" benefit am I offering? If you can\u2019t articulate it in one sentence, I is below 5.',
    },
    {
      mark: "[F]",
      title: "Audit F:",
      desc: "Does the design/format amplify the message or bury it? Would this message work better in a different format?",
    },
    {
      mark: "[C]",
      title: "The 5-Second Test:",
      desc: 'Can a stranger understand "Who" and "What" in 5 seconds? The ultimate Clarity test.',
    },
  ];

  return (
    <section id="implementation" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 07
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        <strong className="font-semibold">Implementation</strong> Protocol
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        The Golden Rule: Never press &ldquo;Publish&rdquo; until you&apos;ve
        checked all four audit points.
      </p>

      <div className="my-8">
        {checks.map((item) => (
          <div
            key={item.mark}
            className="flex gap-4 py-4 border-b border-border-subtle font-body text-[15px] text-text-muted items-start"
          >
            <span className="text-rifc-red font-mono text-sm flex-shrink-0 mt-0.5">
              {item.mark}
            </span>
            <div>
              <strong className="text-text-primary font-medium">
                {item.title}
              </strong>{" "}
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
