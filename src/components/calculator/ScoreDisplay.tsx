import type { ScoreRange } from "@/types";

interface Props {
  r: number;
  i: number;
  f: number;
  c: number;
  gatePass: boolean;
  range: ScoreRange;
}

export default function ScoreDisplay({ r, i, f, c, gatePass, range }: Props) {
  return (
    <div className="border border-border-light rounded-sm p-8 bg-surface-card">
      {/* Equation display */}
      <div className="text-center mb-8">
        <div className="font-mono text-[13px] text-text-ghost tracking-[3px] mb-4">
          YOUR SCORE
        </div>
        <div className="font-mono text-[clamp(20px,3vw,32px)] font-light tracking-[2px]">
          <span className="text-rifc-red">{r}</span>
          <span className="text-text-invisible"> + (</span>
          <span className="text-rifc-blue">{i}</span>
          <span className="text-text-invisible"> &times; </span>
          <span className="text-rifc-amber">{f}</span>
          <span className="text-text-invisible">) = </span>
          <span
            className="font-medium text-[clamp(28px,4vw,48px)]"
            style={{ color: gatePass ? range.statusColor : "#DC2626" }}
          >
            {c}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mb-6">
        <div className="h-2 bg-border-light rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((c / 110) * 100, 100)}%`,
              background: gatePass ? range.statusColor : "#DC2626",
            }}
          />
        </div>
        <div className="flex justify-between font-mono text-[10px] text-text-ghost mt-1">
          <span>0</span>
          <span>20</span>
          <span>50</span>
          <span>80</span>
          <span>110</span>
        </div>
      </div>

      {/* Status badge */}
      <div className="text-center">
        <span
          className="font-mono inline-block text-sm tracking-[2px] uppercase px-6 py-2 border rounded-sm"
          style={{
            borderColor: `${gatePass ? range.statusColor : "#DC2626"}80`,
            color: gatePass ? range.statusColor : "#DC2626",
          }}
        >
          {gatePass ? range.status : "Critical Failure"}
        </span>
        <div className="font-body text-sm text-text-muted mt-3">
          {gatePass ? range.label : "Relevance Gate Triggered"}
        </div>
      </div>
    </div>
  );
}
