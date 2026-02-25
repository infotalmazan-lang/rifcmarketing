"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

/* ── Lucide-style inline SVG icons ──────────────────────── */
function IconFlag() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

/* Indicator dot color helper */
function indicatorColor(icon: string): string {
  if (icon === "green") return "#059669";
  if (icon === "amber") return "#D97706";
  return "#DC2626";
}

export default function ImplementationSection() {
  const { t } = useTranslation();
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(t.implementation.checklistItems.length).fill(false)
  );
  const [expandedAudit, setExpandedAudit] = useState<number | null>(0);

  const allChecked = checkedItems.every(Boolean);

  function toggleCheck(index: number) {
    setCheckedItems((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  }

  return (
    <section id="implementation" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      <SectionHeader
        chapter={t.implementation.chapter}
        titlePlain={t.implementation.titlePlain}
        titleBold={t.implementation.titleBold}
        description={t.implementation.description}
        watermarkNumber="08"
        watermarkColor="#DC2626"
      />

      {/* ═══ PUNCT 1 — New title + intro ═════════════════════ */}
      <div className="max-w-3xl mx-auto mt-10 mb-12 text-center">
        <h3 className="font-heading text-[32px] md:text-[44px] font-light text-text-primary leading-[1.2] mb-2">
          {t.implementation.titleLine1}
        </h3>
        <h4 className="font-heading text-[24px] md:text-[32px] font-light text-rifc-red leading-[1.3] mb-6">
          {t.implementation.titleLine2}
        </h4>
        <p className="font-body text-[15px] md:text-[16px] italic text-text-muted leading-[1.7]">
          {t.implementation.introLine}
        </p>
      </div>

      {/* ═══ PUNCT 2 — Golden Rule ═══════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="border-2 border-amber-500/40 rounded-sm bg-[rgba(217,119,6,0.08)] p-6 md:p-8 text-center">
          <div className="font-mono text-[12px] md:text-[14px] tracking-[4px] uppercase text-amber-400 font-bold mb-4">
            {t.implementation.goldenRuleLabel}
          </div>
          <p className="font-heading text-[18px] md:text-[22px] text-text-primary leading-[1.5] mb-3">
            {t.implementation.goldenRuleLine1}
          </p>
          <p className="font-heading text-[16px] md:text-[18px] font-bold text-text-primary leading-[1.5] mb-2">
            {t.implementation.goldenRuleLine2}
          </p>
          <p className="font-body text-[14px] text-text-muted leading-[1.6] mb-1">
            {t.implementation.goldenRuleLine3}
          </p>
          <p className="font-body text-[14px] text-red-400 leading-[1.6]">
            {t.implementation.goldenRuleLine4}
          </p>
          <div className="mt-5 pt-4 border-t border-amber-500/20">
            <p className="font-body text-[14px] text-text-secondary">
              {t.implementation.goldenRuleFooter}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ PUNCT 3 — Timeline 15 minutes ═══════════════════ */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4 text-center">
          {t.implementation.timelineTitle}
        </div>
        <div className="space-y-3">
          {t.implementation.timelineBars.map((bar) => {
            const widthPercent = (bar.minutes / 15) * 100;
            return (
              <div key={bar.variable} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center font-mono text-[14px] font-bold shrink-0"
                  style={{ color: bar.color, background: `${bar.color}15`, border: `1px solid ${bar.color}30` }}
                >
                  {bar.variable}
                </div>
                <div className="flex-1">
                  <div className="h-[24px] rounded-sm bg-[rgba(255,255,255,0.03)] overflow-hidden relative">
                    <div
                      className="h-full rounded-sm transition-all duration-500"
                      style={{ width: `${widthPercent}%`, background: `${bar.color}30` }}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[11px] text-text-muted">
                      {bar.label}
                    </span>
                  </div>
                </div>
                <div className="font-mono text-[13px] font-semibold text-text-secondary w-[50px] text-right">
                  {bar.minutes} min
                </div>
              </div>
            );
          })}
          <div className="flex items-center gap-3 pt-2 border-t border-border-light">
            <div className="w-8" />
            <div className="flex-1" />
            <div className="font-mono text-[13px] font-bold text-text-primary w-[80px] text-right">
              {t.implementation.timelineTotal}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PUNCT 4 — 4 Audits ══════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="space-y-4">
          {t.implementation.audits.map((audit, ai) => {
            const isExpanded = expandedAudit === ai;
            return (
              <div
                key={audit.id}
                className="border rounded-sm overflow-hidden transition-all duration-300"
                style={{ borderColor: isExpanded ? `${audit.color}40` : "rgba(255,255,255,0.06)" }}
              >
                {/* Audit header — clickable */}
                <button
                  onClick={() => setExpandedAudit(isExpanded ? null : ai)}
                  className="w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-all duration-200"
                  style={{ background: isExpanded ? `${audit.color}08` : "transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-[18px] font-bold shrink-0"
                      style={{ color: audit.color, background: `${audit.color}15`, border: `2px solid ${audit.color}40` }}
                    >
                      {audit.num}
                    </div>
                    <div className="text-left">
                      <div className="font-mono text-[13px] md:text-[14px] font-semibold tracking-[1px]" style={{ color: audit.color }}>
                        AUDIT {audit.variable} — {audit.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-text-muted flex items-center gap-1">
                      <IconClock /> {audit.time}
                    </span>
                    <ChevronDown
                      size={16}
                      className="text-text-ghost transition-transform duration-200"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: `${audit.color}20` }}>
                    {/* Brutal question */}
                    <div className="mt-4 mb-4 pl-4 border-l-2" style={{ borderColor: audit.color }}>
                      <p className="font-heading text-[15px] md:text-[17px] italic text-text-primary leading-[1.6]">
                        {audit.brutalQuestion}
                      </p>
                    </div>

                    {/* What to check */}
                    <div className="mb-3">
                      <p className="font-body text-[13px] md:text-[14px] text-text-secondary font-medium">
                        {audit.whatToCheck}
                      </p>
                    </div>

                    {/* How to check — numbered steps */}
                    <div className="mb-4">
                      <div className="space-y-2">
                        {audit.howToCheck.map((step, si) => (
                          <div key={si} className="flex items-start gap-2.5">
                            <span className="font-mono text-[11px] font-bold mt-0.5 shrink-0" style={{ color: audit.color }}>
                              {si + 1}.
                            </span>
                            <span className="font-body text-[12px] md:text-[13px] text-text-muted leading-[1.7]">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Red flags */}
                    <div className="mb-4 space-y-1.5">
                      {audit.redFlags.map((flag, fi) => (
                        <div key={fi} className="flex items-start gap-2 px-3 py-1.5 rounded-sm bg-[rgba(220,38,38,0.05)]">
                          <span className="mt-0.5 shrink-0"><IconFlag /></span>
                          <span className="font-body text-[12px] text-red-400/80 leading-[1.6]">
                            {flag}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Output */}
                    <div className="mb-3">
                      <div className="font-mono text-[14px] font-semibold text-text-primary">
                        {audit.outputLabel}
                      </div>
                    </div>

                    {/* Indicators */}
                    <div className="space-y-1.5">
                      {audit.indicators.map((ind, ii) => (
                        <div
                          key={ii}
                          className="flex items-center gap-3 px-3 py-2 rounded-sm"
                          style={{
                            background: `${indicatorColor(ind.icon)}08`,
                            borderLeft: `3px solid ${indicatorColor(ind.icon)}`,
                          }}
                        >
                          <div
                            className="w-[8px] h-[8px] rounded-full shrink-0"
                            style={{ background: indicatorColor(ind.icon) }}
                          />
                          <span className="font-mono text-[11px] font-semibold shrink-0" style={{ color: indicatorColor(ind.icon) }}>
                            {ind.condition}
                          </span>
                          <span className="font-body text-[12px] text-text-secondary">
                            {ind.action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Example dashboard */}
        <div className="mt-6">
          <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#D97706" bgTint="rgba(220,38,38,0.04)">
            <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted mb-3">
              {t.implementation.exampleTitle}
            </div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="font-mono text-[13px] text-text-secondary">{t.implementation.exampleScores}</span>
              <span className="font-mono text-[11px] text-text-ghost">&rarr;</span>
              <span className="font-mono text-[13px] font-bold text-red-400">{t.implementation.exampleResult}</span>
            </div>
            <p className="font-body text-[13px] font-bold text-red-400 mb-2">
              {t.implementation.exampleVerdict}
            </p>
            <p className="font-body text-[12px] text-rifc-green leading-[1.7]">
              {t.implementation.exampleFix}
            </p>
          </GradientBorderBlock>
        </div>
      </div>

      {/* ═══ PUNCT 5 — Checklist ═════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="border border-border-light rounded-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border-light bg-[rgba(255,255,255,0.02)]">
            <div className="font-mono text-[12px] tracking-[3px] uppercase text-text-muted">
              {t.implementation.checklistTitle}
            </div>
          </div>
          <div className="p-5 space-y-2.5">
            {t.implementation.checklistItems.map((item, i) => (
              <button
                key={i}
                onClick={() => toggleCheck(i)}
                className="w-full flex items-center gap-3 text-left cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 rounded-sm border flex items-center justify-center shrink-0 transition-all duration-200 ${
                    checkedItems[i]
                      ? "bg-rifc-green border-rifc-green"
                      : "border-border-light group-hover:border-text-ghost"
                  }`}
                >
                  {checkedItems[i] && <Check size={12} className="text-white" />}
                </div>
                <span
                  className={`font-body text-[13px] md:text-[14px] leading-[1.6] transition-all duration-200 ${
                    checkedItems[i] ? "text-text-ghost line-through" : "text-text-secondary"
                  }`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>
          <div
            className={`px-5 py-3 border-t text-center font-mono text-[12px] tracking-[1px] ${
              allChecked
                ? "border-green-500/30 bg-[rgba(5,150,105,0.08)] text-rifc-green"
                : "border-red-500/20 bg-[rgba(220,38,38,0.04)] text-red-400/80"
            }`}
          >
            {allChecked ? t.implementation.checklistPass : t.implementation.checklistFail}
          </div>
        </div>
      </div>

      {/* ═══ PUNCT 6 — Adoption ══════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-14">
        <GradientBorderBlock gradientFrom="#D97706" gradientTo="#059669" bgTint="rgba(217,119,6,0.03)">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-amber-400 mb-2">
            {t.implementation.adoptionLabel}
          </div>
          <h4 className="font-heading text-[18px] md:text-[22px] font-light text-text-primary mb-5">
            {t.implementation.adoptionTitle}
          </h4>

          <div className="space-y-4">
            {t.implementation.adoptionPairs.map((pair, i) => (
              <div key={i} className="space-y-1.5">
                <p className="font-body text-[13px] text-red-400/60 line-through leading-[1.6]">
                  &ldquo;{pair.wrong}&rdquo;
                </p>
                <p className="font-body text-[13px] text-rifc-green font-semibold leading-[1.6]">
                  &ldquo;{pair.right}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <p className="mt-5 pt-4 border-t border-border-light font-body text-[13px] text-text-muted leading-[1.7] italic">
            {t.implementation.adoptionConclusion}
          </p>
        </GradientBorderBlock>
      </div>

      {/* ═══ PUNCT 7 — Tool Stack ════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-14">
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
          {t.implementation.toolStackTitle}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {t.implementation.toolStackItems.map((item) => (
            <div key={item.audit} className="border border-border-light rounded-sm p-4 bg-surface-card">
              <div className="font-mono text-[11px] tracking-[1px] text-text-muted mb-1.5">
                {item.audit}
              </div>
              <div className="font-body text-[12px] text-text-muted leading-[1.6]">
                {item.tools}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center">
          <a
            href="https://rifc.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-border-light rounded-sm p-3 px-6 bg-[rgba(220,38,38,0.04)] hover:border-rifc-red/40 transition-colors no-underline"
          >
            <div className="w-2 h-2 rounded-full bg-rifc-red shrink-0" />
            <span className="font-body text-[12px] text-rifc-red">{t.implementation.toolStackPremium}</span>
          </a>
        </div>
      </div>

      {/* ═══ PUNCT 8 — Closer ═════════════════════════ */}
      <div className="max-w-2xl mx-auto text-center mb-0">
        <div className="font-mono text-[12px] md:text-[14px] tracking-[4px] uppercase text-amber-400 font-bold mb-5">
          {t.implementation.closerLabel}
        </div>
        <p className="font-heading text-[18px] md:text-[22px] font-light text-text-primary leading-[1.5] italic mb-4">
          {t.implementation.closerLine1}
        </p>
        <p className="font-body text-[14px] text-text-muted leading-[1.7] mb-3">
          {t.implementation.closerLine2}
        </p>
        <p className="font-body text-[15px] md:text-[16px] font-semibold text-text-primary mb-3">
          {t.implementation.closerLine3}
        </p>
        <p className="font-body text-[13px] text-text-muted leading-[1.7]">
          {t.implementation.closerLine4}
        </p>
      </div>

      {/* Transition to Chapter 09 */}
      <div className="mt-20 md:mt-24 text-center border-t border-border-subtle pt-12 md:pt-16">
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-2 italic">
          {t.implementation.transitionLine1}
        </p>
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-6 italic">
          {t.implementation.transitionLine2}
        </p>
        <a
          href={t.implementation.transitionTarget}
          className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
          {t.implementation.transitionCta}
        </a>
      </div>
    </section>
  );
}
