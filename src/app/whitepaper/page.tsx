"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n";

/* ─────────── helper: small colored bar ─────────── */
const Bar = ({ color }: { color: string }) => (
  <div style={{ width: 40, height: 3, background: color, borderRadius: 2, marginBottom: 8 }} />
);

export default function WhitePaperPage() {
  const { t } = useTranslation();

  /* auto-trigger print dialog on load */
  useEffect(() => {
    const timeout = setTimeout(() => window.print(), 600);
    return () => clearTimeout(timeout);
  }, []);

  const p = t.philosophy;
  const eq = t.equation;
  const an = t.anatomy;
  const mt = t.methodology;
  const rg = t.relevanceGate;
  const om = t.omnichannel;
  const ar = t.archetypes;
  const cmp = t.comparison;
  const impl = t.implementation;
  const cs = t.caseStudies;
  const ai = t.aiPrompts;
  const auth = t.author;
  const d = t.data;

  return (
    <>
      {/* ── print-specific styles ── */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page-break { break-before: page; }
          @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
        }
        @media screen {
          .wp-container { max-width: 800px; margin: 0 auto; padding: 40px 24px; }
        }
        .wp-container {
          font-family: 'DM Sans', 'Inter', system-ui, sans-serif;
          color: #1a1a1a;
          line-height: 1.7;
          font-size: 11pt;
        }
        .wp-container h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28pt; font-weight: 700; margin: 0 0 8px; line-height: 1.15; }
        .wp-container h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 18pt; font-weight: 700; margin: 32px 0 8px; color: #DC2626; line-height: 1.2; }
        .wp-container h3 { font-size: 12pt; font-weight: 700; margin: 20px 0 6px; text-transform: uppercase; letter-spacing: 1px; }
        .wp-container h4 { font-size: 11pt; font-weight: 700; margin: 14px 0 4px; }
        .wp-container p { margin: 0 0 10px; }
        .wp-container ul { margin: 0 0 10px; padding-left: 20px; }
        .wp-container li { margin-bottom: 4px; }
        .wp-cover { display: flex; flex-direction: column; justify-content: center; min-height: 90vh; }
        .wp-cover .eq { font-family: 'JetBrains Mono', monospace; font-size: 20pt; letter-spacing: 3px; color: #DC2626; margin: 16px 0 24px; }
        .wp-toc a { color: #DC2626; text-decoration: none; }
        .wp-toc li { margin-bottom: 6px; }
        .wp-card { border: 1px solid #e5e5e5; border-left: 3px solid; padding: 12px 16px; margin: 8px 0; border-radius: 4px; background: #fafafa; }
        .wp-equation-box { background: #0a0a0f; color: #e8e6e3; padding: 20px; border-radius: 8px; text-align: center; margin: 16px 0; }
        .wp-equation-box .formula { font-family: 'JetBrains Mono', monospace; font-size: 16pt; letter-spacing: 2px; }
        .wp-table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 10pt; }
        .wp-table th { background: #f5f5f5; padding: 8px 10px; text-align: left; border: 1px solid #ddd; font-weight: 700; }
        .wp-table td { padding: 8px 10px; border: 1px solid #ddd; vertical-align: top; }
        .wp-warning { background: #fef2f2; border-left: 3px solid #DC2626; padding: 10px 14px; margin: 10px 0; font-size: 10pt; }
        .wp-tip { background: #f0fdf4; border-left: 3px solid #059669; padding: 10px 14px; margin: 10px 0; font-size: 10pt; }
        .wp-score-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 8px 0; }
        .wp-badge { display: inline-block; font-size: 9pt; font-weight: 700; padding: 2px 8px; border-radius: 3px; letter-spacing: 0.5px; }
        .wp-footer { text-align: center; font-size: 9pt; color: #888; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 16px; }
        .wp-btn-download {
          display: inline-flex; align-items: center; gap: 8px;
          background: #DC2626; color: white; border: none; cursor: pointer;
          padding: 14px 28px; font-size: 14px; font-weight: 600;
          border-radius: 6px; letter-spacing: 1px; text-transform: uppercase;
          font-family: 'DM Sans', system-ui, sans-serif;
          margin: 20px 0;
        }
        .wp-btn-download:hover { background: #b91c1c; }
      `}</style>

      {/* ── top bar (screen only) ── */}
      <div className="no-print" style={{ background: "#0a0a0f", padding: "16px 24px", textAlign: "center" }}>
        <button className="wp-btn-download" onClick={() => window.print()}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Salvează ca PDF (Ctrl+P / Cmd+P)
        </button>
        <p style={{ color: "#888", fontSize: 12, marginTop: 8 }}>Folosește &quot;Save as PDF&quot; ca destinație de imprimare pentru cel mai bun rezultat.</p>
      </div>

      <div className="wp-container">
        {/* ════════════ COVER PAGE ════════════ */}
        <div className="wp-cover">
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
          <div className="eq">R + (I &times; F) = C</div>
          <p style={{ fontSize: "11pt", color: "#666", maxWidth: 520 }}>
            {t.hero.description.slice(0, 200)}...
          </p>
          <div style={{ marginTop: 40, fontSize: "10pt", color: "#999" }}>
            <p><strong>Autor:</strong> Dumitru Talmazan</p>
            <p><strong>Versiune:</strong> 1.0 &mdash; Februarie 2026</p>
            <p><strong>Pagini:</strong> 84</p>
            <p style={{ marginTop: 12 }}>&copy; 2026 Dumitru Talmazan. Toate drepturile rezervate.</p>
            <p>rifcmarketing.com</p>
          </div>
        </div>

        {/* ════════════ TABLE OF CONTENTS ════════════ */}
        <div className="page-break">
          <h2 style={{ color: "#1a1a1a" }}>Cuprins</h2>
          <ol className="wp-toc" style={{ fontSize: "11pt", lineHeight: 2.2 }}>
            <li>Filozofia R IF C</li>
            <li>Ecua&#x21B;ia Universal&#x103;</li>
            <li>Anatomia Variabilelor</li>
            <li>Metodologia de Scoring</li>
            <li>Poarta Relevan&#x21B;ei (Filtrul de Siguran&#x21B;&#x103;)</li>
            <li>Diagnostic Omnichannel</li>
            <li>Arhetipuri de E&#x219;ec</li>
            <li>R IF C vs. Alte Framework-uri</li>
            <li>Protocol de Implementare</li>
            <li>Studii de Caz</li>
            <li>Integrare AI</li>
            <li>Despre Autor</li>
          </ol>
        </div>

        {/* ════════════ CHAPTER 01 — FILOZOFIA ════════════ */}
        <div className="page-break">
          <h2>Capitolul 01 &mdash; {p.titleBold}</h2>
          <p>{p.description} <strong>{p.descriptionBold}</strong>.</p>

          {p.cards.map((card, i) => (
            <div key={i} className="wp-card" style={{ borderLeftColor: card.color }}>
              <h4 style={{ color: card.color }}>{card.title}</h4>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* ════════════ CHAPTER 02 — ECUAȚIA ════════════ */}
        <div className="page-break">
          <h2>Capitolul 02 &mdash; {eq.titleBold}</h2>
          <p>{eq.description}</p>

          <div className="wp-equation-box">
            <div className="formula">
              <span style={{ color: "#DC2626" }}>R</span> +{" "}
              (<span style={{ color: "#2563EB" }}>I</span> &times;{" "}
              <span style={{ color: "#D97706" }}>F</span>) ={" "}
              <span style={{ color: "#059669" }}>C</span>
            </div>
            <div style={{ fontSize: "10pt", marginTop: 8, opacity: 0.7 }}>
              {eq.maxScoreLabel}: 110 | {eq.maxScoreNote}
            </div>
          </div>

          {eq.variables.map((v, i) => (
            <div key={i} className="wp-card" style={{ borderLeftColor: v.color }}>
              <h4>
                <span style={{ color: v.color, fontFamily: "'JetBrains Mono', monospace", fontSize: "14pt" }}>{v.letter}</span>
                {" "}&mdash; {v.label}
              </h4>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* ════════════ CHAPTER 03 — ANATOMIA VARIABILELOR ════════════ */}
        <div className="page-break">
          <h2>Capitolul 03 &mdash; Anatomia {an.titleBold}</h2>
          <p>{an.description}</p>

          {an.variables.map((variable) => (
            <div key={variable.letter} style={{ marginTop: 24 }}>
              <h3 style={{ color: variable.color }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "14pt" }}>{variable.letter}</span>
                {" "}&mdash; {variable.title}
              </h3>
              <p style={{ fontStyle: "italic", color: "#666", fontSize: "10pt" }}>{variable.subtitle}</p>

              {variable.warning && (
                <div className="wp-warning">
                  <strong>Semnal de alarm&#x103;:</strong> {variable.warning}
                </div>
              )}

              <table className="wp-table">
                <thead>
                  <tr>
                    <th style={{ width: "25%" }}>Sub-factor</th>
                    <th style={{ width: "40%" }}>Descriere</th>
                    <th style={{ width: "35%" }}>&#x00CE;ntrebarea de Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {variable.factors.map((f, fi) => (
                    <tr key={fi} style={f.critical ? { background: "#fef2f2" } : {}}>
                      <td>
                        <strong>{f.name}</strong>
                        {f.critical && <span className="wp-badge" style={{ background: "#DC2626", color: "white", marginLeft: 6 }}>CRITIC</span>}
                      </td>
                      <td>{f.desc}</td>
                      <td style={{ fontStyle: "italic" }}>{f.question}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="wp-tip">
                <strong>Regula:</strong> {variable.rule}
              </div>
            </div>
          ))}

          <div className="wp-warning" style={{ marginTop: 16 }}>
            <strong>Despre C:</strong> {an.cExplanation}
          </div>
        </div>

        {/* ════════════ CHAPTER 04 — METODOLOGIA DE SCORING ════════════ */}
        <div className="page-break">
          <h2>Capitolul 04 &mdash; {mt.titleBold}</h2>
          <p>{mt.description}</p>

          <h3>{mt.introChallenge}</h3>
          <p>{mt.introBody}</p>
          <ul>
            <li>{mt.introScoreGenerous}</li>
            <li>{mt.introScoreHarsh}</li>
          </ul>

          {/* Scoring guide per variable */}
          <h3>{mt.scoringGuideTitle}</h3>
          {mt.scoringGuides.map((guide) => (
            <div key={guide.letter} style={{ marginTop: 16 }}>
              <h4 style={{ color: guide.color }}>{guide.title}</h4>
              <table className="wp-table">
                <thead>
                  <tr>
                    <th style={{ width: "12%" }}>Scor</th>
                    <th>Descriere</th>
                  </tr>
                </thead>
                <tbody>
                  {guide.levels.map((lvl, li) => (
                    <tr key={li}>
                      <td><strong>{lvl.range}</strong></td>
                      <td>{lvl.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {guide.warning && <div className="wp-warning">{guide.warning}</div>}
            </div>
          ))}

          {/* Live example */}
          <h3>{mt.exampleTitle}</h3>
          <p>{mt.exampleScenario}</p>
          <div className="wp-card" style={{ borderLeftColor: "#DC2626" }}>
            <p><strong style={{ color: "#DC2626" }}>R = 7:</strong> {mt.exampleR}</p>
            <p><strong style={{ color: "#2563EB" }}>I = 8:</strong> {mt.exampleI}</p>
            <p><strong style={{ color: "#D97706" }}>F = 6:</strong> {mt.exampleF}</p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", marginTop: 8 }}>
              C = 7 + (8 &times; 6) = <strong>55</strong> &mdash; {mt.exampleResult}
            </p>
          </div>
          <p>{mt.exampleDiagnostic}</p>
          <div className="wp-tip">
            <strong>{mt.exampleImproved}</strong><br/>
            {mt.exampleLift}
          </div>

          {/* Score ranges */}
          <h3>Zonele de Claritate</h3>
          <table className="wp-table">
            <thead>
              <tr>
                <th>{mt.tableHeaders.score}</th>
                <th>{mt.tableHeaders.clarity}</th>
                <th>{mt.tableHeaders.status}</th>
                <th>{mt.tableHeaders.impact}</th>
              </tr>
            </thead>
            <tbody>
              {d.scoreRanges.map((range, ri) => (
                <tr key={ri}>
                  <td><strong>{range.min}&ndash;{range.max}</strong></td>
                  <td>{range.label}</td>
                  <td><span className="wp-badge" style={{ background: range.statusColor, color: "white" }}>{range.status}</span></td>
                  <td style={{ fontSize: "9pt" }}>{range.impact}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Zone actions */}
          <h3>Ce faci per zon&#x103;</h3>
          {mt.zoneActions.map((za, zi) => (
            <div key={zi} className="wp-card" style={{ borderLeftColor: d.scoreRanges[zi]?.statusColor || "#888" }}>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>
                <strong>Zona {d.scoreRanges[zi]?.label}:</strong> {za.actionText}
              </p>
            </div>
          ))}

          {/* Relevance Gate Rule */}
          <div className="wp-warning" style={{ marginTop: 16 }}>
            <h4 style={{ color: "#DC2626", margin: "0 0 6px" }}>{mt.gateRuleTitle}</h4>
            <p>{mt.gateRuleIntro}</p>
            <p><strong>{mt.gateRuleExample}</strong></p>
            <p>{mt.gateRuleOnPaper}</p>
            <p><strong>{mt.gateRuleInReality}</strong></p>
            <p style={{ marginBottom: 0 }}><strong>{mt.gateRuleFinal}</strong></p>
          </div>
        </div>

        {/* ════════════ CHAPTER 05 — POARTA RELEVANȚEI ════════════ */}
        <div className="page-break">
          <h2>Regul&#x103; Critic&#x103; &mdash; {rg.titleBold}</h2>
          <p>{rg.description}</p>

          <div className="wp-equation-box" style={{ background: "#7f1d1d", textAlign: "center" }}>
            <div className="formula" style={{ color: "#fca5a5" }}>{rg.binaryRule}</div>
          </div>

          <p>{rg.subtitle}</p>
          {rg.introLines.map((line, i) => (
            <p key={i} style={{ fontStyle: "italic", color: "#555" }}>{line}</p>
          ))}
          <p><strong>{rg.introBreak}</strong></p>
          <p>{rg.introProtocol}</p>

          {/* What happens when gate closes */}
          <h3>Ce se &#x00EE;nt&#x00E2;mpl&#x103; c&#x00E2;nd R &lt; 3:</h3>
          <ul>
            {rg.toggleBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          {/* Disaster simulation */}
          <h3>{rg.disasterTitle}</h3>
          <div className="wp-warning">
            <p><strong>Scenariul 1:</strong> {rg.disaster1Scenario}</p>
            <p>{rg.disaster1OnPaper}</p>
            <p><strong>{rg.disaster1Reality}</strong></p>
            <p style={{ marginBottom: 0 }}><strong>{rg.disaster1Verdict}</strong></p>
          </div>
          <div className="wp-warning" style={{ marginTop: 8 }}>
            <p><strong>Scenariul 2:</strong> {rg.disaster2Intro}</p>
            <p>{rg.disaster2OnPaper}</p>
            <p><strong>{rg.disaster2Reality}</strong></p>
            <p style={{ marginBottom: 0 }}><strong>{rg.disaster2Verdict}</strong></p>
          </div>

          {/* Analogies */}
          <h3>{rg.analogiesTitle}</h3>
          {rg.analogies.map((a, i) => (
            <div key={i} className="wp-card" style={{ borderLeftColor: "#DC2626" }}>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>{a.text}</p>
            </div>
          ))}
          <p><strong>{rg.analogiesConclusion}</strong></p>

          {/* Consequences */}
          <h3>{rg.consequencesTitle}</h3>
          <ul>
            {rg.consequences.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>

          {/* Math thresholds */}
          <table className="wp-table">
            <thead>
              <tr><th>R</th><th>Ecua&#x21B;ie</th><th>Realitate</th></tr>
            </thead>
            <tbody>
              {rg.mathThresholds.map((m, i) => (
                <tr key={i} style={m.r >= 3 ? { background: "#f0fdf4" } : { background: "#fef2f2" }}>
                  <td><strong>R = {m.r}</strong></td>
                  <td style={{ fontFamily: "'JetBrains Mono', monospace" }}>{m.equation}</td>
                  <td>{m.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p><strong>{rg.mathConclusion}</strong></p>

          {/* Pre-launch protocol */}
          <h3>{rg.protocolTitle}</h3>
          {rg.protocolQuestions.map((q, i) => (
            <div key={i} className="wp-card" style={{ borderLeftColor: "#D97706" }}>
              <h4>{q.num} {q.category}</h4>
              <p style={{ fontWeight: 600 }}>{q.question}</p>
              <p style={{ fontSize: "10pt", color: "#059669", marginBottom: 0 }}>{q.yes}</p>
              {q.warning && <p style={{ fontSize: "10pt", color: "#D97706", marginBottom: 0 }}>{q.warning}</p>}
              <p style={{ fontSize: "10pt", color: "#DC2626", marginBottom: 0 }}>{q.no}</p>
            </div>
          ))}

          <div className="wp-tip">
            <p style={{ marginBottom: 0 }}><em>{rg.protocolQuote}</em></p>
          </div>
        </div>

        {/* ════════════ CHAPTER 05B — DIAGNOSTIC OMNICHANNEL ════════════ */}
        <div className="page-break">
          <h2>Capitolul 05 &mdash; Diagnostic {om.titleBold}</h2>
          <p>{om.description}</p>

          <table className="wp-table">
            <thead>
              <tr>
                <th>Canal</th>
                <th style={{ color: "#DC2626" }}>R</th>
                <th style={{ color: "#2563EB" }}>I</th>
                <th style={{ color: "#D97706" }}>F</th>
                <th>Arhetip Comun</th>
              </tr>
            </thead>
            <tbody>
              {d.zones.map((zone, zi) => (
                <tr key={zi}>
                  <td><strong>{zone.name}</strong></td>
                  <td style={{ fontSize: "9pt" }}>{zone.r}</td>
                  <td style={{ fontSize: "9pt" }}>{zone.i}</td>
                  <td style={{ fontSize: "9pt" }}>{zone.f}</td>
                  <td><span className="wp-badge" style={{ background: zone.color, color: "white" }}>{zone.archetype}</span></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>{om.diagnosticTitle}</h3>
          {om.steps.map((step) => (
            <div key={step.num} className="wp-card" style={{ borderLeftColor: "#DC2626" }}>
              <h4>{step.num}. {step.title}</h4>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* ════════════ CHAPTER 06 — ARHETIPURI DE EȘEC ════════════ */}
        <div className="page-break">
          <h2>Capitolul 06 &mdash; Arhetipuri de E&#x219;ec</h2>
          <p>{ar.description}</p>

          {ar.items.map((item) => (
            <div key={item.id} style={{ marginTop: 24 }}>
              <h3 style={{ color: item.color }}>{item.name}</h3>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10pt", color: "#666", marginBottom: 8 }}>
                {item.equation.r.value} + ({item.equation.i.value} &times; {item.equation.f.value}) = {item.equation.result}
              </div>
              <p><strong>{item.headline}</strong></p>
              <p style={{ fontSize: "10pt", fontStyle: "italic", color: "#555" }}>{item.symptomLine}</p>
              {item.body.split("\n\n").map((para, pi) => (
                <p key={pi} style={{ fontSize: "10pt" }}>{para}</p>
              ))}
              <div className="wp-warning">
                <strong>Verdictul:</strong> {item.verdict}
              </div>
              <div className="wp-card" style={{ borderLeftColor: item.color }}>
                <p style={{ fontSize: "9pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: item.color }}>Studiu de caz</p>
                <p style={{ fontSize: "10pt", marginBottom: 0 }}>{item.caseStudy}</p>
              </div>
              <h4>&#x00CE;ntreb&#x103;ri de diagnostic:</h4>
              <ol>
                {item.questions.map((q, qi) => (
                  <li key={qi} style={{ fontSize: "10pt" }}>{q}</li>
                ))}
              </ol>
            </div>
          ))}

          {/* Quick diagnosis table */}
          <h3 style={{ marginTop: 24 }}>{ar.diagnosisTitle}</h3>
          <table className="wp-table">
            <thead>
              <tr>
                <th>{ar.diagnosisHeaders.symptom}</th>
                <th>{ar.diagnosisHeaders.archetype}</th>
                <th>{ar.diagnosisHeaders.solution}</th>
              </tr>
            </thead>
            <tbody>
              {ar.diagnosisRows.map((row, ri) => (
                <tr key={ri}>
                  <td>{row.symptom}</td>
                  <td><span className="wp-badge" style={{ background: row.color, color: "white" }}>{row.archetype}</span></td>
                  <td style={{ fontSize: "9pt" }}>{row.solution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ════════════ CHAPTER 07 — COMPARAȚIE ════════════ */}
        <div className="page-break">
          <h2>Capitolul 07 &mdash; {cmp.titlePlain} {cmp.titleBold}</h2>
          <p>{cmp.description}</p>

          <table className="wp-table">
            <thead>
              <tr>
                <th>Framework</th>
                <th>{cmp.limitationLabel}</th>
                <th>{cmp.advantageLabel}</th>
              </tr>
            </thead>
            <tbody>
              {d.comparisons.map((c, ci) => (
                <tr key={ci}>
                  <td>
                    <strong>{c.model}</strong>
                    <br/><span style={{ fontSize: "9pt", color: "#666" }}>{c.full}</span>
                  </td>
                  <td style={{ fontSize: "9pt" }}>{c.weakness}</td>
                  <td style={{ fontSize: "9pt" }}>{c.rifc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ════════════ CHAPTER 08 — IMPLEMENTARE ════════════ */}
        <div className="page-break">
          <h2>Capitolul 08 &mdash; Protocol de {impl.titleBold}</h2>
          <p>{impl.description}</p>

          {impl.checks.map((check, ci) => (
            <div key={ci} className="wp-card" style={{ borderLeftColor: ["#DC2626","#2563EB","#D97706","#059669"][ci] }}>
              <h4>{check.mark} {check.title}</h4>
              <p style={{ fontSize: "10pt", marginBottom: 0 }}>{check.desc}</p>
            </div>
          ))}
        </div>

        {/* ════════════ CHAPTER 09 — STUDII DE CAZ ════════════ */}
        <div className="page-break">
          <h2>Capitolul 09 &mdash; {cs.titlePlain} {cs.titleBold}</h2>
          <p>{cs.description}</p>

          {cs.cases.map((caseItem, ci) => (
            <div key={ci} style={{ marginTop: 24 }}>
              <h3>{caseItem.brand}</h3>
              <p style={{ fontSize: "10pt", color: "#666" }}>
                <strong>Industrie:</strong> {caseItem.industry} &nbsp;|&nbsp;
                <strong>Arhetip:</strong>{" "}
                <span className="wp-badge" style={{
                  background: caseItem.clarityLevel === "critical" ? "#DC2626" : "#D97706",
                  color: "white"
                }}>
                  {caseItem.archetype}
                </span>
              </p>

              {/* Before / After table */}
              <table className="wp-table">
                <thead>
                  <tr>
                    <th></th>
                    <th style={{ color: "#DC2626" }}>{cs.labels.before}</th>
                    <th style={{ color: "#059669" }}>{cs.labels.after}</th>
                  </tr>
                </thead>
                <tbody>
                  {(["r","i","f","c"] as const).map((key) => (
                    <tr key={key}>
                      <td><strong>{key.toUpperCase()}</strong></td>
                      <td>
                        <strong>{caseItem.before[key]}</strong>
                        {key !== "c" && (
                          <div style={{ fontSize: "9pt", color: "#666", marginTop: 2 }}>
                            {(caseItem.before as Record<string, unknown>)[`${key}Justification`] as string}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{caseItem.after[key]}</strong>
                        {key !== "c" && (
                          <div style={{ fontSize: "9pt", color: "#666", marginTop: 2 }}>
                            {(caseItem.after as Record<string, unknown>)[`${key}Justification`] as string}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Screen preview */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "12px 0" }}>
                <div className="wp-card" style={{ borderLeftColor: "#DC2626" }}>
                  <p style={{ fontSize: "9pt", fontWeight: 700, color: "#DC2626", textTransform: "uppercase" }}>{cs.labels.before}</p>
                  {"subject" in caseItem.screen.before && (
                    <p style={{ fontSize: "9pt" }}><strong>Subiect:</strong> {(caseItem.screen.before as Record<string, string>).subject}</p>
                  )}
                  {"headline" in caseItem.screen.before && (
                    <p style={{ fontSize: "9pt" }}><strong>Titlu:</strong> {(caseItem.screen.before as Record<string, string>).headline}</p>
                  )}
                  <p style={{ fontSize: "9pt" }}>{(caseItem.screen.before as Record<string, string>).body}</p>
                  <p style={{ fontSize: "9pt", fontWeight: 600 }}>CTA: {(caseItem.screen.before as Record<string, string>).cta}</p>
                </div>
                <div className="wp-card" style={{ borderLeftColor: "#059669" }}>
                  <p style={{ fontSize: "9pt", fontWeight: 700, color: "#059669", textTransform: "uppercase" }}>{cs.labels.after}</p>
                  {"subject" in caseItem.screen.after && (
                    <p style={{ fontSize: "9pt" }}><strong>Subiect:</strong> {(caseItem.screen.after as Record<string, string>).subject}</p>
                  )}
                  {"headline" in caseItem.screen.after && (
                    <p style={{ fontSize: "9pt" }}><strong>Titlu:</strong> {(caseItem.screen.after as Record<string, string>).headline}</p>
                  )}
                  <p style={{ fontSize: "9pt" }}>{(caseItem.screen.after as Record<string, string>).body}</p>
                  <p style={{ fontSize: "9pt", fontWeight: 600 }}>CTA: {(caseItem.screen.after as Record<string, string>).cta}</p>
                </div>
              </div>

              <div className="wp-tip">
                <p style={{ fontSize: "10pt" }}><strong>{cs.labels.diagnostic}:</strong> {caseItem.diagnosticText}</p>
                <p style={{ fontSize: "10pt" }}><strong>{cs.labels.fix}:</strong> {caseItem.fixText}</p>
                <p style={{ fontSize: "10pt" }}><strong>{cs.labels.result}:</strong> {caseItem.resultText}</p>
                <p style={{ fontSize: "10pt", marginBottom: 0 }}><strong>{cs.labels.lesson}:</strong> {caseItem.lessonText}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════ CHAPTER 10 — INTEGRARE AI ════════════ */}
        <div className="page-break">
          <h2>Capitolul 10 &mdash; {ai.titlePlain} {ai.titleBold}</h2>
          <p>{ai.description}</p>

          {d.aiPrompts.map((prompt, pi) => (
            <div key={pi} className="wp-card" style={{ borderLeftColor: "#DC2626" }}>
              <h4>{prompt.label}</h4>
              <div style={{
                background: "#f5f5f5",
                padding: "10px 14px",
                borderRadius: 4,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "9pt",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
              }}>
                {prompt.text}
              </div>
            </div>
          ))}
        </div>

        {/* ════════════ ABOUT THE AUTHOR ════════════ */}
        <div className="page-break">
          <h2>Despre Autor</h2>
          <h3 style={{ color: "#1a1a1a" }}>{auth.name} {auth.nameBold}</h3>
          <p>{auth.bio1}</p>
          <p>{auth.bio2}</p>
          <div className="wp-card" style={{ borderLeftColor: "#DC2626", fontStyle: "italic" }}>
            <p style={{ marginBottom: 0 }}>{auth.quote}</p>
          </div>
          <p style={{ marginTop: 12 }}>
            {auth.tags.map((tag, ti) => (
              <span key={ti} className="wp-badge" style={{ background: "#f5f5f5", color: "#444", marginRight: 8 }}>{tag}</span>
            ))}
          </p>
        </div>

        {/* ════════════ FOOTER ════════════ */}
        <div className="wp-footer">
          <p>&copy; 2026 Dumitru Talmazan. Toate drepturile rezervate.</p>
          <p>Protocolul R IF C&trade; &mdash; rifcmarketing.com</p>
          <p style={{ marginTop: 8, fontSize: "8pt" }}>
            Acest document este proprietate intelectual&#x103; protejat&#x103;.
            Redistribuirea f&#x103;r&#x103; acordul autorului este interzis&#x103;.
          </p>
        </div>
      </div>
    </>
  );
}
