"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, FileText, X, Loader2 } from "lucide-react";

export default function NewResourcePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "whitepaper" as string,
    status: "coming_soon" as string,
    file_url: "",
    file_size: "",
  });

  const handleUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/resources/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      setForm((f) => ({
        ...f,
        file_url: data.url,
        file_size: data.fileSize,
      }));
    } else {
      const err = await res.json();
      alert(`Upload esuat: ${err.error}`);
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

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

        {/* PDF Upload Section */}
        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
            Fisier PDF
          </label>

          {form.file_url ? (
            <div className="flex items-center gap-3 bg-surface-card border border-border-light rounded-sm p-3">
              <FileText size={20} className="text-rifc-red shrink-0" />
              <div className="flex-1 min-w-0">
                <a
                  href={form.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-text-primary hover:text-rifc-red transition-colors truncate block"
                >
                  {form.file_url.split("/").pop()}
                </a>
                {form.file_size && (
                  <span className="font-mono text-[10px] text-text-ghost">{form.file_size}</span>
                )}
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, file_url: "", file_size: "" }))}
                className="p-1 text-text-ghost hover:text-rifc-red transition-colors"
                title="Sterge fisierul"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-sm p-8 cursor-pointer transition-all duration-200 ${
                dragOver
                  ? "border-rifc-red bg-[rgba(220,38,38,0.05)]"
                  : "border-border-light hover:border-border-medium"
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 size={24} className="text-rifc-red animate-spin" />
                  <span className="font-body text-sm text-text-muted">Se incarca...</span>
                </>
              ) : (
                <>
                  <Upload size={24} className="text-text-ghost" />
                  <span className="font-body text-sm text-text-muted">
                    Trage fisierul aici sau click pentru a selecta
                  </span>
                  <span className="font-mono text-[10px] text-text-ghost">
                    PDF, DOC, DOCX — fara limita de dimensiune
                  </span>
                </>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Manual URL fallback */}
        <div>
          <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
            URL Fisier (sau introdu manual)
          </label>
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
