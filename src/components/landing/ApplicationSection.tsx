"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, WatermarkNumber, StampBadge } from "@/components/ui/V2Elements";

export default function ApplicationSection() {
  const { t } = useTranslation();

  return (
    <section id="application" className="pt-[120px] pb-[40px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.application.chapter}
        titlePlain={t.application.titlePlain}
        titleBold={t.application.titleBold}
        description={t.application.description}
        watermarkNumber="05"
        watermarkColor="#DC2626"
      />

      {/* V2 Zone cards — GradientBorderBlock per zone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-10">
        {t.data.zones.map((z) => (
          <GradientBorderBlock
            key={z.name}
            gradientFrom={z.color}
            gradientTo={z.color}
            bgTint="transparent"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="font-mono text-[13px] font-semibold tracking-[1px] uppercase"
                style={{ color: z.color }}
              >
                {z.name}
              </div>
              <StampBadge text={z.archetype} color={z.color} />
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-secondary mb-4">
              {z.description}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted mb-1.5">
              <b className="text-rifc-red">R:</b> {z.r}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted mb-1.5">
              <b className="text-rifc-blue">I:</b> {z.i}
            </div>
            <div className="font-body text-[13px] leading-[1.7] text-text-muted">
              <b className="text-rifc-amber">F:</b> {z.f}
            </div>
          </GradientBorderBlock>
        ))}
      </div>

      {/* Divider */}
      <div className="w-[60px] h-px bg-border-red-medium my-20" />

      {/* 3 Steps — V2 watermark step numbers */}
      <h3 className="font-mono text-[13px] tracking-[3px] uppercase text-rifc-red mb-6">
        {t.application.diagnosticTitle}
      </h3>

      <div className="space-y-4 my-10">
        {t.application.steps.map((step) => (
          <div
            key={step.num}
            className="border border-border-light rounded-sm p-6 bg-surface-card relative overflow-hidden"
          >
            <WatermarkNumber
              value={step.num}
              color="#DC2626"
              size="sm"
              className="-top-[10px] -right-[10px]"
            />
            <div className="relative z-[1]">
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

      {/* Visual connector to 05b — dashed continuation */}
      <div className="flex flex-col items-center mt-16 gap-2">
        <div className="w-px h-[40px] border-l border-dashed border-border-light" />
        <span className="font-mono text-[9px] tracking-[3px] uppercase text-text-ghost">
          05b
        </span>
        <div className="w-px h-[20px] border-l border-dashed border-border-light" />
      </div>
    </section>
  );
}
