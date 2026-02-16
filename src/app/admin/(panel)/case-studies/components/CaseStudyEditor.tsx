"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import type { CaseStudy } from "@/types";

interface CaseStudyEditorProps {
  study?: CaseStudy;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function CaseStudyEditor({ study, isNew }: CaseStudyEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: study?.title || "",
    slug: study?.slug || "",
    industry: study?.industry || "",
    description: study?.description || "",
    before_r: study?.before_r || 1,
    before_i: study?.before_i || 1,
    before_f: study?.before_f || 1,
    after_r: study?.after_r || 1,
    after_i: study?.after_i || 1,
    after_f: study?.after_f || 1,
    metric_improvement: study?.metric_improvement || "",
    is_published: study?.is_published || false,
  });

  const beforeC = form.before_r + form.before_i * form.before_f;
  const afterC = form.after_r + form.after_i * form.after_f;

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isNew ? slugify(title) : f.slug,
    }));
  };

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const url = isNew
      ? "/api/admin/case-studies"
      : `/api/admin/case-studies/${study?.id}`;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        before_c: beforeC,
        after_c: afterC,
      }),
    });

    if (res.ok) {
      router.push("/admin/case-studies");
      router.refresh();
    }
    setSaving(false);
  };

  const ScoreInput = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div>
      <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-1">
        {label}
      </label>
      <input
        type="number"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-mono text-sm text-text-primary focus:outline-none focus:border-border-red-subtle text-center"
      />
    </div>
  );

  const clarityColor = (c: number) => {
    if (c <= 20) return "text-rifc-red";
    if (c <= 50) return "text-amber-400";
    if (c <= 80) return "text-blue-400";
    return "text-green-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/admin/case-studies")}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} /> Inapoi
        </button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
              className="accent-rifc-red"
            />
            Publicat
          </label>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.description}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-200 hover:bg-rifc-red-light disabled:opacity-50"
          >
            <Save size={14} /> {saving ? "Se salveaza..." : "Salveaza"}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Titlu
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Titlu case study..."
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Industrie
            </label>
            <input
              type="text"
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              placeholder="ex: E-commerce, SaaS, Retail..."
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
            Descriere
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={4}
            placeholder="Descrierea studiului de caz..."
            className="w-full bg-surface-card border border-border-light rounded-sm p-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
          />
        </div>

        {/* Before/After Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before */}
          <div className="border border-border-light rounded-sm p-5">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-4">
              Inainte
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <ScoreInput label="R" value={form.before_r} onChange={(v) => setForm((f) => ({ ...f, before_r: v }))} />
              <ScoreInput label="I" value={form.before_i} onChange={(v) => setForm((f) => ({ ...f, before_i: v }))} />
              <ScoreInput label="F" value={form.before_f} onChange={(v) => setForm((f) => ({ ...f, before_f: v }))} />
            </div>
            <div className="text-center">
              <span className="font-mono text-xs text-text-ghost">C = {form.before_r} + ({form.before_i} x {form.before_f}) = </span>
              <span className={`font-mono text-lg ${clarityColor(beforeC)}`}>{beforeC}</span>
            </div>
          </div>

          {/* After */}
          <div className="border border-border-light rounded-sm p-5">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-4">
              Dupa
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <ScoreInput label="R" value={form.after_r} onChange={(v) => setForm((f) => ({ ...f, after_r: v }))} />
              <ScoreInput label="I" value={form.after_i} onChange={(v) => setForm((f) => ({ ...f, after_i: v }))} />
              <ScoreInput label="F" value={form.after_f} onChange={(v) => setForm((f) => ({ ...f, after_f: v }))} />
            </div>
            <div className="text-center">
              <span className="font-mono text-xs text-text-ghost">C = {form.after_r} + ({form.after_i} x {form.after_f}) = </span>
              <span className={`font-mono text-lg ${clarityColor(afterC)}`}>{afterC}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
            Imbunatatire metrica
          </label>
          <input
            type="text"
            value={form.metric_improvement}
            onChange={(e) => setForm((f) => ({ ...f, metric_improvement: e.target.value }))}
            placeholder="ex: +340% conversii, -60% CPL..."
            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
          />
        </div>
      </div>
    </div>
  );
}
