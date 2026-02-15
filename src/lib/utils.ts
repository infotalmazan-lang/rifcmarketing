import { SCORE_RANGES, RELEVANCE_GATE_THRESHOLD } from "@/lib/constants/rifc";
import type { ScoreRange } from "@/types";

export function calculateC(r: number, i: number, f: number): number {
  return r + i * f;
}

export function checkRelevanceGate(r: number): boolean {
  return r >= RELEVANCE_GATE_THRESHOLD;
}

export function getScoreRange(c: number): ScoreRange {
  return (
    SCORE_RANGES.find((range) => c >= range.min && c <= range.max) ||
    SCORE_RANGES[0]
  );
}

export function getDiagnosis(r: number, i: number, f: number): string {
  if (!checkRelevanceGate(r)) {
    return "Critical Failure: Relevance Gate triggered. R is below threshold. No amount of Interest or Form can save this message. Fix your targeting first.";
  }

  const c = calculateC(r, i, f);
  const range = getScoreRange(c);

  if (r === 0) return "The Invisible Phantom: Wrong audience entirely.";
  if (i <= 2 && f >= 7)
    return "The Aesthetic Noise: Beautiful but empty. Increase substance (I).";
  if (i >= 7 && f <= 2)
    return "The Buried Diamond: Great value, terrible packaging. Improve Form (F).";

  const weakest =
    r <= i && r <= f ? "R (Relevance)" : i <= f ? "I (Interest)" : "F (Form)";

  return `${range.label} (C=${c}). Weakest variable: ${weakest}. Focus optimization here first.`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function readingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
