/**
 * Copywrite / Text ADN — TypeScript Types
 * 5 AI Agents × 40 Subfactors × Extended Brand Profile
 */

// ─── Agent Keys ─────────────────────────────────────────
export type CWAgentKey = "R" | "I" | "F" | "C" | "CTA";

// ─── Screen Navigation ─────────────────────────────────
export type CWScreen = "hero" | "config" | "progress" | "results";

// ─── Extended Brand Profile (12 fields) ────────────────
export interface ExtendedBrandProfile {
  logo: string;
  desc: string;
  tone: string;
  audience: string;
  colors: string;
  font: string;
  values: string;
  mission: string;
  usp: string;
  competitors: string;
  keywords: string;
  avoid: string;
}

// ─── Brand Field Definition ────────────────────────────
export interface CWBrandField {
  key: keyof ExtendedBrandProfile;
  label: string;
  type: "text" | "textarea";
  icon: string;
}

// ─── Brand Field Metadata ──────────────────────────────
export interface CWFieldHelper {
  key: string;
  label: string;
  why: string;
  example: string;
  placeholder: string;
}

export interface CWFieldMeta {
  why: string;
  example: string;
  placeholder: string;
  helpers: CWFieldHelper[];
}

// ─── Brand Preset ──────────────────────────────────────
export interface CWBrandPreset {
  name: string;
  industry: string;
  data: ExtendedBrandProfile;
}

// ─── Industry ──────────────────────────────────────────
export interface CWIndustry {
  name: string;
  cat: string;
}

// ─── Content Type ──────────────────────────────────────
export interface CWContentType {
  value: string;
  label: string;
}

// ─── Subfactor Score (per audit) ───────────────────────
export interface CWSubfactorScore {
  id: string;
  name: string;
  score: number;
  justification: string;
}

// ─── Agent Subfactor Description ───────────────────────
export interface CWSubfactorDesc {
  d: string;
  low: string;
  mid: string;
  high: string;
}

// ─── Agent Config ──────────────────────────────────────
export interface CWAgentConfig {
  key: CWAgentKey;
  name: string;
  color: string;
  rgb: string;
  arcStart: number;
  arcEnd: number;
  nodeAngle: number;
  duration: number;
  subfactors: string[];
  desc: string;
  tip: string;
}

// ─── Per-Agent Result ──────────────────────────────────
export interface CWAgentResult {
  key: CWAgentKey;
  score: number;
  subfactors: CWSubfactorScore[];
  justification: string;
  duration: number;
}

// ─── AI Variant (brand field generation) ───────────────
export interface CWVariant {
  text: string;
  label: string;
  note: string;
  saved: boolean;
}

// ─── Full Audit Result ─────────────────────────────────
export interface CWAuditResult {
  r: number;
  i: number;
  f: number;
  c: number;
  cta: number;
  rifc: number;
  agents: Record<CWAgentKey, CWAgentResult>;
  archetype: "invisible_phantom" | "aesthetic_noise" | "buried_diamond" | "none";
  clarityLevel: "critical" | "noise" | "medium" | "supreme";
  diagnosis: string;
  recommendations: CWRecommendation[];
  duration: number;
  timestamp: string;
  config: {
    brand: string;
    industry: string;
    contentType: string;
    objective: string;
    textLength: number;
  };
}

export interface CWRecommendation {
  agent: CWAgentKey;
  action: string;
  impact: string;
  priority: "high" | "medium" | "low";
}

// ─── Objective Weight Override ──────────────────────────
export interface CWObjectiveWeights {
  R: number;
  I: number;
  F: number;
  C: number;
}

// ─── Agent Status (progress screen) ────────────────────
export type CWAgentStatus = "pending" | "running" | "done";

// ─── Slider Panel Types ────────────────────────────────
export type CWSliderType = "brand-field" | "agent-param" | "result" | null;
