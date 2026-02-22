"use client";

import { CW_AGENTS, CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey, CWAgentStatus } from "@/types/copywrite";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];
const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R_ARC = 120;

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

interface Props {
  agentStatuses: Record<CWAgentKey, CWAgentStatus>;
  liveScores: Record<CWAgentKey, number>;
  overallScore: number;
}

export default function ArcVisualization({
  agentStatuses,
  liveScores,
  overallScore,
}: Props) {
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[300px] mx-auto"
    >
      {/* Background arc track */}
      <path
        d={describeArc(CX, CY, R_ARC, 0, 360)}
        fill="none"
        stroke="rgba(255,255,255,0.03)"
        strokeWidth={8}
      />

      {/* Agent arc segments */}
      {AGENT_KEYS.map((key) => {
        const agent = CW_AGENTS[key];
        const colors = CW_AGENT_COLORS[key];
        const status = agentStatuses[key];
        const score = liveScores[key];

        const opacity =
          status === "done" ? 1 : status === "running" ? 0.6 : 0.15;

        // Tick marks along arc
        const tickCount = agent.subfactors.length;
        const arcSpan = agent.arcEnd - agent.arcStart;
        const ticks = Array.from({ length: tickCount }, (_, i) => {
          const angle = agent.arcStart + (arcSpan / (tickCount + 1)) * (i + 1);
          const inner = polarToCartesian(CX, CY, R_ARC - 5, angle);
          const outer = polarToCartesian(CX, CY, R_ARC + 5, angle);
          return { inner, outer, angle };
        });

        // Node position
        const nodePos = polarToCartesian(CX, CY, R_ARC, agent.nodeAngle);

        return (
          <g key={key} style={{ opacity }}>
            {/* Arc segment */}
            <path
              d={describeArc(CX, CY, R_ARC, agent.arcStart, agent.arcEnd)}
              fill="none"
              stroke={colors.hex}
              strokeWidth={status === "running" ? 6 : 4}
              strokeLinecap="round"
              style={{
                filter:
                  status === "running"
                    ? `drop-shadow(0 0 8px rgba(${colors.rgb},0.5))`
                    : undefined,
                transition: "all 0.5s ease",
              }}
            />

            {/* Tick marks */}
            {ticks.map((tick, i) => (
              <line
                key={i}
                x1={tick.inner.x}
                y1={tick.inner.y}
                x2={tick.outer.x}
                y2={tick.outer.y}
                stroke={colors.hex}
                strokeWidth={1}
                opacity={0.4}
              />
            ))}

            {/* Node circle */}
            <circle
              cx={nodePos.x}
              cy={nodePos.y}
              r={status === "done" ? 14 : 10}
              fill={`rgba(${colors.rgb},0.15)`}
              stroke={colors.hex}
              strokeWidth={status === "running" ? 2 : 1}
              style={{
                filter:
                  status === "running"
                    ? `drop-shadow(0 0 6px rgba(${colors.rgb},0.4))`
                    : undefined,
                transition: "all 0.3s ease",
              }}
            />

            {/* Node label */}
            <text
              x={nodePos.x}
              y={nodePos.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={colors.hex}
              fontSize={status === "done" ? 9 : 7}
              fontFamily="Syne, sans-serif"
              fontWeight="bold"
            >
              {status === "done" ? score.toFixed(1) : key}
            </text>
          </g>
        );
      })}

      {/* Center orb — overall score */}
      <circle
        cx={CX}
        cy={CY}
        r={36}
        fill="rgba(255,255,255,0.02)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={1}
      />
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#e8e6e3"
        fontSize={20}
        fontFamily="Syne, sans-serif"
        fontWeight="bold"
      >
        {overallScore > 0 ? overallScore.toFixed(0) : "—"}
      </text>
      <text
        x={CX}
        y={CY + 12}
        textAnchor="middle"
        fill="rgba(232,230,227,0.4)"
        fontSize={7}
        fontFamily="DM Mono, monospace"
        letterSpacing="1.5"
      >
        RIFC
      </text>
    </svg>
  );
}
