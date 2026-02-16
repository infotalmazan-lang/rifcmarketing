"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { ArrowRight, Crosshair, RadioTower } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { WatermarkNumber } from "@/components/ui/V2Elements";

export default function PhilosophySection() {
  const { t } = useTranslation();
  const p = t.philosophy;

  return (
    <section
      id="philosophy"
      className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative overflow-hidden"
    >
      {/* ════════════════════════════════════════════════════
          SECTION HEADER
          ════════════════════════════════════════════════════ */}
      <SectionHeader
        chapter={p.chapter}
        titlePlain={p.titlePlain}
        titleBold={p.titleBold}
        watermarkNumber="01"
        watermarkColor="#DC2626"
      />

      {/* ════════════════════════════════════════════════════
          PUNCT 1 — Titlu nou + subtitlu + hook
          ════════════════════════════════════════════════════ */}
      <div className="text-center mb-16 -mt-4">
        <h3 className="font-heading text-[36px] md:text-[48px] font-light text-text-primary leading-[1.15] mb-2">
          {p.titleLine1}
        </h3>
        <h4 className="font-heading text-[28px] md:text-[36px] font-light text-rifc-red/80 leading-[1.2] mb-4">
          {p.titleLine2}
        </h4>
        <p className="font-heading text-[18px] md:text-[22px] italic text-text-muted leading-[1.4] mb-6">
          {p.subtitle}
        </p>
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-muted leading-[1.4]">
          {p.hook}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 2 — Intro manifest
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-20">
        {/* Headline */}
        <p className="font-heading text-[28px] md:text-[36px] font-light text-text-primary leading-[1.3] mb-8 text-center">
          {p.introHeadline}
        </p>

        {/* Body paragraphs */}
        <div className="space-y-5 font-body text-[15px] md:text-[16px] text-text-secondary leading-[1.9]">
          <p>
            {p.introBody1}{" "}
            <span className="text-rifc-red font-semibold">{p.introShield}</span>
          </p>
          <p>{p.introBody2}</p>
          <p>{p.introBody3}</p>
          <p className="text-text-primary font-medium">
            {p.introCloser1}
          </p>
          <p className="italic text-text-muted">
            {p.introCloser2}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 3 — Principiul Central
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-20 relative">
        <WatermarkNumber value="C" color="#DC2626" size="lg" />

        <div className="py-12 md:py-16 px-8 md:px-12 text-center bg-surface-card border border-border-light rounded-sm relative z-[1]">
          {/* Label */}
          <div className="font-mono text-[10px] md:text-[11px] tracking-[4px] uppercase text-rifc-red font-bold mb-6">
            {p.principleLabel}
          </div>

          {/* Decorative opening quote */}
          <span
            className="absolute left-1/2 -translate-x-1/2 top-8 font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/20"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          {/* Quote */}
          <p className="font-heading text-[28px] md:text-[36px] font-light text-text-primary leading-[1.4] whitespace-pre-line relative z-[1] mb-4">
            {p.principleQuote}
          </p>

          {/* Decorative closing quote */}
          <span
            className="inline-block font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/20 -mt-6"
            aria-hidden="true"
          >
            &rdquo;
          </span>

          {/* Sub */}
          <p className="font-body text-[14px] md:text-[16px] text-text-secondary leading-[1.7] whitespace-pre-line mt-2">
            {p.principleSub}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 4 — 3 Piloni
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
        {p.pillars.map((pillar) => (
          <div key={pillar.id} className="relative">
            {/* Top border accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ backgroundColor: pillar.color }}
              aria-hidden="true"
            />

            <div className="pt-6 pb-6 px-5 bg-surface-card border border-border-light border-t-0 rounded-b-sm">
              {/* Label */}
              <div
                className="font-mono text-[10px] md:text-[11px] tracking-[3px] uppercase font-bold mb-4"
                style={{ color: pillar.color }}
              >
                {pillar.label}
              </div>

              {/* Statement */}
              <p className="font-heading text-[18px] md:text-[20px] font-semibold text-text-primary leading-[1.4] mb-4">
                {pillar.statement}
              </p>

              {/* Meaning */}
              <div className="mb-5">
                <p className="font-body text-[13px] md:text-[14px] text-text-muted italic mb-2">
                  {pillar.meaningTitle}
                </p>
                <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8]">
                  {pillar.meaningBody}
                </p>
              </div>

              {/* Consequence */}
              <div
                className="px-4 py-3 rounded-sm border-l-2"
                style={{
                  borderLeftColor: pillar.color,
                  backgroundColor: `${pillar.color}08`,
                }}
              >
                <div
                  className="font-mono text-[9px] tracking-[3px] uppercase font-bold mb-2"
                  style={{ color: pillar.color }}
                >
                  {pillar.consequenceLabel}
                </div>
                <p
                  className="font-body text-[13px] md:text-[14px] font-semibold leading-[1.6]"
                  style={{ color: pillar.color }}
                >
                  {pillar.consequenceLine1}
                </p>
                <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.6]">
                  {pillar.consequenceLine2}
                </p>
                <p className="font-body text-[13px] md:text-[14px] text-text-primary font-medium leading-[1.6]">
                  {pillar.consequenceLine3}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 5 — Tun vs. Far
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-20">
        {/* Before — Cannon */}
        <div className="px-6 py-8 md:px-8 md:py-10 bg-surface-card border border-border-light rounded-sm text-center">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted font-bold mb-2">
            {p.beforeLabel} ({p.beforeFramework})
          </div>
          <div className="flex justify-center mb-4">
            <Crosshair size={40} className="text-text-muted" strokeWidth={1.5} />
          </div>
          <p className="font-heading text-[16px] md:text-[18px] text-text-secondary leading-[1.5] mb-4">
            {p.beforeMetaphor}
          </p>
          <p className="font-body text-[13px] text-text-secondary leading-[1.7] mb-4">
            {p.beforeDesc}
          </p>
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted mb-1">
            {p.beforeApproach}
          </div>
          <p className="font-heading text-[16px] italic text-text-muted">
            {p.beforeQuote}
          </p>
        </div>

        {/* After — Lighthouse */}
        <div className="px-6 py-8 md:px-8 md:py-10 bg-surface-card border border-rifc-green/20 rounded-sm text-center">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-rifc-green font-bold mb-2">
            {p.afterLabel} ({p.afterFramework})
          </div>
          <div className="flex justify-center mb-4">
            <RadioTower size={40} className="text-rifc-green" strokeWidth={1.5} />
          </div>
          <p className="font-heading text-[16px] md:text-[18px] text-text-primary leading-[1.5] mb-4">
            {p.afterMetaphor}
          </p>
          <p className="font-body text-[13px] text-text-secondary leading-[1.7] mb-4">
            {p.afterDesc}
          </p>
          <div className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-green mb-1">
            {p.afterApproach}
          </div>
          <p className="font-heading text-[16px] italic text-rifc-green">
            {p.afterQuote}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 6 — Nota stoica + citat final
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-20">
        {/* Stoic note */}
        <div className="px-6 py-6 md:px-8 md:py-8 rounded-sm bg-[rgba(255,255,255,0.02)] border border-border-light mb-12">
          <div className="font-mono text-[10px] tracking-[4px] uppercase text-text-muted font-bold mb-4">
            {p.stoicLabel}
          </div>
          <p className="font-heading text-[16px] md:text-[18px] italic text-text-muted leading-[1.6] mb-4">
            {p.stoicIntro}
          </p>
          <p className="font-body text-[14px] md:text-[16px] text-text-secondary leading-[1.8] mb-2">
            {p.stoicBody}{" "}
            <span className="text-text-primary font-semibold">{p.stoicHighlight}</span>
          </p>
          <p className="font-body text-[14px] md:text-[16px] text-text-secondary leading-[1.8]">
            {p.stoicCloser}
          </p>
        </div>

        {/* Final quote */}
        <div className="text-center py-10 md:py-14 relative">
          <span
            className="absolute left-1/2 -translate-x-1/2 -top-2 font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/15"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <p className="font-heading text-[24px] md:text-[32px] font-light text-text-primary leading-[1.5] whitespace-pre-line relative z-[1]">
            {p.finalQuote}
          </p>

          <span
            className="inline-block font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/15 -mt-6"
            aria-hidden="true"
          >
            &rdquo;
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 7 — Tranzitie spre Cap. 02
          ════════════════════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-muted leading-[1.4] mb-2">
          {p.transitionLine1}
        </p>
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-primary leading-[1.4] mb-8">
          {p.transitionLine2}
        </p>
        <Link
          href={`#${p.transitionTarget}`}
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[3px] uppercase text-rifc-red hover:text-rifc-red/80 transition-colors duration-300 no-underline"
        >
          <ArrowRight size={16} />
          {p.transitionCta}
        </Link>
      </div>
    </section>
  );
}
