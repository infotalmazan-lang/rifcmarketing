"use client";

import { useTranslation } from "@/lib/i18n";
import type { ScoreRange } from "@/types";
import {
  WatermarkNumber,
  StampBadge,
  HeroScore,
  ScoreTrio,
  FormulaDisplay,
  getScoreColor,
  getScoreZone,
} from "@/components/ui/V2Elements";

interface Props {
  r: number;
  i: number;
  f: number;
  c: number;
  gatePass: boolean;
  range: ScoreRange;
}

export default function ScoreDisplay({ r, i, f, c, gatePass, range }: Props) {
  const { t } = useTranslation();
  const scoreColor = gatePass ? range.statusColor : "#DC2626";
  const zone = gatePass ? getScoreZone(c) : "Critical";

  return (
    <div className="border border-border-light rounded-sm p-6 md:p-8 bg-surface-card relative overflow-hidden">
      {/* Watermark */}
      <WatermarkNumber
        value={c}
        color={scoreColor}
        size="lg"
        className="-top-[30px] -right-[20px]"
      />

      {/* Stamp */}
      <div className="absolute top-4 right-4 z-[2]">
        <StampBadge
          text={gatePass ? range.status : t.calculator.criticalFailure}
          color={scoreColor}
        />
      </div>

      <div className="relative z-[1]">
        {/* Score label */}
        <div className="font-mono text-[11px] text-text-ghost tracking-[3px] text-center mb-4">
          {t.calculator.yourScore}
        </div>

        {/* Hero Score */}
        <HeroScore
          score={c}
          color={scoreColor}
          zoneLabel={`${gatePass ? range.label : t.calculator.relevanceGateTriggered}`}
          subLabel={!gatePass ? t.calculator.relevanceGateTriggered : undefined}
          size="lg"
        />

        {/* Score Trio */}
        <ScoreTrio
          r={r}
          i={i}
          f={f}
          labels={{
            r: t.calculator.rLabel,
            i: t.calculator.iLabel,
            f: t.calculator.fLabel,
          }}
          size="md"
          className="mt-6"
        />

        {/* Formula */}
        <FormulaDisplay
          r={r}
          i={i}
          f={f}
          c={c}
          cColor={scoreColor}
          className="mt-4"
        />

        {/* Score progress bar */}
        <div className="mt-6">
          <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((c / 110) * 100, 100)}%`,
                background: scoreColor,
              }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-text-ghost mt-1">
            <span>0</span>
            <span>20</span>
            <span>50</span>
            <span>80</span>
            <span>110</span>
          </div>
        </div>
      </div>
    </div>
  );
}
