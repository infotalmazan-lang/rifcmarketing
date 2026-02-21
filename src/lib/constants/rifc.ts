export const RELEVANCE_GATE_THRESHOLD = 3;

// Re-export core IP constants for single import point
export { ALL_SUBFACTORS, SUBFACTOR_MAP, VARIABLE_COLORS, CRITICAL_SUBFACTOR_IDS, getSubfactorsForVariable } from "./subfactors";
export type { Subfactor, RIFCVariable } from "./subfactors";
export { OBJECTIVES, OBJECTIVE_MAP } from "./objectives";
export type { RIFCObjective } from "./objectives";
