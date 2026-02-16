"use client";

import { useState } from "react";
import { AlertTriangle, Flag, ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function AnatomySection() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const active = t.anatomy.variables[activeTab];
  const isC = active.letter === "C";

  return (
    <section
      id="anatomy"
      className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative"
    >
      <SectionHeader
        chapter={t.anatomy.chapter}
        titlePlain={t.anatomy.titlePlain}
        titleBold={t.anatomy.titleBold}
        description={t.anatomy.description}
        watermarkNumber="03"
        watermarkColor="#DC2626"
      />

      {/* V2 pill selector — tabs with sub-factor count */}
      <div className="flex flex-wrap gap-2 p-1 bg-[rgba(255,255,255,0.02)] border border-border-light rounded-2xl w-fit mb-10">
        {t.anatomy.variables.map((v, i) => {
          const isActive = activeTab === i;
          return (
            <button
              key={v.letter}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl font-mono text-sm tracking-[1px] transition-all duration-300 cursor-pointer"
              style={{
                background: isActive ? `${v.color}20` : "transparent",
                color: isActive ? v.color : "rgba(232,230,227,0.4)",
              }}
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-base font-semibold"
                style={{
                  background: isActive ? `${v.color}20` : "rgba(255,255,255,0.03)",
                  color: isActive ? v.color : "rgba(232,230,227,0.3)",
                }}
              >
                {v.letter}
              </span>
              <span className="hidden sm:inline">{v.title}</span>
              {/* Sub-factor count as ×N */}
              <span
                className="font-mono text-[10px] tracking-[0.5px] px-1.5 py-0.5 rounded-full"
                style={{
                  background: isActive ? `${v.color}15` : "rgba(255,255,255,0.03)",
                  color: isActive ? v.color : "rgba(232,230,227,0.25)",
                }}
              >
                &times;{v.factors.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div
        className="border rounded-sm transition-all duration-300"
        style={{ borderColor: `${active.color}30` }}
      >
        {/* Tab header */}
        <div
          className="px-6 py-5 border-b flex items-center gap-4"
          style={{
            borderColor: `${active.color}20`,
            background: `${active.color}06`,
          }}
        >
          <div
            className="w-12 h-12 rounded-sm flex items-center justify-center font-mono text-2xl font-semibold shrink-0"
            style={{
              color: active.color,
              background: `${active.color}15`,
              border: `1px solid ${active.color}30`,
            }}
          >
            {active.letter}
          </div>
          <div>
            <div
              className="font-mono text-sm font-semibold tracking-[2px]"
              style={{ color: active.color }}
            >
              {active.title}
            </div>
            <div className="font-body text-sm text-text-muted mt-0.5">
              {active.subtitle}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Warning — moved to top */}
          <div
            className="flex items-start gap-3 px-4 py-3 rounded-sm mb-3 border-l-2"
            style={{
              borderLeftColor: active.color,
              backgroundColor: `${active.color}0A`,
            }}
          >
            <AlertTriangle
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0"
              style={{ color: active.color }}
            />
            <p
              className="font-body text-[13px] md:text-[14px] font-medium leading-[1.6]"
              style={{ color: `${active.color}CC` }}
            >
              {active.warning}
            </p>
          </div>

          {/* Red Flag */}
          <div className="flex items-start gap-2 px-4 py-2 mb-6">
            <Flag
              size={14}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-rifc-red/60"
            />
            <p className="font-body text-[13px] italic text-rifc-red/60 leading-[1.6]">
              Red Flag: {active.redFlag}
            </p>
          </div>

          {/* C tab explanation */}
          {isC && (
            <div
              className="border-l-2 px-4 py-3 rounded-r-sm mb-6"
              style={{
                borderLeftColor: "#059669",
                backgroundColor: "rgba(5, 150, 105, 0.06)",
              }}
            >
              <p className="font-body text-[13px] md:text-[14px] italic text-text-secondary leading-[1.7]">
                {t.anatomy.cExplanation}
              </p>
            </div>
          )}

          {/* Factors grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {active.factors.map((f, fi) => (
              <GradientBorderBlock
                key={fi}
                gradientFrom={active.color}
                gradientTo={active.color}
                bgTint="transparent"
              >
                {/* Factor name + CRITICAL badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="font-mono text-xs font-medium text-text-secondary tracking-[0.5px]">
                    {f.name}
                  </div>
                  {f.critical && (
                    <span
                      className="text-[10px] font-bold tracking-[1px] uppercase px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${active.color}18`,
                        color: active.color,
                      }}
                    >
                      CRITIC
                    </span>
                  )}
                </div>
                {/* Description */}
                <div className="font-body text-[13px] text-text-muted leading-[1.6] mt-1">
                  {f.desc}
                </div>
                {/* Diagnostic question */}
                <div className="font-body text-[12px] md:text-[13px] italic text-text-muted leading-[1.6] mt-2">
                  <span className="text-text-ghost/60">&rarr;</span> {f.question}
                </div>
              </GradientBorderBlock>
            ))}
          </div>

          {/* Rule */}
          <GradientBorderBlock
            gradientFrom={active.color}
            gradientTo={active.color}
            bgTint={`${active.color}08`}
          >
            <div
              className="font-mono text-xs tracking-[1px]"
              style={{ color: active.color }}
            >
              {active.rule}
            </div>
          </GradientBorderBlock>
        </div>
      </div>

      {/* Transition CTA to Chapter 04 */}
      <div className="mt-20 md:mt-24 text-center border-t border-border-subtle pt-12 md:pt-16">
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-6">
          {t.anatomy.transitionText}
        </p>
        <a
          href={t.anatomy.transitionTarget}
          className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
          {t.anatomy.transitionCta}
        </a>
      </div>
    </section>
  );
}
