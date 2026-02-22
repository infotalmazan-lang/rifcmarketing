"use client";

import type { CWAuditResult, CWRecommendation } from "@/types/copywrite";
import { CW_AGENT_COLORS } from "@/lib/constants/copywrite";

interface Props {
  result: CWAuditResult;
}

export default function InsightsGrid({ result }: Props) {
  // Build insights from recommendations + archetype
  const warnings: { text: string; color: string }[] = [];
  const successes: { text: string; color: string }[] = [];

  // Archetype warnings
  if (result.archetype === "invisible_phantom") {
    warnings.push({
      text: "Fantoma Invizibila — Continut perfect, audienta gresita. R < 3.",
      color: "#ef4444",
    });
  }
  if (result.archetype === "aesthetic_noise") {
    warnings.push({
      text: "Zgomot Estetic — Vizual impecabil, mesaj gol. F ridicat, I scazut.",
      color: "#f97316",
    });
  }
  if (result.archetype === "buried_diamond") {
    warnings.push({
      text: "Diamant Ingropat — Valoare mare, ambalaj prost. I ridicat, F scazut.",
      color: "#a855f7",
    });
  }

  // Score-based insights
  if (result.r >= 7) successes.push({ text: `Relevanta excelenta (${result.r.toFixed(1)})`, color: CW_AGENT_COLORS.R.hex });
  if (result.r < 4) warnings.push({ text: `Relevanta critica (${result.r.toFixed(1)}) — revizuieste audienta`, color: CW_AGENT_COLORS.R.hex });

  if (result.cta >= 7) successes.push({ text: `CTA puternic (${result.cta.toFixed(1)})`, color: CW_AGENT_COLORS.CTA.hex });
  if (result.cta < 4) warnings.push({ text: `CTA slab (${result.cta.toFixed(1)}) — adauga urgenta si claritate`, color: CW_AGENT_COLORS.CTA.hex });

  if (result.rifc >= 70) successes.push({ text: `Scor RIFC solid: ${result.rifc.toFixed(0)}/110`, color: "#22c55e" });

  return (
    <div className="space-y-4">
      <h3 className="font-cw-heading font-semibold text-sm text-text-primary">
        Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Warnings */}
        {warnings.map((w, i) => (
          <div
            key={`w-${i}`}
            className="flex items-start gap-3 px-4 py-3 rounded-lg border"
            style={{
              background: `${w.color}08`,
              borderColor: `${w.color}20`,
            }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke={w.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="font-cw-mono text-xs text-text-secondary">
              {w.text}
            </span>
          </div>
        ))}

        {/* Successes */}
        {successes.map((s, i) => (
          <div
            key={`s-${i}`}
            className="flex items-start gap-3 px-4 py-3 rounded-lg border"
            style={{
              background: `${s.color}08`,
              borderColor: `${s.color}20`,
            }}
          >
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke={s.color}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="font-cw-mono text-xs text-text-secondary">
              {s.text}
            </span>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="mt-4">
          <h4 className="font-cw-heading text-xs font-semibold text-text-primary mb-3">
            Recomandari ({result.recommendations.length})
          </h4>
          <div className="space-y-2">
            {result.recommendations.map((rec: CWRecommendation, i: number) => {
              const agentColor = CW_AGENT_COLORS[rec.agent]?.hex || "#888";
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 px-4 py-3 rounded-lg bg-white/[0.02] border border-white/5"
                >
                  <span
                    className="font-cw-mono text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      color: agentColor,
                      background: `${agentColor}15`,
                    }}
                  >
                    {rec.agent}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-cw-mono text-xs text-text-primary">
                      {rec.action}
                    </p>
                    <p className="font-cw-mono text-[10px] text-text-ghost mt-0.5">
                      Impact: {rec.impact}
                    </p>
                  </div>
                  <span
                    className={`font-cw-mono text-[9px] px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                      rec.priority === "high"
                        ? "bg-red-500/10 text-red-400"
                        : rec.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-white/5 text-text-ghost"
                    }`}
                  >
                    {rec.priority}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
