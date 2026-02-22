"use client";

import { useState } from "react";
import { CW_BRAND_FIELDS, CW_FIELD_META } from "@/lib/constants/copywrite";
import type { ExtendedBrandProfile, CWVariant } from "@/types/copywrite";

interface Props {
  fieldKey: string;
  brand: ExtendedBrandProfile;
  brandName: string;
  onBrandChange: (key: keyof ExtendedBrandProfile, value: string) => void;
  onClose: () => void;
}

export default function BrandFieldSlider({
  fieldKey,
  brand,
  brandName,
  onBrandChange,
  onClose,
}: Props) {
  const field = CW_BRAND_FIELDS.find((f) => f.key === fieldKey);
  const meta = CW_FIELD_META[fieldKey];
  const [generating, setGenerating] = useState(false);
  const [variants, setVariants] = useState<CWVariant[]>([]);
  const [helperInputs, setHelperInputs] = useState<Record<string, string>>({});

  if (!field || !meta) return null;

  const currentValue = brand[field.key] || "";

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/copywrite/brand-field", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fieldKey: field.key,
          brand,
          brandName,
          helpers: helperInputs,
        }),
      });
      const data = await res.json();
      if (data.variants) {
        setVariants(
          data.variants.map((v: { text: string; label: string; note: string }) => ({
            ...v,
            saved: false,
          }))
        );
      }
    } catch {
      // silently fail
    } finally {
      setGenerating(false);
    }
  };

  const applyVariant = (text: string) => {
    onBrandChange(field.key, text);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-[#12121f] border-l border-white/10 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#12121f]/95 backdrop-blur-sm border-b border-white/5">
          <div>
            <h3 className="font-cw-heading font-semibold text-base text-text-primary">
              {field.label}
            </h3>
            <p className="font-cw-mono text-[10px] text-text-ghost mt-0.5">
              Camp profil brand
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/5 transition-colors"
          >
            <svg
              className="w-4 h-4 text-text-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Why card */}
          <div className="rounded-lg bg-cwAgent-CTA/5 border border-cwAgent-CTA/10 p-4">
            <h4 className="font-cw-heading text-xs font-semibold text-cwAgent-CTA mb-1">
              De ce conteaza?
            </h4>
            <p className="font-cw-mono text-xs text-text-secondary leading-relaxed">
              {meta.why}
            </p>
          </div>

          {/* Main input */}
          <div>
            <label className="font-cw-mono text-[10px] tracking-wider uppercase text-text-ghost block mb-2">
              Valoare curenta
            </label>
            {field.type === "textarea" ? (
              <textarea
                value={currentValue}
                onChange={(e) => onBrandChange(field.key, e.target.value)}
                placeholder={meta.placeholder}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 font-cw-mono text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-cwAgent-CTA/40 resize-none"
              />
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => onBrandChange(field.key, e.target.value)}
                placeholder={meta.placeholder}
                className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 font-cw-mono text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-cwAgent-CTA/40"
              />
            )}
          </div>

          {/* Example */}
          <div className="rounded-lg bg-white/[0.02] border border-white/5 p-4">
            <h4 className="font-cw-mono text-[10px] tracking-wider uppercase text-text-ghost mb-1.5">
              Exemplu
            </h4>
            <p className="font-cw-serif italic text-sm text-text-secondary">
              {meta.example}
            </p>
          </div>

          {/* AI Helpers */}
          {meta.helpers.length > 0 && (
            <div>
              <h4 className="font-cw-heading text-xs font-semibold text-text-primary mb-3">
                Genereaza cu AI
              </h4>
              <div className="space-y-3">
                {meta.helpers.map((helper) => (
                  <div key={helper.key}>
                    <label className="font-cw-mono text-[10px] text-text-muted block mb-1">
                      {helper.label}
                    </label>
                    <input
                      type="text"
                      value={helperInputs[helper.key] || ""}
                      onChange={(e) =>
                        setHelperInputs((prev) => ({
                          ...prev,
                          [helper.key]: e.target.value,
                        }))
                      }
                      placeholder={helper.placeholder}
                      className="w-full px-3 py-2 rounded-md bg-white/[0.03] border border-white/10 font-cw-mono text-xs text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-cwAgent-CTA/40"
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-cwAgent-CTA/10 border border-cwAgent-CTA/20 text-cwAgent-CTA font-cw-mono text-xs hover:bg-cwAgent-CTA/15 transition-colors disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-cwAgent-CTA/30 border-t-cwAgent-CTA rounded-full animate-spin" />
                    Se genereaza...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v3m6.4 1.6l-2.1 2.1M21 12h-3m-1.6 6.4l-2.1-2.1M12 21v-3m-6.4-1.6l2.1-2.1M3 12h3m1.6-6.4l2.1 2.1" />
                    </svg>
                    Genereaza cu AI
                  </>
                )}
              </button>
            </div>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-cw-heading text-xs font-semibold text-text-primary">
                Variante generate
              </h4>
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white/[0.02] border border-white/10 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-cw-mono text-[10px] text-cwAgent-CTA font-medium">
                      {v.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => applyVariant(v.text)}
                      className="font-cw-mono text-[10px] text-cwAgent-C hover:underline"
                    >
                      Adauga la Brand
                    </button>
                  </div>
                  <p className="font-cw-mono text-xs text-text-secondary leading-relaxed">
                    {v.text}
                  </p>
                  {v.note && (
                    <p className="font-cw-mono text-[10px] text-text-ghost mt-2 italic">
                      {v.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
