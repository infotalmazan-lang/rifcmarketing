"use client";

import { useRef, useEffect } from "react";

// ============================================================
// R IF C — Articol Științific v3 — full menu rebuild
// 12 etape, 42 sarcini, progress bar, clickable sub-items
// Access code: RIFC2026
// ============================================================

const ROADMAP_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>R IF C — Articol Științific</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #FAFAFA; --surface: #FFFFFF; --surface2: #F5F5F5; --surface3: #EEEEEE;
    --border: #E5E5E5; --border2: #D4D4D4;
    --text: #171717; --text2: #525252; --text3: #A3A3A3;
    --red: #DC2626; --green: #059669; --green2: #10b981; --amber: #D97706;
    --blue: #2563EB; --pink: #EC4899; --violet: #7C3AED;
    --sidebar-w: 290px;
  }

  body { font-family: 'Inter', -apple-system, sans-serif; background: var(--bg); color: var(--text); line-height: 1.5; overflow: hidden; height: 100vh; }

  /* ===== ACCESS GATE ===== */
  #access-gate { position: fixed; inset: 0; background: var(--bg); display: flex; align-items: center; justify-content: center; z-index: 9999; }
  .access-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 40px; width: 380px; text-align: center; }
  .access-box h2 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .access-box p { font-size: 13px; color: var(--text2); margin-bottom: 24px; }
  .access-box input { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 15px; text-align: center; letter-spacing: 3px; outline: none; transition: border-color 0.2s; }
  .access-box input:focus { border-color: var(--green); }
  .access-box .error-msg { color: var(--red); font-size: 12px; margin-top: 8px; min-height: 18px; }
  .access-box button { margin-top: 16px; width: 100%; padding: 10px; background: var(--green); color: #fff; border: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; }
  .access-box button:hover { opacity: 0.9; }

  /* ===== APP ===== */
  #app { display: none; height: 100vh; }

  /* ===== SIDEBAR ===== */
  .sidebar { position: fixed; left: 0; top: 0; bottom: 0; width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; z-index: 100; overflow-y: auto; overflow-x: hidden; }
  .sidebar::-webkit-scrollbar { width: 4px; }
  .sidebar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* Header */
  .sb-header { padding: 16px 14px 12px; border-bottom: 1px solid var(--border); }
  .sb-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .sb-logo-row img { width: 32px; height: 32px; border-radius: 6px; object-fit: contain; }
  .sb-title { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .sb-subtitle { font-size: 10px; color: var(--text3); }

  /* Progress bar */
  .sb-progress { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .sb-progress-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .sb-progress-label span { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
  .sb-progress-label .pct { font-family: 'JetBrains Mono', monospace; color: var(--green); font-size: 11px; }
  .sb-bar { width: 100%; height: 6px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .sb-bar-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--green2)); border-radius: 4px; transition: width 0.4s ease; }
  .sb-progress-stats { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }

  /* Action buttons */
  .sb-actions { padding: 10px 14px; display: flex; flex-direction: column; gap: 5px; border-bottom: 1px solid var(--border); }
  .sb-btn { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; color: #fff; width: 100%; text-align: left; transition: opacity 0.15s; }
  .sb-btn:hover { opacity: 0.9; }
  .sb-btn.active { box-shadow: inset 0 0 0 2px rgba(255,255,255,0.3); }
  .sb-btn.green { background: var(--green); }
  .sb-btn.red { background: var(--red); }
  .sb-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

  /* Nav section */
  .sb-nav { padding: 10px 0; flex: 1; }
  .sb-nav-title { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); padding: 0 14px; margin-bottom: 6px; }

  /* Stage separator (for Etapa 00) */
  .sb-separator { height: 1px; background: var(--border); margin: 6px 14px; }

  /* Stage item */
  .sb-stage { padding: 0 8px; }
  .sb-stage-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px 8px; border: none; border-radius: 6px; background: transparent; cursor: pointer; transition: background 0.15s; text-align: left; font-family: 'Inter', sans-serif; }
  .sb-stage-btn:hover { background: var(--surface2); }
  .sb-stage-btn.active { background: var(--red); color: #fff; }
  .sb-stage-btn.active .sb-stage-num { background: rgba(255,255,255,0.2); color: #fff; }
  .sb-stage-btn.active .sb-stage-name { color: #fff; }
  .sb-stage-btn.active .sb-stage-count { color: rgba(255,255,255,0.7); }
  .sb-stage-btn.active .sb-site-tag { background: rgba(255,255,255,0.2); color: #fff; }
  .sb-stage-btn.done .sb-stage-num { background: var(--green); color: #fff; }

  .sb-stage-num { width: 26px; height: 26px; border-radius: 6px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: var(--text2); flex-shrink: 0; }
  .sb-stage-name { font-size: 12px; font-weight: 600; color: var(--text); flex: 1; line-height: 1.3; }
  .sb-stage-count { font-size: 9px; color: var(--text3); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
  .sb-site-tag { font-size: 8px; font-weight: 700; letter-spacing: 0.5px; padding: 1px 5px; border-radius: 3px; background: var(--pink); color: #fff; flex-shrink: 0; margin-left: 2px; }

  /* Sub-items (tasks) */
  .sb-tasks { padding: 2px 0 4px 0; display: none; }
  .sb-tasks.open { display: block; }
  .sb-task { display: flex; align-items: flex-start; gap: 7px; padding: 4px 8px 4px 50px; cursor: pointer; border-radius: 4px; transition: background 0.1s; }
  .sb-task:hover { background: var(--surface2); }
  .sb-task-check { width: 14px; height: 14px; border: 1.5px solid var(--border2); border-radius: 3px; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .sb-task-check.checked { background: var(--green); border-color: var(--green); }
  .sb-task-check.checked::after { content: ''; display: block; width: 5px; height: 8px; border: solid #fff; border-width: 0 1.5px 1.5px 0; transform: rotate(45deg) translate(-0.5px, -0.5px); }
  .sb-task-name { font-size: 11px; color: var(--text2); line-height: 1.4; flex: 1; }
  .sb-task.done .sb-task-name { color: var(--text3); text-decoration: line-through; }

  /* ===== MAIN AREA ===== */
  .main-area { margin-left: var(--sidebar-w); height: 100vh; overflow: hidden; background: var(--bg); }
  .page-view { display: none; height: 100%; }
  .page-view.active { display: block; }
  .iframe-container { width: 100%; height: 100%; }
  .iframe-container iframe { width: 100%; height: 100%; border: none; display: block; }

  /* Overview */
  .ov { padding: 40px; max-width: 760px; overflow-y: auto; height: 100%; }
  .ov h1 { font-size: 24px; font-weight: 800; margin-bottom: 4px; }
  .ov .lead { font-size: 14px; color: var(--text2); margin-bottom: 24px; line-height: 1.6; }
  .ov-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 10px; }
  .ov-card h3 { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .ov-card p { font-size: 12px; color: var(--text2); line-height: 1.5; }
</style>
</head>
<body>

<!-- ACCESS GATE -->
<div id="access-gate">
  <div class="access-box">
    <h2>Acces Restricționat</h2>
    <p>Introduceți codul de acces</p>
    <input type="text" id="access-input" placeholder="COD ACCES" maxlength="20" autocomplete="off" />
    <div class="error-msg" id="access-error"></div>
    <button onclick="checkAccess()">Verifică</button>
  </div>
</div>

<!-- APP -->
<div id="app">
  <div class="sidebar">
    <!-- Header -->
    <div class="sb-header">
      <div class="sb-logo-row">
        <img src="/images/rifc-logo-black.png" alt="R IF C" />
        <div>
          <div class="sb-title">Articol Științific</div>
          <div class="sb-subtitle">Validare Empirică R IF C</div>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="sb-progress">
      <div class="sb-progress-label">
        <span>Progres Total</span>
        <span class="pct" id="pct-text">0%</span>
      </div>
      <div class="sb-bar"><div class="sb-bar-fill" id="bar-fill" style="width:0%"></div></div>
      <div class="sb-progress-stats">
        <span id="stats-text">0/42 sarcini</span>
        <span>12 etape</span>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="sb-actions">
      <button class="sb-btn green" id="btn-articol" onclick="navigateTo('articol')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        ARTICOL
      </button>
      <button class="sb-btn red" id="btn-sondaj" onclick="navigateTo('sondaj')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>
        SONDAJ ADMIN
      </button>
    </div>

    <!-- ETAPE nav -->
    <div class="sb-nav" id="stages-nav"></div>
  </div>

  <!-- MAIN -->
  <div class="main-area">
    <div class="page-view active" id="view-overview">
      <div class="ov">
        <h1>Studiu de Validare R+(I×F)=C</h1>
        <p class="lead">Plan de cercetare cu 12 etape și 42 de sarcini concrete. Conținutul de pe rifcmarketing.com alimentează direct cercetarea.</p>
        <div class="ov-card"><h3>ARTICOL</h3><p>Manuscrisul final OSF — structura completă a articolului științific.</p></div>
        <div class="ov-card"><h3>SONDAJ ADMIN</h3><p>Administrare sondaj — răspunsuri, statistici, export date.</p></div>
      </div>
    </div>
    <div class="page-view" id="view-articol"><div class="iframe-container"><iframe id="iframe-articol" src="about:blank" title="Articol OSF"></iframe></div></div>
    <div class="page-view" id="view-sondaj"><div class="iframe-container"><iframe id="iframe-sondaj" src="about:blank" title="Sondaj Admin"></iframe></div></div>
  </div>
</div>

</body>
</html>`;

const ROADMAP_SCRIPT = `
(function() {
  "use strict";

  var ACCESS_CODE = "RIFC2026";
  var STORAGE_KEY = "rifc-articol-access";
  var TASKS_KEY = "rifc-tasks-v3";
  var currentView = "overview";
  var activeStageId = null;
  var checkedTasks = {};

  // ═══ STAGES DATA ═══
  var STAGES = [
    { id:"s0", num:"00", name:"Audit Resurse Site", site:true, separate:true, tasks:[
      "Extragere & catalogare conținut site",
      "Export AI Audit & Calculator ca instrumente",
      "Documentare White Paper existent"
    ]},
    { id:"s1", num:"01", name:"Fundamentare Teoretică", site:true, tasks:[
      "Reformulare academică a definițiilor R, I, F, C",
      "Formalizarea matematică a ecuației R+(I×F)=C",
      "Justificarea Porții Relevanței (R < 3 = eșec)",
      "Literature Review — reformulare comparații",
      "Pre-registration OSF.io"
    ]},
    { id:"s2", num:"02", name:"Dezvoltare Scală", site:true, tasks:[
      "Transformare sub-factori → itemi Likert",
      "Formalizare Conversie Likert → Scoring",
      "Construire Scoring Rubric standardizat",
      "Panel de experți (15–20 persoane)",
      "Interviuri cognitive (10–15 utilizatori)",
      "Inter-Rater Reliability (2 evaluatori independenți)",
      "Etică & Consimțământ",
      "Traducere & Validare trilingvă (RO / EN / RU)"
    ]},
    { id:"s2b", num:"2B", name:"Pilot Study", tasks:[
      "Test Instrument (10–15 evaluatori, 5–10 stimuli)",
      "Verificare timp, claritate, probleme",
      "Design Attention Checks",
      "Ajustări finale pre-colectare"
    ]},
    { id:"s3", num:"03", name:"Colectare Date & EFA", site:true, tasks:[
      "Set Stimuli (10 canale × 3 variante = 30 mesaje)",
      "Eșantion Experți N=250–350",
      "Exploratory Factor Analysis (EFA)"
    ]},
    { id:"s3b", num:"3B", name:"Studiu Consumatori (Stratul 2)", site:true, tasks:[
      "Design: 10 canale × 3 variante × 5 întrebări",
      "Eșantion Consumatori N=1.000–3.000",
      "Segmentare: demografie + comportament + psihografie",
      "Implementare randomizare Latin Square"
    ]},
    { id:"s4", num:"04", name:"CFA & Model Comparison", tasks:[
      "Colectare eșantion nou N=300–500",
      "CFA — Confirmatory Factor Analysis",
      "TESTUL CENTRAL: Additive vs Multiplicative",
      "Testul Porții Relevanței (Threshold R < 3)",
      "Robustness Checks (cross-canal, cross-industrie)"
    ]},
    { id:"s4b", num:"4B", name:"Scoring AI (Stratul 3)", site:true, tasks:[
      "Configurare prompt AI standardizat",
      "Comparație AI vs Human (ICC, Bland-Altman)",
      "Analiză bias și calibrare AI"
    ]},
    { id:"s5", num:"05", name:"Validare Predictivă", site:true, tasks:[
      "Colectare KPI-uri reale (30–50 campanii)",
      "Known-Groups Validity (via Arhetipuri)",
      "Validare Convergentă / Discriminantă",
      "Inter-Rater Reliability (confirmare finală)",
      "Study 5: AI vs Human Agreement"
    ]},
    { id:"s5b", num:"5B", name:"Focus Grupuri Calitative (Stratul 4)", tasks:[
      "Recrutare și compunere grupuri",
      "Ghid de discuție semi-structurat",
      "Conducere sesiuni și transcriere",
      "Analiză tematică Braun & Clarke"
    ]},
    { id:"s6", num:"06", name:"Scriere & Submisie", tasks:[
      "Introduction + Literature Review",
      "Framework + Methodology + Results",
      "Discussion + Conclusion + AI Declaration",
      "Citarea site-ului în paper",
      "Review intern + Formatare + Submisie"
    ]}
  ];

  // ═══ PERSISTENCE ═══
  try { checkedTasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "{}"); } catch(e) {}
  function saveTasks() { try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(e) {} }

  function getTaskKey(stageId, taskIdx) { return stageId + "-" + taskIdx; }

  function getProgress() {
    var total = 0, done = 0;
    STAGES.forEach(function(s) {
      s.tasks.forEach(function(t, i) {
        total++;
        if (checkedTasks[getTaskKey(s.id, i)]) done++;
      });
    });
    var pct = total > 0 ? Math.round(done / total * 100) : 0;
    return { total: total, done: done, pct: pct };
  }

  function getStageDone(s) {
    var done = 0;
    s.tasks.forEach(function(t, i) { if (checkedTasks[getTaskKey(s.id, i)]) done++; });
    return done;
  }

  // ═══ RENDER SIDEBAR NAV ═══
  function renderNav() {
    var nav = document.getElementById("stages-nav");
    if (!nav) return;
    var html = '<div class="sb-nav-title">Etape — Studiu de Validare</div>';

    STAGES.forEach(function(s, idx) {
      var sDone = getStageDone(s);
      var sTotal = s.tasks.length;
      var allDone = sTotal > 0 && sDone === sTotal;
      var isActive = activeStageId === s.id;
      var isOpen = isActive;

      // Separator before main stages (after s0)
      if (s.separate) {
        html += '<div style="padding:0 14px;margin-bottom:2px;"><span style="font-size:8px;color:var(--text3);font-style:italic;">Pregătire internă</span></div>';
      }
      if (idx === 1) {
        html += '<div class="sb-separator"></div>';
      }

      html += '<div class="sb-stage">';
      html += '<button class="sb-stage-btn' + (isActive ? ' active' : '') + (allDone ? ' done' : '') + '" data-stage="' + s.id + '">';
      html += '<div class="sb-stage-num">' + s.num + '</div>';
      html += '<div class="sb-stage-name">' + s.name + '</div>';
      html += '<span class="sb-stage-count">' + sDone + '/' + sTotal + '</span>';
      if (s.site) html += '<span class="sb-site-tag">SITE</span>';
      html += '</button>';

      // Sub-tasks
      html += '<div class="sb-tasks' + (isOpen ? ' open' : '') + '">';
      s.tasks.forEach(function(t, ti) {
        var key = getTaskKey(s.id, ti);
        var isDone = !!checkedTasks[key];
        html += '<div class="sb-task' + (isDone ? ' done' : '') + '" data-stage="' + s.id + '" data-task="' + ti + '">';
        html += '<div class="sb-task-check' + (isDone ? ' checked' : '') + '"></div>';
        html += '<span class="sb-task-name">' + t + '</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    nav.innerHTML = html;
    bindNavEvents();
    updateProgress();
  }

  function updateProgress() {
    var p = getProgress();
    var pctEl = document.getElementById("pct-text");
    var barEl = document.getElementById("bar-fill");
    var statsEl = document.getElementById("stats-text");
    if (pctEl) pctEl.textContent = p.pct + "%";
    if (barEl) barEl.style.width = p.pct + "%";
    if (statsEl) statsEl.textContent = p.done + "/" + p.total + " sarcini";
  }

  function bindNavEvents() {
    // Stage buttons — toggle expand
    document.querySelectorAll(".sb-stage-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var sid = btn.getAttribute("data-stage");
        if (activeStageId === sid) {
          activeStageId = null;
        } else {
          activeStageId = sid;
        }
        renderNav();
      });
    });

    // Task checkboxes
    document.querySelectorAll(".sb-task").forEach(function(task) {
      task.addEventListener("click", function() {
        var sid = task.getAttribute("data-stage");
        var tid = parseInt(task.getAttribute("data-task"), 10);
        var key = getTaskKey(sid, tid);
        checkedTasks[key] = !checkedTasks[key];
        saveTasks();
        renderNav();
      });
    });
  }

  // ═══ ACCESS ═══
  function initAccess() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved === ACCESS_CODE) { grantAccess(); }
    var input = document.getElementById("access-input");
    if (input) { input.addEventListener("keydown", function(e) { if (e.key === "Enter") checkAccess(); }); }
  }

  window.checkAccess = function() {
    var input = document.getElementById("access-input");
    var errorEl = document.getElementById("access-error");
    if (!input) return;
    if (input.value.trim() === ACCESS_CODE) {
      try { localStorage.setItem(STORAGE_KEY, ACCESS_CODE); } catch(e) {}
      grantAccess();
    } else {
      if (errorEl) errorEl.textContent = "Cod incorect.";
      input.value = ""; input.focus();
    }
  };

  function grantAccess() {
    var gate = document.getElementById("access-gate");
    var app = document.getElementById("app");
    if (gate) gate.style.display = "none";
    if (app) app.style.display = "block";
    renderNav();
    detectRouteFromParent();
  }

  // ═══ NAVIGATION ═══
  window.navigateTo = function(view) {
    if (view === currentView) return;
    currentView = view;
    updateViews(); updateButtons(); updateParentUrl(view); loadIframeIfNeeded(view);
  };

  function updateViews() {
    document.querySelectorAll(".page-view").forEach(function(v) { v.classList.remove("active"); });
    var t = document.getElementById("view-" + currentView);
    if (t) t.classList.add("active");
  }

  function updateButtons() {
    var a = document.getElementById("btn-articol");
    var s = document.getElementById("btn-sondaj");
    if (a) a.classList.toggle("active", currentView === "articol");
    if (s) s.classList.toggle("active", currentView === "sondaj");
  }

  function loadIframeIfNeeded(view) {
    if (view === "articol") {
      var f = document.getElementById("iframe-articol");
      if (f && (!f.src || f.src === "about:blank" || f.src.indexOf("/osf") === -1)) f.src = "/articolstiintific/osf";
    } else if (view === "sondaj") {
      var f2 = document.getElementById("iframe-sondaj");
      if (f2 && (!f2.src || f2.src === "about:blank" || f2.src.indexOf("/sondaj") === -1)) f2.src = "/articolstiintific/sondaj";
    }
  }

  function updateParentUrl(view) {
    try {
      var p = window.parent || window;
      var base = "/articolstiintific";
      var path = view === "articol" ? base + "/osf" : view === "sondaj" ? base + "/sondaj" : base;
      if (p.history && p.history.pushState) p.history.pushState({view: view}, "", path);
    } catch(e) {}
  }

  function detectRouteFromParent() {
    try {
      var pp = ""; try { pp = window.parent.location.pathname; } catch(e) { pp = window.location.pathname; }
      if (pp.indexOf("/osf") !== -1) currentView = "articol";
      else if (pp.indexOf("/sondaj") !== -1) currentView = "sondaj";
      else currentView = "overview";
      updateViews(); updateButtons(); loadIframeIfNeeded(currentView);
    } catch(e) {}
  }

  // ═══ INIT ═══
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initAccess);
  else initAccess();
})();
`;

export default function ArticolStiintificPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(ROADMAP_HTML);
    doc.close();
    const script = doc.createElement("script");
    script.textContent = ROADMAP_SCRIPT;
    doc.body.appendChild(script);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="R IF C — Articol Științific"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
