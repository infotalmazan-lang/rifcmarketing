"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Search, Save, RotateCcw } from "lucide-react";
import type { SeoOverride } from "@/types/admin";

const SITE_PAGES = [
  { path: "/", label: "Acasa (Landing Page)" },
  { path: "/calculator", label: "Calculator R IF C" },
  { path: "/audit", label: "Audit AI" },
  { path: "/blog", label: "Blog" },
  { path: "/consulting", label: "Consultanta" },
  { path: "/resources", label: "Resurse" },
  { path: "/whitepaper", label: "White Paper" },
];

const LOCALES = [
  { code: "ro", label: "Romana" },
  { code: "en", label: "English" },
] as const;

interface SeoForm {
  meta_title: string;
  meta_description: string;
  og_image_url: string;
}

type FormKey = string; // "path:locale"

export default function SeoPage() {
  const [overrides, setOverrides] = useState<Record<FormKey, SeoOverride>>({});
  const [forms, setForms] = useState<Record<FormKey, SeoForm>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<FormKey | null>(null);
  const [saved, setSaved] = useState<FormKey | null>(null);

  useEffect(() => {
    fetchOverrides();
  }, []);

  const fk = (path: string, locale: string): FormKey => `${path}:${locale}`;

  const fetchOverrides = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("seo_overrides").select("*");
    const map: Record<FormKey, SeoOverride> = {};
    const formMap: Record<FormKey, SeoForm> = {};

    (data || []).forEach((d: SeoOverride & { locale?: string }) => {
      const locale = d.locale || "ro";
      const k = fk(d.page_path, locale);
      map[k] = d;
      formMap[k] = {
        meta_title: d.meta_title || "",
        meta_description: d.meta_description || "",
        og_image_url: d.og_image_url || "",
      };
    });

    // Initialize empty forms for all combos
    SITE_PAGES.forEach((p) => {
      LOCALES.forEach((l) => {
        const k = fk(p.path, l.code);
        if (!formMap[k]) {
          formMap[k] = { meta_title: "", meta_description: "", og_image_url: "" };
        }
      });
    });

    setOverrides(map);
    setForms(formMap);
    setLoading(false);
  };

  const handleSave = async (pagePath: string, locale: string) => {
    const k = fk(pagePath, locale);
    setSaving(k);
    const form = forms[k];

    const res = await fetch("/api/admin/seo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page_path: pagePath,
        locale,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
        og_image_url: form.og_image_url || null,
      }),
    });

    if (res.ok) {
      setSaved(k);
      setTimeout(() => setSaved(null), 2000);
      fetchOverrides();
    }
    setSaving(null);
  };

  const handleReset = async (pagePath: string, locale: string) => {
    const k = fk(pagePath, locale);
    const override = overrides[k];
    if (!override) return;
    if (!confirm("Resetezi SEO la valorile implicite?")) return;

    const res = await fetch(`/api/admin/seo/${override.id}`, { method: "DELETE" });
    if (res.ok) {
      setForms((f) => ({
        ...f,
        [k]: { meta_title: "", meta_description: "", og_image_url: "" },
      }));
      fetchOverrides();
    }
  };

  const updateForm = (path: string, locale: string, field: keyof SeoForm, value: string) => {
    const k = fk(path, locale);
    setForms((f) => ({
      ...f,
      [k]: { ...f[k], [field]: value },
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Search size={18} className="text-text-ghost" />
          <h1 className="text-2xl font-light">SEO Management</h1>
        </div>
        <p className="font-body text-sm text-text-muted">
          Gestioneaza meta tags SEO per pagina — bilingv (RO + EN)
        </p>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : (
        <div className="space-y-6">
          {SITE_PAGES.map((page) => (
            <div key={page.path} className="border border-border-light rounded-sm">
              {/* Page header */}
              <div className="px-5 pt-4 pb-3 border-b border-border-light">
                <div className="flex items-center gap-3">
                  <h3 className="font-body text-sm font-medium text-text-primary">
                    {page.label}
                  </h3>
                  <span className="font-mono text-[10px] text-text-ghost">{page.path}</span>
                  {LOCALES.map((l) => {
                    const k = fk(page.path, l.code);
                    return overrides[k] ? (
                      <span key={l.code} className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-green-400/30 text-green-400 rounded-sm">
                        {l.code.toUpperCase()}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              {/* Locale sections */}
              {LOCALES.map((l) => {
                const k = fk(page.path, l.code);
                const form = forms[k] || { meta_title: "", meta_description: "", og_image_url: "" };
                const hasOverride = !!overrides[k];

                return (
                  <div key={l.code} className="px-5 py-4 border-b border-border-light last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[11px] tracking-[2px] uppercase text-text-muted font-semibold">
                        {l.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {hasOverride && (
                          <button
                            onClick={() => handleReset(page.path, l.code)}
                            className="p-2 text-text-ghost hover:text-amber-400 transition-colors"
                            title="Reseteaza la default"
                          >
                            <RotateCcw size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => handleSave(page.path, l.code)}
                          disabled={saving === k}
                          className="flex items-center gap-1 font-mono text-[10px] tracking-[2px] uppercase px-3 py-1.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200 disabled:opacity-50"
                        >
                          <Save size={12} />
                          {saving === k ? "..." : saved === k ? "Salvat!" : "Salveaza"}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
                          Meta Title
                        </label>
                        <input
                          type="text"
                          value={form.meta_title}
                          onChange={(e) => updateForm(page.path, l.code, "meta_title", e.target.value)}
                          placeholder={l.code === "ro" ? "Titlu pagina pentru motoarele de cautare..." : "Page title for search engines..."}
                          className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                        />
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
                          Meta Description
                        </label>
                        <textarea
                          value={form.meta_description}
                          onChange={(e) => updateForm(page.path, l.code, "meta_description", e.target.value)}
                          rows={2}
                          placeholder={l.code === "ro" ? "Descriere pentru motoarele de cautare (max 160 caractere)..." : "Search engine description (max 160 characters)..."}
                          className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
                        />
                        {form.meta_description && (
                          <div className={`font-mono text-[10px] mt-1 ${form.meta_description.length > 160 ? "text-rifc-red" : "text-text-ghost"}`}>
                            {form.meta_description.length}/160
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
                          OG Image URL
                        </label>
                        <input
                          type="url"
                          value={form.og_image_url}
                          onChange={(e) => updateForm(page.path, l.code, "og_image_url", e.target.value)}
                          placeholder="URL imagine pentru social sharing..."
                          className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
