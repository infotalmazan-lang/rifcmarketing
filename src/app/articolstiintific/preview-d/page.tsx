"use client";

import { useEffect, useRef } from "react";

const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview D — Research Paper Dashboard</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #F8F6F3;
  --surface: #FFFFFF;
  --surface2: #F2EFE9;
  --surface3: #E8E4DD;
  --border: #DDD9D2;
  --border2: #CCC8C0;
  --text: #2C2C2C;
  --text2: #5C5C5C;
  --text3: #999690;
  --red: #C53030;
  --red-dim: #C5303012;
  --blue: #2B6CB0;
  --blue-dim: #2B6CB012;
  --green: #276749;
  --green-dim: #27674912;
  --amber: #B7791F;
  --amber-dim: #B7791F12;
  --violet: #6B46C1;
  --violet-dim: #6B46C112;
  --cyan: #2C7A7B;
  --cyan-dim: #2C7A7B12;
  --pink: #B83280;
  --pink-dim: #B8328012;
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; overflow-x:hidden; }
::selection { background:var(--red); color:#fff; }
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:var(--surface2); }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }

.app { display:flex; min-height:100vh; }

.sidebar { width:300px; background:var(--surface); border-right:1px solid var(--border); position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:100; display:flex; flex-direction:column; }
.sidebar-header { padding:28px 24px 20px; border-bottom:1px solid var(--border); }
.sidebar-header .logo { font-size:10px; color:var(--red); letter-spacing:4px; font-weight:700; }
.sidebar-header h2 { font-family:'Source Serif 4',Georgia,serif; font-size:18px; font-weight:700; color:var(--text); margin-top:8px; line-height:1.3; }
.sidebar-header p { font-size:11px; color:var(--text3); margin-top:4px; font-style:italic; }
.sidebar-header .version { font-size:10px; color:var(--green); margin-top:8px; padding:4px 10px; background:var(--green-dim); border-radius:4px; display:inline-block; font-weight:600; border:1px solid rgba(39,103,73,0.15); }

.nav-section { padding:16px 14px 4px; }
.nav-section-label { font-size:9px; letter-spacing:2.5px; color:var(--text3); font-weight:700; padding:8px 10px 6px; text-transform:uppercase; }

/* timeline-style nav items */
.nav-item { display:flex; align-items:center; gap:12px; padding:10px 14px; border-radius:6px; cursor:pointer; transition:all .2s; font-size:13px; font-weight:400; color:var(--text2); position:relative; margin-bottom:0; margin-left:12px; border-left:2px solid var(--border); padding-left:20px; }
.nav-item:last-of-type { border-left-color:transparent; }
.nav-item::before { content:''; position:absolute; left:-6px; top:50%; transform:translateY(-50%); width:10px; height:10px; border-radius:50%; background:var(--surface3); border:2px solid var(--border); }
.nav-item:hover { background:var(--surface2); color:var(--text); }
.nav-item.active { color:var(--red); font-weight:600; }
.nav-item.active::before { background:var(--red); border-color:var(--red); box-shadow:0 0 0 3px var(--red-dim); }
.nav-item.completed::before { background:var(--green); border-color:var(--green); }
.nav-item .num { font-size:11px; width:28px; text-align:center; flex-shrink:0; font-weight:700; color:var(--text3); }
.nav-item.active .num { color:var(--red); }
.nav-item.completed .num { color:var(--green); }
.nav-item .check { position:absolute; right:12px; font-size:10px; color:var(--green); opacity:0; }
.nav-item.completed .check { opacity:1; }

.progress-bar { margin:20px 20px; padding:16px; background:var(--surface2); border-radius:8px; border:1px solid var(--border); }
.progress-bar .label { font-size:10px; color:var(--text3); letter-spacing:1.5px; font-weight:600; text-transform:uppercase; }
.progress-bar .bar { height:4px; background:var(--surface3); border-radius:2px; margin-top:10px; overflow:hidden; }
.progress-bar .fill { height:100%; background:linear-gradient(90deg, var(--red), var(--amber)); border-radius:2px; width:25%; }
.progress-bar .stats { display:flex; justify-content:space-between; margin-top:8px; font-size:11px; color:var(--text3); }

.sidebar-badge { display:flex; align-items:center; gap:8px; margin:auto 16px 16px; padding:12px 16px; border-radius:8px; background:var(--red); color:#fff; font-size:12px; font-weight:700; letter-spacing:.5px; cursor:pointer; transition:all .2s; border:none; text-decoration:none; }
.sidebar-badge:hover { opacity:.9; }

.main { margin-left:300px; flex:1; min-height:100vh; }
.main-header { padding:32px 56px 24px; border-bottom:1px solid var(--border); background:rgba(248,246,243,0.9); position:sticky; top:0; z-index:50; backdrop-filter:blur(20px); }
.main-header .journal { font-size:11px; color:var(--text3); letter-spacing:2px; font-weight:600; margin-bottom:8px; }
.main-header h1 { font-family:'Source Serif 4',Georgia,serif; font-size:28px; font-weight:700; color:var(--text); line-height:1.2; }
.main-header .subtitle { font-size:13px; color:var(--text3); margin-top:6px; font-style:italic; }

.content { padding:36px 56px 80px; max-width:1000px; }

.stage-header { margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid var(--border); }
.stage-label { font-size:11px; letter-spacing:3px; font-weight:700; margin-bottom:6px; }
.stage-title { font-family:'Source Serif 4',Georgia,serif; font-size:32px; font-weight:700; line-height:1.2; margin-bottom:10px; }
.stage-desc { font-size:15px; color:var(--text2); line-height:1.8; }
.stage-meta { display:flex; gap:10px; margin-top:18px; flex-wrap:wrap; }
.stage-meta .tag { font-size:11px; padding:5px 12px; border-radius:4px; font-weight:600; border:1px solid transparent; }

.task { background:var(--surface); border:1px solid var(--border); border-radius:8px; margin-bottom:10px; overflow:hidden; transition:all .2s; }
.task:hover { border-color:var(--border2); }
.task.has-site { border-left:3px solid var(--pink); }
.task-header { display:flex; align-items:center; gap:12px; padding:18px 24px; cursor:pointer; }
.task-checkbox { width:20px; height:20px; border:2px solid var(--border2); border-radius:4px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:10px; color:transparent; }
.task-checkbox.checked { background:var(--green); border-color:var(--green); color:#fff; }
.task-header .title { font-size:15px; font-weight:500; flex:1; line-height:1.4; }
.task-header .priority { font-size:10px; padding:3px 10px; border-radius:4px; font-weight:700; letter-spacing:.5px; }
.task-header .priority.urgent { background:var(--red-dim); color:var(--red); border:1px solid rgba(197,48,48,0.15); }
.task-header .priority.high { background:var(--amber-dim); color:var(--amber); border:1px solid rgba(183,121,31,0.15); }
.task-header .priority.medium { background:var(--blue-dim); color:var(--blue); border:1px solid rgba(43,108,176,0.15); }
.task-header .arrow { color:var(--text3); transition:transform .2s; font-size:12px; }
.task.open .task-header .arrow { transform:rotate(180deg); }
.task-body { display:none; padding:0 24px 24px; }
.task.open .task-body { display:block; }
.task-detail { font-size:14px; color:var(--text2); line-height:1.9; }
.task-detail strong { color:var(--text); }

.deliverable { background:var(--surface2); border:1px solid var(--border); border-radius:6px; padding:16px 20px; margin-top:14px; }
.deliverable .dlabel { font-size:10px; letter-spacing:2px; font-weight:700; margin-bottom:8px; text-transform:uppercase; }
.deliverable .dlabel.output { color:var(--green); }
.deliverable .dlabel.input { color:var(--amber); }
.deliverable .dlabel.standard { color:var(--cyan); }
.deliverable .dlabel.site { color:var(--pink); }
.deliverable .dtext { font-size:13px; color:var(--text2); line-height:1.7; }

.variant-banner { position:fixed; top:0; left:0; right:0; z-index:200; background:var(--surface); color:var(--text); padding:10px 20px; text-align:center; font-size:13px; font-weight:700; letter-spacing:1px; border-bottom:2px solid var(--red); }
.variant-banner span { opacity:.5; font-weight:400; font-size:11px; font-style:italic; }
.app { margin-top:42px; }
.sidebar { top:42px; height:calc(100vh - 42px); }
.main-header { top:42px; }
</style>
</head>
<body>
<div class="variant-banner">VARIANTA D — RESEARCH PAPER DASHBOARD <span>| Academic typography • Checkpoint dots • Warm tones</span></div>
<div class="app">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">R IF C</div>
      <h2>Roadmap Articol Științific</h2>
      <p>Dezvoltare & Validare Scală R IF C</p>
      <div class="version">v2.0 — Pre-registration</div>
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
      <div class="journal">JOURNAL OF BUSINESS RESEARCH · MANUSCRIPT</div>
      <h1>Fundamentare Teoretică</h1>
      <div class="subtitle">Etapa 01 — Luna 1, Săptămânile 1-3 · Fundament</div>
    </div>
    <div class="content">
      <div class="stage-header">
        <div class="stage-label" style="color:var(--red)">ETAPA 01 — FUNDAMENT</div>
        <div class="stage-title">Fundamentare Teoretică</div>
        <div class="stage-desc">Stabilirea bazei teoretice. Site-ul furnizează conținutul brut — îl transformăm în limbaj academic cu referințe peer-reviewed.</div>
        <div class="stage-meta">
          <span class="tag" style="background:var(--red-dim);color:var(--red);border-color:rgba(197,48,48,0.15)">Fundament</span>
          <span class="tag" style="background:var(--surface2);color:var(--text2);border-color:var(--border)">Luna 1 — Săpt. 1-3</span>
        </div>
      </div>

      <div class="task has-site open">
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

      <div class="task has-site">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Formalizarea matematică a ecuației</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="task has-site">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Justificarea Porții Relevanței</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">▼</span>
        </div>
      </div>

      <div class="task has-site">
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

export default function PreviewDPage() {
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
      title="Preview D — Research Paper Dashboard"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
