"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  MessageSquare,
  Search,
  Building2,
  DollarSign,
  Clock,
} from "lucide-react";
import type { ConsultingRequest } from "@/types";

type StatusFilter = "all" | "new" | "contacted" | "closed";

export default function ConsultingPage() {
  const [requests, setRequests] = useState<ConsultingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("consulting_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests((data as ConsultingRequest[]) || []);
    setLoading(false);
  };

  const filtered = requests.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.company || "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: requests.length,
    new: requests.filter((r) => r.status === "new").length,
    contacted: requests.filter((r) => r.status === "contacted").length,
    closed: requests.filter((r) => r.status === "closed").length,
  };

  const statusColor = (status: string) => {
    if (status === "new") return "text-rifc-red border-[rgba(220,38,38,0.3)]";
    if (status === "contacted") return "text-amber-400 border-amber-400/30";
    return "text-text-ghost border-border-subtle";
  };

  const tabs: { key: StatusFilter; label: string }[] = [
    { key: "all", label: "Toate" },
    { key: "new", label: "Noi" },
    { key: "contacted", label: "Contactate" },
    { key: "closed", label: "Inchise" },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={18} className="text-text-ghost" />
          <h1 className="text-2xl font-light">Cereri Consultanta</h1>
        </div>
        <p className="font-body text-sm text-text-muted">
          Gestioneaza cererile de consultanta primite
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border-subtle pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`font-mono text-[11px] tracking-[2px] uppercase px-4 py-2 rounded-sm transition-all duration-200 ${
              filter === tab.key
                ? "bg-surface-card text-text-primary border border-border-light"
                : "text-text-ghost hover:text-text-muted border border-transparent"
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-ghost"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cauta dupa nume, email sau companie..."
          className="w-full max-w-[400px] bg-surface-card border border-border-light rounded-sm pl-10 pr-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
        />
      </div>

      {/* List */}
      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-text-ghost">
          Nicio cerere gasita.
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => (
            <Link
              key={req.id}
              href={`/admin/consulting/${req.id}`}
              className="block p-5 border border-border-light rounded-sm hover:border-border-red-subtle transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-body text-sm font-medium text-text-primary">
                      {req.name}
                    </h3>
                    <span
                      className={`font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border rounded-sm ${statusColor(req.status)}`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-text-ghost font-body text-xs">
                    <span>{req.email}</span>
                    {req.company && (
                      <span className="flex items-center gap-1">
                        <Building2 size={12} /> {req.company}
                      </span>
                    )}
                    {req.budget_range && (
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} /> {req.budget_range}
                      </span>
                    )}
                  </div>
                  <p className="font-body text-sm text-text-muted mt-2 line-clamp-2">
                    {req.message}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-text-ghost font-mono text-[10px] flex-shrink-0">
                  <Clock size={12} />
                  {new Date(req.created_at).toLocaleDateString("ro-RO")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
