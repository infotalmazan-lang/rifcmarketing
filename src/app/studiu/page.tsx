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
  ChevronRight,
  ChevronDown as ChevronExpand,
  GripVertical,
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
  Upload,
  Loader2,
  Copy,
  QrCode,
  Users,
  ExternalLink,
  UserCheck,
  Bot,
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
  text_content: string | null;
  pdf_url: string | null;
  site_url: string | null;
  display_order: number;
  is_active: boolean;
  variant_label: string | null;
  execution_quality: string | null;
}

interface ExpertEvaluation {
  id: string;
  stimulus_id: string;
  expert_name: string;
  expert_role: string | null;
  r_score: number;
  i_score: number;
  f_score: number;
  c_computed: number;
  r_justification: string | null;
  i_justification: string | null;
  f_justification: string | null;
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

type TabKey = "sondaj" | "rezultate" | "distributie" | "experti" | "ai" | "preview";

const TABS: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "sondaj", label: "SONDAJ", icon: ClipboardList },
  { key: "rezultate", label: "REZULTATE", icon: BarChart3 },
  { key: "distributie", label: "DISTRIBUTIE", icon: Share2 },
  { key: "experti", label: "PANEL EXPERTI", icon: UserCheck },
  { key: "ai", label: "AI BENCHMARK", icon: Bot },
  { key: "preview", label: "PREVIEW", icon: PlayCircle },
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
  { value: "strong", label: "Strong", color: "#059669" },
  { value: "moderate", label: "Moderate", color: "#D97706" },
  { value: "weak", label: "Weak", color: "#DC2626" },
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
  text_content: "",
  pdf_url: "",
  site_url: "",
  display_order: order,
  variant_label: null,
  execution_quality: null,
});

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
  const [activeTab, setActiveTab] = useState<TabKey>("sondaj");
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

  // Results state
  interface ResultsData {
    totalRespondents: number;
    completedRespondents: number;
    completionRate: number;
    totalResponses: number;
    stimuliResults: {
      id: string;
      name: string;
      type: string;
      industry: string;
      response_count: number;
      avg_r: number;
      avg_i: number;
      avg_f: number;
      avg_c: number;
      sd_c: number;
    }[];
    aiEvaluations: unknown[];
  }
  const [results, setResults] = useState<ResultsData | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsSegment, setResultsSegment] = useState<string>("general"); // "general" or distribution_id

  // Expert panel state
  const [expertEvals, setExpertEvals] = useState<ExpertEvaluation[]>([]);
  const [expertLoading, setExpertLoading] = useState(false);
  const [showAddExpert, setShowAddExpert] = useState(false);
  const [expertForm, setExpertForm] = useState({ stimulus_id: "", expert_name: "", expert_role: "", r_score: 5, i_score: 5, f_score: 5, r_justification: "", i_justification: "", f_justification: "", notes: "" });
  const [expertSaving, setExpertSaving] = useState(false);

  // AI benchmark state
  const [aiEvals, setAiEvals] = useState<AiEvaluation[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAddAi, setShowAddAi] = useState(false);
  const [aiForm, setAiForm] = useState({ stimulus_id: "", model_name: "Claude", r_score: 5, i_score: 5, f_score: 5, prompt_version: "v1", justification: "" });
  const [aiSaving, setAiSaving] = useState(false);

  // ── Upload helper (tus resumable → direct to Supabase Storage, supports large files up to 500MB) ──
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const uploadFile = async (file: File, fieldKey: string): Promise<string | null> => {
    setUploading((prev) => ({ ...prev, [fieldKey]: true }));
    setUploadProgress((prev) => ({ ...prev, [fieldKey]: 0 }));
    setUploadStatus(`Se pregateste: ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB, ${file.type})...`);
    try {
      // Step 1: Get tus upload config from our API (uses service role)
      const configRes = await fetch("/api/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const config = await configRes.json();
      if (!config.tusEndpoint || !config.objectPath) {
        const errMsg = `Eroare configurare: ${config.error || "raspuns invalid de la server"}`;
        console.error(errMsg, config);
        setUploadStatus(errMsg);
        return null;
      }
      setUploadStatus(`Se incarca ${file.name}...`);

      // Step 2: Upload via tus resumable protocol (handles large files reliably)
      return await new Promise<string | null>((resolve) => {
        const upload = new tus.Upload(file, {
          endpoint: config.tusEndpoint,
          retryDelays: [0, 1000, 3000, 5000, 10000],
          chunkSize: 6 * 1024 * 1024, // 6MB chunks
          headers: {
            authorization: `Bearer ${config.authToken}`,
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
            setUploading((prev) => ({ ...prev, [fieldKey]: false }));
            setUploadStatus(`Upload complet: ${file.name}`);
            resolve(config.publicUrl);
          },
        });

        // Check for previous uploads to resume
        upload.findPreviousUploads().then((previousUploads) => {
          if (previousUploads.length > 0) {
            setUploadStatus("Se reia uploadul anterior...");
            upload.resumeFromPreviousUpload(previousUploads[0]);
          }
          upload.start();
        });
      });
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
    if (activeTab === "distributie" || activeTab === "rezultate") fetchDistributions();
  }, [activeTab, fetchDistributions]);

  // ── Results data ───────────────────────────────────────
  const fetchResults = useCallback(async (segmentId: string) => {
    setResultsLoading(true);
    try {
      const url = segmentId === "general"
        ? "/api/survey/results"
        : `/api/survey/results?distribution_id=${segmentId}`;
      const res = await fetch(url);
      const data = await res.json();
      setResults(data);
    } catch { /* ignore */ }
    setResultsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === "rezultate") fetchResults(resultsSegment);
  }, [activeTab, resultsSegment, fetchResults]);

  // ── Expert evaluations data ──────────────────────────────
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
    if (activeTab === "experti") fetchExpertEvals();
  }, [activeTab, fetchExpertEvals]);

  const addExpertEval = async () => {
    if (!expertForm.stimulus_id || !expertForm.expert_name) return;
    setExpertSaving(true);
    try {
      const res = await fetch("/api/survey/expert-evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expertForm),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddExpert(false);
        setExpertForm({ stimulus_id: "", expert_name: "", expert_role: "", r_score: 5, i_score: 5, f_score: 5, r_justification: "", i_justification: "", f_justification: "", notes: "" });
        fetchExpertEvals();
      }
    } catch { /* ignore */ }
    setExpertSaving(false);
  };

  const deleteExpertEval = async (id: string) => {
    if (!confirm("Stergi aceasta evaluare?")) return;
    await fetch(`/api/survey/expert-evaluations?id=${id}`, { method: "DELETE" });
    fetchExpertEvals();
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

  const getDistLink = (tag: string) => `${baseUrl}/studiu/wizard?tag=${tag}`;

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
    }
    setEditingStimId(null);
    setSaving(false);
  };

  const deleteStimulus = async (stim: Stimulus) => {
    if (!confirm(`Stergi materialul "${stim.name}"?`)) return;
    const res = await fetch(`/api/survey/stimuli?id=${stim.id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setStimuli((prev) => prev.map((s) => (s.id === stim.id ? { ...s, is_active: false } : s)));
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
        <div style={S.logo}>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>R</span>
          <span style={{ color: "#6B7280", fontWeight: 300 }}> IF </span>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>C</span>
        </div>
        <div style={S.headerBadge}>SONDAJ</div>
        <div style={{ flex: 1 }} />
        <button style={S.langBtn} onClick={() => {}}>
          <Globe size={14} />
          <span>RO</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={S.tabsBar}>
        {TABS.map((tab) => {
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
        {activeTab === "sondaj" && (
          <>
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
                              <div style={S.formField}><label style={S.formLabel}>Display Order</label><input style={S.formInput} type="number" value={newStimData.display_order || 0} onChange={(e) => setNewStimData({ ...newStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            <div style={S.formRow3}>
                              <div style={S.formField}><label style={S.formLabel}>Varianta (A/B/C)</label><select style={S.formInput} value={newStimData.variant_label || ""} onChange={(e) => setNewStimData({ ...newStimData, variant_label: e.target.value || null })}><option value="">Neasignat</option>{VARIANT_LABELS.map(v => <option key={v} value={v}>Varianta {v}</option>)}</select></div>
                              <div style={S.formField}><label style={S.formLabel}>Calitate Executie</label><select style={S.formInput} value={newStimData.execution_quality || ""} onChange={(e) => setNewStimData({ ...newStimData, execution_quality: e.target.value || null })}><option value="">Neasignat</option>{EXECUTION_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}</select></div>
                              <div />
                            </div>
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
                            <div style={S.formField}><label style={S.formLabel}>Text Content</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={newStimData.text_content || ""} onChange={(e) => setNewStimData({ ...newStimData, text_content: e.target.value })} placeholder="Daca nu adaugi imagine sau video, textul devine continutul principal." /></div>
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
                              {activeStim.variant_label && <span style={{ ...S.stimIndustry, background: "#dbeafe", color: "#1d4ed8" }}>V{activeStim.variant_label}</span>}
                              {activeStim.execution_quality && <span style={{ ...S.stimIndustry, background: EXECUTION_QUALITIES.find(q => q.value === activeStim.execution_quality)?.color || "#6B7280", color: "#fff" }}>{EXECUTION_QUALITIES.find(q => q.value === activeStim.execution_quality)?.label || activeStim.execution_quality}</span>}
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
                                <div style={S.formField}><label style={S.formLabel}>Display Order</label><input style={S.formInput} type="number" value={editStimData.display_order || 0} onChange={(e) => setEditStimData({ ...editStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                              </div>
                              <div style={S.formRow3}>
                                <div style={S.formField}><label style={S.formLabel}>Varianta (A/B/C)</label><select style={S.formInput} value={editStimData.variant_label || ""} onChange={(e) => setEditStimData({ ...editStimData, variant_label: e.target.value || null })}><option value="">Neasignat</option>{VARIANT_LABELS.map(v => <option key={v} value={v}>Varianta {v}</option>)}</select></div>
                                <div style={S.formField}><label style={S.formLabel}>Calitate Executie</label><select style={S.formInput} value={editStimData.execution_quality || ""} onChange={(e) => setEditStimData({ ...editStimData, execution_quality: e.target.value || null })}><option value="">Neasignat</option>{EXECUTION_QUALITIES.map(q => <option key={q.value} value={q.value}>{q.label}</option>)}</select></div>
                                <div />
                              </div>
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
                              <div style={S.formField}><label style={S.formLabel}>Text Content</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={editStimData.text_content || ""} onChange={(e) => setEditStimData({ ...editStimData, text_content: e.target.value })} placeholder="Daca nu adaugi imagine sau video, textul devine continutul principal." /></div>
                            </div>
                          ) : (
                            <div style={S.matPreview}>
                              {activeStim.description && <div style={S.previewSection}><label style={S.previewLabel}>DESCRIERE</label><p style={S.previewText}>{activeStim.description}</p></div>}
                              {/* Image — show inline */}
                              {activeStim.image_url && (
                                <div style={S.previewSection}>
                                  <label style={S.previewLabel}>IMAGINE</label>
                                  <img src={activeStim.image_url} alt={activeStim.name} style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, display: "block" }} />
                                </div>
                              )}
                              {/* Video — show player */}
                              {activeStim.video_url && (
                                <div style={S.previewSection}>
                                  <label style={S.previewLabel}>VIDEO</label>
                                  <video src={activeStim.video_url} controls style={{ maxWidth: "100%", maxHeight: 400, borderRadius: 8, display: "block" }} />
                                </div>
                              )}
                              {/* Text as primary content when no image/video */}
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
                              {/* PDF + Site links */}
                              <div style={S.previewGrid}>
                                {activeStim.pdf_url && <div style={S.previewItem}><label style={S.previewLabel}>PDF</label><a href={activeStim.pdf_url} target="_blank" rel="noreferrer" style={{ ...S.previewLink, display: "flex", alignItems: "center", gap: 6 }}><FileText size={16} /> Deschide PDF</a></div>}
                                {activeStim.site_url && <div style={S.previewItem}><label style={S.previewLabel}>SITE</label><a href={activeStim.site_url} target="_blank" rel="noreferrer" style={{ ...S.previewLink, display: "flex", alignItems: "center", gap: 6 }}><Globe size={16} /> {activeStim.site_url}</a></div>}
                              </div>
                              {!activeStim.description && !activeStim.image_url && !activeStim.video_url && !activeStim.text_content && !activeStim.pdf_url && !activeStim.site_url && (
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
          </>
        )}

        {activeTab === "rezultate" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0, marginBottom: 4 }}>Rezultate Sondaj</h2>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
              Scoruri agregate R, I, F, C pe fiecare material — formula R + I &times; F = C.
            </p>

            {/* Segment sub-tabs */}
            <div style={{
              display: "flex",
              gap: 0,
              borderBottom: "2px solid #e5e7eb",
              marginBottom: 20,
              overflowX: "auto" as const,
            }}>
              <button
                style={{
                  ...S.tab,
                  fontSize: 12,
                  padding: "10px 16px",
                  ...(resultsSegment === "general" ? S.tabActive : {}),
                }}
                onClick={() => setResultsSegment("general")}
              >
                GENERAL
              </button>
              {distributions.map((d) => (
                <button
                  key={d.id}
                  style={{
                    ...S.tab,
                    fontSize: 12,
                    padding: "10px 16px",
                    whiteSpace: "nowrap" as const,
                    ...(resultsSegment === d.id ? S.tabActive : {}),
                  }}
                  onClick={() => setResultsSegment(d.id)}
                >
                  {d.name}
                </button>
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
                {/* Stats cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "RESPONDENTI", value: results.totalRespondents, color: "#374151" },
                    { label: "COMPLETARI", value: results.completedRespondents, color: "#059669" },
                    { label: "RATA", value: `${results.completionRate}%`, color: "#DC2626" },
                    { label: "RASPUNSURI", value: results.totalResponses, color: "#2563EB" },
                  ].map((stat) => (
                    <div key={stat.label} style={S.configItem}>
                      <span style={S.configLabel}>{stat.label}</span>
                      <span style={{ fontSize: 24, fontWeight: 700, color: stat.color, fontFamily: "JetBrains Mono, monospace" }}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Results table */}
                {results.stimuliResults.length === 0 ? (
                  <div style={S.placeholderTab}>
                    <BarChart3 size={48} style={{ color: "#d1d5db" }} />
                    <p style={{ color: "#6B7280", fontSize: 14 }}>
                      {resultsSegment === "general"
                        ? "Niciun raspuns inca. Distribue sondajul pentru a colecta date."
                        : "Niciun raspuns pentru acest segment."}
                    </p>
                  </div>
                ) : (
                  <div style={{ ...S.configCard, padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                      <thead>
                        <tr style={{ background: "#f9fafb" }}>
                          <th style={{ ...thStyle, textAlign: "left" as const, minWidth: 200 }}>MATERIAL</th>
                          <th style={thStyle}>TIP</th>
                          <th style={thStyle}>N</th>
                          <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                          <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                          <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                          <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>C</th>
                          <th style={thStyle}>SD</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.stimuliResults.map((s) => (
                          <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                            <td style={{ ...tdStyle, fontWeight: 600, color: "#111827" }}>{s.name}</td>
                            <td style={tdStyle}>
                              <span style={{
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: 0.5,
                                padding: "3px 8px",
                                borderRadius: 4,
                                background: "#f3f4f6",
                                color: "#6B7280",
                              }}>{s.type}</span>
                            </td>
                            <td style={tdStyle}>{s.response_count}</td>
                            <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{s.avg_r}</td>
                            <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{s.avg_i}</td>
                            <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{s.avg_f}</td>
                            <td style={{ ...tdStyle, color: "#111827", fontWeight: 800, fontSize: 15 }}>{s.avg_c}</td>
                            <td style={{ ...tdStyle, color: "#9CA3AF" }}>{s.sd_c}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

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
                  {baseUrl}/studiu/wizard
                </code>
                <button
                  style={{ ...S.galleryEditBtn, gap: 6 }}
                  onClick={() => copyToClipboard(`${baseUrl}/studiu/wizard`, "general")}
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

                  return (
                    <div key={dist.id} style={{ ...S.configCard, position: "relative" as const }}>
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
                        background: "#DC2626",
                        fontFamily: "JetBrains Mono, monospace",
                      }}>
                        {idx + 1}
                      </div>

                      {/* Header row */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: 4 }}>
                        <div>
                          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: 0 }}>{dist.name}</h3>
                          {dist.description && (
                            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{dist.description}</p>
                          )}
                        </div>
                        <button
                          style={{ ...S.iconBtnDanger }}
                          title="Sterge distributia"
                          onClick={() => deleteDistribution(dist.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Link row */}
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

                      {/* QR code (collapsible) */}
                      {showQr === dist.id && (
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

        {/* ═══ PANEL EXPERTI (Layer 1) ═══ */}
        {activeTab === "experti" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>Panel Experti (Stratul 1)</h2>
                <p style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
                  Evaluari R, I, F de catre experti in marketing. Fiecare expert scoreaza stimulii cu justificari.
                </p>
              </div>
              <button style={S.addCatBtn} onClick={() => setShowAddExpert(true)}>
                <Plus size={16} />
                ADAUGA EVALUARE
              </button>
            </div>

            {/* Add expert form */}
            {showAddExpert && (
              <div style={{ ...S.configCard, borderColor: "#059669", borderWidth: 2, marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <UserCheck size={16} style={{ color: "#059669" }} />
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#059669" }}>EVALUARE NOUA EXPERT</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div><label style={S.configLabel}>MATERIAL *</label>
                    <select style={{ ...S.catEditInput, width: "100%" }} value={expertForm.stimulus_id} onChange={(e) => setExpertForm({ ...expertForm, stimulus_id: e.target.value })}>
                      <option value="">Selecteaza material...</option>
                      {stimuli.filter(s => s.is_active).map(s => <option key={s.id} value={s.id}>{s.name} ({s.type})</option>)}
                    </select>
                  </div>
                  <div><label style={S.configLabel}>EXPERT *</label><input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.expert_name} onChange={(e) => setExpertForm({ ...expertForm, expert_name: e.target.value })} placeholder="Nume expert" /></div>
                  <div><label style={S.configLabel}>ROL</label><input style={{ ...S.catEditInput, width: "100%" }} value={expertForm.expert_role} onChange={(e) => setExpertForm({ ...expertForm, expert_role: e.target.value })} placeholder="Ex: Marketing Director" /></div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ ...S.configLabel, color: "#DC2626" }}>R (RELEVANTA) *</label>
                    <input type="number" min={1} max={10} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#DC2626" }} value={expertForm.r_score} onChange={(e) => setExpertForm({ ...expertForm, r_score: parseInt(e.target.value) || 1 })} />
                    <textarea style={{ ...S.catEditInput, width: "100%", marginTop: 4, fontSize: 12 }} value={expertForm.r_justification} onChange={(e) => setExpertForm({ ...expertForm, r_justification: e.target.value })} placeholder="Justificare R..." rows={2} />
                  </div>
                  <div>
                    <label style={{ ...S.configLabel, color: "#D97706" }}>I (INTERES) *</label>
                    <input type="number" min={1} max={10} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#D97706" }} value={expertForm.i_score} onChange={(e) => setExpertForm({ ...expertForm, i_score: parseInt(e.target.value) || 1 })} />
                    <textarea style={{ ...S.catEditInput, width: "100%", marginTop: 4, fontSize: 12 }} value={expertForm.i_justification} onChange={(e) => setExpertForm({ ...expertForm, i_justification: e.target.value })} placeholder="Justificare I..." rows={2} />
                  </div>
                  <div>
                    <label style={{ ...S.configLabel, color: "#7C3AED" }}>F (FORMA) *</label>
                    <input type="number" min={1} max={10} style={{ ...S.catEditInput, width: "100%", fontWeight: 700, color: "#7C3AED" }} value={expertForm.f_score} onChange={(e) => setExpertForm({ ...expertForm, f_score: parseInt(e.target.value) || 1 })} />
                    <textarea style={{ ...S.catEditInput, width: "100%", marginTop: 4, fontSize: 12 }} value={expertForm.f_justification} onChange={(e) => setExpertForm({ ...expertForm, f_justification: e.target.value })} placeholder="Justificare F..." rows={2} />
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}><label style={S.configLabel}>NOTE</label><textarea style={{ ...S.catEditInput, width: "100%" }} value={expertForm.notes} onChange={(e) => setExpertForm({ ...expertForm, notes: e.target.value })} placeholder="Note suplimentare..." rows={2} /></div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...S.addCatBtn, background: "#059669", opacity: expertSaving ? 0.6 : 1 }} onClick={addExpertEval} disabled={expertSaving}>
                    {expertSaving ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Check size={14} />}
                    {expertSaving ? "Se salveaza..." : "Salveaza"}
                  </button>
                  <button style={S.galleryEditBtn} onClick={() => setShowAddExpert(false)}><X size={14} /> Anuleaza</button>
                </div>
              </div>
            )}

            {/* Expert evaluations table */}
            {expertLoading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#9CA3AF" }}><Loader2 size={24} style={{ animation: "spin 1s linear infinite" }} /></div>
            ) : expertEvals.length === 0 ? (
              <div style={S.placeholderTab}>
                <UserCheck size={48} style={{ color: "#d1d5db" }} />
                <h3 style={{ fontSize: 18, color: "#374151", marginTop: 16 }}>Nicio evaluare de expert</h3>
                <p style={{ color: "#6B7280", fontSize: 14 }}>Apasa &quot;Adauga Evaluare&quot; pentru a inregistra scorurile expertilor pe fiecare material.</p>
              </div>
            ) : (
              <div style={{ ...S.configCard, padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f9fafb" }}>
                      <th style={{ ...thStyle, textAlign: "left", minWidth: 160 }}>MATERIAL</th>
                      <th style={{ ...thStyle, textAlign: "left", minWidth: 120 }}>EXPERT</th>
                      <th style={thStyle}>ROL</th>
                      <th style={{ ...thStyle, color: "#DC2626" }}>R</th>
                      <th style={{ ...thStyle, color: "#D97706" }}>I</th>
                      <th style={{ ...thStyle, color: "#7C3AED" }}>F</th>
                      <th style={{ ...thStyle, color: "#111827", fontWeight: 800 }}>C</th>
                      <th style={thStyle}>DATA</th>
                      <th style={thStyle}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {expertEvals.map((ev) => {
                      const stim = stimuli.find(s => s.id === ev.stimulus_id);
                      return (
                        <tr key={ev.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                          <td style={{ ...tdStyle, textAlign: "left", fontWeight: 600, color: "#111827" }}>{stim?.name || "?"}</td>
                          <td style={{ ...tdStyle, textAlign: "left" }}>{ev.expert_name}</td>
                          <td style={tdStyle}><span style={{ fontSize: 11, color: "#6B7280" }}>{ev.expert_role || "—"}</span></td>
                          <td style={{ ...tdStyle, color: "#DC2626", fontWeight: 600 }}>{ev.r_score}</td>
                          <td style={{ ...tdStyle, color: "#D97706", fontWeight: 600 }}>{ev.i_score}</td>
                          <td style={{ ...tdStyle, color: "#7C3AED", fontWeight: 600 }}>{ev.f_score}</td>
                          <td style={{ ...tdStyle, color: "#111827", fontWeight: 800 }}>{ev.c_computed}</td>
                          <td style={{ ...tdStyle, fontSize: 11, color: "#9CA3AF" }}>{new Date(ev.evaluated_at).toLocaleDateString("ro-RO")}</td>
                          <td style={tdStyle}><button style={S.iconBtnDanger} onClick={() => deleteExpertEval(ev.id)}><Trash2 size={14} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary by stimulus */}
            {expertEvals.length > 0 && (
              <div style={{ ...S.configCard, marginTop: 20 }}>
                <div style={S.configHeader}>
                  <Settings size={16} style={{ color: "#6B7280" }} />
                  <span style={S.configTitle}>SUMAR PER MATERIAL</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
                  {stimuli.filter(s => s.is_active).map(stim => {
                    const evals = expertEvals.filter(e => e.stimulus_id === stim.id);
                    if (evals.length === 0) return null;
                    const avgR = (evals.reduce((s, e) => s + e.r_score, 0) / evals.length).toFixed(1);
                    const avgI = (evals.reduce((s, e) => s + e.i_score, 0) / evals.length).toFixed(1);
                    const avgF = (evals.reduce((s, e) => s + e.f_score, 0) / evals.length).toFixed(1);
                    const avgC = (evals.reduce((s, e) => s + e.c_computed, 0) / evals.length).toFixed(1);
                    return (
                      <div key={stim.id} style={S.configItem}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#111827", display: "block", marginBottom: 6 }}>{stim.name}</span>
                        <span style={{ fontSize: 10, color: "#9CA3AF" }}>{evals.length} evaluari</span>
                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#DC2626" }}>{avgR}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#D97706" }}>{avgI}</span>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#7C3AED" }}>{avgF}</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>C={avgC}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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
          <div style={{ width: "100%", height: "80vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <iframe
              src="/studiu/wizard"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Preview Sondaj"
            />
          </div>
        )}
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
