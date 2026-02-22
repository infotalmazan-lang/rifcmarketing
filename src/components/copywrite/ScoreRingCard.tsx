"use client";

interface Props {
  score: number;
  label: string;
  clarityLevel: string;
}

function getScoreColor(score: number): string {
  if (score <= 20) return "#ef4444";
  if (score <= 50) return "#f97316";
  if (score <= 80) return "#eab308";
  return "#22c55e";
}

function getClarityLabel(level: string): string {
  switch (level) {
    case "critical": return "Critic";
    case "noise": return "Zgomot";
    case "medium": return "Mediu";
    case "supreme": return "Suprem";
    default: return level;
  }
}

export default function ScoreRingCard({ score, label, clarityLevel }: Props) {
  const color = getScoreColor(score);
  const maxScore = 110;
  const pct = Math.min(100, (score / maxScore) * 100);
  const r = 70;
  const circumference = 2 * Math.PI * r;
  const strokeDash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        {/* Track */}
        <circle
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={10}
        />
        {/* Score arc */}
        <circle
          cx={100}
          cy={100}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${strokeDash} ${circumference}`}
          transform="rotate(-90 100 100)"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
            transition: "stroke-dasharray 1s ease",
          }}
        />
        {/* Score text */}
        <text
          x={100}
          y={90}
          textAnchor="middle"
          fill="#e8e6e3"
          fontSize={36}
          fontFamily="Syne, sans-serif"
          fontWeight="bold"
        >
          {Math.round(score)}
        </text>
        <text
          x={100}
          y={110}
          textAnchor="middle"
          fill="rgba(232,230,227,0.4)"
          fontSize={10}
          fontFamily="DM Mono, monospace"
          letterSpacing="2"
        >
          / {maxScore}
        </text>
        <text
          x={100}
          y={135}
          textAnchor="middle"
          fill={color}
          fontSize={11}
          fontFamily="Syne, sans-serif"
          fontWeight="600"
        >
          {getClarityLabel(clarityLevel)}
        </text>
      </svg>
      <span className="font-cw-mono text-[10px] tracking-wider uppercase text-text-ghost mt-2">
        {label}
      </span>
    </div>
  );
}
