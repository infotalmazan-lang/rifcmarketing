"use client";

import { useState, useEffect } from "react";
import { Ghost, Theater, Gem, ChevronDown, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { WatermarkNumber } from "@/components/ui/V2Elements";
import FailureSimulator from "./FailureSimulator";
import Link from "next/link";

/* ─── Icon map ───────────────────────────────────────── */

const ICON_MAP: Record<string, React.ReactNode> = {
  ghost: <Ghost size={28} strokeWidth={1.8} />,
  theater: <Theater size={28} strokeWidth={1.8} />,
  gem: <Gem size={28} strokeWidth={1.8} />,
};

/* ─── Custom Section Header for Ch06 ────────────────── */

function ArchetypesHeader() {
  const { t } = useTranslation();
  const a = t.archetypes;

  return (
    <div className="relative">
      <WatermarkNumber
        value="06"
        color="#DC2626"
        size="md"
        className="-top-[40px] -right-[10px] md:-top-[60px] md:-right-[30px]"
      />
      {/* Chapter label */}
      <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
        {a.chapter}
      </span>
      {/* Main title — large serif */}
      <h2 className="text-[clamp(32px,4vw,48px)] font-light leading-[1.2] tracking-[-1px] mb-3">
        {a.titlePlain}
      </h2>
      {/* Subtitle — smaller, muted */}
      {a.titleSubtitle && (
        <p className="font-heading text-[18px] md:text-[22px] italic text-text-muted mb-6">
          {a.titleSubtitle}
        </p>
      )}
      {/* Description */}
      <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-8 font-light">
        {a.description}
      </p>
    </div>
  );
}

/* ─── Failure Equation Display ───────────────────────── */

function FailureEquation({
  equation,
}: {
  equation: {
    r: { value: string; dim: boolean };
    i: { value: string; dim: boolean };
    f: { value: string; dim: boolean };
    result: string;
    resultColor: string;
  };
}) {
  const dimClass = "text-text-ghost";
  const activeClass = "text-rifc-red font-bold";

  return (
    <div className="font-mono text-[32px] md:text-[44px] lg:text-[48px] font-light tracking-tight leading-none">
      <span className={equation.r.dim ? dimClass : activeClass}>
        {equation.r.value}
      </span>
      <span className={dimClass}> + (</span>
      <span className={equation.i.dim ? dimClass : activeClass}>
        {equation.i.value}
      </span>
      <span className={dimClass}> {"\u00d7"} </span>
      <span className={equation.f.dim ? dimClass : activeClass}>
        {equation.f.value}
      </span>
      <span className={dimClass}>) = </span>
      <span
        className="font-semibold tracking-[2px] uppercase"
        style={{ color: equation.resultColor }}
      >
        {equation.result}
      </span>
    </div>
  );
}

/* ─── Oglinda — Filter Questions Between Archetypes ──── */

function MirrorBlock({
  mirror,
}: {
  mirror: { prev: string; next: string };
}) {
  return (
    <div className="py-10 md:py-14 border-t border-b border-border-subtle text-center">
      <p className="font-heading text-[15px] md:text-[17px] italic text-text-ghost leading-[1.8] mb-3">
        {mirror.prev}
      </p>
      <p className="font-heading text-[15px] md:text-[17px] italic text-text-primary leading-[1.8] font-medium">
        {mirror.next}
      </p>
      <div className="mt-4 text-text-ghost text-[20px] animate-bounce">
        <ChevronDown size={20} strokeWidth={1.5} className="mx-auto" />
      </div>
    </div>
  );
}

/* ─── Single Archetype Card ──────────────────────────── */

function ArchetypeCard({
  item,
  caseStudyBadge,
  isMobile,
}: {
  item: ReturnType<typeof useTranslation>["t"]["archetypes"]["items"][0];
  caseStudyBadge: string;
  isMobile: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  // On mobile, always show expanded
  useEffect(() => {
    if (isMobile) setExpanded(true);
  }, [isMobile]);

  return (
    <div
      className="border border-border-light rounded-sm bg-surface-card relative overflow-hidden transition-all duration-300"
      style={{ borderColor: `${item.color}15` }}
    >
      {/* Collapsed — always visible */}
      <div className="p-8 md:p-10">
        {/* Equation */}
        <div className="mb-6">
          <FailureEquation equation={item.equation} />
        </div>

        {/* Headline */}
        <h3 className="font-heading text-[22px] md:text-[26px] italic font-light text-text-primary mb-3 leading-[1.3]">
          &ldquo;{item.headline}&rdquo;
        </h3>

        {/* Symptom line — now with full KPI text */}
        <p className="font-body text-[14px] md:text-[15px] italic text-text-muted mb-4 leading-[1.7]">
          {item.symptomLine}
        </p>

        {/* Expand button (hidden on mobile) */}
        {!isMobile && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 font-body text-[13px] tracking-[1px] cursor-pointer transition-colors duration-200 group"
            style={{ color: item.color }}
          >
            <span>{item.expandLabel}</span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Expanded content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          expanded
            ? "max-h-[3000px] opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="px-8 md:px-10 pb-10">
          {/* Archetype name */}
          <div className="flex items-center gap-3 mb-6 pt-2 border-t border-border-subtle">
            <div className="pt-6" style={{ color: item.color }}>
              {ICON_MAP[item.icon] || <Ghost size={28} />}
            </div>
            <span
              className="pt-6 font-mono text-[13px] font-semibold tracking-[3px] uppercase"
              style={{ color: item.color }}
            >
              {item.name}
            </span>
          </div>

          {/* Body text */}
          <div className="font-body text-[16px] md:text-[17px] leading-[1.8] text-text-secondary mb-8 whitespace-pre-line">
            {item.body}
          </div>

          {/* Verdict */}
          <div
            className="border-l-[3px] pl-5 py-4 mb-8 rounded-r-sm"
            style={{
              borderLeftColor: item.color,
              backgroundColor: `${item.color}08`,
            }}
          >
            <p className="font-body text-[15px] md:text-[16px] italic leading-[1.7] text-text-secondary">
              {item.verdict}
            </p>
          </div>

          {/* Case Study — "AȘA NU" / "DON'T" badge format */}
          <div
            className="relative border rounded-sm p-6 mb-8 overflow-hidden"
            style={{
              borderColor: "rgba(220, 38, 38, 0.2)",
              backgroundColor: "rgba(127, 29, 29, 0.08)",
            }}
          >
            {/* Badge */}
            <span className="inline-block bg-[#DC2626] text-white text-[11px] font-bold tracking-[2px] uppercase px-3 py-1 rounded-full mb-4">
              {caseStudyBadge}
            </span>
            <p className="font-body text-[14px] md:text-[15px] leading-[1.8] text-text-muted">
              {item.caseStudy}
            </p>
            {/* Last line highlight — CPA/ROI in red if present */}
          </div>

          {/* 3 Brutal Questions */}
          <div className="space-y-4">
            {item.questions.map((q, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <span
                  className="font-mono text-[20px] md:text-[24px] font-light leading-none mt-0.5 w-8 flex-shrink-0"
                  style={{ color: `${item.color}55` }}
                >
                  {idx + 1}
                </span>
                <p className="font-body text-[14px] md:text-[15px] leading-[1.7] text-text-muted">
                  &ldquo;{q}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Self-Diagnosis Table ───────────────────────────── */

function DiagnosisTable() {
  const { t } = useTranslation();
  const { diagnosisTitle, diagnosisSubtitle, diagnosisHeaders, diagnosisRows } =
    t.archetypes;

  return (
    <div className="mt-24 md:mt-32">
      {/* Title */}
      <div className="text-center mb-10">
        <h3 className="font-heading text-[28px] md:text-[36px] font-light text-text-primary mb-2">
          {diagnosisTitle}
        </h3>
        <p className="font-body text-[15px] text-text-muted">
          {diagnosisSubtitle}
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        {/* Headers */}
        <div className="grid grid-cols-3 gap-0 mb-2">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-ghost px-5 py-3">
            {diagnosisHeaders.symptom}
          </div>
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-ghost px-5 py-3">
            {diagnosisHeaders.archetype}
          </div>
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-ghost px-5 py-3">
            {diagnosisHeaders.solution}
          </div>
        </div>

        {/* Rows */}
        {diagnosisRows.map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-3 gap-0 border-l-[3px] rounded-r-sm mb-2 transition-colors duration-200 hover:bg-[rgba(255,255,255,0.015)] group"
            style={{ borderLeftColor: row.color }}
          >
            <div className="px-5 py-5 border-t border-border-subtle">
              <p className="font-body text-[14px] italic text-text-muted leading-[1.6]">
                {row.symptom}
              </p>
            </div>
            <div className="px-5 py-5 border-t border-border-subtle">
              <p
                className="font-body text-[14px] font-semibold leading-[1.6]"
                style={{ color: row.color }}
              >
                {row.archetype}
              </p>
            </div>
            <div className="px-5 py-5 border-t border-border-subtle">
              <p className="font-body text-[14px] text-text-secondary leading-[1.6]">
                {row.solution}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {diagnosisRows.map((row, idx) => (
          <div
            key={idx}
            className="border-l-[3px] rounded-r-sm border border-border-subtle bg-surface-card p-5"
            style={{ borderLeftColor: row.color }}
          >
            <p className="font-body text-[13px] italic text-text-muted mb-3 leading-[1.6]">
              {diagnosisHeaders.symptom} {row.symptom}
            </p>
            <p
              className="font-body text-[14px] font-semibold mb-3 leading-[1.4]"
              style={{ color: row.color }}
            >
              {row.archetype}
            </p>
            <p className="font-body text-[13px] text-text-secondary leading-[1.6]">
              {row.solution}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CTA Final — Contrast Visual ────────────────────── */

function ArchetypesCTA() {
  const { t } = useTranslation();

  return (
    <div className="mt-20 md:mt-24 relative overflow-hidden">
      {/* Separator — green line marking transition from "problem" to "solution" */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#059669] to-transparent mb-12" />

      {/* CTA Card — lighter background for contrast */}
      <div className="relative rounded-sm p-8 md:p-14 text-center bg-[rgba(255,255,255,0.025)] border border-border-light">
        <WatermarkNumber
          value="C"
          color="#059669"
          size="md"
          className="-top-[30px] -right-[20px]"
        />
        <div className="relative z-[1]">
          {/* Title — large serif */}
          <h3 className="font-heading text-[24px] md:text-[32px] lg:text-[36px] font-light text-text-primary mb-3 leading-[1.3]">
            {t.archetypes.ctaTitle}
          </h3>
          {/* Highlight */}
          <p className="font-heading text-[20px] md:text-[24px] mb-8" style={{ color: "#059669" }}>
            {t.archetypes.ctaHighlight}
          </p>

          {/* Body */}
          <p className="font-body text-[14px] md:text-[16px] text-text-muted leading-[1.8] max-w-[640px] mx-auto mb-10">
            {t.archetypes.ctaBody}
          </p>

          {/* Primary Button — larger, with subtle glow */}
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 bg-rifc-red text-white font-body text-[15px] md:text-[16px] font-semibold px-8 py-4 rounded-lg transition-all duration-200 hover:bg-rifc-red-light hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]"
          >
            <ArrowRight size={18} strokeWidth={2} />
            {t.archetypes.ctaButton}
          </Link>

          {/* Secondary */}
          <div className="mt-5">
            <span className="font-body text-[13px] text-text-ghost">
              {t.archetypes.ctaOr}{" "}
            </span>
            <Link
              href="/calculator"
              className="font-body text-[13px] text-text-muted underline underline-offset-4 hover:text-text-primary transition-colors"
            >
              {t.archetypes.ctaSecondaryLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────── */

export default function ArchetypesSection() {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items = t.archetypes.items;
  const mirrors = t.archetypes.mirrors;

  return (
    <section id="archetypes" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
      {/* Custom Section Header */}
      <ArchetypesHeader />

      {/* Failure Simulator */}
      <div className="mt-12 mb-20 md:mb-24">
        <FailureSimulator />
      </div>

      {/* 3 Archetype Cards with Oglinda mirrors between them */}
      <div className="space-y-0">
        {items.map((item, idx) => (
          <div key={item.id}>
            {/* Archetype Card */}
            <ArchetypeCard
              item={item}
              caseStudyBadge={t.archetypes.caseStudyBadge}
              isMobile={isMobile}
            />

            {/* Mirror / Oglinda — between archetypes (not after last) */}
            {idx < items.length - 1 && mirrors[idx] && (
              <div className="my-10 md:my-16">
                <MirrorBlock mirror={mirrors[idx]} />
              </div>
            )}

            {/* Spacing between cards when no mirror */}
            {idx < items.length - 1 && !mirrors[idx] && (
              <div className="h-12 md:h-20" />
            )}
          </div>
        ))}
      </div>

      {/* Self-Diagnosis Table */}
      <DiagnosisTable />

      {/* CTA — Contrast Visual */}
      <ArchetypesCTA />
    </section>
  );
}
