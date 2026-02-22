"use client";

import { CW_AGENTS, CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey } from "@/types/copywrite";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  onOpenAgent: (key: CWAgentKey) => void;
}

export default function AgentInfoCard({ onOpenAgent }: Props) {
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
      <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-1">
        Ce se va intampla
      </h3>
      <p className="font-cw-mono text-[10px] text-text-ghost mb-4">
        5 agenti AI vor analiza textul tau pe 40 de parametri
      </p>

      {/* Formula */}
      <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5">
        <span className="font-cw-mono text-xs text-cwAgent-R font-bold">R</span>
        <span className="font-cw-mono text-xs text-text-ghost">+</span>
        <span className="font-cw-mono text-xs text-text-ghost">(</span>
        <span className="font-cw-mono text-xs text-cwAgent-I font-bold">I</span>
        <span className="font-cw-mono text-xs text-text-ghost">x</span>
        <span className="font-cw-mono text-xs text-cwAgent-F font-bold">F</span>
        <span className="font-cw-mono text-xs text-text-ghost">)</span>
        <span className="font-cw-mono text-xs text-text-ghost">=</span>
        <span className="font-cw-mono text-xs text-cwAgent-C font-bold">C</span>
        <span className="font-cw-mono text-xs text-text-ghost mx-1">|</span>
        <span className="font-cw-mono text-xs text-cwAgent-CTA font-bold">CTA</span>
      </div>

      {/* Agent list */}
      <div className="space-y-2">
        {AGENT_KEYS.map((key) => {
          const agent = CW_AGENTS[key];
          const colors = CW_AGENT_COLORS[key];
          return (
            <button
              key={key}
              type="button"
              onClick={() => onOpenAgent(key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors text-left group"
            >
              {/* Orb mini */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `radial-gradient(circle at 35% 35%, rgba(${colors.rgb},0.3), transparent 70%)`,
                  border: `1.5px solid rgba(${colors.rgb},0.3)`,
                }}
              >
                <span
                  className="font-cw-heading font-bold text-[10px]"
                  style={{ color: colors.hex }}
                >
                  {key}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="font-cw-heading text-xs font-semibold text-text-primary">
                  {agent.name}
                </div>
                <div className="font-cw-mono text-[10px] text-text-ghost">
                  {agent.subfactors.length} subfactori
                </div>
              </div>

              {/* Arrow */}
              <svg
                className="w-3.5 h-3.5 text-text-ghost opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
}
