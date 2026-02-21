"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import type { BrandProfile } from "@/types";
import { Building2, ChevronDown, ChevronUp } from "lucide-react";

const STORAGE_KEY = "rifc_brand_profile";

const EMPTY_PROFILE: BrandProfile = {
  name: "",
  industry: "",
  targetAudience: "",
  tone: "",
  uvp: "",
};

interface BrandContextProps {
  value: BrandProfile;
  onChange: (profile: BrandProfile) => void;
}

export default function BrandContext({ value, onChange }: BrandContextProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BrandProfile;
        if (parsed.name || parsed.industry || parsed.targetAudience || parsed.tone || parsed.uvp) {
          onChange(parsed);
          setExpanded(true);
        }
      }
    } catch { /* ignore */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (value.name || value.industry || value.targetAudience || value.tone || value.uvp) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    }
  }, [value]);

  const update = (field: keyof BrandProfile, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const hasData = value.name || value.industry || value.targetAudience || value.tone || value.uvp;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px",
    backgroundColor: "#161B22",
    border: "1px solid #30363D",
    borderRadius: 6,
    color: "#E6EDF3",
    fontSize: 13,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    display: "block",
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#9CA3AF",
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <Building2 size={14} />
        {t.audit.brandProfileToggle}
        {hasData && (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "#5B9A8B",
              marginLeft: 4,
            }}
          />
        )}
        {expanded ? <ChevronUp size={14} style={{ marginLeft: "auto" }} /> : <ChevronDown size={14} style={{ marginLeft: "auto" }} />}
      </button>

      {expanded && (
        <div
          style={{
            padding: 12,
            backgroundColor: "rgba(22, 27, 34, 0.6)",
            border: "1px solid #21262D",
            borderRadius: 8,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label style={labelStyle}>{t.audit.brandNameLabel}</label>
            <input
              type="text"
              value={value.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder={t.audit.brandNamePlaceholder}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t.audit.brandIndustryLabel}</label>
            <input
              type="text"
              value={value.industry}
              onChange={(e) => update("industry", e.target.value)}
              placeholder={t.audit.brandIndustryPlaceholder}
              style={inputStyle}
            />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>{t.audit.brandAudienceLabel}</label>
            <input
              type="text"
              value={value.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              placeholder={t.audit.brandAudiencePlaceholder}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t.audit.brandToneLabel}</label>
            <input
              type="text"
              value={value.tone}
              onChange={(e) => update("tone", e.target.value)}
              placeholder={t.audit.brandTonePlaceholder}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>{t.audit.brandUvpLabel}</label>
            <input
              type="text"
              value={value.uvp}
              onChange={(e) => update("uvp", e.target.value)}
              placeholder={t.audit.brandUvpPlaceholder}
              style={inputStyle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
