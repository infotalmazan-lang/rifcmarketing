/**
 * RIFC Layer 0 — 10 Marketing Objectives
 * Each objective adjusts the relative importance of R, I, F variables.
 * Weights are multipliers (1.0 = default, >1 = more important, <1 = less important).
 */

export interface RIFCObjective {
  /** Unique identifier */
  id: string;
  /** i18n key for name */
  nameKey: string;
  /** i18n key for description */
  descKey: string;
  /** Weight multipliers for each variable */
  weights: { R: number; I: number; F: number };
  /** Key performance indicators */
  kpis: string[];
  /** Lucide icon name */
  icon: string;
}

export const OBJECTIVES: readonly RIFCObjective[] = [
  {
    id: "brand_awareness",
    nameKey: "objectives.brandAwareness.name",
    descKey: "objectives.brandAwareness.desc",
    weights: { R: 1.3, I: 0.9, F: 1.2 },
    kpis: ["impressions", "reach", "brand_recall", "share_of_voice"],
    icon: "Eye",
  },
  {
    id: "lead_generation",
    nameKey: "objectives.leadGeneration.name",
    descKey: "objectives.leadGeneration.desc",
    weights: { R: 1.2, I: 1.1, F: 1.0 },
    kpis: ["leads", "cpl", "conversion_rate", "mql"],
    icon: "UserPlus",
  },
  {
    id: "direct_sales",
    nameKey: "objectives.directSales.name",
    descKey: "objectives.directSales.desc",
    weights: { R: 1.1, I: 1.3, F: 1.0 },
    kpis: ["revenue", "roas", "aov", "conversion_rate"],
    icon: "ShoppingCart",
  },
  {
    id: "engagement",
    nameKey: "objectives.engagement.name",
    descKey: "objectives.engagement.desc",
    weights: { R: 0.9, I: 1.2, F: 1.3 },
    kpis: ["engagement_rate", "comments", "shares", "time_on_page"],
    icon: "Heart",
  },
  {
    id: "retention",
    nameKey: "objectives.retention.name",
    descKey: "objectives.retention.desc",
    weights: { R: 1.3, I: 1.0, F: 0.9 },
    kpis: ["churn_rate", "ltv", "repeat_purchase", "nps"],
    icon: "RefreshCw",
  },
  {
    id: "thought_leadership",
    nameKey: "objectives.thoughtLeadership.name",
    descKey: "objectives.thoughtLeadership.desc",
    weights: { R: 1.0, I: 1.4, F: 1.0 },
    kpis: ["mentions", "backlinks", "speaking_invitations", "authority_score"],
    icon: "Lightbulb",
  },
  {
    id: "reach",
    nameKey: "objectives.reach.name",
    descKey: "objectives.reach.desc",
    weights: { R: 1.4, I: 0.8, F: 1.1 },
    kpis: ["unique_reach", "frequency", "cpm", "new_audiences"],
    icon: "Megaphone",
  },
  {
    id: "advocacy",
    nameKey: "objectives.advocacy.name",
    descKey: "objectives.advocacy.desc",
    weights: { R: 1.1, I: 1.2, F: 1.0 },
    kpis: ["referrals", "ugc", "reviews", "nps"],
    icon: "Users",
  },
  {
    id: "traffic",
    nameKey: "objectives.traffic.name",
    descKey: "objectives.traffic.desc",
    weights: { R: 1.2, I: 1.0, F: 1.1 },
    kpis: ["sessions", "cpc", "ctr", "bounce_rate"],
    icon: "ArrowUpRight",
  },
  {
    id: "app_installs",
    nameKey: "objectives.appInstalls.name",
    descKey: "objectives.appInstalls.desc",
    weights: { R: 1.2, I: 1.1, F: 1.1 },
    kpis: ["installs", "cpi", "activation_rate", "day1_retention"],
    icon: "Download",
  },
] as const;

/** Quick lookup by ID */
export const OBJECTIVE_MAP: ReadonlyMap<string, RIFCObjective> = new Map(
  OBJECTIVES.map((obj) => [obj.id, obj])
);
