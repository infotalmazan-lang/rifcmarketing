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
  Type,
  ListOrdered,
  Hash,
  LayoutList,
  Play,
  UserCircle,
  MapPin,
  Wallet,
  GraduationCap,
  ShoppingCart,
  Monitor,
  Clock,
  Brain,
  Sparkles,
  Heart,
  Zap,
  ChevronRight,
  ImageIcon,
  PartyPopper,
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

type TabKey = "cartonase" | "rezultate" | "distributie" | "interpretare" | "experti" | "ai" | "preview" | "log" | "cvi";

const TABS_LEFT: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "cartonase", label: "Cartonase", icon: LayoutGrid },
  { key: "rezultate", label: "Rezultate", icon: BarChart3 },
  { key: "distributie", label: "Distributie", icon: Share2 },
  { key: "interpretare", label: "Interpretare", icon: Brain },
];
const TABS_RIGHT: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "preview", label: "Preview", icon: PlayCircle },
  { key: "cvi", label: "Evaluare Itemi", icon: Target },
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
const SONDAJ_ACCESS_CODE = "RIFC2026";
const SONDAJ_STORAGE_KEY = "rifc-articol-access";

function AccessGate({ onGranted }: { onGranted: () => void }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const validate = () => {
    if (input.trim() === SONDAJ_ACCESS_CODE) {
      try { localStorage.setItem(SONDAJ_STORAGE_KEY, SONDAJ_ACCESS_CODE); } catch {}
      onGranted();
    } else {
      setError("Cod incorect. Incercati din nou.");
      setInput("");
    }
  };
  return (
    <div style={{ position:"fixed",inset:0,background:"linear-gradient(135deg,#0f172a,#1e293b)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999 }}>
      <div style={{ background:"#fff",borderRadius:16,padding:"48px 40px",maxWidth:400,width:"100%",textAlign:"center",boxShadow:"0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:14,color:"#DC2626",letterSpacing:4,fontWeight:700,marginBottom:8 }}>R IF C</div>
        <h2 style={{ fontSize:22,fontWeight:800,color:"#111827",marginBottom:8 }}>Sondaj Admin</h2>
        <p style={{ fontSize:13,color:"#4B5563",marginBottom:28 }}>Introduceti codul de acces pentru a continua</p>
        <input type="password" style={{ width:"100%",padding:"14px 16px",fontSize:15,color:"#111827",border:"2px solid #D1D5DB",borderRadius:10,outline:"none",fontFamily:"'JetBrains Mono',monospace",letterSpacing:2,textAlign:"center",marginBottom:16 }} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&validate()} placeholder="Cod de acces" autoFocus />
        <button style={{ width:"100%",padding:"14px 24px",fontSize:14,fontWeight:700,color:"#fff",background:"linear-gradient(135deg,#DC2626,#B91C1C)",border:"none",borderRadius:10,cursor:"pointer",letterSpacing:1 }} onClick={validate}>ACCES</button>
        {error && <p style={{ fontSize:13,color:"#DC2626",marginTop:12,fontWeight:600 }}>{error}</p>}
      </div>
    </div>
  );
}

export default function StudiuAdminPage() {
  // Access control — check localStorage (shared with parent /articolstiintific)
  const [hasAccess, setHasAccess] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SONDAJ_STORAGE_KEY);
      if (saved === SONDAJ_ACCESS_CODE) setHasAccess(true);
    } catch {}
    setAccessChecked(true);
  }, []);

  // If accessed directly (not in iframe) and has access, redirect to parent
  const [inIframe, setInIframe] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined" && window.self === window.top && hasAccess) {
      setInIframe(false);
      window.location.replace("/articolstiintific#sondaj");
    }
  }, [hasAccess]);

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
  interface FatiguePositionData {
    position: number;
    n: number;
    avg_r: number;
    avg_i: number;
    avg_f: number;
    avg_c: number;
    avg_cta: number;
    avg_time: number;
  }
  interface FatigueThird {
    avg_r: number; avg_i: number; avg_f: number; avg_c: number; avg_cta: number; avg_time: number;
  }
  interface FatigueAnalysis {
    completedRespondentsAnalyzed: number;
    maxPosition: number;
    perPosition: FatiguePositionData[];
    firstThird: FatigueThird;
    lastThird: FatigueThird;
    delta: { r: number; i: number; f: number; c: number; cta: number; time: number };
  }
  interface FunnelStep {
    step: number;
    label: string;
    reached: number;
    rate: number;
    dropped: number;
  }
  interface CompletionFunnel {
    totalStarted: number;
    totalCompleted: number;
    overallRate: number;
    funnelSteps: FunnelStep[];
    worstDropout: { step: number; label: string; dropped: number; dropRate: number };
    medianSessionTime: number;
    avgSessionTime: number;
    timeBuckets: { under5m: number; m5to15: number; m15to30: number; m30to60: number; over60m: number };
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
    fatigueAnalysis?: FatigueAnalysis;
    completionFunnel?: CompletionFunnel;
  }
  const [results, setResults] = useState<ResultsData | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsSegment, setResultsSegment] = useState<string>("all");
  const [globalStats, setGlobalStats] = useState<{ total: number; completed: number; rate: number; responses: number; today: number; month: number; avgTime: number; perDist: { id: string; name: string; total: number; completed: number }[] } | null>(null);
  const [resultsSubTab, setResultsSubTab] = useState<"scoruri" | "profil" | "psihografic" | "canale" | "industrii" | "fatigue" | "funnel">("scoruri");
  const [resultsCatFilter, setResultsCatFilter] = useState<string | null>(null);
  const [expandedStimulusId, setExpandedStimulusId] = useState<string | null>(null);
  const [tooltipCol, setTooltipCol] = useState<string | null>(null);
  const [expandedChannelType, setExpandedChannelType] = useState<string | null>(null);
  const [expandedIndustryType, setExpandedIndustryType] = useState<string | null>(null);
  const [interpSubTab, setInterpSubTab] = useState<"total" | "industrie" | "brand">("total");
  const [expandedInterpIndustry, setExpandedInterpIndustry] = useState<string | null>(null);
  const [interpDrawer, setInterpDrawer] = useState<{ key: string; title: string; value: string; context?: Record<string, unknown> } | null>(null);

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
  // Persisted in localStorage so dismissals survive page refresh
  const [dismissedDupIds, setDismissedDupIds] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("rifc_dismissed_dups");
        if (saved) return new Set(JSON.parse(saved));
      } catch { /* ignore */ }
    }
    return new Set();
  });
  useEffect(() => {
    if (dismissedDupIds.size > 0) {
      localStorage.setItem("rifc_dismissed_dups", JSON.stringify(Array.from(dismissedDupIds)));
    } else {
      localStorage.removeItem("rifc_dismissed_dups");
    }
  }, [dismissedDupIds]);

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

  // CVI (Evaluare Itemi) state
  const [cviExperts, setCviExperts] = useState<any[]>([]);
  const [cviResults, setCviResults] = useState<any>(null);
  const [cviLoading, setCviLoading] = useState(false);
  const [cviCopied, setCviCopied] = useState<string | null>(null);
  const [cviExportingCsv, setCviExportingCsv] = useState(false);
  const [cviExportingJson, setCviExportingJson] = useState(false);
  const [showAddCviExpert, setShowAddCviExpert] = useState(false);
  const [editingCviExpertId, setEditingCviExpertId] = useState<string | null>(null);
  const [cviSaving, setCviSaving] = useState(false);
  const defaultCviExpertForm = { name: "", org: "", role: "", experience: "", email: "" };
  const [cviExpertForm, setCviExpertForm] = useState(defaultCviExpertForm);
  const [cviSubTab, setCviSubTab] = useState<"main" | "edit" | "preview">("main");

  // CVI item editor state (for Editează sub-tab)
  const [cviItemEdits, setCviItemEdits] = useState<Record<string, { text?: string; sub?: string }>>({});
  const [cviEditExpanded, setCviEditExpanded] = useState<string | null>(null); // expanded dimension: R, I, F, C

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
    if (activeTab === "rezultate" || activeTab === "interpretare") {
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

  // CVI data fetching
  const fetchCviData = useCallback(async () => {
    setCviLoading(true);
    try {
      const [expRes, resRes] = await Promise.all([
        fetch("/api/cvi/generate-tokens"),
        fetch("/api/cvi/results"),
      ]);
      const expData = await expRes.json();
      const resData = await resRes.json();
      if (expData.experts) setCviExperts(expData.experts);
      setCviResults(resData);
    } catch {
      /* fetch failed silently */
    }
    setCviLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "cvi") fetchCviData();
  }, [activeTab, fetchCviData]);

  const saveCviExpert = useCallback(async () => {
    if (!cviExpertForm.name.trim()) return;
    setCviSaving(true);
    try {
      const res = editingCviExpertId
        ? await fetch("/api/cvi/generate-tokens", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: editingCviExpertId, ...cviExpertForm }),
          })
        : await fetch("/api/cvi/generate-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...cviExpertForm, invited_by: "talmazan" }),
          });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert("Eroare la salvare: " + (data.error || "Server error"));
        setCviSaving(false);
        return;
      }
      setShowAddCviExpert(false);
      setEditingCviExpertId(null);
      setCviExpertForm({ name: "", org: "", role: "", experience: "", email: "" });
      fetchCviData();
    } catch (err) {
      alert("Eroare de rețea la salvare expert CVI");
    }
    setCviSaving(false);
  }, [cviExpertForm, editingCviExpertId, fetchCviData]);

  const deleteCviExpert = useCallback(async (id: string) => {
    if (!confirm("Ești sigur că vrei să ștergi permanent acest expert CVI?")) return;
    try {
      await fetch(`/api/cvi/generate-tokens?id=${id}&hard=1`, { method: "DELETE" });
      fetchCviData();
    } catch { /* ignore */ }
  }, [fetchCviData]);

  const toggleCviExpertAccess = useCallback(async (token: string, isActive: boolean) => {
    if (isActive) {
      await fetch(`/api/cvi/generate-tokens?token=${token}`, { method: "DELETE" });
    } else {
      // Restore — use PATCH to set status back to pending
      // For now we find the expert by token and update via PATCH
      const expert = cviExperts.find(e => e.token === token);
      if (expert) {
        await fetch("/api/cvi/generate-tokens", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: expert.id, status: "pending" }),
        });
      }
    }
    fetchCviData();
  }, [fetchCviData, cviExperts]);

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

  // ── Access & iframe guards ─────────────────────────────
  if (!accessChecked) return null;
  if (accessChecked && !hasAccess) {
    return <AccessGate onGranted={() => setHasAccess(true)} />;
  }
  if (!inIframe) return null;

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header bar */}
      <div style={S.headerBar}>
        <a href="/articolstiintific" style={{ textDecoration: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
          <img src="/images/rifc-logo-black.png" alt="R IF C" style={{ height: 32, width: "auto", borderRadius: 4 }} />
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
                    { key: "fatigue" as const, label: "Fatigue Analysis" },
                    { key: "funnel" as const, label: "Completion Funnel" },
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
                                Cform: { title: "C\u2091\u2092\u2093\u2098 \u2014 Scor Comunicare (Formula)", desc: "Calculat dup\u0103 formula: R+(I\u00d7F)=C. Combin\u0103 cele 3 dimensiuni \u00eentr-un scor unic. Valori mai mari = comunicare mai eficient\u0103. Maxim teoretic: 110 (R=10, I=10, F=10)." },
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
                {/* ── SUB-TAB: FATIGUE ANALYSIS ── */}
                {resultsSubTab === "fatigue" && (() => {
                  const fa = results.fatigueAnalysis;
                  if (!fa || fa.perPosition.length === 0) {
                    return (
                      <div style={S.placeholderTab}>
                        <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                        <p style={{ color: "#6B7280", fontSize: 14 }}>Insuficiente date pentru analiza de fatigue. Sunt necesari respondenti completati.</p>
                      </div>
                    );
                  }

                  const dims: { key: keyof typeof fa.delta; label: string; fullLabel: string; color: string; desc: string }[] = [
                    { key: "r", label: "R", fullLabel: "Relevanta", color: "#DC2626", desc: "Cat de relevant percepe respondentul stimulul" },
                    { key: "i", label: "I", fullLabel: "Interes", color: "#D97706", desc: "Nivelul de interes generat de stimul" },
                    { key: "f", label: "F", fullLabel: "Forma", color: "#7C3AED", desc: "Calitatea executiei vizuale/creative" },
                    { key: "c", label: "C", fullLabel: "Claritate", color: "#059669", desc: "Cat de clar e mesajul comunicat" },
                    { key: "cta", label: "CTA", fullLabel: "Call-to-Action", color: "#2563EB", desc: "Eficacitatea indemnului la actiune" },
                    { key: "time", label: "Timp", fullLabel: "Timp de evaluare", color: "#6B7280", desc: "Durata medie petrecuta evaluand fiecare stimul" },
                  ];

                  // Find max score for chart scaling
                  const maxScore = Math.max(
                    ...fa.perPosition.flatMap(p => [p.avg_r, p.avg_i, p.avg_f, p.avg_c, p.avg_cta]),
                    10
                  );
                  const maxTime = Math.max(...fa.perPosition.map(p => p.avg_time), 1);
                  const chartH = 200;
                  const chartW = Math.max(600, fa.perPosition.length * 28);

                  // Determine overall fatigue verdict
                  const scoreDims = dims.filter(d => d.key !== "time");
                  const significantDrops = scoreDims.filter(d => fa.delta[d.key] < -5).length;
                  const significantRises = scoreDims.filter(d => fa.delta[d.key] > 5).length;
                  const timeDelta = fa.delta.time;
                  const fatigueVerdict = significantDrops >= 3
                    ? { text: "Oboseala cognitiva detectata", color: "#DC2626", bg: "#fef2f2", border: "#fecaca", icon: "!" }
                    : significantDrops >= 1
                    ? { text: "Oboseala cognitiva minora", color: "#D97706", bg: "#fefce8", border: "#fde68a", icon: "~" }
                    : { text: "Fara oboseala cognitiva semnificativa", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0", icon: "+" };

                  return (
                    <div>
                      {/* ── FISA EXPLICATIVA ── */}
                      <details style={{ marginBottom: 20, border: "1px solid #c7d2fe", borderRadius: 10, background: "#eef2ff", overflow: "hidden" }}>
                        <summary style={{ cursor: "pointer", padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#4338ca", display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4338ca" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                          Ce este Analiza de Oboseala Cognitiva (Time Decay)?
                        </summary>
                        <div style={{ padding: "0 18px 18px 18px", fontSize: 12, lineHeight: 1.7, color: "#374151" }}>
                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#4338ca" }}>Scop:</strong> Detecteaza daca respondentii isi pierd concentrarea pe masura ce evalueaza mai multi stimuli. Cand un participant evalueaza 8-10+ stimuli consecutiv, exista riscul ca ultimele evaluari sa fie mai putin atente — fie scorurile scad (raspund mecanic), fie timpul de evaluare scade (grabit).
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#4338ca" }}>Cum calculam:</strong> Impartim secventa de stimuli a fiecarui respondent in 3 treimi cronologice. Comparam mediile primei treimi cu cele ale ultimei treimi. Delta (%) arata schimbarea relativa: <span style={{ color: "#DC2626", fontWeight: 600 }}>negativ = scadere</span> (posibil oboseala), <span style={{ color: "#059669", fontWeight: 600 }}>pozitiv = crestere</span> (scoruri mai mari spre final), <span style={{ color: "#6B7280", fontWeight: 600 }}>aproape de 0 = stabil</span>.
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#4338ca" }}>Ce masuram (6 parametri):</strong>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginBottom: 12 }}>
                            {dims.map(d => (
                              <div key={d.key} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #e0e7ff" }}>
                                <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, marginTop: 4, flexShrink: 0 }} />
                                <div>
                                  <span style={{ fontWeight: 700, color: d.color }}>{d.label}</span>
                                  <span style={{ color: "#6B7280" }}> ({d.fullLabel})</span>
                                  <span style={{ color: "#9CA3AF" }}> — {d.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#4338ca" }}>Cum interpretam:</strong>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                            <div style={{ padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 2 }}>Bine (verde)</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Delta intre -3% si +3% — scoruri stabile, fara oboseala</div>
                            </div>
                            <div style={{ padding: "8px 12px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", marginBottom: 2 }}>Atentie (galben)</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Delta intre -3% si -10% — oboseala usoara, dar acceptabila</div>
                            </div>
                            <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 2 }}>Problema (rosu)</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Delta sub -10% — oboseala semnificativa, datele pot fi compromise</div>
                            </div>
                          </div>

                          <div style={{ padding: "10px 14px", background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 6, fontSize: 11, color: "#5b21b6" }}>
                            <strong>Timp:</strong> Daca timpul scade semnificativ spre final, respondentii grabesc evaluarile (rushing). Daca creste, pot fi obosite si delibereaza mai mult. Ideal: timp relativ constant.
                          </div>
                        </div>
                      </details>

                      {/* Header info + verdict */}
                      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" as const, alignItems: "center" }}>
                        <div style={{ padding: "10px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12 }}>
                          <span style={{ fontWeight: 700, color: "#166534" }}>{fa.completedRespondentsAnalyzed}</span>
                          <span style={{ color: "#6B7280" }}> respondenti analizati</span>
                        </div>
                        <div style={{ padding: "10px 16px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12 }}>
                          <span style={{ fontWeight: 700, color: "#854d0e" }}>{fa.maxPosition}</span>
                          <span style={{ color: "#6B7280" }}> stimuli per respondent</span>
                        </div>
                        <div style={{ padding: "10px 16px", background: fatigueVerdict.bg, border: `1px solid ${fatigueVerdict.border}`, borderRadius: 8, fontSize: 12, fontWeight: 700, color: fatigueVerdict.color, marginLeft: "auto" }}>
                          {fatigueVerdict.icon === "!" ? "!!!" : fatigueVerdict.icon === "~" ? "~" : "+++"} {fatigueVerdict.text}
                        </div>
                      </div>

                      {/* Delta summary cards */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        Prima Treime vs Ultima Treime — Variatie procentuala
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 0 }}>
                        Comparam media scorurilor din primii {Math.max(1, Math.floor((fa.maxPosition) / 3))} stimuli cu ultimii {Math.max(1, Math.floor((fa.maxPosition) / 3))} stimuli. Valori negative indica scadere (posibila oboseala).
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8, marginBottom: 24 }}>
                        {dims.map(d => {
                          const val = fa.delta[d.key];
                          const isNeg = val < 0;
                          const isTime = d.key === "time";
                          // Negative time delta = respondents are faster = possible fatigue/rushing
                          const concern = isTime ? isNeg : isNeg;
                          const severity = Math.abs(val) < 3 ? "neutral" : Math.abs(val) < 10 ? "mild" : "strong";
                          return (
                            <div key={d.key} style={{
                              padding: "14px 10px", borderRadius: 10, textAlign: "center" as const,
                              background: severity === "neutral" ? "#f9fafb" : concern ? (severity === "strong" ? "#fef2f2" : "#fefce8") : "#f0fdf4",
                              border: `1px solid ${severity === "neutral" ? "#e5e7eb" : concern ? (severity === "strong" ? "#fecaca" : "#fde68a") : "#bbf7d0"}`,
                            }}>
                              <div style={{ fontSize: 9, fontWeight: 700, color: d.color, marginBottom: 2, letterSpacing: 0.8, textTransform: "uppercase" as const }}>{d.fullLabel}</div>
                              <div style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, margin: "0 auto 6px" }} />
                              <div style={{ fontSize: 20, fontWeight: 800, color: concern ? (severity === "strong" ? "#DC2626" : "#D97706") : val > 0 ? "#059669" : "#374151" }}>
                                {val > 0 ? "+" : ""}{val}%
                              </div>
                              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>
                                {isTime
                                  ? `${fa.firstThird.avg_time}s → ${fa.lastThird.avg_time}s`
                                  : `${(fa.firstThird as any)[`avg_${d.key}`]} → ${(fa.lastThird as any)[`avg_${d.key}`]}`
                                }
                              </div>
                              <div style={{ fontSize: 9, marginTop: 4, color: severity === "neutral" ? "#9CA3AF" : concern ? "#DC2626" : "#059669", fontWeight: 600 }}>
                                {severity === "neutral" ? "Stabil" : concern ? (severity === "strong" ? "Atentie!" : "Minor") : "OK"}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Score trend chart (SVG line chart) */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                        Evolutia Scorurilor Medii per Pozitie Stimulus
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 0 }}>
                        Fiecare punct reprezinta media scorului la pozitia respectiva (al catelea stimul l-a evaluat respondentul). Liniile arata tendinta pe parcursul sondajului.
                      </p>
                      <div style={{ overflowX: "auto" as const, marginBottom: 24, border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fafafa" }}>
                        <svg viewBox={`0 0 ${chartW} ${chartH + 40}`} width={chartW} height={chartH + 40} style={{ display: "block" }}>
                          {/* Y-axis labels */}
                          {[0, 2, 4, 6, 8, 10].map(v => (
                            <g key={v}>
                              <line x1={30} y1={chartH - (v / maxScore) * chartH} x2={chartW} y2={chartH - (v / maxScore) * chartH} stroke="#e5e7eb" strokeWidth={0.5} />
                              <text x={25} y={chartH - (v / maxScore) * chartH + 4} textAnchor="end" fontSize={9} fill="#9CA3AF">{v}</text>
                            </g>
                          ))}
                          {/* Shaded regions for first/last third */}
                          {(() => {
                            const thirdSize = Math.max(1, Math.floor(fa.perPosition.length / 3));
                            const firstEnd = 40 + (thirdSize - 1) * ((chartW - 50) / Math.max(fa.perPosition.length - 1, 1));
                            const lastStart = 40 + (fa.perPosition.length - thirdSize) * ((chartW - 50) / Math.max(fa.perPosition.length - 1, 1));
                            return (
                              <>
                                <rect x={30} y={0} width={firstEnd - 30 + 10} height={chartH} fill="#3b82f6" opacity={0.04} rx={4} />
                                <rect x={lastStart - 10} y={0} width={chartW - lastStart + 10} height={chartH} fill="#ef4444" opacity={0.04} rx={4} />
                                <text x={40} y={12} fontSize={8} fill="#3b82f6" fontWeight={600}>Prima treime</text>
                                <text x={lastStart} y={12} fontSize={8} fill="#ef4444" fontWeight={600}>Ultima treime</text>
                              </>
                            );
                          })()}
                          {/* Lines for R, I, F, C, CTA */}
                          {([
                            { key: "avg_r" as const, color: "#DC2626" },
                            { key: "avg_i" as const, color: "#D97706" },
                            { key: "avg_f" as const, color: "#7C3AED" },
                            { key: "avg_c" as const, color: "#059669" },
                            { key: "avg_cta" as const, color: "#2563EB" },
                          ] as const).map(line => (
                            <polyline
                              key={line.key}
                              fill="none"
                              stroke={line.color}
                              strokeWidth={1.5}
                              strokeLinejoin="round"
                              points={fa.perPosition.map((p, i) => {
                                const x = 40 + i * ((chartW - 50) / Math.max(fa.perPosition.length - 1, 1));
                                const y = chartH - (p[line.key] / maxScore) * chartH;
                                return `${x},${y}`;
                              }).join(" ")}
                            />
                          ))}
                          {/* X-axis labels */}
                          {fa.perPosition.map((p, i) => {
                            const x = 40 + i * ((chartW - 50) / Math.max(fa.perPosition.length - 1, 1));
                            const showLabel = fa.perPosition.length <= 15 || i % Math.ceil(fa.perPosition.length / 15) === 0;
                            return showLabel ? (
                              <text key={i} x={x} y={chartH + 14} textAnchor="middle" fontSize={8} fill="#9CA3AF">#{p.position}</text>
                            ) : null;
                          })}
                          {/* Dots on each point */}
                          {fa.perPosition.map((p, i) => {
                            const x = 40 + i * ((chartW - 50) / Math.max(fa.perPosition.length - 1, 1));
                            return (
                              <g key={`dots-${i}`}>
                                {([
                                  { val: p.avg_r, color: "#DC2626" },
                                  { val: p.avg_i, color: "#D97706" },
                                  { val: p.avg_f, color: "#7C3AED" },
                                  { val: p.avg_c, color: "#059669" },
                                  { val: p.avg_cta, color: "#2563EB" },
                                ]).map((dot, di) => (
                                  <circle key={di} cx={x} cy={chartH - (dot.val / maxScore) * chartH} r={2.5} fill={dot.color} />
                                ))}
                              </g>
                            );
                          })}
                          {/* Legend with full names */}
                          {([
                            { label: "R (Relevanta)", color: "#DC2626" },
                            { label: "I (Interes)", color: "#D97706" },
                            { label: "F (Forma)", color: "#7C3AED" },
                            { label: "C (Claritate)", color: "#059669" },
                            { label: "CTA", color: "#2563EB" },
                          ]).map((leg, i) => (
                            <g key={leg.label} transform={`translate(${40 + i * 110}, ${chartH + 26})`}>
                              <rect width={12} height={4} fill={leg.color} rx={2} />
                              <text x={16} y={5} fontSize={9} fontWeight={600} fill={leg.color}>{leg.label}</text>
                            </g>
                          ))}
                        </svg>
                      </div>

                      {/* Time trend chart (separate) */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Timp Mediu per Pozitie (secunde)
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 0 }}>
                        Durata medie (in secunde) pe care respondentii o petrec evaluand stimulul de pe fiecare pozitie. Scaderea timpului indica posibila grabire (rushing).
                      </p>
                      <div style={{ overflowX: "auto" as const, border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, background: "#fafafa" }}>
                        <svg viewBox={`0 0 ${chartW} 140`} width={chartW} height={140} style={{ display: "block" }}>
                          {/* Bars with gradient coloring based on position */}
                          {fa.perPosition.map((p, i) => {
                            const barW = Math.max(8, ((chartW - 50) / fa.perPosition.length) - 4);
                            const x = 40 + i * ((chartW - 50) / fa.perPosition.length) + 2;
                            const barH = maxTime > 0 ? (p.avg_time / maxTime) * 100 : 0;
                            const posRatio = fa.perPosition.length > 1 ? i / (fa.perPosition.length - 1) : 0;
                            const barColor = posRatio < 0.33 ? "#3b82f6" : posRatio > 0.66 ? "#ef4444" : "#6B7280";
                            return (
                              <g key={i}>
                                <rect x={x} y={110 - barH} width={barW} height={barH} fill={barColor} rx={2} opacity={0.55} />
                                <text x={x + barW / 2} y={110 - barH - 4} textAnchor="middle" fontSize={8} fill="#374151" fontWeight={600}>
                                  {p.avg_time > 0 ? `${p.avg_time}s` : ""}
                                </text>
                                {(fa.perPosition.length <= 15 || i % Math.ceil(fa.perPosition.length / 15) === 0) && (
                                  <text x={x + barW / 2} y={124} textAnchor="middle" fontSize={8} fill="#9CA3AF">#{p.position}</text>
                                )}
                              </g>
                            );
                          })}
                          {/* Legend for time bars */}
                          <rect x={40} y={132} width={10} height={4} fill="#3b82f6" rx={2} opacity={0.55} />
                          <text x={54} y={136} fontSize={8} fill="#6B7280">Prima treime</text>
                          <rect x={140} y={132} width={10} height={4} fill="#6B7280" rx={2} opacity={0.55} />
                          <text x={154} y={136} fontSize={8} fill="#6B7280">Mijloc</text>
                          <rect x={210} y={132} width={10} height={4} fill="#ef4444" rx={2} opacity={0.55} />
                          <text x={224} y={136} fontSize={8} fill="#6B7280">Ultima treime</text>
                        </svg>
                      </div>

                      {/* Per-position data table */}
                      <details style={{ marginTop: 16 }}>
                        <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B7280", padding: "8px 0" }}>
                          Date brute per pozitie ({fa.perPosition.length} pozitii)
                        </summary>
                        <div style={{ overflowX: "auto" as const, marginTop: 8 }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
                            <thead>
                              <tr style={{ background: "#f3f4f6" }}>
                                {["Pozitie", "N resp.", "R (Relevanta)", "I (Interes)", "F (Forma)", "C (Claritate)", "CTA", "Timp (s)"].map(h => (
                                  <th key={h} style={{ padding: "6px 8px", fontWeight: 700, borderBottom: "2px solid #e5e7eb", textAlign: "center" as const, fontSize: 10 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {fa.perPosition.map((p, idx) => {
                                const posRatio = fa.perPosition.length > 1 ? idx / (fa.perPosition.length - 1) : 0;
                                const rowBg = posRatio < 0.33 ? "#eff6ff" : posRatio > 0.66 ? "#fef2f2" : undefined;
                                return (
                                  <tr key={p.position} style={{ borderBottom: "1px solid #f3f4f6", background: rowBg }}>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, fontWeight: 700 }}>#{p.position}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#9CA3AF" }}>{p.n}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#DC2626", fontWeight: 600 }}>{p.avg_r}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#D97706", fontWeight: 600 }}>{p.avg_i}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#7C3AED", fontWeight: 600 }}>{p.avg_f}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#059669", fontWeight: 600 }}>{p.avg_c}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#2563EB", fontWeight: 600 }}>{p.avg_cta}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#6B7280" }}>{p.avg_time}s</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </div>
                  );
                })()}

                {/* ── SUB-TAB: COMPLETION FUNNEL ── */}
                {resultsSubTab === "funnel" && (() => {
                  const cf = results.completionFunnel;
                  if (!cf || cf.funnelSteps.length === 0) {
                    return (
                      <div style={S.placeholderTab}>
                        <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                        <p style={{ color: "#6B7280", fontSize: 14 }}>Niciun respondent inca.</p>
                      </div>
                    );
                  }

                  const fmtTime = (sec: number) => sec >= 60 ? `${Math.floor(sec / 60)}m ${sec % 60}s` : `${sec}s`;
                  const maxReached = cf.funnelSteps[0]?.reached || 1;

                  return (
                    <div>
                      {/* ── FISA EXPLICATIVA ── */}
                      <details style={{ marginBottom: 20, border: "1px solid #bbf7d0", borderRadius: 10, background: "#f0fdf4", overflow: "hidden" }}>
                        <summary style={{ cursor: "pointer", padding: "14px 18px", fontSize: 13, fontWeight: 700, color: "#166534", display: "flex", alignItems: "center", gap: 8 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                          Ce este Funnel-ul de Completare?
                        </summary>
                        <div style={{ padding: "0 18px 18px 18px", fontSize: 12, lineHeight: 1.7, color: "#374151" }}>
                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#166534" }}>Scop:</strong> Arata cati respondenti au ajuns la fiecare etapa a sondajului si unde se opresc (abandon). Esential pentru transparenta metodologica — raporteaza rata de completare si identifici bottleneck-urile.
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#166534" }}>Cum calculam:</strong> Fiecare respondent are un camp <code style={{ background: "#dcfce7", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>step_completed</code> (ultimul pas salvat) si un camp <code style={{ background: "#dcfce7", padding: "1px 4px", borderRadius: 3, fontSize: 11 }}>completed_at</code> (data finalizarii). Numaram cati respondenti au ajuns la fiecare milestone (pas normalizat).
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#166534" }}>Etapele sondajului:</strong>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 6, marginBottom: 12 }}>
                            {([
                              { icon: "0", label: "Welcome", desc: "Pagina de bun venit — toata lumea care a deschis link-ul", color: "#2563EB" },
                              { icon: "1", label: "Demografie", desc: "Varsta, gen, educatie, ocupatie — profil socio-demografic", color: "#2563EB" },
                              { icon: "2", label: "Comportament", desc: "Obiceiuri media, frecventa interactiune cu reclame", color: "#2563EB" },
                              { icon: "3", label: "Psihografic", desc: "Atitudini si valori — scala Likert 1-7", color: "#2563EB" },
                              { icon: "4+", label: "Stimuli (1-N)", desc: "Evaluarea fiecarui stimul pe 5 dimensiuni (R, I, F, C, CTA) + brand", color: "#D97706" },
                              { icon: "FIN", label: "Completat", desc: "Sondajul a fost finalizat complet (completed_at setat)", color: "#059669" },
                            ]).map(s => (
                              <div key={s.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 10px", background: "white", borderRadius: 6, border: "1px solid #d1fae5" }}>
                                <div style={{ width: 24, height: 24, borderRadius: 6, background: s.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, flexShrink: 0 }}>{s.icon}</div>
                                <div>
                                  <span style={{ fontWeight: 700, color: s.color }}>{s.label}</span>
                                  <span style={{ color: "#9CA3AF" }}> — {s.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div style={{ marginBottom: 12 }}>
                            <strong style={{ color: "#166534" }}>Cum interpretam:</strong>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
                            <div style={{ padding: "8px 12px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 2 }}>Rata completare {'>'} 70%</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Excelent — sondajul nu e prea lung, respondentii raman angajati</div>
                            </div>
                            <div style={{ padding: "8px 12px", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", marginBottom: 2 }}>Rata completare 40-70%</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Acceptabil — identifica pasii cu cel mai mare abandon si simplifica-i</div>
                            </div>
                            <div style={{ padding: "8px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 6 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", marginBottom: 2 }}>Rata completare {'<'} 40%</div>
                              <div style={{ fontSize: 10, color: "#6B7280" }}>Problematic — sondajul e prea lung sau complex, necesita restructurare</div>
                            </div>
                          </div>

                          <div style={{ padding: "10px 14px", background: "#ecfdf5", border: "1px solid #a7f3d0", borderRadius: 6, fontSize: 11, color: "#065f46" }}>
                            <strong>Distributia timpului:</strong> Respondentii care completeaza in sub 5 minute probabil nu au citit cu atentie (speeders). Peste 60 minute poate indica intreruperi. Intervalul ideal e 15-30 minute pentru un sondaj cu 8-10 stimuli.
                          </div>
                        </div>
                      </details>

                      {/* KPI cards */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                        {([
                          { label: "Total inceputi", value: cf.totalStarted, desc: "Au deschis sondajul", color: "#2563EB", bg: "#eff6ff", border: "#bfdbfe" },
                          { label: "Total completati", value: cf.totalCompleted, desc: "Au terminat complet", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
                          { label: "Rata completare", value: `${cf.overallRate}%`, desc: `${cf.totalCompleted} din ${cf.totalStarted}`, color: cf.overallRate >= 70 ? "#059669" : cf.overallRate >= 40 ? "#D97706" : "#DC2626", bg: "#fafafa", border: "#e5e7eb" },
                          { label: "Timp median sesiune", value: fmtTime(cf.medianSessionTime), desc: `Media: ${fmtTime(cf.avgSessionTime)}`, color: "#6B7280", bg: "#f9fafb", border: "#e5e7eb" },
                        ]).map((kpi, i) => (
                          <div key={i} style={{ padding: "14px 12px", borderRadius: 10, textAlign: "center" as const, background: kpi.bg, border: `1px solid ${kpi.border}` }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: "#9CA3AF", letterSpacing: 0.8, marginBottom: 6, textTransform: "uppercase" as const }}>{kpi.label}</div>
                            <div style={{ fontSize: 24, fontWeight: 800, color: kpi.color }}>{kpi.value}</div>
                            <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>{kpi.desc}</div>
                          </div>
                        ))}
                      </div>

                      {/* Worst dropout alert */}
                      {cf.worstDropout.dropped > 0 && (
                        <div style={{ padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                          <div style={{ fontSize: 12 }}>
                            <span style={{ fontWeight: 700, color: "#991b1b" }}>Cel mai mare punct de abandon:</span>{" "}
                            <span style={{ color: "#374151" }}>
                              &laquo;{cf.worstDropout.label}&raquo; — {cf.worstDropout.dropped} respondenti pierduti ({cf.worstDropout.dropRate}% drop rate la acest pas)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Visual funnel */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                        Funnel de Completare — Cumulativ
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 0 }}>
                        Fiecare bara arata cati respondenti au ajuns cel putin la acea etapa. Cifrele rosii din dreapta arata cati s-au oprit inainte de pasul urmator.
                      </p>
                      <div style={{ marginBottom: 24 }}>
                        {cf.funnelSteps.map((fs, i) => {
                          const widthPct = maxReached > 0 ? Math.max(8, (fs.reached / maxReached) * 100) : 8;
                          // Correct color logic: step 0-3 = profile (blue), step 4+ = stimuli (amber), Completat = green
                          const isComplete = fs.label === "Completat";
                          const isProfile = fs.step <= 3 && !isComplete;
                          const barColor = isComplete ? "#059669" : isProfile ? "#2563EB" : "#D97706";

                          return (
                            <div key={`funnel-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                              <div style={{ width: 130, flexShrink: 0, fontSize: 11, fontWeight: 600, color: barColor, textAlign: "right" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                                {fs.label}
                              </div>
                              <div style={{ flex: 1, position: "relative" as const, height: 22, background: "#f3f4f6", borderRadius: 6 }}>
                                <div style={{
                                  width: `${widthPct}%`, height: "100%", borderRadius: 6,
                                  background: barColor, opacity: 0.65 + (fs.rate / 100) * 0.35,
                                  transition: "width 300ms ease",
                                }} />
                                <div style={{
                                  position: "absolute" as const, left: `${Math.min(widthPct + 1, 85)}%`, top: "50%", transform: "translateY(-50%)",
                                  fontSize: 11, fontWeight: 700, color: "#374151", whiteSpace: "nowrap" as const,
                                }}>
                                  {fs.reached} ({fs.rate}%)
                                </div>
                              </div>
                              {i > 0 && fs.dropped > 0 ? (
                                <div style={{ width: 65, flexShrink: 0, fontSize: 10, color: "#DC2626", fontWeight: 700, textAlign: "right" as const }}>
                                  -{fs.dropped} pierduti
                                </div>
                              ) : (
                                <div style={{ width: 65, flexShrink: 0 }} />
                              )}
                            </div>
                          );
                        })}
                        {/* Legend */}
                        <div style={{ display: "flex", gap: 16, marginTop: 12, paddingLeft: 140 }}>
                          {([
                            { label: "Profil (Demografie/Comportament/Psihografic)", color: "#2563EB" },
                            { label: "Stimuli (Evaluare materiale)", color: "#D97706" },
                            { label: "Completat", color: "#059669" },
                          ]).map(l => (
                            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#6B7280" }}>
                              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color, opacity: 0.7 }} />
                              {l.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Session time distribution */}
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Distributia Timpului de Completare
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10, marginTop: 0 }}>
                        In cat timp au finalizat respondentii sondajul. Sub 5 min = probabil speeders. Peste 60 min = posibile intreruperi.
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
                        {([
                          { label: "< 5 min", value: cf.timeBuckets.under5m, color: "#DC2626", desc: "Speeders" },
                          { label: "5-15 min", value: cf.timeBuckets.m5to15, color: "#D97706", desc: "Rapid" },
                          { label: "15-30 min", value: cf.timeBuckets.m15to30, color: "#059669", desc: "Ideal" },
                          { label: "30-60 min", value: cf.timeBuckets.m30to60, color: "#2563EB", desc: "Atent" },
                          { label: "> 60 min", value: cf.timeBuckets.over60m, color: "#7C3AED", desc: "Intrerupt?" },
                        ]).map(b => (
                          <div key={b.label} style={{ padding: "10px 8px", borderRadius: 10, textAlign: "center" as const, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                            <div style={{ fontSize: 22, fontWeight: 800, color: b.color }}>{b.value}</div>
                            <div style={{ fontSize: 10, color: "#6B7280", fontWeight: 600, marginTop: 2 }}>{b.label}</div>
                            <div style={{ fontSize: 9, color: "#9CA3AF", marginTop: 2 }}>{b.desc}</div>
                          </div>
                        ))}
                      </div>

                      {/* Funnel data table */}
                      <details>
                        <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#6B7280", padding: "8px 0" }}>
                          Date brute funnel ({cf.funnelSteps.length} etape)
                        </summary>
                        <div style={{ overflowX: "auto" as const, marginTop: 8 }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 11 }}>
                            <thead>
                              <tr style={{ background: "#f3f4f6" }}>
                                {["Pas normalizat", "Etapa", "Au ajuns", "Rata (%)", "Pierduti la acest pas"].map(h => (
                                  <th key={h} style={{ padding: "6px 8px", fontWeight: 700, borderBottom: "2px solid #e5e7eb", textAlign: "center" as const, fontSize: 10 }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {cf.funnelSteps.map((fs, i) => {
                                const isComplete = fs.label === "Completat";
                                const isProfile = fs.step <= 3 && !isComplete;
                                const rowColor = isComplete ? "#059669" : isProfile ? "#2563EB" : "#D97706";
                                return (
                                  <tr key={`table-${i}`} style={{ borderBottom: "1px solid #f3f4f6", background: isComplete ? "#f0fdf4" : undefined }}>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: "#9CA3AF", fontSize: 10 }}>{fs.step === 9999 ? "FIN" : fs.step}</td>
                                    <td style={{ padding: "5px 8px", fontWeight: 600, color: rowColor }}>{fs.label}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, fontWeight: 700 }}>{fs.reached}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, fontWeight: 600, color: fs.rate >= 70 ? "#059669" : fs.rate >= 40 ? "#D97706" : "#DC2626" }}>{fs.rate}%</td>
                                    <td style={{ padding: "5px 8px", textAlign: "center" as const, color: i > 0 && fs.dropped > 0 ? "#DC2626" : "#9CA3AF", fontWeight: fs.dropped > 0 ? 600 : 400 }}>
                                      {i === 0 ? "—" : fs.dropped > 0 ? `-${fs.dropped}` : "0"}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </details>
                    </div>
                  );
                })()}

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
              // Sum estimated KPI from all individual distribution links
              const distEstimated = distributions.reduce((sum, d) => sum + (d.estimated_completions || 0), 0);
              // Get general link completions from globalStats
              const generalCompleted = globalStats?.perDist?.find((d: any) => d.id === "__none__")?.completed || 0;
              const totalCompleted = distCompletions + generalCompleted;
              // Also check globalStats.completed if available (more reliable)
              const kpiCompleted = globalStats ? globalStats.completed : totalCompleted;
              const kpiRemaining = Math.max(TARGET - kpiCompleted, 0);
              // Percentage with decimals: show 2 decimals when < 1%, whole number when >= 1%
              const kpiPctRaw = TARGET > 0 ? Math.min((kpiCompleted / TARGET) * 100, 100) : 0;
              const kpiPct = kpiPctRaw >= 1 ? Math.round(kpiPctRaw) : parseFloat(kpiPctRaw.toFixed(2));
              const kpiPctDisplay = kpiPctRaw >= 1 ? String(Math.round(kpiPctRaw)) : kpiPctRaw.toFixed(2);
              const pctColor = kpiPctRaw >= 100 ? "#10b981" : kpiPctRaw >= 50 ? "#f59e0b" : "#DC2626";

              // ── Link Public General: KPI = TARGET minus all individual source KPIs ──
              const generalKpi = Math.max(TARGET - distEstimated, 0);
              // Completions for general link = total completions minus completions from named sources
              const generalCompletions = Math.max(kpiCompleted - distCompletions, 0);
              const generalRemaining = Math.max(generalKpi - generalCompletions, 0);
              const generalPctRaw = generalKpi > 0 ? Math.min((generalCompletions / generalKpi) * 100, 100) : 0;
              const generalPct = generalPctRaw >= 1 ? Math.round(generalPctRaw) : parseFloat(generalPctRaw.toFixed(2));
              const generalPctDisplay = generalPctRaw >= 1 ? String(Math.round(generalPctRaw)) : generalPctRaw.toFixed(2);

              return (
                <>
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
                        {kpiPctRaw >= 100 && (
                          <Trophy size={18} style={{ color: "#10b981" }} />
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: kpiPctDisplay.length > 4 ? 42 : 56, fontWeight: 900, color: pctColor, fontFamily: "JetBrains Mono, monospace", lineHeight: 1 }}>
                          {kpiPctDisplay}
                        </span>
                        <span style={{ fontSize: 24, fontWeight: 700, color: pctColor, fontFamily: "JetBrains Mono, monospace" }}>%</span>
                      </div>
                      {/* Mini progress bar */}
                      <div style={{ marginTop: 8 }}>
                        <div style={{ width: "100%", height: 6, background: "#1e293b", borderRadius: 4, overflow: "hidden", border: "1px solid #334155" }}>
                          <div style={{
                            height: "100%",
                            width: `${Math.max(kpiPctRaw, 0.5)}%`,
                            background: kpiPctRaw >= 100 ? "linear-gradient(90deg, #10b981, #34d399)" : kpiPctRaw >= 50 ? "linear-gradient(90deg, #f59e0b, #fbbf24)" : "linear-gradient(90deg, #DC2626, #ef4444)",
                            borderRadius: 4,
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Public link card — with computed KPI stats */}
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

                  {/* ── Stats row for general link ── */}
                  <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" as const, alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Users size={14} style={{ color: "#6B7280" }} />
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>
                        {generalCompletions.toLocaleString("ro-RO")}
                      </span>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                        / {generalKpi.toLocaleString("ro-RO")} completari
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "JetBrains Mono, monospace" }}>
                        KPI = {TARGET.toLocaleString("ro-RO")} &minus; {distEstimated.toLocaleString("ro-RO")} (surse)
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  {generalKpi > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div style={S.counterBar}>
                        <div style={{
                          ...S.counterFill,
                          width: `${Math.max(generalPctRaw, generalPctRaw > 0 ? 0.5 : 0)}%`,
                          background: generalPctRaw >= 100 ? "#059669" : "#DC2626",
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4, display: "block" }}>
                        {generalPctDisplay}% completat
                      </span>
                    </div>
                  )}
                </div>
                </>
              );
            })()}

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

            {/* Distribution gallery */}
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
              <>
                {/* ── 3-column gallery grid ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, marginBottom: 16 }}>
                  {distributions.map((dist, idx) => {
                    const link = getDistLink(dist.tag);
                    const pctRaw = dist.estimated_completions > 0
                      ? Math.min(100, (dist.completions / dist.estimated_completions) * 100)
                      : 0;
                    const pctDisplay = pctRaw >= 1 ? String(Math.round(pctRaw)) : pctRaw.toFixed(2);
                    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
                    const isEditing = editingDistId === dist.id;

                    return (
                      <div key={dist.id} style={{
                        background: "#fff",
                        border: isEditing ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                        borderRadius: 12,
                        padding: isEditing ? 15 : 16,
                        position: "relative" as const,
                        display: "flex",
                        flexDirection: "column" as const,
                        minWidth: 0,
                        overflow: "hidden" as const,
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}>
                        {/* Number badge + action buttons */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <div style={{
                            width: 24, height: 24, borderRadius: 6,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 11, fontWeight: 800, color: "#fff",
                            background: isEditing ? "#3b82f6" : "#DC2626",
                            fontFamily: "JetBrains Mono, monospace",
                          }}>
                            {idx + 1}
                          </div>
                          {!isEditing && (
                            <div style={{ display: "flex", gap: 4 }}>
                              <button
                                style={{ ...S.galleryEditBtn, padding: "4px 6px", fontSize: 11 }}
                                title="Editeaza"
                                onClick={() => startEditDist(dist)}
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                style={{ ...S.iconBtnDanger, padding: "4px 6px" }}
                                title="Sterge"
                                onClick={() => deleteDistribution(dist.id)}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditing ? (
                          /* ── Inline edit form ── */
                          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, flex: 1 }}>
                            <div>
                              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 3 }}>NUME</label>
                              <input value={editDistName} onChange={(e) => setEditDistName(e.target.value)} style={{ ...S.catEditInput, width: "100%", fontSize: 13, fontWeight: 700 }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 3 }}>DESCRIERE</label>
                              <input value={editDistDesc} onChange={(e) => setEditDistDesc(e.target.value)} placeholder="Descriere optionala" style={{ ...S.catEditInput, width: "100%" }} />
                            </div>
                            <div>
                              <label style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#6B7280", display: "block", marginBottom: 3 }}>ESTIMARE</label>
                              <input type="number" value={editDistEstimate} onChange={(e) => setEditDistEstimate(e.target.value)} placeholder="ex: 100" style={{ ...S.catEditInput, width: "100%" }} />
                            </div>
                            <div style={{ padding: "4px 8px", background: "#fef2f2", borderRadius: 4, fontSize: 10, color: "#9CA3AF" }}>
                              TAG: <span style={{ fontFamily: "JetBrains Mono, monospace" }}>{dist.tag}</span>
                            </div>
                            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                              <button style={{ ...S.addCatBtn, fontSize: 12, padding: "5px 10px", opacity: editDistSaving ? 0.6 : 1 }} onClick={saveEditDist} disabled={editDistSaving}>
                                {editDistSaving ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={12} />}
                                {editDistSaving ? "..." : "Salveaza"}
                              </button>
                              <button style={{ ...S.galleryEditBtn, fontSize: 12, padding: "5px 10px" }} onClick={cancelEditDist}>
                                <X size={12} /> Anuleaza
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* ── Normal card view ── */
                          <>
                            {/* Name + description */}
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px 0", lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{dist.name}</h4>
                            {dist.description && (
                              <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 8px 0", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>{dist.description}</p>
                            )}
                            {!dist.description && <div style={{ marginBottom: 8 }} />}

                            {/* Link (truncated) */}
                            <div style={{
                              padding: "6px 8px", background: "#f9fafb", border: "1px solid #e5e7eb",
                              borderRadius: 6, fontSize: 10, fontFamily: "JetBrains Mono, monospace",
                              color: "#DC2626", overflow: "hidden", textOverflow: "ellipsis",
                              whiteSpace: "nowrap" as const, marginBottom: 8,
                            }}>
                              ...wizard?tag={dist.tag}
                            </div>

                            {/* Action buttons row */}
                            <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                              <button
                                style={{ ...S.galleryEditBtn, gap: 4, fontSize: 11, padding: "4px 8px", flex: 1, justifyContent: "center" }}
                                onClick={() => copyToClipboard(link, dist.id)}
                              >
                                {copiedId === dist.id ? <Check size={11} style={{ color: "#059669" }} /> : <Copy size={11} />}
                                {copiedId === dist.id ? "Copiat!" : "Copiaza"}
                              </button>
                              <button
                                style={{ ...S.galleryEditBtn, gap: 4, fontSize: 11, padding: "4px 8px" }}
                                onClick={() => setShowQr(showQr === dist.id ? null : dist.id)}
                              >
                                <QrCode size={11} />
                                QR
                              </button>
                              <a
                                href={link} target="_blank" rel="noopener noreferrer"
                                style={{ ...S.galleryEditBtn, gap: 4, fontSize: 11, padding: "4px 8px", textDecoration: "none" }}
                              >
                                <ExternalLink size={11} />
                              </a>
                            </div>

                            {/* QR code (collapsible) */}
                            {showQr === dist.id && (
                              <div style={{ marginBottom: 10, padding: 10, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, textAlign: "center" as const }}>
                                <img src={qrUrl} alt={`QR ${dist.name}`} width={140} height={140} style={{ margin: "0 auto", borderRadius: 4 }} />
                                <p style={{ fontSize: 10, color: "#6B7280", marginTop: 6 }}>Click dreapta &rarr; Save Image</p>
                              </div>
                            )}

                            {/* Stats compact */}
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" as const, marginTop: "auto" }}>
                              <Users size={12} style={{ color: "#6B7280" }} />
                              <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{dist.completions}</span>
                              <span style={{ fontSize: 11, color: "#9CA3AF" }}>/ {dist.estimated_completions}</span>
                              <span style={{ fontSize: 10, color: "#d1d5db" }}>|</span>
                              <span style={{ fontSize: 10, color: "#9CA3AF" }}>{dist.started} incep.</span>
                            </div>

                            {/* Tag */}
                            <div style={{ marginTop: 4, fontSize: 9, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", fontFamily: "JetBrains Mono, monospace" }}>
                              TAG: {dist.tag}
                            </div>

                            {/* Progress bar */}
                            {dist.estimated_completions > 0 && (
                              <div style={{ marginTop: 6 }}>
                                <div style={{ ...S.counterBar, height: 4 }}>
                                  <div style={{
                                    ...S.counterFill,
                                    height: 4,
                                    width: `${Math.max(pctRaw, pctRaw > 0 ? 0.5 : 0)}%`,
                                    background: pctRaw >= 100 ? "#059669" : "#DC2626",
                                  }} />
                                </div>
                                <span style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2, display: "block" }}>
                                  {pctDisplay}%
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
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

        {/* ═══ INTERPRETARE TAB ═══ */}
        {activeTab === "interpretare" && (() => {
          if (resultsLoading) {
            return (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Loader2 size={32} style={{ color: "#6B7280", animation: "spin 1s linear infinite" }} />
                <p style={{ color: "#6B7280", fontSize: 13, marginTop: 12 }}>Se incarca datele...</p>
              </div>
            );
          }
          if (!results || results.stimuliResults.length === 0) {
            return (
              <div style={S.placeholderTab}>
                <Brain size={48} style={{ color: "#d1d5db" }} />
                <p style={{ color: "#6B7280", fontSize: 14, marginTop: 12 }}>Niciun raspuns inca pentru a genera interpretarea formulei.</p>
              </div>
            );
          }

          // ── Helper functions ──
          const GATE = 3;
          const getZone = (score: number): string => {
            if (score <= 20) return "Critical";
            if (score <= 50) return "Noise";
            if (score <= 80) return "Medium";
            return "Supreme";
          };
          const getZoneColor = (zone: string): string => {
            if (zone === "Critical") return "#DC2626";
            if (zone === "Noise") return "#D97706";
            if (zone === "Medium") return "#2563EB";
            return "#059669";
          };
          const getZoneBg = (zone: string): string => {
            if (zone === "Critical") return "#DC262615";
            if (zone === "Noise") return "#D9770615";
            if (zone === "Medium") return "#2563EB15";
            return "#05966915";
          };
          const hypothesisPct = (cF: number, cP: number): number => {
            const delta = Math.abs(cF - cP);
            return Math.round(Math.max(0, Math.min(100, 100 - (delta / 110 * 100))) * 10) / 10;
          };
          const getValidationColor = (pct: number): string => {
            if (pct >= 80) return "#059669";
            if (pct >= 50) return "#D97706";
            return "#DC2626";
          };
          const getValidationLabel = (pct: number): string => {
            if (pct >= 90) return "Foarte puternic validata";
            if (pct >= 80) return "Puternic validata";
            if (pct >= 70) return "Validata";
            if (pct >= 50) return "Partial validata";
            if (pct >= 30) return "Slab validata";
            return "Nevalidata";
          };
          const getConclusion = (pct: number, avgR: number, zoneMatch: boolean): string => {
            const gateOk = avgR >= GATE;
            if (pct >= 80 && gateOk && zoneMatch) {
              return `Formula R+(I×F)=C este validata. Scorurile calculate si cele percepute se afla in aceeasi zona (${getZone(pct)}), iar Relevance Gate este depasit (R=${avgR.toFixed(1)} >= ${GATE}). Ipoteza este confirmata cu ${pct}% acuratete.`;
            }
            if (pct >= 50) {
              return `Formula R+(I×F)=C este partial validata (${pct}%). ${!gateOk ? `Relevance Gate nu este depasit (R=${avgR.toFixed(1)} < ${GATE}), ceea ce indica lipsa de relevanta perceputa.` : ""} ${!zoneMatch ? "Scorurile calculate si percepute se afla in zone diferite." : ""} Sunt necesare ajustari.`;
            }
            return `Formula R+(I×F)=C nu este validata in acest context (${pct}%). Diferenta semnificativa intre scorul calculat si cel perceput sugereaza ca factorii R, I si F nu explica suficient variabilitatea lui C.`;
          };

          // ── Interpretation content generator ──
          const getInterpretation = (key: string, val: string, ctx?: Record<string, unknown>): { sections: { heading: string; text: string }[] } => {
            const v = parseFloat(val) || 0;
            const _ctx = ctx || {};
            switch (key) {
              case "hypothesis_total": return { sections: [
                { heading: "Ce reprezinta acest rezultat", text: `Procentul de ${val}% indica gradul de acuratete cu care formula RIFC R+(I×F)=C prezice scorul de Claritate (C) perceput de respondenti. Este calculat ca diferenta relativa intre C formula (calculat matematic din R, I si F) si C perceput (evaluat direct de respondent), raportata la scala maxima de 110 puncte.` },
                { heading: "Cum se aplica formula", text: `Formula R+(I×F)=C combina trei componente: R (Relevanta) ca baza aditionala, iar I (Interesul) inmultit cu F (Forma/Calitatea Executiei) ca amplificator multiplicativ. Scorul final C formula este comparat cu scorul C perceput — evaluarea directa a respondentului privind cat de clar si convingator este mesajul.` },
                { heading: "De ce arata formula acest rezultat", text: v >= 80 ? `Rezultatul de ${val}% indica o aliniere puternica intre modelul matematic si perceptia reala. Factorii R, I si F explica in mare masura variabilitatea scorului de Claritate, ceea ce sustine ipoteza RIFC.` : v >= 50 ? `Rezultatul de ${val}% arata o aliniere partiala. Exista factori externi (context cultural, experienta anterioara cu brandul, starea emotionala) care influenteaza perceptia C dincolo de ce surprinde formula.` : `Rezultatul de ${val}% indica o discrepanta semnificativa. Factorii R, I si F nu explica suficient perceptia C in acest context — sunt necesari factori suplimentari sau recalibrare.` },
                { heading: "Cum se interpreteaza", text: `Peste 80% = ipoteza puternic validata. 50-80% = partial validata, necesita investigare suplimentara. Sub 50% = nevalidata, formula nu prezice comportamentul in acest context. Rezultatul trebuie corelat cu Relevance Gate si Zone Match pentru o imagine completa.` },
                { heading: "Concluzie", text: `${v >= 80 ? "Formula RIFC demonstreaza capacitate predictiva solida." : v >= 50 ? "Formula RIFC are potentialul de a prezice, dar necesita refinare." : "Formula RIFC nu reuseste sa prezica in acest context."} Acest scor de ${val}% ${v >= 80 ? "sustine publicarea rezultatelor ca evidenta pentru validarea ipotezei." : v >= 50 ? "justifica continuarea cercetarii cu un esantion mai mare sau ajustari metodologice." : "sugereaza revizuirea modelului teoretic sau a instrumentului de masurare."}` },
              ]};
              case "score_r": return { sections: [
                { heading: "Ce reprezinta R (Relevanta)", text: `Scorul R = ${val} masoara cat de relevant percepe respondentul mesajul de marketing in raport cu nevoile, interesele sau contextul sau personal. Se evalueaza pe o scala de la 1 la 5 (1 = complet irelevant, 5 = foarte relevant).` },
                { heading: "Cum se aplica in formula", text: `In formula R+(I×F)=C, R este componenta aditionala de baza. Relevanta actioneaza ca un "gate" (prag): daca R < ${GATE}, formula prezice ca materialul va avea impact scazut, indiferent cat de interesant sau bine executat este. R se aduna direct la produsul I×F.` },
                { heading: "De ce arata acest rezultat", text: v >= 4 ? `R = ${val} indica o relevanta ridicata. Respondentii considera ca mesajul se adreseaza direct nevoilor lor. Aceasta baza solida permite amplificarea prin I×F.` : v >= GATE ? `R = ${val} indica o relevanta acceptabila. Mesajul trece Relevance Gate (>= ${GATE}), dar exista spatiu de imbunatatire a targetarii.` : `R = ${val} indica relevanta scazuta, sub pragul Gate de ${GATE}. Mesajul nu rezoneza cu audienta tinta, ceea ce diminueaza drastic eficacitatea, indiferent de calitatea executiei (F) sau interesul generat (I).` },
                { heading: "Cum se interpreteaza", text: `R >= 4: Excelent — mesajul este foarte relevant. R >= ${GATE}: Acceptabil — formula poate functiona. R < ${GATE}: Gate Fail — materialul necesita re-targetare sau reformulare fundamentala a mesajului.` },
                { heading: "Concluzie", text: `Cu R = ${val}, ${v >= GATE ? `materialul depaseste Relevance Gate si poate beneficia de amplificarea I×F.` : `materialul nu depaseste Relevance Gate — prioritatea este imbunatatirea relevantei inainte de a optimiza Interesul sau Forma.`}` },
              ]};
              case "score_i": return { sections: [
                { heading: "Ce reprezinta I (Interes)", text: `Scorul I = ${val} masoara cat de captivant si interesant percepe respondentul materialul de marketing. Se evalueaza pe o scala de la 1 la 5 (1 = plictisitor, 5 = extrem de interesant/captivant).` },
                { heading: "Cum se aplica in formula", text: `In formula R+(I×F)=C, I este primul factor al componentei multiplicative. Interesul se inmulteste cu Forma (F) — daca continutul este interesant DAR prost executat, produsul I×F va fi modest. Daca este si interesant SI bine executat, amplificarea este maxima.` },
                { heading: "De ce arata acest rezultat", text: v >= 4 ? `I = ${val} arata ca materialul capteaza atentia. Continutul, mesajul sau povestea rezoneza cu audienta si genereaza curiozitate sau implicare emotionala.` : v >= 3 ? `I = ${val} arata un interes moderat. Materialul nu este plictisitor, dar nici nu iese in evidenta — exista potential de imbunatatire prin storytelling, hooks mai puternice sau elemente de noutate.` : `I = ${val} arata un interes scazut. Materialul nu reuseste sa capteze atentia — continutul este perceput ca generic, repetitiv sau fara valoare adaugata.` },
                { heading: "Cum se interpreteaza", text: `I >= 4: Materialul genereaza interes puternic — amplificarea prin F va fi semnificativa. I 3-4: Interes moderat — produsul I×F va fi mediu. I < 3: Interes scazut — chiar si o executie excelenta (F mare) nu va compensa.` },
                { heading: "Concluzie", text: `Cu I = ${val}, ${v >= 4 ? "materialul are un continut captivant care amplifica impactul formulei." : v >= 3 ? "materialul mentine atentia dar nu iese in evidenta — optimizarea continutului poate creste semnificativ scorul C." : "materialul necesita o reformulare fundamentala a continutului pentru a genera interes."}` },
              ]};
              case "score_f": return { sections: [
                { heading: "Ce reprezinta F (Forma)", text: `Scorul F = ${val} masoara calitatea executiei vizuale, audio si de design a materialului de marketing. Se evalueaza pe o scala de la 1 la 5 (1 = executie foarte slaba, 5 = executie exceptionala/profesionala).` },
                { heading: "Cum se aplica in formula", text: `In formula R+(I×F)=C, F este al doilea factor al componentei multiplicative. Forma amplifica (sau diminueaza) Interesul: un continut interesant (I mare) cu executie excelenta (F mare) produce un produs I×F maxim. Forma slaba "franeaza" impactul chiar si al celui mai bun continut.` },
                { heading: "De ce arata acest rezultat", text: v >= 4 ? `F = ${val} indica o executie de inalta calitate. Designul, layoutul, tipografia, culorile si elementele vizuale sunt percepute ca profesionale si coerente.` : v >= 3 ? `F = ${val} indica o executie acceptabila. Nu sunt erori grave, dar materialul nu impresioneza — poate fi imbunatatit prin design mai atent, imagine mai clara, sau layout mai profesional.` : `F = ${val} indica o executie slaba. Materialul este perceput ca neprofesional, cu probleme vizuale, text greu de citit, sau design necorespunzator.` },
                { heading: "Cum se interpreteaza", text: `F >= 4: Executie profesionala — amplifica puternic Interesul. F 3-4: Executie acceptabila — nu obstructioneaza, dar nici nu adauga. F < 3: Executie problematica — diminueaza impactul indiferent de calitatea continutului.` },
                { heading: "Concluzie", text: `Cu F = ${val}, ${v >= 4 ? "calitatea executiei amplifica maxim impactul continutului in formula I×F." : v >= 3 ? "executia este acceptabila dar poate fi optimizata pentru a creste multiplicatorul I×F." : "executia necesita imbunatatiri semnificative — este cel mai rapid mod de a creste scorul C final."}` },
              ]};
              case "score_cf": return { sections: [
                { heading: "Ce reprezinta C formula", text: `Scorul C formula = ${val} este rezultatul matematic al formulei RIFC: R+(I×F)=C. Acest scor prezice cat de clar si convingator ar trebui sa fie mesajul, pe baza celor trei componente masurate (R, I, F). Scala este 0-110.` },
                { heading: "Cum se calculeaza", text: `R+(I×F)=C. Exemplu: daca R = ${_ctx.r || "?"}, I = ${_ctx.i || "?"}, F = ${_ctx.f || "?"}, atunci ${_ctx.r || "?"} + (${_ctx.i || "?"} × ${_ctx.f || "?"}) = ${val}. R se aduna direct (baza de relevanta), iar I×F reprezinta amplificarea multiplicativa (interes × calitate executie).` },
                { heading: "De ce arata acest rezultat", text: `C formula = ${val} reflecta combinatia celor trei factori. ${v > 80 ? "Scorul ridicat indica ca toate cele trei componente sunt puternice, iar amplificarea I×F este semnificativa." : v > 50 ? "Scorul mediu sugereaza ca cel putin una dintre componente limiteaza rezultatul — fie relevanta este scazuta, fie produsul I×F nu amplifica suficient." : "Scorul scazut indica slabiciuni in mai multe componente sau un efect de franare reciproca."}` },
                { heading: "Zone de performanta", text: `0-20 (Critical): Materialul nu comunica eficient. 21-50 (Noise): Materialul exista dar nu se diferentiaza. 51-80 (Medium): Materialul comunica acceptabil. 81-110 (Supreme): Materialul are impact maxim. C formula = ${val} se afla in zona ${getZone(v)}.` },
                { heading: "Concluzie", text: `Scorul predictiv de ${val} plaseaza materialul in zona ${getZone(v)}. ${v > 80 ? "Formula prezice un impact puternic — daca C perceput confirma, ipoteza este validata." : v > 50 ? "Formula prezice un impact moderat — comparatia cu C perceput va arata daca modelul este calibrat corect." : "Formula prezice un impact scazut — necesita interventie pe factorii cu scoruri mici."}` },
              ]};
              case "score_cp": return { sections: [
                { heading: "Ce reprezinta C perceput", text: `Scorul C perceput = ${val} este evaluarea directa a respondentului: cat de clar, convingator si memorabil percepe mesajul materialului de marketing. Este masurat independent de R, I si F, pe aceeasi scala 0-110.` },
                { heading: "Rolul in validarea formulei", text: `C perceput este "realitatea" — perceptia reala a respondentului. Formula RIFC prezice ca R+(I×F)=C ar trebui sa aproximeze C perceput. Comparand cele doua (C formula vs C perceput), validam daca formula functioneaza: daca sunt apropiate, formula prezice corect; daca difera mult, formula nu surprinde toti factorii.` },
                { heading: "De ce arata acest rezultat", text: `C perceput = ${val} reflecta experienta subiectiva a respondentului cu materialul. ${v > 80 ? "Respondentul a perceput mesajul ca fiind foarte clar si convingator — indiferent de formula, impactul real este puternic." : v > 50 ? "Respondentul a perceput mesajul ca moderat de clar — exista loc de imbunatatire." : "Respondentul nu a fost convins de mesaj — materialul nu comunica eficient."}` },
                { heading: "Cum se interpreteaza", text: `C perceput este ancora de validare. Daca C formula ≈ C perceput → formula functioneaza. Daca C formula >> C perceput → formula supraestimeaza (materialul pare bun pe hartie dar nu convinge). Daca C formula << C perceput → formula subestimeaza (exista factori pozitivi pe care formula nu ii surprinde).` },
                { heading: "Concluzie", text: `Scorul C perceput de ${val} (zona ${getZone(v)}) reprezinta evaluarea reala a audientei. ${_ctx.cf ? `Comparat cu C formula = ${_ctx.cf}, diferenta Delta = ${_ctx.delta} indica ${Math.abs(v - Number(_ctx.cf)) < 15 ? "o buna aliniere intre predictie si realitate." : "o discrepanta care necesita investigare suplimentara."}` : ""}` },
              ]};
              case "score_delta": return { sections: [
                { heading: "Ce reprezinta Delta", text: `Delta = ${val} este diferenta absoluta intre C formula si C perceput: |Cf - Cp|. Masoara cat de precisa este predictia formulei RIFC — cu cat Delta este mai mica, cu atat formula prezice mai exact.` },
                { heading: "Cum se calculeaza", text: `Delta = |C formula - C perceput| = |${_ctx.cf || "?"} - ${_ctx.cp || "?"}| = ${val}. Pe o scala de 0-110, o Delta mica (< 10) indica predictie excelenta, iar una mare (> 30) indica discrepanta semnificativa.` },
                { heading: "De ce arata acest rezultat", text: `Delta = ${val} ${v < 10 ? "indica o predictie excelenta — formula RIFC surprinde cu acuratete factorii care influenteaza perceptia C." : v < 20 ? "indica o predictie buna — exista o aliniere solida intre model si realitate, cu o mica variatie acceptabila." : v < 30 ? "indica o predictie moderata — exista factori care influenteaza perceptia C dincolo de R, I si F." : "indica o discrepanta semnificativa — formula nu surprinde factorii cheie care influenteaza perceptia respondentilor."}` },
                { heading: "Cum se interpreteaza", text: `Delta 0-10: Predictie excelenta — formula este calibrata corect. Delta 10-20: Predictie buna — variatie acceptabila. Delta 20-30: Predictie moderata — necesita investigare. Delta > 30: Discrepanta — formula nu functioneaza in acest context.` },
                { heading: "Concluzie", text: `O Delta de ${val} ${v < 15 ? "sustine validitatea formulei RIFC ca instrument de predictie." : v < 25 ? "sugereaza ca formula necesita calibrare fina, dar conceptul fundamental este viabil." : "indica nevoia de a integra factori suplimentari in model sau de a reconsidera ponderile componentelor."}` },
              ]};
              case "gate": return { sections: [
                { heading: "Ce reprezinta Relevance Gate", text: `Relevance Gate arata ca ${_ctx.pass || 0} din ${_ctx.total || 0} materiale (${val}%) au un scor R (Relevanta) >= ${GATE}. Acest prag este conditia minima pentru ca formula RIFC sa poata functiona — fara relevanta, nici Interesul nici Forma nu conteaza.` },
                { heading: "Cum functioneaza in formula", text: `Gate-ul de Relevanta este un pre-filtru conceptual: daca R < ${GATE}, materialul nu trece pragul minim de relevanta pentru audienta. Chiar daca I = 5 si F = 5, un R de 1 sau 2 inseamna ca mesajul nu se adreseaza nevoilor reale ale respondentului, iar formula prezice un C scazut.` },
                { heading: "De ce arata acest rezultat", text: `${val}% din materiale trec Gate-ul. ${v >= 80 ? "Aceasta rata ridicata indica ca materialele testate sunt relevante pentru audienta — premisa fundamentala a studiului este indeplinita." : v >= 50 ? "Rata moderata sugereaza ca o parte din materiale nu sunt relevante pentru audienta testata — fie targetarea a fost imprecisa, fie unele materiale necesita reformulare." : "Rata scazuta indica o problema fundamentala de targetare — materialele nu sunt relevante pentru audienta care le-a evaluat."}` },
                { heading: "Cum se interpreteaza", text: `>= 80% Gate Pass: Excelent — esantionul si materialele sunt bine aliniate. 50-80%: Acceptabil — dar rezultatele pot fi distorsionate de materialele sub-gate. < 50%: Problematic — concluziile studiului sunt compromise de lipsa de relevanta.` },
                { heading: "Concluzie", text: `Cu ${val}% materiale trecand Gate-ul, ${v >= 70 ? "premisa de relevanta este indeplinita si rezultatele formulei sunt fiabile." : v >= 40 ? "rezultatele trebuie interpretate cu prudenta, separand materialele sub-gate de cele peste prag." : "studiul necesita fie o alta audienta tinta, fie materiale cu relevanta mai mare."}` },
              ]};
              case "zonematch": return { sections: [
                { heading: "Ce reprezinta Zone Match", text: `Zone Match = ${val}% arata ca ${_ctx.match || 0} din ${_ctx.total || 0} materiale au C formula si C perceput in aceeasi zona de performanta (Critical/Noise/Medium/Supreme). Aceasta este o masura calitativa a preciziei formulei.` },
                { heading: "Cum functioneaza", text: `Scala 0-110 este impartita in 4 zone: Critical (0-20), Noise (21-50), Medium (51-80), Supreme (81-110). Daca formula plaseaza un material in zona Medium si respondentul il percepe tot in Medium, avem un Zone Match — formula prezice corect "categoria" de impact, chiar daca scorul exact difera putin.` },
                { heading: "De ce arata acest rezultat", text: `${val}% Zone Match ${v >= 80 ? "arata ca formula clasifica corect materialele in categorii de impact — chiar daca scorurile exacte difera usor, directia este corecta." : v >= 50 ? "arata o clasificare partiala corecta — formula nimeresste zona in jumatate din cazuri, dar exista materiale unde predictia si realitatea sunt in zone diferite." : "arata o clasificare slaba — formula plaseaza materialele in zone diferite fata de perceptia reala, ceea ce indica o problema de calibrare."}` },
                { heading: "Cum se interpreteaza", text: `>= 80%: Formula clasifica corect — nivel inalt de incredere. 50-80%: Clasificare partiala — formula functioneaza dar nu pentru toate tipurile de materiale. < 50%: Clasificare slaba — formula necesita recalibrare sau factori suplimentari.` },
                { heading: "Concluzie", text: `Un Zone Match de ${val}% ${v >= 70 ? "confirma ca formula RIFC are o capacitate solida de clasificare a materialelor in categorii de impact." : v >= 40 ? "sugereaza ca formula are potentialul de clasificare, dar necesita raffinare pentru anumite tipuri de materiale sau industrii." : "indica nevoia de a reconsidera structura formulei sau factorii inclusi."}` },
              ]};
              case "materials": return { sections: [
                { heading: "Ce reprezinta", text: `Au fost analizate ${val} materiale de marketing care au primit cel putin un raspuns de la respondenti. Totalul de ${_ctx.responses || 0} raspunsuri ofera baza statistica pentru calculul mediilor R, I, F si C.` },
                { heading: "De ce conteaza numarul", text: `Cu cat numarul de materiale analizate este mai mare, cu atat validarea formulei este mai robusta statistic. Fiecare material reprezinta un "test" independent al formulei — daca formula functioneaza pe multe materiale diverse, evidenta este mai puternica.` },
                { heading: "Cum se interpreteaza", text: `${v >= 20 ? `${val} materiale ofera un esantion solid pentru concluzii statistice.` : v >= 10 ? `${val} materiale ofera un esantion acceptabil, dar concluziile trebuie tratate cu prudenta.` : `${val} materiale reprezinta un esantion mic — rezultatele sunt preliminare si orientative.`}` },
                { heading: "Concluzie", text: `Analiza pe ${val} materiale si ${_ctx.responses || 0} raspunsuri ${v >= 15 ? "ofera o baza suficienta pentru concluzii semnificative despre validitatea formulei RIFC." : "ofera o indicatie preliminara — se recomanda extinderea esantionului pentru concluzii definitive."}` },
              ]};
              case "zones": return { sections: [
                { heading: "Ce reprezinta distributia pe zone", text: `Graficul compara cum sunt distribuite materialele pe cele 4 zone de performanta (Critical, Noise, Medium, Supreme) — o data calculat prin formula (C formula) si o data perceput de respondenti (C perceput).` },
                { heading: "Cum se aplica", text: `Cele 4 zone sunt: Critical (0-20) = materialul nu comunica; Noise (21-50) = materialul exista dar nu se diferentiaza; Medium (51-80) = comunicare acceptabila; Supreme (81-110) = impact maxim. Daca distributiile formula vs perceput sunt similare, formula prezice corect.` },
                { heading: "De ce arata acest rezultat", text: `Distributia arata unde se concentreaza materialele. Daca majoritatea sunt in zona Medium/Supreme pe ambele coloane, materialele sunt eficiente si formula le prezice corect. Daca exista discrepante mari intre coloane, formula nu estimeaza corect pentru anumite materiale.` },
                { heading: "Cum se interpreteaza", text: `Distributii similare intre Formula si Perceput = formula valida. Shift catre stanga pe Perceput (mai multe in Noise/Critical) fata de Formula = formula supraestimeaza. Shift catre dreapta pe Perceput = formula subestimeaza.` },
                { heading: "Concluzie", text: `Comparand cele doua distributii se poate observa daca formula tinde sa supraestimeze sau subestimeze impactul real al materialelor, oferind directie pentru calibrare.` },
              ]};
              case "industry": {
                const nm = String(_ctx.name || "");
                const iN = Number(_ctx.count || 0);
                const iPct = Number(_ctx.pct || 0);
                return { sections: [
                  { heading: `Ce reprezinta rezultatul pentru ${nm}`, text: `Industria ${nm} cuprinde ${iN} material${iN !== 1 ? "e" : ""} analizat${iN !== 1 ? "e" : ""}. Scorul de validare de ${iPct}% arata cat de bine prezice formula RIFC R+(I×F)=C perceptia de Claritate in aceasta industrie specifica.` },
                  { heading: "Cum se aplica formula pe industrie", text: `Fiecare industrie are particularitati: audienta difera (B2B vs B2C), complexitatea mesajelor variaza, si asteptarile de calitate a executiei difera. Formula se aplica identic, dar rezultatele pot varia semnificativ — ceea ce testeaza robustetea modelului RIFC in contexte diverse.` },
                  { heading: "De ce arata acest rezultat", text: `${iPct >= 80 ? `In ${nm}, formula prezice cu acuratete ridicata — materialele din aceasta industrie se comporta conform modelului RIFC.` : iPct >= 50 ? `In ${nm}, formula prezice partial — pot exista particularitati ale industriei (terminologie specifica, public expert, standarde vizuale diferite) care influenteaza perceptia C dincolo de R, I si F.` : `In ${nm}, formula nu prezice bine — aceasta industrie are probabil factori distinctivi (reglementari, incredere in brand, complexitate tehnica) care necesita factori suplimentari in model.`}` },
                  { heading: "Cum se interpreteaza", text: `Comparand scorurile de validare intre industrii se identifica unde formula functioneaza cel mai bine si unde necesita ajustari. Industriile cu validare ridicata confirma modelul; cele cu validare scazuta ofera directii de cercetare.` },
                  { heading: "Concluzie", text: `Industria ${nm} cu ${iPct}% validare ${iPct >= 70 ? "sustine aplicabilitatea formulei RIFC in acest sector." : iPct >= 40 ? "sugereaza ca formula are potential dar necesita calibrare specifica acestui sector." : "indica limitari ale formulei in acest context industrial — necesita investigare suplimentara."}` },
                ]};
              }
              case "brand": {
                const nm = String(_ctx.name || "");
                const bPct = Number(_ctx.pct || 0);
                const bR = Number(_ctx.r || 0);
                const bGateOk = bR >= GATE;
                return { sections: [
                  { heading: `Ce reprezinta rezultatul pentru ${nm}`, text: `Materialul "${nm}" are un scor de validare de ${bPct}%. Aceasta arata cat de precis prezice formula RIFC scorul de Claritate perceput de respondenti pentru acest material specific. Cu R=${_ctx.r}, I=${_ctx.i}, F=${_ctx.f}, formula calculeaza C=${_ctx.cf}, iar respondentii percep C=${_ctx.cp}.` },
                  { heading: "Cum se aplica formula", text: `Pentru acest material: C formula = ${_ctx.r} + (${_ctx.i} × ${_ctx.f}) = ${_ctx.cf}. Aceasta valoare este comparata cu C perceput = ${_ctx.cp}. Diferenta Delta = ${_ctx.delta} puncte pe scala 0-110, ceea ce se traduce in ${bPct}% acuratete de predictie.` },
                  { heading: "De ce arata acest rezultat", text: `${bPct >= 80 ? `Materialul "${nm}" confirma formula — componentele R, I si F explica bine perceptia respondentilor. ${bGateOk ? "Relevanta este peste prag, iar combinatia I×F amplifica corect." : "Desi Relevance Gate nu este depasit, formula totusi prezice relativ corect."}` : bPct >= 50 ? `Materialul "${nm}" arata o aliniere partiala. ${!bGateOk ? `Cu R=${_ctx.r} sub Gate (${GATE}), materialul nu rezoneza suficient cu audienta.` : `Desi relevanta este OK, exista factori specifici acestui material care influenteaza perceptia dincolo de model.`}` : `Materialul "${nm}" nu valideaza formula in acest caz. Diferenta semnificativa de ${_ctx.delta} puncte sugereaza factori necontrolati (experienta anterioara cu brandul, context competitiv, moment de expunere).`}` },
                  { heading: "Cum se interpreteaza", text: `Fiecare material este un test individual al formulei. Materialele cu validare >= 80% confirma modelul. Cele cu 50-80% necesita analiza pe componente (care factor limiteaza?). Cele sub 50% sunt exceptii care pot oferi insight-uri valoroase despre limitarile modelului.` },
                  { heading: "Concluzie", text: `"${nm}" cu ${bPct}% validare ${bPct >= 80 ? "este o evidenta puternica pentru formula RIFC." : bPct >= 50 ? "ofera evidenta partiala — se recomanda analiza detaliata a componentelor individuale." : "reprezinta un caz unde formula necesita factori suplimentari pentru a explica perceptia."} ${!bGateOk ? `Atentie: R=${_ctx.r} < ${GATE} indica o problema fundamentala de relevanta.` : ""}` },
                ]};
              }
              default: return { sections: [{ heading: "Informatie", text: "Aceasta metrica face parte din analiza de validare a formulei RIFC." }] };
            }
          };

          // ── Interpretation button component ──
          const interpBtnHover = (e: React.MouseEvent, enter: boolean) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = enter ? "#111827" : "#f9fafb";
            el.style.color = enter ? "#fff" : "#6B7280";
            el.style.borderColor = enter ? "#111827" : "#d1d5db";
          };
          const InterpBtn = ({ k, title, val, ctx }: { k: string; title: string; val: string; ctx?: Record<string, unknown> }) => (
            <button
              onClick={(e) => { e.stopPropagation(); setInterpDrawer({ key: k, title, value: val, context: ctx }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 10, fontWeight: 600,
                borderRadius: 4, border: "1px solid #d1d5db", background: "#f9fafb", color: "#6B7280",
                cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" as const,
              }}
              onMouseEnter={e => interpBtnHover(e, true)}
              onMouseLeave={e => interpBtnHover(e, false)}
            >
              <FileText size={10} /> Interpretare
            </button>
          );

          // ── Data with responses ──
          const withData = results.stimuliResults.filter(s => s.response_count > 0);
          if (withData.length === 0) {
            return (
              <div style={S.placeholderTab}>
                <Brain size={48} style={{ color: "#d1d5db" }} />
                <p style={{ color: "#6B7280", fontSize: 14, marginTop: 12 }}>Nu exista materiale cu raspunsuri pentru analiza.</p>
              </div>
            );
          }

          // ── Grand totals ──
          const n = withData.length;
          const grandR = Math.round((withData.reduce((a, s) => a + s.avg_r, 0) / n) * 100) / 100;
          const grandI = Math.round((withData.reduce((a, s) => a + s.avg_i, 0) / n) * 100) / 100;
          const grandF = Math.round((withData.reduce((a, s) => a + s.avg_f, 0) / n) * 100) / 100;
          const grandCf = Math.round((withData.reduce((a, s) => a + s.avg_c, 0) / n) * 100) / 100;
          const grandCp = Math.round((withData.reduce((a, s) => a + s.avg_c_score, 0) / n) * 100) / 100;
          const grandDelta = Math.round(Math.abs(grandCf - grandCp) * 100) / 100;
          const grandHypPct = hypothesisPct(grandCf, grandCp);
          const grandZoneCf = getZone(grandCf);
          const grandZoneCp = getZone(grandCp);
          const grandZoneMatch = grandZoneCf === grandZoneCp;
          const gatePassCount = withData.filter(s => s.avg_r >= GATE).length;
          const gatePassRate = Math.round((gatePassCount / n) * 100);
          const zoneMatchCount = withData.filter(s => getZone(s.avg_c) === getZone(s.avg_c_score)).length;
          const zoneMatchRate = Math.round((zoneMatchCount / n) * 100);

          // ── Zone distribution ──
          const zones = ["Critical", "Noise", "Medium", "Supreme"];
          const zoneDistFormula: Record<string, number> = { Critical: 0, Noise: 0, Medium: 0, Supreme: 0 };
          const zoneDistPerceived: Record<string, number> = { Critical: 0, Noise: 0, Medium: 0, Supreme: 0 };
          withData.forEach(s => {
            zoneDistFormula[getZone(s.avg_c)]++;
            zoneDistPerceived[getZone(s.avg_c_score)]++;
          });

          // ── Per Industry aggregates ──
          const byIndustry: Record<string, typeof withData> = {};
          withData.forEach(s => {
            const ind = s.industry || "Neatribuit";
            if (!byIndustry[ind]) byIndustry[ind] = [];
            byIndustry[ind].push(s);
          });
          const industryKeys = Object.keys(byIndustry).sort((a, b) => {
            if (a === "Neatribuit") return 1;
            if (b === "Neatribuit") return -1;
            return byIndustry[b].length - byIndustry[a].length;
          });

          const INDUSTRY_COLORS = [
            "#2563EB", "#DC2626", "#059669", "#D97706", "#7C3AED",
            "#EC4899", "#0D9488", "#EA580C", "#4F46E5", "#CA8A04",
          ];

          // ── Sub-tab pill style ──
          const pillStyle = (active: boolean): React.CSSProperties => ({
            padding: "8px 16px", fontSize: 12, fontWeight: 600, borderRadius: 6,
            border: "1px solid #e5e7eb", cursor: "pointer",
            background: active ? "#111827" : "#fff",
            color: active ? "#fff" : "#6B7280",
          });

          return (
            <div style={{ position: "relative" }}>
              {/* ── Interpretation Drawer ── */}
              {interpDrawer && (() => {
                const info = getInterpretation(interpDrawer.key, interpDrawer.value, interpDrawer.context);
                return (
                  <>
                    {/* Overlay */}
                    <div onClick={() => setInterpDrawer(null)} style={{
                      position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 9998, transition: "opacity 0.2s",
                    }} />
                    {/* Slider panel */}
                    <div style={{
                      position: "fixed", top: 0, right: 0, bottom: 0, width: "min(480px, 90vw)",
                      background: "#fff", zIndex: 9999, boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                      display: "flex", flexDirection: "column", animation: "slideInRight 0.25s ease-out",
                    }}>
                      {/* Header */}
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 10 }}>
                        <Brain size={18} style={{ color: "#111827" }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{interpDrawer.title}</div>
                          <div style={{ fontSize: 11, color: "#6B7280" }}>Valoare: {interpDrawer.value}</div>
                        </div>
                        <button onClick={() => setInterpDrawer(null)} style={{
                          width: 28, height: 28, borderRadius: 6, border: "1px solid #e5e7eb", background: "#f9fafb",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        }}><X size={14} /></button>
                      </div>
                      {/* Content — scrollable */}
                      <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
                        {info.sections.map((sec, i) => (
                          <div key={i} style={{ marginBottom: 20 }}>
                            <div style={{
                              fontSize: 11, fontWeight: 700, letterSpacing: 0.5, color: "#111827",
                              marginBottom: 6, paddingBottom: 4, borderBottom: "1px solid #f3f4f6",
                            }}>{sec.heading}</div>
                            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0 }}>{sec.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}

              {/* Sub-tab pills */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {([
                  { key: "total" as const, label: "Total" },
                  { key: "industrie" as const, label: "Per Industrie" },
                  { key: "brand" as const, label: "Per Brand" },
                ] as const).map(t => (
                  <button key={t.key} onClick={() => { setInterpSubTab(t.key); setExpandedInterpIndustry(null); }} style={pillStyle(interpSubTab === t.key)}>{t.label}</button>
                ))}
              </div>

              {/* ═══ TOTAL ═══ */}
              {interpSubTab === "total" && (
                <div>
                  {/* Hypothesis validation hero */}
                  <div style={{
                    background: "#fff", border: "2px solid #e5e7eb", borderRadius: 12, padding: 24, marginBottom: 20, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", marginBottom: 8 }}>VALIDARE IPOTEZA — TOTAL</div>
                    <div style={{ fontSize: 48, fontWeight: 900, color: getValidationColor(grandHypPct), lineHeight: 1 }}>{grandHypPct}%</div>
                    <div style={{
                      display: "inline-block", marginTop: 8, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                      background: `${getValidationColor(grandHypPct)}15`, color: getValidationColor(grandHypPct),
                    }}>{getValidationLabel(grandHypPct)}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", marginTop: 12, maxWidth: 500, margin: "12px auto 0" }}>
                      Formula <strong>R+(I&times;F)=C</strong> prezice scorul de claritate cu o acuratete de <strong>{grandHypPct}%</strong> fata de perceptia respondentilor.
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <InterpBtn k="hypothesis_total" title="Validare Ipoteza — Total" val={String(grandHypPct)} />
                    </div>
                  </div>

                  {/* Score comparison cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "R (Relevanta)", value: grandR, color: "#DC2626", k: "score_r" },
                      { label: "I (Interes)", value: grandI, color: "#D97706", k: "score_i" },
                      { label: "F (Forma)", value: grandF, color: "#7C3AED", k: "score_f" },
                      { label: "C formula", value: grandCf, color: "#111827", k: "score_cf" },
                      { label: "C perceput", value: grandCp, color: "#059669", k: "score_cp" },
                      { label: "Delta |Cf-Cp|", value: grandDelta, color: "#6B7280", k: "score_delta" },
                    ].map(c => (
                      <div key={c.label} style={{ ...S.configItem, textAlign: "center" as const }}>
                        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", marginBottom: 4 }}>{c.label.toUpperCase()}</div>
                        <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.value}</div>
                        <div style={{ marginTop: 6 }}>
                          <InterpBtn k={c.k} title={c.label} val={String(c.value)} ctx={{ r: grandR, i: grandI, f: grandF, cf: grandCf, cp: grandCp, delta: grandDelta }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gate + Zone match stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                    <div style={{ ...S.configItem, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", marginBottom: 4 }}>RELEVANCE GATE (R &ge; {GATE})</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: gatePassRate >= 70 ? "#059669" : gatePassRate >= 40 ? "#D97706" : "#DC2626" }}>{gatePassRate}%</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{gatePassCount} din {n} materiale</div>
                      <div style={{ marginTop: 6 }}><InterpBtn k="gate" title="Relevance Gate" val={String(gatePassRate)} ctx={{ pass: gatePassCount, total: n }} /></div>
                    </div>
                    <div style={{ ...S.configItem, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", marginBottom: 4 }}>ZONE MATCH (Cf = Cp)</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: zoneMatchRate >= 70 ? "#059669" : zoneMatchRate >= 40 ? "#D97706" : "#DC2626" }}>{zoneMatchRate}%</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{zoneMatchCount} din {n} materiale in aceeasi zona</div>
                      <div style={{ marginTop: 6 }}><InterpBtn k="zonematch" title="Zone Match" val={String(zoneMatchRate)} ctx={{ match: zoneMatchCount, total: n }} /></div>
                    </div>
                    <div style={{ ...S.configItem, textAlign: "center" as const }}>
                      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: "#9CA3AF", marginBottom: 4 }}>MATERIALE ANALIZATE</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{n}</div>
                      <div style={{ fontSize: 11, color: "#6B7280" }}>{results.totalResponses} raspunsuri totale</div>
                      <div style={{ marginTop: 6 }}><InterpBtn k="materials" title="Materiale Analizate" val={String(n)} ctx={{ responses: results.totalResponses }} /></div>
                    </div>
                  </div>

                  {/* Zone distribution */}
                  <div style={{ ...S.configItem, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", flex: 1 }}>DISTRIBUTIE PE ZONE</div>
                      <InterpBtn k="zones" title="Distributie pe Zone" val={`${n} materiale`} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>C FORMULA</div>
                        {zones.map(z => {
                          const count = zoneDistFormula[z];
                          const pct = n > 0 ? Math.round((count / n) * 100) : 0;
                          return (
                            <div key={`f-${z}`} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: getZoneColor(z), flexShrink: 0 }} />
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 60 }}>{z}</span>
                              <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: getZoneColor(z), borderRadius: 3, transition: "width 0.3s" }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", minWidth: 40, textAlign: "right" as const }}>{count} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>C PERCEPUT</div>
                        {zones.map(z => {
                          const count = zoneDistPerceived[z];
                          const pct = n > 0 ? Math.round((count / n) * 100) : 0;
                          return (
                            <div key={`p-${z}`} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ width: 8, height: 8, borderRadius: "50%", background: getZoneColor(z), flexShrink: 0 }} />
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#374151", minWidth: 60 }}>{z}</span>
                              <div style={{ flex: 1, height: 6, background: "#f3f4f6", borderRadius: 3, overflow: "hidden" }}>
                                <div style={{ width: `${pct}%`, height: "100%", background: getZoneColor(z), borderRadius: 3, transition: "width 0.3s" }} />
                              </div>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", minWidth: 40, textAlign: "right" as const }}>{count} ({pct}%)</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Conclusion */}
                  <div style={{
                    background: `${getValidationColor(grandHypPct)}08`, border: `1px solid ${getValidationColor(grandHypPct)}30`,
                    borderRadius: 10, padding: 16,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Brain size={16} style={{ color: getValidationColor(grandHypPct) }} />
                      <span style={{ fontSize: 12, fontWeight: 700, color: getValidationColor(grandHypPct) }}>CONCLUZIE GENERALA</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>
                      {getConclusion(grandHypPct, grandR, grandZoneMatch)}
                    </p>
                  </div>
                </div>
              )}

              {/* ═══ PER INDUSTRIE ═══ */}
              {interpSubTab === "industrie" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                    {industryKeys.map((ind, idx) => {
                      const items = byIndustry[ind];
                      const iN = items.length;
                      const iR = Math.round((items.reduce((a, s) => a + s.avg_r, 0) / iN) * 100) / 100;
                      const iI = Math.round((items.reduce((a, s) => a + s.avg_i, 0) / iN) * 100) / 100;
                      const iF = Math.round((items.reduce((a, s) => a + s.avg_f, 0) / iN) * 100) / 100;
                      const iCf = Math.round((items.reduce((a, s) => a + s.avg_c, 0) / iN) * 100) / 100;
                      const iCp = Math.round((items.reduce((a, s) => a + s.avg_c_score, 0) / iN) * 100) / 100;
                      const iDelta = Math.round(Math.abs(iCf - iCp) * 100) / 100;
                      const iPct = hypothesisPct(iCf, iCp);
                      const iZoneCf = getZone(iCf);
                      const iZoneCp = getZone(iCp);
                      const iZoneMatch = iZoneCf === iZoneCp;
                      const iGatePass = items.filter(s => s.avg_r >= GATE).length;
                      const iColor = INDUSTRY_COLORS[idx % INDUSTRY_COLORS.length];
                      const isExpanded = expandedInterpIndustry === ind;

                      return (
                        <div key={ind}>
                          <div
                            onClick={() => setExpandedInterpIndustry(isExpanded ? null : ind)}
                            style={{
                              ...S.configItem, cursor: "pointer",
                              borderColor: isExpanded ? iColor : "#e5e7eb",
                              borderWidth: isExpanded ? 2 : 1,
                              background: isExpanded ? `${iColor}08` : "#f9fafb",
                              transition: "all 0.15s",
                            }}
                          >
                            {/* Industry header */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                              <span style={{ width: 10, height: 10, borderRadius: "50%", background: iColor, flexShrink: 0 }} />
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#111827", flex: 1 }}>{ind}</span>
                              <span style={{
                                fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 10,
                                background: `${getValidationColor(iPct)}15`, color: getValidationColor(iPct),
                              }}>{iPct}%</span>
                            </div>
                            <div style={{ fontSize: 11, color: "#6B7280", marginBottom: 8 }}>{iN} material{iN !== 1 ? "e" : ""} · Gate: {iGatePass}/{iN}</div>

                            {/* Scores row */}
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "baseline", marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>R:{iR}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#D97706" }}>I:{iI}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>F:{iF}</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>Cf:{iCf}</span>
                              <span style={{ fontSize: 12, fontWeight: 800, color: "#059669" }}>Cp:{iCp}</span>
                              <span style={{ fontSize: 11, color: "#6B7280" }}>&Delta;:{iDelta}</span>
                            </div>

                            {/* Zone badges */}
                            <div style={{ display: "flex", gap: 4, alignItems: "center", marginBottom: 4 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: getZoneBg(iZoneCf), color: getZoneColor(iZoneCf) }}>Cf: {iZoneCf}</span>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: getZoneBg(iZoneCp), color: getZoneColor(iZoneCp) }}>Cp: {iZoneCp}</span>
                              {iZoneMatch && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#05966915", color: "#059669" }}>MATCH</span>}
                            </div>

                            {/* Validation label + Interp button */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: getValidationColor(iPct) }}>{getValidationLabel(iPct)}</span>
                              <InterpBtn k="industry" title={`Industrie: ${ind}`} val={String(iPct)} ctx={{ name: ind, count: iN, pct: iPct, r: iR, i: iI, f: iF, cf: iCf, cp: iCp, delta: iDelta }} />
                            </div>

                            <div style={{ marginTop: 6, textAlign: "center" as const }}>
                              {isExpanded ? <ChevronUp size={14} style={{ color: iColor }} /> : <ChevronDown size={14} style={{ color: "#9CA3AF" }} />}
                            </div>
                          </div>

                          {/* Expanded: per-stimulus table */}
                          {isExpanded && (
                            <div style={{ marginTop: -1, border: `2px solid ${iColor}40`, borderRadius: "0 0 10px 10px", background: "#fff", overflow: "auto" }}>
                              <table style={{ width: "100%", borderCollapse: "collapse" as const, minWidth: 600 }}>
                                <thead>
                                  <tr style={{ background: "#f9fafb" }}>
                                    <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 140 }}>MATERIAL</th>
                                    <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                                    <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                                    <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                                    <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>Cf</th>
                                    <th style={{ ...thStyle, color: "#059669" }}>Cp</th>
                                    <th style={thStyle}>&Delta;</th>
                                    <th style={thStyle}>VALID %</th>
                                    <th style={thStyle}>ZONA</th>
                                    <th style={thStyle}></th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {items.map(s => {
                                    const sPct = hypothesisPct(s.avg_c, s.avg_c_score);
                                    const sZone = getZone(s.avg_c);
                                    const sDelta = Math.round(Math.abs(s.avg_c - s.avg_c_score) * 100) / 100;
                                    return (
                                      <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                        <td style={{ ...tdStyle, textAlign: "left" as const, fontWeight: 600, color: "#111827", fontSize: 12 }}>{s.name}</td>
                                        <td style={{ ...tdStyle, color: s.avg_r < GATE ? "#DC2626" : "#374151", fontWeight: s.avg_r < GATE ? 800 : 600 }}>{s.avg_r}</td>
                                        <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{s.avg_i}</td>
                                        <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{s.avg_f}</td>
                                        <td style={{ ...tdStyle, color: "#111827", fontWeight: 800 }}>{s.avg_c}</td>
                                        <td style={{ ...tdStyle, color: "#059669", fontWeight: 700 }}>{s.avg_c_score}</td>
                                        <td style={{ ...tdStyle, color: "#6B7280" }}>{sDelta}</td>
                                        <td style={{ ...tdStyle, fontWeight: 800, color: getValidationColor(sPct) }}>{sPct}%</td>
                                        <td style={tdStyle}>
                                          <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 3, background: getZoneBg(sZone), color: getZoneColor(sZone) }}>{sZone}</span>
                                        </td>
                                        <td style={tdStyle}>
                                          <InterpBtn k="brand" title={s.name} val={String(sPct)} ctx={{ name: s.name, pct: sPct, r: s.avg_r, i: s.avg_i, f: s.avg_f, cf: s.avg_c, cp: s.avg_c_score, delta: sDelta }} />
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                              {/* Industry conclusion */}
                              <div style={{ padding: 12, borderTop: "1px solid #f3f4f6", fontSize: 12, color: "#374151", lineHeight: 1.5 }}>
                                <strong style={{ color: getValidationColor(iPct) }}>Concluzie {ind}:</strong> {getConclusion(iPct, iR, iZoneMatch)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ═══ PER BRAND ═══ */}
              {interpSubTab === "brand" && (
                <div>
                  {withData
                    .map(s => ({
                      ...s,
                      pct: hypothesisPct(s.avg_c, s.avg_c_score),
                      delta: Math.round(Math.abs(s.avg_c - s.avg_c_score) * 100) / 100,
                      zoneCf: getZone(s.avg_c),
                      zoneCp: getZone(s.avg_c_score),
                      zoneMatch: getZone(s.avg_c) === getZone(s.avg_c_score),
                      gateOk: s.avg_r >= GATE,
                    }))
                    .sort((a, b) => b.pct - a.pct)
                    .map((s, idx) => (
                      <div key={s.id} style={{
                        ...S.configItem, marginBottom: 10,
                        borderLeft: `3px solid ${getValidationColor(s.pct)}`,
                      }}>
                        {/* Top row: name + validation % + interp button */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", minWidth: 20 }}>#{idx + 1}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", flex: 1 }}>{s.name}</span>
                          <InterpBtn k="brand" title={s.name} val={String(s.pct)} ctx={{ name: s.name, pct: s.pct, r: s.avg_r, i: s.avg_i, f: s.avg_f, cf: s.avg_c, cp: s.avg_c_score, delta: s.delta }} />
                          <span style={{
                            fontSize: 18, fontWeight: 900, color: getValidationColor(s.pct),
                          }}>{s.pct}%</span>
                        </div>

                        {/* Meta row: industry, channel, responses */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 8 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3, background: "#f3f4f6", color: "#6B7280" }}>{s.industry || "Neatribuit"}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 6px", borderRadius: 3, background: "#f3f4f6", color: "#6B7280" }}>{s.type}</span>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>{s.response_count} raspunsuri</span>
                        </div>

                        {/* Scores row */}
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, alignItems: "baseline", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: s.gateOk ? "#374151" : "#DC2626" }}>R:{s.avg_r} {!s.gateOk ? "(sub gate)" : ""}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#D97706" }}>I:{s.avg_i}</span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED" }}>F:{s.avg_f}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>Cf:{s.avg_c}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>Cp:{s.avg_c_score}</span>
                          <span style={{ fontSize: 12, color: "#6B7280" }}>&Delta;:{s.delta}</span>
                        </div>

                        {/* Zone + validation */}
                        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: getZoneBg(s.zoneCf), color: getZoneColor(s.zoneCf) }}>Cf: {s.zoneCf}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: getZoneBg(s.zoneCp), color: getZoneColor(s.zoneCp) }}>Cp: {s.zoneCp}</span>
                          {s.zoneMatch && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#05966915", color: "#059669" }}>MATCH</span>}
                          {!s.gateOk && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 3, background: "#DC262615", color: "#DC2626" }}>GATE FAIL</span>}
                          <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: getValidationColor(s.pct) }}>{getValidationLabel(s.pct)}</span>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          );
        })()}

        {activeTab === "preview" && (() => {
          // ── Compute step structure for cards ──
          const profileStepCount = 16;
          const activeStimuli = stimuli.filter(s => s.is_active);
          const numStim = activeStimuli.length || 8;
          const stepsPerStim = 5;
          const firstStimulusStep = profileStepCount;
          const lastStimulusStep = firstStimulusStep + (numStim * stepsPerStim) - 1;
          const thankYouStep = lastStimulusStep + 1;

          // Step card definitions
          const STEP_CARDS: { label: string; step: number; icon: React.ReactNode; color: string; group: string }[] = [
            { label: "Bun venit", step: 0, icon: <Play size={16} />, color: "#DC2626", group: "start" },
            // Demographics
            { label: "Gen", step: 1, icon: <UserCircle size={16} />, color: "#6366f1", group: "Profil Demografic" },
            { label: "Vârstă", step: 2, icon: <Users size={16} />, color: "#6366f1", group: "Profil Demografic" },
            { label: "Țară", step: 3, icon: <Globe size={16} />, color: "#6366f1", group: "Profil Demografic" },
            { label: "Urban / Rural", step: 4, icon: <MapPin size={16} />, color: "#6366f1", group: "Profil Demografic" },
            { label: "Venit", step: 5, icon: <Wallet size={16} />, color: "#6366f1", group: "Profil Demografic" },
            { label: "Educație", step: 6, icon: <GraduationCap size={16} />, color: "#6366f1", group: "Profil Demografic" },
            // Behavioral
            { label: "Frecvență cumpărare", step: 7, icon: <ShoppingCart size={16} />, color: "#059669", group: "Comportament" },
            { label: "Canale media", step: 8, icon: <LayoutGrid size={16} />, color: "#059669", group: "Comportament" },
            { label: "Timp online", step: 9, icon: <Clock size={16} />, color: "#059669", group: "Comportament" },
            { label: "Dispozitiv", step: 10, icon: <Monitor size={16} />, color: "#059669", group: "Comportament" },
            // Psychographic
            { label: "Receptivitate publicitară", step: 11, icon: <Target size={16} />, color: "#D97706", group: "Psihografic" },
            { label: "Preferință vizuală", step: 12, icon: <Sparkles size={16} />, color: "#D97706", group: "Psihografic" },
            { label: "Cumpărare impulsivă", step: 13, icon: <Heart size={16} />, color: "#D97706", group: "Psihografic" },
            { label: "Iritare irelevanță", step: 14, icon: <AlertTriangle size={16} />, color: "#D97706", group: "Psihografic" },
            { label: "Captare atenție", step: 15, icon: <Zap size={16} />, color: "#D97706", group: "Psihografic" },
          ];

          // Add stimulus cards
          activeStimuli.forEach((stim, idx) => {
            const cat = categories.find(c => c.type === stim.type);
            STEP_CARDS.push({
              label: stim.name || `Material ${idx + 1}`,
              step: firstStimulusStep + idx * stepsPerStim,
              icon: <ImageIcon size={16} />,
              color: cat?.color || "#DC2626",
              group: `Evaluare Stimuli`,
            });
          });

          // Thank you
          STEP_CARDS.push({
            label: "Mulțumim!",
            step: thankYouStep,
            icon: <PartyPopper size={16} />,
            color: "#059669",
            group: "final",
          });

          // Group cards for rendering
          const groups: { name: string; cards: typeof STEP_CARDS }[] = [];
          let lastGroup = "";
          for (const card of STEP_CARDS) {
            if (card.group !== lastGroup) {
              groups.push({ name: card.group, cards: [] });
              lastGroup = card.group;
            }
            groups[groups.length - 1].cards.push(card);
          }

          return (
            <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Preview banner */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", letterSpacing: 0.5 }}>MOD PREVIEW — datele NU se salveaza in baza de date</span>
                </div>
                <button
                  onClick={() => {
                    const iframe = document.querySelector<HTMLIFrameElement>("#preview-iframe");
                    if (iframe) { iframe.src = "/articolstiintific/sondaj/wizard?preview=1&reset=1&t=" + Date.now(); }
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

              {/* Iframe */}
              <div style={{ width: "100%", height: "70vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                <iframe
                  id="preview-iframe"
                  src="/articolstiintific/sondaj/wizard?preview=1"
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="Preview Sondaj"
                />
              </div>

              {/* Step cards */}
              <div style={{
                background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
                padding: 24,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: 1, color: "#6B7280", marginBottom: 20, textTransform: "uppercase" }}>
                  Navigare rapidă — click pentru a deschide pasul în preview
                </h3>

                {groups.map((group) => (
                  <div key={group.name} style={{ marginBottom: 20 }}>
                    {group.name !== "start" && group.name !== "final" && (
                      <div style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
                        color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase",
                      }}>
                        {group.name}
                      </div>
                    )}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                      gap: 8,
                    }}>
                      {group.cards.map((card) => (
                        <button
                          key={card.step}
                          onClick={() => {
                            const iframe = document.querySelector<HTMLIFrameElement>("#preview-iframe");
                            if (iframe?.contentWindow) {
                              iframe.contentWindow.postMessage({ type: "goToStep", step: card.step }, "*");
                            }
                          }}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px", borderRadius: 8,
                            border: "1.5px solid #e5e7eb", background: "#fafafa",
                            cursor: "pointer", textAlign: "left",
                            transition: "all 0.15s ease",
                            fontSize: 13, fontWeight: 500, color: "#374151",
                            fontFamily: "Outfit, system-ui, sans-serif",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = card.color;
                            e.currentTarget.style.background = card.color + "08";
                            e.currentTarget.style.transform = "translateY(-1px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#e5e7eb";
                            e.currentTarget.style.background = "#fafafa";
                            e.currentTarget.style.transform = "translateY(0)";
                          }}
                        >
                          <span style={{
                            display: "flex", alignItems: "center", justifyContent: "center",
                            width: 30, height: 30, borderRadius: 6,
                            background: card.color + "15", color: card.color,
                            flexShrink: 0,
                          }}>
                            {card.icon}
                          </span>
                          <span style={{ flex: 1, lineHeight: 1.3 }}>{card.label}</span>
                          <ChevronRight size={14} style={{ color: "#d1d5db", flexShrink: 0 }} />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ═══ CVI (EVALUARE ITEMI) TAB ═══ */}
        {activeTab === "cvi" && (
          <div style={{ width: "100%" }}>
            {cviLoading && !cviResults ? (
              <div style={{ textAlign: "center", padding: 40, color: "#6B7280" }}>
                <Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} />
                <p style={{ marginTop: 8 }}>Se încarcă datele CVI...</p>
              </div>
            ) : (
              <>
                {/* ── Header + Sub-tabs + Add Button ── */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Evaluare Itemi (CVI)</h2>
                    <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                      Fiecare expert primeste un link unic, evalueaza 35 itemi RIFC pe scala Likert 1-4.
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {/* Sub-tabs: Pagina / Editează / Preview */}
                    <div style={{ display: "flex", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
                      {([
                        { key: "main" as const, label: "Pagina", icon: <LayoutList size={13} /> },
                        { key: "edit" as const, label: "Editează", icon: <Pencil size={13} /> },
                        { key: "preview" as const, label: "Preview", icon: <Eye size={13} /> },
                      ]).map(t => (
                        <button
                          key={t.key}
                          onClick={() => setCviSubTab(t.key)}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "7px 16px", border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer",
                            background: cviSubTab === t.key ? "#6366F1" : "#fff",
                            color: cviSubTab === t.key ? "#fff" : "#6B7280",
                            transition: "all 0.15s",
                          }}
                        >
                          {t.icon} {t.label}
                        </button>
                      ))}
                    </div>
                    {cviSubTab === "main" && (
                      <button style={{ ...S.addCatBtn, background: "#6366F1" }} onClick={() => setShowAddCviExpert(true)}>
                        <Plus size={16} />
                        ADAUGA EXPERT
                      </button>
                    )}
                  </div>
                </div>

                {/* ═══ PREVIEW SUB-TAB ═══ */}
                {cviSubTab === "preview" && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#6B7280", letterSpacing: 0.5 }}>MOD PREVIEW — datele NU se salveaza in baza de date</span>
                      </div>
                      <button
                        onClick={() => {
                          const iframe = document.querySelector<HTMLIFrameElement>("#cvi-preview-iframe");
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
                        id="cvi-preview-iframe"
                        src="/articolstiintific/cvi?preview=1"
                        style={{ width: "100%", height: "100%", border: "none" }}
                        title="Preview CVI"
                      />
                    </div>
                  </>
                )}

                {/* ═══ EDITEAZĂ SUB-TAB (Edit CVI Test Content) ═══ */}
                {cviSubTab === "edit" && (
                  <>
                    {/* Info banner */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderRadius: 10, background: "#EEF2FF", border: "1px solid #C7D2FE", marginBottom: 20 }}>
                      <Pencil size={16} style={{ color: "#6366F1", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#4338CA", lineHeight: 1.5 }}>
                        Editează conținutul testului CVI: textul fiecărui item, sub-factorii, scala de evaluare și instrucțiunile. Modificările se reflectă în formularul pe care experții îl completează.
                      </span>
                    </div>

                    {/* ── Scale Editor ── */}
                    <div style={{ ...S.configCard, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <Hash size={16} style={{ color: "#6366F1" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6366F1" }}>SCALA DE EVALUARE (LIKERT 1-4)</span>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                        {[
                          { v: 1, label: "Irelevant", desc: "Itemul nu măsoară constructul indicat", color: "#EF4444", bg: "#FEF2F2" },
                          { v: 2, label: "Parțial relevant", desc: "Itemul măsoară parțial, necesită revizuire majoră", color: "#F97316", bg: "#FFF7ED" },
                          { v: 3, label: "Relevant", desc: "Itemul măsoară constructul cu revizuiri minore", color: "#EAB308", bg: "#FEFCE8" },
                          { v: 4, label: "Extrem relevant", desc: "Itemul măsoară perfect constructul — nicio modificare", color: "#22C55E", bg: "#F0FDF4" },
                        ].map(s => (
                          <div key={s.v} style={{ padding: "12px 14px", borderRadius: 8, background: s.bg, border: `1px solid ${s.color}20` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                              <span style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{s.v}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</span>
                            </div>
                            <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{s.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── Dimension Editors (4 collapsible sections) ── */}
                    {([
                      { dim: "R", label: "Relevanță", color: "#DC2626", bg: "#FEF2F2", items: [
                        { id: "R1", text: "Mesajul se adresează unui segment specific de audiență cu o nevoie identificabilă pe care produsul sau serviciul o rezolvă.", sub: "Audiență / ICP" },
                        { id: "R2", text: "Mesajul este difuzat la momentul potrivit din perspectiva ciclului de cumpărare al audienței.", sub: "Timing" },
                        { id: "R3", text: "Conținutul mesajului corespunde etapei corecte din buyer journey a destinatarului (conștientizare, evaluare sau decizie).", sub: "Etapa Journey" },
                        { id: "R4", text: "Mesajul ia în considerare contextul fizic sau digital în care este consumat de audiență.", sub: "Context Situațional" },
                        { id: "R5", text: "Mesajul este adaptat cultural și lingvistic specificului geografic al audienței țintă.", sub: "Geografie / Cultură" },
                        { id: "R6", text: "Formatul și conținutul mesajului sunt optimizate nativ pentru canalul specific de distribuție.", sub: "Potrivire Canal" },
                        { id: "R7", text: "Mesajul utilizează date comportamentale pentru a personaliza comunicarea pentru segmente specifice.", sub: "Segmentare Comportamentală" },
                      ]},
                      { dim: "I", label: "Interes", color: "#2563EB", bg: "#EFF6FF", items: [
                        { id: "I1", text: "Mesajul articulează o promisiune centrală clară și atractivă, specifică pentru audiența vizată.", sub: "Promisiune Centrală" },
                        { id: "I2", text: "Beneficiul principal al ofertei este comunicat în primele 5 secunde de expunere la mesaj.", sub: "Beneficiu Imediat" },
                        { id: "I3", text: "Mesajul activează o emoție specifică și autentică, aliniată cu dorința sau durerea principală a audienței.", sub: "Trigger Emoțional" },
                        { id: "I4", text: "Mesajul creează un gol informațional care motivează audiența să continue să consume conținutul.", sub: "Gap de Curiozitate" },
                        { id: "I5", text: "Mesajul conține un element de urgență sau raritate legitimă care motivează acțiunea imediată.", sub: "Urgență / Scarcity" },
                        { id: "I6", text: "Mesajul conține cel puțin un element neașteptat sau surprinzător față de norma din industrie.", sub: "Noutate / Surpriză" },
                        { id: "I7", text: "Destinatarul simte că mesajul a fost creat specific pentru situația sau nevoile sale personale.", sub: "Relevanță Personală Percepută" },
                        { id: "I8", text: "Mesajul include dovezi specifice și verificabile de credibilitate (statistici cu sursă, testimoniale cu identitate reală, studii de caz cu cifre).", sub: "Credibilitate / Dovadă Socială" },
                        { id: "I9", text: "Valoarea ofertei este construită strategic înainte de prezentarea prețului, făcând costul să pară mic față de beneficii.", sub: "Valoare Percepută" },
                        { id: "I10", text: "Primele cuvinte sau secunde ale mesajului capturează imediat atenția prin originalitate, specificitate sau shock pozitiv.", sub: "Hook / Primul Impact" },
                      ]},
                      { dim: "F", label: "Formă", color: "#059669", bg: "#ECFDF5", items: [
                        { id: "F1", text: "Elementele vizuale ale mesajului clarifică și amplifică conținutul, fără a crea confuzie sau distracție.", sub: "Claritate Vizuală" },
                        { id: "F2", text: "Titlul sau headline-ul este clar, specific și comunică un beneficiu diferențiat în mai puțin de 5 secunde.", sub: "Puterea Titlului" },
                        { id: "F3", text: "Există un singur CTA principal, orientat pe beneficiu, vizibil și cu fricțiune minimă pentru utilizator.", sub: "CTA — Call to Action" },
                        { id: "F4", text: "Mesajul urmează o structură logică deliberată care ghidează natural audiența de la problemă la soluție și la acțiune.", sub: "Structură și Flow" },
                        { id: "F5", text: "Lungimea mesajului este perfect calibrată pentru canalul de distribuție și obiectivul de comunicare.", sub: "Densitate Optimă (Lungime)" },
                        { id: "F6", text: "Tonul mesajului este consistent, autentic și perfect calibrat pentru audiența și contextul specific.", sub: "Ton și Voce" },
                        { id: "F7", text: "Mesajul este consistent cu identitatea vizuală și valorile brandului, recognoscibil fără a vedea logo-ul.", sub: "Consistență Brand" },
                        { id: "F8", text: "Textul mesajului este ușor de citit la prima vedere, cu font adecvat, contrast și propoziții directe.", sub: "Lizibilitate" },
                        { id: "F9", text: "Elementele vizuale sunt organizate ierarhic, ghidând ochiul natural de la cel mai important spre CTA.", sub: "Ierarhie Vizuală" },
                        { id: "F10", text: "Specificațiile tehnice ale mesajului (dimensiuni, format, durate) sunt perfect adaptate platformei de distribuție.", sub: "Optimizare Format-Canal" },
                        { id: "F11", text: "Mesajul este liber de erori gramaticale, ortografice și de punctuație, cu diacritice complete.", sub: "Corectitudine Lingvistică" },
                      ]},
                      { dim: "C", label: "Claritate (Rezultat)", color: "#D97706", bg: "#FFFBEB", items: [
                        { id: "C1", text: "Mesajul este înțeles corect și complet la prima expunere de cel puțin 90% din audiența țintă.", sub: "Înțelegere Imediată" },
                        { id: "C2", text: "Mesajul lasă o amprentă mentală specifică pe care audiența o poate reproduce după 72 de ore fără re-expunere.", sub: "Memorabilitate" },
                        { id: "C3", text: "Mesajul generează o intenție puternică și imediată de a efectua acțiunea propusă.", sub: "Intenție de Acțiune" },
                        { id: "C4", text: "Audiența poate articula clar de ce această ofertă este diferită și superioară alternativelor disponibile.", sub: "Diferențiere Percepută" },
                        { id: "C5", text: "Mesajul anticipează și neutralizează proactiv principalele obiecții ale audienței țintă.", sub: "Reducerea Obiecțiilor" },
                        { id: "C6", text: "Experiența post-click sau post-conversie corespunde perfect cu promisiunea comunicată în mesaj.", sub: "Coerență Mesaj-Așteptare" },
                        { id: "C7", text: "Mesajul lasă o impresie generală puternic pozitivă, generând dorința de a împărtăși sau de a acționa imediat.", sub: "Impact General Perceput" },
                      ]},
                    ] as { dim: string; label: string; color: string; bg: string; items: { id: string; text: string; sub: string }[] }[]).map(section => (
                      <div key={section.dim} style={{ ...S.configCard, marginBottom: 16, borderColor: cviEditExpanded === section.dim ? section.color : "#e5e7eb", borderWidth: cviEditExpanded === section.dim ? 2 : 1 }}>
                        {/* Dimension header (clickable to expand) */}
                        <button
                          onClick={() => setCviEditExpanded(cviEditExpanded === section.dim ? null : section.dim)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                            padding: 0, border: "none", background: "none", cursor: "pointer", textAlign: "left",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                              width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                              background: section.bg, color: section.color, fontSize: 16, fontWeight: 800,
                            }}>
                              {section.dim}
                            </span>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{section.label}</div>
                              <div style={{ fontSize: 12, color: "#6B7280" }}>{section.items.length} itemi</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 11, fontWeight: 600, color: section.color, background: section.bg, padding: "3px 10px", borderRadius: 12 }}>
                              {section.items.length} itemi
                            </span>
                            {cviEditExpanded === section.dim ? <ChevronUp size={18} style={{ color: "#6B7280" }} /> : <ChevronDown size={18} style={{ color: "#6B7280" }} />}
                          </div>
                        </button>

                        {/* Expanded items editor */}
                        {cviEditExpanded === section.dim && (
                          <div style={{ marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 16 }}>
                            {section.items.map((item, idx) => {
                              const editedText = cviItemEdits[item.id]?.text ?? item.text;
                              const editedSub = cviItemEdits[item.id]?.sub ?? item.sub;
                              return (
                                <div key={item.id} style={{ marginBottom: idx < section.items.length - 1 ? 16 : 0, padding: 16, borderRadius: 8, background: "#FAFBFC", border: "1px solid #f3f4f6" }}>
                                  {/* Item header: ID + Sub-factor */}
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                                    <span style={{ fontSize: 12, fontWeight: 800, color: section.color, background: `${section.color}10`, padding: "3px 8px", borderRadius: 6, fontFamily: "'Inter', sans-serif" }}>
                                      {item.id}
                                    </span>
                                    <span style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", letterSpacing: 1 }}>SUB-FACTOR</span>
                                  </div>

                                  {/* Sub-factor input */}
                                  <div style={{ marginBottom: 10 }}>
                                    <input
                                      style={{ ...S.catEditInput, width: "100%", fontSize: 13, fontWeight: 600, color: "#374151" }}
                                      value={editedSub}
                                      onChange={(e) => setCviItemEdits(prev => ({ ...prev, [item.id]: { ...prev[item.id], sub: e.target.value } }))}
                                      placeholder="Sub-factor"
                                    />
                                  </div>

                                  {/* Item text textarea */}
                                  <div>
                                    <label style={{ fontSize: 10, fontWeight: 600, color: "#9CA3AF", letterSpacing: 1, display: "block", marginBottom: 4 }}>TEXT ITEM</label>
                                    <textarea
                                      style={{
                                        ...S.catEditInput, width: "100%", minHeight: 72, resize: "vertical" as const,
                                        fontSize: 13, lineHeight: 1.6, color: "#1F2937", fontFamily: "'Inter', sans-serif",
                                      }}
                                      value={editedText}
                                      onChange={(e) => setCviItemEdits(prev => ({ ...prev, [item.id]: { ...prev[item.id], text: e.target.value } }))}
                                      placeholder="Textul itemului..."
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* ── Instruction Text Editor ── */}
                    <div style={{ ...S.configCard, marginBottom: 20 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                        <Type size={16} style={{ color: "#6366F1" }} />
                        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6366F1" }}>INSTRUCȚIUNI FORMULAR</span>
                      </div>
                      <div style={{ padding: 16, borderRadius: 8, background: "#FAFBFC", border: "1px solid #f3f4f6" }}>
                        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.7 }}>
                          <p style={{ marginBottom: 8 }}><strong style={{ color: "#374151" }}>Notă academică:</strong> Acest instrument evaluează <strong>validitatea de conținut</strong> a celor 35 de itemi ai scalei RIFC Marketing.</p>
                          <p style={{ marginBottom: 8 }}>Evaluarea se face pe scala <strong>Likert 1-4</strong>: 1 = Irelevant, 2 = Parțial relevant, 3 = Relevant, 4 = Extrem relevant.</p>
                          <p style={{ marginBottom: 0 }}>Rezultatele sunt procesate conform metodologiei <strong>CVI (Content Validity Index)</strong> și <strong>Fleiss&apos; Kappa</strong> pentru concordanța inter-evaluatori.</p>
                        </div>
                      </div>
                    </div>

                    {/* ── Summary ── */}
                    <div style={{ padding: "16px 20px", borderRadius: 10, background: "#F9FAFB", border: "1px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <ListOrdered size={16} style={{ color: "#6B7280" }} />
                        <span style={{ fontSize: 13, color: "#6B7280" }}>
                          <strong style={{ color: "#111827" }}>35 itemi</strong> în 4 dimensiuni: R (7) + I (10) + F (11) + C (7)
                        </span>
                      </div>
                      <span style={{ fontSize: 12, color: "#9CA3AF" }}>
                        {Object.keys(cviItemEdits).length > 0
                          ? `${Object.keys(cviItemEdits).length} itemi modificați`
                          : "Nicio modificare"
                        }
                      </span>
                    </div>
                  </>
                )}

                {/* ═══ MAIN SUB-TAB (Expert Cards + Stats + Results) ═══ */}
                {cviSubTab === "main" && (
                <>

                {/* ── Stats Panel ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Invitați", value: cviExperts.length, color: "#6366F1" },
                    { label: "Completat", value: cviExperts.filter((e: any) => e.status === "completed").length, color: "#22C55E" },
                    { label: "Pending", value: cviExperts.filter((e: any) => e.status === "pending").length, color: "#F59E0B" },
                    { label: "Fleiss κ", value: cviResults?.fleissKappa !== undefined && cviResults.fleissKappa > 0 ? cviResults.fleissKappa.toFixed(3) : "—", color: "#8B5CF6" },
                  ].map((s, i) => (
                    <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ── General CVI Access Link Card ── */}
                <div style={{ background: "linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)", border: "1px solid #BFDBFE", borderRadius: 12, padding: 20, marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Globe size={20} color="#fff" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1E3A5F", marginBottom: 2 }}>Link General — Pagina CVI</div>
                        <div style={{ fontSize: 12, color: "#6B7280" }}>Pagina de informare pentru experți (fără token). Experții primesc link individual de mai jos.</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <code style={{ fontSize: 12, color: "#2563EB", background: "#EFF6FF", padding: "4px 10px", borderRadius: 6, border: "1px solid #BFDBFE", fontFamily: "monospace" }}>
                        rifcmarketing.com/articolstiintific/cvi
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://rifcmarketing.com/articolstiintific/cvi");
                          setCviCopied("general");
                          setTimeout(() => setCviCopied(null), 2000);
                        }}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "6px 14px", borderRadius: 8, border: "none",
                          background: cviCopied === "general" ? "#22C55E" : "#2563EB",
                          color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {cviCopied === "general" ? <><Check size={13} /> Copiat!</> : <><Copy size={13} /> Copiază Link</>}
                      </button>
                      <button
                        onClick={() => window.open("https://rifcmarketing.com/articolstiintific/cvi", "_blank")}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          padding: "6px 14px", borderRadius: 8, border: "1px solid #BFDBFE",
                          background: "#fff", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        <ExternalLink size={13} /> Deschide
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Add/Edit CVI Expert Form ── */}
                {showAddCviExpert && (
                  <div style={{ ...S.configCard, borderColor: "#6366F1", borderWidth: 2, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <Target size={16} style={{ color: "#6366F1" }} />
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#6366F1" }}>{editingCviExpertId ? "EDITARE EXPERT CVI" : "EXPERT CVI NOU"}</span>
                    </div>
                    {/* Row 1: Nume + Organizație */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={S.configLabel}>NUME COMPLET *</label>
                        <input style={{ ...S.catEditInput, width: "100%" }} value={cviExpertForm.name} onChange={(e) => setCviExpertForm({ ...cviExpertForm, name: e.target.value })} placeholder="ex: Dr. Maria Popescu" />
                      </div>
                      <div>
                        <label style={S.configLabel}>ORGANIZAȚIE</label>
                        <input style={{ ...S.catEditInput, width: "100%" }} value={cviExpertForm.org} onChange={(e) => setCviExpertForm({ ...cviExpertForm, org: e.target.value })} placeholder="ex: Universitatea din București" />
                      </div>
                    </div>
                    {/* Row 2: Rol + Experiență + Email */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <label style={S.configLabel}>ROL / FUNCȚIE</label>
                        <input style={{ ...S.catEditInput, width: "100%" }} value={cviExpertForm.role} onChange={(e) => setCviExpertForm({ ...cviExpertForm, role: e.target.value })} placeholder="ex: Profesor Marketing" />
                      </div>
                      <div>
                        <label style={S.configLabel}>EXPERIENȚĂ</label>
                        <input style={{ ...S.catEditInput, width: "100%" }} value={cviExpertForm.experience} onChange={(e) => setCviExpertForm({ ...cviExpertForm, experience: e.target.value })} placeholder="ex: 10+ ani, PhD" />
                      </div>
                      <div>
                        <label style={S.configLabel}>EMAIL</label>
                        <input style={{ ...S.catEditInput, width: "100%" }} value={cviExpertForm.email} onChange={(e) => setCviExpertForm({ ...cviExpertForm, email: e.target.value })} placeholder="expert@email.com" type="email" />
                      </div>
                    </div>
                    {/* Buttons */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...S.addCatBtn, background: "#6366F1", opacity: cviSaving ? 0.6 : 1 }} onClick={saveCviExpert} disabled={cviSaving}>
                        {cviSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                        {cviSaving ? "Se salveaza..." : editingCviExpertId ? "Salveaza modificarile" : "Salveaza & Genereaza link"}
                      </button>
                      <button style={S.galleryEditBtn} onClick={() => { setShowAddCviExpert(false); setEditingCviExpertId(null); setCviExpertForm({ name: "", org: "", role: "", experience: "", email: "" }); }}><X size={14} /> Anuleaza</button>
                    </div>
                  </div>
                )}

                {/* ── Expert Cards Grid ── */}
                {cviExperts.length === 0 && !showAddCviExpert ? (
                  <div style={S.placeholderTab}>
                    <Target size={48} style={{ color: "#d1d5db" }} />
                    <h3 style={{ fontSize: 18, color: "#374151", marginTop: 16 }}>Niciun expert CVI inregistrat</h3>
                    <p style={{ color: "#6B7280", fontSize: 14 }}>Apasa &quot;Adauga Expert&quot; pentru a crea un profil si genera un link unic de evaluare CVI.</p>
                  </div>
                ) : cviExperts.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16, marginBottom: 24 }}>
                    {cviExperts.map((exp: any) => {
                      const isCompleted = exp.status === "completed";
                      const isRevoked = exp.status === "revoked";
                      const isPending = exp.status === "pending";
                      const initial = exp.name?.charAt(0)?.toUpperCase() || "?";
                      const cviLink = `https://rifcmarketing.com/articolstiintific/cvi?token=${exp.token}`;

                      return (
                        <div
                          key={exp.id}
                          style={{
                            ...S.configCard,
                            borderColor: isCompleted ? "#22C55E" : isRevoked ? "#fca5a5" : "#e5e7eb",
                            borderWidth: 1,
                            background: isCompleted ? "#f0fdf4" : isRevoked ? "#fef2f2" : "#fff",
                            padding: "16px 20px",
                            position: "relative" as const,
                          }}
                        >
                          {/* Status indicator */}
                          <div style={{ position: "absolute" as const, top: 12, right: 12, display: "flex", gap: 6, alignItems: "center" }}>
                            {isRevoked && (
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#DC2626", background: "#fef2f2", border: "1px solid #fca5a5", padding: "2px 8px", borderRadius: 10 }}>REVOCAT</span>
                            )}
                            {isCompleted && (
                              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#16A34A", background: "#DCFCE7", border: "1px solid #86EFAC", padding: "2px 8px", borderRadius: 10 }}>COMPLETAT</span>
                            )}
                            <span style={{
                              width: 8, height: 8, borderRadius: "50%",
                              background: isCompleted ? "#22C55E" : isRevoked ? "#DC2626" : "#F59E0B",
                            }} />
                          </div>

                          {/* Expert info */}
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                            <div style={{
                              width: 48, height: 48, borderRadius: "50%",
                              background: isCompleted ? "linear-gradient(135deg, #22C55E, #16A34A)" : isRevoked ? "#d1d5db" : "linear-gradient(135deg, #6366F1, #4F46E5)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0,
                            }}>
                              {initial}
                            </div>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{exp.name || "Fără nume"}</div>
                              <div style={{ display: "flex", gap: 8, marginTop: 2, flexWrap: "wrap" as const }}>
                                {exp.email && <span style={{ fontSize: 11, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}><Mail size={10} /> {exp.email}</span>}
                                {exp.org && <span style={{ fontSize: 11, color: "#6B7280" }}>{exp.org}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Progress: 0/35 items */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                            <span style={{ fontSize: 11, color: "#6B7280" }}>Progres evaluare</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: isCompleted ? "#22C55E" : "#D97706" }}>
                              {isCompleted ? "35 / 35" : "0 / 35"}
                            </span>
                          </div>
                          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
                            <div style={{ height: "100%", background: isCompleted ? "#22C55E" : "#D97706", borderRadius: 2, width: isCompleted ? "100%" : "0%", transition: "width 0.3s" }} />
                          </div>

                          {/* Info pills */}
                          {(exp.role || exp.experience) && (
                            <div style={{ marginBottom: 10, display: "flex", flexWrap: "wrap" as const, gap: 4 }}>
                              {exp.role && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 8, background: "#EEF2FF", color: "#6366F1", border: "1px solid #C7D2FE" }}>{exp.role}</span>}
                              {exp.experience && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 8, background: "#f0fdf4", color: "#059669", border: "1px solid #bbf7d0" }}>{exp.experience}</span>}
                            </div>
                          )}

                          {/* Action buttons */}
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                            <button
                              style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px" }}
                              onClick={() => {
                                setEditingCviExpertId(exp.id);
                                setCviExpertForm({
                                  name: exp.name || "",
                                  org: exp.org || "",
                                  role: exp.role || "",
                                  experience: exp.experience || "",
                                  email: exp.email || "",
                                });
                                setShowAddCviExpert(true);
                              }}
                              title="Editeaza expert"
                            >
                              <Pencil size={12} /> Editeaza
                            </button>
                            <button
                              style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", background: cviCopied === exp.id ? "#dcfce7" : "#f3f4f6" }}
                              onClick={() => {
                                navigator.clipboard.writeText(cviLink);
                                setCviCopied(exp.id);
                                setTimeout(() => setCviCopied(null), 2000);
                              }}
                              title="Copiaza link"
                            >
                              {cviCopied === exp.id ? <Check size={12} style={{ color: "#22C55E" }} /> : <Copy size={12} />}
                              {cviCopied === exp.id ? "Copiat!" : "Link"}
                            </button>
                            <button
                              style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px" }}
                              onClick={() => window.open(cviLink, "_blank")}
                              title="Deschide link expert"
                            >
                              <ExternalLink size={12} /> Deschide
                            </button>
                            {isPending && (
                              <button
                                style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", color: "#DC2626" }}
                                onClick={() => toggleCviExpertAccess(exp.token, true)}
                                title="Revoca acces"
                              >
                                <ShieldOff size={12} /> Revoca
                              </button>
                            )}
                            {isRevoked && (
                              <button
                                style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", color: "#059669" }}
                                onClick={() => toggleCviExpertAccess(exp.token, false)}
                                title="Restabileste acces"
                              >
                                <ShieldCheck size={12} /> Restabileste
                              </button>
                            )}
                            <button
                              style={{ ...S.galleryEditBtn, fontSize: 11, padding: "5px 10px", color: "#DC2626" }}
                              onClick={() => deleteCviExpert(exp.id)}
                              title="Sterge expert"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Created date */}
                          <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 8 }}>
                            Creat: {new Date(exp.created_at).toLocaleDateString("ro-RO")}
                            {exp.completed_at && <span style={{ color: "#22C55E" }}> | Completat: {new Date(exp.completed_at).toLocaleDateString("ro-RO")}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── CVI Results Table (only show when there are completed responses) ── */}
                {cviResults?.summary && cviResults.summary.length > 0 && (cviResults.stats?.completed > 0 || cviResults.stats?.totalResponses > 0) && (
                  <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 20, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Rezultate CVI per Item</h3>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => {
                            setCviExportingCsv(true);
                            try {
                              const header = "Item,Label,Construct,N,CVI,Status\n";
                              const rows = (cviResults.summary || []).map((s: any) =>
                                `${s.item_id},"${s.item_label}",${s.construct},${s.n_total},${s.cvi_score},${s.status}`
                              ).join("\n");
                              const blob = new Blob([header + rows], { type: "text/csv" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url; a.download = `rifc-cvi-results-${new Date().toISOString().slice(0,10)}.csv`;
                              a.click(); URL.revokeObjectURL(url);
                            } catch { /* ignore */ }
                            setCviExportingCsv(false);
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          <FileText size={12} /> Export CSV
                        </button>
                        <button
                          onClick={() => {
                            setCviExportingJson(true);
                            try {
                              const exportObj = {
                                generated: new Date().toISOString(),
                                protocol: "RIFC Marketing Protocol",
                                author: "Dumitru Talmazan, 2026",
                                osf: "osf.io/9y75d",
                                stats: cviResults.stats,
                                fleissKappa: cviResults.fleissKappa,
                                dimensionCvi: cviResults.dimensionCvi,
                                itemSummary: cviResults.summary,
                                anonymizedData: cviResults.exportData,
                              };
                              const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: "application/json" });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url; a.download = `rifc-cvi-osf-${new Date().toISOString().slice(0,10)}.json`;
                              a.click(); URL.revokeObjectURL(url);
                            } catch { /* ignore */ }
                            setCviExportingJson(false);
                          }}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "6px 12px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          <FileText size={12} /> Export JSON (OSF)
                        </button>
                      </div>
                    </div>

                    {/* Dimension CVI summary */}
                    {cviResults.dimensionCvi && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                        {[
                          { d: "R", label: "Relevanță", color: "#DC2626", bg: "#FEF2F2" },
                          { d: "I", label: "Interes", color: "#2563EB", bg: "#EFF6FF" },
                          { d: "F", label: "Formă", color: "#059669", bg: "#ECFDF5" },
                          { d: "C", label: "Claritate", color: "#D97706", bg: "#FFFBEB" },
                        ].map(({ d, label, color, bg }) => (
                          <div key={d} style={{ padding: 14, borderRadius: 10, textAlign: "center", background: bg, color }}>
                            <strong style={{ display: "block", fontSize: 24, fontWeight: 800 }}>
                              {cviResults.dimensionCvi[d]?.toFixed(2) || "—"}
                            </strong>
                            <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>CVI {label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Items table */}
                    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: "#f9fafb" }}>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Item</th>
                            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Sub-factor</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Construct</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>N</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>CVI</th>
                            <th style={{ padding: "8px 12px", textAlign: "center", fontWeight: 600, borderBottom: "1px solid #e5e7eb" }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(cviResults.summary || []).map((item: any) => {
                            const dimColor = item.construct === "R" ? "#DC2626" : item.construct === "I" ? "#2563EB" : item.construct === "F" ? "#059669" : "#D97706";
                            const statusBg = item.status === "PASS" ? "#DCFCE7" : item.status === "REVISE" ? "#FEF3C7" : item.status === "REJECT" ? "#FEE2E2" : "#F3F4F6";
                            const statusColor = item.status === "PASS" ? "#16A34A" : item.status === "REVISE" ? "#D97706" : item.status === "REJECT" ? "#DC2626" : "#9CA3AF";
                            return (
                              <tr key={item.item_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                <td style={{ padding: "8px 12px" }}>
                                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 6px", borderRadius: 4, color: dimColor, background: `${dimColor}10` }}>
                                    {item.item_id}
                                  </span>
                                </td>
                                <td style={{ padding: "8px 12px", color: "#374151" }}>{item.item_label}</td>
                                <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700, color: dimColor }}>{item.construct}</td>
                                <td style={{ padding: "8px 12px", textAlign: "center", color: "#6B7280" }}>{item.n_total}</td>
                                <td style={{ padding: "8px 12px", textAlign: "center", fontWeight: 700 }}>
                                  {item.cvi_score > 0 ? item.cvi_score.toFixed(2) : "—"}
                                </td>
                                <td style={{ padding: "8px 12px", textAlign: "center" }}>
                                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 700, background: statusBg, color: statusColor, textTransform: "uppercase" }}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                </>
                )}

              </>
            )}
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

          // Completion detection — mirrors backend isEffectivelyCompleted():
          // completed_at is set OR respondent evaluated all active stimuli
          const expectedLogResponses = stimuli.filter(s => s.is_active).length;
          const isLogCompleted = (l: any) => !!l.completed_at || (expectedLogResponses > 0 && (l.responseCount || 0) >= expectedLogResponses);

          // Stats
          const completedCount = filtered.filter((l: any) => isLogCompleted(l)).length;
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
                const completedToday = filtered.filter((l: any) => isLogCompleted(l) && (l.completed_at || l.started_at) && (l.completed_at || l.started_at).slice(0, 10) === todayStr).length;
                const completedMonth = filtered.filter((l: any) => isLogCompleted(l) && (l.completed_at || l.started_at) && (l.completed_at || l.started_at).slice(0, 7) === monthStr).length;

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
                                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: isLogCompleted(l) ? "#d1fae5" : "#fef3c7", color: isLogCompleted(l) ? "#065f46" : "#92400e", fontWeight: 600 }}>{isLogCompleted(l) ? "COMPLET" : `Pas ${l.step_completed}`}</span>
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
                                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: isLogCompleted(l) ? "#d1fae5" : "#fef3c7", color: isLogCompleted(l) ? "#065f46" : "#92400e", fontWeight: 600 }}>{isLogCompleted(l) ? "COMPLET" : `Pas ${l.step_completed}`}</span>
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
                        const isComplete = isLogCompleted(log);
                        const displayDate = (completedDate && !isNaN(completedDate.getTime())) ? completedDate : (startedDate && !isNaN(startedDate.getTime()) ? startedDate : null);
                        const hasValidDate = !!displayDate;
                        const duration = (completedDate && !isNaN(completedDate.getTime()) && startedDate) ? Math.round((completedDate.getTime() - startedDate.getTime()) / 1000) : null;
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
                          const startedDate = log.started_at ? new Date(log.started_at) : null;
                          const isComplete = isLogCompleted(log);
                          const archiveDisplayDate = completedDate || startedDate;
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
                                {archiveDisplayDate ? (
                                  <><div style={{ fontWeight: 600, color: "#111827" }}>{archiveDisplayDate.toLocaleDateString("ro-RO")}</div><div style={{ color: "#6B7280", fontSize: 11 }}>{archiveDisplayDate.toLocaleTimeString("ro-RO", { hour: "2-digit", minute: "2-digit" })}</div></>
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
