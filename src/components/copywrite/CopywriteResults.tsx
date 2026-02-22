"use client";

import type { CWAgentKey, CWAuditResult, CWSliderType, ExtendedBrandProfile } from "@/types/copywrite";
import { CW_AGENT_COLORS, CW_INDUSTRY_AVERAGES } from "@/lib/constants/copywrite";
import ScoreRingCard from "./ScoreRingCard";
import AgentBlock from "./AgentBlock";
import InsightsGrid from "./InsightsGrid";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  result: CWAuditResult;
  brand: ExtendedBrandProfile;
  brandName: string;
  industry: string;
  sliderType: CWSliderType;
  sliderAgent: CWAgentKey | null;
  onOpenAgent: (key: CWAgentKey) => void;
  onCloseSlider: () => void;
  onRestart: () => void;
}

export default function CopywriteResults({
  result,
  brandName,
  industry,
  onRestart,
}: Props) {
  return (
    <div className="min-h-screen px-6 py-12 max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-cw-heading font-bold text-2xl text-text-primary">
            Rezultate Audit
          </h2>
          <p className="font-cw-mono text-xs text-text-ghost mt-1">
            {brandName} | {industry} | {result.config.contentType} |{" "}
            {(result.duration / 1000).toFixed(1)}s
          </p>
        </div>
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 font-cw-mono text-xs text-text-secondary transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Audit Nou
        </button>
      </div>

      {/* Score ring + agent scores overview */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 mb-10">
        {/* Score ring */}
        <div className="flex flex-col items-center justify-center rounded-xl bg-white/[0.02] border border-white/10 p-6">
          <ScoreRingCard
            score={result.rifc}
            label="Scor RIFC Total"
            clarityLevel={result.clarityLevel}
          />
          <p className="font-cw-mono text-xs text-text-secondary text-center mt-4 leading-relaxed max-w-sm">
            {result.diagnosis}
          </p>
        </div>

        {/* Agent score bars + benchmark */}
        <div className="rounded-xl bg-white/[0.02] border border-white/10 p-6">
          <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-4">
            Scoruri pe Agenti vs. Benchmark Industrie
          </h3>
          <div className="space-y-4">
            {AGENT_KEYS.map((key) => {
              const agentResult = result.agents[key];
              const colors = CW_AGENT_COLORS[key];
              const benchmark = CW_INDUSTRY_AVERAGES[key] || 5;
              const score = agentResult?.score || 0;
              const pct = (score / 10) * 100;
              const benchPct = (benchmark / 10) * 100;

              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-cw-heading font-bold text-xs"
                        style={{ color: colors.hex }}
                      >
                        {key}
                      </span>
                      <span className="font-cw-mono text-[10px] text-text-ghost">
                        {agentResult?.subfactors.length || 0} subfactori
                      </span>
                    </div>
                    <span
                      className="font-cw-heading font-bold text-sm"
                      style={{ color: colors.hex }}
                    >
                      {score.toFixed(1)}
                    </span>
                  </div>
                  <div className="relative w-full h-3 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${colors.hex}80, ${colors.hex})`,
                      }}
                    />
                    <div
                      className="absolute top-0 h-full w-0.5 bg-white/30"
                      style={{ left: `${benchPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-cw-mono text-[9px] text-text-ghost">0</span>
                    <span className="font-cw-mono text-[9px] text-text-ghost">
                      Benchmark: {benchmark.toFixed(1)}
                    </span>
                    <span className="font-cw-mono text-[9px] text-text-ghost">10</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agent blocks */}
      <div className="space-y-6 mb-10">
        <h3 className="font-cw-heading font-semibold text-base text-text-primary">
          Analiza detaliata pe agenti
        </h3>
        {AGENT_KEYS.map((key) => {
          const agentResult = result.agents[key];
          if (!agentResult) return null;
          return <AgentBlock key={key} agentKey={key} result={agentResult} />;
        })}
      </div>

      {/* Insights */}
      <div className="mb-10">
        <InsightsGrid result={result} />
      </div>

      {/* Restart */}
      <div className="text-center pt-8 border-t border-white/5">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cwAgent-R/20 via-cwAgent-F/20 to-cwAgent-CTA/20 border border-white/10 hover:border-white/20 font-cw-heading font-semibold text-base text-text-primary transition-all duration-300 hover:scale-[1.02]"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
          </svg>
          Ruleaza Alt Audit
        </button>
      </div>
    </div>
  );
}
