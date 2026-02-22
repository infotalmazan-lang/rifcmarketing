"use client";

import { CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey, CWAgentStatus } from "@/types/copywrite";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  agentStatuses: Record<CWAgentKey, CWAgentStatus>;
  liveScores: Record<CWAgentKey, number>;
  overallScore: number;
}

export default function SummaryStrip({
  agentStatuses,
  liveScores,
  overallScore,
}: Props) {
  return (
    <div className="flex items-center gap-4 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/5">
      {AGENT_KEYS.map((key) => {
        const colors = CW_AGENT_COLORS[key];
        const status = agentStatuses[key];
        const score = liveScores[key];

        return (
          <div key={key} className="flex items-center gap-2">
            {/* Status indicator */}
            <div
              className={`w-2 h-2 rounded-full ${
                status === "done"
                  ? ""
                  : status === "running"
                  ? "animate-pulse"
                  : "opacity-30"
              }`}
              style={{ background: colors.hex }}
            />
            <span
              className="font-cw-mono text-[10px] font-bold"
              style={{ color: colors.hex }}
            >
              {key}
            </span>
            <span className="font-cw-mono text-xs text-text-primary">
              {status === "done" ? score.toFixed(1) : status === "running" ? "..." : "—"}
            </span>
          </div>
        );
      })}

      {/* Separator */}
      <div className="w-px h-4 bg-white/10 mx-1" />

      {/* Total */}
      <div className="flex items-center gap-2">
        <span className="font-cw-mono text-[10px] text-text-ghost">RIFC</span>
        <span className="font-cw-heading font-bold text-sm text-text-primary">
          {overallScore > 0 ? overallScore.toFixed(0) : "—"}
        </span>
      </div>
    </div>
  );
}
