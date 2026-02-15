"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function AIPromptsSection() {
  const { t } = useTranslation();

  return (
    <section id="ai-prompts" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.aiPrompts.chapter}
        titlePlain={t.aiPrompts.titlePlain}
        titleBold={t.aiPrompts.titleBold}
        description={t.aiPrompts.description}
        watermarkNumber="10"
        watermarkColor="#DC2626"
      />

      <div className="space-y-6">
        {t.data.aiPrompts.map((prompt) => (
          <GradientBorderBlock
            key={prompt.label}
            gradientFrom="#DC2626"
            gradientTo="#2563EB"
            bgTint="transparent"
            headerLabel={prompt.label}
            headerColor="#DC2626"
          >
            <div className="font-mono text-[13px] leading-[1.8] text-text-muted">
              {prompt.text}
            </div>
          </GradientBorderBlock>
        ))}
      </div>
    </section>
  );
}
