import { AI_PROMPTS } from "@/lib/constants/rifc";

export default function AIPromptsSection() {
  return (
    <section id="ai-prompts" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        Chapter 09
      </span>
      <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-10">
        AI <strong className="font-semibold">Integration</strong>
      </h2>
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        R IF C is designed to work natively with AI tools. Use these prompts
        with ChatGPT, Claude, or Gemini to diagnose and optimize any marketing
        message.
      </p>

      <div className="space-y-6">
        {AI_PROMPTS.map((prompt) => (
          <div key={prompt.label}>
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-rifc-red mb-3">
              {prompt.label}
            </div>
            <div className="bg-[rgba(255,255,255,0.03)] border border-border-medium rounded-sm p-6 font-mono text-[13px] leading-[1.8] text-text-muted">
              {prompt.text}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
