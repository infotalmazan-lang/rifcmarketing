/* ─── PDF Theme — Light theme for print + dark accent pages ─── */

export const COLORS = {
  // RIFC Variable Colors
  R: "#DC2626",
  I: "#2563EB",
  F: "#D97706",
  C: "#059669",

  // Page backgrounds
  pageBg: "#FFFFFF",
  cardBg: "#F8F9FA",
  cardBorder: "#E5E7EB",
  darkBg: "#0a0a0f",
  darkCard: "#161B22",

  // Text colors — light theme
  textPrimary: "#1A1A2E",
  textSecondary: "#4A4A6A",
  textMuted: "#8888AA",
  textGhost: "#BBBBCC",

  // Text colors — dark pages (cover, chapter openers)
  textOnDark: "#E8E6E3",
  textOnDarkSecondary: "#9CA3AF",
  textOnDarkMuted: "#6B7280",

  // Borders
  borderLight: "#E5E7EB",
  borderMedium: "#D1D5DB",

  // Score zones
  zoneCritical: "#DC2626",
  zoneNoise: "#D97706",
  zoneMedium: "#2563EB",
  zoneSupreme: "#059669",
} as const;

export const FONTS = {
  heading: "Cormorant Garamond",
  body: "DM Sans",
  mono: "JetBrains Mono",
} as const;

export const SPACING = {
  pageMarginH: 55,
  pageMarginV: 45,
  sectionGap: 28,
  paragraphGap: 10,
  cardPadding: 18,
  smallGap: 6,
} as const;

export const PAGE_SIZE = "A4" as const;

export function getScoreColor(c: number): string {
  if (c > 70) return COLORS.C;
  if (c > 40) return COLORS.F;
  return COLORS.R;
}

export function getScoreZone(c: number): string {
  if (c <= 20) return "Critical";
  if (c <= 50) return "Noise";
  if (c <= 80) return "Medium";
  return "Supreme";
}
