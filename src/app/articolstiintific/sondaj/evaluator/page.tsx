"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   RIFC — Predictive Evaluator Page (public, token-based)
   3 Screens: Identificare → Scoring RIFC → KPI Input
   Autosave + resume where left off
   ═══════════════════════════════════════════════════════════ */

interface CampaignInfo {
  id: string;
  name: string;
  channel: string;
  campaign_type: string;
  creative_image_url: string | null;
  creative_link: string | null;
  period_start: string | null;
  period_end: string | null;
  is_active: boolean;
}

interface CompanyInfo {
  name: string;
  industry: string;
}

interface EvaluationData {
  id: string;
  evaluator_name: string | null;
  evaluator_email: string | null;
  evaluator_experience: string | null;
  score_r: number | null;
  score_i: number | null;
  score_f: number | null;
  score_cta: number | null;
  score_c: number | null;
  comment_r: string | null;
  comment_i: string | null;
  comment_f: string | null;
  comment_cta: string | null;
  current_screen: number;
  completed_at: string | null;
}

interface KpiEntry {
  kpi_name: string;
  kpi_value: string;
  kpi_unit: string;
  data_source: string;
  notes: string;
}

const PRED_KPI_PRESETS: Record<string, { name: string; unit: string }[]> = {
  "Search": [{ name: "CTR", unit: "%" }, { name: "CPC", unit: "EUR" }, { name: "Conversii", unit: "#" }, { name: "Rata Conversie", unit: "%" }, { name: "Cost/Conversie", unit: "EUR" }, { name: "Impression Share", unit: "%" }],
  "Display": [{ name: "CTR", unit: "%" }, { name: "CPC", unit: "EUR" }, { name: "Conversii", unit: "#" }, { name: "View-Through Conv", unit: "#" }, { name: "CPM", unit: "EUR" }, { name: "Reach", unit: "#" }],
  "YouTube / Pre-roll": [{ name: "View Rate", unit: "%" }, { name: "CPV", unit: "EUR" }, { name: "Watch Time", unit: "sec" }, { name: "Earned Actions", unit: "#" }, { name: "Reach", unit: "#" }],
  "Awareness": [{ name: "Reach", unit: "#" }, { name: "Impressions", unit: "#" }, { name: "CPM", unit: "EUR" }, { name: "Frecventa", unit: "#" }, { name: "ThruPlay Rate", unit: "%" }],
  "Messages": [{ name: "Cost/Mesaj", unit: "EUR" }, { name: "Rata Raspuns", unit: "%" }, { name: "Conversii", unit: "#" }, { name: "CTR Link", unit: "%" }],
  "Traffic (Site)": [{ name: "CTR", unit: "%" }, { name: "CPC", unit: "EUR" }, { name: "Landing Page Views", unit: "#" }, { name: "Bounce Rate", unit: "%" }, { name: "Timp pe Pagina", unit: "sec" }],
  "Boost": [{ name: "Reach", unit: "#" }, { name: "Engagement Rate", unit: "%" }, { name: "Cost/Engagement", unit: "EUR" }, { name: "Saves", unit: "#" }, { name: "Profile Visits", unit: "#" }],
  "Promotional": [{ name: "Delivery Rate", unit: "%" }, { name: "CTR", unit: "%" }, { name: "Conversii", unit: "#" }, { name: "Opt-out Rate", unit: "%" }, { name: "Cost/SMS", unit: "EUR" }],
  "Newsletter / Promotional": [{ name: "Open Rate", unit: "%" }, { name: "CTR", unit: "%" }, { name: "Conversii", unit: "#" }, { name: "Unsubscribe Rate", unit: "%" }, { name: "CTOR", unit: "%" }],
  "Landing Page (GA4)": [{ name: "Bounce Rate", unit: "%" }, { name: "Avg Session Duration", unit: "sec" }, { name: "Conversii", unit: "#" }, { name: "Rata Conversie", unit: "%" }, { name: "Pages/Session", unit: "#" }],
};

const EXPERIENCE_OPTIONS = [
  "Sub 1 an", "1-3 ani", "3-5 ani", "5-10 ani", "10-15 ani", "15+ ani"
];

const DATA_SOURCES = [
  "Google Ads Dashboard", "Meta Ads Manager", "Google Analytics 4", "CRM intern", "Raport client", "Altele"
];

function EvaluatorPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [evaluatorNumber, setEvaluatorNumber] = useState<number>(0);
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [screen, setScreen] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Screen 1: Identification
  const [evalName, setEvalName] = useState("");
  const [evalEmail, setEvalEmail] = useState("");
  const [evalExperience, setEvalExperience] = useState("");

  // Screen 2: Scoring
  const [scoreR, setScoreR] = useState<number | null>(null);
  const [scoreI, setScoreI] = useState<number | null>(null);
  const [scoreF, setScoreF] = useState<number | null>(null);
  const [scoreCta, setScoreCta] = useState<number | null>(null);
  const [commentR, setCommentR] = useState("");
  const [commentI, setCommentI] = useState("");
  const [commentF, setCommentF] = useState("");
  const [commentCta, setCommentCta] = useState("");
  const [scoringStartTime, setScoringStartTime] = useState<number>(0);

  // Screen 3: KPIs
  const [kpis, setKpis] = useState<KpiEntry[]>([]);
  const [kpiStartTime, setKpiStartTime] = useState<number>(0);

  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const DRAFT_KEY = token ? `rifc_predictive_draft_${token}` : null;

  // C = R + I*F
  const scoreC = scoreR != null && scoreI != null && scoreF != null ? scoreR + scoreI * scoreF : null;
  const gateTriggered = scoreR != null && scoreR < 3;
  const cZone = scoreC != null
    ? scoreC <= 12 ? "Critical" : scoreC <= 30 ? "Noise" : scoreC <= 60 ? "Medium" : "Supreme"
    : null;

  // localStorage draft
  const saveDraft = useCallback(() => {
    if (!DRAFT_KEY) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        evalName, evalEmail, evalExperience,
        scoreR, scoreI, scoreF, scoreCta,
        commentR, commentI, commentF, commentCta,
        kpis, screen,
      }));
    } catch { /* quota */ }
  }, [DRAFT_KEY, evalName, evalEmail, evalExperience, scoreR, scoreI, scoreF, scoreCta, commentR, commentI, commentF, commentCta, kpis, screen]);

  const loadDraft = useCallback(() => {
    if (!DRAFT_KEY) return null;
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, [DRAFT_KEY]);

  // Fetch data
  useEffect(() => {
    if (!token) { setError("Token lipsa"); setLoading(false); return; }
    (async () => {
      try {
        const res = await fetch(`/api/survey/predictive/by-token?token=${encodeURIComponent(token)}`);
        const data = await res.json();
        if (!data.success) { setError(data.error || "Token invalid"); setLoading(false); return; }

        setCampaign(data.campaign);
        setCompany(data.company);
        setEvaluatorNumber(data.evaluator_number);

        if (data.evaluation) {
          setEvaluation(data.evaluation);
          // Restore state from server
          if (data.evaluation.evaluator_name) setEvalName(data.evaluation.evaluator_name);
          if (data.evaluation.evaluator_email) setEvalEmail(data.evaluation.evaluator_email);
          if (data.evaluation.evaluator_experience) setEvalExperience(data.evaluation.evaluator_experience);
          if (data.evaluation.score_r != null) setScoreR(data.evaluation.score_r);
          if (data.evaluation.score_i != null) setScoreI(data.evaluation.score_i);
          if (data.evaluation.score_f != null) setScoreF(data.evaluation.score_f);
          if (data.evaluation.score_cta != null) setScoreCta(data.evaluation.score_cta);
          if (data.evaluation.comment_r) setCommentR(data.evaluation.comment_r);
          if (data.evaluation.comment_i) setCommentI(data.evaluation.comment_i);
          if (data.evaluation.comment_f) setCommentF(data.evaluation.comment_f);
          if (data.evaluation.comment_cta) setCommentCta(data.evaluation.comment_cta);
          if (data.evaluation.completed_at) setCompleted(true);

          // Resume at saved screen
          setScreen(data.evaluation.current_screen || 1);
        }

        // Restore KPIs
        if (data.kpis && data.kpis.length > 0) {
          setKpis(data.kpis.map((k: { kpi_name: string; kpi_value: number; kpi_unit: string; data_source?: string; notes?: string }) => ({
            kpi_name: k.kpi_name,
            kpi_value: String(k.kpi_value),
            kpi_unit: k.kpi_unit,
            data_source: k.data_source || "",
            notes: k.notes || "",
          })));
        }

        // Try to recover from local draft if server has less data
        const draft = loadDraft();
        if (draft && !data.evaluation?.completed_at) {
          if (draft.evalName && !data.evaluation?.evaluator_name) setEvalName(draft.evalName);
          if (draft.evalEmail && !data.evaluation?.evaluator_email) setEvalEmail(draft.evalEmail);
          if (draft.evalExperience && !data.evaluation?.evaluator_experience) setEvalExperience(draft.evalExperience);
          if (draft.scoreR != null && data.evaluation?.score_r == null) setScoreR(draft.scoreR);
          if (draft.scoreI != null && data.evaluation?.score_i == null) setScoreI(draft.scoreI);
          if (draft.scoreF != null && data.evaluation?.score_f == null) setScoreF(draft.scoreF);
          if (draft.scoreCta != null && data.evaluation?.score_cta == null) setScoreCta(draft.scoreCta);
          if (draft.commentR && !data.evaluation?.comment_r) setCommentR(draft.commentR);
          if (draft.commentI && !data.evaluation?.comment_i) setCommentI(draft.commentI);
          if (draft.commentF && !data.evaluation?.comment_f) setCommentF(draft.commentF);
          if (draft.commentCta && !data.evaluation?.comment_cta) setCommentCta(draft.commentCta);
          if (draft.kpis?.length > 0 && (!data.kpis || data.kpis.length === 0)) setKpis(draft.kpis);
          if (draft.screen && draft.screen > (data.evaluation?.current_screen || 1)) setScreen(draft.screen);
        }
      } catch { setError("Eroare de retea"); }
      setLoading(false);
    })();
  }, [token, loadDraft]);

  // Autosave draft to localStorage on any change
  useEffect(() => { saveDraft(); }, [saveDraft]);

  // Debounced autosave to server (3s)
  useEffect(() => {
    if (!token || completed || screen < 2) return;
    if (scoreR == null && scoreI == null && scoreF == null && scoreCta == null) return;

    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaveStatus("saving");
      try {
        const payload: Record<string, unknown> = {
          token,
          evaluator_name: evalName || null,
          evaluator_email: evalEmail || null,
          evaluator_experience: evalExperience || null,
          score_r: scoreR, score_i: scoreI, score_f: scoreF, score_cta: scoreCta,
          comment_r: commentR || null, comment_i: commentI || null,
          comment_f: commentF || null, comment_cta: commentCta || null,
          current_screen: screen,
        };
        if (scoringStartTime > 0) payload.time_spent_scoring_sec = Math.round((Date.now() - scoringStartTime) / 1000);

        const res = await fetch("/api/survey/predictive/by-token", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setAutoSaveStatus("saved");
          if (data.evaluation) setEvaluation(data.evaluation);
        } else {
          setAutoSaveStatus("error");
        }
      } catch {
        setAutoSaveStatus("error");
      }
    }, 3000);

    return () => { if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };
  }, [token, completed, screen, evalName, evalEmail, evalExperience, scoreR, scoreI, scoreF, scoreCta, commentR, commentI, commentF, commentCta, scoringStartTime]);

  // beforeunload warning
  useEffect(() => {
    if (completed) return;
    const handler = (e: BeforeUnloadEvent) => {
      if (scoreR != null || scoreI != null || evalName) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [completed, scoreR, scoreI, evalName]);

  // Screen 1 → 2 transition
  const startScoring = async () => {
    if (!evalName.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/survey/predictive/by-token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          evaluator_name: evalName, evaluator_email: evalEmail || null,
          evaluator_experience: evalExperience || null,
          current_screen: 2,
        }),
      });
      setScreen(2);
      setScoringStartTime(Date.now());
    } catch { /* ignore */ }
    setSaving(false);
  };

  // Screen 2 → 3 transition
  const goToKpis = async () => {
    if (scoreR == null || scoreI == null || scoreF == null || scoreCta == null) return;
    if (commentR.length < 10 || commentI.length < 10 || commentF.length < 10 || commentCta.length < 10) return;
    setSaving(true);
    try {
      await fetch("/api/survey/predictive/by-token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          score_r: scoreR, score_i: scoreI, score_f: scoreF, score_cta: scoreCta,
          comment_r: commentR, comment_i: commentI, comment_f: commentF, comment_cta: commentCta,
          current_screen: 3,
          time_spent_scoring_sec: scoringStartTime > 0 ? Math.round((Date.now() - scoringStartTime) / 1000) : null,
        }),
      });
      setScreen(3);
      setKpiStartTime(Date.now());
      // Initialize KPI fields from presets if empty
      if (kpis.length === 0 && campaign) {
        const presets = PRED_KPI_PRESETS[campaign.campaign_type] || [];
        setKpis(presets.map(p => ({ kpi_name: p.name, kpi_value: "", kpi_unit: p.unit, data_source: "", notes: "" })));
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  // Screen 3 → Complete
  const finalize = async () => {
    const filledKpis = kpis.filter(k => k.kpi_value.trim() !== "");
    if (filledKpis.length === 0) return;
    setSaving(true);
    try {
      await fetch("/api/survey/predictive/by-token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          completed_at: new Date().toISOString(),
          time_spent_kpi_sec: kpiStartTime > 0 ? Math.round((Date.now() - kpiStartTime) / 1000) : null,
          kpis: filledKpis.map(k => ({
            kpi_name: k.kpi_name,
            kpi_value: Number(k.kpi_value),
            kpi_unit: k.kpi_unit,
            data_source: k.data_source || null,
            notes: k.notes || null,
          })),
        }),
      });
      setCompleted(true);
      // Clear local draft
      if (DRAFT_KEY) localStorage.removeItem(DRAFT_KEY);
    } catch { /* ignore */ }
    setSaving(false);
  };

  // Score button renderer
  const ScoreButtons = ({ value, onChange, color }: { value: number | null; onChange: (v: number) => void; color: string }) => (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            width: 36, height: 36, borderRadius: 8, border: value === n ? "none" : "1px solid #d1d5db",
            background: value === n ? color : "#fff", color: value === n ? "#fff" : "#374151",
            fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
          }}
        >{n}</button>
      ))}
    </div>
  );

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", fontFamily: "Outfit, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#111827" }}>Se incarca...</div>
        <div style={{ fontSize: 14, color: "#6B7280", marginTop: 8 }}>Verificare token evaluator</div>
      </div>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", fontFamily: "Outfit, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>&#9888;</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#DC2626", marginBottom: 8 }}>Eroare</div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>{error}</div>
      </div>
    </div>
  );

  if (completed) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0fdf4", fontFamily: "Outfit, system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: 500, padding: 40 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#166534", marginBottom: 8 }}>Evaluare finalizata!</h1>
        <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.6 }}>
          Multumim, {evalName || "evaluator"}! Scorurile si datele KPI au fost salvate cu succes.
          Aceasta pagina poate fi inchisa.
        </p>
        <div style={{ marginTop: 20, padding: "12px 16px", background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Campanie evaluata:</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{campaign?.name}</div>
          <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{campaign?.channel} / {campaign?.campaign_type}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa", fontFamily: "Outfit, system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: 2, fontFamily: "JetBrains Mono, monospace" }}>RIFC</span>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 5, background: "#0891B2", color: "#fff", letterSpacing: 1 }}>VALIDARE PREDICTIVA</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#6B7280" }}>Evaluator {evaluatorNumber}</span>
          {autoSaveStatus === "saving" && <span style={{ fontSize: 10, color: "#D97706", fontWeight: 600 }}>Se salveaza...</span>}
          {autoSaveStatus === "saved" && <span style={{ fontSize: 10, color: "#059669", fontWeight: 600 }}>Salvat</span>}
          {autoSaveStatus === "error" && <span style={{ fontSize: 10, color: "#DC2626", fontWeight: 600 }}>Eroare salvare</span>}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "8px 24px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[
            { n: 1, label: "Identificare" },
            { n: 2, label: "Scoring RIFC" },
            { n: 3, label: "Date KPI" },
          ].map(step => (
            <div key={step.n} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                background: screen >= step.n ? "#0891B2" : "#e5e7eb", color: screen >= step.n ? "#fff" : "#9CA3AF",
                fontSize: 11, fontWeight: 700,
              }}>{step.n}</div>
              <span style={{ fontSize: 12, fontWeight: screen === step.n ? 700 : 500, color: screen === step.n ? "#111827" : "#9CA3AF" }}>{step.label}</span>
              {step.n < 3 && <div style={{ flex: 1, height: 2, background: screen > step.n ? "#0891B2" : "#e5e7eb" }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
        {/* Campaign info */}
        <div style={{ padding: "14px 18px", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", marginBottom: 4 }}>CAMPANIE DE EVALUAT</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>{campaign?.name}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#dbeafe", color: "#1e40af", fontWeight: 700 }}>{campaign?.channel}</span>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: "#f3e8ff", color: "#7c3aed", fontWeight: 700 }}>{campaign?.campaign_type}</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#6B7280" }}>{company?.name}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{company?.industry}</div>
            </div>
          </div>
          {campaign?.creative_image_url && (
            <div style={{ marginTop: 12 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={campaign.creative_image_url} alt="Creative" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8, border: "1px solid #e5e7eb" }} />
            </div>
          )}
          {campaign?.creative_link && (
            <a href={campaign.creative_link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 8, fontSize: 12, color: "#2563EB", textDecoration: "underline" }}>
              Vizualizeaza creativa
            </a>
          )}
        </div>

        {/* ═══ SCREEN 1: Identificare ═══ */}
        {screen === 1 && (
          <div style={{ padding: 20, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 0, marginBottom: 16 }}>Identificare evaluator</h2>
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label style={labelStyle}>Nume complet *</label>
                <input value={evalName} onChange={e => setEvalName(e.target.value)} placeholder="Ex: Ion Popescu" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email (optional)</label>
                <input value={evalEmail} onChange={e => setEvalEmail(e.target.value)} placeholder="email@exemplu.ro" type="email" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Experienta in marketing</label>
                <select value={evalExperience} onChange={e => setEvalExperience(e.target.value)} style={inputStyle}>
                  <option value="">Selecteaza...</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <button
                onClick={startScoring}
                disabled={!evalName.trim() || saving}
                style={{
                  marginTop: 8, padding: "12px 24px", borderRadius: 8, border: "none",
                  background: evalName.trim() ? "#0891B2" : "#d1d5db", color: "#fff",
                  fontSize: 14, fontWeight: 700, cursor: evalName.trim() ? "pointer" : "not-allowed",
                }}
              >
                {saving ? "Se salveaza..." : "Incepe evaluarea"}
              </button>
            </div>
          </div>
        )}

        {/* ═══ SCREEN 2: Scoring RIFC ═══ */}
        {screen === 2 && (
          <div>
            {/* R - Relevanta */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ ...dimBadge, background: "#DC2626" }}>R</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Relevanta</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Cat de relevant este mesajul pentru publicul-tinta?</p>
              <ScoreButtons value={scoreR} onChange={setScoreR} color="#DC2626" />
              <textarea value={commentR} onChange={e => setCommentR(e.target.value)} placeholder="Comentariu R (min 10 caractere)..." style={{ ...inputStyle, marginTop: 10, minHeight: 60 }} />
              {commentR.length > 0 && commentR.length < 10 && <span style={{ fontSize: 10, color: "#DC2626" }}>Minim 10 caractere ({commentR.length}/10)</span>}
            </div>

            {/* I - Interes */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ ...dimBadge, background: "#D97706" }}>I</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Interes</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Cat de mult capteaza atentia publicului-tinta?</p>
              <ScoreButtons value={scoreI} onChange={setScoreI} color="#D97706" />
              <textarea value={commentI} onChange={e => setCommentI(e.target.value)} placeholder="Comentariu I (min 10 caractere)..." style={{ ...inputStyle, marginTop: 10, minHeight: 60 }} />
              {commentI.length > 0 && commentI.length < 10 && <span style={{ fontSize: 10, color: "#DC2626" }}>Minim 10 caractere ({commentI.length}/10)</span>}
            </div>

            {/* F - Forma */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ ...dimBadge, background: "#7C3AED" }}>F</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Forma</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Cat de buna este executia vizuala si creativa?</p>
              <ScoreButtons value={scoreF} onChange={setScoreF} color="#7C3AED" />
              <textarea value={commentF} onChange={e => setCommentF(e.target.value)} placeholder="Comentariu F (min 10 caractere)..." style={{ ...inputStyle, marginTop: 10, minHeight: 60 }} />
              {commentF.length > 0 && commentF.length < 10 && <span style={{ fontSize: 10, color: "#DC2626" }}>Minim 10 caractere ({commentF.length}/10)</span>}
            </div>

            {/* CTA */}
            <div style={sectionCard}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ ...dimBadge, background: "#059669" }}>CTA</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Call-to-Action</span>
              </div>
              <p style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>Cat de eficient este CTA-ul pentru publicul-tinta?</p>
              <ScoreButtons value={scoreCta} onChange={setScoreCta} color="#059669" />
              <textarea value={commentCta} onChange={e => setCommentCta(e.target.value)} placeholder="Comentariu CTA (min 10 caractere)..." style={{ ...inputStyle, marginTop: 10, minHeight: 60 }} />
              {commentCta.length > 0 && commentCta.length < 10 && <span style={{ fontSize: 10, color: "#DC2626" }}>Minim 10 caractere ({commentCta.length}/10)</span>}
            </div>

            {/* C computed + Gate warning */}
            <div style={{ padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginTop: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#6B7280" }}>C = R + I x F</span>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#0891B2", marginTop: 4 }}>{scoreC != null ? scoreC : "—"}</div>
                </div>
                {cZone && (
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 6,
                    background: cZone === "Critical" ? "#fee2e2" : cZone === "Noise" ? "#fef3c7" : cZone === "Medium" ? "#dbeafe" : "#dcfce7",
                    color: cZone === "Critical" ? "#991b1b" : cZone === "Noise" ? "#92400e" : cZone === "Medium" ? "#1e40af" : "#166534",
                  }}>Zona: {cZone}</span>
                )}
              </div>
              {gateTriggered && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#fee2e2", borderRadius: 8, border: "1px solid #fca5a5" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#991b1b" }}>
                    GATE TRIGGERED: R &lt; 3 — Materialul nu are relevanta suficienta.
                  </span>
                </div>
              )}
            </div>

            {/* Next button */}
            <button
              onClick={goToKpis}
              disabled={scoreR == null || scoreI == null || scoreF == null || scoreCta == null || commentR.length < 10 || commentI.length < 10 || commentF.length < 10 || commentCta.length < 10 || saving}
              style={{
                marginTop: 16, width: "100%", padding: "14px 24px", borderRadius: 8, border: "none",
                background: (scoreR != null && scoreI != null && scoreF != null && scoreCta != null && commentR.length >= 10 && commentI.length >= 10 && commentF.length >= 10 && commentCta.length >= 10) ? "#0891B2" : "#d1d5db",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              {saving ? "Se salveaza..." : "Salveaza si continua la KPI"}
            </button>
          </div>
        )}

        {/* ═══ SCREEN 3: KPI Input ═══ */}
        {screen === 3 && !completed && (
          <div>
            <div style={{ padding: 20, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginTop: 0, marginBottom: 4 }}>Date KPI reale</h2>
              <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
                Introduceti datele KPI reale din campania publicitara. Minim 1 KPI este obligatoriu.
              </p>

              {kpis.map((kpi, idx) => (
                <div key={idx} style={{ padding: 12, marginBottom: 8, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 80px", gap: 8, marginBottom: 6 }}>
                    <div>
                      <label style={{ ...labelStyle, fontSize: 10 }}>{kpi.kpi_name}</label>
                    </div>
                    <div>
                      <input
                        type="number" step="any" placeholder="Valoare"
                        value={kpi.kpi_value}
                        onChange={e => setKpis(prev => prev.map((k, i) => i === idx ? { ...k, kpi_value: e.target.value } : k))}
                        style={{ ...inputStyle, padding: "6px 8px", fontSize: 13 }}
                      />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{kpi.kpi_unit}</span>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <select
                      value={kpi.data_source}
                      onChange={e => setKpis(prev => prev.map((k, i) => i === idx ? { ...k, data_source: e.target.value } : k))}
                      style={{ ...inputStyle, padding: "5px 8px", fontSize: 11 }}
                    >
                      <option value="">Sursa date...</option>
                      {DATA_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      placeholder="Observatii..."
                      value={kpi.notes}
                      onChange={e => setKpis(prev => prev.map((k, i) => i === idx ? { ...k, notes: e.target.value } : k))}
                      style={{ ...inputStyle, padding: "5px 8px", fontSize: 11 }}
                    />
                  </div>
                </div>
              ))}

              {/* Add custom KPI */}
              <button
                onClick={() => setKpis(prev => [...prev, { kpi_name: "", kpi_value: "", kpi_unit: "", data_source: "", notes: "" }])}
                style={{ marginTop: 8, padding: "6px 12px", borderRadius: 6, border: "1px dashed #d1d5db", background: "#fff", fontSize: 12, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}
              >
                + Adauga KPI custom
              </button>
            </div>

            {/* Scoring summary (readonly) */}
            <div style={{ padding: 14, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 8 }}>SCORURI EVALUARE (readonly)</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, textAlign: "center" }}>
                {[
                  { label: "R", value: scoreR, color: "#DC2626" },
                  { label: "I", value: scoreI, color: "#D97706" },
                  { label: "F", value: scoreF, color: "#7C3AED" },
                  { label: "CTA", value: scoreCta, color: "#059669" },
                  { label: "C", value: scoreC, color: "#0891B2" },
                ].map(s => (
                  <div key={s.label} style={{ padding: "8px 4px", borderRadius: 6, background: "#f9fafb", border: "1px solid #e5e7eb" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{s.value ?? "—"}</div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={finalize}
              disabled={kpis.filter(k => k.kpi_value.trim() !== "").length === 0 || saving}
              style={{
                width: "100%", padding: "14px 24px", borderRadius: 8, border: "none",
                background: kpis.some(k => k.kpi_value.trim() !== "") ? "#059669" : "#d1d5db",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              {saving ? "Se finalizeaza..." : "Finalizeaza evaluarea"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EvaluatorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", fontFamily: "Outfit, system-ui, sans-serif" }}><div style={{ fontSize: 20, color: "#6B7280" }}>Se incarca...</div></div>}>
      <EvaluatorPageContent />
    </Suspense>
  );
}

// Styles
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #d1d5db",
  fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box",
};

const sectionCard: React.CSSProperties = {
  padding: 16, background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 12,
};

const dimBadge: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 28, height: 28, borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 800,
};
