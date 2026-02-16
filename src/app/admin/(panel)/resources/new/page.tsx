"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";

export default function NewResourcePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "whitepaper" as string,
    status: "coming_soon" as string,
    file_url: "",
    file_size: "",
  });

  const handleSave = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        file_url: form.file_url || null,
        file_size: form.file_size || null,
      }),
    });
    if (res.ok) {
      router.push("/admin/resources");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/resources")}
        className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Inapoi
      </button>

      <h1 className="text-2xl font-light mb-8">Resursa Noua</h1>

      <div className="max-w-[600px] space-y-5">
        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">Titlu</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            placeholder="Titlu resursa..."
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">Descriere</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full bg-surface-card border border-border-light rounded-sm p-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
            placeholder="Descriere resursa..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">Tip</label>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
            >
              <option value="whitepaper">White Paper</option>
              <option value="template">Template</option>
              <option value="card">Card Diagnostic</option>
              <option value="paper">Lucrare Stiintifica</option>
            </select>
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
            >
              <option value="available">Disponibil</option>
              <option value="coming_soon">In curand</option>
              <option value="in_development">In dezvoltare</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">URL Fisier</label>
          <input
            type="url"
            value={form.file_url}
            onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">Dimensiune</label>
          <input
            type="text"
            value={form.file_size}
            onChange={(e) => setForm((f) => ({ ...f, file_size: e.target.value }))}
            className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            placeholder="ex: 2.4 MB"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.description}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-6 py-3 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-200 hover:bg-rifc-red-light disabled:opacity-50"
        >
          <Save size={14} /> {saving ? "Se salveaza..." : "Salveaza"}
        </button>
      </div>
    </div>
  );
}
