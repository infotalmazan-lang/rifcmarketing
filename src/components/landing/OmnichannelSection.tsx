"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "@/lib/i18n";
import Link from "next/link";
import { Sparkles, Calculator, ChevronDown, AlertTriangle, ArrowRight, Target, Zap, RotateCw, Flag, Eye } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GradientBorderBlock, WatermarkNumber, getScoreColor, getScoreZone } from "@/components/ui/V2Elements";

/* ── RIFC Colors ─────────────────────────────────────────── */
const COLORS = { r: "#DC2626", i: "#2563EB", f: "#D97706", c: "#059669" };
const VAR_NAMES: Record<string, Record<string, string>> = {
  r: { ro: "R (Relevanță)", en: "R (Relevance)" },
  i: { ro: "I (Interes)", en: "I (Interest)" },
  f: { ro: "F (Formă)", en: "F (Form)" },
};

/* ── Lucide-style SVG mini icons (inline, no emoji) ──────── */
function IconGrid() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  );
}
function IconPlus() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  );
}
function IconX() {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );
}
function IconLayers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  );
}

/* ── Channel Zone Data (structural, not translatable) ─────── */
interface ZoneData {
  label: string;
  preview: string;
  title: string;
  items: string[];
  fail: string;
}

interface ChannelData {
  name: string;
  category: string;
  default?: boolean;
  zones: {
    r: ZoneData;
    i: ZoneData;
    f: ZoneData;
    c: ZoneData;
  };
}

const ALL_CHANNELS: Record<string, ChannelData> = {
  website: {
    name: "Website / Landing Page",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 RELEVAN\u021a\u0102", preview: "URL-ul corespunde cu inten\u021bia de c\u0103utare, surs\u0103 de trafic aliniat\u0103", title: "R \u2014 Cine ajunge pe site?", items: ["URL-ul corespunde cu ce au c\u0103utat", "Sursa de trafic e aliniat\u0103 (Google, ad, referral)", "Headline-ul confirm\u0103: e\u0219ti \u00een locul potrivit", "Limba, loca\u021bia, contextul \u2014 corecte", "Vizitatorul se auto-identific\u0103 \u00een 2 secunde"], fail: "R < 3: Bounce rate 90%. Un site frumos nu salveaz\u0103 irelevan\u021ba." },
      i: { label: "I \u2014 INTERES", preview: "De ce 73% din campanii e\u0219ueaz\u0103 chiar dac\u0103 arat\u0103 bine?", title: "I \u2014 Ce \u00eei face s\u0103 r\u0103m\u00e2n\u0103?", items: ["Headline-ul promite un beneficiu clar", "Subheadline-ul creeaz\u0103 curiozitate", "Dovad\u0103 social\u0103 (testimoniale, cifre)", "Propunere Unic\u0103 de Valoare vizibil\u0103", "Bucl\u0103 deschis\u0103 care atrage mai ad\u00e2nc"], fail: "I < 3: Scaneaz\u0103 5 sec, nu g\u0103se\u0219te nimic, \u00eenchide tab-ul." },
      f: { label: "F \u2014 FORM\u0102", preview: "Layout, CTA, font, spa\u021biu alb, responsive, vitez\u0103", title: "F \u2014 Designul amplific\u0103 mesajul?", items: ["Ierarhie vizual\u0103 clar\u0103 (H1 > H2 > body)", "Spa\u021biu alb suficient \u2014 nu aglomerat", "CTA vizibil deasupra fold-ului", "Font lizibil, contrast bun, responsive", "Vitez\u0103 de \u00eenc\u0103rcare < 3 secunde"], fail: "F < 3: Con\u021binut bun pe care nimeni nu-l cite\u0219te. Zid de text." },
      c: { label: "C = CLARITATE", preview: "Vizitatorul \u00een\u021belege exact cine e\u0219ti \u0219i ce s\u0103 fac\u0103", title: "C \u2014 Testul clarit\u0103\u021bii", items: ["Testul de 5 secunde: un str\u0103in \u00een\u021belege pagina", "Un singur mesaj principal", "Un singur CTA, evident", "Zero confuzie", "Pasul urm\u0103tor e clar f\u0103r\u0103 s\u0103 g\u00e2nde\u0219ti"], fail: "C slab = vizite f\u0103r\u0103 conversii. Trafic irosit." },
    },
  },
  social: {
    name: "Social Media (organic)",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 AUDIEN\u021a\u0102", preview: "Followeri relevan\u021bi, algoritm, timing, ni\u0219\u0103 clar\u0103", title: "R \u2014 Cine vede postarea?", items: ["Followerii = audien\u021b\u0103 relevant\u0103?", "Algoritmul o arat\u0103 oamenilor potrivi\u021bi?", "Profilul confirm\u0103 autoritate?", "Timing optim?", "Ni\u0219\u0103 clar\u0103 din primele 2 cuvinte?"], fail: "E\u0218EC: Postezi marketing dar audien\u021ba e de gameri." },
      i: { label: "I \u2014 HOOK + CON\u021aINUT", preview: "Prima linie opre\u0219te scroll-ul, date concrete, curiozitate", title: "I \u2014 Ce opre\u0219te scroll-ul?", items: ["Hook-ul (prima linie) opre\u0219te scroll-ul?", "Bucl\u0103 deschis\u0103: 73% au aceea\u0219i problem\u0103", "Date concrete: cifre, procente", "Curiozitate: Am descoperit un pattern", "Promisiune real\u0103, nu clickbait"], fail: "E\u0218EC: \u201eAm scris un articol nou\u201d \u2014 zero engagement." },
      f: { label: "F \u2014 FORMAT VIZUAL", preview: "Imagine, carousel, video, formatare text, hashtag-uri", title: "F \u2014 Cum arat\u0103 postarea?", items: ["Imaginea opre\u0219te scroll-ul", "Textul formatat cu spa\u021bii", "Bold pe cuvintele cheie", "Carousel vs imagine vs video", "Hashtag-uri relevante"], fail: "E\u0218EC: Text lung f\u0103r\u0103 formatare, f\u0103r\u0103 imagine." },
      c: { label: "C = ENGAGEMENT", preview: "Like-uri, comentarii, share-uri, save-uri, DM-uri", title: "C \u2014 Ce \u00eenseamn\u0103 engagement-ul?", items: ["Like = rezonan\u021b\u0103 emo\u021bional\u0103", "Comentariu = interes + opinie", "Share = altcineva trebuie s\u0103 vad\u0103 asta", "Save = vreau s\u0103 revin", "DM = vreau s\u0103 aflu mai mult"], fail: "Supreme = rat\u0103 mare de share." },
    },
  },
  video: {
    name: "Video (YouTube/TikTok/Reels)",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 DESCOPERIRE", preview: "Thumbnail + titlu \u00een feed-ul potrivit", title: "R \u2014 Cine g\u0103se\u0219te videoul?", items: ["Titlu optimizat SEO/algoritm", "Thumbnail care atrage click-ul", "Tag-uri \u0219i categorii corecte", "Publicat c\u00e2nd audien\u021ba e activ\u0103"], fail: "E\u0218EC: Video bun pe canalul gre\u0219it." },
      i: { label: "I \u2014 HOOK + CON\u021aINUT", preview: "Primele 3 secunde, reten\u021bie, valoare", title: "I \u2014 Primele 3 secunde", items: ["Hook \u00een primele 3 secunde", "Bucl\u0103 deschis\u0103 care re\u021bine", "Valoare real\u0103, nu umplut\u0103", "Reten\u021bie peste 50%", "Pattern interrupt periodic"], fail: "E\u0218EC: Intro de 30 sec cu logo animat." },
      f: { label: "F \u2014 PRODUC\u021aIE", preview: "Calitate imagine/sunet, editare, ritm, subtitl\u0103ri", title: "F \u2014 Produc\u021bia amplific\u0103?", items: ["Audio clar (mai important dec\u00e2t video)", "Editare ritmic\u0103, f\u0103r\u0103 timp mort", "Subtitl\u0103ri (85% privesc f\u0103r\u0103 sunet)", "B-roll relevant", "Thumbnail personalizat"], fail: "E\u0218EC: Audio prost, f\u0103r\u0103 subtitl\u0103ri, monoton." },
      c: { label: "C = VIZIONARE + AC\u021aIUNE", preview: "Reten\u021bie, like-uri, abon\u0103ri, comentarii", title: "C \u2014 C\u00e2t au vizionat?", items: ["Durat\u0103 medie de vizionare mare", "Raport like/dislike", "Abonare dup\u0103 vizionare", "Comentarii cu \u00eentreb\u0103ri", "Share = Supreme"], fail: "Supreme: oamenii privesc p\u00e2n\u0103 la final." },
    },
  },
  email: {
    name: "Email Marketing",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 SEGMENTARE", preview: "List\u0103 segmentat\u0103, timing optimizat, expeditor cunoscut", title: "R \u2014 Cui trimiți?", items: ["Lista segmentat\u0103 pe interese?", "Timing optimizat per segment?", "Nume expeditor recunoscut?", "Nu trimiți la toat\u0103 lista"], fail: "E\u0218EC: Email blast la 50K nesegmenta\u021bi." },
      i: { label: "I \u2014 SUBJECT LINE", preview: "Subject cu curiozitate + preview text complementar", title: "I \u2014 Deschid email-ul?", items: ["Subject-ul creeaz\u0103 curiozitate?", "Preview text-ul completeaz\u0103 hook-ul?", "Nu e clickbait", "Personalizat cu context"], fail: "E\u0218EC: Newsletter #47." },
      f: { label: "F \u2014 FORMAT CORP", preview: "Paragrafe scurte, CTA central, mobile-friendly", title: "F \u2014 Corp scanabil?", items: ["Paragrafe scurte", "Un singur CTA principal", "Mobile-friendly", "Personalizare [Nume]", "Ierarhie vizual\u0103"], fail: "E\u0218EC: Zid de text, 5 linkuri, f\u0103r\u0103 ierarhie." },
      c: { label: "C = METRICI", preview: "Rat\u0103 deschidere, rat\u0103 click, rat\u0103 r\u0103spuns, dezabon\u0103ri", title: "C \u2014 Ce spun metricile?", items: ["Open rate = R func\u021bioneaz\u0103", "Click rate = IxF func\u021bioneaz\u0103", "R\u0103spuns = Claritate Suprem\u0103", "Dezabon\u0103ri mici = segmentare bun\u0103"], fail: "Open 40%+ \u0219i Click 10%+ = Supreme." },
    },
  },
  paid_ads: {
    name: "Reclame Pl\u0103tite (Google/Meta)",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 TARGETARE", preview: "Audien\u021b\u0103 precis\u0103, lookalike, potrivire keyword, retargeting", title: "R \u2014 Cine vede reclama?", items: ["Targetare precis\u0103 = R mare", "Audien\u021be lookalike", "Tipul de potrivire keyword", "Retargeting = R maxim"], fail: "E\u0218EC: Targetare larg\u0103 c\u0103tre toat\u0103 lumea." },
      i: { label: "I \u2014 COPY + OFERT\u0102", preview: "Durere/solu\u021bie clar\u0103, ofert\u0103 concret\u0103, cifre", title: "I \u2014 Oferta \u00een 2 secunde", items: ["Durere + solu\u021bie \u00een headline", "Ofert\u0103 gratuit\u0103 = barier\u0103 zero", "Cifre concrete", "Urgen\u021b\u0103 subtil\u0103"], fail: "E\u0218EC: Descoper\u0103 solu\u021bia noastr\u0103 inovativ\u0103." },
      f: { label: "F \u2014 CREATIVE", preview: "Vizual care opre\u0219te scroll-ul, contrast, CTA pe imagine", title: "F \u2014 Creative-ul opre\u0219te scroll-ul?", items: ["Vizual care opre\u0219te scroll-ul", "Contrast puternic, text mare", "Branding consistent", "CTA clar pe imagine"], fail: "E\u0218EC: Foto generic\u0103 de stock." },
      c: { label: "C = CONVERSII", preview: "CTR, CPC, rat\u0103 de conversie, ROAS", title: "C \u2014 Ce spun cifrele?", items: ["CTR mare = IxF func\u021bioneaz\u0103", "Conversie mare = C mare", "CPC mic = R precis", "ROAS pozitiv = totul func\u021bioneaz\u0103"], fail: "CTR 3%+ \u0219i Conv 5%+ = Supreme." },
    },
  },
  seo_blog: {
    name: "SEO / Blog / Con\u021binut",
    category: "Digital",
    default: true,
    zones: {
      r: { label: "R \u2014 POTRIVIRE INTEN\u021aIE", preview: "Keyword-ul se potrive\u0219te cu inten\u021bia de c\u0103utare", title: "R \u2014 Articolul r\u0103spunde la ce caut\u0103?", items: ["Cercetare corect\u0103 de keyword-uri", "Potrivirea inten\u021biei de c\u0103utare (informa\u021bional/tranzac\u021bional)", "Title tag optimizat", "URL curat \u0219i descriptiv"], fail: "E\u0218EC: Articol despre X c\u00e2nd userul caut\u0103 Y." },
      i: { label: "I \u2014 CON\u021aINUT VALOROS", preview: "Insight-uri unice, date originale, r\u0103spuns complet", title: "I \u2014 De ce s\u0103 citeasc\u0103 tot articolul?", items: ["Insight-uri pe care nu le g\u0103sesc \u00een alt\u0103 parte", "Date originale, nu copiate", "R\u0103spuns complet la \u00eentrebare", "Structur\u0103 care ghideaz\u0103 lectura"], fail: "E\u0218EC: Rezumat generic din alte 5 site-uri." },
      f: { label: "F \u2014 STRUCTUR\u0102 + UX", preview: "H2/H3 scanabile, imagini, link-uri interne, vitez\u0103", title: "F \u2014 Experien\u021ba de lectur\u0103", items: ["H2/H3 clare \u0219i scanabile", "Imagini relevante, nu decorative", "Link-uri interne logice", "Vitez\u0103 optim\u0103 a paginii", "Schema markup"], fail: "E\u0218EC: Text continuu f\u0103r\u0103 headinguri, 15 sec \u00eenc\u0103rcare." },
      c: { label: "C = RANKING + TIMP PE PAGIN\u0102", preview: "Pozi\u021bie Google, timp pe pagin\u0103, bounce rate", title: "C \u2014 Google confirm\u0103 claritatea", items: ["Top 3 = relevan\u021b\u0103 maxim\u0103", "Timp mare pe pagin\u0103 = con\u021binut valoros", "Bounce rate mic = potrivire bun\u0103", "Featured snippet = Supreme"], fail: "C slab = pagina 3+ pe Google." },
    },
  },
};

type ZoneKey = "r" | "i" | "f" | "c";

/* Key channels that have expanded i18n descriptions */
const KEYED_CHANNELS = ["website", "social", "video", "email", "paid_ads", "seo_blog"];

/* ── COMPONENT ─────────────────────────────────────────────── */
export default function OmnichannelSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const defaultIds = Object.keys(ALL_CHANNELS).filter((k) => ALL_CHANNELS[k].default);
  const [activeIds, setActiveIds] = useState<string[]>([...defaultIds]);
  const [channel, setChannel] = useState("website");
  const [activeZone, setActiveZone] = useState<ZoneKey>("r");
  const [scores, setScores] = useState({ r: 8, i: 7, f: 9 });
  const [showAdd, setShowAdd] = useState(false);

  const c = scores.r + scores.i * scores.f;
  const cLabel = c <= 20 ? t.omnichannel.levelCritical : c <= 50 ? t.omnichannel.levelNoise : c <= 80 ? t.omnichannel.levelMedium : t.omnichannel.levelSupreme;
  const cColor = c <= 20 ? COLORS.r : c <= 50 ? COLORS.f : c <= 80 ? COLORS.i : COLORS.c;

  /* Scroll-triggered fade-in */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const addChannel = (id: string) => {
    if (!activeIds.includes(id)) setActiveIds([...activeIds, id]);
  };
  const addAll = () => {
    setActiveIds(Object.keys(ALL_CHANNELS));
    setShowAdd(false);
  };
  const removeChannel = (id: string) => {
    if (defaultIds.includes(id)) return;
    const next = activeIds.filter((x) => x !== id);
    setActiveIds(next);
    if (channel === id) setChannel(next[0]);
  };

  const available = Object.keys(ALL_CHANNELS).filter((k) => !activeIds.includes(k));
  const chData = ALL_CHANNELS[channel];

  const categories: Record<string, string[]> = {};
  available.forEach((id) => {
    const cat = ALL_CHANNELS[id].category;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(id);
  });

  /* PUNCT 5 — dynamic diagnosis computation */
  const lowestVar = useMemo(() => {
    const vars = { r: scores.r, i: scores.i, f: scores.f };
    const min = Math.min(scores.r, scores.i, scores.f);
    return (Object.keys(vars) as ("r" | "i" | "f")[]).find((k) => vars[k] === min) || "r";
  }, [scores]);

  const channelName = chData?.name || "General";

  /* Get the expanded i18n variable data if channel has it */
  const hasExpandedData = KEYED_CHANNELS.includes(channel);
  const expandedVars = hasExpandedData ? t.omnichannel.channelVariables?.[channel] : null;
  const channelSummary = t.omnichannel.channelSummaries?.[channel];
  const channelTip = t.omnichannel.channelTips?.[channel];

  /* Potential improved score */
  const improvedVal = Math.min(lowestVar === "r" ? scores.r + 2 : scores.r, 10);
  const improvedI = Math.min(lowestVar === "i" ? scores.i + 2 : scores.i, 10);
  const improvedF = Math.min(lowestVar === "f" ? scores.f + 2 : scores.f, 10);
  const improvedC = (lowestVar === "r" ? improvedVal : scores.r) + (lowestVar === "i" ? improvedI : scores.i) * (lowestVar === "f" ? improvedF : scores.f);
  const percentChange = c > 0 ? Math.round(((improvedC - c) / c) * 100) : 0;
  const improvedZone = getScoreZone(improvedC);

  return (
    <section
      ref={sectionRef}
      id="omnichannel"
      className={`py-[120px] px-6 md:px-10 max-w-content mx-auto relative transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* V2 Section header */}
      <SectionHeader
        chapter={t.omnichannel.chapter}
        titlePlain={t.omnichannel.titlePlain}
        titleBold={t.omnichannel.titleBold}
        description=""
        watermarkNumber="05"
        watermarkColor="#DC2626"
      />

      {/* PUNCT 1 — Shock intro with colored scores */}
      <div className="mb-12">
        <p className="font-mono text-[20px] md:text-[22px] font-bold text-white leading-[1.5] mb-4">
          {t.omnichannel.introShock.split(/(C = 85|C = 30)/g).map((part, i) => {
            if (part === "C = 85") return <span key={i} className="text-rifc-green">{part}</span>;
            if (part === "C = 30") return <span key={i} className="text-rifc-red">{part}</span>;
            return <span key={i}>{part}</span>;
          })}
        </p>
        <p className="font-body text-[16px] text-gray-300 leading-[1.7] mb-3">
          {t.omnichannel.introBody}
        </p>
        <p className="font-body text-[14px] text-gray-400 leading-[1.6]">
          {t.omnichannel.introAction}
        </p>
      </div>

      {/* Equation header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="font-mono text-[15px] tracking-[2px]">
          <span className="text-rifc-red">R</span>
          <span className="text-text-invisible"> + (</span>
          <span className="text-rifc-blue">I</span>
          <span className="text-text-invisible"> x </span>
          <span className="text-rifc-amber">F</span>
          <span className="text-text-invisible">) = </span>
          <span className="text-rifc-green">C</span>
        </div>
        <span className="font-mono text-[11px] text-text-muted tracking-[1px]">
          {t.omnichannel.perChannel}
        </span>
      </div>

      {/* Channel tabs */}
      <div className="flex flex-wrap gap-1.5 justify-start mb-2">
        {activeIds.map((id) => (
          <div key={id} className="relative inline-flex">
            <button
              onClick={() => { setChannel(id); setActiveZone("r"); }}
              className={`px-3 py-2 rounded font-mono text-[10px] transition-all duration-200 border cursor-pointer ${
                channel === id
                  ? "bg-[rgba(220,38,38,0.08)] border-rifc-red text-rifc-red"
                  : "bg-surface-card border-border-medium text-text-faint hover:text-text-muted hover:border-border-medium"
              }`}
            >
              {ALL_CHANNELS[id].name}
            </button>
            {!defaultIds.includes(id) && (
              <button
                onClick={(e) => { e.stopPropagation(); removeChannel(id); }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-surface-bg border border-border-medium text-text-ghost flex items-center justify-center cursor-pointer hover:text-rifc-red hover:border-rifc-red transition-colors"
              >
                <IconX />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add buttons */}
      <div className="flex gap-2 items-center mb-10">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] transition-all duration-200 border cursor-pointer ${
            showAdd
              ? "bg-[rgba(5,150,105,0.08)] border-rifc-green text-rifc-green"
              : "bg-surface-card border-border-light text-text-muted hover:text-text-primary"
          }`}
        >
          <IconPlus /> {t.omnichannel.addChannel}
        </button>
        {available.length > 0 && (
          <button
            onClick={addAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[10px] transition-all duration-200 border border-border-light bg-surface-card text-text-muted hover:text-text-primary cursor-pointer"
          >
            <IconLayers /> {t.omnichannel.addAll} ({available.length})
          </button>
        )}
      </div>

      {/* Add panel */}
      {showAdd && available.length > 0 && (
        <div className="mb-10 border border-border-medium rounded-sm p-5 bg-surface-card">
          {Object.keys(categories).map((cat) => (
            <div key={cat} className="mb-4 last:mb-0">
              <div className="font-mono text-[9px] text-text-muted tracking-[2px] uppercase mb-3">{cat}</div>
              <div className="flex flex-wrap gap-1.5">
                {categories[cat].map((id) => (
                  <button
                    key={id}
                    onClick={() => addChannel(id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[rgba(5,150,105,0.05)] border border-[rgba(5,150,105,0.15)] text-rifc-green font-mono text-[9px] cursor-pointer hover:bg-[rgba(5,150,105,0.1)] transition-colors"
                  >
                    <IconPlus /> {ALL_CHANNELS[id].name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main content — 2 columns */}
      <div className="flex gap-5 flex-wrap lg:flex-nowrap">
        {/* Left column: Channel zones + Sliders */}
        <div className="flex-1 min-w-[320px]">
          {chData && (
            <div className="border border-border-medium rounded-sm overflow-hidden">
              {/* Channel name header */}
              <div className="px-4 py-3 bg-surface-card border-b border-border-subtle flex items-center gap-2">
                <IconGrid />
                <span className="font-mono text-[10px] text-text-muted tracking-[2px] uppercase">{chData.name}</span>
              </div>

              {/* R, I, F, C zone rows */}
              {(["r", "i", "f", "c"] as ZoneKey[]).map((z) => (
                <div
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`px-4 cursor-pointer transition-all duration-150 ${
                    z !== "c" ? "border-b border-border-subtle" : ""
                  } ${
                    activeZone === z ? "bg-[var(--zone-bg)]" : "hover:bg-surface-card"
                  }`}
                  style={{
                    "--zone-bg": `${COLORS[z]}08`,
                    borderLeft: activeZone === z ? `3px solid ${COLORS[z]}` : "3px solid transparent",
                    padding: z === "i" ? "18px 16px" : "12px 16px",
                  } as React.CSSProperties}
                >
                  <div className="font-mono text-[9px] tracking-[1px] mb-1" style={{ color: COLORS[z] }}>
                    {chData.zones[z].label}
                  </div>
                  <div
                    className={`font-mono leading-[1.5] ${
                      z === "i" ? "text-[13px] text-text-secondary" : "text-[10px] text-text-muted"
                    }`}
                  >
                    {chData.zones[z].preview}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Score sliders */}
          <div className="mt-4 border border-border-medium rounded-sm p-4 bg-surface-card">
            <div className="font-mono text-[9px] text-text-muted tracking-[2px] uppercase mb-4">
              {t.omnichannel.simulateScore}
            </div>
            {(["r", "i", "f"] as const).map((key) => (
              <div key={key} className="mb-3 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-[11px] font-semibold" style={{ color: COLORS[key] }}>
                    {key.toUpperCase()} = {scores[key]}
                  </span>
                  <span className="font-mono text-[9px] text-text-muted">
                    {scores[key] <= 3 ? t.omnichannel.low : scores[key] <= 6 ? t.omnichannel.mid : t.omnichannel.high}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={scores[key]}
                  onChange={(e) => setScores((p) => ({ ...p, [key]: parseInt(e.target.value) }))}
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: COLORS[key],
                    background: `linear-gradient(to right, ${COLORS[key]} ${(scores[key] - 1) * 11.1}%, rgba(255,255,255,0.06) ${(scores[key] - 1) * 11.1}%)`,
                  }}
                />
              </div>
            ))}

            {/* C Score display */}
            <div
              className="mt-4 rounded-md p-4 text-center border transition-all duration-300"
              style={{ background: `${cColor}0a`, borderColor: cColor }}
            >
              <div className="font-mono text-[18px] tracking-[1px]" style={{ color: cColor }}>
                C = {scores.r} + ({scores.i} x {scores.f}) = <strong className="text-[22px]">{c}</strong>
              </div>
              <div className="font-mono text-[10px] mt-1 tracking-[2px]" style={{ color: cColor, opacity: 0.7 }}>
                {cLabel}
              </div>
              {scores.r < 3 && (
                <div className="mt-2 flex items-center justify-center gap-1.5 font-mono text-[9px] text-rifc-red bg-[rgba(220,38,38,0.08)] px-3 py-1.5 rounded">
                  <AlertTriangle size={12} />
                  {t.omnichannel.relevanceGateWarning}
                </div>
              )}
            </div>

            {/* PUNCT 5 — Dynamic diagnosis */}
            <div className="mt-4 border-t border-border-subtle pt-4">
              <div className="font-mono text-[9px] text-text-muted tracking-[2px] uppercase mb-3">
                DIAGNOSTICUL T\u0102U
              </div>
              <div
                className="p-3 rounded-md border-l-3 text-[12px] font-body leading-[1.6]"
                style={{
                  borderLeftWidth: "3px",
                  borderLeftColor: cColor,
                  background: `${cColor}08`,
                  color: cColor,
                }}
              >
                {scores.r < 3 ? (
                  <p className="font-medium">{t.omnichannel.diagGateActivated.replace("{channel}", channelName)}</p>
                ) : c < 30 ? (
                  <p className="font-medium">{t.omnichannel.diagCritical}</p>
                ) : c < 50 ? (
                  <p className="font-medium">{t.omnichannel.diagInefficient.replace("{channel}", channelName).replace("{lowestVar}", lowestVar.toUpperCase())}</p>
                ) : c < 80 ? (
                  <p className="font-medium">{t.omnichannel.diagMedium.replace("{lowestVar}", lowestVar.toUpperCase()).replace("{channel}", channelName)}</p>
                ) : (
                  <p className="font-medium">{t.omnichannel.diagSupreme.replace("{channel}", channelName)}</p>
                )}
              </div>

              {/* Show improvement suggestion if not supreme */}
              {c < 80 && scores.r >= 3 && (
                <div className="mt-2 p-3 rounded-md bg-surface-card border border-border-subtle">
                  <p className="font-mono text-[11px] text-text-secondary leading-[1.6]">
                    {t.omnichannel.diagLowestVar.replace("{var}", lowestVar.toUpperCase()).replace("{val}", String(scores[lowestVar as keyof typeof scores]))}
                  </p>
                  <p className="font-mono text-[11px] text-rifc-green leading-[1.6] mt-1">
                    {t.omnichannel.diagIncrease
                      .replace("{var}", lowestVar.toUpperCase())
                      .replace("{from}", String(scores[lowestVar as keyof typeof scores]))
                      .replace("{to}", String(Math.min(scores[lowestVar as keyof typeof scores] + 2, 10)))
                      .replace("{newC}", String(improvedC))}
                    {" "}
                    <span className="text-text-muted">
                      {t.omnichannel.diagJumpTo.replace("{percent}", String(percentChange)).replace("{zone}", improvedZone)}
                    </span>
                  </p>
                  <Link
                    href="/audit"
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] text-rifc-red mt-2 hover:underline no-underline"
                  >
                    <ArrowRight size={12} /> {t.omnichannel.diagTestAudit}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Zone detail (PUNCT 3 — always populated) */}
        <div className="flex-1 min-w-[280px]">
          {/* Zone detail — always show (default R) */}
          {chData && activeZone && (
            <div
              className="rounded-sm p-5 border transition-all duration-300"
              style={{ background: `${COLORS[activeZone]}06`, borderColor: COLORS[activeZone] }}
            >
              <div className="font-mono text-[12px] font-semibold tracking-[1px] mb-5" style={{ color: COLORS[activeZone] }}>
                {chData.zones[activeZone].title}
              </div>

              {/* PUNCT 2 — Expanded description if available */}
              {expandedVars && expandedVars[activeZone] && (
                <div className="mb-5">
                  <p className="font-body text-[13px] text-text-secondary leading-[1.7] mb-3">
                    {expandedVars[activeZone].desc}
                  </p>
                  {/* Scoring question */}
                  <div
                    className="flex items-start gap-2 p-3 rounded-md mb-3"
                    style={{ background: `${COLORS[activeZone]}0c` }}
                  >
                    <span className="font-mono text-[10px] tracking-[1px] shrink-0 mt-0.5" style={{ color: COLORS[activeZone] }}>?</span>
                    <p className="font-body text-[12px] text-text-muted italic leading-[1.6]">
                      {expandedVars[activeZone].question}
                    </p>
                  </div>
                  {/* Red flag */}
                  <div className="flex items-start gap-2 p-3 rounded-md bg-[rgba(220,38,38,0.06)]">
                    <AlertTriangle size={12} className="text-rifc-red shrink-0 mt-0.5" />
                    <p className="font-mono text-[10px] text-rifc-red/80 leading-[1.5]">
                      {expandedVars[activeZone].redFlag}
                    </p>
                  </div>
                </div>
              )}

              {/* Original zone items */}
              <div className="space-y-2.5 mb-5">
                {chData.zones[activeZone].items.map((item, i) => (
                  <div
                    key={i}
                    className="font-mono text-[10px] text-text-muted leading-[1.6] pl-3"
                    style={{ borderLeft: `2px solid ${COLORS[activeZone]}25` }}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div
                className="mt-4 p-3 rounded font-mono text-[9px] leading-[1.5]"
                style={{ background: `${COLORS[activeZone]}0c`, color: COLORS[activeZone] }}
              >
                {chData.zones[activeZone].fail}
              </div>
            </div>
          )}

          {/* PUNCT 3 — Channel summary + benchmarks */}
          {channelSummary && (
            <div className="mt-4 border border-border-light rounded-sm p-4 bg-surface-card">
              <div className="font-mono text-[9px] text-text-muted tracking-[2px] uppercase mb-3">
                {t.omnichannel.summaryLabel}
              </div>
              <p className="font-body text-[12px] text-text-muted leading-[1.7] mb-4">
                {channelSummary.summary}
              </p>

              {/* Key metrics */}
              <div className="font-mono text-[9px] text-text-muted tracking-[1px] uppercase mb-2">
                {t.omnichannel.keyMetricsLabel}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {channelSummary.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 font-mono text-[10px]">
                    <span
                      className="w-5 h-5 rounded-sm flex items-center justify-center text-[9px] font-bold"
                      style={{
                        color: COLORS[m.indicator.toLowerCase() as keyof typeof COLORS],
                        background: `${COLORS[m.indicator.toLowerCase() as keyof typeof COLORS]}15`,
                      }}
                    >
                      {m.indicator}
                    </span>
                    <span className="text-text-muted">{m.label}</span>
                  </div>
                ))}
              </div>

              {/* Benchmark */}
              <div
                className="p-2.5 rounded-md font-mono text-[10px] tracking-[1px] text-center"
                style={{
                  background: `${getScoreColor(channelSummary.benchmarkValue)}10`,
                  color: getScoreColor(channelSummary.benchmarkValue),
                }}
              >
                {t.omnichannel.benchmarkLabel}: {channelSummary.benchmark}
              </div>
            </div>
          )}

          {/* PUNCT 6 — Channel Pro Tip */}
          {channelTip && (
            <div className="mt-4 border border-border-subtle rounded-sm p-4">
              <div className="font-mono text-[9px] text-text-muted tracking-[1px] uppercase mb-2">
                {t.omnichannel.tipTitle}
              </div>
              <div className="font-body text-[13px] text-gray-300 leading-[1.7]">
                <span className="font-bold text-rifc-green">{t.omnichannel.quickWinLabel}</span>{" "}
                {channelTip.replace(/^Quick Win:\s*/i, "")}
              </div>
            </div>
          )}

          {/* Stats bar */}
          <div className="mt-4 border border-border-light rounded-sm p-4 bg-surface-card">
            <div className="font-mono text-[9px] text-text-muted tracking-[2px] uppercase mb-3">
              {activeIds.length} {t.omnichannel.channelsActive} / {Object.keys(ALL_CHANNELS).length} {t.omnichannel.channelsAvailable}
            </div>
            <div className="font-mono text-[13px] text-text-ghost text-center tracking-[3px] pt-3 border-t border-border-subtle">
              <span className="text-rifc-red">R</span>
              <span className="text-text-invisible"> + (</span>
              <span className="text-rifc-blue">I</span>
              <span className="text-text-invisible"> x </span>
              <span className="text-rifc-amber">F</span>
              <span className="text-text-invisible">) = </span>
              <span className="text-rifc-green">C</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DIAGNOSTIC UNIVERSAL: 3 PAȘI ──────────────────────── */}
      <div className="mt-16 pt-12 border-t border-border-subtle">
        {/* PUNCT 1 — Hook title */}
        <h3 className="font-mono text-[13px] tracking-[3px] uppercase text-rifc-red mb-4">
          {t.omnichannel.diagnosticTitle}
        </h3>
        <p className="font-heading text-[28px] md:text-[36px] font-light italic text-text-primary leading-[1.3] text-center mb-12">
          {t.omnichannel.diagHook}
        </p>

        {/* Vertical infographic — connecting line + numbered circles + arrows */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical connecting line */}
          <div
            className="absolute left-[23px] md:left-[27px] top-[28px] bottom-[28px] w-[2px]"
            style={{ background: "linear-gradient(to bottom, #DC2626, #DC262640)" }}
            aria-hidden="true"
          />

          {/* ── STEP 1 ──────────────────────────────────────────── */}
          <div className="relative pl-16 md:pl-20 pb-10">
            {/* Numbered circle */}
            <div className="absolute left-0 top-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-[rgba(220,38,38,0.12)] border-2 border-rifc-red flex items-center justify-center font-mono text-[22px] md:text-[26px] font-bold text-rifc-red z-[1]">
              1
            </div>
            <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#DC262660" bgTint="transparent">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-rifc-red shrink-0" />
                <h4 className="font-mono text-[15px] md:text-[17px] font-semibold text-text-primary tracking-[0.5px]">
                  {t.omnichannel.step1Title}
                </h4>
              </div>
              <div className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8] whitespace-pre-line">
                {t.omnichannel.step1Body}
              </div>
              <div className="mt-4 flex items-start gap-2 px-3 py-2 rounded-sm bg-[rgba(220,38,38,0.06)] border-l-2 border-rifc-red">
                <Flag size={14} className="text-rifc-red/60 mt-0.5 shrink-0" />
                <p className="font-body text-[12px] md:text-[13px] italic text-rifc-red/70 leading-[1.6]">
                  {t.omnichannel.step1Question}
                </p>
              </div>
            </GradientBorderBlock>
            {/* Arrow connector */}
            <div className="absolute left-[19px] md:left-[23px] -bottom-1 text-rifc-red/50" aria-hidden="true">
              <ChevronDown size={14} />
            </div>
          </div>

          {/* ── STEP 2 ──────────────────────────────────────────── */}
          <div className="relative pl-16 md:pl-20 pb-10">
            <div className="absolute left-0 top-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-[rgba(220,38,38,0.12)] border-2 border-rifc-red flex items-center justify-center font-mono text-[22px] md:text-[26px] font-bold text-rifc-red z-[1]">
              2
            </div>
            <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#2563EB60" bgTint="transparent">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={18} className="text-rifc-red shrink-0" />
                <h4 className="font-mono text-[15px] md:text-[17px] font-semibold text-text-primary tracking-[0.5px]">
                  {t.omnichannel.step2Title}
                </h4>
              </div>
              <div className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8] whitespace-pre-line">
                {t.omnichannel.step2Body}
              </div>
              {/* Mathematical warning block */}
              <div className="mt-4 p-4 rounded-sm bg-[rgba(220,38,38,0.08)] border-l-2 border-red-500">
                <div className="font-mono text-[12px] tracking-[1px] uppercase text-rifc-red/80 mb-2 flex items-center gap-2">
                  <AlertTriangle size={14} className="shrink-0" />
                  {t.omnichannel.step2WarningTitle}
                </div>
                <div className="font-mono text-[13px] md:text-[14px] text-text-muted leading-[2]">
                  <div className="text-red-400">{t.omnichannel.step2WarningLine1}</div>
                  <div className="text-green-400">{t.omnichannel.step2WarningLine2}</div>
                </div>
                <div className="mt-2 font-body text-[12px] md:text-[13px] italic text-text-muted leading-[1.6]">
                  <p className="text-red-400/70">{t.omnichannel.step2WarningConclusion1}</p>
                  <p className="text-green-400/70 mt-1">{t.omnichannel.step2WarningConclusion2}</p>
                </div>
              </div>
            </GradientBorderBlock>
            <div className="absolute left-[19px] md:left-[23px] -bottom-1 text-rifc-red/50" aria-hidden="true">
              <ChevronDown size={14} />
            </div>
          </div>

          {/* ── STEP 3 ──────────────────────────────────────────── */}
          <div className="relative pl-16 md:pl-20">
            <div className="absolute left-0 top-0 w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full bg-[rgba(220,38,38,0.12)] border-2 border-rifc-red flex items-center justify-center font-mono text-[22px] md:text-[26px] font-bold text-rifc-red z-[1]">
              3
            </div>
            <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#05966960" bgTint="transparent">
              <div className="flex items-center gap-2 mb-3">
                <RotateCw size={18} className="text-rifc-red shrink-0" />
                <h4 className="font-mono text-[15px] md:text-[17px] font-semibold text-text-primary tracking-[0.5px]">
                  {t.omnichannel.step3Title}
                </h4>
              </div>
              <div className="font-body text-[13px] md:text-[14px] text-text-secondary leading-[1.8]">
                {t.omnichannel.step3Body}
              </div>
              {/* Cyclic process */}
              <div className="mt-3 px-4 py-3 rounded-sm bg-[rgba(255,255,255,0.03)] border border-border-light">
                <div className="font-mono text-[12px] md:text-[13px] tracking-[1px] text-rifc-red/80 text-center">
                  {t.omnichannel.step3Cycle}
                </div>
              </div>
              {/* Goal */}
              <div className="mt-3 font-body text-[13px] md:text-[14px] leading-[1.7]">
                <span className="text-rifc-green font-semibold">C &ge; 80</span>
                <span className="text-text-muted"> &mdash; </span>
                <span className="text-text-secondary">{t.omnichannel.step3Goal}</span>
              </div>
              {/* 5-Second Test */}
              <div className="mt-4 flex items-start gap-2 px-3 py-2 rounded-sm bg-[rgba(5,150,105,0.06)] border-l-2 border-rifc-green">
                <Eye size={14} className="text-rifc-green/60 mt-0.5 shrink-0" />
                <p className="font-body text-[12px] md:text-[13px] italic text-rifc-green/70 leading-[1.6]">
                  {t.omnichannel.step3FinalCheck}
                </p>
              </div>
            </GradientBorderBlock>
          </div>
        </div>

        {/* ── PUNCT 3 — Before/After Example ────────────────────── */}
        <div className="max-w-3xl mx-auto mt-14">
          <GradientBorderBlock gradientFrom="#DC2626" gradientTo="#059669" bgTint="rgba(220,38,38,0.04)">
            <div className="font-mono text-[11px] tracking-[3px] uppercase text-text-muted mb-4">
              {t.omnichannel.exampleTitle}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="p-4 rounded-sm bg-[rgba(220,38,38,0.06)] border border-red-500/20">
                <div className="font-mono text-[11px] tracking-[2px] uppercase text-red-400 mb-2">
                  {t.omnichannel.exampleBefore}
                </div>
                <div className="font-mono text-[18px] md:text-[22px] font-bold text-red-400 mb-1">
                  {t.omnichannel.exampleBeforeEq}
                </div>
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-red-400/60 mb-3">
                  {t.omnichannel.exampleBeforeZone}
                </div>
                <div className="space-y-1 font-body text-[12px] text-text-muted leading-[1.6]">
                  <p>{t.omnichannel.exampleStep1}</p>
                  <p>{t.omnichannel.exampleStep2}</p>
                  <p>{t.omnichannel.exampleStep3}</p>
                </div>
              </div>

              {/* After */}
              <div className="p-4 rounded-sm bg-[rgba(5,150,105,0.06)] border border-green-500/20">
                <div className="font-mono text-[11px] tracking-[2px] uppercase text-green-400 mb-2">
                  {t.omnichannel.exampleAfter}
                </div>
                <div className="font-mono text-[18px] md:text-[22px] font-bold text-green-400 mb-1">
                  {t.omnichannel.exampleAfterEq}
                </div>
                <div className="font-mono text-[10px] tracking-[2px] uppercase text-green-400/60 mb-3">
                  {t.omnichannel.exampleAfterZone}
                </div>
              </div>
            </div>

            {/* Lift result */}
            <div className="mt-4 text-center">
              <span className="font-mono text-[16px] md:text-[20px] font-bold text-rifc-green">
                {t.omnichannel.exampleLift}
              </span>
            </div>
          </GradientBorderBlock>
        </div>

        {/* ── PUNCT 4 — Panic Button CTA ────────────────────────── */}
        <div className="max-w-3xl mx-auto mt-14 text-center">
          <h4 className="font-heading text-[22px] md:text-[28px] font-light text-text-primary mb-2">
            {t.omnichannel.ctaStuckTitle}
          </h4>
          <p className="font-body text-[14px] text-text-muted mb-8">
            {t.omnichannel.ctaStuckSub}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            {/* Audit button */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/audit"
                className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-10 py-[18px] bg-rifc-red text-white rounded-sm hover:bg-rifc-red/90 transition-all duration-300 no-underline"
              >
                <Sparkles size={16} />
                {t.omnichannel.ctaAuditBtn}
              </Link>
              <p className="font-body text-[11px] md:text-[12px] text-text-muted leading-[1.5] max-w-[280px]">
                {t.omnichannel.ctaAuditSub}
              </p>
            </div>

            {/* Diagnostic button */}
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[3px] uppercase px-10 py-[18px] border border-rifc-red/40 text-rifc-red rounded-sm hover:border-rifc-red hover:bg-[rgba(220,38,38,0.05)] transition-all duration-300 no-underline"
              >
                <Calculator size={16} />
                {t.omnichannel.ctaDiagnosticBtn}
              </Link>
              <p className="font-body text-[11px] md:text-[12px] text-text-muted leading-[1.5] max-w-[280px]">
                {t.omnichannel.ctaDiagnosticSub}
              </p>
            </div>
          </div>
        </div>

        {/* ── PUNCT 5 — Micro-closer ────────────────────────────── */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="font-heading text-[22px] md:text-[28px] font-light italic text-text-primary leading-[1.4] mb-4">
            {t.omnichannel.closerLine1}
          </p>
          <p className="font-body text-[14px] text-text-muted leading-[1.7] mb-3">
            {t.omnichannel.closerBody}
          </p>
          <p className="font-mono text-[12px] tracking-[1px] text-text-muted">
            {t.omnichannel.closerFinal}
          </p>
        </div>
      </div>

      {/* PUNCT 7 — Transition CTA to Chapter 06 */}
      <div className="mt-20 md:mt-24 text-center border-t border-border-subtle pt-12 md:pt-16">
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-2 italic">
          {t.omnichannel.transitionLine1}
        </p>
        <p className="font-heading text-[20px] md:text-[26px] font-light text-text-primary leading-[1.4] mb-6 italic">
          {t.omnichannel.transitionLine2}
        </p>
        <a
          href={t.omnichannel.transitionTarget}
          className="inline-flex items-center gap-2 font-body text-[14px] text-text-muted hover:text-text-primary transition-colors duration-200"
        >
          <ChevronDown size={16} strokeWidth={2} className="animate-bounce" />
          {t.omnichannel.transitionCta}
        </a>
      </div>
    </section>
  );
}
