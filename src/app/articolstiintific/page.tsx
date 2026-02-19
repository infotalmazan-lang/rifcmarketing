"use client";

import { useRef, useEffect } from "react";

// ============================================================
// R IF C — Articol Științific v5 — content blocks system
// 12 etape, 42 sarcini — each task has addable content blocks
// 8 block types: text-short, text-long, link, file, table,
//                dropdown, number, date
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
    --sidebar-w: 260px;
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

  .sb-header { padding: 16px 14px 12px; border-bottom: 1px solid var(--border); }
  .sb-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
  .sb-logo-row img { width: 32px; height: 32px; border-radius: 6px; object-fit: contain; }
  .sb-title { font-size: 13px; font-weight: 700; color: var(--text); line-height: 1.2; }
  .sb-subtitle { font-size: 10px; color: var(--text3); }

  .sb-progress { padding: 12px 14px; border-bottom: 1px solid var(--border); }
  .sb-progress-label { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .sb-progress-label span { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--text3); }
  .sb-progress-label .pct { font-family: 'JetBrains Mono', monospace; color: var(--green); font-size: 11px; }
  .sb-bar { width: 100%; height: 6px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .sb-bar-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--green2)); border-radius: 4px; transition: width 0.4s ease; }
  .sb-progress-stats { display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }

  .sb-actions { padding: 10px 14px; display: flex; flex-direction: column; gap: 5px; border-bottom: 1px solid var(--border); }
  .sb-btn { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: none; border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; cursor: pointer; color: #fff; width: 100%; text-align: left; transition: opacity 0.15s; }
  .sb-btn:hover { opacity: 0.9; }
  .sb-btn.active { box-shadow: inset 0 0 0 2px rgba(255,255,255,0.3); }
  .sb-btn.green { background: var(--green); }
  .sb-btn.red { background: var(--red); }
  .sb-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

  .sb-nav { padding: 10px 0; flex: 1; }
  .sb-nav-title { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text3); padding: 0 14px; margin-bottom: 6px; }
  .sb-separator { height: 1px; background: var(--border); margin: 6px 14px; }
  .sb-prep-label { padding: 0 14px; margin-bottom: 2px; font-size: 8px; color: var(--text3); font-style: italic; }

  .sb-stage { padding: 0 8px; }
  .sb-stage-btn { display: flex; align-items: center; gap: 7px; width: 100%; padding: 7px 8px; border: none; border-radius: 6px; background: transparent; cursor: pointer; transition: background 0.15s; text-align: left; font-family: 'Inter', sans-serif; }
  .sb-stage-btn:hover { background: var(--surface2); }
  .sb-stage-btn.active { background: var(--red); color: #fff; }
  .sb-stage-btn.active .sb-stage-num { background: rgba(255,255,255,0.2); color: #fff; }
  .sb-stage-btn.active .sb-stage-name { color: #fff; }
  .sb-stage-btn.active .sb-stage-count { color: rgba(255,255,255,0.7); }
  .sb-stage-btn.active .sb-site-tag { background: rgba(255,255,255,0.2); color: #fff; }
  .sb-stage-btn.done .sb-stage-num { background: var(--green); color: #fff; }

  .sb-stage-num { width: 24px; height: 24px; border-radius: 6px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 600; color: var(--text2); flex-shrink: 0; }
  .sb-stage-name { font-size: 11px; font-weight: 600; color: var(--text); flex: 1; line-height: 1.3; }
  .sb-stage-count { font-size: 9px; color: var(--text3); font-family: 'JetBrains Mono', monospace; white-space: nowrap; }
  .sb-site-tag { font-size: 7px; font-weight: 700; letter-spacing: 0.5px; padding: 1px 4px; border-radius: 3px; background: var(--pink); color: #fff; flex-shrink: 0; }

  .sb-tasks { padding: 2px 0 4px 0; display: none; }
  .sb-tasks.open { display: block; }
  .sb-task { display: flex; align-items: center; gap: 6px; padding: 4px 8px 4px 44px; cursor: pointer; border-radius: 4px; transition: background 0.1s; }
  .sb-task:hover { background: var(--surface2); }
  .sb-task.active-task { background: rgba(5,150,105,0.08); }
  .sb-task-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--border2); flex-shrink: 0; }
  .sb-task.done-task .sb-task-dot { background: var(--green); }
  .sb-task.active-task .sb-task-dot { background: var(--red); }
  .sb-task-name { font-size: 10.5px; color: var(--text2); line-height: 1.4; flex: 1; }
  .sb-task.done-task .sb-task-name { color: var(--text3); text-decoration: line-through; }
  .sb-task.active-task .sb-task-name { color: var(--text); font-weight: 600; }

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
  .ov-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.15s; }
  .ov-card:hover { border-color: var(--border2); }
  .ov-card h3 { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
  .ov-card p { font-size: 12px; color: var(--text2); line-height: 1.5; }

  /* Stage view */
  .stage-view { padding: 32px 40px; overflow-y: auto; height: 100%; }
  .sv-header { margin-bottom: 28px; }
  .sv-back { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text3); cursor: pointer; border: none; background: none; font-family: 'Inter', sans-serif; padding: 4px 0; margin-bottom: 12px; transition: color 0.15s; }
  .sv-back:hover { color: var(--text2); }
  .sv-back svg { width: 14px; height: 14px; }
  .sv-num-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .sv-num { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; background: var(--red); color: #fff; font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700; }
  .sv-title { font-size: 20px; font-weight: 800; color: var(--text); }
  .sv-site-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 4px; background: var(--pink); color: #fff; }
  .sv-progress { margin-bottom: 28px; }
  .sv-progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .sv-progress-header span { font-size: 11px; color: var(--text3); font-weight: 600; }
  .sv-progress-header .sv-pct { font-family: 'JetBrains Mono', monospace; color: var(--green); font-weight: 700; font-size: 13px; }
  .sv-bar { width: 100%; height: 8px; background: var(--surface2); border-radius: 6px; overflow: hidden; }
  .sv-bar-fill { height: 100%; background: linear-gradient(90deg, var(--green), var(--green2)); border-radius: 6px; transition: width 0.4s ease; }
  .sv-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
  .sv-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px 18px; cursor: pointer; transition: all 0.15s; display: flex; align-items: flex-start; gap: 12px; }
  .sv-card:hover { border-color: var(--border2); transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
  .sv-card.done-card { border-color: var(--green); background: rgba(5,150,105,0.03); }
  .sv-card-num { width: 28px; height: 28px; border-radius: 6px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: var(--text2); flex-shrink: 0; }
  .sv-card.done-card .sv-card-num { background: var(--green); color: #fff; }
  .sv-card-content { flex: 1; min-width: 0; }
  .sv-card-title { font-size: 13px; font-weight: 600; color: var(--text); line-height: 1.4; margin-bottom: 4px; }
  .sv-card.done-card .sv-card-title { text-decoration: line-through; color: var(--text3); }
  .sv-card-status { font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .sv-card.done-card .sv-card-status { color: var(--green); }
  .sv-card-blocks { font-size: 10px; color: var(--text3); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

  /* ===== TASK VIEW ===== */
  .task-view { padding: 32px 40px; overflow-y: auto; height: 100%; max-width: 900px; }
  .tv-back { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text3); cursor: pointer; border: none; background: none; font-family: 'Inter', sans-serif; padding: 4px 0; margin-bottom: 16px; transition: color 0.15s; }
  .tv-back:hover { color: var(--text2); }
  .tv-back svg { width: 14px; height: 14px; }
  .tv-breadcrumb { font-size: 11px; color: var(--text3); margin-bottom: 12px; }
  .tv-breadcrumb strong { color: var(--text2); font-weight: 600; }
  .tv-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 16px; }

  .tv-status-row { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; padding: 14px 18px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; }
  .tv-status-label { font-size: 11px; color: var(--text3); font-weight: 600; }
  .tv-toggle { position: relative; display: inline-flex; align-items: center; cursor: pointer; }
  .tv-toggle input { display: none; }
  .tv-toggle-track { width: 40px; height: 22px; background: var(--surface3); border-radius: 12px; transition: background 0.2s; position: relative; }
  .tv-toggle input:checked + .tv-toggle-track { background: var(--green); }
  .tv-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: #fff; border-radius: 50%; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
  .tv-toggle input:checked ~ .tv-toggle-track .tv-toggle-thumb { transform: translateX(18px); }
  .tv-done-text { font-size: 12px; font-weight: 600; color: var(--text3); }
  .tv-done-text.is-done { color: var(--green); }

  /* ===== CONTENT BLOCKS ===== */
  .blk-area { margin-top: 8px; }
  .blk { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; margin-bottom: 10px; overflow: hidden; transition: border-color 0.15s; }
  .blk:hover { border-color: var(--border2); }
  .blk-header { display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: var(--surface2); border-bottom: 1px solid var(--border); font-size: 11px; }
  .blk-header svg { width: 14px; height: 14px; color: var(--text3); flex-shrink: 0; }
  .blk-type-label { font-weight: 600; color: var(--text2); flex: 1; }
  .blk-action { width: 26px; height: 26px; border: none; border-radius: 5px; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.1s; color: var(--text3); }
  .blk-action:hover { background: var(--surface); color: var(--text2); }
  .blk-action.danger:hover { background: rgba(220,38,38,0.08); color: var(--red); }
  .blk-action svg { width: 13px; height: 13px; }
  .blk-body { padding: 14px; }

  /* Block type inputs */
  .blk-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; transition: border-color 0.15s; }
  .blk-input:focus { border-color: var(--green); }
  .blk-input::placeholder { color: var(--text3); }

  .blk-textarea { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; resize: vertical; min-height: 80px; line-height: 1.6; transition: border-color 0.15s; }
  .blk-textarea:focus { border-color: var(--green); }
  .blk-textarea::placeholder { color: var(--text3); }

  .blk-link-row { display: flex; gap: 8px; align-items: center; }
  .blk-link-row input { flex: 1; }
  .blk-link-open { width: 34px; height: 34px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface); display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text3); transition: all 0.15s; flex-shrink: 0; }
  .blk-link-open:hover { border-color: var(--blue); color: var(--blue); }
  .blk-link-open svg { width: 14px; height: 14px; }
  .blk-link-preview { margin-top: 8px; padding: 8px 12px; background: var(--surface2); border-radius: 6px; font-size: 11px; color: var(--text2); display: flex; align-items: center; gap: 6px; }
  .blk-link-preview svg { width: 12px; height: 12px; color: var(--blue); flex-shrink: 0; }

  /* File upload */
  .blk-dropzone { border: 2px dashed var(--border2); border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; }
  .blk-dropzone:hover, .blk-dropzone.dragover { border-color: var(--green); background: rgba(5,150,105,0.03); }
  .blk-dropzone svg { width: 28px; height: 28px; color: var(--text3); margin-bottom: 8px; }
  .blk-dropzone p { font-size: 12px; color: var(--text3); }
  .blk-dropzone .hint { font-size: 10px; color: var(--text3); margin-top: 4px; }
  .blk-dropzone input { display: none; }
  .blk-file-info { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--surface2); border-radius: 8px; }
  .blk-file-icon { width: 32px; height: 32px; border-radius: 6px; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .blk-file-icon svg { width: 16px; height: 16px; color: var(--text3); }
  .blk-file-details { flex: 1; min-width: 0; }
  .blk-file-name { font-size: 12px; font-weight: 600; color: var(--text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .blk-file-size { font-size: 10px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
  .blk-file-remove { cursor: pointer; color: var(--text3); transition: color 0.15s; }
  .blk-file-remove:hover { color: var(--red); }
  .blk-file-remove svg { width: 14px; height: 14px; }
  .blk-img-preview { margin-top: 10px; max-width: 100%; border-radius: 8px; border: 1px solid var(--border); }

  /* Table */
  .blk-table-wrap { overflow-x: auto; }
  .blk-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .blk-table th, .blk-table td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; min-width: 80px; }
  .blk-table th { background: var(--surface2); font-weight: 600; color: var(--text2); }
  .blk-table td { background: var(--surface); }
  .blk-table input { width: 100%; border: none; background: transparent; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--text); outline: none; padding: 0; }
  .blk-table-actions { display: flex; gap: 6px; margin-top: 8px; }
  .blk-table-btn { padding: 4px 10px; border: 1px solid var(--border); border-radius: 4px; background: var(--surface); font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all 0.15s; }
  .blk-table-btn:hover { border-color: var(--green); color: var(--green); }
  .blk-table-btn.danger:hover { border-color: var(--red); color: var(--red); }

  /* Dropdown */
  .blk-select-row { display: flex; gap: 8px; }
  .blk-select { padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; cursor: pointer; min-width: 140px; }
  .blk-select:focus { border-color: var(--green); }

  /* Number */
  .blk-num-row { display: flex; gap: 8px; align-items: center; }
  .blk-num-input { width: 120px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text); background: var(--surface); outline: none; text-align: center; }
  .blk-num-input:focus { border-color: var(--green); }
  .blk-num-label { font-size: 12px; color: var(--text3); }

  /* Date */
  .blk-date { padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 13px; color: var(--text); background: var(--surface); outline: none; }
  .blk-date:focus { border-color: var(--green); }

  /* Add block bar */
  .blk-add-bar { margin-top: 16px; position: relative; }
  .blk-add-btn { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; border: 2px dashed var(--border2); border-radius: 10px; background: transparent; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all 0.15s; }
  .blk-add-btn:hover { border-color: var(--green); color: var(--green); background: rgba(5,150,105,0.03); }
  .blk-add-btn svg { width: 16px; height: 16px; }

  .blk-picker { display: none; position: absolute; left: 0; right: 0; bottom: 100%; margin-bottom: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 8px; z-index: 50; }
  .blk-picker.open { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
  .blk-picker-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: none; border-radius: 6px; background: transparent; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; color: var(--text2); transition: background 0.1s; text-align: left; }
  .blk-picker-item:hover { background: var(--surface2); }
  .blk-picker-item svg { width: 16px; height: 16px; color: var(--text3); flex-shrink: 0; }
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
    <div class="sb-header">
      <div class="sb-logo-row">
        <img src="/images/rifc-logo-black.png" alt="R IF C" />
        <div>
          <div class="sb-title">Articol Științific</div>
          <div class="sb-subtitle">Validare Empirică R IF C</div>
        </div>
      </div>
    </div>
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
    <div class="sb-nav" id="stages-nav"></div>
  </div>

  <div class="main-area">
    <div class="page-view active" id="view-overview">
      <div class="ov">
        <h1>Studiu de Validare R+(I×F)=C</h1>
        <p class="lead">Plan de cercetare cu 12 etape și 42 de sarcini concrete. Conținutul de pe rifcmarketing.com alimentează direct cercetarea.</p>
        <div class="ov-card" onclick="navigateTo('articol')"><h3>ARTICOL</h3><p>Manuscrisul final OSF — structura completă a articolului științific.</p></div>
        <div class="ov-card" onclick="navigateTo('sondaj')"><h3>SONDAJ ADMIN</h3><p>Administrare sondaj — răspunsuri, statistici, export date.</p></div>
      </div>
    </div>
    <div class="page-view" id="view-articol"><div class="iframe-container"><iframe id="iframe-articol" src="about:blank" title="Articol OSF"></iframe></div></div>
    <div class="page-view" id="view-sondaj"><div class="iframe-container"><iframe id="iframe-sondaj" src="about:blank" title="Sondaj Admin"></iframe></div></div>
    <div class="page-view" id="view-stage"><div class="stage-view" id="stage-content"></div></div>
    <div class="page-view" id="view-task"><div class="task-view" id="task-content"></div></div>
  </div>
</div>

</body>
</html>`;

const ROADMAP_SCRIPT = `
(function() {
  "use strict";

  var ACCESS_CODE = "RIFC2026";
  var STORAGE_KEY = "rifc-articol-access";
  var TASKS_KEY = "rifc-tasks-v4";
  var BLOCKS_KEY = "rifc-blocks-v1";
  var currentView = "overview";
  var activeStageId = null;
  var activeTaskIdx = null;
  var checkedTasks = {};
  var allBlocks = {};
  var pickerOpen = false;

  /* ═══ SVG ICONS ═══ */
  var ICONS = {
    arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>',
    arrowDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    textShort: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>',
    textLong: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
    table: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
    dropdown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
    number: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    externalLink: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
  };

  var BLOCK_TYPES = [
    { key: "text-short", label: "Text Scurt", icon: "textShort" },
    { key: "text-long", label: "Text Lung", icon: "textLong" },
    { key: "link", label: "Link URL", icon: "link" },
    { key: "file", label: "Upload Fișier", icon: "upload" },
    { key: "table", label: "Tabel Editabil", icon: "table" },
    { key: "dropdown", label: "Dropdown Select", icon: "dropdown" },
    { key: "number", label: "Număr / Rating", icon: "number" },
    { key: "date", label: "Data", icon: "calendar" }
  ];

  var DROPDOWN_OPTIONS = {
    "Canal": ["Instagram","Facebook","TikTok","YouTube","LinkedIn","Twitter/X","Email","SMS","Website","Altul"],
    "Limbă": ["RO","EN","RU"],
    "Status": ["Draft","În lucru","Finalizat","Aprobat"],
    "Tip KPI": ["CTR","CPC","CPM","ROI","ROAS","NPS","Altul"]
  };

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
  try { allBlocks = JSON.parse(localStorage.getItem(BLOCKS_KEY) || "{}"); } catch(e) {}
  function saveTasks() { try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(e) {} }
  function saveBlocks() { try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(allBlocks)); } catch(e) {} }

  function getTaskKey(stageId, taskIdx) { return stageId + "-" + taskIdx; }
  function genId() { return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

  function getProgress() {
    var total = 0, done = 0;
    STAGES.forEach(function(s) { s.tasks.forEach(function(t, i) { total++; if (checkedTasks[getTaskKey(s.id, i)]) done++; }); });
    return { total: total, done: done, pct: total > 0 ? Math.round(done / total * 100) : 0 };
  }
  function getStageDone(s) {
    var done = 0; s.tasks.forEach(function(t, i) { if (checkedTasks[getTaskKey(s.id, i)]) done++; }); return done;
  }

  // ═══ BLOCKS CRUD ═══
  function getTaskBlocks(key) { return allBlocks[key] || []; }
  function addBlock(key, type) {
    if (!allBlocks[key]) allBlocks[key] = [];
    var val = null;
    if (type === "table") val = { cols: ["Coloana 1","Coloana 2"], rows: [["",""]] };
    else if (type === "dropdown") val = { category: "", value: "" };
    else if (type === "number") val = 0;
    else if (type === "file") val = null;
    else val = "";
    allBlocks[key].push({ id: genId(), type: type, value: val });
    saveBlocks();
  }
  function updateBlockValue(key, blockId, value) {
    var blocks = allBlocks[key] || [];
    for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === blockId) { blocks[i].value = value; break; } }
    saveBlocks();
  }
  function deleteBlock(key, blockId) {
    var blocks = allBlocks[key] || [];
    allBlocks[key] = blocks.filter(function(b) { return b.id !== blockId; });
    saveBlocks();
  }
  function moveBlock(key, blockId, dir) {
    var blocks = allBlocks[key] || [];
    var idx = -1;
    for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === blockId) { idx = i; break; } }
    if (idx < 0) return;
    var newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    var tmp = blocks[idx]; blocks[idx] = blocks[newIdx]; blocks[newIdx] = tmp;
    saveBlocks();
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
      if (s.separate) html += '<div class="sb-prep-label">Pregătire internă</div>';
      if (idx === 1) html += '<div class="sb-separator"></div>';
      html += '<div class="sb-stage">';
      html += '<button class="sb-stage-btn' + (isActive ? ' active' : '') + (allDone ? ' done' : '') + '" data-stage="' + s.id + '">';
      html += '<div class="sb-stage-num">' + s.num + '</div>';
      html += '<div class="sb-stage-name">' + s.name + '</div>';
      html += '<span class="sb-stage-count">' + sDone + '/' + sTotal + '</span>';
      if (s.site) html += '<span class="sb-site-tag">SITE</span>';
      html += '</button>';
      html += '<div class="sb-tasks' + (isActive ? ' open' : '') + '">';
      s.tasks.forEach(function(t, ti) {
        var key = getTaskKey(s.id, ti);
        var isDone = !!checkedTasks[key];
        var isTaskActive = activeStageId === s.id && activeTaskIdx === ti;
        var cls = 'sb-task'; if (isDone) cls += ' done-task'; if (isTaskActive) cls += ' active-task';
        html += '<div class="' + cls + '" data-stage="' + s.id + '" data-task="' + ti + '">';
        html += '<div class="sb-task-dot"></div><span class="sb-task-name">' + t + '</span></div>';
      });
      html += '</div></div>';
    });
    nav.innerHTML = html;
    bindNavEvents();
    updateProgress();
  }

  function updateProgress() {
    var p = getProgress();
    var pctEl = document.getElementById("pct-text"); var barEl = document.getElementById("bar-fill"); var statsEl = document.getElementById("stats-text");
    if (pctEl) pctEl.textContent = p.pct + "%";
    if (barEl) barEl.style.width = p.pct + "%";
    if (statsEl) statsEl.textContent = p.done + "/" + p.total + " sarcini";
  }

  function bindNavEvents() {
    document.querySelectorAll(".sb-stage-btn").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var sid = btn.getAttribute("data-stage");
        activeTaskIdx = null;
        if (activeStageId === sid && currentView === "stage") { activeStageId = null; showView("overview"); }
        else { activeStageId = sid; showView("stage"); renderStageView(sid); }
        renderNav();
      });
    });
    document.querySelectorAll(".sb-task").forEach(function(task) {
      task.addEventListener("click", function(e) {
        e.stopPropagation();
        var sid = task.getAttribute("data-stage"); var tid = parseInt(task.getAttribute("data-task"), 10);
        activeStageId = sid; activeTaskIdx = tid;
        showView("task"); renderTaskView(sid, tid); renderNav();
      });
    });
  }

  // ═══ STAGE VIEW ═══
  function renderStageView(stageId) {
    var container = document.getElementById("stage-content"); if (!container) return;
    var stage = null;
    for (var i = 0; i < STAGES.length; i++) { if (STAGES[i].id === stageId) { stage = STAGES[i]; break; } }
    if (!stage) return;
    var sDone = getStageDone(stage); var sTotal = stage.tasks.length;
    var sPct = sTotal > 0 ? Math.round(sDone / sTotal * 100) : 0;
    var html = '<div class="sv-header">';
    html += '<button class="sv-back" id="stage-back-btn">' + ICONS.arrowLeft + ' Înapoi</button>';
    html += '<div class="sv-num-row"><div class="sv-num">' + stage.num + '</div><div class="sv-title">' + stage.name + '</div>';
    if (stage.site) html += '<span class="sv-site-tag">SITE</span>';
    html += '</div></div>';
    html += '<div class="sv-progress"><div class="sv-progress-header"><span>Progres etapă</span><span class="sv-pct">' + sPct + '%</span></div>';
    html += '<div class="sv-bar"><div class="sv-bar-fill" style="width:' + sPct + '%"></div></div>';
    html += '<div style="display:flex;justify-content:space-between;margin-top:4px;font-size:10px;color:var(--text3);font-family:JetBrains Mono,monospace;">';
    html += '<span>' + sDone + '/' + sTotal + ' sarcini finalizate</span>';
    if (sDone === sTotal && sTotal > 0) html += '<span style="color:var(--green);font-weight:600;">Etapă completă</span>';
    html += '</div></div>';
    html += '<div class="sv-cards">';
    stage.tasks.forEach(function(t, ti) {
      var key = getTaskKey(stage.id, ti); var isDone = !!checkedTasks[key];
      var nBlocks = getTaskBlocks(key).length;
      html += '<div class="sv-card' + (isDone ? ' done-card' : '') + '" data-stage="' + stage.id + '" data-task="' + ti + '">';
      html += '<div class="sv-card-num">' + (ti + 1) + '</div><div class="sv-card-content">';
      html += '<div class="sv-card-title">' + t + '</div>';
      html += '<div class="sv-card-status">' + (isDone ? 'Finalizat' : 'În așteptare') + '</div>';
      if (nBlocks > 0) html += '<div class="sv-card-blocks">' + nBlocks + ' bloc' + (nBlocks > 1 ? 'uri' : '') + '</div>';
      html += '</div></div>';
    });
    html += '</div>';
    container.innerHTML = html;
    document.getElementById("stage-back-btn").addEventListener("click", function() {
      activeStageId = null; activeTaskIdx = null; showView("overview"); renderNav();
    });
    container.querySelectorAll(".sv-card").forEach(function(card) {
      card.addEventListener("click", function() {
        var sid = card.getAttribute("data-stage"); var tid = parseInt(card.getAttribute("data-task"), 10);
        activeStageId = sid; activeTaskIdx = tid; showView("task"); renderTaskView(sid, tid); renderNav();
      });
    });
  }

  // ═══ TASK VIEW ═══
  function renderTaskView(stageId, taskIdx) {
    var container = document.getElementById("task-content"); if (!container) return;
    var stage = null;
    for (var i = 0; i < STAGES.length; i++) { if (STAGES[i].id === stageId) { stage = STAGES[i]; break; } }
    if (!stage || taskIdx < 0 || taskIdx >= stage.tasks.length) return;
    var taskName = stage.tasks[taskIdx];
    var key = getTaskKey(stageId, taskIdx);
    var isDone = !!checkedTasks[key];
    var html = '';
    html += '<button class="tv-back" id="task-back-btn">' + ICONS.arrowLeft + ' Înapoi la Etapa ' + stage.num + '</button>';
    html += '<div class="tv-breadcrumb">Etapa ' + stage.num + ' — <strong>' + stage.name + '</strong> — Sarcina ' + (taskIdx + 1) + '/' + stage.tasks.length + '</div>';
    html += '<div class="tv-title">' + taskName + '</div>';
    html += '<div class="tv-status-row"><span class="tv-status-label">Status:</span>';
    html += '<label class="tv-toggle"><input type="checkbox" id="task-done-check"' + (isDone ? ' checked' : '') + ' />';
    html += '<div class="tv-toggle-track"><div class="tv-toggle-thumb"></div></div></label>';
    html += '<span class="tv-done-text' + (isDone ? ' is-done' : '') + '" id="task-done-label">' + (isDone ? 'Finalizat' : 'În lucru') + '</span></div>';

    // Blocks area
    html += '<div class="blk-area" id="blocks-area"></div>';
    container.innerHTML = html;

    // Bind back
    document.getElementById("task-back-btn").addEventListener("click", function() {
      activeTaskIdx = null; showView("stage"); renderStageView(stageId); renderNav();
    });
    // Bind toggle
    var checkbox = document.getElementById("task-done-check");
    if (checkbox) {
      checkbox.addEventListener("change", function() {
        checkedTasks[key] = checkbox.checked; saveTasks();
        var label = document.getElementById("task-done-label");
        if (label) { label.textContent = checkbox.checked ? "Finalizat" : "În lucru"; label.className = "tv-done-text" + (checkbox.checked ? " is-done" : ""); }
        updateProgress(); renderNav();
      });
    }
    // Render blocks
    renderBlocks(key);
  }

  // ═══ RENDER BLOCKS ═══
  function renderBlocks(key) {
    var area = document.getElementById("blocks-area"); if (!area) return;
    var blocks = getTaskBlocks(key);
    var html = '';
    blocks.forEach(function(block, idx) {
      var typeDef = null;
      for (var t = 0; t < BLOCK_TYPES.length; t++) { if (BLOCK_TYPES[t].key === block.type) { typeDef = BLOCK_TYPES[t]; break; } }
      if (!typeDef) return;
      html += '<div class="blk" data-blk-id="' + block.id + '">';
      html += '<div class="blk-header">' + ICONS[typeDef.icon] + '<span class="blk-type-label">' + typeDef.label + '</span>';
      if (idx > 0) html += '<button class="blk-action" data-action="up" data-blk="' + block.id + '" title="Mută sus">' + ICONS.arrowUp + '</button>';
      if (idx < blocks.length - 1) html += '<button class="blk-action" data-action="down" data-blk="' + block.id + '" title="Mută jos">' + ICONS.arrowDown + '</button>';
      html += '<button class="blk-action danger" data-action="delete" data-blk="' + block.id + '" title="Șterge">' + ICONS.trash + '</button>';
      html += '</div>';
      html += '<div class="blk-body">' + renderBlockBody(block) + '</div>';
      html += '</div>';
    });

    // Add block button + picker
    html += '<div class="blk-add-bar">';
    html += '<div class="blk-picker" id="blk-picker">';
    BLOCK_TYPES.forEach(function(bt) {
      html += '<button class="blk-picker-item" data-add-type="' + bt.key + '">' + ICONS[bt.icon] + bt.label + '</button>';
    });
    html += '</div>';
    html += '<button class="blk-add-btn" id="blk-add-btn">' + ICONS.plus + 'Adaugă bloc</button>';
    html += '</div>';

    area.innerHTML = html;
    bindBlockEvents(key);
  }

  function renderBlockBody(block) {
    var val = block.value;
    switch (block.type) {
      case "text-short":
        return '<input class="blk-input" type="text" data-blk-val="' + block.id + '" value="' + escAttr(val || '') + '" placeholder="Introduceți text..." />';

      case "text-long":
        return '<textarea class="blk-textarea" data-blk-val="' + block.id + '" placeholder="Introduceți text detaliat...">' + escHtml(val || '') + '</textarea>';

      case "link":
        var domain = "";
        try { if (val && val.indexOf("://") !== -1) domain = val.split("://")[1].split("/")[0]; } catch(e) {}
        var h = '<div class="blk-link-row"><input class="blk-input" type="url" data-blk-val="' + block.id + '" value="' + escAttr(val || '') + '" placeholder="https://..." />';
        h += '<button class="blk-link-open" data-link-open="' + block.id + '" title="Deschide link">' + ICONS.externalLink + '</button></div>';
        if (domain) h += '<div class="blk-link-preview">' + ICONS.globe + '<span>' + escHtml(domain) + '</span></div>';
        return h;

      case "file":
        if (val && val.data) {
          var isImg = val.type && val.type.indexOf("image/") === 0;
          var h = '<div class="blk-file-info">';
          h += '<div class="blk-file-icon">' + ICONS.file + '</div>';
          h += '<div class="blk-file-details"><div class="blk-file-name">' + escHtml(val.name) + '</div>';
          h += '<div class="blk-file-size">' + formatSize(val.size) + '</div></div>';
          h += '<div class="blk-file-remove" data-file-remove="' + block.id + '">' + ICONS.x + '</div></div>';
          if (isImg) h += '<img class="blk-img-preview" src="' + val.data + '" alt="Preview" />';
          return h;
        }
        return '<div class="blk-dropzone" data-dropzone="' + block.id + '">' + ICONS.upload + '<p>Click sau drag & drop</p><p class="hint">img, pdf, csv, audio, video, doc (max 1MB)</p><input type="file" data-file-input="' + block.id + '" accept="image/*,.pdf,.csv,.doc,.docx,.xls,.xlsx,.mp3,.mp4,.wav,.webm" /></div>';

      case "table":
        if (!val || !val.cols) val = { cols: ["Coloana 1","Coloana 2"], rows: [["",""]] };
        var h = '<div class="blk-table-wrap"><table class="blk-table"><thead><tr>';
        val.cols.forEach(function(c, ci) {
          h += '<th><input type="text" value="' + escAttr(c) + '" data-tbl-col="' + block.id + '" data-col-idx="' + ci + '" /></th>';
        });
        h += '</tr></thead><tbody>';
        val.rows.forEach(function(row, ri) {
          h += '<tr>';
          row.forEach(function(cell, ci) {
            h += '<td><input type="text" value="' + escAttr(cell) + '" data-tbl-cell="' + block.id + '" data-row="' + ri + '" data-col="' + ci + '" /></td>';
          });
          h += '</tr>';
        });
        h += '</tbody></table></div>';
        h += '<div class="blk-table-actions">';
        h += '<button class="blk-table-btn" data-tbl-add-row="' + block.id + '">+ Rând</button>';
        h += '<button class="blk-table-btn" data-tbl-add-col="' + block.id + '">+ Coloană</button>';
        if (val.rows.length > 1) h += '<button class="blk-table-btn danger" data-tbl-del-row="' + block.id + '">- Rând</button>';
        if (val.cols.length > 1) h += '<button class="blk-table-btn danger" data-tbl-del-col="' + block.id + '">- Coloană</button>';
        h += '</div>';
        return h;

      case "dropdown":
        if (!val || typeof val !== "object") val = { category: "", value: "" };
        var h = '<div class="blk-select-row">';
        h += '<select class="blk-select" data-dd-cat="' + block.id + '">';
        h += '<option value="">— Categorie —</option>';
        Object.keys(DROPDOWN_OPTIONS).forEach(function(cat) {
          h += '<option value="' + cat + '"' + (val.category === cat ? ' selected' : '') + '>' + cat + '</option>';
        });
        h += '</select>';
        h += '<select class="blk-select" data-dd-val="' + block.id + '"' + (!val.category ? ' disabled' : '') + '>';
        h += '<option value="">— Valoare —</option>';
        if (val.category && DROPDOWN_OPTIONS[val.category]) {
          DROPDOWN_OPTIONS[val.category].forEach(function(opt) {
            h += '<option value="' + opt + '"' + (val.value === opt ? ' selected' : '') + '>' + opt + '</option>';
          });
        }
        h += '</select></div>';
        return h;

      case "number":
        return '<div class="blk-num-row"><input class="blk-num-input" type="number" data-blk-val="' + block.id + '" value="' + (val || 0) + '" step="any" /><span class="blk-num-label">valoare numerică</span></div>';

      case "date":
        return '<input class="blk-date" type="date" data-blk-val="' + block.id + '" value="' + escAttr(val || '') + '" />';

      default: return '<em style="color:var(--text3);font-size:12px;">Tip necunoscut</em>';
    }
  }

  // ═══ BLOCK EVENTS ═══
  function bindBlockEvents(key) {
    // Add block picker toggle
    var addBtn = document.getElementById("blk-add-btn");
    var picker = document.getElementById("blk-picker");
    if (addBtn && picker) {
      addBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        pickerOpen = !pickerOpen;
        picker.classList.toggle("open", pickerOpen);
      });
    }

    // Close picker on outside click
    document.addEventListener("click", function() { if (pickerOpen) { pickerOpen = false; var p = document.getElementById("blk-picker"); if (p) p.classList.remove("open"); } });

    // Picker items — add block
    document.querySelectorAll("[data-add-type]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        var type = btn.getAttribute("data-add-type");
        addBlock(key, type);
        pickerOpen = false;
        renderBlocks(key);
      });
    });

    // Move / Delete actions
    document.querySelectorAll("[data-action]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        var action = btn.getAttribute("data-action");
        var bid = btn.getAttribute("data-blk");
        if (action === "delete") { deleteBlock(key, bid); renderBlocks(key); renderNav(); }
        else if (action === "up") { moveBlock(key, bid, -1); renderBlocks(key); }
        else if (action === "down") { moveBlock(key, bid, 1); renderBlocks(key); }
      });
    });

    // Text-short, text-long, number, date, link — auto-save on input
    document.querySelectorAll("[data-blk-val]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-blk-val");
          var v = input.value;
          if (input.type === "number") v = parseFloat(v) || 0;
          updateBlockValue(key, bid, v);
        }, 300);
      });
    });

    // Link — open button
    document.querySelectorAll("[data-link-open]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-link-open");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid && blocks[i].value) {
            var url = blocks[i].value;
            if (url && url.indexOf("://") === -1) url = "https://" + url;
            try { window.open(url, "_blank"); } catch(e) {}
            break;
          }
        }
      });
    });

    // Link — update preview on blur
    document.querySelectorAll('input[type="url"][data-blk-val]').forEach(function(input) {
      input.addEventListener("blur", function() { renderBlocks(key); });
    });

    // File — dropzone
    document.querySelectorAll("[data-dropzone]").forEach(function(zone) {
      var bid = zone.getAttribute("data-dropzone");
      var fileInput = document.querySelector('[data-file-input="' + bid + '"]');
      zone.addEventListener("click", function() { if (fileInput) fileInput.click(); });
      zone.addEventListener("dragover", function(e) { e.preventDefault(); zone.classList.add("dragover"); });
      zone.addEventListener("dragleave", function() { zone.classList.remove("dragover"); });
      zone.addEventListener("drop", function(e) { e.preventDefault(); zone.classList.remove("dragover"); if (e.dataTransfer.files.length) handleFileUpload(key, bid, e.dataTransfer.files[0]); });
      if (fileInput) { fileInput.addEventListener("change", function() { if (fileInput.files.length) handleFileUpload(key, bid, fileInput.files[0]); }); }
    });

    // File — remove
    document.querySelectorAll("[data-file-remove]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-file-remove");
        updateBlockValue(key, bid, null);
        renderBlocks(key);
      });
    });

    // Table — cell edits
    document.querySelectorAll("[data-tbl-cell]").forEach(function(input) {
      input.addEventListener("input", function() {
        var bid = input.getAttribute("data-tbl-cell");
        var ri = parseInt(input.getAttribute("data-row"), 10);
        var ci = parseInt(input.getAttribute("data-col"), 10);
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            blocks[i].value.rows[ri][ci] = input.value;
            saveBlocks();
            break;
          }
        }
      });
    });
    // Table — col header edits
    document.querySelectorAll("[data-tbl-col]").forEach(function(input) {
      input.addEventListener("input", function() {
        var bid = input.getAttribute("data-tbl-col");
        var ci = parseInt(input.getAttribute("data-col-idx"), 10);
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            blocks[i].value.cols[ci] = input.value;
            saveBlocks();
            break;
          }
        }
      });
    });
    // Table — add row
    document.querySelectorAll("[data-tbl-add-row]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-add-row");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            var nCols = blocks[i].value.cols.length;
            var newRow = []; for (var c = 0; c < nCols; c++) newRow.push("");
            blocks[i].value.rows.push(newRow);
            saveBlocks(); renderBlocks(key);
            break;
          }
        }
      });
    });
    // Table — add col
    document.querySelectorAll("[data-tbl-add-col]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-add-col");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            blocks[i].value.cols.push("Coloana " + (blocks[i].value.cols.length + 1));
            blocks[i].value.rows.forEach(function(r) { r.push(""); });
            saveBlocks(); renderBlocks(key);
            break;
          }
        }
      });
    });
    // Table — delete last row
    document.querySelectorAll("[data-tbl-del-row]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-del-row");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid && blocks[i].value.rows.length > 1) {
            blocks[i].value.rows.pop();
            saveBlocks(); renderBlocks(key);
            break;
          }
        }
      });
    });
    // Table — delete last col
    document.querySelectorAll("[data-tbl-del-col]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-del-col");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid && blocks[i].value.cols.length > 1) {
            blocks[i].value.cols.pop();
            blocks[i].value.rows.forEach(function(r) { r.pop(); });
            saveBlocks(); renderBlocks(key);
            break;
          }
        }
      });
    });

    // Dropdown — category change
    document.querySelectorAll("[data-dd-cat]").forEach(function(sel) {
      sel.addEventListener("change", function() {
        var bid = sel.getAttribute("data-dd-cat");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            blocks[i].value = { category: sel.value, value: "" };
            saveBlocks(); renderBlocks(key);
            break;
          }
        }
      });
    });
    // Dropdown — value change
    document.querySelectorAll("[data-dd-val]").forEach(function(sel) {
      sel.addEventListener("change", function() {
        var bid = sel.getAttribute("data-dd-val");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            blocks[i].value.value = sel.value;
            saveBlocks();
            break;
          }
        }
      });
    });
  }

  // ═══ FILE UPLOAD ═══
  function handleFileUpload(key, blockId, file) {
    if (file.size > 1048576) {
      alert("Fișierul depășește limita de 1MB.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      updateBlockValue(key, blockId, { name: file.name, size: file.size, type: file.type, data: data });
      renderBlocks(key);
    };
    reader.readAsDataURL(file);
  }

  // ═══ HELPERS ═══
  function escHtml(s) { return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function escAttr(s) { return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  }

  // ═══ VIEW MANAGEMENT ═══
  function showView(view) {
    currentView = view;
    document.querySelectorAll(".page-view").forEach(function(v) { v.classList.remove("active"); });
    var target = document.getElementById("view-" + view);
    if (target) target.classList.add("active");
    updateButtons();
    if (view === "articol" || view === "sondaj") loadIframeIfNeeded(view);
  }
  function updateButtons() {
    var a = document.getElementById("btn-articol"); var s = document.getElementById("btn-sondaj");
    if (a) a.classList.toggle("active", currentView === "articol");
    if (s) s.classList.toggle("active", currentView === "sondaj");
  }
  function loadIframeIfNeeded(view) {
    if (view === "articol") { var f = document.getElementById("iframe-articol"); if (f && (!f.src || f.src === "about:blank" || f.src.indexOf("/osf") === -1)) f.src = "/articolstiintific/osf"; }
    else if (view === "sondaj") { var f2 = document.getElementById("iframe-sondaj"); if (f2 && (!f2.src || f2.src === "about:blank" || f2.src.indexOf("/sondaj") === -1)) f2.src = "/articolstiintific/sondaj"; }
  }

  window.navigateTo = function(view) {
    activeStageId = null; activeTaskIdx = null; showView(view); updateParentUrl(view); renderNav();
  };
  function updateParentUrl(view) {
    try { var p = window.parent || window; var base = "/articolstiintific";
      var path = view === "articol" ? base + "/osf" : view === "sondaj" ? base + "/sondaj" : base;
      if (p.history && p.history.pushState) p.history.pushState({view: view}, "", path);
    } catch(e) {}
  }
  function detectRouteFromParent() {
    try { var pp = ""; try { pp = window.parent.location.pathname; } catch(e) { pp = window.location.pathname; }
      if (pp.indexOf("/osf") !== -1) currentView = "articol";
      else if (pp.indexOf("/sondaj") !== -1) currentView = "sondaj";
      else currentView = "overview";
      showView(currentView);
    } catch(e) {}
  }

  // ═══ ACCESS ═══
  function initAccess() {
    var saved = null; try { saved = localStorage.getItem(STORAGE_KEY); } catch(e) {}
    if (saved === ACCESS_CODE) { grantAccess(); }
    var input = document.getElementById("access-input");
    if (input) { input.addEventListener("keydown", function(e) { if (e.key === "Enter") checkAccess(); }); }
  }
  window.checkAccess = function() {
    var input = document.getElementById("access-input"); var errorEl = document.getElementById("access-error");
    if (!input) return;
    if (input.value.trim() === ACCESS_CODE) { try { localStorage.setItem(STORAGE_KEY, ACCESS_CODE); } catch(e) {} grantAccess(); }
    else { if (errorEl) errorEl.textContent = "Cod incorect."; input.value = ""; input.focus(); }
  };
  function grantAccess() {
    var gate = document.getElementById("access-gate"); var app = document.getElementById("app");
    if (gate) gate.style.display = "none"; if (app) app.style.display = "block";
    renderNav(); detectRouteFromParent();
  }

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
