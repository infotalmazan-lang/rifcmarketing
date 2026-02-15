"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Send, Check, AlertTriangle } from "lucide-react";

const BUDGET_RANGES = [
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $15,000",
  "$15,000 - $50,000",
  "$50,000+",
];

export default function ConsultingPage() {
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
      setError("Something went wrong. Please try again or email directly.");
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
        <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
          Work Together
        </span>
        <h1 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-4">
          Book <strong className="font-semibold">Consulting</strong>
        </h1>
        <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-12 font-light">
          Work directly with Dumitru Talmazan to audit your marketing using
          R IF C, identify weak variables, and create a clarity roadmap for
          your business.
        </p>

        {submitted ? (
          <div className="border border-rifc-green rounded-sm p-12 text-center bg-[rgba(5,150,105,0.02)]">
            <Check size={48} className="text-rifc-green mx-auto mb-4" />
            <h2 className="text-xl font-light mb-2">Request Received</h2>
            <p className="font-body text-sm text-text-muted">
              Thank you for your interest. You&apos;ll receive a response within
              24&ndash;48 hours.
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
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => update("company", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                  placeholder="Company name"
                />
              </div>
              <div>
                <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                  Budget Range
                </label>
                <select
                  value={form.budget_range}
                  onChange={(e) => update("budget_range", e.target.value)}
                  className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-border-red-subtle"
                >
                  <option value="">Select range...</option>
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
                Message *
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary resize-none focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
                placeholder="Tell us about your project and what you need help with..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 font-mono text-xs tracking-[3px] uppercase px-10 py-4 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-300 hover:bg-rifc-red-light disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Request"} <Send size={14} />
            </button>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}
