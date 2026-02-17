"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   R IF C — Studiu de Percepție Consumator
   Wizard cu 12 steps, auto-save la fiecare pas, resume din localStorage
   ═══════════════════════════════════════════════════════════ */

const LS_KEY = "rifc-survey-session";

// ── Types ──────────────────────────────────────────────────
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
}

interface SessionData {
  sessionId: string;
  currentStep: number;
  stimuliOrder: string[];
  stimuli: Stimulus[];
}

// ── Helpers ────────────────────────────────────────────────
function extractYoutubeId(url: string): string | null {
  const m =
    url.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/) ||
    url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/) ||
    url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/) ||
    url.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function computeC(r: number, i: number, f: number): number {
  return r > 0 ? Math.round((r + i * f) * 10) / 10 : 0;
}

// ── Main Component ─────────────────────────────────────────
export default function StudiuPage() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [step, setStep] = useState(0); // 0=loading, 1-12=active steps
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile data
  const [demographics, setDemographics] = useState({
    ageRange: "",
    gender: "",
    locationType: "",
    incomeRange: "",
    education: "",
    occupation: "",
  });
  const [behavioral, setBehavioral] = useState({
    purchaseFrequency: "",
    preferredChannels: [] as string[],
    dailyOnlineTime: "",
    primaryDevice: "",
  });
  const [psychographic, setPsychographic] = useState({
    adReceptivity: 4,
    visualPreference: 4,
    impulseBuying: 4,
    irrelevanceAnnoyance: 4,
    attentionCapture: 4,
  });

  // Stimulus evaluation
  const [stimulusScores, setStimulusScores] = useState<
    Record<string, { r: number; i: number; f: number }>
  >({});
  const timerRef = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // ── Init: load session or create new ────────────────────
  useEffect(() => {
    const init = async () => {
      // Try resume
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const s: SessionData = JSON.parse(saved);
          if (s.sessionId && s.stimuli?.length > 0) {
            setSession(s);
            setStep(s.currentStep || 1);
            return;
          }
        }
      } catch {
        /* ignore */
      }

      // Start new session
      try {
        const res = await fetch("/api/survey/start", { method: "POST" });
        const data = await res.json();
        if (data.success) {
          const s: SessionData = {
            sessionId: data.sessionId,
            currentStep: 1,
            stimuliOrder: data.stimuli.map((st: Stimulus) => st.id),
            stimuli: data.stimuli,
          };
          localStorage.setItem(LS_KEY, JSON.stringify(s));
          setSession(s);
          setStep(1);
        } else {
          setError("Nu s-a putut porni sondajul. Reincarca pagina.");
        }
      } catch {
        setError("Eroare de conexiune. Verifica internetul si reincarca.");
      }
    };
    init();
  }, []);

  // ── Timer for stimulus steps ────────────────────────────
  useEffect(() => {
    if (step >= 4 && step <= 11) {
      timerRef.current = 0;
      timerInterval.current = setInterval(() => {
        timerRef.current += 1;
      }, 1000);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [step]);

  // ── Save & advance step ─────────────────────────────────
  const saveAndNext = useCallback(async () => {
    if (!session || saving) return;
    setSaving(true);
    setError(null);

    let type = "";
    let data: Record<string, unknown> = {};

    if (step === 1) {
      type = "demographic";
      data = demographics;
    } else if (step === 2) {
      type = "behavioral";
      data = behavioral;
    } else if (step === 3) {
      type = "psychographic";
      data = psychographic;
    } else if (step >= 4 && step <= 11) {
      const idx = step - 4;
      const stimId = session.stimuliOrder[idx];
      const scores = stimulusScores[stimId] || { r: 5, i: 5, f: 5 };
      type = "stimulus";
      data = {
        stimulusId: stimId,
        rScore: scores.r,
        iScore: scores.i,
        fScore: scores.f,
        timeSpentSeconds: timerRef.current,
      };
    } else if (step === 12) {
      type = "complete";
      data = {};
    }

    try {
      const res = await fetch("/api/survey/step", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          step,
          type,
          data,
        }),
      });
      const result = await res.json();
      if (result.success) {
        const nextStep = step + 1;
        // If we have fewer than 8 stimuli, skip remaining stimulus steps
        const maxStimulusStep = 3 + (session.stimuli?.length || 8);
        const actualNext =
          step >= 4 && nextStep > maxStimulusStep
            ? maxStimulusStep + 1
            : nextStep;
        const finalStep = Math.min(actualNext, 13);

        const updated = { ...session, currentStep: finalStep };
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
        setSession(updated);
        setStep(finalStep);
        window.scrollTo(0, 0);
      } else {
        setError("Eroare la salvare. Incearca din nou.");
      }
    } catch {
      setError("Eroare de conexiune.");
    }
    setSaving(false);
  }, [session, step, saving, demographics, behavioral, psychographic, stimulusScores]);

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  // ── Compute total steps ─────────────────────────────────
  const totalSteps = session ? 3 + (session.stimuli?.length || 8) + 1 : 12;
  const pct = Math.round(((step - 1) / (totalSteps - 1)) * 100);

  // ── Loading state ───────────────────────────────────────
  if (step === 0 || !session) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          {error ? (
            <p style={{ color: "#DC2626" }}>{error}</p>
          ) : (
            <p style={{ color: "#6B7280" }}>Se incarca sondajul...</p>
          )}
        </div>
      </div>
    );
  }

  // ── Complete state ──────────────────────────────────────
  if (step > totalSteps || step === 13) {
    const scores = Object.values(stimulusScores);
    const avgC =
      scores.length > 0
        ? Math.round(
            (scores.reduce(
              (a, s) => a + computeC(s.r, s.i, s.f),
              0
            ) /
              scores.length) *
              10
          ) / 10
        : 0;
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#059669",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 20px",
              }}
            >
              &#10003;
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 8, color: "#111827" }}>
              Multumim pentru participare!
            </h2>
            <p style={{ color: "#6B7280", marginBottom: 24 }}>
              Ai evaluat {session.stimuli.length} materiale de marketing.
              <br />
              Scorul C mediu al evaluarilor tale:{" "}
              <strong style={{ color: "#DC2626" }}>{avgC}</strong>
            </p>
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <p style={{ fontSize: 13, color: "#166534" }}>
                Raspunsurile tale contribuie la validarea stiintifica a
                framework-ului R IF C. Datele sunt anonime.
              </p>
            </div>
            <p style={{ fontSize: 13, color: "#9CA3AF" }}>
              Trimite sondajul si altora:{" "}
              <strong>rifcmarketing.com/studiu</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Get current stimulus ────────────────────────────────
  const currentStimIdx = step >= 4 && step <= 11 ? step - 4 : -1;
  const currentStim =
    currentStimIdx >= 0 && currentStimIdx < session.stimuli.length
      ? session.stimuli[currentStimIdx]
      : null;
  const currentScores = currentStim
    ? stimulusScores[currentStim.id] || { r: 5, i: 5, f: 5 }
    : { r: 5, i: 5, f: 5 };

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={styles.container}>
      {/* Progress bar */}
      <div style={styles.progressWrap}>
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${pct}%`,
            }}
          />
        </div>
        <div style={styles.progressText}>
          Pasul {step} din {totalSteps} &mdash; {pct}% completat
        </div>
      </div>

      <div style={styles.card}>
        {/* Step 1: Demographics */}
        {step === 1 && (
          <div>
            <h2 style={styles.stepTitle}>Profil Demografic</h2>
            <p style={styles.stepDesc}>
              Aceste date ne ajuta sa intelegem perspectiva diferitelor segmente
              de audienta. Toate raspunsurile sunt anonime.
            </p>

            <label style={styles.label}>Varsta</label>
            <select
              style={styles.select}
              value={demographics.ageRange}
              onChange={(e) =>
                setDemographics({ ...demographics, ageRange: e.target.value })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="18-24">18-24 ani</option>
              <option value="25-34">25-34 ani</option>
              <option value="35-44">35-44 ani</option>
              <option value="45-54">45-54 ani</option>
              <option value="55-64">55-64 ani</option>
              <option value="65+">65+ ani</option>
            </select>

            <label style={styles.label}>Gen</label>
            <select
              style={styles.select}
              value={demographics.gender}
              onChange={(e) =>
                setDemographics({ ...demographics, gender: e.target.value })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="masculin">Masculin</option>
              <option value="feminin">Feminin</option>
              <option value="altul">Altul</option>
              <option value="prefer_nu_spun">Prefer sa nu spun</option>
            </select>

            <label style={styles.label}>Locatie</label>
            <select
              style={styles.select}
              value={demographics.locationType}
              onChange={(e) =>
                setDemographics({
                  ...demographics,
                  locationType: e.target.value,
                })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="urban">Urban</option>
              <option value="rural">Rural</option>
            </select>

            <label style={styles.label}>Venit lunar net (orientativ)</label>
            <select
              style={styles.select}
              value={demographics.incomeRange}
              onChange={(e) =>
                setDemographics({
                  ...demographics,
                  incomeRange: e.target.value,
                })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="sub_500">Sub 500 EUR</option>
              <option value="500_1000">500 - 1.000 EUR</option>
              <option value="1000_2000">1.000 - 2.000 EUR</option>
              <option value="peste_2000">Peste 2.000 EUR</option>
            </select>

            <label style={styles.label}>Nivel educatie</label>
            <select
              style={styles.select}
              value={demographics.education}
              onChange={(e) =>
                setDemographics({ ...demographics, education: e.target.value })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="liceu">Liceu</option>
              <option value="universitate">Universitate (Licenta)</option>
              <option value="master">Master</option>
              <option value="doctorat">Doctorat</option>
              <option value="altul">Altul</option>
            </select>

            <label style={styles.label}>Ocupatie</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Ex: Manager Marketing, Student, Antreprenor..."
              value={demographics.occupation}
              onChange={(e) =>
                setDemographics({ ...demographics, occupation: e.target.value })
              }
            />
          </div>
        )}

        {/* Step 2: Behavioral */}
        {step === 2 && (
          <div>
            <h2 style={styles.stepTitle}>Profil Comportamental</h2>
            <p style={styles.stepDesc}>
              Cum interactionezi cu mediul digital si reclamele.
            </p>

            <label style={styles.label}>Cat de des cumperi online?</label>
            <select
              style={styles.select}
              value={behavioral.purchaseFrequency}
              onChange={(e) =>
                setBehavioral({
                  ...behavioral,
                  purchaseFrequency: e.target.value,
                })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="zilnic">Zilnic</option>
              <option value="saptamanal">Saptamanal</option>
              <option value="lunar">Lunar</option>
              <option value="rar">Rar (cateva ori pe an)</option>
            </select>

            <label style={styles.label}>
              Canale media preferate (selecteaza mai multe)
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {[
                "Social Media",
                "Email",
                "TV",
                "Radio",
                "Print",
                "Outdoor",
                "Online Search",
              ].map((ch) => (
                <label
                  key={ch}
                  style={{
                    ...styles.chip,
                    ...(behavioral.preferredChannels.includes(ch)
                      ? styles.chipActive
                      : {}),
                  }}
                >
                  <input
                    type="checkbox"
                    style={{ display: "none" }}
                    checked={behavioral.preferredChannels.includes(ch)}
                    onChange={() => {
                      const channels = behavioral.preferredChannels.includes(ch)
                        ? behavioral.preferredChannels.filter((c) => c !== ch)
                        : [...behavioral.preferredChannels, ch];
                      setBehavioral({ ...behavioral, preferredChannels: channels });
                    }}
                  />
                  {ch}
                </label>
              ))}
            </div>

            <label style={styles.label}>Timp online zilnic</label>
            <select
              style={styles.select}
              value={behavioral.dailyOnlineTime}
              onChange={(e) =>
                setBehavioral({
                  ...behavioral,
                  dailyOnlineTime: e.target.value,
                })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="sub_1h">Sub 1 ora</option>
              <option value="1_3h">1-3 ore</option>
              <option value="3_5h">3-5 ore</option>
              <option value="peste_5h">Peste 5 ore</option>
            </select>

            <label style={styles.label}>Dispozitiv principal</label>
            <select
              style={styles.select}
              value={behavioral.primaryDevice}
              onChange={(e) =>
                setBehavioral({
                  ...behavioral,
                  primaryDevice: e.target.value,
                })
              }
            >
              <option value="">Selecteaza...</option>
              <option value="telefon">Telefon mobil</option>
              <option value="laptop_pc">Laptop / PC</option>
              <option value="tableta">Tableta</option>
            </select>
          </div>
        )}

        {/* Step 3: Psychographic */}
        {step === 3 && (
          <div>
            <h2 style={styles.stepTitle}>Profil Psihografic</h2>
            <p style={styles.stepDesc}>
              Indica cat de mult esti de acord cu fiecare afirmatie (1 = Total
              dezacord, 7 = Total acord).
            </p>

            {[
              {
                key: "adReceptivity" as const,
                text: "Acord atentie reclamelor care par relevante pentru mine",
              },
              {
                key: "visualPreference" as const,
                text: "Prefer reclamele cu un design vizual atractiv",
              },
              {
                key: "impulseBuying" as const,
                text: "Uneori cumpar impulsiv dupa ce vad o reclama",
              },
              {
                key: "irrelevanceAnnoyance" as const,
                text: "Ma irita reclamele care nu au legatura cu interesele mele",
              },
              {
                key: "attentionCapture" as const,
                text: "Ma opresc din scrollat cand vad o reclama interesanta",
              },
            ].map((item, idx) => (
              <div key={item.key} style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>
                  <span style={styles.likertNum}>{idx + 1}</span>
                  {item.text}
                </div>
                <div style={styles.likertRow}>
                  {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                    <button
                      key={v}
                      style={{
                        ...styles.likertBtn,
                        ...(psychographic[item.key] === v
                          ? styles.likertBtnActive
                          : {}),
                      }}
                      onClick={() =>
                        setPsychographic({ ...psychographic, [item.key]: v })
                      }
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={styles.likertLabels}>
                  <span>Total dezacord</span>
                  <span>Total acord</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Steps 4-11: Stimulus evaluation */}
        {step >= 4 && step <= 11 && currentStim && (
          <div>
            <h2 style={styles.stepTitle}>
              Evaluare Material {currentStimIdx + 1} din{" "}
              {session.stimuli.length}
            </h2>
            <p style={styles.stepDesc}>
              Analizeaza materialul de mai jos si evalueaza-l pe cele 3
              dimensiuni.
            </p>

            {/* Stimulus display */}
            <div style={styles.stimulusBox}>
              <div style={styles.stimulusMeta}>
                <span style={styles.typeBadge}>{currentStim.type}</span>
                {currentStim.industry && (
                  <span style={styles.industryBadge}>
                    {currentStim.industry}
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: 18, color: "#111827", marginBottom: 12 }}>
                {currentStim.name}
              </h3>

              {/* Image */}
              {currentStim.image_url && (
                <img
                  src={currentStim.image_url}
                  alt={currentStim.name}
                  style={styles.stimulusImg}
                  loading="lazy"
                />
              )}

              {/* YouTube video */}
              {currentStim.video_url &&
                extractYoutubeId(currentStim.video_url) && (
                  <div style={styles.videoWrap}>
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(
                        currentStim.video_url
                      )}`}
                      title={currentStim.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      style={styles.videoIframe}
                    />
                  </div>
                )}

              {/* Text content */}
              {currentStim.text_content && (
                <div style={styles.textContent}>
                  {currentStim.text_content}
                </div>
              )}

              {/* PDF */}
              {currentStim.pdf_url && (
                <a
                  href={currentStim.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.pdfLink}
                >
                  Deschide PDF-ul &rarr;
                </a>
              )}

              {/* Site URL */}
              {currentStim.site_url && (
                <a
                  href={currentStim.site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.siteLink}
                >
                  Viziteaza site-ul &rarr;
                </a>
              )}

              {/* Description */}
              {currentStim.description && (
                <p
                  style={{
                    fontSize: 13,
                    color: "#6B7280",
                    marginTop: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {currentStim.description}
                </p>
              )}
            </div>

            {/* R, I, F Sliders */}
            <div style={{ marginTop: 24 }}>
              {[
                {
                  key: "r" as const,
                  label: "R — Relevanta",
                  desc: "Cat de relevant este acest mesaj pentru publicul sau tinta?",
                  color: "#DC2626",
                },
                {
                  key: "i" as const,
                  label: "I — Interes",
                  desc: "Cat de interesant si captivant este continutul?",
                  color: "#D97706",
                },
                {
                  key: "f" as const,
                  label: "F — Forma",
                  desc: "Cat de bine este executat vizual/structural?",
                  color: "#7C3AED",
                },
              ].map((dim) => (
                <div key={dim.key} style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: dim.color,
                      }}
                    >
                      {dim.label}
                    </span>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 800,
                        fontFamily: "JetBrains Mono, monospace",
                        color: dim.color,
                      }}
                    >
                      {currentScores[dim.key]}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#9CA3AF",
                      marginBottom: 8,
                    }}
                  >
                    {dim.desc}
                  </p>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={currentScores[dim.key]}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setStimulusScores({
                        ...stimulusScores,
                        [currentStim.id]: {
                          ...currentScores,
                          [dim.key]: val,
                        },
                      });
                    }}
                    style={{
                      ...styles.slider,
                      accentColor: dim.color,
                    }}
                  />
                  <div style={styles.sliderLabels}>
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              ))}

              {/* Computed C */}
              <div style={styles.cScore}>
                <span style={{ fontSize: 12, letterSpacing: 2, color: "#6B7280" }}>
                  SCOR C CALCULAT
                </span>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    fontFamily: "JetBrains Mono, monospace",
                    color: "#DC2626",
                  }}
                >
                  {computeC(currentScores.r, currentScores.i, currentScores.f)}
                </div>
                <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                  C = R + (I &times; F) ={" "}
                  {currentScores.r} + ({currentScores.i} &times;{" "}
                  {currentScores.f})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p
            style={{
              color: "#DC2626",
              fontSize: 13,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}

        {/* Navigation */}
        <div style={styles.nav}>
          {step > 1 && (
            <button style={styles.btnSecondary} onClick={goBack}>
              &larr; Inapoi
            </button>
          )}
          <div style={{ flex: 1 }} />
          <button
            style={{
              ...styles.btnPrimary,
              opacity: saving ? 0.6 : 1,
            }}
            onClick={saveAndNext}
            disabled={saving}
          >
            {saving
              ? "Se salveaza..."
              : step >= totalSteps
              ? "Finalizeaza"
              : "Urmatorul \u2192"}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span>R IF C &mdash; Studiu de Perceptie &middot; </span>
        <a href="https://rifcmarketing.com" style={{ color: "#DC2626" }}>
          rifcmarketing.com
        </a>
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "Outfit, system-ui, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 16px",
  },
  progressWrap: {
    width: "100%",
    maxWidth: 700,
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    background: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    background: "linear-gradient(90deg, #DC2626, #059669)",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center" as const,
  },
  card: {
    width: "100%",
    maxWidth: 700,
    background: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    padding: "32px 28px",
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 1.6,
    marginBottom: 24,
  },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 6,
    marginTop: 16,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    color: "#111827",
    appearance: "auto" as const,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    background: "#fff",
    color: "#111827",
    boxSizing: "border-box" as const,
  },
  chip: {
    padding: "8px 14px",
    fontSize: 13,
    borderRadius: 20,
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    userSelect: "none" as const,
    transition: "all 0.15s",
  },
  chipActive: {
    background: "#DC2626",
    color: "#fff",
    borderColor: "#DC2626",
  },
  likertNum: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 22,
    height: 22,
    borderRadius: "50%",
    background: "#DC2626",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    marginRight: 8,
  },
  likertRow: {
    display: "flex",
    gap: 6,
    justifyContent: "center",
  },
  likertBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    fontSize: 16,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  likertBtnActive: {
    background: "#DC2626",
    color: "#fff",
    borderColor: "#DC2626",
  },
  likertLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 4,
    padding: "0 4px",
  },
  stimulusBox: {
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    background: "#fafafa",
  },
  stimulusMeta: {
    display: "flex",
    gap: 8,
    marginBottom: 10,
  },
  typeBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "3px 8px",
    borderRadius: 4,
    background: "#DC2626",
    color: "#fff",
  },
  industryBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#374151",
  },
  stimulusImg: {
    width: "100%",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    maxHeight: 400,
    objectFit: "cover" as const,
  },
  videoWrap: {
    position: "relative" as const,
    paddingBottom: "56.25%",
    height: 0,
    overflow: "hidden",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  videoIframe: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  textContent: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#374151",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 16,
    whiteSpace: "pre-wrap" as const,
  },
  pdfLink: {
    display: "inline-block",
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#DC2626",
    border: "1px solid #DC2626",
    borderRadius: 8,
    textDecoration: "none",
    marginTop: 8,
  },
  siteLink: {
    display: "inline-block",
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    color: "#2563EB",
    border: "1px solid #2563EB",
    borderRadius: 8,
    textDecoration: "none",
    marginTop: 8,
  },
  slider: {
    width: "100%",
    height: 8,
    cursor: "pointer",
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10,
    color: "#9CA3AF",
    marginTop: 2,
  },
  cScore: {
    textAlign: "center" as const,
    padding: 20,
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 12,
    marginTop: 16,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
    paddingTop: 20,
    borderTop: "1px solid #e5e7eb",
  },
  btnPrimary: {
    padding: "12px 28px",
    fontSize: 15,
    fontWeight: 600,
    color: "#fff",
    background: "#DC2626",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
  btnSecondary: {
    padding: "12px 20px",
    fontSize: 14,
    fontWeight: 500,
    color: "#6B7280",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    cursor: "pointer",
  },
  footer: {
    marginTop: 24,
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center" as const,
  },
};
