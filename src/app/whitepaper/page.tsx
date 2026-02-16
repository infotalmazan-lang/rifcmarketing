"use client";

import { useEffect } from "react";

export default function WhitePaperPage() {
  useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (isInIframe) return;
    const timeout = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
        }
        @media screen {
          .wp-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
        }
        .wp-container {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          color: #1a1a1a; line-height: 1.7; font-size: 11pt;
        }
        .wp-container h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28pt; font-weight: 700; margin: 0 0 8px; line-height: 1.15; }
        .wp-btn-download {
          display: inline-flex; align-items: center; gap: 8px;
          background: #DC2626; color: white; border: none; cursor: pointer;
          padding: 14px 28px; font-size: 14px; font-weight: 600;
          border-radius: 6px; letter-spacing: 1px; text-transform: uppercase;
          font-family: 'DM Sans', system-ui, sans-serif; margin: 20px 0;
        }
        .wp-btn-download:hover { background: #b91c1c; }
      `}</style>

      <div className="no-print" style={{ background: "#0a0a0f", padding: "16px 24px", textAlign: "center" }}>
        <button className="wp-btn-download" onClick={() => window.print()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Salvează ca PDF (Ctrl+P / Cmd+P)
        </button>
        <p style={{ color: "#888", fontSize: 12, marginTop: 8 }}>
          Folosește &quot;Save as PDF&quot; ca destinație de imprimare.
        </p>
        <a
          href="/rifc-whitepaper-ro.pdf"
          download
          style={{ display: "inline-block", marginTop: 8, color: "#DC2626", fontSize: 13, textDecoration: "underline" }}
        >
          Sau descarcă PDF-ul direct
        </a>
      </div>

      <div className="wp-container">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "90vh" }}>
          <div style={{ color: "#DC2626", fontFamily: "'JetBrains Mono', monospace", fontSize: "11pt", letterSpacing: 4, marginBottom: 24 }}>
            PROTOCOL DE MARKETING
          </div>
          <h1>
            <span style={{ color: "#DC2626" }}>R</span>{" "}
            <span style={{ color: "#888" }}>IF</span>{" "}
            <span style={{ color: "#059669" }}>C</span>
          </h1>
          <h1 style={{ fontSize: "22pt", fontWeight: 400, color: "#444" }}>
            Matematica Emo&#x21B;ional&#x103; a Marketingului
          </h1>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "20pt", letterSpacing: 3, color: "#DC2626", margin: "16px 0 24px" }}>
            R + (I &times; F) = C
          </div>
          <p style={{ fontSize: "11pt", color: "#666", maxWidth: 520 }}>
            Primul framework global care demonstrează matematic că Forma este un multiplicator exponențial, nu doar ambalaj estetic.
          </p>
          <div style={{ marginTop: 40, fontSize: "10pt", color: "#999" }}>
            <p><strong>Autor:</strong> Dumitru Talmazan</p>
            <p><strong>Versiune:</strong> 1.0 — Februarie 2026</p>
            <p style={{ marginTop: 12 }}>&copy; 2026 Dumitru Talmazan. Toate drepturile rezervate.</p>
            <p>rifcmarketing.com</p>
          </div>
        </div>
      </div>
    </>
  );
}
