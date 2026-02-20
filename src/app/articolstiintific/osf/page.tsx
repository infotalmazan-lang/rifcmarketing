"use client";
/**
 * R IF C — Articol Stiintific (OSF Page)
 * Manuscris profesionist trilingv RO / EN / RU
 * URL: /articolstiintific/osf
 *
 * Citeste blocuri din localStorage (rifc-blocks-v1) si le afiseaza
 * ca manuscris academic formatat. Switch global de limba sus-dreapta.
 *
 * Tracking events (GA4 + FB Pixel) — all prefixed with "OSF_":
 *   OSF_PageView         — page load
 *   OSF_Scroll_25/50/75/100  — scroll depth milestones
 *   OSF_TimeOnPage_30s/60s/120s/300s — time spent milestones
 *   OSF_LangSwitch       — language changed
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { fbTrackCustom } from "@/components/FacebookPixel";

/* ── Types ── */
type Lang = "ro" | "en" | "ru";

interface Block {
  id: string;
  type: string;
  value: any;
}

interface TaskEntry {
  key: string;
  label: string;
}

interface ManuscriptSection {
  id: string;
  heading: Record<Lang, string>;
  tasks: TaskEntry[];
  targetWords?: number;
  isAbstract?: boolean;
  isReferences?: boolean;
}

/* ── Constants ── */
const BLOCKS_KEY = "rifc-blocks-v1";
const LANG_KEY = "rifc-osf-lang";
const TRILINGUAL_TYPES = ["text-short", "text-long", "link", "code", "table", "number"];

const TITLE: Record<Lang, string> = {
  ro: "Dezvoltarea și Validarea Scalei R IF C pentru Evaluarea Clarității Mesajelor de Marketing",
  en: "Development and Validation of the R IF C Scale for Marketing Message Clarity Assessment",
  ru: "Разработка и валидация шкалы R IF C для оценки ясности маркетинговых сообщений",
};

const KEYWORDS: Record<Lang, string[]> = {
  ro: ["Comunicare de Marketing", "Dezvoltare Scală", "Claritatea Mesajului", "Validare Empirică", "R IF C"],
  en: ["Marketing Communication", "Scale Development", "Message Clarity", "Empirical Validation", "R IF C"],
  ru: ["Маркетинговая коммуникация", "Разработка шкалы", "Ясность сообщения", "Эмпирическая валидация", "R IF C"],
};

const MANUSCRIPT_SECTIONS: ManuscriptSection[] = [
  {
    id: "abstract",
    heading: { ro: "Rezumat", en: "Abstract", ru: "Аннотация" },
    isAbstract: true,
    targetWords: 250,
    tasks: [
      { key: "s6-4", label: "Review intern + Formatare + Submisie" },
    ],
  },
  {
    id: "introduction",
    heading: { ro: "1. Introducere", en: "1. Introduction", ru: "1. Введение" },
    targetWords: 1500,
    tasks: [
      { key: "s0-0", label: "Extragere & catalogare conținut site" },
      { key: "s0-1", label: "Export AI Audit & Calculator ca instrumente" },
      { key: "s0-2", label: "Documentare White Paper existent" },
      { key: "s1-0", label: "Reformulare academică a definițiilor R, I, F, C" },
      { key: "s1-1", label: "Formalizarea matematică a ecuației R+(I×F)=C" },
      { key: "s1-2", label: "Justificarea Porții Relevanței (R < 3 = eșec)" },
      { key: "s6-0", label: "Introduction + Literature Review" },
    ],
  },
  {
    id: "literature",
    heading: { ro: "2. Recenzia Literaturii", en: "2. Literature Review", ru: "2. Обзор литературы" },
    targetWords: 3000,
    tasks: [
      { key: "s1-3", label: "Literature Review — reformulare comparații" },
      { key: "s1-4", label: "Pre-registration OSF.io" },
      { key: "s6-0", label: "Introduction + Literature Review" },
    ],
  },
  {
    id: "methodology",
    heading: { ro: "3. Metodologie", en: "3. Methodology", ru: "3. Методология" },
    targetWords: 2000,
    tasks: [
      { key: "s2-0", label: "Transformare sub-factori → itemi Likert" },
      { key: "s2-1", label: "Formalizare Conversie Likert → Scoring" },
      { key: "s2-2", label: "Construire Scoring Rubric standardizat" },
      { key: "s2-3", label: "Panel de experți (15–20 persoane)" },
      { key: "s2-4", label: "Interviuri cognitive (10–15 utilizatori)" },
      { key: "s2-5", label: "Inter-Rater Reliability (2 evaluatori independenți)" },
      { key: "s2-6", label: "Etică & Consimțământ" },
      { key: "s2-7", label: "Traducere & Validare trilingvă (RO / EN / RU)" },
      { key: "s2b-0", label: "Test Instrument (10–15 evaluatori, 5–10 stimuli)" },
      { key: "s2b-1", label: "Verificare timp, claritate, probleme" },
      { key: "s2b-2", label: "Design Attention Checks" },
      { key: "s2b-3", label: "Ajustări finale pre-colectare" },
      { key: "s3-0", label: "Set Stimuli (10 canale × 3 variante = 30 mesaje)" },
      { key: "s3b-0", label: "Design: 10 canale × 3 variante × 5 întrebări" },
      { key: "s3b-1", label: "Eșantion Consumatori N=1.000–3.000" },
      { key: "s3b-2", label: "Segmentare: demografie + comportament + psihografie" },
      { key: "s3b-3", label: "Implementare randomizare Latin Square" },
      { key: "s6-1", label: "Framework + Methodology + Results" },
    ],
  },
  {
    id: "results",
    heading: { ro: "4. Rezultate", en: "4. Results", ru: "4. Результаты" },
    targetWords: 3000,
    tasks: [
      { key: "s3-1", label: "Eșantion Experți N=250–350" },
      { key: "s3-2", label: "Exploratory Factor Analysis (EFA)" },
      { key: "s4-0", label: "Colectare eșantion nou N=300–500" },
      { key: "s4-1", label: "CFA — Confirmatory Factor Analysis" },
      { key: "s4-2", label: "TESTUL CENTRAL: Additive vs Multiplicative" },
      { key: "s4-3", label: "Testul Porții Relevanței (Threshold R < 3)" },
      { key: "s4-4", label: "Robustness Checks (cross-canal, cross-industrie)" },
      { key: "s4b-0", label: "Configurare prompt AI standardizat" },
      { key: "s4b-1", label: "Comparație AI vs Human (ICC, Bland-Altman)" },
      { key: "s4b-2", label: "Analiză bias și calibrare AI" },
      { key: "s5-0", label: "Colectare KPI-uri reale (30–50 campanii)" },
      { key: "s5-1", label: "Known-Groups Validity (via Arhetipuri)" },
      { key: "s5-2", label: "Validare Convergentă / Discriminantă" },
      { key: "s5-3", label: "Inter-Rater Reliability (confirmare finală)" },
      { key: "s5-4", label: "Study 5: AI vs Human Agreement" },
      { key: "s6-1", label: "Framework + Methodology + Results" },
    ],
  },
  {
    id: "discussion",
    heading: { ro: "5. Discuție", en: "5. Discussion", ru: "5. Дискуссия" },
    targetWords: 2000,
    tasks: [
      { key: "s5b-0", label: "Recrutare și compunere grupuri" },
      { key: "s5b-1", label: "Ghid de discuție semi-structurat" },
      { key: "s5b-2", label: "Conducere sesiuni și transcriere" },
      { key: "s5b-3", label: "Analiză tematică Braun & Clarke" },
      { key: "s6-2", label: "Discussion + Conclusion + AI Declaration" },
    ],
  },
  {
    id: "conclusion",
    heading: { ro: "6. Concluzii", en: "6. Conclusion", ru: "6. Заключение" },
    targetWords: 500,
    tasks: [
      { key: "s6-2", label: "Discussion + Conclusion + AI Declaration" },
    ],
  },
  {
    id: "references",
    heading: { ro: "Referințe", en: "References", ru: "Литература" },
    isReferences: true,
    tasks: [
      { key: "s1-3", label: "Literature Review — reformulare comparații" },
      { key: "s6-3", label: "Citarea site-ului în paper" },
      { key: "s6-4", label: "Review intern + Formatare + Submisie" },
    ],
  },
];

/* ── GA4 helper ── */
function ga(event: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", event, params);
  }
}

/* ── Dual track: GA4 + FB ── */
function track(eventName: string, params?: Record<string, string | number>) {
  ga(eventName, params);
  fbTrackCustom(eventName, params);
}

/* ── Data helpers ── */
function loadBlocks(): Record<string, Block[]> {
  try {
    const raw = localStorage.getItem(BLOCKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getLangVal(block: Block, lang: Lang): any {
  const val = block.value;
  if (!val) return null;
  if (TRILINGUAL_TYPES.includes(block.type)) {
    if (typeof val === "string") return lang === "ro" ? val : "";
    if (val && typeof val === "object" && val[lang] !== undefined) return val[lang];
    if (val && typeof val === "object" && val.ro !== undefined) return val.ro;
    return null;
  }
  return val;
}

function getTextContent(block: Block, lang: Lang): string {
  const lv = getLangVal(block, lang);
  if (!lv) return "";
  switch (block.type) {
    case "text-short":
    case "text-long":
      return typeof lv === "string" ? lv : "";
    case "number":
      if (typeof lv === "object" && lv.label) return lv.label + ": " + (lv.value || 0);
      return "";
    case "code":
      if (typeof lv === "object" && lv.code) return lv.code;
      return "";
    case "dropdown":
      if (lv && lv.category) return lv.category + ": " + (lv.value || "");
      return "";
    case "link":
      return typeof lv === "string" ? lv : "";
    default:
      return typeof lv === "string" ? lv : "";
  }
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

function escHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* ── Styles ── */
const S = {
  page: {
    minHeight: "100vh",
    background: "#FAFBFC",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  } as React.CSSProperties,
  header: {
    background: "#fff",
    borderBottom: "1px solid #E5E7EB",
    padding: "14px 28px",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    gap: 14,
  } as React.CSSProperties,
  headerTitle: { fontSize: 15, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.2 } as React.CSSProperties,
  headerSub: { fontSize: 11, color: "#9CA3AF", margin: 0, letterSpacing: 0.3 } as React.CSSProperties,
  wordBadge: {
    display: "flex", alignItems: "center", gap: 10, padding: "6px 14px",
    borderRadius: 8, background: "#F9FAFB", border: "1px solid #E5E7EB",
  } as React.CSSProperties,
  langPill: {
    display: "flex", gap: 0, borderRadius: 8, overflow: "hidden",
    border: "1px solid #E5E7EB",
  } as React.CSSProperties,
  paper: {
    maxWidth: 740, margin: "0 auto", padding: "48px 32px 80px",
  } as React.CSSProperties,
  paperInner: {
    background: "#fff", border: "1px solid #E5E7EB", borderRadius: 2,
    padding: "56px 56px 64px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  } as React.CSSProperties,
  manuscriptLabel: {
    fontSize: 10, fontWeight: 700, letterSpacing: 3, color: "#9CA3AF",
    textTransform: "uppercase" as const, textAlign: "center" as const, marginBottom: 20,
  } as React.CSSProperties,
  title: {
    fontSize: 24, fontWeight: 800, color: "#111827", lineHeight: 1.35,
    textAlign: "center" as const, margin: "0 0 16px", fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  author: {
    fontSize: 15, color: "#4B5563", textAlign: "center" as const, margin: "0 0 4px",
    fontWeight: 500,
  } as React.CSSProperties,
  affiliation: {
    fontSize: 12, color: "#9CA3AF", textAlign: "center" as const, margin: "0 0 6px",
    fontStyle: "italic" as const,
  } as React.CSSProperties,
  correspondence: {
    fontSize: 11, color: "#9CA3AF", textAlign: "center" as const, margin: "0 0 24px",
  } as React.CSSProperties,
  keywordsWrap: {
    display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" as const,
    marginBottom: 32, paddingBottom: 32, borderBottom: "1px solid #E5E7EB",
  } as React.CSSProperties,
  keywordTag: {
    padding: "3px 10px", borderRadius: 4, background: "#F3F4F6",
    fontSize: 11, color: "#6B7280", fontWeight: 500,
  } as React.CSSProperties,
  sectionHeading: {
    fontSize: 18, fontWeight: 700, color: "#111827", margin: "40px 0 0",
    paddingBottom: 8, borderBottom: "2px solid #E5E7EB", fontFamily: "'Inter', sans-serif",
    display: "flex", alignItems: "baseline", gap: 10,
  } as React.CSSProperties,
  sectionWordCount: {
    fontSize: 11, fontWeight: 500, color: "#9CA3AF",
    fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" as const,
  } as React.CSSProperties,
  bodyText: {
    fontSize: 15, lineHeight: 1.8, color: "#1F2937",
    fontFamily: "'Georgia', 'Times New Roman', 'Cambria', serif",
    textAlign: "justify" as const, margin: "14px 0",
  } as React.CSSProperties,
  abstractText: {
    fontSize: 14, lineHeight: 1.8, color: "#374151",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    fontStyle: "italic" as const, textAlign: "justify" as const,
    borderLeft: "3px solid #D1D5DB", paddingLeft: 20, margin: "16px 0",
  } as React.CSSProperties,
  subHeading: {
    fontSize: 14, fontWeight: 600, color: "#374151", margin: "28px 0 8px",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  table: {
    width: "100%", borderCollapse: "collapse" as const, margin: "16px 0",
    fontSize: 13, fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  th: {
    padding: "8px 12px", background: "#F9FAFB", borderBottom: "2px solid #E5E7EB",
    textAlign: "left" as const, fontWeight: 600, color: "#374151", fontSize: 12,
  } as React.CSSProperties,
  td: {
    padding: "7px 12px", borderBottom: "1px solid #F3F4F6",
    color: "#4B5563", fontSize: 13,
  } as React.CSSProperties,
  codeBlock: {
    background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 6,
    padding: "16px 20px", margin: "16px 0", overflowX: "auto" as const,
    fontSize: 12, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.6,
    color: "#374151", whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const,
  } as React.CSSProperties,
  codeLangLabel: {
    fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: 1,
    textTransform: "uppercase" as const, marginBottom: 8,
  } as React.CSSProperties,
  numberStat: {
    display: "inline-flex", alignItems: "baseline", gap: 6,
    padding: "6px 14px", borderRadius: 6, background: "#F9FAFB",
    border: "1px solid #E5E7EB", margin: "8px 8px 8px 0",
    fontSize: 13, fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  linkRef: {
    fontSize: 13, lineHeight: 1.7, color: "#1F2937",
    fontFamily: "'Georgia', serif", paddingLeft: 28,
    textIndent: -28, margin: "6px 0",
  } as React.CSSProperties,
  placeholder: {
    border: "2px dashed #D1D5DB", borderRadius: 8, padding: "40px 24px",
    textAlign: "center" as const, background: "#FAFBFC", margin: "20px 0",
  } as React.CSSProperties,
  placeholderLabel: {
    fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#C4C9D1",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,
  placeholderName: {
    fontSize: 13, color: "#9CA3AF", marginTop: 8, fontStyle: "italic" as const,
  } as React.CSSProperties,
};

const LANG_COLORS: Record<Lang, string> = { ro: "#2563EB", en: "#059669", ru: "#DC2626" };
const SOON_LABELS: Record<Lang, string> = { ro: "CURÂND", en: "COMING SOON", ru: "СКОРО" };
const WORDS_LABEL: Record<Lang, string> = { ro: "cuvinte", en: "words", ru: "слов" };

/* ────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                    */
/* ────────────────────────────────────────────────── */
export default function ArticolOSFPage() {
  const firedScrollRef = useRef<Set<number>>(new Set());
  const firedTimeRef = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(Date.now());

  const [lang, setLang] = useState<Lang>("ro");
  const [blocks, setBlocks] = useState<Record<string, Block[]>>({});

  /* ── Init lang from localStorage (client only) ── */
  useEffect(() => {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "en" || saved === "ru") setLang(saved);
    setBlocks(loadBlocks());
  }, []);

  /* ── Refresh blocks on visibility / focus / storage ── */
  useEffect(() => {
    const refresh = () => setBlocks(loadBlocks());
    const onVis = () => { if (!document.hidden) refresh(); };
    const onStorage = (e: StorageEvent) => { if (e.key === BLOCKS_KEY) refresh(); };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", onStorage);
    const iv = setInterval(refresh, 8000);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", onStorage);
      clearInterval(iv);
    };
  }, []);

  /* ── OSF_PageView on mount ── */
  useEffect(() => {
    track("OSF_PageView", { content_name: "Articol Stiintific OSF", content_category: "article", page_path: "/articolstiintific/osf" });
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);
      [25, 50, 75, 100].forEach((m) => {
        if (pct >= m && !firedScrollRef.current.has(m)) {
          firedScrollRef.current.add(m);
          track(`OSF_Scroll_${m}`, { scroll_depth: m, content_name: "Articol Stiintific OSF" });
        }
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Time tracking ── */
  useEffect(() => {
    const milestones = [30, 60, 120, 300];
    const iv = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      milestones.forEach((sec) => {
        if (elapsed >= sec && !firedTimeRef.current.has(sec)) {
          firedTimeRef.current.add(sec);
          track(`OSF_TimeOnPage_${sec}s`, { seconds: sec, content_name: "Articol Stiintific OSF" });
        }
      });
      if (firedTimeRef.current.size >= milestones.length) clearInterval(iv);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  /* ── Language change ── */
  const changeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    try { localStorage.setItem(LANG_KEY, newLang); } catch {}
    track("OSF_LangSwitch", { language: newLang });
  }, []);

  /* ── Compute section data ── */
  const sectionsData = MANUSCRIPT_SECTIONS.map((section) => {
    let totalWords = 0;
    const taskContents: { task: TaskEntry; elements: React.ReactNode[]; words: number }[] = [];

    section.tasks.forEach((task) => {
      const taskBlocks = blocks[task.key] || [];
      const elements: React.ReactNode[] = [];
      let taskWords = 0;

      taskBlocks.forEach((block, bi) => {
        const lv = getLangVal(block, lang);
        if (lv === null || lv === undefined) return;

        switch (block.type) {
          case "text-short": {
            const txt = typeof lv === "string" ? lv.trim() : "";
            if (txt) {
              elements.push(<p key={block.id} style={section.isAbstract ? S.abstractText : S.bodyText}>{txt}</p>);
              taskWords += countWords(txt);
            }
            break;
          }
          case "text-long": {
            const txt = typeof lv === "string" ? lv.trim() : "";
            if (txt) {
              const paras = txt.split(/\n\n+/).filter(Boolean);
              paras.forEach((p, pi) => {
                elements.push(<p key={block.id + "-p" + pi} style={section.isAbstract ? S.abstractText : S.bodyText}>{p}</p>);
              });
              taskWords += countWords(txt);
            }
            break;
          }
          case "table": {
            const tv = typeof lv === "object" && lv && lv.cols ? lv : null;
            if (tv && tv.cols && tv.rows) {
              elements.push(
                <table key={block.id} style={S.table}>
                  <thead>
                    <tr>{tv.cols.map((c: string, ci: number) => <th key={ci} style={S.th}>{c || ""}</th>)}</tr>
                  </thead>
                  <tbody>
                    {tv.rows.map((row: string[], ri: number) => (
                      <tr key={ri}>{row.map((cell: string, ci: number) => <td key={ci} style={S.td}>{cell || ""}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              );
              // Count words in table cells
              tv.rows.forEach((row: string[]) => row.forEach((cell: string) => { taskWords += countWords(cell); }));
            }
            break;
          }
          case "code": {
            const cv = typeof lv === "object" && lv ? lv : null;
            if (cv && cv.code && cv.code.trim()) {
              elements.push(
                <div key={block.id}>
                  <div style={S.codeLangLabel}>{cv.lang || "code"}</div>
                  <pre style={S.codeBlock}><code>{cv.code}</code></pre>
                </div>
              );
            }
            break;
          }
          case "number": {
            const nv = typeof lv === "object" && lv ? lv : null;
            if (nv && (nv.label || nv.value)) {
              elements.push(
                <span key={block.id} style={S.numberStat}>
                  {nv.label ? <><strong>{nv.label}</strong>: {nv.value || 0}</> : <strong>{nv.value || 0}</strong>}
                </span>
              );
            }
            break;
          }
          case "link": {
            const url = typeof lv === "string" ? lv.trim() : "";
            if (url && section.isReferences) {
              elements.push(
                <p key={block.id} style={S.linkRef}>
                  [{elements.length + 1}] <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563EB", textDecoration: "none" }}>{url}</a>
                </p>
              );
            }
            break;
          }
          case "dropdown": {
            if (lv && lv.category && lv.value) {
              elements.push(
                <p key={block.id} style={{ ...S.bodyText, fontSize: 13, color: "#6B7280" }}>
                  <strong>{lv.category}:</strong> {lv.value}
                </p>
              );
            }
            break;
          }
          case "file": {
            if (lv && lv.data && lv.type?.startsWith("image/")) {
              elements.push(
                <figure key={block.id} style={{ margin: "16px 0", textAlign: "center" as const }}>
                  <img src={lv.data} alt={lv.name || "Figure"} style={{ maxWidth: "100%", borderRadius: 4, border: "1px solid #E5E7EB" }} />
                  {lv.name && <figcaption style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6, fontStyle: "italic" }}>{lv.name}</figcaption>}
                </figure>
              );
            } else if (lv && lv.name) {
              elements.push(
                <p key={block.id} style={{ ...S.bodyText, fontSize: 13, color: "#6B7280" }}>
                  📎 {lv.name} ({lv.size ? Math.round(lv.size / 1024) + " KB" : ""})
                </p>
              );
            }
            break;
          }
          case "date": {
            const dv = typeof lv === "string" ? lv.trim() : "";
            if (dv) {
              elements.push(<p key={block.id} style={{ ...S.bodyText, fontSize: 13, color: "#6B7280" }}>{dv}</p>);
            }
            break;
          }
        }
      });

      if (elements.length > 0) {
        taskContents.push({ task, elements, words: taskWords });
        totalWords += taskWords;
      }
    });

    return {
      section,
      taskContents,
      totalWords,
      hasContent: taskContents.length > 0,
    };
  });

  const totalWordCount = sectionsData.reduce((sum, sd) => sum + sd.totalWords, 0);
  const progressPct = Math.min(Math.round((totalWordCount / 12000) * 100), 100);

  /* ── Render ── */
  return (
    <div style={S.page}>
      {/* ═══ STICKY HEADER ═══ */}
      <div style={S.header}>
        <img src="/images/rifc-logo-black.png" alt="R IF C" style={{ height: 28, width: "auto", borderRadius: 4, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <h1 style={S.headerTitle}>{lang === "ro" ? "Articol Științific" : lang === "en" ? "Scientific Article" : "Научная статья"}</h1>
          <p style={S.headerSub}>{lang === "ro" ? "Manuscris pentru publicație internațională" : lang === "en" ? "Manuscript for international publication" : "Рукопись для международной публикации"}</p>
        </div>
        <div style={{ flex: 1 }} />

        {/* Word count */}
        <div style={S.wordBadge}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "'JetBrains Mono', monospace" }}>
              {totalWordCount.toLocaleString()} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>/ 12.000</span>
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>{WORDS_LABEL[lang]}</div>
          </div>
          <div style={{ width: 60, height: 4, background: "#E5E7EB", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ width: `${progressPct}%`, height: "100%", background: progressPct > 80 ? "#059669" : "#F59E0B", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Language pill */}
        <div style={S.langPill}>
          {(["ro", "en", "ru"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => changeLang(l)}
              style={{
                padding: "7px 14px",
                border: "none",
                background: lang === l ? LANG_COLORS[l] : "transparent",
                color: lang === l ? "#fff" : "#6B7280",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                letterSpacing: 0.5,
                transition: "all 0.15s",
              }}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ PAPER BODY ═══ */}
      <div style={S.paper}>
        <div style={S.paperInner}>
          {/* Manuscript label */}
          <div style={S.manuscriptLabel}>
            {lang === "ro" ? "MANUSCRIS" : lang === "en" ? "MANUSCRIPT" : "РУКОПИСЬ"}
          </div>

          {/* Title */}
          <h2 style={S.title}>{TITLE[lang]}</h2>

          {/* Author */}
          <p style={S.author}>Dumitru Talmazan</p>
          <p style={S.affiliation}>Talmazan School SRL, Republic of Moldova</p>
          <p style={S.correspondence}>
            {lang === "ro" ? "Corespondență" : lang === "en" ? "Correspondence" : "Корреспонденция"}: info.talmazan@gmail.com
          </p>

          {/* Keywords */}
          <div style={S.keywordsWrap}>
            {KEYWORDS[lang].map((kw) => (
              <span key={kw} style={S.keywordTag}>{kw}</span>
            ))}
          </div>

          {/* ═══ SECTIONS ═══ */}
          {sectionsData.map((sd) => (
            <section key={sd.section.id} id={`section-${sd.section.id}`}>
              {/* Section heading */}
              <div style={S.sectionHeading}>
                <span>{sd.section.heading[lang]}</span>
                {sd.section.targetWords && (
                  <span style={S.sectionWordCount}>
                    ({sd.totalWords.toLocaleString()} / {sd.section.targetWords.toLocaleString()})
                  </span>
                )}
              </div>

              {/* Content or placeholder */}
              {sd.hasContent ? (
                <div>
                  {sd.taskContents.map((tc, tci) => (
                    <div key={tc.task.key + "-" + tci}>
                      {/* Sub-heading for task (only if multiple tasks with content) */}
                      {sd.taskContents.length > 1 && (
                        <h4 style={S.subHeading}>{tc.task.label}</h4>
                      )}
                      {tc.elements}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={S.placeholder}>
                  <div style={S.placeholderLabel}>{SOON_LABELS[lang]}</div>
                  <div style={S.placeholderName}>{sd.section.heading[lang]}</div>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      {/* ═══ PRINT STYLES ═══ */}
      <style>{`
        @media print {
          body { background: #fff !important; }
          div[style*="position: sticky"] { position: static !important; border-bottom: none !important; display: none !important; }
        }
        @media (max-width: 768px) {
          div[style*="max-width: 740px"] { padding: 16px 8px !important; }
          div[style*="padding: 56px 56px"] { padding: 24px 16px 32px !important; }
        }
      `}</style>
    </div>
  );
}
