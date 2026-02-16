"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Download, Plus, Edit3, Trash2 } from "lucide-react";
import type { Resource } from "@/types";

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    setResources((data as Resource[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur ca vrei sa stergi aceasta resursa?")) return;
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    if (res.ok) setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const statusLabel = (s: string) => {
    if (s === "available") return { text: "Disponibil", color: "text-green-400 border-green-400/30" };
    if (s === "coming_soon") return { text: "In curand", color: "text-amber-400 border-amber-400/30" };
    return { text: "In dezvoltare", color: "text-blue-400 border-blue-400/30" };
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Download size={18} className="text-text-ghost" />
            <h1 className="text-2xl font-light">Resurse</h1>
          </div>
          <p className="font-body text-sm text-text-muted">
            Gestioneaza resursele downloadabile
          </p>
        </div>
        <Link
          href="/admin/resources/new"
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
        >
          <Plus size={14} /> Resursa Noua
        </Link>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : (
        <div className="space-y-3">
          {resources.map((res) => {
            const st = statusLabel(res.status);
            return (
              <div
                key={res.id}
                className="flex items-center justify-between p-4 border border-border-light rounded-sm hover:border-border-red-subtle transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-body text-sm font-medium text-text-primary truncate">
                      {res.title}
                    </h3>
                    <span className={`font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border rounded-sm ${st.color}`}>
                      {st.text}
                    </span>
                    <span className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-border-subtle text-text-ghost rounded-sm">
                      {res.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-text-ghost font-mono text-[10px]">
                    <span>{res.download_count} descarcari</span>
                    {res.file_size && <span>{res.file_size}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  <Link
                    href={`/admin/resources/${res.id}/edit`}
                    className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                  >
                    <Edit3 size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(res.id)}
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
