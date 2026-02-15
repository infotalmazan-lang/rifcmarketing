"use client";

import { AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, StampBadge } from "@/components/ui/V2Elements";

export default function RelevanceGateSection() {
  const { t } = useTranslation();

  return (
    <section id="relevance-gate" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.relevanceGate.chapter}
        titlePlain={t.relevanceGate.titlePlain}
        titleBold={t.relevanceGate.titleBold}
        description={t.relevanceGate.description}
        watermarkNumber="06"
        watermarkColor="#DC2626"
      />

      <GradientBorderBlock
        gradientFrom="#DC2626"
        gradientTo="#D97706"
        bgTint="rgba(220,38,38,0.02)"
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={20} className="text-rifc-red shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="font-mono text-sm tracking-[2px] text-rifc-red">
                {t.relevanceGate.rule}
              </div>
              <StampBadge text="R < 3" color="#DC2626" />
            </div>
            <p className="font-body text-base leading-[1.8] text-text-muted">
              {t.relevanceGate.ruleDescription}
            </p>
          </div>
        </div>

        <div className="mt-4 p-5 bg-[rgba(0,0,0,0.3)] rounded-sm font-mono text-[13px] leading-[1.8] text-text-muted">
          <span className="text-text-ghost">{t.relevanceGate.exampleLabel}</span>{" "}
          {t.relevanceGate.exampleText}{" "}
          <span className="text-rifc-red">
            {t.relevanceGate.exampleResult}
          </span>
        </div>
      </GradientBorderBlock>
    </section>
  );
}
