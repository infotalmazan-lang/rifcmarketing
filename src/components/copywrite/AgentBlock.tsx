"use client";

import { useState } from "react";
import { CW_AGENTS, CW_AGENT_COLORS, CW_SF_DESCRIPTIONS } from "@/lib/constants/copywrite";
import type { CWAgentKey, CWAgentResult } from "@/types/copywrite";

interface Props {
  agentKey: CWAgentKey;
  result: CWAgentResult;
}

export default function AgentBlock({ agentKey, result }: Props) {
  const [selectedSf, setSelectedSf] = useState<number>(0);
  const agent = CW_AGENTS[agentKey];
  const colors = CW_AGENT_COLORS[agentKey];

  const selectedSubfactor = result.subfactors[selectedSf];
  const sfId = selectedSubfactor?.id || `${agentKey}1`;
  const sfDesc = CW_SF_DESCRIPTIONS[sfId];

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: `linear-gradient(135deg, rgba(${colors.rgb},0.02), transparent)`,
        borderColor: `rgba(${colors.rgb},0.1)`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle at 35% 35%, rgba(${colors.rgb},0.3), transparent 70%)`,
            border: `2px solid rgba(${colors.rgb},0.3)`,
          }}
        >
          <span
            className="font-cw-heading font-bold text-sm"
            style={{ color: colors.hex }}
          >
            {agentKey}
          </span>
        </div>
        <div>
          <h3 className="font-cw-heading font-semibold text-sm text-text-primary">
            {agent.name}
          </h3>
          <p className="font-cw-mono text-[10px] text-text-ghost">
            {agent.subfactors.length} subfactori
          </p>
        </div>
        <div className="ml-auto text-right">
          <span
            className="font-cw-heading font-bold text-2xl"
            style={{ color: colors.hex }}
          >
            {result.score.toFixed(1)}
          </span>
          <span className="font-cw-mono text-[10px] text-text-ghost block">
            / 10
          </span>
        </div>
      </div>

      {/* Justification */}
      <p className="font-cw-mono text-xs text-text-secondary leading-relaxed mb-4">
        {result.justification}
      </p>

      {/* Split layout: subfactor list + detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: subfactor list */}
        <div className="space-y-1">
          {result.subfactors.map((sf, i) => {
            const isActive = i === selectedSf;
            return (
              <button
                key={sf.id}
                type="button"
                onClick={() => setSelectedSf(i)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  isActive
                    ? "bg-white/[0.04]"
                    : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Score bar */}
                <div className="w-16 h-1.5 rounded-full bg-white/5 flex-shrink-0 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${sf.score * 10}%`,
                      background: colors.hex,
                    }}
                  />
                </div>
                <span className="font-cw-mono text-[10px] text-text-ghost w-6">
                  {sf.id}
                </span>
                <span
                  className={`font-cw-mono text-xs flex-1 truncate ${
                    isActive ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {sf.name}
                </span>
                <span
                  className="font-cw-mono text-xs font-bold"
                  style={{ color: sf.score >= 7 ? "#22c55e" : sf.score >= 4 ? "#eab308" : "#ef4444" }}
                >
                  {sf.score}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: selected subfactor detail */}
        <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
          {selectedSubfactor && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-cw-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    color: colors.hex,
                    background: `rgba(${colors.rgb},0.1)`,
                  }}
                >
                  {selectedSubfactor.id}
                </span>
                <span className="font-cw-heading text-xs font-medium text-text-primary">
                  {selectedSubfactor.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-cw-heading font-bold text-xl"
                  style={{ color: colors.hex }}
                >
                  {selectedSubfactor.score}
                </span>
                <span className="font-cw-mono text-[10px] text-text-ghost">
                  / 10
                </span>
              </div>

              {/* Finding */}
              <p className="font-cw-mono text-xs text-text-secondary leading-relaxed mb-3">
                {selectedSubfactor.justification || "—"}
              </p>

              {/* Description from constants */}
              {sfDesc && (
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <p className="font-cw-mono text-[10px] text-text-ghost">
                    {sfDesc.d}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="rounded px-2 py-1 bg-red-500/5">
                      <span className="font-cw-mono text-[8px] text-red-400 block">Scazut</span>
                      <span className="font-cw-mono text-[9px] text-text-ghost">{sfDesc.low}</span>
                    </div>
                    <div className="rounded px-2 py-1 bg-yellow-500/5">
                      <span className="font-cw-mono text-[8px] text-yellow-400 block">Mediu</span>
                      <span className="font-cw-mono text-[9px] text-text-ghost">{sfDesc.mid}</span>
                    </div>
                    <div className="rounded px-2 py-1 bg-green-500/5">
                      <span className="font-cw-mono text-[8px] text-green-400 block">Ridicat</span>
                      <span className="font-cw-mono text-[9px] text-text-ghost">{sfDesc.high}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
