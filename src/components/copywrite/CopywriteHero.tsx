"use client";

import { useEffect, useState } from "react";
import { CW_AGENTS, CW_AGENT_COLORS } from "@/lib/constants/copywrite";
import type { CWAgentKey } from "@/types/copywrite";
import AgentOrb from "./AgentOrb";

const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

interface Props {
  onStart: () => void;
}

export default function CopywriteHero({ onStart }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{
            background: `radial-gradient(circle, ${CW_AGENT_COLORS.R.hex}, transparent 70%)`,
            top: "10%",
            left: "-10%",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-10"
          style={{
            background: `radial-gradient(circle, ${CW_AGENT_COLORS.F.hex}, transparent 70%)`,
            bottom: "5%",
            right: "-5%",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-8"
          style={{
            background: `radial-gradient(circle, ${CW_AGENT_COLORS.CTA.hex}, transparent 70%)`,
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>

      {/* Content */}
      <div
        className="relative z-10 text-center max-w-3xl transition-all duration-1000"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        {/* Label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02] mb-8">
          <span className="font-cw-mono text-[11px] tracking-[2px] uppercase text-text-secondary">
            Text ADN Studio
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-cwAgent-CTA animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="font-cw-heading font-bold text-4xl md:text-6xl lg:text-7xl text-text-primary leading-[1.1] mb-6">
          Diagnosticul ADN-ului
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cwAgent-R via-cwAgent-I to-cwAgent-F">
            textului tau
          </span>
        </h1>

        {/* Subtitle */}
        <p className="font-cw-mono text-sm md:text-base text-text-secondary max-w-xl mx-auto mb-10 leading-relaxed">
          5 agenti AI analizeaza 40 de parametri ai copywriting-ului tau.
          <br />
          Relevanta. Interes. Forma. Claritate. CTA.
        </p>

        {/* Agent orbs row */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mb-12">
          {AGENT_KEYS.map((key, i) => (
            <div key={key} className="flex flex-col items-center gap-2">
              <AgentOrb
                label={key}
                color={CW_AGENT_COLORS[key].hex}
                rgb={CW_AGENT_COLORS[key].rgb}
                size={64}
                delay={i * 0.3}
              />
              <span
                className="font-cw-mono text-[10px] tracking-wider uppercase"
                style={{ color: CW_AGENT_COLORS[key].hex }}
              >
                {CW_AGENTS[key].name}
              </span>
            </div>
          ))}
        </div>

        {/* Formula */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="font-cw-mono text-xs text-text-muted">
            R + (I x F) = C
          </span>
          <span className="text-text-ghost">|</span>
          <span className="font-cw-mono text-xs text-cwAgent-CTA">
            + CTA amplifier
          </span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cwAgent-R/20 via-cwAgent-F/20 to-cwAgent-CTA/20 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
        >
          <span className="font-cw-heading font-semibold text-lg text-text-primary">
            Configureaza Auditul
          </span>
          <svg
            className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cwAgent-R/5 via-cwAgent-F/5 to-cwAgent-CTA/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>

        {/* Bottom stats */}
        <div className="flex items-center justify-center gap-8 mt-10">
          {[
            { value: "5", label: "Agenti AI" },
            { value: "40", label: "Subfactori" },
            { value: "12", label: "Camp. Profil" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-cw-heading font-bold text-xl text-text-primary">
                {stat.value}
              </div>
              <div className="font-cw-mono text-[10px] tracking-wider uppercase text-text-muted">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
