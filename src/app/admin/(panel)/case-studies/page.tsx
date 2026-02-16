"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BarChart3, Plus, Edit3, Trash2, Eye, EyeOff } from "lucide-react";
import type { CaseStudy } from "@/types";

export default function CaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });
    setStudies((data as CaseStudy[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur ca vrei sa stergi acest case study?")) return;
    const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStudies((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const togglePublish = async (study: CaseStudy) => {
    const res = await fetch(`/api/admin/case-studies/${study.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !study.is_published }),
    });
    if (res.ok) {
      setStudies((prev) =>
        prev.map((s) =>
          s.id === study.id ? { ...s, is_published: !s.is_published } : s
        )
      );
    }
  };

  const clarityLabel = (c: number) => {
    if (c <= 20) return { text: "Critic", color: "text-rifc-red" };
    if (c <= 50) return { text: "Zgomot", color: "text-amber-400" };
    if (c <= 80) return { text: "Mediu", color: "text-blue-400" };
    return { text: "Suprem", color: "text-green-400" };
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={18} className="text-text-ghost" />
            <h1 className="text-2xl font-light">Case Studies</h1>
          </div>
          <p className="font-body text-sm text-text-muted">
            Gestioneaza studiile de caz R IF C
          </p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
        >
          <Plus size={14} /> Case Study Nou
        </Link>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : studies.length === 0 ? (
        <div className="text-center py-16 border border-border-light rounded-sm">
          <BarChart3 size={32} className="text-text-ghost mx-auto mb-4 opacity-40" />
          <p className="font-body text-sm text-text-ghost mb-4">Niciun case study inca.</p>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
          >
            <Plus size={14} /> Creeaza Primul Case Study
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {studies.map((study) => {
            const before = clarityLabel(study.before_c);
            const after = clarityLabel(study.after_c);
            return (
              <div
                key={study.id}
                className="flex items-center justify-between p-4 border border-border-light rounded-sm hover:border-border-red-subtle transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-body text-sm font-medium text-text-primary truncate">
                      {study.title}
                    </h3>
                    {study.is_published ? (
                      <span className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-green-400/30 text-green-400 rounded-sm">
                        Publicat
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-border-subtle text-text-ghost rounded-sm">
                        Draft
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-text-ghost font-mono text-[10px]">
                    <span>{study.industry}</span>
                    <span>
                      C: <span className={before.color}>{study.before_c}</span>{" "}
                      &rarr;{" "}
                      <span className={after.color}>{study.after_c}</span>
                    </span>
                    <span>{study.metric_improvement}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <button
                    onClick={() => togglePublish(study)}
                    className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                  >
                    {study.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <Link
                    href={`/admin/case-studies/${study.id}/edit`}
                    className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(study.id)}
                    className="p-2 text-text-ghost hover:text-rifc-red transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
