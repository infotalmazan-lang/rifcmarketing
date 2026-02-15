"use client";

import { useState, useEffect } from "react";
import { Trash2, Calculator } from "lucide-react";
import Link from "next/link";
import type { Calculation } from "@/types";
import { getScoreRange, formatDate } from "@/lib/utils";

export default function CalculationsPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("rifc_calculations") || "[]");
    setCalculations(stored);
  }, []);

  const handleDelete = (id: string) => {
    const updated = calculations.filter((c) => c.id !== id);
    setCalculations(updated);
    localStorage.setItem("rifc_calculations", JSON.stringify(updated));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-3">
            History
          </span>
          <h1 className="text-2xl font-light">
            Saved <strong className="font-semibold">Calculations</strong>
          </h1>
        </div>
        <Link
          href="/calculator"
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-5 py-2.5 border border-border-red-subtle text-rifc-red rounded-sm transition-all duration-300 hover:bg-[rgba(220,38,38,0.1)]"
        >
          <Calculator size={14} /> New
        </Link>
      </div>

      {calculations.length === 0 ? (
        <div className="text-center py-16 border border-border-subtle border-dashed rounded-sm">
          <Calculator size={32} className="text-text-ghost mx-auto mb-4" />
          <p className="font-body text-sm text-text-muted mb-4">
            No saved calculations yet
          </p>
          <Link
            href="/calculator"
            className="font-mono text-[11px] tracking-[2px] uppercase text-rifc-red hover:underline"
          >
            Create your first calculation
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {calculations.map((calc) => {
            const range = getScoreRange(calc.c_score);
            return (
              <div
                key={calc.id}
                className="bg-surface-card border border-border-light rounded-sm p-5 flex items-center gap-6"
              >
                <div
                  className="font-mono text-2xl font-light min-w-[60px] text-center"
                  style={{ color: range.statusColor }}
                >
                  {calc.c_score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm text-text-secondary">
                    R={calc.r_score} &middot; I={calc.i_score} &middot; F=
                    {calc.f_score}
                  </div>
                  <div className="font-body text-xs text-text-ghost mt-1 flex gap-3">
                    <span
                      style={{ color: range.statusColor }}
                    >
                      {range.label}
                    </span>
                    {calc.channel && <span>{calc.channel}</span>}
                    <span>{formatDate(calc.created_at)}</span>
                  </div>
                  {calc.notes && (
                    <div className="font-body text-xs text-text-ghost mt-1 truncate">
                      {calc.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(calc.id)}
                  className="text-text-ghost hover:text-rifc-red transition-colors p-1"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
