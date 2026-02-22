"use client";

import { useEffect, useRef, useState } from "react";
import type {
  CWAgentKey,
  CWAgentStatus,
  CWAuditResult,
  ExtendedBrandProfile,
} from "@/types/copywrite";
import { CW_AGENTS } from "@/lib/constants/copywrite";
import ArcVisualization from "./ArcVisualization";
import DNAHelixCanvas from "./DNAHelixCanvas";
import SummaryStrip from "./SummaryStrip";
import SubfactorPanel from "./SubfactorPanel";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  inputText: string;
  brand: ExtendedBrandProfile;
  brandName: string;
  industry: string;
  contentType: string;
  objective: string;
  agentStatuses: Record<CWAgentKey, CWAgentStatus>;
  liveScores: Record<CWAgentKey, number>;
  onAgentStatusChange: (s: Record<CWAgentKey, CWAgentStatus>) => void;
  onLiveScoreChange: (s: Record<CWAgentKey, number>) => void;
  onComplete: (result: CWAuditResult) => void;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function CopywriteProgress({
  inputText,
  brand,
  brandName,
  industry,
  contentType,
  objective,
  agentStatuses,
  liveScores,
  onAgentStatusChange,
  onLiveScoreChange,
  onComplete,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [auditDone, setAuditDone] = useState(false);
  const [resultData, setResultData] = useState<CWAuditResult | null>(null);
  const calledRef = useRef(false);

  const overallScore =
    liveScores.R > 0 && liveScores.I > 0 && liveScores.F > 0
      ? Math.round(liveScores.R + liveScores.I * liveScores.F)
      : 0;

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    async function runAudit() {
      try {
        const res = await fetch("/api/copywrite/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: inputText,
            brand,
            brandName,
            industry,
            contentType,
            objective,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Eroare la audit.");
          return;
        }

        const result = data.result as CWAuditResult;

        // Simulate sequential agent completion with progressive state updates
        const statuses: Record<CWAgentKey, CWAgentStatus> = {
          R: "pending", I: "pending", F: "pending", C: "pending", CTA: "pending",
        };
        const scores: Record<CWAgentKey, number> = {
          R: 0, I: 0, F: 0, C: 0, CTA: 0,
        };

        for (const key of AGENT_KEYS) {
          const agentDuration = Math.min(CW_AGENTS[key].duration / 3, 2000);

          // Set running
          statuses[key] = "running";
          onAgentStatusChange({ ...statuses });

          await delay(agentDuration);

          // Set done + score
          const agentResult = result.agents[key];
          scores[key] = agentResult?.score || 5;
          statuses[key] = "done";
          onAgentStatusChange({ ...statuses });
          onLiveScoreChange({ ...scores });
        }

        setResultData(result);
        setAuditDone(true);
      } catch {
        setError("Eroare de conexiune. Reincearca.");
      }
    }

    runAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="font-cw-heading font-bold text-2xl text-text-primary mb-2">
          Analiza in curs
        </h2>
        <p className="font-cw-mono text-xs text-text-ghost">
          5 agenti AI analizeaza 40 de parametri ai textului tau
        </p>
      </div>

      {/* Main visualization area */}
      <div className="flex flex-col lg:flex-row items-center gap-8 mb-8 w-full max-w-4xl">
        <div className="flex-shrink-0">
          <ArcVisualization
            agentStatuses={agentStatuses}
            liveScores={liveScores}
            overallScore={overallScore}
          />
        </div>

        <div className="flex-shrink-0">
          <DNAHelixCanvas
            agentStatuses={agentStatuses}
            width={160}
            height={320}
          />
        </div>

        <div className="flex-1 min-w-0 w-full">
          <SubfactorPanel
            agentStatuses={agentStatuses}
            activeAgent={
              AGENT_KEYS.find((k) => agentStatuses[k] === "running") || null
            }
          />
        </div>
      </div>

      {/* Summary strip */}
      <div className="w-full max-w-4xl mb-8">
        <SummaryStrip
          agentStatuses={agentStatuses}
          liveScores={liveScores}
          overallScore={overallScore}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 mb-4">
          <p className="font-cw-mono text-xs text-red-400">{error}</p>
        </div>
      )}

      {/* Results button */}
      {auditDone && resultData && (
        <button
          onClick={() => onComplete(resultData)}
          className="flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cwAgent-C/20 to-cwAgent-CTA/20 border border-cwAgent-C/20 hover:border-cwAgent-C/40 font-cw-heading font-semibold text-base text-text-primary transition-all duration-300 hover:scale-[1.02]"
        >
          <svg
            className="w-5 h-5 text-cwAgent-C"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Vezi Rezultatele
        </button>
      )}
    </div>
  );
}
