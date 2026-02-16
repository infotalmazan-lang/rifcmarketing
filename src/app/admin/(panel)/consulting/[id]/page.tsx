"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Clock,
  Save,
} from "lucide-react";

interface ConsultingDetail {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  budget_range: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

export default function ConsultingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<ConsultingDetail | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("consulting_requests")
      .select("*")
      .eq("id", id)
      .single();
    if (data) {
      setRequest(data as ConsultingDetail);
      setStatus(data.status);
      setNotes(data.admin_notes || "");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/consulting/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  if (!request)
    return (
      <p className="font-body text-sm text-text-ghost">Se incarca...</p>
    );

  const statusColor = (s: string) => {
    if (s === "new") return "text-rifc-red border-[rgba(220,38,38,0.3)]";
    if (s === "contacted") return "text-amber-400 border-amber-400/30";
    return "text-text-ghost border-border-subtle";
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/consulting")}
        className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Inapoi la cereri
      </button>

      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-light mb-1">{request.name}</h1>
          <div className="flex items-center gap-4 text-text-muted font-body text-sm">
            <span className="flex items-center gap-1">
              <Mail size={14} /> {request.email}
            </span>
            {request.phone && (
              <span className="flex items-center gap-1">
                <Phone size={14} /> {request.phone}
              </span>
            )}
          </div>
        </div>
        <span
          className={`font-mono text-[10px] tracking-[1px] uppercase px-3 py-1 border rounded-sm ${statusColor(request.status)}`}
        >
          {request.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message */}
          <div className="border border-border-light rounded-sm p-5">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-3">
              Mesaj
            </h3>
            <p className="font-body text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
              {request.message}
            </p>
          </div>

          {/* Admin Notes */}
          <div className="border border-border-light rounded-sm p-5">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-3">
              Note Admin
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Adauga note interne..."
              className="w-full bg-surface-card border border-border-light rounded-sm p-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
            />
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          {/* Details */}
          <div className="border border-border-light rounded-sm p-5 space-y-4">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost">
              Detalii
            </h3>
            {request.company && (
              <div className="flex items-center gap-2 font-body text-sm text-text-muted">
                <Building2 size={14} className="text-text-ghost" />
                {request.company}
              </div>
            )}
            {request.budget_range && (
              <div className="flex items-center gap-2 font-body text-sm text-text-muted">
                <DollarSign size={14} className="text-text-ghost" />
                {request.budget_range}
              </div>
            )}
            <div className="flex items-center gap-2 font-body text-sm text-text-muted">
              <Clock size={14} className="text-text-ghost" />
              {new Date(request.created_at).toLocaleString("ro-RO")}
            </div>
          </div>

          {/* Status */}
          <div className="border border-border-light rounded-sm p-5">
            <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-3">
              Status
            </h3>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
            >
              <option value="new">Nou</option>
              <option value="contacted">Contactat</option>
              <option value="closed">Inchis</option>
            </select>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-3 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-200 hover:bg-rifc-red-light disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Se salveaza..." : saved ? "Salvat!" : "Salveaza"}
          </button>
        </div>
      </div>
    </div>
  );
}
