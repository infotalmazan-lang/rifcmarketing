"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WatermarkNumber, StampBadge } from "@/components/ui/V2Elements";

export default function MethodologySection() {
  const { t } = useTranslation();

  return (
    <section id="methodology" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.methodology.chapter}
        titlePlain={t.methodology.titlePlain}
        titleBold={t.methodology.titleBold}
        description={t.methodology.description}
        watermarkNumber="04"
        watermarkColor="#DC2626"
      />

      {/* V2 Score cards instead of table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {t.data.scoreRanges.map((range) => (
          <div
            key={range.label}
            className="border border-border-light rounded-sm p-6 bg-surface-card relative overflow-hidden"
          >
            <WatermarkNumber
              value={`${range.min}`}
              color={range.statusColor}
              size="sm"
              className="-top-[10px] -right-[10px]"
            />
            <div className="relative z-[1]">
              <div className="flex items-center justify-between mb-3">
                <div className="font-mono text-[24px] font-light" style={{ color: range.statusColor }}>
                  {range.min} &ndash; {range.max}
                </div>
                <StampBadge text={range.status} color={range.statusColor} />
              </div>
              <div className="font-heading text-base text-text-primary mb-2">
                {range.label}
              </div>
              <div className="font-body text-sm leading-[1.7] text-text-muted">
                {range.impact}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
