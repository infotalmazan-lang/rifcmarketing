/**
 * RIFC 35 Sub-factors — Core IP Constants
 * Immutable. These define the RIFC diagnostic framework.
 *
 * R1-R7  (7 Relevance sub-factors)
 * I1-I10 (10 Interest sub-factors)
 * F1-F11 (11 Form sub-factors)
 * C1-C7  (7 Clarity sub-factors)
 */

export type RIFCVariable = "R" | "I" | "F" | "C";

export interface Subfactor {
  /** Unique ID, e.g. "R1", "I5", "F11", "C3" */
  id: string;
  /** Which variable this belongs to */
  variable: RIFCVariable;
  /** Index within its variable group (1-based) */
  index: number;
  /** English name (source of truth — i18n handles display) */
  name: string;
  /** Whether this is a critical subfactor (failure here = variable failure) */
  critical: boolean;
  /** Default weight 0-1 (before objective adjustments). Equal within group by default. */
  defaultWeight: number;
}

// ─── R: Relevance (7 sub-factors) ────────────────────────

export const R_SUBFACTORS: readonly Subfactor[] = [
  { id: "R1", variable: "R", index: 1, name: "Audience",              critical: true,  defaultWeight: 1 },
  { id: "R2", variable: "R", index: 2, name: "Timing",                critical: false, defaultWeight: 1 },
  { id: "R3", variable: "R", index: 3, name: "Journey Stage",         critical: false, defaultWeight: 1 },
  { id: "R4", variable: "R", index: 4, name: "Situational Context",   critical: false, defaultWeight: 1 },
  { id: "R5", variable: "R", index: 5, name: "Geography",             critical: false, defaultWeight: 1 },
  { id: "R6", variable: "R", index: 6, name: "Channel",               critical: false, defaultWeight: 1 },
  { id: "R7", variable: "R", index: 7, name: "Segmentation",          critical: true,  defaultWeight: 1 },
] as const;

// ─── I: Interest (10 sub-factors) ────────────────────────

export const I_SUBFACTORS: readonly Subfactor[] = [
  { id: "I1",  variable: "I", index: 1,  name: "Unique Benefit (USP)",       critical: true,  defaultWeight: 1 },
  { id: "I2",  variable: "I", index: 2,  name: "Curiosity / Open Loop",      critical: true,  defaultWeight: 1 },
  { id: "I3",  variable: "I", index: 3,  name: "Tension / Conflict",         critical: false, defaultWeight: 1 },
  { id: "I4",  variable: "I", index: 4,  name: "Transformation Promise",     critical: false, defaultWeight: 1 },
  { id: "I5",  variable: "I", index: 5,  name: "Social Proof",               critical: false, defaultWeight: 1 },
  { id: "I6",  variable: "I", index: 6,  name: "Urgency / Scarcity",         critical: false, defaultWeight: 1 },
  { id: "I7",  variable: "I", index: 7,  name: "Controversy / Strong Opinion", critical: false, defaultWeight: 1 },
  { id: "I8",  variable: "I", index: 8,  name: "Novelty / Exclusivity",      critical: false, defaultWeight: 1 },
  { id: "I9",  variable: "I", index: 9,  name: "Storytelling",               critical: false, defaultWeight: 1 },
  { id: "I10", variable: "I", index: 10, name: "Data / Statistics",          critical: false, defaultWeight: 1 },
] as const;

// ─── F: Form (11 sub-factors) ────────────────────────────

export const F_SUBFACTORS: readonly Subfactor[] = [
  { id: "F1",  variable: "F", index: 1,  name: "Text",               critical: false, defaultWeight: 1 },
  { id: "F2",  variable: "F", index: 2,  name: "Static Image",       critical: false, defaultWeight: 1 },
  { id: "F3",  variable: "F", index: 3,  name: "Short Video",        critical: false, defaultWeight: 1 },
  { id: "F4",  variable: "F", index: 4,  name: "Long Video",         critical: false, defaultWeight: 1 },
  { id: "F5",  variable: "F", index: 5,  name: "Audio",              critical: false, defaultWeight: 1 },
  { id: "F6",  variable: "F", index: 6,  name: "Carousel / Slideshow", critical: false, defaultWeight: 1 },
  { id: "F7",  variable: "F", index: 7,  name: "Document",           critical: false, defaultWeight: 1 },
  { id: "F8",  variable: "F", index: 8,  name: "Interactive",        critical: false, defaultWeight: 1 },
  { id: "F9",  variable: "F", index: 9,  name: "Design / Layout",    critical: true,  defaultWeight: 1 },
  { id: "F10", variable: "F", index: 10, name: "Structure",          critical: false, defaultWeight: 1 },
  { id: "F11", variable: "F", index: 11, name: "CTA",                critical: true,  defaultWeight: 1 },
] as const;

// ─── C: Clarity (7 sub-factors) ──────────────────────────

export const C_SUBFACTORS: readonly Subfactor[] = [
  { id: "C1", variable: "C", index: 1, name: "5-Second Test",     critical: true,  defaultWeight: 1 },
  { id: "C2", variable: "C", index: 2, name: "One-Sentence Test", critical: false, defaultWeight: 1 },
  { id: "C3", variable: "C", index: 3, name: "Zero Jargon",       critical: false, defaultWeight: 1 },
  { id: "C4", variable: "C", index: 4, name: "One Message",       critical: true,  defaultWeight: 1 },
  { id: "C5", variable: "C", index: 5, name: "Consistency",       critical: false, defaultWeight: 1 },
  { id: "C6", variable: "C", index: 6, name: "Zero Friction",     critical: false, defaultWeight: 1 },
  { id: "C7", variable: "C", index: 7, name: "Obvious Action",    critical: false, defaultWeight: 1 },
] as const;

// ─── Aggregated exports ──────────────────────────────────

/** All 35 sub-factors in canonical order */
export const ALL_SUBFACTORS: readonly Subfactor[] = [
  ...R_SUBFACTORS,
  ...I_SUBFACTORS,
  ...F_SUBFACTORS,
  ...C_SUBFACTORS,
] as const;

/** Quick lookup by ID */
export const SUBFACTOR_MAP: ReadonlyMap<string, Subfactor> = new Map(
  ALL_SUBFACTORS.map((sf) => [sf.id, sf])
);

/** Get all subfactors for a variable */
export function getSubfactorsForVariable(variable: RIFCVariable): readonly Subfactor[] {
  switch (variable) {
    case "R": return R_SUBFACTORS;
    case "I": return I_SUBFACTORS;
    case "F": return F_SUBFACTORS;
    case "C": return C_SUBFACTORS;
  }
}

/** IDs of critical subfactors */
export const CRITICAL_SUBFACTOR_IDS: readonly string[] = ALL_SUBFACTORS
  .filter((sf) => sf.critical)
  .map((sf) => sf.id);

/** Variable colors (matches design system) */
export const VARIABLE_COLORS: Record<RIFCVariable, string> = {
  R: "#DC2626",
  I: "#2563EB",
  F: "#D97706",
  C: "#059669",
} as const;
