"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   R IF C — Expert Evaluation Page (public, token-based)
   Expert sees all stimuli, scores R/I/F/C/CTA + brand + justifications
   Profile modal with notification badge when incomplete
   ═══════════════════════════════════════════════════════════ */

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
}

interface ExpertInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  experience_years: number | null;
  brands_worked: string[] | null;
  total_budget_managed: number | null;
  marketing_roles: string[] | null;
}

interface Evaluation {
  id: string;
  stimulus_id: string;
  r_score: number;
  i_score: number;
  f_score: number;
  c_score: number | null;
  cta_score: number | null;
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

// Extract YouTube embed URL
function youtubeEmbed(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&?/\s]+)/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}

// ── Score dimension config ──
const DIMENSIONS = [
  { key: "r", label: "R", full: "Relevanta", color: "#DC2626", desc: "Cit de relevant este mesajul pentru publicul-tinta?" },
  { key: "i", label: "I", full: "Interes", color: "#D97706", desc: "Cit de mult capteaza atentia si trezeste interesul?" },
  { key: "f", label: "F", full: "Forma", color: "#7C3AED", desc: "Cit de buna este executia (design, claritate, calitate)?" },
  { key: "c", label: "C", full: "Claritate", color: "#2563EB", desc: "Cit de clar este mesajul principal transmis?" },
  { key: "cta", label: "CTA", full: "Call-to-Action", color: "#059669", desc: "Cit de eficient este apelul la actiune?" },
] as const;

// Check if expert profile is complete (has at least experience_years filled)
function isProfileComplete(expert: ExpertInfo): boolean {
  return !!(
    expert.experience_years &&
    expert.brands_worked && expert.brands_worked.length > 0 &&
    expert.marketing_roles && expert.marketing_roles.length > 0
  );
}

// Count how many profile fields are filled
function profileFilledCount(expert: ExpertInfo): number {
  let count = 0;
  if (expert.experience_years) count++;
  if (expert.brands_worked && expert.brands_worked.length > 0) count++;
  if (expert.total_budget_managed) count++;
  if (expert.marketing_roles && expert.marketing_roles.length > 0) count++;
  return count;
}

function ExpertPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expert, setExpert] = useState<ExpertInfo | null>(null);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Current stimulus being evaluated
  const [activeStimulus, setActiveStimulus] = useState<string | null>(null);

  // Form state per stimulus
  const [forms, setForms] = useState<Record<string, {
    r_score: number; i_score: number; f_score: number; c_score: number; cta_score: number;
    r_justification: string; i_justification: string; f_justification: string;
    c_justification: string; cta_justification: string;
    brand_familiar: boolean | null; brand_justification: string;
    notes: string;
  }>>({});

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileDismissed, setProfileDismissed] = useState(false);
  const [profileForm, setProfileForm] = useState({
    experience_years: "" as string,
    brands_worked: [] as string[],
    total_budget_managed: "" as string,
    marketing_roles: [] as string[],
  });
  const [brandInput, setBrandInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Load data
  const loadData = useCallback(async () => {
    if (!token) { setError("Link invalid — lipseste tokenul de acces"); setLoading(false); return; }
    try {
      const res = await fetch(`/api/survey/experts/by-token?token=${token}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Eroare la incarcarea datelor");
        setLoading(false);
        return;
      }
      setExpert(data.expert);
      setStimuli(data.stimuli);
      setEvaluations(data.evaluations);

      // Initialize profile form from expert data
      setProfileForm({
        experience_years: data.expert.experience_years != null ? String(data.expert.experience_years) : "",
        brands_worked: data.expert.brands_worked || [],
        total_budget_managed: data.expert.total_budget_managed != null ? String(data.expert.total_budget_managed) : "",
        marketing_roles: data.expert.marketing_roles || [],
      });

      // Initialize forms from existing evaluations
      const initForms: typeof forms = {};
      for (const stim of data.stimuli) {
        const existing = (data.evaluations as Evaluation[]).find((e: Evaluation) => e.stimulus_id === stim.id);
        initForms[stim.id] = {
          r_score: existing?.r_score || 5,
          i_score: existing?.i_score || 5,
          f_score: existing?.f_score || 5,
          c_score: existing?.c_score || 5,
          cta_score: existing?.cta_score || 5,
          r_justification: existing?.r_justification || "",
          i_justification: existing?.i_justification || "",
          f_justification: existing?.f_justification || "",
          c_justification: existing?.c_justification || "",
          cta_justification: existing?.cta_justification || "",
          brand_familiar: existing?.brand_familiar ?? null,
          brand_justification: existing?.brand_justification || "",
          notes: existing?.notes || "",
        };
      }
      setForms(initForms);
      if (data.stimuli.length > 0) setActiveStimulus(data.stimuli[0].id);
    } catch {
      setError("Eroare de conexiune");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => { loadData(); }, [loadData]);

  // Save evaluation for a stimulus
  const saveEvaluation = async (stimulusId: string) => {
    if (!token || !expert) return;
    const form = forms[stimulusId];
    if (!form) return;

    setSaving(true);
    setSaveSuccess(null);
    try {
      const res = await fetch("/api/survey/expert-evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          stimulus_id: stimulusId,
          r_score: form.r_score,
          i_score: form.i_score,
          f_score: form.f_score,
          c_score: form.c_score,
          cta_score: form.cta_score,
          r_justification: form.r_justification,
          i_justification: form.i_justification,
          f_justification: form.f_justification,
          c_justification: form.c_justification,
          cta_justification: form.cta_justification,
          brand_familiar: form.brand_familiar,
          brand_justification: form.brand_justification,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(stimulusId);
        setEvaluations((prev) => {
          const existing = prev.findIndex((e) => e.stimulus_id === stimulusId);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = data.evaluation;
            return updated;
          }
          return [data.evaluation, ...prev];
        });
        setTimeout(() => setSaveSuccess(null), 2000);
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const updateForm = (stimId: string, field: string, value: unknown) => {
    setForms((prev) => ({ ...prev, [stimId]: { ...prev[stimId], [field]: value } }));
  };

  // Save expert profile (professional fields)
  const saveProfile = async () => {
    if (!token) return;
    setSavingProfile(true);
    setProfileSaved(false);
    setProfileError(null);
    try {
      const res = await fetch("/api/survey/experts/by-token", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          experience_years: profileForm.experience_years ? parseInt(profileForm.experience_years) : null,
          brands_worked: profileForm.brands_worked,
          total_budget_managed: profileForm.total_budget_managed ? parseFloat(profileForm.total_budget_managed) : null,
          marketing_roles: profileForm.marketing_roles,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExpert((prev) => prev ? { ...prev, ...data.expert } : prev);
        setProfileSaved(true);
        setProfileDismissed(true);
        setTimeout(() => {
          setProfileSaved(false);
          setShowProfileModal(false);
        }, 1500);
      } else {
        setProfileError(data.error || "Eroare la salvare");
      }
    } catch {
      setProfileError("Eroare de conexiune");
    }
    setSavingProfile(false);
  };

  const addBrand = (val: string) => {
    const v = val.trim();
    if (v && !profileForm.brands_worked.includes(v)) {
      setProfileForm((p) => ({ ...p, brands_worked: [...p.brands_worked, v] }));
    }
    setBrandInput("");
  };

  const removeBrand = (b: string) => {
    setProfileForm((p) => ({ ...p, brands_worked: p.brands_worked.filter((x) => x !== b) }));
  };

  const addRole = (val: string) => {
    const v = val.trim();
    if (v && !profileForm.marketing_roles.includes(v)) {
      setProfileForm((p) => ({ ...p, marketing_roles: [...p.marketing_roles, v] }));
    }
    setRoleInput("");
  };

  const removeRole = (r: string) => {
    setProfileForm((p) => ({ ...p, marketing_roles: p.marketing_roles.filter((x) => x !== r) }));
  };

  // ── Render ──
  if (loading) {
    return (
      <div style={P.loadingWrap}>
        <div style={P.spinner} />
        <p style={{ color: "#6B7280", marginTop: 16 }}>Se incarca datele...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={P.errorWrap}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        </div>
        <h2 style={{ color: "#DC2626", fontSize: 20, fontWeight: 700, margin: 0 }}>Acces refuzat</h2>
        <p style={{ color: "#6B7280", marginTop: 8 }}>{error}</p>
      </div>
    );
  }

  if (!expert || stimuli.length === 0) {
    return (
      <div style={P.errorWrap}>
        <p style={{ color: "#6B7280" }}>Nu exista materiale de evaluat momentan.</p>
      </div>
    );
  }

  const activeStim = stimuli.find((s) => s.id === activeStimulus);
  const activeForm = activeStimulus ? forms[activeStimulus] : null;
  const completedCount = evaluations.length;
  const totalCount = stimuli.length;
  const isCompleted = (stimId: string) => evaluations.some((e) => e.stimulus_id === stimId);
  const profileComplete = isProfileComplete(expert);
  const filledCount = profileFilledCount(expert);
  const showProfileBanner = !profileComplete && !profileDismissed;

  return (
    <div style={P.page}>
      {/* Header — with PROFILUL MEU button */}
      <div style={P.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/images/rifc-logo-black.png" alt="R IF C" style={{ height: 32, width: "auto", borderRadius: 4 }} />
          <span style={P.badge}>EXPERT</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Profile button — always visible in header */}
          <button
            onClick={() => { setShowProfileModal(true); setProfileError(null); setProfileSaved(false); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 16px", borderRadius: 8,
              border: profileComplete ? "1px solid #d1d5db" : "2px solid #D97706",
              background: profileComplete ? "#fff" : "#fffbeb",
              cursor: "pointer", fontSize: 13, fontWeight: 600,
              color: profileComplete ? "#374151" : "#92400e",
              transition: "all 0.2s",
              position: "relative" as const,
              boxShadow: profileComplete ? "none" : "0 0 0 3px rgba(217,119,6,0.15)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            Profilul meu
            {!profileComplete && (
              <span style={{
                position: "absolute", top: -6, right: -6,
                width: 20, height: 20, borderRadius: "50%",
                background: "#DC2626", color: "#fff",
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
                animation: "pulse-badge 2s infinite",
              }}>!</span>
            )}
            {profileComplete && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </button>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              {expert.first_name} {expert.last_name}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>{expert.email}</div>
          </div>
        </div>
      </div>

      {/* Profile incomplete notification banner */}
      {showProfileBanner && (
        <div style={P.notifBanner}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span style={{ fontSize: 13, color: "#92400e", fontWeight: 500 }}>
              <strong>Completeaza profilul profesional</strong> inainte de a incepe evaluarea ({filledCount}/4 campuri completate)
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => { setShowProfileModal(true); setProfileError(null); setProfileSaved(false); }}
              style={{
                padding: "6px 16px", borderRadius: 6, border: "none",
                background: "#D97706", color: "#fff", fontSize: 12, fontWeight: 700,
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              Completeaza acum
            </button>
            <button
              onClick={() => setProfileDismissed(true)}
              style={{
                padding: "6px 10px", borderRadius: 6, border: "1px solid #fbbf24",
                background: "transparent", color: "#92400e", fontSize: 12, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Mai tarziu
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div style={P.progressWrap}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Progres evaluare</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: completedCount === totalCount ? "#059669" : "#D97706" }}>
            {completedCount} / {totalCount} materiale evaluate
          </span>
        </div>
        <div style={P.progressBar}>
          <div style={{ ...P.progressFill, width: `${(completedCount / totalCount) * 100}%` }} />
        </div>
      </div>

      {/* ═══ Profile Modal ═══ */}
      {showProfileModal && (
        <div style={P.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowProfileModal(false); }}>
          <div style={P.modalBox}>
            {/* Modal header */}
            <div style={P.modalHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 16, fontWeight: 800,
                }}>
                  {expert.first_name[0]}{expert.last_name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Profilul meu profesional</div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>{expert.first_name} {expert.last_name} — {expert.email}</div>
                </div>
              </div>
              <button onClick={() => setShowProfileModal(false)} style={P.modalClose}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Completion indicator */}
            <div style={{ padding: "12px 24px", background: profileComplete ? "#f0fdf4" : "#fffbeb", borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: profileComplete ? "#059669" : "#92400e" }}>
                  {profileComplete ? "Profil complet" : "Profil incomplet"} — {filledCount}/4 campuri
                </span>
              </div>
              <div style={{ height: 4, background: profileComplete ? "#bbf7d0" : "#fef3c7", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(filledCount / 4) * 100}%`, background: profileComplete ? "#059669" : "#D97706", borderRadius: 2, transition: "width 0.3s" }} />
              </div>
            </div>

            {/* Form body */}
            <div style={{ padding: 24, display: "flex", flexDirection: "column" as const, gap: 18, overflowY: "auto" as const, maxHeight: "calc(80vh - 200px)" }}>
              {/* Row 1: Experience + Budget */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={P.profileLabel}>
                    Experienta in marketing (ani)
                    {!profileForm.experience_years && <span style={{ color: "#DC2626", marginLeft: 4 }}>*</span>}
                  </label>
                  <input
                    type="number" min={0} max={60}
                    value={profileForm.experience_years}
                    onChange={(e) => setProfileForm((p) => ({ ...p, experience_years: e.target.value }))}
                    placeholder="ex: 10"
                    style={{
                      ...P.profileInput,
                      borderColor: !profileForm.experience_years ? "#fbbf24" : "#e5e7eb",
                    }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={P.profileLabel}>Buget total administrat (EUR)</label>
                  <input
                    type="number" min={0}
                    value={profileForm.total_budget_managed}
                    onChange={(e) => setProfileForm((p) => ({ ...p, total_budget_managed: e.target.value }))}
                    placeholder="ex: 500000"
                    style={P.profileInput}
                  />
                </div>
              </div>

              {/* Row 2: Brands (tag input) */}
              <div>
                <label style={P.profileLabel}>
                  Branduri cu care ai lucrat
                  {profileForm.brands_worked.length === 0 && <span style={{ color: "#DC2626", marginLeft: 4 }}>*</span>}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 6 }}>
                  {profileForm.brands_worked.map((b) => (
                    <span key={b} style={P.tagPill}>
                      {b}
                      <button onClick={() => removeBrand(b)} style={P.tagX}>&times;</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={brandInput}
                  onChange={(e) => setBrandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && brandInput.trim()) {
                      e.preventDefault();
                      addBrand(brandInput);
                    }
                  }}
                  placeholder="Scrie un brand si apasa Enter..."
                  style={{
                    ...P.profileInput,
                    borderColor: profileForm.brands_worked.length === 0 ? "#fbbf24" : "#e5e7eb",
                  }}
                />
              </div>

              {/* Row 3: Marketing roles (tag input) */}
              <div>
                <label style={P.profileLabel}>
                  Functii de marketing detinute
                  {profileForm.marketing_roles.length === 0 && <span style={{ color: "#DC2626", marginLeft: 4 }}>*</span>}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 6 }}>
                  {profileForm.marketing_roles.map((r) => (
                    <span key={r} style={{ ...P.tagPill, background: "#fdf2f8", color: "#be185d", border: "1px solid #fbcfe8" }}>
                      {r}
                      <button onClick={() => removeRole(r)} style={{ ...P.tagX, color: "#be185d" }}>&times;</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === ",") && roleInput.trim()) {
                      e.preventDefault();
                      addRole(roleInput);
                    }
                  }}
                  placeholder="Scrie o functie si apasa Enter..."
                  style={{
                    ...P.profileInput,
                    borderColor: profileForm.marketing_roles.length === 0 ? "#fbbf24" : "#e5e7eb",
                  }}
                />
              </div>
            </div>

            {/* Modal footer */}
            <div style={P.modalFooter}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button
                  onClick={saveProfile}
                  disabled={savingProfile}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "10px 24px", background: "#2563EB", color: "#fff",
                    border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700,
                    cursor: "pointer", opacity: savingProfile ? 0.6 : 1, transition: "all 0.15s",
                  }}
                >
                  {savingProfile ? (
                    <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  )}
                  {savingProfile ? "Se salveaza..." : "Salveaza profilul"}
                </button>
                <button
                  onClick={() => setShowProfileModal(false)}
                  style={{
                    padding: "10px 20px", background: "transparent", color: "#6B7280",
                    border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  Inchide
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {profileSaved && (
                  <span style={{ fontSize: 13, color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Profil salvat!
                  </span>
                )}
                {profileError && (
                  <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 600 }}>{profileError}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main layout: sidebar stimulus list + evaluation area */}
      <div style={P.main}>
        {/* Sidebar: stimulus cards */}
        <div style={P.sidebar}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", padding: "12px 16px 8px", textTransform: "uppercase" }}>
            Materiale de evaluat ({totalCount})
          </div>
          {stimuli.map((stim, idx) => {
            const done = isCompleted(stim.id);
            const isActive = activeStimulus === stim.id;
            return (
              <button
                key={stim.id}
                onClick={() => setActiveStimulus(stim.id)}
                style={{
                  ...P.stimCard,
                  background: isActive ? "#fef3c7" : done ? "#f0fdf4" : "#fff",
                  borderLeft: isActive ? "3px solid #D97706" : done ? "3px solid #059669" : "3px solid transparent",
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 700,
                    background: done ? "#059669" : "#e5e7eb",
                    color: done ? "#fff" : "#6B7280",
                  }}>
                    {done ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (idx + 1)}
                  </span>
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 13, color: "#111827", lineHeight: 1.3 }}>{stim.name}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF" }}>{stim.type}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Evaluation area */}
        <div style={P.evalArea}>
          {activeStim && activeForm ? (
            <>
              {/* Stimulus preview */}
              <div style={P.stimPreview}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>{activeStim.name}</h3>
                    <span style={{ fontSize: 11, color: "#6B7280" }}>{activeStim.type}{activeStim.industry ? ` — ${activeStim.industry}` : ""}</span>
                  </div>
                  {isCompleted(activeStim.id) && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#dcfce7", padding: "4px 10px", borderRadius: 12 }}>EVALUAT</span>
                  )}
                </div>

                {activeStim.description && (
                  <p style={{ fontSize: 13, color: "#374151", marginBottom: 12, lineHeight: 1.5 }}>{activeStim.description}</p>
                )}

                {/* Media preview */}
                {activeStim.image_url && (
                  <div style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden" }}>
                    <img src={activeStim.image_url} alt={activeStim.name} style={{ width: "100%", maxHeight: 400, objectFit: "contain", background: "#f3f4f6" }} />
                  </div>
                )}
                {activeStim.video_url && (
                  <div style={{ marginBottom: 12, borderRadius: 8, overflow: "hidden", aspectRatio: "16/9" }}>
                    {youtubeEmbed(activeStim.video_url) ? (
                      <iframe src={youtubeEmbed(activeStim.video_url)!} style={{ width: "100%", height: "100%", border: "none" }} allowFullScreen />
                    ) : (
                      <video src={activeStim.video_url} controls style={{ width: "100%", height: "100%" }} />
                    )}
                  </div>
                )}
                {activeStim.audio_url && (
                  <div style={{ marginBottom: 12 }}>
                    <audio src={activeStim.audio_url} controls style={{ width: "100%" }} />
                  </div>
                )}
                {activeStim.text_content && (
                  <div style={{ marginBottom: 12, padding: 16, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13, lineHeight: 1.6, color: "#374151", whiteSpace: "pre-wrap" }}>
                    {activeStim.text_content}
                  </div>
                )}
                {activeStim.site_url && (
                  <a href={activeStim.site_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563EB", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Deschide site-ul
                  </a>
                )}
                {activeStim.pdf_url && (
                  <a href={activeStim.pdf_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#DC2626", display: "inline-flex", alignItems: "center", gap: 4, marginLeft: activeStim.site_url ? 16 : 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    Deschide PDF
                  </a>
                )}
              </div>

              {/* Calculator / Scoring section */}
              <div style={P.scoringSection}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#6B7280", marginBottom: 16, textTransform: "uppercase" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle", marginRight: 6 }}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
                  Calculator R IF C
                </div>

                {/* Formula display */}
                <div style={P.formulaBar}>
                  <span style={{ color: "#DC2626", fontWeight: 800 }}>{activeForm.r_score}</span>
                  <span style={{ color: "#9CA3AF" }}>+</span>
                  <span style={{ color: "#D97706", fontWeight: 800 }}>{activeForm.i_score}</span>
                  <span style={{ color: "#9CA3AF" }}>x</span>
                  <span style={{ color: "#7C3AED", fontWeight: 800 }}>{activeForm.f_score}</span>
                  <span style={{ color: "#9CA3AF" }}>=</span>
                  <span style={{ fontSize: 24, fontWeight: 900, color: "#111827" }}>{activeForm.r_score + (activeForm.i_score * activeForm.f_score)}</span>
                </div>

                {/* Score dimensions */}
                {DIMENSIONS.map((dim) => {
                  const scoreKey = `${dim.key}_score` as keyof typeof activeForm;
                  const justKey = `${dim.key}_justification` as keyof typeof activeForm;
                  const score = activeForm[scoreKey] as number;
                  return (
                    <div key={dim.key} style={P.dimBlock}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ ...P.dimBadge, background: dim.color }}>{dim.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{dim.full}</span>
                        </div>
                        <span style={{ fontSize: 24, fontWeight: 800, color: dim.color }}>{score}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 8px" }}>{dim.desc}</p>
                      {/* Slider */}
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 12 }}>1</span>
                        <input
                          type="range" min={1} max={10} step={1}
                          value={score}
                          onChange={(e) => updateForm(activeStim.id, `${dim.key}_score`, parseInt(e.target.value))}
                          style={{ flex: 1, accentColor: dim.color, height: 6 }}
                        />
                        <span style={{ fontSize: 11, color: "#9CA3AF", minWidth: 16 }}>10</span>
                      </div>
                      {/* Number buttons */}
                      <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                          <button
                            key={n}
                            onClick={() => updateForm(activeStim.id, `${dim.key}_score`, n)}
                            style={{
                              width: 32, height: 32, borderRadius: 6, border: "none",
                              background: score === n ? dim.color : "#f3f4f6",
                              color: score === n ? "#fff" : "#374151",
                              fontSize: 13, fontWeight: score === n ? 700 : 400,
                              cursor: "pointer", transition: "all 0.15s",
                            }}
                          >{n}</button>
                        ))}
                      </div>
                      {/* Justification */}
                      <textarea
                        value={(activeForm[justKey] as string) || ""}
                        onChange={(e) => updateForm(activeStim.id, `${dim.key}_justification`, e.target.value)}
                        placeholder={`Justificare ${dim.full}...`}
                        rows={2}
                        style={P.textarea}
                      />
                    </div>
                  );
                })}

                {/* Brand familiarity */}
                <div style={P.dimBlock}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ ...P.dimBadge, background: "#111827" }}>B</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Recunoastere Brand</span>
                  </div>
                  <p style={{ fontSize: 11, color: "#9CA3AF", margin: "0 0 12px" }}>Recunosti brand-ul care a creat acest material?</p>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <button
                      onClick={() => updateForm(activeStim.id, "brand_familiar", true)}
                      style={{
                        ...P.brandBtn,
                        background: activeForm.brand_familiar === true ? "#059669" : "#f3f4f6",
                        color: activeForm.brand_familiar === true ? "#fff" : "#374151",
                      }}
                    >Da, recunosc</button>
                    <button
                      onClick={() => updateForm(activeStim.id, "brand_familiar", false)}
                      style={{
                        ...P.brandBtn,
                        background: activeForm.brand_familiar === false ? "#DC2626" : "#f3f4f6",
                        color: activeForm.brand_familiar === false ? "#fff" : "#374151",
                      }}
                    >Nu recunosc</button>
                  </div>
                  <textarea
                    value={activeForm.brand_justification}
                    onChange={(e) => updateForm(activeStim.id, "brand_justification", e.target.value)}
                    placeholder="Comentariu brand..."
                    rows={2}
                    style={P.textarea}
                  />
                </div>

                {/* Notes */}
                <div style={P.dimBlock}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Note suplimentare</span>
                  </div>
                  <textarea
                    value={activeForm.notes}
                    onChange={(e) => updateForm(activeStim.id, "notes", e.target.value)}
                    placeholder="Observatii generale, recomandari, comentarii..."
                    rows={3}
                    style={P.textarea}
                  />
                </div>

                {/* Save button */}
                <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center" }}>
                  <button
                    onClick={() => saveEvaluation(activeStim.id)}
                    disabled={saving}
                    style={{
                      ...P.saveBtn,
                      opacity: saving ? 0.6 : 1,
                    }}
                  >
                    {saving ? (
                      <div style={{ width: 16, height: 16, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {saving ? "Se salveaza..." : isCompleted(activeStim.id) ? "Actualizeaza evaluarea" : "Salveaza evaluarea"}
                  </button>
                  {saveSuccess === activeStim.id && (
                    <span style={{ fontSize: 13, color: "#059669", fontWeight: 600 }}>Salvat cu succes!</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
              <p>Selecteaza un material din lista din stanga pentru a incepe evaluarea.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @keyframes pulse-badge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
        @media (max-width: 768px) {
          .expert-main { flex-direction: column !important; }
          .expert-sidebar { max-height: 200px !important; width: 100% !important; flex-direction: row !important; overflow-x: auto !important; }
          .expert-sidebar button { min-width: 200px !important; }
        }
      `}</style>
    </div>
  );
}

// ── Styles ──
const P: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "Outfit, system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  logo: {
    fontSize: 22,
    fontWeight: 800,
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: 2,
    color: "#111827",
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "4px 12px",
    borderRadius: 6,
    background: "#059669",
    color: "#fff",
  },
  notifBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 24px",
    background: "#fffbeb",
    borderBottom: "2px solid #fbbf24",
    flexWrap: "wrap" as const,
  },
  progressWrap: {
    padding: "12px 24px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  progressBar: {
    height: 6,
    background: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #D97706, #059669)",
    borderRadius: 3,
    transition: "width 0.5s ease",
  },
  main: {
    display: "flex",
    gap: 0,
    maxWidth: 1400,
    margin: "0 auto",
    minHeight: "calc(100vh - 130px)",
  },
  sidebar: {
    width: 280,
    minWidth: 280,
    background: "#fff",
    borderRight: "1px solid #e5e7eb",
    overflowY: "auto" as const,
    maxHeight: "calc(100vh - 130px)",
    position: "sticky" as const,
    top: 0,
  },
  stimCard: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    borderBottom: "1px solid #f3f4f6",
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left" as const,
  },
  evalArea: {
    flex: 1,
    padding: "24px 32px",
    overflowY: "auto" as const,
    maxHeight: "calc(100vh - 130px)",
  },
  stimPreview: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 24,
    marginBottom: 20,
  },
  scoringSection: {
    background: "#fff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: 24,
  },
  formulaBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: "16px 24px",
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    fontSize: 18,
    fontFamily: "JetBrains Mono, monospace",
    marginBottom: 24,
  },
  dimBlock: {
    padding: "16px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  dimBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    borderRadius: 6,
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.5,
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "inherit",
    resize: "vertical" as const,
    marginTop: 10,
    background: "#fafafa",
    color: "#374151",
    outline: "none",
  },
  brandBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "none",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 24px",
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  loadingWrap: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f8f9fa",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #e5e7eb",
    borderTopColor: "#D97706",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  errorWrap: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "#f8f9fa",
    textAlign: "center" as const,
    padding: 40,
  },
  // ── Modal styles ──
  modalOverlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    padding: 20,
    backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: "#fff",
    borderRadius: 16,
    width: "100%",
    maxWidth: 560,
    maxHeight: "80vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalClose: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: "none",
    background: "#f3f4f6",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6B7280",
    transition: "all 0.15s",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    background: "#f9fafb",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  // ── Profile form styles ──
  profileLabel: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  profileInput: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fff",
    color: "#374151",
    outline: "none",
    transition: "border-color 0.2s",
  },
  tagPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 12px",
    borderRadius: 16,
    fontSize: 13,
    fontWeight: 500,
    background: "#eff6ff",
    color: "#2563EB",
    border: "1px solid #bfdbfe",
  },
  tagX: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
    color: "#2563EB",
    padding: 0,
    lineHeight: 1,
    marginLeft: 2,
  },
};

// ── Page wrapper with Suspense ──
export default function ExpertPage() {
  return (
    <Suspense fallback={<div style={P.loadingWrap}><div style={P.spinner} /><p style={{ color: "#6B7280", marginTop: 16 }}>Se incarca...</p></div>}>
      <ExpertPageContent />
    </Suspense>
  );
}
