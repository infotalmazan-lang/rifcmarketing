"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Layers,
  ChevronRight,
  ChevronDown,
  Save,
  RotateCcw,
  Search,
} from "lucide-react";
import type { ContentOverride } from "@/types/admin";

// Editable i18n sections with their label
const SECTIONS = [
  { key: "hero", label: "Hero Section" },
  { key: "philosophy", label: "Filozofie (Ch.01)" },
  { key: "equation", label: "Ecuatie (Ch.02)" },
  { key: "anatomy", label: "Anatomie (Ch.03)" },
  { key: "methodology", label: "Metodologie (Ch.04)" },
  { key: "relevanceGate", label: "Poarta Relevantei (Ch.05)" },
  { key: "omnichannel", label: "Omnichannel (Ch.06)" },
  { key: "archetypes", label: "Arhetipuri (Ch.07)" },
  { key: "aiPrompts", label: "AI Prompts (Ch.08)" },
  { key: "comparison", label: "Comparatii" },
  { key: "implementation", label: "Implementare" },
  { key: "caseStudies", label: "Case Studies" },
  { key: "resourcesSection", label: "Resurse" },
  { key: "author", label: "Autor" },
  { key: "cta", label: "CTA" },
  { key: "footer", label: "Footer" },
  { key: "nav", label: "Navigatie" },
  { key: "calculator", label: "Calculator" },
  { key: "consulting", label: "Consultanta" },
  { key: "audit", label: "Audit" },
];

export default function ContentPage() {
  const [overrides, setOverrides] = useState<ContentOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [locale, setLocale] = useState<"ro" | "en">("ro");
  const [search, setSearch] = useState("");
  const [editKey, setEditKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchOverrides();
  }, [locale]);

  const fetchOverrides = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("content_overrides")
      .select("*")
      .eq("locale", locale);
    setOverrides((data as ContentOverride[]) || []);
    setLoading(false);
  };

  const overrideMap = new Map(
    overrides.map((o) => [o.key_path, o])
  );

  const handleSave = async (keyPath: string) => {
    if (!editValue.trim()) return;
    setSaving(true);

    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locale,
        key_path: keyPath,
        value: editValue,
      }),
    });

    if (res.ok) {
      setEditKey(null);
      setEditValue("");
      fetchOverrides();
    }
    setSaving(false);
  };

  const handleReset = async (keyPath: string) => {
    const override = overrides.find((o) => o.key_path === keyPath);
    if (!override) return;
    if (!confirm("Resetezi la valoarea originala?")) return;

    const res = await fetch(`/api/admin/content/${override.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchOverrides();
    }
  };

  const startEdit = (keyPath: string, currentValue: string) => {
    setEditKey(keyPath);
    setEditValue(currentValue);
  };

  const filteredSections = SECTIONS.filter(
    (s) =>
      !search ||
      s.label.toLowerCase().includes(search.toLowerCase()) ||
      s.key.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Layers size={18} className="text-text-ghost" />
          <h1 className="text-2xl font-light">Continut</h1>
        </div>
        <p className="font-body text-sm text-text-muted">
          Override texte landing page (i18n)
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex border border-border-light rounded-sm overflow-hidden">
          <button
            onClick={() => setLocale("ro")}
            className={`px-4 py-2 font-mono text-[11px] tracking-[2px] uppercase transition-colors ${
              locale === "ro"
                ? "bg-surface-card text-text-primary"
                : "text-text-ghost hover:text-text-muted"
            }`}
          >
            RO
          </button>
          <button
            onClick={() => setLocale("en")}
            className={`px-4 py-2 font-mono text-[11px] tracking-[2px] uppercase transition-colors ${
              locale === "en"
                ? "bg-surface-card text-text-primary"
                : "text-text-ghost hover:text-text-muted"
            }`}
          >
            EN
          </button>
        </div>

        <div className="relative flex-1 max-w-[300px]">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cauta sectiune..."
            className="w-full bg-surface-card border border-border-light rounded-sm pl-9 pr-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
          />
        </div>

        <div className="font-mono text-[10px] text-text-ghost">
          {overrides.length} override(s) active
        </div>
      </div>

      {/* Instructions */}
      <div className="border border-border-subtle rounded-sm p-4 mb-6">
        <p className="font-body text-xs text-text-muted">
          Selecteaza o sectiune si editeaza textele. Override-urile se salveaza
          in baza de date si suprascriu textele din codul sursa. Pentru a reveni
          la textul original, sterge override-ul.
        </p>
        <p className="font-body text-xs text-text-ghost mt-1">
          Format key: <code className="font-mono text-rifc-red">sectiune.sub_cheie</code> (ex: hero.subtitle, philosophy.description)
        </p>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : (
        <div className="space-y-2">
          {filteredSections.map((section) => {
            const isExpanded = expandedSection === section.key;
            const sectionOverrides = overrides.filter((o) =>
              o.key_path.startsWith(section.key + ".")
            );

            return (
              <div
                key={section.key}
                className="border border-border-light rounded-sm"
              >
                <button
                  onClick={() =>
                    setExpandedSection(isExpanded ? null : section.key)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-text-ghost" />
                    ) : (
                      <ChevronRight size={14} className="text-text-ghost" />
                    )}
                    <span className="font-body text-sm text-text-primary">
                      {section.label}
                    </span>
                    <span className="font-mono text-[10px] text-text-ghost">
                      {section.key}
                    </span>
                  </div>
                  {sectionOverrides.length > 0 && (
                    <span className="font-mono text-[10px] tracking-[1px] px-2 py-0.5 border border-green-400/30 text-green-400 rounded-sm">
                      {sectionOverrides.length} override(s)
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border-subtle p-4 space-y-3">
                    {/* Existing overrides */}
                    {sectionOverrides.map((ov) => (
                      <div
                        key={ov.id}
                        className="flex items-start gap-3 p-3 border border-border-subtle rounded-sm"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[10px] text-rifc-red mb-1">
                            {ov.key_path}
                          </div>
                          {editKey === ov.key_path ? (
                            <div className="space-y-2">
                              <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                rows={3}
                                className="w-full bg-surface-card border border-border-light rounded-sm p-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle resize-none"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSave(ov.key_path)}
                                  disabled={saving}
                                  className="flex items-center gap-1 font-mono text-[10px] px-3 py-1 bg-rifc-red text-surface-bg rounded-sm disabled:opacity-50"
                                >
                                  <Save size={10} /> Salveaza
                                </button>
                                <button
                                  onClick={() => setEditKey(null)}
                                  className="font-mono text-[10px] px-3 py-1 text-text-ghost hover:text-text-primary"
                                >
                                  Anuleaza
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="font-body text-sm text-text-muted line-clamp-2">
                              {ov.value}
                            </p>
                          )}
                        </div>
                        {editKey !== ov.key_path && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => startEdit(ov.key_path, ov.value)}
                              className="p-1.5 text-text-ghost hover:text-text-primary transition-colors"
                            >
                              <Save size={12} />
                            </button>
                            <button
                              onClick={() => handleReset(ov.key_path)}
                              className="p-1.5 text-text-ghost hover:text-amber-400 transition-colors"
                            >
                              <RotateCcw size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Add new override */}
                    <div className="pt-2 border-t border-border-subtle">
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
                            Key path
                          </label>
                          <input
                            type="text"
                            id={`new-key-${section.key}`}
                            placeholder={`${section.key}.cheie`}
                            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
                            Valoare
                          </label>
                          <input
                            type="text"
                            id={`new-val-${section.key}`}
                            placeholder="Text nou..."
                            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                          />
                        </div>
                        <button
                          onClick={async () => {
                            const keyEl = document.getElementById(
                              `new-key-${section.key}`
                            ) as HTMLInputElement;
                            const valEl = document.getElementById(
                              `new-val-${section.key}`
                            ) as HTMLInputElement;
                            if (!keyEl?.value || !valEl?.value) return;

                            const res = await fetch("/api/admin/content", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                locale,
                                key_path: keyEl.value,
                                value: valEl.value,
                              }),
                            });
                            if (res.ok) {
                              keyEl.value = "";
                              valEl.value = "";
                              fetchOverrides();
                            }
                          }}
                          className="flex items-center gap-1 font-mono text-[10px] tracking-[2px] uppercase px-3 py-2 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
                        >
                          + Adauga
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
