"use client";

import { useState } from "react";

interface Props {
  label: string;
  color: string;
  rgb: string;
  size?: number;
  delay?: number;
}

export default function AgentOrb({
  label,
  color,
  rgb,
  size = 80,
  delay = 0,
}: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative cursor-pointer transition-transform duration-300"
      style={{
        width: size,
        height: size,
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow layer */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, rgba(${rgb},0.4) 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5,
          transform: hovered ? "scale(1.4)" : "scale(1)",
          transition: "all 0.3s ease",
        }}
      />

      {/* Orb body */}
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          background: `radial-gradient(circle at 35% 35%, rgba(${rgb},0.3), rgba(${rgb},0.1) 50%, transparent 70%)`,
          border: `2px solid rgba(${rgb},${hovered ? 0.6 : 0.3})`,
          boxShadow: hovered
            ? `0 0 30px rgba(${rgb},0.4), inset 0 0 20px rgba(${rgb},0.1)`
            : `0 0 15px rgba(${rgb},0.2)`,
          transform: hovered ? "scale(1.1)" : "scale(1)",
        }}
      >
        <span
          className="font-cw-heading font-bold text-sm tracking-wider"
          style={{ color }}
        >
          {label}
        </span>
      </div>

      {/* Float animation via CSS */}
      <style jsx>{`
        div:first-child {
          animation: orbFloat 4s ease-in-out infinite;
          animation-delay: ${delay}s;
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
