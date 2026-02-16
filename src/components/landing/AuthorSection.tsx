"use client";

import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { GradientBorderBlock } from "@/components/ui/V2Elements";

export default function AuthorSection() {
  const { t } = useTranslation();
  const a = t.author;

  return (
    <section id="author" className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative overflow-hidden">
      {/* ════════════════════════════════════════════════════
          PUNCT 1 — Chapter + Name + Label + Subtitle + Watermark
          ════════════════════════════════════════════════════ */}
      <div className="relative mb-16">
        {/* Watermark "DT" */}
        <div
          className="absolute -right-4 -top-8 md:right-4 md:-top-4 font-heading text-[120px] md:text-[180px] font-black leading-none select-none pointer-events-none"
          style={{ color: "rgba(220,38,38,0.06)" }}
          aria-hidden="true"
        >
          DT
        </div>

        <div className="relative z-[1]">
          <div className="font-mono text-[11px] md:text-[12px] tracking-[4px] uppercase text-text-muted mb-4">
            {a.chapter}
          </div>
          <h3 className="font-heading text-[36px] md:text-[48px] font-light text-text-primary leading-[1.1] mb-3">
            <span>{a.nameBold} </span>
            <span className="font-semibold">{a.name}</span>
          </h3>
          <div className="font-mono text-[11px] md:text-[12px] tracking-[4px] uppercase text-rifc-red font-bold mb-4">
            {a.label}
          </div>
          <p className="font-heading text-[18px] md:text-[22px] italic text-text-muted leading-[1.4]">
            {a.subtitle}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 5A — Photo / Avatar + intro
          ════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-14 max-w-4xl mx-auto mb-10">
        {/* Author photo */}
        <div className="shrink-0">
          <div className="w-[200px] h-[260px] md:w-[260px] md:h-[340px] rounded-lg border-2 border-border-light overflow-hidden relative">
            <Image
              src="/images/dumitru-talmazan.jpg"
              alt="Dumitru Talmazan"
              fill
              className="object-cover"
              sizes="260px"
            />
            {/* Decorative border accent */}
            <div
              className="absolute inset-[-4px] rounded-lg border border-rifc-red/20"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Short bio intro */}
        <div className="text-center md:text-left">
          <p className="font-body text-[15px] md:text-[16px] text-text-secondary leading-[1.9] mb-4">
            {a.bio1}
          </p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {a.tags.map((tag, idx) => {
              const colors = ["#DC2626", "#2563EB", "#059669"];
              return (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[2px] uppercase px-3 py-1 border rounded-sm"
                  style={{
                    color: colors[idx] || colors[0],
                    borderColor: `${colors[idx] || colors[0]}40`,
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 3 — Personal Element (integrated with bio)
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="px-5 py-4 md:px-6 md:py-5 rounded-sm bg-[rgba(255,255,255,0.02)] border border-border-light">
          <p className="font-body text-[13px] md:text-[14px] italic text-text-muted leading-[1.8] mb-3">
            {a.personalBody}
          </p>
          <p className="font-mono text-[12px] md:text-[13px] font-semibold text-text-primary leading-[1.5] mb-0.5">
            {a.personalHighlight1}
          </p>
          <p className="font-body text-[12px] md:text-[13px] text-text-secondary leading-[1.5]">
            {a.personalHighlight2}
          </p>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 2 — 3 Pillars
          ════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {a.pillars.map((pillar) => (
          <div key={pillar.id} className="relative">
            {/* Top border accent */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
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

              {/* Quote (only Philosophy has one) */}
              {pillar.quote && (
                <div className="mb-4 relative pl-4">
                  {/* Decorative quote mark */}
                  <span
                    className="absolute -left-1 -top-3 font-heading text-[48px] leading-none select-none"
                    style={{ color: `${pillar.color}20` }}
                    aria-hidden="true"
                  >
                    &ldquo;
                  </span>
                  <p className="font-heading text-[16px] md:text-[18px] italic text-text-primary leading-[1.5]">
                    {pillar.quote}
                  </p>
                </div>
              )}

              {/* Body */}
              <p className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8] whitespace-pre-line mb-4">
                {pillar.body}
              </p>

              {/* Highlight */}
              <div
                className="px-3 py-2 rounded-sm border-l-2"
                style={{
                  borderLeftColor: pillar.color,
                  backgroundColor: `${pillar.color}08`,
                }}
              >
                <p
                  className="font-body text-[13px] md:text-[14px] font-semibold leading-[1.6]"
                  style={{ color: pillar.color }}
                >
                  {pillar.highlight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 4 — Signature Quote
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-16 py-12 md:py-16 text-center relative">
        {/* Decorative opening quote */}
        <span
          className="absolute left-1/2 -translate-x-1/2 -top-2 font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/15"
          aria-hidden="true"
        >
          &ldquo;
        </span>

        <p className="font-heading text-[24px] md:text-[32px] lg:text-[36px] font-light text-text-primary leading-[1.5] whitespace-pre-line relative z-[1]">
          {a.signatureQuote}
        </p>

        {/* Decorative closing quote */}
        <span
          className="inline-block font-heading text-[80px] md:text-[100px] leading-none select-none text-rifc-red/15 -mt-6"
          aria-hidden="true"
        >
          &rdquo;
        </span>

        <p className="font-mono text-[13px] md:text-[14px] text-text-muted tracking-[2px] mt-2">
          {a.signatureAuthor}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 5B,C — Entity Logos + Stats
          ════════════════════════════════════════════════════ */}
      <div className="max-w-3xl mx-auto mb-16 text-center">
        {/* Founder label */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-text-muted mb-6">
          {a.founderLabel}
        </div>

        {/* Entity cards */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <GradientBorderBlock gradientFrom="#6C3FA0" gradientTo="#6C3FA040" bgTint="transparent">
            <div className="text-center px-4">
              <div className="font-mono text-[14px] md:text-[16px] font-bold tracking-[2px] text-[#6C3FA0] mb-1">
                {a.entity1}
              </div>
              <p className="font-body text-[12px] text-text-muted">
                {a.entity1Desc}
              </p>
            </div>
          </GradientBorderBlock>

          <GradientBorderBlock gradientFrom="#059669" gradientTo="#05966940" bgTint="transparent">
            <div className="text-center px-4">
              <div className="font-mono text-[14px] md:text-[16px] font-bold tracking-[2px] text-rifc-green mb-1">
                {a.entity2}
              </div>
              <p className="font-body text-[12px] text-text-muted">
                {a.entity2Desc}
              </p>
            </div>
          </GradientBorderBlock>
        </div>

        {/* Stats line */}
        <p className="font-mono text-[11px] md:text-[12px] text-text-muted tracking-[1px]">
          {a.statsLine}
        </p>
      </div>

      {/* ════════════════════════════════════════════════════
          PUNCT 6 — CTA
          ════════════════════════════════════════════════════ */}
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-heading text-[22px] md:text-[28px] font-light text-text-primary leading-[1.4] mb-8">
          {a.ctaQuestion}
        </p>

        <div className="flex flex-col items-center gap-4">
          <Link
            href="/consulting"
            className="inline-flex items-center justify-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-8 py-[16px] bg-rifc-red text-white rounded-sm hover:bg-rifc-red/90 transition-all duration-300 no-underline"
          >
            <ArrowRight size={16} />
            {a.ctaPrimary}
          </Link>

          <p className="font-body text-[13px] text-text-muted">
            {a.ctaOr}
          </p>

          <Link
            href="/audit"
            className="inline-flex items-center justify-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-8 py-[16px] border border-border-light text-text-muted rounded-sm hover:border-rifc-red/40 hover:text-rifc-red transition-all duration-300 no-underline"
          >
            <Sparkles size={16} />
            {a.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
