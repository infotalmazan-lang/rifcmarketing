"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { ChevronDown, Check, Copy, ArrowRight, ChevronRight, Search, Zap, BarChart3, MessageSquare } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, WatermarkNumber } from "@/components/ui/V2Elements";

/* ── Category icons ────────────────────────────────────── */
const CAT_ICONS: Record<string, typeof Search> = {
  diagnostic: Search,
  create: Zap,
  scoring: BarChart3,
  channel: MessageSquare,
};

export default function AIPromptsSection() {
  const { t } = useTranslation();
  const ai = t.aiPrompts;

  /* ── State ─────────────────────────────────────────── */
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  /* ── Copy handler ──────────────────────────────────── */
  const handleCopy = useCallback((promptId: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(promptId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  /* ── Filtered prompts ──────────────────────────────── */
  const filteredPrompts = activeCategory
    ? ai.prompts.filter((p) => p.category === activeCategory)
    : ai.prompts;

  /* ── Prompt number ─────────────────────────────────── */
  const getPromptNumber = (id: string): string => {
    const idx = ai.prompts.findIndex((p) => p.id === id);
    return String(idx + 1);
  };

  return (
    <section id="ai-prompts" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative overflow-hidden">
      <SectionHeader
        chapter={ai.chapter}
        titlePlain={ai.titlePlain}
        titleBold={ai.titleBold}
        description={ai.description}
        watermarkNumber="10"
        watermarkColor="#DC2626"
      />

      {/* ════════════════════════════════════════════════════
          PUNCT 1 — New Title + Intro
          ════════════════════════════════════════════════════ */}
      <div className="text-center mb-16">
        <h3 className="font-heading text-[36px] md:text-[48px] font-light text-text-primary leading-[1.15] mb-3">
          <span className="text-rifc-red font-semibold">R IF C</span>
          <span className="text-text-primary"> + </span>
          <span className="text-rifc-red font-semibold">AI</span>
          <span className="text-text-primary">.</span>
        </h3>
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-secondary leading-[1.3] mb-6">
          {ai.titleLine2}
        </p>

        {/* Italic red hook */}
        <div className="max-w-2xl mx-auto mb-8">
          <p className="font-heading text-[18px] md:text-[20px] italic text-rifc-red/80 leading-[1.5]">
            {ai.introLine1}
            <br />
            {ai.introLine2}
          </p>
        </div>

        {/* Manual vs AI timing */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="font-mono text-[14px] text-text-muted line-through">{ai.introManual}</span>
          <ArrowRight size={16} className="text-text-ghost" />
          <span className="font-mono text-[16px] md:text-[18px] text-rifc-green font-bold">{ai.introAI}</span>
        </div>

        <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-[1.8] max-w-2xl mx-auto mb-2">
          {ai.introBody}
        </p>
        <p className="font-body text-[13px] text-text-muted leading-[1.7] max-w-xl mx-auto">
          {ai.introWorks}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 2 — Why AI Needs R IF C
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-16">
        <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#DC262640" bgTint="rgba(220,38,38,0.03)">
          <h4 className="font-mono text-[12px] md:text-[13px] tracking-[3px] uppercase text-rifc-red mb-6">
            {ai.whyTitle}
          </h4>

          <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-[1.8] mb-4">
            {ai.whyBody1}
          </p>

          <p className="font-body text-[15px] md:text-[16px] font-semibold text-rifc-red leading-[1.6] mb-3">
            {ai.whyHallucination}
          </p>

          {/* Color-coded formula */}
          <div className="font-mono text-[14px] md:text-[16px] leading-[1.8] mb-4 px-4 py-3 rounded-sm bg-[rgba(255,255,255,0.03)] border border-border-light">
            <span className="text-rifc-amber">F</span>
            <span className="text-text-muted"> = 9, </span>
            <span className="text-rifc-blue">I</span>
            <span className="text-text-muted"> = 3, </span>
            <span className="text-rifc-red">R</span>
            <span className="text-text-muted"> = 2</span>
            <br />
            <span className="text-text-muted">{ai.whyLooks}</span>
            <br />
            <span className="text-red-400 font-semibold">{ai.whyConverts}</span>
          </div>

          <p className="font-body text-[14px] md:text-[15px] text-text-secondary leading-[1.8] mb-3">
            {ai.whyBody2}
          </p>

          <p className="font-heading text-[16px] md:text-[18px] italic text-rifc-green/80 leading-[1.5]">
            {ai.whyResult}
          </p>
        </GradientBorderBlock>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 3 — Visual Flow
          ════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 md:gap-3 items-stretch">
          {/* Card 1 — Input Haotic */}
          <div className="p-5 rounded-sm bg-surface-card border border-red-500/30 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] tracking-[2px] uppercase text-red-400 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-[10px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                </span>
                {ai.flowInputLabel}
              </div>
              <p className="font-body text-[13px] md:text-[14px] italic text-text-muted leading-[1.6] mb-3">
                {ai.flowInputDesc}
              </p>
              <div className="font-mono text-[16px] md:text-[18px] font-bold text-red-400/70 mb-2">
                {ai.flowInputScore}
              </div>
            </div>
            <p className="font-mono text-[10px] tracking-[1px] uppercase text-red-400/50 mt-2">
              {ai.flowInputCaption}
            </p>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight size={24} className="text-text-ghost" />
          </div>
          <div className="flex md:hidden items-center justify-center py-1">
            <ChevronDown size={24} className="text-text-ghost" />
          </div>

          {/* Card 2 — Filter R IF C */}
          <div className="p-5 rounded-sm bg-surface-card border border-amber-500/40 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] tracking-[2px] uppercase text-amber-400 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </span>
                {ai.flowFilterLabel}
              </div>
              <div className="space-y-1 mb-3">
                {ai.flowFilterChecks.map((check, i) => (
                  <div key={i} className="font-mono text-[12px] md:text-[13px] text-rifc-green/80">
                    {check}
                  </div>
                ))}
              </div>
            </div>
            <p className="font-mono text-[10px] tracking-[1px] uppercase text-amber-400/50 mt-2">
              {ai.flowFilterCaption}
            </p>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight size={24} className="text-text-ghost" />
          </div>
          <div className="flex md:hidden items-center justify-center py-1">
            <ChevronDown size={24} className="text-text-ghost" />
          </div>

          {/* Card 3 — Output Clar */}
          <div className="p-5 rounded-sm bg-surface-card border border-green-500/40 flex flex-col justify-between">
            <div>
              <div className="font-mono text-[11px] tracking-[2px] uppercase text-green-400 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-[10px]">
                  <Check size={12} className="text-green-400" />
                </span>
                {ai.flowOutputLabel}
              </div>
              <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.6] mb-2">
                {ai.flowOutputDesc}
              </p>
              <div className="font-mono text-[16px] md:text-[18px] font-bold text-rifc-green mb-1">
                {ai.flowOutputScore}
              </div>
            </div>
            <p className="font-mono text-[10px] tracking-[1px] uppercase text-green-400/50 mt-2">
              {ai.flowOutputCaption}
            </p>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 5 — Category Filter Pills
          ════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {/* "All" pill */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`font-mono text-[11px] md:text-[12px] tracking-[2px] uppercase px-4 py-2 rounded-2xl border transition-all duration-200 ${
              activeCategory === null
                ? "bg-rifc-red/15 border-rifc-red/50 text-rifc-red"
                : "bg-transparent border-border-light text-text-muted hover:border-text-muted/40"
            }`}
          >
            {ai.allLabel}
          </button>

          {ai.categories.map((cat) => {
            const Icon = CAT_ICONS[cat.id] || Search;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={`font-mono text-[11px] md:text-[12px] tracking-[2px] uppercase px-4 py-2 rounded-2xl border transition-all duration-200 flex items-center gap-2 ${
                  activeCategory === cat.id
                    ? "border-opacity-50 text-opacity-100"
                    : "bg-transparent border-border-light text-text-muted hover:border-text-muted/40"
                }`}
                style={
                  activeCategory === cat.id
                    ? { backgroundColor: `${cat.color}15`, borderColor: `${cat.color}50`, color: cat.color }
                    : undefined
                }
              >
                <Icon size={13} />
                {cat.label} ({cat.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 4 — 8 Prompts
          ════════════════════════════════════════════════════ */}
      <div className="max-w-4xl mx-auto space-y-6 mb-20">
        {filteredPrompts.map((prompt) => {
          const num = getPromptNumber(prompt.id);
          const cat = ai.categories.find((c) => c.id === prompt.category);
          const catColor = cat?.color || "#DC2626";
          const isCopied = copiedId === prompt.id;
          const isExpanded = expandedExample === prompt.id;
          const fullText = prompt.promptText + "\n" + prompt.placeholder + (prompt.extraPlaceholder ? "\n" + prompt.extraPlaceholder : "");

          return (
            <div key={prompt.id} className="relative">
              {/* Watermark number */}
              <WatermarkNumber value={num} color={catColor} size="sm" />

              <GradientBorderBlock
                gradientFrom={catColor}
                gradientTo={`${catColor}40`}
                bgTint="transparent"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className="font-mono text-[20px] md:text-[24px] font-bold"
                        style={{ color: catColor }}
                      >
                        {num}
                      </span>
                      <h4 className="font-mono text-[14px] md:text-[16px] font-semibold text-text-primary tracking-[1px]">
                        {prompt.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-body text-[11px] md:text-[12px] text-text-muted">
                        {prompt.usage}
                      </span>
                      <span className="text-text-ghost">|</span>
                      <span
                        className="font-mono text-[10px] md:text-[11px] tracking-[1px] uppercase px-2 py-0.5 rounded-sm border"
                        style={{ color: catColor, borderColor: `${catColor}40` }}
                      >
                        {prompt.level}
                      </span>
                    </div>
                  </div>

                  {/* Copy button */}
                  <button
                    onClick={() => handleCopy(prompt.id, fullText)}
                    className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2 rounded-sm border transition-all duration-200 shrink-0 self-start sm:self-center"
                    style={{
                      borderColor: isCopied ? "#059669" : `${catColor}40`,
                      color: isCopied ? "#059669" : catColor,
                      backgroundColor: isCopied ? "rgba(5,150,105,0.08)" : "transparent",
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    {isCopied ? ai.copiedBtn : ai.copyBtn}
                  </button>
                </div>

                {/* Prompt text — code block */}
                <div className="p-4 rounded-sm bg-[rgba(0,0,0,0.3)] border border-border-light overflow-x-auto">
                  <pre className="font-mono text-[12px] md:text-[13px] text-text-muted leading-[1.8] whitespace-pre-wrap">
                    {prompt.promptText}
                  </pre>
                  {/* Placeholder highlighted */}
                  <div
                    className="mt-2 font-mono text-[12px] md:text-[13px] font-semibold px-2 py-1 rounded-sm inline-block"
                    style={{ color: catColor, backgroundColor: `${catColor}10`, border: `1px dashed ${catColor}40` }}
                  >
                    {prompt.placeholder}
                  </div>
                  {prompt.extraPlaceholder && (
                    <div className="mt-2">
                      {prompt.extraPlaceholder.split("\n").map((line, i) => (
                        <div
                          key={i}
                          className="font-mono text-[12px] md:text-[13px] text-text-muted px-2 py-0.5"
                        >
                          {line}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Example output (collapsible) */}
                {prompt.hasExample && prompt.exampleOutput && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedExample(isExpanded ? null : prompt.id)}
                      className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-muted hover:text-text-secondary transition-colors"
                    >
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                      />
                      {ai.exampleToggle}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 p-4 rounded-sm bg-[rgba(5,150,105,0.04)] border border-green-500/20">
                        <pre className="font-mono text-[11px] md:text-[12px] text-text-muted leading-[1.9] whitespace-pre-wrap">
                          {prompt.exampleOutput}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </GradientBorderBlock>
            </div>
          );
        })}
      </div>

      {/* PUNCT 6 — Prompts vs AI Audit — REMOVED (AI Audit feature excluded) */}

      {/* ════════════════════════════════════════════════════
          PUNCT 7 — Pro Tip
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="p-6 md:p-8 rounded-sm bg-amber-900/10 border border-amber-500/30">
          <div className="font-mono text-[12px] tracking-[3px] uppercase text-amber-400 font-bold mb-3">
            {ai.proTipLabel}
          </div>
          <h5 className="font-heading text-[18px] md:text-[22px] font-light text-text-primary mb-4">
            {ai.proTipTitle}
          </h5>
          <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8] mb-4">
            {ai.proTipBody}
          </p>
          <div className="flex items-center gap-4 font-mono text-[13px] md:text-[14px]">
            <span className="text-text-muted">Setup:</span>
            <span className="text-rifc-green font-bold">{ai.proTipSetup}</span>
            <span className="text-border-light">|</span>
            <span className="text-text-muted">Value:</span>
            <span className="text-rifc-green font-bold">{ai.proTipValue}</span>
          </div>
        </div>
      </div>

      {/* ── Transition to Chapter 11 ───────────────── */}
      <div className="mt-20 md:mt-24 text-center border-t border-border-subtle pt-12 md:pt-16">
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-2 italic">
          {ai.transitionLine1}
        </p>
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-6 italic">
          {ai.transitionLine2}
        </p>
        <a
          href={ai.transitionTarget}
          className="inline-flex items-center gap-2 font-mono text-[12px] tracking-[3px] uppercase text-rifc-red hover:text-white transition-colors duration-300 no-underline"
        >
          {ai.transitionCta}
          <ChevronRight size={16} />
        </a>
      </div>
    </section>
  );
}
