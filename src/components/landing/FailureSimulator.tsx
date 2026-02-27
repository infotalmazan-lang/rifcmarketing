"use client";

import { useState, useCallback } from "react";
import { useTranslation } from "@/lib/i18n";
import { VARIABLE_COLORS, getScoreColor } from "@/components/ui/V2Elements";

function detectArchetype(
  r: number,
  i: number,
  f: number,
  c: number,
  t: ReturnType<typeof useTranslation>["t"]
): { label: string; color: string } | null {
  if (r < 3) return { label: t.archetypes.simulatorPresets[0].label, color: VARIABLE_COLORS.R };
  if (i < 3 && f > 7) return { label: t.archetypes.simulatorPresets[1].label, color: VARIABLE_COLORS.F };
  if (i > 7 && f < 3) return { label: t.archetypes.simulatorPresets[2].label, color: VARIABLE_COLORS.I };
  if (c > 80) return { label: t.archetypes.simulatorLevels.supreme + " \u2713", color: "#059669" };
  if (c >= 50) return { label: t.archetypes.simulatorLevels.medium, color: "#2563EB" };
  if (c < 50) return { label: t.archetypes.simulatorLevels.inefficient, color: "#D97706" };
  return null;
}

export default function FailureSimulator() {
  const { t } = useTranslation();
  const [r, setR] = useState(5);
  const [i, setI] = useState(5);
  const [f, setF] = useState(5);

  const c = r + i * f;
  const cColor = getScoreColor(c);
  const gateActive = r < 4;
  const detected = detectArchetype(r, i, f, c, t);

  const applyPreset = useCallback((preset: { r: number; i: number; f: number }) => {
    setR(preset.r);
    setI(preset.i);
    setF(preset.f);
  }, []);

  const sliders = [
    { label: "R", value: r, setter: setR, color: VARIABLE_COLORS.R },
    { label: "I", value: i, setter: setI, color: VARIABLE_COLORS.I },
    { label: "F", value: f, setter: setF, color: VARIABLE_COLORS.F },
  ];

  return (
    <div className="border border-border-light rounded-sm bg-surface-card p-6 md:p-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h3 className="font-heading text-[24px] md:text-[28px] font-light text-text-primary mb-2">
          {t.archetypes.simulatorTitle}
        </h3>
        <p className="font-body text-sm text-text-muted">
          {t.archetypes.simulatorSubtitle}
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-6 max-w-[500px] mx-auto mb-8">
        {sliders.map(({ label, value, setter, color }) => (
          <div key={label} className="flex items-center gap-4">
            <span
              className="font-mono text-[18px] font-semibold w-6 text-center"
              style={{ color }}
            >
              {label}
            </span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={1}
                max={10}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${color} 0%, ${color} ${((value - 1) / 9) * 100}%, rgba(255,255,255,0.06) ${((value - 1) / 9) * 100}%, rgba(255,255,255,0.06) 100%)`,
                  accentColor: color,
                }}
              />
            </div>
            <span
              className="font-mono text-[28px] md:text-[32px] font-light w-10 text-right"
              style={{ color }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Live Equation */}
      <div className="text-center mb-6">
        <div className="font-mono text-[28px] md:text-[36px] font-light tracking-tight">
          <span style={{ color: VARIABLE_COLORS.R }}>{r}</span>
          <span className="text-text-ghost"> + (</span>
          <span style={{ color: VARIABLE_COLORS.I }}>{i}</span>
          <span className="text-text-ghost"> \u00d7 </span>
          <span style={{ color: VARIABLE_COLORS.F }}>{f}</span>
          <span className="text-text-ghost">) = </span>
          <span
            className="font-semibold transition-colors duration-300"
            style={{ color: cColor }}
          >
            {c}
          </span>
        </div>
      </div>

      {/* Relevance Gate Warning */}
      {gateActive && (
        <div className="max-w-[500px] mx-auto mb-4 bg-[rgba(220,38,38,0.08)] border border-rifc-red/30 rounded-sm px-5 py-3 text-center transition-all duration-300">
          <div className="font-mono text-[13px] tracking-[2px] text-rifc-red font-semibold mb-1">
            {t.archetypes.simulatorGateWarning}
          </div>
          <div className="font-body text-[12px] text-rifc-red/70">
            {t.archetypes.simulatorGateLabel}
          </div>
        </div>
      )}

      {/* Detected Archetype */}
      {detected && (
        <div className="text-center mb-6">
          <span className="font-body text-[13px] text-text-muted">
            {t.archetypes.simulatorDetectedLabel}{" "}
          </span>
          <span
            className="font-mono text-[14px] font-semibold"
            style={{ color: detected.color }}
          >
            {detected.label}
          </span>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {t.archetypes.simulatorPresets.map((preset, idx) => {
          const presetC = preset.r + preset.i * preset.f;
          const isActive = r === preset.r && i === preset.i && f === preset.f;
          const presetColors = ["#DC2626", "#D97706", "#2563EB", "#059669"];
          const pc = presetColors[idx] || "#6B7280";

          return (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className={`font-body text-[12px] md:text-[13px] px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "font-medium"
                  : "font-light hover:bg-[rgba(255,255,255,0.02)]"
              }`}
              style={{
                borderColor: isActive ? `${pc}55` : "rgba(255,255,255,0.08)",
                color: isActive ? pc : "rgba(232,230,227,0.5)",
                backgroundColor: isActive ? `${pc}10` : "transparent",
              }}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
