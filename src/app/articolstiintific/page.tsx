"use client";

import { useRef, useEffect } from "react";

// ============================================================
// R IF C — Articol Științific v2 (clean rewrite)
// Structure: ROADMAP_HTML (CSS + HTML) + ROADMAP_SCRIPT (JS)
// Access code: RIFC2026 (stored in localStorage 'rifc-articol-access')
// ============================================================

const ROADMAP_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>R IF C — Articol Științific v2</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #FAFAFA;
    --surface: #FFFFFF;
    --surface2: #F5F5F5;
    --border: #E5E5E5;
    --text: #171717;
    --text2: #525252;
    --text3: #A3A3A3;
    --red: #DC2626;
    --green: #059669;
    --amber: #D97706;
    --sidebar-w: 280px;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.5;
    overflow: hidden;
    height: 100vh;
  }

  /* ===== ACCESS GATE ===== */
  #access-gate {
    position: fixed;
    inset: 0;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .access-box {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 40px;
    width: 380px;
    text-align: center;
  }

  .access-box h2 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 6px;
    color: var(--text);
  }

  .access-box p {
    font-size: 13px;
    color: var(--text2);
    margin-bottom: 24px;
  }

  .access-box input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    text-align: center;
    letter-spacing: 3px;
    outline: none;
    transition: border-color 0.2s;
  }

  .access-box input:focus {
    border-color: var(--green);
  }

  .access-box .error-msg {
    color: var(--red);
    font-size: 12px;
    margin-top: 8px;
    min-height: 18px;
  }

  .access-box button {
    margin-top: 16px;
    width: 100%;
    padding: 10px;
    background: var(--green);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .access-box button:hover { opacity: 0.9; }

  /* ===== APP LAYOUT ===== */
  #app {
    display: none;
    height: 100vh;
  }

  /* ===== SIDEBAR ===== */
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    z-index: 100;
    overflow-y: auto;
  }

  .sidebar-header {
    padding: 20px 16px 16px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .sidebar-logo-row img {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    object-fit: contain;
  }

  .sidebar-logo-text {
    display: flex;
    flex-direction: column;
  }

  .sidebar-logo-text .title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text);
    line-height: 1.2;
  }

  .sidebar-logo-text .subtitle {
    font-size: 11px;
    color: var(--text3);
    line-height: 1.3;
  }

  .version-badge {
    display: inline-block;
    margin-top: 8px;
    padding: 2px 8px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: var(--text3);
  }

  /* ===== SIDEBAR BUTTONS ===== */
  .sidebar-actions {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sidebar-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: none;
    border-radius: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s, background 0.15s;
    color: #fff;
    width: 100%;
    text-align: left;
  }

  .sidebar-btn:hover { opacity: 0.9; }

  .sidebar-btn.active {
    box-shadow: inset 0 0 0 2px rgba(0,0,0,0.15);
  }

  .sidebar-btn.green { background: var(--green); }
  .sidebar-btn.red { background: var(--red); }

  .sidebar-btn svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  /* ===== NAV SECTION (placeholder for future menu) ===== */
  .nav-section {
    padding: 16px;
    flex: 1;
  }

  .nav-section-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text3);
    margin-bottom: 12px;
  }

  .nav-placeholder {
    padding: 16px;
    background: var(--surface2);
    border: 1px dashed var(--border);
    border-radius: 8px;
    text-align: center;
  }

  .nav-placeholder p {
    font-size: 12px;
    color: var(--text3);
    line-height: 1.5;
  }

  /* ===== MAIN AREA ===== */
  .main-area {
    margin-left: var(--sidebar-w);
    height: 100vh;
    overflow: hidden;
    background: var(--bg);
  }

  /* ===== OVERVIEW (welcome) ===== */
  .overview-content {
    padding: 40px;
    max-width: 720px;
    overflow-y: auto;
    height: 100%;
  }

  .overview-content h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .overview-content .lead {
    font-size: 15px;
    color: var(--text2);
    margin-bottom: 32px;
    line-height: 1.6;
  }

  .overview-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 12px;
  }

  .overview-card h3 {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 6px;
  }

  .overview-card p {
    font-size: 13px;
    color: var(--text2);
    line-height: 1.5;
  }

  /* ===== IFRAME CONTAINER ===== */
  .iframe-container {
    width: 100%;
    height: 100%;
  }

  .iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* ===== PAGE VIEWS ===== */
  .page-view {
    display: none;
    height: 100%;
  }

  .page-view.active {
    display: block;
  }
</style>
</head>
<body>

<!-- ACCESS GATE -->
<div id="access-gate">
  <div class="access-box">
    <h2>Acces Restricționat</h2>
    <p>Introduceți codul de acces pentru a continua</p>
    <input type="text" id="access-input" placeholder="COD ACCES" maxlength="20" autocomplete="off" />
    <div class="error-msg" id="access-error"></div>
    <button onclick="checkAccess()">Verifică</button>
  </div>
</div>

<!-- APP -->
<div id="app">
  <!-- SIDEBAR -->
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo-row">
        <img src="/rifc-logo-black.png" alt="R IF C" />
        <div class="sidebar-logo-text">
          <span class="title">Articol Științific</span>
          <span class="subtitle">R IF C Marketing</span>
        </div>
      </div>
      <span class="version-badge">v2.0</span>
    </div>

    <div class="sidebar-actions">
      <button class="sidebar-btn green" id="btn-articol" onclick="navigateTo('articol')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        ARTICOL
      </button>
      <button class="sidebar-btn red" id="btn-sondaj" onclick="navigateTo('sondaj')">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
          <path d="M9 14l2 2 4-4"/>
        </svg>
        SONDAJ ADMIN
      </button>
    </div>

    <div class="nav-section">
      <div class="nav-section-label">Navigare</div>
      <div class="nav-placeholder">
        <p>Meniu va fi reconstruit</p>
      </div>
    </div>
  </div>

  <!-- MAIN AREA -->
  <div class="main-area">
    <!-- Overview / Welcome -->
    <div class="page-view active" id="view-overview">
      <div class="overview-content">
        <h1>Articol Științific — R IF C</h1>
        <p class="lead">
          Bine ai venit în spațiul de lucru pentru articolul științific.
          Selectează o opțiune din bara laterală pentru a continua.
        </p>
        <div class="overview-card">
          <h3>ARTICOL</h3>
          <p>Deschide manuscrisul final OSF cu structura completă a articolului științific.</p>
        </div>
        <div class="overview-card">
          <h3>SONDAJ ADMIN</h3>
          <p>Administrare sondaj — vizualizare răspunsuri, statistici și export date.</p>
        </div>
      </div>
    </div>

    <!-- Articol (iframe to /articolstiintific/osf) -->
    <div class="page-view" id="view-articol">
      <div class="iframe-container">
        <iframe id="iframe-articol" src="about:blank" title="Articol OSF"></iframe>
      </div>
    </div>

    <!-- Sondaj (iframe to /articolstiintific/sondaj) -->
    <div class="page-view" id="view-sondaj">
      <div class="iframe-container">
        <iframe id="iframe-sondaj" src="about:blank" title="Sondaj Admin"></iframe>
      </div>
    </div>
  </div>
</div>

</body>
</html>`;

const ROADMAP_SCRIPT = `
(function() {
  "use strict";

  var ACCESS_CODE = "RIFC2026";
  var STORAGE_KEY = "rifc-articol-access";
  var currentView = "overview";

  // --- Access Gate ---
  function initAccess() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved === ACCESS_CODE) {
      grantAccess();
    }
    var input = document.getElementById("access-input");
    if (input) {
      input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") checkAccess();
      });
    }
  }

  window.checkAccess = function() {
    var input = document.getElementById("access-input");
    var errorEl = document.getElementById("access-error");
    if (!input) return;
    var val = input.value.trim();
    if (val === ACCESS_CODE) {
      try { localStorage.setItem(STORAGE_KEY, ACCESS_CODE); } catch(e) {}
      grantAccess();
    } else {
      if (errorEl) errorEl.textContent = "Cod incorect. Încercați din nou.";
      input.value = "";
      input.focus();
    }
  };

  function grantAccess() {
    var gate = document.getElementById("access-gate");
    var app = document.getElementById("app");
    if (gate) gate.style.display = "none";
    if (app) app.style.display = "block";
    detectRouteFromParent();
  }

  // --- Navigation ---
  window.navigateTo = function(view) {
    if (view === currentView) return;
    currentView = view;
    updateViews();
    updateButtons();
    updateParentUrl(view);
    loadIframeIfNeeded(view);
  };

  function updateViews() {
    var views = document.querySelectorAll(".page-view");
    for (var i = 0; i < views.length; i++) {
      views[i].classList.remove("active");
    }
    var target = document.getElementById("view-" + currentView);
    if (target) target.classList.add("active");
  }

  function updateButtons() {
    var btnArticol = document.getElementById("btn-articol");
    var btnSondaj = document.getElementById("btn-sondaj");
    if (btnArticol) btnArticol.classList.toggle("active", currentView === "articol");
    if (btnSondaj) btnSondaj.classList.toggle("active", currentView === "sondaj");
  }

  function loadIframeIfNeeded(view) {
    if (view === "articol") {
      var iframeA = document.getElementById("iframe-articol");
      if (iframeA && (iframeA.src === "about:blank" || !iframeA.src || iframeA.src.indexOf("/articolstiintific/osf") === -1)) {
        iframeA.src = "/articolstiintific/osf";
      }
    } else if (view === "sondaj") {
      var iframeS = document.getElementById("iframe-sondaj");
      if (iframeS && (iframeS.src === "about:blank" || !iframeS.src || iframeS.src.indexOf("/articolstiintific/sondaj") === -1)) {
        iframeS.src = "/articolstiintific/sondaj";
      }
    }
  }

  // --- URL Routing ---
  function updateParentUrl(view) {
    try {
      var parentWin = window.parent || window;
      var basePath = "/articolstiintific";
      var newPath = basePath;
      if (view === "articol") newPath = basePath + "/osf";
      else if (view === "sondaj") newPath = basePath + "/sondaj";
      else newPath = basePath;
      if (parentWin.history && parentWin.history.pushState) {
        parentWin.history.pushState({view: view}, "", newPath);
      }
    } catch(e) {
      // cross-origin or other error — ignore
    }
  }

  function detectRouteFromParent() {
    try {
      var parentPath = "";
      try {
        parentPath = window.parent.location.pathname;
      } catch(e) {
        parentPath = window.location.pathname;
      }
      if (parentPath.indexOf("/articolstiintific/osf") !== -1) {
        currentView = "articol";
      } else if (parentPath.indexOf("/articolstiintific/sondaj") !== -1) {
        currentView = "sondaj";
      } else {
        currentView = "overview";
      }
      updateViews();
      updateButtons();
      loadIframeIfNeeded(currentView);
    } catch(e) {
      // ignore
    }
  }

  // --- Init ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAccess);
  } else {
    initAccess();
  }
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
      title="R IF C — Articol Științific v2"
      style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
    />
  );
}
