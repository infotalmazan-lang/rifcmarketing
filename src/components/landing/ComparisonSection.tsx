"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { ChevronDown, ArrowRight, Check, X } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

/* ── Lucide-style inline SVG icons ──────────────────────── */
function IconScan() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="7" y1="12" x2="17" y2="12" />
    </svg>
  );
}
function IconInput() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
function IconOutput() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default function ComparisonSection() {
  const { t } = useTranslation();
  const [activeFramework, setActiveFramework] = useState(0);
  const fw = t.comparison.frameworks[activeFramework];

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

      {/* ═══ PUNCT 1 — Intro from authority ═══════════════════ */}
      <div className="max-w-3xl mx-auto mt-10 mb-16 text-center">
        <p className="font-mono text-[13px] md:text-[14px] text-text-muted tracking-[1px] mb-6">
          {t.comparison.introAges}
        </p>
        <p className="font-heading text-[20px] md:text-[24px] font-medium text-text-primary leading-[1.5] mb-4">
          {t.comparison.introNone}
        </p>
        <div className="font-body text-[15px] md:text-[16px] text-text-muted leading-[1.8] mb-4 space-y-1">
          <p>{t.comparison.introBuild}</p>
          <p className="font-semibold text-text-primary">{t.comparison.introDiagnose}</p>
        </div>
        <div className="mt-6 font-body text-[15px] md:text-[17px] leading-[1.7]">
          <span className="text-rifc-red font-semibold">{t.comparison.introOS1}</span>
          <br className="hidden md:inline" />
          <span className="text-text-secondary"> {t.comparison.introOS2}</span>
          <br className="hidden md:inline" />
          <span className="text-text-muted"> {t.comparison.introOS3}</span>
        </div>
      </div>

      {/* ═══ PUNCT 2 — Timeline ═══════════════════════════════ */}
      <div className="mb-20">
        {/* Desktop timeline — horizontal */}
        <div className="hidden md:block relative">
          <div className="flex items-center justify-between max-w-4xl mx-auto relative">
            {/* Horizontal line */}
            <div className="absolute top-[24px] left-[40px] right-[40px] h-[2px] bg-gradient-to-r from-[rgba(232,230,227,0.15)] via-[rgba(232,230,227,0.2)] to-rifc-red" aria-hidden="true" />

            {t.comparison.timelineNodes.map((node, i) => {
              const isLast = i === t.comparison.timelineNodes.length - 1;
              return (
                <div key={node.year} className="flex flex-col items-center relative z-[1]">
                  {/* Year */}
                  <div className={`font-mono text-[11px] tracking-[2px] mb-2 ${isLast ? "text-rifc-red" : "text-text-muted"}`}>
                    {node.year}
                  </div>
                  {/* Node circle */}
                  <div
                    className={`rounded-full flex items-center justify-center transition-all duration-300 ${
                      isLast
                        ? "w-[48px] h-[48px] bg-[rgba(220,38,38,0.15)] border-2 border-rifc-red"
                        : "w-[32px] h-[32px] bg-[rgba(255,255,255,0.05)] border border-[rgba(232,230,227,0.15)]"
                    }`}
                  >
                    {isLast && (
                      <div className="w-[12px] h-[12px] rounded-full bg-rifc-red" />
                    )}
                  </div>
                  {/* Name */}
                  <div className={`font-mono text-[13px] font-semibold mt-2 tracking-[1px] ${isLast ? "text-rifc-red" : "text-text-muted"}`}>
                    {node.name}
                  </div>
                  {/* Type */}
                  <div className={`font-body text-[11px] italic mt-0.5 ${isLast ? "text-rifc-red/60" : "text-text-invisible"}`}>
                    {node.type}
                  </div>
                  {/* OS badge for R IF C */}
                  {isLast && (
                    <div className="mt-2 px-3 py-1 border border-rifc-red/40 rounded-sm bg-[rgba(220,38,38,0.08)]">
                      <span className="font-mono text-[9px] tracking-[3px] uppercase text-rifc-red">
                        {t.comparison.osTitle.split("=")[0].trim()} = OS
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline — vertical */}
        <div className="md:hidden relative pl-8">
          <div className="absolute left-[15px] top-[10px] bottom-[10px] w-[2px] bg-gradient-to-b from-[rgba(232,230,227,0.15)] to-rifc-red" aria-hidden="true" />
          {t.comparison.timelineNodes.map((node, i) => {
            const isLast = i === t.comparison.timelineNodes.length - 1;
            return (
              <div key={node.year} className="relative flex items-center gap-4 mb-6 last:mb-0">
                <div
                  className={`absolute left-[-23px] rounded-full flex items-center justify-center ${
                    isLast
                      ? "w-[32px] h-[32px] bg-[rgba(220,38,38,0.15)] border-2 border-rifc-red"
                      : "w-[20px] h-[20px] bg-[rgba(255,255,255,0.05)] border border-[rgba(232,230,227,0.15)]"
                  }`}
                >
                  {isLast && <div className="w-[8px] h-[8px] rounded-full bg-rifc-red" />}
                </div>
                <div>
                  <span className={`font-mono text-[11px] tracking-[1px] ${isLast ? "text-rifc-red" : "text-text-muted"}`}>{node.year}</span>
                  <span className={`font-mono text-[13px] font-semibold ml-2 ${isLast ? "text-rifc-red" : "text-text-muted"}`}>{node.name}</span>
                  <span className={`font-body text-[11px] italic ml-2 ${isLast ? "text-rifc-red/60" : "text-text-invisible"}`}>{node.type}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ PUNCT 3 — Detailed Comparison Tabs ═══════════════ */}
      <div className="mb-16">
        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 p-1 bg-[rgba(255,255,255,0.02)] border border-border-light rounded-2xl w-fit mb-8">
          {t.comparison.frameworks.map((f, i) => {
            const isActive = activeFramework === i;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFramework(i)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-mono text-[12px] tracking-[1px] transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive ? "rgba(220,38,38,0.12)" : "transparent",
                  color: isActive ? "#DC2626" : "rgba(232,230,227,0.4)",
                }}
              >
                <span className="hidden sm:inline">{t.comparison.tabPrefix}</span> {f.name}?
              </button>
            );
          })}
        </div>

        {/* Active framework content */}
        <div className="border rounded-sm border-border-light transition-all duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border-light bg-[rgba(220,38,38,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm flex items-center justify-center font-mono text-xl font-bold text-text-ghost bg-[rgba(255,255,255,0.04)] border border-border-light shrink-0">
              {fw.name.charAt(0)}
            </div>
            <div>
              <div className="font-mono text-[15px] font-semibold text-text-primary tracking-[1px]">
                {fw.name}
              </div>
              <div className="font-mono text-[11px] text-text-muted">{fw.year}</div>
            </div>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {/* Promise — green */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-border-light">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-green-500/70 mb-3 flex items-center gap-1.5">
                <Check size={12} className="text-green-500" />
                {t.comparison.promiseLabel}
              </div>
              <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.7]">
                {fw.promise}
              </p>
            </div>

            {/* Limit — amber */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-border-light">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-amber/70 mb-3 flex items-center gap-1.5">
                <X size={12} className="text-rifc-amber" />
                {t.comparison.limitLabel}
              </div>
              <p className="font-body text-[13px] md:text-[14px] text-text-muted leading-[1.7]">
                {fw.limit}
              </p>
            </div>

            {/* Upgrade — red */}
            <div className="p-6 bg-[rgba(220,38,38,0.04)]">
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-red/70 mb-3 flex items-center gap-1.5">
                <ArrowRight size={12} className="text-rifc-red" />
                {t.comparison.upgradeLabel}
              </div>
              <p className="font-body text-[13px] md:text-[14px] text-text-primary leading-[1.7]">
                {fw.upgrade}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PUNCT 4 — Matrix ═══════════════════════════════ */}
      <div className="mb-16">
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-muted p-3 border-b border-border-light" />
                {t.comparison.matrixHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="text-center font-mono text-[10px] tracking-[1px] uppercase text-text-muted p-3 border-b border-border-light"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.comparison.matrixRows.map((row) => {
                const isRIFC = row.name === "R IF C";
                return (
                  <tr
                    key={row.name}
                    className={isRIFC ? "bg-[rgba(220,38,38,0.08)]" : ""}
                  >
                    <td className={`font-mono text-[13px] p-3 border-b border-border-light ${isRIFC ? "text-rifc-red font-bold" : "text-text-muted"}`}>
                      {row.name}
                    </td>
                    {row.cells.map((cell, ci) => (
                      <td
                        key={ci}
                        className="text-center p-3 border-b border-border-light"
                      >
                        {cell ? (
                          <Check size={16} className={`inline-block ${isRIFC ? "text-rifc-red" : "text-green-500"}`} />
                        ) : (
                          <X size={16} className="inline-block text-text-invisible" />
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {t.comparison.matrixRows.map((row) => {
            const isRIFC = row.name === "R IF C";
            return (
              <div
                key={row.name}
                className={`border rounded-sm p-4 ${isRIFC ? "border-rifc-red/30 bg-[rgba(220,38,38,0.06)]" : "border-border-light bg-surface-card"}`}
              >
                <div className={`font-mono text-[14px] font-semibold mb-3 ${isRIFC ? "text-rifc-red" : "text-text-muted"}`}>
                  {row.name}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {row.cells.map((cell, ci) => (
                    <div key={ci} className="flex items-center gap-2">
                      {cell ? (
                        <Check size={12} className={isRIFC ? "text-rifc-red" : "text-green-500"} />
                      ) : (
                        <X size={12} className="text-text-invisible" />
                      )}
                      <span className="font-body text-[11px] text-text-muted">{t.comparison.matrixHeaders[ci]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Multiplier note */}
        <div className="mt-6 px-4 py-3 border-l-2 border-rifc-red bg-[rgba(220,38,38,0.04)] rounded-r-sm">
          <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.7]">
            {t.comparison.matrixMultiplierNote1}
          </p>
          <p className="font-mono text-[12px] tracking-[1px] text-rifc-red/80 mt-2 font-semibold">
            {t.comparison.matrixMultiplierNote2}
          </p>
        </div>
      </div>

      {/* ═══ PUNCT 7 — Uniqueness Statement ═══════════════════ */}
      <div className="mb-16 max-w-3xl mx-auto">
        <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#D97706" bgTint="rgba(220,38,38,0.04)">
          <h3 className="font-heading text-[20px] md:text-[24px] font-light text-text-primary mb-4">
            {t.comparison.uniqueTitle}
          </h3>
          <p className="font-body text-[13px] md:text-[14px] text-text-muted leading-[1.8] mb-5">
            {t.comparison.uniqueBody}
          </p>

          {/* Formula comparison — visual bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {/* Low result */}
            <div className="p-4 rounded-sm bg-[rgba(220,38,38,0.08)] border border-red-500/20">
              <div className="font-mono text-[16px] md:text-[20px] font-bold text-red-400 mb-2">
                {t.comparison.uniqueFormula1}
              </div>
              <div className="h-[8px] rounded-full bg-[rgba(220,38,38,0.15)] overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "10%" }} />
              </div>
            </div>

            {/* High result */}
            <div className="p-4 rounded-sm bg-[rgba(5,150,105,0.08)] border border-green-500/20">
              <div className="font-mono text-[16px] md:text-[20px] font-bold text-green-400 mb-2">
                {t.comparison.uniqueFormula2}
              </div>
              <div className="h-[8px] rounded-full bg-[rgba(5,150,105,0.15)] overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
              </div>
            </div>
          </div>

          <p className="font-body text-[14px] md:text-[15px] font-semibold text-rifc-green text-center">
            {t.comparison.uniqueConclusion1}
          </p>
          <p className="font-mono text-[12px] tracking-[1px] text-text-muted text-center mt-2">
            {t.comparison.uniqueConclusion2}
          </p>
        </GradientBorderBlock>
      </div>

      {/* ═══ PUNCT 5 — OS Visualization ═══════════════════════ */}
      <div className="mb-16 max-w-3xl mx-auto">
        <div className="border border-rifc-red/20 rounded-sm overflow-hidden">
          {/* OS Header */}
          <div className="px-6 py-5 bg-[rgba(220,38,38,0.06)] border-b border-rifc-red/20">
            <div className="font-mono text-[14px] md:text-[16px] font-bold text-rifc-red tracking-[2px]">
              {t.comparison.osTitle}
            </div>
            <div className="font-body text-[14px] text-text-muted mt-1">
              {t.comparison.osSub}
            </div>
          </div>

          {/* Flow: INPUT → SCAN → OUTPUT */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-4 items-center">
              {/* INPUT */}
              <div className="p-4 rounded-sm border border-border-light bg-[rgba(255,255,255,0.02)] text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IconInput />
                  <span className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted">
                    {t.comparison.osInputLabel}
                  </span>
                </div>
                <p className="font-body text-[12px] text-text-muted leading-[1.6]">
                  {t.comparison.osInputDesc}
                </p>
                {/* Framework pills */}
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {["AIDA", "StoryBrand", "RACE", "4P"].map((fw) => (
                    <span key={fw} className="font-mono text-[9px] tracking-[1px] px-2 py-1 rounded-full bg-[rgba(255,255,255,0.04)] text-text-muted border border-border-light">
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-rifc-red/40">
                <ArrowRight size={20} />
              </div>
              <div className="md:hidden flex justify-center text-rifc-red/40">
                <ChevronDown size={20} />
              </div>

              {/* SCAN */}
              <div className="p-4 rounded-sm border-2 border-rifc-red/30 bg-[rgba(220,38,38,0.06)] text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IconScan />
                  <span className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-red">
                    {t.comparison.osScanLabel}
                  </span>
                </div>
                <p className="font-body text-[12px] text-text-secondary leading-[1.6]">
                  {t.comparison.osScanDesc}
                </p>
                <div className="font-mono text-[13px] text-rifc-red/80 mt-2">
                  C = <span className="text-rifc-red">R</span> + (<span className="text-rifc-blue">I</span> &times; <span className="text-rifc-amber">F</span>)
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex items-center justify-center text-rifc-red/40">
                <ArrowRight size={20} />
              </div>
              <div className="md:hidden flex justify-center text-rifc-red/40">
                <ChevronDown size={20} />
              </div>

              {/* OUTPUT */}
              <div className="p-4 rounded-sm border border-rifc-green/30 bg-[rgba(5,150,105,0.04)] text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <IconOutput />
                  <span className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-green">
                    {t.comparison.osOutputLabel}
                  </span>
                </div>
                <p className="font-body text-[12px] text-text-secondary leading-[1.6]">
                  {t.comparison.osOutputDesc}
                </p>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-8 text-center">
              <p className="font-heading text-[18px] md:text-[20px] font-semibold text-text-primary leading-[1.4]">
                {t.comparison.osQuote}
              </p>
              <p className="font-body text-[13px] text-red-400/80 mt-3">
                {t.comparison.osWarning}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ PUNCT 6 — StoryBrand + R IF C Example ════════════ */}
      <div className="mb-16 max-w-3xl mx-auto">
        <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#059669" bgTint="rgba(255,255,255,0.02)">
          <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-6">
            {t.comparison.exampleTitle}
          </div>

          {/* Step 1 */}
          <div className="mb-5">
            <div className="font-mono text-[13px] font-semibold text-text-primary mb-1">
              {t.comparison.exStep1}
            </div>
            <div className="font-body text-[12px] text-text-muted italic">
              ({t.comparison.exStep1Desc})
            </div>
          </div>

          {/* Step 2 — Scores */}
          <div className="mb-5">
            <div className="font-mono text-[13px] font-semibold text-text-primary mb-2">
              {t.comparison.exStep2}
            </div>
            <div className="space-y-1 pl-4 border-l-2 border-border-light">
              <div className="font-mono text-[12px]">
                <span className="text-rifc-red">{t.comparison.exStep2R}</span>
              </div>
              <div className="font-mono text-[12px]">
                <span className="text-rifc-blue">{t.comparison.exStep2I}</span>
              </div>
              <div className="font-mono text-[12px]">
                <span className="text-rifc-amber">{t.comparison.exStep2F}</span>
              </div>
            </div>
          </div>

          {/* Step 3 — Diagnosis */}
          <div className="mb-5">
            <div className="font-mono text-[13px] font-semibold text-text-primary mb-2">
              {t.comparison.exStep3}
            </div>
            <div className="p-3 rounded-sm bg-[rgba(220,38,38,0.06)] border border-red-500/20">
              <div className="font-mono text-[16px] font-bold text-red-400">
                {t.comparison.exStep3Eq}
              </div>
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-red-400/60 mt-1">
                {t.comparison.exStep3Zone}
              </div>
              <p className="font-body text-[12px] text-text-muted mt-2 leading-[1.6]">
                {t.comparison.exStep3Problem}
              </p>
            </div>
          </div>

          {/* Step 4 — Fix */}
          <div className="mb-5">
            <div className="font-mono text-[13px] font-semibold text-text-primary mb-1">
              {t.comparison.exStep4}
            </div>
            <div className="font-body text-[12px] text-text-muted mb-2">
              {t.comparison.exStep4Fix}
            </div>
            <div className="p-3 rounded-sm bg-[rgba(5,150,105,0.06)] border border-green-500/20">
              <div className="font-mono text-[16px] font-bold text-green-400">
                {t.comparison.exStep4Eq}
              </div>
              <div className="font-mono text-[10px] tracking-[2px] uppercase text-green-400/60 mt-1">
                {t.comparison.exStep4Zone}
              </div>
            </div>
            <div className="mt-3 text-center">
              <span className="font-mono text-[15px] md:text-[18px] font-bold text-rifc-green">
                {t.comparison.exStep4Lift}
              </span>
            </div>
          </div>

          {/* Without vs With */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-4 border-t border-border-light">
            <div className="p-3 rounded-sm bg-[rgba(220,38,38,0.04)] border border-red-500/10">
              <p className="font-body text-[12px] md:text-[13px] text-red-400/80 leading-[1.6]">
                {t.comparison.exWithout}
              </p>
            </div>
            <div className="p-3 rounded-sm bg-[rgba(5,150,105,0.04)] border border-green-500/10">
              <p className="font-body text-[12px] md:text-[13px] text-green-400/80 leading-[1.6]">
                {t.comparison.exWith}
              </p>
            </div>
          </div>
        </GradientBorderBlock>
      </div>

      {/* Transition CTA to Chapter 08 */}
      <div className="mt-20 md:mt-24 text-center border-t border-border-subtle pt-12 md:pt-16">
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-2 italic">
          {t.comparison.transitionLine1}
        </p>
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-6 italic">
          {t.comparison.transitionLine2}
        </p>
        <a
          href={t.comparison.transitionTarget}
          className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
          {t.comparison.transitionCta}
        </a>
      </div>
    </section>
  );
}
