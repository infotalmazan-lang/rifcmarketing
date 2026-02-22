"use client";

import { CW_BRAND_FIELDS } from "@/lib/constants/copywrite";
import type { ExtendedBrandProfile } from "@/types/copywrite";

interface Props {
  brand: ExtendedBrandProfile;
  onOpenField: (fieldKey: string) => void;
}

export default function BrandProfilePanel({ brand, onOpenField }: Props) {
  const filledCount = CW_BRAND_FIELDS.filter(
    (f) => brand[f.key] && brand[f.key].trim().length > 0
  ).length;
  const progress = Math.round((filledCount / CW_BRAND_FIELDS.length) * 100);

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-cw-heading font-semibold text-sm text-text-primary">
          Profilul Brandului
        </h3>
        <span className="font-cw-mono text-[10px] text-text-muted">
          {filledCount}/{CW_BRAND_FIELDS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 mb-5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cwAgent-R via-cwAgent-F to-cwAgent-CTA transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Field list */}
      <div className="space-y-1.5">
        {CW_BRAND_FIELDS.map((field) => {
          const filled = brand[field.key] && brand[field.key].trim().length > 0;
          return (
            <button
              key={field.key}
              type="button"
              onClick={() => onOpenField(field.key)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.03] transition-colors text-left group"
            >
              {/* Status dot */}
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  filled ? "bg-cwAgent-C" : "bg-white/10"
                }`}
              />

              {/* Label */}
              <span
                className={`font-cw-mono text-xs flex-1 ${
                  filled ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {field.label}
              </span>

              {/* Preview or "+" */}
              {filled ? (
                <span className="font-cw-mono text-[10px] text-text-ghost truncate max-w-[100px]">
                  {brand[field.key].slice(0, 20)}...
                </span>
              ) : (
                <span className="font-cw-mono text-[10px] text-cwAgent-CTA opacity-0 group-hover:opacity-100 transition-opacity">
                  + Adauga
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
