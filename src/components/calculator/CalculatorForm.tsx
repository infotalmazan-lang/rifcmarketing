"use client";

import { useState } from "react";
import { calculateC, checkRelevanceGate, getScoreRange, getDiagnosis } from "@/lib/utils";
import { ZONES, RELEVANCE_GATE_THRESHOLD } from "@/lib/constants/rifc";
import { AlertTriangle, Copy, Check, Save } from "lucide-react";
import ScoreDisplay from "./ScoreDisplay";
import DiagnosticResult from "./DiagnosticResult";

export default function CalculatorForm() {
  const [r, setR] = useState(5);
  const [i, setI] = useState(5);
  const [f, setF] = useState(5);
  const [channel, setChannel] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const c = calculateC(r, i, f);
  const gatePass = checkRelevanceGate(r);
  const range = getScoreRange(c);
  const diagnosis = getDiagnosis(r, i, f);

  const handleCopy = () => {
    const text = `R IF C Score\nR: ${r} | I: ${i} | F: ${f}\nC = ${r} + (${i} × ${f}) = ${c}\n${range.label} — ${range.status}\n${channel ? `Channel: ${channel}\n` : ""}${diagnosis}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    const calculations = JSON.parse(localStorage.getItem("rifc_calculations") || "[]");
    calculations.unshift({
      id: Date.now().toString(),
      r_score: r,
      i_score: i,
      f_score: f,
      c_score: c,
      channel,
      notes,
      diagnosis,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("rifc_calculations", JSON.stringify(calculations.slice(0, 50)));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Input panel */}
      <div className="space-y-8">
        {/* R slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="font-mono text-sm tracking-[2px] text-rifc-red">
              R — RELEVANCE
            </label>
            <span className="font-mono text-2xl font-light text-rifc-red">{r}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={r}
            onChange={(e) => setR(Number(e.target.value))}
            className="w-full h-1 bg-border-light rounded appearance-none cursor-pointer accent-rifc-red"
          />
          <div className="flex justify-between font-mono text-[10px] text-text-ghost mt-1">
            <span>1</span>
            <span>
              {r < RELEVANCE_GATE_THRESHOLD && (
                <span className="text-rifc-red flex items-center gap-1">
                  <AlertTriangle size={10} /> Below Gate
                </span>
              )}
            </span>
            <span>10</span>
          </div>
        </div>

        {/* I slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="font-mono text-sm tracking-[2px] text-rifc-blue">
              I — INTEREST
            </label>
            <span className="font-mono text-2xl font-light text-rifc-blue">{i}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            className="w-full h-1 bg-border-light rounded appearance-none cursor-pointer accent-[#2563EB]"
          />
          <div className="flex justify-between font-mono text-[10px] text-text-ghost mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* F slider */}
        <div>
          <div className="flex justify-between items-baseline mb-3">
            <label className="font-mono text-sm tracking-[2px] text-rifc-amber">
              F — FORM
            </label>
            <span className="font-mono text-2xl font-light text-rifc-amber">{f}</span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={f}
            onChange={(e) => setF(Number(e.target.value))}
            className="w-full h-1 bg-border-light rounded appearance-none cursor-pointer accent-[#D97706]"
          />
          <div className="flex justify-between font-mono text-[10px] text-text-ghost mt-1">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Channel select */}
        <div>
          <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
            Channel (Optional)
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary appearance-none cursor-pointer focus:outline-none focus:border-border-red-subtle"
          >
            <option value="">Select a channel...</option>
            {ZONES.map((z) => (
              <option key={z.name} value={z.name}>
                {z.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Campaign name, URL, or context..."
            rows={3}
            className="w-full bg-surface-card border border-border-light rounded-sm px-4 py-3 font-body text-sm text-text-primary resize-none focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-6 py-3 border border-border-red-subtle text-rifc-red rounded-sm transition-all duration-300 hover:bg-[rgba(220,38,38,0.1)]"
          >
            {saved ? <Check size={14} /> : <Save size={14} />}
            {saved ? "Saved" : "Save Locally"}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-6 py-3 border border-border-light text-text-muted rounded-sm transition-all duration-300 hover:bg-[rgba(255,255,255,0.03)]"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy Result"}
          </button>
        </div>
      </div>

      {/* Result panel */}
      <div className="space-y-8">
        <ScoreDisplay r={r} i={i} f={f} c={c} gatePass={gatePass} range={range} />
        <DiagnosticResult diagnosis={diagnosis} gatePass={gatePass} r={r} i={i} f={f} />
      </div>
    </div>
  );
}
