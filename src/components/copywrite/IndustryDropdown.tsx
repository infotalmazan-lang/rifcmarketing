"use client";

import { useState, useRef, useEffect } from "react";
import { CW_INDUSTRIES } from "@/lib/constants/copywrite";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function IndustryDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = CW_INDUSTRIES.filter(
    (ind) =>
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.cat.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered.reduce<Record<string, string[]>>((acc, ind) => {
    if (!acc[ind.cat]) acc[ind.cat] = [];
    acc[ind.cat].push(ind.name);
    return acc;
  }, {});

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.03] border border-white/10 hover:border-white/20 text-left transition-colors"
      >
        <span className="font-cw-mono text-sm text-text-primary truncate">
          {value || "Selecteaza industria"}
        </span>
        <svg
          className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-lg bg-[#1a1a2e] border border-white/10 shadow-2xl max-h-72 overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-white/5">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cauta industria..."
              className="w-full px-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm font-cw-mono text-text-primary placeholder:text-text-ghost focus:outline-none focus:border-cwAgent-CTA/40"
              autoFocus
            />
          </div>

          {/* Results */}
          <div className="overflow-y-auto max-h-56 p-1">
            {Object.entries(grouped).map(([cat, names]) => (
              <div key={cat}>
                <div className="px-3 py-1.5 font-cw-mono text-[10px] tracking-wider uppercase text-text-ghost">
                  {cat}
                </div>
                {names.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-cw-mono transition-colors ${
                      value === name
                        ? "bg-cwAgent-CTA/10 text-cwAgent-CTA"
                        : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="px-3 py-4 text-center">
                <p className="font-cw-mono text-xs text-text-ghost mb-2">
                  Nicio industrie gasita
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(search);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="font-cw-mono text-xs text-cwAgent-CTA hover:underline"
                >
                  + Adauga &quot;{search}&quot;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
