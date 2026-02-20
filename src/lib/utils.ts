import { RELEVANCE_GATE_THRESHOLD } from "@/lib/constants/rifc";

export function calculateC(r: number, i: number, f: number): number {
  return r + i * f;
}

export function checkRelevanceGate(r: number): boolean {
  return r >= RELEVANCE_GATE_THRESHOLD;
}

export function formatDate(dateString: string, locale: string = "ro-RO"): string {
  return new Date(dateString).toLocaleDateString(locale === "ro" ? "ro-RO" : "en-US", {
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

