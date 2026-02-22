"use client";

import type { CWAgentKey, CWSliderType, ExtendedBrandProfile } from "@/types/copywrite";
import {
  CW_DEFAULT_BRANDS,
  CW_CONTENT_TYPES,
  CW_OBJECTIVE_WEIGHTS,
} from "@/lib/constants/copywrite";
import IndustryDropdown from "./IndustryDropdown";
import BrandProfilePanel from "./BrandProfilePanel";
import AgentInfoCard from "./AgentInfoCard";
import BrandFieldSlider from "./BrandFieldSlider";
import AgentParameterSlider from "./AgentParameterSlider";

interface Props {
  brand: ExtendedBrandProfile;
  brandName: string;
  industry: string;
  contentType: string;
  objective: string;
  inputText: string;
  sliderType: CWSliderType;
  sliderField: string | null;
  sliderAgent: CWAgentKey | null;
  onBrandChange: (key: keyof ExtendedBrandProfile, value: string) => void;
  onBrandNameChange: (name: string) => void;
  onLoadPreset: (name: string) => void;
  onIndustryChange: (v: string) => void;
  onContentTypeChange: (v: string) => void;
  onObjectiveChange: (v: string) => void;
  onInputTextChange: (v: string) => void;
  onOpenBrandField: (fieldKey: string) => void;
  onOpenAgent: (key: CWAgentKey) => void;
  onCloseSlider: () => void;
  onStartAudit: () => void;
  onBack: () => void;
}

const OBJECTIVE_KEYS = Object.keys(CW_OBJECTIVE_WEIGHTS) as Array<
  keyof typeof CW_OBJECTIVE_WEIGHTS
>;

const OBJ_LABELS: Record<string, string> = {
  awareness: "Awareness",
  conversion: "Conversie",
  engagement: "Engagement",
  retention: "Retentie",
  education: "Educatie",
};

export default function CopywriteConfig({
  brand,
  brandName,
  industry,
  contentType,
  objective,
  inputText,
  sliderType,
  sliderField,
  sliderAgent,
  onBrandChange,
  onLoadPreset,
  onIndustryChange,
  onContentTypeChange,
  onObjectiveChange,
  onInputTextChange,
  onOpenBrandField,
  onOpenAgent,
  onCloseSlider,
  onStartAudit,
  onBack,
}: Props) {
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const canStart = inputText.trim().length > 20;

  return (
    <div className="min-h-screen relative">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-[#0a0a0f]/90 backdrop-blur-sm border-b border-white/5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="font-cw-mono text-xs">Inapoi</span>
        </button>
        <span className="font-cw-mono text-[10px] tracking-[2px] uppercase text-text-ghost">
          Configurare Audit
        </span>
        <div className="w-16" /> {/* spacer */}
      </div>

      {/* Main layout: 2 columns */}
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        {/* Left: form */}
        <div className="space-y-6">
          {/* Brand preset selector */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-3">
              Brand
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(CW_DEFAULT_BRANDS).map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onLoadPreset(key)}
                  className={`px-3 py-1.5 rounded-lg font-cw-mono text-xs transition-colors ${
                    brandName === key
                      ? "bg-cwAgent-CTA/10 border border-cwAgent-CTA/30 text-cwAgent-CTA"
                      : "bg-white/[0.03] border border-white/10 text-text-secondary hover:border-white/20"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-3">
              Industrie
            </h3>
            <IndustryDropdown value={industry} onChange={onIndustryChange} />
          </div>

          {/* Content Type */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-3">
              Tip Continut
            </h3>
            <div className="flex flex-wrap gap-2">
              {CW_CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.value}
                  type="button"
                  onClick={() => onContentTypeChange(ct.value)}
                  className={`px-3 py-1.5 rounded-lg font-cw-mono text-xs transition-colors ${
                    contentType === ct.value
                      ? "bg-cwAgent-F/10 border border-cwAgent-F/30 text-cwAgent-F"
                      : "bg-white/[0.03] border border-white/10 text-text-secondary hover:border-white/20"
                  }`}
                >
                  {ct.label}
                </button>
              ))}
            </div>
          </div>

          {/* Objective */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <h3 className="font-cw-heading font-semibold text-sm text-text-primary mb-3">
              Obiectiv
            </h3>
            <div className="flex flex-wrap gap-2">
              {OBJECTIVE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onObjectiveChange(key)}
                  className={`px-3 py-1.5 rounded-lg font-cw-mono text-xs transition-colors ${
                    objective === key
                      ? "bg-cwAgent-I/10 border border-cwAgent-I/30 text-cwAgent-I"
                      : "bg-white/[0.03] border border-white/10 text-text-secondary hover:border-white/20"
                  }`}
                >
                  {OBJ_LABELS[key] || key}
                </button>
              ))}
            </div>
          </div>

          {/* Text input */}
          <div className="rounded-xl bg-white/[0.02] border border-white/10 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-cw-heading font-semibold text-sm text-text-primary">
                Textul tau
              </h3>
              <span className="font-cw-mono text-[10px] text-text-ghost">
                {wordCount} cuvinte
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => onInputTextChange(e.target.value)}
              placeholder="Lipeste textul pe care vrei sa il analizezi (landing page, email, ad copy, headline, post social media...)"
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 font-cw-mono text-sm text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-cwAgent-CTA/40 resize-none leading-relaxed"
            />
          </div>

          {/* Start audit button */}
          <button
            type="button"
            onClick={onStartAudit}
            disabled={!canStart}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-cwAgent-R/20 via-cwAgent-F/20 to-cwAgent-CTA/20 border border-white/10 hover:border-white/20 font-cw-heading font-semibold text-base text-text-primary transition-all duration-300 hover:scale-[1.01] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            Salveaza si Porneste Auditul RIFC
          </button>
        </div>

        {/* Right: brand panel + agent info */}
        <div className="space-y-6">
          <BrandProfilePanel brand={brand} onOpenField={onOpenBrandField} />
          <AgentInfoCard onOpenAgent={onOpenAgent} />
        </div>
      </div>

      {/* Slider panels */}
      {sliderType === "brand-field" && sliderField && (
        <BrandFieldSlider
          fieldKey={sliderField}
          brand={brand}
          brandName={brandName}
          onBrandChange={onBrandChange}
          onClose={onCloseSlider}
        />
      )}

      {sliderType === "agent-param" && sliderAgent && (
        <AgentParameterSlider
          agentKey={sliderAgent}
          onClose={onCloseSlider}
        />
      )}
    </div>
  );
}
