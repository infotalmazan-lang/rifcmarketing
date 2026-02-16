"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  GradientBorderBlock,
  FormulaDisplay,
  WatermarkNumber,
} from "@/components/ui/V2Elements";
import GatewayBlueprint from "./GatewayBlueprint";

export default function EquationSection() {
  const { t } = useTranslation();
  const eq = t.equation;

  return (
    <section
      id="equation"
      className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative overflow-hidden"
    >
      {/* ════════════════════════════════════════════════════
          SECTION HEADER
          ════════════════════════════════════════════════════ */}
      <SectionHeader
        chapter={eq.chapter}
        titlePlain={eq.titlePlain}
        titleBold={eq.titleBold}
        watermarkNumber="02"
        watermarkColor="#DC2626"
      />

      {/* ════════════════════════════════════════════════════
          PUNCT 1 — Titlu nou + subtitlu
          ════════════════════════════════════════════════════ */}
      <div className="text-center mb-16 -mt-4">
        <h3 className="font-heading text-[36px] md:text-[48px] font-light text-text-primary leading-[1.15] mb-2">
          {eq.titleLine1}
        </h3>
        <h4 className="font-heading text-[28px] md:text-[36px] font-light text-text-muted leading-[1.2] mb-4">
          {eq.titleLine2}
        </h4>
        <p className="font-heading text-[18px] md:text-[22px] italic text-text-muted leading-[1.4]">
          {eq.subtitle}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 2 — Ecuația vizuală + I×F Illumination
          ════════════════════════════════════════════════════ */}
      {/* Large equation display */}
      <div className="text-center mb-10">
        <FormulaDisplay
          r={10}
          i={10}
          f={10}
          c={110}
          cColor="#059669"
          className="justify-center"
        />
        <div className="text-center font-mono text-[11px] text-text-muted tracking-[3px] mt-3">
          {eq.maxScoreLabel}
        </div>
        <div className="text-center font-body text-sm text-text-muted mt-1">
          {eq.maxScoreNote}
        </div>
      </div>

      {/* I×F Illumination block */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="px-6 py-8 md:px-8 md:py-10 bg-surface-card border border-border-light rounded-sm">
          <h4 className="font-heading text-[22px] md:text-[26px] font-semibold text-text-primary leading-[1.3] mb-6 text-center">
            {eq.illuminationTitle}
          </h4>

          <p className="font-body text-[15px] md:text-[16px] text-text-secondary leading-[1.8] mb-6">
            {eq.illuminationBody1}
          </p>

          {/* Low scenario */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Low */}
            <div className="flex-1 px-4 py-4 bg-[rgba(220,38,38,0.05)] border border-rifc-red/20 rounded-sm">
              <p className="font-body text-[13px] text-text-muted mb-2">
                {eq.illuminationLowLabel}
              </p>
              <p className="font-mono text-[24px] md:text-[28px] text-rifc-red font-bold leading-none mb-2">
                {eq.illuminationLowCalc}
              </p>
              <p className="font-body text-[12px] text-text-muted">
                {eq.illuminationLowResult}
              </p>
              {/* Mini bar */}
              <div className="mt-3 h-2 bg-border-light rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-rifc-red/60"
                  style={{ width: "22%" }}
                />
              </div>
            </div>

            {/* High */}
            <div className="flex-1 px-4 py-4 bg-[rgba(5,150,105,0.05)] border border-rifc-green/20 rounded-sm">
              <p className="font-body text-[13px] text-text-muted mb-2">
                {eq.illuminationHighLabel}
              </p>
              <p className="font-mono text-[24px] md:text-[28px] text-rifc-green font-bold leading-none mb-2">
                {eq.illuminationHighCalc}
              </p>
              <p className="font-body text-[12px] text-text-muted">
                {eq.illuminationHighResult}
              </p>
              {/* Mini bar */}
              <div className="mt-3 h-2 bg-border-light rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-rifc-green/60"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>

          {/* Highlight */}
          <p className="font-heading text-[18px] md:text-[20px] font-semibold text-text-primary text-center mb-4">
            {eq.illuminationHighlight}
          </p>

          <p className="font-body text-[14px] text-text-secondary leading-[1.8] text-center mb-2">
            {eq.illuminationBody2}
          </p>
          <p className="font-body text-[14px] text-text-muted italic text-center">
            {eq.illuminationCloser}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 4 — Blueprint vizual (Gateway Blueprint)
          ════════════════════════════════════════════════════ */}
      <div className="mb-20">
        <div className="text-center mb-8 font-mono text-[11px] tracking-[6px] uppercase text-text-muted">
          {eq.blueprintLabel}
        </div>
        <div className="border border-border-subtle rounded-sm p-4 md:p-8 bg-[rgba(255,255,255,0.01)]">
          <GatewayBlueprint />
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 3 — 4 Variabile arhitecturale
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20">
        {eq.archVars.map((v) => (
          <div key={v.letter} className="relative">
            {/* Top border accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ backgroundColor: v.color }}
              aria-hidden="true"
            />

            <div className="pt-6 pb-6 px-6 bg-surface-card border border-border-light border-t-0 rounded-b-sm">
              {/* Letter + title */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="font-mono text-[40px] md:text-[48px] font-light leading-none shrink-0"
                  style={{ color: v.color }}
                >
                  {v.letter}
                </div>
                <div>
                  <div
                    className="font-mono text-[11px] tracking-[2px] uppercase font-bold mb-1"
                    style={{ color: v.color }}
                  >
                    {v.title}
                  </div>
                  <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.7]">
                    {v.metaphor}
                  </p>
                </div>
              </div>

              {/* Body */}
              <p className="font-body text-[13px] md:text-[14px] text-text-muted leading-[1.8] mb-4">
                {v.body}
              </p>

              {/* Threshold */}
              <div
                className="px-3 py-2 rounded-sm border-l-2 font-mono text-[12px] md:text-[13px]"
                style={{
                  borderLeftColor: v.color,
                  backgroundColor: `${v.color}08`,
                  color: v.color,
                }}
              >
                {v.threshold}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 6 — R aditiv
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-20">
        <GradientBorderBlock
          gradientFrom="#DC2626"
          gradientTo="#DC262640"
          bgTint="transparent"
        >
          <h4 className="font-heading text-[20px] md:text-[24px] font-semibold text-text-primary leading-[1.3] mb-4">
            {eq.rAdditiveTitle}
          </h4>

          <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-[1.8] mb-4">
            {eq.rAdditiveBody}
          </p>

          {/* R=0 example */}
          <div className="px-4 py-3 bg-[rgba(220,38,38,0.05)] border border-rifc-red/20 rounded-sm mb-4">
            <p className="font-mono text-[14px] text-rifc-red font-bold mb-1">
              {eq.rAdditiveCalc}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <p className="font-body text-[13px] text-rifc-green">
                {eq.rAdditiveOnPaper}
              </p>
              <p className="font-body text-[13px] text-rifc-red">
                {eq.rAdditiveReality}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 mb-4">
            <AlertTriangle
              size={16}
              className="text-rifc-red shrink-0 mt-0.5"
              strokeWidth={1.8}
            />
            <p className="font-mono text-[12px] text-rifc-red tracking-[1px]">
              {eq.rAdditiveGate}
            </p>
          </div>

          <Link
            href={`#${eq.rAdditiveLinkTarget}`}
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[2px] uppercase text-rifc-red hover:text-rifc-red/80 transition-colors duration-300 no-underline"
          >
            <ArrowRight size={14} />
            {eq.rAdditiveLink}
          </Link>
        </GradientBorderBlock>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 5 — 2 Scenarii contrastante
          ════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto mb-20 relative">
        <WatermarkNumber value="C" color="#059669" size="lg" />

        <div className="text-center mb-8">
          <div className="font-mono text-[10px] md:text-[11px] tracking-[4px] uppercase text-text-muted font-bold">
            {eq.scenariosTitle}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[1]">
          {/* Scenario 1 — Buried Diamond */}
          <div className="px-6 py-6 md:py-8 bg-surface-card border border-rifc-red/20 rounded-sm">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-rifc-red font-bold mb-3">
              {eq.scenario1Label}
            </div>
            <p className="font-body text-[12px] text-text-muted mb-3">
              {eq.scenario1Scores}
            </p>
            <p className="font-mono text-[20px] md:text-[24px] text-rifc-red font-bold leading-none mb-2">
              {eq.scenario1Calc}
            </p>
            <div className="inline-block px-2 py-1 bg-rifc-red/10 border border-rifc-red/30 rounded-sm mb-3">
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-red">
                {eq.scenario1Zone}
              </span>
            </div>
            <p className="font-body text-[13px] text-text-muted italic">
              {eq.scenario1Desc}
            </p>
            {/* Score bar */}
            <div className="mt-4 h-3 bg-border-light rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-rifc-red/60"
                style={{ width: "24%" }}
              />
            </div>
          </div>

          {/* Scenario 2 — Supreme Clarity */}
          <div className="px-6 py-6 md:py-8 bg-surface-card border border-rifc-green/20 rounded-sm">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-rifc-green font-bold mb-3">
              {eq.scenario2Label}
            </div>
            <p className="font-body text-[12px] text-text-muted mb-3">
              {eq.scenario2Scores}
            </p>
            <p className="font-mono text-[20px] md:text-[24px] text-rifc-green font-bold leading-none mb-2">
              {eq.scenario2Calc}
            </p>
            <div className="inline-block px-2 py-1 bg-rifc-green/10 border border-rifc-green/30 rounded-sm mb-3">
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-green">
                {eq.scenario2Zone}
              </span>
            </div>
            <p className="font-body text-[13px] text-text-secondary">
              {eq.scenario2Desc}
            </p>
            {/* Score bar */}
            <div className="mt-4 h-3 bg-border-light rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-rifc-green/60"
                style={{ width: "81%" }}
              />
            </div>
          </div>
        </div>

        {/* Difference line */}
        <div className="text-center mt-8">
          <p className="font-mono text-[14px] md:text-[16px] text-rifc-green font-bold mb-2">
            {eq.scenarioDiff}
          </p>
          <p className="font-heading text-[18px] md:text-[20px] font-semibold text-text-primary">
            {eq.scenarioConclusion}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 7 — Tranziție spre Cap. 03
          ════════════════════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-muted leading-[1.4] mb-1">
          {eq.transitionLine1}
        </p>
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-primary leading-[1.4] mb-2">
          {eq.transitionLine2}
        </p>
        <p className="font-body text-[16px] text-text-muted italic mb-8">
          {eq.transitionLine3}
        </p>
        <Link
          href={`#${eq.transitionTarget}`}
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[3px] uppercase text-rifc-red hover:text-rifc-red/80 transition-colors duration-300 no-underline"
        >
          <ArrowRight size={16} />
          {eq.transitionCta}
        </Link>
      </div>
    </section>
  );
}
