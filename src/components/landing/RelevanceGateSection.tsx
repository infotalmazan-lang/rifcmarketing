"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ShieldOff,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Ghost,
  Hotel,
  Megaphone,
  Pill,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { WatermarkNumber, GradientBorderBlock } from "@/components/ui/V2Elements";

/* ── Icon map for analogies ──────────────────────────── */
const ANALOGY_ICONS: Record<string, typeof Hotel> = {
  Hotel,
  Megaphone,
  Pill,
};

export default function RelevanceGateSection() {
  const { t } = useTranslation();
  const [gateOpen, setGateOpen] = useState(false);

  return (
    <section
      id="relevance-gate"
      className="relative"
      style={{
        background:
          "linear-gradient(180deg, #08080d 0%, #1a0808 15%, #1a0505 50%, #1a0808 85%, #08080d 100%)",
      }}
    >
      <div className="py-[120px] px-6 md:px-10 max-w-content mx-auto relative">
        {/* ═══════════════════════════════════════════════
            PUNCT 1 — Titlu + Label + Subtitlu
            ═══════════════════════════════════════════════ */}
        <div className="relative mb-16">
          <WatermarkNumber
            value="R"
            color="#DC2626"
            size="md"
            className="-top-[40px] -right-[10px] md:-top-[60px] md:-right-[30px]"
          />

          {/* Safety label */}
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle size={14} strokeWidth={2} className="text-red-400" />
            <span className="font-mono text-[11px] tracking-[6px] uppercase text-red-400 font-bold">
              {t.relevanceGate.safetyLabel}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-4">
            <strong className="font-semibold">
              {t.relevanceGate.titleBold}
            </strong>
          </h2>

          {/* Subtitle */}
          <p className="text-[16px] md:text-[18px] text-text-muted italic leading-[1.6] max-w-prose">
            {t.relevanceGate.subtitle}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 2 — Intro anafora + protocol
            ═══════════════════════════════════════════════ */}
        <div className="mb-16">
          {/* Anaphora lines */}
          <div className="space-y-2 mb-6">
            {t.relevanceGate.introLines.map((line, i) => (
              <p
                key={i}
                className="font-body text-[16px] md:text-[18px] text-text-secondary leading-[1.6]"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Break line */}
          <p className="font-heading text-[22px] md:text-[26px] font-semibold text-text-primary leading-[1.4] mb-6">
            {t.relevanceGate.introBreak}
          </p>

          {/* Protocol explanation */}
          <p className="font-body text-[15px] md:text-[16px] text-text-muted leading-[1.8] max-w-prose">
            {t.relevanceGate.introProtocol.split("protocol secvențial").length >
            1
              ? t.relevanceGate.introProtocol
                  .split(/(protocol secvențial|sequential protocol|sistemul se închide automat|system shuts down automatically)/g)
                  .map((part, i) =>
                    part === "protocol secvențial" ||
                    part === "sequential protocol" ||
                    part === "sistemul se închide automat" ||
                    part === "system shuts down automatically" ? (
                      <span key={i} className="font-mono text-red-400">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
              : t.relevanceGate.introProtocol}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 3 — Regula binară + Toggle ON/OFF
            ═══════════════════════════════════════════════ */}
        <div className="mb-16 bg-red-950/30 border border-red-500/40 rounded-sm p-6 md:p-8 relative overflow-hidden">
          <WatermarkNumber
            value="<3"
            color="#DC2626"
            size="sm"
            className="-top-[10px] -right-[10px]"
          />

          <div className="relative z-[1]">
            {/* Binary rule */}
            <p className="font-mono text-[16px] md:text-[20px] text-red-400 font-bold tracking-[1px] mb-6">
              {t.relevanceGate.binaryRule}
            </p>

            {/* Bullet consequences */}
            <div className="space-y-2 mb-8">
              {t.relevanceGate.toggleBullets.map((bullet, i) => (
                <div key={i} className="flex items-start gap-2">
                  <XCircle
                    size={14}
                    strokeWidth={2}
                    className="text-red-400/60 shrink-0 mt-1"
                  />
                  <span className="font-body text-[14px] text-red-300/70 leading-[1.6]">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>

            {/* Toggle ON/OFF */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted">
                {t.relevanceGate.titleBold}
              </span>

              <div className="flex flex-col gap-2">
                {/* ON state */}
                <button
                  onClick={() => setGateOpen(true)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-7 rounded-full flex items-center transition-all duration-300 ${
                      gateOpen
                        ? "bg-green-500/30 justify-start pl-1"
                        : "bg-[rgba(255,255,255,0.05)] justify-start pl-1"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-all duration-300 ${
                        gateOpen
                          ? "bg-green-400 translate-x-7"
                          : "bg-[rgba(255,255,255,0.15)]"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck
                      size={14}
                      className={`transition-colors ${
                        gateOpen ? "text-green-400" : "text-text-ghost"
                      }`}
                    />
                    <span
                      className={`font-mono text-[13px] tracking-[1px] transition-colors ${
                        gateOpen ? "text-green-400 font-semibold" : "text-text-ghost"
                      }`}
                    >
                      ON &mdash; {t.relevanceGate.toggleOnLabel}
                    </span>
                  </div>
                </button>

                {/* OFF state */}
                <button
                  onClick={() => setGateOpen(false)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-7 rounded-full flex items-center transition-all duration-300 ${
                      !gateOpen
                        ? "bg-red-500/30 justify-end pr-1"
                        : "bg-[rgba(255,255,255,0.05)] justify-end pr-1"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-all duration-300 ${
                        !gateOpen
                          ? "bg-red-400 -translate-x-7"
                          : "bg-[rgba(255,255,255,0.15)]"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldOff
                      size={14}
                      className={`transition-colors ${
                        !gateOpen ? "text-red-400" : "text-text-ghost"
                      }`}
                    />
                    <span
                      className={`font-mono text-[13px] tracking-[1px] transition-colors ${
                        !gateOpen ? "text-red-400 font-semibold" : "text-text-ghost"
                      }`}
                    >
                      OFF &mdash; {t.relevanceGate.toggleOffLabel}
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Equation preview reflecting toggle state */}
            <div className="mt-6 pt-4 border-t border-red-500/20">
              <div className="font-mono text-[18px] md:text-[22px] tracking-[1px]">
                <span style={{ color: "#DC2626" }}>R</span>
                <span className="text-text-ghost mx-1">+</span>
                <span className="text-text-ghost">(</span>
                <span
                  className="transition-all duration-300"
                  style={{
                    color: gateOpen ? "#2563EB" : "rgba(232,230,227,0.15)",
                  }}
                >
                  I
                </span>
                <span className="text-text-ghost mx-1">&times;</span>
                <span
                  className="transition-all duration-300"
                  style={{
                    color: gateOpen ? "#D97706" : "rgba(232,230,227,0.15)",
                  }}
                >
                  F
                </span>
                <span className="text-text-ghost">)</span>
                <span className="text-text-ghost mx-1">=</span>
                <span
                  className="transition-all duration-300"
                  style={{
                    color: gateOpen ? "#059669" : "rgba(232,230,227,0.15)",
                    textDecoration: gateOpen ? "none" : "line-through",
                  }}
                >
                  C
                </span>
                {!gateOpen && (
                  <span className="text-red-400 ml-2 text-[14px]">
                    &times; 0
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 4 — Simularea Dezastrului
            ═══════════════════════════════════════════════ */}
        <div className="mb-16">
          <h3 className="font-mono text-[11px] tracking-[4px] uppercase text-red-400 font-bold mb-6">
            {t.relevanceGate.disasterTitle}
          </h3>

          {/* Disaster 1 */}
          <div className="border border-border-light rounded-sm p-6 bg-surface-card mb-4">
            <p className="font-body text-[14px] text-text-secondary leading-[1.6] mb-4">
              {t.relevanceGate.disaster1Scenario}
            </p>

            {/* Equation */}
            <div className="font-mono text-[20px] md:text-[26px] tracking-[1px] mb-4">
              <span className="text-red-400">2</span>
              <span className="text-text-ghost mx-1">+</span>
              <span className="text-text-ghost">(</span>
              <span className="text-blue-400">8</span>
              <span className="text-text-ghost mx-1">&times;</span>
              <span className="text-amber-400">9</span>
              <span className="text-text-ghost">)</span>
              <span className="text-text-ghost mx-1">=</span>
              <span className="text-yellow-400">74</span>
            </div>

            {/* On paper bar — green */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-body text-[12px] text-text-muted">
                  {t.relevanceGate.disaster1OnPaper}
                </span>
                <CheckCircle size={14} className="text-green-400/60" />
              </div>
              <div className="h-3 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400"
                  style={{ width: "67%" }}
                />
              </div>
            </div>

            {/* Gate activated divider */}
            <div className="flex items-center gap-2 my-4 py-2">
              <div className="flex-1 h-px bg-red-500/40" />
              <div className="flex items-center gap-1.5 px-3 py-1 bg-red-950/40 border border-red-500/40 rounded-full">
                <AlertTriangle size={12} className="text-red-400" />
                <span className="font-mono text-[11px] text-red-400 font-bold tracking-[1px]">
                  {t.relevanceGate.disaster1Reality}
                </span>
              </div>
              <div className="flex-1 h-px bg-red-500/40" />
            </div>

            {/* Reality bar — red/empty */}
            <div className="mb-3">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-body text-[12px] text-red-400 font-semibold">
                  {t.relevanceGate.disaster1Verdict}
                </span>
              </div>
              <div className="h-3 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-600/40"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          </div>

          {/* Disaster 2 — maximum paradox */}
          <div className="border border-red-500/30 rounded-sm p-6 bg-red-950/10">
            <p className="font-body text-[14px] text-text-secondary leading-[1.6] mb-4">
              {t.relevanceGate.disaster2Intro}
            </p>

            {/* Equation */}
            <div className="font-mono text-[20px] md:text-[26px] tracking-[1px] mb-4">
              <span className="text-red-400">2</span>
              <span className="text-text-ghost mx-1">+</span>
              <span className="text-text-ghost">(</span>
              <span className="text-blue-400">10</span>
              <span className="text-text-ghost mx-1">&times;</span>
              <span className="text-amber-400">10</span>
              <span className="text-text-ghost">)</span>
              <span className="text-text-ghost mx-1">=</span>
              <span className="line-through text-text-ghost/40">102</span>
            </div>

            <p className="font-body text-[13px] text-text-muted leading-[1.6] mb-1">
              {t.relevanceGate.disaster2OnPaper}
            </p>
            <p className="font-body text-[13px] text-red-400 font-semibold leading-[1.6] mb-2">
              {t.relevanceGate.disaster2Reality}
            </p>
            <p className="font-mono text-[13px] text-red-300/80 italic">
              {t.relevanceGate.disaster2Verdict}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 5 — 3 Analogii fizice
            ═══════════════════════════════════════════════ */}
        <div className="mb-16">
          <h3 className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-6">
            {t.relevanceGate.analogiesTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {t.relevanceGate.analogies.map((analogy, i) => {
              const Icon = ANALOGY_ICONS[analogy.icon] || Hotel;
              return (
                <GradientBorderBlock
                  key={i}
                  gradientFrom="#DC2626"
                  gradientTo="#D97706"
                  bgTint="rgba(220,38,38,0.03)"
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-red-400/60 mb-3"
                  />
                  <p className="font-body text-[13px] md:text-[14px] text-text-muted leading-[1.7]">
                    {analogy.text}
                  </p>
                </GradientBorderBlock>
              );
            })}
          </div>

          <p className="font-mono text-[13px] text-red-400 tracking-[0.5px] text-center">
            {t.relevanceGate.analogiesConclusion}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 6 — Consecințe + matematică
            ═══════════════════════════════════════════════ */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consequences */}
          <GradientBorderBlock
            gradientFrom="#DC2626"
            gradientTo="#DC2626"
            bgTint="rgba(220,38,38,0.03)"
          >
            <h4 className="font-mono text-[11px] tracking-[3px] uppercase text-red-400 mb-4">
              {t.relevanceGate.consequencesTitle}
            </h4>
            <div className="space-y-3">
              {t.relevanceGate.consequences.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-red-400/50 shrink-0 mt-0.5 font-mono text-[12px]">
                    &bull;
                  </span>
                  <span className="font-body text-[13px] text-text-muted leading-[1.6]">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </GradientBorderBlock>

          {/* Math thresholds */}
          <GradientBorderBlock
            gradientFrom="#D97706"
            gradientTo="#DC2626"
            bgTint="rgba(220,38,38,0.03)"
          >
            <div className="space-y-4">
              {t.relevanceGate.mathThresholds.map((th, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span
                      className="font-mono text-[18px] font-bold w-[40px]"
                      style={{
                        color: th.r < 3 ? "#DC2626" : "#059669",
                      }}
                    >
                      R={th.r}
                    </span>
                    <span className="font-mono text-[13px] text-text-secondary">
                      {th.equation}
                    </span>
                  </div>
                  <span
                    className="font-body text-[12px] leading-[1.5] pl-[52px]"
                    style={{
                      color: th.r < 3 ? "rgba(248,113,113,0.7)" : "rgba(52,211,153,0.8)",
                    }}
                  >
                    {th.note}
                  </span>
                  {i < t.relevanceGate.mathThresholds.length - 1 && (
                    <div className="border-b border-border-light mt-2" />
                  )}
                </div>
              ))}
            </div>
            <p className="font-mono text-[12px] text-red-400 mt-4 tracking-[0.5px]">
              {t.relevanceGate.mathConclusion}
            </p>
          </GradientBorderBlock>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 7 — Protocol Pre-Lansare
            ═══════════════════════════════════════════════ */}
        <div className="mb-16">
          <h3 className="font-mono text-[11px] tracking-[4px] uppercase text-red-400 font-bold mb-8">
            {t.relevanceGate.protocolTitle}
          </h3>

          <div className="space-y-6">
            {t.relevanceGate.protocolQuestions.map((q, i) => (
              <div
                key={i}
                className="border border-border-light rounded-sm p-5 md:p-6 bg-surface-card"
              >
                {/* Number + Category */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[24px] text-red-400/60">
                    {q.num}
                  </span>
                  <span className="font-mono text-[12px] tracking-[3px] uppercase text-text-muted">
                    {q.category}
                  </span>
                </div>

                {/* Question */}
                <p className="font-body text-[14px] md:text-[15px] text-text-primary leading-[1.6] mb-4 italic">
                  {q.question}
                </p>

                {/* Answers */}
                <div className="space-y-2 pl-2">
                  {/* Yes */}
                  <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-400 shrink-0" />
                    <span className="font-body text-[13px] text-green-400/80">
                      {q.yes}
                    </span>
                  </div>
                  {/* Warning (optional) */}
                  {q.warning && (
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        size={14}
                        className="text-amber-400 shrink-0"
                      />
                      <span className="font-body text-[13px] text-amber-400/80">
                        {q.warning}
                      </span>
                    </div>
                  )}
                  {/* No */}
                  <div className="flex items-center gap-2">
                    <XCircle size={14} className="text-red-400 shrink-0" />
                    <span className="font-body text-[13px] text-red-400/80 font-semibold">
                      {q.no}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Protocol verdict */}
          <div className="mt-6 bg-red-950/20 border-l-4 border-red-500 px-5 py-4 rounded-r-sm">
            <p className="font-mono text-[13px] text-red-400 font-semibold mb-2">
              <XCircle
                size={14}
                className="inline-block mr-1.5 -mt-0.5"
              />
              {t.relevanceGate.protocolRule}
            </p>
            <p className="font-body text-[13px] text-text-muted italic leading-[1.6]">
              {t.relevanceGate.protocolQuote}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 8 — Fantoma + Management Risc
            ═══════════════════════════════════════════════ */}
        <div className="mb-16">
          <GradientBorderBlock
            gradientFrom="#DC2626"
            gradientTo="#6B21A8"
            bgTint="rgba(220,38,38,0.04)"
          >
            <div className="flex items-start gap-4">
              <Ghost
                size={28}
                strokeWidth={1.5}
                className="text-red-400/50 shrink-0 mt-1"
              />
              <div>
                <p className="font-heading text-[18px] md:text-[20px] text-text-primary font-semibold leading-[1.4] mb-2">
                  {t.relevanceGate.ghostTitle}
                </p>
                <p className="font-body text-[14px] text-text-muted leading-[1.7] mb-3">
                  {t.relevanceGate.ghostBody}
                </p>
                <a
                  href="#archetypes"
                  className="inline-flex items-center gap-1.5 font-body text-[13px] text-red-400 hover:text-red-300 transition-colors"
                >
                  <ArrowRight size={14} />
                  {t.relevanceGate.ghostLink}
                </a>
              </div>
            </div>
          </GradientBorderBlock>

          <p className="font-body text-[14px] md:text-[15px] text-text-muted leading-[1.8] mt-6 max-w-prose">
            {t.relevanceGate.riskFraming}
          </p>
        </div>

        {/* ═══════════════════════════════════════════════
            PUNCT 9 — CTA + Tranziție
            ═══════════════════════════════════════════════ */}
        <div className="text-center border-t border-red-500/20 pt-12 md:pt-16">
          <p className="font-body text-[15px] md:text-[16px] text-text-secondary leading-[1.7] mb-6 max-w-lg mx-auto">
            {t.relevanceGate.ctaIntro}
          </p>

          <a
            href="/audit"
            className="inline-flex items-center gap-2 bg-rifc-red hover:bg-red-500 text-white font-bold px-8 py-4 rounded-sm transition-colors duration-200 font-body text-[15px] mb-10"
          >
            <ArrowRight size={16} strokeWidth={2} />
            {t.relevanceGate.ctaButton}
          </a>

          <div className="mt-6">
            <p className="font-heading text-[18px] md:text-[22px] font-light text-red-400/70 leading-[1.4] mb-4">
              {t.relevanceGate.transitionText}
            </p>
            <a
              href={t.relevanceGate.transitionTarget}
              className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
            >
              <ChevronDown
                size={16}
                strokeWidth={2}
                className="animate-bounce"
              />
              {t.relevanceGate.transitionCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
