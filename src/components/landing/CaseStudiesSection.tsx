"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import {
  ShoppingBag,
  Monitor,
  Croissant,
  GraduationCap,
  UtensilsCrossed,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Wrench,
  Mail,
  Layout,
  Megaphone,
} from "lucide-react";
import type { ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  WatermarkNumber,
  StampBadge,
  HeroScore,
  ScoreTrio,
  FormulaDisplay,
  GradientBorderBlock,
  BeforeAfterToggle,
  getScoreColor,
  getScoreZone,
  VARIABLE_COLORS,
} from "@/components/ui/V2Elements";

/* ─── Icon maps ───────────────────────────────────────── */

const ICON_MAP: Record<string, ReactNode> = {
  "shopping-bag": <ShoppingBag size={24} />,
  monitor: <Monitor size={24} />,
  croissant: <Croissant size={24} />,
  "graduation-cap": <GraduationCap size={24} />,
  "utensils-crossed": <UtensilsCrossed size={24} />,
};

const SCREEN_ICON: Record<string, ReactNode> = {
  email: <Mail size={14} />,
  landing_page: <Layout size={14} />,
  social_ad: <Megaphone size={14} />,
};

const CLARITY_COLORS: Record<string, string> = {
  critical: "#DC2626",
  noise: "#D97706",
  medium: "#2563EB",
  supreme: "#059669",
};

/* ─── ScreenMockup (preserved from V1) ────────────────── */

function ScreenMockup({
  type,
  data,
  labels,
}: {
  type: string;
  data: { headline: string; body: string; cta: string; subject?: string };
  labels: {
    headline: string;
    body: string;
    cta: string;
    subject: string;
    screenEmail: string;
    screenLanding: string;
    screenSocial: string;
  };
}) {
  const screenLabelMap: Record<string, string> = {
    email: labels.screenEmail,
    landing_page: labels.screenLanding,
    social_ad: labels.screenSocial,
  };

  return (
    <div className="bg-[rgba(0,0,0,0.3)] border border-border-medium rounded-sm overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle bg-[rgba(0,0,0,0.2)]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.1)]" />
        </div>
        <div className="flex items-center gap-1.5 ml-2 text-text-ghost">
          {SCREEN_ICON[type]}
          <span className="font-mono text-[10px] tracking-[1px] uppercase">
            {screenLabelMap[type] || type}
          </span>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {type === "email" && data.subject && (
          <div>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-ghost block mb-1">
              {labels.subject}
            </span>
            <p className="font-body text-[13px] text-text-secondary leading-[1.5] italic">
              {data.subject}
            </p>
          </div>
        )}
        <div>
          <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-ghost block mb-1">
            {labels.headline}
          </span>
          <p className="font-heading text-[18px] font-semibold text-text-primary leading-[1.3]">
            {data.headline}
          </p>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-ghost block mb-1">
            {labels.body}
          </span>
          <p className="font-body text-[13px] text-text-muted leading-[1.7]">
            {data.body}
          </p>
        </div>
        <div>
          <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-ghost block mb-1">
            {labels.cta}
          </span>
          <span className="inline-block font-mono text-[11px] tracking-[1px] uppercase px-4 py-2 bg-rifc-red/20 text-rifc-red border border-rifc-red/30 rounded-sm">
            {data.cta}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Unified Case Study Card ─────────────────────────── */

function UnifiedCaseCard({
  cs,
  state,
  onToggle,
  labels,
  locale,
}: {
  cs: {
    brand: string;
    industry: string;
    icon: string;
    archetype: string;
    clarityLevel: "critical" | "noise" | "medium" | "supreme";
    before: {
      r: number;
      i: number;
      f: number;
      c: number;
      rJustification: string;
      iJustification: string;
      fJustification: string;
    };
    after: {
      r: number;
      i: number;
      f: number;
      c: number;
      rJustification: string;
      iJustification: string;
      fJustification: string;
    };
    screen: {
      type: "email" | "landing_page" | "social_ad";
      before: { headline: string; body: string; cta: string; subject?: string };
      after: { headline: string; body: string; cta: string; subject?: string };
    };
    diagnosticText: string;
    fixText: string;
    resultText: string;
    lessonText: string;
  };
  state: "before" | "after";
  onToggle: () => void;
  labels: {
    before: string;
    after: string;
    diagnostic: string;
    fix: string;
    result: string;
    lesson: string;
    clarityScore: string;
    screenPreview: string;
    headline: string;
    body: string;
    cta: string;
    subject: string;
    screenEmail: string;
    screenLanding: string;
    screenSocial: string;
    relevanceGateFail: string;
    clarity: string;
    relevance: string;
    interest: string;
    form: string;
    afterOptimization: string;
  };
  locale: string;
}) {
  const scores = state === "before" ? cs.before : cs.after;
  const screenData = state === "before" ? cs.screen.before : cs.screen.after;
  const c = scores.c;
  const cColor = getScoreColor(c);
  const zone = getScoreZone(c);
  const clarityColor = CLARITY_COLORS[cs.clarityLevel];

  const CLARITY_LABELS: Record<string, { ro: string; en: string }> = {
    critical: { ro: "Esec Critic", en: "Critical Failure" },
    noise: { ro: "Zgomot", en: "Noise" },
    medium: { ro: "Mediu", en: "Medium" },
    supreme: { ro: "Suprem", en: "Supreme" },
  };

  const displayLevel =
    state === "before"
      ? cs.clarityLevel
      : c <= 20
        ? "critical"
        : c <= 50
          ? "noise"
          : c <= 80
            ? "medium"
            : "supreme";

  return (
    <div className="bg-surface-card border border-border-light rounded-sm overflow-hidden relative transition-all duration-400 hover:border-[rgba(255,255,255,0.12)]">
      {/* Top gradient bar */}
      <div
        className="h-[3px]"
        style={{
          background:
            state === "after"
              ? "linear-gradient(90deg, #059669, #2563EB, #059669)"
              : `linear-gradient(90deg, ${clarityColor}, ${clarityColor}80)`,
        }}
      />

      {/* Watermark */}
      <WatermarkNumber
        value={c}
        color={cColor}
        size="lg"
        className="-top-[30px] -right-[20px]"
      />

      <div className="p-6 md:p-10 relative z-[1]">
        {/* Card header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className="w-12 h-12 rounded-sm flex items-center justify-center shrink-0"
              style={{
                backgroundColor: `${clarityColor}15`,
                color: clarityColor,
              }}
            >
              {ICON_MAP[cs.icon] || <ShoppingBag size={24} />}
            </div>
            <div className="min-w-0">
              <h3 className="font-heading text-[20px] md:text-[24px] font-semibold text-text-primary leading-[1.2] truncate">
                {cs.brand}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="font-mono text-[10px] tracking-[1px] uppercase text-text-faint">
                  {cs.industry}
                </span>
                <span className="text-text-ghost">|</span>
                <span
                  className="font-mono text-[10px] tracking-[1px] uppercase"
                  style={{ color: clarityColor }}
                >
                  {cs.archetype}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stamp + Before/After toggle — same row, no overlap */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <StampBadge
            text={
              state === "before"
                ? (CLARITY_LABELS[cs.clarityLevel]?.[locale as "ro" | "en"] || cs.archetype)
                : "FIXED"
            }
            color={state === "before" ? "#DC2626" : "#059669"}
          />
          <BeforeAfterToggle
            view={state}
            onToggle={onToggle as unknown as (v: "before" | "after") => void}
            beforeLabel={labels.before}
            afterLabel={labels.after}
            beforeScore={cs.before.c}
            afterScore={cs.after.c}
            className="shrink-0"
          />
        </div>

        {/* Hero Score + ScoreTrio + Formula — centered */}
        <div className="text-center mb-8">
          <HeroScore
            score={c}
            color={cColor}
            zoneLabel={`${labels.clarity} · ${zone.toUpperCase()}`}
            subLabel={scores.r < 3 ? labels.relevanceGateFail : undefined}
            size="md"
          />

          <ScoreTrio
            r={scores.r}
            i={scores.i}
            f={scores.f}
            labels={{
              r: labels.relevance,
              i: labels.interest,
              f: labels.form,
            }}
            previousValues={
              state === "after" ? cs.before : undefined
            }
            size="md"
            className="mt-6"
          />

          <FormulaDisplay
            r={scores.r}
            i={scores.i}
            f={scores.f}
            c={c}
            cColor={cColor}
            className="mt-4"
          />
        </div>

        {/* Main content: 2 columns — Scores with justifications + Screen mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Score justifications using GradientBorderBlock */}
          <div className="space-y-3">
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-faint mb-2">
              R IF C {labels.clarityScore}
            </div>

            <GradientBorderBlock
              gradientFrom={VARIABLE_COLORS.R}
              gradientTo="#D97706"
              bgTint="rgba(220,38,38,0.02)"
              headerLabel={`R = ${scores.r}`}
              headerColor={VARIABLE_COLORS.R}
            >
              <p className="font-body text-[13px] leading-[1.7] text-text-muted">
                {scores.rJustification}
              </p>
            </GradientBorderBlock>

            <GradientBorderBlock
              gradientFrom={VARIABLE_COLORS.I}
              gradientTo="#D97706"
              bgTint="rgba(37,99,235,0.02)"
              headerLabel={`I = ${scores.i}`}
              headerColor={VARIABLE_COLORS.I}
            >
              <p className="font-body text-[13px] leading-[1.7] text-text-muted">
                {scores.iJustification}
              </p>
            </GradientBorderBlock>

            <GradientBorderBlock
              gradientFrom={VARIABLE_COLORS.F}
              gradientTo="#059669"
              bgTint="rgba(217,119,6,0.02)"
              headerLabel={`F = ${scores.f}`}
              headerColor={VARIABLE_COLORS.F}
            >
              <p className="font-body text-[13px] leading-[1.7] text-text-muted">
                {scores.fJustification}
              </p>
            </GradientBorderBlock>
          </div>

          {/* Right: Screen mockup */}
          <div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-faint mb-3">
              {labels.screenPreview} —{" "}
              {state === "before" ? labels.before : labels.after}
            </div>
            <ScreenMockup
              type={cs.screen.type}
              data={screenData}
              labels={labels}
            />
          </div>
        </div>

        {/* Bottom: 4-column Diagnostic/Fix/Result/Lesson using GradientBorderBlocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-6 border-t border-border-subtle">
          <GradientBorderBlock
            gradientFrom="#DC2626"
            gradientTo="#D97706"
            bgTint="rgba(220,38,38,0.02)"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-rifc-red shrink-0" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-red">
                {labels.diagnostic}
              </span>
            </div>
            <p className="font-body text-[13px] leading-[1.7] text-text-muted">
              {cs.diagnosticText}
            </p>
          </GradientBorderBlock>

          <GradientBorderBlock
            gradientFrom="#2563EB"
            gradientTo="#059669"
            bgTint="rgba(37,99,235,0.02)"
          >
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={14} className="text-rifc-blue shrink-0" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-blue">
                {labels.fix}
              </span>
            </div>
            <p className="font-body text-[13px] leading-[1.7] text-text-muted">
              {cs.fixText}
            </p>
          </GradientBorderBlock>

          <GradientBorderBlock
            gradientFrom="#059669"
            gradientTo="#2563EB"
            bgTint="rgba(5,150,105,0.02)"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-rifc-green shrink-0" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-green">
                {labels.result}
              </span>
            </div>
            <p className="font-body text-[13px] leading-[1.7] text-text-muted">
              {cs.resultText}
            </p>
          </GradientBorderBlock>

          <GradientBorderBlock
            gradientFrom="#D97706"
            gradientTo="#DC2626"
            bgTint="rgba(217,119,6,0.02)"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} className="text-rifc-amber shrink-0" />
              <span className="font-mono text-[10px] tracking-[2px] uppercase text-rifc-amber">
                {labels.lesson}
              </span>
            </div>
            <p className="font-body text-[13px] leading-[1.7] text-text-secondary font-medium italic">
              {cs.lessonText}
            </p>
          </GradientBorderBlock>
        </div>
      </div>
    </div>
  );
}

/* ─── Tab Card (clickable selector) ──────────────────── */

function CaseTabCard({
  cs,
  isActive,
  onClick,
  labels,
}: {
  cs: {
    brand: string;
    industry: string;
    icon: string;
    clarityLevel: "critical" | "noise" | "medium" | "supreme";
    before: { c: number };
    after: { c: number };
  };
  isActive: boolean;
  onClick: () => void;
  labels: { before: string; after: string };
}) {
  const clarityColor = CLARITY_COLORS[cs.clarityLevel];
  const afterColor = getScoreColor(cs.after.c);

  return (
    <button
      onClick={onClick}
      className={`relative text-left w-full rounded-sm border transition-all duration-300 overflow-hidden cursor-pointer group ${
        isActive
          ? "border-[rgba(255,255,255,0.15)] bg-surface-card"
          : "border-border-light bg-[rgba(255,255,255,0.01)] hover:border-[rgba(255,255,255,0.08)] hover:bg-surface-card"
      }`}
    >
      {/* Top gradient bar */}
      <div
        className="h-[3px] transition-all duration-300"
        style={{
          background: isActive
            ? `linear-gradient(90deg, ${clarityColor}, ${afterColor})`
            : `linear-gradient(90deg, ${clarityColor}60, ${clarityColor}20)`,
        }}
      />

      <div className="p-4 md:p-5">
        {/* Icon + Brand */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              backgroundColor: isActive ? `${clarityColor}15` : `${clarityColor}08`,
              color: isActive ? clarityColor : `${clarityColor}80`,
            }}
          >
            {ICON_MAP[cs.icon] || <ShoppingBag size={20} />}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={`font-heading text-[14px] md:text-[15px] font-semibold leading-[1.3] truncate transition-colors duration-300 ${
              isActive ? "text-text-primary" : "text-text-secondary"
            }`}>
              {cs.brand}
            </h4>
            <span className="font-mono text-[9px] tracking-[1px] uppercase text-text-ghost">
              {cs.industry}
            </span>
          </div>
        </div>

        {/* RIFC Before → After scores */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className="font-mono text-[18px] font-light"
            style={{ color: clarityColor }}
          >
            {cs.before.c}
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-ghost shrink-0">
            <line x1="1" y1="5" x2="14" y2="5" />
            <polyline points="10 1 14 5 10 9" />
          </svg>
          <span
            className="font-mono text-[18px] font-semibold"
            style={{ color: afterColor }}
          >
            {cs.after.c}
          </span>
        </div>
      </div>

      {/* Active indicator bottom */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-text-primary/20" />
      )}
    </button>
  );
}

/* ─── Main: Tabbed CaseStudiesSection ────────────────── */

export default function CaseStudiesSection() {
  const { t, locale } = useTranslation();
  const [activeCase, setActiveCase] = useState(0);
  const [activeStates, setActiveStates] = useState<
    Record<number, "before" | "after">
  >({});

  const getState = (index: number) => activeStates[index] || "before";
  const toggleState = (index: number) => {
    setActiveStates((prev) => ({
      ...prev,
      [index]: prev[index] === "after" ? "before" : "after",
    }));
  };

  const cs = t.caseStudies.cases[activeCase];

  return (
    <section
      id="case-studies"
      className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative overflow-hidden"
    >
      <SectionHeader
        chapter={t.caseStudies.chapter}
        titlePlain={t.caseStudies.titlePlain}
        titleBold={t.caseStudies.titleBold}
        description={t.caseStudies.description}
        watermarkNumber="09"
      />

      {/* 5 Tab Cards — clickable selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
        {t.caseStudies.cases.map((c, idx) => (
          <CaseTabCard
            key={idx}
            cs={c}
            isActive={activeCase === idx}
            onClick={() => setActiveCase(idx)}
            labels={t.caseStudies.labels}
          />
        ))}
      </div>

      {/* Active case detail */}
      {cs && (
        <UnifiedCaseCard
          key={activeCase}
          cs={cs}
          state={getState(activeCase)}
          onToggle={() => toggleState(activeCase)}
          labels={t.caseStudies.labels}
          locale={locale}
        />
      )}
    </section>
  );
}
