"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Pencil,
  Plus,
  X,
  Check,
  ClipboardList,
  BarChart3,
  Share2,
  PlayCircle,
  Image,
  Video,
  FileText,
  Link,
  Globe,
  Music,
  Upload,
  Loader2,
  Copy,
  QrCode,
  Users,
  ExternalLink,
  UserCheck,
  Bot,
  LayoutGrid,
  RotateCcw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Flag,
  AlertTriangle,
  Fingerprint,
  Archive,
  ArchiveRestore,
  ShieldOff,
  Mail,
  Phone,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import * as tus from "tus-js-client";

/* ═══════════════════════════════════════════════════════════
   R IF C — Studiu Admin — Structura Sondaj
   6 tabs: SONDAJ | REZULTATE | DISTRIBUTIE | PANEL EXPERTI | AI BENCHMARK | PREVIEW
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
interface Category {
  id: string;
  type: string;
  label: string;
  short_code: string;
  color: string;
  display_order: number;
  is_visible: boolean;
  max_materials: number;
}

interface Stimulus {
  id: string;
  name: string;
  type: string;
  industry: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  audio_url: string | null;
  text_content: string | null;
  pdf_url: string | null;
  site_url: string | null;
  display_order: number;
  is_active: boolean;
  variant_label: string | null;
  execution_quality: string | null;
}

interface Expert {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  experience_years: number | null;
  brands_worked: string[] | null;
  total_budget_managed: number | null;
  marketing_roles: string[] | null;
  access_token: string;
  is_active: boolean;
  revoked_at: string | null;
  created_at: string;
}

interface ExpertEvaluation {
  id: string;
  stimulus_id: string;
  expert_id: string | null;
  expert_name: string;
  expert_role: string | null;
  r_score: number;
  i_score: number;
  f_score: number;
  c_score: number | null;
  cta_score: number | null;
  c_computed: number;
  r_justification: string | null;
  i_justification: string | null;
  f_justification: string | null;
  c_justification: string | null;
  cta_justification: string | null;
  brand_familiar: boolean | null;
  brand_justification: string | null;
  notes: string | null;
  evaluated_at: string;
}

interface AiEvaluation {
  id: string;
  stimulus_id: string;
  model_name: string;
  r_score: number;
  i_score: number;
  f_score: number;
  c_computed: number;
  justification: Record<string, string>;
  prompt_version: string;
  evaluated_at: string;
}

interface Distribution {
  id: string;
  name: string;
  description: string;
  tag: string;
  estimated_completions: number;
  completions: number;
  started: number;
  created_at: string;
}

type TabKey = "cartonase" | "rezultate" | "distributie" | "experti" | "ai" | "preview" | "log";

const TABS_LEFT: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "cartonase", label: "Cartonase", icon: LayoutGrid },
  { key: "rezultate", label: "Rezultate", icon: BarChart3 },
  { key: "distributie", label: "Distributie", icon: Share2 },
];
const TABS_RIGHT: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "preview", label: "Preview", icon: PlayCircle },
  { key: "experti", label: "Experti", icon: UserCheck },
  { key: "ai", label: "AI Benchmark", icon: Bot },
  { key: "log", label: "Log", icon: ClipboardList },
];

const INDUSTRIES = [
  // Tech & Digital
  "SaaS / Software",
  "IT Services / Web Development",
  "FinTech / Plati Digitale",
  "EdTech / Platforme Educationale",
  "HealthTech / Telemedicina",
  "AI / Machine Learning",
  "Cybersecurity",
  "Cloud / Infrastructure",
  "Gaming / Entertainment Digital",
  "Telecom / Internet",
  "Mobile Apps",
  // E-commerce & Retail
  "E-commerce (general)",
  "Retail (magazine fizice)",
  "Marketplace / Platforme",
  "D2C (Direct to Consumer)",
  "Dropshipping",
  // Finance, Insurance & Real Estate
  "Banci / Servicii Financiare",
  "Asigurari",
  "Investitii / Trading / Bursa",
  "Crypto / Blockchain / Web3",
  "Contabilitate / Audit / Fiscalitate",
  "Imobiliare / Dezvoltare",
  "Constructii / Renovari",
  "Arhitectura / Design Interior",
  // Healthcare & Medical
  "Medicina Generala / Clinici",
  "Stomatologie / Dental",
  "Chirurgie Estetica / Plastica",
  "Oftalmologie / Optica",
  "Dermatologie",
  "Ortopedie / Recuperare",
  "Pediatrie",
  "Psihologie / Psihoterapie",
  "Farma / Parafarmaceutice",
  "Laboratoare / Analize Medicale",
  "Echipamente Medicale",
  "Medicina Veterinara",
  // Wellness, Beauty & Fitness
  "Wellness / Spa",
  "Fitness / Sali de Sport",
  "Yoga / Pilates / Mindfulness",
  "Beauty / Cosmetice",
  "Salon Infrumusetare / Coafor",
  "Nutritie / Dietetica",
  "Suplimente Alimentare",
  // Food & Beverage
  "Food & Beverage (producator)",
  "Restaurante / Cafenele",
  "Fast Food / Street Food",
  "Catering / Evenimente Culinare",
  "Cofetarie / Patiserie",
  "Bauturi / Vinuri / Craft Beer",
  "FMCG (bunuri de consum rapid)",
  "Organic / Bio / Vegan",
  "Livrare Mancare / Delivery",
  // Education & Training
  "Educatie (general)",
  "Universitati / Scoli",
  "Cursuri Online / E-learning",
  "Coaching / Dezvoltare Personala",
  "Training Profesional / Corporate",
  "Limbi Straine / Traduceri",
  "After School / Gradinite",
  // Professional & Business Services
  "Consultanta Business / Management",
  "Consultanta IT",
  "Marketing / Agentie Publicitate",
  "PR / Comunicare",
  "Legal / Avocatura / Notariat",
  "HR / Recrutare / Staffing",
  "Outsourcing / BPO",
  "Cleaning / Servicii Curatenie",
  // Media, Creative & Entertainment
  "Media / Presa / Publicatii",
  "Publicitate / Branding / Design",
  "Fotografie / Videografie",
  "Film / Video Production",
  "Muzica / DJ / Entertainment",
  "Evenimente / Organizare",
  "Podcast / Content Creation",
  "Influencer Marketing",
  // Travel, Hospitality & Lifestyle
  "Turism / Agentii de Turism",
  "Hoteluri / Pensiuni / Airbnb",
  "Fashion / Imbracaminte / Accesorii",
  "Luxury / Premium / Bijuterii",
  "Sport / Outdoor / Echipamente",
  "Auto (dealership / rent-a-car)",
  "Animale de Companie / Pet Shop",
  // Industry, Manufacturing & Agriculture
  "Automotive (productie / piese)",
  "Manufacturing / Productie Industriala",
  "Energie / Utilities / Solar",
  "Agricultura / Ferme / Agribusiness",
  "Logistica / Transport / Curierat",
  "Materiale de Constructii",
  "Ambalaje / Packaging",
  // B2B
  "B2B Services (general)",
  "B2B SaaS",
  "B2B Marketing / Lead Gen",
  // Non-profit, Government & Social
  "ONG / Non-profit / Fundatii",
  "Guvern / Administratie Publica",
  "Sanatate Publica / Campanii Sociale",
  "Mediu / Ecologie / Sustenabilitate",
  // Other
  "Altele",
] as const;

const EXECUTION_QUALITIES = [
  { value: "strong", label: "Puternic", color: "#059669" },
  { value: "moderate", label: "Moderat", color: "#D97706" },
  { value: "weak", label: "Slab", color: "#DC2626" },
] as const;

const VARIANT_LABELS = ["A", "B", "C"] as const;

const AI_MODELS = ["Claude", "Gemini", "GPT"] as const;

// ── Empty stimulus template ─────────────────────────────────
const emptyStimulus = (type: string, order: number): Partial<Stimulus> => ({
  name: "",
  type,
  industry: "",
  description: "",
  image_url: "",
  video_url: "",
  audio_url: "",
  text_content: "",
  pdf_url: "",
  site_url: "",
  display_order: order,
  variant_label: null,
  execution_quality: null,
});

// ── Profile Questions (16 questions used in wizard, editable in 3 languages) ──
interface ProfileQuestion {
  id: string;
  stepIndex: number; // 1-16
  type: "single" | "multi" | "likert";
  ro: string;
  en: string;
  ru: string;
  options?: { ro: string; en: string; ru: string }[];
}

const DEFAULT_PROFILE_QUESTIONS: ProfileQuestion[] = [
  { id: "gender", stepIndex: 1, type: "single",
    ro: "Care este genul tau?", en: "What is your gender?", ru: "Какой у вас пол?",
    options: [
      { ro: "Femeie", en: "Female", ru: "Женский" },
      { ro: "Barbat", en: "Male", ru: "Мужской" },
      { ro: "Altul", en: "Other", ru: "Другой" },
      { ro: "Prefer sa nu spun", en: "Prefer not to say", ru: "Предпочитаю не говорить" },
    ] },
  { id: "age", stepIndex: 2, type: "single",
    ro: "Care este varsta ta?", en: "What is your age?", ru: "Сколько вам лет?",
    options: [
      { ro: "18-24", en: "18-24", ru: "18-24" },
      { ro: "25-34", en: "25-34", ru: "25-34" },
      { ro: "35-44", en: "35-44", ru: "35-44" },
      { ro: "45-54", en: "45-54", ru: "45-54" },
      { ro: "55+", en: "55+", ru: "55+" },
    ] },
  { id: "country", stepIndex: 3, type: "single",
    ro: "In ce tara locuiesti?", en: "What country do you live in?", ru: "В какой стране вы живёте?",
    options: [
      { ro: "Moldova", en: "Moldova", ru: "Молдова" },
      { ro: "Romania", en: "Romania", ru: "Румыния" },
      { ro: "Alta tara", en: "Other country", ru: "Другая страна" },
    ] },
  { id: "urbanRural", stepIndex: 4, type: "single",
    ro: "Unde locuiesti?", en: "Where do you live?", ru: "Где вы живёте?",
    options: [
      { ro: "Urban (oras)", en: "Urban (city)", ru: "Город" },
      { ro: "Rural (sat, comuna)", en: "Rural (village, commune)", ru: "Село, деревня" },
    ] },
  { id: "income", stepIndex: 5, type: "single",
    ro: "Care este venitul tau lunar net?", en: "What is your net monthly income?", ru: "Каков ваш чистый ежемесячный доход?",
    options: [
      { ro: "Sub 500 EUR", en: "Under 500 EUR", ru: "Менее 500 EUR" },
      { ro: "500 - 1.000 EUR", en: "500 - 1,000 EUR", ru: "500 - 1 000 EUR" },
      { ro: "1.000 - 2.000 EUR", en: "1,000 - 2,000 EUR", ru: "1 000 - 2 000 EUR" },
      { ro: "Peste 2.000 EUR", en: "Over 2,000 EUR", ru: "Более 2 000 EUR" },
    ] },
  { id: "education", stepIndex: 6, type: "single",
    ro: "Ce nivel de educatie ai?", en: "What is your education level?", ru: "Какой у вас уровень образования?",
    options: [
      { ro: "Liceu", en: "High School", ru: "Среднее" },
      { ro: "Universitate (Licenta)", en: "University (Bachelor's)", ru: "Университет (бакалавр)" },
      { ro: "Master", en: "Master's", ru: "Магистратура" },
      { ro: "Doctorat", en: "PhD", ru: "Докторантура" },
      { ro: "Altul", en: "Other", ru: "Другое" },
    ] },
  { id: "purchaseFreq", stepIndex: 7, type: "single",
    ro: "Cat de des cumperi online?", en: "How often do you shop online?", ru: "Как часто вы покупаете онлайн?",
    options: [
      { ro: "Zilnic", en: "Daily", ru: "Ежедневно" },
      { ro: "Saptamanal", en: "Weekly", ru: "Еженедельно" },
      { ro: "Lunar", en: "Monthly", ru: "Ежемесячно" },
      { ro: "Rar (cateva ori pe an)", en: "Rarely (a few times a year)", ru: "Редко (несколько раз в год)" },
    ] },
  { id: "channels", stepIndex: 8, type: "multi",
    ro: "Ce canale media preferi?", en: "Which media channels do you prefer?", ru: "Какие медиаканалы вы предпочитаете?" },
  { id: "onlineTime", stepIndex: 9, type: "single",
    ro: "Cat timp petreci online zilnic?", en: "How much time do you spend online daily?", ru: "Сколько времени вы проводите онлайн ежедневно?",
    options: [
      { ro: "Sub 1 ora", en: "Under 1 hour", ru: "Менее 1 часа" },
      { ro: "1-3 ore", en: "1-3 hours", ru: "1-3 часа" },
      { ro: "3-5 ore", en: "3-5 hours", ru: "3-5 часов" },
      { ro: "Peste 5 ore", en: "Over 5 hours", ru: "Более 5 часов" },
    ] },
  { id: "device", stepIndex: 10, type: "single",
    ro: "Ce dispozitiv folosesti cel mai des?", en: "Which device do you use most often?", ru: "Какое устройство вы используете чаще всего?",
    options: [
      { ro: "Telefon mobil", en: "Mobile phone", ru: "Мобильный телефон" },
      { ro: "Laptop / PC", en: "Laptop / PC", ru: "Ноутбук / ПК" },
      { ro: "Tableta", en: "Tablet", ru: "Планшет" },
    ] },
  { id: "psych1", stepIndex: 11, type: "likert",
    ro: "Acord atentie reclamelor relevante pentru mine", en: "I pay attention to ads that are relevant to me", ru: "Я обращаю внимание на рекламу, релевантную для меня" },
  { id: "psych2", stepIndex: 12, type: "likert",
    ro: "Prefer reclamele cu design vizual atractiv", en: "I prefer ads with attractive visual design", ru: "Я предпочитаю рекламу с привлекательным визуальным дизайном" },
  { id: "psych3", stepIndex: 13, type: "likert",
    ro: "Ai careva tangenta cu marketingul", en: "Do you have any connection to marketing", ru: "Имеете ли вы отношение к маркетингу" },
  { id: "psych4", stepIndex: 14, type: "likert",
    ro: "Ma irita reclamele irelevante", en: "Irrelevant ads annoy me", ru: "Меня раздражает нерелевантная реклама" },
  { id: "psych5", stepIndex: 15, type: "likert",
    ro: "Ma opresc din scrollat la reclame interesante", en: "I stop scrolling at interesting ads", ru: "Я останавливаюсь при скроллинге на интересной рекламе" },
  { id: "psych6", stepIndex: 16, type: "likert",
    ro: "Cand o reclama nu e relevanta pentru mine, ii acord totusi atentie", en: "When an ad is not relevant to me, I still pay attention to it", ru: "Когда реклама не релевантна для меня, я все равно обращаю на нее внимание" },
];

// ── IndustryPicker — searchable dropdown ────────────────────
function IndustryPicker({ value, onChange, style }: { value: string; onChange: (v: string) => void; style?: React.CSSProperties }) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = INDUSTRIES.filter(ind =>
    ind.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: "relative", ...style }}>
      <input
        type="text"
        style={{
          width: "100%", padding: "8px 12px", fontSize: 13, border: "1.5px solid #d1d5db",
          borderRadius: 8, background: "#fff", color: "#1a1a1a", outline: "none",
          boxSizing: "border-box" as const,
        }}
        placeholder="Cauta industrie..."
        value={open ? search : (value || "")}
        onFocus={() => { setOpen(true); setSearch(""); }}
        onChange={(e) => setSearch(e.target.value)}
      />
      {value && !open && (
        <button
          onClick={() => { onChange(""); setSearch(""); setOpen(true); }}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#9ca3af",
            fontSize: 16, lineHeight: 1, padding: 2,
          }}
          title="Sterge"
        >
          ×
        </button>
      )}
      {open && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
          maxHeight: 240, overflowY: "auto", border: "1.5px solid #d1d5db",
          borderTop: "none", borderRadius: "0 0 8px 8px", background: "#fff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "10px 14px", fontSize: 13, color: "#9ca3af" }}>
              Nicio industrie gasita
            </div>
          ) : (
            filtered.map(ind => (
              <div
                key={ind}
                style={{
                  padding: "8px 14px", fontSize: 13, cursor: "pointer",
                  background: value === ind ? "#f0fdf4" : "transparent",
                  color: "#1a1a1a", borderBottom: "1px solid #f3f4f6",
                  transition: "background 0.1s",
                }}
                onMouseDown={() => { onChange(ind); setSearch(""); setOpen(false); }}
                onMouseEnter={(e) => (e.currentTarget.style.background = value === ind ? "#dcfce7" : "#f9fafb")}
                onMouseLeave={(e) => (e.currentTarget.style.background = value === ind ? "#f0fdf4" : "transparent")}
              >
                {ind}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function StudiuAdminPage() {
  // If accessed directly (not in iframe), redirect to parent with sondaj view
  const [inIframe, setInIframe] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && window.self === window.top) {
      setInIframe(false);
      window.location.replace("/articolstiintific#sondaj");
    }
  }, []);
  if (!inIframe) return null;

  const [activeTab, setActiveTab] = useState<TabKey>("rezultate");
  const [cartonaseSubTab, setCartonaseSubTab] = useState<"intrebari" | "canale">("canale");
  const [profileQuestions, setProfileQuestions] = useState<ProfileQuestion[]>(() => DEFAULT_PROFILE_QUESTIONS.map(q => ({ ...q, options: q.options ? q.options.map(o => ({ ...o })) : undefined })));
  const [editingQIdx, setEditingQIdx] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatLabel, setEditCatLabel] = useState("");
  const [editCatColor, setEditCatColor] = useState("");
  const [editingStimId, setEditingStimId] = useState<string | null>(null);
  const [editStimData, setEditStimData] = useState<Partial<Stimulus>>({});
  const [addingToType, setAddingToType] = useState<string | null>(null);
  const [newStimData, setNewStimData] = useState<Partial<Stimulus>>({});
  const [saving, setSaving] = useState(false);
  const [activeMatIdx, setActiveMatIdx] = useState(0); // active material tab index
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  // Distribution state
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [distLoading, setDistLoading] = useState(false);
  const [showAddDist, setShowAddDist] = useState(false);
  const [newDistName, setNewDistName] = useState("");
  const [newDistDesc, setNewDistDesc] = useState("");
  const [newDistTag, setNewDistTag] = useState("");
  const [newDistEstimate, setNewDistEstimate] = useState("");
  const [distSaving, setDistSaving] = useState(false);
  const [distError, setDistError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [editingDistId, setEditingDistId] = useState<string | null>(null);
  const [editDistName, setEditDistName] = useState("");
  const [editDistDesc, setEditDistDesc] = useState("");
  const [editDistEstimate, setEditDistEstimate] = useState("");
  const [editDistSaving, setEditDistSaving] = useState(false);

  // Results state
  interface StimulusResult {
    id: string;
    name: string;
    type: string;
    industry: string;
    variant_label: string | null;
    execution_quality: string | null;
    response_count: number;
    avg_r: number;
    avg_i: number;
    avg_f: number;
    avg_c: number;
    sd_c: number;
    avg_c_score: number;
    avg_cta: number;
    avg_time: number;
    brand_yes: number;
    brand_no: number;
    brand_rate: number;
  }
  interface BreakdownData {
    demographics: Record<string, Record<string, number>>;
    behavioral: Record<string, Record<string, number>>;
    psychographicAvg: Record<string, number>;
    respondentCount: number;
    completedCount: number;
    completionRate: number;
    localeCounts?: Record<string, number>;
  }
  interface CategoryBreakdown extends BreakdownData {
    responseCount: number;
  }
  interface ResultsData {
    totalRespondents: number;
    completedRespondents: number;
    completionRate: number;
    totalResponses: number;
    completedToday?: number;
    completedMonth?: number;
    avgSessionTime?: number;
    stimuliResults: StimulusResult[];
    aiEvaluations: unknown[];
    demographics: Record<string, Record<string, number>>;
    behavioral: Record<string, Record<string, number>>;
    psychographicAvg: Record<string, number>;
    localeCounts?: Record<string, number>;
    perCategoryBreakdowns?: Record<string, CategoryBreakdown>;
    perStimulusBreakdowns?: Record<string, BreakdownData>;
  }
  const [results, setResults] = useState<ResultsData | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsSegment, setResultsSegment] = useState<string>("all");
  const [globalStats, setGlobalStats] = useState<{ total: number; completed: number; rate: number; responses: number; today: number; month: number; avgTime: number; perDist: { id: string; name: string; total: number; completed: number }[] } | null>(null);
  const [resultsSubTab, setResultsSubTab] = useState<"scoruri" | "profil" | "psihografic" | "canale" | "industrii">("scoruri");
  const [resultsCatFilter, setResultsCatFilter] = useState<string | null>(null);
  const [expandedStimulusId, setExpandedStimulusId] = useState<string | null>(null);
  const [tooltipCol, setTooltipCol] = useState<string | null>(null);
  const [expandedChannelType, setExpandedChannelType] = useState<string | null>(null);
  const [expandedIndustryType, setExpandedIndustryType] = useState<string | null>(null);

  // Log panel state
  const [logData, setLogData] = useState<any[]>([]);
  const [logLoading, setLogLoading] = useState(false);
  const [logDateFrom, setLogDateFrom] = useState("");
  const [logDateTo, setLogDateTo] = useState("");
  const [logSelected, setLogSelected] = useState<Set<string>>(new Set());
  const [logSegment, setLogSegment] = useState<string>("all");
  const [logExpandedId, setLogExpandedId] = useState<string | null>(null);
  const [logTooltip, setLogTooltip] = useState<string | null>(null);
  const [logSubTab, setLogSubTab] = useState<"lista" | "flagged" | "arhiva">("lista");
  const [archiveData, setArchiveData] = useState<any[]>([]);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [archiveSelected, setArchiveSelected] = useState<Set<string>>(new Set());

  // ── Dismissed duplicate suspects (user confirmed as coincidence) ──
  const [dismissedDupIds, setDismissedDupIds] = useState<Set<string>>(new Set());

  // ── Flag/unflag respondents ────────────────────────────────
  const toggleFlag = async (ids: string[], flagged: boolean, reason?: string) => {
    try {
      const res = await fetch("/api/survey/log", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, flagged, reason }),
      });
      const json = await res.json();
      if (json.ok) {
        setLogData((prev) => prev.map((l) =>
          ids.includes(l.id) ? { ...l, is_flagged: flagged, flag_reason: flagged ? (reason || l.flag_reason) : null } : l
        ));
      }
    } catch { /* ignore */ }
  };

  // Auto-detect duplicates: group by IP + fingerprint
  const computeDuplicates = useCallback((data: any[]) => {
    const ipMap: Record<string, string[]> = {};
    const fpMap: Record<string, string[]> = {};
    for (const l of data) {
      const ip = l.ip_address || l.ip_hash;
      if (ip && ip !== "unknown") {
        if (!ipMap[ip]) ipMap[ip] = [];
        ipMap[ip].push(l.id);
      }
      const fp = l.browser_fingerprint;
      if (fp && fp !== "unknown") {
        if (!fpMap[fp]) fpMap[fp] = [];
        fpMap[fp].push(l.id);
      }
    }
    // Duplicates = IPs or fingerprints with 2+ entries
    const dupIps = Object.entries(ipMap).filter(([, ids]) => ids.length > 1);
    const dupFps = Object.entries(fpMap).filter(([, ids]) => ids.length > 1);
    // Merge all suspect IDs
    const suspectIds = new Set<string>();
    dupIps.forEach(([, ids]) => ids.forEach(id => suspectIds.add(id)));
    dupFps.forEach(([, ids]) => ids.forEach(id => suspectIds.add(id)));
    return { dupIps, dupFps, suspectIds, ipMap, fpMap };
  }, []);

  const fetchLog = useCallback(async () => {
    setLogLoading(true);
    try {
      const res = await fetch("/api/survey/log");
      const json = await res.json();
      if (json.ok) setLogData(json.logs);
    } catch { /* ignore */ }
    setLogLoading(false);
  }, []);

  // Soft-delete (archive) — moves to arhiva, disappears from results
  const deleteLogEntries = async (ids: string[]) => {
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/survey/log", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (json.ok) {
        setLogData((prev) => prev.filter((l) => !ids.includes(l.id)));
        setLogSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
        // Refresh results (archived entries excluded from results)
        fetchResults(resultsSegment);
        fetchGlobalStats();
      }
    } catch { /* ignore */ }
  };

  // Fetch archived entries
  const fetchArchive = useCallback(async () => {
    setArchiveLoading(true);
    try {
      const res = await fetch("/api/survey/log?archived=1");
      const json = await res.json();
      if (json.ok) setArchiveData(json.logs);
    } catch { /* ignore */ }
    setArchiveLoading(false);
  }, []);

  // Restore from archive
  const restoreFromArchive = async (ids: string[]) => {
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/survey/log", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const json = await res.json();
      if (json.ok) {
        setArchiveData((prev) => prev.filter((l) => !ids.includes(l.id)));
        setArchiveSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
        fetchLog(); // Refresh main log
        fetchResults(resultsSegment);
        fetchGlobalStats();
      }
    } catch { /* ignore */ }
  };

  // Permanent delete from archive
  const permanentDeleteArchive = async (ids: string[]) => {
    if (ids.length === 0) return;
    try {
      const res = await fetch("/api/survey/log", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, permanent: true }),
      });
      const json = await res.json();
      if (json.ok) {
        setArchiveData((prev) => prev.filter((l) => !ids.includes(l.id)));
        setArchiveSelected((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
      }
    } catch { /* ignore */ }
  };

  // Expert panel state
  const [experts, setExperts] = useState<Expert[]>([]);
  const [expertEvals, setExpertEvals] = useState<ExpertEvaluation[]>([]);
  const [expertLoading, setExpertLoading] = useState(false);
  const [showAddExpert, setShowAddExpert] = useState(false);
  const [expertForm, setExpertForm] = useState({ first_name: "", last_name: "", email: "", phone: "", photo_url: "", experience_years: "", brands_worked: [] as string[], total_budget_managed: "", marketing_roles: [] as string[] });
  const [expertSaving, setExpertSaving] = useState(false);
  const [selectedExpertId, setSelectedExpertId] = useState<string | null>(null);
  const [expertCopied, setExpertCopied] = useState<string | null>(null);
  const [editingExpertId, setEditingExpertId] = useState<string | null>(null);
  const [expandedExpertChannelType, setExpandedExpertChannelType] = useState<string | null>(null);

  // AI benchmark state
  const [aiEvals, setAiEvals] = useState<AiEvaluation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAddAi, setShowAddAi] = useState(false);
  const [aiForm, setAiForm] = useState({ stimulus_id: "", model_name: "Claude", r_score: 5, i_score: 5, f_score: 5, prompt_version: "v1", justification: "" });
  const [aiSaving, setAiSaving] = useState(false);

  // ── Upload helper: XHR PUT for <50MB, tus resumable for >=50MB ──
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const SMALL_FILE_LIMIT = 50 * 1024 * 1024; // 50MB — Supabase standard upload limit

  const uploadFile = async (file: File, fieldKey: string): Promise<string | null> => {
    setUploading((prev) => ({ ...prev, [fieldKey]: true }));
    setUploadProgress((prev) => ({ ...prev, [fieldKey]: 0 }));
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    setUploadStatus(`Se pregateste: ${file.name} (${sizeMB} MB, ${file.type})...`);
    try {
      // Step 1: Get upload config from our API
      const configRes = await fetch("/api/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const config = await configRes.json();
      if (!config.path) {
        const errMsg = `Eroare configurare: ${config.error || "raspuns invalid de la server"}`;
        console.error(errMsg, config);
        setUploadStatus(errMsg);
        return null;
      }

      // Step 2: Choose upload method based on file size
      if (file.size < SMALL_FILE_LIMIT) {
        // Small files: XHR PUT to signed URL
        setUploadStatus(`Se incarca ${file.name} (${sizeMB} MB)...`);
        return await new Promise<string | null>((resolve) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const pct = Math.round((e.loaded / e.total) * 100);
              setUploadProgress((prev) => ({ ...prev, [fieldKey]: pct }));
              setUploadStatus(`Se incarca: ${pct}% (${(e.loaded / 1024 / 1024).toFixed(1)} / ${sizeMB} MB)`);
            }
          });
          xhr.addEventListener("load", () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setUploadProgress((prev) => ({ ...prev, [fieldKey]: 100 }));
              setUploadStatus(`Upload complet: ${file.name}`);
              resolve(config.publicUrl);
            } else {
              const errMsg = `Upload EROARE (${xhr.status}): ${xhr.responseText}`;
              console.error(errMsg);
              setUploadStatus(errMsg);
              resolve(null);
            }
          });
          xhr.addEventListener("error", () => { setUploadStatus("Upload EROARE: conexiune esuata"); resolve(null); });
          xhr.addEventListener("timeout", () => { setUploadStatus("Upload EROARE: timeout depasit"); resolve(null); });
          xhr.open("PUT", config.signedUrl);
          xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
          xhr.timeout = 600000;
          xhr.send(file);
        });
      } else {
        // Large files (>=50MB): tus resumable upload in 6MB chunks
        setUploadStatus(`Se incarca ${file.name} (${sizeMB} MB) — mod resumable...`);
        return await new Promise<string | null>((resolve) => {
          const upload = new tus.Upload(file, {
            endpoint: config.tusEndpoint,
            retryDelays: [0, 1000, 3000, 5000, 10000],
            chunkSize: 6 * 1024 * 1024,
            headers: {
              authorization: `Bearer ${config.anonKey}`,
              apikey: config.anonKey,
              "x-upsert": "true",
            },
            uploadDataDuringCreation: true,
            removeFingerprintOnSuccess: true,
            metadata: {
              bucketName: config.bucketId,
              objectName: config.objectPath,
              contentType: config.contentType,
              cacheControl: "3600",
            },
            onError: (err) => {
              const errMsg = `Upload EROARE: ${err.message || err}`;
              console.error("Tus upload error:", err);
              setUploadStatus(errMsg);
              setUploading((prev) => ({ ...prev, [fieldKey]: false }));
              resolve(null);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
              const pct = Math.round((bytesUploaded / bytesTotal) * 100);
              setUploadProgress((prev) => ({ ...prev, [fieldKey]: pct }));
              setUploadStatus(`Se incarca: ${pct}% (${(bytesUploaded / 1024 / 1024).toFixed(1)} / ${(bytesTotal / 1024 / 1024).toFixed(1)} MB)`);
            },
            onSuccess: () => {
              setUploadProgress((prev) => ({ ...prev, [fieldKey]: 100 }));
              setUploadStatus(`Upload complet: ${file.name}`);
              resolve(config.publicUrl);
            },
          });
          upload.findPreviousUploads().then((prev) => {
            if (prev.length > 0) {
              setUploadStatus("Se reia uploadul anterior...");
              upload.resumeFromPreviousUpload(prev[0]);
            }
            upload.start();
          });
        });
      }
    } catch (err) {
      const errMsg = `Upload EROARE: ${err instanceof Error ? err.message : String(err)}`;
      console.error("Upload failed:", err);
      setUploadStatus(errMsg);
      return null;
    } finally {
      setUploading((prev) => ({ ...prev, [fieldKey]: false }));
    }
  };

  // ── Fetch data ─────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, stimRes] = await Promise.all([
        fetch("/api/survey/categories"),
        fetch("/api/survey/stimuli?all=true"),
      ]);
      const catData = await catRes.json();
      const stimData = await stimRes.json();

      if (catData.categories) setCategories(catData.categories);
      if (stimData.stimuli) setStimuli(stimData.stimuli);
    } catch {
      setError("Eroare la incarcarea datelor.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Distribution data ──────────────────────────────────
  const fetchDistributions = useCallback(async () => {
    setDistLoading(true);
    try {
      const res = await fetch("/api/survey/distributions");
      const data = await res.json();
      if (data.success) setDistributions(data.distributions);
    } catch { /* ignore */ }
    setDistLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "distributie" || activeTab === "rezultate" || activeTab === "log") fetchDistributions();
  }, [activeTab, fetchDistributions]);

  // ── Results data ───────────────────────────────────────
  const fetchResults = useCallback(async (segmentId: string) => {
    setResultsLoading(true);
    try {
      // "all" = unfiltered (ALL respondents), "general" = only respondents with NO distribution tag
      const url = segmentId === "all"
        ? "/api/survey/results"
        : segmentId === "general"
          ? "/api/survey/results?distribution_id=__none__"
          : `/api/survey/results?distribution_id=${segmentId}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch { /* ignore */ }
    setResultsLoading(false);
  }, []);

  // Always fetch global stats (unfiltered) for KPI hero
  const fetchGlobalStats = useCallback(async () => {
    try {
      const res = await fetch("/api/survey/results");
      const data = await res.json();
      setGlobalStats({
        total: data.totalRespondents || 0,
        completed: data.completedRespondents || 0,
        rate: data.completionRate || 0,
        responses: data.totalResponses || 0,
        today: data.completedToday || 0,
        month: data.completedMonth || 0,
        avgTime: data.avgSessionTime || 0,
        perDist: data.distributionSummary || [],
      });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (activeTab === "rezultate") {
      fetchResults(resultsSegment);
      fetchGlobalStats();
    }
    if (activeTab === "distributie") {
      fetchGlobalStats();
    }
  }, [activeTab, resultsSegment, fetchResults, fetchGlobalStats]);

  // ── Expert data ──────────────────────────────────────────
  const fetchExperts = useCallback(async () => {
    try {
      const res = await fetch("/api/survey/experts");
      const data = await res.json();
      if (data.success) setExperts(data.experts);
    } catch { /* ignore */ }
  }, []);

  const fetchExpertEvals = useCallback(async () => {
    setExpertLoading(true);
    try {
      const res = await fetch("/api/survey/expert-evaluations");
      const data = await res.json();
      if (data.success) setExpertEvals(data.evaluations);
    } catch { /* ignore */ }
    setExpertLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "experti") { fetchExperts(); fetchExpertEvals(); }
  }, [activeTab, fetchExperts, fetchExpertEvals]);

  useEffect(() => {
    if (activeTab === "log") fetchLog();
  }, [activeTab, fetchLog]);

  const defaultExpertForm = { first_name: "", last_name: "", email: "", phone: "", photo_url: "", experience_years: "", brands_worked: [] as string[], total_budget_managed: "", marketing_roles: [] as string[] };

  const saveExpert = async () => {
    if (!expertForm.first_name || !expertForm.last_name) return;
    setExpertSaving(true);
    const isEdit = !!editingExpertId;
    try {
      const payload: Record<string, unknown> = {
        first_name: expertForm.first_name,
        last_name: expertForm.last_name,
        email: expertForm.email || null,
        phone: expertForm.phone || null,
        photo_url: expertForm.photo_url || null,
        experience_years: expertForm.experience_years ? Number(expertForm.experience_years) : null,
        brands_worked: expertForm.brands_worked.length > 0 ? expertForm.brands_worked : [],
        total_budget_managed: expertForm.total_budget_managed ? Number(expertForm.total_budget_managed) : null,
        marketing_roles: expertForm.marketing_roles.length > 0 ? expertForm.marketing_roles : [],
      };
      if (isEdit) payload.id = editingExpertId;

      const res = await fetch("/api/survey/experts", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddExpert(false);
        setEditingExpertId(null);
        setExpertForm(defaultExpertForm);
        fetchExperts();
        if (!isEdit) setSelectedExpertId(data.expert.id);
      }
    } catch { /* ignore */ }
    setExpertSaving(false);
  };

  const toggleExpertAccess = async (expertId: string, currentlyActive: boolean) => {
    const action = currentlyActive ? "revocat" : "restabilit";
    if (!confirm(`Sigur vrei sa ${currentlyActive ? "revoci" : "restabilesti"} accesul acestui expert?`)) return;
    try {
      await fetch("/api/survey/experts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: expertId, is_active: !currentlyActive }),
      });
      fetchExperts();
    } catch { /* ignore */ }
  };

  const deleteExpert = async (expertId: string) => {
    if (!confirm("Stergi definitiv acest expert si toate evaluarile lui?")) return;
    await fetch(`/api/survey/experts?id=${expertId}`, { method: "DELETE" });
    setExperts((prev) => prev.filter((e) => e.id !== expertId));
    setExpertEvals((prev) => prev.filter((e) => e.expert_id !== expertId));
    if (selectedExpertId === expertId) setSelectedExpertId(null);
  };

  const deleteExpertEval = async (id: string) => {
    if (!confirm("Stergi aceasta evaluare?")) return;
    await fetch(`/api/survey/expert-evaluations?id=${id}`, { method: "DELETE" });
    fetchExpertEvals();
  };

  const getExpertLink = (expert: Expert) => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/articolstiintific/sondaj/expert?token=${expert.access_token}`;
  };

  const copyExpertLink = (expert: Expert) => {
    navigator.clipboard.writeText(getExpertLink(expert));
    setExpertCopied(expert.id);
    setTimeout(() => setExpertCopied(null), 2000);
  };

  // ── AI evaluations data ──────────────────────────────────
  const fetchAiEvals = useCallback(async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/survey/ai-evaluations");
      const data = await res.json();
      if (data.success) setAiEvals(data.evaluations);
    } catch { /* ignore */ }
    setAiLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "ai") fetchAiEvals();
  }, [activeTab, fetchAiEvals]);

  const addAiEval = async () => {
    if (!aiForm.stimulus_id || !aiForm.model_name) return;
    setAiSaving(true);
    try {
      const res = await fetch("/api/survey/ai-evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...aiForm,
          justification: aiForm.justification ? { text: aiForm.justification } : {},
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddAi(false);
        setAiForm({ stimulus_id: "", model_name: "Claude", r_score: 5, i_score: 5, f_score: 5, prompt_version: "v1", justification: "" });
        fetchAiEvals();
      }
    } catch { /* ignore */ }
    setAiSaving(false);
  };

  const deleteAiEval = async (id: string) => {
    if (!confirm("Stergi aceasta evaluare AI?")) return;
    await fetch(`/api/survey/ai-evaluations?id=${id}`, { method: "DELETE" });
    fetchAiEvals();
  };

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : "https://rifcmarketing.com";

  const getDistLink = (tag: string) => `${baseUrl}/articolstiintific/sondaj/wizard?tag=${tag}`;

  const addDistribution = async () => {
    if (!newDistName.trim() || !newDistTag.trim()) {
      setDistError("Numele si tag-ul sunt obligatorii.");
      return;
    }
    setDistSaving(true);
    setDistError(null);
    try {
      const res = await fetch("/api/survey/distributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDistName.trim(),
          description: newDistDesc.trim(),
          tag: newDistTag.trim(),
          estimated_completions: parseInt(newDistEstimate) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNewDistName("");
        setNewDistDesc("");
        setNewDistTag("");
        setNewDistEstimate("");
        setShowAddDist(false);
        fetchDistributions();
      } else {
        setDistError(data.error || "Eroare la salvare.");
      }
    } catch {
      setDistError("Eroare de conexiune.");
    }
    setDistSaving(false);
  };

  const deleteDistribution = async (id: string) => {
    if (!confirm("Sigur stergi aceasta distributie? Datele respondentilor se pastreaza.")) return;
    await fetch(`/api/survey/distributions?id=${id}`, { method: "DELETE" });
    fetchDistributions();
  };

  const startEditDist = (dist: Distribution) => {
    setEditingDistId(dist.id);
    setEditDistName(dist.name);
    setEditDistDesc(dist.description || "");
    setEditDistEstimate(String(dist.estimated_completions || ""));
  };

  const cancelEditDist = () => {
    setEditingDistId(null);
    setEditDistName("");
    setEditDistDesc("");
    setEditDistEstimate("");
  };

  const saveEditDist = async () => {
    if (!editingDistId || !editDistName.trim()) return;
    setEditDistSaving(true);
    try {
      const res = await fetch("/api/survey/distributions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingDistId,
          name: editDistName.trim(),
          description: editDistDesc.trim(),
          estimated_completions: parseInt(editDistEstimate) || 0,
        }),
      });
      const data = await res.json();
      if (data.success) {
        cancelEditDist();
        fetchDistributions();
      }
    } catch { /* ignore */ }
    setEditDistSaving(false);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* ignore */ }
  };

  // ── Helpers ────────────────────────────────────────────
  const getStimuliForType = (type: string) =>
    stimuli.filter((s) => s.type === type && s.is_active);

  const totalMaterials = stimuli.filter((s) => s.is_active).length;
  const visibleCategories = categories.filter((c) => c.is_visible).length;

  // ── Category actions ───────────────────────────────────
  const toggleVisibility = async (cat: Category) => {
    const res = await fetch("/api/survey/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, is_visible: !cat.is_visible }),
    });
    if ((await res.json()).success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_visible: !c.is_visible } : c))
      );
    }
  };

  const moveCategory = async (cat: Category, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    const myOrder = cat.display_order;
    const otherOrder = other.display_order;

    await Promise.all([
      fetch("/api/survey/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, display_order: otherOrder }),
      }),
      fetch("/api/survey/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: other.id, display_order: myOrder }),
      }),
    ]);

    setCategories((prev) =>
      prev
        .map((c) => {
          if (c.id === cat.id) return { ...c, display_order: otherOrder };
          if (c.id === other.id) return { ...c, display_order: myOrder };
          return c;
        })
        .sort((a, b) => a.display_order - b.display_order)
    );
  };

  const deleteCategory = async (cat: Category) => {
    if (!confirm(`Stergi categoria "${cat.label}"? Materialele din ea vor ramane in baza de date.`)) return;
    const res = await fetch(`/api/survey/categories?id=${cat.id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatLabel(cat.label);
    setEditCatColor(cat.color);
  };

  const saveEditCategory = async () => {
    if (!editingCatId) return;
    setSaving(true);
    const res = await fetch("/api/survey/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingCatId, label: editCatLabel, color: editCatColor }),
    });
    if ((await res.json()).success) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCatId ? { ...c, label: editCatLabel, color: editCatColor } : c
        )
      );
    }
    setEditingCatId(null);
    setSaving(false);
  };

  // ── Stimulus actions ───────────────────────────────────
  const startEditStimulus = (stim: Stimulus) => {
    setEditingStimId(stim.id);
    setEditStimData({ ...stim });
  };

  const saveEditStimulus = async () => {
    if (!editingStimId) return;
    setSaving(true);
    const res = await fetch("/api/survey/stimuli", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingStimId, ...editStimData }),
    });
    const result = await res.json();
    if (result.success) {
      setStimuli((prev) =>
        prev.map((s) => (s.id === editingStimId ? { ...s, ...editStimData } : s))
      );
      // Invalidate results cache so REZULTATE shows updated names
      setResults(null);
      setGlobalStats(null);
    }
    setEditingStimId(null);
    setSaving(false);
  };

  const deleteStimulus = async (stim: Stimulus) => {
    if (!confirm(`Stergi materialul "${stim.name}"?`)) return;
    const res = await fetch(`/api/survey/stimuli?id=${stim.id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setStimuli((prev) => prev.map((s) => (s.id === stim.id ? { ...s, is_active: false } : s)));
      setResults(null);
      setGlobalStats(null);
    }
  };

  const startAddStimulus = (type: string) => {
    const materialsCount = getStimuliForType(type).length;
    setAddingToType(type);
    setNewStimData(emptyStimulus(type, materialsCount + 1));
  };

  const saveNewStimulus = async () => {
    if (!newStimData.name || !addingToType) return;
    setSaving(true);
    const res = await fetch("/api/survey/stimuli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStimData),
    });
    const result = await res.json();
    if (result.success && result.stimulus) {
      setStimuli((prev) => [...prev, result.stimulus]);
      setResults(null); // Invalidate results cache
    }
    setAddingToType(null);
    setNewStimData({});
    setSaving(false);
  };

  // ── Media icons helper ─────────────────────────────────
  const getMediaIcons = (stim: Stimulus) => {
    const icons: { icon: typeof Image; label: string }[] = [];
    if (stim.image_url) icons.push({ icon: Image, label: "Imagine" });
    if (stim.video_url) icons.push({ icon: Video, label: "Video" });
    if (stim.audio_url) icons.push({ icon: Music, label: "Audio" });
    if (stim.text_content) icons.push({ icon: FileText, label: "Text" });
    if (stim.pdf_url) icons.push({ icon: FileText, label: "PDF" });
    if (stim.site_url) icons.push({ icon: Link, label: "Site" });
    return icons;
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header bar */}
      <div style={S.headerBar}>
        <a href="/articolstiintific" style={{ ...S.logo, textDecoration: "none", cursor: "pointer" }}>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>R</span>
          <span style={{ color: "#6B7280", fontWeight: 300 }}> IF </span>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>C</span>
        </a>
        <div style={S.headerBadge}>SONDAJ</div>
        <div style={{ flex: 1 }} />
        <button style={S.langBtn} onClick={() => {}}>
          <Globe size={14} />
          <span>RO</span>
        </button>
      </div>

      {/* LOG moved to tab — see LOG TAB section below */}


      {/* Tabs — left group (main) + spacer + right group (tools) */}
      <div style={S.tabsBar}>
        {TABS_LEFT.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              style={{
                ...S.tab,
                ...(isActive ? S.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
        <div style={{ flex: 1 }} />
        {TABS_RIGHT.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              style={{
                ...S.tab,
                ...(isActive ? S.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div style={S.content}>
        {/* ═══ CARTONASE TAB ═══ */}
        {activeTab === "cartonase" && (
          <>
            {/* Sub-tab bar: Intrebari | Canale — same style as REZULTATE segment tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 16, overflowX: "auto" as const }}>
              {([["intrebari", "INTREBARI", `${profileQuestions.length} intrebari`], ["canale", "CANALE", `${visibleCategories} categorii`]] as const).map(([key, label, sub]) => (
                <button
                  key={key}
                  onClick={() => setCartonaseSubTab(key as "intrebari" | "canale")}
                  style={{
                    ...S.tab,
                    fontSize: 12,
                    padding: "10px 18px",
                    ...(cartonaseSubTab === key ? S.tabActive : {}),
                  }}
                >
                  {label} <span style={{ fontSize: 10, fontWeight: 400, color: "#9CA3AF", marginLeft: 4 }}>({sub})</span>
                </button>
              ))}
            </div>

            {/* ═══ INTREBARI sub-tab ═══ */}
            {cartonaseSubTab === "intrebari" && (
              <div>
                <div style={S.sectionHeader}>
                  <div>
                    <h1 style={S.pageTitle}>Intrebari Profil</h1>
                    <p style={S.pageSubtitle}>
                      {profileQuestions.length} intrebari &middot; 3 limbi (RO / EN / RU)
                    </p>
                  </div>
                </div>

                {/* Questions list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {profileQuestions.map((q, idx) => {
                    const isEditing = editingQIdx === idx;
                    const typeLabel = q.type === "likert" ? "Likert 1-7" : q.type === "multi" ? "Multi-select" : "Single-select";
                    const typeBg = q.type === "likert" ? "#7C3AED" : q.type === "multi" ? "#D97706" : "#2563EB";
                    return (
                      <div key={q.id} style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                        {/* Question header row */}
                        <div
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", background: isEditing ? "#f9fafb" : "#fff" }}
                          onClick={() => setEditingQIdx(isEditing ? null : idx)}
                        >
                          <span style={{ background: "#f3f4f6", color: "#6B7280", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 700, fontFamily: "monospace", minWidth: 28, textAlign: "center" }}>
                            {q.stepIndex}
                          </span>
                          <span style={{ background: typeBg, color: "#fff", borderRadius: 4, padding: "2px 8px", fontSize: 10, fontWeight: 600, textTransform: "uppercase" }}>
                            {typeLabel}
                          </span>
                          <span style={{ flex: 1, color: "#111827", fontSize: 13, fontWeight: 500 }}>{q.ro}</span>
                          <span style={{ color: "#9CA3AF" }}>
                            {isEditing ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </span>
                        </div>

                        {/* Expanded editing panel */}
                        {isEditing && (
                          <div style={{ padding: "0 14px 14px", borderTop: "1px solid #f3f4f6", background: "#f9fafb" }}>
                            {/* 3-language question text editing */}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 12 }}>
                              {(["ro", "en", "ru"] as const).map((lang) => (
                                <div key={lang}>
                                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6B7280", marginBottom: 4, textTransform: "uppercase" }}>
                                    {lang === "ro" ? "Romana" : lang === "en" ? "English" : "Русский"}
                                  </label>
                                  <textarea
                                    value={q[lang]}
                                    onChange={(e) => {
                                      const updated = [...profileQuestions];
                                      updated[idx] = { ...updated[idx], [lang]: e.target.value };
                                      setProfileQuestions(updated);
                                    }}
                                    style={{
                                      width: "100%",
                                      background: "#fff",
                                      color: "#111827",
                                      border: "1px solid #d1d5db",
                                      borderRadius: 6,
                                      padding: "8px 10px",
                                      fontSize: 13,
                                      fontFamily: "'Inter', system-ui, sans-serif",
                                      resize: "vertical",
                                      minHeight: 50,
                                    }}
                                  />
                                </div>
                              ))}
                            </div>

                            {/* Options editing (if single/multi) */}
                            {q.options && q.options.length > 0 && (
                              <div style={{ marginTop: 12 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 6 }}>OPTIUNI RASPUNS</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {q.options.map((opt, oi) => (
                                    <div key={oi} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                      {(["ro", "en", "ru"] as const).map((lang) => (
                                        <input
                                          key={lang}
                                          value={opt[lang]}
                                          onChange={(e) => {
                                            const updated = [...profileQuestions];
                                            const opts = [...(updated[idx].options || [])];
                                            opts[oi] = { ...opts[oi], [lang]: e.target.value };
                                            updated[idx] = { ...updated[idx], options: opts };
                                            setProfileQuestions(updated);
                                          }}
                                          placeholder={lang.toUpperCase()}
                                          style={{
                                            background: "#fff",
                                            color: "#111827",
                                            border: "1px solid #d1d5db",
                                            borderRadius: 4,
                                            padding: "5px 8px",
                                            fontSize: 12,
                                            fontFamily: "'Inter', system-ui, sans-serif",
                                          }}
                                        />
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Likert info */}
                            {q.type === "likert" && (
                              <div style={{ marginTop: 10, padding: "8px 12px", background: "#eff6ff", borderRadius: 6, border: "1px solid #dbeafe" }}>
                                <span style={{ fontSize: 11, color: "#6B7280" }}>Scala Likert: </span>
                                <span style={{ fontSize: 11, color: "#374151" }}>1 = Total dezacord &nbsp;&nbsp;&rarr;&nbsp;&nbsp; 7 = Total acord</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ═══ CANALE sub-tab ═══ */}
            {cartonaseSubTab === "canale" && <>
            {/* Header */}
            <div style={S.sectionHeader}>
              <div>
                <h1 style={S.pageTitle}>Structura Sondaj</h1>
                <p style={S.pageSubtitle}>
                  {visibleCategories} categorii &middot; {totalMaterials} materiale
                </p>
              </div>
              <button style={S.addCatBtn} onClick={() => {/* TODO: add new category type */}}>
                <Plus size={16} />
                <span>ADAUGA CATEGORIE</span>
              </button>
            </div>

            {/* Configuration card */}
            <div style={S.configCard}>
              <div style={S.configHeader}>
                <Settings size={16} style={{ color: "#6B7280" }} />
                <span style={S.configTitle}>CONFIGURATIE</span>
              </div>
              <div style={S.configGrid}>
                <div style={S.configItem}>
                  <span style={S.configLabel}>FORMULA</span>
                  <div style={S.configFormula}>
                    <span style={{ color: "#DC2626" }}>R</span>
                    <span style={{ color: "#6B7280" }}> + </span>
                    <span style={{ color: "#D97706" }}>I</span>
                    <span style={{ color: "#6B7280" }}> &times; </span>
                    <span style={{ color: "#7C3AED" }}>F</span>
                    <span style={{ color: "#6B7280" }}> = </span>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>C</span>
                  </div>
                </div>
                <div style={S.configItem}>
                  <span style={S.configLabel}>BUTOANE PER MATERIAL</span>
                  <div style={S.configValue}>R, I, F, C, CTA (1-10)</div>
                </div>
                <div style={S.configItem}>
                  <span style={S.configLabel}>DESIGN</span>
                  <div style={S.configValue}>10 canale &times; 3 variante = 30 stimuli</div>
                </div>
              </div>
            </div>

            {/* Loading / Error */}
            {loading && <p style={{ textAlign: "center", color: "#6B7280", padding: 40 }}>Se incarca...</p>}
            {error && <p style={{ textAlign: "center", color: "#DC2626", padding: 20 }}>{error}</p>}

            {/* Categories — compact strip when editing, full gallery otherwise */}
            {!loading && !expandedCat && (
              <div style={S.galleryGrid}>
                {categories
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((cat, catIdx) => {
                    const catStimuli = getStimuliForType(cat.type);
                    const maxMat = cat.max_materials;
                    return (
                      <div key={cat.id} style={{ ...S.galleryCard, borderTopColor: cat.color, opacity: cat.is_visible ? 1 : 0.5 }}>
                        <div style={{ ...S.galleryNum, background: cat.color }}>{String(catIdx + 1).padStart(2, "0")}</div>
                        <button style={S.galleryVisBtn} title={cat.is_visible ? "Ascunde" : "Arata"} onClick={(e) => { e.stopPropagation(); toggleVisibility(cat); }}>
                          {cat.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <div style={S.galleryTop}><span style={{ ...S.galleryBadge, background: cat.color }}>{cat.short_code}</span></div>
                        <div style={S.galleryName}>{cat.label}</div>
                        <div style={S.galleryCounter}>
                          <div style={S.counterBar}><div style={{ ...S.counterFill, width: `${(catStimuli.length / maxMat) * 100}%`, background: cat.color }} /></div>
                          <span style={S.counterText}>{catStimuli.length}/{maxMat} materiale</span>
                        </div>
                        <button style={{ ...S.galleryEditBtn, width: "100%", justifyContent: "center" }} onClick={() => { setExpandedCat(cat.id); setEditingStimId(null); setAddingToType(null); setEditingCatId(null); setActiveMatIdx(0); }}>
                          <Pencil size={13} /><span>Editeaza</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ═══ COMPACT STRIP + FULL WORKSPACE ═══ */}
            {!loading && expandedCat && (() => {
              const cat = categories.find((c) => c.id === expandedCat);
              if (!cat) return null;
              const catStimuli = getStimuliForType(cat.type);
              const maxMat = cat.max_materials;
              const isEditingName = editingCatId === cat.id;
              const sortedCats = [...categories].sort((a, b) => a.display_order - b.display_order);
              const activeStim = catStimuli[activeMatIdx] || null;
              const isAdding = addingToType === cat.type;

              return (
                <>
                  {/* Compact horizontal category strip */}
                  <div style={S.catStrip}>
                    {sortedCats.map((c) => {
                      const isSel = c.id === expandedCat;
                      const cStim = getStimuliForType(c.type);
                      return (
                        <button
                          key={c.id}
                          style={{
                            ...S.catChip,
                            borderColor: isSel ? c.color : "#e5e7eb",
                            background: isSel ? c.color : "#fff",
                            color: isSel ? "#fff" : "#374151",
                            opacity: c.is_visible ? 1 : 0.4,
                          }}
                          onClick={() => { setExpandedCat(c.id); setEditingStimId(null); setAddingToType(null); setEditingCatId(null); setActiveMatIdx(0); }}
                        >
                          <span style={{ ...S.chipBadge, background: isSel ? "rgba(255,255,255,0.25)" : c.color, color: isSel ? "#fff" : "#fff" }}>{c.short_code}</span>
                          <span style={S.chipCount}>{cStim.length}/{c.max_materials}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Full-width workspace */}
                  <div style={{ ...S.workspace, borderColor: cat.color }}>
                    {/* Workspace header */}
                    <div style={S.wsHeader}>
                      <div style={S.wsHeaderLeft}>
                        <span style={{ ...S.galleryBadge, background: cat.color, fontSize: 13, padding: "6px 16px" }}>{cat.short_code}</span>
                        {isEditingName ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input type="color" value={editCatColor} onChange={(e) => setEditCatColor(e.target.value)} style={S.colorPicker} />
                            <input type="text" value={editCatLabel} onChange={(e) => setEditCatLabel(e.target.value)} style={{ ...S.catEditInput, fontSize: 18, fontWeight: 700 }} autoFocus />
                            <button style={S.iconBtnSave} onClick={saveEditCategory} disabled={saving}><Check size={14} /></button>
                            <button style={S.iconBtnCancel} onClick={() => setEditingCatId(null)}><X size={14} /></button>
                          </div>
                        ) : (
                          <h2 style={{ ...S.wsTitle, fontSize: 22 }}>{cat.label}</h2>
                        )}
                        <span style={S.wsMaterialCount}>{catStimuli.length}/{maxMat}</span>
                      </div>
                      <div style={S.wsHeaderRight}>
                        {!isEditingName && (
                          <>
                            <button style={S.wsActionBtn} onClick={() => startEditCategory(cat)} title="Redenumeste"><Pencil size={14} /><span>Redenumeste</span></button>
                            <button style={S.iconBtnSm} title="Muta sus" onClick={() => moveCategory(cat, "up")}><ChevronUp size={14} /></button>
                            <button style={S.iconBtnSm} title="Muta jos" onClick={() => moveCategory(cat, "down")}><ChevronDown size={14} /></button>
                            <button style={{ ...S.wsActionBtn, color: "#DC2626", borderColor: "#fecaca" }} onClick={() => deleteCategory(cat)}><Trash2 size={14} /><span>Sterge</span></button>
                            <button style={{ ...S.wsActionBtn, color: "#6B7280" }} onClick={() => { setExpandedCat(null); setEditingCatId(null); }}><X size={14} /><span>Inchide</span></button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Material tabs bar */}
                    <div style={S.matTabsBar}>
                      {catStimuli.map((stim, idx) => (
                        <button
                          key={stim.id}
                          style={{
                            ...S.matTab,
                            ...(activeMatIdx === idx && !isAdding ? { color: cat.color, borderBottomColor: cat.color, background: "#fff" } : {}),
                          }}
                          onClick={() => { setActiveMatIdx(idx); setEditingStimId(null); setAddingToType(null); }}
                        >
                          <span style={{ ...S.matTabNum, background: activeMatIdx === idx && !isAdding ? cat.color : "#e5e7eb", color: activeMatIdx === idx && !isAdding ? "#fff" : "#6B7280" }}>{idx + 1}</span>
                          <span style={S.matTabName}>{stim.name || "Material " + (idx + 1)}</span>
                          {getMediaIcons(stim).length > 0 && <span style={S.matTabMediaCount}>{getMediaIcons(stim).length}</span>}
                        </button>
                      ))}
                      {catStimuli.length < maxMat && (
                        <button
                          style={{ ...S.matTab, color: "#059669", ...(isAdding ? { borderBottomColor: "#059669", background: "#fff" } : {}) }}
                          onClick={() => { startAddStimulus(cat.type); setActiveMatIdx(-1); }}
                        >
                          <Plus size={14} />
                          <span>Adauga</span>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>({catStimuli.length + 1}/{maxMat})</span>
                        </button>
                      )}
                    </div>

                    {/* Active material — full width editing area */}
                    <div style={S.matWorkArea}>
                      {isAdding ? (
                        /* ── Adding new material ── */
                        <div>
                          <h3 style={S.matWorkTitle}>Material nou</h3>
                          <div style={S.matFormWide}>
                            <div style={S.formRow3}>
                              <div style={S.formField}><label style={S.formLabel}>Nume *</label><input style={S.formInput} value={newStimData.name || ""} onChange={(e) => setNewStimData({ ...newStimData, name: e.target.value })} autoFocus placeholder="Ex: Maison Noir — FB Ad" /></div>
                              <div style={S.formField}><label style={S.formLabel}>Industrie</label><IndustryPicker value={newStimData.industry || ""} onChange={(v) => setNewStimData({ ...newStimData, industry: v })} /></div>
                              <div style={S.formField}><label style={S.formLabel}>Ordine Afișare</label><input style={S.formInput} type="number" value={newStimData.display_order || 0} onChange={(e) => setNewStimData({ ...newStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            {/* Variant A/B/C and Execution Quality removed — not used */}
                            <div style={S.formField}><label style={S.formLabel}>Descriere</label><textarea style={{ ...S.formInput, minHeight: 100, resize: "vertical" as const }} value={newStimData.description || ""} onChange={(e) => setNewStimData({ ...newStimData, description: e.target.value })} /></div>
                            {uploadStatus && (
                              <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, background: uploadStatus.includes("EROARE") ? "#fef2f2" : uploadStatus.includes("complet") ? "#f0fdf4" : "#eff6ff", color: uploadStatus.includes("EROARE") ? "#dc2626" : uploadStatus.includes("complet") ? "#16a34a" : "#2563eb", border: `1px solid ${uploadStatus.includes("EROARE") ? "#fecaca" : uploadStatus.includes("complet") ? "#bbf7d0" : "#bfdbfe"}`, marginBottom: 8, fontFamily: "monospace" }}>
                                {uploadStatus}
                              </div>
                            )}
                            <div style={S.formRow2}>
                              <div style={S.formField}>
                                <label style={S.formLabel}>Imagine</label>
                                <label style={S.fileLabel}>
                                  {uploading["new-image"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                  <span>{newStimData.image_url ? "Schimba imagine" : "Incarca imagine"}</span>
                                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "new-image"); if (url) setNewStimData((prev) => ({ ...prev, image_url: url })); } }} />
                                </label>
                                {newStimData.image_url && (
                                  <div style={S.filePreview}>
                                    <img src={newStimData.image_url} alt="" style={{ maxHeight: 80, borderRadius: 6 }} />
                                    <button style={S.fileRemoveBtn} onClick={() => setNewStimData((prev) => ({ ...prev, image_url: "" }))}><X size={12} /></button>
                                  </div>
                                )}
                              </div>
                              <div style={S.formField}>
                                <label style={S.formLabel}>Video</label>
                                <label style={S.fileLabel}>
                                  {uploading["new-video"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                  <span>{newStimData.video_url ? "Schimba video" : "Incarca video"}</span>
                                  <input type="file" accept="video/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "new-video"); if (url) setNewStimData((prev) => ({ ...prev, video_url: url })); } }} />
                                </label>
                                {newStimData.video_url && (
                                  <div style={S.filePreview}>
                                    <video src={newStimData.video_url} style={{ maxHeight: 80, borderRadius: 6 }} />
                                    <button style={S.fileRemoveBtn} onClick={() => setNewStimData((prev) => ({ ...prev, video_url: "" }))}><X size={12} /></button>
                                  </div>
                                )}
                              </div>
                              <div style={S.formField}>
                                <label style={S.formLabel}>Audio (MP3)</label>
                                <label style={S.fileLabel}>
                                  {uploading["new-audio"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                  <span>{newStimData.audio_url ? "Schimba audio" : "Incarca audio"}</span>
                                  <input type="file" accept="audio/*,.mp3,.wav,.ogg" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "new-audio"); if (url) setNewStimData((prev) => ({ ...prev, audio_url: url })); } }} />
                                </label>
                                {newStimData.audio_url && (
                                  <div style={S.filePreview}>
                                    <Music size={20} style={{ color: "#7C3AED" }} />
                                    <audio src={newStimData.audio_url} controls style={{ height: 32, flex: 1 }} />
                                    <button style={S.fileRemoveBtn} onClick={() => setNewStimData((prev) => ({ ...prev, audio_url: "" }))}><X size={12} /></button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={S.formRow2}>
                              <div style={S.formField}>
                                <label style={S.formLabel}>PDF</label>
                                <label style={S.fileLabel}>
                                  {uploading["new-pdf"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                  <span>{newStimData.pdf_url ? "Schimba PDF" : "Incarca PDF"}</span>
                                  <input type="file" accept=".pdf" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "new-pdf"); if (url) setNewStimData((prev) => ({ ...prev, pdf_url: url })); } }} />
                                </label>
                                {newStimData.pdf_url && (
                                  <div style={S.filePreview}>
                                    <FileText size={20} style={{ color: "#DC2626" }} />
                                    <span style={{ fontSize: 12, color: "#374151" }}>PDF incarcat</span>
                                    <button style={S.fileRemoveBtn} onClick={() => setNewStimData((prev) => ({ ...prev, pdf_url: "" }))}><X size={12} /></button>
                                  </div>
                                )}
                              </div>
                              <div style={S.formField}><label style={S.formLabel}>URL Site</label><input style={S.formInput} value={newStimData.site_url || ""} onChange={(e) => setNewStimData({ ...newStimData, site_url: e.target.value })} placeholder="https://..." /></div>
                            </div>
                            <div style={S.formField}><label style={S.formLabel}>Continut Text</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={newStimData.text_content || ""} onChange={(e) => setNewStimData({ ...newStimData, text_content: e.target.value })} placeholder="Daca nu adaugi imagine sau video, textul devine continutul principal." /></div>
                          </div>
                          <div style={{ ...S.stimEditActions, marginTop: 20 }}>
                            <button style={S.btnCancel} onClick={() => { setAddingToType(null); setNewStimData({}); setActiveMatIdx(0); }}>Anuleaza</button>
                            <button style={{ ...S.btnSave, opacity: !newStimData.name ? 0.5 : 1 }} onClick={saveNewStimulus} disabled={saving || !newStimData.name}>{saving ? "Se salveaza..." : "Adauga Material"}</button>
                          </div>
                        </div>
                      ) : activeStim ? (
                        /* ── Existing material — always editable ── */
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ ...S.matNum, background: cat.color, width: 36, height: 36, fontSize: 16 }}>{activeMatIdx + 1}</span>
                              <h3 style={S.matWorkTitle}>{activeStim.name}</h3>
                              {activeStim.industry && <span style={S.stimIndustry}>{activeStim.industry}</span>}
                              {/* Variant/Quality badges removed */}
                              <div style={S.matMediaRow}>
                                {getMediaIcons(activeStim).map((m, i) => { const MIcon = m.icon; return <span key={i} title={m.label} style={S.matMediaTag}><MIcon size={12} /> {m.label}</span>; })}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              {editingStimId === activeStim.id ? (
                                <>
                                  <button style={S.btnCancel} onClick={() => setEditingStimId(null)}>Anuleaza</button>
                                  <button style={S.btnSave} onClick={saveEditStimulus} disabled={saving}>{saving ? "Se salveaza..." : "Salveaza"}</button>
                                </>
                              ) : (
                                <>
                                  <button style={S.wsActionBtn} onClick={() => startEditStimulus(activeStim)}><Pencil size={14} /><span>Editeaza</span></button>
                                  <button style={{ ...S.wsActionBtn, color: "#DC2626", borderColor: "#fecaca" }} onClick={() => deleteStimulus(activeStim)}><Trash2 size={14} /><span>Sterge</span></button>
                                </>
                              )}
                            </div>
                          </div>

                          {editingStimId === activeStim.id ? (
                            <div style={S.matFormWide}>
                              <div style={S.formRow3}>
                                <div style={S.formField}><label style={S.formLabel}>Nume</label><input style={S.formInput} value={editStimData.name || ""} onChange={(e) => setEditStimData({ ...editStimData, name: e.target.value })} /></div>
                                <div style={S.formField}><label style={S.formLabel}>Industrie</label><IndustryPicker value={editStimData.industry || ""} onChange={(v) => setEditStimData({ ...editStimData, industry: v })} /></div>
                                <div style={S.formField}><label style={S.formLabel}>Ordine Afișare</label><input style={S.formInput} type="number" value={editStimData.display_order || 0} onChange={(e) => setEditStimData({ ...editStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                              </div>
                              {/* Variant A/B/C and Execution Quality removed — not used */}
                              <div style={S.formField}><label style={S.formLabel}>Descriere</label><textarea style={{ ...S.formInput, minHeight: 100, resize: "vertical" as const }} value={editStimData.description || ""} onChange={(e) => setEditStimData({ ...editStimData, description: e.target.value })} /></div>
                              {uploadStatus && (
                                <div style={{ padding: "8px 12px", borderRadius: 8, fontSize: 13, background: uploadStatus.includes("EROARE") ? "#fef2f2" : uploadStatus.includes("complet") ? "#f0fdf4" : "#eff6ff", color: uploadStatus.includes("EROARE") ? "#dc2626" : uploadStatus.includes("complet") ? "#16a34a" : "#2563eb", border: `1px solid ${uploadStatus.includes("EROARE") ? "#fecaca" : uploadStatus.includes("complet") ? "#bbf7d0" : "#bfdbfe"}`, marginBottom: 8, fontFamily: "monospace" }}>
                                  {uploadStatus}
                                </div>
                              )}
                              <div style={S.formRow2}>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>Imagine</label>
                                  <label style={S.fileLabel}>
                                    {uploading["edit-image"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                    <span>{editStimData.image_url ? "Schimba imagine" : "Incarca imagine"}</span>
                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "edit-image"); if (url) setEditStimData((prev) => ({ ...prev, image_url: url })); } }} />
                                  </label>
                                  {editStimData.image_url && (
                                    <div style={S.filePreview}>
                                      <img src={editStimData.image_url} alt="" style={{ maxHeight: 80, borderRadius: 6 }} />
                                      <button style={S.fileRemoveBtn} onClick={() => setEditStimData((prev) => ({ ...prev, image_url: "" }))}><X size={12} /></button>
                                    </div>
                                  )}
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>Video</label>
                                  <label style={S.fileLabel}>
                                    {uploading["edit-video"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                    <span>{editStimData.video_url ? "Schimba video" : "Incarca video"}</span>
                                    <input type="file" accept="video/*" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "edit-video"); if (url) setEditStimData((prev) => ({ ...prev, video_url: url })); } }} />
                                  </label>
                                  {editStimData.video_url && (
                                    <div style={S.filePreview}>
                                      <video src={editStimData.video_url} style={{ maxHeight: 80, borderRadius: 6 }} />
                                      <button style={S.fileRemoveBtn} onClick={() => setEditStimData((prev) => ({ ...prev, video_url: "" }))}><X size={12} /></button>
                                    </div>
                                  )}
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>Audio (MP3)</label>
                                  <label style={S.fileLabel}>
                                    {uploading["edit-audio"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                    <span>{editStimData.audio_url ? "Schimba audio" : "Incarca audio"}</span>
                                    <input type="file" accept="audio/*,.mp3,.wav,.ogg" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "edit-audio"); if (url) setEditStimData((prev) => ({ ...prev, audio_url: url })); } }} />
                                  </label>
                                  {editStimData.audio_url && (
                                    <div style={S.filePreview}>
                                      <Music size={20} style={{ color: "#7C3AED" }} />
                                      <audio src={editStimData.audio_url} controls style={{ height: 32, flex: 1 }} />
                                      <button style={S.fileRemoveBtn} onClick={() => setEditStimData((prev) => ({ ...prev, audio_url: "" }))}><X size={12} /></button>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div style={S.formRow2}>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>PDF</label>
                                  <label style={S.fileLabel}>
                                    {uploading["edit-pdf"] ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Upload size={14} />}
                                    <span>{editStimData.pdf_url ? "Schimba PDF" : "Incarca PDF"}</span>
                                    <input type="file" accept=".pdf" style={{ display: "none" }} onChange={async (e) => { const f = e.target.files?.[0]; if (f) { const url = await uploadFile(f, "edit-pdf"); if (url) setEditStimData((prev) => ({ ...prev, pdf_url: url })); } }} />
                                  </label>
                                  {editStimData.pdf_url && (
                                    <div style={S.filePreview}>
                                      <FileText size={20} style={{ color: "#DC2626" }} />
                                      <span style={{ fontSize: 12, color: "#374151" }}>PDF incarcat</span>
                                      <button style={S.fileRemoveBtn} onClick={() => setEditStimData((prev) => ({ ...prev, pdf_url: "" }))}><X size={12} /></button>
                                    </div>
                                  )}
                                </div>
                                <div style={S.formField}><label style={S.formLabel}>URL Site</label><input style={S.formInput} value={editStimData.site_url || ""} onChange={(e) => setEditStimData({ ...editStimData, site_url: e.target.value })} placeholder="https://..." /></div>
                              </div>
                              <div style={S.formField}><label style={S.formLabel}>Continut Text</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={editStimData.text_content || ""} onChange={(e) => setEditStimData({ ...editStimData, text_content: e.target.value })} placeholder="Daca nu adaugi imagine sau video, textul devine continutul principal." /></div>
                            </div>
                          ) : (
                            <div style={S.matPreview}>
                              {activeStim.description && <div style={S.previewSection}><label style={S.previewLabel}>DESCRIERE</label><p style={S.previewText}>{activeStim.description}</p></div>}
                              {activeStim.image_url && (
                                <div style={S.previewSection}>
                                  <label style={S.previewLabel}>IMAGINE</label>
                                  <img src={activeStim.image_url} alt={activeStim.name} style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, display: "block" }} />
                                </div>
                              )}
                              {activeStim.video_url && (
                                <div style={S.previewSection}>
                                  <label style={S.previewLabel}>VIDEO</label>
                                  <video src={activeStim.video_url} controls style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, display: "block" }} />
                                </div>
                              )}
                              {activeStim.audio_url && (
                                <div style={S.previewSection}>
                                  <label style={S.previewLabel}>AUDIO</label>
                                  <audio src={activeStim.audio_url} controls style={{ width: "100%", borderRadius: 8 }} />
                                </div>
                              )}
                              {activeStim.text_content && (
                                <div style={{
                                  ...S.previewSection,
                                  ...(!activeStim.image_url && !activeStim.video_url ? { background: "#fef3c7", borderColor: "#fcd34d", padding: "24px 28px" } : {}),
                                }}>
                                  <label style={S.previewLabel}>{!activeStim.image_url && !activeStim.video_url ? "CONTINUT PRINCIPAL" : "TEXT CONTENT"}</label>
                                  <p style={{
                                    ...S.previewText,
                                    ...(!activeStim.image_url && !activeStim.video_url ? { fontSize: 16, lineHeight: 1.8, fontWeight: 500 } : {}),
                                  }}>{activeStim.text_content}</p>
                                </div>
                              )}
                              <div style={S.previewGrid}>
                                {activeStim.pdf_url && <div style={S.previewItem}><label style={S.previewLabel}>PDF</label><a href={activeStim.pdf_url} target="_blank" rel="noreferrer" style={{ ...S.previewLink, display: "flex", alignItems: "center", gap: 6 }}><FileText size={16} /> Deschide PDF</a></div>}
                                {activeStim.site_url && <div style={S.previewItem}><label style={S.previewLabel}>SITE</label><a href={activeStim.site_url} target="_blank" rel="noreferrer" style={{ ...S.previewLink, display: "flex", alignItems: "center", gap: 6 }}><Globe size={16} /> {activeStim.site_url}</a></div>}
                              </div>
                              {!activeStim.description && !activeStim.image_url && !activeStim.video_url && !activeStim.audio_url && !activeStim.text_content && !activeStim.pdf_url && !activeStim.site_url && (
                                <div style={{ textAlign: "center" as const, padding: "40px 20px", color: "#9CA3AF" }}>
                                  <p style={{ fontSize: 14, marginBottom: 12 }}>Materialul nu are continut inca.</p>
                                  <button style={S.wsActionBtn} onClick={() => startEditStimulus(activeStim)}><Pencil size={14} /><span>Adauga continut</span></button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" as const, padding: "60px 20px", color: "#9CA3AF" }}>
                          <Plus size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                          <p style={{ fontSize: 15 }}>Niciun material in aceasta categorie.</p>
                          <p style={{ fontSize: 13, marginTop: 4 }}>Apasa <strong>Adauga</strong> pentru a crea primul material.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
            </>}
          </>
        )}

        {activeTab === "rezultate" && (() => {
          // Helper: render a horizontal bar breakdown
          const renderBreakdown = (label: string, data: Record<string, number>, color: string) => {
            const total = Object.values(data).reduce((a, v) => a + v, 0);
            if (total === 0) return null;
            const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
            return (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#6B7280", marginBottom: 6, textTransform: "uppercase" as const }}>{label}</div>
                {sorted.map(([key, count]) => {
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: "#374151", minWidth: 100, textAlign: "right" as const }}>{key}</span>
                      <div style={{ flex: 1, height: 18, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", position: "relative" as const }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4, transition: "width 0.3s" }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#6B7280", minWidth: 50, fontFamily: "JetBrains Mono, monospace" }}>{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            );
          };

          // Locale pills renderer
          const localeColors: Record<string, string> = { RO: "#2563EB", RU: "#DC2626", EN: "#059669" };
          const renderLocalePills = (counts?: Record<string, number>) => {
            if (!counts || Object.keys(counts).length === 0) return null;
            const total = Object.values(counts).reduce((a, v) => a + v, 0);
            return (
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" as const }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.5, textTransform: "uppercase" as const }}>LIMBA:</span>
                {Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([lang, n]) => (
                  <span key={lang} style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${localeColors[lang] || "#6B7280"}14`, color: localeColors[lang] || "#6B7280", border: `1px solid ${localeColors[lang] || "#6B7280"}30` }}>
                    {lang} {n} ({Math.round((n / total) * 100)}%)
                  </span>
                ))}
              </div>
            );
          };

          // Psychographic labels map
          const psychLabels: Record<string, string> = {
            adReceptivity: "Receptivitate la reclame",
            visualPreference: "Preferință vizuală",
            marketingExpertise: "Tangență cu marketingul",
            irrelevanceAnnoyance: "Iritare reclame irelevante",
            attentionCapture: "Captare atenție",
            irrelevanceTolerance: "Toleranță la conținut irelevant",
          };

          return (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>Rezultate Sondaj</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
              Scoruri agregate R, I, F, C, CTA pe fiecare material + profil demografic respondenți.
            </p>

            {/* Segment sub-tabs (distributions) */}
            <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 16, overflowX: "auto" as const }}>
              <button style={{ ...S.tab, fontSize: 12, padding: "10px 16px", fontWeight: resultsSegment === "all" ? 800 : 600, ...(resultsSegment === "all" ? S.tabActive : {}) }} onClick={() => setResultsSegment("all")}>Toate</button>
              <button style={{ ...S.tab, fontSize: 12, padding: "10px 16px", ...(resultsSegment === "general" ? S.tabActive : {}) }} onClick={() => setResultsSegment("general")}>General</button>
              {distributions.map((d) => (
                <button key={d.id} style={{ ...S.tab, fontSize: 12, padding: "10px 16px", whiteSpace: "nowrap" as const, ...(resultsSegment === d.id ? S.tabActive : {}) }} onClick={() => setResultsSegment(d.id)}>{d.name}</button>
              ))}
            </div>

            {resultsLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: 8 }}>Se incarca rezultatele...</p>
              </div>
            ) : !results ? (
              <div style={S.placeholderTab}>
                <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                <p style={{ color: "#6B7280", fontSize: 14 }}>Nu s-au putut incarca rezultatele.</p>
              </div>
            ) : (
              <>
                {/* ═══ KPI Hero — ALWAYS global totals ═══ */}
                {(() => {
                  const TARGET = 10000;
                  const g = globalStats || { total: results.totalRespondents, completed: results.completedRespondents, rate: results.completionRate, responses: results.totalResponses, today: results.completedToday || 0, month: results.completedMonth || 0, avgTime: results.avgSessionTime || 0, perDist: [] };
                  const current = g.completed;
                  const pct = Math.min(Math.round((current / TARGET) * 100), 100);
                  const remaining = Math.max(TARGET - current, 0);
                  const isFiltered = resultsSegment !== "all";
                  return (
                    <div style={{
                      background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
                      borderRadius: 16,
                      padding: "28px 32px 20px",
                      marginBottom: 20,
                      position: "relative" as const,
                      overflow: "hidden",
                    }}>
                      {/* Decorative circles */}
                      <div style={{ position: "absolute" as const, top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(59,130,246,0.06)" }} />
                      <div style={{ position: "absolute" as const, bottom: -30, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(16,185,129,0.05)" }} />

                      {/* Top row: big number + mini stats */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative" as const, zIndex: 1 }}>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#6B7280", marginBottom: 6 }}>OBIECTIV STUDIU — TOTAL GLOBAL</div>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 52, fontWeight: 900, color: "#fff", fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                              {current.toLocaleString("ro-RO")}
                            </span>
                            <span style={{ fontSize: 18, fontWeight: 600, color: "#4B5563" }}>/ {TARGET.toLocaleString("ro-RO")}</span>
                          </div>
                          <div style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
                            {remaining > 0
                              ? `Încă ${remaining.toLocaleString("ro-RO")} respondenți necesari`
                              : "Obiectiv atins!"}
                          </div>
                        </div>

                        {/* Mini stat pills — adapt to segment */}
                        {(() => {
                          const segData = isFiltered
                            ? { total: results.totalRespondents, completed: results.completedRespondents, rate: results.completionRate, responses: results.totalResponses, today: results.completedToday || 0, month: results.completedMonth || 0, avgTime: results.avgSessionTime || 0 }
                            : { total: g.total, completed: g.completed, rate: g.rate, responses: g.responses, today: g.today, month: g.month, avgTime: g.avgTime };
                          const avgT = segData.avgTime;
                          const avgTStr = avgT >= 60 ? `${Math.floor(avgT / 60)}m ${avgT % 60}s` : `${avgT}s`;
                          return (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, justifyContent: "flex-end", alignItems: "stretch" }}>
                              {[
                                { label: isFiltered ? "Respondenti" : "Total porniti", value: segData.total, color: "#94a3b8" },
                                { label: "Completari", value: segData.completed, color: "#10b981" },
                                { label: "Rata", value: `${segData.rate}%`, color: segData.rate >= 80 ? "#10b981" : segData.rate >= 50 ? "#f59e0b" : "#ef4444", isText: true },
                                { label: "Raspunsuri", value: segData.responses, color: "#3b82f6" },
                                { label: "Timp mediu", value: avgTStr, color: "#a78bfa", isText: true },
                              ].map((s: any) => (
                                <div key={s.label} style={{ textAlign: "center" as const, minWidth: 56, padding: "4px 6px" }}>
                                  <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: 0.5, color: "#6B7280", marginBottom: 2, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const }}>{s.label}</div>
                                  <div style={{ fontSize: 17, fontWeight: 800, color: s.color, fontFamily: "JetBrains Mono, monospace", lineHeight: 1.2 }}>
                                    {s.isText ? s.value : (typeof s.value === "number" ? s.value.toLocaleString("ro-RO") : s.value)}
                                  </div>
                                </div>
                              ))}
                              {/* Azi / Luna — dedicated pill with clear layout */}
                              <div style={{ display: "flex", gap: 0, background: "rgba(245,158,11,0.1)", borderRadius: 8, border: "1px solid rgba(245,158,11,0.2)", padding: "4px 10px", alignItems: "center" }}>
                                <div style={{ textAlign: "center" as const, minWidth: 30 }}>
                                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: "#92400e", marginBottom: 1 }}>AZI</div>
                                  <div style={{ fontSize: 17, fontWeight: 800, color: "#f59e0b", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.2 }}>{segData.today}</div>
                                </div>
                                <div style={{ width: 1, height: 22, background: "rgba(245,158,11,0.3)", margin: "0 8px" }} />
                                <div style={{ textAlign: "center" as const, minWidth: 30 }}>
                                  <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 0.5, color: "#92400e", marginBottom: 1 }}>LUNA</div>
                                  <div style={{ fontSize: 17, fontWeight: 800, color: "#d97706", fontFamily: "JetBrains Mono, monospace", lineHeight: 1.2 }}>{segData.month}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Progress bar */}
                      <div style={{ position: "relative" as const, zIndex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF" }}>PROGRES</span>
                          <span style={{ fontSize: 14, fontWeight: 800, color: pct >= 100 ? "#10b981" : "#3b82f6", fontFamily: "JetBrains Mono, monospace" }}>{pct}%</span>
                        </div>
                        <div style={{ width: "100%", height: 10, background: "#1e293b", borderRadius: 8, overflow: "hidden", border: "1px solid #334155" }}>
                          <div style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: pct >= 100 ? "linear-gradient(90deg, #10b981, #34d399)" : pct >= 50 ? "linear-gradient(90deg, #3b82f6, #60a5fa)" : "linear-gradient(90deg, #f59e0b, #fbbf24)",
                            borderRadius: 8,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                          {[0, 2500, 5000, 7500, 10000].map((m) => (
                            <span key={m} style={{ fontSize: 8, color: current >= m ? "#6B7280" : "#374151", fontFamily: "JetBrains Mono, monospace" }}>{(m / 1000).toFixed(0)}k</span>
                          ))}
                        </div>
                      </div>

                      {/* Per-distribution breakdown + Language pills */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14, position: "relative" as const, zIndex: 1, flexWrap: "wrap" as const, gap: 8 }}>
                        {/* Per-distribution mini breakdown with plan progress */}
                        {g.perDist.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center" }}>
                            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", letterSpacing: 0.5 }}>SURSE:</span>
                            {g.perDist.map((d: any) => {
                              const distInfo = distributions.find(dd => dd.id === d.id);
                              const plan = distInfo?.estimated_completions || 0;
                              const planPct = plan > 0 ? Math.round((d.completed / plan) * 100) : 0;
                              return (
                                <span key={d.id} style={{
                                  fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 10,
                                  background: d.completed > 0 ? "rgba(16,185,129,0.15)" : "rgba(107,114,128,0.15)",
                                  color: d.completed > 0 ? "#34d399" : "#6B7280",
                                  border: `1px solid ${d.completed > 0 ? "rgba(16,185,129,0.3)" : "rgba(107,114,128,0.2)"}`,
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                }}>
                                  {d.name}: <strong>{d.completed}</strong>/{d.total}
                                  {plan > 0 && (
                                    <span style={{ fontSize: 8, color: planPct >= 100 ? "#34d399" : "#94a3b8", marginLeft: 2 }}>
                                      ({d.completed}/{plan} plan · {planPct}%)
                                    </span>
                                  )}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        {/* Language pills */}
                        {results.localeCounts && Object.keys(results.localeCounts).length > 0 && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <span style={{ fontSize: 9, fontWeight: 600, color: "#6B7280", letterSpacing: 0.5 }}>LIMBA:</span>
                            {Object.entries(results.localeCounts).sort((a, b) => b[1] - a[1]).map(([lang, n]) => {
                              const lc: Record<string, string> = { RO: "#3b82f6", RU: "#ef4444", EN: "#10b981" };
                              const tot = Object.values(results.localeCounts!).reduce((a, v) => a + v, 0);
                              return (
                                <span key={lang} style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: `${lc[lang] || "#6B7280"}20`, color: lc[lang] || "#6B7280" }}>
                                  {lang} {n} ({Math.round((n / tot) * 100)}%)
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* If viewing a segment, show segment-specific stats below */}
                      {isFiltered && (() => {
                        const activeDist = distributions.find(d => d.id === resultsSegment);
                        const plan = activeDist?.estimated_completions || 0;
                        const planPct = plan > 0 ? Math.round((results.completedRespondents / plan) * 100) : 0;
                        return (
                          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #334155", position: "relative" as const, zIndex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" as const }}>
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#f59e0b" }}>SEGMENT ACTIV:</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                                {resultsSegment === "general" ? "General (fara tag)" : (activeDist?.name || resultsSegment)}
                              </span>
                              <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                                — {results.completedRespondents} completari din {results.totalRespondents} porniti ({results.completionRate}%)
                              </span>
                              {plan > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 8, background: planPct >= 100 ? "rgba(16,185,129,0.2)" : "rgba(245,158,11,0.15)", color: planPct >= 100 ? "#34d399" : "#fbbf24" }}>
                                  {results.completedRespondents}/{plan} plan · {planPct}%
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* Content sub-tabs: SCORURI | PROFIL | PSIHOGRAFIC | CANALE | INDUSTRII */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
                  {([
                    { key: "scoruri" as const, label: "Scoruri R·I·F·C·CTA" },
                    { key: "profil" as const, label: "Profil Respondenți" },
                    { key: "psihografic" as const, label: "Psihografic" },
                    { key: "canale" as const, label: "Total Canale" },
                    { key: "industrii" as const, label: "Industrii" },
                  ]).map((t) => (
                    <button key={t.key} onClick={() => { setResultsSubTab(t.key); if (t.key !== "canale") setExpandedChannelType(null); if (t.key !== "industrii") setExpandedIndustryType(null); }} style={{
                      padding: "8px 16px", fontSize: 12, fontWeight: 600, borderRadius: 6, border: "1px solid #e5e7eb", cursor: "pointer",
                      background: resultsSubTab === t.key ? "#111827" : "#fff",
                      color: resultsSubTab === t.key ? "#fff" : "#6B7280",
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* ── SUB-TAB: SCORURI ── */}
                {resultsSubTab === "scoruri" && (
                  <>
                    {results.stimuliResults.length === 0 ? (
                      <div style={S.placeholderTab}>
                        <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                        <p style={{ color: "#6B7280", fontSize: 14 }}>{resultsSegment === "general" ? "Niciun raspuns inca. Distribue sondajul pentru a colecta date." : "Niciun raspuns pentru acest segment."}</p>
                      </div>
                    ) : (() => {
                      // Build category averages
                      const byType: Record<string, StimulusResult[]> = {};
                      results.stimuliResults.filter(s => s.response_count > 0).forEach(s => {
                        if (!byType[s.type]) byType[s.type] = [];
                        byType[s.type].push(s);
                      });
                      const typeAvgs = Object.entries(byType).map(([type, items]) => {
                        const n = items.length;
                        return {
                          type,
                          count: items.reduce((a, s) => a + s.response_count, 0),
                          avg_r: Math.round((items.reduce((a, s) => a + s.avg_r, 0) / n) * 100) / 100,
                          avg_i: Math.round((items.reduce((a, s) => a + s.avg_i, 0) / n) * 100) / 100,
                          avg_f: Math.round((items.reduce((a, s) => a + s.avg_f, 0) / n) * 100) / 100,
                          avg_c: Math.round((items.reduce((a, s) => a + s.avg_c, 0) / n) * 100) / 100,
                          avg_cta: Math.round((items.reduce((a, s) => a + s.avg_cta, 0) / n) * 100) / 100,
                        };
                      }).sort((a, b) => b.avg_c - a.avg_c);

                      // Filter table rows by selected category
                      const filteredStimuli = resultsCatFilter
                        ? results.stimuliResults.filter(s => s.type === resultsCatFilter)
                        : results.stimuliResults;

                      // Compute TOTAL row from filtered data
                      const withData = filteredStimuli.filter(s => s.response_count > 0);
                      const totalN = withData.reduce((a, s) => a + s.response_count, 0);
                      const totalRow = withData.length > 0 ? {
                        avg_r: Math.round((withData.reduce((a, s) => a + s.avg_r, 0) / withData.length) * 100) / 100,
                        avg_i: Math.round((withData.reduce((a, s) => a + s.avg_i, 0) / withData.length) * 100) / 100,
                        avg_f: Math.round((withData.reduce((a, s) => a + s.avg_f, 0) / withData.length) * 100) / 100,
                        avg_c: Math.round((withData.reduce((a, s) => a + s.avg_c, 0) / withData.length) * 100) / 100,
                        avg_c_score: Math.round((withData.reduce((a, s) => a + s.avg_c_score, 0) / withData.length) * 100) / 100,
                        avg_cta: Math.round((withData.reduce((a, s) => a + s.avg_cta, 0) / withData.length) * 100) / 100,
                        sd_c: Math.round((withData.reduce((a, s) => a + s.sd_c, 0) / withData.length) * 100) / 100,
                        avg_time: Math.round(withData.reduce((a, s) => a + s.avg_time, 0) / withData.length),
                        total_time: Math.round(withData.reduce((a, s) => a + s.avg_time, 0)),
                        brand_rate: Math.round(withData.reduce((a, s) => a + (s.brand_rate || 0), 0) / withData.length),
                        brand_yes: withData.reduce((a, s) => a + (s.brand_yes || 0), 0),
                        brand_total: withData.reduce((a, s) => a + (s.brand_yes || 0) + (s.brand_no || 0), 0),
                      } : null;

                      return (
                        <>
                          {/* Category filter pills — from categories table, ordered by display_order */}
                          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 16 }}>
                            <button onClick={() => setResultsCatFilter(null)} style={{
                              padding: "6px 14px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s", fontSize: 12, fontWeight: 600,
                              border: !resultsCatFilter ? "2px solid #111827" : "1px solid #e5e7eb",
                              background: !resultsCatFilter ? "#111827" : "#fff",
                              color: !resultsCatFilter ? "#fff" : "#374151",
                            }}>Toate Canalele</button>
                            {[...categories].sort((a, b) => a.display_order - b.display_order).map(cat => {
                              const isActive = resultsCatFilter === cat.type;
                              const stimCount = results.stimuliResults.filter(s => s.type === cat.type).length;
                              return (
                                <button key={cat.type} onClick={() => setResultsCatFilter(isActive ? null : cat.type)} style={{
                                  padding: "6px 12px", borderRadius: 20, cursor: "pointer", transition: "all 0.15s", fontSize: 12, fontWeight: 600,
                                  display: "flex", alignItems: "center", gap: 5,
                                  border: isActive ? `2px solid ${cat.color}` : "1px solid #e5e7eb",
                                  background: isActive ? `${cat.color}14` : "#fff",
                                  color: isActive ? cat.color : "#374151",
                                  opacity: stimCount > 0 ? 1 : 0.5,
                                }}>
                                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                                  {cat.short_code}
                                </button>
                              );
                            })}
                          </div>

                          {/* Results table — filtered, with TOTAL first row + expandable per-stimulus details */}
                          <div style={{ ...S.configCard, padding: 0, overflow: "auto" }}>
                            {/* Column tooltip */}
                            {tooltipCol && (() => {
                              const tips: Record<string, { title: string; desc: string }> = {
                                N: { title: "N \u2014 Num\u0103r R\u0103spunsuri", desc: "C\u00e2te evalu\u0103ri (r\u0103spunsuri complete) au fost colectate pentru acest material. Fiecare respondent evalueaz\u0103 materialul pe scalele R, I, F." },
                                R: { title: "R \u2014 Recunoa\u0219tere (Recognition)", desc: "Scor mediu 1\u201310. M\u0103soar\u0103 c\u00e2t de u\u0219or este materialul de recunoscut \u0219i identificat. Un R mare \u00eenseamn\u0103 c\u0103 brandul/mesajul este vizibil \u0219i memorabil." },
                                I: { title: "I \u2014 Impact Emo\u021Bional (Emotional Impact)", desc: "Scor mediu 1\u201310. M\u0103soar\u0103 intensitatea reac\u021Biei emo\u021Bionale pe care o provoac\u0103 materialul. Un I mare \u00eenseamn\u0103 c\u0103 materialul genereaz\u0103 emo\u021Bii puternice (pozitive sau negative)." },
                                F: { title: "F \u2014 Frecven\u021B\u0103 (Frequency/Familiarity)", desc: "Scor mediu 1\u201310. M\u0103soar\u0103 c\u00e2t de familiar \u0219i frecvent perceput este materialul. Un F mare \u00eenseamn\u0103 c\u0103 respondentul simte c\u0103 a mai v\u0103zut materialul de mai multe ori." },
                                Cform: { title: "C\u2091\u2092\u2093\u2098 \u2014 Scor Comunicare (Formula)", desc: "Calculat dup\u0103 formula: C = R + I \u00d7 F. Combin\u0103 cele 3 dimensiuni \u00eentr-un scor unic. Valori mai mari = comunicare mai eficient\u0103. Maxim teoretic: 110 (R=10, I=10, F=10)." },
                                Cperc: { title: "C\u209a\u2091\u2093\u2094 \u2014 Scor Comunicare Perceput\u0103", desc: "Media scorurilor de Comunicare percepute direct de respondent (nu calculate). Respondentul r\u0103spunde: \u201eC\u00e2t de eficient comunic\u0103 acest material?\u201d pe scala 1\u201310." },
                                CTA: { title: "CTA \u2014 Call To Action", desc: "Scor mediu 1\u201310. M\u0103soar\u0103 c\u00e2t de puternic este \u00eendemnul la ac\u021Biune. Un CTA mare \u00eenseamn\u0103 c\u0103 materialul \u00eel motiveaz\u0103 pe respondent s\u0103 fac\u0103 ceva (s\u0103 cumpere, s\u0103 viziteze, s\u0103 afle mai mult)." },
                                SD: { title: "SD \u2014 Standard Deviation (Devia\u021Bie Standard)", desc: "M\u0103soar\u0103 c\u00e2t de dispersate sunt r\u0103spunsurile. SD mic = consens (to\u021Bi evalueaz\u0103 similar). SD mare = opinii \u00eemp\u0103r\u021Bite (unii dau note mari, al\u021Bii mici). Util pentru identificarea materialelor controversate." },
                                Ts: { title: "T(s) — Timp Mediu (secunde)", desc: "Pe fiecare rând: timpul mediu (în secunde) petrecut de respondenți evaluând acel material specific (6 întrebări: R, I, F, C, CTA, Brand).\n\nPe rândul TOTAL: media aritmetică a tuturor timpilor per material. De exemplu, dacă ai 10 materiale cu timpi de 24s, 37s, 20s, 15s... TOTAL-ul e media lor (nu suma). De aceea TOTAL-ul poate fi mai mic decât unele materiale individuale — cele rapide (10-15s) trag media în jos." },
                                B: { title: "B% — Brand Awareness (Recunoașterea Brandului)", desc: "Procentul respondenților care au declarat că CUNOSC brandul din acest material.\n\nPe fiecare rând: % din respondenți care au răspuns DA la întrebarea \"Cunoști acest brand?\". Numărul exact (DA/TOTAL) apare ca sub-text.\n\nPe rândul TOTAL: media procentelor de recunoaștere pe toate materialele.\n\nUtilitate: Compară B% cu scorurile R/I/F/C — un brand necunoscut cu C mare = comunicare eficientă chiar și fără awareness prealabilă. Un brand cunoscut cu C mic = mesajul nu e suficient de puternic." },
                              };
                              const t = tips[tooltipCol];
                              if (!t) return null;
                              return (
                                <div onClick={() => setTooltipCol(null)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.3)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
                                  <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 12, padding: "24px 28px", maxWidth: 440, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#111827" }}>{t.title}</h3>
                                      <button onClick={() => setTooltipCol(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#9CA3AF", padding: 4 }}>&times;</button>
                                    </div>
                                    <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#4B5563" }}>{t.desc}</p>
                                  </div>
                                </div>
                              );
                            })()}
                            <table style={{ width: "100%", borderCollapse: "collapse" as const, minWidth: 900 }}>
                              <thead>
                                <tr style={{ background: "#f9fafb" }}>
                                  <th style={{ ...thStyle, width: 36, padding: "8px 4px" }}></th>
                                  <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 180 }}>MATERIAL</th>
                                  <th style={thStyle}>CANAL</th>
                                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => setTooltipCol("N")}>N</th>
                                  <th style={{ ...thStyle, color: "#DC2626", cursor: "pointer" }} onClick={() => setTooltipCol("R")}>R</th>
                                  <th style={{ ...thStyle, color: "#D97706", cursor: "pointer" }} onClick={() => setTooltipCol("I")}>I</th>
                                  <th style={{ ...thStyle, color: "#7C3AED", cursor: "pointer" }} onClick={() => setTooltipCol("F")}>F</th>
                                  <th style={{ ...thStyle, color: "#111827", fontWeight: 800, cursor: "pointer" }} onClick={() => setTooltipCol("Cform")}>C<sub style={{ fontSize: 9 }}>form</sub></th>
                                  <th style={{ ...thStyle, color: "#059669", cursor: "pointer" }} onClick={() => setTooltipCol("Cperc")}>C<sub style={{ fontSize: 9 }}>perc</sub></th>
                                  <th style={{ ...thStyle, color: "#2563EB", cursor: "pointer" }} onClick={() => setTooltipCol("CTA")}>CTA</th>
                                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => setTooltipCol("SD")}>SD</th>
                                  <th style={{ ...thStyle, cursor: "pointer" }} onClick={() => setTooltipCol("Ts")}>T(s)</th>
                                  <th style={{ ...thStyle, color: "#0891b2", cursor: "pointer" }} onClick={() => setTooltipCol("B")}>B%</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* TOTAL row */}
                                {totalRow && (
                                  <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                                    <td style={{ ...tdStyle, padding: "8px 4px" }}></td>
                                    <td style={{ ...tdStyle, fontWeight: 800, color: "#111827", fontSize: 13 }}>{resultsCatFilter ? (categories.find(c => c.type === resultsCatFilter)?.label || resultsCatFilter) : "TOTAL"}</td>
                                    <td style={tdStyle}><span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#111827", color: "#fff" }}>{resultsCatFilter ? (categories.find(c => c.type === resultsCatFilter)?.short_code || resultsCatFilter) : "ALL"}</span></td>
                                    <td style={{ ...tdStyle, fontWeight: 700 }}>{totalN}</td>
                                    <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 800 }}>{totalRow.avg_r}</td>
                                    <td style={{ ...tdStyle, color: "#D97706", fontWeight: 800 }}>{totalRow.avg_i}</td>
                                    <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 800 }}>{totalRow.avg_f}</td>
                                    <td style={{ ...tdStyle, color: "#111827", fontWeight: 900, fontSize: 16 }}>{totalRow.avg_c}</td>
                                    <td style={{ ...tdStyle, color: "#059669", fontWeight: 800 }}>{totalRow.avg_c_score}</td>
                                    <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 800 }}>{totalRow.avg_cta}</td>
                                    <td style={{ ...tdStyle, color: "#6B7280", fontWeight: 700 }}>{totalRow.sd_c}</td>
                                    <td style={{ ...tdStyle, color: "#6B7280", fontWeight: 700, fontSize: 11 }}>
                                      {totalRow.avg_time ? (
                                        <span title={`Media per card: ${totalRow.avg_time}s | Total sesiune: ${totalRow.total_time}s (${Math.round(totalRow.total_time / 60)}min)`}>
                                          <span style={{ color: "#111827", fontWeight: 800 }}>{totalRow.total_time}s</span>
                                          <span style={{ color: "#9CA3AF", fontSize: 10 }}> ({Math.round(totalRow.total_time / 60)}m)</span>
                                          <br/>
                                          <span style={{ fontSize: 9, color: "#9CA3AF" }}>~{totalRow.avg_time}s/card</span>
                                        </span>
                                      ) : "—"}
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 700, fontSize: 13 }}>
                                      {totalRow.brand_total > 0 ? (
                                        <>
                                          <span style={{ color: totalRow.brand_rate >= 50 ? "#059669" : "#DC2626" }}>{totalRow.brand_rate}%</span>
                                          <div style={{ fontSize: 9, color: "#9CA3AF" }}>{totalRow.brand_yes}/{totalRow.brand_total}</div>
                                        </>
                                      ) : <span style={{ color: "#d1d5db" }}>—</span>}
                                    </td>
                                  </tr>
                                )}
                                {filteredStimuli.map((s) => {
                                  const isExpanded = expandedStimulusId === s.id;
                                  const stimBreakdown = results.perStimulusBreakdowns?.[s.id];
                                  const cc = categories.find(c => c.type === s.type);
                                  return (
                                    <React.Fragment key={s.id}>
                                      <tr style={{ borderBottom: isExpanded ? "none" : "1px solid #f3f4f6", cursor: "pointer" }} onClick={() => setExpandedStimulusId(isExpanded ? null : s.id)}>
                                        <td style={{ ...tdStyle, padding: "8px 4px", textAlign: "center" as const }}>
                                          <div style={{
                                            width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                            border: `1.5px solid ${isExpanded ? (cc?.color || "#6B7280") : "#d1d5db"}`,
                                            background: isExpanded ? `${cc?.color || "#6B7280"}14` : "#fff",
                                            color: isExpanded ? (cc?.color || "#6B7280") : "#9CA3AF",
                                            fontSize: 16, fontWeight: 700, lineHeight: 1, transition: "all 0.15s",
                                          }}>
                                            {isExpanded ? "−" : "+"}
                                          </div>
                                        </td>
                                        <td style={{ ...tdStyle, fontWeight: 600, color: "#111827" }}>
                                          {s.name}
                                          {/* variant badge removed */}
                                        </td>
                                        <td style={tdStyle}>
                                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, padding: "3px 8px", borderRadius: 4, background: cc?.color ? `${cc.color}18` : "#f3f4f6", color: cc?.color || "#6B7280" }}>{cc?.short_code || s.type}</span>
                                        </td>
                                        <td style={tdStyle}>{s.response_count}</td>
                                        <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{s.avg_r || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{s.avg_i || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{s.avg_f || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#111827", fontWeight: 800, fontSize: 15 }}>{s.avg_c || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#059669", fontWeight: 600 }}>{s.avg_c_score || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 600 }}>{s.avg_cta || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#9CA3AF" }}>{s.sd_c || "—"}</td>
                                        <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 11 }}>{s.avg_time ? `${s.avg_time}s` : "—"}</td>
                                        <td style={{ ...tdStyle, fontSize: 12 }}>
                                          {(s.brand_yes + s.brand_no) > 0 ? (
                                            <>
                                              <span style={{ fontWeight: 700, color: s.brand_rate >= 50 ? "#059669" : "#DC2626" }}>{s.brand_rate}%</span>
                                              <div style={{ fontSize: 9, color: "#9CA3AF" }}>{s.brand_yes}/{s.brand_yes + s.brand_no}</div>
                                            </>
                                          ) : "—"}
                                        </td>
                                      </tr>
                                      {/* Expanded stimulus detail row */}
                                      {isExpanded && stimBreakdown && (
                                        <tr>
                                          <td colSpan={13} style={{ padding: 0, borderBottom: "2px solid #e5e7eb" }}>
                                            <div style={{ padding: "16px 20px", background: "#fafbfc", borderTop: "1px solid #f3f4f6" }}>
                                              {/* Stats cards row */}
                                              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
                                                {[
                                                  { label: "RESPONDENȚI", value: stimBreakdown.respondentCount, color: "#374151" },
                                                  { label: "COMPLETĂRI", value: stimBreakdown.completedCount, color: "#059669" },
                                                  { label: "RATĂ", value: `${stimBreakdown.completionRate}%`, color: "#DC2626" },
                                                ].map((stat) => (
                                                  <div key={stat.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#6B7280", textTransform: "uppercase" as const }}>{stat.label}</span>
                                                    <span style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "JetBrains Mono, monospace" }}>{stat.value}</span>
                                                  </div>
                                                ))}
                                              </div>
                                              {/* Language breakdown */}
                                              {stimBreakdown.localeCounts && Object.keys(stimBreakdown.localeCounts).length > 0 && (
                                                <div style={{ marginBottom: 12 }}>{renderLocalePills(stimBreakdown.localeCounts)}</div>
                                              )}
                                              {/* Demographics + Behavioral */}
                                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                                                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${cc?.color || "#6B7280"}`, borderRadius: 8, padding: "12px 14px" }}>
                                                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: 0, marginBottom: 10 }}>Demografice</h4>
                                                  {renderBreakdown("Gen", stimBreakdown.demographics?.gender || {}, "#EC4899")}
                                                  {renderBreakdown("Vârstă", stimBreakdown.demographics?.ageRange || {}, "#D97706")}
                                                  {renderBreakdown("Țară", stimBreakdown.demographics?.country || {}, "#059669")}
                                                  {renderBreakdown("Urban / Rural", stimBreakdown.demographics?.locationType || {}, "#2563EB")}
                                                  {renderBreakdown("Venit", stimBreakdown.demographics?.incomeRange || {}, "#7C3AED")}
                                                  {renderBreakdown("Educație", stimBreakdown.demographics?.education || {}, "#DC2626")}
                                                </div>
                                                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${cc?.color || "#6B7280"}`, borderRadius: 8, padding: "12px 14px" }}>
                                                  <h4 style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: 0, marginBottom: 10 }}>Comportament</h4>
                                                  {renderBreakdown("Frecvență cumpărare", stimBreakdown.behavioral?.purchaseFrequency || {}, "#059669")}
                                                  {renderBreakdown("Canale preferate", stimBreakdown.behavioral?.preferredChannels || {}, "#2563EB")}
                                                  {renderBreakdown("Timp online/zi", stimBreakdown.behavioral?.dailyOnlineTime || {}, "#D97706")}
                                                  {renderBreakdown("Dispozitiv principal", stimBreakdown.behavioral?.primaryDevice || {}, "#7C3AED")}
                                                </div>
                                              </div>
                                              {/* Psychographic */}
                                              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderLeft: `3px solid ${cc?.color || "#6B7280"}`, borderRadius: 8, padding: "12px 14px" }}>
                                                <h4 style={{ fontSize: 12, fontWeight: 700, color: "#374151", margin: 0, marginBottom: 10 }}>Profil Psihografic</h4>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px" }}>
                                                  {Object.entries(stimBreakdown.psychographicAvg || {}).map(([key, avg]) => (
                                                    <div key={key}>
                                                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                                        <span style={{ fontSize: 11, fontWeight: 600, color: "#374151" }}>{psychLabels[key] || key}</span>
                                                        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", fontFamily: "JetBrains Mono, monospace" }}>{avg}</span>
                                                      </div>
                                                      <div style={{ height: 16, background: "#f3f4f6", borderRadius: 4, overflow: "hidden", position: "relative" as const }}>
                                                        <div style={{ height: "100%", width: `${(avg / 10) * 100}%`, borderRadius: 4, transition: "width 0.3s", background: cc?.color || "#6B7280" }} />
                                                        {[1,2,3,4,5,6,7,8,9].map(i => (
                                                          <div key={i} style={{ position: "absolute" as const, left: `${(i/10)*100}%`, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.05)" }} />
                                                        ))}
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* ── Per-category PROFIL + PSIHOGRAFIC inline (when a category is selected) ── */}
                          {resultsCatFilter && results.perCategoryBreakdowns?.[resultsCatFilter] && (() => {
                            const catBreakdown = results.perCategoryBreakdowns[resultsCatFilter];
                            const catMeta = categories.find(c => c.type === resultsCatFilter);
                            const catLabel = catMeta?.label || resultsCatFilter;
                            const catColor = catMeta?.color || "#6B7280";
                            const hasDemo = Object.values(catBreakdown.demographics || {}).some(v => Object.keys(v).length > 0);
                            const hasBehav = Object.values(catBreakdown.behavioral || {}).some(v => Object.keys(v).length > 0);
                            const hasPsych = Object.values(catBreakdown.psychographicAvg || {}).some(v => v > 0);

                            if (!hasDemo && !hasBehav && !hasPsych) return null;

                            return (
                              <div style={{ marginTop: 24 }}>
                                {/* Section header */}
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: catColor, flexShrink: 0 }} />
                                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0 }}>
                                    Profil Respondenți — {catLabel}
                                  </h3>
                                </div>

                                {/* Stats cards row */}
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                                  {[
                                    { label: "RESPONDENȚI", value: catBreakdown.respondentCount, color: "#374151" },
                                    { label: "COMPLETĂRI", value: catBreakdown.completedCount, color: "#059669" },
                                    { label: "RATĂ", value: `${catBreakdown.completionRate}%`, color: "#DC2626" },
                                    { label: "RĂSPUNSURI", value: catBreakdown.responseCount, color: "#2563EB" },
                                  ].map((stat) => (
                                    <div key={stat.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, color: "#6B7280", textTransform: "uppercase" as const }}>{stat.label}</span>
                                      <span style={{ fontSize: 20, fontWeight: 700, color: stat.color, fontFamily: "JetBrains Mono, monospace" }}>{stat.value}</span>
                                    </div>
                                  ))}
                                </div>

                                {/* Language breakdown */}
                                {catBreakdown.localeCounts && Object.keys(catBreakdown.localeCounts).length > 0 && (
                                  <div style={{ marginBottom: 16 }}>{renderLocalePills(catBreakdown.localeCounts)}</div>
                                )}

                                {/* Demographics + Behavioral grid */}
                                {(hasDemo || hasBehav) && (
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                                    {/* Demographics */}
                                    {hasDemo && (
                                      <div style={{ ...S.configCard, borderLeft: `3px solid ${catColor}` }}>
                                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Demografice</h4>
                                        {renderBreakdown("Gen", catBreakdown.demographics?.gender || {}, "#EC4899")}
                                        {renderBreakdown("Vârstă", catBreakdown.demographics?.ageRange || {}, "#D97706")}
                                        {renderBreakdown("Țară", catBreakdown.demographics?.country || {}, "#059669")}
                                        {renderBreakdown("Urban / Rural", catBreakdown.demographics?.locationType || {}, "#2563EB")}
                                        {renderBreakdown("Venit", catBreakdown.demographics?.incomeRange || {}, "#7C3AED")}
                                        {renderBreakdown("Educație", catBreakdown.demographics?.education || {}, "#DC2626")}
                                      </div>
                                    )}
                                    {/* Behavioral */}
                                    {hasBehav && (
                                      <div style={{ ...S.configCard, borderLeft: `3px solid ${catColor}` }}>
                                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 14 }}>Comportament</h4>
                                        {renderBreakdown("Frecvență cumpărare", catBreakdown.behavioral?.purchaseFrequency || {}, "#059669")}
                                        {renderBreakdown("Canale preferate", catBreakdown.behavioral?.preferredChannels || {}, "#2563EB")}
                                        {renderBreakdown("Timp online/zi", catBreakdown.behavioral?.dailyOnlineTime || {}, "#D97706")}
                                        {renderBreakdown("Dispozitiv principal", catBreakdown.behavioral?.primaryDevice || {}, "#7C3AED")}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Psychographic */}
                                {hasPsych && (
                                  <div style={{ ...S.configCard, borderLeft: `3px solid ${catColor}` }}>
                                    <h4 style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Profil Psihografic — {catLabel}</h4>
                                    <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 16 }}>Medii 1-10 pentru respondenții care au evaluat materiale {catLabel}.</p>
                                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 14 }}>
                                      {Object.entries(catBreakdown.psychographicAvg || {}).map(([key, avg]) => (
                                        <div key={key}>
                                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{psychLabels[key] || key}</span>
                                            <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", fontFamily: "JetBrains Mono, monospace" }}>{avg}</span>
                                          </div>
                                          <div style={{ height: 20, background: "#f3f4f6", borderRadius: 5, overflow: "hidden", position: "relative" as const }}>
                                            <div style={{
                                              height: "100%", width: `${(avg / 10) * 100}%`, borderRadius: 5, transition: "width 0.3s",
                                              background: catColor,
                                            }} />
                                            {[1,2,3,4,5,6,7,8,9].map(i => (
                                              <div key={i} style={{ position: "absolute" as const, left: `${(i/10)*100}%`, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.06)" }} />
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </>
                )}

                {/* ── SUB-TAB: PROFIL RESPONDENTI ── */}
                {resultsSubTab === "profil" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    {/* Demographics column */}
                    <div style={S.configCard}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 16 }}>Demografice</h3>
                      {renderBreakdown("Gen", results.demographics?.gender || {}, "#EC4899")}
                      {renderBreakdown("Vârstă", results.demographics?.ageRange || {}, "#D97706")}
                      {renderBreakdown("Țară", results.demographics?.country || {}, "#059669")}
                      {renderBreakdown("Urban / Rural", results.demographics?.locationType || {}, "#2563EB")}
                      {renderBreakdown("Venit", results.demographics?.incomeRange || {}, "#7C3AED")}
                      {renderBreakdown("Educație", results.demographics?.education || {}, "#DC2626")}
                    </div>
                    {/* Behavioral column */}
                    <div style={S.configCard}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 16 }}>Comportament</h3>
                      {renderBreakdown("Frecvență cumpărare", results.behavioral?.purchaseFrequency || {}, "#059669")}
                      {renderBreakdown("Canale preferate", results.behavioral?.preferredChannels || {}, "#2563EB")}
                      {renderBreakdown("Timp online/zi", results.behavioral?.dailyOnlineTime || {}, "#D97706")}
                      {renderBreakdown("Dispozitiv principal", results.behavioral?.primaryDevice || {}, "#7C3AED")}
                    </div>
                  </div>
                )}

                {/* ── SUB-TAB: PSIHOGRAFIC ── */}
                {resultsSubTab === "psihografic" && (
                  <div style={S.configCard}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Profil Psihografic (medii 1-10)</h3>
                    <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 20 }}>Întrebările 11-15: cât de mult sunt de acord respondenții cu afirmațiile.</p>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                      {Object.entries(results.psychographicAvg || {}).map(([key, avg]) => (
                        <div key={key}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{psychLabels[key] || key}</span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: "#111827", fontFamily: "JetBrains Mono, monospace" }}>{avg}</span>
                          </div>
                          <div style={{ height: 24, background: "#f3f4f6", borderRadius: 6, overflow: "hidden", position: "relative" as const }}>
                            <div style={{
                              height: "100%", width: `${(avg / 10) * 100}%`, borderRadius: 6, transition: "width 0.3s",
                              background: avg >= 7 ? "#059669" : avg >= 4 ? "#D97706" : "#DC2626",
                            }} />
                            {/* Scale markers */}
                            {[1,2,3,4,5,6,7,8,9].map(i => (
                              <div key={i} style={{ position: "absolute" as const, left: `${(i/10)*100}%`, top: 0, bottom: 0, width: 1, background: "rgba(0,0,0,0.08)" }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SUB-TAB: TOTAL CANALE ── */}
                {resultsSubTab === "canale" && (() => {
                  // Group stimuliResults by type (channel)
                  const byChannel: Record<string, StimulusResult[]> = {};
                  results.stimuliResults.forEach(s => {
                    if (!byChannel[s.type]) byChannel[s.type] = [];
                    byChannel[s.type].push(s);
                  });

                  // Build channel aggregates sorted by categories display_order
                  type ChannelAgg = { type: string; label: string; shortCode: string; color: string; materialCount: number; materialsWithData: number; totalResponses: number; avg_r: number; avg_i: number; avg_f: number; avg_c: number; avg_c_score: number; avg_cta: number; avg_time: number; items: StimulusResult[] };
                  const channelData: ChannelAgg[] = [...categories]
                    .sort((a, b) => a.display_order - b.display_order)
                    .reduce<ChannelAgg[]>((acc, cat) => {
                      const items = byChannel[cat.type] || [];
                      const withData = items.filter(s => s.response_count > 0);
                      if (items.length === 0) return acc;
                      const n = withData.length || 1;
                      acc.push({
                        type: cat.type,
                        label: cat.label,
                        shortCode: cat.short_code,
                        color: cat.color,
                        materialCount: items.length,
                        materialsWithData: withData.length,
                        totalResponses: items.reduce((a, s) => a + s.response_count, 0),
                        avg_r: Math.round((withData.reduce((a, s) => a + s.avg_r, 0) / n) * 100) / 100,
                        avg_i: Math.round((withData.reduce((a, s) => a + s.avg_i, 0) / n) * 100) / 100,
                        avg_f: Math.round((withData.reduce((a, s) => a + s.avg_f, 0) / n) * 100) / 100,
                        avg_c: Math.round((withData.reduce((a, s) => a + s.avg_c, 0) / n) * 100) / 100,
                        avg_c_score: Math.round((withData.reduce((a, s) => a + s.avg_c_score, 0) / n) * 100) / 100,
                        avg_cta: Math.round((withData.reduce((a, s) => a + s.avg_cta, 0) / n) * 100) / 100,
                        avg_time: Math.round(withData.reduce((a, s) => a + s.avg_time, 0) / n),
                        items,
                      });
                      return acc;
                    }, []);

                  if (channelData.length === 0) {
                    return (
                      <div style={S.placeholderTab}>
                        <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                        <p style={{ color: "#6B7280", fontSize: 14 }}>Niciun raspuns inca pentru a genera totaluri per canal.</p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      {/* Channel cards grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                        {channelData.map(ch => {
                          const isExpanded = expandedChannelType === ch.type;
                          return (
                            <div
                              key={ch.type}
                              onClick={() => setExpandedChannelType(isExpanded ? null : ch.type)}
                              style={{
                                ...S.configItem,
                                cursor: "pointer",
                                borderColor: isExpanded ? ch.color : "#e5e7eb",
                                borderWidth: isExpanded ? 2 : 1,
                                background: isExpanded ? `${ch.color}08` : "#f9fafb",
                                transition: "all 0.15s",
                              }}
                            >
                              {/* Channel name + color dot + short code */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{ch.label}</span>
                                <span style={{
                                  fontSize: 9, fontWeight: 700, letterSpacing: 0.5, padding: "2px 6px", borderRadius: 4,
                                  background: `${ch.color}18`, color: ch.color, marginLeft: "auto",
                                }}>{ch.shortCode}</span>
                              </div>
                              {/* Materials + Responses counts */}
                              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10 }}>
                                {ch.materialCount} material{ch.materialCount !== 1 ? "e" : ""} · {ch.totalResponses} raspunsuri
                              </div>
                              {/* RIFC scores row */}
                              {ch.totalResponses > 0 ? (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "baseline" }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>R:{ch.avg_r}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#D97706" }}>I:{ch.avg_i}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>F:{ch.avg_f}</span>
                                  <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>C<sub style={{ fontSize: 8 }}>f</sub>:{ch.avg_c}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>C<sub style={{ fontSize: 8 }}>p</sub>:{ch.avg_c_score}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>CTA:{ch.avg_cta}</span>
                                </div>
                              ) : (
                                <div style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Fara date inca</div>
                              )}
                              {/* Expand indicator */}
                              <div style={{ marginTop: 8, textAlign: "center" as const }}>
                                {isExpanded
                                  ? <ChevronUp size={14} style={{ color: ch.color }} />
                                  : <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded channel detail — compact materials table */}
                      {expandedChannelType && (() => {
                        const ch = channelData.find(c => c.type === expandedChannelType);
                        if (!ch) return null;
                        return (
                          <div style={{
                            marginTop: 16,
                            border: `2px solid ${ch.color}40`,
                            borderRadius: 10,
                            background: "#fff",
                            overflow: "auto",
                          }}>
                            {/* Header */}
                            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: ch.color }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{ch.label}</span>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>— {ch.materialCount} materiale · {ch.totalResponses} raspunsuri</span>
                            </div>
                            {/* Compact table */}
                            <table style={{ width: "100%", borderCollapse: "collapse" as const, minWidth: 700 }}>
                              <thead>
                                <tr style={{ background: "#f9fafb" }}>
                                  <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 160 }}>MATERIAL</th>
                                  <th style={thStyle}>N</th>
                                  <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                                  <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                                  <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                                  <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>C<sub style={{ fontSize: 8 }}>form</sub></th>
                                  <th style={{ ...thStyle, color: "#059669" }}>C<sub style={{ fontSize: 8 }}>perc</sub></th>
                                  <th style={{ ...thStyle, color: "#2563EB" }}>CTA</th>
                                  <th style={thStyle}>SD</th>
                                  <th style={thStyle}>T(s)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ch.items.map((s: StimulusResult) => (
                                  <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                    <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 600, color: "#111827", fontSize: 13 }}>
                                      {s.name}
                                      {/* variant badge removed */}
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: 600 }}>{s.response_count}</td>
                                    <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_r : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_i : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_f : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#111827", fontWeight: 800, fontSize: 15 }}>{s.response_count > 0 ? s.avg_c : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#059669", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_c_score : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_cta : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#9CA3AF" }}>{s.response_count > 0 ? s.sd_c : "\u2014"}</td>
                                    <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 11 }}>{s.avg_time ? `${s.avg_time}s` : "\u2014"}</td>
                                  </tr>
                                ))}
                                {/* Channel total row */}
                                <tr style={{ borderTop: "2px solid #e5e7eb", background: "#f9fafb" }}>
                                  <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 800, color: "#111827", fontSize: 13 }}>MEDIE CANAL</td>
                                  <td style={{ ...tdStyle, fontWeight: 700 }}>{ch.totalResponses}</td>
                                  <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 800 }}>{ch.avg_r}</td>
                                  <td style={{ ...tdStyle, color: "#D97706", fontWeight: 800 }}>{ch.avg_i}</td>
                                  <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 800 }}>{ch.avg_f}</td>
                                  <td style={{ ...tdStyle, color: "#111827", fontWeight: 900, fontSize: 15 }}>{ch.avg_c}</td>
                                  <td style={{ ...tdStyle, color: "#059669", fontWeight: 800 }}>{ch.avg_c_score}</td>
                                  <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 800 }}>{ch.avg_cta}</td>
                                  <td style={{ ...tdStyle, color: "#9CA3AF" }}></td>
                                  <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 11 }}>{ch.avg_time ? `${ch.avg_time}s` : ""}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}

                {/* ── SUB-TAB: INDUSTRII ── */}
                {resultsSubTab === "industrii" && (() => {
                  // Group stimuliResults by industry
                  const byIndustry: Record<string, StimulusResult[]> = {};
                  results.stimuliResults.forEach(s => {
                    const ind = s.industry || "Neatribuit";
                    if (!byIndustry[ind]) byIndustry[ind] = [];
                    byIndustry[ind].push(s);
                  });

                  // Deterministic color palette for industries
                  const INDUSTRY_COLORS = [
                    "#2563EB", "#DC2626", "#059669", "#D97706", "#7C3AED",
                    "#EC4899", "#0D9488", "#EA580C", "#4F46E5", "#CA8A04",
                    "#0891B2", "#BE123C", "#16A34A", "#9333EA", "#C2410C",
                    "#0E7490", "#DB2777", "#65A30D", "#6D28D9", "#B45309",
                  ];

                  // Build industry aggregates sorted by total responses (descending)
                  type IndustryAgg = {
                    industry: string;
                    color: string;
                    materialCount: number;
                    materialsWithData: number;
                    totalResponses: number;
                    avg_r: number; avg_i: number; avg_f: number; avg_c: number;
                    avg_c_score: number; avg_cta: number; avg_time: number;
                    items: StimulusResult[];
                    channels: string[];
                  };

                  const industryKeys = Object.keys(byIndustry).sort((a, b) => {
                    // "Neatribuit" last, then by response count desc
                    if (a === "Neatribuit") return 1;
                    if (b === "Neatribuit") return -1;
                    const aResp = byIndustry[a].reduce((s, x) => s + x.response_count, 0);
                    const bResp = byIndustry[b].reduce((s, x) => s + x.response_count, 0);
                    return bResp - aResp;
                  });

                  const industryData: IndustryAgg[] = industryKeys.map((ind, idx) => {
                    const items = byIndustry[ind];
                    const withData = items.filter(s => s.response_count > 0);
                    const n = withData.length || 1;
                    const uniqueChannels = Array.from(new Set(items.map(s => s.type)));
                    return {
                      industry: ind,
                      color: INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length],
                      materialCount: items.length,
                      materialsWithData: withData.length,
                      totalResponses: items.reduce((a, s) => a + s.response_count, 0),
                      avg_r: Math.round((withData.reduce((a, s) => a + s.avg_r, 0) / n) * 100) / 100,
                      avg_i: Math.round((withData.reduce((a, s) => a + s.avg_i, 0) / n) * 100) / 100,
                      avg_f: Math.round((withData.reduce((a, s) => a + s.avg_f, 0) / n) * 100) / 100,
                      avg_c: Math.round((withData.reduce((a, s) => a + s.avg_c, 0) / n) * 100) / 100,
                      avg_c_score: Math.round((withData.reduce((a, s) => a + s.avg_c_score, 0) / n) * 100) / 100,
                      avg_cta: Math.round((withData.reduce((a, s) => a + s.avg_cta, 0) / n) * 100) / 100,
                      avg_time: Math.round(withData.reduce((a, s) => a + s.avg_time, 0) / n),
                      items,
                      channels: uniqueChannels,
                    };
                  });

                  if (industryData.length === 0) {
                    return (
                      <div style={S.placeholderTab}>
                        <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                        <p style={{ color: "#6B7280", fontSize: 14 }}>Niciun raspuns inca pentru a genera totaluri per industrie.</p>
                      </div>
                    );
                  }

                  return (
                    <div>
                      {/* Industry cards grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                        {industryData.map(ind => {
                          const isExpanded = expandedIndustryType === ind.industry;
                          return (
                            <div
                              key={ind.industry}
                              onClick={() => setExpandedIndustryType(isExpanded ? null : ind.industry)}
                              style={{
                                ...S.configItem,
                                cursor: "pointer",
                                borderColor: isExpanded ? ind.color : "#e5e7eb",
                                borderWidth: isExpanded ? 2 : 1,
                                background: isExpanded ? `${ind.color}08` : "#f9fafb",
                                transition: "all 0.15s",
                              }}
                            >
                              {/* Industry name + color dot */}
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <span style={{ width: 10, height: 10, borderRadius: "50%", background: ind.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{ind.industry}</span>
                              </div>
                              {/* Materials + Responses + Channels */}
                              <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 10 }}>
                                {ind.materialCount} material{ind.materialCount !== 1 ? "e" : ""} · {ind.totalResponses} raspunsuri
                              </div>
                              {/* Channel badges */}
                              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" as const, marginBottom: 8 }}>
                                {ind.channels.map(ch => {
                                  const cat = categories.find(c => c.type === ch);
                                  return (
                                    <span key={ch} style={{
                                      fontSize: 9, fontWeight: 700, letterSpacing: 0.3, padding: "1px 5px", borderRadius: 3,
                                      background: cat ? `${cat.color}18` : "#f3f4f6",
                                      color: cat?.color || "#6B7280",
                                    }}>{cat?.short_code || ch}</span>
                                  );
                                })}
                              </div>
                              {/* RIFC scores row */}
                              {ind.totalResponses > 0 ? (
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "baseline" }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>R:{ind.avg_r}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#D97706" }}>I:{ind.avg_i}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>F:{ind.avg_f}</span>
                                  <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>C<sub style={{ fontSize: 8 }}>f</sub>:{ind.avg_c}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>C<sub style={{ fontSize: 8 }}>p</sub>:{ind.avg_c_score}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>CTA:{ind.avg_cta}</span>
                                </div>
                              ) : (
                                <div style={{ fontSize: 11, color: "#9CA3AF", fontStyle: "italic" }}>Fara date inca</div>
                              )}
                              {/* Expand indicator */}
                              <div style={{ marginTop: 8, textAlign: "center" as const }}>
                                {isExpanded
                                  ? <ChevronUp size={14} style={{ color: ind.color }} />
                                  : <ChevronDown size={14} style={{ color: "#9CA3AF" }} />
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded industry detail — materials table */}
                      {expandedIndustryType && (() => {
                        const ind = industryData.find(i => i.industry === expandedIndustryType);
                        if (!ind) return null;
                        return (
                          <div style={{
                            marginTop: 16,
                            border: `2px solid ${ind.color}40`,
                            borderRadius: 10,
                            background: "#fff",
                            overflow: "auto",
                          }}>
                            {/* Header */}
                            <div style={{ padding: "12px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: ind.color }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{ind.industry}</span>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>— {ind.materialCount} materiale · {ind.totalResponses} raspunsuri</span>
                            </div>
                            {/* Compact table */}
                            <table style={{ width: "100%", borderCollapse: "collapse" as const, minWidth: 700 }}>
                              <thead>
                                <tr style={{ background: "#f9fafb" }}>
                                  <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 160 }}>MATERIAL</th>
                                  <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 80 }}>CANAL</th>
                                  <th style={thStyle}>N</th>
                                  <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                                  <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                                  <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                                  <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>C<sub style={{ fontSize: 8 }}>form</sub></th>
                                  <th style={{ ...thStyle, color: "#059669" }}>C<sub style={{ fontSize: 8 }}>perc</sub></th>
                                  <th style={{ ...thStyle, color: "#2563EB" }}>CTA</th>
                                  <th style={thStyle}>SD</th>
                                  <th style={thStyle}>T(s)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {ind.items.map((s: StimulusResult) => {
                                  const cat = categories.find(c => c.type === s.type);
                                  return (
                                    <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                      <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 600, color: "#111827", fontSize: 13 }}>
                                        {s.name}
                                      </td>
                                      <td style={{ ...tdStyle, textAlign: "left" as const }}>
                                        <span style={{
                                          fontSize: 9, fontWeight: 700, letterSpacing: 0.3, padding: "2px 6px", borderRadius: 4,
                                          background: cat ? `${cat.color}18` : "#f3f4f6",
                                          color: cat?.color || "#6B7280",
                                        }}>{cat?.short_code || s.type}</span>
                                      </td>
                                      <td style={{ ...tdStyle, fontWeight: 600 }}>{s.response_count}</td>
                                      <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_r : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_i : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_f : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#111827", fontWeight: 800, fontSize: 15 }}>{s.response_count > 0 ? s.avg_c : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#059669", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_c_score : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 600 }}>{s.response_count > 0 ? s.avg_cta : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#9CA3AF" }}>{s.response_count > 0 ? s.sd_c : "\u2014"}</td>
                                      <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 11 }}>{s.avg_time ? `${s.avg_time}s` : "\u2014"}</td>
                                    </tr>
                                  );
                                })}
                                {/* Industry total row */}
                                <tr style={{ borderTop: "2px solid #e5e7eb", background: "#f9fafb" }}>
                                  <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 800, color: "#111827", fontSize: 13 }}>MEDIE INDUSTRIE</td>
                                  <td style={tdStyle}></td>
                                  <td style={{ ...tdStyle, fontWeight: 700 }}>{ind.totalResponses}</td>
                                  <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 800 }}>{ind.avg_r}</td>
                                  <td style={{ ...tdStyle, color: "#D97706", fontWeight: 800 }}>{ind.avg_i}</td>
                                  <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 800 }}>{ind.avg_f}</td>
                                  <td style={{ ...tdStyle, color: "#111827", fontWeight: 900, fontSize: 15 }}>{ind.avg_c}</td>
                                  <td style={{ ...tdStyle, color: "#059669", fontWeight: 800 }}>{ind.avg_c_score}</td>
                                  <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 800 }}>{ind.avg_cta}</td>
                                  <td style={{ ...tdStyle, color: "#9CA3AF" }}></td>
                                  <td style={{ ...tdStyle, color: "#9CA3AF", fontSize: 11 }}>{ind.avg_time ? `${ind.avg_time}s` : ""}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
          );
        })()}

        {activeTab === "distributie" && (
          <div>
            {/* Header + Add button */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Distributie Sondaj</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                  Creeaza link-uri unice pentru a distribui sondajul pe segmente de audienta.
                </p>
              </div>
              <button
                style={S.addCatBtn}
                onClick={() => setShowAddDist(true)}
              >
                <Plus size={16} />
                ADAUGA LINK
              </button>
            </div>

            {/* ═══ KPI Cards ═══ */}
            {(() => {
              const TARGET = 10000;
              // Sum completions from all distribution links
              const distCompletions = distributions.reduce((sum, d) => sum + (d.completions || 0), 0);
              // Get general link completions from globalStats
              const generalCompleted = globalStats?.perDist?.find((d: any) => d.id === "__none__")?.completed || 0;
              const totalCompleted = distCompletions + generalCompleted;
              // Also check globalStats.completed if available (more reliable)
              const kpiCompleted = globalStats ? globalStats.completed : totalCompleted;
              const kpiRemaining = Math.max(TARGET - kpiCompleted, 0);
              const kpiPct = TARGET > 0 ? Math.min(Math.round((kpiCompleted / TARGET) * 100), 100) : 0;
              const pctColor = kpiPct >= 100 ? "#10b981" : kpiPct >= 50 ? "#f59e0b" : "#DC2626";

              return (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
                  {/* Card 1 — Total completat */}
                  <div style={{
                    background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
                    borderRadius: 16,
                    padding: "24px 20px",
                    position: "relative" as const,
                    overflow: "hidden",
                    border: "1px solid #1e293b",
                  }}>
                    <div style={{ position: "absolute" as const, top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(16,185,129,0.08)" }} />
                    <div style={{ position: "relative" as const, zIndex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <UserCheck size={14} style={{ color: "#10b981" }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", textTransform: "uppercase" as const }}>Completari totale</span>
                        </div>
                        <div style={{
                          background: "rgba(16,185,129,0.15)",
                          borderRadius: 8,
                          padding: "4px 8px",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#6B7280",
                          fontFamily: "JetBrains Mono, monospace",
                        }}>
                          KPI {TARGET.toLocaleString("ro-RO")}
                        </div>
                      </div>
                      <div style={{ fontSize: 56, fontWeight: 900, color: "#10b981", fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 4 }}>
                        {kpiCompleted.toLocaleString("ro-RO")}
                      </div>
                      <div style={{ fontSize: 12, color: "#4B5563" }}>
                        din toate sursele de distributie
                      </div>
                    </div>
                  </div>

                  {/* Card 2 — Ramas de completat */}
                  <div style={{
                    background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
                    borderRadius: 16,
                    padding: "24px 20px",
                    position: "relative" as const,
                    overflow: "hidden",
                    border: "1px solid #1e293b",
                  }}>
                    <div style={{ position: "absolute" as const, top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(245,158,11,0.08)" }} />
                    <div style={{ position: "relative" as const, zIndex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Target size={14} style={{ color: "#f59e0b" }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", textTransform: "uppercase" as const }}>Mai trebuie</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 56, fontWeight: 900, color: kpiRemaining === 0 ? "#10b981" : "#f59e0b", fontFamily: "JetBrains Mono, monospace", lineHeight: 1, marginBottom: 4 }}>
                        {kpiRemaining.toLocaleString("ro-RO")}
                      </div>
                      <div style={{ fontSize: 12, color: "#4B5563" }}>
                        {kpiRemaining > 0
                          ? `respondenti pana la KPI de ${TARGET.toLocaleString("ro-RO")}`
                          : "Obiectivul KPI a fost atins!"}
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Procent indeplinire */}
                  <div style={{
                    background: "linear-gradient(135deg, #111827 0%, #1e293b 100%)",
                    borderRadius: 16,
                    padding: "24px 20px",
                    position: "relative" as const,
                    overflow: "hidden",
                    border: "1px solid #1e293b",
                  }}>
                    <div style={{ position: "absolute" as const, top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${pctColor}14` }} />
                    <div style={{ position: "relative" as const, zIndex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <TrendingUp size={14} style={{ color: pctColor }} />
                          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", textTransform: "uppercase" as const }}>Indeplinire KPI</span>
                        </div>
                        {kpiPct >= 100 && (
                          <Trophy size={18} style={{ color: "#10b981" }} />
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 56, fontWeight: 900, color: pctColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                          {kpiPct}
                        </span>
                        <span style={{ fontSize: 24, fontWeight: 700, color: pctColor, fontFamily: "JetBrains Mono, monospace" }}>%</span>
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ width: "100%", height: 6, background: "#1e293b", borderRadius: 4, overflow: "hidden", border: "1px solid #334155" }}>
                          <div style={{
                            height: "100%",
                            width: `${kpiPct}%`,
                            background: kpiPct >= 100 ? "linear-gradient(90deg, #10b981, #34d399)" : kpiPct >= 50 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #DC2626, #ef4444)",
                            borderRadius: 4,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Public link card */}
            <div style={{ ...S.configCard, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <Globe size={16} style={{ color: "#DC2626" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6B7280" }}>LINK PUBLIC GENERAL</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                <code style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: "JetBrains Mono, monospace",
                  color: "#DC2626",
                  wordBreak: "break-all" as const,
                }}>
                  {baseUrl}/articolstiintific/sondaj/wizard
                </code>
                <button
                  style={{ ...S.galleryEditBtn, gap: 6 }}
                  onClick={() => copyToClipboard(`${baseUrl}/articolstiintific/sondaj/wizard`, "general")}
                >
                  {copiedId === "general" ? <Check size={14} style={{ color: "#059669" }} /> : <Copy size={14} />}
                  {copiedId === "general" ? "Copiat!" : "Copiaza"}
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>
                Acest link duce la sondaj fara segment de distributie (rezultatele apar doar in GENERAL).
              </p>
            </div>

            {/* Add distribution form */}
            {showAddDist && (
              <div style={{ ...S.configCard, borderColor: "#DC2626", borderWidth: 2, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Plus size={16} style={{ color: "#DC2626" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#DC2626" }}>LINK NOU DE DISTRIBUTIE</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={S.configLabel}>NUME SEGMENT *</label>
                    <input
                      value={newDistName}
                      onChange={(e) => setNewDistName(e.target.value)}
                      placeholder="ex: Grupa 2A 2026B"
                      style={{ ...S.catEditInput, width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={S.configLabel}>TAG UNIC (URL) *</label>
                    <input
                      value={newDistTag}
                      onChange={(e) => setNewDistTag(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                      placeholder="ex: grupa-2a-2026b"
                      style={{ ...S.catEditInput, width: "100%", fontFamily: "JetBrains Mono, monospace" }}
                    />
                  </div>
                  <div>
                    <label style={S.configLabel}>DESCRIERE</label>
                    <input
                      value={newDistDesc}
                      onChange={(e) => setNewDistDesc(e.target.value)}
                      placeholder="ex: Studenti anul 2, semestrul B"
                      style={{ ...S.catEditInput, width: "100%" }}
                    />
                  </div>
                  <div>
                    <label style={S.configLabel}>ESTIMARE PERSOANE</label>
                    <input
                      type="number"
                      value={newDistEstimate}
                      onChange={(e) => setNewDistEstimate(e.target.value)}
                      placeholder="ex: 100"
                      style={{ ...S.catEditInput, width: "100%" }}
                    />
                  </div>
                </div>
                {newDistTag && (
                  <div style={{ padding: "8px 12px", background: "#fef2f2", borderRadius: 6, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: "#6B7280" }}>Link generat: </span>
                    <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#DC2626" }}>
                      {getDistLink(newDistTag.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""))}
                    </span>
                  </div>
                )}
                {distError && (
                  <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 12 }}>{distError}</p>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{ ...S.addCatBtn, opacity: distSaving ? 0.6 : 1 }}
                    onClick={addDistribution}
                    disabled={distSaving}
                  >
                    {distSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    {distSaving ? "Se salveaza..." : "Salveaza"}
                  </button>
                  <button
                    style={{ ...S.galleryEditBtn }}
                    onClick={() => { setShowAddDist(false); setDistError(null); }}
                  >
                    <X size={14} />
                    Anuleaza
                  </button>
                </div>
              </div>
            )}

            {/* Distribution list */}
            {distLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: 8 }}>Se incarca...</p>
              </div>
            ) : distributions.length === 0 ? (
              <div style={S.placeholderTab}>
                <Share2 size={48} style={{ color: "#d1d5db" }} />
                <h3 style={{ fontSize: 18, color: "#374151", marginTop: 16 }}>Nicio distributie creata</h3>
                <p style={{ color: "#6B7280", fontSize: 14 }}>
                  Apasa &quot;Adauga Link&quot; pentru a crea primul segment de distributie.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 16 }}>
                {distributions.map((dist, idx) => {
                  const link = getDistLink(dist.tag);
                  const pct = dist.estimated_completions > 0
                    ? Math.min(100, Math.round((dist.completions / dist.estimated_completions) * 100))
                    : 0;
                  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
                  const isEditing = editingDistId === dist.id;

                  return (
                    <div key={dist.id} style={{ ...S.configCard, position: "relative" as const, ...(isEditing ? { borderColor: "#3b82f6", borderWidth: 2 } : {}) }}>
                      {/* Number badge */}
                      <div style={{
                        position: "absolute" as const,
                        top: -10,
                        left: 16,
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 800,
                        color: "#fff",
                        background: isEditing ? "#3b82f6" : "#DC2626",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {idx + 1}
                      </div>

                      {/* Header row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4 }}>
                        <div style={{ flex: 1, marginRight: 12 }}>
                          {isEditing ? (
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 4 }}>NUME SEGMENT</label>
                                <input
                                  value={editDistName}
                                  onChange={(e) => setEditDistName(e.target.value)}
                                  style={{ ...S.catEditInput, width: "100%", fontSize: 15, fontWeight: 700 }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 4 }}>DESCRIERE</label>
                                <input
                                  value={editDistDesc}
                                  onChange={(e) => setEditDistDesc(e.target.value)}
                                  placeholder="Descriere optionala"
                                  style={{ ...S.catEditInput, width: "100%" }}
                                />
                              </div>
                              <div>
                                <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 4 }}>ESTIMARE PERSOANE</label>
                                <input
                                  type="number"
                                  value={editDistEstimate}
                                  onChange={(e) => setEditDistEstimate(e.target.value)}
                                  placeholder="ex: 100"
                                  style={{ ...S.catEditInput, width: 160 }}
                                />
                              </div>
                              <div style={{ padding: "6px 10px", background: "#fef2f2", borderRadius: 6 }}>
                                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#9CA3AF" }}>TAG (BLOCAT): </span>
                                <span style={{ fontSize: 12, fontFamily: "JetBrains Mono, monospace", color: "#9CA3AF" }}>{dist.tag}</span>
                              </div>
                              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                <button
                                  style={{ ...S.addCatBtn, opacity: editDistSaving ? 0.6 : 1 }}
                                  onClick={saveEditDist}
                                  disabled={editDistSaving}
                                >
                                  {editDistSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                                  {editDistSaving ? "Se salveaza..." : "Salveaza"}
                                </button>
                                <button
                                  style={{ ...S.galleryEditBtn }}
                                  onClick={cancelEditDist}
                                >
                                  <X size={14} />
                                  Anuleaza
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>{dist.name}</h3>
                              {dist.description && (
                                <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{dist.description}</p>
                              )}
                            </>
                          )}
                        </div>
                        {!isEditing && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              style={{ ...S.galleryEditBtn, padding: "6px 8px" }}
                              title="Editeaza distributia"
                              onClick={() => startEditDist(dist)}
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              style={{ ...S.iconBtnDanger }}
                              title="Sterge distributia"
                              onClick={() => deleteDistribution(dist.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Link row */}
                      {!isEditing && (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, flexWrap: "wrap" as const }}>
                          <code style={{
                            flex: 1,
                            padding: "8px 12px",
                            background: "#f9fafb",
                            border: "1px solid #e5e7eb",
                            borderRadius: 6,
                            fontSize: 13,
                            fontFamily: "JetBrains Mono, monospace",
                            color: "#DC2626",
                            wordBreak: "break-all" as const,
                            minWidth: 0,
                          }}>
                            {link}
                          </code>
                          <button
                            style={{ ...S.galleryEditBtn, gap: 6 }}
                            onClick={() => copyToClipboard(link, dist.id)}
                          >
                            {copiedId === dist.id ? <Check size={14} style={{ color: "#059669" }} /> : <Copy size={14} />}
                            {copiedId === dist.id ? "Copiat!" : "Copiaza"}
                          </button>
                          <button
                            style={{ ...S.galleryEditBtn, gap: 6 }}
                            onClick={() => setShowQr(showQr === dist.id ? null : dist.id)}
                          >
                            <QrCode size={14} />
                            QR
                          </button>
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ ...S.galleryEditBtn, gap: 6, textDecoration: "none" }}
                          >
                            <ExternalLink size={14} />
                            Deschide
                          </a>
                        </div>
                      )}

                      {/* QR code (collapsible) */}
                      {showQr === dist.id && !isEditing && (
                        <div style={{
                          marginTop: 12,
                          padding: 16,
                          background: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: 8,
                          textAlign: "center" as const,
                        }}>
                          <img
                            src={qrUrl}
                            alt={`QR Code ${dist.name}`}
                            width={200}
                            height={200}
                            style={{ margin: "0 auto", borderRadius: 4 }}
                          />
                          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 8 }}>
                            Scaneaza sau salveaza (click dreapta &rarr; Save Image)
                          </p>
                        </div>
                      )}

                      {/* Stats row */}
                      <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" as const }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Users size={14} style={{ color: "#6B7280" }} />
                          <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                            {dist.completions}
                          </span>
                          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                            / {dist.estimated_completions} completari
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                            {dist.started} incepute
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", fontFamily: "JetBrains Mono, monospace" }}>
                            TAG: {dist.tag}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {dist.estimated_completions > 0 && (
                        <div style={{ marginTop: 10 }}>
                          <div style={S.counterBar}>
                            <div style={{
                              ...S.counterFill,
                              width: `${pct}%`,
                              background: pct >= 100 ? "#059669" : "#DC2626",
                            }} />
                          </div>
                          <span style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, display: "block" }}>
                            {pct}% completat
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ PANEL EXPERTI (Layer 1) — Redesigned ═══ */}
        {activeTab === "experti" && (
          <div>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Panel Experti (Stratul 1)</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                  Fiecare expert primeste un link unic, evalueaza R, I, F, C, CTA + recunoastere brand cu justificari.
                </p>
              </div>
              <button style={{ ...S.addCatBtn, background: "#059669" }} onClick={() => setShowAddExpert(true)}>
                <Plus size={16} />
                ADAUGA EXPERT
              </button>
            </div>

            {/* Add/Edit expert form */}
            {showAddExpert && (
              <div style={{ ...S.configCard, borderColor: "#059669", borderWidth: 2, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <UserCheck size={16} style={{ color: "#059669" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#059669" }}>{editingExpertId ? "EDITARE EXPERT" : "EXPERT NOU"}</span>
                </div>
                {/* Row 1: Prenume + Nume */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={S.configLabel}>PRENUME *</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.first_name} onChange={(e) => setExpertForm({ ...expertForm, first_name: e.target.value })} placeholder="Prenume" />
                  </div>
                  <div>
                    <label style={S.configLabel}>NUME *</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.last_name} onChange={(e) => setExpertForm({ ...expertForm, last_name: e.target.value })} placeholder="Nume" />
                  </div>
                </div>
                {/* Row 2: Email + Telefon + Poza */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={S.configLabel}>EMAIL</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.email} onChange={(e) => setExpertForm({ ...expertForm, email: e.target.value })} placeholder="expert@email.com" type="email" />
                  </div>
                  <div>
                    <label style={S.configLabel}>TELEFON</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.phone} onChange={(e) => setExpertForm({ ...expertForm, phone: e.target.value })} placeholder="+373..." />
                  </div>
                  <div>
                    <label style={S.configLabel}>POZA (URL)</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.photo_url} onChange={(e) => setExpertForm({ ...expertForm, photo_url: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                {/* Row 3: Experienta + Buget */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={S.configLabel}>EXPERIENTA (ANI)</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.experience_years} onChange={(e) => setExpertForm({ ...expertForm, experience_years: e.target.value })} placeholder="ex: 10" type="number" min="0" />
                  </div>
                  <div>
                    <label style={S.configLabel}>BUGET TOTAL ADMINISTRAT (EUR)</label>
                    <input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.total_budget_managed} onChange={(e) => setExpertForm({ ...expertForm, total_budget_managed: e.target.value })} placeholder="ex: 500000" type="number" min="0" />
                  </div>
                </div>
                {/* Row 4: Branduri (tag input) */}
                <div style={{ marginBottom: 12 }}>
                  <label style={S.configLabel}>BRANDURI CU CARE A LUCRAT</label>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 6 }}>
                    {expertForm.brands_worked.map((tag, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12, background: "#dbeafe", color: "#2563EB", border: "1px solid #93c5fd" }}>
                        {tag}
                        <X size={10} style={{ cursor: "pointer" }} onClick={() => setExpertForm({ ...expertForm, brands_worked: expertForm.brands_worked.filter((_, j) => j !== i) })} />
                      </span>
                    ))}
                  </div>
                  <input
                    style={{ ...S.catEditInput, width: "100%" }}
                    placeholder="Scrie un brand si apasa Enter..."
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && (e.target as HTMLInputElement).value.trim()) {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim().replace(/,$/,"");
                        if (val && !expertForm.brands_worked.includes(val)) {
                          setExpertForm({ ...expertForm, brands_worked: [...expertForm.brands_worked, val] });
                        }
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
                {/* Row 5: Functii marketing (tag input) */}
                <div style={{ marginBottom: 12 }}>
                  <label style={S.configLabel}>FUNCTII DE MARKETING DETINUTE</label>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 6 }}>
                    {expertForm.marketing_roles.map((tag, i) => (
                      <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 12, background: "#fef3c7", color: "#D97706", border: "1px solid #fcd34d" }}>
                        {tag}
                        <X size={10} style={{ cursor: "pointer" }} onClick={() => setExpertForm({ ...expertForm, marketing_roles: expertForm.marketing_roles.filter((_, j) => j !== i) })} />
                      </span>
                    ))}
                  </div>
                  <input
                    style={{ ...S.catEditInput, width: "100%" }}
                    placeholder="Scrie o functie si apasa Enter..."
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === ",") && (e.target as HTMLInputElement).value.trim()) {
                        e.preventDefault();
                        const val = (e.target as HTMLInputElement).value.trim().replace(/,$/,"");
                        if (val && !expertForm.marketing_roles.includes(val)) {
                          setExpertForm({ ...expertForm, marketing_roles: [...expertForm.marketing_roles, val] });
                        }
                        (e.target as HTMLInputElement).value = "";
                      }
                    }}
                  />
                </div>
                {/* Buttons */}
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...S.addCatBtn, background: "#059669", opacity: expertSaving ? 0.6 : 1 }} onClick={saveExpert} disabled={expertSaving}>
                    {expertSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    {expertSaving ? "Se salveaza..." : editingExpertId ? "Salveaza modificarile" : "Salveaza & Genereaza link"}
                  </button>
                  <button style={S.galleryEditBtn} onClick={() => { setShowAddExpert(false); setEditingExpertId(null); setExpertForm(defaultExpertForm); }}><X size={14} /> Anuleaza</button>
                </div>
              </div>
            )}

            {expertLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /></div>
            ) : experts.length === 0 ? (
              <div style={S.placeholderTab}>
                <UserCheck size={48} style={{ color: "#d1d5db" }} />
                <h3 style={{ fontSize: 18, color: "#374151", marginTop: 16 }}>Niciun expert inregistrat</h3>
                <p style={{ color: "#6B7280", fontSize: 14 }}>Apasa &quot;Adauga Expert&quot; pentru a crea un profil si genera un link unic de evaluare.</p>
              </div>
            ) : (
              <>
                {/* Expert cards grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                  {experts.map((exp) => {
                    const evalsCount = expertEvals.filter((e) => e.expert_id === exp.id).length;
                    const totalStimuli = stimuli.filter((s) => s.is_active).length;
                    const isSelected = selectedExpertId === exp.id;
                    const initials = `${exp.first_name[0] || ""}${exp.last_name[0] || ""}`.toUpperCase();
                    return (
                      <div
                        key={exp.id}
                        onClick={() => setSelectedExpertId(isSelected ? null : exp.id)}
                        style={{
                          ...S.configCard,
                          cursor: "pointer",
                          borderColor: isSelected ? "#059669" : exp.is_active ? "#e5e7eb" : "#fca5a5",
                          borderWidth: isSelected ? 2 : 1,
                          background: isSelected ? "#f0fdf4" : exp.is_active ? "#fff" : "#fef2f2",
                          transition: "all 0.15s",
                          padding: "16px 20px",
                          position: "relative" as const,
                        }}
                      >
                        {/* Status indicator */}
                        <div style={{ position: "absolute" as const, top: 12, right: 12, display: "flex", gap: 6, alignItems: "center" }}>
                          {!exp.is_active && (
                            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#DC2626", background: "#fef2f2", border: "1px solid #fca5a5", padding: "2px 8px", borderRadius: 10 }}>REVOCAT</span>
                          )}
                          <span style={{
                            width: 8, height: 8, borderRadius: "50%",
                            background: exp.is_active ? "#059669" : "#DC2626",
                          }} />
                        </div>

                        {/* Expert info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                          {exp.photo_url ? (
                            <img src={exp.photo_url} alt={exp.first_name} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: "2px solid #e5e7eb" }} />
                          ) : (
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: exp.is_active ? "linear-gradient(135deg, #059669, #047857)" : "#d1d5db", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700 }}>
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{exp.first_name} {exp.last_name}</div>
                            <div style={{ display: "flex", gap: 12, marginTop: 2 }}>
                              {exp.email && <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}><Mail size={10} /> {exp.email}</span>}
                              {exp.phone && <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}><Phone size={10} /> {exp.phone}</span>}
                            </div>
                          </div>
                        </div>

                        {/* Progress */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontSize: 11, color: "#6B7280" }}>Progres evaluare</span>
                          <span style={{ fontSize: 11, fontWeight: 700, color: evalsCount === totalStimuli ? "#059669" : "#D97706" }}>
                            {evalsCount} / {totalStimuli}
                          </span>
                        </div>
                        <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                          <div style={{ height: "100%", background: evalsCount === totalStimuli ? "#059669" : "#D97706", borderRadius: 2, width: totalStimuli > 0 ? `${(evalsCount / totalStimuli) * 100}%` : "0%", transition: "width 0.3s" }} />
                        </div>

                        {/* Professional info pills */}
                        {(exp.experience_years || (exp.brands_worked && exp.brands_worked.length > 0) || exp.total_budget_managed || (exp.marketing_roles && exp.marketing_roles.length > 0)) && (
                          <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                            {exp.experience_years && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0" }}>{exp.experience_years} ani exp.</span>}
                            {exp.total_budget_managed && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 8, background: "#fef3c7", color: "#D97706", border: "1px solid #fcd34d" }}>{Number(exp.total_budget_managed).toLocaleString("ro-RO")} EUR</span>}
                            {exp.brands_worked && exp.brands_worked.map((b, i) => (
                              <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 8, background: "#dbeafe", color: "#2563EB", border: "1px solid #93c5fd" }}>{b}</span>
                            ))}
                            {exp.marketing_roles && exp.marketing_roles.map((r, i) => (
                              <span key={i} style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 8, background: "#fce7f3", color: "#EC4899", border: "1px solid #f9a8d4" }}>{r}</span>
                            ))}
                          </div>
                        )}

                        {/* Action buttons */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }} onClick={(e) => e.stopPropagation()}>
                          <button
                            style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px" }}
                            onClick={() => {
                              setEditingExpertId(exp.id);
                              setExpertForm({
                                first_name: exp.first_name,
                                last_name: exp.last_name,
                                email: exp.email || "",
                                phone: exp.phone || "",
                                photo_url: exp.photo_url || "",
                                experience_years: exp.experience_years ? String(exp.experience_years) : "",
                                brands_worked: exp.brands_worked || [],
                                total_budget_managed: exp.total_budget_managed ? String(exp.total_budget_managed) : "",
                                marketing_roles: exp.marketing_roles || [],
                              });
                              setShowAddExpert(true);
                            }}
                            title="Editeaza expert"
                          >
                            <Pencil size={12} /> Editeaza
                          </button>
                          <button
                            style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", background: expertCopied === exp.id ? "#dcfce7" : "#f3f4f6" }}
                            onClick={() => copyExpertLink(exp)}
                            title="Copiaza link"
                          >
                            {expertCopied === exp.id ? <Check size={12} style={{ color: "#059669" }} /> : <Copy size={12} />}
                            {expertCopied === exp.id ? "Copiat!" : "Link"}
                          </button>
                          <button
                            style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px" }}
                            onClick={() => window.open(getExpertLink(exp), "_blank")}
                            title="Deschide link expert"
                          >
                            <ExternalLink size={12} /> Deschide
                          </button>
                          <button
                            style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", color: exp.is_active ? "#DC2626" : "#059669" }}
                            onClick={() => toggleExpertAccess(exp.id, exp.is_active)}
                            title={exp.is_active ? "Revoca acces" : "Restabileste acces"}
                          >
                            {exp.is_active ? <ShieldOff size={12} /> : <ShieldCheck size={12} />}
                            {exp.is_active ? "Revoca" : "Restabileste"}
                          </button>
                          <button
                            style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", color: "#DC2626" }}
                            onClick={() => deleteExpert(exp.id)}
                            title="Sterge expert"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>

                        {/* Created date */}
                        <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 8 }}>
                          Creat: {new Date(exp.created_at).toLocaleDateString("ro-RO")}
                          {exp.revoked_at && <span style={{ color: "#DC2626" }}> | Revocat: {new Date(exp.revoked_at).toLocaleDateString("ro-RO")}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Expert tabs - show evaluations for selected expert */}
                {selectedExpertId && (() => {
                  const selExp = experts.find((e) => e.id === selectedExpertId);
                  if (!selExp) return null;
                  const expEvals = expertEvals.filter((e) => e.expert_id === selectedExpertId);

                  return (
                    <div style={{ ...S.configCard, padding: 0, overflow: "hidden" }}>
                      {/* Tab header with expert name */}
                      <div style={{ background: "#f9fafb", padding: "16px 20px", borderBottom: "2px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {/* Expert name tabs */}
                          {experts.map((exp) => (
                            <button
                              key={exp.id}
                              onClick={() => setSelectedExpertId(exp.id)}
                              style={{
                                padding: "8px 16px",
                                borderRadius: 8,
                                border: "none",
                                fontSize: 13,
                                fontWeight: selectedExpertId === exp.id ? 700 : 400,
                                background: selectedExpertId === exp.id ? "#059669" : "transparent",
                                color: selectedExpertId === exp.id ? "#fff" : "#6B7280",
                                cursor: "pointer",
                                transition: "all 0.15s",
                              }}
                            >
                              {exp.first_name} {exp.last_name}
                              <span style={{
                                marginLeft: 6,
                                fontSize: 10,
                                padding: "2px 6px",
                                borderRadius: 10,
                                background: selectedExpertId === exp.id ? "rgba(255,255,255,0.3)" : "#e5e7eb",
                              }}>
                                {expertEvals.filter((e) => e.expert_id === exp.id).length}
                              </span>
                            </button>
                          ))}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280" }}>EVALUARI EXPERT</span>
                      </div>

                      {/* Expert evaluations view (read-only) */}
                      <div style={{ padding: 20 }}>
                        {expEvals.length === 0 ? (
                          <div style={{ textAlign: "center", padding: 32, color: "#9CA3AF" }}>
                            <UserCheck size={32} style={{ color: "#d1d5db" }} />
                            <p style={{ marginTop: 8, fontSize: 13 }}>Expertul nu a completat nicio evaluare inca.</p>
                            <p style={{ fontSize: 12, color: "#d1d5db" }}>Transmiteti-i link-ul de evaluare.</p>
                          </div>
                        ) : (
                          <div style={{ display: "grid", gap: 16 }}>
                            {stimuli.filter((s) => s.is_active).map((stim) => {
                              const ev = expEvals.find((e) => e.stimulus_id === stim.id);
                              if (!ev) return (
                                <div key={stim.id} style={{ padding: "12px 16px", background: "#fafafa", borderRadius: 8, border: "1px dashed #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontSize: 13, color: "#9CA3AF" }}>{stim.name} ({stim.type})</span>
                                  <span style={{ fontSize: 10, color: "#d1d5db", fontWeight: 600 }}>NEEVALUAT</span>
                                </div>
                              );

                              const cCalc = ev.r_score + (ev.i_score * ev.f_score);
                              return (
                                <div key={stim.id} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                                  {/* Material header */}
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                                    <div>
                                      <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{stim.name}</span>
                                      <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 8 }}>{stim.type}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                      <span style={{ fontSize: 10, color: "#9CA3AF" }}>{new Date(ev.evaluated_at).toLocaleDateString("ro-RO")}</span>
                                    </div>
                                  </div>

                                  <div style={{ padding: "16px" }}>
                                    {/* Score pills */}
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 16 }}>
                                      {[
                                        { label: "R", score: ev.r_score, color: "#DC2626" },
                                        { label: "I", score: ev.i_score, color: "#D97706" },
                                        { label: "F", score: ev.f_score, color: "#7C3AED" },
                                        { label: "C", score: ev.c_score, color: "#2563EB" },
                                        { label: "CTA", score: ev.cta_score, color: "#059669" },
                                      ].map(({ label, score, color }) => (
                                        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: `${color}10`, border: `1px solid ${color}30` }}>
                                          <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: 0.5 }}>{label}</span>
                                          <span style={{ fontSize: 18, fontWeight: 800, color }}>{score ?? "—"}</span>
                                        </div>
                                      ))}
                                      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, background: "#111827", color: "#fff" }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>C=R+(IxF)</span>
                                        <span style={{ fontSize: 18, fontWeight: 800 }}>{cCalc}</span>
                                      </div>
                                    </div>

                                    {/* Brand familiarity */}
                                    {ev.brand_familiar !== null && ev.brand_familiar !== undefined && (
                                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "8px 12px", borderRadius: 8, background: ev.brand_familiar ? "#f0fdf4" : "#fef2f2", border: `1px solid ${ev.brand_familiar ? "#bbf7d0" : "#fecaca"}` }}>
                                        <span style={{ fontSize: 10, fontWeight: 700, color: ev.brand_familiar ? "#059669" : "#DC2626" }}>BRAND:</span>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: ev.brand_familiar ? "#059669" : "#DC2626" }}>
                                          {ev.brand_familiar ? "Recunosc" : "Nu recunosc"}
                                        </span>
                                        {ev.brand_justification && <span style={{ fontSize: 11, color: "#6B7280", marginLeft: 8 }}>— {ev.brand_justification}</span>}
                                      </div>
                                    )}

                                    {/* Justifications */}
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                      {[
                                        { label: "R", text: ev.r_justification, color: "#DC2626" },
                                        { label: "I", text: ev.i_justification, color: "#D97706" },
                                        { label: "F", text: ev.f_justification, color: "#7C3AED" },
                                        { label: "C", text: ev.c_justification, color: "#2563EB" },
                                        { label: "CTA", text: ev.cta_justification, color: "#059669" },
                                      ].filter(({ text }) => text).map(({ label, text, color }) => (
                                        <div key={label} style={{ padding: "8px 10px", background: "#fafafa", borderRadius: 6, borderLeft: `3px solid ${color}` }}>
                                          <div style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: 1, marginBottom: 4 }}>JUSTIFICARE {label}</div>
                                          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.4 }}>{text}</div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Notes */}
                                    {ev.notes && (
                                      <div style={{ marginTop: 10, padding: "8px 12px", background: "#fffbeb", borderRadius: 6, border: "1px solid #fde68a" }}>
                                        <div style={{ fontSize: 9, fontWeight: 700, color: "#92400e", letterSpacing: 1, marginBottom: 4 }}>NOTE SUPLIMENTARE</div>
                                        <div style={{ fontSize: 12, color: "#78350f", lineHeight: 1.4 }}>{ev.notes}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* Summary by channel (all experts combined) — shows ALL channels */}
                {(() => {
                  // Build stim lookup: stimulus_id → stimulus record
                  const stimMap = new Map(stimuli.filter(s => s.is_active).map(s => [s.id, s]));
                  // Group evaluations by channel type
                  const evalsByChannel: Record<string, { evals: ExpertEvaluation[]; stimNames: Set<string> }> = {};
                  for (const ev of expertEvals) {
                    const stim = stimMap.get(ev.stimulus_id);
                    if (!stim) continue;
                    if (!evalsByChannel[stim.type]) evalsByChannel[stim.type] = { evals: [], stimNames: new Set() };
                    evalsByChannel[stim.type].evals.push(ev);
                    evalsByChannel[stim.type].stimNames.add(stim.name);
                  }

                  // Show ALL channels sorted by display_order (not just those with evals)
                  const channelEntries = [...categories]
                    .sort((a, b) => a.display_order - b.display_order);

                  if (channelEntries.length === 0) return null;

                  return (
                    <div style={{ ...S.configCard, marginTop: 20 }}>
                      <div style={S.configHeader}>
                        <Settings size={16} style={{ color: "#6B7280" }} />
                        <span style={S.configTitle}>VIZIUNEA EXPERTILOR PER CANAL</span>
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "-4px 0 12px", lineHeight: 1.4 }}>
                        Datele din acest bloc sumarizeaza evaluarile tuturor expertilor, grupate pe canal. Canalele fara evaluari apar cu valori zero.
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                        {channelEntries.map(cat => {
                          const chData = evalsByChannel[cat.type];
                          const chEvals = chData ? chData.evals : [];
                          const stimNames = chData ? chData.stimNames : new Set<string>();
                          const n = chEvals.length;
                          const hasData = n > 0;
                          const avgR = hasData ? (chEvals.reduce((s, e) => s + e.r_score, 0) / n).toFixed(1) : "0";
                          const avgI = hasData ? (chEvals.reduce((s, e) => s + e.i_score, 0) / n).toFixed(1) : "0";
                          const avgF = hasData ? (chEvals.reduce((s, e) => s + e.f_score, 0) / n).toFixed(1) : "0";
                          const cVals = chEvals.filter(e => e.c_score != null);
                          const avgC = hasData ? (cVals.length > 0 ? (cVals.reduce((s, e) => s + (e.c_score || 0), 0) / cVals.length).toFixed(1) : "\u2014") : "0";
                          const ctaVals = chEvals.filter(e => e.cta_score != null);
                          const avgCta = hasData ? (ctaVals.length > 0 ? (ctaVals.reduce((s, e) => s + (e.cta_score || 0), 0) / ctaVals.length).toFixed(1) : "\u2014") : "0";
                          const avgCalc = hasData ? (chEvals.reduce((s, e) => s + e.r_score + (e.i_score * e.f_score), 0) / n).toFixed(0) : "0";
                          const isExpCh = expandedExpertChannelType === cat.type;
                          const matCount = stimuli.filter(s => s.is_active && s.type === cat.type).length;

                          return (
                            <div key={cat.type}>
                              <div
                                onClick={() => hasData ? setExpandedExpertChannelType(isExpCh ? null : cat.type) : null}
                                style={{
                                  ...S.configItem,
                                  cursor: hasData ? "pointer" : "default",
                                  borderColor: isExpCh ? cat.color : "#e5e7eb",
                                  borderWidth: isExpCh ? 2 : 1,
                                  background: isExpCh ? `${cat.color}08` : hasData ? "#f9fafb" : "#fafafa",
                                  transition: "all 0.15s",
                                }}
                              >
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{cat.label}</span>
                                  <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${cat.color}18`, color: cat.color, marginLeft: "auto" }}>{cat.short_code}</span>
                                </div>
                                <span style={{ fontSize: 10, color: "#9CA3AF", display: "block", marginBottom: 8 }}>
                                  {hasData ? `${n} evaluari · ${stimNames.size} materiale evaluate · ${new Set(chEvals.map(e => e.expert_id)).size} experti` : `${matCount} materiale · neevaluat`}
                                </span>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "baseline", opacity: hasData ? 1 : 0.35 }}>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#DC2626" }}>R:{avgR}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#D97706" }}>I:{avgI}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>F:{avgF}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#2563EB" }}>C:{avgC}</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>CTA:{avgCta}</span>
                                  <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>={avgCalc}</span>
                                </div>
                                <div style={{ marginTop: 6, textAlign: "center" as const }}>
                                  {hasData ? (isExpCh ? <ChevronUp size={14} style={{ color: cat.color }} /> : <ChevronDown size={14} style={{ color: "#9CA3AF" }} />) : null}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expanded channel detail — OUTSIDE the grid for full width */}
                      {expandedExpertChannelType && (() => {
                        const expCat = channelEntries.find(c => c.type === expandedExpertChannelType);
                        if (!expCat) return null;
                        const expChData = evalsByChannel[expCat.type];
                        const expColor = expCat.color;
                        const expMatCount = stimuli.filter(s => s.is_active && s.type === expCat.type).length;
                        return (
                          <div style={{ marginTop: 12, border: `2px solid ${expColor}40`, borderRadius: 10, overflow: "auto", background: "#fff" }}>
                            <div style={{ padding: "10px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: expColor }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{expCat.label}</span>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>— {expChData ? expChData.stimNames.size : expMatCount} materiale</span>
                            </div>
                            <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                              <thead>
                                <tr style={{ background: "#f9fafb" }}>
                                  <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 140 }}>MATERIAL</th>
                                  <th style={thStyle}>N</th>
                                  <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                                  <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                                  <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                                  <th style={{ ...thStyle, color: "#2563EB" }}>C</th>
                                  <th style={{ ...thStyle, color: "#059669" }}>CTA</th>
                                  <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>=</th>
                                </tr>
                              </thead>
                              <tbody>
                                {stimuli.filter(s => s.is_active && s.type === expCat.type).map(stim => {
                                  const sEvals = expertEvals.filter(e => e.stimulus_id === stim.id);
                                  if (sEvals.length === 0) return null;
                                  const sN = sEvals.length;
                                  const sR = (sEvals.reduce((a, e) => a + e.r_score, 0) / sN).toFixed(1);
                                  const sI = (sEvals.reduce((a, e) => a + e.i_score, 0) / sN).toFixed(1);
                                  const sF = (sEvals.reduce((a, e) => a + e.f_score, 0) / sN).toFixed(1);
                                  const sCVals = sEvals.filter(e => e.c_score != null);
                                  const sC = sCVals.length > 0 ? (sCVals.reduce((a, e) => a + (e.c_score || 0), 0) / sCVals.length).toFixed(1) : "\u2014";
                                  const sCtaVals = sEvals.filter(e => e.cta_score != null);
                                  const sCta = sCtaVals.length > 0 ? (sCtaVals.reduce((a, e) => a + (e.cta_score || 0), 0) / sCtaVals.length).toFixed(1) : "\u2014";
                                  const sCalc = (sEvals.reduce((a, e) => a + e.r_score + (e.i_score * e.f_score), 0) / sN).toFixed(0);
                                  return (
                                    <tr key={stim.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                      <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 600, fontSize: 12, color: "#111827" }}>{stim.name}</td>
                                      <td style={{ ...tdStyle, fontWeight: 600 }}>{sN}</td>
                                      <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{sR}</td>
                                      <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{sI}</td>
                                      <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{sF}</td>
                                      <td style={{ ...tdStyle, color: "#2563EB", fontWeight: 600 }}>{sC}</td>
                                      <td style={{ ...tdStyle, color: "#059669", fontWeight: 600 }}>{sCta}</td>
                                      <td style={{ ...tdStyle, color: "#111827", fontWeight: 800 }}>{sCalc}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        )}

        {/* ═══ AI BENCHMARK (Layer 3) ═══ */}
        {activeTab === "ai" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>AI Benchmark (Stratul 3)</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                  3 modele AI (Claude, Gemini, GPT) scoreaza aceleasi 30 de stimuli cu prompt-uri identice.
                </p>
              </div>
              <button style={S.addCatBtn} onClick={() => setShowAddAi(true)}>
                <Plus size={16} />
                ADAUGA EVALUARE AI
              </button>
            </div>

            {/* Add AI eval form */}
            {showAddAi && (
              <div style={{ ...S.configCard, borderColor: "#7C3AED", borderWidth: 2, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Bot size={16} style={{ color: "#7C3AED" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#7C3AED" }}>EVALUARE AI NOUA</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={S.configLabel}>MATERIAL *</label>
                    <select style={{ ...S.catEditInput, width: "100%" }} value={aiForm.stimulus_id} onChange={(e) => setAiForm({ ...aiForm, stimulus_id: e.target.value })}>
                      <option value="">Selecteaza material...</option>
                      {stimuli.filter(s => s.is_active).map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                    </select>
                  </div>
                  <div><label style={S.configLabel}>MODEL AI *</label>
                    <select style={{ ...S.catEditInput, width: "100%" }} value={aiForm.model_name} onChange={(e) => setAiForm({ ...aiForm, model_name: e.target.value })}>
                      {AI_MODELS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div><label style={S.configLabel}>VERSIUNE PROMPT</label><input style={{ ...S.catEditInput, width: "100%", fontFamily: "JetBrains Mono, monospace" }} value={aiForm.prompt_version} onChange={(e) => setAiForm({ ...aiForm, prompt_version: e.target.value })} placeholder="v1" /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ ...S.configLabel, color: "#DC2626" }}>R (RELEVANTA) *</label>
                    <input type="number" min={1} max={10} step={0.1} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#DC2626" }} value={aiForm.r_score} onChange={(e) => setAiForm({ ...aiForm, r_score: parseFloat(e.target.value) || 1 })} />
                  </div>
                  <div>
                    <label style={{ ...S.configLabel, color: "#D97706" }}>I (INTERES) *</label>
                    <input type="number" min={1} max={10} step={0.1} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#D97706" }} value={aiForm.i_score} onChange={(e) => setAiForm({ ...aiForm, i_score: parseFloat(e.target.value) || 1 })} />
                  </div>
                  <div>
                    <label style={{ ...S.configLabel, color: "#7C3AED" }}>F (FORMA) *</label>
                    <input type="number" min={1} max={10} step={0.1} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#7C3AED" }} value={aiForm.f_score} onChange={(e) => setAiForm({ ...aiForm, f_score: parseFloat(e.target.value) || 1 })} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={S.configLabel}>JUSTIFICARE AI</label><textarea style={{ ...S.catEditInput, width: "100%" }} value={aiForm.justification} onChange={(e) => setAiForm({ ...aiForm, justification: e.target.value })} placeholder="Output-ul modelului AI..." rows={3} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...S.addCatBtn, background: "#7C3AED", opacity: aiSaving ? 0.6 : 1 }} onClick={addAiEval} disabled={aiSaving}>
                    {aiSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    {aiSaving ? "Se salveaza..." : "Salveaza"}
                  </button>
                  <button style={S.galleryEditBtn} onClick={() => setShowAddAi(false)}><X size={14} /> Anuleaza</button>
                </div>
              </div>
            )}

            {/* AI evaluations table */}
            {aiLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /></div>
            ) : aiEvals.length === 0 ? (
              <div style={S.placeholderTab}>
                <Bot size={48} style={{ color: "#d1d5db" }} />
                <h3 style={{ fontSize: 18, color: "#374151", marginTop: 16 }}>Nicio evaluare AI</h3>
                <p style={{ color: "#6B7280", fontSize: 14 }}>Adauga scorurile modelelor AI (Claude, Gemini, GPT) pe fiecare material.</p>
              </div>
            ) : (
              <div style={{ ...S.configCard, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      <th style={{ ...thStyle, textAlign: "left", minWidth: 160 }}>MATERIAL</th>
                      <th style={thStyle}>MODEL</th>
                      <th style={thStyle}>PROMPT</th>
                      <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                      <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                      <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                      <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>C</th>
                      <th style={thStyle}>DATA</th>
                      <th style={thStyle}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiEvals.map((ev) => {
                      const stim = stimuli.find(s => s.id === ev.stimulus_id);
                      const modelColors: Record<string, string> = { Claude: "#D97706", Gemini: "#2563EB", GPT: "#059669" };
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, color: "#111827" }}>{stim?.name || "?"}</td>
                          <td style={tdStyle}>
                            <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: modelColors[ev.model_name] || "#6B7280", color: "#fff" }}>{ev.model_name}</span>
                          </td>
                          <td style={{ ...tdStyle, fontFamily: "JetBrains Mono, monospace", fontSize: 11 }}>{ev.prompt_version}</td>
                          <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{ev.r_score}</td>
                          <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{ev.i_score}</td>
                          <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{ev.f_score}</td>
                          <td style={{ ...tdStyle, color: "#111827", fontWeight: 800 }}>{ev.c_computed}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: "#9CA3AF" }}>{new Date(ev.evaluated_at).toLocaleDateString("ro-RO")}</td>
                          <td style={tdStyle}><button style={S.iconBtnDanger} onClick={() => deleteAiEval(ev.id)}><Trash2 size={14} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Comparison matrix: per stimulus, show all 3 models side by side */}
            {aiEvals.length > 0 && (
              <div style={{ ...S.configCard, marginTop: 20 }}>
                <div style={S.configHeader}>
                  <BarChart3 size={16} style={{ color: "#6B7280" }} />
                  <span style={S.configTitle}>COMPARATIE AI vs CONSUMATORI</span>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={{ ...thStyle, textAlign: "left" }}>MATERIAL</th>
                        {AI_MODELS.map(m => (
                          <th key={m} colSpan={4} style={{ ...thStyle, borderLeft: "2px solid #e5e7eb" }}>
                            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>{m.toUpperCase()}</span>
                          </th>
                        ))}
                      </tr>
                      <tr style={{ background: "#f9fafb" }}>
                        <th style={thStyle}></th>
                        {AI_MODELS.map(m => (
                          <React.Fragment key={m}>
                            <th style={{ ...thStyle, color: "#DC2626", borderLeft: "2px solid #e5e7eb" }}>R</th>
                            <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                            <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                            <th style={{ ...thStyle, fontWeight: 800 }}>C</th>
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {stimuli.filter(s => s.is_active).map(stim => {
                        const hasAny = aiEvals.some(e => e.stimulus_id === stim.id);
                        if (!hasAny) return null;
                        return (
                          <tr key={stim.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, fontSize: 12 }}>{stim.name}</td>
                            {AI_MODELS.map(m => {
                              const ev = aiEvals.find(e => e.stimulus_id === stim.id && e.model_name === m);
                              if (!ev) return (
                                <React.Fragment key={m}>
                                  <td style={{ ...tdStyle, borderLeft: "2px solid #f3f4f6", color: "#d1d5db" }}>—</td>
                                  <td style={{ ...tdStyle, color: "#d1d5db" }}>—</td>
                                  <td style={{ ...tdStyle, color: "#d1d5db" }}>—</td>
                                  <td style={{ ...tdStyle, color: "#d1d5db" }}>—</td>
                                </React.Fragment>
                              );
                              return (
                                <React.Fragment key={m}>
                                  <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600, borderLeft: "2px solid #f3f4f6" }}>{ev.r_score}</td>
                                  <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{ev.i_score}</td>
                                  <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{ev.f_score}</td>
                                  <td style={{ ...tdStyle, fontWeight: 800 }}>{ev.c_computed}</td>
                                </React.Fragment>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", letterSpacing: 0.5 }}>MOD PREVIEW — datele NU se salveaza in baza de date</span>
              </div>
              <button
                onClick={() => {
                  const iframe = document.querySelector<HTMLIFrameElement>("#preview-iframe");
                  if (iframe) { iframe.src = iframe.src; }
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 8, border: "1px solid #e5e7eb",
                  background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <RotateCcw size={14} />
                Reset Preview
              </button>
            </div>
            <div style={{ width: "100%", height: "80vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <iframe
                id="preview-iframe"
                src="/articolstiintific/sondaj/wizard?preview=1"
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Preview Sondaj"
              />
            </div>
          </div>
        )}

        {/* ═══ LOG TAB ═══ */}
        {activeTab === "log" && (() => {
          // Filter by date + segment
          const segFiltered = logData.filter((l) => {
            // Segment filter: "all" = everything, "general" = no distribution, else = specific dist
            if (logSegment === "general") {
              if (l.distribution_id) return false;
            } else if (logSegment !== "all") {
              if (l.distribution_id !== logSegment) return false;
            }
            // Date filter
            const dateStr = l.completed_at || l.started_at || null;
            if (!dateStr) return true;
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return true;
            if (logDateFrom && d < new Date(logDateFrom)) return false;
            if (logDateTo && d > new Date(logDateTo + "T23:59:59")) return false;
            return true;
          });
          const filtered = segFiltered;
          const allFilteredIds = filtered.map((l: any) => l.id);
          const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id: string) => logSelected.has(id));

          // Stats
          const completedCount = filtered.filter((l: any) => !!l.completed_at).length;
          const rate = filtered.length > 0 ? Math.round((completedCount / filtered.length) * 100) : 0;
          const totalResponses = filtered.reduce((sum: number, l: any) => sum + (l.responseCount || 0), 0);

          // Unique distributions in data for segment tabs
          const distIds = new Set<string>();
          logData.forEach((l: any) => { if (l.distribution_id) distIds.add(l.distribution_id); });

          return (
            <div style={{ width: "100%" }}>
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Log Completari Sondaj</h2>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {logSelected.size > 0 && (
                    <button onClick={() => { if (confirm(`Arhivezi ${logSelected.size} inregistrari selectate? (se pot restaura din Arhiva)`)) deleteLogEntries(Array.from(logSelected)); }} style={{ padding: "7px 14px", borderRadius: 6, border: "none", background: "#D97706", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                      <Archive size={12} /> Arhiveaza ({logSelected.size})
                    </button>
                  )}
                  <button onClick={() => fetchLog()} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#374151", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    <RotateCcw size={13} /> Reincarca
                  </button>
                  <button
                    onClick={() => setLogSubTab(logSubTab === "flagged" ? "lista" : "flagged")}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      border: logSubTab === "flagged" ? "2px solid #DC2626" : "1px solid #e5e7eb",
                      background: logSubTab === "flagged" ? "#fef2f2" : "#fff",
                      color: logSubTab === "flagged" ? "#DC2626" : "#374151",
                    }}
                  >
                    <ShieldAlert size={14} /> FLAG IP
                  </button>
                  <button
                    onClick={() => { if (logSubTab === "arhiva") { setLogSubTab("lista"); } else { setLogSubTab("arhiva"); fetchArchive(); } }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: "pointer",
                      border: logSubTab === "arhiva" ? "2px solid #D97706" : "1px solid #e5e7eb",
                      background: logSubTab === "arhiva" ? "#fffbeb" : "#fff",
                      color: logSubTab === "arhiva" ? "#D97706" : "#374151",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    <Archive size={14} /> Arhiva
                  </button>
                </div>
              </div>

              {/* Stats cards row */}
              {(() => {
                const flaggedCount = filtered.filter((l: any) => l.is_flagged).length;
                const cleanCount = filtered.length - flaggedCount;
                const { suspectIds } = computeDuplicates(filtered);
                const autoDetectedIds = Array.from(suspectIds).filter(id => !filtered.find((l: any) => l.id === id)?.is_flagged && !dismissedDupIds.has(id));
                const autoDetected = autoDetectedIds.length;

                // Avg time calculation (from completed entries with both dates)
                const withDuration = filtered.filter((l: any) => l.completed_at && l.started_at).map((l: any) => {
                  const ms = new Date(l.completed_at).getTime() - new Date(l.started_at).getTime();
                  return Math.round(ms / 1000);
                }).filter((s: number) => s > 0 && s < 7200); // ignore > 2h as outliers
                const avgTimeSec = withDuration.length > 0 ? Math.round(withDuration.reduce((a: number, v: number) => a + v, 0) / withDuration.length) : 0;
                const avgTimeStr = avgTimeSec >= 60 ? `${Math.floor(avgTimeSec / 60)}m ${avgTimeSec % 60}s` : `${avgTimeSec}s`;

                // Today + this month
                const now = new Date();
                const todayStr = now.toISOString().slice(0, 10);
                const monthStr = now.toISOString().slice(0, 7);
                const completedToday = filtered.filter((l: any) => l.completed_at && l.completed_at.slice(0, 10) === todayStr).length;
                const completedMonth = filtered.filter((l: any) => l.completed_at && l.completed_at.slice(0, 7) === monthStr).length;

                return (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 14 }}>
                    {/* RESPONDENTI */}
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 4 }}>RESPONDENTI</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#374151" }}>{filtered.length}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{completedCount} completati</div>
                    </div>
                    {/* COMPLETARI */}
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 4 }}>COMPLETARI</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#059669" }}>{completedCount}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{rate}% rata completare</div>
                    </div>
                    {/* RASPUNSURI */}
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 4 }}>RASPUNSURI</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{totalResponses}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{completedCount > 0 ? `~${Math.round(totalResponses / completedCount)} / respondent` : "—"}</div>
                    </div>
                    {/* TIMP MEDIU */}
                    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 4 }}>TIMP MEDIU</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{avgTimeStr}</div>
                      <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>din {withDuration.length} sesiuni</div>
                    </div>
                    {/* AZI / LUNA — redesigned with 2 clear rows */}
                    <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 6 }}>COMPLETARI NOI</div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ textAlign: "center" as const }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#D97706", lineHeight: 1 }}>{completedToday}</div>
                          <div style={{ fontSize: 8, fontWeight: 700, color: "#92400e", letterSpacing: 0.5, marginTop: 2 }}>AZI</div>
                        </div>
                        <div style={{ width: 1, height: 28, background: "#fde68a" }} />
                        <div style={{ textAlign: "center" as const }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#b45309", lineHeight: 1 }}>{completedMonth}</div>
                          <div style={{ fontSize: 8, fontWeight: 700, color: "#92400e", letterSpacing: 0.5, marginTop: 2 }}>LUNA</div>
                        </div>
                      </div>
                    </div>
                    {/* FLAGGED */}
                    <div style={{ background: flaggedCount > 0 ? "#fef2f2" : "#f0fdf4", border: `1px solid ${flaggedCount > 0 ? "#fecaca" : "#e5e7eb"}`, borderRadius: 8, padding: "10px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 9, fontWeight: 700, letterSpacing: 1.2, color: "#6B7280", marginBottom: 4 }}>
                        <ShieldAlert size={10} />
                        FLAGGED
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: flaggedCount > 0 ? "#DC2626" : "#059669" }}>{flaggedCount}</div>
                      {autoDetected > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <span style={{ fontSize: 9, color: "#D97706", fontWeight: 600 }}>+{autoDetected} suspecte</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDismissedDupIds(prev => { const n = new Set(prev); autoDetectedIds.forEach(id => n.add(id)); return n; }); }}
                            style={{ padding: "1px 4px", borderRadius: 3, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#059669", fontSize: 8, fontWeight: 700, cursor: "pointer", lineHeight: 1 }}
                            title="Ignora suspectele — marcheaza ca OK"
                          >
                            IGNORA
                          </button>
                        </div>
                      ) : (
                        <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{cleanCount} curate</div>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Segment tabs + date filter row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                {/* Segment tabs */}
                <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb" }}>
                  <button style={{ ...S.tab, fontSize: 11, padding: "8px 14px", fontWeight: logSegment === "all" ? 800 : 600, ...(logSegment === "all" ? S.tabActive : {}) }} onClick={() => setLogSegment("all")}>
                    Toate ({logData.length})
                  </button>
                  <button style={{ ...S.tab, fontSize: 11, padding: "8px 14px", ...(logSegment === "general" ? S.tabActive : {}) }} onClick={() => setLogSegment("general")}>
                    General ({logData.filter((l: any) => !l.distribution_id).length})
                  </button>
                  {distributions.map((d) => {
                    const cnt = logData.filter((l: any) => l.distribution_id === d.id).length;
                    return (
                      <button key={d.id} style={{ ...S.tab, fontSize: 11, padding: "8px 14px", whiteSpace: "nowrap" as const, ...(logSegment === d.id ? S.tabActive : {}) }} onClick={() => setLogSegment(d.id)}>
                        {d.name} ({cnt})
                      </button>
                    );
                  })}
                </div>
                {/* Date filters compact */}
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF" }}>FILTRU:</span>
                  <input type="date" value={logDateFrom} onChange={(e) => setLogDateFrom(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, color: "#374151", background: "#fff" }} />
                  <span style={{ fontSize: 10, color: "#9CA3AF" }}>—</span>
                  <input type="date" value={logDateTo} onChange={(e) => setLogDateTo(e.target.value)} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #d1d5db", fontSize: 11, color: "#374151", background: "#fff" }} />
                  {(logDateFrom || logDateTo) && (
                    <button onClick={() => { setLogDateFrom(""); setLogDateTo(""); }} style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid #d1d5db", background: "#fff", fontSize: 10, cursor: "pointer", color: "#DC2626" }}>
                      <X size={10} />
                    </button>
                  )}
                </div>
              </div>

              {/* ═══ FLAGGED IP VIEW ═══ */}
              {logSubTab === "flagged" && (() => {
                const { dupIps, dupFps, suspectIds } = computeDuplicates(logData);
                const flaggedItems = logData.filter((l: any) => l.is_flagged);
                const suspectNotFlagged = logData.filter((l: any) => suspectIds.has(l.id) && !l.is_flagged && !dismissedDupIds.has(l.id));

                return (
                  <div>
                    {/* Auto-detect banner */}
                    {suspectNotFlagged.length > 0 && (
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
                        <AlertTriangle size={18} style={{ color: "#d97706", flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#92400e" }}>{suspectNotFlagged.length} respondenti suspecti detectati automat</div>
                          <div style={{ fontSize: 11, color: "#a16207", marginTop: 2 }}>IP sau fingerprint duplicat — pot fi completari multiple de la aceeasi persoana</div>
                        </div>
                        <button
                          onClick={() => toggleFlag(suspectNotFlagged.map(l => l.id), true, "Auto-detectat: IP/fingerprint duplicat")}
                          style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: "#DC2626", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const }}
                        >
                          Marcheaza toate ({suspectNotFlagged.length})
                        </button>
                      </div>
                    )}

                    {/* Duplicate IPs section */}
                    {dupIps.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <Globe size={13} /> IP-URI DUPLICATE ({dupIps.length} grupuri)
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {dupIps.map(([ip, ids]) => {
                            const entries = logData.filter((l: any) => ids.includes(l.id) && !dismissedDupIds.has(l.id));
                            if (entries.length === 0) return null; // all dismissed
                            const hasFlagged = entries.some((l: any) => l.is_flagged);
                            const hasUnflagged = entries.some((l: any) => !l.is_flagged);
                            return (
                              <div key={ip} style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#fee2e2", color: "#991b1b" }}>{ip}</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>{entries.length} completari</span>
                                  </div>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    {hasUnflagged && (
                                      <button
                                        onClick={() => toggleFlag(entries.filter((l: any) => !l.is_flagged).map((l: any) => l.id), true, `IP duplicat: ${ip}`)}
                                        style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                      >
                                        Flag toate
                                      </button>
                                    )}
                                    {hasFlagged && (
                                      <button
                                        onClick={() => { toggleFlag(entries.filter((l: any) => l.is_flagged).map((l: any) => l.id), false); }}
                                        style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 10, fontWeight: 600, cursor: "pointer" }}
                                      >
                                        Unflag toate
                                      </button>
                                    )}
                                    <button
                                      onClick={() => { setDismissedDupIds(prev => { const n = new Set(prev); entries.forEach((l: any) => n.add(l.id)); return n; }); }}
                                      style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#059669", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                    >
                                      Coincidenta OK
                                    </button>
                                  </div>
                                </div>
                                <div style={{ display: "grid", gap: 4 }}>
                                  {entries.map((l: any) => {
                                    const d = l.completed_at ? new Date(l.completed_at) : (l.started_at ? new Date(l.started_at) : null);
                                    return (
                                      <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, background: l.is_flagged ? "#fef2f2" : "#f9fafb", border: `1px solid ${l.is_flagged ? "#fecaca" : "#e5e7eb"}` }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.is_flagged ? "#DC2626" : "#10b981", flexShrink: 0 }} />
                                        <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, minWidth: 100 }}>{d ? d.toLocaleDateString("ro-RO") + " " + d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: l.completed_at ? "#d1fae5" : "#fef3c7", color: l.completed_at ? "#065f46" : "#92400e", fontWeight: 600 }}>{l.completed_at ? "COMPLET" : `Pas ${l.step_completed}`}</span>
                                        <span style={{ fontSize: 11, color: "#6B7280" }}>{l.device_type}</span>
                                        <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 3, background: "#f3f4f6", color: "#6B7280" }}>{(l.locale || "ro").toUpperCase()}</span>
                                        {l.browser_fingerprint && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9CA3AF" }} title={`Fingerprint: ${l.browser_fingerprint}`}><Fingerprint size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {l.browser_fingerprint.slice(0, 8)}...</span>}
                                        <span style={{ flex: 1 }} />
                                        {l.is_flagged ? (
                                          <button
                                            onClick={() => toggleFlag([l.id], false)}
                                            style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: "#059669", color: "#fff", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                          >
                                            UNFLAG
                                          </button>
                                        ) : (
                                          <div style={{ display: "flex", gap: 3 }}>
                                            <button
                                              onClick={() => toggleFlag([l.id], true, `IP duplicat: ${ip}`)}
                                              style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: "#DC2626", color: "#fff", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                            >
                                              FLAG
                                            </button>
                                            <button
                                              onClick={() => { setDismissedDupIds(prev => { const n = new Set(prev); n.add(l.id); return n; }); }}
                                              style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#059669", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                            >
                                              OK
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Duplicate fingerprints section (only show if different from IP groups) */}
                    {dupFps.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                          <Fingerprint size={13} /> FINGERPRINT-URI DUPLICATE ({dupFps.length} grupuri)
                        </div>
                        <div style={{ display: "grid", gap: 8 }}>
                          {dupFps.map(([fp, ids]) => {
                            const entries = logData.filter((l: any) => ids.includes(l.id) && !dismissedDupIds.has(l.id));
                            if (entries.length === 0) return null; // all dismissed
                            // Show unique IPs for this fingerprint group
                            const uniqueIps = Array.from(new Set(entries.map((l: any) => l.ip_address || l.ip_hash).filter(Boolean)));
                            const hasFlagged = entries.some((l: any) => l.is_flagged);
                            const hasUnflagged = entries.some((l: any) => !l.is_flagged);
                            return (
                              <div key={fp} style={{ background: "#fff", border: "1px solid #e9d5ff", borderRadius: 8, padding: "12px 14px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: "#f3e8ff", color: "#6b21a8" }}><Fingerprint size={11} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />{fp.slice(0, 16)}...</span>
                                    <span style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed" }}>{entries.length} completari</span>
                                    {uniqueIps.length > 1 && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: "#fef3c7", color: "#92400e", fontWeight: 600 }}>{uniqueIps.length} IP-uri diferite!</span>}
                                  </div>
                                  <div style={{ display: "flex", gap: 4 }}>
                                    {hasUnflagged && (
                                      <button
                                        onClick={() => toggleFlag(entries.filter((l: any) => !l.is_flagged).map((l: any) => l.id), true, `Fingerprint duplicat: ${fp.slice(0, 16)}`)}
                                        style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#7c3aed", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                      >
                                        Flag toate
                                      </button>
                                    )}
                                    {hasFlagged && (
                                      <button
                                        onClick={() => { toggleFlag(entries.filter((l: any) => l.is_flagged).map((l: any) => l.id), false); }}
                                        style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 10, fontWeight: 600, cursor: "pointer" }}
                                      >
                                        Unflag toate
                                      </button>
                                    )}
                                    <button
                                      onClick={() => { setDismissedDupIds(prev => { const n = new Set(prev); entries.forEach((l: any) => n.add(l.id)); return n; }); }}
                                      style={{ padding: "4px 10px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#059669", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                    >
                                      Coincidenta OK
                                    </button>
                                  </div>
                                </div>
                                <div style={{ display: "grid", gap: 4 }}>
                                  {entries.map((l: any) => {
                                    const d = l.completed_at ? new Date(l.completed_at) : (l.started_at ? new Date(l.started_at) : null);
                                    return (
                                      <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: 4, background: l.is_flagged ? "#fef2f2" : "#f9fafb", border: `1px solid ${l.is_flagged ? "#fecaca" : "#e5e7eb"}` }}>
                                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.is_flagged ? "#DC2626" : "#10b981", flexShrink: 0 }} />
                                        <span style={{ fontSize: 11, color: "#374151", fontWeight: 500, minWidth: 100 }}>{d ? d.toLocaleDateString("ro-RO") + " " + d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: "#6B7280" }}>{l.ip_address || l.ip_hash || "—"}</span>
                                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: l.completed_at ? "#d1fae5" : "#fef3c7", color: l.completed_at ? "#065f46" : "#92400e", fontWeight: 600 }}>{l.completed_at ? "COMPLET" : `Pas ${l.step_completed}`}</span>
                                        <span style={{ fontSize: 11, color: "#6B7280" }}>{l.device_type}</span>
                                        <span style={{ flex: 1 }} />
                                        {l.is_flagged ? (
                                          <button
                                            onClick={() => toggleFlag([l.id], false)}
                                            style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: "#059669", color: "#fff", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                          >
                                            UNFLAG
                                          </button>
                                        ) : (
                                          <div style={{ display: "flex", gap: 3 }}>
                                            <button
                                              onClick={() => toggleFlag([l.id], true, `Fingerprint duplicat: ${fp.slice(0, 16)}`)}
                                              style={{ padding: "3px 8px", borderRadius: 4, border: "none", background: "#7c3aed", color: "#fff", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                            >
                                              FLAG
                                            </button>
                                            <button
                                              onClick={() => { setDismissedDupIds(prev => { const n = new Set(prev); n.add(l.id); return n; }); }}
                                              style={{ padding: "3px 8px", borderRadius: 4, border: "1px solid #d1d5db", background: "#f0fdf4", color: "#059669", fontSize: 9, fontWeight: 700, cursor: "pointer" }}
                                            >
                                              OK
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Currently flagged list */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Flag size={13} /> MARCATE CA FLAGGED ({flaggedItems.length})
                      </div>
                      {flaggedItems.length === 0 ? (
                        <div style={{ textAlign: "center", padding: 30, color: "#059669", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                          <ShieldCheck size={24} style={{ margin: "0 auto 8px", display: "block" }} />
                          <div style={{ fontWeight: 700, fontSize: 13 }}>Nicio inregistrare flagged</div>
                          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>Toate completarile sunt curate</div>
                        </div>
                      ) : (
                        <div style={{ display: "grid", gap: 6 }}>
                          {flaggedItems.map((l: any) => {
                            const d = l.completed_at ? new Date(l.completed_at) : (l.started_at ? new Date(l.started_at) : null);
                            return (
                              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: "#fef2f2", border: "1px solid #fecaca" }}>
                                <ShieldAlert size={14} style={{ color: "#DC2626", flexShrink: 0 }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#111827", minWidth: 100 }}>{d ? d.toLocaleDateString("ro-RO") + " " + d.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "—"}</span>
                                <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px", borderRadius: 3, background: "#fee2e2", color: "#991b1b" }}>{l.ip_address || l.ip_hash || "—"}</span>
                                {l.browser_fingerprint && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: "#9CA3AF" }}><Fingerprint size={10} style={{ display: "inline", verticalAlign: "middle" }} /> {l.browser_fingerprint.slice(0, 8)}</span>}
                                <span style={{ fontSize: 10, color: "#DC2626", fontStyle: "italic" }}>{l.flag_reason || "Flag manual"}</span>
                                <span style={{ flex: 1 }} />
                                <button
                                  onClick={() => toggleFlag([l.id], false)}
                                  style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer" }}
                                >
                                  UNFLAG
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* No duplicates at all */}
                    {dupIps.length === 0 && dupFps.length === 0 && flaggedItems.length === 0 && (
                      <div style={{ textAlign: "center", padding: 40, color: "#059669", background: "#f0fdf4", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                        <ShieldCheck size={32} style={{ margin: "0 auto 10px", display: "block" }} />
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Totul curat!</div>
                        <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Niciun IP sau fingerprint duplicat detectat. Nicio inregistrare flagged.</div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* ═══ LISTA (normal table) ═══ */}
              {logSubTab === "lista" && (logLoading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Se incarca...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Nicio inregistrare</div>
              ) : (
                <div style={{ overflowX: "auto", position: "relative" }}>
                  {/* Tooltip popup */}
                  {logTooltip && (
                    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} onClick={() => setLogTooltip(null)}>
                      <div style={{
                        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                        background: "#111827", color: "#f9fafb", borderRadius: 10, padding: "20px 24px",
                        maxWidth: 420, width: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", fontSize: 13, lineHeight: 1.6,
                      }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#9CA3AF" }}>
                            {{ "#": "NUMAR", DATA: "DATA", STATUS: "STATUS", N: "N (RASPUNSURI)", IP: "ADRESA IP", "DISP.": "DISPOZITIV", LIMBA: "LIMBA", DEMOGRAFIE: "DEMOGRAFIE", TIMP: "TIMP" }[logTooltip] || logTooltip}
                          </span>
                          <button onClick={() => setLogTooltip(null)} style={{ background: "none", border: "none", color: "#6B7280", cursor: "pointer", padding: 2 }}><X size={16} /></button>
                        </div>
                        <div style={{ color: "#d1d5db" }}>
                          {logTooltip === "#" && "Numarul de ordine al respondentului in lista. Cel mai recent completat apare primul (1 = cel mai nou)."}
                          {logTooltip === "DATA" && "Data si ora la care respondentul a completat sondajul. Daca nu a finalizat, se afiseaza data de start."}
                          {logTooltip === "STATUS" && (<><strong style={{ color: "#10b981" }}>COMPLET</strong> = respondentul a parcurs toate intrebarile si a trimis raspunsurile. <strong style={{ color: "#f59e0b" }}>Pas N</strong> = a abandonat la pasul N din sondaj.</>)}
                          {logTooltip === "N" && "Numarul total de stimuli (materiale de marketing) la care respondentul a dat scoruri R, I, F, C, CTA. Maxim = numarul de stimuli activi din sondaj."}
                          {logTooltip === "IP" && "Adresa IP a respondentului. Se foloseste pentru: detectarea raspunsurilor duplicate, verificarea geografica (tara reala vs declarata), si asigurarea calitatii datelor. NU se face geolocalizare publica."}
                          {logTooltip === "DISP." && (<>Tipul de dispozitiv detectat automat: <strong>mobile</strong> (telefon), <strong>desktop</strong> (laptop/PC), sau <strong>tablet</strong>. Se determina din User-Agent-ul browser-ului.</>)}
                          {logTooltip === "LIMBA" && (<>Limba in care respondentul a completat sondajul: <span style={{ color: "#60a5fa" }}>RO</span> = Romana, <span style={{ color: "#f87171" }}>RU</span> = Rusa, <span style={{ color: "#34d399" }}>EN</span> = Engleza. Se alege de respondent la inceput.</>)}
                          {logTooltip === "SURSA" && (<>Sursa (canalul de distributie) prin care respondentul a accesat sondajul: <span style={{ color: "#60a5fa" }}>General</span> = link-ul public principal, sau un <span style={{ color: "#f59e0b" }}>link personalizat</span> creat in tab-ul Distributie (ex: TD Instagram, Facebook Ads, etc.).</>)}
                          {logTooltip === "DEMOGRAFIE" && "Profilul demografic auto-raportat: Gen (masculin/feminin) · Grupa de varsta (18-24, 25-34, etc.) · Tara de rezidenta. Click pe rand pentru detalii complete (venit, educatie, comportament, psihografic)."}
                          {logTooltip === "TIMP" && "Durata totala a sesiunii, de la start pana la completare. Se calculeaza: completed_at minus started_at. Utila pentru detectarea raspunsurilor grabite (sub 2 min) sau abandonate."}
                        </div>
                      </div>
                    </div>
                  )}

                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                        <th style={{ padding: "10px 6px", width: 32 }}>
                          <input type="checkbox" checked={allSelected} onChange={() => {
                            if (allSelected) setLogSelected(new Set());
                            else setLogSelected(new Set(allFilteredIds));
                          }} />
                        </th>
                        {[
                          { key: "#", align: "left" as const },
                          { key: "DATA", align: "left" as const },
                          { key: "STATUS", align: "center" as const },
                          { key: "N", align: "center" as const },
                          { key: "IP", align: "left" as const },
                          { key: "DISP.", align: "center" as const },
                          { key: "LIMBA", align: "center" as const },
                          { key: "SURSA", align: "center" as const },
                          { key: "DEMOGRAFIE", align: "left" as const },
                          { key: "TIMP", align: "center" as const },
                        ].map((col) => (
                          <th
                            key={col.key}
                            style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#374151", textAlign: col.align, borderBottom: "2px solid #e5e7eb", cursor: "pointer", whiteSpace: "nowrap" }}
                            onClick={() => setLogTooltip(col.key)}
                          >
                            <span style={{ borderBottom: "1px dashed #9CA3AF", paddingBottom: 1 }}>{col.key}</span>
                          </th>
                        ))}
                        <th style={{ padding: "10px 6px", width: 60 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((log: any, idx: number) => {
                        const completedDate = log.completed_at ? new Date(log.completed_at) : null;
                        const startedDate = log.started_at ? new Date(log.started_at) : null;
                        const isComplete = completedDate && !isNaN(completedDate.getTime());
                        const displayDate = isComplete ? completedDate : (startedDate && !isNaN(startedDate.getTime()) ? startedDate : null);
                        const hasValidDate = !!displayDate;
                        const duration = (isComplete && startedDate) ? Math.round((completedDate.getTime() - startedDate.getTime()) / 1000) : null;
                        const demoGender = log.demographics?.gender || "—";
                        const demoAge = log.demographics?.ageRange || log.demographics?.age_range || "—";
                        const demoCountry = log.demographics?.country || "—";
                        const isChecked = logSelected.has(log.id);
                        const isExpanded = logExpandedId === log.id;
                        const ip = log.ip_address || log.ip_hash || "—";

                        return (
                          <React.Fragment key={log.id}>
                            <tr
                              style={{ borderBottom: isExpanded ? "none" : "1px solid #e5e7eb", background: log.is_flagged ? "#fef2f2" : isChecked ? "#fef3c7" : isExpanded ? "#f0fdf4" : "transparent", cursor: "pointer", transition: "background 0.1s" }}
                              onClick={() => setLogExpandedId(isExpanded ? null : log.id)}
                            >
                              <td style={{ padding: "10px 6px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                <input type="checkbox" checked={isChecked} onChange={() => {
                                  setLogSelected((prev) => { const n = new Set(prev); if (n.has(log.id)) n.delete(log.id); else n.add(log.id); return n; });
                                }} />
                              </td>
                              <td style={{ padding: "10px 10px", fontWeight: 700, color: "#6B7280", fontSize: 12 }}>{filtered.length - idx}</td>
                              <td style={{ padding: "10px 10px", fontSize: 13 }}>
                                {hasValidDate ? (
                                  <><div style={{ fontWeight: 600, color: "#111827" }}>{displayDate!.toLocaleDateString("ro-RO")}</div><div style={{ color: "#6B7280", fontSize: 11 }}>{displayDate!.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div></>
                                ) : <span style={{ color: "#9CA3AF" }}>—</span>}
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: isComplete ? "#d1fae5" : "#fef3c7", color: isComplete ? "#065f46" : "#92400e" }}>
                                  {isComplete ? "COMPLET" : `Pas ${log.step_completed}`}
                                </span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, fontSize: 15, color: "#111827" }}>{log.responseCount}</td>
                              <td style={{ padding: "10px 10px", textAlign: "left" }}>
                                <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: "#374151", letterSpacing: 0.5 }}>{ip}</span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#f3f4f6", color: "#374151", fontWeight: 500 }}>{log.device_type || "—"}</span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, background: (log.locale || "").toLowerCase() === "ro" ? "#dbeafe" : (log.locale || "").toLowerCase() === "ru" ? "#fee2e2" : "#d1fae5", color: (log.locale || "").toLowerCase() === "ro" ? "#1e40af" : (log.locale || "").toLowerCase() === "ru" ? "#991b1b" : "#065f46" }}>
                                  {(log.locale || "—").toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <span style={{
                                  fontSize: 11,
                                  fontWeight: 600,
                                  padding: "2px 8px",
                                  borderRadius: 4,
                                  background: log.distribution_name === "General" ? "#dbeafe" : "#fef3c7",
                                  color: log.distribution_name === "General" ? "#1e40af" : "#92400e",
                                  whiteSpace: "nowrap" as const,
                                }}>
                                  {log.distribution_name || "General"}
                                </span>
                              </td>
                              <td style={{ padding: "10px 10px", fontSize: 12, color: "#374151" }}>
                                <span style={{ fontWeight: 500 }}>{demoGender}</span>
                                <span style={{ color: "#d1d5db", margin: "0 4px" }}>|</span>
                                <span style={{ fontWeight: 500 }}>{demoAge}</span>
                                <span style={{ color: "#d1d5db", margin: "0 4px" }}>|</span>
                                <span style={{ fontWeight: 500 }}>{demoCountry}</span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                                {duration !== null ? (duration >= 60 ? `${Math.floor(duration / 60)}m ${duration % 60}s` : `${duration}s`) : "—"}
                              </td>
                              <td style={{ padding: "10px 6px", textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                                  <button onClick={() => toggleFlag([log.id], !log.is_flagged, log.is_flagged ? undefined : "Flag manual")} style={{ background: "none", border: "none", cursor: "pointer", color: log.is_flagged ? "#DC2626" : "#d1d5db", padding: 3 }} title={log.is_flagged ? "Unflag" : "Flag"}>
                                    {log.is_flagged ? <ShieldAlert size={15} /> : <Shield size={15} />}
                                  </button>
                                  <button onClick={() => setLogExpandedId(isExpanded ? null : log.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 3 }} title="Detalii">
                                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                  </button>
                                  <button onClick={() => { if (confirm("Arhivezi aceasta inregistrare? (se poate restaura din Arhiva)")) deleteLogEntries([log.id]); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#D97706", padding: 3 }} title="Arhiveaza">
                                    <Archive size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>

                            {/* ═══ Expanded detail row ═══ */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={12} style={{ padding: "0 8px 12px", background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "12px 8px 4px" }}>
                                    {/* PROFIL DEMOGRAFIC */}
                                    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb", padding: "10px 12px" }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 6 }}>PROFIL DEMOGRAFIC</div>
                                      {[
                                        ["Gen", demoGender],
                                        ["Varsta", demoAge],
                                        ["Tara", demoCountry],
                                        ["Zona", log.demographics?.locationType || "—"],
                                        ["Venit", log.demographics?.incomeRange || "—"],
                                        ["Educatie", log.demographics?.education || "—"],
                                      ].map(([k, v]) => (
                                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", borderBottom: "1px solid #f3f4f6" }}>
                                          <span style={{ color: "#6B7280" }}>{k}</span>
                                          <span style={{ color: "#111827", fontWeight: 500 }}>{v}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* COMPORTAMENT */}
                                    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb", padding: "10px 12px" }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 6 }}>COMPORTAMENT</div>
                                      {[
                                        ["Cumparaturi", log.behavioral?.purchaseFrequency || "—"],
                                        ["Canale", Array.isArray(log.behavioral?.preferredChannels) ? log.behavioral.preferredChannels.join(", ") : "—"],
                                        ["Timp online", log.behavioral?.dailyOnlineTime || "—"],
                                        ["Dispozitiv", log.behavioral?.primaryDevice || "—"],
                                      ].map(([k, v]) => (
                                        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", borderBottom: "1px solid #f3f4f6", gap: 8 }}>
                                          <span style={{ color: "#6B7280", whiteSpace: "nowrap" }}>{k}</span>
                                          <span style={{ color: "#111827", fontWeight: 500, textAlign: "right" }}>{v}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* PSIHOGRAFIC */}
                                    <div style={{ background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb", padding: "10px 12px" }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 6 }}>PSIHOGRAFIC (1-7)</div>
                                      {[
                                        ["Receptivitate reclame", log.psychographic?.adReceptivity],
                                        ["Preferinta vizuala", log.psychographic?.visualPreference],
                                        ["Tangenta marketing", log.psychographic?.marketingExpertise],
                                        ["Iritare irelevanta", log.psychographic?.irrelevanceAnnoyance],
                                        ["Captare atentie", log.psychographic?.attentionCapture],
                                        ["Toleranta irelevanta", log.psychographic?.irrelevanceTolerance],
                                      ].map(([k, v]) => (
                                        <div key={k as string} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, padding: "2px 0", borderBottom: "1px solid #f3f4f6" }}>
                                          <span style={{ color: "#6B7280" }}>{k}</span>
                                          <span style={{ color: "#111827", fontWeight: 700 }}>{v ?? "—"}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* RASPUNSURI STIMULI */}
                                  {log.responses && log.responses.length > 0 && (
                                    <div style={{ marginTop: 10, padding: "0 8px" }}>
                                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 6 }}>RASPUNSURI STIMULI ({log.responses.length})</div>
                                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 6 }}>
                                        {log.responses.map((resp: any, ri: number) => {
                                          const c = resp.r_score + (resp.i_score * resp.f_score);
                                          return (
                                            <div key={ri} style={{ background: "#fff", borderRadius: 6, border: "1px solid #e5e7eb", padding: "8px 10px", fontSize: 11 }}>
                                              <div style={{ fontWeight: 600, color: "#111827", fontSize: 11, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                <span style={{ fontSize: 9, padding: "1px 4px", borderRadius: 3, background: "#f3f4f6", color: "#6B7280", marginRight: 4 }}>{resp.stimulusType}</span>
                                                {resp.stimulusName}
                                              </div>
                                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                                                {[
                                                  { l: "R", v: resp.r_score, c: "#DC2626" },
                                                  { l: "I", v: resp.i_score, c: "#D97706" },
                                                  { l: "F", v: resp.f_score, c: "#7C3AED" },
                                                  { l: "C", v: resp.c_score ?? c, c: "#059669" },
                                                  { l: "CTA", v: resp.cta_score, c: "#2563EB" },
                                                ].map((d) => (
                                                  <span key={d.l} style={{ fontSize: 10, fontWeight: 700 }}>
                                                    <span style={{ color: d.c }}>{d.l}</span>
                                                    <span style={{ color: "#374151" }}>=</span>
                                                    <span style={{ color: "#111827" }}>{d.v ?? "—"}</span>
                                                  </span>
                                                ))}
                                                {resp.brand_familiar !== null && resp.brand_familiar !== undefined && (
                                                  <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: resp.brand_familiar ? "#d1fae5" : "#fee2e2", color: resp.brand_familiar ? "#065f46" : "#991b1b", fontWeight: 600 }}>
                                                    {resp.brand_familiar ? "Cunoaste brand" : "Nu cunoaste"}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}

              {/* ═══ ARCHIVE VIEW ═══ */}
              {logSubTab === "arhiva" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Archive size={18} style={{ color: "#D97706" }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: "#92400e" }}>Arhiva ({archiveData.length} inregistrari)</div>
                        <div style={{ fontSize: 11, color: "#a16207" }}>Inregistrarile arhivate nu apar in Rezultate. Le poti restaura sau sterge definitiv.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {archiveSelected.size > 0 && (
                        <>
                          <button onClick={() => restoreFromArchive(Array.from(archiveSelected))} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#059669", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <ArchiveRestore size={12} /> Restaureaza ({archiveSelected.size})
                          </button>
                          <button onClick={() => { if (confirm(`Stergi DEFINITIV ${archiveSelected.size} inregistrari? Aceasta actiune NU poate fi anulata!`)) permanentDeleteArchive(Array.from(archiveSelected)); }} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#DC2626", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Trash2 size={12} /> Sterge definitiv ({archiveSelected.size})
                          </button>
                        </>
                      )}
                      <button onClick={() => fetchArchive()} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #fde68a", background: "#fff", color: "#92400e", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <RotateCcw size={12} /> Reincarca
                      </button>
                    </div>
                  </div>

                  {archiveLoading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>Se incarca arhiva...</div>
                  ) : archiveData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}>
                      <Archive size={32} style={{ color: "#d1d5db", marginBottom: 8 }} />
                      <p>Arhiva este goala</p>
                      <p style={{ fontSize: 12 }}>Inregistrarile sterse din Log vor aparea aici si pot fi restaurate.</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#fffbeb", borderBottom: "2px solid #fde68a" }}>
                          <th style={{ padding: "10px 6px", width: 32 }}>
                            <input type="checkbox" checked={archiveData.length > 0 && archiveData.every((l: any) => archiveSelected.has(l.id))} onChange={() => {
                              if (archiveData.every((l: any) => archiveSelected.has(l.id))) setArchiveSelected(new Set());
                              else setArchiveSelected(new Set(archiveData.map((l: any) => l.id)));
                            }} />
                          </th>
                          <th style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#92400e", textAlign: "left" }}>#</th>
                          <th style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#92400e", textAlign: "left" }}>DATA</th>
                          <th style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#92400e", textAlign: "center" }}>STATUS</th>
                          <th style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#92400e", textAlign: "center" }}>N</th>
                          <th style={{ padding: "10px 10px", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: "#92400e", textAlign: "left" }}>ARHIVAT</th>
                          <th style={{ padding: "10px 6px", width: 120 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {archiveData.map((log: any, idx: number) => {
                          const completedDate = log.completed_at ? new Date(log.completed_at) : null;
                          const isComplete = completedDate && !isNaN(completedDate.getTime());
                          const archivedDate = log.archived_at ? new Date(log.archived_at) : null;
                          const isChecked = archiveSelected.has(log.id);
                          return (
                            <tr key={log.id} style={{ borderBottom: "1px solid #fef3c7", background: isChecked ? "#fef3c7" : "transparent" }}>
                              <td style={{ padding: "10px 6px", textAlign: "center" }}>
                                <input type="checkbox" checked={isChecked} onChange={() => {
                                  setArchiveSelected((prev) => { const n = new Set(prev); if (n.has(log.id)) n.delete(log.id); else n.add(log.id); return n; });
                                }} />
                              </td>
                              <td style={{ padding: "10px 10px", fontWeight: 700, color: "#6B7280", fontSize: 12 }}>{archiveData.length - idx}</td>
                              <td style={{ padding: "10px 10px", fontSize: 12 }}>
                                {isComplete ? (
                                  <><div style={{ fontWeight: 600, color: "#111827" }}>{completedDate!.toLocaleDateString("ro-RO")}</div><div style={{ color: "#6B7280", fontSize: 11 }}>{completedDate!.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div></>
                                ) : <span style={{ color: "#9CA3AF" }}>—</span>}
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: isComplete ? "#d1fae5" : "#fef3c7", color: isComplete ? "#065f46" : "#92400e" }}>
                                  {isComplete ? "COMPLET" : `Pas ${log.step_completed}`}
                                </span>
                              </td>
                              <td style={{ padding: "10px 10px", textAlign: "center", fontWeight: 800, fontSize: 15, color: "#111827" }}>{log.responseCount}</td>
                              <td style={{ padding: "10px 10px", fontSize: 11, color: "#a16207" }}>
                                {archivedDate ? archivedDate.toLocaleDateString("ro-RO") + " " + archivedDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" }) : "—"}
                              </td>
                              <td style={{ padding: "10px 6px" }}>
                                <div style={{ display: "flex", gap: 4, justifyContent: "center" }}>
                                  <button onClick={() => restoreFromArchive([log.id])} style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#059669", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                    <ArchiveRestore size={11} /> Restaureaza
                                  </button>
                                  <button onClick={() => { if (confirm("Stergi DEFINITIV? Aceasta actiune NU poate fi anulata!")) permanentDeleteArchive([log.id]); }} style={{ padding: "4px 10px", borderRadius: 4, border: "none", background: "#DC2626", color: "#fff", fontSize: 10, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
                                    <Trash2 size={11} /> Sterge
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

// ── Table cell styles (results) ──────────────────────────
const thStyle: React.CSSProperties = {
  padding: "10px 14px",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: 1.5,
  color: "#6B7280",
  textAlign: "center",
  borderBottom: "2px solid #e5e7eb",
};

const tdStyle: React.CSSProperties = {
  padding: "12px 14px",
  fontSize: 14,
  color: "#374151",
  textAlign: "center",
};

// ── Styles ─────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "Outfit, system-ui, sans-serif",
  },
  headerBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 24px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    fontSize: 22,
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: 2,
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "4px 12px",
    borderRadius: 6,
    background: "#DC2626",
    color: "#fff",
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  tabsBar: {
    display: "flex",
    gap: 0,
    padding: "0 24px",
    background: "#fff",
    borderBottom: "2px solid #e5e7eb",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#DC2626",
    borderBottomColor: "#DC2626",
  },
  content: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px 24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  addCatBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#fff",
    background: "#DC2626",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  configCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  configHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#6B7280",
  },
  configGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  configItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 14,
  },
  configLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1,
    color: "#9CA3AF",
    display: "block",
    marginBottom: 8,
  },
  configFormula: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "JetBrains Mono, monospace",
  },
  configValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  galleryCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderTop: "4px solid transparent",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    position: "relative" as const,
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  galleryNum: {
    position: "absolute" as const,
    top: -14,
    left: 16,
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: 0.5,
  },
  galleryVisBtn: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 6,
    background: "#f3f4f6",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  galleryTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  galleryBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
    padding: "4px 12px",
    borderRadius: 6,
    color: "#fff",
    whiteSpace: "nowrap" as const,
  },
  galleryName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.3,
  },
  galleryCounter: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
  },
  counterBar: {
    height: 4,
    background: "#f3f4f6",
    borderRadius: 2,
    overflow: "hidden",
  },
  counterFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s",
  },
  counterText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
  },
  galleryActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  galleryEditBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  galleryExpandBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
    width: "100%",
  },
  galleryMaterials: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
  },
  galleryEditWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  iconBtnSm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    border: "none",
    borderRadius: 5,
    background: "#f3f4f6",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  catEditRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  catEditInput: {
    flex: 1,
    padding: "6px 10px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    color: "#111827",
  },
  colorPicker: {
    width: 32,
    height: 32,
    padding: 0,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  iconBtnDanger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#DC2626",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  iconBtnSave: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 6,
    background: "#059669",
    color: "#fff",
    cursor: "pointer",
  },
  iconBtnCancel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 6,
    background: "#e5e7eb",
    color: "#6B7280",
    cursor: "pointer",
  },
  materialsWrap: {
    padding: "0 0 0 0",
    borderTop: "1px solid #f3f4f6",
  },
  emptyMsg: {
    fontSize: 13,
    color: "#9CA3AF",
    padding: "16px 0 8px",
    fontStyle: "italic",
  },
  stimCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    marginTop: 8,
  },
  stimIdx: {
    fontSize: 12,
    fontWeight: 700,
    color: "#9CA3AF",
    fontFamily: "JetBrains Mono, monospace",
    minWidth: 20,
  },
  stimName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    flex: 1,
  },
  stimIndustry: {
    fontSize: 11,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#374151",
  },
  stimMediaIcons: {
    display: "flex",
    gap: 4,
  },
  mediaIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#6B7280",
  },
  stimActions: {
    display: "flex",
    gap: 2,
  },
  stimEditForm: {
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  stimEditHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  stimEditTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  stimEditGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  formField: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6B7280",
  },
  formInput: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    color: "#111827",
    boxSizing: "border-box" as const,
    width: "100%",
    fontFamily: "inherit",
  },
  stimEditActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
  },
  btnCancel: {
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnSave: {
    padding: "8px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#DC2626",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  addStimBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#059669",
    background: "transparent",
    border: "1px dashed #bbf7d0",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  placeholderTab: {
    textAlign: "center" as const,
    padding: 60,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  },
  /* ═══ WORKSPACE ═══ */
  workspace: {
    marginTop: 24,
    background: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
  },
  wsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #e5e7eb",
  },
  wsHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  wsTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  wsMaterialCount: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6B7280",
    background: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: 12,
    fontFamily: "JetBrains Mono, monospace",
  },
  wsHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  wsActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  /* ═══ MATERIAL CARDS ═══ */
  matGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  matCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  matCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  matNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "JetBrains Mono, monospace",
    flexShrink: 0,
  },
  matCardName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  matDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.5,
    margin: 0,
  },
  matMediaRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 4,
  },
  matMediaTag: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#374151",
  },
  matAddCard: {
    background: "#fff",
    border: "2px dashed #e5e7eb",
    borderRadius: 12,
    padding: 32,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    minHeight: 180,
  },
  /* ═══ COMPACT CATEGORY STRIP ═══ */
  catStrip: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
    marginBottom: 16,
  },
  catChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    background: "#fff",
  },
  chipBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.5,
    padding: "2px 6px",
    borderRadius: 4,
    color: "#fff",
  },
  chipCount: {
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.7,
    fontFamily: "JetBrains Mono, monospace",
  },
  /* ═══ MATERIAL TABS BAR ═══ */
  matTabsBar: {
    display: "flex",
    gap: 0,
    borderBottom: "2px solid #e5e7eb",
    marginBottom: 0,
    overflowX: "auto" as const,
  },
  matTab: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    background: "#f9fafb",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  matTabNum: {
    width: 22,
    height: 22,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "JetBrains Mono, monospace",
    flexShrink: 0,
  },
  matTabName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  matTabMediaCount: {
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 10,
    background: "#e5e7eb",
    color: "#6B7280",
  },
  /* ═══ MATERIAL WORK AREA ═══ */
  matWorkArea: {
    padding: "28px 4px",
    minHeight: 300,
  },
  matWorkTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  matFormWide: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 16,
  },
  /* ═══ MATERIAL PREVIEW ═══ */
  matPreview: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  previewSection: {
    padding: "16px 20px",
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#9CA3AF",
    display: "block",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  previewItem: {
    padding: "12px 16px",
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  previewLink: {
    fontSize: 13,
    color: "#2563EB",
    wordBreak: "break-all" as const,
    textDecoration: "none",
  },
  /* ═══ FILE UPLOAD ═══ */
  fileLabel: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    background: "#f9fafb",
    border: "1px dashed #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    padding: 8,
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    position: "relative" as const,
  },
  fileRemoveBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: 11,
    border: "none",
    background: "#fee2e2",
    color: "#DC2626",
    cursor: "pointer",
    marginLeft: "auto",
    flexShrink: 0,
  },
};
