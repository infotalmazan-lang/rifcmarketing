"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

/* ═══════════════════════════════════════════════════════════
   RIFC CVI Panel — Content Validity Index
   Expert evaluation form (35 items, 4-point Likert scale)
   ═══════════════════════════════════════════════════════════ */

// ── Item definitions ──────────────────────────────────────
interface CviItem {
  id: string;
  text: string;
  sub: string;
  dim: "R" | "I" | "F" | "C";
}

const R_ITEMS: CviItem[] = [
  { id: "R1", text: "Mesajul se adresează unui segment specific de audiență cu o nevoie identificabilă pe care produsul sau serviciul o rezolvă.", sub: "Audiență / ICP", dim: "R" },
  { id: "R2", text: "Mesajul este difuzat la momentul potrivit din perspectiva ciclului de cumpărare al audienței.", sub: "Timing", dim: "R" },
  { id: "R3", text: "Conținutul mesajului corespunde etapei corecte din buyer journey a destinatarului (conștientizare, evaluare sau decizie).", sub: "Etapa Journey", dim: "R" },
  { id: "R4", text: "Mesajul ia în considerare contextul fizic sau digital în care este consumat de audiență.", sub: "Context Situațional", dim: "R" },
  { id: "R5", text: "Mesajul este adaptat cultural și lingvistic specificului geografic al audienței țintă.", sub: "Geografie / Cultură", dim: "R" },
  { id: "R6", text: "Formatul și conținutul mesajului sunt optimizate nativ pentru canalul specific de distribuție.", sub: "Potrivire Canal", dim: "R" },
  { id: "R7", text: "Mesajul utilizează date comportamentale pentru a personaliza comunicarea pentru segmente specifice.", sub: "Segmentare Comportamentală", dim: "R" },
];

const I_ITEMS: CviItem[] = [
  { id: "I1", text: "Mesajul articulează o promisiune centrală clară și atractivă, specifică pentru audiența vizată.", sub: "Promisiune Centrală", dim: "I" },
  { id: "I2", text: "Beneficiul principal al ofertei este comunicat în primele 5 secunde de expunere la mesaj.", sub: "Beneficiu Imediat", dim: "I" },
  { id: "I3", text: "Mesajul activează o emoție specifică și autentică, aliniată cu dorința sau durerea principală a audienței.", sub: "Trigger Emoțional", dim: "I" },
  { id: "I4", text: "Mesajul creează un gol informațional care motivează audiența să continue să consume conținutul.", sub: "Gap de Curiozitate", dim: "I" },
  { id: "I5", text: "Mesajul conține un element de urgență sau raritate legitimă care motivează acțiunea imediată.", sub: "Urgență / Scarcity", dim: "I" },
  { id: "I6", text: "Mesajul conține cel puțin un element neașteptat sau surprinzător față de norma din industrie.", sub: "Noutate / Surpriză", dim: "I" },
  { id: "I7", text: "Destinatarul simte că mesajul a fost creat specific pentru situația sau nevoile sale personale.", sub: "Relevanță Personală Percepută", dim: "I" },
  { id: "I8", text: "Mesajul include dovezi specifice și verificabile de credibilitate (statistici cu sursă, testimoniale cu identitate reală, studii de caz cu cifre).", sub: "Credibilitate / Dovadă Socială", dim: "I" },
  { id: "I9", text: "Valoarea ofertei este construită strategic înainte de prezentarea prețului, făcând costul să pară mic față de beneficii.", sub: "Valoare Percepută", dim: "I" },
  { id: "I10", text: "Primele cuvinte sau secunde ale mesajului capturează imediat atenția prin originalitate, specificitate sau shock pozitiv.", sub: "Hook / Primul Impact", dim: "I" },
];

const F_ITEMS: CviItem[] = [
  { id: "F1", text: "Elementele vizuale ale mesajului clarifică și amplifică conținutul, fără a crea confuzie sau distracție.", sub: "Claritate Vizuală", dim: "F" },
  { id: "F2", text: "Titlul sau headline-ul este clar, specific și comunică un beneficiu diferențiat în mai puțin de 5 secunde.", sub: "Puterea Titlului", dim: "F" },
  { id: "F3", text: "Există un singur CTA principal, orientat pe beneficiu, vizibil și cu fricțiune minimă pentru utilizator.", sub: "CTA — Call to Action", dim: "F" },
  { id: "F4", text: "Mesajul urmează o structură logică deliberată care ghidează natural audiența de la problemă la soluție și la acțiune.", sub: "Structură și Flow", dim: "F" },
  { id: "F5", text: "Lungimea mesajului este perfect calibrată pentru canalul de distribuție și obiectivul de comunicare.", sub: "Densitate Optimă (Lungime)", dim: "F" },
  { id: "F6", text: "Tonul mesajului este consistent, autentic și perfect calibrat pentru audiența și contextul specific.", sub: "Ton și Voce", dim: "F" },
  { id: "F7", text: "Mesajul este consistent cu identitatea vizuală și valorile brandului, recognoscibil fără a vedea logo-ul.", sub: "Consistență Brand", dim: "F" },
  { id: "F8", text: "Textul mesajului este ușor de citit la prima vedere, cu font adecvat, contrast și propoziții directe.", sub: "Lizibilitate", dim: "F" },
  { id: "F9", text: "Elementele vizuale sunt organizate ierarhic, ghidând ochiul natural de la cel mai important spre CTA.", sub: "Ierarhie Vizuală", dim: "F" },
  { id: "F10", text: "Specificațiile tehnice ale mesajului (dimensiuni, format, durate) sunt perfect adaptate platformei de distribuție.", sub: "Optimizare Format-Canal", dim: "F" },
  { id: "F11", text: "Mesajul este liber de erori gramaticale, ortografice și de punctuație, cu diacritice complete.", sub: "Corectitudine Lingvistică", dim: "F" },
];

const C_ITEMS: CviItem[] = [
  { id: "C1", text: "Mesajul este înțeles corect și complet la prima expunere de cel puțin 90% din audiența țintă.", sub: "Înțelegere Imediată", dim: "C" },
  { id: "C2", text: "Mesajul lasă o amprentă mentală specifică pe care audiența o poate reproduce după 72 de ore fără re-expunere.", sub: "Memorabilitate", dim: "C" },
  { id: "C3", text: "Mesajul generează o intenție puternică și imediată de a efectua acțiunea propusă.", sub: "Intenție de Acțiune", dim: "C" },
  { id: "C4", text: "Audiența poate articula clar de ce această ofertă este diferită și superioară alternativelor disponibile.", sub: "Diferențiere Percepută", dim: "C" },
  { id: "C5", text: "Mesajul anticipează și neutralizează proactiv principalele obiecții ale audienței țintă.", sub: "Reducerea Obiecțiilor", dim: "C" },
  { id: "C6", text: "Experiența post-click sau post-conversie corespunde perfect cu promisiunea comunicată în mesaj.", sub: "Coerență Mesaj-Așteptare", dim: "C" },
  { id: "C7", text: "Mesajul lasă o impresie generală puternic pozitivă, generând dorința de a împărtăși sau de a acționa imediat.", sub: "Impact General Perceput", dim: "C" },
];

const ALL_ITEMS = [...R_ITEMS, ...I_ITEMS, ...F_ITEMS, ...C_ITEMS];
const TOTAL = ALL_ITEMS.length; // 35

const DIM_META: Record<string, { label: string; description: string; color: string; gradient: string }> = {
  R: { label: "Relevanță", description: "Gradul în care mesajul se adresează audienței corecte, în contextul și momentul potrivit", color: "#DC2626", gradient: "linear-gradient(135deg, #DC2626, #EF4444)" },
  I: { label: "Interes", description: "Capacitatea mesajului de a capta atenția, genera curiozitate și menține angajamentul", color: "#2563EB", gradient: "linear-gradient(135deg, #1D4ED8, #2563EB)" },
  F: { label: "Formă", description: "Calitatea execuției: claritate vizuală, structură, ton, lizibilitate și optimizare canal", color: "#059669", gradient: "linear-gradient(135deg, #047857, #059669)" },
  C: { label: "Claritate (Rezultat)", description: "Gradul în care mesajul este înțeles, reținut și generează intenție de acțiune", color: "#D97706", gradient: "linear-gradient(135deg, #B45309, #D97706)" },
};

const SCALE = [
  { v: 1, label: "Irelevant", desc: "Itemul nu măsoară constructul indicat", color: "#EF4444", bg: "#FEF2F2", border: "#FECACA" },
  { v: 2, label: "Parțial relevant", desc: "Itemul măsoară parțial, necesită revizuire majoră", color: "#F97316", bg: "#FFF7ED", border: "#FED7AA" },
  { v: 3, label: "Relevant", desc: "Itemul măsoară constructul cu revizuiri minore", color: "#EAB308", bg: "#FEFCE8", border: "#FEF08A" },
  { v: 4, label: "Extrem relevant", desc: "Itemul măsoară perfect constructul — nicio modificare", color: "#22C55E", bg: "#F0FDF4", border: "#BBF7D0" },
];

// ── Suspense wrapper ──────────────────────────────────────
export default function CviPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F8F7F4" }} />}>
      <CviForm />
    </Suspense>
  );
}

// ── Main Form Component ───────────────────────────────────
function CviForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const isPreview = searchParams.get("preview") === "1";

  const isInfoPage = !token && !isPreview; // General page: no token, no preview
  const [status, setStatus] = useState<"loading" | "valid" | "completed" | "invalid" | "error" | "info">(
    isInfoPage ? "info" : isPreview ? "valid" : "loading"
  );
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [expert, setExpert] = useState({ name: "", org: "", role: "", experience: "", email: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState(false);
  const [cviResult, setCviResult] = useState<Record<string, number> | null>(null);

  // Validate token on load (skip in preview mode and info page)
  useEffect(() => {
    if (isPreview || isInfoPage) return;
    if (!token) { setStatus("invalid"); return; }
    fetch(`/api/cvi/validate?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid) setStatus("valid");
        else if (d.reason === "completed") setStatus("completed");
        else setStatus("invalid");
      })
      .catch(() => setStatus("error"));
  }, [token, isPreview, isInfoPage]);

  const ratedCount = Object.keys(ratings).length;
  const pct = Math.round((ratedCount / TOTAL) * 100);
  const canSubmit = ratedCount === TOTAL && expert.name.trim() && expert.role && expert.experience && !submitting;

  const handleRate = useCallback((itemId: string, value: number) => {
    setRatings(prev => ({ ...prev, [itemId]: value }));
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError("");

    // Calculate CVI client-side for immediate display
    const dims: Record<string, string[]> = {
      R: R_ITEMS.map(i => i.id),
      I: I_ITEMS.map(i => i.id),
      F: F_ITEMS.map(i => i.id),
      C: C_ITEMS.map(i => i.id),
    };
    const cvi: Record<string, number> = {};
    for (const [dim, items] of Object.entries(dims)) {
      const relevant = items.filter(id => (ratings[id] || 0) >= 3).length;
      cvi[dim] = Number((relevant / items.length).toFixed(2));
    }

    // Preview mode: show results without saving
    if (isPreview) {
      setCviResult(cvi);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/cvi/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, expert, ratings, cvi }),
      });
      const data = await res.json();
      if (data.success) {
        setCviResult(data.cvi);
        setSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(data.error || "Eroare la trimitere");
      }
    } catch {
      setSubmitError("Eroare de conexiune");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Styles ──────────────────────────────────────────────
  const bgColor = "#F8F7F4";
  const cardBg = "#FFFFFF";
  const border = "#E5E3DC";
  const textDark = "#1C1917";
  const muted = "#78716C";
  const light = "#F5F4F0";

  // ── Error / Loading states ──────────────────────────────
  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: muted, fontSize: 16 }}>Se verifică linkul...</p>
      </div>
    );
  }

  // ── Info/Landing page (general link, no token) ─────────
  if (status === "info") {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, fontFamily: "'Inter', sans-serif" }}>
        {/* Header */}
        <header style={{ background: "white", borderBottom: `1px solid ${border}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              <span style={{ color: "#DC2626" }}>R</span> + (<span style={{ color: "#2563EB" }}>I</span> &times; <span style={{ color: "#059669" }}>F</span>) = <span style={{ color: "#D97706" }}>C</span>
            </span>
            <span style={{ color: border, fontSize: 18 }}>|</span>
            <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>Panel CVI &middot; Validare Con&#539;inut</span>
          </div>
        </header>

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 32px" }}>
          {/* Hero */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", color: "#4F46E5", fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase" as const, marginBottom: 20 }}>
              Content Validity Index &mdash; Stratul 1
            </div>
            <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: textDark }}>
              Evaluarea Instrumentului<br />de M&#259;surare RIFC
            </h1>
            <p style={{ color: muted, fontSize: 16, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              Protocolul <strong>R IF C Marketing</strong> evalueaz&#259; eficien&#539;a mesajelor de marketing prin 4 dimensiuni: <strong style={{ color: "#DC2626" }}>Relevan&#539;&#259;</strong>, <strong style={{ color: "#2563EB" }}>Interes</strong>, <strong style={{ color: "#059669" }}>Form&#259;</strong> &#537;i <strong style={{ color: "#D97706" }}>Claritate</strong>.
            </p>
          </div>

          {/* 4 Dimension cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 40 }}>
            {([
              { d: "R", label: "Relevan\u021B\u0103", count: 7, color: "#DC2626", bg: "#FEF2F2" },
              { d: "I", label: "Interes", count: 10, color: "#2563EB", bg: "#EFF6FF" },
              { d: "F", label: "Form\u0103", count: 11, color: "#059669", bg: "#ECFDF5" },
              { d: "C", label: "Claritate", count: 7, color: "#D97706", bg: "#FFFBEB" },
            ]).map(({ d, label, count, color, bg }) => (
              <div key={d} style={{ padding: "20px 16px", borderRadius: 12, textAlign: "center", background: bg, border: `1px solid ${color}15` }}>
                <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{d}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color, marginTop: 6 }}>{label}</div>
                <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{count} itemi</div>
              </div>
            ))}
          </div>

          {/* Info card: How it works */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: textDark }}>Cum func&#539;ioneaz&#259;</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {([
                { step: "1", title: "Primi\u021Bi un link unic", desc: "Fiecare expert prime\u0219te un link personal de evaluare de la cercet\u0103tor." },
                { step: "2", title: "Evalua\u021Bi 35 itemi", desc: "Pe scala Likert 1-4, evalua\u021Bi relevan\u021Ba fiec\u0103rui item pentru constructul s\u0103u." },
                { step: "3", title: "Completa\u021Bi profilul", desc: "Ad\u0103uga\u021Bi informa\u021Bii despre experien\u021Ba \u0219i rolul dumneavoastr\u0103 profesional." },
                { step: "4", title: "Rezultate CVI", desc: "Scorul CVI este calculat automat. Itemii cu CVI \u2265 0.80 sunt p\u0103stra\u021Bi \u00een scar\u0103." },
              ]).map(({ step, title, desc }) => (
                <div key={step} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#EEF2FF", color: "#4F46E5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: textDark, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scale preview */}
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: 32, marginBottom: 24 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: textDark }}>Scala de evaluare (Likert 1-4)</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {SCALE.map(s => (
                <div key={s.v} style={{ textAlign: "center", padding: "14px 10px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.bg }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: .3, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Access notice */}
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 14, padding: "24px 28px", textAlign: "center" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#92400E", marginBottom: 8 }}>Acces prin link individual</h3>
            <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.6, margin: 0, maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              Pentru a completa evaluarea CVI, ave&#539;i nevoie de un <strong>link unic</strong> primit de la cercet&#259;tor.
              Dac&#259; sunte&#539;i expert &#238;n marketing &#537;i dori&#539;i s&#259; participa&#539;i, contacta&#539;i echipa de cercetare.
            </p>
          </div>

          {/* Footer */}
          <div style={{ textAlign: "center", marginTop: 40, paddingTop: 20, borderTop: `1px solid ${border}` }}>
            <p style={{ fontSize: 12, color: muted }}>
              osf.io/9y75d &middot; RIFC Marketing Protocol &middot; Dumitru Talmazan, 2026
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 32 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 48, textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26A0;</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Link invalid sau expirat</h2>
          <p style={{ color: muted, fontSize: 15 }}>Acest link de evaluare nu este valid. Contacta&#539;i cercet&#259;torul pentru un link nou.</p>
        </div>
      </div>
    );
  }

  if (status === "completed") {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 32 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 48, textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x2705;</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Evaluare deja completată</h2>
          <p style={{ color: muted, fontSize: 15 }}>Ați completat deja această evaluare. Vă mulțumim pentru contribuție!</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 32 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 48, textAlign: "center", maxWidth: 500 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x274C;</div>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Eroare de conexiune</h2>
          <p style={{ color: muted, fontSize: 15 }}>Nu s-a putut valida linkul. Încercați din nou.</p>
        </div>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────
  if (success && cviResult) {
    return (
      <div style={{ minHeight: "100vh", background: bgColor, fontFamily: "'Inter', sans-serif" }}>
        <header style={{ background: "white", borderBottom: `1px solid ${border}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "'Inter', serif", fontSize: 16, fontWeight: 700 }}>
              <span style={{ color: "#DC2626" }}>R</span> + (<span style={{ color: "#2563EB" }}>I</span> × <span style={{ color: "#059669" }}>F</span>) = <span style={{ color: "#D97706" }}>C</span>
            </span>
            <span style={{ color: border, fontSize: 18 }}>|</span>
            <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>Panel CVI — Evaluare completă</span>
          </div>
        </header>
        <div style={{ maxWidth: 860, margin: "60px auto", padding: 32, textAlign: "center" }}>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: "48px 32px" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>&#x2705;</div>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>Evaluare transmisă cu succes!</h2>
            <p style={{ color: muted, fontSize: 16, maxWidth: 500, margin: "0 auto 24px" }}>
              Vă mulțumim pentru contribuția la validarea Protocolului RIFC. Rezultatele vor fi publicate pe osf.io/9y75d după finalizarea studiului.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 28 }}>
              {(["R", "I", "F", "C"] as const).map(d => (
                <div key={d} style={{ padding: 16, borderRadius: 10, textAlign: "center", background: d === "R" ? "#FEF2F2" : d === "I" ? "#EFF6FF" : d === "F" ? "#ECFDF5" : "#FFFBEB", color: DIM_META[d].color }}>
                  <strong style={{ display: "block", fontSize: 28, fontWeight: 800 }}>{cviResult[d]?.toFixed(2) || "—"}</strong>
                  <span style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase" }}>CVI — {DIM_META[d].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bgColor, fontFamily: "'Inter', sans-serif", fontSize: 15, lineHeight: 1.6, color: textDark }}>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: 3, background: "#DC2626", width: `${pct}%`, transition: "width .4s ease", zIndex: 1000 }} />

      {/* Preview Banner */}
      {isPreview && (
        <div style={{ background: "#FEF3C7", borderBottom: "2px solid #F59E0B", padding: "8px 32px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: "#92400E", letterSpacing: 0.5 }}>MOD PREVIEW — datele NU se salveaza in baza de date</span>
        </div>
      )}

      {/* Header */}
      <header style={{ background: "white", borderBottom: `1px solid ${border}`, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: isPreview ? 0 : 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>
            <span style={{ color: "#DC2626" }}>R</span> + (<span style={{ color: "#2563EB" }}>I</span> × <span style={{ color: "#059669" }}>F</span>) = <span style={{ color: "#D97706" }}>C</span>
          </span>
          <span style={{ color: border, fontSize: 18 }}>|</span>
          <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>Panel CVI · Validare Conținut</span>
        </div>
        <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>{ratedCount} / {TOTAL} completate</span>
      </header>

      {/* Hero */}
      <div style={{ background: "white", borderBottom: `1px solid ${border}`, padding: "48px 32px 40px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#EEF2FF", color: "#4F46E5", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, letterSpacing: .5, textTransform: "uppercase", marginBottom: 20 }}>
          Content Validity Index — Stratul 1
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.15, marginBottom: 12 }}>
          Evaluarea Instrumentului<br />de Măsurare RIFC
        </h1>
        <p style={{ color: muted, fontSize: 16, maxWidth: 620, marginBottom: 24 }}>
          Vă rugăm să evaluați relevanța fiecărui item pentru constructul pe care îl măsoară. Estimare timp: <strong>20-25 minute</strong>.
        </p>
        <div style={{ background: light, border: `1px solid ${border}`, borderRadius: 10, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #667eea, #764ba2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "white", flexShrink: 0 }}>
            {expert.name ? expert.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <strong style={{ fontSize: 15, color: textDark }}>{expert.name || "Completați profilul mai jos"}</strong>
            <p style={{ fontSize: 13, color: muted, margin: 0 }}>Experți în marketing / lectori / practicieni</p>
          </div>
        </div>
      </div>

      {/* Scale instructions */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: 32 }}>
        <div style={{ background: "white", border: `1px solid ${border}`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>Scala de evaluare</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {SCALE.map(s => (
              <div key={s.v} style={{ textAlign: "center", padding: "14px 10px", borderRadius: 8, border: `1px solid ${s.border}`, background: s.bg }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: s.color, marginBottom: 4 }}>{s.v}</div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: .3, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: muted, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#92400E", marginBottom: 8 }}>Important academic</h3>
          <p style={{ fontSize: 14, color: "#78350F", lineHeight: 1.6, margin: 0 }}>
            Evaluați <strong>relevanța itemului pentru constructul său</strong> — nu acordul cu afirmația.
            Un item CVI ≥ 0.80 (calculat din proporția scorurilor 3+4) va fi păstrat în scala finală.
            Scorurile 1-2 indică necesitatea reformulării sau eliminării itemului.
          </p>
        </div>
      </div>

      {/* Profile section */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px 32px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Profilul dumneavoastră</h2>
        <p style={{ fontSize: 14, color: muted, marginBottom: 20 }}>Datele sunt anonimizate și utilizate exclusiv pentru calculul inter-rater reliability (Fleiss kappa).</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Prenume și Nume *</label>
            <input value={expert.name} onChange={e => setExpert(p => ({ ...p, name: e.target.value }))} placeholder="ex: Ion Popescu" required
              style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Organizație / Companie</label>
            <input value={expert.org} onChange={e => setExpert(p => ({ ...p, org: e.target.value }))} placeholder="ex: UTM / Agenție X"
              style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Rol profesional *</label>
            <select value={expert.role} onChange={e => setExpert(p => ({ ...p, role: e.target.value }))} required
              style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", background: "white" }}>
              <option value="">Selectează rolul</option>
              <option>Lector / Cadru universitar</option>
              <option>Marketing Manager</option>
              <option>CMO / Director Marketing</option>
              <option>Copywriter / Content Strategist</option>
              <option>Digital Marketing Specialist</option>
              <option>Brand Manager</option>
              <option>Antreprenor / Fondator</option>
              <option>Consultant Marketing</option>
              <option>Cercetător / Doctorand</option>
              <option>Alt rol în marketing</option>
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 600 }}>Ani experiență în marketing *</label>
            <select value={expert.experience} onChange={e => setExpert(p => ({ ...p, experience: e.target.value }))} required
              style={{ border: `1.5px solid ${border}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", fontFamily: "inherit", background: "white" }}>
              <option value="">Selectează</option>
              <option>1-3 ani</option>
              <option>4-7 ani</option>
              <option>8-12 ani</option>
              <option>13-20 ani</option>
              <option>20+ ani</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dimension sections */}
      {([
        { dim: "R", items: R_ITEMS },
        { dim: "I", items: I_ITEMS },
        { dim: "F", items: F_ITEMS },
        { dim: "C", items: C_ITEMS },
      ] as const).map(({ dim, items }) => {
        const meta = DIM_META[dim];
        const dimRated = items.filter(i => ratings[i.id]).length;
        return (
          <div key={dim} style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px 8px" }}>
            {/* Dimension header */}
            <div style={{ borderRadius: 12, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "center", gap: 16, background: meta.gradient }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 700, color: "white", flexShrink: 0 }}>
                {dim}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "white", margin: 0 }}>{meta.label}</h2>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,.8)", margin: "2px 0 0" }}>{meta.description}</p>
              </div>
              <div style={{ textAlign: "right", color: "white" }}>
                <strong style={{ display: "block", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{dimRated}/{items.length}</strong>
                <span style={{ fontSize: 11, opacity: .8 }}>itemi</span>
              </div>
            </div>

            {/* Items */}
            {items.map(item => {
              const rated = ratings[item.id];
              const borderColor = rated === 1 ? "#FECACA" : rated === 2 ? "#FED7AA" : rated === 3 ? "#FEF08A" : rated === 4 ? "#BBF7D0" : border;
              return (
                <div key={item.id} style={{ background: "white", border: `1.5px solid ${borderColor}`, borderRadius: 10, marginBottom: 12, overflow: "hidden", transition: "border-color .2s, box-shadow .2s" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px 12px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, flexShrink: 0, marginTop: 2,
                      background: dim === "R" ? "#FEF2F2" : dim === "I" ? "#EFF6FF" : dim === "F" ? "#ECFDF5" : "#FFFBEB",
                      color: meta.color,
                    }}>
                      {item.id}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, lineHeight: 1.5 }}>„{item.text}"</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 3, fontStyle: "italic" }}>Sub-factor: {item.sub}</div>
                    </div>
                  </div>
                  <div style={{ padding: "8px 20px 16px" }}>
                    <div style={{ fontSize: 12, color: muted, fontWeight: 600, marginBottom: 8 }}>
                      Cât de relevant este acest item pentru măsurarea constructului {meta.label}?
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {SCALE.map(s => {
                        const isChecked = rated === s.v;
                        return (
                          <label key={s.v} onClick={() => handleRate(item.id, s.v)} style={{
                            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                            padding: "10px 6px", border: `1.5px solid ${isChecked ? "transparent" : border}`,
                            borderRadius: 8, cursor: "pointer", transition: "all .15s",
                            background: isChecked ? s.color : "white",
                            color: isChecked ? "white" : "inherit",
                          }}>
                            <span style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{s.v}</span>
                            <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: .3, textAlign: "center", lineHeight: 1.2 }}>{s.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Submit section */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 32px 60px" }}>
        <div style={{ background: "white", border: `1px solid ${border}`, borderRadius: 12, padding: 28, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 36, fontWeight: 800 }}>{ratedCount}</span>
            <span style={{ fontSize: 16, color: muted }}>/ {TOTAL} itemi evaluați</span>
          </div>
          <p style={{ color: muted, fontSize: 14, marginBottom: 20 }}>
            Completați toți cei {TOTAL} de itemi și profilul profesional pentru a putea trimite evaluarea.
          </p>
          {submitError && <p style={{ color: "#DC2626", fontSize: 14, marginBottom: 16 }}>{submitError}</p>}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              background: canSubmit ? textDark : "#D6D3D1",
              color: "white", border: "none", borderRadius: 10, padding: "14px 40px",
              fontFamily: "inherit", fontSize: 15, fontWeight: 700, cursor: canSubmit ? "pointer" : "not-allowed",
              letterSpacing: .3, transition: "all .2s",
            }}
          >
            {submitting ? "Se trimite..." : "Trimite Evaluarea →"}
          </button>
          <p style={{ fontSize: 12, color: muted, marginTop: 12 }}>
            Datele sunt transmise securizat și utilizate exclusiv în scopuri de cercetare academică.<br />
            osf.io/9y75d · RIFC Marketing Protocol · Dumitru Talmazan, 2026
          </p>
        </div>
      </div>

      {/* Sticky counter */}
      <div style={{
        position: "fixed", bottom: 24, right: 24,
        background: ratedCount === TOTAL ? "#22C55E" : textDark,
        color: "white", borderRadius: 50, padding: "10px 20px",
        fontSize: 14, fontWeight: 700, boxShadow: "0 8px 32px rgba(0,0,0,.2)",
        zIndex: 100, display: "flex", alignItems: "center", gap: 8,
        transition: "all .3s",
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: ratedCount === TOTAL ? "#86EFAC" : "rgba(255,255,255,.4)" }} />
        {ratedCount} / {TOTAL} completate
      </div>
    </div>
  );
}
