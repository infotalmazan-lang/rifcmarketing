"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { fbTrack, fbTrackCustom } from "@/components/FacebookPixel";

/* ═══════════════════════════════════════════════════════════
   R IF C — Studiu de Perceptie Consumator
   Wizard cu card-based selection, auto-advance, welcome screen
   Mobile-first design (99% users on phone)
   ═══════════════════════════════════════════════════════════ */

const LS_KEY_REAL = "rifc-survey-session";
const LS_KEY_PREVIEW = "rifc-survey-preview";

// ── Types ──────────────────────────────────────────────────
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

interface SessionData {
  sessionId: string;
  currentStep: number;
  stimuliOrder: string[];
  stimuli: Stimulus[];
}

// ── GA4 Analytics ──────────────────────────────────────────
function trackEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", eventName, params);
  }
}

// ── Browser fingerprint for duplicate detection ────────────
async function generateFingerprint(): Promise<string> {
  try {
    const components: string[] = [];
    // Screen
    components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
    // Timezone
    components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    // Language
    components.push(navigator.language || "");
    components.push((navigator.languages || []).join(","));
    // Platform
    components.push(navigator.platform || "");
    // Hardware concurrency
    components.push(String(navigator.hardwareConcurrency || 0));
    // Device memory (if available)
    components.push(String((navigator as unknown as { deviceMemory?: number }).deviceMemory || 0));
    // Touch support
    components.push(String(navigator.maxTouchPoints || 0));
    // Canvas fingerprint
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 50;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("RIFC fp", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("RIFC fp", 4, 17);
        components.push(canvas.toDataURL().slice(-50));
      }
    } catch { /* canvas blocked */ }
    // WebGL renderer
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      if (gl) {
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        if (dbg) {
          components.push(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
        }
      }
    } catch { /* webgl blocked */ }

    // Hash all components
    const raw = components.join("|");
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
  } catch {
    return "unknown";
  }
}

const STEP_LABELS: Record<number, string> = {
  0: "welcome",
  1: "demographics_gender",
  2: "demographics_age",
  3: "demographics_country",
  4: "demographics_location",
  5: "demographics_income",
  6: "demographics_education",
  7: "behavioral_purchase_freq",
  8: "behavioral_channels",
  9: "behavioral_online_time",
  10: "behavioral_device",
  11: "psychographic_ad_receptivity",
  12: "psychographic_visual_pref",
  13: "psychographic_marketing_expertise",
  14: "psychographic_irrelevance",
  15: "psychographic_attention",
  16: "psychographic_irrelevance_tolerance",
};

function getStepLabel(stepNum: number, profileSteps: number, stepsPerStim: number, thankYou: number): string {
  if (stepNum >= thankYou) return "thank_you";
  if (STEP_LABELS[stepNum]) return STEP_LABELS[stepNum];
  // Stimulus steps
  if (stepNum >= profileSteps) {
    const stimOffset = stepNum - profileSteps;
    const stimIdx = Math.floor(stimOffset / stepsPerStim);
    const subStep = stimOffset % stepsPerStim;
    const dims = ["c", "r", "i", "f", "cta", "brand"];
    return `stimulus_${stimIdx + 1}_${dims[subStep] || "unknown"}`;
  }
  return `step_${stepNum}`;
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

// ── Category labels & colors for interstitial screens ──────
const CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  Site:       { label: "Site / Landing Page", color: "#DC2626", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" },
  Social:     { label: "Social Media", color: "#2563EB", icon: "M18 8A6 6 0 006 8c0 7-3 9-6 9h12c-3 0-6-2-6-9M13.73 21a2 2 0 01-3.46 0" },
  Video:      { label: "Video Advertising", color: "#7C3AED", icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  Email:      { label: "Email Marketing", color: "#059669", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  Billboard:  { label: "Billboard / Outdoor", color: "#D97706", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  SMS:        { label: "SMS Marketing", color: "#EC4899", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  Ambalaj:    { label: "Ambalaj / Etichetă", color: "#14B8A6", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2" },
  Google:     { label: "Google ADS", color: "#0891B2", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  RadioTV:    { label: "Spoturi Radio / TV", color: "#4338CA", icon: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" },
  Influencer: { label: "Influence Marketing", color: "#B45309", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
};

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
  { id: "psych6", title: "Cat de mult esti de acord?" },
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
  const { locale, setLocale, t } = useTranslation();
  const w = t.wizard;

  // Helper: translate category type to localized label
  const catLabel = (type: string): string => {
    const map: Record<string, string> = {
      Site: w.catSiteLanding, Social: w.catSocialMedia, Video: w.catVideoAds,
      Email: w.catEmailMarketing, Billboard: w.catBillboard, SMS: w.catSMS,
      Ambalaj: w.catPackaging, Google: w.catGoogleAds, RadioTV: w.catRadioTV,
      Influencer: w.catInfluencer,
    };
    return map[type] || CATEGORY_META[type]?.label || type;
  };
  const searchParams = useSearchParams();
  const tag = searchParams.get("tag") || "";
  const forceReset = searchParams.get("reset") === "1";
  const isPreview = searchParams.get("preview") === "1";
  const LS_KEY = isPreview ? LS_KEY_PREVIEW : LS_KEY_REAL;

  const [session, setSession] = useState<SessionData | null>(null);
  const [step, setStep] = useState(-1); // -1=loading, 0=welcome, 1+=active steps
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  // Pre-loaded stimuli (fetched on page load, before session creation)
  const [preloadedStimuli, setPreloadedStimuli] = useState<Stimulus[] | null>(null);
  const [startingSession, setStartingSession] = useState(false);

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
    marketingExpertise: 0,
    irrelevanceAnnoyance: 0,
    attentionCapture: 0,
    irrelevanceTolerance: 0,
  });

  // Stimulus evaluation
  const [stimulusScores, setStimulusScores] = useState<
    Record<string, { r: number; i: number; f: number; c: number; cta: number; brand: boolean | null }>
  >({});
  const [attentionAnswer, setAttentionAnswer] = useState<number | null>(null);
  const attentionTarget = useRef<number>(Math.floor(Math.random() * 10) + 1); // random 1-10, stable per session
  const timerRef = useRef<number>(0);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);
  // Interstitial: show category intro before first sub-step (R) of each stimulus
  const [interstitialDismissed, setInterstitialDismissed] = useState<Set<number>>(new Set());
  // Fullscreen image viewer
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // ── Computed step boundaries ────────────────────────────
  const profileStepCount = PROFILE_STEPS.length; // 17 (0=welcome, 1-16=profile)
  const numStimuli = session?.stimuli?.length || preloadedStimuli?.length || 8;
  const stepsPerStimulus = 6; // R, I, F, C, CTA, BRAND — each on its own page
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

  // ── Init: load existing session OR just fetch stimuli (NO respondent creation) ──
  useEffect(() => {
    const init = async () => {
      // ?reset=1 forces a fresh session (useful after changing stimuli in DB)
      // Preview mode always starts fresh (no localStorage resume)
      if (forceReset || isPreview) {
        localStorage.removeItem(LS_KEY);
      }

      // Try to resume existing session from localStorage
      try {
        const saved = localStorage.getItem(LS_KEY);
        if (saved && !forceReset) {
          const s: SessionData = JSON.parse(saved);
          if (s.sessionId && s.stimuli?.length > 0) {
            setSession(s);
            const savedStep = s.currentStep || 0;
            setStep(savedStep);
            return;
          }
        }
      } catch { /* ignore */ }

      // No existing session — just pre-load stimuli for the welcome screen
      // Respondent entry will be created only when user clicks "Începe sondajul"
      try {
        const res = await fetch("/api/survey/stimuli?shuffle=1");
        const data = await res.json();
        if (data.stimuli?.length > 0) {
          setPreloadedStimuli(data.stimuli);
          setStep(0); // Show welcome screen
        } else {
          setError(w.errorStart);
        }
      } catch {
        setError(w.errorConnection);
      }
    };
    init();
  }, [tag, forceReset, isPreview]);

  // ── Listen for postMessage from parent (admin preview) to jump to step ──
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "goToStep" && typeof e.data.step === "number") {
        setTransitioning(true);
        setTimeout(() => {
          setStep(e.data.step);
          window.scrollTo(0, 0);
          setTimeout(() => setTransitioning(false), 50);
        }, 150);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

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
    // ── Unified tracking: GA4 + Facebook Pixel + CAPI ──
    const label = getStepLabel(nextStep, profileStepCount, stepsPerStimulus, thankYouStep);

    // Every step (GA4 + FB)
    trackEvent("wizard_step", { step_number: nextStep, step_label: label });
    fbTrackCustom("WizardStep", { step_number: nextStep, step_label: label });

    // Survey started tracking now happens in startSession() callback
    // (no longer needed here since advanceTo(1) is called after session creation)

    // Profile section completed — all demographic/behavioral/psychographic done
    if (nextStep === firstStimulusStep) {
      trackEvent("profile_complete");
      fbTrackCustom("ProfileComplete", { content_name: "RIFC Profile", step: nextStep });
    }

    // Stimulus tracking — each new cartonas (first sub-step)
    if (nextStep >= firstStimulusStep && nextStep <= lastStimulusStep) {
      const stimIdx = Math.floor((nextStep - firstStimulusStep) / stepsPerStimulus);
      const subStep = (nextStep - firstStimulusStep) % stepsPerStimulus;
      if (subStep === 0) {
        trackEvent("stimulus_view", { stimulus_index: stimIdx + 1, step: nextStep });
        fbTrackCustom("StimulusView", { content_name: `Stimulus ${stimIdx + 1}`, step: nextStep, stimulus_index: stimIdx });
      }
    }

    // Survey completed — main conversion event
    if (nextStep >= thankYouStep) {
      trackEvent("survey_complete");
      fbTrack("CompleteRegistration", { content_name: "RIFC Survey Complete", status: "completed", value: 1, currency: "EUR" });
    }

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
  }, [profileStepCount, stepsPerStimulus, thankYouStep, firstStimulusStep]);

  // ── Create session (called only when user clicks "Începe sondajul") ──
  const startSession = useCallback(async () => {
    if (startingSession) return;
    setStartingSession(true);
    setError(null);

    try {
      const fingerprint = await generateFingerprint();
      const stimuli = preloadedStimuli;

      const res = await fetch("/api/survey/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...(tag ? { tag } : {}), locale, ...(isPreview ? { preview: true } : {}), fingerprint }),
      });
      const data = await res.json();
      if (data.success) {
        // Use server-shuffled stimuli from start response (they may differ from preloaded)
        const finalStimuli = data.stimuli?.length > 0 ? data.stimuli : stimuli;
        const s: SessionData = {
          sessionId: data.sessionId,
          currentStep: 1, // Jump straight to step 1 (first question)
          stimuliOrder: finalStimuli.map((st: Stimulus) => st.id),
          stimuli: finalStimuli,
        };
        localStorage.setItem(LS_KEY, JSON.stringify(s));
        setSession(s);
        setPreloadedStimuli(null); // Clear preloaded, no longer needed

        // Track survey start
        trackEvent("wizard_start");
        fbTrackCustom("SurveyStart", { content_name: "RIFC Survey", content_category: "survey" });

        advanceTo(1);
      } else {
        setError(w.errorStart);
      }
    } catch {
      setError(w.errorConnection);
    } finally {
      setStartingSession(false);
    }
  }, [startingSession, preloadedStimuli, tag, locale, isPreview, advanceTo, w]);

  // ── Save profile data to API (fire-and-forget for UX speed) ──
  const saveProfileToApi = useCallback(async (type: string, payload: Record<string, unknown>) => {
    if (!session || isPreview) return;
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
  }, [session, isPreview]);

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

    // Psychographic auto-advance steps: 11=adReceptivity, 12=visualPreference, 13=marketingExpertise, 14=irrelevanceAnnoyance, 15=attentionCapture, 16=irrelevanceTolerance
    const psychFieldMap: Record<number, string> = { 11: "adReceptivity", 12: "visualPreference", 13: "marketingExpertise", 14: "irrelevanceAnnoyance", 15: "attentionCapture", 16: "irrelevanceTolerance" };
    const psychKey = psychFieldMap[stepOffset];
    if (psychKey) {
      const numVal = parseInt(value, 10);
      const updatedPsychographic = { ...psychographic, [psychKey]: numVal };
      setPsychographic(updatedPsychographic);
      // At step 16 (irrelevanceTolerance = last psychographic), save to API
      if (stepOffset === 16) {
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
    const prev = stimulusScores[stimId] || { r: 0, i: 0, f: 0, c: 0, cta: 0, brand: null };
    const updated = { ...prev, [dimension]: value };
    setStimulusScores(s => ({ ...s, [stimId]: updated }));

    // CTA is no longer the last sub-step — brand familiarity comes after
    // API save moved to autoAdvanceBrand below
    if (dimension === "cta") {
      // GA4: stimulus fully rated (scores done, brand question next)
      const stimName = session.stimuli[groupIdx]?.name || stimId;
      const stimType = session.stimuli[groupIdx]?.type || "unknown";
      trackEvent("stimulus_rated", {
        stimulus_index: groupIdx + 1,
        stimulus_name: stimName,
        stimulus_type: stimType,
        r_score: updated.r,
        i_score: updated.i,
        f_score: updated.f,
        c_score: updated.c,
        cta_score: updated.cta,
      });
    }

    setTimeout(() => advanceTo(step + 1), 350);
  }, [step, session, firstStimulusStep, stepsPerStimulus, stimulusScores, advanceTo]);

  // ── Auto-advance for brand familiarity (last sub-step, Da/Nu) ──────
  const autoAdvanceBrand = useCallback((familiar: boolean) => {
    if (!session) return;
    const groupIdx = Math.floor((step - firstStimulusStep) / stepsPerStimulus);
    const stimId = session.stimuliOrder[groupIdx];
    const prev = stimulusScores[stimId] || { r: 0, i: 0, f: 0, c: 0, cta: 0, brand: null };
    const updated = { ...prev, brand: familiar };
    setStimulusScores(s => ({ ...s, [stimId]: updated }));

    // Brand is the last sub-step — fire API save
    const isAttentionGroup = groupIdx === Math.floor(numStimuli / 2);
    const isLastStimulus = step === lastStimulusStep;
    if (!isPreview) {
      fetch("/api/survey/step", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.sessionId,
          step: groupIdx + 4,
          type: "stimulus",
          data: {
            stimulusId: stimId,
            rScore: updated.r,
            iScore: updated.i,
            fScore: updated.f,
            cScore: updated.c,
            ctaScore: updated.cta,
            brandFamiliar: familiar,
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

    // Only call API if we have data to save (skip in preview mode)
    if (type && !isPreview) {
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
          setError(w.errorSave);
          setSaving(false);
          return;
        }
      } catch {
        setError(w.errorConnectionShort);
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
  const accentGreen = "#8B9A6B";
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
      marginBottom: m ? 4 : 6,
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
      padding: m ? 10 : 14,
      background: "#faf9f6",
      marginBottom: m ? 6 : 10,
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
  // Show loading only when still initializing (step=-1) or when past welcome but no session yet
  // Welcome screen (step=0) can render with just preloadedStimuli, before session is created
  if (step === -1 || (!session && step > 0) || (!session && !preloadedStimuli)) {
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
                <p style={{ color: textMuted, fontSize: 14 }}>{w.loading}</p>
              </div>
            )}
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  // ── Complete / Thank you state ──────────────────────────
  if (step >= thankYouStep && session) {
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
              {w.thankYouTitle}
            </h2>
            <p style={{ color: textMuted, marginBottom: 24, fontSize: m ? 14 : 15, lineHeight: 1.6 }}>
              {locale === "ro" ? `Ai evaluat ${session!.stimuli.length} ` : locale === "ru" ? `Вы оценили ${session!.stimuli.length} ` : `You evaluated ${session!.stimuli.length} `}{w.thankYouEvaluated}
              {" "}{w.thankYouSuccess}
            </p>
            <div style={{
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              borderRadius: 10, padding: 16, marginBottom: 24,
            }}>
              <p style={{ fontSize: 13, color: "#166534", lineHeight: 1.5 }}>
                {w.thankYouContribution}
              </p>
            </div>

            {/* Telegram follow section */}
            <div style={{
              background: "#faf8f5", border: "1px solid #e5e1d9",
              borderRadius: 12, padding: m ? 20 : 24, marginBottom: 24, width: "100%",
              textAlign: "center" as const,
            }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: textMuted, marginBottom: 10, textTransform: "uppercase" as const }}>
                {w.thankYouProtocol}
              </p>
              <h3 style={{ fontSize: m ? 16 : 18, fontWeight: 700, color: textDark, marginBottom: 8, lineHeight: 1.3, whiteSpace: "pre-line" as const }}>
                {w.thankYouBookTitle}
              </h3>
              <p style={{ fontSize: m ? 13 : 14, fontWeight: 500, color: textMuted, marginBottom: 16 }}>
                {w.thankYouAuthor}
              </p>
              <a
                href="https://t.me/rifcmarketing"
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
                {w.thankYouTelegram}
              </a>
            </div>

            {/* Copy survey link button — preserves distribution tag */}
            <div style={{ width: "100%", textAlign: "center" as const }}>
              <p style={{ fontSize: 13, color: textMuted, marginBottom: 12 }}>
                {w.thankYouShareText}
              </p>
              <button
                onClick={() => {
                  const base = typeof window !== "undefined"
                    ? `${window.location.origin}/articolstiintific/sondaj/wizard`
                    : "https://rifcmarketing.com/articolstiintific/sondaj/wizard";
                  const url = tag ? `${base}?tag=${encodeURIComponent(tag)}` : base;
                  navigator.clipboard.writeText(url).then(() => {
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2500);
                  });
                }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  padding: "14px 28px", borderRadius: 12,
                  background: linkCopied ? "#059669" : accentRed,
                  color: "#fff", fontSize: m ? 15 : 16, fontWeight: 700,
                  cursor: "pointer", border: "none", letterSpacing: 0.3,
                  transition: "background 0.3s ease",
                }}
              >
                {linkCopied ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {w.thankYouCopied}
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    {w.thankYouCopyLink}
                  </>
                )}
              </button>
              {tag && (
                <p style={{ fontSize: 11, color: textMuted, marginTop: 8, opacity: 0.7 }}>
                  {w.thankYouTagNote}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Session type narrowing: at step 0 (welcome) session may be null,
  //    but welcome is rendered below and doesn't use session.
  //    For all code below that accesses session.stimuli, we need the non-null type. ──
  const sessionSafe = session || { sessionId: "", currentStep: 0, stimuliOrder: [] as string[], stimuli: [] as Stimulus[] };

  // ── Get current stimulus ────────────────────────────────
  const currentStimGroupIdx = step >= firstStimulusStep && step <= lastStimulusStep
    ? Math.floor((step - firstStimulusStep) / stepsPerStimulus) : -1;
  const currentStimSubStep = step >= firstStimulusStep && step <= lastStimulusStep
    ? (step - firstStimulusStep) % stepsPerStimulus : -1; // 0=C, 1=R, 2=I, 3=F, 4=CTA, 5=BRAND
  const currentStim = currentStimGroupIdx >= 0 && currentStimGroupIdx < sessionSafe.stimuli.length
    ? sessionSafe.stimuli[currentStimGroupIdx]
    : null;
  const currentScores = currentStim
    ? stimulusScores[currentStim.id] || { r: 0, i: 0, f: 0, c: 0, cta: 0, brand: null }
    : { r: 0, i: 0, f: 0, c: 0, cta: 0, brand: null };

  // ── Should we show interstitial? Only when category TYPE changes ──
  const showInterstitialForGroup = (() => {
    if (currentStimGroupIdx < 0 || !currentStim || !session) return false;
    if (currentStimSubStep !== 0) return false; // only on R step
    if (interstitialDismissed.has(currentStimGroupIdx)) return false;
    // First stimulus always gets interstitial
    if (currentStimGroupIdx === 0) return true;
    // Show only if type changed from previous stimulus
    const prevStim = sessionSafe.stimuli[currentStimGroupIdx - 1];
    return !prevStim || prevStim.type !== currentStim.type;
  })();

  // ── Category grouping info (for interstitial) ──────────
  const categoryStimCount = currentStim
    ? sessionSafe.stimuli.filter(s => s.type === currentStim.type).length : 0;
  // Unique categories in order of appearance (since stimuli are grouped by category)
  const uniqueCategories = sessionSafe.stimuli.reduce<string[]>((acc, s) => {
    if (!acc.includes(s.type)) acc.push(s.type);
    return acc;
  }, []);
  const currentCategoryNum = currentStim ? uniqueCategories.indexOf(currentStim.type) + 1 : 0;
  const totalCategories = uniqueCategories.length;
  // Previous category label (for transition message)
  const prevCategoryType = currentStimGroupIdx > 0
    ? sessionSafe.stimuli[currentStimGroupIdx - 1]?.type : null;

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
                  {w.welcomeTitle}
                </h1>
                <p style={{ fontSize: m ? 14 : 16, color: textMuted, lineHeight: 1.6, marginBottom: 8, maxWidth: 320 }}>
                  {w.welcomeIntro}
                </p>
                <p style={{ fontSize: m ? 13 : 14, color: textMuted, lineHeight: 1.6, marginBottom: 20, maxWidth: 320 }}>
                  {w.welcomeDuration}<strong style={{ color: textDark }}>{w.welcomeDurationBold}</strong>{w.welcomeAnonymous}<strong style={{ color: textDark }}>{w.welcomeAnonymousBold}</strong>.
                </p>

                {/* Privacy notice */}
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 10, padding: m ? "10px 14px" : "12px 16px",
                  marginBottom: 8, maxWidth: 340, textAlign: "left" as const,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  <p style={{ fontSize: m ? 12 : 13, color: "#15803d", lineHeight: 1.5, margin: 0 }}>
                    <strong>{w.welcomePrivacy}</strong>{w.welcomePrivacyBold}
                  </p>
                </div>
                {/* Cookie / fingerprint notice */}
                <p style={{ fontSize: m ? 10 : 11, color: "#9CA3AF", lineHeight: 1.4, margin: 0, marginBottom: 24, maxWidth: 340, textAlign: "center" as const }}>
                  {w.welcomeCookie}
                </p>

                <button
                  style={{
                    ...S.btnStart,
                    ...(startingSession ? { opacity: 0.7, cursor: "wait" } : {}),
                  }}
                  onClick={() => startSession()}
                  onMouseDown={(e) => ((e.target as HTMLElement).style.transform = "scale(0.97)")}
                  onMouseUp={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                  disabled={startingSession}
                >
                  {startingSession ? "..." : w.welcomeStart}
                </button>

                <p style={{ fontSize: 11, color: textMuted, marginTop: 20, opacity: 0.7 }}>
                  {numStimuli} {w.welcomeMaterials}
                </p>

                {/* Language switcher — small, bottom */}
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: textMuted, opacity: 0.6 }}>{w.welcomeLang}</span>
                  {(["ro", "en", "ru"] as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setLocale(loc)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: locale === loc ? 700 : 500,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        border: "none",
                        background: locale === loc ? "#e5e1d9" : "transparent",
                        color: locale === loc ? textDark : textMuted,
                        outline: "none",
                        fontFamily: "inherit",
                        opacity: locale === loc ? 1 : 0.6,
                      }}
                    >
                      {loc.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ═══ Step 1: Gender ═══ */}
          {step === 1 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.genderTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              <OptionCard label={w.genderFemale} value="feminin" icon="&#9792;" selected={demographics.gender === "feminin"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label={w.genderMale} value="masculin" icon="&#9794;" selected={demographics.gender === "masculin"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label={w.genderOther} value="altul" selected={demographics.gender === "altul"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />
              <OptionCard label={w.genderPreferNot} value="prefer_nu_spun" selected={demographics.gender === "prefer_nu_spun"} onSelect={(v) => autoAdvanceProfile("gender", v, 1)} />

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
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.ageTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

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
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 3: Country ═══ */}
          {step === 3 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.countryTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              <OptionCard label={w.countryMoldova} value="Moldova" selected={demographics.country === "Moldova"} onSelect={(v) => autoAdvanceProfile("country", v, 3)} />
              <OptionCard label={w.countryRomania} value="Romania" selected={demographics.country === "Romania"} onSelect={(v) => autoAdvanceProfile("country", v, 3)} />

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
                        ? `${w.countryOtherSelected} ${demographics.country}`
                        : w.countryOtherPlaceholder}
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
                        placeholder={w.countrySearchPlaceholder}
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
                          {w.countries.filter(c =>
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
                          {w.countries.filter(c =>
                            c.toLowerCase().includes(countrySearch.toLowerCase())
                          ).length === 0 && (
                            <div style={{ padding: "10px 14px", fontSize: 13, color: textMuted }}>
                              {w.countryNotFound}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 4: Urban / Rural ═══ */}
          {step === 4 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.urbanTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              <OptionCard label={w.urbanCity} value="urban" selected={demographics.locationType === "urban"} onSelect={(v) => autoAdvanceProfile("locationType", v, 4)} />
              <OptionCard label={w.urbanRural} value="rural" selected={demographics.locationType === "rural"} onSelect={(v) => autoAdvanceProfile("locationType", v, 4)} />

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 5: Income ═══ */}
          {step === 5 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.incomeTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              {[
                { label: w.incomeLow, value: "sub_500" },
                { label: w.incomeMid, value: "500_1000" },
                { label: w.incomeHigh, value: "1000_2000" },
                { label: w.incomeTop, value: "peste_2000" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={demographics.incomeRange === opt.value} onSelect={(v) => autoAdvanceProfile("incomeRange", v, 5)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 6: Education ═══ */}
          {step === 6 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.educationTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              {[
                { label: w.educationHighSchool, value: "liceu" },
                { label: w.educationBachelor, value: "universitate" },
                { label: w.educationMaster, value: "master" },
                { label: w.educationPhd, value: "doctorat" },
                { label: w.educationOther, value: "altul" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={demographics.education === opt.value} onSelect={(v) => autoAdvanceProfile("education", v, 6)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 7: Purchase Frequency ═══ */}
          {step === 7 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.purchaseTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              {[
                { label: w.purchaseDaily, value: "zilnic" },
                { label: w.purchaseWeekly, value: "saptamanal" },
                { label: w.purchaseMonthly, value: "lunar" },
                { label: w.purchaseRarely, value: "rar" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.purchaseFrequency === opt.value} onSelect={(v) => autoAdvanceProfile("purchaseFrequency", v, 7)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 8: Channels (multi-select — needs manual Next) ═══ */}
          {step === 8 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.channelsTitle}</h2>
              <div style={S.selectHint}>{w.selectMultiple}</div>

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
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <button
                  style={{ ...S.btnNext, opacity: behavioral.preferredChannels.length === 0 ? 0.5 : 1 }}
                  onClick={() => advanceTo(step + 1)}
                  disabled={behavioral.preferredChannels.length === 0}
                >
                  {w.next} <span style={{ fontSize: 18 }}>&rarr;</span>
                </button>
              </div>
            </>
          )}

          {/* ═══ Step 9: Online Time ═══ */}
          {step === 9 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.onlineTimeTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              {[
                { label: w.onlineTimeLow, value: "sub_1h" },
                { label: w.onlineTimeMid, value: "1_3h" },
                { label: w.onlineTimeHigh, value: "3_5h" },
                { label: w.onlineTimeVeryHigh, value: "peste_5h" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.dailyOnlineTime === opt.value} onSelect={(v) => autoAdvanceProfile("dailyOnlineTime", v, 9)} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Step 10: Device ═══ */}
          {step === 10 && (
            <>
              {renderDashes()}
              <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
              <h2 style={S.questionTitle}>{w.deviceTitle}</h2>
              <div style={S.selectHint}>{w.selectOne}</div>

              {[
                { label: w.deviceMobile, value: "telefon" },
                { label: w.deviceDesktop, value: "laptop_pc" },
                { label: w.deviceTablet, value: "tableta" },
              ].map(opt => (
                <OptionCard key={opt.value} {...opt} selected={behavioral.primaryDevice === opt.value} onSelect={(v) => {
                  autoAdvanceProfile("primaryDevice", v, 10);
                }} />
              ))}

              <div style={S.nav}>
                <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                <div />
              </div>
            </>
          )}

          {/* ═══ Steps 11-16: Psychographic (6 separate Likert pages, auto-advance) ═══ */}
          {step >= 11 && step <= 16 && (() => {
            const psychKeys = [
              "adReceptivity" as const,
              "visualPreference" as const,
              "marketingExpertise" as const,
              "irrelevanceAnnoyance" as const,
              "attentionCapture" as const,
              "irrelevanceTolerance" as const,
            ];
            const qIdx = step - 11;
            const qKey = psychKeys[qIdx];
            return (
              <>
                {renderDashes()}
                <div style={S.questionNum}>{w.questionLabel} {String(profileQuestionNum).padStart(2, "0")}</div>
                <h2 style={{ ...S.questionTitle, fontSize: m ? 20 : 24, marginBottom: 8 }}>{w.psychTitle}</h2>
                <p style={{ fontSize: m ? 11 : 12, color: textMuted, marginBottom: 6 }}>
                  {w.questionLabel} {qIdx + 1} {w.psychQuestionOf} 6
                </p>
                <div style={{
                  fontSize: m ? 16 : 18, fontWeight: 600, color: textDark, lineHeight: 1.5,
                  marginBottom: 20, padding: m ? "14px 16px" : "18px 20px",
                  background: "#faf8f5", border: "1px solid #e5e1d9", borderRadius: 10,
                  textAlign: "center" as const,
                }}>
                  {w.psychStatements[qIdx]}
                </div>
                <div style={{ fontSize: m ? 11 : 12, color: textMuted, marginBottom: 10, display: "flex", justifyContent: "space-between", padding: "0 4px" }}>
                  <span>{w.psychLow}</span>
                  <span>{w.psychHigh}</span>
                </div>
                <div style={{ display: "flex", gap: m ? 6 : 8, justifyContent: "center", flexWrap: "wrap" as const }}>
                  {[1, 2, 3, 4, 5, 6, 7].map((v) => (
                    <button
                      key={v}
                      style={{
                        ...S.likertBtn,
                        width: m ? 40 : 48, height: m ? 40 : 48, fontSize: m ? 16 : 18,
                        ...(psychographic[qKey] === v ? S.likertBtnActive : {}),
                      }}
                      onClick={() => autoAdvanceProfile(qKey, String(v), step)}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <div style={S.nav}>
                  <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                  <div />
                </div>
              </>
            );
          })()}

          {/* ═══ Category Interstitial Screen ═══ */}
          {showInterstitialForGroup && currentStim && (() => {
            const catMeta = CATEGORY_META[currentStim.type] || { label: currentStim.type, color: "#6B7280", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
            const isFirst = currentStimGroupIdx === 0;
            const prevCatMeta = prevCategoryType ? (CATEGORY_META[prevCategoryType] || { label: prevCategoryType, color: "#6B7280" }) : null;
            return (
              <>
                {renderDashes()}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: m ? "20px 0" : "40px 0" }}>
                  {/* Completed category message (not on first) */}
                  {!isFirst && prevCatMeta && (
                    <div style={{
                      background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 12, padding: m ? "12px 16px" : "14px 20px", marginBottom: 24,
                      maxWidth: 340,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span style={{ fontSize: m ? 13 : 14, color: "#166534", fontWeight: 700 }}>
                          {catLabel(prevCategoryType!)} {w.categoryDone}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#166534", opacity: 0.7 }}>
                        {w.categoryThanks}
                      </p>
                    </div>
                  )}

                  {/* Category progress indicator */}
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 2, color: textMuted,
                    marginBottom: 16, textTransform: "uppercase" as const,
                  }}>
                    {w.categoryNum} {currentCategoryNum} / {totalCategories}
                  </div>

                  {/* Category icon */}
                  <div style={{
                    width: 72, height: 72, borderRadius: 18,
                    background: `linear-gradient(135deg, ${catMeta.color}, ${catMeta.color}cc)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20, boxShadow: `0 8px 24px ${catMeta.color}30`,
                  }}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={catMeta.icon} />
                    </svg>
                  </div>

                  {/* Category label */}
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, color: textMuted, marginBottom: 6, textTransform: "uppercase" as const }}>
                    {isFirst ? w.categoryFirst : w.categoryNext}
                  </div>
                  <h2 style={{ fontSize: m ? 22 : 26, fontWeight: 800, color: textDark, marginBottom: 10, lineHeight: 1.2 }}>
                    {catLabel(currentStim.type)}
                  </h2>

                  {/* Material count in this category */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    background: `${catMeta.color}10`, border: `1px solid ${catMeta.color}25`,
                    borderRadius: 20, padding: "6px 14px", marginBottom: 20,
                  }}>
                    <span style={{ fontSize: m ? 13 : 14, fontWeight: 700, color: catMeta.color }}>
                      {categoryStimCount}
                    </span>
                    <span style={{ fontSize: m ? 12 : 13, color: catMeta.color, opacity: 0.8 }}>
                      {categoryStimCount === 1 ? w.categoryMaterialSingular : w.categoryMaterialPlural}
                    </span>
                  </div>

                  {/* Instruction */}
                  <div style={{
                    background: "#fefce8", border: "1px solid #fde047",
                    borderRadius: 10, padding: m ? "10px 16px" : "12px 20px", marginBottom: 28,
                    maxWidth: 320,
                  }}>
                    <p style={{ fontSize: m ? 13 : 14, color: "#854d0e", lineHeight: 1.5, fontWeight: 500 }}>
                      {w.categoryInstruction}
                    </p>
                  </div>

                  {/* Start button */}
                  <button
                    style={{
                      padding: m ? "16px 40px" : "18px 48px",
                      fontSize: m ? 17 : 19,
                      fontWeight: 800,
                      color: "#fff",
                      background: `linear-gradient(135deg, ${catMeta.color}, ${catMeta.color}dd)`,
                      border: "none",
                      borderRadius: 14,
                      cursor: "pointer",
                      letterSpacing: 1,
                      textTransform: "uppercase" as const,
                      boxShadow: `0 4px 16px ${catMeta.color}40`,
                      transition: "transform 0.15s, box-shadow 0.15s",
                      minHeight: 56,
                    }}
                    onClick={() => {
                      trackEvent("category_interstitial", {
                        category: catMeta.label,
                        category_number: currentCategoryNum,
                        total_categories: totalCategories,
                        is_first: isFirst ? 1 : 0,
                      });
                      setInterstitialDismissed(prev => new Set(prev).add(currentStimGroupIdx));
                    }}
                    onMouseDown={(e) => ((e.target as HTMLElement).style.transform = "scale(0.96)")}
                    onMouseUp={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
                  >
                    {isFirst ? w.categoryStart : w.categoryContinue}
                  </button>

                  {isFirst && (
                    <p style={{ fontSize: 11, color: textMuted, marginTop: 20, opacity: 0.6 }}>
                      {totalCategories} {w.categorySummary} &middot; {sessionSafe.stimuli.length} {w.categoryMaterialPlural}
                    </p>
                  )}
                </div>
              </>
            );
          })()}

          {/* ═══ Stimulus evaluation steps (6 per stimulus: C, R, I, F, CTA, BRAND) ═══ */}
          {step >= firstStimulusStep && step <= lastStimulusStep && currentStim && !showInterstitialForGroup && (() => {
            const dimensions: { key: "r" | "i" | "f" | "c" | "cta"; question: string; anchorLow: string; anchorHigh: string; color: string; shortLabel: string; hint?: string }[] = [
              {
                key: "c", shortLabel: "C",
                question: w.cQuestion,
                anchorLow: w.cLow,
                anchorHigh: w.cHigh,
                color: "#059669",
                hint: "Prima impresie — raspunde instinctiv, fara sa analizezi.",
              },
              {
                key: "r", shortLabel: "R",
                question: w.rQuestion,
                anchorLow: w.rLow,
                anchorHigh: w.rHigh,
                color: "#DC2626",
              },
              {
                key: "i", shortLabel: "I",
                question: w.iQuestion,
                anchorLow: w.iLow,
                anchorHigh: w.iHigh,
                color: "#D97706",
              },
              {
                key: "f", shortLabel: "F",
                question: w.fQuestion,
                anchorLow: w.fLow,
                anchorHigh: w.fHigh,
                color: "#7C3AED",
              },
              {
                key: "cta", shortLabel: "CTA",
                question: w.ctaQuestion,
                anchorLow: w.ctaLow,
                anchorHigh: w.ctaHigh,
                color: "#2563EB",
              },
            ];
            const isBrandStep = currentStimSubStep === 5;
            const dim = !isBrandStep ? dimensions[currentStimSubStep] : null;
            const isAttentionGroup = currentStimGroupIdx === Math.floor(numStimuli / 2);
            const showAttention = isAttentionGroup && currentStimSubStep === 4; // show on CTA step

            // Extract brand name from stimulus name (everything before the " — " separator)
            const brandName = currentStim.name.includes(" — ") ? currentStim.name.split(" — ")[0].trim() : currentStim.name;

            return (
              <>
                {renderDashes()}
                <div style={S.questionNum}>
                  {w.materialNum} {currentStimGroupIdx + 1} / {sessionSafe.stimuli.length}
                </div>

                {/* ── Brand familiarity card (substep 5) ── */}
                {isBrandStep ? (
                  <div style={{ textAlign: "center" as const, padding: m ? "20px 16px" : "32px 24px" }}>
                    {/* Step indicator mini — all 5 scoring steps done + brand active */}
                    <div style={{ display: "flex", justifyContent: "center", gap: m ? 6 : 8, marginBottom: m ? 16 : 24 }}>
                      {dimensions.map((d) => (
                        <div key={d.key} style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                          padding: "4px 8px", borderRadius: 12,
                          background: "#e5e1d9", color: "#888",
                        }}>
                          {d.shortLabel}
                        </div>
                      ))}
                      <div style={{
                        fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
                        padding: "4px 12px", borderRadius: 12,
                        background: "#374151", color: "#fff",
                      }}>
                        {w.brandShortLabel || "?"}
                      </div>
                    </div>

                    {/* Brand name title card */}
                    <div style={{
                      padding: m ? "24px 16px" : "32px 24px",
                      background: "#faf8f5",
                      border: "2px solid #e5e1d9",
                      borderRadius: 12,
                      marginBottom: m ? 16 : 24,
                    }}>
                      <div style={{ fontSize: m ? 24 : 32, fontWeight: 800, color: textDark, letterSpacing: -0.5, lineHeight: 1.2 }}>
                        {brandName}
                      </div>
                    </div>

                    {/* Question */}
                    <p style={{ fontSize: m ? 14 : 16, fontWeight: 600, color: textDark, marginBottom: m ? 16 : 24, lineHeight: 1.4 }}>
                      {w.brandQuestion}
                    </p>

                    {/* Da / Nu buttons — white, equal, no color differentiation */}
                    <div style={{ display: "flex", gap: m ? 12 : 16, justifyContent: "center" }}>
                      <button
                        style={{
                          flex: 1, maxWidth: 160, padding: m ? "14px 0" : "16px 0",
                          fontSize: m ? 16 : 18, fontWeight: 700, fontFamily: "Inter, sans-serif",
                          background: "#fff", color: textDark,
                          border: "2px solid #e5e1d9", borderRadius: 10,
                          cursor: "pointer", transition: "all 150ms ease",
                        }}
                        onClick={() => autoAdvanceBrand(true)}
                      >
                        {w.brandYes}
                      </button>
                      <button
                        style={{
                          flex: 1, maxWidth: 160, padding: m ? "14px 0" : "16px 0",
                          fontSize: m ? 16 : 18, fontWeight: 700, fontFamily: "Inter, sans-serif",
                          background: "#fff", color: textDark,
                          border: "2px solid #e5e1d9", borderRadius: 10,
                          cursor: "pointer", transition: "all 150ms ease",
                        }}
                        onClick={() => autoAdvanceBrand(false)}
                      >
                        {w.brandNo}
                      </button>
                    </div>

                    <div style={S.nav}>
                      <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                      <div />
                    </div>
                  </div>
                ) : dim && (
                  <>
                    {/* Stimulus display */}
                    <div style={S.stimulusBox}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" as const }}>
                        <span style={S.typeBadge}>{currentStim.type}</span>
                        {currentStim.industry && (
                          <span style={S.industryBadge}>{currentStim.industry}</span>
                        )}
                      </div>
                      <h3 style={{ fontSize: m ? 14 : 16, color: textDark, marginBottom: 8, fontWeight: 600 }}>
                        {currentStim.name}
                      </h3>

                      {currentStim.image_url && (
                        <>
                          <img src={currentStim.image_url} alt={currentStim.name}
                            style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e1d9", maxHeight: m ? 180 : 300, objectFit: "cover" as const, cursor: "pointer" }}
                            loading="lazy"
                            onClick={() => setFullscreenImage(currentStim.image_url)} />
                          {/* Expand button — separate solid button below image */}
                          <button
                            onClick={() => setFullscreenImage(currentStim.image_url)}
                            style={{
                              width: "100%", marginTop: 8,
                              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                              padding: "10px 0", fontSize: 13, fontWeight: 700,
                              background: "#1a1a1a", color: "#fff",
                              border: "none", borderRadius: 8, cursor: "pointer",
                              letterSpacing: 0.3,
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                              <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                            </svg>
                            {w.viewLarger}
                          </button>
                        </>
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

                      {currentStim.audio_url && (
                        <div style={{ marginTop: 10, padding: m ? 10 : 14, background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 8 }}>
                          <audio src={currentStim.audio_url} controls preload="metadata" style={{ width: "100%", borderRadius: 6 }} />
                        </div>
                      )}

                      {currentStim.text_content && (
                        <div style={{
                          fontSize: 14, lineHeight: 1.7, color: textDark,
                          background: !currentStim.image_url && !currentStim.video_url && !currentStim.audio_url ? "#fef3c7" : "#fff",
                          border: `1px solid ${!currentStim.image_url && !currentStim.video_url && !currentStim.audio_url ? "#fcd34d" : "#e5e1d9"}`,
                          borderRadius: 8, padding: m ? 12 : 16, whiteSpace: "pre-wrap" as const, marginTop: 10,
                        }}>
                          {currentStim.text_content}
                        </div>
                      )}

                      {currentStim.pdf_url && (
                        <a href={currentStim.pdf_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: accentRed, border: `1px solid ${accentRed}`, borderRadius: 8, textDecoration: "none", marginTop: 8 }}>
                          {w.openPdf} &rarr;
                        </a>
                      )}

                      {currentStim.site_url && (
                        <a href={currentStim.site_url} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-block", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#2563EB", border: "1px solid #2563EB", borderRadius: 8, textDecoration: "none", marginTop: 8 }}>
                          {w.visitSite} &rarr;
                        </a>
                      )}

                      {currentStim.description && (
                        <p style={{ fontSize: 13, color: textMuted, marginTop: 12, lineHeight: 1.6 }}>
                          {currentStim.description}
                        </p>
                      )}
                    </div>

                    {/* Current question */}
                    <div style={{ marginTop: m ? 4 : 8 }}>
                      {/* Step indicator mini: R · I · F · C · CTA · ? */}
                      <div style={{ display: "flex", justifyContent: "center", gap: m ? 6 : 8, marginBottom: m ? 6 : 10 }}>
                        {dimensions.map((d, idx) => {
                          const isActive = idx === currentStimSubStep;
                          const isDone = idx < currentStimSubStep;
                          return (
                            <div key={d.key} style={{
                              fontSize: isActive ? 12 : 10,
                              fontWeight: 700,
                              letterSpacing: 0.5,
                              padding: isActive ? "4px 12px" : "4px 8px",
                              borderRadius: 12,
                              background: isActive ? d.color : isDone ? "#e5e1d9" : "transparent",
                              color: isActive ? "#fff" : isDone ? "#888" : "#ccc",
                              transition: "all 0.3s ease",
                            }}>
                              {d.shortLabel}
                            </div>
                          );
                        })}
                        <div style={{
                          fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                          padding: "4px 8px", borderRadius: 12,
                          background: "transparent", color: "#ccc",
                        }}>
                          {w.brandShortLabel || "?"}
                        </div>
                      </div>

                      {/* Question text — colored border + flash animation on step change */}
                      <div
                        key={`q-${currentStimGroupIdx}-${currentStimSubStep}`}
                        className="question-flash"
                        style={{
                          fontSize: m ? 13 : 15, fontWeight: 600, color: textDark, lineHeight: 1.4,
                          marginBottom: m ? 10 : 12, padding: m ? "8px 12px" : "10px 16px",
                          background: `${dim.color}08`, border: `2px solid ${dim.color}`, borderRadius: 10,
                          textAlign: "center" as const,
                          // @ts-expect-error CSS custom property
                          "--flash-color": `${dim.color}40`,
                        }}>
                        {dim.question}
                        {dim.hint && (
                          <div style={{ fontSize: m ? 10 : 11, fontWeight: 400, color: "#9CA3AF", marginTop: 4, fontStyle: "italic" }}>
                            {dim.hint}
                          </div>
                        )}
                      </div>

                      {/* 1-10 buttons — 2 rows of 5, well-spaced */}
                      {[
                        [1, 2, 3, 4, 5],
                        [6, 7, 8, 9, 10],
                      ].map((row, rowIdx) => (
                        <div key={rowIdx} style={{
                          display: "flex", gap: m ? 8 : 10, justifyContent: "center",
                          marginBottom: rowIdx === 0 ? (m ? 8 : 10) : 0,
                        }}>
                          {row.map((v) => (
                            <button
                              key={v}
                              style={{
                                width: m ? 48 : 52, height: m ? 48 : 52, fontSize: m ? 16 : 18,
                                fontWeight: 700, fontFamily: "Inter, sans-serif",
                                background: currentScores[dim.key] === v ? dim.color : "#faf8f5",
                                color: currentScores[dim.key] === v ? "#fff" : textDark,
                                border: `2px solid ${currentScores[dim.key] === v ? dim.color : "#e5e1d9"}`,
                                borderRadius: 10, cursor: "pointer",
                                transition: "all 150ms ease",
                              }}
                              onClick={() => autoAdvanceStimulus(dim.key, v)}
                            >
                              {v}
                            </button>
                          ))}
                        </div>
                      ))}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: m ? 9 : 10, color: textMuted, marginTop: 8, padding: "0 4px" }}>
                        <span>1 = {dim.anchorLow}</span>
                        <span>10 = {dim.anchorHigh}</span>
                      </div>
                    </div>

                    {/* Attention check at midpoint — anti-robot verification */}
                    {showAttention && (
                      <div style={{ marginTop: 16, padding: m ? 14 : 18, background: "#fefce8", border: "1px solid #fde047", borderRadius: 10 }}>
                        <div style={{ fontSize: m ? 13 : 14, fontWeight: 700, color: "#854d0e", marginBottom: 8 }}>
                          {w.attentionTitle}
                        </div>
                        <p style={{ fontSize: m ? 12 : 13, color: textDark, marginBottom: 10, lineHeight: 1.5 }}>
                          {w.attentionInstruction} <strong style={{ fontSize: m ? 18 : 22, color: "#b45309" }}>{attentionTarget.current}</strong>
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
                      <button style={S.btnBack} onClick={goBack}>{w.back}</button>
                      <div />
                    </div>
                  </>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ═══ Fullscreen Image Overlay ═══ */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: "fixed" as const, inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.92)", display: "flex",
            alignItems: "center", justifyContent: "center",
            flexDirection: "column" as const, cursor: "pointer",
          }}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            style={{
              maxWidth: "95vw", maxHeight: "85vh",
              objectFit: "contain" as const, borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              marginTop: 16, padding: "10px 28px",
              fontSize: 15, fontWeight: 700,
              background: "#fff", color: "#1a1a1a",
              border: "none", borderRadius: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            {w.closeOverlay}
          </button>
        </div>
      )}

      {/* Footer */}
      {step > 0 && step < thankYouStep && (
        <div style={S.footer}>
          <span>{w.footerStudy} &middot; </span>
          <a href="https://rifcmarketing.com" style={{ color: accentRed }}>rifcmarketing.com</a>
        </div>
      )}

      {/* Global styles */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes questionFlash {
          0% { transform: scale(1.03); box-shadow: 0 0 0 4px var(--flash-color, #DC262640); }
          100% { transform: scale(1); box-shadow: 0 0 0 0px var(--flash-color, #DC262600); }
        }
        .question-flash {
          animation: questionFlash 0.5s ease-out;
        }

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
          border-color: #8B9A6B !important;
          box-shadow: 0 0 0 3px rgba(139, 154, 107, 0.25);
        }
      `}</style>
    </div>
  );
}
