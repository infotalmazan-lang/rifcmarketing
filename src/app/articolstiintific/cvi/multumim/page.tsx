"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   RIFC CVI — Thank You Page
   Shown after successful CVI evaluation submission
   ═══════════════════════════════════════════════════════════ */

export default function MultumimPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8F7F4" }} />}>
      <MultumimContent />
    </Suspense>
  );
}

function MultumimContent() {
  const searchParams = useSearchParams();
  const cviR = searchParams.get("r") || "—";
  const cviI = searchParams.get("i") || "—";
  const cviF = searchParams.get("f") || "—";
  const cviC = searchParams.get("c") || "—";

  const bgColor = "#F8F7F4";
  const cardBg = "#FFFFFF";
  const border = "#E5E3DC";
  const muted = "#78716C";
  const textDark = "#1C1917";

  return (
    <div style={{ minHeight: "100vh", background: bgColor, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "white", borderBottom: `1px solid ${border}`, padding: "14px 32px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>
          <span style={{ color: "#DC2626" }}>R</span> + (<span style={{ color: "#2563EB" }}>I</span> × <span style={{ color: "#059669" }}>F</span>) = <span style={{ color: "#D97706" }}>C</span>
        </span>
        <span style={{ color: border, fontSize: 18 }}>|</span>
        <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>Evaluare completă</span>
      </header>

      {/* Content */}
      <div style={{ maxWidth: 860, margin: "60px auto", padding: 32, textAlign: "center" }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "48px 32px" }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>&#x2705;</div>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: textDark, marginBottom: 12 }}>
            Evaluare transmisă cu succes!
          </h2>
          <p style={{ color: muted, fontSize: 16, maxWidth: 500, margin: "0 auto 24px" }}>
            Vă mulțumim pentru contribuția la validarea Protocolului RIFC.
            Rezultatele vor fi publicate pe osf.io/9y75d după finalizarea studiului.
          </p>

          {/* CVI scores if passed via query params */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 28 }}>
            {[
              { dim: "R", label: "Relevanță", val: cviR, bg: "#FEF2F2", color: "#DC2626" },
              { dim: "I", label: "Interes", val: cviI, bg: "#EFF6FF", color: "#2563EB" },
              { dim: "F", label: "Formă", val: cviF, bg: "#ECFDF5", color: "#059669" },
              { dim: "C", label: "Claritate", val: cviC, bg: "#FFFBEB", color: "#D97706" },
            ].map(d => (
              <div key={d.dim} style={{ padding: 16, borderRadius: 10, textAlign: "center", background: d.bg, color: d.color }}>
                <strong style={{ display: "block", fontSize: 28, fontWeight: 800 }}>{d.val}</strong>
                <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>CVI — {d.label}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 13, color: muted, marginTop: 32, lineHeight: 1.6 }}>
            Studiu pre-registrat: <strong>osf.io/9y75d</strong><br />
            RIFC Marketing Protocol · Dumitru Talmazan, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
