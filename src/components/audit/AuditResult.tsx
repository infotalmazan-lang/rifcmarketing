"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import type { AuditResult } from "@/types";
import {
  Copy,
  Check,
  FileDown,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Bot,
  ClipboardList,
  Lightbulb,
  Youtube,
  ImageIcon,
  FileText,
} from "lucide-react";
import {
  WatermarkNumber,
  StampBadge,
  HeroScore,
  ScoreTrio,
  FormulaDisplay,
  GradientBorderBlock,
  VARIABLE_COLORS,
  getScoreColor,
  getScoreZone,
} from "@/components/ui/V2Elements";

interface Props {
  result: AuditResult;
  analyzedInput: string;
  inputType: "text" | "url" | "youtube" | "image" | "pdf";
  imagePreview?: string | null;
  pdfPageCount?: number;
  onReset: () => void;
}

type ResultTab = "audit" | "recommendations";

export default function AuditResultDisplay({
  result,
  analyzedInput,
  inputType,
  imagePreview,
  pdfPageCount,
  onReset,
}: Props) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ResultTab>("audit");
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const gatePass = result.r >= 4;
  const scoreColor = gatePass ? getScoreColor(result.c) : "#DC2626";
  const zone = gatePass ? getScoreZone(result.c) : "Critical";

  // Find weakest and strongest
  const vars = [
    { label: "R", value: result.r },
    { label: "I", value: result.i },
    { label: "F", value: result.f },
  ];
  const weakest = vars.reduce((a, b) => (a.value <= b.value ? a : b)).label;
  const strongest = vars.reduce((a, b) => (a.value >= b.value ? a : b)).label;
  const weakColor = VARIABLE_COLORS[weakest as keyof typeof VARIABLE_COLORS];

  // Get range info from data
  const range = t.data.scoreRanges.find(
    (r) => result.c >= r.min && result.c <= r.max
  );

  const handleCopy = useCallback(() => {
    const text = [
      `R IF C Audit Result`,
      `R: ${result.r}/10 — ${result.rJustification}`,
      `I: ${result.i}/10 — ${result.iJustification}`,
      `F: ${result.f}/10 — ${result.fJustification}`,
      `C = ${result.r} + (${result.i} × ${result.f}) = ${result.c}/110`,
      `Level: ${range?.status || result.clarityLevel}`,
      ``,
      `Diagnosis: ${result.diagnosis}`,
      ``,
      `Recommendations:`,
      ...result.recommendations.map(
        (r, i) => `${i + 1}. [${r.variable}] ${r.action} — ${r.impact}`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, range]);

  const handlePrintPdf = useCallback(() => {
    window.print();
  }, []);

  // Analyzed input preview component (reused in both tabs) — 5 variants
  const InputPreview = () => {
    const badgeClass = "ml-2 font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 rounded-sm";

    return (
      <GradientBorderBlock
        gradientFrom="#6B7280"
        gradientTo="#374151"
        bgTint="transparent"
        headerLabel={t.audit.inputPreview}
        headerColor="#6B7280"
      >
        {inputType === "text" && (
          <p className="font-body text-[13px] leading-[1.7] text-text-muted max-h-[150px] overflow-y-auto whitespace-pre-wrap">
            {analyzedInput.slice(0, 500) +
              (analyzedInput.length > 500 ? "..." : "")}
          </p>
        )}

        {inputType === "url" && (
          <div className="flex items-center gap-2">
            <span className={`${badgeClass} text-rifc-blue bg-[rgba(37,99,235,0.1)]`}>URL</span>
            <p className="font-body text-[13px] leading-[1.7] text-text-muted break-all">
              {analyzedInput}
            </p>
          </div>
        )}

        {inputType === "youtube" && (
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-sm bg-[rgba(220,38,38,0.1)] flex items-center justify-center">
              <Youtube size={20} className="text-rifc-red" />
            </div>
            <p className="font-body text-[13px] leading-[1.7] text-text-muted break-all">
              {analyzedInput}
            </p>
          </div>
        )}

        {inputType === "image" && (
          <div className="flex items-center gap-4">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Analyzed"
                className="shrink-0 w-24 h-24 object-cover rounded-sm border border-border-light"
              />
            ) : (
              <div className="shrink-0 w-24 h-24 rounded-sm bg-[rgba(217,119,6,0.1)] flex items-center justify-center border border-border-light">
                <ImageIcon size={28} className="text-rifc-amber" />
              </div>
            )}
            <p className="font-body text-[13px] text-text-secondary">
              {analyzedInput}
            </p>
          </div>
        )}

        {inputType === "pdf" && (
          <div className="flex items-center gap-4">
            <div className="shrink-0 w-12 h-12 rounded-sm bg-[rgba(220,38,38,0.1)] flex items-center justify-center">
              <FileText size={24} className="text-rifc-red" />
            </div>
            <div>
              <p className="font-body text-[13px] text-text-secondary">
                {analyzedInput}
              </p>
              {pdfPageCount !== undefined && pdfPageCount > 0 && (
                <p className="font-mono text-[11px] text-text-muted mt-1">
                  {pdfPageCount} {t.audit.previewPages}
                </p>
              )}
            </div>
          </div>
        )}
      </GradientBorderBlock>
    );
  };

  return (
    <div
      ref={resultRef}
      className={`space-y-8 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* V2 Tab switcher — pill style */}
      <div className="flex gap-2 p-1 bg-[rgba(255,255,255,0.02)] border border-border-light rounded-2xl w-fit print:hidden">
        {[
          { key: "audit" as const, icon: ClipboardList, label: t.audit.tabAudit },
          { key: "recommendations" as const, icon: Lightbulb, label: t.audit.tabRecommendations },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-5 py-2.5 rounded-2xl transition-all duration-300 ${
              activeTab === key
                ? "bg-rifc-red text-white"
                : "text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)]"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ===== TAB: AUDIT ===== */}
      <div className={`space-y-6 ${activeTab === "audit" ? "block" : "hidden print:!block"}`}>
        {/* Header */}
        <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
          {t.audit.resultTitle}
        </div>

        {/* V2 Score display — HeroScore + WatermarkNumber + StampBadge */}
        <div className="border border-border-light rounded-sm p-6 md:p-8 bg-surface-card relative overflow-hidden">
          {/* Watermark */}
          <WatermarkNumber
            value={result.c}
            color={scoreColor}
            size="lg"
            className="-top-[30px] -right-[20px]"
          />

          {/* Stamp */}
          <div className="absolute top-4 right-4 z-[2]">
            <StampBadge
              text={gatePass ? range?.status || result.clarityLevel : t.calculator.criticalFailure}
              color={scoreColor}
            />
          </div>

          <div className="relative z-[1]">
            {/* Score label */}
            <div className="font-mono text-[11px] text-text-muted tracking-[3px] text-center mb-4">
              {t.calculator.yourScore}
            </div>

            {/* Hero Score */}
            <HeroScore
              score={result.c}
              color={scoreColor}
              zoneLabel={gatePass ? range?.label || zone : t.calculator.relevanceGateTriggered}
              subLabel={!gatePass ? t.calculator.relevanceGateTriggered : undefined}
              size="lg"
            />

            {/* Score Trio */}
            <ScoreTrio
              r={result.r}
              i={result.i}
              f={result.f}
              labels={{
                r: t.calculator.rLabel,
                i: t.calculator.iLabel,
                f: t.calculator.fLabel,
              }}
              size="md"
              className="mt-6"
            />

            {/* Formula */}
            <FormulaDisplay
              r={result.r}
              i={result.i}
              f={result.f}
              c={result.c}
              cColor={scoreColor}
              className="mt-4"
            />

            {/* Score progress bar */}
            <div className="mt-6">
              <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((result.c / 110) * 100, 100)}%`,
                    background: scoreColor,
                  }}
                />
              </div>
              <div className="flex justify-between font-mono text-[9px] text-text-ghost mt-1">
                <span>0</span>
                <span>20</span>
                <span>50</span>
                <span>80</span>
                <span>110</span>
              </div>
            </div>
          </div>
        </div>

        {/* V2 Diagnosis — GradientBorderBlock */}
        <GradientBorderBlock
          gradientFrom={gatePass ? weakColor : "#DC2626"}
          gradientTo={gatePass ? "#D97706" : "#D97706"}
          bgTint={gatePass ? "transparent" : "rgba(220,38,38,0.02)"}
          headerLabel={t.calculator.diagnosis}
          headerColor={gatePass ? weakColor : "#DC2626"}
        >
          <div className="flex items-start gap-2">
            {!gatePass && <AlertTriangle size={16} className="text-rifc-red shrink-0 mt-0.5" />}
            <p className="font-body text-sm leading-[1.7] text-text-secondary">
              {result.diagnosis}
            </p>
          </div>
        </GradientBorderBlock>

        {/* V2 Variable breakdown — large numbers + GradientBorderBlock with justifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "R",
              value: result.r,
              color: VARIABLE_COLORS.R,
              justification: result.rJustification,
            },
            {
              label: "I",
              value: result.i,
              color: VARIABLE_COLORS.I,
              justification: result.iJustification,
            },
            {
              label: "F",
              value: result.f,
              color: VARIABLE_COLORS.F,
              justification: result.fJustification,
            },
          ].map((v) => (
            <GradientBorderBlock
              key={v.label}
              gradientFrom={v.color}
              gradientTo={v.color}
              bgTint="transparent"
            >
              <div className="text-center mb-3">
                <div className="font-mono text-[11px] tracking-[2px] mb-1" style={{ color: v.color }}>
                  {v.label}
                </div>
                <div className="font-mono text-[36px] md:text-[44px] font-light leading-none" style={{ color: v.color }}>
                  {v.value}
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full h-0.5 bg-[rgba(255,255,255,0.06)] rounded-sm mb-3">
                <div
                  className="h-full rounded-sm transition-all duration-600 ease-out"
                  style={{
                    width: `${(v.value / 10) * 100}%`,
                    backgroundColor: v.color,
                  }}
                />
              </div>

              <p className="font-body text-[12px] leading-[1.7] text-text-muted mb-2">
                {v.justification}
              </p>

              <div className="flex justify-center">
                {v.label === weakest && (
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-red">
                    <TrendingDown size={10} /> {t.calculator.weakest}
                  </span>
                )}
                {v.label === strongest && v.label !== weakest && (
                  <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-green">
                    <TrendingUp size={10} /> {t.calculator.strongest}
                  </span>
                )}
              </div>
            </GradientBorderBlock>
          ))}
        </div>

        {/* Analyzed input preview */}
        <InputPreview />
      </div>

      {/* ===== TAB: RECOMMENDATIONS ===== */}
      <div className={`space-y-6 ${activeTab === "recommendations" ? "block" : "hidden print:!block"}`}>
        {/* Score summary compact — with FormulaDisplay + StampBadge */}
        <div className="border border-border-light rounded-sm p-5 bg-surface-card relative overflow-hidden">
          <WatermarkNumber
            value={result.c}
            color={scoreColor}
            size="sm"
            className="-top-[10px] -right-[10px]"
          />
          <div className="flex items-center justify-between flex-wrap gap-4 relative z-[1]">
            <FormulaDisplay
              r={result.r}
              i={result.i}
              f={result.f}
              c={result.c}
              cColor={scoreColor}
            />
            <StampBadge
              text={gatePass ? range?.status || result.clarityLevel : t.calculator.criticalFailure}
              color={scoreColor}
            />
          </div>
        </div>

        {/* V2 Recommendations — GradientBorderBlock per recommendation */}
        {result.recommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
              {t.audit.recommendationsTitle}
            </h3>
            <div className="space-y-3">
              {result.recommendations.map((rec, idx) => {
                const varColor = VARIABLE_COLORS[rec.variable as keyof typeof VARIABLE_COLORS] || "#6B7280";
                return (
                  <GradientBorderBlock
                    key={idx}
                    gradientFrom={varColor}
                    gradientTo={varColor}
                    bgTint="transparent"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className="font-mono text-[11px] tracking-[2px] font-semibold px-2 py-0.5 rounded-sm"
                        style={{
                          color: varColor,
                          background: `${varColor}10`,
                        }}
                      >
                        {rec.variable}
                      </span>
                      <span className="font-body text-[14px] text-text-primary">
                        {rec.action}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-[38px]">
                      <ArrowRight size={12} className="text-text-ghost" />
                      <span className="font-body text-[12px] text-text-muted italic">
                        {rec.impact}
                      </span>
                    </div>
                  </GradientBorderBlock>
                );
              })}
            </div>
          </div>
        )}

        {/* Analyzed input preview */}
        <InputPreview />
      </div>

      {/* ===== FOOTER: Common to both tabs ===== */}

      {/* AI Disclaimer */}
      <div className="flex items-start gap-3 border border-border-subtle rounded-sm p-4 bg-[rgba(255,255,255,0.01)]">
        <Bot size={16} className="text-text-ghost shrink-0 mt-0.5" />
        <p className="font-body text-[11px] leading-[1.7] text-text-muted">
          {t.audit.aiDisclaimer}
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-5 py-3 border border-border-light rounded-sm text-text-secondary hover:text-text-primary hover:border-border-medium transition-all duration-300"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? t.audit.copied : t.audit.copyResult}
        </button>

        <button
          onClick={handlePrintPdf}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-5 py-3 border border-border-light rounded-sm text-text-secondary hover:text-text-primary hover:border-border-medium transition-all duration-300"
        >
          <FileDown size={14} />
          {t.audit.savePdf}
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-5 py-3 bg-rifc-red text-white rounded-sm hover:bg-rifc-red/90 transition-all duration-300"
        >
          <RotateCcw size={14} />
          {t.audit.reAnalyze}
        </button>
      </div>
    </div>
  );
}
