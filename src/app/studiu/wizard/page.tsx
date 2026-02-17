"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   R IF C — Studiu de Perceptie Consumator
   Wizard cu card-based selection, auto-advance, welcome screen
   Mobile-first design (99% users on phone)
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

function useIsMobile(breakpoint = 640): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ── Sub-step definitions for profile section ───────────────
// Steps: 0=welcome, 1=gender, 2=age, 3=location, 4=income, 5=education, 6=occupation,
//        7=purchaseFreq, 8=channels, 9=onlineTime, 10=device, 11=psychographic,
//        12..N=stimulus eval, N+1=thank you

const PROFILE_STEPS = [
  { id: "welcome", title: "Bine ai venit!" },
  { id: "gender", title: "Care este genul tau?" },
  { id: "age", title: "Care este varsta ta?" },
  { id: "location", title: "Unde locuiesti?" },
  { id: "income", title: "Care este venitul tau lunar net?" },
  { id: "education", title: "Ce nivel de educatie ai?" },
  { id: "occupation", title: "Cu ce te ocupi?" },
  { id: "purchaseFreq", title: "Cat de des cumperi online?" },
  { id: "channels", title: "Ce canale media preferi?" },
  { id: "onlineTime", title: "Cat timp petreci online zilnic?" },
  { id: "device", title: "Ce dispozitiv folosesti cel mai des?" },
  { id: "psychographic", title: "Profil Psihografic" },
];

// ── Suspense wrapper (useSearchParams needs it) ──────────
export default function StudiuPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#f5f0e8" }} />}>
      <StudiuWizardInner />
    </Suspense>
  );
}

// ── Main Component ─────────────────────────────────────────
function StudiuWizardInner() {
  const isMobile = useIsMobile();
  const m = isMobile;
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") || "";

  const [session, setSession] = useState<SessionData | null>(null);
  const [step, setStep] = useState(-1); // -1=loading, 0=welcome, 1+=active steps
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

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
  const [attentionAnswer, setAttentionAnswer] = useState<number | null>(null);
  const timerRef = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // ── Computed step boundaries ────────────────────────────
  const profileStepCount = PROFILE_STEPS.length; // 12 (0=welcome, 1-11=profile)
  const numStimuli = session?.stimuli?.length || 8;
  const firstStimulusStep = profileStepCount; // 12
  const lastStimulusStep = firstStimulusStep + numStimuli - 1;
  const thankYouStep = lastStimulusStep + 1;
  const totalSteps = thankYouStep;

  // Progress % (skip welcome from count)
  const pct = step <= 0 ? 0 : step >= thankYouStep ? 100 : Math.round((step / totalSteps) * 100);

  // ── Step indicator dashes ──────────────────────────────
  // Group profile steps, then each stimulus is a dash
  const profileDashCount = profileStepCount - 1; // exclude welcome
  const totalDashes = profileDashCount + numStimuli;
  const currentDash = step <= 0 ? -1 : step >= thankYouStep ? totalDashes : step - 1;

  // ── Init: load session or create new ────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const s: SessionData = JSON.parse(saved);
          if (s.sessionId && s.stimuli?.length > 0) {
            setSession(s);
            // Map old step numbers to new ones
            const savedStep = s.currentStep || 0;
            setStep(savedStep);
            return;
          }
        }
      } catch { /* ignore */ }

      try {
        const res = await fetch("/api/survey/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tag ? { tag } : {}),
        });
        const data = await res.json();
        if (data.success) {
          const s: SessionData = {
            sessionId: data.sessionId,
            currentStep: 0,
            stimuliOrder: data.stimuli.map((st: Stimulus) => st.id),
            stimuli: data.stimuli,
          };
          localStorage.setItem(LS_KEY, JSON.stringify(s));
          setSession(s);
          setStep(0);
        } else {
          setError("Nu s-a putut porni sondajul. Reincarca pagina.");
        }
      } catch {
        setError("Eroare de conexiune. Verifica internetul si reincarca.");
      }
    };
    init();
  }, [tag]);

  // ── Timer for stimulus steps ────────────────────────────
  useEffect(() => {
    if (step >= firstStimulusStep && step <= lastStimulusStep) {
      timerRef.current = 0;
      timerInterval.current = setInterval(() => {
        timerRef.current += 1;
      }, 1000);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [step, firstStimulusStep, lastStimulusStep]);

  // ── Advance with transition ────────────────────────────
  const advanceTo = useCallback((nextStep: number) => {
    setTransitioning(true);
    // Persist step to localStorage for resume
    setSession(prev => {
      if (prev) {
        const updated = { ...prev, currentStep: nextStep };
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
    setTimeout(() => {
      setStep(nextStep);
      window.scrollTo(0, 0);
      setTimeout(() => setTransitioning(false), 50);
    }, 200);
  }, []);

  // ── Save profile data to API (fire-and-forget for UX speed) ──
  const saveProfileToApi = useCallback(async (type: string, payload: Record<string, unknown>) => {
    if (!session) return;
    try {
      await fetch("/api/survey/step", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          step: type === "demographic" ? 1 : type === "behavioral" ? 2 : 3,
          type,
          data: payload,
        }),
      });
    } catch { /* silent — will re-save on next opportunity */ }
  }, [session]);

  // ── Auto-advance for single-select profile steps ───────
  const autoAdvanceProfile = useCallback((field: string, value: string, stepOffset: number) => {
    if (stepOffset >= 1 && stepOffset <= 5) {
      // demographics steps (not step 6 = occupation, which is manual)
      const fieldMap: Record<number, string> = { 1: "gender", 2: "ageRange", 3: "locationType", 4: "incomeRange", 5: "education" };
      const key = fieldMap[stepOffset];
      if (key) {
        setDemographics(prev => ({ ...prev, [key]: value }));
      }
    } else if (stepOffset >= 7 && stepOffset <= 10) {
      const fieldMap: Record<number, string> = { 7: "purchaseFrequency", 9: "dailyOnlineTime", 10: "primaryDevice" };
      const key = fieldMap[stepOffset];
      if (key) {
        const updatedBehavioral = { ...behavioral, [key]: value };
        setBehavioral(updatedBehavioral);
        // At step 10 (device = last behavioral), save behavioral to API
        if (stepOffset === 10) {
          saveProfileToApi("behavioral", updatedBehavioral);
        }
      }
    }
    // Auto-advance after brief delay
    setTimeout(() => advanceTo(step + 1), 350);
  }, [step, advanceTo, behavioral, saveProfileToApi]);

  // ── Save & advance step (for steps that need API save) ──
  const saveAndNext = useCallback(async () => {
    if (!session || saving) return;
    setSaving(true);
    setError(null);

    let type = "";
    let data: Record<string, unknown> = {};

    // Map profile completion to API save
    if (step === 6) {
      // After occupation (last demographic field), save demographics
      type = "demographic";
      data = demographics;
    } else if (step === 10) {
      // After device (last behavioral field), save behavioral
      type = "behavioral";
      data = behavioral;
    } else if (step === 11) {
      // Psychographic
      type = "psychographic";
      data = psychographic;
    } else if (step >= firstStimulusStep && step <= lastStimulusStep) {
      const idx = step - firstStimulusStep;
      const stimId = session.stimuliOrder[idx];
      const scores = stimulusScores[stimId] || { r: 5, i: 5, f: 5 };
      type = "stimulus";
      const stimIdx = step - firstStimulusStep;
      const isAttentionStep = stimIdx === Math.floor(numStimuli / 2);
      data = {
        stimulusId: stimId,
        rScore: scores.r,
        iScore: scores.i,
        fScore: scores.f,
        timeSpentSeconds: timerRef.current,
        isLast: step === lastStimulusStep,
        ...(isAttentionStep ? { attentionCheckAnswer: attentionAnswer, attentionCheckPassed: attentionAnswer === 7 } : {}),
      };
    }

    // Only call API if we have data to save
    if (type) {
      try {
        const res = await fetch("/api/survey/step", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.sessionId,
            step: type === "demographic" ? 1 : type === "behavioral" ? 2 : type === "psychographic" ? 3 : step - firstStimulusStep + 4,
            type,
            data,
          }),
        });
        const result = await res.json();
        if (!result.success) {
          setError("Eroare la salvare. Incearca din nou.");
          setSaving(false);
          return;
        }
      } catch {
        setError("Eroare de conexiune.");
        setSaving(false);
        return;
      }
    }

    const nextStep = Math.min(step + 1, thankYouStep);
    const updated = { ...session, currentStep: nextStep };
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    setSession(updated);
    advanceTo(nextStep);
    setSaving(false);
  }, [session, step, saving, demographics, behavioral, psychographic, stimulusScores, firstStimulusStep, lastStimulusStep, thankYouStep, attentionAnswer, numStimuli, advanceTo]);

  const goBack = () => {
    if (step > 1) {
      advanceTo(step - 1);
    }
  };

  // ── Styles ────────────────────────────────────────────────
  const bgColor = "#f5f0e8";
  const cardBg = "#ffffff";
  const accentGreen = "#c8e64e";
  const accentRed = "#DC2626";
  const textDark = "#1a1a1a";
  const textMuted = "#8a8a7a";

  const S: Record<string, React.CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: bgColor,
      fontFamily: "'Inter', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: m ? "16px 12px" : "24px 16px",
      position: "relative",
    },
    cardOuter: {
      position: "relative" as const,
      width: "100%",
      maxWidth: m ? "100%" : 420,
    },
    // Stacked card shadow effect
    cardShadow1: {
      position: "absolute" as const,
      top: 6,
      left: 6,
      right: -6,
      bottom: -6,
      background: "#e8e3db",
      borderRadius: 16,
      transform: "rotate(1.5deg)",
    },
    cardShadow2: {
      position: "absolute" as const,
      top: 3,
      left: 3,
      right: -3,
      bottom: -3,
      background: "#ede8e0",
      borderRadius: 16,
      transform: "rotate(0.8deg)",
    },
    card: {
      position: "relative" as const,
      background: cardBg,
      borderRadius: 16,
      padding: m ? "28px 20px" : "36px 32px",
      zIndex: 2,
      minHeight: m ? 340 : 380,
      display: "flex",
      flexDirection: "column" as const,
      transition: "opacity 0.2s ease, transform 0.2s ease",
      opacity: transitioning ? 0 : 1,
      transform: transitioning ? "translateX(20px)" : "translateX(0)",
    },
    // Step indicator dashes
    dashWrap: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      marginBottom: 24,
    },
    dash: {
      height: 3,
      borderRadius: 2,
      flex: 1,
      maxWidth: 28,
      background: "#e0dbd3",
      transition: "background 0.3s ease",
    },
    dashActive: {
      background: textDark,
    },
    dashDone: {
      background: textDark,
    },
    // Close button
    closeBtn: {
      position: "absolute" as const,
      top: m ? 20 : 24,
      right: m ? 16 : 24,
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: "1px solid #e0dbd3",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: textMuted,
      fontSize: 14,
      zIndex: 3,
    },
    questionNum: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 2,
      textTransform: "uppercase" as const,
      color: textMuted,
      marginBottom: 8,
    },
    questionTitle: {
      fontSize: m ? 22 : 26,
      fontWeight: 700,
      color: textDark,
      lineHeight: 1.3,
      marginBottom: 24,
    },
    selectHint: {
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: 1.5,
      textTransform: "uppercase" as const,
      color: textMuted,
      marginBottom: 12,
    },
    // Option card (radio-like)
    optionCard: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: m ? "14px 16px" : "14px 18px",
      borderRadius: 10,
      border: "1.5px solid #e5e1d9",
      background: "#fff",
      cursor: "pointer",
      marginBottom: 8,
      transition: "all 0.15s ease",
      fontSize: m ? 15 : 16,
      fontWeight: 500,
      color: textDark,
      userSelect: "none" as const,
    },
    optionCardSelected: {
      border: `1.5px solid ${accentGreen}`,
      background: `${accentGreen}15`,
    },
    optionRadio: {
      width: 20,
      height: 20,
      borderRadius: "50%",
      border: "2px solid #d0cbc3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      transition: "all 0.15s ease",
    },
    optionRadioSelected: {
      border: `2px solid ${accentGreen}`,
      background: accentGreen,
    },
    optionDot: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: "#fff",
    },
    // Chip (multi-select)
    chip: {
      padding: m ? "10px 16px" : "10px 18px",
      fontSize: m ? 14 : 14,
      borderRadius: 24,
      border: "1.5px solid #e5e1d9",
      background: "#fff",
      color: textDark,
      cursor: "pointer",
      userSelect: "none" as const,
      transition: "all 0.15s ease",
      display: "inline-flex",
      alignItems: "center",
      fontWeight: 500,
    },
    chipActive: {
      background: accentGreen,
      color: textDark,
      borderColor: accentGreen,
      fontWeight: 600,
    },
    // Nav buttons
    nav: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: "auto",
      paddingTop: 20,
    },
    btnBack: {
      padding: "12px 20px",
      fontSize: 14,
      fontWeight: 500,
      color: textMuted,
      background: "transparent",
      border: "none",
      cursor: "pointer",
    },
    btnNext: {
      padding: m ? "12px 28px" : "12px 32px",
      fontSize: m ? 15 : 15,
      fontWeight: 600,
      color: textDark,
      background: accentGreen,
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      transition: "opacity 0.15s, transform 0.1s",
      display: "flex",
      alignItems: "center",
      gap: 6,
    },
    btnStart: {
      padding: m ? "16px 48px" : "16px 56px",
      fontSize: m ? 17 : 18,
      fontWeight: 700,
      color: "#fff",
      background: accentRed,
      border: "none",
      borderRadius: 12,
      cursor: "pointer",
      transition: "transform 0.15s",
      letterSpacing: 0.5,
    },
    // Input
    input: {
      width: "100%",
      padding: m ? "14px 16px" : "12px 16px",
      fontSize: 16,
      border: "1.5px solid #e5e1d9",
      borderRadius: 10,
      background: "#fff",
      color: textDark,
      boxSizing: "border-box" as const,
      outline: "none",
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    // Likert
    likertBtn: {
      width: m ? 38 : 42,
      height: m ? 38 : 42,
      borderRadius: 8,
      border: "1.5px solid #e5e1d9",
      background: "#fff",
      fontSize: m ? 14 : 15,
      fontWeight: 600,
      color: textDark,
      cursor: "pointer",
      transition: "all 0.15s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    likertBtnActive: {
      background: accentGreen,
      color: textDark,
      borderColor: accentGreen,
    },
    // Stimulus
    stimulusBox: {
      border: "1.5px solid #e5e1d9",
      borderRadius: 12,
      padding: m ? 14 : 18,
      background: "#faf9f6",
      marginBottom: 16,
    },
    typeBadge: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1,
      padding: "3px 8px",
      borderRadius: 4,
      background: accentRed,
      color: "#fff",
    },
    industryBadge: {
      fontSize: 10,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 4,
      background: "#e5e1d9",
      color: textDark,
    },
    sliderLabels: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 10,
      color: textMuted,
      marginTop: 2,
    },
    footer: {
      marginTop: m ? 16 : 20,
      fontSize: 12,
      color: textMuted,
      textAlign: "center" as const,
    },
  };

  // ── Option card renderer ─────────────────────────────────
  const OptionCard = ({ label, value, selected, onSelect, icon }: {
    label: string;
    value: string;
    selected: boolean;
    onSelect: (v: string) => void;
    icon?: string;
  }) => (
    <div
      style={{
        ...S.optionCard,
        ...(selected ? S.optionCardSelected : {}),
      }}
      onClick={() => onSelect(value)}
    >
      <div style={{
        ...S.optionRadio,
        ...(selected ? S.optionRadioSelected : {}),
      }}>
        {selected && <div style={S.optionDot} />}
      </div>
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <span>{label}</span>
    </div>
  );

  // ── Render step indicator (dashes) ─────────────────────
  const renderDashes = () => {
    // Show max ~8 dashes to keep it clean, group them
    const maxDashes = m ? 6 : 8;
    const showDashes = Math.min(totalDashes, maxDashes);
    const dashProgress = currentDash;

    return (
      <div style={S.dashWrap}>
        {Array.from({ length: showDashes }).map((_, i) => {
          const mappedIdx = Math.floor((i / showDashes) * totalDashes);
          const isDone = dashProgress > mappedIdx;
          const isActive = dashProgress === mappedIdx;
          return (
            <div
              key={i}
              style={{
                ...S.dash,
                ...(isDone ? S.dashDone : {}),
                ...(isActive ? S.dashActive : {}),
              }}
            />
          );
        })}
      </div>
    );
  };

  // ── Loading state ───────────────────────────────────────
  if (step === -1 || !session) {
    return (
      <div style={S.page}>
        <div style={S.cardOuter}>
          <div style={S.cardShadow1} />
          <div style={S.cardShadow2} />
          <div style={{ ...S.card, alignItems: "center", justifyContent: "center" }}>
            {error ? (
              <p style={{ color: accentRed, textAlign: "center" }}>{error}</p>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  border: `3px solid ${accentRed}`, borderTopColor: "transparent",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }} />
                <p style={{ color: textMuted, fontSize: 14 }}>Se incarca sondajul...</p>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  // ── Complete / Thank you state ──────────────────────────
  if (step >= thankYouStep) {
    return (
      <div style={S.page}>
        <div style={S.cardOuter}>
          <div style={S.cardShadow1} />
          <div style={S.cardShadow2} />
          <div style={{ ...S.card, alignItems: "center", textAlign: "center" as const, padding: m ? "40px 20px" : "48px 32px" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#059669", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, marginBottom: 20,
            }}>
              &#10003;
            </div>
            <h2 style={{ fontSize: m ? 22 : 26, fontWeight: 700, marginBottom: 8, color: textDark }}>
              Multumim!
            </h2>
            <p style={{ color: textMuted, marginBottom: 24, fontSize: m ? 14 : 15, lineHeight: 1.6 }}>
              Ai evaluat {session.stimuli.length} materiale de marketing.
              Raspunsurile tale au fost inregistrate cu succes.
            </p>
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: 16, marginBottom: 20,
            }}>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
                Raspunsurile tale contribuie la un studiu stiintific despre
                perceptia materialelor de marketing. Datele sunt complet anonime.
              </p>
            </div>
            <p style={{ fontSize: 12, color: textMuted }}>
              Trimite sondajul si altora: <strong>rifcmarketing.com/studiu/wizard</strong>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Get current stimulus ────────────────────────────────
  const currentStimIdx = step >= firstStimulusStep && step <= lastStimulusStep ? step - firstStimulusStep : -1;
  const currentStim = currentStimIdx >= 0 && currentStimIdx < session.stimuli.length
    ? session.stimuli[currentStimIdx]
    : null;
  const currentScores = currentStim
    ? stimulusScores[currentStim.id] || { r: 5, i: 5, f: 5 }
    : { r: 5, i: 5, f: 5 };

  // ── Profile step question number ────────────────────────
  const profileQuestionNum = step >= 1 && step < profileStepCount ? step : 0;

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      <div style={S.cardOuter}>
        <div style={S.cardShadow1} />
        <div style={S.cardShadow2} />

        <div style={S.card}>
          {/* ═══ Welcome Screen (step 0) ═══ */}
          {step === 0 && (
            <>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                {/* Logo / brand mark */}
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: `linear-gradient(135deg, ${accentRed}, #b91c1c)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 24,
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
                  </svg>
                </div>

                <h1 style={{ fontSize: m ? 24 : 30, fontWeight: 800, color: textDark, marginBottom: 8, lineHeight: 1.2 }}>
                  Studiu de Perceptie
                </h1>
                <p style={{ fontSize: m ? 14 : 16, color: textMuted, lineHeight: 1.6, marginBottom: 8, maxWidth: 320 }}>
                  Salut! Te invitam sa participi la un studiu stiintific despre cum percepi materialele de marketing.
                </p>
                <p style={{ fontSize: m ? 13 : 14, color: textMuted, lineHeight: 1.6, marginBottom: 32, maxWidth: 320 }}>
                  Dureaza aproximativ <strong style={{ color: textDark }}>5-8 minute</strong>. Toate raspunsurile sunt <strong style={{ color: textDark }}>complet anonime</strong>.
                </p>

                <button
                  style={S.btnStart}
                  onClick={() => advanceTo(1)}
                  onMouseDown={(e) => ((e.target as HTMLElement).style.transform = "scale(0.97)")}
                  onMouseUp={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                >
                  Incepe sondajul
                </button>

                <p style={{ fontSize: 11, color: textMuted, marginTop: 20, opacity: 0.7 }}>
                  {numStimuli} materiale de evaluat
                </p>
              </div>
            </>
          )}

          {/* ═══ Step 1: Gender ═══ */}
          {step === 1 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Care este genul tau?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              <OptionCard label="Femeie" value="feminin" icon="&#9792;" selected={demographics.gender === "feminin"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label="Barbat" value="masculin" icon="&#9794;" selected={demographics.gender === "masculin"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label="Altul" value="altul" selected={demographics.gender === "altul"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label="Prefer sa nu spun" value="prefer_nu_spun" selected={demographics.gender === "prefer_nu_spun"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />

              <div style={S.nav}>
                <div />
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 2: Age ═══ */}
          {step === 2 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Care este varsta ta?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "18-24 ani", value: "18-24" },
                { label: "25-34 ani", value: "25-34" },
                { label: "35-44 ani", value: "35-44" },
                { label: "45-54 ani", value: "45-54" },
                { label: "55-64 ani", value: "55-64" },
                { label: "65+ ani", value: "65+" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={demographics.ageRange === opt.value} onSelect={(v) => autoAdvanceProfile("ageRange", v, 2)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 3: Location ═══ */}
          {step === 3 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Unde locuiesti?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              <OptionCard label="Urban (oras)" value="urban" selected={demographics.locationType === "urban"} onSelect={(v) => autoAdvanceProfile("locationType", v, 3)} />
              <OptionCard label="Rural (sat, comuna)" value="rural" selected={demographics.locationType === "rural"} onSelect={(v) => autoAdvanceProfile("locationType", v, 3)} />

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 4: Income ═══ */}
          {step === 4 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Care este venitul tau lunar net?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "Sub 500 EUR", value: "sub_500" },
                { label: "500 - 1.000 EUR", value: "500_1000" },
                { label: "1.000 - 2.000 EUR", value: "1000_2000" },
                { label: "Peste 2.000 EUR", value: "peste_2000" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={demographics.incomeRange === opt.value} onSelect={(v) => autoAdvanceProfile("incomeRange", v, 4)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 5: Education ═══ */}
          {step === 5 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Ce nivel de educatie ai?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "Liceu", value: "liceu" },
                { label: "Universitate (Licenta)", value: "universitate" },
                { label: "Master", value: "master" },
                { label: "Doctorat", value: "doctorat" },
                { label: "Altul", value: "altul" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={demographics.education === opt.value} onSelect={(v) => autoAdvanceProfile("education", v, 5)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 6: Occupation (text input — needs manual Next) ═══ */}
          {step === 6 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Cu ce te ocupi?</h2>

              <input
                type="text"
                style={S.input}
                placeholder="Ex: Manager Marketing, Student, Antreprenor..."
                value={demographics.occupation}
                onChange={(e) => setDemographics({ ...demographics, occupation: e.target.value })}
                autoFocus
              />

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <button
                  style={{ ...S.btnNext, opacity: saving ? 0.6 : 1 }}
                  onClick={saveAndNext}
                  disabled={saving}
                >
                  {saving ? "..." : "Urmatorul"} <span style={{ fontSize: 18 }}>&rarr;</span>
                </button>
              </div>
            </>
          )}

          {/* ═══ Step 7: Purchase Frequency ═══ */}
          {step === 7 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Cat de des cumperi online?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "Zilnic", value: "zilnic" },
                { label: "Saptamanal", value: "saptamanal" },
                { label: "Lunar", value: "lunar" },
                { label: "Rar (cateva ori pe an)", value: "rar" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.purchaseFrequency === opt.value} onSelect={(v) => autoAdvanceProfile("purchaseFrequency", v, 7)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 8: Channels (multi-select — needs manual Next) ═══ */}
          {step === 8 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Ce canale media preferi?</h2>
              <div style={S.selectHint}>SELECTEAZA MAI MULTE</div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                {[
                  "Social Media", "Email", "TV", "Radio", "Print", "Outdoor", "Online Search",
                ].map((ch) => (
                  <div
                    key={ch}
                    style={{
                      ...S.chip,
                      ...(behavioral.preferredChannels.includes(ch) ? S.chipActive : {}),
                    }}
                    onClick={() => {
                      const channels = behavioral.preferredChannels.includes(ch)
                        ? behavioral.preferredChannels.filter((c) => c !== ch)
                        : [...behavioral.preferredChannels, ch];
                      setBehavioral({ ...behavioral, preferredChannels: channels });
                    }}
                  >
                    {ch}
                  </div>
                ))}
              </div>

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <button
                  style={{ ...S.btnNext, opacity: behavioral.preferredChannels.length === 0 ? 0.5 : 1 }}
                  onClick={() => advanceTo(step + 1)}
                  disabled={behavioral.preferredChannels.length === 0}
                >
                  Urmatorul <span style={{ fontSize: 18 }}>&rarr;</span>
                </button>
              </div>
            </>
          )}

          {/* ═══ Step 9: Online Time ═══ */}
          {step === 9 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Cat timp petreci online zilnic?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "Sub 1 ora", value: "sub_1h" },
                { label: "1-3 ore", value: "1_3h" },
                { label: "3-5 ore", value: "3_5h" },
                { label: "Peste 5 ore", value: "peste_5h" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.dailyOnlineTime === opt.value} onSelect={(v) => autoAdvanceProfile("dailyOnlineTime", v, 9)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 10: Device ═══ */}
          {step === 10 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Ce dispozitiv folosesti cel mai des?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              {[
                { label: "Telefon mobil", value: "telefon" },
                { label: "Laptop / PC", value: "laptop_pc" },
                { label: "Tableta", value: "tableta" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.primaryDevice === opt.value} onSelect={(v) => {
                  autoAdvanceProfile("primaryDevice", v, 10);
                }} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 11: Psychographic (Likert — needs manual Next) ═══ */}
          {step === 11 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={{ ...S.questionTitle, fontSize: m ? 20 : 24 }}>Cat de mult esti de acord?</h2>
              <p style={{ fontSize: m ? 12 : 13, color: textMuted, marginBottom: 20, lineHeight: 1.5 }}>
                1 = Total dezacord &nbsp;&middot;&nbsp; 7 = Total acord
              </p>

              {[
                { key: "adReceptivity" as const, text: "Acord atentie reclamelor relevante pentru mine" },
                { key: "visualPreference" as const, text: "Prefer reclamele cu design vizual atractiv" },
                { key: "impulseBuying" as const, text: "Uneori cumpar impulsiv dupa ce vad o reclama" },
                { key: "irrelevanceAnnoyance" as const, text: "Ma irita reclamele irelevante" },
                { key: "attentionCapture" as const, text: "Ma opresc din scrollat la reclame interesante" },
              ].map((item, idx) => (
                <div key={item.key} style={{ marginBottom: m ? 16 : 20 }}>
                  <div style={{ fontSize: m ? 13 : 14, color: textDark, marginBottom: 8, lineHeight: 1.4 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 22, height: 22, borderRadius: "50%",
                      background: accentRed, color: "#fff", fontSize: 11, fontWeight: 700,
                      marginRight: 8,
                    }}>{idx + 1}</span>
                    {item.text}
                  </div>
                  <div style={{ display: "flex", gap: m ? 4 : 6, justifyContent: "center" }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                      <button
                        key={v}
                        style={{
                          ...S.likertBtn,
                          ...(psychographic[item.key] === v ? S.likertBtnActive : {}),
                        }}
                        onClick={() => setPsychographic({ ...psychographic, [item.key]: v })}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: textMuted, marginTop: 3, padding: "0 4px" }}>
                    <span>Dezacord</span>
                    <span>Acord</span>
                  </div>
                </div>
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <button
                  style={{ ...S.btnNext, opacity: saving ? 0.6 : 1 }}
                  onClick={saveAndNext}
                  disabled={saving}
                >
                  {saving ? "..." : "Urmatorul"} <span style={{ fontSize: 18 }}>&rarr;</span>
                </button>
              </div>
            </>
          )}

          {/* ═══ Stimulus evaluation steps ═══ */}
          {step >= firstStimulusStep && step <= lastStimulusStep && currentStim && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>
                MATERIAL {currentStimIdx + 1} DIN {session.stimuli.length}
              </div>
              <h2 style={{ ...S.questionTitle, fontSize: m ? 18 : 22, marginBottom: 16 }}>
                Evalueaza materialul
              </h2>

              {/* Stimulus display */}
              <div style={S.stimulusBox}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" as const }}>
                  <span style={S.typeBadge}>{currentStim.type}</span>
                  {currentStim.industry && (
                    <span style={S.industryBadge}>{currentStim.industry}</span>
                  )}
                </div>
                <h3 style={{ fontSize: m ? 15 : 17, color: textDark, marginBottom: 12, fontWeight: 600 }}>
                  {currentStim.name}
                </h3>

                {/* Image */}
                {currentStim.image_url && (
                  <img
                    src={currentStim.image_url}
                    alt={currentStim.name}
                    style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e1d9", maxHeight: m ? 220 : 360, objectFit: "cover" as const }}
                    loading="lazy"
                  />
                )}

                {/* YouTube video */}
                {currentStim.video_url && extractYoutubeId(currentStim.video_url) && (
                  <div style={{ position: "relative" as const, paddingBottom: m ? "50%" : "56.25%", height: 0, overflow: "hidden", borderRadius: 8, border: "1px solid #e5e1d9" }}>
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYoutubeId(currentStim.video_url)}`}
                      title={currentStim.name}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      allowFullScreen
                      style={{ position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                    />
                  </div>
                )}

                {/* Direct video */}
                {currentStim.video_url && !extractYoutubeId(currentStim.video_url) && (
                  <video src={currentStim.video_url} controls playsInline preload="metadata"
                    style={{ width: "100%", maxHeight: m ? 220 : 360, borderRadius: 8, border: "1px solid #e5e1d9", background: "#000" }} />
                )}

                {/* Text content */}
                {currentStim.text_content && (
                  <div style={{
                    fontSize: m ? 14 : 14, lineHeight: 1.7, color: textDark,
                    background: !currentStim.image_url && !currentStim.video_url ? "#fef3c7" : "#fff",
                    border: `1px solid ${!currentStim.image_url && !currentStim.video_url ? "#fcd34d" : "#e5e1d9"}`,
                    borderRadius: 8, padding: m ? 12 : 16, whiteSpace: "pre-wrap" as const, marginTop: 10,
                  }}>
                    {currentStim.text_content}
                  </div>
                )}

                {/* PDF */}
                {currentStim.pdf_url && (
                  <a href={currentStim.pdf_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: accentRed, border: `1px solid ${accentRed}`, borderRadius: 8, textDecoration: "none", marginTop: 8 }}>
                    Deschide PDF-ul &rarr;
                  </a>
                )}

                {/* Site URL */}
                {currentStim.site_url && (
                  <a href={currentStim.site_url} target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#2563EB", border: "1px solid #2563EB", borderRadius: 8, textDecoration: "none", marginTop: 8 }}>
                    Viziteaza site-ul &rarr;
                  </a>
                )}

                {currentStim.description && (
                  <p style={{ fontSize: 13, color: textMuted, marginTop: 12, lineHeight: 1.6 }}>
                    {currentStim.description}
                  </p>
                )}
              </div>

              {/* R, I, F Evaluation */}
              <div style={{ marginTop: 8 }}>
                {[
                  { key: "r" as const, label: "Relevanta", desc: "Cat de relevant este pentru publicul tinta?", color: "#DC2626" },
                  { key: "i" as const, label: "Impact & Interes", desc: "Cat de captivant este continutul?", color: "#D97706" },
                  { key: "f" as const, label: "Calitate Executie", desc: "Cat de bine este executat?", color: "#7C3AED" },
                ].map((dim) => (
                  <div key={dim.key} style={{ marginBottom: m ? 14 : 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: m ? 13 : 14, fontWeight: 700, color: dim.color }}>{dim.label}</span>
                      <span style={{ fontSize: m ? 20 : 24, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: dim.color }}>{currentScores[dim.key]}</span>
                    </div>
                    <p style={{ fontSize: m ? 11 : 12, color: textMuted, marginBottom: 8 }}>{dim.desc}</p>
                    <input
                      type="range" min={1} max={10}
                      value={currentScores[dim.key]}
                      className={`wizard-slider slider-${dim.key}`}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setStimulusScores({ ...stimulusScores, [currentStim.id]: { ...currentScores, [dim.key]: val } });
                      }}
                      style={{ width: "100%" }}
                    />
                    {/* Tap buttons for mobile */}
                    {m && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, gap: 2 }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                          <button key={v}
                            onClick={() => setStimulusScores({ ...stimulusScores, [currentStim.id]: { ...currentScores, [dim.key]: v } })}
                            style={{
                              flex: 1, height: 28, fontSize: 11,
                              fontWeight: currentScores[dim.key] === v ? 700 : 400,
                              background: currentScores[dim.key] === v ? dim.color : "transparent",
                              color: currentScores[dim.key] === v ? "#fff" : textMuted,
                              border: "none", borderRadius: 4, cursor: "pointer", padding: 0,
                            }}>{v}</button>
                        ))}
                      </div>
                    )}
                    {!m && (
                      <div style={S.sliderLabels}><span>1</span><span>5</span><span>10</span></div>
                    )}
                  </div>
                ))}

                {/* Attention check at midpoint */}
                {currentStimIdx === Math.floor(numStimuli / 2) && (
                  <div style={{ marginTop: 12, padding: m ? 14 : 18, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10 }}>
                    <div style={{ fontSize: m ? 13 : 14, fontWeight: 600, color: "#166534", marginBottom: 8 }}>
                      Verificare atentie
                    </div>
                    <p style={{ fontSize: m ? 12 : 13, color: textDark, marginBottom: 10, lineHeight: 1.5 }}>
                      Selecteaza valoarea <strong>7</strong> mai jos.
                    </p>
                    <div style={{ display: "flex", gap: m ? 4 : 6, justifyContent: "center" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                        <button key={v}
                          style={{
                            ...S.likertBtn,
                            width: m ? 30 : 34, height: m ? 30 : 34, fontSize: m ? 12 : 13,
                            ...(attentionAnswer === v ? { background: "#059669", color: "#fff", borderColor: "#059669" } : {}),
                          }}
                          onClick={() => setAttentionAnswer(v)}>{v}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && <p style={{ color: accentRed, fontSize: 13, marginTop: 12, textAlign: "center" }}>{error}</p>}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <button
                  style={{ ...S.btnNext, opacity: saving ? 0.6 : 1 }}
                  onClick={saveAndNext}
                  disabled={saving}
                >
                  {saving ? "..." : step === lastStimulusStep ? "Finalizeaza" : "Urmatorul"} <span style={{ fontSize: 18 }}>&rarr;</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      {step > 0 && step < thankYouStep && (
        <div style={S.footer}>
          <span>Studiu de Perceptie &middot; </span>
          <a href="https://rifcmarketing.com" style={{ color: accentRed }}>rifcmarketing.com</a>
        </div>
      )}

      {/* Global styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }

        /* Slider styling */
        input[type="range"].wizard-slider {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: #e5e1d9;
          outline: none;
        }
        input[type="range"].wizard-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .slider-r::-webkit-slider-thumb { background: #DC2626; }
        .slider-i::-webkit-slider-thumb { background: #D97706; }
        .slider-f::-webkit-slider-thumb { background: #7C3AED; }
        input[type="range"].wizard-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .slider-r::-moz-range-thumb { background: #DC2626; }
        .slider-i::-moz-range-thumb { background: #D97706; }
        .slider-f::-moz-range-thumb { background: #7C3AED; }

        /* Focus styles */
        input[type="text"]:focus {
          border-color: #c8e64e !important;
          box-shadow: 0 0 0 3px rgba(200, 230, 78, 0.2);
        }
      `}</style>
    </div>
  );
}
