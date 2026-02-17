"use client";

import { useEffect, useRef } from "react";

const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview B — Clean White Minimal</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #FAFAFA;
  --surface: #FFFFFF;
  --surface2: #F5F5F5;
  --surface3: #EEEEEE;
  --border: #E5E5E5;
  --border2: #D4D4D4;
  --text: #171717;
  --text2: #525252;
  --text3: #A3A3A3;
  --red: #DC2626;
  --red-dim: #DC262610;
  --blue: #2563EB;
  --blue-dim: #2563EB10;
  --green: #059669;
  --green-dim: #05966910;
  --amber: #D97706;
  --amber-dim: #D9770610;
  --violet: #7C3AED;
  --violet-dim: #7C3AED10;
  --cyan: #0891B2;
  --cyan-dim: #0891B210;
  --pink: #DB2777;
  --pink-dim: #DB277710;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.08);
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; overflow-x:hidden; }
::selection { background:var(--red); color:#fff; }
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }

.app { display:flex; min-height:100vh; }

.sidebar { width:280px; background:var(--surface); border-right:1px solid var(--border); position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:100; display:flex; flex-direction:column; box-shadow:var(--shadow-sm); }
.sidebar-header { padding:28px 24px 20px; border-bottom:1px solid var(--border); }
.sidebar-header .logo { font-size:11px; color:var(--red); letter-spacing:4px; font-weight:700; }
.sidebar-header h2 { font-size:15px; font-weight:700; color:var(--text); margin-top:8px; line-height:1.4; }
.sidebar-header p { font-size:11px; color:var(--text3); margin-top:4px; }
.sidebar-header .version { font-size:10px; color:var(--green); margin-top:8px; padding:4px 10px; background:var(--green-dim); border-radius:20px; display:inline-block; font-weight:600; }

.nav-section { padding:16px 14px 4px; }
.nav-section-label { font-size:9px; letter-spacing:2.5px; color:var(--text3); font-weight:700; padding:8px 10px 6px; text-transform:uppercase; }
.nav-item { display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:10px; cursor:pointer; transition:all .2s; font-size:13px; font-weight:400; color:var(--text2); position:relative; margin-bottom:2px; }
.nav-item:hover { background:var(--surface2); color:var(--text); }
.nav-item.active { background:var(--red-dim); color:var(--red); font-weight:600; box-shadow:var(--shadow-sm); }
.nav-item .num { font-size:11px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:10px; background:var(--surface2); color:var(--text3); flex-shrink:0; font-weight:700; }
.nav-item.active .num { background:var(--red); color:#fff; border-radius:10px; }
.nav-item.completed .num { background:var(--green-dim); color:var(--green); }
.nav-item .check { position:absolute; right:12px; font-size:10px; color:var(--green); opacity:0; }
.nav-item.completed .check { opacity:1; }

.progress-bar { margin:16px 20px; padding:16px; background:var(--surface); border-radius:14px; border:1px solid var(--border); box-shadow:var(--shadow-sm); }
.progress-bar .label { font-size:10px; color:var(--text3); letter-spacing:1.5px; font-weight:600; text-transform:uppercase; }
.progress-bar .bar { height:6px; background:var(--surface3); border-radius:3px; margin-top:10px; overflow:hidden; }
.progress-bar .fill { height:100%; background:linear-gradient(90deg, var(--red), #F97316); border-radius:3px; width:25%; }
.progress-bar .stats { display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:var(--text3); }

.sidebar-badge { display:flex; align-items:center; gap:8px; margin:auto 16px 16px; padding:12px 16px; border-radius:12px; background:linear-gradient(135deg, var(--red), #B91C1C); color:#fff; font-size:12px; font-weight:700; letter-spacing:.5px; cursor:pointer; transition:all .2s; border:none; text-decoration:none; box-shadow:0 4px 12px rgba(220,38,38,0.25); }
.sidebar-badge:hover { transform:translateY(-2px); box-shadow:0 6px 16px rgba(220,38,38,0.3); }

.main { margin-left:280px; flex:1; min-height:100vh; }
.main-header { padding:28px 48px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(20px); }
.main-header h1 { font-size:24px; font-weight:800; color:var(--text); }
.main-header .subtitle { font-size:12px; color:var(--text3); margin-top:4px; font-weight:500; }

.content { padding:36px 48px 80px; max-width:1100px; }

.stage-header { margin-bottom:32px; }
.stage-label { font-size:11px; letter-spacing:3px; font-weight:700; margin-bottom:8px; }
.stage-title { font-size:32px; font-weight:800; line-height:1.2; margin-bottom:10px; }
.stage-desc { font-size:15px; color:var(--text2); line-height:1.8; max-width:900px; }
.stage-meta { display:flex; gap:10px; margin-top:18px; flex-wrap:wrap; }
.stage-meta .tag { font-size:11px; padding:6px 14px; border-radius:20px; font-weight:600; }

.task { background:var(--surface); border:1px solid var(--border); border-radius:14px; margin-bottom:12px; overflow:hidden; transition:all .25s; box-shadow:var(--shadow-sm); }
.task:hover { box-shadow:var(--shadow-md); border-color:var(--border2); }
.task-header { display:flex; align-items:center; gap:14px; padding:20px 28px; cursor:pointer; }
.task-checkbox { width:24px; height:24px; border:2px solid var(--border2); border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:12px; color:transparent; }
.task-checkbox.checked { background:var(--green); border-color:var(--green); color:#fff; }
.task-header .title { font-size:15px; font-weight:500; flex:1; line-height:1.4; }
.task-header .priority { font-size:10px; padding:4px 12px; border-radius:20px; font-weight:700; letter-spacing:.5px; }
.task-header .priority.urgent { background:var(--red-dim); color:var(--red); }
.task-header .priority.high { background:var(--amber-dim); color:var(--amber); }
.task-header .priority.medium { background:var(--blue-dim); color:var(--blue); }
.task-header .arrow { color:var(--text3); transition:transform .2s; font-size:12px; }
.task.open .task-header .arrow { transform:rotate(180deg); }
.task-body { display:none; padding:0 28px 28px; }
.task.open .task-body { display:block; }
.task-detail { font-size:14px; color:var(--text2); line-height:1.8; max-width:900px; }
.task-detail strong { color:var(--text); }

.deliverable { background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:18px 22px; margin-top:16px; }
.deliverable .dlabel { font-size:10px; letter-spacing:2px; font-weight:700; margin-bottom:8px; text-transform:uppercase; }
.deliverable .dlabel.output { color:var(--green); }
.deliverable .dlabel.input { color:var(--amber); }
.deliverable .dlabel.standard { color:var(--cyan); }
.deliverable .dlabel.site { color:var(--pink); }
.deliverable .dtext { font-size:13px; color:var(--text2); line-height:1.7; }

.variant-banner { position:fixed; top:0; left:0; right:0; z-index:200; background:linear-gradient(135deg, #fff, #F5F5F5); color:var(--text); padding:10px 20px; text-align:center; font-size:13px; font-weight:700; letter-spacing:1px; border-bottom:2px solid var(--red); }
.variant-banner span { opacity:.5; font-weight:400; font-size:11px; }
.app { margin-top:42px; }
.sidebar { top:42px; height:calc(100vh - 42px); }
.main-header { top:42px; }
</style>
</head>
<body>
<div class="variant-banner">VARIANTA B — CLEAN WHITE MINIMAL <span>| Shadows • Large radius • Airy spacing</span></div>
<div class="app">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">R IF C</div>
      <h2>Roadmap Articol Științific</h2>
      <p>Dezvoltare & Validare Scală</p>
      <div class="version">v2.0 — PRE-REGISTRATION</div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">ETAPE CERCETARE</div>
      <div class="nav-item completed"><div class="num">◎</div>Vedere de Ansamblu<span class="check">✓</span></div>
      <div class="nav-item completed"><div class="num">00</div>Audit Resurse Site<span class="check">✓</span></div>
      <div class="nav-item active"><div class="num">01</div>Fundamentare Teoretică</div>
      <div class="nav-item"><div class="num">02</div>Dezvoltare Scală</div>
      <div class="nav-item"><div class="num">2B</div>Pilot Study</div>
      <div class="nav-item"><div class="num">03</div>Colectare Date & EFA</div>
      <div class="nav-item"><div class="num">3B</div>Studiu Consumatori</div>
      <div class="nav-item"><div class="num">04</div>CFA & Model Comparison</div>
      <div class="nav-item"><div class="num">4B</div>Scoring AI (Stratul 3)</div>
      <div class="nav-item"><div class="num">05</div>Validare Predictivă</div>
      <div class="nav-item"><div class="num">5B</div>Focus Grupuri</div>
      <div class="nav-item"><div class="num">06</div>Scriere & Submisie</div>
    </div>
    <div class="progress-bar">
      <div class="label">PROGRES GENERAL</div>
      <div class="bar"><div class="fill"></div></div>
      <div class="stats"><span>3 / 12 completate</span><span>25%</span></div>
    </div>
    <a class="sidebar-badge" href="/studiu" target="_blank">
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      DESCHIDE SONDAJUL
    </a>
  </div>

  <div class="main">
    <div class="main-header">
      <h1>Fundamentare Teoretică</h1>
      <div class="subtitle">ETAPA 01 — Luna 1, Săptămânile 1-3</div>
    </div>
    <div class="content">
      <div class="stage-header">
        <div class="stage-label" style="color:var(--red)">ETAPA 01 — FUNDAMENT</div>
        <div class="stage-title">Fundamentare Teoretică</div>
        <div class="stage-desc">Stabilirea bazei teoretice. Site-ul furnizează conținutul brut — îl transformăm în limbaj academic cu referințe peer-reviewed.</div>
        <div class="stage-meta">
          <span class="tag" style="background:var(--red-dim);color:var(--red)">FUNDAMENT</span>
          <span class="tag" style="background:var(--surface3);color:var(--text2)">Luna 1 — Săpt. 1-3</span>
        </div>
      </div>

      <div class="task open">
        <div class="task-header">
          <div class="task-checkbox">✓</div>
          <div class="title">Reformulare academică a definițiilor R, I, F, C</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">▼</span>
        </div>
        <div class="task-body">
          <div class="task-detail">
            Conținutul de pe Ch01 + Ch02 + Ch03 al site-ului conține definițiile — dar sunt scrise pentru marketeri, nu pentru revieweri academici. Trebuie rescrise cu formatul: <strong>definiție conceptuală + definiție operațională + bază teoretică + distincție față de constructe similare.</strong>
          </div>
          <div class="deliverable">
            <div class="dlabel site">INPUT GATA DE PE SITE</div>
            <div class="dtext">✅ Ch03 Anatomia Variabilelor — toate sub-factorii sunt deja listați<br>✅ Ch02 Ecuația — metafora "construcție"<br>✅ Ch01 Filozofia — "Economia Cognitivă", "Eliminarea Anxietății"</div>
          </div>
          <div class="deliverable">
            <div class="dlabel output">LIVRABIL</div>
            <div class="dtext">Definițiile formale ale fiecărui construct conform APA. ~1.500 cuvinte. Cu referințe: ELM (Petty & Cacioppo), Cognitive Load Theory (Sweller), Banner Blindness (Benway & Lane).</div>
          </div>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Formalizarea matematică a ecuației</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Justificarea Porții Relevanței</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Literature Review — reformulare comparații</div>
          <span class="priority high">HIGH</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Pre-registration OSF.io</div>
          <span class="priority high">HIGH</span>
          <span class="arrow">▼</span>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

export default function PreviewBPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(PREVIEW_HTML);
    doc.close();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="Preview B — Clean White Minimal"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
