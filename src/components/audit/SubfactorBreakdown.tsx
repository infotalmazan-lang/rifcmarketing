"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import type { SubfactorScore } from "@/types";
import {
  R_SUBFACTORS,
  I_SUBFACTORS,
  F_SUBFACTORS,
  C_SUBFACTORS,
  VARIABLE_COLORS,
} from "@/lib/constants/subfactors";
import type { RIFCVariable, Subfactor } from "@/lib/constants/subfactors";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";

interface SubfactorBreakdownProps {
  subfactors: SubfactorScore[];
}

const VARIABLE_GROUPS: { variable: RIFCVariable; label: string; factors: readonly Subfactor[] }[] = [
  { variable: "R", label: "RELEVANCE", factors: R_SUBFACTORS },
  { variable: "I", label: "INTEREST", factors: I_SUBFACTORS },
  { variable: "F", label: "FORM", factors: F_SUBFACTORS },
  { variable: "C", label: "CLARITY", factors: C_SUBFACTORS },
];

function ScoreBar({ score, color, critical }: { score: number; color: string; critical: boolean }) {
  const pct = (score / 10) * 100;
  const barColor = score <= 3 ? "#D97B7B" : score <= 6 ? "#E5B45A" : color;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
      <div
        style={{
          flex: 1,
          height: 6,
          backgroundColor: "#21262D",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: barColor,
            borderRadius: 3,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: barColor,
          minWidth: 24,
          textAlign: "right",
        }}
      >
        {score}
      </span>
      {critical && (
        <AlertTriangle size={12} style={{ color: "#E5B45A", flexShrink: 0 }} />
      )}
    </div>
  );
}

function VariableGroup({
  variable,
  label,
  factors,
  scores,
  defaultOpen,
}: {
  variable: RIFCVariable;
  label: string;
  factors: readonly Subfactor[];
  scores: SubfactorScore[];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const { t } = useTranslation();
  const color = VARIABLE_COLORS[variable];

  const avg =
    scores.length > 0
      ? Math.round((scores.reduce((sum, s) => sum + s.score, 0) / scores.length) * 10) / 10
      : 0;

  // Get subfactor names from i18n anatomy
  const anatomyVar = t.anatomy?.variables?.find((v) => v.letter === variable);

  return (
    <div
      style={{
        border: `1px solid ${open ? color + "33" : "#21262D"}`,
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          padding: "12px 14px",
          background: open ? `${color}0A` : "#161B22",
          border: "none",
          cursor: "pointer",
          color: "#E6EDF3",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 28,
            height: 28,
            borderRadius: 6,
            backgroundColor: color + "20",
            color,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {variable}
        </span>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, textAlign: "left" }}>
          {anatomyVar?.title || label}
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color }}>{avg}</span>
        <span style={{ fontSize: 11, color: "#6B7280" }}>/ 10</span>
        {open ? (
          <ChevronUp size={16} style={{ color: "#6B7280" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "#6B7280" }} />
        )}
      </button>

      {open && (
        <div style={{ padding: "4px 14px 14px" }}>
          {factors.map((sf, idx) => {
            const scoreData = scores.find((s) => s.id === sf.id);
            const score = scoreData?.score ?? 5;
            const justification = scoreData?.justification || "";
            const anatomyFactor = anatomyVar?.factors[idx];

            return (
              <div
                key={sf.id}
                style={{
                  padding: "10px 0",
                  borderBottom: idx < factors.length - 1 ? "1px solid #21262D" : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#6B7280", minWidth: 24 }}>{sf.id}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#E6EDF3", flex: 1 }}>
                    {anatomyFactor?.name || sf.name}
                  </span>
                  {sf.critical && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: "1px 6px",
                        borderRadius: 4,
                        backgroundColor: "#E5B45A20",
                        color: "#E5B45A",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {t.audit.subfactorCriticalLabel}
                    </span>
                  )}
                </div>
                <ScoreBar score={score} color={color} critical={sf.critical} />
                {justification && (
                  <p
                    style={{
                      margin: "6px 0 0 32px",
                      fontSize: 12,
                      color: "#9CA3AF",
                      lineHeight: 1.5,
                    }}
                  >
                    {justification}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SubfactorBreakdown({ subfactors }: SubfactorBreakdownProps) {
  return (
    <div>
      {VARIABLE_GROUPS.map((group, idx) => {
        const groupScores = subfactors.filter((sf) => sf.id.startsWith(group.variable));
        return (
          <VariableGroup
            key={group.variable}
            variable={group.variable}
            label={group.label}
            factors={group.factors}
            scores={groupScores}
            defaultOpen={idx === 0}
          />
        );
      })}
    </div>
  );
}
