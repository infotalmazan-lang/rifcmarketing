"use client";

import { CW_AGENTS, CW_AGENT_COLORS, CW_SF_DESCRIPTIONS } from "@/lib/constants/copywrite";
import type { CWAgentKey } from "@/types/copywrite";

interface Props {
  agentKey: CWAgentKey;
  onClose: () => void;
}

export default function AgentParameterSlider({ agentKey, onClose }: Props) {
  const agent = CW_AGENTS[agentKey];
  const colors = CW_AGENT_COLORS[agentKey];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#12121f] border-l border-white/10 overflow-y-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b"
          style={{
            background: `linear-gradient(135deg, rgba(${colors.rgb},0.05), transparent)`,
            borderColor: `rgba(${colors.rgb},0.1)`,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Agent orb mini */}
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
              <h3 className="font-cw-heading font-semibold text-base text-text-primary">
                {agent.name}
              </h3>
              <p className="font-cw-mono text-[10px] text-text-ghost">
                {agent.subfactors.length} subfactori de analiza
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Description */}
          <p className="font-cw-mono text-xs text-text-secondary leading-relaxed">
            {agent.desc}
          </p>

          {/* Tip */}
          <div
            className="rounded-lg p-4 border"
            style={{
              background: `rgba(${colors.rgb},0.03)`,
              borderColor: `rgba(${colors.rgb},0.1)`,
            }}
          >
            <h4
              className="font-cw-mono text-[10px] tracking-wider uppercase mb-1"
              style={{ color: colors.hex }}
            >
              Sfat
            </h4>
            <p className="font-cw-mono text-xs text-text-secondary">
              {agent.tip}
            </p>
          </div>

          {/* Subfactors */}
          <div>
            <h4 className="font-cw-heading text-xs font-semibold text-text-primary mb-3">
              Subfactori analizati
            </h4>
            <div className="space-y-3">
              {agent.subfactors.map((sfName, i) => {
                const sfId = `${agentKey}${i + 1}`;
                const sfDesc = CW_SF_DESCRIPTIONS[sfId];
                return (
                  <div
                    key={sfId}
                    className="rounded-lg bg-white/[0.02] border border-white/5 p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-cw-mono text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          color: colors.hex,
                          background: `rgba(${colors.rgb},0.1)`,
                        }}
                      >
                        {sfId}
                      </span>
                      <span className="font-cw-heading text-xs font-medium text-text-primary">
                        {sfName}
                      </span>
                    </div>
                    {sfDesc && (
                      <>
                        <p className="font-cw-mono text-[11px] text-text-secondary mb-2">
                          {sfDesc.d}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-md bg-red-500/5 px-2 py-1.5">
                            <span className="font-cw-mono text-[9px] text-red-400 block mb-0.5">
                              Scazut
                            </span>
                            <span className="font-cw-mono text-[10px] text-text-ghost">
                              {sfDesc.low}
                            </span>
                          </div>
                          <div className="rounded-md bg-yellow-500/5 px-2 py-1.5">
                            <span className="font-cw-mono text-[9px] text-yellow-400 block mb-0.5">
                              Mediu
                            </span>
                            <span className="font-cw-mono text-[10px] text-text-ghost">
                              {sfDesc.mid}
                            </span>
                          </div>
                          <div className="rounded-md bg-green-500/5 px-2 py-1.5">
                            <span className="font-cw-mono text-[9px] text-green-400 block mb-0.5">
                              Ridicat
                            </span>
                            <span className="font-cw-mono text-[10px] text-text-ghost">
                              {sfDesc.high}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
