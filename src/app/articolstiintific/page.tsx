"use client";

import { useEffect, useRef } from "react";

const ROADMAP_HTML = `<!DOCTYPE html>
<html lang="ro">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>R IF C — Roadmap Articol Științific v2</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg: #f8f9fa;
  --surface: #ffffff;
  --surface2: #f1f3f5;
  --surface3: #e9ecef;
  --border: #dee2e6;
  --border2: #ced4da;
  --text: #1a1a2e;
  --text2: #495057;
  --text3: #868e96;
  --red: #dc2626;
  --red-dim: #dc262612;
  --blue: #2563eb;
  --blue-dim: #2563eb12;
  --green: #059669;
  --green-dim: #059669aa;
  --green-dim2: #05966915;
  --amber: #d97706;
  --amber-dim: #d9770612;
  --violet: #7c3aed;
  --violet-dim: #7c3aed12;
  --cyan: #0891b2;
  --cyan-dim: #0891b212;
  --pink: #db2777;
  --pink-dim: #db277712;
}
* { margin:0; padding:0; box-sizing:border-box; }
html, body { height:100%; }
body { background:var(--bg); color:var(--text); font-family:'Outfit',sans-serif; overflow-x:hidden; }
::selection { background:var(--red); color:#fff; }
::-webkit-scrollbar { width:6px; }
::-webkit-scrollbar-track { background:var(--surface2); }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }

.app { display:flex; min-height:100vh; }

.sidebar { width:290px; background:var(--surface); border-right:1px solid var(--border); position:fixed; top:0; left:0; height:100vh; overflow-y:auto; z-index:100; display:flex; flex-direction:column; }
.sidebar-header { padding:24px 20px 16px; border-bottom:1px solid var(--border); }
.sidebar-header .logo { font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--red); letter-spacing:3px; font-weight:700; }
.sidebar-header h2 { font-size:14px; font-weight:600; color:var(--text); margin-top:6px; line-height:1.4; }
.sidebar-header p { font-size:11px; color:var(--text3); margin-top:4px; }
.sidebar-header .version { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--green); margin-top:6px; padding:3px 8px; background:var(--green-dim2); border-radius:4px; display:inline-block; }

.nav-section { padding:12px 12px 4px; }
.nav-section-label { font-size:10px; letter-spacing:2px; color:var(--text3); font-weight:600; padding:8px 8px 6px; text-transform:uppercase; }
.nav-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; cursor:pointer; transition:all .2s; font-size:13px; font-weight:400; color:var(--text2); position:relative; margin-bottom:2px; }
.nav-item:hover { background:var(--surface2); color:var(--text); }
.nav-item.active { background:var(--red-dim); color:var(--red); font-weight:600; }
.nav-item .num { font-family:'JetBrains Mono',monospace; font-size:11px; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border-radius:6px; background:var(--surface3); color:var(--text3); flex-shrink:0; font-weight:600; }
.nav-item.active .num { background:var(--red); color:#fff; }
.nav-item.completed .num { background:var(--green-dim2); color:var(--green); }
.nav-item .check { position:absolute; right:12px; font-size:10px; color:var(--green); opacity:0; }
.nav-item.completed .check { opacity:1; }
.nav-item .site-badge { font-size:8px; padding:1px 5px; border-radius:3px; background:var(--pink-dim); color:var(--pink); font-weight:700; letter-spacing:.5px; margin-left:auto; margin-right:24px; }

.progress-bar { margin:16px 20px; padding:12px; background:var(--surface2); border-radius:8px; border:1px solid var(--border); }
.progress-bar .label { font-size:10px; color:var(--text3); letter-spacing:1px; font-weight:600; }
.progress-bar .bar { height:4px; background:var(--surface3); border-radius:2px; margin-top:8px; overflow:hidden; }
.progress-bar .fill { height:100%; background:linear-gradient(90deg, var(--red), var(--amber)); border-radius:2px; transition:width .6s ease; }
.progress-bar .stats { display:flex; justify-content:space-between; margin-top:6px; font-size:11px; color:var(--text3); }

.main { margin-left:290px; flex:1; min-height:100vh; }
.main-header { padding:24px 40px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.92); position:sticky; top:0; z-index:50; backdrop-filter:blur(20px); }
.main-header h1 { font-size:20px; font-weight:700; }
.main-header .subtitle { font-size:12px; color:var(--text3); margin-top:2px; }

.content { padding:32px 40px 80px; max-width:960px; }

.stage-header { margin-bottom:32px; }
.stage-label { font-family:'JetBrains Mono',monospace; font-size:11px; letter-spacing:3px; font-weight:700; margin-bottom:6px; }
.stage-title { font-size:28px; font-weight:800; line-height:1.2; margin-bottom:8px; }
.stage-desc { font-size:14px; color:var(--text2); line-height:1.6; max-width:640px; }
.stage-meta { display:flex; gap:10px; margin-top:16px; flex-wrap:wrap; }
.stage-meta .tag { font-size:11px; padding:4px 10px; border-radius:20px; font-weight:600; }

.site-map { background:var(--surface); border:1px solid var(--pink); border-radius:12px; padding:20px; margin-bottom:24px; position:relative; overflow:hidden; }
.site-map::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg, var(--pink), var(--violet)); }
.site-map .sm-title { font-size:11px; letter-spacing:2px; font-weight:700; color:var(--pink); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
.site-map .sm-title .globe { font-size:14px; }
.sm-items { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
.sm-item { display:flex; align-items:flex-start; gap:8px; font-size:12px; color:var(--text2); padding:8px 10px; background:var(--surface2); border-radius:6px; }
.sm-item .arrow { color:var(--pink); font-family:'JetBrains Mono',monospace; flex-shrink:0; font-size:11px; margin-top:1px; }
.sm-item .from { color:var(--text3); }
.sm-item .to { color:var(--text); font-weight:500; }
.sm-item.ready { border-left:2px solid var(--green); }
.sm-item.partial { border-left:2px solid var(--amber); }

.task-group { margin-bottom:32px; }
.task-group-title { font-size:13px; font-weight:700; letter-spacing:1px; color:var(--text3); text-transform:uppercase; margin-bottom:12px; padding-left:4px; }
.task { background:var(--surface); border:1px solid var(--border); border-radius:12px; margin-bottom:8px; overflow:hidden; transition:all .25s; }
.task:hover { border-color:var(--border2); }
.task.has-site { border-left:3px solid var(--pink); }
.task-header { display:flex; align-items:center; gap:12px; padding:16px 20px; cursor:pointer; }
.task-checkbox { width:20px; height:20px; border:2px solid var(--border2); border-radius:5px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all .2s; cursor:pointer; font-size:11px; color:transparent; }
.task-checkbox.checked { background:var(--green); border-color:var(--green); color:#fff; }
.task-header .title { font-size:14px; font-weight:500; flex:1; }
.task-header .badges { display:flex; gap:6px; align-items:center; }
.task-header .priority { font-size:10px; padding:3px 8px; border-radius:10px; font-weight:700; letter-spacing:.5px; }
.task-header .priority.urgent { background:var(--red-dim); color:var(--red); }
.task-header .priority.high { background:var(--amber-dim); color:var(--amber); }
.task-header .priority.medium { background:var(--blue-dim); color:var(--blue); }
.task-header .priority.low { background:var(--violet-dim); color:var(--violet); }
.task-header .site-tag { font-size:9px; padding:2px 6px; border-radius:8px; background:var(--pink-dim); color:var(--pink); font-weight:700; letter-spacing:.3px; }
.task-header .arrow { color:var(--text3); transition:transform .2s; font-size:12px; }
.task.open .task-header .arrow { transform:rotate(180deg); }
.task-body { display:none; padding:0 20px 20px; }
.task.open .task-body { display:block; }
.task-detail { font-size:13px; color:var(--text2); line-height:1.7; }
.task-detail strong { color:var(--text); }

.deliverable { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:14px 16px; margin-top:12px; }
.deliverable .dlabel { font-size:10px; letter-spacing:2px; font-weight:700; margin-bottom:6px; }
.deliverable .dlabel.output { color:var(--green); }
.deliverable .dlabel.input { color:var(--amber); }
.deliverable .dlabel.standard { color:var(--cyan); }
.deliverable .dlabel.site { color:var(--pink); }
.deliverable .dtext { font-size:12px; color:var(--text2); line-height:1.6; }

.ref-box { background:var(--surface3); border-left:3px solid var(--red); padding:12px 16px; margin-top:12px; border-radius:0 8px 8px 0; }
.ref-box .rlabel { font-size:10px; letter-spacing:1.5px; font-weight:700; color:var(--red); margin-bottom:4px; }
.ref-box .rtext { font-size:11px; color:var(--text3); line-height:1.5; font-family:'JetBrains Mono',monospace; }

.overview-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px; }
.ov-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:20px; }
.ov-card .ov-num { font-family:'JetBrains Mono',monospace; font-size:28px; font-weight:800; }
.ov-card .ov-label { font-size:11px; color:var(--text3); margin-top:4px; letter-spacing:.5px; }

.equation-display { text-align:center; padding:32px; background:var(--surface); border:1px solid var(--border); border-radius:16px; margin:24px 0; }
.equation-display .eq { font-family:'JetBrains Mono',monospace; font-size:24px; font-weight:700; color:var(--red); }
.equation-display .eq-sub { font-size:12px; color:var(--text3); margin-top:8px; }

.timeline-simple { margin-top:20px; }
.tl-item { display:flex; gap:16px; padding:12px 0; border-bottom:1px solid var(--border); }
.tl-item:last-child { border:none; }
.tl-month { font-family:'JetBrains Mono',monospace; font-size:12px; color:var(--red); font-weight:700; width:64px; flex-shrink:0; }
.tl-content { font-size:13px; color:var(--text2); line-height:1.5; }
.tl-content strong { color:var(--text); }

.site-integration-map { margin-top:28px; }
.sim-title { font-size:15px; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
.sim-title .dot { width:8px; height:8px; border-radius:50%; background:var(--pink); }
.sim-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
.sim-card { background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:14px; position:relative; }
.sim-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; border-radius:10px 10px 0 0; }
.sim-card.ready::before { background:var(--green); }
.sim-card.partial::before { background:var(--amber); }
.sim-card.missing::before { background:var(--red); }
.sim-card .sc-chapter { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--text3); letter-spacing:1px; }
.sim-card .sc-name { font-size:13px; font-weight:600; margin-top:4px; }
.sim-card .sc-maps { font-size:11px; color:var(--text3); margin-top:6px; line-height:1.4; }
.sim-card .sc-status { font-size:10px; font-weight:700; margin-top:8px; letter-spacing:.5px; }
.sim-card.ready .sc-status { color:var(--green); }
.sim-card.partial .sc-status { color:var(--amber); }
.sim-card.missing .sc-status { color:var(--red); }

.removed-notice { background:var(--surface2); border:1px dashed var(--border2); border-radius:8px; padding:12px 16px; margin-top:16px; }
.removed-notice .rn-title { font-size:11px; color:var(--text3); font-weight:700; letter-spacing:1px; margin-bottom:4px; }
.removed-notice .rn-text { font-size:12px; color:var(--text3); line-height:1.5; text-decoration:line-through; opacity:.6; }
.removed-notice .rn-reason { font-size:11px; color:var(--amber); margin-top:6px; font-style:italic; }

/* ═══ DATA WORKSPACE ═══ */
.data-workspace { margin-top:16px; padding-top:16px; border-top:1px dashed var(--border2); }
.dw-toggle { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; font-weight:600; letter-spacing:1px; color:var(--blue); padding:6px 0; user-select:none; }
.dw-toggle .dw-arrow { transition:transform .2s; font-size:10px; }
.data-workspace.open .dw-toggle .dw-arrow { transform:rotate(90deg); }
.dw-content { display:none; margin-top:12px; }
.data-workspace.open .dw-content { display:block; }
.dw-badge { font-size:10px; padding:2px 8px; border-radius:10px; background:var(--blue-dim); color:var(--blue); font-weight:700; }
.dw-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.dw-header .dw-title { font-size:11px; letter-spacing:2px; font-weight:700; color:var(--text3); text-transform:uppercase; }
.dw-table { width:100%; border-collapse:collapse; font-size:12px; margin-top:8px; }
.dw-table th { text-align:left; padding:8px 6px; border-bottom:2px solid var(--border); font-size:10px; letter-spacing:1px; color:var(--text3); text-transform:uppercase; font-weight:600; white-space:nowrap; }
.dw-table td { padding:6px; border-bottom:1px solid var(--border); vertical-align:middle; }
.dw-table tr:hover { background:var(--surface2); }
.dw-table tr.dw-edit-row { background:var(--blue-dim); }
.dw-table tr.dw-edit-row td { padding:8px 6px; }
.dw-input { width:100%; padding:6px 8px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text); font-family:'Outfit',sans-serif; font-size:12px; }
.dw-input:focus { border-color:var(--blue); outline:none; box-shadow:0 0 0 2px var(--blue-dim); }
.dw-input.sm { width:70px; text-align:center; }
.dw-input.md { width:120px; }
.dw-select { padding:6px 8px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text); font-family:'Outfit',sans-serif; font-size:12px; cursor:pointer; }
.dw-select:focus { border-color:var(--blue); outline:none; }
.dw-textarea { width:100%; padding:8px 10px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text); font-family:'Outfit',sans-serif; font-size:13px; resize:vertical; min-height:80px; line-height:1.6; }
.dw-textarea:focus { border-color:var(--blue); outline:none; box-shadow:0 0 0 2px var(--blue-dim); }
.dw-btn { padding:5px 12px; border-radius:6px; font-size:11px; font-weight:600; cursor:pointer; border:1px solid var(--border); background:var(--surface2); color:var(--text); transition:all .15s; font-family:'Outfit',sans-serif; }
.dw-btn:hover { background:var(--surface3); }
.dw-btn.primary { background:var(--blue); border-color:var(--blue); color:#fff; }
.dw-btn.primary:hover { opacity:.9; }
.dw-btn.success { background:var(--green); border-color:var(--green); color:#fff; }
.dw-btn.danger { color:var(--red); border-color:transparent; background:var(--red-dim); }
.dw-btn.danger:hover { background:var(--red); color:#fff; }
.dw-btn.xs { padding:3px 8px; font-size:10px; }
.dw-actions { display:flex; gap:6px; margin-top:10px; flex-wrap:wrap; }
.dw-form-row { display:grid; grid-template-columns:160px 1fr; gap:8px; align-items:start; margin-bottom:10px; }
.dw-form-row label { font-size:11px; color:var(--text3); font-weight:600; letter-spacing:.5px; padding-top:7px; }
.dw-kv-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.dw-kv-card { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:12px; }
.dw-kv-card .dw-kv-label { font-size:10px; letter-spacing:1.5px; color:var(--text3); font-weight:600; margin-bottom:6px; text-transform:uppercase; }
.dw-kv-card .dw-kv-val { font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700; color:var(--text); }
.dw-word-count { font-size:10px; color:var(--text3); text-align:right; margin-top:4px; }
.dw-status { font-size:10px; padding:2px 8px; border-radius:10px; font-weight:700; display:inline-block; }
.dw-status.draft { background:var(--amber-dim); color:var(--amber); }
.dw-status.in-progress { background:var(--blue-dim); color:var(--blue); }
.dw-status.complete { background:var(--green-dim2); color:var(--green); }
.dw-empty { text-align:center; padding:24px; color:var(--text3); font-size:13px; }
.dw-empty .dw-empty-icon { font-size:24px; margin-bottom:8px; opacity:.5; }
.dw-row-actions { display:flex; gap:4px; }
.dw-computed { font-family:'JetBrains Mono',monospace; font-weight:700; color:var(--green); background:var(--green-dim2); padding:2px 8px; border-radius:4px; font-size:12px; }
.dw-check { width:16px; height:16px; cursor:pointer; accent-color:var(--green); }
.dw-summary { display:flex; gap:16px; padding:10px 12px; background:var(--surface2); border-radius:8px; margin-bottom:12px; flex-wrap:wrap; }
.dw-summary .dw-sum-item { font-size:11px; color:var(--text3); }
.dw-summary .dw-sum-item strong { color:var(--text); font-family:'JetBrains Mono',monospace; }
.dw-model-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; }
.dw-model-card { background:var(--surface2); border:1px solid var(--border); border-radius:8px; padding:14px; text-align:center; }
.dw-model-card.winner { border-color:var(--green); background:var(--green-dim2); }
.dw-model-card .mc-label { font-size:10px; letter-spacing:2px; font-weight:700; color:var(--text3); margin-bottom:8px; text-transform:uppercase; }
.dw-model-card .mc-val { font-family:'JetBrains Mono',monospace; font-size:14px; font-weight:700; margin-bottom:4px; }
.dw-section-row { display:flex; align-items:center; gap:12px; padding:10px 12px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; margin-bottom:6px; }
.dw-section-row .sr-name { font-size:13px; font-weight:500; flex:1; min-width:150px; }
.dw-section-row .sr-bar { flex:2; height:6px; background:var(--surface3); border-radius:3px; overflow:hidden; }
.dw-section-row .sr-fill { height:100%; border-radius:3px; transition:width .3s; }
.dw-def-block { margin-bottom:16px; padding:12px; background:var(--surface2); border:1px solid var(--border); border-radius:8px; }
.dw-def-block .def-label { font-size:12px; font-weight:700; margin-bottom:8px; display:flex; align-items:center; gap:8px; }
.dw-confirm-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,.4); z-index:999; display:flex; align-items:center; justify-content:center; }
.dw-confirm-box { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:24px; max-width:360px; width:90%; }
.dw-confirm-box h4 { font-size:15px; margin-bottom:8px; }
.dw-confirm-box p { font-size:13px; color:var(--text2); margin-bottom:16px; }
.dw-confirm-actions { display:flex; gap:8px; justify-content:flex-end; }
.dw-export-bar { display:flex; gap:6px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border); }

@media(max-width:768px) {
  .sidebar { display:none; }
  .main { margin-left:0; }
  .content { padding:20px; }
  .overview-grid, .sim-grid { grid-template-columns:1fr; }
  .sm-items { grid-template-columns:1fr; }
  .dw-kv-grid, .dw-model-grid { grid-template-columns:1fr; }
  .dw-form-row { grid-template-columns:1fr; }
  .dw-table { font-size:11px; }
  .dw-table th, .dw-table td { padding:4px 3px; }
}
</style>
</head>
<body>
<div class="app" id="app"></div>
</body>
</html>`;

/* The JS logic is injected via useEffect into the iframe */
const ROADMAP_SCRIPT = `
/* ═══ DATA STORE ═══ */
var DataStore = {
  load: function(stageId) {
    try { return JSON.parse(localStorage.getItem('rifc-data-' + stageId) || 'null'); }
    catch(e) { return null; }
  },
  save: function(stageId, data) {
    try {
      data._lastModified = new Date().toISOString();
      localStorage.setItem('rifc-data-' + stageId, JSON.stringify(data));
    } catch(e) { console.warn('Save failed', e); }
  },
  ensure: function(stageId, defaults) {
    var d = this.load(stageId);
    if (!d) { d = defaults; this.save(stageId, d); }
    return d;
  },
  nextId: function(arr, prefix) {
    var max = 0;
    (arr || []).forEach(function(item) {
      var n = parseInt((item.id || '').replace(prefix + '-', ''), 10);
      if (n > max) max = n;
    });
    var next = max + 1;
    return prefix + '-' + (next < 10 ? '00' : next < 100 ? '0' : '') + next;
  },
  exportAll: function() {
    var result = {};
    ['s0','s1','s2','s3','s4','s5','s6'].forEach(function(sid) {
      var d = DataStore.load(sid);
      if (d) result[sid] = d;
    });
    return JSON.stringify(result, null, 2);
  }
};

var DEFAULTS = {
  s0: { notes: '' },
  s1: { definitions: { R: {text:'',status:'draft'}, I: {text:'',status:'draft'}, F: {text:'',status:'draft'}, C: {text:'',status:'draft'} }, references: [] },
  s2: { likertItems: [], expertPanel: [], cognitiveTests: [] },
  s3: { stimuli: [], respondents: {n:'',meanAge:'',sd:'',sources:''}, efaResults: {kmo:'',bartlettP:'',varianceExplained:'',alphaR:'',alphaI:'',alphaF:'',factorsRetained:''} },
  s4: { respondents: {n:'',demographics:''}, cfaResults: {cfi:'',rmsea:'',srmr:'',ave:'',cr:'',fornellLarcker:'',htmt:''}, modelComparison: {modelA:{r2:'',aic:'',bic:'',p:''},modelB:{r2:'',aic:'',bic:'',p:''},modelC:{r2:'',aic:'',bic:'',p:''}}, thresholdTest: {thresholdR:'',daviesP:'',notes:''} },
  s5: { campaigns: [], interRater: [], aiAudit: [] },
  s6: { sections: {introduction:{words:'',target:2000,status:'not-started'},literatureReview:{words:'',target:3500,status:'not-started'},framework:{words:'',target:2500,status:'not-started'},methodology:{words:'',target:3000,status:'not-started'},results:{words:'',target:4000,status:'not-started'},discussion:{words:'',target:2500,status:'not-started'},conclusion:{words:'',target:800,status:'not-started'}}, submission: {journal:'',date:'',status:'not-submitted',notes:''}, reviewerFeedback: [] }
};

const STAGES = [
  { id:'overview', label:'Vedere de Ansamblu', icon:'\\u25CE', hasSite:false, tasks:[] },
  { id:'s0', label:'Audit Resurse Site', icon:'00', num:0,
    color:'var(--pink)', hasSite:true,
    duration:'Pre-start \\u2014 2-3 zile',
    priority:'INVENTAR',
    description:'Maparea complet\\u0103 a con\\u021Binutului de pe rifcmarketing.com care alimenteaz\\u0103 direct planul de cercetare. Ce e gata, ce necesit\\u0103 reformulare academic\\u0103, ce lipse\\u0219te.',
    tasks:[
      { title:'Extragere & catalogare con\\u021Binut site', priority:'urgent', hasSite:true, dataType:'notes', dataKey:'notes',
        detail:'Treci prin fiecare sec\\u021Biune a site-ului \\u0219i cataloghezi ce con\\u021Binut poate fi folosit direct ca input pentru cercetare.',
        deliverables:[
          { type:'site', label:'GATA PE SITE', text:'\\u2705 Ch03 Anatomia Variabilelor \\u2014 R:7, I:10, F:11, C:7 sub-factori \\u2192 Surs\\u0103 direct\\u0103 pentru generare itemi (Etapa 2)\\n\\u2705 Ch04 Scoring 1-10 cu descriptori per nivel \\u2192 Ancore de scoring pentru evaluatori\\n\\u2705 Ch07 R IF C vs AIDA/RACE/StoryBrand/4Ps \\u2192 Tabel comparativ gata, doar reformulare academic\\u0103\\n\\u2705 Poarta Relevan\\u021Bei \\u2014 ipoteza threshold formulat\\u0103 cu exemple \\u0219i simul\\u0103ri\\n\\u2705 Ch06 Arhetipuri de E\\u0219ec (3 tipuri) \\u2192 Baza pentru Known-Groups Validity\\n\\u2705 Ch09 Studii de Caz (5 cazuri cu scoruri) \\u2192 Pilot data' },
          { type:'input', label:'NECESIT\\u0102 REFORMULARE', text:'\\u26A0\\uFE0F Defini\\u021Biile R, I, F, C \\u2014 sunt descriptive, nu academice. Trebuie rescrise cu baz\\u0103 teoretic\\u0103\\n\\u26A0\\uFE0F Ecua\\u021Bia \\u2014 e prezentat\\u0103 vizual, trebuie formalizat\\u0103 matematic\\n\\u26A0\\uFE0F Sub-factorii \\u2014 sunt liste, trebuie transforma\\u021Bi \\u00EEn itemi Likert' },
          { type:'output', label:'LIVRABIL', text:'Document "Site-to-Paper Mapping" \\u2014 tabel cu: sec\\u021Biune site | con\\u021Binut | etapa cercetare | ac\\u021Biune (folosit direct / reformulat / \\u00EEnlocuit cu date noi).' }
        ]
      },
      { title:'Export AI Audit & Calculator ca instrumente', priority:'high', hasSite:true,
        detail:'Paginile /audit \\u0219i /calculator de pe site pot fi folosite ca <strong>instrumente de cercetare</strong>. AI Audit-ul poate genera scoruri automatizate care se compar\\u0103 cu scorurile manuale ale evaluatorilor umani.',
        deliverables:[
          { type:'site', label:'DE PE SITE', text:'\\u2705 /audit \\u2014 AI scoring automat al mesajelor \\u2192 Studiu suplimentar: AI vs Human rater agreement\\n\\u2705 /calculator \\u2014 simulator interactiv R IF C \\u2192 Instrument standardizat de scoring\\n\\u2705 Diagnostic Omnichannel (17 canale) \\u2192 Demonstreaz\\u0103 generalizabilitatea cross-canal' },
          { type:'output', label:'LIVRABIL', text:'Decizie: includem un Study 5 (op\\u021Bional) care compar\\u0103 scoruri AI audit vs scoruri evaluatori umani? Dac\\u0103 da, asta e o contribu\\u021Bie suplimentar\\u0103 rar\\u0103 \\u00EEn literature.' }
        ]
      },
      { title:'Documentare White Paper existent', priority:'medium', hasSite:true,
        detail:'Site-ul men\\u021Bioneaz\\u0103 un White Paper de 84 pagini. Acesta trebuie catalogat ca document fondator \\u2014 articolul \\u0219tiin\\u021Bific \\u00EEl <strong>valideaz\\u0103 empiric</strong>, nu \\u00EEl repet\\u0103.',
        deliverables:[
          { type:'site', label:'DE PE SITE', text:'\\u2705 White Paper "Codul Surs\\u0103" \\u2014 84 pagini, filozofie + metodologie + 35 exemple diagnostic\\n\\u2705 PDF rifc-marketing-complet.pdf \\u2014 30 pagini, versiunea condensat\\u0103' },
          { type:'output', label:'LIVRABIL', text:'Pozi\\u021Bionare: White Paper = documentul practitioner (gray literature). Paper-ul academic = validarea empiric\\u0103 a framework-ului prezentat \\u00EEn White Paper. Le citezi pe am\\u00E2ndou\\u0103.' }
        ]
      }
    ]
  },
  { id:'s1', label:'Fundamentare Teoretic\\u0103', icon:'01', num:1, color:'var(--red)', hasSite:true, duration:'Luna 1 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 1-3', priority:'FUNDAMENT', description:'Stabilirea bazei teoretice. Site-ul furnizeaz\\u0103 con\\u021Binutu brut \\u2014 \\u00EEl transform\\u0103m \\u00EEn limbaj academic cu referin\\u021Be peer-reviewed.', siteMap:[ { from:'Ch01 Filozofia', to:'Section 1: Introduction \\u2014 "Clarity as prerequisite"', status:'partial' }, { from:'Ch02 Ecua\\u021Bia', to:'Section 3.2: Mathematical specification', status:'partial' }, { from:'Ch03 Anatomia (28 sub-factori)', to:'Section 3.1: Construct definitions', status:'ready' }, { from:'Ch07 R IF C vs Altele', to:'Section 2.1: Literature review gap analysis', status:'ready' } ], tasks:[ { title:'Reformulare academic\\u0103 a defini\\u021Biilor R, I, F, C', priority:'urgent', hasSite:true, dataType:'definitions', dataKey:'definitions', detail:'Con\\u021Binutul de pe Ch01 + Ch02 + Ch03 al site-ului con\\u021Bine defini\\u021Biile \\u2014 dar sunt scrise pentru marketeri, nu pentru revieweri academici. Trebuie rescrise cu formatul: <strong>defini\\u021Bie conceptual\\u0103 + defini\\u021Bie opera\\u021Bional\\u0103 + baz\\u0103 teoretic\\u0103 + distinc\\u021Bie fa\\u021B\\u0103 de constructe similare.</strong>', deliverables:[ { type:'site', label:'INPUT GATA DE PE SITE', text:'\\u2705 Ch03 Anatomia Variabilelor \\u2014 toate sub-factorii sunt deja lista\\u021Bi\\n\\u2705 Ch02 Ecua\\u021Bia \\u2014 metafora "construc\\u021Bie" (Funda\\u021Bia, Structura, Arhitectura, Valoarea)\\n\\u2705 Ch01 Filozofia \\u2014 "Economia Cognitiv\\u0103", "Eliminarea Anxiet\\u0103\\u021Bii", "Ireversibilitatea Ac\\u021Biunii"' }, { type:'output', label:'LIVRABIL', text:'Defini\\u021Biile formale ale fiec\\u0103rui construct conform APA. ~1.500 cuvinte. Cu referin\\u021Be: ELM (Petty & Cacioppo), Cognitive Load Theory (Sweller), Banner Blindness (Benway & Lane).' }, { type:'standard', label:'STANDARD', text:'Parasuraman et al. (1988) \\u2014 model de referin\\u021B\\u0103 pentru definirea constructelor. Churchill (1979) \\u2014 paradigma de scale development.' } ] }, { title:'Formalizarea matematic\\u0103 a ecua\\u021Biei', priority:'urgent', hasSite:true, dataType:'notes', dataKey:'equationNotes', detail:'Ecua\\u021Bia e pe site ca "R + (I \\u00D7 F) = C" cu explica\\u021Bii vizuale. Pentru paper, trebuie: nota\\u021Bie formal\\u0103, justificarea domeniului (1-110), explicarea termenului multiplicativ, \\u0219i compararea cu modele additive.', deliverables:[ { type:'site', label:'INPUT GATA DE PE SITE', text:'\\u2705 Ecua\\u021Bia cu scoring 0-110\\n\\u2705 Explica\\u021Bia "De ce I \\u00D7 F" de pe Ch02 (Forma amplific\\u0103, nu adaug\\u0103)\\n\\u2705 Exemplele numerice: 10\\u00D72=20 vs 10\\u00D79=90\\n\\u2705 Tabelul scoring: 0-20/21-50/51-80/81-110 cu impact financiar' }, { type:'output', label:'LIVRABIL', text:'Sec\\u021Biune 2.000 cuvinte: formalizare C = R + (I \\u00D7 F), justificarea I\\u00D7F vs I+F cu referin\\u021Be la marketing mix modeling (multiplicative specifications), ELM (forma modereaz\\u0103 procesarea), hybrid models. 15-20 referin\\u021Be.' } ] }, { title:'Justificarea Por\\u021Bii Relevan\\u021Bei', priority:'urgent', hasSite:true, dataType:'notes', dataKey:'gateNotes', detail:'Poarta Relevan\\u021Bei e deja argumentat\\u0103 pe site cu simul\\u0103ri de dezastru (R=2, I=8, F=9 \\u2192 74 pe h\\u00E2rtie, 0 \\u00EEn realitate). Trebuie doar tradus\\u0103 \\u00EEn limbaj academic cu referin\\u021Be la threshold effects.', deliverables:[ { type:'site', label:'INPUT GATA DE PE SITE', text:'\\u2705 Simularea Dezastrului (2 scenarii cu scoruri)\\n\\u2705 Consecin\\u021Be: CTR<0.1%, CPL infinit, Bounce 85%+\\n\\u2705 Compara\\u021Bie R=1/R=2/R=3\\n\\u2705 Exemple reale: hotel f\\u0103r\\u0103 aeroport, veganism la v\\u00E2n\\u0103toare' }, { type:'output', label:'LIVRABIL', text:'Sec\\u021Biune 1.000 cuvinte cu referin\\u021Be: Vakratsas et al. (2004) \\u2014 threshold effects \\u00EEn advertising, Bemmaor (1984), ELM \\u2014 relevance as processing switch, Baker & Lutz (2000) \\u2014 Relevance-Accessibility Model.' } ] }, { title:'Literature Review \\u2014 reformulare compara\\u021Bii', priority:'high', hasSite:true, dataType:'references', dataKey:'references', detail:'Ch07 de pe site compar\\u0103 deja R IF C vs AIDA, RACE, StoryBrand, 4Ps. Plus enciclopedia ta cu 35 framework-uri. <strong>Nu refacem analiza \\u2014 o reformul\\u0103m academic</strong> \\u0219i ad\\u0103ug\\u0103m referin\\u021Be originale.', deliverables:[ { type:'site', label:'INPUT GATA DE PE SITE', text:'\\u2705 Ch07: 4 compara\\u021Bii detaliate cu limit\\u0103ri identificate\\n\\u2705 Enciclopedia 35 framework-uri (cercetare anterioar\\u0103)\\n\\u2705 Gap identificat: "Niciun framework nu diagnosticheaz\\u0103 \\u2014 toate construiesc"' }, { type:'output', label:'LIVRABIL', text:'Tabel comparativ academic + narativ 2.500 cuvinte: 10-15 framework-uri \\u00D7 6 criterii. Gap-ul central: niciun framework nu ofer\\u0103 scoring numeric de diagnostic pre-expunere la nivel de mesaj.' }, { type:'standard', label:'REFERIN\\u021AE OBLIGATORII', text:'Vakratsas & Ambler (1999) JM, AIDA \\u2014 Strong (1925), DAGMAR \\u2014 Colley (1961), FCB Grid \\u2014 Vaughn (1986), ELM \\u2014 Petty & Cacioppo (1986), RACE \\u2014 Chaffey (2010).' } ] } ] },
  { id:'s2', label:'Dezvoltare Scal\\u0103', icon:'02', num:2, color:'var(--blue)', hasSite:true, duration:'Luna 1-2 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 2-6', priority:'STUDIUL 1', description:'Transformarea sub-factorilor de pe site \\u00EEn itemi de chestionar valida\\u021Bi. Paradigma Churchill (1979).', siteMap:[ { from:'Ch03 R: 7 sub-factori', to:'7-10 itemi Likert pentru Relevan\\u021B\\u0103', status:'ready' }, { from:'Ch03 I: 10 sub-factori', to:'10-12 itemi Likert pentru Interes', status:'ready' }, { from:'Ch03 F: 11 sub-factori', to:'10-12 itemi Likert pentru Form\\u0103', status:'ready' }, { from:'Ch04 Scoring 1-10 descriptori', to:'Ancore fixe pentru evaluatori', status:'ready' } ], tasks:[ { title:'Transformare sub-factori \\u2192 itemi Likert', priority:'urgent', hasSite:true, dataType:'likertItems', dataKey:'likertItems', detail:'Sub-factorii de pe site devin sursa principal\\u0103. Ex: R \\u2192 "Audien\\u021Ba" devine itemul: <em>"Mesajul se adreseaz\\u0103 unui segment cu o nevoie specific\\u0103 pe care produsul o rezolv\\u0103"</em> (1=Total dezacord \\u2192 7=Total acord).', deliverables:[ { type:'site', label:'INPUT DIRECT DE PE SITE', text:'\\u2705 R: Audien\\u021Ba, Timing, Etapa Journey, Context, Geografie, Canal, Segmentare \\u2192 7 sub-factori = min 7 itemi\\n\\u2705 I: 10 sub-factori \\u2192 min 10 itemi\\n\\u2705 F: 11 sub-factori \\u2192 min 11 itemi\\nTOTAL: 28 sub-factori \\u2192 30-36 itemi ini\\u021Biali' }, { type:'output', label:'LIVRABIL', text:'Pool de 30-36 itemi formula\\u021Bi ca afirma\\u021Bii Likert 1-7. Format: ID item, text item, construct (R/I/F), sub-factor surs\\u0103, referin\\u021B\\u0103 teoretic\\u0103.' } ] }, { title:'Construire Scoring Rubric standardizat', priority:'urgent', hasSite:true, dataType:'notes', dataKey:'scoringNotes', detail:'Ch04 de pe site are deja descriptori per nivel (1-10). Ace\\u0219tia devin <strong>ancore fixe</strong> pentru evaluatori.', deliverables:[ { type:'site', label:'INPUT DE PE SITE', text:'\\u2705 Ch04: Tabelul 0-110 cu 4 niveluri de Claritate\\n\\u2705 Descriptori per variabil\\u0103 (detalii din Anatomia Variabilelor)\\n\\u2705 Arhetipurile de E\\u0219ec \\u2192 exemple negative de calibrare' }, { type:'output', label:'LIVRABIL', text:'Scoring Rubric cu ancore fixe: 10 niveluri per variabil\\u0103, fiecare cu defini\\u021Bie opera\\u021Bional\\u0103 + exemplu concret + contra-exemplu.' } ] }, { title:'Panel de exper\\u021Bi (15-20 persoane)', priority:'urgent', dataType:'expertPanel', dataKey:'expertPanel', detail:'Recrutezi 15-20 marketeri/lectori. Fiecare evalueaz\\u0103 relevan\\u021Ba itemilor pe scala 1-4. Calcul\\u0103m Content Validity Index.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'Lista de 15-20 exper\\u021Bi: colegi marketeri, lectori USM/UTM, clien\\u021Bi Talmazan School avansa\\u021Bi. Tu organizezi sesiunile.' }, { type:'output', label:'LIVRABIL', text:'CVI \\u2265 0.80 per item. Pool rafinat de 24-30 itemi. Raport panel.' } ] }, { title:'Interviuri cognitive (10-15 utilizatori)', priority:'high', dataType:'cognitiveTests', dataKey:'cognitiveTests', detail:'Testezi comprehensiunea itemilor cu marketeri reali.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'10-15 marketeri care citesc itemii \\u0219i verbalizeaz\\u0103 ce \\u00EEn\\u021Beleg. Tu conduci. Notezi ambiguit\\u0103\\u021Bile.' }, { type:'output', label:'LIVRABIL', text:'Raport cognitive testing. Pool final pre-EFA.' } ] } ] },
  { id:'s3', label:'Colectare Date & EFA', icon:'03', num:3, color:'var(--amber)', hasSite:true, duration:'Lunile 2-3 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 5-12', priority:'STUDIUL 2', description:'Colectarea primului set de date + Exploratory Factor Analysis. Studiile de caz de pe site devin pilot data.', siteMap:[ { from:'Ch09 Studii de Caz (5 cazuri)', to:'Pilot stimuli + calibrare', status:'partial' }, { from:'Ch05 Matricea de Aplicare (6 canale)', to:'Categorii stimuli: LP, Social, Email, Ads, Pitch, Web', status:'ready' }, { from:'Omnichannel (17 canale)', to:'Generalizabilitate cross-canal', status:'ready' } ], tasks:[ { title:'Construire set stimuli (20-30 mesaje reale)', priority:'urgent', hasSite:true, dataType:'stimuli', dataKey:'stimuli', detail:'Cele 5 studii de caz de pe site devin primele 5 stimuli. Adaugi 15-25 campanii noi.', deliverables:[ { type:'site', label:'PILOT DATA DE PE SITE', text:'\\u2705 Maison Noir (R=2, I=7, F=8, C=58) \\u2014 Restaurant, FB Ads\\n\\u2705 CloudMetric \\u2014 SaaS B2B\\n\\u2705 CodeNest \\u2014 EdTech\\n\\u2705 VELA Fashion \\u2014 Fashion\\n\\u2705 Mentor Biz \\u2014 Consultan\\u021B\\u0103' }, { type:'input', label:'CAMPANII NOI DE LA TINE', text:'15-25 campanii reale suplimentare: screenshots emailuri, reclame, landing pages, pitch decks.' }, { type:'output', label:'LIVRABIL', text:'Set standardizat de 20-30 stimuli cu: ID, screenshot/text, tip canal, industrie, target audience. Anonimizat.' } ] }, { title:'Colectare date \\u2014 N = 250-350', priority:'urgent', dataType:'kvForm', dataKey:'respondents', detail:'Fiecare evaluator scoreaz\\u0103 8-10 mesaje randomizate.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'Distribuie chestionarul: studen\\u021Bi USM/UTM (100+), comunitate Talmazan School (50+), LinkedIn (100+).' }, { type:'output', label:'LIVRABIL', text:'Dataset: min 250 r\\u0103spunsuri \\u00D7 24-30 itemi \\u00D7 8-10 mesaje. Export CSV.' }, { type:'standard', label:'STANDARD', text:'Ratio 10:1 respondenti:itemi (Nunnally, 1978). Cu 30 itemi = ideal 300.' } ] }, { title:'Exploratory Factor Analysis', priority:'high', dataType:'kvForm', dataKey:'efaResults', detail:'EFA pe date: Principal Axis Factoring, rota\\u021Bie Oblimin. Verific\\u0103m structura cu 3 factori.', deliverables:[ { type:'output', label:'LIVRABIL', text:'Factor loadings, eigenvalues, scree plot, % varian\\u021B\\u0103, Cronbach \\u03B1 \\u2265 0.80 per factor. Scal\\u0103 final\\u0103: 4-6 itemi per construct.' }, { type:'standard', label:'THRESHOLDS', text:'Loading \\u2265 0.50, cross-loading < 0.35, \\u03B1 \\u2265 0.80, KMO \\u2265 0.80. Hair et al. (2019).' } ] } ] },
  { id:'s4', label:'CFA & Model Comparison', icon:'04', num:4, color:'var(--green)', duration:'Lunile 3-4 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 10-16', priority:'STUDIUL 3 \\u2014 CENTRAL', description:'Confirmatory Factor Analysis + TESTUL CRITIC: Additive vs Multiplicative + Threshold test. Contribu\\u021Bia empiric\\u0103 principal\\u0103.', tasks:[ { title:'Colectare e\\u0219antion nou \\u2014 N = 300-500', priority:'urgent', dataType:'kvForm', dataKey:'respondents', detail:'E\\u0219antion SEPARAT (obligatoriu). Aceea\\u0219i stimuli, itemi rafina\\u021Bi. Recrutare nou\\u0103.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'Al doilea val: studen\\u021Bi noi, marketeri noi, conferin\\u021Be, colabor\\u0103ri cu universit\\u0103\\u021Bi din Rom\\u00E2nia. ZERO overlap cu Studiul 2.' }, { type:'output', label:'LIVRABIL', text:'Dataset: 300-500 r\\u0103spunsuri noi.' } ] }, { title:'CFA \\u2014 Confirmatory Factor Analysis', priority:'urgent', dataType:'kvForm', dataKey:'cfaResults', detail:'Test\\u0103m structura 3 factori (R, I, F) pe date noi. SEM cu lavaan (R) sau AMOS.', deliverables:[ { type:'output', label:'LIVRABIL', text:'CFI \\u2265 0.95, RMSEA \\u2264 0.06, SRMR \\u2264 0.08. AVE \\u2265 0.50, CR \\u2265 0.70. Fornell-Larcker + HTMT < 0.85.' }, { type:'standard', label:'STANDARD', text:'Anderson & Gerbing (1988) two-step. Fornell & Larcker (1981). Hu & Bentler (1999).' } ] }, { title:'\\u26A1 TESTUL CENTRAL: Additive vs Multiplicative', priority:'urgent', dataType:'modelComparison', dataKey:'modelComparison', detail:'<strong>Cel mai important test.</strong> 3 modele comparate:<br>Model A (Additiv): C = \\u03B2\\u2080 + \\u03B2\\u2081R + \\u03B2\\u2082I + \\u03B2\\u2083F<br>Model B (R IF C): C = \\u03B2\\u2080 + \\u03B2\\u2081R + \\u03B2\\u2082(I\\u00D7F)<br>Model C (Full): C = \\u03B2\\u2080 + \\u03B2\\u2081R + \\u03B2\\u2082I + \\u03B2\\u2083F + \\u03B2\\u2084(I\\u00D7F)<br><br>Dac\\u0103 B > A \\u2192 ecua\\u021Bia R IF C e validat\\u0103 statistic.', deliverables:[ { type:'output', label:'LIVRABIL', text:'R\\u00B2, AIC, BIC, nested F-test \\u00EEntre modele. Tabel coeficien\\u021Bi. Grafic scatter C predict vs C actual.' }, { type:'standard', label:'STANDARD', text:'\\u0394R\\u00B2 semnificativ (p < 0.05). AIC/BIC mai mic = model superior.' } ] }, { title:'Testul Por\\u021Bii Relevan\\u021Bei (Threshold)', priority:'urgent', hasSite:true, dataType:'kvForm', dataKey:'thresholdTest', detail:'Test\\u0103m dac\\u0103 rela\\u021Bia I\\u00D7F \\u2192 C dispare sub R = 3. Ipoteza de pe site devine test statistic.', deliverables:[ { type:'site', label:'IPOTEZA DE PE SITE', text:'\\u2705 "Dac\\u0103 R < 3 \\u2192 E\\u0219ec Critic Automat" \\u2014 Poarta Relevan\\u021Bei\\n\\u2705 Simularea Dezastrului: R=2, I=8, F=9 \\u2192 pe h\\u00E2rtie 74, \\u00EEn realitate 0\\n\\u2705 Exemplele concrete devin PREDIC\\u021AII TESTABILE' }, { type:'output', label:'LIVRABIL', text:'Sensitivity analysis: threshold la R=2,3,4,5. Davies test. Grafic I\\u00D7F vs C separat sub/peste threshold.' } ] } ] },
  { id:'s5', label:'Validare Predictiv\\u0103', icon:'05', num:5, color:'var(--violet)', hasSite:true, duration:'Lunile 4-5 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 14-20', priority:'STUDIUL 4', description:'Scorurile R IF C prezic performan\\u021B\\u0103 real\\u0103? + AI Audit de pe site ca instrument suplimentar de validare.', siteMap:[ { from:'Ch06 Arhetipuri de E\\u0219ec (3 tipuri)', to:'Known-Groups Validity: Fantoma, Zgomot, Diamant', status:'ready' }, { from:'/audit (AI scoring)', to:'Study 5 op\\u021Bional: AI vs Human agreement', status:'partial' }, { from:'Ch09 Studii de Caz (KPI-uri)', to:'Pilot predictive data', status:'partial' } ], tasks:[ { title:'Colectare KPI-uri reale \\u2014 30-50 campanii', priority:'urgent', dataType:'campaigns', dataKey:'campaigns', detail:'<strong>Cel mai important input de la tine.</strong> Campaniile cu scoruri R IF C + metrici reale de performan\\u021B\\u0103.', deliverables:[ { type:'input', label:'DATE CRITICE DE LA TINE', text:'30-50 campanii cu KPI-uri reale:\\n\\u2022 CTR, CPL, ROAS, Conversion Rate, Bounce Rate\\n\\u2022 Din Google Analytics, Facebook Ads, email platforms, CRM\\n\\u2022 Surse: clien\\u021Bi Talmazan School, CONTINUUM, campanii proprii\\n\\u2022 Formular de consim\\u021B\\u0103m\\u00E2nt semnat per client (OBLIGATORIU)' }, { type:'output', label:'LIVRABIL', text:'Dataset merged: Scor C (medie evaluatori) + KPI-uri reale. Corela\\u021Bii Pearson: C vs CTR (target r > 0.4), C vs CPL (target r < -0.3).' } ] }, { title:'Known-Groups Validity (via Arhetipuri)', priority:'high', hasSite:true, dataType:'notes', dataKey:'knownGroupsNotes', detail:'Cele 3 arhetipuri de pe site devin categorii de testare.', deliverables:[ { type:'site', label:'CATEGORII DE PE SITE', text:'\\u2705 Fantoma Invizibil\\u0103: "0 + (I\\u00D7F) = Irelevant" \\u2192 predic\\u021Bie: C slab, KPI-uri zero\\n\\u2705 Zgomotul Estetic: "R + (1\\u00D710) = Slab" \\u2192 predic\\u021Bie: engagement fals, zero conversii\\n\\u2705 Diamantul \\u00CEngropat: "R + (10\\u00D71) = Irosit" \\u2192 predic\\u021Bie: poten\\u021Bial mascat de form\\u0103 slab\\u0103' }, { type:'output', label:'LIVRABIL', text:'ANOVA/Kruskal-Wallis: diferen\\u021Be semnificative \\u00EEntre cele 3 arhetipuri pe scor C \\u0219i KPI-uri. Cohen d per pereche.' } ] }, { title:'Inter-Rater Reliability', priority:'high', dataType:'interRater', dataKey:'interRater', detail:'3 evaluatori independen\\u021Bi, 25-30 campanii, scoruri independente.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'Recrutezi 3 marketeri experimenta\\u021Bi. Training 1 or\\u0103 cu Scoring Rubric-ul. Scorare independent\\u0103.' }, { type:'output', label:'LIVRABIL', text:'ICC sau Krippendorff \\u03B1 > 0.70 (acceptabil), > 0.80 (excelent).' } ] }, { title:'[OP\\u021AIONAL] Study 5: AI Audit vs Human Raters', priority:'low', hasSite:true, dataType:'aiAudit', dataKey:'aiAudit', detail:'AI Audit-ul de pe /audit scoreaz\\u0103 acelea\\u0219i 20-30 mesaje. Compar\\u0103m scorurile AI cu media evaluatorilor umani.', deliverables:[ { type:'site', label:'INSTRUMENT DE PE SITE', text:'\\u2705 /audit \\u2014 AI scoring automat cu prompt R IF C integrat\\n\\u2705 /calculator \\u2014 simulator interactiv' }, { type:'output', label:'LIVRABIL', text:'Corela\\u021Bie AI scores vs Human scores. Dac\\u0103 r > 0.70 \\u2192 contribu\\u021Bie original\\u0103: "automated R IF C diagnostic shows strong agreement with expert raters." RAR\\u0102 \\u00CEN LITERATUR\\u0102.' }, { type:'standard', label:'BONUS ACADEMIC', text:'Dac\\u0103 incluzi asta, paper-ul c\\u00E2\\u0219tig\\u0103 un avantaj competitiv major: AI-augmented marketing diagnostics este un topic fierbinte.' } ] } ] },
  { id:'s6', label:'Scriere & Submisie', icon:'06', num:6, color:'var(--cyan)', duration:'Lunile 5-6 \\u2014 S\\u0103pt\\u0103m\\u00E2nile 18-24', priority:'REDACTARE', description:'Paper-ul final: 12.000-15.000 cuvinte + cover letter + submisie. Site-ul e citat ca "practitioner implementation" a framework-ului.', tasks:[ { title:'Introduction + Literature Review', priority:'high', dataType:'sectionProgress', dataKey:'sections', detail:'2.000 + 3.500 cuvinte. Gap central: niciun framework nu diagnosticheaz\\u0103 cantitativ mesaje individuale.', deliverables:[ { type:'output', label:'LIVRABIL', text:'Introduction: 2.000 cuvinte. Literature Review: 3.500 cuvinte, 4 sec\\u021Biuni, 40-50 referin\\u021Be.' } ] }, { title:'Framework + Methodology + Results', priority:'high', dataType:'sectionProgress', dataKey:'sections', detail:'Framework: ecua\\u021Bia formalizat\\u0103. Methodology: 4 studii detaliate. Results: tabele, grafice, coeficien\\u021Bi.', deliverables:[ { type:'output', label:'LIVRABIL', text:'Framework: 2.500 cuvinte. Methodology: 3.000 cuvinte. Results: 4.000 cuvinte, 8-12 tabele/figuri.' } ] }, { title:'Discussion + Conclusion + AI Declaration', priority:'high', dataType:'sectionProgress', dataKey:'sections', detail:'Interpretare, contribu\\u021Bii, limit\\u0103ri, direc\\u021Bii viitoare, declara\\u021Bia AI.', deliverables:[ { type:'output', label:'LIVRABIL', text:'Discussion: 2.500 cuvinte. Conclusion: 800 cuvinte.\\nAI Declaration + Citare White Paper + Citare rifcmarketing.com ca implementare practitioner.' } ] }, { title:'Citarea site-ului \\u00EEn paper', priority:'medium', hasSite:true, dataType:'notes', dataKey:'citationNotes', detail:'Site-ul rifcmarketing.com se citeaz\\u0103 ca <strong>implementare practitioner a framework-ului</strong>, nu ca surs\\u0103 academic\\u0103.', deliverables:[ { type:'site', label:'ELEMENTE CITATE DIN SITE', text:'\\u2705 rifcmarketing.com \\u2014 practitioner implementation\\n\\u2705 /audit \\u2014 AI diagnostic tool (dac\\u0103 includem Study 5)\\n\\u2705 /calculator \\u2014 interactive scoring tool\\n\\u2705 White Paper \\u2014 gray literature reference' }, { type:'output', label:'LIVRABIL', text:'References section: site-ul apare ca 2-3 referin\\u021Be separate (website, White Paper, AI tool). Demonstreaz\\u0103 c\\u0103 framework-ul nu e doar teorie \\u2014 e implementat \\u0219i utilizat.' } ] }, { title:'Review intern + Formatare + Submisie', priority:'medium', dataType:'submission', dataKey:'submission', detail:'Lector USM/UTM verific\\u0103 metodologia. Formatare APA 7th. Cover letter personalizat.', deliverables:[ { type:'input', label:'DATE DE LA TINE', text:'Contact lector USM/UTM. Download Author Guidelines jurnal \\u021Bint\\u0103.' }, { type:'output', label:'LIVRABIL', text:'Paper final ~12.000-15.000 cuvinte, 80-100 referin\\u021Be, APA 7th. Cover letter. Submisie.' }, { type:'standard', label:'JURNALE \\u021AINT\\u0102', text:'1. Journal of Business Research (IF ~10.5)\\n2. JAMS (IF ~15.8)\\n3. European Journal of Marketing (IF ~3.7)\\n4. Journal of Advertising (IF ~5.8)\\n5. Studia Universitatis Moldaviae (start regional)' } ] } ] }
];

function App() {
  var app = document.getElementById('app');
  var activeStage = 'overview';
  var checkedTasks = {};
  var openTasks = {};
  var openWorkspaces = {};
  var editingRow = {};
  try { checkedTasks = JSON.parse(localStorage.getItem('rifc-tasks-v2') || '{}'); } catch(e) {}

  function getProgress() {
    var total=0, done=0, siteInputs=0;
    STAGES.forEach(function(s) { s.tasks.forEach(function(t) { total++; if(checkedTasks[s.id+'-'+t.title]) done++; if(t.hasSite) siteInputs++; }); });
    return { total:total, done:done, pct: total ? Math.round(done/total*100) : 0, siteInputs:siteInputs };
  }

  function computeC(r, i, f) { var rn=parseFloat(r)||0, inn=parseFloat(i)||0, fn=parseFloat(f)||0; return rn>0 ? Math.round((rn + inn*fn)*10)/10 : 0; }

  function render() {
    var p = getProgress();
    app.innerHTML = '<nav class="sidebar"><div class="sidebar-header"><div class="logo">R IF C</div><h2>Roadmap Articol \\u0218tiin\\u021Bific</h2><p>Validare Empiric\\u0103 Framework</p><div class="version">v2 \\u2014 cu integrare site</div></div><div class="progress-bar"><div class="label">PROGRES TOTAL</div><div class="bar"><div class="fill" style="width:'+p.pct+'%"></div></div><div class="stats"><span>'+p.done+'/'+p.total+' sarcini</span><span>'+p.pct+'%</span></div></div><div class="nav-section"><div class="nav-section-label">Etape</div>'+STAGES.map(function(s){var isDone=s.tasks.length>0&&s.tasks.every(function(t){return checkedTasks[s.id+'-'+t.title]});return '<div class="nav-item '+(activeStage===s.id?'active':'')+' '+(isDone?'completed':'')+'" data-stage="'+s.id+'"><span class="num">'+s.icon+'</span><span>'+s.label+'</span>'+(s.hasSite?'<span class="site-badge">SITE</span>':'')+'<span class="check">\\u2713</span></div>'}).join('')+'</div></nav><div class="main"><div class="main-header"><h1>'+(activeStage==='overview'?'R IF C \\u2014 Plan de Cercetare v2':STAGES.find(function(s){return s.id===activeStage}).label)+'</h1><div class="subtitle">Integrat cu rifcmarketing.com \\u00B7 '+p.siteInputs+' sarcini alimentate de site</div></div><div class="content">'+(activeStage==='overview'?renderOverview(p):renderStage(STAGES.find(function(s){return s.id===activeStage})))+'</div></div>';
    bindEvents();
    Object.keys(openTasks).forEach(function(k){ if(openTasks[k]){ var el=document.querySelector('[data-taskkey="'+k+'"]'); if(el) el.classList.add('open'); } });
    Object.keys(openWorkspaces).forEach(function(k){ if(openWorkspaces[k]){ var el=document.getElementById('dw-'+k); if(el) el.classList.add('open'); } });
  }

  function renderOverview(p) {
    return '<div class="stage-header"><div class="stage-label" style="color:var(--red)">PLAN COMPLET v2</div><div class="stage-title">De la Site la Publica\\u021Bie Interna\\u021Bional\\u0103</div><div class="stage-desc">7 etape (incluz\\u00E2nd Etapa 0: Audit Resurse Site), '+p.total+' sarcini concrete. Con\\u021Binutul de pe rifcmarketing.com alimenteaz\\u0103 direct 60% din inputuri \\u2014 restul sunt date noi de colectat.</div></div><div class="equation-display"><div class="eq">C = R + (I \\u00D7 F)</div><div class="eq-sub">Site \\u2192 Reformulare Academic\\u0103 \\u2192 Validare Empiric\\u0103 \\u2192 Paper \\u2192 Publicare</div></div><div class="overview-grid"><div class="ov-card"><div class="ov-num" style="color:var(--red)">4+1</div><div class="ov-label">STUDII (4 obligatorii + AI Audit op\\u021Bional)</div></div><div class="ov-card"><div class="ov-num" style="color:var(--blue)">1.000+</div><div class="ov-label">RESPONDENTI TOTAL</div></div><div class="ov-card"><div class="ov-num" style="color:var(--pink)">'+p.siteInputs+'</div><div class="ov-label">SARCINI CU INPUT DIN SITE</div></div><div class="ov-card"><div class="ov-num" style="color:var(--green)">12-15K</div><div class="ov-label">CUVINTE PAPER FINAL</div></div></div><div class="site-integration-map"><div class="sim-title"><span class="dot"></span>CE VINE DE PE RIFCMARKETING.COM</div><div class="sim-grid"><div class="sim-card ready"><div class="sc-chapter">CH03</div><div class="sc-name">Anatomia Variabilelor</div><div class="sc-maps">28 sub-factori \\u2192 30-36 itemi Likert</div><div class="sc-status">\\u2713 GATA \\u2014 reformulare</div></div><div class="sim-card ready"><div class="sc-chapter">CH07</div><div class="sc-name">R IF C vs Altele</div><div class="sc-maps">4 compara\\u021Bii \\u2192 Literature Review</div><div class="sc-status">\\u2713 GATA \\u2014 reformulare</div></div><div class="sim-card ready"><div class="sc-chapter">CH04</div><div class="sc-name">Scoring 1-10</div><div class="sc-maps">Descriptori \\u2192 Ancore evaluatori</div><div class="sc-status">\\u2713 GATA \\u2014 reformulare</div></div><div class="sim-card ready"><div class="sc-chapter">POARTA</div><div class="sc-name">Poarta Relevan\\u021Bei</div><div class="sc-maps">Simul\\u0103ri dezastru \\u2192 Threshold test</div><div class="sc-status">\\u2713 GATA \\u2014 testare</div></div><div class="sim-card ready"><div class="sc-chapter">CH06</div><div class="sc-name">Arhetipuri E\\u0219ec</div><div class="sc-maps">3 tipuri \\u2192 Known-Groups Validity</div><div class="sc-status">\\u2713 GATA \\u2014 testare</div></div><div class="sim-card partial"><div class="sc-chapter">CH09</div><div class="sc-name">Studii de Caz</div><div class="sc-maps">5 cazuri \\u2192 Pilot data + calibrare</div><div class="sc-status">\\u26A0 PAR\\u021AIAL \\u2014 adaugi campanii</div></div><div class="sim-card partial"><div class="sc-chapter">/AUDIT</div><div class="sc-name">AI Audit Tool</div><div class="sc-maps">Scoring automat \\u2192 Study 5 AI vs Human</div><div class="sc-status">\\u26A0 OP\\u021AIONAL \\u2014 bonus mare</div></div><div class="sim-card partial"><div class="sc-chapter">CH05</div><div class="sc-name">Matricea de Aplicare</div><div class="sc-maps">6 canale \\u2192 Categorii stimuli</div><div class="sc-status">\\u26A0 PAR\\u021AIAL \\u2014 adaugi date</div></div><div class="sim-card ready"><div class="sc-chapter">CH01+02</div><div class="sc-name">Filozofia + Ecua\\u021Bia</div><div class="sc-maps">Claritate, I\\u00D7F \\u2192 Formalizare math</div><div class="sc-status">\\u2713 GATA \\u2014 reformulare</div></div></div></div><div class="removed-notice"><div class="rn-title">ELIMINAT DIN PLAN v1 (DUPLICAT CU SITE-UL)</div><div class="rn-text">\\u2022 "Furnizeaz\\u0103 descrierile R, I, F, C" \\u2014 deja pe Ch01+Ch02+Ch03<br>\\u2022 "Furnizeaz\\u0103 compara\\u021Biile cu alte framework-uri" \\u2014 deja pe Ch07<br>\\u2022 "Furnizeaz\\u0103 exemplele de dezastru al Por\\u021Bii" \\u2014 deja pe sec\\u021Biunea Poarta Relevan\\u021Bei<br>\\u2022 "Creeaz\\u0103 enciclopedia framework-urilor" \\u2014 deja realizat\\u0103 (35 framework-uri)</div><div class="rn-reason">\\u2192 \\u00CEnlocuit cu: "Reformuleaz\\u0103 academic con\\u021Binutul de pe site"</div></div><h3 style="margin-top:32px;font-size:15px;color:var(--text3);letter-spacing:1px;">TIMELINE \\u2014 6 LUNI</h3><div class="timeline-simple"><div class="tl-item"><div class="tl-month">PRE</div><div class="tl-content"><strong>Etapa 0: Audit Site.</strong> Catalogare con\\u021Binut, export AI Audit ca instrument, documentare White Paper. <span style="color:var(--pink)">2-3 zile.</span></div></div><div class="tl-item"><div class="tl-month">LUNA 1</div><div class="tl-content"><strong>Fundamentare + Scal\\u0103.</strong> Reformulare academic\\u0103 (site \\u2192 paper). Transformare 28 sub-factori \\u2192 itemi Likert. Panel exper\\u021Bi. <span style="color:var(--pink)">~60% input din site.</span></div></div><div class="tl-item"><div class="tl-month">LUNA 2-3</div><div class="tl-content"><strong>Colectare + EFA.</strong> 5 cazuri pilot din site + 15-25 campanii noi. N=250-350. Factor analysis.</div></div><div class="tl-item"><div class="tl-month">LUNA 3-4</div><div class="tl-content"><strong>CFA + Test Central.</strong> N=300-500 nou. Additive vs Multiplicative. Threshold Poarta Relevan\\u021Bei.</div></div><div class="tl-item"><div class="tl-month">LUNA 4-5</div><div class="tl-content"><strong>Validare Predictiv\\u0103.</strong> KPI-uri reale. Arhetipuri \\u2192 Known-Groups. <span style="color:var(--pink)">+ AI Audit vs Human (op\\u021Bional).</span></div></div><div class="tl-item"><div class="tl-month">LUNA 5-6</div><div class="tl-content"><strong>Scriere + Submisie.</strong> Site citat ca "practitioner implementation". Paper \\u2192 JBR / JAMS.</div></div></div>';
  }

  function renderStage(stage) {
    var html = '<div class="stage-header"><div class="stage-label" style="color:'+stage.color+'">'+stage.priority+'</div><div class="stage-title">'+stage.label+'</div><div class="stage-desc">'+stage.description+'</div><div class="stage-meta"><span class="tag" style="background:var(--surface2);color:var(--text2);">'+stage.duration+'</span><span class="tag" style="background:var(--surface2);color:var(--text2);">'+stage.tasks.length+' sarcini</span>'+(stage.hasSite?'<span class="tag" style="background:var(--pink-dim);color:var(--pink);">input din site</span>':'')+'</div></div>';
    if(stage.siteMap) {
      html += '<div class="site-map"><div class="sm-title"><span class="globe">\\uD83C\\uDF10</span> CE VINE DE PE RIFCMARKETING.COM \\u2192 UNDE AJUNGE \\u00CEN PAPER</div><div class="sm-items">'+stage.siteMap.map(function(m){return '<div class="sm-item '+m.status+'"><span class="arrow">\\u2192</span><div><span class="from">'+m.from+'</span><br><span class="to">'+m.to+'</span></div></div>'}).join('')+'</div></div>';
    }
    html += '<div class="task-group"><div class="task-group-title">Sarcini & Livrabile</div>'+stage.tasks.map(function(t,i){var key=stage.id+'-'+t.title;var isChecked=checkedTasks[key];var dwKey=stage.id+'-'+i;return '<div class="task '+(t.hasSite?'has-site':'')+'" data-task="'+i+'" data-taskkey="'+key+'"><div class="task-header"><div class="task-checkbox '+(isChecked?'checked':'')+'" data-key="'+key+'">'+(isChecked?'\\u2713':'')+'</div><div class="title" style="'+(isChecked?'text-decoration:line-through;opacity:.5':'')+'">'+t.title+'</div><div class="badges">'+(t.hasSite?'<span class="site-tag">SITE</span>':'')+'<span class="priority '+t.priority+'">'+t.priority.toUpperCase()+'</span></div><span class="arrow">\\u25BC</span></div><div class="task-body"><div class="task-detail">'+t.detail+'</div>'+((t.deliverables||[]).map(function(d){return '<div class="deliverable"><div class="dlabel '+d.type+'">'+d.label+'</div><div class="dtext">'+d.text.replace(/\\n/g,'<br>')+'</div></div>'}).join(''))+(t.dataType ? renderDataWorkspace(stage.id, i, t) : '')+'</div></div>'}).join('')+'</div>';
    return html;
  }

  /* ═══ DATA WORKSPACE DISPATCHER ═══ */
  function renderDataWorkspace(stageId, taskIdx, task) {
    var dwKey = stageId + '-' + taskIdx;
    var data = DataStore.ensure(stageId, JSON.parse(JSON.stringify(DEFAULTS[stageId] || {})));
    var count = getDataCount(data, task.dataKey, task.dataType);
    var inner = '';
    if (task.dataType === 'notes') inner = renderNotesWS(stageId, task.dataKey, data);
    else if (task.dataType === 'definitions') inner = renderDefinitionsWS(stageId, data);
    else if (task.dataType === 'references') inner = renderReferencesWS(stageId, task.dataKey, data);
    else if (task.dataType === 'likertItems') inner = renderLikertWS(stageId, data);
    else if (task.dataType === 'expertPanel') inner = renderExpertWS(stageId, data);
    else if (task.dataType === 'cognitiveTests') inner = renderCognitiveWS(stageId, data);
    else if (task.dataType === 'stimuli') inner = renderStimuliWS(stageId, data);
    else if (task.dataType === 'campaigns') inner = renderCampaignsWS(stageId, data);
    else if (task.dataType === 'interRater') inner = renderInterRaterWS(stageId, data);
    else if (task.dataType === 'aiAudit') inner = renderAiAuditWS(stageId, data);
    else if (task.dataType === 'kvForm') inner = renderKvFormWS(stageId, task.dataKey, data);
    else if (task.dataType === 'modelComparison') inner = renderModelCompWS(stageId, data);
    else if (task.dataType === 'sectionProgress') inner = renderSectionProgressWS(stageId, data);
    else if (task.dataType === 'submission') inner = renderSubmissionWS(stageId, data);
    return '<div class="data-workspace" id="dw-'+dwKey+'"><div class="dw-toggle"><span class="dw-arrow">\\u25B6</span> DATE DE LUCRU'+(count>0?' <span class="dw-badge">'+count+' intr\\u0103ri</span>':'')+'</div><div class="dw-content" id="dwc-'+dwKey+'">'+inner+'</div></div>';
  }

  function getDataCount(data, key, type) {
    if (!data || !key) return 0;
    if (type === 'notes') return (data[key] || '').length > 0 ? 1 : 0;
    if (type === 'definitions') { var c=0; ['R','I','F','C'].forEach(function(k){if(data.definitions&&data.definitions[k]&&data.definitions[k].text) c++;}); return c; }
    if (type === 'kvForm') { var obj=data[key]; if(!obj) return 0; var c=0; Object.keys(obj).forEach(function(k){if(obj[k]!=='') c++;}); return c; }
    if (type === 'modelComparison') { var mc=data.modelComparison; if(!mc) return 0; return (mc.modelA&&mc.modelA.r2!==''?1:0)+(mc.modelB&&mc.modelB.r2!==''?1:0)+(mc.modelC&&mc.modelC.r2!==''?1:0); }
    if (type === 'sectionProgress') { var ss=data.sections; if(!ss) return 0; var c=0; Object.keys(ss).forEach(function(k){if(ss[k].words!=='') c++;}); return c; }
    if (type === 'submission') { return data.submission&&data.submission.journal!=='' ? 1 : 0; }
    if (Array.isArray(data[key])) return data[key].length;
    return 0;
  }

  /* ═══ NOTES WORKSPACE ═══ */
  function renderNotesWS(stageId, key, data) {
    var val = data[key] || '';
    var wc = val.trim() ? val.trim().split(/\\s+/).length : 0;
    return '<div class="dw-form-row"><label>Note de lucru</label><div><textarea class="dw-textarea" data-stage="'+stageId+'" data-key="'+key+'" data-type="notes" rows="4" placeholder="Scrie notele aici...">'+val+'</textarea><div class="dw-word-count">'+wc+' cuvinte</div></div></div>';
  }

  /* ═══ DEFINITIONS WORKSPACE (S1) ═══ */
  function renderDefinitionsWS(stageId, data) {
    var defs = data.definitions || {};
    var html = '';
    ['R','I','F','C'].forEach(function(k) {
      var d = defs[k] || {text:'',status:'draft'};
      var wc = d.text.trim() ? d.text.trim().split(/\\s+/).length : 0;
      var colors = {R:'var(--red)',I:'var(--amber)',F:'var(--violet)',C:'var(--green)'};
      html += '<div class="dw-def-block"><div class="def-label"><span style="color:'+colors[k]+';font-size:16px;font-family:JetBrains Mono,monospace;font-weight:800;">'+k+'</span> <span class="dw-status '+d.status+'">'+d.status.toUpperCase()+'</span></div><textarea class="dw-textarea" data-stage="'+stageId+'" data-defkey="'+k+'" data-type="definition" rows="5" placeholder="Defini\\u021Bia academic\\u0103 pentru '+k+'...">'+d.text+'</textarea><div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;"><div class="dw-word-count">'+wc+' / 1500 cuvinte</div><select class="dw-select" data-stage="'+stageId+'" data-defkey="'+k+'" data-type="defStatus"><option value="draft"'+(d.status==='draft'?' selected':'')+'>Draft</option><option value="in-progress"'+(d.status==='in-progress'?' selected':'')+'>In Progress</option><option value="complete"'+(d.status==='complete'?' selected':'')+'>Complete</option></select></div></div>';
    });
    return html;
  }

  /* ═══ REFERENCES TABLE (S1) ═══ */
  function renderReferencesWS(stageId, key, data) {
    var refs = data[key] || [];
    var html = '<div class="dw-header"><div class="dw-title">Referin\\u021Be ('+refs.length+')</div><button class="dw-btn primary" data-action="addRef" data-stage="'+stageId+'" data-key="'+key+'">+ Adaug\\u0103</button></div>';
    if (refs.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDCDA</div>Nicio referin\\u021B\\u0103 ad\\u0103ugat\\u0103</div>';
    html += '<table class="dw-table"><thead><tr><th>Autor</th><th>An</th><th>Jurnal</th><th>Titlu</th><th style="width:60px"></th></tr></thead><tbody>';
    refs.forEach(function(ref, idx) {
      html += '<tr><td>'+((ref.author)||'-')+'</td><td>'+((ref.year)||'-')+'</td><td>'+((ref.journal)||'-')+'</td><td>'+((ref.title)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editRef" data-stage="'+stageId+'" data-key="'+key+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delRef" data-stage="'+stageId+'" data-key="'+key+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ LIKERT ITEMS TABLE (S2) ═══ */
  function renderLikertWS(stageId, data) {
    var items = data.likertItems || [];
    var rCount=0,iCount=0,fCount=0;
    items.forEach(function(it){if(it.construct==='R')rCount++;if(it.construct==='I')iCount++;if(it.construct==='F')fCount++;});
    var html = '<div class="dw-summary"><div class="dw-sum-item">Total: <strong>'+items.length+'</strong></div><div class="dw-sum-item">R: <strong>'+rCount+'</strong></div><div class="dw-sum-item">I: <strong>'+iCount+'</strong></div><div class="dw-sum-item">F: <strong>'+fCount+'</strong></div></div>';
    html += '<div class="dw-header"><div class="dw-title">Itemi Likert</div><button class="dw-btn primary" data-action="addLikert" data-stage="'+stageId+'">+ Adaug\\u0103 Item</button></div>';
    if (items.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDCCB</div>Niciun item ad\\u0103ugat</div>';
    html += '<table class="dw-table"><thead><tr><th>ID</th><th>Text Item</th><th>Construct</th><th>Sub-factor</th><th>CVI</th><th style="width:60px"></th></tr></thead><tbody>';
    items.forEach(function(it, idx) {
      html += '<tr><td style="font-family:JetBrains Mono,monospace;font-size:10px;">'+it.id+'</td><td style="max-width:260px;">'+((it.text)||'-')+'</td><td><span style="color:'+(it.construct==='R'?'var(--red)':it.construct==='I'?'var(--amber)':'var(--violet)')+';font-weight:700;">'+it.construct+'</span></td><td>'+((it.subFactor)||'-')+'</td><td>'+((it.cvi)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editLikert" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delLikert" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ EXPERT PANEL TABLE (S2) ═══ */
  function renderExpertWS(stageId, data) {
    var experts = data.expertPanel || [];
    var html = '<div class="dw-header"><div class="dw-title">Panel Exper\\u021Bi ('+experts.length+'/20)</div><button class="dw-btn primary" data-action="addExpert" data-stage="'+stageId+'">+ Adaug\\u0103 Expert</button></div>';
    if (experts.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDC65</div>Niciun expert ad\\u0103ugat</div>';
    html += '<table class="dw-table"><thead><tr><th>Nume</th><th>Rol</th><th>Institu\\u021Bie</th><th>CVI Mediu</th><th style="width:60px"></th></tr></thead><tbody>';
    experts.forEach(function(ex, idx) {
      html += '<tr><td>'+((ex.name)||'-')+'</td><td>'+((ex.role)||'-')+'</td><td>'+((ex.institution)||'-')+'</td><td>'+((ex.cvi)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editExpert" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delExpert" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ COGNITIVE TESTS TABLE (S2) ═══ */
  function renderCognitiveWS(stageId, data) {
    var tests = data.cognitiveTests || [];
    var html = '<div class="dw-header"><div class="dw-title">Interviuri Cognitive ('+tests.length+'/15)</div><button class="dw-btn primary" data-action="addCognitive" data-stage="'+stageId+'">+ Adaug\\u0103</button></div>';
    if (tests.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83E\\uDDE0</div>Niciun interviu ad\\u0103ugat</div>';
    html += '<table class="dw-table"><thead><tr><th>Nume</th><th>Data</th><th>Note</th><th>Ambiguit\\u0103\\u021Bi</th><th style="width:60px"></th></tr></thead><tbody>';
    tests.forEach(function(t, idx) {
      html += '<tr><td>'+((t.name)||'-')+'</td><td>'+((t.date)||'-')+'</td><td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+((t.notes)||'-')+'</td><td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+((t.ambiguities)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editCognitive" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delCognitive" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ STIMULI TABLE (S3) ═══ */
  function renderStimuliWS(stageId, data) {
    var items = data.stimuli || [];
    var html = '<div class="dw-summary"><div class="dw-sum-item">Total: <strong>'+items.length+'</strong>/30</div><div class="dw-sum-item">Pilot: <strong>'+items.filter(function(i){return i.isPilot}).length+'</strong></div></div>';
    html += '<div class="dw-header"><div class="dw-title">Set Stimuli</div><button class="dw-btn primary" data-action="addStimulus" data-stage="'+stageId+'">+ Adaug\\u0103 Stimulus</button></div>';
    if (items.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDCE3</div>Niciun stimulus ad\\u0103ugat</div>';
    html += '<table class="dw-table"><thead><tr><th>ID</th><th>Nume</th><th>Canal</th><th>Industrie</th><th>R</th><th>I</th><th>F</th><th>C</th><th>Pilot</th><th style="width:60px"></th></tr></thead><tbody>';
    items.forEach(function(it, idx) {
      var c = computeC(it.rScore,it.iScore,it.fScore);
      html += '<tr><td style="font-family:JetBrains Mono,monospace;font-size:10px;">'+it.id+'</td><td>'+((it.name)||'-')+'</td><td>'+((it.channel)||'-')+'</td><td>'+((it.industry)||'-')+'</td><td>'+((it.rScore)||'-')+'</td><td>'+((it.iScore)||'-')+'</td><td>'+((it.fScore)||'-')+'</td><td><span class="dw-computed">'+c+'</span></td><td>'+(it.isPilot?'\\u2705':'')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editStimulus" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delStimulus" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ CAMPAIGNS TABLE (S5) — MAIN TABLE ═══ */
  function renderCampaignsWS(stageId, data) {
    var items = data.campaigns || [];
    var html = '<div class="dw-summary"><div class="dw-sum-item">Campanii: <strong>'+items.length+'</strong>/50</div>';
    if(items.length>0){var avgC=0;items.forEach(function(i){avgC+=computeC(i.rScore,i.iScore,i.fScore);});avgC=Math.round(avgC/items.length*10)/10;html+='<div class="dw-sum-item">C mediu: <strong>'+avgC+'</strong></div>';}
    html += '</div>';
    html += '<div class="dw-header"><div class="dw-title">Campanii cu KPI-uri</div><div style="display:flex;gap:6px;"><button class="dw-btn primary" data-action="addCampaign" data-stage="'+stageId+'">+ Adaug\\u0103 Campanie</button><button class="dw-btn" data-action="exportCSV" data-stage="'+stageId+'" data-key="campaigns">Export CSV</button></div></div>';
    if (items.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDCC8</div>Nicio campanie ad\\u0103ugat\\u0103.<br><span style="font-size:11px;color:var(--text3);">Aceasta este sarcina cea mai critic\\u0103 \\u2014 \\u00EEncepe s\\u0103 adaugi campanii reale cu KPI-uri.</span></div>';
    html += '<div style="overflow-x:auto;"><table class="dw-table"><thead><tr><th>ID</th><th>Campanie</th><th>CTR%</th><th>CPL</th><th>ROAS</th><th>Conv%</th><th>Bounce%</th><th>R</th><th>I</th><th>F</th><th>C</th><th>Sursa</th><th style="width:60px"></th></tr></thead><tbody>';
    items.forEach(function(it, idx) {
      var c = computeC(it.rScore,it.iScore,it.fScore);
      html += '<tr><td style="font-family:JetBrains Mono,monospace;font-size:10px;">'+it.id+'</td><td>'+((it.name)||'-')+'</td><td>'+((it.ctr)||'-')+'</td><td>'+((it.cpl)||'-')+'</td><td>'+((it.roas)||'-')+'</td><td>'+((it.conversionRate)||'-')+'</td><td>'+((it.bounceRate)||'-')+'</td><td>'+((it.rScore)||'-')+'</td><td>'+((it.iScore)||'-')+'</td><td>'+((it.fScore)||'-')+'</td><td><span class="dw-computed">'+c+'</span></td><td>'+((it.source)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editCampaign" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delCampaign" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  /* ═══ INTER-RATER TABLE (S5) ═══ */
  function renderInterRaterWS(stageId, data) {
    var items = data.interRater || [];
    var html = '<div class="dw-header"><div class="dw-title">Inter-Rater Reliability ('+items.length+')</div><button class="dw-btn primary" data-action="addInterRater" data-stage="'+stageId+'">+ Adaug\\u0103</button></div>';
    if (items.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83D\\uDC65</div>Nicio evaluare ad\\u0103ugat\\u0103</div>';
    html += '<table class="dw-table"><thead><tr><th>Campanie</th><th>R1:R</th><th>R1:I</th><th>R1:F</th><th>R2:R</th><th>R2:I</th><th>R2:F</th><th>R3:R</th><th>R3:I</th><th>R3:F</th><th style="width:60px"></th></tr></thead><tbody>';
    items.forEach(function(it, idx) {
      html += '<tr><td>'+((it.campaignName)||'-')+'</td><td>'+((it.r1r)||'-')+'</td><td>'+((it.r1i)||'-')+'</td><td>'+((it.r1f)||'-')+'</td><td>'+((it.r2r)||'-')+'</td><td>'+((it.r2i)||'-')+'</td><td>'+((it.r2f)||'-')+'</td><td>'+((it.r3r)||'-')+'</td><td>'+((it.r3i)||'-')+'</td><td>'+((it.r3f)||'-')+'</td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editInterRater" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delInterRater" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ AI AUDIT TABLE (S5) ═══ */
  function renderAiAuditWS(stageId, data) {
    var items = data.aiAudit || [];
    var html = '<div class="dw-header"><div class="dw-title">AI Audit Scores ('+items.length+')</div><button class="dw-btn primary" data-action="addAiAudit" data-stage="'+stageId+'">+ Adaug\\u0103</button></div>';
    if (items.length === 0) return html + '<div class="dw-empty"><div class="dw-empty-icon">\\uD83E\\uDD16</div>Niciun scor AI ad\\u0103ugat</div>';
    html += '<table class="dw-table"><thead><tr><th>Campanie</th><th>AI R</th><th>AI I</th><th>AI F</th><th>AI C</th><th style="width:60px"></th></tr></thead><tbody>';
    items.forEach(function(it, idx) {
      var c = computeC(it.aiR,it.aiI,it.aiF);
      html += '<tr><td>'+((it.campaignName)||'-')+'</td><td>'+((it.aiR)||'-')+'</td><td>'+((it.aiI)||'-')+'</td><td>'+((it.aiF)||'-')+'</td><td><span class="dw-computed">'+c+'</span></td><td class="dw-row-actions"><button class="dw-btn xs" data-action="editAiAudit" data-stage="'+stageId+'" data-idx="'+idx+'">\\u270E</button> <button class="dw-btn xs danger" data-action="delAiAudit" data-stage="'+stageId+'" data-idx="'+idx+'">\\u2715</button></td></tr>';
    });
    html += '</tbody></table>';
    return html;
  }

  /* ═══ KEY-VALUE FORM ═══ */
  function renderKvFormWS(stageId, key, data) {
    var obj = data[key] || {};
    var labels = {n:'N (respondenti)',meanAge:'V\\u00E2rsta medie',sd:'Devia\\u021Bie Standard',sources:'Surse',demographics:'Demografie',kmo:'KMO',bartlettP:'Bartlett p-value',varianceExplained:'Varian\\u021B\\u0103 explicat\\u0103 %',alphaR:'Cronbach \\u03B1 R',alphaI:'Cronbach \\u03B1 I',alphaF:'Cronbach \\u03B1 F',factorsRetained:'Factori re\\u021Binu\\u021Bi',cfi:'CFI',rmsea:'RMSEA',srmr:'SRMR',ave:'AVE',cr:'CR',fornellLarcker:'Fornell-Larcker (da/nu)',htmt:'HTMT',thresholdR:'Threshold R',daviesP:'Davies test p',notes:'Note'};
    var html = '<div class="dw-kv-grid">';
    Object.keys(obj).forEach(function(k) {
      if (k.charAt(0)==='_') return;
      var lbl = labels[k] || k;
      var val = obj[k] || '';
      if (k === 'notes' || k === 'demographics' || k === 'sources') {
        html += '<div class="dw-kv-card" style="grid-column:1/-1;"><div class="dw-kv-label">'+lbl+'</div><textarea class="dw-textarea" data-stage="'+stageId+'" data-kvkey="'+key+'" data-field="'+k+'" data-type="kvField" rows="3" placeholder="'+lbl+'...">'+val+'</textarea></div>';
      } else {
        html += '<div class="dw-kv-card"><div class="dw-kv-label">'+lbl+'</div><input class="dw-input" data-stage="'+stageId+'" data-kvkey="'+key+'" data-field="'+k+'" data-type="kvField" value="'+val+'" placeholder="'+lbl+'"></div>';
      }
    });
    html += '</div>';
    return html;
  }

  /* ═══ MODEL COMPARISON (S4) ═══ */
  function renderModelCompWS(stageId, data) {
    var mc = data.modelComparison || {};
    var models = [{key:'modelA',label:'Model A (Additiv)',formula:'C = \\u03B20 + \\u03B21R + \\u03B22I + \\u03B23F'},{key:'modelB',label:'Model B (R IF C)',formula:'C = \\u03B20 + \\u03B21R + \\u03B22(I\\u00D7F)'},{key:'modelC',label:'Model C (Full)',formula:'C = \\u03B20 + \\u03B21R + \\u03B22I + \\u03B23F + \\u03B24(I\\u00D7F)'}];
    var html = '<div class="dw-model-grid">';
    models.forEach(function(m) {
      var d = mc[m.key] || {r2:'',aic:'',bic:'',p:''};
      html += '<div class="dw-model-card"><div class="mc-label">'+m.label+'</div><div style="font-size:10px;color:var(--text3);margin-bottom:8px;font-family:JetBrains Mono,monospace;">'+m.formula+'</div>';
      ['r2','aic','bic','p'].forEach(function(f){
        var fl = {r2:'R\\u00B2',aic:'AIC',bic:'BIC',p:'p-value'}[f];
        html += '<div style="margin-bottom:6px;"><div style="font-size:10px;color:var(--text3);letter-spacing:1px;">'+fl+'</div><input class="dw-input sm" data-stage="'+stageId+'" data-modelkey="'+m.key+'" data-field="'+f+'" data-type="modelField" value="'+(d[f]||'')+'"></div>';
      });
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  /* ═══ SECTION PROGRESS (S6) ═══ */
  function renderSectionProgressWS(stageId, data) {
    var sections = data.sections || {};
    var sectionNames = {introduction:'Introduction',literatureReview:'Literature Review',framework:'Framework',methodology:'Methodology',results:'Results',discussion:'Discussion',conclusion:'Conclusion'};
    var html = '';
    Object.keys(sectionNames).forEach(function(k) {
      var s = sections[k] || {words:'',target:0,status:'not-started'};
      var pct = s.target > 0 && s.words ? Math.min(100, Math.round(parseInt(s.words)/s.target*100)) : 0;
      var barColor = pct >= 100 ? 'var(--green)' : pct >= 50 ? 'var(--amber)' : 'var(--red)';
      html += '<div class="dw-section-row"><div class="sr-name">'+sectionNames[k]+'</div><input class="dw-input sm" data-stage="'+stageId+'" data-seckey="'+k+'" data-type="sectionWords" value="'+(s.words||'')+'" placeholder="0"> <span style="font-size:10px;color:var(--text3);">/ '+s.target+'</span><div class="sr-bar"><div class="sr-fill" style="width:'+pct+'%;background:'+barColor+';"></div></div><select class="dw-select" data-stage="'+stageId+'" data-seckey="'+k+'" data-type="sectionStatus" style="font-size:10px;padding:3px 6px;"><option value="not-started"'+(s.status==='not-started'?' selected':'')+'>Not Started</option><option value="draft"'+(s.status==='draft'?' selected':'')+'>Draft</option><option value="in-progress"'+(s.status==='in-progress'?' selected':'')+'>In Progress</option><option value="complete"'+(s.status==='complete'?' selected':'')+'>Complete</option></select></div>';
    });
    return html;
  }

  /* ═══ SUBMISSION FORM (S6) ═══ */
  function renderSubmissionWS(stageId, data) {
    var sub = data.submission || {journal:'',date:'',status:'not-submitted',notes:''};
    var html = '<div class="dw-form-row"><label>Jurnal \\u021Bint\\u0103</label><input class="dw-input" data-stage="'+stageId+'" data-subfield="journal" data-type="subField" value="'+(sub.journal||'')+'" placeholder="ex: Journal of Business Research"></div>';
    html += '<div class="dw-form-row"><label>Data submisie</label><input class="dw-input md" data-stage="'+stageId+'" data-subfield="date" data-type="subField" value="'+(sub.date||'')+'" placeholder="YYYY-MM-DD"></div>';
    html += '<div class="dw-form-row"><label>Status</label><select class="dw-select" data-stage="'+stageId+'" data-subfield="status" data-type="subField"><option value="not-submitted"'+(sub.status==='not-submitted'?' selected':'')+'>Not Submitted</option><option value="preparing"'+(sub.status==='preparing'?' selected':'')+'>Preparing</option><option value="submitted"'+(sub.status==='submitted'?' selected':'')+'>Submitted</option><option value="under-review"'+(sub.status==='under-review'?' selected':'')+'>Under Review</option><option value="revision-requested"'+(sub.status==='revision-requested'?' selected':'')+'>Revision Requested</option><option value="accepted"'+(sub.status==='accepted'?' selected':'')+'>Accepted</option><option value="rejected"'+(sub.status==='rejected'?' selected':'')+'>Rejected</option></select></div>';
    html += '<div class="dw-form-row"><label>Note</label><textarea class="dw-textarea" data-stage="'+stageId+'" data-subfield="notes" data-type="subField" rows="3" placeholder="Note...">'+(sub.notes||'')+'</textarea></div>';
    return html;
  }

  /* ═══ MODAL: Add/Edit Entry ═══ */
  function showEntryModal(title, fields, onSave, existingData) {
    var overlay = document.createElement('div');
    overlay.className = 'dw-confirm-overlay';
    var html = '<div class="dw-confirm-box" style="max-width:500px;"><h4>'+title+'</h4>';
    fields.forEach(function(f) {
      var val = existingData ? (existingData[f.key] || '') : (f.defaultVal || '');
      if (f.type === 'select') {
        html += '<div class="dw-form-row"><label>'+f.label+'</label><select class="dw-select" id="modal-'+f.key+'">';
        f.options.forEach(function(o) { html += '<option value="'+o+'"'+(val===o?' selected':'')+'>'+o+'</option>'; });
        html += '</select></div>';
      } else if (f.type === 'textarea') {
        html += '<div class="dw-form-row"><label>'+f.label+'</label><textarea class="dw-textarea" id="modal-'+f.key+'" rows="3" placeholder="'+f.label+'...">'+val+'</textarea></div>';
      } else if (f.type === 'checkbox') {
        html += '<div class="dw-form-row"><label>'+f.label+'</label><input type="checkbox" class="dw-check" id="modal-'+f.key+'"'+(val?' checked':'')+'></div>';
      } else {
        html += '<div class="dw-form-row"><label>'+f.label+'</label><input class="dw-input" id="modal-'+f.key+'" value="'+val+'" placeholder="'+f.label+'"></div>';
      }
    });
    html += '<div class="dw-confirm-actions"><button class="dw-btn" id="modal-cancel">Anuleaz\\u0103</button><button class="dw-btn primary" id="modal-save">Salveaz\\u0103</button></div></div>';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    document.getElementById('modal-cancel').onclick = function() { overlay.remove(); };
    document.getElementById('modal-save').onclick = function() {
      var result = {};
      fields.forEach(function(f) {
        var el = document.getElementById('modal-'+f.key);
        result[f.key] = f.type === 'checkbox' ? el.checked : el.value;
      });
      overlay.remove();
      onSave(result);
    };
  }

  /* ═══ MODAL: Delete Confirm ═══ */
  function showDeleteConfirm(itemName, onConfirm) {
    var overlay = document.createElement('div');
    overlay.className = 'dw-confirm-overlay';
    overlay.innerHTML = '<div class="dw-confirm-box"><h4>Confirmare \\u0218tergere</h4><p>E\\u0219ti sigur c\\u0103 vrei s\\u0103 \\u0219tergi <strong>'+itemName+'</strong>? Aceast\\u0103 ac\\u021Biune nu poate fi anulat\\u0103.</p><div class="dw-confirm-actions"><button class="dw-btn" id="del-cancel">Anuleaz\\u0103</button><button class="dw-btn danger" id="del-confirm">\\u0218terge</button></div></div>';
    document.body.appendChild(overlay);
    document.getElementById('del-cancel').onclick = function() { overlay.remove(); };
    document.getElementById('del-confirm').onclick = function() { overlay.remove(); onConfirm(); };
  }

  /* ═══ EXPORT CSV ═══ */
  function exportCSV(stageId, key) {
    var data = DataStore.load(stageId);
    if (!data || !data[key] || data[key].length === 0) return;
    var items = data[key];
    var headers = Object.keys(items[0]).filter(function(k){return k.charAt(0)!=='_';});
    var csv = headers.join(',') + '\\n';
    items.forEach(function(item) {
      csv += headers.map(function(h) {
        var v = (item[h] || '').toString().replace(/"/g, '""');
        return '"' + v + '"';
      }).join(',') + '\\n';
    });
    var blob = new Blob([csv], {type:'text/csv'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rifc-'+stageId+'-'+key+'.csv';
    a.click();
  }

  /* ═══ FIELD CONFIGS FOR MODALS ═══ */
  var MODAL_FIELDS = {
    campaign: [
      {key:'name',label:'Nume Campanie',type:'text'},
      {key:'ctr',label:'CTR %',type:'text'},
      {key:'cpl',label:'CPL',type:'text'},
      {key:'roas',label:'ROAS',type:'text'},
      {key:'conversionRate',label:'Conversion Rate %',type:'text'},
      {key:'bounceRate',label:'Bounce Rate %',type:'text'},
      {key:'rScore',label:'R (1-10)',type:'text'},
      {key:'iScore',label:'I (1-10)',type:'text'},
      {key:'fScore',label:'F (1-10)',type:'text'},
      {key:'source',label:'Sursa (Google Ads, FB, etc.)',type:'text'},
      {key:'hasConsent',label:'Consim\\u021B\\u0103m\\u00E2nt semnat',type:'checkbox'}
    ],
    likert: [
      {key:'text',label:'Text Item (afirma\\u021Bie Likert)',type:'textarea'},
      {key:'construct',label:'Construct',type:'select',options:['R','I','F']},
      {key:'subFactor',label:'Sub-factor surs\\u0103',type:'text'},
      {key:'cvi',label:'Scor CVI',type:'text'}
    ],
    expert: [
      {key:'name',label:'Nume',type:'text'},
      {key:'role',label:'Rol',type:'text'},
      {key:'institution',label:'Institu\\u021Bie',type:'text'},
      {key:'cvi',label:'CVI Mediu',type:'text'}
    ],
    cognitive: [
      {key:'name',label:'Nume Participant',type:'text'},
      {key:'date',label:'Data',type:'text'},
      {key:'notes',label:'Note',type:'textarea'},
      {key:'ambiguities',label:'Ambiguit\\u0103\\u021Bi g\\u0103site',type:'textarea'}
    ],
    stimulus: [
      {key:'name',label:'Nume / Descriere',type:'text'},
      {key:'channel',label:'Canal',type:'select',options:['LP','Social','Email','Ads','Pitch','Web']},
      {key:'industry',label:'Industrie',type:'text'},
      {key:'targetAudience',label:'Target Audience',type:'text'},
      {key:'link',label:'Link / Screenshot URL',type:'text'},
      {key:'rScore',label:'R (1-10)',type:'text'},
      {key:'iScore',label:'I (1-10)',type:'text'},
      {key:'fScore',label:'F (1-10)',type:'text'},
      {key:'isPilot',label:'Pilot (din site)',type:'checkbox'}
    ],
    ref: [
      {key:'author',label:'Autor(i)',type:'text'},
      {key:'year',label:'An',type:'text'},
      {key:'journal',label:'Jurnal',type:'text'},
      {key:'title',label:'Titlu',type:'text'},
      {key:'doi',label:'DOI',type:'text'}
    ],
    interRater: [
      {key:'campaignName',label:'Campanie',type:'text'},
      {key:'r1r',label:'Rater 1: R',type:'text'},{key:'r1i',label:'Rater 1: I',type:'text'},{key:'r1f',label:'Rater 1: F',type:'text'},
      {key:'r2r',label:'Rater 2: R',type:'text'},{key:'r2i',label:'Rater 2: I',type:'text'},{key:'r2f',label:'Rater 2: F',type:'text'},
      {key:'r3r',label:'Rater 3: R',type:'text'},{key:'r3i',label:'Rater 3: I',type:'text'},{key:'r3f',label:'Rater 3: F',type:'text'}
    ],
    aiAudit: [
      {key:'campaignName',label:'Campanie',type:'text'},
      {key:'aiR',label:'AI R',type:'text'},{key:'aiI',label:'AI I',type:'text'},{key:'aiF',label:'AI F',type:'text'}
    ]
  };

  /* ═══ GENERIC ADD/EDIT/DELETE ═══ */
  function addEntry(stageId, arrKey, prefix, fields, title) {
    showEntryModal(title, fields, function(result) {
      var data = DataStore.ensure(stageId, JSON.parse(JSON.stringify(DEFAULTS[stageId] || {})));
      if (!data[arrKey]) data[arrKey] = [];
      result.id = DataStore.nextId(data[arrKey], prefix);
      data[arrKey].push(result);
      DataStore.save(stageId, data);
      render();
    });
  }

  function editEntry(stageId, arrKey, idx, fields, title) {
    var data = DataStore.load(stageId);
    if (!data || !data[arrKey] || !data[arrKey][idx]) return;
    showEntryModal(title, fields, function(result) {
      var data2 = DataStore.load(stageId);
      result.id = data2[arrKey][idx].id;
      data2[arrKey][idx] = result;
      DataStore.save(stageId, data2);
      render();
    }, data[arrKey][idx]);
  }

  function deleteEntry(stageId, arrKey, idx, itemLabel) {
    showDeleteConfirm(itemLabel, function() {
      var data = DataStore.load(stageId);
      if (!data || !data[arrKey]) return;
      data[arrKey].splice(idx, 1);
      DataStore.save(stageId, data);
      render();
    });
  }

  /* ═══ BIND EVENTS ═══ */
  function bindEvents() {
    document.querySelectorAll('.nav-item').forEach(function(el) {
      el.addEventListener('click', function() { activeStage = el.dataset.stage; render(); window.scrollTo(0,0); });
    });
    document.querySelectorAll('.task-header').forEach(function(el) {
      el.addEventListener('click', function(e) {
        if(e.target.classList.contains('task-checkbox')) return;
        var task = el.closest('.task');
        task.classList.toggle('open');
        var key = task.getAttribute('data-taskkey');
        openTasks[key] = task.classList.contains('open');
      });
    });
    document.querySelectorAll('.task-checkbox').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var key = el.dataset.key;
        checkedTasks[key] = !checkedTasks[key];
        try { localStorage.setItem('rifc-tasks-v2', JSON.stringify(checkedTasks)); } catch(e) {}
        render();
      });
    });
    /* Data workspace toggles */
    document.querySelectorAll('.dw-toggle').forEach(function(el) {
      el.addEventListener('click', function() {
        var ws = el.closest('.data-workspace');
        ws.classList.toggle('open');
        openWorkspaces[ws.id.replace('dw-','')] = ws.classList.contains('open');
      });
    });
    /* Inline field auto-save: notes, definitions, kvForm, sections, submission */
    document.querySelectorAll('[data-type="notes"]').forEach(function(el) {
      el.addEventListener('input', function() {
        var sid = el.dataset.stage, k = el.dataset.key;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        data[k] = el.value;
        DataStore.save(sid, data);
        var wc = el.value.trim() ? el.value.trim().split(/\\s+/).length : 0;
        var wcEl = el.parentNode.querySelector('.dw-word-count');
        if(wcEl) wcEl.textContent = wc + ' cuvinte';
      });
    });
    document.querySelectorAll('[data-type="definition"]').forEach(function(el) {
      el.addEventListener('input', function() {
        var sid = el.dataset.stage, k = el.dataset.defkey;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.definitions) data.definitions = {};
        if(!data.definitions[k]) data.definitions[k] = {text:'',status:'draft'};
        data.definitions[k].text = el.value;
        DataStore.save(sid, data);
        var wc = el.value.trim() ? el.value.trim().split(/\\s+/).length : 0;
        var wcEl = el.parentNode.querySelector('.dw-word-count');
        if(wcEl) wcEl.textContent = wc + ' / 1500 cuvinte';
      });
    });
    document.querySelectorAll('[data-type="defStatus"]').forEach(function(el) {
      el.addEventListener('change', function() {
        var sid = el.dataset.stage, k = el.dataset.defkey;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.definitions) data.definitions = {};
        if(!data.definitions[k]) data.definitions[k] = {text:'',status:'draft'};
        data.definitions[k].status = el.value;
        DataStore.save(sid, data);
      });
    });
    document.querySelectorAll('[data-type="kvField"]').forEach(function(el) {
      var handler = function() {
        var sid = el.dataset.stage, kvkey = el.dataset.kvkey, field = el.dataset.field;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data[kvkey]) data[kvkey] = {};
        data[kvkey][field] = el.value;
        DataStore.save(sid, data);
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    document.querySelectorAll('[data-type="modelField"]').forEach(function(el) {
      el.addEventListener('input', function() {
        var sid = el.dataset.stage, mk = el.dataset.modelkey, f = el.dataset.field;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.modelComparison) data.modelComparison = {};
        if(!data.modelComparison[mk]) data.modelComparison[mk] = {};
        data.modelComparison[mk][f] = el.value;
        DataStore.save(sid, data);
      });
    });
    document.querySelectorAll('[data-type="sectionWords"]').forEach(function(el) {
      el.addEventListener('input', function() {
        var sid = el.dataset.stage, sk = el.dataset.seckey;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.sections) data.sections = {};
        if(!data.sections[sk]) data.sections[sk] = {words:'',target:0,status:'not-started'};
        data.sections[sk].words = el.value;
        DataStore.save(sid, data);
      });
    });
    document.querySelectorAll('[data-type="sectionStatus"]').forEach(function(el) {
      el.addEventListener('change', function() {
        var sid = el.dataset.stage, sk = el.dataset.seckey;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.sections) data.sections = {};
        if(!data.sections[sk]) data.sections[sk] = {words:'',target:0,status:'not-started'};
        data.sections[sk].status = el.value;
        DataStore.save(sid, data);
      });
    });
    document.querySelectorAll('[data-type="subField"]').forEach(function(el) {
      var handler = function() {
        var sid = el.dataset.stage, sf = el.dataset.subfield;
        var data = DataStore.ensure(sid, JSON.parse(JSON.stringify(DEFAULTS[sid] || {})));
        if(!data.submission) data.submission = {};
        data.submission[sf] = el.value;
        DataStore.save(sid, data);
      };
      el.addEventListener('input', handler);
      el.addEventListener('change', handler);
    });
    /* CRUD buttons — delegated */
    document.querySelectorAll('[data-action]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.stopPropagation();
        var action = el.dataset.action, sid = el.dataset.stage, idx = parseInt(el.dataset.idx), key = el.dataset.key;
        /* ── CAMPAIGNS ── */
        if (action === 'addCampaign') addEntry(sid, 'campaigns', 'KPI', MODAL_FIELDS.campaign, 'Adaug\\u0103 Campanie');
        if (action === 'editCampaign') editEntry(sid, 'campaigns', idx, MODAL_FIELDS.campaign, 'Editeaz\\u0103 Campanie');
        if (action === 'delCampaign') { var d=DataStore.load(sid); deleteEntry(sid, 'campaigns', idx, (d.campaigns[idx]||{}).name || 'Campanie'); }
        /* ── LIKERT ── */
        if (action === 'addLikert') addEntry(sid, 'likertItems', 'LI', MODAL_FIELDS.likert, 'Adaug\\u0103 Item Likert');
        if (action === 'editLikert') editEntry(sid, 'likertItems', idx, MODAL_FIELDS.likert, 'Editeaz\\u0103 Item');
        if (action === 'delLikert') { var d=DataStore.load(sid); deleteEntry(sid, 'likertItems', idx, (d.likertItems[idx]||{}).id || 'Item'); }
        /* ── EXPERT ── */
        if (action === 'addExpert') addEntry(sid, 'expertPanel', 'EP', MODAL_FIELDS.expert, 'Adaug\\u0103 Expert');
        if (action === 'editExpert') editEntry(sid, 'expertPanel', idx, MODAL_FIELDS.expert, 'Editeaz\\u0103 Expert');
        if (action === 'delExpert') { var d=DataStore.load(sid); deleteEntry(sid, 'expertPanel', idx, (d.expertPanel[idx]||{}).name || 'Expert'); }
        /* ── COGNITIVE ── */
        if (action === 'addCognitive') addEntry(sid, 'cognitiveTests', 'CT', MODAL_FIELDS.cognitive, 'Adaug\\u0103 Interviu');
        if (action === 'editCognitive') editEntry(sid, 'cognitiveTests', idx, MODAL_FIELDS.cognitive, 'Editeaz\\u0103 Interviu');
        if (action === 'delCognitive') { var d=DataStore.load(sid); deleteEntry(sid, 'cognitiveTests', idx, (d.cognitiveTests[idx]||{}).name || 'Interviu'); }
        /* ── STIMULI ── */
        if (action === 'addStimulus') addEntry(sid, 'stimuli', 'STM', MODAL_FIELDS.stimulus, 'Adaug\\u0103 Stimulus');
        if (action === 'editStimulus') editEntry(sid, 'stimuli', idx, MODAL_FIELDS.stimulus, 'Editeaz\\u0103 Stimulus');
        if (action === 'delStimulus') { var d=DataStore.load(sid); deleteEntry(sid, 'stimuli', idx, (d.stimuli[idx]||{}).name || 'Stimulus'); }
        /* ── REFERENCES ── */
        if (action === 'addRef') addEntry(sid, key, 'REF', MODAL_FIELDS.ref, 'Adaug\\u0103 Referin\\u021B\\u0103');
        if (action === 'editRef') editEntry(sid, key, idx, MODAL_FIELDS.ref, 'Editeaz\\u0103 Referin\\u021B\\u0103');
        if (action === 'delRef') { var d=DataStore.load(sid); deleteEntry(sid, key, idx, (d[key][idx]||{}).author || 'Referin\\u021B\\u0103'); }
        /* ── INTER-RATER ── */
        if (action === 'addInterRater') addEntry(sid, 'interRater', 'IR', MODAL_FIELDS.interRater, 'Adaug\\u0103 Evaluare');
        if (action === 'editInterRater') editEntry(sid, 'interRater', idx, MODAL_FIELDS.interRater, 'Editeaz\\u0103 Evaluare');
        if (action === 'delInterRater') { var d=DataStore.load(sid); deleteEntry(sid, 'interRater', idx, (d.interRater[idx]||{}).campaignName || 'Evaluare'); }
        /* ── AI AUDIT ── */
        if (action === 'addAiAudit') addEntry(sid, 'aiAudit', 'AA', MODAL_FIELDS.aiAudit, 'Adaug\\u0103 Scor AI');
        if (action === 'editAiAudit') editEntry(sid, 'aiAudit', idx, MODAL_FIELDS.aiAudit, 'Editeaz\\u0103 Scor AI');
        if (action === 'delAiAudit') { var d=DataStore.load(sid); deleteEntry(sid, 'aiAudit', idx, (d.aiAudit[idx]||{}).campaignName || 'Scor AI'); }
        /* ── EXPORT CSV ── */
        if (action === 'exportCSV') exportCSV(sid, key);
      });
    });
  }

  render();
}

App();
`;

export default function ArticolStiintificPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    /* Write the HTML structure */
    doc.open();
    doc.write(ROADMAP_HTML);
    doc.close();

    /* Inject the app script after DOM is ready */
    const script = doc.createElement("script");
    script.textContent = ROADMAP_SCRIPT;
    doc.body.appendChild(script);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      title="R IF C — Roadmap Articol Științific v2"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
        display: "block",
      }}
    />
  );
}
