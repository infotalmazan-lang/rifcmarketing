"use client";

import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, FormulaDisplay } from "@/components/ui/V2Elements";
import GatewayBlueprint from "./GatewayBlueprint";

export default function EquationSection() {
  const { t } = useTranslation();

  return (
    <section id="equation" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.equation.chapter}
        titlePlain={t.equation.titlePlain}
        titleBold={t.equation.titleBold}
        description={t.equation.description}
        watermarkNumber="02"
        watermarkColor="#DC2626"
      />

      {/* V2 Variable cards — GradientBorderBlock per variable */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-12">
        {t.equation.variables.map((v) => (
          <GradientBorderBlock
            key={v.letter}
            gradientFrom={v.color}
            gradientTo={v.color}
            bgTint="transparent"
          >
            <div className="text-center">
              <div
                className="font-mono text-[36px] md:text-[44px] font-light leading-none mb-2"
                style={{ color: v.color }}
              >
                {v.letter}
              </div>
              <div className="font-body text-xs tracking-[2px] uppercase text-text-faint mb-3">
                {v.label}
              </div>
              <div className="text-[14px] text-text-muted leading-[1.6]">
                {v.desc}
              </div>
            </div>
          </GradientBorderBlock>
        ))}
      </div>

      {/* Gateway Blueprint — animated SVG */}
      <div className="my-16">
        <div className="text-center mb-8 font-mono text-[11px] tracking-[6px] uppercase text-text-ghost">
          {t.equation.blueprintLabel}
        </div>
        <div className="border border-border-subtle rounded-sm p-4 md:p-8 bg-[rgba(255,255,255,0.01)]">
          <GatewayBlueprint />
        </div>
      </div>

      {/* Maximum score display — V2 FormulaDisplay */}
      <div className="text-center mt-[60px] mb-5 font-mono text-[13px] text-text-ghost tracking-[3px]">
        {t.equation.maxScoreLabel}
      </div>
      <FormulaDisplay
        r={10}
        i={10}
        f={10}
        c={110}
        cColor="#059669"
        className="justify-center"
      />
      <div className="text-center font-body text-sm text-text-ghost mt-3">
        {t.equation.maxScoreNote}
      </div>
    </section>
  );
}
