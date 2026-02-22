"use client";

import { CW_AGENTS, CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey, CWAgentStatus } from "@/types/copywrite";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  agentStatuses: Record<CWAgentKey, CWAgentStatus>;
  activeAgent: CWAgentKey | null;
}

export default function SubfactorPanel({ agentStatuses, activeAgent }: Props) {
  const currentKey = activeAgent || AGENT_KEYS.find((k) => agentStatuses[k] === "running") || "R";
  const agent = CW_AGENTS[currentKey];
  const colors = CW_AGENT_COLORS[currentKey];
  const status = agentStatuses[currentKey];

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/10 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: `rgba(${colors.rgb},0.15)`,
            border: `1px solid rgba(${colors.rgb},0.3)`,
          }}
        >
          <span
            className="font-cw-heading text-[9px] font-bold"
            style={{ color: colors.hex }}
          >
            {currentKey}
          </span>
        </div>
        <span className="font-cw-heading text-xs font-semibold text-text-primary">
          {agent.name}
        </span>
        <span
          className={`ml-auto font-cw-mono text-[9px] px-2 py-0.5 rounded-full ${
            status === "done"
              ? "bg-cwAgent-C/10 text-cwAgent-C"
              : status === "running"
              ? "bg-cwAgent-I/10 text-cwAgent-I animate-pulse"
              : "bg-white/5 text-text-ghost"
          }`}
        >
          {status === "done" ? "Complet" : status === "running" ? "Analizeaza..." : "In asteptare"}
        </span>
      </div>

      {/* Subfactor dots */}
      <div className="flex flex-wrap gap-2">
        {agent.subfactors.map((sfName, i) => {
          const sfId = `${currentKey}${i + 1}`;
          return (
            <div
              key={sfId}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/[0.02]"
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  status === "done" ? "" : status === "running" ? "animate-pulse" : "opacity-20"
                }`}
                style={{
                  background: status === "pending" ? "rgba(255,255,255,0.1)" : colors.hex,
                }}
              />
              <span className="font-cw-mono text-[9px] text-text-ghost">
                {sfId}
              </span>
            </div>
          );
        })}
      </div>

      {/* Agent tabs */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
        {AGENT_KEYS.map((key) => {
          const c = CW_AGENT_COLORS[key];
          const s = agentStatuses[key];
          return (
            <div
              key={key}
              className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                s === "done" ? "" : s === "running" ? "animate-pulse" : "opacity-20"
              }`}
              style={{
                background: s === "pending" ? "rgba(255,255,255,0.05)" : c.hex,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
