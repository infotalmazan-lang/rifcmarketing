"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Award,
  BookOpen,
  Users,
  Lightbulb,
  Trophy,
  Mic2,
  Briefcase,
  ChevronDown,
  Tag,
  CheckCircle,
  Bell,
  BarChart3,
  Edit3,
  Trash2,
  Image,
  Link2,
  FileText,
  Phone,
  Mail,
  ClipboardCheck,
  MessageSquare,
  PlusCircle,
  BookMarked,
  Handshake,
  Rocket,
  Globe2,
  Zap,
  Loader2,
  Ban,
  Star,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   R IF C — Aplicare Programe v3
   Activity blocks system — jurnal de activitate per program
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
type CategoryKey = "conferinte" | "granturi" | "competitii" | "forumuri" | "premii" | "oportunitati" | "publicatii" | "parteneriate" | "acceleratoare" | "retele";
type AppStatus = "nesetat" | "aplicat" | "in_lucru" | "nerelevant" | "dupa_lansare";
type BlockType = "email" | "aplicare" | "poza" | "link" | "reminder" | "nota" | "telefon" | "document";

interface ActivityBlock {
  id: string;
  type: BlockType;
  date: string;
  content: string;
  created_at: string;
}

interface Program {
  id: string;
  title: string;
  category: CategoryKey;
  description: string;
  deadline: string | null;
  location: string | null;
  url: string | null;
  budget: string | null;
  organizer: string | null;
  priority: number;
  tags: string[];
  notes: string | null;
  created_at: string;
  appStatus: AppStatus;
  lunaAplicare: string | null;
  // v3: activity blocks replace old mesaj/reminder/monitoring
  blocks: ActivityBlock[];
  // keep legacy for migration
  mesajTrimis?: string | null;
  mesajData?: string | null;
  reminder?: string | null;
  reminderNote?: string | null;
  monitoring?: string | null;
}

interface AutoOpportunity {
  id: string;
  title: string;
  category: CategoryKey;
  description: string;
  deadline: string | null;
  location: string | null;
  url: string | null;
  organizer: string | null;
  budget: string | null;
  tags: string[];
  relevanceScore: number;
  relevanceReason: string;
  source: string;
  scannedAt: string;
  status: "new" | "added" | "dismissed" | "blocked";
}

interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

interface BlockTypeDef {
  type: BlockType;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  placeholder: string;
}

const BLOCK_TYPES: BlockTypeDef[] = [
  { type: "email", label: "Email Trimis", icon: Mail, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", placeholder: "Subiect, destinatar, continut email..." },
  { type: "aplicare", label: "Aplicare Depusa", icon: ClipboardCheck, color: "#059669", bg: "#F0FDF4", border: "#86EFAC", placeholder: "Detalii aplicare, numar referinta, documente..." },
  { type: "poza", label: "Poza / Screenshot", icon: Image, color: "#D97706", bg: "#FFFBEB", border: "#FCD34D", placeholder: "Descriere imagine, URL imagine, ce arata..." },
  { type: "link", label: "Link Salvat", icon: Link2, color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD", placeholder: "URL si descriere link important..." },
  { type: "reminder", label: "Reminder", icon: Bell, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", placeholder: "Ce trebuie facut, data limita..." },
  { type: "nota", label: "Nota", icon: FileText, color: "#374151", bg: "#F9FAFB", border: "#D1D5DB", placeholder: "Notite, observatii, idei..." },
  { type: "telefon", label: "Apel Telefonic", icon: Phone, color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", placeholder: "Cu cine, ce s-a discutat, rezultat..." },
  { type: "document", label: "Document", icon: FileText, color: "#4338CA", bg: "#EEF2FF", border: "#C7D2FE", placeholder: "Tip document, continut, unde se afla..." },
];

const CATEGORIES: CategoryDef[] = [
  { key: "conferinte", label: "Conferinte Academice", icon: Mic2, color: "#2563EB", gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)" },
  { key: "granturi", label: "Granturi", icon: DollarSign, color: "#059669", gradient: "linear-gradient(135deg, #059669, #047857)" },
  { key: "competitii", label: "Competitii cu Premii", icon: Trophy, color: "#D97706", gradient: "linear-gradient(135deg, #D97706, #B45309)" },
  { key: "forumuri", label: "Forumuri", icon: Users, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
  { key: "premii", label: "Premii", icon: Award, color: "#DC2626", gradient: "linear-gradient(135deg, #DC2626, #B91C1C)" },
  { key: "oportunitati", label: "Oportunitati", icon: Lightbulb, color: "#0891B2", gradient: "linear-gradient(135deg, #0891B2, #0E7490)" },
  { key: "publicatii", label: "Publicatii", icon: BookMarked, color: "#4338CA", gradient: "linear-gradient(135deg, #4338CA, #3730A3)" },
  { key: "parteneriate", label: "Parteneriate", icon: Handshake, color: "#0D9488", gradient: "linear-gradient(135deg, #0D9488, #0F766E)" },
  { key: "acceleratoare", label: "Acceleratoare", icon: Rocket, color: "#E11D48", gradient: "linear-gradient(135deg, #E11D48, #BE123C)" },
  { key: "retele", label: "Retele Academice", icon: Globe2, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
];

type TabKey = "all" | CategoryKey;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ALL" },
  ...CATEGORIES.map((c) => ({ key: c.key as TabKey, label: c.label })),
];

const APP_STATUS_CONFIG: Record<AppStatus, { bg: string; text: string; label: string; border: string }> = {
  nesetat: { bg: "#F3F4F6", text: "#6B7280", label: "Nesetat", border: "#D1D5DB" },
  aplicat: { bg: "#DCFCE7", text: "#16A34A", label: "Aplicat", border: "#86EFAC" },
  in_lucru: { bg: "#DBEAFE", text: "#2563EB", label: "In lucru", border: "#93C5FD" },
  nerelevant: { bg: "#F3F4F6", text: "#9CA3AF", label: "Nerelevant", border: "#D1D5DB" },
  dupa_lansare: { bg: "#FEF3C7", text: "#D97706", label: "Dupa lansare", border: "#FCD34D" },
};

const ACCESS_CODE = "APLICARE2026";
const STORAGE_KEY = "rifc-aplicare-access";
const DATA_KEY = "rifc-aplicare-programs-v3";
const AUTOEVENT_KEY = "rifc-autoevent-results";
const BLOCKED_SOURCES_KEY = "rifc-blocked-sources";
const AUTOEVENT_RULES_KEY = "rifc-autoevent-rules";

const DEFAULT_RULES = {
  keywords: "marketing measurement, campaign diagnostics, marketing ROI, marketing effectiveness, advertising failure, marketing framework, marketing audit, AI in marketing, psychometric validation, scale development, factor analysis, marketing SaaS, MarTech",
  excludeKeywords: "PhD-only, post-doc >7 ani, non-marketing, doar ONG, doar cetateni UE",
  languages: "RO, EN, FR, DE, RU",
  budgetPersonal: "0-5000 EUR",
  geography: "Moldova, Romania, UE, Global",
  eligibility: "EU Widening, Eastern Partnership, ITC country, Associated Country",
  stage: "working paper, abstract, extended abstract, pre-publication, pre-registered, early-stage",
  customNotes: "",
};
const OLD_DATA_KEY = "rifc-aplicare-programs-v2";

// ── Seed Data ─────────────────────────────────────────────
const SEED_PROGRAMS: Omit<Program, "id" | "created_at" | "appStatus" | "blocks" | "mesajTrimis" | "mesajData" | "reminder" | "reminderNote" | "monitoring">[] = [
  // ── Conferinte Academice (6) ──
  {
    title: "EMAC Fall Conference 2026",
    category: "conferinte",
    description: "Tinteste cercetatorii din societatile in tranzitie (Moldova se califica). Accepta lucrari in diverse stadii de dezvoltare. Cel mai potrivit forum european pentru profilul RIFC.",
    deadline: "30 Aprilie 2026",
    location: "Germania (Universitatea din Bremen)",
    url: "https://www.uni-bremen.de/en/markstones/emac-fall-conference-2026",
    budget: "Best Paper Award + Membership EMAC 2027 (~EUR 300-450)",
    organizer: "EMAC",
    priority: 10,
    tags: ["PRIORITATE MAXIMA", "DESCHIS", "Pre-publicare eligibil"],
    notes: null,
    lunaAplicare: "Aprilie 2026",
  },
  {
    title: "CBIM International Conference 2026",
    category: "conferinte",
    description: "Accepta abstracte (nu lucrari complete). RIFC pozitionat ca instrument de diagnostic pentru campanii B2B. Potential articol in JBIM (Journal of Business & Industrial Marketing).",
    deadline: "16 Martie 2026",
    location: "Spania (Universidade de Vigo, Galicia)",
    url: "https://cbim2026.com/Home/en/",
    budget: "Potential publicare in JBIM (Journal of Business & Industrial Marketing)",
    organizer: "CBIM",
    priority: 8,
    tags: ["URGENT", "Pre-publicare"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "ACR Annual Conference 2026",
    category: "conferinte",
    description: "Track explicit 'Working Papers' ca sesiuni poster. Prestigiu ridicat in comportamentul consumatorului.",
    deadline: "Estimat Martie-Aprilie 2026",
    location: "SUA (Chicago, Palmer House Hilton)",
    url: "https://acrwebsite.org/events/acr26/",
    budget: "Cost: ~$350-550",
    organizer: "ACR",
    priority: 7,
    tags: ["Working Papers", "24-27 Sep 2026"],
    notes: null,
    lunaAplicare: "Aprilie 2026",
  },
  {
    title: "SMA Annual Conference 2026",
    category: "conferinte",
    description: "Accepta abstracte scurte, manuscrise in lucru si manuscrise finalizate. Journal asociat: Journal of Marketing Theory and Practice.",
    deadline: "Estimat Iunie-August 2026",
    location: "SUA",
    url: "https://www.societyformarketingadvances.org/sma-conference",
    budget: "Cost: ~$300-500 inclusiv membership",
    organizer: "SMA",
    priority: 7,
    tags: ["NOV 2026", "Pre-publicare"],
    notes: null,
    lunaAplicare: "Iulie 2026",
  },
  {
    title: "ASEM Simpozionul Tinerilor Cercetatori — Ed. XXVI",
    category: "conferinte",
    description: "Simpozion national moldovenesc pentru tineri cercetatori. Prima oportunitate de prezentare publica RIFC cu risc zero.",
    deadline: "24-25 Aprilie 2026",
    location: "Moldova (ASEM, Chisinau)",
    url: "https://ase.md/simpozionul-stiintific-international-al-tinerilor-cercetatori",
    budget: "ZERO cost",
    organizer: "ASEM",
    priority: 8,
    tags: ["LOCAL MOLDOVA", "RO/EN/FR/DE/RU"],
    notes: null,
    lunaAplicare: "Aprilie 2026",
  },
  {
    title: "MBD 2026 — Marketing and Business Development",
    category: "conferinte",
    description: "Lucrari publicate in Emerging Trends in Marketing and Management. Teme: marketing research, AI in marketing, antreprenoriat.",
    deadline: "21-23 Iunie 2026",
    location: "Romania (Predeal, ASE Bucuresti)",
    url: "https://www.mk.ase.ro/mbd/",
    budget: "Indexare DOAJ, RePEC, EBSCO, Google Scholar",
    organizer: "Facultatea de Marketing, ASE Bucuresti",
    priority: 9,
    tags: ["VENUE REGIONAL IDEAL", "Pre-publicare", "RO/EN"],
    notes: null,
    lunaAplicare: "Mai 2026",
  },
  // ── Granturi UE (7) ──
  {
    title: "Horizon Europe WIDERA Twinning 2026",
    category: "granturi",
    description: "Finanteaza networking, capacity building, staff exchange si pana la 30% activitati de cercetare. CEA MAI VALOROASA OPORTUNITATE DIN LISTA. Moldova beneficiaza de acces preferential ca tara Widening (participare extinsa UE).",
    deadline: "9 Aprilie 2026 (17:00 Bruxelles)",
    location: "UE — Parteneri: UTM/USM + min. 2 institutii UE top",
    url: "https://rea.ec.europa.eu/funding-and-grants/horizon-europe-widening-participation",
    budget: "EUR 800,000 — EUR 1,500,000 per proiect",
    organizer: "Comisia Europeana / REA",
    priority: 10,
    tags: ["CEA MAI MARE VALOARE", "Pre-publicare ideal", "Widening"],
    notes: "Strategie: Prezinta -> Publica -> Premiaza. Profilul dual (lector universitar + antreprenor din Moldova) ofera acces preferential la instrumentele UE de Widening si finantarea din Parteneriatul Estic.",
    lunaAplicare: "Aprilie 2026",
  },
  {
    title: "Erasmus+ KA2 Cooperation Partnerships",
    category: "granturi",
    description: "Poate finanta RIFC ca metodologie educationala pentru studentii de marketing. UTM/USM + 2 universitati UE. Moldova pe deplin eligibila.",
    deadline: "5 Martie 2026 (12:00 CET)",
    location: "UE — Min. 3 organizatii din 3 tari",
    url: "https://erasmus-plus.ec.europa.eu/",
    budget: "EUR 120,000 — EUR 400,000 per proiect",
    organizer: "Erasmus+",
    priority: 9,
    tags: ["URGENT"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "Erasmus+ Small-Scale Partnerships",
    category: "granturi",
    description: "Bariera minima de intrare — excelent pentru aplicanti UE pentru prima data. Parteneriat cu o universitate romaneasca pentru pilot RIFC.",
    deadline: "5 Martie 2026 (prima runda)",
    location: "UE — Doar 2 organizatii din 2 tari",
    url: "https://erasmus-plus.ec.europa.eu/",
    budget: "EUR 30,000 sau EUR 60,000",
    organizer: "Erasmus+",
    priority: 9,
    tags: ["URGENT", "Prima aplicare UE"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "MSCA Postdoctoral Fellowships 2026",
    category: "granturi",
    description: "Cercetator propune propriul proiect la o institutie gazda UE. Ideal pentru dezvoltarea si validarea RIFC la o universitate prestigioasa.",
    deadline: "9 Septembrie 2026",
    location: "UE — Orice nationalitate",
    url: "https://marie-sklodowska-curie-actions.ec.europa.eu/actions/postdoctoral-fellowships",
    budget: "~EUR 7,500/luna pentru 1-2 ani (~EUR 180K total)",
    organizer: "MSCA / Comisia Europeana",
    priority: 8,
    tags: ["SEP 2026", "Pre-publicare"],
    notes: null,
    lunaAplicare: "Septembrie 2026",
  },
  {
    title: "COST Action Open Call 2026",
    category: "granturi",
    description: "Propune o actiune de networking pe 4 ani: 'Innovation in Marketing Measurement Methodology'. Cercetator ar conduce intreaga retea europeana. Moldova ITC eligibila — acces preferential Widening.",
    deadline: "Estimat Octombrie 2026",
    location: "UE — Min. 7 tari, Moldova ITC eligibila",
    url: "https://www.cost.eu/funding/open-call-a-simple-one-step-application-process/",
    budget: "~EUR 575,000 total peste 4 ani",
    organizer: "COST Association",
    priority: 8,
    tags: ["OCT 2026", "Widening"],
    notes: null,
    lunaAplicare: "Octombrie 2026",
  },
  {
    title: "ERC Starting Grant 2027",
    category: "granturi",
    description: "Institutia gazda trebuie sa fie in UE/Tara Asociata (Moldova se califica). ERC finanteaza explicit ideile revolutionare. ~15% rata de succes.",
    deadline: "Estimat Octombrie 2026 (pentru 2027)",
    location: "UE — PhD + 2-7 ani post-doctorat",
    url: "https://erc.europa.eu/apply-grant/starting-grant",
    budget: "Pana la EUR 1,500,000 (+EUR 1M suplimentar)",
    organizer: "ERC / Comisia Europeana",
    priority: 7,
    tags: ["2027"],
    notes: null,
    lunaAplicare: "Octombrie 2026",
  },
  {
    title: "EU4Innovation East — Specific Moldova",
    category: "granturi",
    description: "Finanteaza incubare, accelerare, hackathoane, mentoring. CONTINUUM GRUP SRL poate aplica pentru integrarea Protocolului RIFC in programe de accelerare startup. Finantare din Parteneriatul Estic UE.",
    deadline: "Activ acum — pana la EUR 250,000 per grant",
    location: "Moldova",
    url: "https://eu4moldova.eu/en/eu4innovation-east",
    budget: "Pana la EUR 250,000 per grant",
    organizer: "Delegatia UE in Moldova",
    priority: 9,
    tags: ["ACTIV ACUM", "Lansat 29 Ian 2026", "Parteneriatul Estic"],
    notes: null,
    lunaAplicare: "Februarie 2026",
  },
  // ── Competitii cu Premii (5) ──
  {
    title: "Romania Startup Awards 2026",
    category: "competitii",
    description: "Categorii: 'Best Startup in Moldova' si 'Best Innovator per Industry'. CONTINUUM GRUP SRL aplica direct.",
    deadline: "25 Februarie 2026",
    location: "Romania (Gala 12 Martie 2026, Bucuresti)",
    url: "https://www.romania-insider.com/registrations-romania-startup-awards-2026",
    budget: "Premiu + vizibilitate",
    organizer: "Romania Startup Awards",
    priority: 10,
    tags: ["5 ZILE — APLICATI AZI!", "Gala 12 Mar"],
    notes: null,
    lunaAplicare: "Februarie 2026",
  },
  {
    title: "Startup Moldova Summit 2026",
    category: "competitii",
    description: "Gazduieste semifinalele regionale Startup World Cup Moldova — castigatorul concureaza pentru $1M in San Francisco. 40+ investitori prezenti.",
    deadline: "22 Aprilie 2026",
    location: "Moldova (Chisinau)",
    url: "https://www.startupmoldova.digital/",
    budget: "Potential: $1,000,000 (Startup World Cup SF)",
    organizer: "Startup Moldova",
    priority: 8,
    tags: ["APR 2026", "Startup World Cup"],
    notes: null,
    lunaAplicare: "Aprilie 2026",
  },
  {
    title: "How to Web Startup Spotlight",
    category: "competitii",
    description: "Cea mai importanta conferinta tech/startup din CEE. Accesibila geografic din Moldova.",
    deadline: "Aplicatii vara 2026",
    location: "Romania (Bucuresti, 6-8 Oct 2026)",
    url: "https://www.howtoweb.co/",
    budget: "Premiu anterior: EUR 880,000 (2023)",
    organizer: "How to Web",
    priority: 8,
    tags: ["OCT 2026", "CEE"],
    notes: null,
    lunaAplicare: "Iunie 2026",
  },
  {
    title: "EFMD Case Writing Competition",
    category: "competitii",
    description: "Scrie un studiu de caz didactic despre implementarea Protocolului RIFC. Categorii includ marketing si antreprenoriat. Publicat de The Case Centre.",
    deadline: "Toamna (monitor site)",
    location: "Belgium / International",
    url: "https://www.efmdglobal.org/efmd-awards/case-writing-competition/",
    budget: "EUR 2,000 per caz castigator",
    organizer: "EFMD",
    priority: 6,
    tags: ["TOAMNA", "Pre-publicare"],
    notes: null,
    lunaAplicare: "Octombrie 2026",
  },
  {
    title: "MIT Solve Global Challenges",
    category: "competitii",
    description: "Track 'Economic Prosperity' se potriveste unui instrument SaaS de diagnostic ce ajuta IMM-urile sa imbunatateasca eficienta marketingului.",
    deadline: "Anual Septembrie-Noiembrie",
    location: "SUA / Global",
    url: "https://solve.mit.edu/challenges",
    budget: "Media: $40,000 per echipa selectata",
    organizer: "MIT",
    priority: 6,
    tags: ["SEP-NOV", "Economic Prosperity"],
    notes: null,
    lunaAplicare: "Septembrie 2026",
  },
  // ── Forumuri & Speaker (4) ──
  {
    title: "DMEXCO 2026",
    category: "forumuri",
    description: "Cel mai important eveniment de marketing digital din Europa. Call for Speakers invita explicit 'cercetatori' si cauta teme 'Marketing Measurement'.",
    deadline: "Aplicatii continue (raspuns in 4 sapt.)",
    location: "Germania (Koln, 23-24 Sep 2026)",
    url: "https://go.dmexco.com/call-for-speaker_dmexco2026",
    budget: "Speaker cost: GRATUIT | 40,000+ participanti",
    organizer: "DMEXCO",
    priority: 9,
    tags: ["DESCHIS ACUM", "1,000+ speakers"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "Content Marketing World 2026",
    category: "forumuri",
    description: "Acces gratuit pentru speakers. Parte din ecosistemul LIONS. Audienta de content marketeri nord-americani.",
    deadline: "15 Martie 2026",
    location: "SUA (Denver, Colorado, 5-7 Oct 2026)",
    url: "https://www.contentmarketingworld.com/speaker-submissions/",
    budget: "Speaker: GRATUIT | 3,000+ participanti",
    organizer: "Content Marketing Institute",
    priority: 7,
    tags: ["MAR 2026"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "TEDx Chisinau",
    category: "forumuri",
    description: "Formula RIFC ca 'an idea worth spreading' — de ce esueaza campaniile de marketing si ecuatia de diagnostic — concept TEDx perfect. Video YouTube durabil.",
    deadline: "Contactati organizatorii direct",
    location: "Moldova (Chisinau)",
    url: "https://www.ted.com/tedx/events/11196",
    budget: "GRATUIT | 200-500 participanti",
    organizer: "TEDx",
    priority: 9,
    tags: ["LOCAL", "YouTube durabil"],
    notes: null,
    lunaAplicare: "Martie 2026",
  },
  {
    title: "GPeC Summit",
    category: "forumuri",
    description: "Cel mai important eveniment e-commerce/digital marketing din CEE. Accepta speakers cu cercetare in marketing.",
    deadline: "De doua ori pe an (Mai si Octombrie)",
    location: "Romania (Bucuresti)",
    url: "https://www.gpec.ro/en/",
    budget: "Comunitate 30,000+ | Fost speakers: Dan Ariely, Mark Schaefer",
    organizer: "GPeC",
    priority: 8,
    tags: ["CEE", "Mai/Oct"],
    notes: null,
    lunaAplicare: "Aprilie 2026",
  },
  // ── Premii Academice (4) ──
  {
    title: "Emerald Literati Awards",
    category: "premii",
    description: "Necesita publicare intr-un jurnal Emerald mai intai. Premiul este automat dupa publicare.",
    deadline: "Post-publicare",
    location: "UK / International",
    url: "https://www.emeraldgrouppublishing.com/our-awards/emerald-literati-awards",
    budget: "Outstanding Paper Award + Open Access status",
    organizer: "Emerald Publishing",
    priority: 6,
    tags: ["POST-PUBLICARE", "European J. of Marketing"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Academy of Marketing Teaching Excellence Awards",
    category: "premii",
    description: "RIFC ca instrument didactic inovativ se potriveste 'Innovation in marketing curriculum'. Instrumentele didactice se califica fara articol publicat.",
    deadline: "Monitor site",
    location: "UK",
    url: "https://academyofmarketing.org/teaching-excellence-awards/",
    budget: "GBP 500 + lectura inaugurala invitata",
    organizer: "Academy of Marketing UK",
    priority: 7,
    tags: ["Innovation in curriculum", "Teaching tools"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "MSI Young Scholars Program",
    category: "premii",
    description: "Invitatie la conferinta exclusiva Young Scholars gazduita la sediul Meta NYC.",
    deadline: "De obicei se deschide spre sfarsitul anului",
    location: "SUA (Meta NYC)",
    url: "https://www.msi.org/research/msi-young-scholars/",
    budget: "Recunoastere + Conferinta Young Scholars la Meta",
    organizer: "Marketing Science Institute",
    priority: 7,
    tags: ["FINAL AN", "3-7 ani post-doctorat"],
    notes: null,
    lunaAplicare: "Noiembrie 2026",
  },
  {
    title: "Thinkers50 Radar 2027",
    category: "premii",
    description: "Selectat pe baza diversitatii, calitatii ideilor, impactului potential. Joc pe termen lung cu valoare imensa de vizibilitate globala.",
    deadline: "Nominalizari tot anul, ciclu tinta 2027",
    location: "Global",
    url: "https://thinkers50.com/radar-2026/",
    budget: "Top 30 ganditori globali emergenti in management",
    organizer: "Thinkers50",
    priority: 7,
    tags: ["2027", "Top 30 global"],
    notes: null,
    lunaAplicare: null,
  },
  // ── Oportunitati Moldova & Romania (5) ──
  {
    title: "ANCD-UEFISCDI Granturi Bilaterale Moldova-Romania",
    category: "oportunitati",
    description: "Cel mai important instrument bilateral pentru RIFC. Parteneriat UTM + ASE Bucuresti.",
    deadline: "Monitor ANCD",
    location: "Moldova + Romania",
    url: "https://cercetari.utm.md/concursul-proiectelor-bilaterale-moldo-romane",
    budget: "Pana la 750,000 RON (~EUR 150,000) / 24 luni",
    organizer: "ANCD + UEFISCDI",
    priority: 9,
    tags: ["CEA MAI IMPORTANTA BILATERALA", "Pre-publicare"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "ANCD Concurs Tineri Cercetatori",
    category: "oportunitati",
    description: "Echipe de 4+ tineri cercetatori inclusiv studenti. Afiliere la organizatie publica de cercetare. Cauta modele, teorii si metode originale.",
    deadline: "Estimat Februarie-Martie 2027",
    location: "Moldova",
    url: "https://ancd.gov.md/",
    budget: "Pana la 600,000 MDL (~EUR 30,000) / 2 ani",
    organizer: "ANCD",
    priority: 7,
    tags: ["2027", "Min. 4 cercetatori sub 40 ani"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "ODA Moldova Digital Innovation Grants",
    category: "oportunitati",
    description: "Finantare nerambursabila pentru inovare digitala. CONTINUUM GRUP SRL dezvoltand RIFC ca produs digital de diagnostic este eligibil.",
    deadline: "Continuu",
    location: "Moldova",
    url: "https://www.oda.md/en/grants/start-uri-tehnologice-en",
    budget: "Pana la 500,000 MDL (~EUR 25,000)",
    organizer: "ODA Moldova + EU4SMEs",
    priority: 8,
    tags: ["ACTIV CONTINUU", "Co-finantat UE"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Moldova Innovation Technology Park (MITP) — Statut Rezident",
    category: "oportunitati",
    description: "Daca CONTINUUM GRUP SRL genereaza 70%+ venituri din activitati R&D/software, se califica. RIFC ca instrument SaaS face compania eligibila.",
    deadline: "Oricand (procesare <72 ore, gratuit)",
    location: "Moldova",
    url: "https://mitp.md/",
    budget: "7% impozit flat pe cifra de afaceri — acopera TOATE taxele",
    organizer: "MITP",
    priority: 8,
    tags: ["ORICAND", "7% flat tax"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Tekwill Center Programs",
    category: "oportunitati",
    description: "472+ echipe sustinute. Hub international pe campusul UTM. Acces excelent la ecosistem pentru incubarea RIFC ca produs digital.",
    deadline: "Oricand",
    location: "Moldova (Campus UTM — acces direct)",
    url: "https://tekwill.md/",
    budget: "Startup Academy (gratuit), Digital Upgrade, co-working",
    organizer: "Tekwill",
    priority: 7,
    tags: ["CAMPUS UTM", "Gratuit"],
    notes: null,
    lunaAplicare: null,
  },
  // ── Publicatii Academice (5) ──
  {
    title: "Journal of Business & Industrial Marketing (JBIM)",
    category: "publicatii",
    description: "Jurnal Emerald de top pentru marketing B2B. Accepta studii de caz si frameworks de diagnostic. RIFC se potriveste perfect ca instrument de evaluare campanii B2B. Impact Factor ~3.6.",
    deadline: "Continuu (rolling submissions)",
    location: "UK / International",
    url: "https://www.emeraldgrouppublishing.com/journal/jbim",
    budget: "Open Access: ~GBP 2,950 | Subscription: gratuit",
    organizer: "Emerald Publishing",
    priority: 8,
    tags: ["Scopus", "SSCI", "Q1-Q2"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "European Journal of Marketing (EJM)",
    category: "publicatii",
    description: "Jurnal european de top in marketing. Publicatii cu impact ridicat. Special issues frecvente pe teme de marketing measurement si effectiveness.",
    deadline: "Continuu",
    location: "UK / International",
    url: "https://www.emeraldgrouppublishing.com/journal/ejm",
    budget: "Open Access: ~GBP 3,200 | Subscription: gratuit",
    organizer: "Emerald Publishing",
    priority: 7,
    tags: ["Scopus", "SSCI", "Impact Factor ~4.0"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Journal of Marketing Theory and Practice (JMTP)",
    category: "publicatii",
    description: "Jurnal asociat SMA (Society for Marketing Advances). Pune accent pe teoria aplicabila in practica — potrivit pentru RIFC ca framework cu aplicabilitate directa in business.",
    deadline: "Continuu",
    location: "SUA / International",
    url: "https://www.tandfonline.com/toc/mmtp20/current",
    budget: "Open Access: ~USD 3,200",
    organizer: "Taylor & Francis / SMA",
    priority: 7,
    tags: ["Scopus", "Practice-oriented"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Emerging Trends in Marketing and Management (ETMM)",
    category: "publicatii",
    description: "Jurnal asociat conferintei MBD 2026 (ASE Bucuresti). Indexat DOAJ, RePEC, EBSCO, Google Scholar. Ideal pentru prima publicare RIFC in context regional.",
    deadline: "Dupa MBD 2026 (Iunie 2026)",
    location: "Romania",
    url: "https://www.mk.ase.ro/mbd/",
    budget: "Gratuit (prin conferinta MBD)",
    organizer: "Facultatea de Marketing, ASE Bucuresti",
    priority: 9,
    tags: ["DOAJ", "RePEC", "EBSCO", "Regional"],
    notes: "Strategie: prezinta la MBD Iunie 2026, publica in ETMM post-conferinta.",
    lunaAplicare: "Iunie 2026",
  },
  {
    title: "International Journal of Research in Marketing (IJRM)",
    category: "publicatii",
    description: "Jurnalul oficial EMAC. Prestigiu ridicat in cercetarea de marketing europeana. Publicatii pe marketing measurement si metodologie. Impact Factor ~5.0.",
    deadline: "Continuu",
    location: "UE / International",
    url: "https://www.sciencedirect.com/journal/international-journal-of-research-in-marketing",
    budget: "Open Access: ~EUR 3,600",
    organizer: "EMAC / Elsevier",
    priority: 7,
    tags: ["SSCI", "Q1", "EMAC Journal"],
    notes: null,
    lunaAplicare: null,
  },
  // ── Parteneriate (5) ──
  {
    title: "UTM — Universitatea Tehnica a Moldovei",
    category: "parteneriate",
    description: "Universitate gazda primara. Baza institutionala pentru aplicari granturi UE (Horizon, Erasmus+, COST). Acces la laboratoare, studenti, si statut de cercetator afiliat.",
    deadline: null,
    location: "Moldova (Chisinau)",
    url: "https://utm.md/",
    budget: "Afiliere institutionala",
    organizer: "UTM",
    priority: 10,
    tags: ["BAZA INSTITUTIONALA", "Widening"],
    notes: "Partener principal pentru toate aplicarile UE. Coordonator institutional.",
    lunaAplicare: null,
  },
  {
    title: "USM — Universitatea de Stat din Moldova",
    category: "parteneriate",
    description: "A doua universitate partenera din Moldova. Facultatea de Stiinte Economice — potential co-aplicant pentru granturi bilaterale si Erasmus+.",
    deadline: null,
    location: "Moldova (Chisinau)",
    url: "https://usm.md/",
    budget: "Afiliere academica",
    organizer: "USM",
    priority: 8,
    tags: ["Co-aplicant", "Facultatea Economie"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "ASE Bucuresti — Academia de Studii Economice",
    category: "parteneriate",
    description: "Partener cheie din Romania. Facultatea de Marketing organizeaza MBD 2026. Ideal pentru granturi bilaterale ANCD-UEFISCDI, Erasmus+ KA2 si co-autorat.",
    deadline: null,
    location: "Romania (Bucuresti)",
    url: "https://www.ase.ro/",
    budget: "Parteneriat bilateral Moldova-Romania",
    organizer: "ASE Bucuresti",
    priority: 9,
    tags: ["MBD 2026", "Bilateral", "Co-autorat"],
    notes: "Contact: Facultatea de Marketing — coordoneaza conferinta MBD 2026.",
    lunaAplicare: null,
  },
  {
    title: "ASEM — Academia de Studii Economice din Moldova",
    category: "parteneriate",
    description: "Gazda simpozionului tinerilor cercetatori. Potential partener pentru proiecte educationale si co-publicatii in marketing.",
    deadline: null,
    location: "Moldova (Chisinau)",
    url: "https://ase.md/",
    budget: "Parteneriat academic",
    organizer: "ASEM",
    priority: 7,
    tags: ["Simpozion", "Tineri Cercetatori"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "Partener UE — Universitate Top (de identificat)",
    category: "parteneriate",
    description: "Necesar minim 2 institutii UE pentru Horizon WIDERA Twinning si Erasmus+ KA2. Cautare activa: universitati din Germania, Olanda, Belgia cu departament de marketing research.",
    deadline: "Inainte de 9 Aprilie 2026 (WIDERA deadline)",
    location: "UE",
    url: null,
    budget: "Partener consortium UE",
    organizer: "De identificat",
    priority: 10,
    tags: ["URGENT", "WIDERA", "Erasmus+"],
    notes: "Criterii cautare: departament Marketing, experienta Widening/Twinning, interes in marketing measurement/diagnostic tools.",
    lunaAplicare: "Martie 2026",
  },
  // ── Acceleratoare (4) ──
  {
    title: "Tekwill Startup Academy",
    category: "acceleratoare",
    description: "Program de accelerare gratuit pentru startup-uri tech din Moldova. 12 saptamani intensiv. CONTINUUM GRUP SRL cu RIFC ca produs SaaS de diagnostic se califica.",
    deadline: "Cohorte periodice (monitor site)",
    location: "Moldova (Campus UTM)",
    url: "https://tekwill.md/startup-academy/",
    budget: "GRATUIT — include mentoring, co-working, networking",
    organizer: "Tekwill",
    priority: 8,
    tags: ["GRATUIT", "12 saptamani", "Campus UTM"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "MITP — Statut Rezident IT Park",
    category: "acceleratoare",
    description: "Statut fiscal preferential pentru companii tech din Moldova. 7% impozit flat pe cifra de afaceri acopera TOATE taxele. RIFC ca instrument SaaS face compania eligibila.",
    deadline: "Oricand (procesare <72 ore, gratuit)",
    location: "Moldova",
    url: "https://mitp.md/",
    budget: "7% flat tax — cea mai avantajoasa fiscalitate din Europa",
    organizer: "Moldova IT Park",
    priority: 9,
    tags: ["ORICAND", "7% flat tax", "72 ore"],
    notes: "Conditie: 70%+ venituri din activitati R&D/software/IT. RIFC SaaS se califica.",
    lunaAplicare: null,
  },
  {
    title: "EU4Innovation — Program de Accelerare",
    category: "acceleratoare",
    description: "Componenta de accelerare din EU4Innovation East. Finantare + mentoring + acces la piata UE. Moldova eligible prin Parteneriatul Estic.",
    deadline: "Activ acum",
    location: "Moldova",
    url: "https://eu4moldova.eu/en/eu4innovation-east",
    budget: "Pana la EUR 50,000 per startup (componenta accelerare)",
    organizer: "Delegatia UE in Moldova",
    priority: 8,
    tags: ["ACTIV ACUM", "Parteneriatul Estic"],
    notes: null,
    lunaAplicare: null,
  },
  {
    title: "EIT Digital Accelerator",
    category: "acceleratoare",
    description: "Program european de accelerare pentru scale-up tech. Acces la 40+ hub-uri in Europa. RIFC ca produs digital de diagnostic marketing se califica. Moldova eligibila ca tara asociata.",
    deadline: "Cohorte anuale (monitor site)",
    location: "UE / International",
    url: "https://www.eitdigital.eu/accelerator/",
    budget: "Acces piata UE + investitii + mentoring",
    organizer: "EIT Digital (European Institute of Innovation & Technology)",
    priority: 7,
    tags: ["Scale-up", "40+ hub-uri", "UE"],
    notes: null,
    lunaAplicare: null,
  },
  // ── Retele Academice (5) ──
  {
    title: "EMAC — European Marketing Academy",
    category: "retele",
    description: "Cea mai importanta retea academica de marketing din Europa. Membership ofera acces la conferinte, jurnale (IJRM), networking cu cercetatori europeni si premii Best Paper.",
    deadline: "Membership anual",
    location: "UE / International",
    url: "https://www.emac-online.org/",
    budget: "Membership: ~EUR 150-300/an (reduced pentru Eastern Europe)",
    organizer: "EMAC",
    priority: 9,
    tags: ["ESENTIAL", "Conferinte", "IJRM"],
    notes: "Membership include: acces EMAC Fall Conference, EMAC Annual, IJRM discounts, networking directory.",
    lunaAplicare: null,
  },
  {
    title: "COST Association — Networking",
    category: "retele",
    description: "Reteaua COST conecteaza cercetatori din 40+ tari europene. Moldova ca tara ITC (Inclusiveness Target Country) beneficiaza de finantare preferentiala pentru participare la reuniuni.",
    deadline: "Continuu — se aplica la COST Actions existente",
    location: "UE — 40+ tari",
    url: "https://www.cost.eu/",
    budget: "Travel grants pentru ITC: pana la EUR 1,500 per reuniune",
    organizer: "COST Association",
    priority: 8,
    tags: ["ITC Moldova", "Travel grants", "40+ tari"],
    notes: "Pasi: 1) Identifica COST Actions in marketing/social sciences, 2) Aplica ca MC Member sau Substitute, 3) Participa la Working Groups.",
    lunaAplicare: null,
  },
  {
    title: "MSI — Marketing Science Institute",
    category: "retele",
    description: "Reteaua de top globala pentru cercetare in marketing. Defineste prioritatile de cercetare ale industriei. Young Scholars Program ofera acces la conferinta exclusiva.",
    deadline: "Membership institutional + individual aplicatii",
    location: "SUA / Global",
    url: "https://www.msi.org/",
    budget: "Membership institutional: ~USD 5,000/an",
    organizer: "Marketing Science Institute",
    priority: 7,
    tags: ["Top global", "Research priorities", "Young Scholars"],
    notes: "Target: Young Scholars Program — invitatie la conferinta Meta NYC. Necesita recomandare.",
    lunaAplicare: null,
  },
  {
    title: "Academy of Marketing UK",
    category: "retele",
    description: "Organizatia profesionala pentru cercetatori si educatori in marketing din UK. Ofera Teaching Excellence Awards si acces la conferinte. RIFC ca instrument didactic este eligibil.",
    deadline: "Membership anual",
    location: "UK",
    url: "https://www.academyofmarketing.org/",
    budget: "Membership: ~GBP 75-150/an",
    organizer: "Academy of Marketing",
    priority: 7,
    tags: ["Teaching Excellence", "UK", "Conferinte"],
    notes: "Relevant pentru: Teaching Excellence Awards (RIFC ca instrument didactic inovativ).",
    lunaAplicare: null,
  },
  {
    title: "AMA — American Marketing Association",
    category: "retele",
    description: "Cea mai mare organizatie de marketing din lume. 30,000+ membri. Acces la Journal of Marketing, Journal of Marketing Research, conferinte anuale si retea globala.",
    deadline: "Membership anual",
    location: "SUA / Global",
    url: "https://www.ama.org/",
    budget: "Membership academic: ~USD 200/an",
    organizer: "AMA",
    priority: 7,
    tags: ["30,000+ membri", "Journal of Marketing", "Global"],
    notes: "Beneficii: acces jurnale, conferinte, networking, career resources. Doctoral SIG relevant pentru early career.",
    lunaAplicare: null,
  },
];

// ── Helpers ────────────────────────────────────────────────
function generateId(): string {
  return "ap-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function blockId(): string {
  return "bl-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getCategoryDef(key: CategoryKey): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

function getBlockDef(type: BlockType): BlockTypeDef {
  return BLOCK_TYPES.find((b) => b.type === type) || BLOCK_TYPES[5]; // default nota
}

function todayStr(): string {
  const d = new Date();
  const months = ["Ian", "Feb", "Mar", "Apr", "Mai", "Iun", "Iul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function migrateFromV2(): Program[] | null {
  try {
    const raw = localStorage.getItem(OLD_DATA_KEY);
    if (!raw) return null;
    const old = JSON.parse(raw) as Program[];
    // Migrate: convert old mesaj/reminder/monitoring to blocks
    return old.map((p) => {
      const blocks: ActivityBlock[] = [];
      if (p.mesajTrimis) {
        blocks.push({ id: blockId(), type: "email", date: p.mesajData || todayStr(), content: p.mesajTrimis, created_at: new Date().toISOString() });
      }
      if (p.reminder || p.reminderNote) {
        blocks.push({ id: blockId(), type: "reminder", date: p.reminder || todayStr(), content: p.reminderNote || p.reminder || "", created_at: new Date().toISOString() });
      }
      if (p.monitoring) {
        blocks.push({ id: blockId(), type: "nota", date: todayStr(), content: p.monitoring, created_at: new Date().toISOString() });
      }
      return { ...p, blocks };
    });
  } catch {
    return null;
  }
}

function loadPrograms(): Program[] {
  let existing: Program[] | null = null;
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) existing = JSON.parse(raw);
  } catch {}
  // Try migrate from v2
  if (!existing) {
    const migrated = migrateFromV2();
    if (migrated) {
      existing = migrated;
    }
  }
  if (existing) {
    // Smart merge: add seed programs for new categories that don't exist yet
    const existingCategories = new Set(existing.map((p) => p.category));
    const newCategorySeeds = SEED_PROGRAMS.filter((s) => !existingCategories.has(s.category));
    if (newCategorySeeds.length > 0) {
      const maxSeedNum = existing.reduce((max, p) => {
        const m = p.id.match(/^seed-(\d+)$/);
        return m ? Math.max(max, parseInt(m[1])) : max;
      }, 0);
      const newPrograms: Program[] = newCategorySeeds.map((s, i) => ({
        ...s,
        id: "seed-" + (maxSeedNum + i + 1).toString().padStart(2, "0"),
        created_at: new Date(2026, 1, 21, 10, i).toISOString(),
        appStatus: "nesetat" as AppStatus,
        blocks: [],
      }));
      existing = [...existing, ...newPrograms];
    }
    localStorage.setItem(DATA_KEY, JSON.stringify(existing));
    return existing;
  }
  // First time seed
  const seeded: Program[] = SEED_PROGRAMS.map((s, i) => ({
    ...s,
    id: "seed-" + (i + 1).toString().padStart(2, "0"),
    created_at: new Date(2026, 1, 20, 10, i).toISOString(),
    appStatus: "nesetat" as AppStatus,
    blocks: [],
  }));
  localStorage.setItem(DATA_KEY, JSON.stringify(seeded));
  return seeded;
}

function savePrograms(programs: Program[]): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(programs));
}

function priorityColor(p: number): string {
  if (p >= 9) return "#DC2626";
  if (p >= 7) return "#D97706";
  if (p >= 5) return "#2563EB";
  return "#6B7280";
}

function extractCountry(location: string | null): string {
  if (!location) return "";
  // Take part before " (" or " —" or " /"
  let c = location.split("(")[0].split("—")[0].split("/")[0].trim();
  // Normalize
  if (c === "UE") return "UE";
  if (c.startsWith("Moldova")) return "Moldova";
  if (c.startsWith("Romania")) return "Romania";
  if (c.startsWith("Germania")) return "Germania";
  if (c.startsWith("Spania")) return "Spania";
  if (c.startsWith("SUA")) return "SUA";
  if (c.startsWith("UK")) return "UK";
  if (c.startsWith("Belgium")) return "Belgium";
  if (c.startsWith("Global")) return "Global";
  return c || "";
}

// ── Component ──────────────────────────────────────────────
export default function AplicareProgramePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filterAplicate, setFilterAplicate] = useState(false);
  const [filterInLucru, setFilterInLucru] = useState(false);
  const [filterCountry, setFilterCountry] = useState("toate");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({});
  const [tagsInput, setTagsInput] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Block adding state
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [newBlockType, setNewBlockType] = useState<BlockType | null>(null);
  const [newBlockDate, setNewBlockDate] = useState(todayStr());
  const [newBlockContent, setNewBlockContent] = useState("");

  // AUTOEVENT state
  const [showAutoEvent, setShowAutoEvent] = useState(false);
  const [autoResults, setAutoResults] = useState<AutoOpportunity[]>([]);
  const [autoScanning, setAutoScanning] = useState(false);
  const [autoError, setAutoError] = useState("");
  const [autoLastScan, setAutoLastScan] = useState("");
  const [blockedSources, setBlockedSources] = useState<string[]>([]);
  const [autoSearchQuery, setAutoSearchQuery] = useState("");
  const [autoRules, setAutoRules] = useState(DEFAULT_RULES);
  const [editingRules, setEditingRules] = useState(false);

  useEffect(() => {
    const granted = localStorage.getItem(STORAGE_KEY);
    if (granted === "granted") setHasAccess(true);
  }, []);

  useEffect(() => {
    if (hasAccess) {
      setPrograms(loadPrograms());
      // Load autoevent data
      try {
        const autoRaw = localStorage.getItem(AUTOEVENT_KEY);
        if (autoRaw) {
          const parsed = JSON.parse(autoRaw);
          setAutoResults(parsed.results || []);
          setAutoLastScan(parsed.lastScan || "");
        }
      } catch {}
      try {
        const blocked = localStorage.getItem(BLOCKED_SOURCES_KEY);
        if (blocked) setBlockedSources(JSON.parse(blocked));
      } catch {}
      try {
        const rules = localStorage.getItem(AUTOEVENT_RULES_KEY);
        if (rules) setAutoRules({ ...DEFAULT_RULES, ...JSON.parse(rules) });
      } catch {}
    }
  }, [hasAccess]);

  const validateAccess = useCallback(() => {
    if (accessInput.trim() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, "granted");
      setHasAccess(true);
      setAccessError("");
    } else {
      setAccessError("Cod incorect. Incearca din nou.");
      setAccessInput("");
    }
  }, [accessInput]);

  const updateProgram = (id: string, changes: Partial<Program>) => {
    const updated = programs.map((p) => (p.id === id ? { ...p, ...changes } : p));
    setPrograms(updated);
    savePrograms(updated);
  };

  // Block operations
  const addBlock = (programId: string) => {
    if (!newBlockType || !newBlockContent.trim()) return;
    const block: ActivityBlock = {
      id: blockId(),
      type: newBlockType,
      date: newBlockDate || todayStr(),
      content: newBlockContent.trim(),
      created_at: new Date().toISOString(),
    };
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;
    updateProgram(programId, { blocks: [...(prog.blocks || []), block] });
    setNewBlockType(null);
    setNewBlockContent("");
    setNewBlockDate(todayStr());
    setShowBlockPicker(false);
  };

  const deleteBlock = (programId: string, blockIdToDelete: string) => {
    const prog = programs.find((p) => p.id === programId);
    if (!prog) return;
    updateProgram(programId, { blocks: (prog.blocks || []).filter((b) => b.id !== blockIdToDelete) });
  };

  // Country list from all programs
  const countryList = Array.from(new Set(programs.map((p) => extractCountry(p.location)).filter((c) => c.length > 0))).sort();

  // Filter programs
  const filtered = programs.filter((p) => {
    if (filterAplicate && p.appStatus !== "aplicat") return false;
    if (filterInLucru && p.appStatus !== "in_lucru") return false;
    if (activeTab !== "all" && p.category !== activeTab) return false;
    if (filterCountry !== "toate" && extractCountry(p.location) !== filterCountry) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.organizer && p.organizer.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Stats
  const totalPrograms = programs.length;
  const aplicateCount = programs.filter((p) => p.appStatus === "aplicat").length;
  const inLucruCount = programs.filter((p) => p.appStatus === "in_lucru").length;
  const categoryCounts: Record<string, number> = {};
  CATEGORIES.forEach((c) => {
    categoryCounts[c.key] = programs.filter((p) => p.category === c.key).length;
  });

  // Save from edit modal
  const saveProgram = () => {
    const tags = tagsInput.split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    if (editingProgram) {
      const updated = programs.map((p) =>
        p.id === editingProgram.id ? { ...p, ...formData, tags } : p
      );
      setPrograms(updated);
      savePrograms(updated);
    } else {
      const newProgram: Program = {
        id: generateId(),
        title: formData.title || "Program nou",
        category: (formData.category as CategoryKey) || "conferinte",
        description: formData.description || "",
        deadline: formData.deadline || null,
        location: formData.location || null,
        url: formData.url || null,
        budget: formData.budget || null,
        organizer: formData.organizer || null,
        priority: formData.priority || 5,
        tags,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
        appStatus: (formData.appStatus as AppStatus) || "nesetat",
        lunaAplicare: formData.lunaAplicare || null,
        blocks: [],
      };
      const updated = [...programs, newProgram];
      setPrograms(updated);
      savePrograms(updated);
    }
    setShowAddModal(false);
    setEditingProgram(null);
    setFormData({});
  };

  const deleteProgram = (id: string) => {
    const updated = programs.filter((p) => p.id !== id);
    setPrograms(updated);
    savePrograms(updated);
    setShowAddModal(false);
    setEditingProgram(null);
    if (expandedCard === id) setExpandedCard(null);
  };

  const openAddModal = (category?: CategoryKey) => {
    setFormData({ category: category || "conferinte", appStatus: "nesetat", priority: 5, tags: [] });
    setTagsInput("");
    setEditingProgram(null);
    setShowAddModal(true);
  };

  const openEditModal = (program: Program) => {
    setFormData({ ...program });
    setTagsInput(program.tags.join(", "));
    setEditingProgram(program);
    setShowAddModal(true);
  };

  // ── AUTOEVENT Functions ─────────────────────────────────
  const saveAutoResults = (results: AutoOpportunity[], lastScan: string) => {
    setAutoResults(results);
    setAutoLastScan(lastScan);
    localStorage.setItem(AUTOEVENT_KEY, JSON.stringify({ results, lastScan }));
  };

  const saveBlockedSources = (sources: string[]) => {
    setBlockedSources(sources);
    localStorage.setItem(BLOCKED_SOURCES_KEY, JSON.stringify(sources));
  };

  const runAutoScan = async () => {
    setAutoScanning(true);
    setAutoError("");
    try {
      const existingTitles = programs.map((p) => p.title);
      const resp = await fetch("/api/scan-opportunities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blockedSources,
          existingTitles,
          customQuery: autoSearchQuery,
          rules: autoRules,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setAutoError(data.message || "Eroare la scanare");
        return;
      }
      if (data.success && data.opportunities) {
        // Merge: keep existing non-new items, add new ones
        const kept = autoResults.filter((r) => r.status !== "new");
        const newOps = (data.opportunities as AutoOpportunity[]).filter(
          (o) => !kept.some((k) => k.title === o.title) && !blockedSources.includes(o.source)
        );
        const merged = [...newOps, ...kept];
        saveAutoResults(merged, data.scannedAt);
      }
    } catch (err) {
      setAutoError("Eroare de retea. Verifica conexiunea.");
      console.error(err);
    } finally {
      setAutoScanning(false);
    }
  };

  // Auto-scan when AUTOEVENT modal opens and no new results exist
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (showAutoEvent && !autoScanning && autoResults.filter((r) => r.status === "new").length === 0) {
      runAutoScan();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAutoEvent]);

  const autoAddToPrograms = (opp: AutoOpportunity) => {
    const validCategories: CategoryKey[] = ["conferinte","granturi","competitii","forumuri","premii","oportunitati","publicatii","parteneriate","acceleratoare","retele"];
    const cat = validCategories.includes(opp.category as CategoryKey) ? opp.category as CategoryKey : "oportunitati";
    const newProg: Program = {
      id: "auto-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      title: opp.title,
      category: cat,
      description: opp.description,
      deadline: opp.deadline,
      location: opp.location,
      url: opp.url,
      budget: opp.budget,
      organizer: opp.organizer,
      priority: Math.min(10, Math.max(1, opp.relevanceScore || 5)),
      tags: opp.tags || [],
      notes: opp.relevanceReason || null,
      created_at: new Date().toISOString(),
      appStatus: "nesetat",
      lunaAplicare: null,
      blocks: [],
    };
    const updated = [...programs, newProg];
    setPrograms(updated);
    savePrograms(updated);
    // Mark as added in auto results
    const updatedAuto = autoResults.map((r) => r.id === opp.id ? { ...r, status: "added" as const } : r);
    saveAutoResults(updatedAuto, autoLastScan);
  };

  const autoDismiss = (oppId: string) => {
    const updatedAuto = autoResults.map((r) => r.id === oppId ? { ...r, status: "dismissed" as const } : r);
    saveAutoResults(updatedAuto, autoLastScan);
  };

  const autoBlock = (opp: AutoOpportunity) => {
    // Block the source domain
    const newBlocked = [...blockedSources, opp.source].filter(Boolean);
    saveBlockedSources(Array.from(new Set(newBlocked)));
    // Remove all results from that source
    const updatedAuto = autoResults.map((r) =>
      r.source === opp.source ? { ...r, status: "blocked" as const } : r
    );
    saveAutoResults(updatedAuto, autoLastScan);
  };

  const autoNewCount = autoResults.filter((r) => r.status === "new").length;

  // ── Access Gate ──────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
      }}>
        <div style={{
          background: "#fff", borderRadius: 16, padding: "48px 40px",
          maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: "#DC2626", letterSpacing: 4, fontWeight: 700, marginBottom: 8 }}>R IF C</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Aplicare Programe</h2>
          <p style={{ fontSize: 13, color: "#4B5563", marginBottom: 28 }}>Introduceti codul de acces pentru a continua</p>
          <input
            type="password"
            style={{
              width: "100%", padding: "14px 16px", fontSize: 15, color: "#111827",
              border: "2px solid #D1D5DB", borderRadius: 10, outline: "none",
              fontFamily: "'JetBrains Mono', monospace", letterSpacing: 2,
              textAlign: "center", marginBottom: 16,
            }}
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && validateAccess()}
            placeholder="Cod de acces"
            autoFocus
          />
          <button
            style={{
              width: "100%", padding: "14px 24px", fontSize: 14, fontWeight: 700,
              color: "#fff", background: "linear-gradient(135deg, #DC2626, #B91C1C)",
              border: "none", borderRadius: 10, cursor: "pointer", letterSpacing: 1,
            }}
            onClick={validateAccess}
          >ACCES</button>
          {accessError && <p style={{ fontSize: 13, color: "#DC2626", marginTop: 12, fontWeight: 600 }}>{accessError}</p>}
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA", fontFamily: "'Inter', sans-serif" }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }` }} />
      {/* Header */}
      <div style={{
        padding: "20px 28px 0", borderBottom: "1px solid #E5E7EB",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <a href="https://www.rifcmarketing.com" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#DC2626", letterSpacing: 4, fontWeight: 700, textDecoration: "none", cursor: "pointer" }}>R IF C</a>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Aplicare Programe</h1>
              <p style={{ fontSize: 12, color: "#4B5563", marginTop: 2, fontWeight: 500 }}>
                {totalPrograms} programe &middot; {aplicateCount} aplicate &middot; {inLucruCount} in lucru &middot; Prezinta &rarr; Publica &rarr; Premiaza
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 10, color: "#6B7280", pointerEvents: "none" }} />
              <input
                type="text"
                style={{
                  padding: "8px 12px 8px 32px", fontSize: 13, color: "#111827",
                  border: "1px solid #D1D5DB", borderRadius: 8, outline: "none",
                  width: 200, background: "#fff",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cauta programe..."
              />
            </div>
            {/* Country filter */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <MapPin size={13} style={{ position: "absolute", left: 9, color: "#7C3AED", pointerEvents: "none" }} />
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                style={{
                  padding: "8px 10px 8px 28px", fontSize: 12, fontWeight: 600,
                  border: filterCountry !== "toate" ? "2px solid #7C3AED" : "1px solid #D1D5DB",
                  borderRadius: 8, outline: "none", cursor: "pointer",
                  background: filterCountry !== "toate" ? "#F5F3FF" : "#fff",
                  color: filterCountry !== "toate" ? "#7C3AED" : "#374151",
                  appearance: "none", paddingRight: 28, minWidth: 110,
                }}
              >
                <option value="toate">Toate</option>
                {countryList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={12} style={{ position: "absolute", right: 8, color: "#6B7280", pointerEvents: "none" }} />
            </div>
            <button
              onClick={() => { setShowAutoEvent(false); setFilterAplicate(!filterAplicate); if (!filterAplicate) setFilterInLucru(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", fontSize: 11, fontWeight: 700,
                color: filterAplicate ? "#fff" : "#16A34A",
                background: filterAplicate ? "linear-gradient(135deg, #16A34A, #15803D)" : "#DCFCE7",
                border: filterAplicate ? "none" : "1px solid #86EFAC",
                borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
                transition: "all 0.2s",
              }}
            >
              <CheckCircle size={13} />
              APLICATE ({aplicateCount})
            </button>
            <button
              onClick={() => { setShowAutoEvent(false); setFilterInLucru(!filterInLucru); if (!filterInLucru) setFilterAplicate(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", fontSize: 11, fontWeight: 700,
                color: filterInLucru ? "#fff" : "#2563EB",
                background: filterInLucru ? "linear-gradient(135deg, #2563EB, #1D4ED8)" : "#DBEAFE",
                border: filterInLucru ? "none" : "1px solid #93C5FD",
                borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
                transition: "all 0.2s",
              }}
            >
              <Clock size={13} />
              IN LUCRU ({inLucruCount})
            </button>
            <button
              onClick={() => { setShowAutoEvent(!showAutoEvent); if (!showAutoEvent) { setFilterAplicate(false); setFilterInLucru(false); } }}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", fontSize: 11, fontWeight: 700,
                color: showAutoEvent ? "#fff" : "#D97706",
                background: showAutoEvent ? "linear-gradient(135deg, #D97706, #B45309)" : "#FFFBEB",
                border: showAutoEvent ? "none" : "1px solid #FCD34D",
                borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
                transition: "all 0.2s", position: "relative",
              }}
            >
              <Zap size={13} />
              AUTOEVENT
              {autoNewCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6,
                  background: "#DC2626", color: "#fff", fontSize: 9, fontWeight: 800,
                  width: 18, height: 18, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "2px solid #fff", animation: "pulse 2s infinite",
                }}>{autoNewCount}</span>
              )}
            </button>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", fontSize: 11, fontWeight: 700,
                color: "#fff", background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                border: "none", borderRadius: 8, cursor: "pointer", letterSpacing: 0.5,
              }}
              onClick={() => openAddModal()}
            >
              <Plus size={13} />
              ADAUGA
            </button>
          </div>
        </div>
        {/* Tabs — hidden on AUTOEVENT page */}
        {!showAutoEvent && (
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {TABS.map((t) => {
              const count = t.key === "all" ? totalPrograms : categoryCounts[t.key] || 0;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  style={{
                    padding: "10px 14px", fontSize: 11, fontWeight: 600,
                    color: isActive ? "#DC2626" : "#4B5563",
                    background: "none", border: "none",
                    borderBottom: isActive ? "2px solid #DC2626" : "2px solid transparent",
                    cursor: "pointer", whiteSpace: "nowrap", letterSpacing: 0.3,
                  }}
                  onClick={() => setActiveTab(t.key)}
                >
                  {t.label}
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 10,
                    background: isActive ? "#FEE2E2" : "#F3F4F6",
                    color: isActive ? "#DC2626" : "#4B5563",
                    marginLeft: 5,
                  }}>{count}</span>
                </button>
              );
            })}
          </div>
        )}
        {showAutoEvent && (
          <div style={{ padding: "8px 0", borderTop: "2px solid #FCD34D" }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E", display: "flex", alignItems: "center", gap: 6 }}>
              <Zap size={14} style={{ color: "#D97706" }} /> AUTOEVENT Scanner — Cautare automata oportunitati
            </span>
          </div>
        )}
      </div>

      {/* ═══ AUTOEVENT Page View ═══ */}
      {showAutoEvent && (
        <div style={{ padding: "20px 28px 80px", maxWidth: 1300 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
            {/* Left: Results */}
            <div>
              {/* Scan bar */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
                  <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#6B7280" }} />
                  <input type="text" value={autoSearchQuery} onChange={(e) => setAutoSearchQuery(e.target.value)}
                    placeholder="Focus cautare: ex. 'COST Actions 2026', 'jurnale marketing'..."
                    style={{ width: "100%", padding: "10px 12px 10px 32px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", background: "#fff", color: "#111827" }}
                    onKeyDown={(e) => { if (e.key === "Enter" && !autoScanning) runAutoScan(); }}
                  />
                </div>
                <button onClick={runAutoScan} disabled={autoScanning}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 22px", fontSize: 12, fontWeight: 700, color: "#fff", background: autoScanning ? "#9CA3AF" : "linear-gradient(135deg, #D97706, #B45309)", border: "none", borderRadius: 8, cursor: autoScanning ? "not-allowed" : "pointer", letterSpacing: 0.5, whiteSpace: "nowrap" }}>
                  {autoScanning ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={14} />}
                  {autoScanning ? "SCANARE..." : "SCANARE"}
                </button>
                <button onClick={() => setShowAutoEvent(false)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}>
                  <X size={12} /> Inapoi
                </button>
              </div>

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#92400E", display: "flex", alignItems: "center", gap: 4 }}>
                  <Zap size={12} /> {autoResults.filter((r) => r.status === "new").length} noi
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#16A34A" }}>{autoResults.filter((r) => r.status === "added").length} adaugate</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF" }}>{autoResults.filter((r) => r.status === "dismissed").length} ignorate</span>
                {blockedSources.length > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#DC2626", display: "flex", alignItems: "center", gap: 3 }}>
                    <Ban size={10} /> {blockedSources.length} surse blocate
                  </span>
                )}
                {autoLastScan && (
                  <span style={{ fontSize: 10, color: "#9CA3AF", marginLeft: "auto" }}>
                    Ultima scanare: {new Date(autoLastScan).toLocaleString("ro-RO")}
                  </span>
                )}
              </div>

              {/* Error */}
              {autoError && (
                <div style={{ padding: "10px 14px", background: "#FEF2F2", color: "#DC2626", fontSize: 12, fontWeight: 600, borderRadius: 8, marginBottom: 12 }}>
                  {autoError}
                </div>
              )}

              {/* Scanning indicator */}
              {autoScanning && (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 12, border: "1px solid #FCD34D", marginBottom: 12 }}>
                  <Loader2 size={32} style={{ color: "#D97706", animation: "spin 1s linear infinite", marginBottom: 12 }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#92400E" }}>AI scaneaza oportunitati...</p>
                  <p style={{ fontSize: 11, color: "#B45309" }}>Analizam conferinte, granturi, jurnale, retele academice</p>
                </div>
              )}

              {/* Empty state */}
              {autoResults.filter((r) => r.status === "new").length === 0 && !autoScanning && (
                <div style={{ textAlign: "center", padding: "40px 20px", background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB" }}>
                  <Zap size={36} style={{ opacity: 0.2, marginBottom: 12, color: "#D97706" }} />
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#6B7280", marginBottom: 4 }}>
                    {autoResults.length === 0 ? "Nicio scanare efectuata" : "Toate oportunitatile au fost procesate"}
                  </p>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>Apasa SCANARE pentru a gasi oportunitati noi</p>
                </div>
              )}

              {/* Results grid */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {autoResults
                  .filter((r) => r.status === "new")
                  .sort((a, b) => b.relevanceScore - a.relevanceScore)
                  .map((opp) => {
                    const cat = getCategoryDef(opp.category as CategoryKey);
                    const CatIcon = cat.icon;
                    return (
                      <div key={opp.id} style={{ border: `1px solid ${cat.color}30`, borderRadius: 12, overflow: "hidden", background: "#fff" }}>
                        <div style={{ height: 3, background: cat.gradient }} />
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
                              <CatIcon size={15} style={{ color: cat.color, flexShrink: 0 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{opp.title}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                              <Star size={12} style={{ color: "#D97706", fill: "#D97706" }} />
                              <span style={{ fontSize: 12, fontWeight: 800, color: "#D97706", fontFamily: "'JetBrains Mono', monospace" }}>{opp.relevanceScore}/10</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 5, background: `${cat.color}14`, color: cat.color }}>{cat.label}</span>
                            {opp.deadline && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", gap: 3 }}><Clock size={9} /> {opp.deadline}</span>}
                            {opp.location && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: "#F5F3FF", color: "#7C3AED", display: "flex", alignItems: "center", gap: 3 }}><MapPin size={9} /> {opp.location}</span>}
                            {opp.budget && <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: "#F0FDF4", color: "#059669", display: "flex", alignItems: "center", gap: 3 }}><DollarSign size={9} /> {opp.budget}</span>}
                            {opp.source && <span style={{ fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 5, background: "#F9FAFB", color: "#6B7280" }}>{opp.source}</span>}
                          </div>
                          <p style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 6 }}>{opp.description}</p>
                          <p style={{ fontSize: 11, color: "#059669", fontWeight: 500, fontStyle: "italic", marginBottom: 10, display: "flex", alignItems: "flex-start", gap: 4 }}>
                            <ArrowRight size={11} style={{ flexShrink: 0, marginTop: 2 }} /> {opp.relevanceReason}
                          </p>
                          {opp.url && (
                            <div style={{ marginBottom: 10 }}>
                              <a href={opp.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: "#2563EB", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, fontWeight: 500 }}>
                                <ExternalLink size={10} /> {opp.url.length > 60 ? opp.url.slice(0, 60) + "..." : opp.url}
                              </a>
                            </div>
                          )}
                          {opp.tags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 10 }}>
                              {opp.tags.map((tag, i) => <span key={i} style={{ fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4, background: "#F9FAFB", color: "#9CA3AF", border: "1px solid #F3F4F6" }}>{tag}</span>)}
                            </div>
                          )}
                          <div style={{ display: "flex", gap: 6, paddingTop: 10, borderTop: "1px solid #F3F4F6" }}>
                            <button onClick={() => autoAddToPrograms(opp)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 11, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #16A34A, #15803D)", border: "none", borderRadius: 6, cursor: "pointer" }}>
                              <CheckCircle size={12} /> Adauga
                            </button>
                            <button onClick={() => autoDismiss(opp.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 11, fontWeight: 600, color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB", borderRadius: 6, cursor: "pointer" }}>
                              <X size={12} /> Irelevant
                            </button>
                            <button onClick={() => autoBlock(opp)} title={`Blocheaza sursa: ${opp.source}`} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", fontSize: 11, fontWeight: 600, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, cursor: "pointer" }}>
                              <Ban size={12} /> Blocheaza
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Processed history */}
              {autoResults.filter((r) => r.status !== "new").length > 0 && (
                <div style={{ marginTop: 16, padding: "14px 16px", background: "#fff", borderRadius: 10, border: "1px solid #E5E7EB" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#9CA3AF", marginBottom: 8 }}>
                    Istoric: {autoResults.filter((r) => r.status === "added").length} adaugate, {autoResults.filter((r) => r.status === "dismissed").length} ignorate, {autoResults.filter((r) => r.status === "blocked").length} blocate
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {autoResults.filter((r) => r.status !== "new").map((opp) => (
                      <span key={opp.id} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 5, background: opp.status === "added" ? "#DCFCE7" : opp.status === "blocked" ? "#FEF2F2" : "#F3F4F6", color: opp.status === "added" ? "#16A34A" : opp.status === "blocked" ? "#DC2626" : "#9CA3AF", fontWeight: 500, textDecoration: opp.status === "dismissed" ? "line-through" : "none" }}>
                        {opp.title}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Rules Card */}
            <div style={{ position: "sticky", top: 80 }}>
              <div style={{ background: "#fff", border: "2px solid #FCD34D", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", background: "linear-gradient(135deg, #FFFBEB, #FEF3C7)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <BookOpen size={14} style={{ color: "#92400E" }} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E" }}>Reguli cautare</span>
                  </div>
                  <button onClick={() => setEditingRules(!editingRules)} style={{ fontSize: 10, fontWeight: 600, color: "#D97706", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    {editingRules ? "Inchide" : "Editeaza"}
                  </button>
                </div>
                <div style={{ padding: "12px 16px" }}>
                  {editingRules ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {([
                        { key: "keywords", label: "Cuvinte cheie prioritare", rows: 3 },
                        { key: "excludeKeywords", label: "Exclude (ce NU cautam)", rows: 2 },
                        { key: "geography", label: "Geografie prioritara", rows: 1 },
                        { key: "eligibility", label: "Eligibilitate speciala", rows: 1 },
                        { key: "languages", label: "Limbi acceptate", rows: 1 },
                        { key: "budgetPersonal", label: "Buget personal", rows: 1 },
                        { key: "stage", label: "Stadii cercetare acceptate", rows: 1 },
                        { key: "customNotes", label: "Note/reguli suplimentare", rows: 2 },
                      ] as { key: keyof typeof DEFAULT_RULES; label: string; rows: number }[]).map((field) => (
                        <div key={field.key}>
                          <label style={{ fontSize: 10, fontWeight: 700, color: "#374151", letterSpacing: 0.3, textTransform: "uppercase", display: "block", marginBottom: 3 }}>{field.label}</label>
                          <textarea
                            value={autoRules[field.key]}
                            onChange={(e) => setAutoRules({ ...autoRules, [field.key]: e.target.value })}
                            rows={field.rows}
                            style={{ width: "100%", padding: "6px 8px", fontSize: 11, border: "1px solid #D1D5DB", borderRadius: 6, outline: "none", resize: "vertical", fontFamily: "'Inter', sans-serif", color: "#111827", lineHeight: 1.5 }}
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          localStorage.setItem(AUTOEVENT_RULES_KEY, JSON.stringify(autoRules));
                          setEditingRules(false);
                        }}
                        style={{ padding: "8px 14px", fontSize: 11, fontWeight: 700, color: "#fff", background: "linear-gradient(135deg, #D97706, #B45309)", border: "none", borderRadius: 6, cursor: "pointer" }}
                      >
                        Salveaza reguli
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {([
                        { label: "Cuvinte cheie", value: autoRules.keywords, color: "#2563EB" },
                        { label: "Exclude", value: autoRules.excludeKeywords, color: "#DC2626" },
                        { label: "Geografie", value: autoRules.geography, color: "#7C3AED" },
                        { label: "Eligibilitate", value: autoRules.eligibility, color: "#059669" },
                        { label: "Limbi", value: autoRules.languages, color: "#0891B2" },
                        { label: "Buget", value: autoRules.budgetPersonal, color: "#D97706" },
                        { label: "Stadii", value: autoRules.stage, color: "#4338CA" },
                      ]).filter((r) => r.value).map((rule, i) => (
                        <div key={i}>
                          <span style={{ fontSize: 9, fontWeight: 700, color: rule.color, letterSpacing: 0.3, textTransform: "uppercase" }}>{rule.label}</span>
                          <p style={{ fontSize: 10, color: "#4B5563", margin: "2px 0 0", lineHeight: 1.4 }}>{rule.value}</p>
                        </div>
                      ))}
                      {autoRules.customNotes && (
                        <div>
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#92400E", letterSpacing: 0.3, textTransform: "uppercase" }}>Note suplimentare</span>
                          <p style={{ fontSize: 10, color: "#4B5563", margin: "2px 0 0", lineHeight: 1.4 }}>{autoRules.customNotes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Blocked sources card */}
              {blockedSources.length > 0 && (
                <div style={{ marginTop: 12, background: "#fff", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <Ban size={10} /> Surse blocate ({blockedSources.length})
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {blockedSources.map((src, i) => (
                      <span key={i} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FEF2F2", color: "#DC2626", display: "flex", alignItems: "center", gap: 3, fontWeight: 500 }}>
                        {src}
                        <button onClick={() => saveBlockedSources(blockedSources.filter((s) => s !== src))} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: 0, display: "flex" }}>
                          <X size={8} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content — Main programs view */}
      {!showAutoEvent && <div style={{ padding: "20px 28px 80px", maxWidth: 1300 }}>
        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginBottom: 20 }}>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key] || 0;
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                style={{
                  background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10,
                  padding: "12px 14px", textAlign: "center", cursor: "pointer",
                  borderTop: `3px solid ${cat.color}`,
                }}
                onClick={() => setActiveTab(cat.key)}
              >
                <Icon size={14} style={{ color: cat.color, marginBottom: 4 }} />
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>{count}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#4B5563", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 2 }}>{cat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#6B7280" }}>
            <Briefcase size={40} style={{ opacity: 0.3, marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: "#4B5563", marginBottom: 8 }}>
              {search ? "Niciun program gasit." : filterAplicate ? "Niciun program marcat ca aplicat." : filterInLucru ? "Niciun program marcat ca in lucru." : "Niciun program in aceasta categorie."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Mini tabs row ── */}
            {expandedCard && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                {filtered.sort((a, b) => b.priority - a.priority).map((program) => {
                  const cat = getCategoryDef(program.category);
                  const Icon = cat.icon;
                  const isActive = expandedCard === program.id;
                  const st = APP_STATUS_CONFIG[program.appStatus];
                  return (
                    <button
                      key={program.id}
                      onClick={() => { setExpandedCard(program.id); setShowBlockPicker(false); setNewBlockType(null); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 5,
                        padding: "6px 12px", fontSize: 11, fontWeight: isActive ? 700 : 500,
                        color: isActive ? "#fff" : "#374151",
                        background: isActive ? cat.gradient : "#fff",
                        border: isActive ? "none" : `1px solid ${st.border}`,
                        borderRadius: 8, cursor: "pointer",
                        transition: "all 0.15s",
                        opacity: program.appStatus === "nerelevant" && !isActive ? 0.5 : 1,
                        maxWidth: isActive ? "none" : 220,
                        overflow: "hidden",
                      }}
                    >
                      <Icon size={12} style={{ color: isActive ? "#fff" : cat.color, flexShrink: 0 }} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{program.title}</span>
                      <span style={{
                        fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4,
                        background: isActive ? "rgba(255,255,255,0.25)" : `${priorityColor(program.priority)}14`,
                        color: isActive ? "#fff" : priorityColor(program.priority),
                        flexShrink: 0, fontFamily: "'JetBrains Mono', monospace",
                      }}>{program.priority}</span>
                      {program.appStatus !== "nesetat" && (
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                          background: program.appStatus === "aplicat" ? "#16A34A" : program.appStatus === "in_lucru" ? "#2563EB" : program.appStatus === "nerelevant" ? "#9CA3AF" : "#D97706",
                        }} />
                      )}
                      {(program.blocks || []).some((b) => b.type === "reminder") && (
                        <Bell size={10} style={{ color: isActive ? "#FCA5A5" : "#DC2626", flexShrink: 0 }} />
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => { setExpandedCard(null); setShowBlockPicker(false); setNewBlockType(null); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "6px 12px", fontSize: 11, fontWeight: 600,
                    color: "#6B7280", background: "#F3F4F6",
                    border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer",
                  }}
                >
                  <X size={11} /> Inchide
                </button>
              </div>
            )}

            {/* ── Expanded card workspace ── */}
            {expandedCard && (() => {
              const program = filtered.find((p) => p.id === expandedCard) || programs.find((p) => p.id === expandedCard);
              if (!program) return null;
              const cat = getCategoryDef(program.category);
              const status = APP_STATUS_CONFIG[program.appStatus];
              const Icon = cat.icon;
              const blocks = program.blocks || [];

              return (
                <div style={{
                  background: "#fff", border: `2px solid ${cat.color}30`, borderRadius: 14,
                  overflow: "hidden", marginBottom: 20,
                }}>
                  {/* Color bar */}
                  <div style={{ height: 4, background: cat.gradient }} />

                  {/* Header */}
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 280 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <Icon size={20} style={{ color: cat.color }} />
                          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>{program.title}</h2>
                          <div style={{
                            fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 6,
                            background: `${priorityColor(program.priority)}14`,
                            color: priorityColor(program.priority),
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>{program.priority}/10</div>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
                          <select
                            value={program.appStatus}
                            onChange={(e) => updateProgram(program.id, { appStatus: e.target.value as AppStatus })}
                            style={{
                              fontSize: 12, fontWeight: 700, padding: "5px 10px", borderRadius: 6,
                              background: status.bg, color: status.text, border: `1px solid ${status.border}`,
                              cursor: "pointer", outline: "none",
                            }}
                          >
                            <option value="nesetat">Nesetat</option>
                            <option value="aplicat">Aplicat</option>
                            <option value="in_lucru">In lucru</option>
                            <option value="nerelevant">Nerelevant</option>
                            <option value="dupa_lansare">Dupa lansare</option>
                          </select>
                          {program.lunaAplicare && (
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 6,
                              background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <Calendar size={12} /> {program.lunaAplicare}
                            </span>
                          )}
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 8px", borderRadius: 6, background: `${cat.color}10`, color: cat.color }}>
                            {cat.label}
                          </span>
                        </div>
                        {/* Tags — subtle */}
                        {program.tags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                            {program.tags.map((tag, i) => (
                              <span key={i} style={{ fontSize: 9, fontWeight: 500, padding: "2px 7px", borderRadius: 4, background: "#F3F4F6", color: "#9CA3AF", letterSpacing: 0.3 }}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Action buttons row */}
                      <div style={{ display: "flex", gap: 6, flexShrink: 0, flexWrap: "wrap" }}>
                        {program.url && (
                          <a href={program.url} target="_blank" rel="noreferrer" style={{
                            fontSize: 11, fontWeight: 700, padding: "8px 14px", borderRadius: 8,
                            background: "#2563EB", color: "#fff",
                            display: "flex", alignItems: "center", gap: 5, textDecoration: "none",
                          }}>
                            <ExternalLink size={13} /> Link
                          </a>
                        )}
                        <button onClick={() => openEditModal(program)} style={{
                          fontSize: 11, fontWeight: 700, padding: "8px 14px", borderRadius: 8,
                          border: "1px solid #D1D5DB", background: "#fff", color: "#374151", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                        }}>
                          <Edit3 size={13} /> Edit
                        </button>
                        <button onClick={() => { setExpandedCard(null); setShowBlockPicker(false); setNewBlockType(null); }} style={{
                          fontSize: 11, fontWeight: 700, padding: "8px 14px", borderRadius: 8,
                          border: "1px solid #D1D5DB", background: "#F9FAFB", color: "#6B7280", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 5,
                        }}>
                          <X size={13} /> Inchide
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body: 2-column layout */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 300 }}>
                    {/* Left: Info */}
                    <div style={{ padding: "20px 24px", borderRight: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6, borderBottom: "2px solid #E5E7EB", paddingBottom: 10 }}>
                        <BookOpen size={14} /> Informatii Program
                      </div>

                      <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.7, marginBottom: 16 }}>{program.description}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                        {program.deadline && (
                          <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Deadline</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <Clock size={13} style={{ color: "#DC2626" }} /> {program.deadline}
                            </div>
                          </div>
                        )}
                        {program.location && (
                          <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#7C3AED", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Locatie</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <MapPin size={13} style={{ color: "#7C3AED" }} /> {program.location}
                            </div>
                          </div>
                        )}
                        {program.budget && (
                          <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Buget / Valoare</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <DollarSign size={13} style={{ color: "#059669" }} /> {program.budget}
                            </div>
                          </div>
                        )}
                        {program.organizer && (
                          <div style={{ background: "#fff", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#2563EB", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Organizator</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <Users size={13} style={{ color: "#2563EB" }} /> {program.organizer}
                            </div>
                          </div>
                        )}
                      </div>

                      {program.notes && (
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Note</div>
                          <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{program.notes}</p>
                        </div>
                      )}
                    </div>

                    {/* Right: Activity Blocks */}
                    <div style={{ padding: "20px 24px", background: "#FAFBFC" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, borderBottom: "2px solid #E5E7EB", paddingBottom: 10 }}>
                        <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: 0.8, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                          <BarChart3 size={14} /> Jurnal Activitate
                          {blocks.length > 0 && (
                            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "#EFF6FF", color: "#2563EB" }}>{blocks.length}</span>
                          )}
                        </div>
                        <button
                          onClick={() => { setShowBlockPicker(!showBlockPicker); setNewBlockType(null); setNewBlockContent(""); }}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "6px 12px", fontSize: 11, fontWeight: 700,
                            color: "#fff", background: "linear-gradient(135deg, #059669, #047857)",
                            border: "none", borderRadius: 6, cursor: "pointer",
                          }}
                        >
                          <PlusCircle size={13} /> Adauga Bloc
                        </button>
                      </div>

                      {/* Block type picker */}
                      {showBlockPicker && !newBlockType && (
                        <div style={{
                          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 16,
                          padding: 12, background: "#fff", borderRadius: 10, border: "1px solid #D1D5DB",
                        }}>
                          <div style={{ gridColumn: "1 / -1", fontSize: 11, fontWeight: 700, color: "#374151", marginBottom: 4 }}>Alege tipul blocului:</div>
                          {BLOCK_TYPES.map((bt) => {
                            const BIcon = bt.icon;
                            return (
                              <button
                                key={bt.type}
                                onClick={() => { setNewBlockType(bt.type); setNewBlockDate(todayStr()); }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 6,
                                  padding: "8px 10px", fontSize: 11, fontWeight: 600,
                                  color: bt.color, background: bt.bg, border: `1px solid ${bt.border}`,
                                  borderRadius: 8, cursor: "pointer", textAlign: "left",
                                }}
                              >
                                <BIcon size={14} /> {bt.label}
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* New block form */}
                      {newBlockType && (() => {
                        const bt = getBlockDef(newBlockType);
                        const BIcon = bt.icon;
                        return (
                          <div style={{
                            marginBottom: 16, padding: 14, background: bt.bg,
                            borderRadius: 10, border: `2px solid ${bt.border}`,
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                              <BIcon size={16} style={{ color: bt.color }} />
                              <span style={{ fontSize: 12, fontWeight: 700, color: bt.color }}>{bt.label}</span>
                              <button onClick={() => { setNewBlockType(null); setNewBlockContent(""); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 2 }}>
                                <X size={14} />
                              </button>
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                <Calendar size={12} style={{ color: newBlockType === "reminder" ? "#DC2626" : "#6B7280" }} />
                                {newBlockType === "reminder" ? (
                                  <input
                                    type="date"
                                    value={(() => { try { const p = newBlockDate.split(" "); const m: Record<string,string> = {Ian:"01",Feb:"02",Mar:"03",Apr:"04",Mai:"05",Iun:"06",Iul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"}; if (p.length === 3 && m[p[1]]) return `${p[2]}-${m[p[1]]}-${p[0].padStart(2,"0")}`; return newBlockDate; } catch { return newBlockDate; } })()}
                                    onChange={(e) => {
                                      const d = new Date(e.target.value + "T12:00:00");
                                      if (!isNaN(d.getTime())) {
                                        const mo = ["Ian","Feb","Mar","Apr","Mai","Iun","Iul","Aug","Sep","Oct","Nov","Dec"];
                                        setNewBlockDate(`${d.getDate()} ${mo[d.getMonth()]} ${d.getFullYear()}`);
                                      }
                                    }}
                                    style={{
                                      padding: "6px 10px", fontSize: 12, border: "2px solid #FECACA",
                                      borderRadius: 6, outline: "none", width: 170, background: "#FEF2F2", color: "#DC2626", fontWeight: 700,
                                      cursor: "pointer",
                                    }}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={newBlockDate}
                                    onChange={(e) => setNewBlockDate(e.target.value)}
                                    style={{
                                      padding: "6px 10px", fontSize: 12, border: `1px solid ${bt.border}`,
                                      borderRadius: 6, outline: "none", width: 130, background: "#fff", color: "#111827", fontWeight: 600,
                                    }}
                                  />
                                )}
                              </div>
                              {newBlockType === "reminder" && (
                                <span style={{ fontSize: 10, fontWeight: 600, color: "#DC2626", display: "flex", alignItems: "center", gap: 3 }}>
                                  <Bell size={10} /> Data notificare
                                </span>
                              )}
                            </div>
                            <textarea
                              value={newBlockContent}
                              onChange={(e) => setNewBlockContent(e.target.value)}
                              placeholder={bt.placeholder}
                              autoFocus
                              style={{
                                width: "100%", padding: "10px 12px", fontSize: 13, border: `1px solid ${bt.border}`,
                                borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif",
                                minHeight: 70, resize: "vertical", background: "#fff", lineHeight: 1.6, color: "#111827",
                              }}
                            />
                            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                              <button
                                onClick={() => addBlock(program.id)}
                                disabled={!newBlockContent.trim()}
                                style={{
                                  padding: "7px 16px", fontSize: 11, fontWeight: 700,
                                  color: "#fff", background: bt.color,
                                  border: "none", borderRadius: 6, cursor: "pointer",
                                  opacity: !newBlockContent.trim() ? 0.5 : 1,
                                }}
                              >Salveaza</button>
                              <button
                                onClick={() => { setNewBlockType(null); setNewBlockContent(""); }}
                                style={{
                                  padding: "7px 16px", fontSize: 11, fontWeight: 600,
                                  color: "#6B7280", background: "#fff",
                                  border: "1px solid #D1D5DB", borderRadius: 6, cursor: "pointer",
                                }}
                              >Anuleaza</button>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Existing blocks */}
                      {blocks.length === 0 && !showBlockPicker && (
                        <div style={{ textAlign: "center", padding: "30px 16px", color: "#9CA3AF" }}>
                          <MessageSquare size={28} style={{ opacity: 0.3, marginBottom: 8 }} />
                          <p style={{ fontSize: 12, color: "#6B7280" }}>Niciun bloc adaugat. Apasa &quot;Adauga Bloc&quot; pentru a incepe jurnalul de activitate.</p>
                        </div>
                      )}

                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {blocks.slice().reverse().map((block) => {
                          const bt = getBlockDef(block.type);
                          const BIcon = bt.icon;
                          return (
                            <div key={block.id} style={{
                              padding: "12px 14px", background: "#fff",
                              borderRadius: 10, border: `1px solid ${bt.border}`,
                              borderLeft: `4px solid ${bt.color}`,
                            }}>
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <BIcon size={14} style={{ color: bt.color }} />
                                  <span style={{ fontSize: 11, fontWeight: 700, color: bt.color }}>{bt.label}</span>
                                  <span style={{ fontSize: 10, fontWeight: 600, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}>
                                    <Calendar size={10} /> {block.date}
                                  </span>
                                </div>
                                <button
                                  onClick={() => deleteBlock(program.id, block.id)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#D1D5DB", padding: 2 }}
                                  title="Sterge bloc"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <p style={{ fontSize: 13, color: "#1F2937", lineHeight: 1.6, whiteSpace: "pre-wrap", margin: 0 }}>{block.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Grid of cards ── */}
            {!expandedCard && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
                {filtered
                  .sort((a, b) => b.priority - a.priority)
                  .map((program) => {
                    const cat = getCategoryDef(program.category);
                    const status = APP_STATUS_CONFIG[program.appStatus];
                    const Icon = cat.icon;
                    const blockCount = (program.blocks || []).length;
                    return (
                      <div
                        key={program.id}
                        onClick={() => { setExpandedCard(program.id); setShowBlockPicker(false); setNewBlockType(null); }}
                        style={{
                          background: "#fff", border: `1px solid ${program.appStatus === "aplicat" ? "#86EFAC" : program.appStatus === "in_lucru" ? "#93C5FD" : program.appStatus === "nerelevant" ? "#D1D5DB" : "#E5E7EB"}`,
                          borderRadius: 12, overflow: "hidden",
                          opacity: program.appStatus === "nerelevant" ? 0.6 : 1,
                          transition: "all 0.2s", cursor: "pointer",
                        }}
                      >
                        <div style={{ height: 3, background: cat.gradient }} />
                        <div style={{ padding: "14px 16px" }}>
                          {/* Header */}
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, flex: 1, minWidth: 0 }}>
                              <Icon size={15} style={{ color: cat.color, flexShrink: 0 }} />
                              <span style={{ fontSize: 14, fontWeight: 700, color: "#111827", lineHeight: 1.3 }}>{program.title}</span>
                            </div>
                            <div style={{
                              fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6,
                              background: `${priorityColor(program.priority)}14`,
                              color: priorityColor(program.priority),
                              flexShrink: 0, fontFamily: "'JetBrains Mono', monospace",
                            }}>
                              {program.priority}/10
                            </div>
                          </div>

                          {/* Status row */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                            <span style={{
                              fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 6,
                              background: status.bg, color: status.text, border: `1px solid ${status.border}`,
                            }}>
                              {status.label}
                            </span>
                            {program.lunaAplicare && (
                              <span style={{
                                fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                                background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                                display: "flex", alignItems: "center", gap: 3,
                              }}>
                                <Calendar size={10} /> {program.lunaAplicare}
                              </span>
                            )}
                            <span style={{ fontSize: 9, fontWeight: 600, padding: "3px 7px", borderRadius: 6, background: `${cat.color}10`, color: cat.color }}>
                              {cat.label}
                            </span>
                          </div>

                          {/* Description */}
                          <p style={{
                            fontSize: 12, color: "#4B5563", lineHeight: 1.5, marginBottom: 10,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                          }}>{program.description}</p>

                          {/* Meta */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 10, color: "#6B7280", marginBottom: 8 }}>
                            {program.deadline && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <Clock size={10} /> {program.deadline}
                              </span>
                            )}
                            {program.location && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <MapPin size={10} /> {program.location}
                              </span>
                            )}
                          </div>

                          {/* Tags — subtle */}
                          {program.tags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
                              {program.tags.map((tag, i) => (
                                <span key={i} style={{
                                  fontSize: 9, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
                                  background: "#F9FAFB", color: "#9CA3AF", border: "1px solid #F3F4F6",
                                }}>{tag}</span>
                              ))}
                            </div>
                          )}

                          {/* Block count + Reminder indicator */}
                          {(blockCount > 0 || (program.blocks || []).some((b) => b.type === "reminder")) && (
                            <div style={{ display: "flex", gap: 4, paddingTop: 8, borderTop: "1px solid #F3F4F6", flexWrap: "wrap" }}>
                              {blockCount > 0 && (
                                <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", gap: 3 }}>
                                  <BarChart3 size={10} /> {blockCount} {blockCount === 1 ? "bloc" : "blocuri"}
                                </span>
                              )}
                              {(program.blocks || []).some((b) => b.type === "reminder") && (
                                <span style={{
                                  fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                                  background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA",
                                  display: "flex", alignItems: "center", gap: 3,
                                  animation: "pulse 2s infinite",
                                }}>
                                  <Bell size={10} style={{ color: "#DC2626" }} /> Reminder
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </>
        )}
      </div>}

      {/* ═══ Add/Edit Modal ═══ */}
      {showAddModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 9999, padding: 20,
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: "#fff", borderRadius: 16, maxWidth: 600, width: "100%",
            maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "18px 22px", borderBottom: "1px solid #E5E7EB",
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>
                {editingProgram ? "Editeaza program" : "Adauga program nou"}
              </h3>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", padding: 4 }} onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Titlu *</label>
                <input
                  style={{ width: "100%", padding: "10px 14px", fontSize: 14, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif", color: "#111827" }}
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Numele programului"
                  autoFocus
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Categorie</label>
                  <select
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", background: "#fff", cursor: "pointer", color: "#111827" }}
                    value={formData.category || "conferinte"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryKey })}
                  >
                    {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Status</label>
                  <select
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", background: "#fff", cursor: "pointer", color: "#111827" }}
                    value={formData.appStatus || "nesetat"}
                    onChange={(e) => setFormData({ ...formData, appStatus: e.target.value as AppStatus })}
                  >
                    <option value="nesetat">Nesetat</option>
                    <option value="aplicat">Aplicat</option>
                    <option value="in_lucru">In lucru</option>
                    <option value="nerelevant">Nerelevant</option>
                    <option value="dupa_lansare">Dupa lansare</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Prioritate (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827", fontWeight: 600 }}
                    value={formData.priority || 5}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 5 })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Descriere</label>
                <textarea
                  style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif", minHeight: 80, resize: "vertical", color: "#111827", lineHeight: 1.6 }}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descriere detaliata"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Deadline</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.deadline || ""}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="Ex: 15 Martie 2026"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Luna de aplicare</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.lunaAplicare || ""}
                    onChange={(e) => setFormData({ ...formData, lunaAplicare: e.target.value })}
                    placeholder="Ex: Martie 2026"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Locatie</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Online / Berlin"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Organizator</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.organizer || ""}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Ex: European Commission"
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Buget / Valoare</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.budget || ""}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ex: EUR 5,000"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>URL</label>
                  <input
                    style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                    value={formData.url || ""}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Tags (separate cu virgula)</label>
                <input
                  style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", color: "#111827" }}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: marketing, digital, EU"
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 5, display: "block" }}>Note</label>
                <textarea
                  style={{ width: "100%", padding: "10px 14px", fontSize: 13, border: "1px solid #D1D5DB", borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif", minHeight: 60, resize: "vertical", color: "#111827", lineHeight: 1.6 }}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Note interne..."
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px", borderTop: "1px solid #E5E7EB" }}>
              {editingProgram && (
                <button
                  style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, cursor: "pointer", marginRight: "auto" }}
                  onClick={() => deleteProgram(editingProgram.id)}
                >Sterge</button>
              )}
              <button
                style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
                onClick={() => setShowAddModal(false)}
              >Anuleaza</button>
              <button
                style={{
                  padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#fff",
                  background: "linear-gradient(135deg, #DC2626, #B91C1C)", border: "none", borderRadius: 8, cursor: "pointer",
                  opacity: !formData.title ? 0.5 : 1,
                }}
                onClick={saveProgram}
                disabled={!formData.title}
              >{editingProgram ? "Salveaza" : "Adauga"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
