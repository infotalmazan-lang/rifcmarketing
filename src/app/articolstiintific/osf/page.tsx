"use client";
/**
 * R IF C — Articol Stiintific (OSF Page)
 * Manuscris final pentru publicatie internationala
 * URL: /articolstiintific/osf
 */

import { Metadata } from "next";

export default function ArticolOSFPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#fafbfc",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "24px 32px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <img src="/images/rifc-logo-black.png" alt="R IF C" style={{ height: 32, width: "auto", borderRadius: 4 }} />
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.2 }}>
            Articol Stiintific
          </h1>
          <p style={{ fontSize: 12, color: "#6B7280", margin: 0 }}>
            Manuscris pentru publicatie internationala
          </p>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 14px",
          borderRadius: 20,
          background: "rgba(5,150,105,0.1)",
          color: "#059669",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 0.5,
          fontFamily: "JetBrains Mono, monospace",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          IN LUCRU
        </div>
      </div>

      {/* Content area — placeholder for article */}
      <div style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: "40px 32px",
      }}>
        {/* Paper title block */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: "40px 48px",
          marginBottom: 24,
          textAlign: "center" as const,
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#9CA3AF",
            textTransform: "uppercase" as const,
            marginBottom: 16,
          }}>
            MANUSCRIS
          </div>
          <h2 style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.35,
            margin: "0 0 16px",
          }}>
            Development and Validation of the R IF C Scale for Marketing Message Clarity Assessment
          </h2>
          <p style={{
            fontSize: 15,
            color: "#6B7280",
            lineHeight: 1.6,
            margin: "0 0 20px",
          }}>
            Dumitru Talmazan
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap" as const,
          }}>
            <span style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: "#f3f4f6",
              fontSize: 11,
              color: "#6B7280",
              fontWeight: 600,
            }}>
              Marketing Communication
            </span>
            <span style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: "#f3f4f6",
              fontSize: 11,
              color: "#6B7280",
              fontWeight: 600,
            }}>
              Scale Development
            </span>
            <span style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: "#f3f4f6",
              fontSize: 11,
              color: "#6B7280",
              fontWeight: 600,
            }}>
              Message Clarity
            </span>
            <span style={{
              padding: "4px 12px",
              borderRadius: 20,
              background: "#f3f4f6",
              fontSize: 11,
              color: "#6B7280",
              fontWeight: 600,
            }}>
              Empirical Validation
            </span>
          </div>
        </div>

        {/* Status cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 16,
          marginBottom: 32,
        }}>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#9CA3AF", textTransform: "uppercase" as const, marginBottom: 8 }}>
              STATUS
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f59e0b" }}>
              Draft
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
              In curs de redactare
            </div>
          </div>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#9CA3AF", textTransform: "uppercase" as const, marginBottom: 8 }}>
              TARGET JURNAL
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              TBD
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
              Jurnal international peer-reviewed
            </div>
          </div>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: "20px 24px",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#9CA3AF", textTransform: "uppercase" as const, marginBottom: 8 }}>
              CUVINTE
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#111827" }}>
              0 / 12.000
            </div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
              Target: 12-15K cuvinte
            </div>
          </div>
        </div>

        {/* Sections outline */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: "32px",
        }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: 1,
            color: "#6B7280",
            textTransform: "uppercase" as const,
            marginBottom: 20,
          }}>
            Structura Articol
          </h3>
          {[
            { num: 1, title: "Abstract", status: "pending", words: "250" },
            { num: 2, title: "Introduction", status: "pending", words: "1.500" },
            { num: 3, title: "Literature Review", status: "pending", words: "3.000" },
            { num: 4, title: "Methodology", status: "pending", words: "2.000" },
            { num: 5, title: "Results", status: "pending", words: "3.000" },
            { num: 6, title: "Discussion", status: "pending", words: "2.000" },
            { num: 7, title: "Conclusion", status: "pending", words: "500" },
            { num: 8, title: "References", status: "pending", words: "40-50 refs" },
          ].map((s) => (
            <div key={s.num} style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 10,
              background: "#f9fafb",
              marginBottom: 8,
              border: "1px solid #f3f4f6",
            }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: s.status === "done" ? "#059669" : "#e5e7eb",
                color: s.status === "done" ? "#fff" : "#9CA3AF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "JetBrains Mono, monospace",
              }}>
                {s.num}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{s.title}</div>
              </div>
              <div style={{
                fontSize: 11,
                color: "#9CA3AF",
                fontFamily: "JetBrains Mono, monospace",
              }}>
                ~{s.words}
              </div>
              <div style={{
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: 0.5,
                background: s.status === "done" ? "rgba(5,150,105,0.1)" : "rgba(156,163,175,0.1)",
                color: s.status === "done" ? "#059669" : "#9CA3AF",
              }}>
                {s.status === "done" ? "GATA" : "PENDING"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
