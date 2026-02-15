import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  diagnosis: string;
  gatePass: boolean;
  r: number;
  i: number;
  f: number;
}

export default function DiagnosticResult({ diagnosis, gatePass, r, i, f }: Props) {
  const weakest = r <= i && r <= f ? "R" : i <= f ? "I" : "F";
  const strongest = r >= i && r >= f ? "R" : i >= f ? "I" : "F";

  return (
    <div className="space-y-6">
      {/* Diagnosis */}
      <div
        className={`border rounded-sm p-6 ${
          gatePass
            ? "border-border-light bg-surface-card"
            : "border-[rgba(220,38,38,0.4)] bg-[rgba(220,38,38,0.02)]"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          {!gatePass && <AlertTriangle size={16} className="text-rifc-red" />}
          <span className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost">
            Diagnosis
          </span>
        </div>
        <p className="font-body text-sm leading-[1.7] text-text-secondary">
          {diagnosis}
        </p>
      </div>

      {/* Variable breakdown */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "R", value: r, color: "#DC2626" },
          { label: "I", value: i, color: "#2563EB" },
          { label: "F", value: f, color: "#D97706" },
        ].map((v) => (
          <div
            key={v.label}
            className="border border-border-light rounded-sm p-4 text-center bg-surface-card"
          >
            <div className="font-mono text-[11px] tracking-[2px] mb-1" style={{ color: v.color }}>
              {v.label}
            </div>
            <div className="font-mono text-2xl font-light" style={{ color: v.color }}>
              {v.value}
            </div>
            <div className="mt-2">
              {v.label === weakest && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-red">
                  <TrendingDown size={10} /> WEAKEST
                </span>
              )}
              {v.label === strongest && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-green">
                  <TrendingUp size={10} /> STRONGEST
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div className="border border-border-light rounded-sm p-6 bg-surface-card">
        <div className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-3">
          Priority
        </div>
        <p className="font-body text-sm leading-[1.7] text-text-muted">
          {!gatePass
            ? "Fix Relevance first. No amount of Interest or Form improvement will save a message sent to the wrong audience."
            : weakest === "R"
              ? "Improve your targeting and audience alignment. Make sure the message reaches people who actually need it."
              : weakest === "I"
                ? "Strengthen your value proposition. What unique, specific benefit are you offering? Make it impossible to ignore."
                : "Upgrade your formatting and design. The same content, better packaged, can multiply your results."}
        </p>
      </div>
    </div>
  );
}
