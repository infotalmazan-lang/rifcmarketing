"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function ComparisonSection() {
  const { t } = useTranslation();

  return (
    <section id="comparison" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.comparison.chapter}
        titlePlain={t.comparison.titlePlain}
        titleBold={t.comparison.titleBold}
        description={t.comparison.description}
        watermarkNumber="07"
        watermarkColor="#DC2626"
      />

      <div className="space-y-4 mt-10">
        {t.data.comparisons.map((c) => (
          <GradientBorderBlock
            key={c.model}
            gradientFrom="#DC2626"
            gradientTo="#D97706"
            bgTint="transparent"
          >
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_1fr] gap-6">
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
                  {t.comparison.limitationLabel}
                </div>
                <div className="font-body text-sm leading-[1.7] text-text-muted">
                  {c.weakness}
                </div>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-[rgba(220,38,38,0.5)] mb-2">
                  {t.comparison.advantageLabel}
                </div>
                <div className="font-body text-sm leading-[1.7] text-text-secondary">
                  {c.rifc}
                </div>
              </div>
            </div>
          </GradientBorderBlock>
        ))}
      </div>
    </section>
  );
}
