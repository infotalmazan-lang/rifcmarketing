"use client";

import { useEffect, useRef } from "react";

const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview C — Notion-Style</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #FFFFFF;
  --surface: #FFFFFF;
  --surface2: #F7F6F3;
  --surface3: #EFEDEA;
  --border: #E8E5E0;
  --border2: #DAD7D2;
  --text: #37352F;
  --text2: #6B6B6B;
  --text3: #9B9A97;
  --red: #E03E3E;
  --red-dim: #E03E3E12;
  --blue: #2F68CD;
  --blue-dim: #2F68CD12;
  --green: #0F7B6C;
  --green-dim: #0F7B6C12;
  --amber: #CB8100;
  --amber-dim: #CB810012;
  --violet: #6940A5;
  --violet-dim: #6940A512;
  --cyan: #0B6E99;
  --cyan-dim: #0B6E9912;
  --pink: #AD1A72;
  --pink-dim: #AD1A7212;
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; overflow-x:hidden; -webkit-font-smoothing:antialiased; }
::selection { background:var(--blue); color:#fff; }
::-webkit-scrollbar { width:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:2px; }

.app { display:flex; min-height:100vh; }

.sidebar { width:260px; background:var(--surface2); position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:100; display:flex; flex-direction:column; }
.sidebar-header { padding:20px 16px 14px; }
.sidebar-header .logo { font-size:10px; color:var(--red); letter-spacing:3px; font-weight:700; opacity:.8; }
.sidebar-header h2 { font-size:14px; font-weight:600; color:var(--text); margin-top:6px; line-height:1.4; }
.sidebar-header p { font-size:11px; color:var(--text3); margin-top:2px; }
.sidebar-header .version { font-size:10px; color:var(--green); margin-top:6px; display:inline-block; font-weight:500; }

.nav-section { padding:8px 8px 4px; }
.nav-section-label { font-size:10px; letter-spacing:1px; color:var(--text3); font-weight:600; padding:8px 10px 4px; }
.nav-item { display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:4px; cursor:pointer; transition:all .15s; font-size:13px; font-weight:400; color:var(--text2); position:relative; margin-bottom:1px; }
.nav-item:hover { background:rgba(55,53,47,0.08); color:var(--text); }
.nav-item.active { background:rgba(55,53,47,0.08); color:var(--text); font-weight:600; }
.nav-item .num { font-size:10px; width:22px; height:22px; display:flex; align-items:center; justify-content:center; border-radius:4px; color:var(--text3); flex-shrink:0; font-weight:600; }
.nav-item.active .num { background:var(--red); color:#fff; border-radius:4px; }
.nav-item.completed .num { color:var(--green); }
.nav-item .check { position:absolute; right:8px; font-size:10px; color:var(--green); opacity:0; }
.nav-item.completed .check { opacity:1; }

.progress-bar { margin:12px 14px; padding:12px 14px; border-radius:6px; }
.progress-bar .label { font-size:10px; color:var(--text3); font-weight:500; }
.progress-bar .bar { height:3px; background:var(--surface3); border-radius:2px; margin-top:8px; overflow:hidden; }
.progress-bar .fill { height:100%; background:var(--red); border-radius:2px; width:25%; }
.progress-bar .stats { display:flex; justify-content:space-between; margin-top:6px; font-size:11px; color:var(--text3); }

.sidebar-badge { display:flex; align-items:center; gap:6px; margin:auto 12px 14px; padding:8px 14px; border-radius:6px; background:var(--red); color:#fff; font-size:12px; font-weight:600; cursor:pointer; transition:all .15s; border:none; text-decoration:none; }
.sidebar-badge:hover { opacity:.85; }

.main { margin-left:260px; flex:1; min-height:100vh; }
.main-header { padding:40px 72px 20px; }
.main-header .breadcrumb { font-size:12px; color:var(--text3); margin-bottom:8px; }
.main-header h1 { font-size:40px; font-weight:700; color:var(--text); line-height:1.1; }
.main-header .subtitle { font-size:14px; color:var(--text3); margin-top:6px; }

.content { padding:20px 72px 80px; max-width:900px; }

.stage-header { margin-bottom:28px; padding-bottom:20px; border-bottom:1px solid var(--border); }
.stage-label { font-size:12px; letter-spacing:1px; font-weight:600; margin-bottom:4px; color:var(--text3); }
.stage-desc { font-size:15px; color:var(--text2); line-height:1.8; }
.stage-meta { display:flex; gap:8px; margin-top:14px; flex-wrap:wrap; }
.stage-meta .tag { font-size:11px; padding:3px 8px; border-radius:4px; font-weight:500; }

.task { background:var(--surface); border-radius:4px; margin-bottom:1px; overflow:hidden; transition:all .15s; }
.task:hover { background:var(--surface2); }
.task-header { display:flex; align-items:center; gap:10px; padding:12px 8px; cursor:pointer; }
.task-checkbox { width:18px; height:18px; border:1.5px solid var(--border2); border-radius:3px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:10px; color:transparent; cursor:pointer; }
.task-checkbox.checked { background:var(--green); border-color:var(--green); color:#fff; }
.task-header .title { font-size:14px; font-weight:400; flex:1; line-height:1.4; color:var(--text); }
.task-header .priority { font-size:10px; padding:2px 6px; border-radius:3px; font-weight:600; }
.task-header .priority.urgent { background:var(--red-dim); color:var(--red); }
.task-header .priority.high { background:var(--amber-dim); color:var(--amber); }
.task-header .priority.medium { background:var(--blue-dim); color:var(--blue); }
.task-header .arrow { color:var(--text3); transition:transform .15s; font-size:10px; }
.task.open .task-header .arrow { transform:rotate(90deg); }
.task-body { display:none; padding:4px 8px 16px 36px; }
.task.open .task-body { display:block; }
.task-detail { font-size:14px; color:var(--text2); line-height:1.8; }
.task-detail strong { color:var(--text); }

.deliverable { background:var(--surface2); border-radius:6px; padding:14px 16px; margin-top:12px; }
.deliverable .dlabel { font-size:10px; letter-spacing:1.5px; font-weight:600; margin-bottom:6px; text-transform:uppercase; }
.deliverable .dlabel.output { color:var(--green); }
.deliverable .dlabel.input { color:var(--amber); }
.deliverable .dlabel.standard { color:var(--cyan); }
.deliverable .dlabel.site { color:var(--pink); }
.deliverable .dtext { font-size:13px; color:var(--text2); line-height:1.7; }

.variant-banner { position:fixed; top:0; left:0; right:0; z-index:200; background:var(--surface2); color:var(--text); padding:8px 20px; text-align:center; font-size:13px; font-weight:600; border-bottom:1px solid var(--border); }
.variant-banner span { opacity:.5; font-weight:400; font-size:11px; }
.app { margin-top:36px; }
.sidebar { top:36px; height:calc(100vh - 36px); }
</style>
</head>
<body>
<div class="variant-banner">VARIANTA C — NOTION-STYLE <span>| Warm white • Flat • Document-like • Minimal</span></div>
<div class="app">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">R IF C</div>
      <h2>Roadmap Articol Științific</h2>
      <p>Dezvoltare & Validare Scală</p>
      <div class="version">v2.0 — pre-registration</div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">Etape cercetare</div>
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
      <div class="label">Progres</div>
      <div class="bar"><div class="fill"></div></div>
      <div class="stats"><span>3 / 12</span><span>25%</span></div>
    </div>
    <a class="sidebar-badge" href="/studiu" target="_blank">
      <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
      Deschide sondajul
    </a>
  </div>

  <div class="main">
    <div class="main-header">
      <div class="breadcrumb">R IF C / Roadmap / Etapa 01</div>
      <h1>Fundamentare Teoretică</h1>
      <div class="subtitle">Luna 1 — Săptămânile 1-3 · FUNDAMENT</div>
    </div>
    <div class="content">
      <div class="stage-header">
        <div class="stage-label" style="color:var(--text3)">ETAPA 01</div>
        <div class="stage-desc">Stabilirea bazei teoretice. Site-ul furnizează conținutul brut — îl transformăm în limbaj academic cu referințe peer-reviewed.</div>
        <div class="stage-meta">
          <span class="tag" style="background:var(--red-dim);color:var(--red)">Fundament</span>
          <span class="tag" style="background:var(--surface2);color:var(--text3)">Luna 1 — Săpt. 1-3</span>
        </div>
      </div>

      <div class="task open">
        <div class="task-header">
          <div class="task-checkbox">✓</div>
          <div class="title">Reformulare academică a definițiilor R, I, F, C</div>
          <span class="priority urgent">Urgent</span>
          <span class="arrow">▸</span>
        </div>
        <div class="task-body">
          <div class="task-detail">
            Conținutul de pe Ch01 + Ch02 + Ch03 al site-ului conține definițiile — dar sunt scrise pentru marketeri, nu pentru revieweri academici. Trebuie rescrise cu formatul: <strong>definiție conceptuală + definiție operațională + bază teoretică + distincție față de constructe similare.</strong>
          </div>
          <div class="deliverable">
            <div class="dlabel site">Input gata de pe site</div>
            <div class="dtext">✅ Ch03 Anatomia Variabilelor — toate sub-factorii sunt deja listați<br>✅ Ch02 Ecuația — metafora "construcție"<br>✅ Ch01 Filozofia — "Economia Cognitivă", "Eliminarea Anxietății"</div>
          </div>
          <div class="deliverable">
            <div class="dlabel output">Livrabil</div>
            <div class="dtext">Definițiile formale ale fiecărui construct conform APA. ~1.500 cuvinte. Cu referințe: ELM (Petty & Cacioppo), Cognitive Load Theory (Sweller), Banner Blindness (Benway & Lane).</div>
          </div>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Formalizarea matematică a ecuației</div>
          <span class="priority urgent">Urgent</span>
          <span class="arrow">▸</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Justificarea Porții Relevanței</div>
          <span class="priority urgent">Urgent</span>
          <span class="arrow">▸</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Literature Review — reformulare comparații</div>
          <span class="priority high">High</span>
          <span class="arrow">▸</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Pre-registration OSF.io</div>
          <span class="priority high">High</span>
          <span class="arrow">▸</span>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

export default function PreviewCPage() {
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
      title="Preview C — Notion-Style"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
