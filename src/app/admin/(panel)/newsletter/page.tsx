"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Search, Download, CheckCircle, XCircle } from "lucide-react";
import type { NewsletterSubscriber } from "@/types";

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });
    setSubscribers((data as NewsletterSubscriber[]) || []);
    setLoading(false);
  };

  const filtered = subscribers.filter(
    (s) =>
      !search || s.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: subscribers.length,
    confirmed: subscribers.filter((s) => s.confirmed).length,
    unsubscribed: subscribers.filter((s) => s.unsubscribed_at).length,
    active: subscribers.filter((s) => !s.unsubscribed_at).length,
  };

  const exportCSV = () => {
    const header = "Email,Abonat la,Confirmat,Dezabonat la\n";
    const rows = filtered
      .map(
        (s) =>
          `${s.email},${s.subscribed_at},${s.confirmed},${s.unsubscribed_at || ""}`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mail size={18} className="text-text-ghost" />
            <h1 className="text-2xl font-light">Newsletter</h1>
          </div>
          <p className="font-body text-sm text-text-muted">
            Gestioneaza subscriberii newsletter
          </p>
        </div>
        <button
          onClick={exportCSV}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-border-light text-text-muted rounded-sm hover:border-border-red-subtle hover:text-text-primary transition-all duration-200 disabled:opacity-50"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total, color: "text-blue-400" },
          { label: "Activi", value: stats.active, color: "text-green-400" },
          {
            label: "Confirmati",
            value: stats.confirmed,
            color: "text-cyan-400",
          },
          {
            label: "Dezabonati",
            value: stats.unsubscribed,
            color: "text-text-ghost",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-4 border border-border-light rounded-sm"
          >
            <div className={`font-mono text-xl ${stat.color}`}>
              {stat.value}
            </div>
            <div className="font-mono text-[10px] tracking-[2px] uppercase text-text-ghost">
              {stat.label}
            </div>
          </div>
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
          placeholder="Cauta dupa email..."
          className="w-full max-w-[400px] bg-surface-card border border-border-light rounded-sm pl-10 pr-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : filtered.length === 0 ? (
        <p className="font-body text-sm text-text-ghost">
          Niciun subscriber gasit.
        </p>
      ) : (
        <div className="border border-border-light rounded-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">
                  Email
                </th>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">
                  Abonat la
                </th>
                <th className="text-center font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">
                  Confirmat
                </th>
                <th className="text-left font-mono text-[10px] tracking-[2px] uppercase text-text-ghost px-4 py-3">
                  Dezabonat
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-border-subtle hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  <td className="px-4 py-3 font-body text-sm text-text-primary">
                    {sub.email}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">
                    {new Date(sub.subscribed_at).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {sub.confirmed ? (
                      <CheckCircle
                        size={14}
                        className="text-green-400 inline"
                      />
                    ) : (
                      <XCircle size={14} className="text-text-ghost inline" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-ghost">
                    {sub.unsubscribed_at
                      ? new Date(sub.unsubscribed_at).toLocaleDateString(
                          "ro-RO"
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
