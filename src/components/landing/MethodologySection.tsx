"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ArrowRight, TrendingUp } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WatermarkNumber, StampBadge, GradientBorderBlock } from "@/components/ui/V2Elements";

/* ── helpers ─────────────────────────────────────────── */
const BAR_COLORS = [
  "#DC2626", // 1-2 red
  "#D97706", // 3-4 orange
  "#EAB308", // 5-6 yellow
  "#22C55E", // 7-8 light-green
  "#059669", // 9-10 deep-green
];

const ZONE_COLORS = ["#DC2626", "#D97706", "#2563EB", "#059669"];

export default function MethodologySection() {
  const { t } = useTranslation();
  const [activeGuide, setActiveGuide] = useState(0);
  const guide = t.methodology.scoringGuides[activeGuide];

  return (
    <section
      id="methodology"
      className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative"
    >
      <SectionHeader
        chapter={t.methodology.chapter}
        titlePlain={t.methodology.titlePlain}
        titleBold={t.methodology.titleBold}
        watermarkNumber="04"
        watermarkColor="#DC2626"
      />

      {/* ═══════════════════════════════════════════════
          PUNCT 1 — Intro rescris cu provocare
          ═══════════════════════════════════════════════ */}
      <div className="mb-16">
        <p className="font-heading text-[22px] md:text-[26px] italic text-text-primary leading-[1.4] mb-4">
          {t.methodology.introChallenge}
        </p>
        <p className="font-body text-[16px] md:text-[18px] text-text-secondary leading-[1.8] mb-4 max-w-prose">
          {t.methodology.introBody}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <p className="font-mono text-[14px] text-red-400 tracking-[0.5px]">
            {t.methodology.introScoreGenerous}
          </p>
          <p className="font-mono text-[14px] text-green-400 tracking-[0.5px]">
            {t.methodology.introScoreHarsh}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PUNCT 2 — Ghid Scoring per Variabilă
          ═══════════════════════════════════════════════ */}
      <div className="mb-16">
        <h3 className="font-mono text-[11px] tracking-[4px] uppercase text-text-muted mb-6">
          {t.methodology.scoringGuideTitle}
        </h3>

        {/* Tab pills R / I / F */}
        <div className="flex gap-2 p-1 bg-[rgba(255,255,255,0.02)] border border-border-light rounded-2xl w-fit mb-8">
          {t.methodology.scoringGuides.map((g, i) => {
            const isActive = activeGuide === i;
            return (
              <button
                key={g.letter}
                onClick={() => setActiveGuide(i)}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-mono text-sm tracking-[1px] transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? `${g.color}20` : "transparent",
                  color: isActive ? g.color : "rgba(232,230,227,0.4)",
                }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base font-semibold"
                  style={{
                    background: isActive
                      ? `${g.color}20`
                      : "rgba(255,255,255,0.03)",
                    color: isActive ? g.color : "rgba(232,230,227,0.3)",
                  }}
                >
                  {g.letter}
                </span>
                <span className="hidden sm:inline">{g.title.split(" \u2014 ")[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Active guide card */}
        <div
          className="border rounded-sm transition-all duration-300"
          style={{ borderColor: `${guide.color}30` }}
        >
          {/* Guide header */}
          <div
            className="px-6 py-4 border-b flex items-center gap-4"
            style={{
              borderColor: `${guide.color}20`,
              background: `${guide.color}06`,
            }}
          >
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center font-mono text-xl font-semibold shrink-0"
              style={{
                color: guide.color,
                background: `${guide.color}15`,
                border: `1px solid ${guide.color}30`,
              }}
            >
              {guide.letter}
            </div>
            <div
              className="font-mono text-sm font-semibold tracking-[2px]"
              style={{ color: guide.color }}
            >
              {guide.title}
            </div>
          </div>

          {/* Levels */}
          <div className="p-6 space-y-4">
            {guide.levels.map((level, li) => (
              <div key={level.range} className="flex flex-col sm:flex-row gap-3 sm:gap-5">
                {/* Score badge */}
                <div className="shrink-0 flex items-center gap-3 sm:w-[100px]">
                  <span
                    className="font-mono text-[15px] font-bold w-[50px] text-center"
                    style={{ color: BAR_COLORS[li] }}
                  >
                    {level.range}
                  </span>
                </div>

                {/* Bar + description */}
                <div className="flex-1 min-w-0">
                  {/* Progress bar */}
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.04)] mb-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${level.percent}%`,
                        background: BAR_COLORS[li],
                      }}
                    />
                  </div>
                  {/* Description */}
                  <p className="font-body text-[13px] md:text-[14px] text-text-muted leading-[1.6]">
                    {level.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* Warning for R variable */}
            {guide.warning && (
              <div className="flex items-center gap-2 mt-4 px-4 py-2.5 rounded-sm bg-red-950/20 border border-red-500/30">
                <AlertTriangle size={14} strokeWidth={2} className="shrink-0 text-red-400" />
                <span className="font-mono text-[12px] tracking-[0.5px] text-red-400 font-semibold">
                  {guide.warning}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PUNCT 3 — Exemplu live cu ecuație calculată
          ═══════════════════════════════════════════════ */}
      <GradientBorderBlock
        gradientFrom="#2563EB"
        gradientTo="#059669"
        bgTint="rgba(37,99,235,0.04)"
      >
        <div className="space-y-5">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
            {t.methodology.exampleTitle}
          </div>

          <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-[1.7]">
            {t.methodology.exampleScenario}
          </p>

          {/* R, I, F breakdown */}
          <div className="space-y-3">
            {[
              { letter: "R", value: 7, color: "#DC2626", desc: t.methodology.exampleR },
              { letter: "I", value: 8, color: "#2563EB", desc: t.methodology.exampleI },
              { letter: "F", value: 6, color: "#D97706", desc: t.methodology.exampleF },
            ].map((v) => (
              <div key={v.letter} className="flex items-start gap-3">
                <span
                  className="font-mono text-[18px] font-bold shrink-0 w-[60px]"
                  style={{ color: v.color }}
                >
                  {v.letter} = {v.value}
                </span>
                <span className="font-body text-[13px] text-text-muted leading-[1.6] pt-1">
                  {v.desc}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border-light" />

          {/* Equation */}
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="font-mono text-[24px] md:text-[32px] font-light tracking-[2px]">
              <span style={{ color: "#DC2626" }}>7</span>
              <span className="text-text-ghost mx-2">+</span>
              <span className="text-text-ghost">(</span>
              <span style={{ color: "#2563EB" }}>8</span>
              <span className="text-text-ghost mx-1">&times;</span>
              <span style={{ color: "#D97706" }}>6</span>
              <span className="text-text-ghost">)</span>
              <span className="text-text-ghost mx-2">=</span>
              <span className="font-semibold" style={{ color: "#EAB308" }}>55</span>
            </div>
            <div className="flex items-center gap-2">
              <StampBadge text={t.methodology.exampleResult} color="#EAB308" />
              <span className="font-body text-[13px] text-text-muted">
                {t.methodology.exampleResultZone}
              </span>
            </div>
          </div>

          {/* Diagnostic */}
          <div className="border-t border-border-light pt-4 space-y-2">
            <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.7]">
              <span className="font-semibold text-text-primary">Diagnostic: </span>
              {t.methodology.exampleDiagnostic}
            </p>
            <p className="font-mono text-[14px] text-text-secondary">
              {t.methodology.exampleImproved}
            </p>
            <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-green-950/20 border border-green-500/20 w-fit">
              <TrendingUp size={14} strokeWidth={2} className="text-green-400" />
              <span className="font-mono text-[13px] text-green-400 font-semibold">
                {t.methodology.exampleLift}
              </span>
            </div>
          </div>
        </div>
      </GradientBorderBlock>

      {/* ═══════════════════════════════════════════════
          PUNCT 4 — Progress bar continuu gradient
          ═══════════════════════════════════════════════ */}
      <div className="mt-16 mb-6">
        {/* Gradient bar */}
        <div className="relative">
          <div
            className="h-3 md:h-4 rounded-full overflow-hidden"
            style={{
              background:
                "linear-gradient(to right, #DC2626 0%, #DC2626 18%, #D97706 18%, #D97706 45%, #2563EB 45%, #2563EB 73%, #059669 73%, #059669 100%)",
            }}
          />
          {/* Markers at 20, 50, 80 */}
          {[18, 45, 73].map((pos, i) => (
            <div
              key={i}
              className="absolute top-0 h-3 md:h-4 w-[2px] bg-bg-primary/60"
              style={{ left: `${pos}%` }}
            />
          ))}

          {/* Marker for example score (55) — roughly at 50% */}
          <div
            className="absolute -top-1 h-5 md:h-6 w-[3px] rounded-full bg-white/80"
            style={{ left: "50%" }}
          />
        </div>

        {/* Labels below */}
        <div className="flex mt-2">
          {t.methodology.progressLabels.map((label, i) => {
            const widths = ["18%", "27%", "28%", "27%"];
            return (
              <div key={i} className="text-center" style={{ width: widths[i] }}>
                <span
                  className="font-mono text-[10px] md:text-[11px] tracking-[0.5px]"
                  style={{ color: ZONE_COLORS[i] }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Score markers */}
        <div className="flex mt-0.5">
          <div className="font-mono text-[10px] text-text-ghost" style={{ width: "0%" }}>
            0
          </div>
          <div
            className="font-mono text-[10px] text-text-ghost text-center"
            style={{ width: "18%" }}
          >
            20
          </div>
          <div
            className="font-mono text-[10px] text-text-ghost text-center"
            style={{ width: "27%" }}
          >
            50
          </div>
          <div
            className="font-mono text-[10px] text-text-ghost text-center"
            style={{ width: "28%" }}
          >
            80
          </div>
          <div className="font-mono text-[10px] text-text-ghost text-right flex-1">
            110
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PUNCT 5 — 4 Zone de Claritate (cu acțiuni)
          ═══════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {t.data.scoreRanges.map((range, ri) => {
          const action = t.methodology.zoneActions[ri];
          return (
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
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="font-mono text-[24px] font-light"
                    style={{ color: range.statusColor }}
                  >
                    {range.min} &ndash; {range.max}
                  </div>
                  <StampBadge text={range.status} color={range.statusColor} />
                </div>

                {/* Zone label */}
                <div className="font-heading text-base text-text-primary mb-2">
                  {range.label}
                </div>

                {/* Impact text (existing) */}
                <div className="font-body text-sm leading-[1.7] text-text-muted">
                  {range.impact}
                </div>

                {/* Action text (NEW — PUNCT 5) */}
                {action && (
                  <div
                    className="mt-3 pt-3 border-t"
                    style={{ borderColor: `${range.statusColor}20` }}
                  >
                    <p className="font-body text-[13px] md:text-[14px] leading-[1.7] text-text-secondary">
                      <span
                        className="font-semibold"
                        style={{ color: range.statusColor }}
                      >
                        {action.actionLabel}
                      </span>{" "}
                      {action.actionText}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════
          PUNCT 6 — Regula Poarta Relevanței
          ═══════════════════════════════════════════════ */}
      <div className="mb-16 bg-red-950/15 border border-red-500/30 rounded-sm p-6 md:p-8 relative overflow-hidden">
        <WatermarkNumber
          value="R"
          color="#DC2626"
          size="sm"
          className="-top-[10px] -right-[10px]"
        />
        <div className="relative z-[1]">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} strokeWidth={2} className="text-red-400 shrink-0" />
            <span className="font-mono text-[12px] md:text-[14px] tracking-[3px] uppercase text-red-400 font-bold">
              {t.methodology.gateRuleTitle}
            </span>
          </div>

          {/* Intro */}
          <p className="font-body text-[15px] md:text-[16px] text-red-300/80 leading-[1.7] mb-5">
            {t.methodology.gateRuleIntro}
          </p>

          {/* Example */}
          <div className="bg-[rgba(0,0,0,0.2)] rounded-sm p-4 md:p-5 mb-5">
            <p className="font-mono text-[13px] text-text-muted mb-3">
              {t.methodology.gateRuleExample}
            </p>

            {/* Equation */}
            <div className="font-mono text-[20px] md:text-[24px] mb-3">
              <span className="text-text-ghost">C = </span>
              <span className="text-red-400">2</span>
              <span className="text-text-ghost"> + (</span>
              <span className="text-blue-400">10</span>
              <span className="text-text-ghost"> &times; </span>
              <span className="text-amber-400">10</span>
              <span className="text-text-ghost">) = </span>
              <span className="line-through text-text-ghost/50">102</span>
            </div>

            <p className="font-body text-[13px] text-text-muted leading-[1.6] mb-1">
              {t.methodology.gateRuleOnPaper}
            </p>
            <p className="font-body text-[13px] text-red-400 font-semibold leading-[1.6]">
              {t.methodology.gateRuleInReality}
            </p>
          </div>

          {/* Conclusion */}
          <p className="font-body text-[14px] text-text-secondary leading-[1.7] mb-2">
            {t.methodology.gateRuleConclusion}
          </p>
          <p className="font-mono text-[14px] md:text-[16px] text-red-400 font-bold tracking-[1px]">
            {t.methodology.gateRuleFinal}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          PUNCT 7 — CTA + Tranziție spre Cap. 05
          ═══════════════════════════════════════════════ */}
      <div className="text-center border-t border-border-subtle pt-12 md:pt-16">
        {/* CTA title */}
        <p className="font-heading text-[22px] md:text-[28px] text-text-primary leading-[1.4] mb-3">
          {t.methodology.ctaTitle}
        </p>
        <p className="font-body text-[15px] text-text-muted mb-6 max-w-lg mx-auto">
          {t.methodology.ctaBody}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <a
            href="/audit"
            className="inline-flex items-center gap-2 bg-rifc-red hover:bg-red-500 text-white font-bold px-8 py-4 rounded-sm transition-colors duration-200 font-body text-[15px]"
          >
            <ArrowRight size={16} strokeWidth={2} />
            {t.methodology.ctaButton}
          </a>
          <span className="font-body text-[14px] text-text-muted">
            {t.methodology.ctaOr}{" "}
            <a
              href="/calculator"
              className="text-text-muted hover:text-text-primary underline transition-colors duration-200"
            >
              {t.methodology.ctaSecondaryLink}
            </a>
          </span>
        </div>

        {/* Transition to Ch. 05 */}
        <div className="mt-6">
          <p className="font-heading text-[18px] md:text-[22px] font-light text-red-400/70 leading-[1.4] mb-4">
            {t.methodology.transitionText}
          </p>
          <a
            href={t.methodology.transitionTarget}
            className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
          >
            <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
            {t.methodology.transitionCta}
          </a>
        </div>
      </div>
    </section>
  );
}
