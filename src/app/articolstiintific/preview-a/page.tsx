"use client";

import { useEffect, useRef } from "react";

const PREVIEW_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Preview A — Dark Academic</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #0D1117;
  --surface: #161B22;
  --surface2: #1C2128;
  --surface3: #21262D;
  --border: #30363D;
  --border2: #3D444D;
  --text: #E6EDF3;
  --text2: #9CA3AF;
  --text3: #6B7280;
  --red: #DC2626;
  --red-dim: #DC262620;
  --blue: #3B82F6;
  --blue-dim: #3B82F618;
  --green: #10B981;
  --green-dim: #10B98120;
  --amber: #F59E0B;
  --amber-dim: #F59E0B18;
  --violet: #8B5CF6;
  --violet-dim: #8B5CF618;
  --cyan: #06B6D4;
  --cyan-dim: #06B6D418;
  --pink: #EC4899;
  --pink-dim: #EC489918;
  --accent: #5B9A8B;
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body { background:var(--bg); color:var(--text); font-family:'Inter',sans-serif; overflow-x:hidden; }
::selection { background:var(--red); color:#fff; }
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:var(--surface); }
::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

.app { display:flex; min-height:100vh; }

/* ═══ SIDEBAR ═══ */
.sidebar { width:280px; background:var(--surface); border-right:1px solid var(--border); position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:100; display:flex; flex-direction:column; }
.sidebar-header { padding:24px 20px 16px; border-bottom:1px solid var(--border); }
.sidebar-header .logo { font-size:11px; color:var(--red); letter-spacing:4px; font-weight:700; text-transform:uppercase; }
.sidebar-header h2 { font-size:14px; font-weight:600; color:var(--text); margin-top:8px; line-height:1.4; }
.sidebar-header p { font-size:11px; color:var(--text3); margin-top:4px; }
.sidebar-header .version { font-size:10px; color:var(--green); margin-top:8px; padding:4px 10px; background:var(--green-dim); border-radius:6px; display:inline-block; font-weight:600; }

.nav-section { padding:12px 12px 4px; }
.nav-section-label { font-size:10px; letter-spacing:2px; color:var(--text3); font-weight:600; padding:8px 8px 6px; text-transform:uppercase; }
.nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; cursor:pointer; transition:all .2s; font-size:13px; font-weight:400; color:var(--text2); position:relative; margin-bottom:2px; }
.nav-item:hover { background:var(--surface2); color:var(--text); }
.nav-item.active { background:var(--red-dim); color:var(--red); font-weight:600; }
.nav-item .num { font-size:11px; width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:8px; background:var(--surface3); color:var(--text3); flex-shrink:0; font-weight:700; }
.nav-item.active .num { background:var(--red); color:#fff; }
.nav-item.completed .num { background:var(--green-dim); color:var(--green); }
.nav-item .check { position:absolute; right:12px; font-size:10px; color:var(--green); opacity:0; }
.nav-item.completed .check { opacity:1; }

.progress-bar { margin:16px 20px; padding:14px; background:var(--surface2); border-radius:10px; border:1px solid var(--border); }
.progress-bar .label { font-size:10px; color:var(--text3); letter-spacing:1.5px; font-weight:600; text-transform:uppercase; }
.progress-bar .bar { height:4px; background:var(--surface3); border-radius:2px; margin-top:8px; overflow:hidden; }
.progress-bar .fill { height:100%; background:linear-gradient(90deg, var(--red), var(--amber)); border-radius:2px; width:25%; }
.progress-bar .stats { display:flex; justify-content:space-between; margin-top:6px; font-size:11px; color:var(--text3); }

.sidebar-badge { display:flex; align-items:center; gap:8px; margin:auto 16px 16px; padding:12px 16px; border-radius:10px; background:linear-gradient(135deg, var(--red), #991B1B); color:#fff; font-size:12px; font-weight:700; letter-spacing:.5px; cursor:pointer; transition:all .2s; border:none; text-decoration:none; }
.sidebar-badge:hover { opacity:.9; transform:translateY(-1px); }

/* ═══ MAIN ═══ */
.main { margin-left:280px; flex:1; min-height:100vh; }
.main-header { padding:24px 48px; border-bottom:1px solid var(--border); background:rgba(13,17,23,0.85); position:sticky; top:0; z-index:50; backdrop-filter:blur(20px); }
.main-header h1 { font-size:22px; font-weight:700; color:var(--text); }
.main-header .subtitle { font-size:12px; color:var(--text3); margin-top:2px; }

.content { padding:32px 48px 80px; max-width:1100px; }

/* ═══ STAGE ═══ */
.stage-header { margin-bottom:28px; }
.stage-label { font-size:11px; letter-spacing:3px; font-weight:700; margin-bottom:6px; text-transform:uppercase; }
.stage-title { font-size:28px; font-weight:800; line-height:1.2; margin-bottom:8px; }
.stage-desc { font-size:14px; color:var(--text2); line-height:1.7; max-width:900px; }
.stage-meta { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
.stage-meta .tag { font-size:11px; padding:5px 12px; border-radius:20px; font-weight:600; }

/* ═══ TASKS ═══ */
.task { background:var(--surface); border:1px solid var(--border); border-radius:12px; margin-bottom:10px; overflow:hidden; transition:all .25s; }
.task:hover { border-color:var(--border2); }
.task-header { display:flex; align-items:center; gap:12px; padding:18px 24px; cursor:pointer; }
.task-checkbox { width:22px; height:22px; border:2px solid var(--border2); border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:11px; color:transparent; }
.task-checkbox.checked { background:var(--green); border-color:var(--green); color:#fff; }
.task-header .title { font-size:15px; font-weight:500; flex:1; line-height:1.4; }
.task-header .priority { font-size:10px; padding:3px 10px; border-radius:10px; font-weight:700; letter-spacing:.5px; }
.task-header .priority.urgent { background:var(--red-dim); color:var(--red); }
.task-header .priority.high { background:var(--amber-dim); color:var(--amber); }
.task-header .priority.medium { background:var(--blue-dim); color:var(--blue); }
.task-header .arrow { color:var(--text3); transition:transform .2s; font-size:12px; }
.task.open .task-header .arrow { transform:rotate(180deg); }
.task-body { display:none; padding:0 24px 24px; }
.task.open .task-body { display:block; }
.task-detail { font-size:14px; color:var(--text2); line-height:1.8; max-width:900px; }
.task-detail strong { color:var(--text); }

.deliverable { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:16px 20px; margin-top:14px; }
.deliverable .dlabel { font-size:10px; letter-spacing:2px; font-weight:700; margin-bottom:8px; text-transform:uppercase; }
.deliverable .dlabel.output { color:var(--green); }
.deliverable .dlabel.input { color:var(--amber); }
.deliverable .dlabel.standard { color:var(--cyan); }
.deliverable .dlabel.site { color:var(--pink); }
.deliverable .dtext { font-size:13px; color:var(--text2); line-height:1.7; }

/* ═══ VARIANT BANNER ═══ */
.variant-banner { position:fixed; top:0; left:0; right:0; z-index:200; background:linear-gradient(135deg, #DC2626, #991B1B); color:#fff; padding:10px 20px; text-align:center; font-size:13px; font-weight:700; letter-spacing:1px; }
.variant-banner span { opacity:.7; font-weight:400; font-size:11px; }
.app { margin-top:40px; }
.sidebar { top:40px; height:calc(100vh - 40px); }
.main-header { top:40px; }
</style>
</head>
<body>
<div class="variant-banner">VARIANTA A — DARK ACADEMIC <span>| CONTINUUM Design System • Inter font • Dark theme</span></div>
<div class="app">
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">R IF C</div>
      <h2>Roadmap Articol Stiintific</h2>
      <p>Dezvoltare & Validare Scala</p>
      <div class="version">v2.0 — PRE-REGISTRATION</div>
    </div>
    <div class="nav-section">
      <div class="nav-section-label">ETAPE CERCETARE</div>
      <div class="nav-item completed"><div class="num">&#9678;</div>Vedere de Ansamblu<span class="check">&#10003;</span></div>
      <div class="nav-item completed"><div class="num">00</div>Audit Resurse Site<span class="check">&#10003;</span></div>
      <div class="nav-item active"><div class="num">01</div>Fundamentare Teoretica</div>
      <div class="nav-item"><div class="num">02</div>Dezvoltare Scala</div>
      <div class="nav-item"><div class="num">2B</div>Pilot Study</div>
      <div class="nav-item"><div class="num">03</div>Colectare Date & EFA</div>
      <div class="nav-item"><div class="num">3B</div>Studiu Consumatori</div>
      <div class="nav-item"><div class="num">04</div>CFA & Model Comparison</div>
      <div class="nav-item"><div class="num">4B</div>Scoring AI (Stratul 3)</div>
      <div class="nav-item"><div class="num">05</div>Validare Predictiva</div>
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
      <h1>Fundamentare Teoretica</h1>
      <div class="subtitle">ETAPA 01 — Luna 1, Saptamanile 1-3</div>
    </div>
    <div class="content">
      <div class="stage-header">
        <div class="stage-label" style="color:var(--red)">ETAPA 01 — FUNDAMENT</div>
        <div class="stage-title">Fundamentare Teoretica</div>
        <div class="stage-desc">Stabilirea bazei teoretice. Site-ul furnizeaza continutul brut — il transformam in limbaj academic cu referinte peer-reviewed.</div>
        <div class="stage-meta">
          <span class="tag" style="background:var(--red-dim);color:var(--red)">FUNDAMENT</span>
          <span class="tag" style="background:var(--surface3);color:var(--text2)">Luna 1 — Sapt. 1-3</span>
        </div>
      </div>

      <div class="task open">
        <div class="task-header">
          <div class="task-checkbox">&#10003;</div>
          <div class="title">Reformulare academica a definitiilor R, I, F, C</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">&#9660;</span>
        </div>
        <div class="task-body">
          <div class="task-detail">
            Continutul de pe Ch01 + Ch02 + Ch03 al site-ului contine definitiile — dar sunt scrise pentru marketeri, nu pentru revieweri academici. Trebuie rescrise cu formatul: <strong>definitie conceptuala + definitie operationala + baza teoretica + distinctie fata de constructe similare.</strong>
          </div>
          <div class="deliverable">
            <div class="dlabel site">INPUT GATA DE PE SITE</div>
            <div class="dtext">&#10003; Ch03 Anatomia Variabilelor — toate sub-factorii sunt deja listati<br>&#10003; Ch02 Ecuatia — metafora "constructie"<br>&#10003; Ch01 Filozofia — "Economia Cognitiva", "Eliminarea Anxietatii"</div>
          </div>
          <div class="deliverable">
            <div class="dlabel output">LIVRABIL</div>
            <div class="dtext">Definitiile formale ale fiecarui construct conform APA. ~1.500 cuvinte. Cu referinte: ELM (Petty & Cacioppo), Cognitive Load Theory (Sweller), Banner Blindness (Benway & Lane).</div>
          </div>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Formalizarea matematica a ecuatiei</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">&#9660;</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Justificarea Portii Relevantei</div>
          <span class="priority urgent">URGENT</span>
          <span class="arrow">&#9660;</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Literature Review — reformulare comparatii</div>
          <span class="priority high">HIGH</span>
          <span class="arrow">&#9660;</span>
        </div>
      </div>

      <div class="task">
        <div class="task-header">
          <div class="task-checkbox"></div>
          <div class="title">Pre-registration OSF.io</div>
          <span class="priority high">HIGH</span>
          <span class="arrow">&#9660;</span>
        </div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;

export default function PreviewAPage() {
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
      title="Preview A — Dark Academic"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
