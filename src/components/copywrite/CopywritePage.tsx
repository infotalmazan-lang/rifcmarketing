"use client";

import { useState, useCallback } from "react";
import type {
  CWScreen,
  CWAgentKey,
  CWAgentStatus,
  CWAuditResult,
  CWSliderType,
  ExtendedBrandProfile,
} from "@/types/copywrite";
import { CW_DEFAULT_BRANDS } from "@/lib/constants/copywrite";
import CopywriteHero from "./CopywriteHero";
import CopywriteConfig from "./CopywriteConfig";
import CopywriteProgress from "./CopywriteProgress";
import CopywriteResults from "./CopywriteResults";

// ─── Default empty brand profile ────────────────────────
const EMPTY_BRAND: ExtendedBrandProfile = {
  logo: "",
  desc: "",
  tone: "",
  audience: "",
  colors: "",
  font: "",
  values: "",
  mission: "",
  usp: "",
  competitors: "",
  keywords: "",
  avoid: "",
};

export default function CopywritePage() {
  // ─── Screen state machine ─────────────────────────────
  const [screen, setScreen] = useState<CWScreen>("hero");

  // ─── Config state ─────────────────────────────────────
  const [brandName, setBrandName] = useState("rifc");
  const [brand, setBrand] = useState<ExtendedBrandProfile>(
    CW_DEFAULT_BRANDS.rifc.data
  );
  const [industry, setIndustry] = useState("Marketing Digital");
  const [contentType, setContentType] = useState("landing");
  const [objective, setObjective] = useState("conversion");
  const [inputText, setInputText] = useState("");

  // ─── Slider panels ────────────────────────────────────
  const [sliderType, setSliderType] = useState<CWSliderType>(null);
  const [sliderField, setSliderField] = useState<string | null>(null);
  const [sliderAgent, setSliderAgent] = useState<CWAgentKey | null>(null);

  // ─── Progress state ───────────────────────────────────
  const [agentStatuses, setAgentStatuses] = useState<
    Record<CWAgentKey, CWAgentStatus>
  >({
    R: "pending",
    I: "pending",
    F: "pending",
    C: "pending",
    CTA: "pending",
  });
  const [liveScores, setLiveScores] = useState<Record<CWAgentKey, number>>({
    R: 0,
    I: 0,
    F: 0,
    C: 0,
    CTA: 0,
  });

  // ─── Results state ────────────────────────────────────
  const [auditResult, setAuditResult] = useState<CWAuditResult | null>(null);

  // ─── Brand helpers ────────────────────────────────────
  const updateBrandField = useCallback(
    (key: keyof ExtendedBrandProfile, value: string) => {
      setBrand((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const loadPreset = useCallback((presetKey: string) => {
    const preset = CW_DEFAULT_BRANDS[presetKey];
    if (preset) {
      setBrandName(presetKey);
      setBrand(preset.data);
    }
  }, []);

  // ─── Navigation handlers ──────────────────────────────
  const goToConfig = useCallback(() => setScreen("config"), []);
  const goToHero = useCallback(() => setScreen("hero"), []);

  const startAudit = useCallback(() => {
    setScreen("progress");
    setAgentStatuses({ R: "pending", I: "pending", F: "pending", C: "pending", CTA: "pending" });
    setLiveScores({ R: 0, I: 0, F: 0, C: 0, CTA: 0 });
    setAuditResult(null);
  }, []);

  const showResults = useCallback((result: CWAuditResult) => {
    setAuditResult(result);
    setScreen("results");
  }, []);

  const restartAudit = useCallback(() => {
    setScreen("config");
    setAuditResult(null);
  }, []);

  // ─── Slider panel handlers ────────────────────────────
  const openBrandFieldSlider = useCallback((fieldKey: string) => {
    setSliderType("brand-field");
    setSliderField(fieldKey);
    setSliderAgent(null);
  }, []);

  const openAgentSlider = useCallback((agentKey: CWAgentKey) => {
    setSliderType("agent-param");
    setSliderAgent(agentKey);
    setSliderField(null);
  }, []);

  const openResultSlider = useCallback((agentKey: CWAgentKey) => {
    setSliderType("result");
    setSliderAgent(agentKey);
    setSliderField(null);
  }, []);

  const closeSlider = useCallback(() => {
    setSliderType(null);
    setSliderField(null);
    setSliderAgent(null);
  }, []);

  // ─── Render screens ───────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] font-cw-heading">
      {screen === "hero" && <CopywriteHero onStart={goToConfig} />}

      {screen === "config" && (
        <CopywriteConfig
          brand={brand}
          brandName={brandName}
          industry={industry}
          contentType={contentType}
          objective={objective}
          inputText={inputText}
          sliderType={sliderType}
          sliderField={sliderField}
          sliderAgent={sliderAgent}
          onBrandChange={updateBrandField}
          onBrandNameChange={setBrandName}
          onLoadPreset={loadPreset}
          onIndustryChange={setIndustry}
          onContentTypeChange={setContentType}
          onObjectiveChange={setObjective}
          onInputTextChange={setInputText}
          onOpenBrandField={openBrandFieldSlider}
          onOpenAgent={openAgentSlider}
          onCloseSlider={closeSlider}
          onStartAudit={startAudit}
          onBack={goToHero}
        />
      )}

      {screen === "progress" && (
        <CopywriteProgress
          inputText={inputText}
          brand={brand}
          brandName={brandName}
          industry={industry}
          contentType={contentType}
          objective={objective}
          agentStatuses={agentStatuses}
          liveScores={liveScores}
          onAgentStatusChange={setAgentStatuses}
          onLiveScoreChange={setLiveScores}
          onComplete={showResults}
        />
      )}

      {screen === "results" && auditResult && (
        <CopywriteResults
          result={auditResult}
          brand={brand}
          brandName={brandName}
          industry={industry}
          sliderType={sliderType}
          sliderAgent={sliderAgent}
          onOpenAgent={openResultSlider}
          onCloseSlider={closeSlider}
          onRestart={restartAudit}
        />
      )}
    </div>
  );
}
