"use client";

import { useTranslation } from "@/lib/i18n";
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import {
  GradientBorderBlock,
  VARIABLE_COLORS,
} from "@/components/ui/V2Elements";

interface Props {
  diagnosis: string;
  gatePass: boolean;
  r: number;
  i: number;
  f: number;
}

export default function DiagnosticResult({ diagnosis, gatePass, r, i, f }: Props) {
  const { t } = useTranslation();
  const weakest = r <= i && r <= f ? "R" : i <= f ? "I" : "F";
  const strongest = r >= i && r >= f ? "R" : i >= f ? "I" : "F";

  const weakColor = VARIABLE_COLORS[weakest as keyof typeof VARIABLE_COLORS];

  return (
    <div className="space-y-4">
      {/* Diagnosis */}
      <GradientBorderBlock
        gradientFrom={gatePass ? weakColor : "#DC2626"}
        gradientTo={gatePass ? "#D97706" : "#D97706"}
        bgTint={gatePass ? "transparent" : "rgba(220,38,38,0.02)"}
        headerLabel={t.calculator.diagnosis}
        headerColor={gatePass ? weakColor : "#DC2626"}
      >
        <div className="flex items-start gap-2">
          {!gatePass && <AlertTriangle size={16} className="text-rifc-red shrink-0 mt-0.5" />}
          <p className="font-body text-sm leading-[1.7] text-text-secondary">
            {diagnosis}
          </p>
        </div>
      </GradientBorderBlock>

      {/* Variable breakdown with V2 large numbers */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "R", value: r, color: VARIABLE_COLORS.R },
          { label: "I", value: i, color: VARIABLE_COLORS.I },
          { label: "F", value: f, color: VARIABLE_COLORS.F },
        ].map((v) => (
          <div
            key={v.label}
            className="border border-border-light rounded-sm p-4 text-center bg-surface-card relative overflow-hidden"
          >
            <div className="font-mono text-[11px] tracking-[2px] mb-1" style={{ color: v.color }}>
              {v.label}
            </div>
            <div className="font-mono text-[36px] md:text-[44px] font-light leading-none" style={{ color: v.color }}>
              {v.value}
            </div>
            <div className="w-full h-0.5 bg-[rgba(255,255,255,0.06)] rounded-sm mt-2">
              <div
                className="h-full rounded-sm transition-all duration-600 ease-out"
                style={{
                  width: `${(v.value / 10) * 100}%`,
                  backgroundColor: v.color,
                }}
              />
            </div>
            <div className="mt-2">
              {v.label === weakest && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-red">
                  <TrendingDown size={10} /> {t.calculator.weakest}
                </span>
              )}
              {v.label === strongest && (
                <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[1px] text-rifc-green">
                  <TrendingUp size={10} /> {t.calculator.strongest}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <GradientBorderBlock
        gradientFrom="#059669"
        gradientTo="#2563EB"
        bgTint="rgba(5,150,105,0.02)"
        headerLabel={t.calculator.priority}
        headerColor="#059669"
      >
        <p className="font-body text-sm leading-[1.7] text-text-muted">
          {!gatePass
            ? t.calculator.priorityNoGate
            : weakest === "R"
              ? t.calculator.priorityWeakR
              : weakest === "I"
                ? t.calculator.priorityWeakI
                : t.calculator.priorityWeakF}
        </p>
      </GradientBorderBlock>
    </div>
  );
}
