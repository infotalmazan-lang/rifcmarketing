"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Send, Check, AlertTriangle } from "lucide-react";

export default function ConsultingPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
    budget_range: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      setError(t.consulting.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-prose mx-auto">
        <SectionHeader
          chapter={t.consulting.chapter}
          titlePlain={t.consulting.titlePlain}
          titleBold={t.consulting.titleBold}
          description={t.consulting.description}
          watermarkNumber="CT"
          watermarkColor="#2563EB"
        />

        {submitted ? (
          <div className="border border-rifc-green rounded-sm p-12 text-center bg-[rgba(5,150,105,0.02)]">
            <Check size={48} className="text-rifc-green mx-auto mb-4" />
            <h2 className="text-xl font-light mb-2">{t.consulting.successTitle}</h2>
            <p className="font-body text-sm text-text-muted">
              {t.consulting.successMessage}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 border border-[rgba(220,38,38,0.3)] bg-[rgba(220,38,38,0.05)] rounded-sm text-sm text-rifc-red font-body">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  {t.consulting.nameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder={t.consulting.namePlaceholder}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  {t.consulting.emailLabel}
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder={t.consulting.emailPlaceholder}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  {t.consulting.companyLabel}
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder={t.consulting.companyPlaceholder}
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  {t.consulting.budgetLabel}
                </label>
                <select
                  value={form.budget_range}
                  onChange={(e) => update("budget_range", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-border-red-subtle"
                >
                  <option value="">{t.consulting.budgetPlaceholder}</option>
                  {t.consulting.budgetRanges.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                {t.consulting.messageLabel}
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary resize-none focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                placeholder={t.consulting.messagePlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 font-mono text-xs tracking-[3px] uppercase px-10 py-4 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-300 hover:bg-rifc-red-light disabled:opacity-50"
            >
              {loading ? t.consulting.sending : t.consulting.sendRequest} <Send size={14} />
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
