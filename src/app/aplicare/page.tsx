"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
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
  Globe,
  Lightbulb,
  Trophy,
  GraduationCap,
  Mic2,
  Gift,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Bell,
  BarChart3,
  Edit3,
  Trash2,
  ArrowUpRight,
  CircleDot,
  MessageSquare,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   R IF C — Aplicare Programe v2
   31 pre-populated programs across 6 categories
   Status: Aplicat | Nerelevant | Dupa lansare
   Tracking: mesaj trimis, reminder, monitoring
   Filter: APLICATE
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
type CategoryKey = "conferinte" | "granturi" | "competitii" | "forumuri" | "premii" | "oportunitati";
type AppStatus = "nesetat" | "aplicat" | "nerelevant" | "dupa_lansare";

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
  priority: number; // 1-10
  tags: string[];
  notes: string | null;
  created_at: string;
  // new fields
  appStatus: AppStatus;
  lunaAplicare: string | null; // e.g. "Martie 2026"
  mesajTrimis: string | null;
  mesajData: string | null;
  reminder: string | null; // date ISO
  reminderNote: string | null;
  monitoring: string | null; // free text notes
}

interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: typeof BookOpen;
  color: string;
  gradient: string;
}

const CATEGORIES: CategoryDef[] = [
  { key: "conferinte", label: "Conferinte Academice", icon: Mic2, color: "#2563EB", gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)" },
  { key: "granturi", label: "Granturi", icon: DollarSign, color: "#059669", gradient: "linear-gradient(135deg, #059669, #047857)" },
  { key: "competitii", label: "Competitii cu Premii", icon: Trophy, color: "#D97706", gradient: "linear-gradient(135deg, #D97706, #B45309)" },
  { key: "forumuri", label: "Forumuri", icon: Users, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
  { key: "premii", label: "Premii", icon: Award, color: "#DC2626", gradient: "linear-gradient(135deg, #DC2626, #B91C1C)" },
  { key: "oportunitati", label: "Oportunitati", icon: Lightbulb, color: "#0891B2", gradient: "linear-gradient(135deg, #0891B2, #0E7490)" },
];

type TabKey = "all" | CategoryKey;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ALL" },
  ...CATEGORIES.map((c) => ({ key: c.key as TabKey, label: c.label })),
];

const APP_STATUS_CONFIG: Record<AppStatus, { bg: string; text: string; label: string; border: string }> = {
  nesetat: { bg: "#F3F4F6", text: "#6B7280", label: "Nesetat", border: "#E5E7EB" },
  aplicat: { bg: "#DCFCE7", text: "#16A34A", label: "Aplicat", border: "#86EFAC" },
  nerelevant: { bg: "#F3F4F6", text: "#9CA3AF", label: "Nerelevant", border: "#D1D5DB" },
  dupa_lansare: { bg: "#FEF3C7", text: "#D97706", label: "Dupa lansare", border: "#FCD34D" },
};

const ACCESS_CODE = "APLICARE2026";
const STORAGE_KEY = "rifc-aplicare-access";
const DATA_KEY = "rifc-aplicare-programs-v2";

// ── Seed Data ─────────────────────────────────────────────
const SEED_PROGRAMS: Omit<Program, "id" | "created_at" | "appStatus" | "mesajTrimis" | "mesajData" | "reminder" | "reminderNote" | "monitoring">[] = [
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
    description: "Accepta abstracte (nu lucrari complete). RIFC pozitionat ca instrument de diagnostic pentru campanii B2B.",
    deadline: "16 Martie 2026",
    location: "Spania (Universidade de Vigo, Galicia)",
    url: "https://cbim2026.com/Home/en/",
    budget: "Publicare in Journal of Business & Industrial Marketing",
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
    description: "Finanteaza networking, capacity building, staff exchange si pana la 30% activitati de cercetare. CEA MAI VALOROASA OPORTUNITATE DIN LISTA.",
    deadline: "9 Aprilie 2026 (17:00 Bruxelles)",
    location: "UE — Parteneri: UTM/USM + min. 2 institutii UE top",
    url: "https://rea.ec.europa.eu/funding-and-grants/horizon-europe-widening-participation",
    budget: "EUR 800,000 — EUR 1,500,000 per proiect",
    organizer: "Comisia Europeana / REA",
    priority: 10,
    tags: ["CEA MAI MARE VALOARE", "Pre-publicare ideal"],
    notes: null,
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
    description: "Propune o actiune de networking pe 4 ani: 'Innovation in Marketing Measurement Methodology'. Cercetator ar conduce intreaga retea europeana.",
    deadline: "Estimat Octombrie 2026",
    location: "UE — Min. 7 tari, Moldova ITC eligibila",
    url: "https://www.cost.eu/funding/open-call-a-simple-one-step-application-process/",
    budget: "~EUR 575,000 total peste 4 ani",
    organizer: "COST Association",
    priority: 8,
    tags: ["OCT 2026"],
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
    description: "Finanteaza incubare, accelerare, hackathoane, mentoring. CONTINUUM GRUP SRL poate aplica pentru integrarea Protocolului RIFC in programe de accelerare startup.",
    deadline: "Activ acum — pana la EUR 250,000 per grant",
    location: "Moldova",
    url: "https://eu4moldova.eu/en/eu4innovation-east",
    budget: "Pana la EUR 250,000 per grant",
    organizer: "Delegatia UE in Moldova",
    priority: 9,
    tags: ["ACTIV ACUM", "Lansat 29 Ian 2026"],
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
];

// ── Helpers ────────────────────────────────────────────────
function generateId(): string {
  return "ap-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getCategoryDef(key: CategoryKey): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

function loadPrograms(): Program[] {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  // Seed with default data
  const seeded: Program[] = SEED_PROGRAMS.map((s, i) => ({
    ...s,
    id: "seed-" + (i + 1).toString().padStart(2, "0"),
    created_at: new Date(2026, 1, 20, 10, i).toISOString(),
    appStatus: "nesetat" as AppStatus,
    mesajTrimis: null,
    mesajData: null,
    reminder: null,
    reminderNote: null,
    monitoring: null,
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

// ── Component ──────────────────────────────────────────────
export default function AplicareProgramePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filterAplicate, setFilterAplicate] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({});
  const [tagsInput, setTagsInput] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  useEffect(() => {
    const granted = localStorage.getItem(STORAGE_KEY);
    if (granted === "granted") setHasAccess(true);
  }, []);

  useEffect(() => {
    if (hasAccess) setPrograms(loadPrograms());
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

  // Update program helper
  const updateProgram = (id: string, changes: Partial<Program>) => {
    const updated = programs.map((p) => (p.id === id ? { ...p, ...changes } : p));
    setPrograms(updated);
    savePrograms(updated);
    if (viewingProgram && viewingProgram.id === id) {
      setViewingProgram({ ...viewingProgram, ...changes });
    }
  };

  // Filter programs
  const filtered = programs.filter((p) => {
    if (filterAplicate && p.appStatus !== "aplicat") return false;
    if (activeTab !== "all" && p.category !== activeTab) return false;
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
        mesajTrimis: formData.mesajTrimis || null,
        mesajData: formData.mesajData || null,
        reminder: formData.reminder || null,
        reminderNote: formData.reminderNote || null,
        monitoring: formData.monitoring || null,
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
    setViewingProgram(null);
    setEditingProgram(null);
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
          <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 28 }}>Introduceti codul de acces pentru a continua</p>
          <input
            type="password"
            style={{
              width: "100%", padding: "14px 16px", fontSize: 15,
              border: "2px solid #E5E7EB", borderRadius: 10, outline: "none",
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
      {/* Header */}
      <div style={{
        padding: "20px 28px 0", borderBottom: "1px solid #E5E7EB",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#DC2626", letterSpacing: 4, fontWeight: 700 }}>R IF C</div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: 0 }}>Aplicare Programe</h1>
              <p style={{ fontSize: 12, color: "#4B5563", marginTop: 2, fontWeight: 500 }}>
                {totalPrograms} programe &middot; {aplicateCount} aplicate
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {/* Search */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search size={14} style={{ position: "absolute", left: 10, color: "#6B7280", pointerEvents: "none" }} />
              <input
                type="text"
                style={{
                  padding: "8px 12px 8px 32px", fontSize: 13,
                  border: "1px solid #D1D5DB", borderRadius: 8, outline: "none",
                  width: 200, background: "#fff", color: "#111827",
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cauta programe..."
              />
            </div>
            {/* APLICATE filter */}
            <button
              onClick={() => setFilterAplicate(!filterAplicate)}
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
            {/* Add button */}
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
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {TABS.map((t) => {
            const count = t.key === "all" ? totalPrograms : categoryCounts[t.key] || 0;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                style={{
                  padding: "10px 14px", fontSize: 11, fontWeight: 600,
                  color: isActive ? "#DC2626" : "#6B7280",
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
                  color: isActive ? "#DC2626" : "#6B7280",
                  marginLeft: 5,
                }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 28px 80px", maxWidth: 1300 }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 4 }}>
                  <Icon size={14} style={{ color: cat.color }} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace", color: "#111827" }}>{count}</div>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginTop: 2 }}>{cat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#9CA3AF" }}>
            <Briefcase size={40} style={{ opacity: 0.3, marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 8 }}>
              {search ? "Niciun program gasit." : filterAplicate ? "Niciun program marcat ca aplicat." : "Niciun program in aceasta categorie."}
            </p>
          </div>
        ) : (
          <>
            {/* ── Mini tabs row (other cards when one is expanded) ── */}
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
                      onClick={() => setExpandedCard(program.id)}
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
                          background: program.appStatus === "aplicat" ? "#16A34A" : program.appStatus === "nerelevant" ? "#9CA3AF" : "#D97706",
                        }} />
                      )}
                    </button>
                  );
                })}
                <button
                  onClick={() => setExpandedCard(null)}
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
              return (
                <div style={{
                  background: "#fff", border: `2px solid ${cat.color}40`, borderRadius: 14,
                  overflow: "hidden", marginBottom: 20,
                }}>
                  {/* Color bar */}
                  <div style={{ height: 4, background: cat.gradient }} />

                  {/* Header */}
                  <div style={{ padding: "18px 24px", borderBottom: "1px solid #E5E7EB" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
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
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                          <select
                            value={program.appStatus}
                            onChange={(e) => updateProgram(program.id, { appStatus: e.target.value as AppStatus })}
                            style={{
                              fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 6,
                              background: status.bg, color: status.text, border: `1px solid ${status.border}`,
                              cursor: "pointer", outline: "none",
                            }}
                          >
                            <option value="nesetat">Nesetat</option>
                            <option value="aplicat">Aplicat</option>
                            <option value="nerelevant">Nerelevant</option>
                            <option value="dupa_lansare">Dupa lansare</option>
                          </select>
                          {program.lunaAplicare && (
                            <span style={{
                              fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6,
                              background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE",
                              display: "flex", alignItems: "center", gap: 4,
                            }}>
                              <Calendar size={11} /> {program.lunaAplicare}
                            </span>
                          )}
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "4px 8px", borderRadius: 6, background: `${cat.color}10`, color: cat.color }}>
                            {cat.label}
                          </span>
                          {program.tags.map((tag, i) => (
                            <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 5, background: "#F3F4F6", color: "#6B7280" }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {program.url && (
                          <a href={program.url} target="_blank" rel="noreferrer" style={{
                            fontSize: 11, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
                            border: "1px solid #BFDBFE", background: "#EFF6FF",
                            color: "#2563EB", display: "flex", alignItems: "center", gap: 4, textDecoration: "none",
                          }}>
                            <ExternalLink size={12} /> Deschide Link
                          </a>
                        )}
                        <button onClick={() => openEditModal(program)} style={{
                          fontSize: 11, fontWeight: 600, padding: "7px 14px", borderRadius: 8,
                          border: "1px solid #E5E7EB", background: "#fff", color: "#374151", cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4,
                        }}>
                          <Edit3 size={12} /> Edit
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body: 2-column layout */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 350 }}>
                    {/* Left: Info */}
                    <div style={{ padding: "20px 24px", borderRight: "1px solid #E5E7EB" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6, borderBottom: "2px solid #E5E7EB", paddingBottom: 10 }}>
                        <BookOpen size={14} /> Informatii Program
                      </div>

                      <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.7, marginBottom: 16 }}>{program.description}</p>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                        {program.deadline && (
                          <div style={{ background: "#FFF", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Deadline</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <Clock size={13} style={{ color: "#DC2626" }} /> {program.deadline}
                            </div>
                          </div>
                        )}
                        {program.location && (
                          <div style={{ background: "#FFF", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Locatie</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <MapPin size={13} style={{ color: "#7C3AED" }} /> {program.location}
                            </div>
                          </div>
                        )}
                        {program.budget && (
                          <div style={{ background: "#FFF", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Buget / Valoare</div>
                            <div style={{ fontSize: 13, color: "#111827", display: "flex", alignItems: "center", gap: 4, fontWeight: 700 }}>
                              <DollarSign size={13} style={{ color: "#059669" }} /> {program.budget}
                            </div>
                          </div>
                        )}
                        {program.organizer && (
                          <div style={{ background: "#FFF", padding: "12px 14px", borderRadius: 8, border: "1px solid #D1D5DB" }}>
                            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 }}>Organizator</div>
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

                    {/* Right: Tracking workspace */}
                    <div style={{ padding: "20px 24px", background: "#FAFBFC" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 6, borderBottom: "2px solid #E5E7EB", paddingBottom: 10 }}>
                        <BarChart3 size={14} /> Zona de Lucru & Tracking
                      </div>

                      {/* Mesaj Trimis */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#111827", marginBottom: 6, display: "flex", alignItems: "center", gap: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>
                          <Send size={12} style={{ color: "#2563EB" }} /> Mesaj Trimis
                        </div>
                        <textarea
                          value={program.mesajTrimis || ""}
                          onChange={(e) => updateProgram(program.id, { mesajTrimis: e.target.value })}
                          placeholder="ORCID: 0009-0000-3832-8392&#10;info.talmazan@gmail.com&#10;https://www.instagram.com/talmazan.md/"
                          style={{
                            width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #D1D5DB",
                            borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif",
                            minHeight: 80, resize: "vertical", background: "#fff", lineHeight: 1.6,
                            color: "#111827",
                          }}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                          <span style={{ fontSize: 11, color: "#374151", fontWeight: 600 }}>Data trimitere:</span>
                          <input
                            type="text"
                            value={program.mesajData || ""}
                            onChange={(e) => updateProgram(program.id, { mesajData: e.target.value })}
                            placeholder="ex: 20 Feb 2026"
                            style={{
                              padding: "6px 10px", fontSize: 12, border: "1px solid #D1D5DB",
                              borderRadius: 6, outline: "none", width: 160, background: "#fff", color: "#111827",
                            }}
                          />
                        </div>
                      </div>

                      {/* Reminder */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#111827", marginBottom: 6, display: "flex", alignItems: "center", gap: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>
                          <Bell size={12} style={{ color: "#D97706" }} /> Reminder — Cind de revenit
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <input
                            type="text"
                            value={program.reminder || ""}
                            onChange={(e) => updateProgram(program.id, { reminder: e.target.value })}
                            placeholder="ex: 15 Mar 2026"
                            style={{
                              padding: "8px 12px", fontSize: 13, border: "1px solid #D1D5DB",
                              borderRadius: 8, outline: "none", width: 160, background: "#fff", color: "#111827",
                            }}
                          />
                          <input
                            type="text"
                            value={program.reminderNote || ""}
                            onChange={(e) => updateProgram(program.id, { reminderNote: e.target.value })}
                            placeholder="Nota reminder..."
                            style={{
                              padding: "8px 12px", fontSize: 13, border: "1px solid #D1D5DB",
                              borderRadius: 8, outline: "none", flex: 1, background: "#fff", color: "#111827",
                            }}
                          />
                        </div>
                        {program.reminder && (
                          <div style={{ marginTop: 6, padding: "6px 10px", background: "#FFFBEB", borderRadius: 6, border: "1px solid #FCD34D", fontSize: 11, color: "#92400E", display: "flex", alignItems: "center", gap: 4 }}>
                            <Bell size={10} /> Revino pe: <strong>{program.reminder}</strong> {program.reminderNote ? `— ${program.reminderNote}` : ""}
                          </div>
                        )}
                      </div>

                      {/* Monitoring */}
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#111827", marginBottom: 6, display: "flex", alignItems: "center", gap: 5, letterSpacing: 0.5, textTransform: "uppercase" }}>
                          <BarChart3 size={12} style={{ color: "#059669" }} /> Monitorizare
                        </div>
                        <textarea
                          value={program.monitoring || ""}
                          onChange={(e) => updateProgram(program.id, { monitoring: e.target.value })}
                          placeholder="Note de monitorizare, raspunsuri primite, status aplicare..."
                          style={{
                            width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #D1D5DB",
                            borderRadius: 8, outline: "none", fontFamily: "'Inter', sans-serif",
                            minHeight: 80, resize: "vertical", background: "#fff", lineHeight: 1.6,
                            color: "#111827",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ── Grid of cards (shown when nothing expanded, or hidden when expanded) ── */}
            {!expandedCard && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 14 }}>
                {filtered
                  .sort((a, b) => b.priority - a.priority)
                  .map((program) => {
                    const cat = getCategoryDef(program.category);
                    const status = APP_STATUS_CONFIG[program.appStatus];
                    const Icon = cat.icon;
                    return (
                      <div
                        key={program.id}
                        onClick={() => setExpandedCard(program.id)}
                        style={{
                          background: "#fff", border: `1px solid ${program.appStatus === "aplicat" ? "#86EFAC" : program.appStatus === "nerelevant" ? "#D1D5DB" : "#E5E7EB"}`,
                          borderRadius: 12, overflow: "hidden",
                          opacity: program.appStatus === "nerelevant" ? 0.6 : 1,
                          transition: "all 0.2s", cursor: "pointer",
                        }}
                      >
                        {/* Color bar top */}
                        <div style={{ height: 3, background: cat.gradient }} />
                        <div style={{ padding: "14px 16px" }}>
                          {/* Header row */}
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

                          {/* Status + Luna de aplicare row */}
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

                          {/* Meta info */}
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
                            {program.budget && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                <DollarSign size={10} /> {program.budget}
                              </span>
                            )}
                          </div>

                          {/* Tags */}
                          {program.tags.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginBottom: 8 }}>
                              {program.tags.map((tag, i) => (
                                <span key={i} style={{
                                  fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
                                  background: "#F3F4F6", color: "#6B7280",
                                }}>{tag}</span>
                              ))}
                            </div>
                          )}

                          {/* Tracking indicator */}
                          {(program.mesajTrimis || program.reminder || program.monitoring) && (
                            <div style={{ display: "flex", gap: 4, paddingTop: 8, borderTop: "1px solid #F3F4F6" }}>
                              {program.mesajTrimis && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", gap: 2 }}><Send size={8} /> Mesaj</span>}
                              {program.reminder && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#FFFBEB", color: "#D97706", display: "flex", alignItems: "center", gap: 2 }}><Bell size={8} /> {program.reminder}</span>}
                              {program.monitoring && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: "#F0FDF4", color: "#059669", display: "flex", alignItems: "center", gap: 2 }}><BarChart3 size={8} /> Monitorizat</span>}
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
      </div>

      {/* ═══ View Program Modal ═══ */}
      {viewingProgram && !showAddModal && (() => {
        const cat = getCategoryDef(viewingProgram.category);
        const status = APP_STATUS_CONFIG[viewingProgram.appStatus];
        const Icon = cat.icon;
        return (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center",
            justifyContent: "center", zIndex: 9999, padding: 20,
          }} onClick={() => setViewingProgram(null)}>
            <div style={{
              background: "#fff", borderRadius: 16, maxWidth: 640, width: "100%",
              maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 22px", borderBottom: "1px solid #E5E7EB",
                borderTop: `4px solid ${cat.color}`, borderRadius: "16px 16px 0 0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={18} style={{ color: cat.color }} />
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>{viewingProgram.title}</h3>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }} onClick={() => setViewingProgram(null)}>
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "18px 22px" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 8, background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                    {status.label}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: `${cat.color}14`, color: cat.color }}>
                    {cat.label}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 8,
                    background: `${priorityColor(viewingProgram.priority)}14`, color: priorityColor(viewingProgram.priority),
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    Prioritate: {viewingProgram.priority}/10
                  </span>
                  {viewingProgram.lunaAplicare && (
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 8, background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", gap: 4 }}>
                      <Calendar size={11} /> {viewingProgram.lunaAplicare}
                    </span>
                  )}
                </div>

                {viewingProgram.description && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Descriere</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{viewingProgram.description}</p>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {viewingProgram.deadline && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Deadline</div>
                      <div style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                        <Calendar size={13} style={{ color: "#6B7280" }} /> {viewingProgram.deadline}
                      </div>
                    </div>
                  )}
                  {viewingProgram.location && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Locatie</div>
                      <div style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                        <MapPin size={13} style={{ color: "#6B7280" }} /> {viewingProgram.location}
                      </div>
                    </div>
                  )}
                  {viewingProgram.budget && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Buget / Valoare</div>
                      <div style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                        <DollarSign size={13} style={{ color: "#6B7280" }} /> {viewingProgram.budget}
                      </div>
                    </div>
                  )}
                  {viewingProgram.organizer && (
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Organizator</div>
                      <div style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>
                        <Users size={13} style={{ color: "#6B7280" }} /> {viewingProgram.organizer}
                      </div>
                    </div>
                  )}
                </div>

                {viewingProgram.url && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Link</div>
                    <a href={viewingProgram.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: "#2563EB", display: "flex", alignItems: "center", gap: 5, wordBreak: "break-all" }}>
                      <ExternalLink size={13} /> {viewingProgram.url}
                    </a>
                  </div>
                )}

                {/* Tracking section in detail modal */}
                <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14, marginTop: 14 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#111827", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                    <BarChart3 size={14} /> Zona de Tracking
                  </div>
                  {viewingProgram.mesajTrimis && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>Mesaj Trimis {viewingProgram.mesajData ? `(${viewingProgram.mesajData})` : ""}</div>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "#F9FAFB", padding: 8, borderRadius: 6, border: "1px solid #E5E7EB" }}>
                        {viewingProgram.mesajTrimis}
                      </p>
                    </div>
                  )}
                  {viewingProgram.reminder && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>Reminder: {viewingProgram.reminder}</div>
                      {viewingProgram.reminderNote && (
                        <p style={{ fontSize: 12, color: "#374151", background: "#FFFBEB", padding: 8, borderRadius: 6, border: "1px solid #FCD34D" }}>
                          {viewingProgram.reminderNote}
                        </p>
                      )}
                    </div>
                  )}
                  {viewingProgram.monitoring && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#374151", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 3 }}>Monitorizare</div>
                      <p style={{ fontSize: 12, color: "#374151", lineHeight: 1.6, whiteSpace: "pre-wrap", background: "#F0FDF4", padding: 8, borderRadius: 6, border: "1px solid #86EFAC" }}>
                        {viewingProgram.monitoring}
                      </p>
                    </div>
                  )}
                  {!viewingProgram.mesajTrimis && !viewingProgram.reminder && !viewingProgram.monitoring && (
                    <p style={{ fontSize: 11, color: "#6B7280", fontStyle: "italic" }}>Niciun tracking adaugat inca. Foloseste butonul &quot;Tracking&quot; de pe cartonas.</p>
                  )}
                </div>

                {viewingProgram.tags.length > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Tags</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {viewingProgram.tags.map((tag, i) => (
                        <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: "#F3F4F6", color: "#6B7280" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingProgram.notes && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Note</div>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{viewingProgram.notes}</p>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px", borderTop: "1px solid #E5E7EB" }}>
                <button
                  style={{
                    padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#DC2626",
                    background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, cursor: "pointer", marginRight: "auto",
                  }}
                  onClick={() => deleteProgram(viewingProgram.id)}
                >Sterge</button>
                <button
                  style={{ padding: "8px 16px", fontSize: 12, fontWeight: 600, color: "#6B7280", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8, cursor: "pointer" }}
                  onClick={() => setViewingProgram(null)}
                >Inchide</button>
                <button
                  style={{
                    padding: "8px 16px", fontSize: 12, fontWeight: 700, color: "#fff",
                    background: "linear-gradient(135deg, #DC2626, #B91C1C)", border: "none", borderRadius: 8, cursor: "pointer",
                  }}
                  onClick={() => { setViewingProgram(null); openEditModal(viewingProgram); }}
                >Editeaza</button>
              </div>
            </div>
          </div>
        );
      })()}

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
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 4 }} onClick={() => setShowAddModal(false)}>
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
