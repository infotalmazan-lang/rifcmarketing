"use client";

import { useTranslation } from "@/lib/i18n";
import { OBJECTIVES } from "@/lib/constants/objectives";
import {
  Eye,
  UserPlus,
  ShoppingCart,
  Heart,
  RefreshCw,
  Lightbulb,
  Megaphone,
  Users,
  ArrowUpRight,
  Download,
  ChevronDown,
  Target,
} from "lucide-react";

const ICON_MAP: Record<string, typeof Eye> = {
  Eye,
  UserPlus,
  ShoppingCart,
  Heart,
  RefreshCw,
  Lightbulb,
  Megaphone,
  Users,
  ArrowUpRight,
  Download,
};

interface ObjectiveSelectorProps {
  value: string;
  onChange: (objectiveId: string) => void;
}

export default function ObjectiveSelector({ value, onChange }: ObjectiveSelectorProps) {
  const { t } = useTranslation();

  return (
    <div style={{ marginBottom: 16 }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 500,
          color: "#9CA3AF",
        }}
      >
        <Target size={14} />
        {t.audit.objectiveLabel}
      </label>

      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 36px 10px 12px",
            backgroundColor: "#161B22",
            border: "1px solid #30363D",
            borderRadius: 6,
            color: "#E6EDF3",
            fontSize: 14,
            cursor: "pointer",
            appearance: "none",
            outline: "none",
          }}
        >
          <option value="">{t.audit.objectiveNone}</option>
          {OBJECTIVES.map((obj) => {
            const objT = t.audit.objectives[obj.id];
            return (
              <option key={obj.id} value={obj.id}>
                {objT?.name || obj.id}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6B7280",
            pointerEvents: "none",
          }}
        />
      </div>

      {value && (() => {
        const obj = OBJECTIVES.find((o) => o.id === value);
        const objT = t.audit.objectives[value];
        if (!obj) return null;
        const Icon = ICON_MAP[obj.icon] || Target;
        return (
          <div
            style={{
              marginTop: 8,
              padding: "10px 12px",
              backgroundColor: "rgba(91, 154, 139, 0.08)",
              border: "1px solid rgba(91, 154, 139, 0.2)",
              borderRadius: 6,
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            <Icon size={16} style={{ color: "#5B9A8B", marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: "#9CA3AF", lineHeight: 1.5 }}>
              <span style={{ color: "#E6EDF3", fontWeight: 500 }}>{objT?.name || obj.id}</span>
              {objT?.desc && <> — {objT.desc}</>}
              <div style={{ marginTop: 4, display: "flex", gap: 12, fontSize: 11 }}>
                <span style={{ color: "#DC2626" }}>R ×{obj.weights.R}</span>
                <span style={{ color: "#2563EB" }}>I ×{obj.weights.I}</span>
                <span style={{ color: "#D97706" }}>F ×{obj.weights.F}</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
