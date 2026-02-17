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
// Steps: 0=welcome, 1=gender, 2=age, 3=country, 4=urbanRural, 5=income, 6=education,
//        7=purchaseFreq, 8=channels, 9=onlineTime, 10=device,
//        11-15=psychographic (5 separate Likert questions, auto-advance),
//        16..N=stimulus eval, N+1=thank you

const PROFILE_STEPS = [
  { id: "welcome", title: "Bine ai venit!" },
  { id: "gender", title: "Care este genul tau?" },
  { id: "age", title: "Care este varsta ta?" },
  { id: "country", title: "In ce tara locuiesti?" },
  { id: "urbanRural", title: "Unde locuiesti?" },
  { id: "income", title: "Care este venitul tau lunar net?" },
  { id: "education", title: "Ce nivel de educatie ai?" },
  { id: "purchaseFreq", title: "Cat de des cumperi online?" },
  { id: "channels", title: "Ce canale media preferi?" },
  { id: "onlineTime", title: "Cat timp petreci online zilnic?" },
  { id: "device", title: "Ce dispozitiv folosesti cel mai des?" },
  { id: "psych1", title: "Cat de mult esti de acord?" },
  { id: "psych2", title: "Cat de mult esti de acord?" },
  { id: "psych3", title: "Cat de mult esti de acord?" },
  { id: "psych4", title: "Cat de mult esti de acord?" },
  { id: "psych5", title: "Cat de mult esti de acord?" },
];

// ── Countries list for autocomplete ──────────────────────
const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia",
  "Australia", "Austria", "Azerbaijan", "Bahrain", "Bangladesh", "Belarus", "Belgium",
  "Bolivia", "Bosnia si Hertegovina", "Brazilia", "Bulgaria", "Canada", "Chile", "China",
  "Cipru", "Colombia", "Congo", "Corea de Sud", "Costa Rica", "Croatia", "Cuba", "Cehia",
  "Danemarca", "Ecuador", "Egipt", "Elvetia", "Emiratele Arabe Unite", "Estonia",
  "Etiopia", "Filipine", "Finlanda", "Franta", "Georgia", "Germania", "Grecia",
  "Guatemala", "Haiti", "Honduras", "India", "Indonezia", "Irak", "Iran", "Irlanda",
  "Islanda", "Israel", "Italia", "Jamaica", "Japonia", "Iordania", "Kazakhstan",
  "Kenya", "Kuweit", "Letonia", "Liban", "Libia", "Lituania", "Luxemburg",
  "Macedonia de Nord", "Malaezia", "Malta", "Maroc", "Mexic", "Mongolia",
  "Muntenegru", "Nepal", "Nigeria", "Norvegia", "Noua Zeelanda", "Olanda",
  "Pakistan", "Panama", "Paraguay", "Peru", "Polonia", "Portugalia", "Qatar",
  "Rusia", "Serbia", "Singapore", "Slovacia", "Slovenia", "Spania", "Sri Lanka",
  "Statele Unite", "Suedia", "Siria", "Taiwan", "Tanzania", "Thailanda",
  "Tunisia", "Turcia", "Ucraina", "Ungaria", "Uruguay", "Uzbekistan", "Venezuela",
  "Vietnam",
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
    country: "",
    locationType: "",
    incomeRange: "",
    education: "",
  });
  // Country autocomplete state
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [behavioral, setBehavioral] = useState({
    purchaseFrequency: "",
    preferredChannels: [] as string[],
    dailyOnlineTime: "",
    primaryDevice: "",
  });
  const [psychographic, setPsychographic] = useState({
    adReceptivity: 0,
    visualPreference: 0,
    impulseBuying: 0,
    irrelevanceAnnoyance: 0,
    attentionCapture: 0,
  });

  // Stimulus evaluation
  const [stimulusScores, setStimulusScores] = useState<
    Record<string, { r: number; i: number; f: number; c: number; cta: number }>
  >({});
  const [attentionAnswer, setAttentionAnswer] = useState<number | null>(null);
  const attentionTarget = useRef<number>(Math.floor(Math.random() * 10) + 1); // random 1-10, stable per session
  const timerRef = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // ── Computed step boundaries ────────────────────────────
  const profileStepCount = PROFILE_STEPS.length; // 16 (0=welcome, 1-15=profile)
  const numStimuli = session?.stimuli?.length || 8;
  const stepsPerStimulus = 5; // R, I, F, C, CTA — each on its own page
  const firstStimulusStep = profileStepCount; // 16
  const lastStimulusStep = firstStimulusStep + (numStimuli * stepsPerStimulus) - 1;
  const thankYouStep = lastStimulusStep + 1;
  const totalSteps = thankYouStep;

  // Progress % (skip welcome from count)
  const pct = step <= 0 ? 0 : step >= thankYouStep ? 100 : Math.round((step / totalSteps) * 100);

  // ── Step indicator dashes ──────────────────────────────
  // Group profile steps, then each stimulus group (3 steps) = 1 dash
  const profileDashCount = profileStepCount - 1; // exclude welcome
  const totalDashes = profileDashCount + numStimuli;
  const stimDashIdx = step >= firstStimulusStep ? Math.floor((step - firstStimulusStep) / stepsPerStimulus) : -1;
  const currentDash = step <= 0 ? -1 : step >= thankYouStep ? totalDashes : step < firstStimulusStep ? step - 1 : profileDashCount + stimDashIdx;

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

  // ── Timer for stimulus steps (reset at first sub-step of each stimulus group) ──
  const stimGroupIdx = step >= firstStimulusStep && step <= lastStimulusStep
    ? Math.floor((step - firstStimulusStep) / stepsPerStimulus) : -1;
  const stimSubStep = step >= firstStimulusStep && step <= lastStimulusStep
    ? (step - firstStimulusStep) % stepsPerStimulus : -1; // 0=R, 1=I, 2=F
  useEffect(() => {
    if (step >= firstStimulusStep && step <= lastStimulusStep) {
      // Only reset timer on first sub-step (R) of each stimulus
      if (stimSubStep === 0) {
        timerRef.current = 0;
      }
      timerInterval.current = setInterval(() => {
        timerRef.current += 1;
      }, 1000);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [step, firstStimulusStep, lastStimulusStep, stimSubStep]);

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
  // Steps: 1=gender, 2=age, 3=country, 4=urbanRural, 5=income, 6=education,
  //        7=purchaseFreq, 8=channels(manual), 9=onlineTime, 10=device,
  //        11-15=psychographic (5 Likert, auto-advance each)
  const autoAdvanceProfile = useCallback((field: string, value: string, stepOffset: number) => {
    // Demographics auto-advance steps: 1=gender, 2=ageRange, 3=country, 4=locationType, 5=incomeRange, 6=education
    const demoFieldMap: Record<number, string> = { 1: "gender", 2: "ageRange", 3: "country", 4: "locationType", 5: "incomeRange", 6: "education" };
    const demoKey = demoFieldMap[stepOffset];
    if (demoKey) {
      const updatedDemographics = { ...demographics, [demoKey]: value };
      setDemographics(updatedDemographics);
      // At step 6 (education = last demographic), save demographics to API
      if (stepOffset === 6) {
        saveProfileToApi("demographic", updatedDemographics);
      }
    }

    // Behavioral auto-advance steps: 7=purchaseFrequency, 9=dailyOnlineTime, 10=primaryDevice
    const behFieldMap: Record<number, string> = { 7: "purchaseFrequency", 9: "dailyOnlineTime", 10: "primaryDevice" };
    const behKey = behFieldMap[stepOffset];
    if (behKey) {
      const updatedBehavioral = { ...behavioral, [behKey]: value };
      setBehavioral(updatedBehavioral);
      // At step 10 (device = last behavioral), save behavioral to API
      if (stepOffset === 10) {
        saveProfileToApi("behavioral", updatedBehavioral);
      }
    }

    // Psychographic auto-advance steps: 11=adReceptivity, 12=visualPreference, 13=impulseBuying, 14=irrelevanceAnnoyance, 15=attentionCapture
    const psychFieldMap: Record<number, string> = { 11: "adReceptivity", 12: "visualPreference", 13: "impulseBuying", 14: "irrelevanceAnnoyance", 15: "attentionCapture" };
    const psychKey = psychFieldMap[stepOffset];
    if (psychKey) {
      const numVal = parseInt(value, 10);
      const updatedPsychographic = { ...psychographic, [psychKey]: numVal };
      setPsychographic(updatedPsychographic);
      // At step 15 (attentionCapture = last psychographic), save to API
      if (stepOffset === 15) {
        saveProfileToApi("psychographic", updatedPsychographic);
      }
    }

    // Auto-advance after brief delay
    setTimeout(() => advanceTo(step + 1), 350);
  }, [step, advanceTo, demographics, behavioral, psychographic, saveProfileToApi]);

  // ── Auto-advance for stimulus sub-steps (R, I, F, C, CTA) ──────
  const autoAdvanceStimulus = useCallback((dimension: "r" | "i" | "f" | "c" | "cta", value: number) => {
    if (!session) return;
    const groupIdx = Math.floor((step - firstStimulusStep) / stepsPerStimulus);
    const stimId = session.stimuliOrder[groupIdx];
    const prev = stimulusScores[stimId] || { r: 0, i: 0, f: 0, c: 0, cta: 0 };
    const updated = { ...prev, [dimension]: value };
    setStimulusScores(s => ({ ...s, [stimId]: updated }));

    // On last sub-step (CTA, dimension === "cta"), fire-and-forget save to API
    if (dimension === "cta") {
      const isAttentionGroup = groupIdx === Math.floor(numStimuli / 2);
      const isLastStimulus = step === lastStimulusStep;
      fetch("/api/survey/step", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          step: groupIdx + 4, // offset for API step tracking
          type: "stimulus",
          data: {
            stimulusId: stimId,
            rScore: updated.r,
            iScore: updated.i,
            fScore: updated.f,
            cScore: updated.c,
            ctaScore: updated.cta,
            timeSpentSeconds: timerRef.current,
            isLast: isLastStimulus,
            ...(isAttentionGroup ? { attentionCheckAnswer: attentionAnswer, attentionCheckPassed: attentionAnswer === attentionTarget.current } : {}),
          },
        }),
      }).catch(() => {});
    }

    setTimeout(() => advanceTo(step + 1), 350);
  }, [step, session, firstStimulusStep, stepsPerStimulus, stimulusScores, numStimuli, lastStimulusStep, attentionAnswer, advanceTo]);

  // ── Save & advance step (for steps that need API save) ──
  const saveAndNext = useCallback(async () => {
    if (!session || saving) return;
    setSaving(true);
    setError(null);

    let type = "";
    let data: Record<string, unknown> = {};

    // Map profile completion to API save
    // Demographics saved by autoAdvanceProfile at step 6 (education)
    // Behavioral saved by autoAdvanceProfile at step 10 (device)
    // Psychographic saved by autoAdvanceProfile at step 15 (attentionCapture)
    // Stimulus: channels (step 8) still uses saveAndNext for multi-select
    if (step >= firstStimulusStep && step <= lastStimulusStep) {
      // This shouldn't be called for stimulus steps anymore (they use autoAdvanceStimulus)
      // But keep as fallback
      const groupIdx = Math.floor((step - firstStimulusStep) / stepsPerStimulus);
      const stimId = session.stimuliOrder[groupIdx];
      const scores = stimulusScores[stimId] || { r: 0, i: 0, f: 0, c: 0, cta: 0 };
      type = "stimulus";
      const isAttentionStep = groupIdx === Math.floor(numStimuli / 2);
      data = {
        stimulusId: stimId,
        rScore: scores.r,
        iScore: scores.i,
        fScore: scores.f,
        cScore: scores.c,
        ctaScore: scores.cta,
        timeSpentSeconds: timerRef.current,
        isLast: step === lastStimulusStep,
        ...(isAttentionStep ? { attentionCheckAnswer: attentionAnswer, attentionCheckPassed: attentionAnswer === attentionTarget.current } : {}),
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
    return (
      <div style={{ marginBottom: 16 }}>
        {/* Progress bar with percentage */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{
            flex: 1, height: 6, borderRadius: 3,
            background: "#e5e1d9",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%", borderRadius: 3,
              background: `linear-gradient(90deg, ${accentRed}, #D97706)`,
              width: `${pct}%`,
              transition: "width 300ms ease",
            }} />
          </div>
          <span style={{
            fontSize: 13, fontWeight: 700, color: accentRed,
            fontFamily: "Inter, sans-serif",
            minWidth: 38, textAlign: "right" as const,
          }}>
            {pct}%
          </span>
        </div>
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
              borderRadius: 10, padding: 16, marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
                Raspunsurile tale contribuie la un studiu stiintific despre
                perceptia materialelor de marketing. Datele sunt complet anonime.
              </p>
            </div>

            {/* Telegram follow section */}
            <div style={{
              background: "#faf8f5", border: "1px solid #e5e1d9",
              borderRadius: 12, padding: m ? 20 : 24, marginBottom: 24, width: "100%",
              textAlign: "center" as const,
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: textMuted, marginBottom: 10, textTransform: "uppercase" as const }}>
                A MARKETING PROTOCOL BY
              </p>
              <h3 style={{ fontSize: m ? 16 : 18, fontWeight: 700, color: textDark, marginBottom: 4, lineHeight: 1.3 }}>
                The Emotional Mathematics of Marketing
              </h3>
              <p style={{ fontSize: m ? 14 : 15, fontWeight: 600, color: accentRed, marginBottom: 16 }}>
                Dumitru Talmazan
              </p>
              <a
                href="https://t.me/talmazan_rifc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 28px", borderRadius: 12,
                  background: "#0088cc",
                  color: "#fff", fontSize: m ? 15 : 16, fontWeight: 700,
                  textDecoration: "none", cursor: "pointer",
                  border: "none", letterSpacing: 0.3,
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Urmareste pe Telegram
              </a>
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
  const currentStimGroupIdx = step >= firstStimulusStep && step <= lastStimulusStep
    ? Math.floor((step - firstStimulusStep) / stepsPerStimulus) : -1;
  const currentStimSubStep = step >= firstStimulusStep && step <= lastStimulusStep
    ? (step - firstStimulusStep) % stepsPerStimulus : -1; // 0=R, 1=I, 2=F
  const currentStim = currentStimGroupIdx >= 0 && currentStimGroupIdx < session.stimuli.length
    ? session.stimuli[currentStimGroupIdx]
    : null;
  const currentScores = currentStim
    ? stimulusScores[currentStim.id] || { r: 0, i: 0, f: 0, c: 0, cta: 0 }
    : { r: 0, i: 0, f: 0, c: 0, cta: 0 };

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

          {/* ═══ Step 3: Country ═══ */}
          {step === 3 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>In ce tara locuiesti?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              <OptionCard label="Moldova" value="Moldova" selected={demographics.country === "Moldova"} onSelect={(v) => autoAdvanceProfile("country", v, 3)} />
              <OptionCard label="Romania" value="Romania" selected={demographics.country === "Romania"} onSelect={(v) => autoAdvanceProfile("country", v, 3)} />

              {/* Altele — with autocomplete */}
              <div style={{ position: "relative", marginBottom: 8 }}>
                <div
                  style={{
                    ...S.optionCard,
                    ...(demographics.country && demographics.country !== "Moldova" && demographics.country !== "Romania" ? S.optionCardSelected : {}),
                    flexDirection: "column" as const,
                    alignItems: "stretch",
                    gap: 8,
                  }}
                  onClick={() => {
                    if (!countryDropdownOpen && demographics.country !== "Moldova" && demographics.country !== "Romania") {
                      setCountryDropdownOpen(true);
                    }
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      ...S.optionRadio,
                      ...(demographics.country && demographics.country !== "Moldova" && demographics.country !== "Romania" ? S.optionRadioSelected : {}),
                    }}>
                      {demographics.country && demographics.country !== "Moldova" && demographics.country !== "Romania" && <div style={S.optionDot} />}
                    </div>
                    <span>
                      {demographics.country && demographics.country !== "Moldova" && demographics.country !== "Romania"
                        ? `Alta tara: ${demographics.country}`
                        : "Alta tara..."}
                    </span>
                  </div>

                  {/* Autocomplete input — always show when this option is interacted with */}
                  {(countryDropdownOpen || (demographics.country && demographics.country !== "Moldova" && demographics.country !== "Romania")) && (
                    <div style={{ paddingLeft: 34 }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        style={{
                          ...S.input,
                          fontSize: 14,
                          padding: "10px 12px",
                        }}
                        placeholder="Scrie numele tarii..."
                        value={countrySearch}
                        autoFocus
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setCountryDropdownOpen(true);
                        }}
                        onFocus={() => setCountryDropdownOpen(true)}
                      />
                      {countryDropdownOpen && countrySearch.length >= 1 && (
                        <div style={{
                          maxHeight: 180,
                          overflowY: "auto",
                          border: "1.5px solid #e5e1d9",
                          borderTop: "none",
                          borderRadius: "0 0 10px 10px",
                          background: "#fff",
                        }}>
                          {COUNTRIES.filter(c =>
                            c.toLowerCase().includes(countrySearch.toLowerCase())
                          ).slice(0, 8).map(c => (
                            <div
                              key={c}
                              style={{
                                padding: "10px 14px",
                                fontSize: 14,
                                cursor: "pointer",
                                borderBottom: "1px solid #f0ece4",
                                color: textDark,
                                transition: "background 0.1s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f0e8")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                              onClick={() => {
                                setDemographics(prev => ({ ...prev, country: c }));
                                setCountrySearch(c);
                                setCountryDropdownOpen(false);
                                // Auto-advance after selection
                                setTimeout(() => advanceTo(step + 1), 350);
                              }}
                            >
                              {c}
                            </div>
                          ))}
                          {COUNTRIES.filter(c =>
                            c.toLowerCase().includes(countrySearch.toLowerCase())
                          ).length === 0 && (
                            <div style={{ padding: "10px 14px", fontSize: 13, color: textMuted }}>
                              Nicio tara gasita
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 4: Urban / Rural ═══ */}
          {step === 4 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>Unde locuiesti?</h2>
              <div style={S.selectHint}>SELECTEAZA UNA</div>

              <OptionCard label="Urban (oras)" value="urban" selected={demographics.locationType === "urban"} onSelect={(v) => autoAdvanceProfile("locationType", v, 4)} />
              <OptionCard label="Rural (sat, comuna)" value="rural" selected={demographics.locationType === "rural"} onSelect={(v) => autoAdvanceProfile("locationType", v, 4)} />

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 5: Income ═══ */}
          {step === 5 && (
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
                <OptionCard key={opt.value} {...opt} selected={demographics.incomeRange === opt.value} onSelect={(v) => autoAdvanceProfile("incomeRange", v, 5)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 6: Education ═══ */}
          {step === 6 && (
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
                <OptionCard key={opt.value} {...opt} selected={demographics.education === opt.value} onSelect={(v) => autoAdvanceProfile("education", v, 6)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                <div />
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

          {/* ═══ Steps 11-15: Psychographic (5 separate Likert pages, auto-advance) ═══ */}
          {step >= 11 && step <= 15 && (() => {
            const psychQuestions = [
              { key: "adReceptivity" as const, text: "Acord atentie reclamelor relevante pentru mine", num: 1 },
              { key: "visualPreference" as const, text: "Prefer reclamele cu design vizual atractiv", num: 2 },
              { key: "impulseBuying" as const, text: "Uneori cumpar impulsiv dupa ce vad o reclama", num: 3 },
              { key: "irrelevanceAnnoyance" as const, text: "Ma irita reclamele irelevante", num: 4 },
              { key: "attentionCapture" as const, text: "Ma opresc din scrollat la reclame interesante", num: 5 },
            ];
            const qIdx = step - 11;
            const q = psychQuestions[qIdx];
            return (
              <>
                {renderDashes()}
                <div style={S.questionNum}>INTREBAREA {String(profileQuestionNum).padStart(2, "0")}</div>
                <h2 style={{ ...S.questionTitle, fontSize: m ? 20 : 24, marginBottom: 8 }}>Cat de mult esti de acord?</h2>
                <p style={{ fontSize: m ? 11 : 12, color: textMuted, marginBottom: 6 }}>
                  Intrebarea {q.num} din 5
                </p>
                <div style={{
                  fontSize: m ? 16 : 18, fontWeight: 600, color: textDark, lineHeight: 1.5,
                  marginBottom: 20, padding: m ? "14px 16px" : "18px 20px",
                  background: "#faf8f5", border: "1px solid #e5e1d9", borderRadius: 10,
                  textAlign: "center" as const,
                }}>
                  {q.text}
                </div>
                <div style={{ fontSize: m ? 11 : 12, color: textMuted, marginBottom: 10, display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                  <span>1 = Total dezacord</span>
                  <span>7 = Total acord</span>
                </div>
                <div style={{ display: "flex", gap: m ? 6 : 8, justifyContent: "center", flexWrap: "wrap" as const }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                    <button
                      key={v}
                      style={{
                        ...S.likertBtn,
                        width: m ? 40 : 48, height: m ? 40 : 48, fontSize: m ? 16 : 18,
                        ...(psychographic[q.key] === v ? S.likertBtnActive : {}),
                      }}
                      onClick={() => autoAdvanceProfile(q.key, String(v), step)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={S.nav}>
                  <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                  <div />
                </div>
              </>
            );
          })()}

          {/* ═══ Stimulus evaluation steps (5 per stimulus: R, I, F, C, CTA) ═══ */}
          {step >= firstStimulusStep && step <= lastStimulusStep && currentStim && (() => {
            const dimensions: { key: "r" | "i" | "f" | "c" | "cta"; question: string; anchorLow: string; anchorHigh: string; color: string; shortLabel: string }[] = [
              {
                key: "r", shortLabel: "R",
                question: "Cat de relevant este acest mesaj pentru tine personal \u2014 pentru nevoile, interesele sau situatia ta de acum?",
                anchorLow: "Nu are nicio legatura cu mine",
                anchorHigh: "Exact ce aveam nevoie sa vad acum",
                color: "#DC2626",
              },
              {
                key: "i", shortLabel: "I",
                question: "Cat de interesant este ceea ce spune acest mesaj \u2014 informatia, oferta sau ideea din spatele lui?",
                anchorLow: "Nu ma atrage deloc, nimic nou sau util",
                anchorHigh: "Vreau imediat sa aflu mai multe",
                color: "#D97706",
              },
              {
                key: "f", shortLabel: "F",
                question: "Cat de bine este prezentat acest mesaj \u2014 vizual, structura, claritatea textului, calitatea executiei?",
                anchorLow: "Confuz, urat sau greu de parcurs",
                anchorHigh: "Impecabil, atractiv si usor de inteles",
                color: "#7C3AED",
              },
              {
                key: "c", shortLabel: "C",
                question: "Cat de clar ai inteles ce ti se ofera si ce ar trebui sa faci in continuare?",
                anchorLow: "Nu am inteles nimic din acest mesaj",
                anchorHigh: "Am inteles perfect: ce e, pentru cine e si ce pas urmeaza",
                color: "#059669",
              },
              {
                key: "cta", shortLabel: "CTA",
                question: "Cat de probabil este sa actionezi pe baza acestui mesaj \u2014 click, achizitie, inscriere, contactare?",
                anchorLow: "Nu as actiona sub nicio forma",
                anchorHigh: "As actiona imediat, fara ezitare",
                color: "#2563EB",
              },
            ];
            const dim = dimensions[currentStimSubStep];
            const isAttentionGroup = currentStimGroupIdx === Math.floor(numStimuli / 2);
            const showAttention = isAttentionGroup && currentStimSubStep === 4; // show on CTA step (last)

            return (
              <>
                {renderDashes()}
                <div style={S.questionNum}>
                  MATERIAL {currentStimGroupIdx + 1} DIN {session.stimuli.length}
                </div>

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

                  {currentStim.image_url && (
                    <img src={currentStim.image_url} alt={currentStim.name}
                      style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e1d9", maxHeight: m ? 180 : 300, objectFit: "cover" as const }}
                      loading="lazy" />
                  )}

                  {currentStim.video_url && extractYoutubeId(currentStim.video_url) && (
                    <div style={{ position: "relative" as const, paddingBottom: m ? "50%" : "56.25%", height: 0, overflow: "hidden", borderRadius: 8, border: "1px solid #e5e1d9" }}>
                      <iframe src={`https://www.youtube.com/embed/${extractYoutubeId(currentStim.video_url)}`}
                        title={currentStim.name} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                        allowFullScreen style={{ position: "absolute" as const, top: 0, left: 0, width: "100%", height: "100%", border: "none" }} />
                    </div>
                  )}

                  {currentStim.video_url && !extractYoutubeId(currentStim.video_url) && (
                    <video src={currentStim.video_url} controls playsInline preload="metadata"
                      style={{ width: "100%", maxHeight: m ? 180 : 300, borderRadius: 8, border: "1px solid #e5e1d9", background: "#000" }} />
                  )}

                  {currentStim.text_content && (
                    <div style={{
                      fontSize: 14, lineHeight: 1.7, color: textDark,
                      background: !currentStim.image_url && !currentStim.video_url ? "#fef3c7" : "#fff",
                      border: `1px solid ${!currentStim.image_url && !currentStim.video_url ? "#fcd34d" : "#e5e1d9"}`,
                      borderRadius: 8, padding: m ? 12 : 16, whiteSpace: "pre-wrap" as const, marginTop: 10,
                    }}>
                      {currentStim.text_content}
                    </div>
                  )}

                  {currentStim.pdf_url && (
                    <a href={currentStim.pdf_url} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: accentRed, border: `1px solid ${accentRed}`, borderRadius: 8, textDecoration: "none", marginTop: 8 }}>
                      Deschide PDF-ul &rarr;
                    </a>
                  )}

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

                {/* Current question */}
                <div style={{ marginTop: 16 }}>
                  {/* Step indicator mini: R · I · F · C · CTA */}
                  <div style={{ display: "flex", justifyContent: "center", gap: m ? 8 : 12, marginBottom: 14 }}>
                    {dimensions.map((d, idx) => (
                      <div key={d.key} style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                        color: idx === currentStimSubStep ? d.color : idx < currentStimSubStep ? "#a3a3a3" : "#d4d4d4",
                        borderBottom: idx === currentStimSubStep ? `2px solid ${d.color}` : "2px solid transparent",
                        paddingBottom: 3,
                      }}>
                        {d.shortLabel}
                      </div>
                    ))}
                  </div>

                  {/* Question text */}
                  <div style={{
                    fontSize: m ? 14 : 16, fontWeight: 500, color: textDark, lineHeight: 1.5,
                    marginBottom: 16, padding: m ? "12px 14px" : "14px 18px",
                    background: "#faf8f5", border: `2px solid ${dim.color}20`, borderRadius: 10,
                    textAlign: "center" as const,
                  }}>
                    {dim.question}
                  </div>

                  {/* 1-10 buttons */}
                  <div style={{ display: "flex", gap: m ? 4 : 6, justifyContent: "center", flexWrap: "wrap" as const }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                      <button
                        key={v}
                        style={{
                          width: m ? 36 : 44, height: m ? 36 : 44, fontSize: m ? 14 : 16,
                          fontWeight: 700, fontFamily: "Inter, sans-serif",
                          background: currentScores[dim.key] === v ? dim.color : "#faf8f5",
                          color: currentScores[dim.key] === v ? "#fff" : textDark,
                          border: `2px solid ${currentScores[dim.key] === v ? dim.color : "#e5e1d9"}`,
                          borderRadius: 8, cursor: "pointer",
                          transition: "all 150ms ease",
                        }}
                        onClick={() => autoAdvanceStimulus(dim.key, v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: m ? 9 : 10, color: textMuted, marginTop: 6, padding: "0 4px" }}>
                    <span>1 = {dim.anchorLow}</span>
                    <span>10 = {dim.anchorHigh}</span>
                  </div>
                </div>

                {/* Attention check at midpoint — anti-robot verification */}
                {showAttention && (
                  <div style={{ marginTop: 16, padding: m ? 14 : 18, background: "#fefce8", border: "1px solid #fde047", borderRadius: 10 }}>
                    <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, color: "#854d0e", marginBottom: 8 }}>
                      Verifica ca nu esti robot
                    </div>
                    <p style={{ fontSize: m ? 12 : 13, color: textDark, marginBottom: 10, lineHeight: 1.5 }}>
                      Alege cifra <strong style={{ fontSize: m ? 18 : 22, color: "#b45309" }}>{attentionTarget.current}</strong> din cele de mai jos.
                    </p>
                    <div style={{ display: "flex", gap: m ? 4 : 6, justifyContent: "center" }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(v => (
                        <button key={v}
                          style={{
                            ...S.likertBtn,
                            width: m ? 30 : 34, height: m ? 30 : 34, fontSize: m ? 12 : 13,
                            ...(attentionAnswer === v ? { background: "#b45309", color: "#fff", borderColor: "#b45309" } : {}),
                          }}
                          onClick={() => setAttentionAnswer(v)}>{v}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={S.nav}>
                  <button style={S.btnBack} onClick={goBack}>Inapoi</button>
                  <div />
                </div>
              </>
            );
          })()}
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
