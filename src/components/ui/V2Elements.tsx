"use client";

import type { ReactNode } from "react";

/* ─── Score Utilities ─────────────────────────────────── */

export function getScoreColor(c: number): string {
  return c > 70 ? "#059669" : c > 40 ? "#D97706" : "#DC2626";
}

export function getScoreZone(c: number): string {
  return c <= 20 ? "Critical" : c <= 50 ? "Noise" : c <= 80 ? "Medium" : "Supreme";
}

export const VARIABLE_COLORS = {
  R: "#DC2626",
  I: "#2563EB",
  F: "#D97706",
  C: "#059669",
} as const;

/* ─── WatermarkNumber ─────────────────────────────────── */

export function WatermarkNumber({
  value,
  color,
  className = "",
  size = "lg",
}: {
  value: string | number;
  color: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "text-[100px] md:text-[150px]",
    md: "text-[150px] md:text-[200px]",
    lg: "text-[150px] md:text-[300px]",
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute font-mono font-light leading-[0.8] pointer-events-none select-none transition-colors duration-500 ${sizeClasses[size]} ${className}`}
      style={{ color, opacity: 0.04 }}
    >
      {value}
    </div>
  );
}

/* ─── StampBadge ──────────────────────────────────────── */

export function StampBadge({
  text,
  color,
  rotate = 12,
  className = "",
}: {
  text: string;
  color: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={`inline-block border-2 rounded px-3 py-0.5 font-mono text-[13px] md:text-[15px] tracking-[4px] uppercase ${className}`}
      style={{
        borderColor: `${color}44`,
        color: `${color}55`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {text}
    </div>
  );
}

/* ─── HeroScore ───────────────────────────────────────── */

export function HeroScore({
  score,
  color,
  zoneLabel,
  subLabel,
  size = "lg",
  className = "",
}: {
  score: number;
  color: string;
  zoneLabel: string;
  subLabel?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-[48px] md:text-[64px] -tracking-[2px]",
    md: "text-[64px] md:text-[90px] -tracking-[4px]",
    lg: "text-[80px] md:text-[130px] -tracking-[6px]",
  };

  return (
    <div className={`text-center ${className}`}>
      <div
        className={`font-light font-mono leading-none transition-colors duration-400 ${sizeClasses[size]}`}
        style={{ color }}
      >
        {score}
      </div>
      <div className="font-mono text-[11px] md:text-[12px] tracking-[6px] text-text-ghost mt-0.5">
        {zoneLabel}
      </div>
      {subLabel && (
        <div className="inline-block mt-2 px-3.5 py-1 rounded-full bg-[rgba(220,38,38,0.08)] border border-rifc-red/20 font-body text-[11px] font-medium text-rifc-red">
          {subLabel}
        </div>
      )}
    </div>
  );
}

/* ─── ScoreTrio ───────────────────────────────────────── */

export function ScoreTrio({
  r,
  i,
  f,
  maxValue = 10,
  labels,
  previousValues,
  size = "lg",
  className = "",
}: {
  r: number;
  i: number;
  f: number;
  maxValue?: number;
  labels?: { r: string; i: string; f: string };
  previousValues?: { r: number; i: number; f: number };
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-[24px]",
    md: "text-[32px] md:text-[36px]",
    lg: "text-[32px] md:text-[44px]",
  };

  const items = [
    { key: "r" as const, value: r, color: VARIABLE_COLORS.R, label: labels?.r || "R" },
    { key: "i" as const, value: i, color: VARIABLE_COLORS.I, label: labels?.i || "I" },
    { key: "f" as const, value: f, color: VARIABLE_COLORS.F, label: labels?.f || "F" },
  ];

  return (
    <div className={`flex gap-6 md:gap-8 justify-center ${className}`}>
      {items.map(({ key, value, color, label }) => {
        const changed = previousValues && previousValues[key] !== value;
        return (
          <div key={key} className="text-center w-[70px] md:w-[90px] relative">
            {changed && (
              <div
                className="absolute -top-1.5 right-2 w-[5px] h-[5px] rounded-full"
                style={{
                  background: "#059669",
                  boxShadow: "0 0 8px rgba(5,150,105,0.4)",
                }}
              />
            )}
            <div
              className={`font-mono leading-none transition-all duration-400 ${sizeClasses[size]}`}
              style={{ color }}
            >
              {value}
            </div>
            <div className="w-full h-0.5 bg-[rgba(255,255,255,0.06)] rounded-sm mt-2">
              <div
                className="h-full rounded-sm transition-all duration-600 ease-out"
                style={{
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: color,
                }}
              />
            </div>
            <div className="font-body text-[10px] font-light text-text-ghost mt-1.5">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── FormulaDisplay ──────────────────────────────────── */

export function FormulaDisplay({
  r,
  i,
  f,
  c,
  cColor,
  fixBadge,
  size = "md",
  className = "",
}: {
  r: number;
  i: number;
  f: number;
  c: number;
  cColor: string;
  fixBadge?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const numSize = {
    sm: "text-[14px]",
    md: "text-[18px]",
    lg: "text-[22px]",
  };
  const resultSize = {
    sm: "text-[18px]",
    md: "text-[24px]",
    lg: "text-[30px]",
  };

  return (
    <div className={`text-center font-body text-[14px] font-light text-text-muted ${className}`}>
      <span className={`text-rifc-red font-mono ${numSize[size]}`}>{r}</span>
      {" + ("}
      <span className={`text-rifc-blue font-mono ${numSize[size]}`}>{i}</span>
      {" \u00d7 "}
      <span className={`text-rifc-amber font-mono ${numSize[size]}`}>{f}</span>
      {") = "}
      <span className={`font-mono ${resultSize[size]}`} style={{ color: cColor }}>
        {c}
      </span>
      {fixBadge && (
        <span className="ml-2.5 font-mono text-[10px] tracking-[2px] text-rifc-green bg-[rgba(5,150,105,0.08)] px-2.5 py-0.5 rounded-sm">
          FIX: {fixBadge}
        </span>
      )}
    </div>
  );
}

/* ─── GradientBorderBlock ─────────────────────────────── */

export function GradientBorderBlock({
  gradientFrom,
  gradientTo,
  bgTint,
  headerLabel,
  headerColor,
  children,
  className = "",
}: {
  gradientFrom: string;
  gradientTo: string;
  bgTint?: string;
  headerLabel?: string;
  headerColor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-[3px_1fr] ${className}`}>
      <div
        className="rounded-l-sm"
        style={{
          background: `linear-gradient(to bottom, ${gradientFrom}, ${gradientTo})`,
        }}
      />
      <div
        className="rounded-r-md px-5 md:px-6 py-4 md:py-5 border border-l-0 border-border-light"
        style={{
          backgroundColor: bgTint || "transparent",
        }}
      >
        {headerLabel && (
          <div
            className="font-mono text-[10px] md:text-[11px] tracking-[4px] md:tracking-[5px] mb-2.5 opacity-70 uppercase"
            style={{ color: headerColor || gradientFrom }}
          >
            {headerLabel}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

/* ─── BeforeAfterToggle ───────────────────────────────── */

export function BeforeAfterToggle({
  view,
  onToggle,
  beforeLabel,
  afterLabel,
  beforeScore,
  afterScore,
  className = "",
}: {
  view: "before" | "after";
  onToggle: (v: "before" | "after") => void;
  beforeLabel: string;
  afterLabel: string;
  beforeScore?: number;
  afterScore?: number;
  className?: string;
}) {
  return (
    <div className={`flex gap-1 justify-center ${className}`}>
      <button
        onClick={() => onToggle("before")}
        className={`cursor-pointer font-body text-[13px] tracking-[1px] px-5 py-2.5 border rounded-l-2xl rounded-r transition-all duration-300 ${
          view === "before"
            ? "font-medium text-rifc-red bg-[rgba(220,38,38,0.08)] border-rifc-red/30 shadow-[0_0_12px_rgba(220,38,38,0.15)]"
            : "font-light text-text-muted border-border-light hover:border-rifc-red/30 hover:text-rifc-red hover:bg-[rgba(220,38,38,0.03)]"
        }`}
      >
        {beforeLabel}
        {beforeScore !== undefined && (
          <span className="font-mono text-[14px] ml-1.5">{beforeScore}</span>
        )}
      </button>
      <button
        onClick={() => onToggle("after")}
        className={`cursor-pointer font-body text-[13px] tracking-[1px] px-5 py-2.5 border rounded-r-2xl rounded-l transition-all duration-300 ${
          view === "after"
            ? "font-medium text-rifc-green bg-[rgba(5,150,105,0.08)] border-rifc-green/30 shadow-[0_0_12px_rgba(5,150,105,0.15)]"
            : "font-light text-text-muted border-border-light hover:border-rifc-green/30 hover:text-rifc-green hover:bg-[rgba(5,150,105,0.03)]"
        }`}
      >
        {afterLabel}
        {afterScore !== undefined && (
          <span className={`font-mono text-[14px] ml-1.5 ${view !== "after" ? "animate-pulse" : ""}`}>{afterScore}</span>
        )}
      </button>
    </div>
  );
}

