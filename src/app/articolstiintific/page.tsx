"use client";

import { useRef, useEffect } from "react";

// ============================================================
// R IF C — Articol Științific v7 — content blocks system
// 11 etape, 49 sarcini — each task has addable content blocks
// 9 block types: text-short, text-long, link, file, table,
//                dropdown, number, date, code
// Trilingual: RO / EN / RU on all text block types
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
  .sb-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; transition: opacity 0.15s; }
  .sb-logo-row:hover { opacity: 0.75; }
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
  .sb-btn.blue { background: var(--blue); }
  .sb-btn.amber { background: var(--amber); }
  .sb-backup-row { display: flex; gap: 5px; }
  .sb-backup-row .sb-btn { flex: 1; font-size: 10px; padding: 7px 8px; }
  .sb-backup-row .sb-btn svg { width: 14px; height: 14px; }
  .sb-sync-status { font-size: 9px; color: var(--text3); text-align: center; padding: 0 14px 4px; font-family: 'JetBrains Mono', monospace; }
  .sb-sync-status.ok { color: var(--green); }
  .sb-sync-status.err { color: var(--red); }
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
  .sv-card-bar { width: 100%; height: 4px; background: var(--surface2); border-radius: 3px; margin-top: 8px; overflow: hidden; }
  .sv-card-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s ease; }
  .sv-card-bar-fill.empty { background: var(--border2); width: 0%; }
  .sv-card-bar-fill.partial { background: linear-gradient(90deg, var(--amber), #f59e0b); }
  .sv-card-bar-fill.full { background: linear-gradient(90deg, var(--green), var(--green2)); }

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
  .blk-action.edit:hover { background: rgba(37,99,235,0.08); color: #3B82F6; }
  .blk-action.save:hover { background: rgba(5,150,105,0.08); color: var(--green); }
  .blk-action.cancel:hover { background: rgba(220,38,38,0.08); color: var(--red); }
  .blk-action svg { width: 13px; height: 13px; }
  .blk.editing { border-color: var(--green); }
  .blk-view-text { font-size: 13px; color: var(--text); line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
  .blk-view-text.empty { color: var(--text3); font-style: italic; }
  .blk-view-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: #3B82F6; text-decoration: none; }
  .blk-view-link:hover { text-decoration: underline; }
  .blk-view-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .blk-view-table th, .blk-view-table td { border: 1px solid var(--border); padding: 6px 10px; text-align: left; }
  .blk-view-table th { background: var(--surface2); font-weight: 600; color: var(--text2); }
  .blk-view-table td { color: var(--text); }
  .blk-view-code { background: var(--surface); border: 1px solid var(--border); border-radius: 6px; padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text); white-space: pre-wrap; overflow-x: auto; line-height: 1.5; }
  .blk-view-num { display: flex; align-items: center; gap: 12px; font-size: 13px; }
  .blk-view-num-val { font-size: 22px; font-weight: 700; color: var(--green); }
  .blk-view-num-label { color: var(--text2); }
  .blk-view-dd { font-size: 13px; color: var(--text); }
  .blk-view-dd-cat { font-weight: 600; color: var(--text2); margin-right: 8px; }
  .blk-sync-indicator { font-size: 10px; color: var(--green); margin-left: 8px; opacity: 0; transition: opacity 0.3s; }
  .blk-sync-indicator.show { opacity: 1; }
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
  .blk-num-wrap { display: flex; flex-direction: column; gap: 8px; }
  .blk-num-title { width: 100%; padding: 7px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 12px; color: var(--text); background: var(--surface); outline: none; transition: border-color 0.15s; }
  .blk-num-title:focus { border-color: var(--green); }
  .blk-num-title::placeholder { color: var(--text3); }
  .blk-num-row { display: flex; gap: 8px; align-items: center; }
  .blk-num-input { width: 160px; padding: 8px 12px; border: 1px solid var(--border); border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--text); background: var(--surface); outline: none; text-align: center; }
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

  /* Code block */
  .blk-code-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
  .blk-code-lang { padding: 5px 10px; border: 1px solid var(--border); border-radius: 5px; font-family: 'Inter', sans-serif; font-size: 11px; color: var(--text2); background: var(--surface); outline: none; cursor: pointer; }
  .blk-code-lang:focus { border-color: var(--green); }
  .blk-code-copy { display: flex; align-items: center; gap: 4px; padding: 5px 10px; border: 1px solid var(--border); border-radius: 5px; background: var(--surface); font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; color: var(--text3); cursor: pointer; transition: all 0.15s; margin-left: auto; }
  .blk-code-copy:hover { border-color: var(--green); color: var(--green); }
  .blk-code-copy.copied { border-color: var(--green); color: var(--green); }
  .blk-code-copy svg { width: 12px; height: 12px; }
  .blk-code-area { width: 100%; min-height: 120px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 8px; font-family: 'JetBrains Mono', monospace; font-size: 12px; line-height: 1.7; color: #1e293b; background: #f8fafc; outline: none; resize: vertical; tab-size: 2; white-space: pre; overflow-x: auto; }
  .blk-code-area:focus { border-color: var(--green); background: #f1f5f9; }
  .blk-code-area::placeholder { color: var(--text3); font-style: italic; }

  /* Language tabs */
  .blk-lang-tabs { display: flex; gap: 2px; margin-bottom: 10px; background: var(--surface2); border-radius: 6px; padding: 2px; }
  .blk-lang-tab { flex: 1; padding: 5px 8px; border: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; background: transparent; color: var(--text3); text-align: center; }
  .blk-lang-tab:hover { color: var(--text2); }
  .blk-lang-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .blk-lang-tab.ro.active { color: var(--blue); }
  .blk-lang-tab.en.active { color: var(--green); }
  .blk-lang-tab.ru.active { color: var(--red); }
  .blk-lang-panel { display: none; }
  .blk-lang-panel.active { display: block; }
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
      <a href="https://www.rifcmarketing.com" target="_blank" rel="noopener noreferrer" class="sb-logo-row" style="text-decoration:none;color:inherit;cursor:pointer;">
        <img src="/images/rifc-logo-black.png" alt="R IF C" />
        <div>
          <div class="sb-title">Articol Științific</div>
          <div class="sb-subtitle">Validare Empirică R IF C</div>
        </div>
      </a>
    </div>
    <div class="sb-progress">
      <div class="sb-progress-label">
        <span>Progres Total</span>
        <span class="pct" id="pct-text">0%</span>
      </div>
      <div class="sb-bar"><div class="sb-bar-fill" id="bar-fill" style="width:0%"></div></div>
      <div class="sb-progress-stats">
        <span id="stats-text">0/49 sarcini</span>
        <span>11 etape</span>
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
      <div class="sb-backup-row">
        <button class="sb-btn blue" onclick="exportBackup()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          SALVARE
        </button>
        <button class="sb-btn amber" onclick="importBackup()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          RESTAURARE
        </button>
      </div>
      <button class="sb-btn green" onclick="forceSync()" style="font-size:10px;padding:6px 8px;margin-top:3px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
        FORCE SYNC
      </button>
      <div class="sb-sync-status" id="sync-status"></div>
      <button class="sb-btn amber" id="btn-aplicare" onclick="window.location.href='/articolstiintific/aplicare'" style="margin-top:8px;">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/><path d="m9 9.5 2 2 4-4"/></svg>
        APLICARE PROGRAME
      </button>
    </div>
    <div class="sb-nav" id="stages-nav"></div>
  </div>

  <div class="main-area">
    <div class="page-view active" id="view-overview">
      <div class="ov">
        <h1>Studiu de Validare R+(I×F)=C</h1>
        <p class="lead">Plan de cercetare cu 11 etape și 49 de sarcini concrete. Conținutul de pe rifcmarketing.com alimentează direct cercetarea.</p>
        <div class="ov-card" onclick="navigateTo('articol')"><h3>ARTICOL</h3><p>Manuscrisul final OSF — structura completă a articolului științific.</p></div>
        <div class="ov-card" onclick="navigateTo('sondaj')"><h3>SONDAJ ADMIN</h3><p>Administrare sondaj — răspunsuri, statistici, export date.</p></div>
      </div>
    </div>
    <div class="page-view" id="view-articol"><div class="iframe-container"><iframe id="iframe-articol" src="about:blank" title="Articol OSF"></iframe></div></div>
    <div class="page-view" id="view-sondaj"><div class="iframe-container"><iframe id="iframe-sondaj" src="about:blank" title="Sondaj Admin"></iframe></div></div>
    <div class="page-view" id="view-aplicare"><div class="iframe-container"><iframe id="iframe-aplicare" src="about:blank" title="Aplicare Programe"></iframe></div></div>
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

  // ═══ BASE URL — iframe runs in about:blank, relative URLs don't work ═══
  var BASE_URL = "";
  try { BASE_URL = window.parent.location.origin; } catch(e) {
    try { BASE_URL = window.location.origin; } catch(e2) { BASE_URL = ""; }
  }
  if (BASE_URL === "about:" || BASE_URL === "null" || !BASE_URL) BASE_URL = "https://rifcmarketing.vercel.app";
  var currentView = "overview";
  var activeStageId = null;
  var activeTaskIdx = null;
  var checkedTasks = {};
  var allBlocks = {};
  var pickerOpen = false;
  var blockLangTab = {}; // tracks active lang tab per block: { blockId: "ro"|"en"|"ru" }
  var editingBlocks = {}; // tracks which blocks are in edit mode: { blockId: true }
  var editingSnapshots = {}; // stores original value before editing: { blockId: deepCopy }
  var LANGS = ["ro", "en", "ru"];
  var LANG_LABELS = { ro: "RO", en: "EN", ru: "RU" };
  // Block types that support trilingual content
  var TRILINGUAL_TYPES = ["text-short", "text-long", "link", "code", "table", "number"];

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
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>',
    save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>',
    cancelX: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
  };

  var BLOCK_TYPES = [
    { key: "text-short", label: "Text Scurt", icon: "textShort" },
    { key: "text-long", label: "Text Lung", icon: "textLong" },
    { key: "link", label: "Link URL", icon: "link" },
    { key: "file", label: "Upload Fișier", icon: "upload" },
    { key: "table", label: "Tabel Editabil", icon: "table" },
    { key: "dropdown", label: "Dropdown Select", icon: "dropdown" },
    { key: "number", label: "Număr / Rating", icon: "number" },
    { key: "date", label: "Data", icon: "calendar" },
    { key: "code", label: "Cod", icon: "code" }
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
  function saveTasks() { try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(e) {} syncToServer("tasks"); }
  function saveBlocks() { try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(allBlocks)); } catch(e) {} syncToServer("blocks"); }

  // ═══ SYNC STATUS ═══
  function showSyncStatus(msg, type) {
    var el = document.getElementById("sync-status");
    if (!el) return;
    el.textContent = msg;
    el.className = "sb-sync-status" + (type === "ok" ? " ok" : type === "err" ? " err" : "");
    if (type) setTimeout(function() { el.textContent = ""; el.className = "sb-sync-status"; }, 8000);
  }

  // ═══ SUPABASE SYNC ═══
  var _syncDebounce = null;
  function syncToServer(what) {
    clearTimeout(_syncDebounce);
    _syncDebounce = setTimeout(function() {
      var payload = {};
      if (what === "tasks" || what === "both") payload.tasks = checkedTasks;
      if (what === "blocks" || what === "both") payload.blocks = allBlocks;
      showSyncStatus("Se trimite... (" + Object.keys(allBlocks).length + " blocuri)", "");
      fetch(BASE_URL + "/api/article/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function(r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
        .then(function(result) {
          if (result.success) showSyncStatus("Sincronizat OK (" + Object.keys(allBlocks).length + " bl)", "ok");
          else showSyncStatus("Eroare: " + (result.error || "?"), "err");
        })
        .catch(function(err) { showSyncStatus("Sync eroare: " + err.message, "err"); });
    }, 300);
  }

  // Force sync — bypass debounce, direct push ALL data
  window.forceSync = function() {
    showSyncStatus("FORCE SYNC...", "");
    var payload = { tasks: checkedTasks, blocks: allBlocks };
    fetch(BASE_URL + "/api/article/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function(r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function(result) {
      if (result.success) {
        var tCount = Object.keys(checkedTasks).length;
        var bCount = Object.keys(allBlocks).length;
        showSyncStatus("FORCE OK: " + tCount + "t " + bCount + "b", "ok");
      } else {
        showSyncStatus("FORCE EROARE: " + (result.error || "?"), "err");
      }
    }).catch(function(err) {
      showSyncStatus("FORCE FAIL: " + err.message, "err");
    });
  };

  function loadFromServer(callback) {
    fetch(BASE_URL + "/api/article/progress")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.success) callback(data.tasks || {}, data.blocks || {});
        else callback(null, null);
      })
      .catch(function() { callback(null, null); });
  }

  // Load Git-tracked seed file as last-resort fallback
  function loadGitSeed(callback) {
    fetch(BASE_URL + "/data/article-seed.json")
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var hasSeed = data && data.tasks && data.blocks &&
          (Object.keys(data.tasks).length > 0 || Object.keys(data.blocks).length > 0);
        if (hasSeed) callback(data.tasks, data.blocks);
        else callback(null, null);
      })
      .catch(function() { callback(null, null); });
  }

  function applyData(tasks, blocks, source) {
    checkedTasks = tasks;
    allBlocks = blocks;
    try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(e) {}
    try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(allBlocks)); } catch(e) {}
    if (source !== "server") syncToServer("both");
  }

  function refreshUI() {
    renderNav();
    if (currentView === "stage" && activeStageId) renderStageView(activeStageId);
    if (currentView === "task" && activeStageId !== null && activeTaskIdx !== null) renderTaskView(activeStageId, activeTaskIdx);
  }

  // Compare which dataset is more complete (more tasks checked + more blocks)
  function dataScore(tasks, blocks) {
    var tCount = 0; for (var k in tasks) { if (tasks[k]) tCount++; }
    var bCount = 0; for (var k2 in blocks) { if (blocks[k2] && blocks[k2].length) bCount += blocks[k2].length; }
    return tCount + bCount;
  }

  function initFromServer() {
    // MERGE strategy: combine server + local, keep the BEST of both
    loadFromServer(function(serverTasks, serverBlocks) {
      var hasLocalTasks = Object.keys(checkedTasks).length > 0;
      var hasLocalBlocks = Object.keys(allBlocks).length > 0;
      var hasLocal = hasLocalTasks || hasLocalBlocks;
      var serverOk = serverTasks !== null && serverBlocks !== null;
      var hasServerData = serverOk && (Object.keys(serverTasks).length > 0 || Object.keys(serverBlocks).length > 0);

      if (hasServerData && hasLocal) {
        // MERGE: combine both — for tasks, keep true if EITHER has true
        var mergedTasks = {};
        var allTaskKeys = {};
        for (var sk in serverTasks) allTaskKeys[sk] = true;
        for (var lk in checkedTasks) allTaskKeys[lk] = true;
        for (var mk in allTaskKeys) {
          mergedTasks[mk] = !!(serverTasks[mk] || checkedTasks[mk]);
        }
        // MERGE blocks: keep local block if it has MORE content, else keep server
        var mergedBlocks = {};
        var allBlockKeys = {};
        for (var sbk in serverBlocks) allBlockKeys[sbk] = true;
        for (var lbk in allBlocks) allBlockKeys[lbk] = true;
        for (var mbk in allBlockKeys) {
          var sBlk = serverBlocks[mbk] || [];
          var lBlk = allBlocks[mbk] || [];
          // Keep whichever has more blocks (local usually has user-added content)
          mergedBlocks[mbk] = lBlk.length >= sBlk.length ? lBlk : sBlk;
        }
        checkedTasks = mergedTasks;
        allBlocks = mergedBlocks;
        try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(e) {}
        try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(allBlocks)); } catch(e) {}
        // Push merged data back to server
        syncToServer("both");
        showSyncStatus("Merge complet", "ok");
        refreshUI();
        return;
      }

      if (hasServerData && !hasLocal) {
        // Only server has data → use server
        applyData(serverTasks, serverBlocks, "server");
        refreshUI();
        return;
      }

      // Case 2: Server empty/error but local has data → push to server
      if (hasLocal) {
        syncToServer("both");
        showSyncStatus("Trimis pe server", "ok");
        refreshUI();
        return;
      }

      // Case 3: Both empty — try Git-tracked seed file
      loadGitSeed(function(seedTasks, seedBlocks) {
        if (seedTasks !== null && seedBlocks !== null) {
          applyData(seedTasks, seedBlocks, "git-seed");
          refreshUI();
          return;
        }

        // Case 4: All empty — use code-embedded seed
        seedBlocksIfNeeded();
        syncToServer("both");
        refreshUI();
      });
    });
  }

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
  function isTrilingual(type) { return TRILINGUAL_TYPES.indexOf(type) !== -1; }

  function makeTriVal(type) {
    if (type === "text-short") return { ro: "", en: "", ru: "" };
    if (type === "text-long") return { ro: "", en: "", ru: "" };
    if (type === "link") return { ro: { name: "", url: "" }, en: { name: "", url: "" }, ru: { name: "", url: "" } };
    if (type === "code") return { ro: { lang: "json", code: "" }, en: { lang: "json", code: "" }, ru: { lang: "json", code: "" } };
    if (type === "table") return { ro: { cols: ["Coloana 1","Coloana 2"], rows: [["",""]] }, en: { cols: ["Column 1","Column 2"], rows: [["",""]] }, ru: { cols: ["Колонка 1","Колонка 2"], rows: [["",""]] } };
    if (type === "number") return { ro: { label: "", value: "" }, en: { label: "", value: "" }, ru: { label: "", value: "" } };
    return "";
  }

  function addBlock(key, type) {
    if (!allBlocks[key]) allBlocks[key] = [];
    var val = null;
    if (isTrilingual(type)) {
      val = makeTriVal(type);
    }
    else if (type === "dropdown") val = { category: "", value: "" };
    else if (type === "file") val = null;
    else val = "";
    var newBlock = { id: genId(), type: type, value: val };
    allBlocks[key].push(newBlock);
    blockLangTab[newBlock.id] = "ro";
    editingBlocks[newBlock.id] = true;
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

  // ═══ SEED PRE-POPULATED BLOCKS ═══
  function seedBlocksIfNeeded() {
    var SEED_KEY = "rifc-blocks-seeded-v6";
    try { if (localStorage.getItem(SEED_KEY)) return; } catch(e) { return; }

    // MERGE mode: only seed tasks that have NO existing blocks (don't overwrite user data)

    // --- s2-0: Transformare sub-factori → Itemi Likert ---
    var k0 = "s2-0";
    if (!allBlocks[k0] || !allBlocks[k0].length) allBlocks[k0] = [
      { id: genId(), type: "text-short", value: { ro: "RIFC Scoring Rubric — 35 Itemi Likert (Scala 1-5)", en: "RIFC Scoring Rubric — 35 Likert Items (Scale 1-5)", ru: "RIFC Scoring Rubric — 35 шкал Лайкерта (Шкала 1-5)" } },
      { id: genId(), type: "link", value: { ro: { name: "OSF Repository", url: "https://osf.io" }, en: { name: "OSF Repository", url: "https://osf.io" }, ru: { name: "Репозиторий OSF", url: "https://osf.io" } } },
      { id: genId(), type: "text-long", value: {
        ro: "DIMENSIUNEA R — RELEVANȚĂ (7 itemi, max 35)\\nR1. Mesajul se adresează unei nevoi reale a publicului-țintă.\\nR2. Conținutul este relevant pentru contextul actual al pieței.\\nR3. Problema identificată în mesaj rezonează cu audiența.\\nR4. Mesajul oferă o soluție pertinentă la o problemă reală.\\nR5. Publicul-țintă se poate identifica cu situația descrisă.\\nR6. Informația prezentată este utilă pentru decizia de cumpărare.\\nR7. Mesajul răspunde la întrebări pe care publicul și le pune efectiv.\\n\\nDIMENSIUNEA I — IMPACT (10 itemi, max 50)\\nI1. Mesajul captează atenția în primele 3 secunde.\\nI2. Elementele vizuale susțin și amplifică mesajul verbal.\\nI3. Există un element de surpriză sau diferențiere clară.\\nI4. Tonul emoțional este adecvat și consistent.\\nI5. Mesajul creează o conexiune emoțională cu audiența.\\nI6. Call-to-action-ul este clar, vizibil și motivant.\\nI7. Mesajul se diferențiază clar de comunicarea competitorilor.\\nI8. Intensitatea emoțională este suficientă fără a fi excesivă.\\nI9. Structura narativă menține interesul de la început la final.\\nI10. Mesajul generează dorința de a afla mai mult sau de a acționa.\\n\\nDIMENSIUNEA F — FRECVENȚĂ (11 itemi, max 55)\\nF1. Mesajul este adaptat specificului canalului de distribuție.\\nF2. Frecvența de expunere este suficientă pentru memorare.\\nF3. Există variații ale mesajului pentru diferite puncte de contact.\\nF4. Momentul difuzării este ales strategic.\\nF5. Mesajul este optimizat pentru formatul platformei.\\nF6. Există continuitate narativă între expuneri succesive.\\nF7. Frecvența nu generează oboseală publicitară.\\nF8. Mesajul funcționează atât la prima vizionare cât și la vizionări repetate.\\nF9. Distribuția acoperă punctele de contact relevante.\\nF10. Planificarea media maximizează reach-ul în cadrul bugetului.\\nF11. Secvențialitatea mesajelor urmează o logică de funnel.\\n\\nDIMENSIUNEA C — CONVERSIE (7 itemi, max 35)\\nC1. Mesajul conduce natural spre acțiunea dorită.\\nC2. Beneficiile sunt prezentate clar și convingător.\\nC3. Există dovezi sociale sau de credibilitate.\\nC4. Oferta este percepută ca valoroasă raportat la preț.\\nC5. Procesul de conversie este simplu și fără fricțiuni.\\nC6. Mesajul creează un sentiment de urgență legitimă.\\nC7. Există mecanisme de follow-up post-expunere.",
        en: "DIMENSION R — RELEVANCE (7 items, max 35)\\nR1. The message addresses a real need of the target audience.\\nR2. The content is relevant to the current market context.\\nR3. The problem identified in the message resonates with the audience.\\nR4. The message offers a pertinent solution to a real problem.\\nR5. The target audience can identify with the described situation.\\nR6. The information presented is useful for the purchasing decision.\\nR7. The message answers questions the audience actually asks.\\n\\nDIMENSION I — IMPACT (10 items, max 50)\\nI1. The message captures attention within the first 3 seconds.\\nI2. Visual elements support and amplify the verbal message.\\nI3. There is an element of surprise or clear differentiation.\\nI4. The emotional tone is appropriate and consistent.\\nI5. The message creates an emotional connection with the audience.\\nI6. The call-to-action is clear, visible, and motivating.\\nI7. The message clearly differentiates from competitor communication.\\nI8. Emotional intensity is sufficient without being excessive.\\nI9. The narrative structure maintains interest from start to finish.\\nI10. The message generates desire to learn more or take action.\\n\\nDIMENSION F — FREQUENCY (11 items, max 55)\\nF1. The message is adapted to the specifics of the distribution channel.\\nF2. Exposure frequency is sufficient for memorization.\\nF3. There are message variations for different touchpoints.\\nF4. The timing of broadcast is strategically chosen.\\nF5. The message is optimized for the platform format.\\nF6. There is narrative continuity between successive exposures.\\nF7. Frequency does not generate advertising fatigue.\\nF8. The message works both on first viewing and on repeated viewings.\\nF9. Distribution covers relevant touchpoints.\\nF10. Media planning maximizes reach within the budget.\\nF11. Message sequencing follows a funnel logic.\\n\\nDIMENSION C — CONVERSION (7 items, max 35)\\nC1. The message naturally leads to the desired action.\\nC2. Benefits are presented clearly and convincingly.\\nC3. There is social proof or credibility evidence.\\nC4. The offer is perceived as valuable relative to price.\\nC5. The conversion process is simple and frictionless.\\nC6. The message creates a sense of legitimate urgency.\\nC7. There are post-exposure follow-up mechanisms.",
        ru: "ИЗМЕРЕНИЕ R — РЕЛЕВАНТНОСТЬ (7 пунктов, макс. 35)\\nR1. Сообщение обращается к реальной потребности целевой аудитории.\\nR2. Содержание релевантно текущему контексту рынка.\\nR3. Проблема, обозначенная в сообщении, резонирует с аудиторией.\\nR4. Сообщение предлагает уместное решение реальной проблемы.\\nR5. Целевая аудитория может идентифицировать себя с описанной ситуацией.\\nR6. Представленная информация полезна для принятия решения о покупке.\\nR7. Сообщение отвечает на вопросы, которые аудитория реально задаёт.\\n\\nИЗМЕРЕНИЕ I — ВОЗДЕЙСТВИЕ (10 пунктов, макс. 50)\\nI1. Сообщение привлекает внимание в первые 3 секунды.\\nI2. Визуальные элементы поддерживают и усиливают вербальное сообщение.\\nI3. Есть элемент неожиданности или чёткой дифференциации.\\nI4. Эмоциональный тон адекватный и последовательный.\\nI5. Сообщение создаёт эмоциональную связь с аудиторией.\\nI6. Призыв к действию чёткий, заметный и мотивирующий.\\nI7. Сообщение чётко отличается от коммуникации конкурентов.\\nI8. Эмоциональная интенсивность достаточна, но не чрезмерна.\\nI9. Нарративная структура поддерживает интерес от начала до конца.\\nI10. Сообщение вызывает желание узнать больше или действовать.\\n\\nИЗМЕРЕНИЕ F — ЧАСТОТА (11 пунктов, макс. 55)\\nF1. Сообщение адаптировано к специфике канала распространения.\\nF2. Частота показов достаточна для запоминания.\\nF3. Есть вариации сообщения для разных точек контакта.\\nF4. Момент трансляции выбран стратегически.\\nF5. Сообщение оптимизировано для формата платформы.\\nF6. Есть нарративная преемственность между последовательными показами.\\nF7. Частота не вызывает рекламной усталости.\\nF8. Сообщение работает как при первом, так и при повторных просмотрах.\\nF9. Дистрибуция охватывает релевантные точки контакта.\\nF10. Медиапланирование максимизирует охват в рамках бюджета.\\nF11. Последовательность сообщений следует логике воронки.\\n\\nИЗМЕРЕНИЕ C — КОНВЕРСИЯ (7 пунктов, макс. 35)\\nC1. Сообщение естественно ведёт к желаемому действию.\\nC2. Преимущества представлены чётко и убедительно.\\nC3. Есть социальные доказательства или свидетельства достоверности.\\nC4. Предложение воспринимается как ценное относительно цены.\\nC5. Процесс конверсии простой и без трений.\\nC6. Сообщение создаёт чувство законной срочности.\\nC7. Есть механизмы пост-экспозиционного follow-up."
      }}
    ];

    // --- s2-2: Construire Scoring Rubric standardizat ---
    var k2 = "s2-2";
    if (!allBlocks[k2] || !allBlocks[k2].length) { var rubricJson = JSON.stringify({
      scale: "1-5 Likert",
      anchors: { 1: "Total dezacord / Deloc", 3: "Neutru / Moderat", 5: "Total acord / Complet" },
      dimensions: {
        R: { name: "Relevanță", items: 7, maxScore: 35, gate: "If mean(R) < 3.0 message fails" },
        I: { name: "Impact", items: 10, maxScore: 50 },
        F: { name: "Frecvență", items: 11, maxScore: 55 },
        C: { name: "Conversie", items: 7, maxScore: 35 }
      },
      formula: "C_predicted = R_gate * (I_mean * F_mean)",
      scoring: { R_gate: "If R_mean >= 4 then 1, else 0", composite: "I_mean * F_mean", C_observed: "Mean of C1-C7" }
    }, null, 2);
    allBlocks[k2] = [
      { id: genId(), type: "text-short", value: { ro: "Scoring Rubric R IF C — Ancore 1/3/5", en: "RIFC Scoring Rubric — Anchors 1/3/5", ru: "Scoring Rubric R IF C — Якоря 1/3/5" } },
      { id: genId(), type: "link", value: { ro: { name: "OSF Repository", url: "https://osf.io" }, en: { name: "OSF Repository", url: "https://osf.io" }, ru: { name: "Репозиторий OSF", url: "https://osf.io" } } },
      { id: genId(), type: "code", value: { ro: { lang: "json", code: rubricJson }, en: { lang: "json", code: rubricJson }, ru: { lang: "json", code: rubricJson } } },
      { id: genId(), type: "table", value: {
        ro: { cols: ["Dimensiune", "Itemi", "Scor Max", "Formula"], rows: [
          ["R — Relevanță", "7 (R1-R7)", "35", "Poartă: media < 3 = eșec"],
          ["I — Impact", "10 (I1-I10)", "50", "I_mean = sum/10"],
          ["F — Frecvență", "11 (F1-F11)", "55", "F_mean = sum/11"],
          ["C — Conversie", "7 (C1-C7)", "35", "C_observed = sum/7"],
          ["TOTAL", "35 itemi", "175", "C_pred = R_gate × (I×F)"]
        ]},
        en: { cols: ["Dimension", "Items", "Max Score", "Formula"], rows: [
          ["R — Relevance", "7 (R1-R7)", "35", "Gate: mean < 3 = fail"],
          ["I — Impact", "10 (I1-I10)", "50", "I_mean = sum/10"],
          ["F — Frequency", "11 (F1-F11)", "55", "F_mean = sum/11"],
          ["C — Conversion", "7 (C1-C7)", "35", "C_observed = sum/7"],
          ["TOTAL", "35 items", "175", "C_pred = R_gate × (I×F)"]
        ]},
        ru: { cols: ["Измерение", "Пункты", "Макс. балл", "Формула"], rows: [
          ["R — Релевантность", "7 (R1-R7)", "35", "Порог: среднее < 3 = провал"],
          ["I — Воздействие", "10 (I1-I10)", "50", "I_mean = sum/10"],
          ["F — Частота", "11 (F1-F11)", "55", "F_mean = sum/11"],
          ["C — Конверсия", "7 (C1-C7)", "35", "C_observed = sum/7"],
          ["ИТОГО", "35 пунктов", "175", "C_pred = R_gate × (I×F)"]
        ]}
      }}
    ]; }

    // --- s2-7: Traducere & Validare trilingvă (RO / EN / RU) ---
    var k7 = "s2-7";
    if (!allBlocks[k7] || !allBlocks[k7].length) allBlocks[k7] = [
      { id: genId(), type: "text-short", value: { ro: "Traducere & Validare Trilingvă", en: "Translation & Trilingual Validation", ru: "Перевод и трёхъязычная валидация" } },
      { id: genId(), type: "dropdown", value: { category: "Status", value: "Finalizat" } },
      { id: genId(), type: "link", value: { ro: { name: "OSF Repository", url: "https://osf.io" }, en: { name: "OSF Repository", url: "https://osf.io" }, ru: { name: "Репозиторий OSF", url: "https://osf.io" } } },
      { id: genId(), type: "text-long", value: {
        ro: "Documentul RIFC Scoring Rubric conține traducerea completă a tuturor celor 35 de itemi Likert în cele trei limbi.\\n\\n• ROMÂNĂ (RO) — limba principală, itemii originali\\n• ENGLEZĂ (EN) — traducere academică pentru publicare internațională\\n• RUSĂ (RU) — traducere pentru piața din Republica Moldova\\n\\nMetoda: back-translation cu verificare de către vorbitori nativi.\\n\\nAncore: 1 = Total dezacord · 3 = Neutru · 5 = Total acord",
        en: "The RIFC Scoring Rubric document contains the complete translation of all 35 Likert items in three languages.\\n\\n• ROMANIAN (RO) — primary language, original items\\n• ENGLISH (EN) — academic translation for international publication\\n• RUSSIAN (RU) — translation for the Republic of Moldova market\\n\\nMethod: back-translation with native speaker verification.\\n\\nAnchors: 1 = Strongly disagree · 3 = Neutral · 5 = Strongly agree",
        ru: "Документ RIFC Scoring Rubric содержит полный перевод всех 35 шкал Лайкерта на три языка.\\n\\n• РУМЫНСКИЙ (RO) — основной язык, оригинальные пункты\\n• АНГЛИЙСКИЙ (EN) — академический перевод для международной публикации\\n• РУССКИЙ (RU) — перевод для рынка Республики Молдова\\n\\nМетод: обратный перевод с проверкой носителями языка.\\n\\nЯкоря: 1 = Полностью не согласен · 3 = Нейтрально · 5 = Полностью согласен"
      }},
      { id: genId(), type: "table", value: {
        ro: { cols: ["Dimensiune", "Itemi", "RO", "EN", "RU"], rows: [
          ["R — Relevanță", "7", "Finalizat", "Finalizat", "Finalizat"],
          ["I — Impact", "10", "Finalizat", "Finalizat", "Finalizat"],
          ["F — Frecvență", "11", "Finalizat", "Finalizat", "Finalizat"],
          ["C — Conversie", "7", "Finalizat", "Finalizat", "Finalizat"],
          ["TOTAL", "35", "35/35", "35/35", "35/35"]
        ]},
        en: { cols: ["Dimension", "Items", "RO", "EN", "RU"], rows: [
          ["R — Relevance", "7", "Completed", "Completed", "Completed"],
          ["I — Impact", "10", "Completed", "Completed", "Completed"],
          ["F — Frequency", "11", "Completed", "Completed", "Completed"],
          ["C — Conversion", "7", "Completed", "Completed", "Completed"],
          ["TOTAL", "35", "35/35", "35/35", "35/35"]
        ]},
        ru: { cols: ["Измерение", "Пункты", "RO", "EN", "RU"], rows: [
          ["R — Релевантность", "7", "Завершено", "Завершено", "Завершено"],
          ["I — Воздействие", "10", "Завершено", "Завершено", "Завершено"],
          ["F — Частота", "11", "Завершено", "Завершено", "Завершено"],
          ["C — Конверсия", "7", "Завершено", "Завершено", "Завершено"],
          ["ИТОГО", "35", "35/35", "35/35", "35/35"]
        ]}
      }}
    ];

    saveBlocks();
    try { localStorage.setItem(SEED_KEY, "1"); } catch(e) {}
  }

  // Run seed on load
  seedBlocksIfNeeded();

  // ═══ EXPORT / IMPORT BACKUP ═══
  window.exportBackup = function() {
    try {
      var exportData = {
        _meta: {
          exportedAt: new Date().toISOString(),
          version: "v4",
          source: "browser",
          description: "RIFC Articol Stiintific — tasks & blocks backup"
        },
        tasks: checkedTasks,
        blocks: allBlocks
      };
      var json = JSON.stringify(exportData, null, 2);
      var blob = new Blob([json], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = "rifc-article-backup-" + new Date().toISOString().slice(0,10) + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showSyncStatus("Backup descărcat", "ok");
    } catch(err) {
      showSyncStatus("Eroare export", "err");
    }
  };

  window.importBackup = function() {
    var input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.style.display = "none";
    input.addEventListener("change", function(e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(ev) {
        try {
          var data = JSON.parse(ev.target.result);
          if (!data.tasks && !data.blocks) {
            showSyncStatus("Fișier invalid", "err");
            return;
          }
          // Confirm before overwrite
          var taskCount = data.tasks ? Object.keys(data.tasks).length : 0;
          var blockCount = data.blocks ? Object.keys(data.blocks).length : 0;
          var msg = "Restaurare din backup?\\n\\nTask-uri: " + taskCount + "\\nBlocuri: " + blockCount;
          if (data._meta && data._meta.exportedAt) msg += "\\nData backup: " + data._meta.exportedAt.slice(0,16).replace("T", " ");
          if (!confirm(msg)) return;

          if (data.tasks) {
            checkedTasks = data.tasks;
            try { localStorage.setItem(TASKS_KEY, JSON.stringify(checkedTasks)); } catch(err2) {}
          }
          if (data.blocks) {
            allBlocks = data.blocks;
            try { localStorage.setItem(BLOCKS_KEY, JSON.stringify(allBlocks)); } catch(err3) {}
          }
          // Sync to Supabase
          syncToServer("both");
          // Re-render UI
          renderNav();
          if (currentView === "stage" && activeStageId) renderStageView(activeStageId);
          if (currentView === "task" && activeStageId !== null && activeTaskIdx !== null) renderTaskView(activeStageId, activeTaskIdx);
          showSyncStatus("Restaurat cu succes", "ok");
        } catch(parseErr) {
          showSyncStatus("Eroare citire JSON", "err");
        }
      };
      reader.readAsText(file);
    });
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  };

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
      var barPct = isDone ? 100 : (nBlocks > 0 ? Math.min(Math.round(nBlocks / 5 * 100), 90) : 0);
      var barClass = isDone ? 'full' : (nBlocks > 0 ? 'partial' : 'empty');
      html += '<div class="sv-card' + (isDone ? ' done-card' : '') + '" data-stage="' + stage.id + '" data-task="' + ti + '">';
      html += '<div class="sv-card-num">' + (ti + 1) + '</div><div class="sv-card-content">';
      html += '<div class="sv-card-title">' + t + '</div>';
      html += '<div class="sv-card-status">' + (isDone ? 'Finalizat' : (nBlocks > 0 ? 'În lucru — ' + nBlocks + ' bloc' + (nBlocks > 1 ? 'uri' : '') : 'În așteptare')) + '</div>';
      html += '<div class="sv-card-bar"><div class="sv-card-bar-fill ' + barClass + '" style="width:' + barPct + '%"></div></div>';
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
      var isEditing = !!editingBlocks[block.id];
      html += '<div class="blk' + (isEditing ? ' editing' : '') + '" data-blk-id="' + block.id + '">';
      var headerLabel = typeDef.label;
      if (block.type === "number" && block.value) { var _nl = (block.value.ro && block.value.ro.label) || (block.value.label) || ""; if (_nl) headerLabel += ' — ' + escHtml(_nl); }
      if (block.type === "link" && block.value) { var _ln = (block.value.ro && block.value.ro.name) || ""; if (_ln) headerLabel += ' — ' + escHtml(_ln); }
      html += '<div class="blk-header">' + ICONS[typeDef.icon] + '<span class="blk-type-label">' + headerLabel + '</span>';
      if (isEditing) {
        html += '<button class="blk-action save" data-action="save" data-blk="' + block.id + '" title="Salvează">' + ICONS.save + '</button>';
        html += '<button class="blk-action cancel" data-action="cancel" data-blk="' + block.id + '" title="Anulează">' + ICONS.cancelX + '</button>';
      } else {
        html += '<button class="blk-action edit" data-action="edit" data-blk="' + block.id + '" title="Editează">' + ICONS.edit + '</button>';
      }
      if (idx > 0) html += '<button class="blk-action" data-action="up" data-blk="' + block.id + '" title="Mută sus">' + ICONS.arrowUp + '</button>';
      if (idx < blocks.length - 1) html += '<button class="blk-action" data-action="down" data-blk="' + block.id + '" title="Mută jos">' + ICONS.arrowDown + '</button>';
      html += '<button class="blk-action danger" data-action="delete" data-blk="' + block.id + '" title="Șterge">' + ICONS.trash + '</button>';
      html += '</div>';
      if (isEditing) {
        html += '<div class="blk-body">' + renderBlockBody(block) + '</div>';
      } else {
        html += '<div class="blk-body">' + renderBlockViewBody(block) + '</div>';
      }
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

  // Migrate old non-trilingual block values to trilingual format
  function migrateBlock(block) {
    if (!isTrilingual(block.type)) return;
    var val = block.value;
    if (block.type === "code") {
      if (val && val.lang && typeof val.code === "string") {
        block.value = { ro: { lang: val.lang, code: val.code }, en: { lang: val.lang, code: "" }, ru: { lang: val.lang, code: "" } };
        saveBlocks();
      }
    } else if (block.type === "table") {
      // Old format: { cols: [...], rows: [...] } → trilingual { ro: {...}, en: {...}, ru: {...} }
      if (val && val.cols && Array.isArray(val.cols)) {
        block.value = { ro: { cols: val.cols.slice(), rows: val.rows.map(function(r) { return r.slice(); }) }, en: { cols: val.cols.map(function() { return ""; }), rows: val.rows.map(function(r) { return r.map(function() { return ""; }); }) }, ru: { cols: val.cols.map(function() { return ""; }), rows: val.rows.map(function(r) { return r.map(function() { return ""; }); }) } };
        saveBlocks();
      }
    } else if (block.type === "number") {
      // Old format: { label: "x", value: 0 } or plain number → trilingual
      if (typeof val === "number" || typeof val === "string") {
        var sv = String(val);
        block.value = { ro: { label: "", value: sv }, en: { label: "", value: sv }, ru: { label: "", value: sv } };
        saveBlocks();
      } else if (val && (val.label !== undefined || val.value !== undefined) && !val.ro) {
        var sv2 = String(val.value || "");
        block.value = { ro: { label: val.label || "", value: sv2 }, en: { label: "", value: sv2 }, ru: { label: "", value: sv2 } };
        saveBlocks();
      }
    } else if (block.type === "link") {
      // Old format: plain string or { ro: "url", en: "url", ru: "url" } → { ro: { name: "", url: "url" }, ... }
      if (typeof val === "string") {
        block.value = { ro: { name: "", url: val }, en: { name: "", url: "" }, ru: { name: "", url: "" } };
        saveBlocks();
      } else if (val && val.ro !== undefined && typeof val.ro === "string") {
        block.value = { ro: { name: "", url: val.ro || "" }, en: { name: "", url: val.en || "" }, ru: { name: "", url: val.ru || "" } };
        saveBlocks();
      }
    } else {
      if (typeof val === "string") {
        block.value = { ro: val, en: "", ru: "" };
        saveBlocks();
      }
    }
  }

  function getLangVal(block, lang) {
    if (!block.value || typeof block.value !== "object") return block.type === "code" ? { lang: "json", code: "" } : "";
    return block.value[lang] || (block.type === "code" ? { lang: "json", code: "" } : "");
  }

  function renderLangTabs(blockId) {
    var activeLang = blockLangTab[blockId] || "ro";
    var h = '<div class="blk-lang-tabs" data-lang-tabs="' + blockId + '">';
    LANGS.forEach(function(lang) {
      h += '<button class="blk-lang-tab ' + lang + (activeLang === lang ? ' active' : '') + '" data-lang-switch="' + blockId + '" data-lang="' + lang + '">' + LANG_LABELS[lang] + '</button>';
    });
    h += '</div>';
    return h;
  }

  function renderBlockViewBody(block) {
    var val = block.value;
    if (isTrilingual(block.type)) migrateBlock(block);
    val = block.value;
    var activeLang = blockLangTab[block.id] || "ro";

    switch (block.type) {
      case "text-short":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || "";
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-view-text' + (!lv ? ' empty' : '') + '">' + (lv ? escHtml(lv) : 'Fără conținut') + '</div>';
          h += '</div>';
        });
        return h;

      case "text-long":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || "";
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-view-text' + (!lv ? ' empty' : '') + '">' + (lv ? escHtml(lv) : 'Fără conținut') + '</div>';
          h += '</div>';
        });
        return h;

      case "link":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || { name: "", url: "" };
          if (typeof lv === "string") lv = { name: "", url: lv };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          if (lv.url) {
            h += '<a class="blk-view-link" href="' + escAttr(lv.url) + '" target="_blank" rel="noopener">' + ICONS.externalLink + escHtml(lv.name || lv.url) + '</a>';
          } else {
            h += '<div class="blk-view-text empty">Fără link</div>';
          }
          h += '</div>';
        });
        return h;

      case "file":
        if (val && val.data) {
          var isImg = val.type && val.type.indexOf("image/") === 0;
          var h = '<div class="blk-file-info">';
          h += '<div class="blk-file-icon">' + ICONS.file + '</div>';
          h += '<div class="blk-file-details"><div class="blk-file-name">' + escHtml(val.name) + '</div>';
          h += '<div class="blk-file-size">' + formatSize(val.size) + '</div></div></div>';
          if (isImg) h += '<img class="blk-img-preview" src="' + val.data + '" alt="Preview" />';
          return h;
        }
        return '<div class="blk-view-text empty">Fără fișier încărcat</div>';

      case "table":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var tv = (val && val[lang]) || { cols: [], rows: [] };
          if (!tv || !tv.cols) tv = { cols: [], rows: [] };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          if (tv.cols.length > 0) {
            h += '<table class="blk-view-table"><thead><tr>';
            tv.cols.forEach(function(c) { h += '<th>' + escHtml(c || '') + '</th>'; });
            h += '</tr></thead><tbody>';
            tv.rows.forEach(function(row) {
              h += '<tr>';
              row.forEach(function(cell) { h += '<td>' + escHtml(cell || '') + '</td>'; });
              h += '</tr>';
            });
            h += '</tbody></table>';
          } else {
            h += '<div class="blk-view-text empty">Tabel gol</div>';
          }
          h += '</div>';
        });
        return h;

      case "dropdown":
        if (!val || typeof val !== "object" || val.ro !== undefined) val = val && val.category ? val : { category: "", value: "" };
        if (val.category && val.value) {
          return '<div class="blk-view-dd"><span class="blk-view-dd-cat">' + escHtml(val.category) + ':</span>' + escHtml(val.value) + '</div>';
        }
        return '<div class="blk-view-text empty">Neselectat</div>';

      case "number":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var nv = (val && val[lang]) || { label: "", value: "" };
          if (!nv || typeof nv !== "object") nv = { label: "", value: "" };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-view-num"><span class="blk-view-num-val">' + escHtml(String(nv.value || '—')) + '</span>';
          h += '<span class="blk-view-num-label">' + escHtml(nv.label || '') + '</span></div>';
          h += '</div>';
        });
        return h;

      case "date":
        if (val) return '<div class="blk-view-text">' + escHtml(val) + '</div>';
        return '<div class="blk-view-text empty">Fără dată</div>';

      case "code":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || { lang: "json", code: "" };
          if (typeof lv !== "object") lv = { lang: "json", code: "" };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          if (lv.code) {
            h += '<div style="font-size:10px;color:var(--text3);margin-bottom:4px;text-transform:uppercase;">' + escHtml(lv.lang || 'code') + '</div>';
            h += '<pre class="blk-view-code">' + escHtml(lv.code) + '</pre>';
          } else {
            h += '<div class="blk-view-text empty">Fără cod</div>';
          }
          h += '</div>';
        });
        return h;

      default: return '<em style="color:var(--text3);font-size:12px;">Tip necunoscut</em>';
    }
  }

  function renderBlockBody(block) {
    var val = block.value;
    // Migrate old data format to trilingual
    if (isTrilingual(block.type)) migrateBlock(block);
    val = block.value;
    var activeLang = blockLangTab[block.id] || "ro";

    switch (block.type) {
      case "text-short":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || "";
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<input class="blk-input" type="text" data-blk-lang-val="' + block.id + '" data-lang="' + lang + '" value="' + escAttr(lv) + '" placeholder="' + LANG_LABELS[lang] + ' — Introduceți text..." />';
          h += '</div>';
        });
        return h;

      case "text-long":
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || "";
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<textarea class="blk-textarea" data-blk-lang-val="' + block.id + '" data-lang="' + lang + '" placeholder="' + LANG_LABELS[lang] + ' — Introduceți text detaliat...">' + escHtml(lv) + '</textarea>';
          h += '</div>';
        });
        return h;

      case "link":
        var h = renderLangTabs(block.id);
        var namePlaceholders = { ro: "Nume link (ex: Documentație OSF)", en: "Link name (e.g.: OSF Documentation)", ru: "Название ссылки (напр.: Документация OSF)" };
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || { name: "", url: "" };
          if (typeof lv === "string") lv = { name: "", url: lv };
          var url = lv.url || "";
          var domain = "";
          try { if (url && url.indexOf("://") !== -1) domain = url.split("://")[1].split("/")[0]; } catch(e) {}
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<input class="blk-input" type="text" data-link-name="' + block.id + '" data-lang="' + lang + '" value="' + escAttr(lv.name || '') + '" placeholder="' + namePlaceholders[lang] + '" style="margin-bottom:6px;" />';
          h += '<div class="blk-link-row"><input class="blk-input" type="url" data-link-url="' + block.id + '" data-lang="' + lang + '" value="' + escAttr(url) + '" placeholder="' + LANG_LABELS[lang] + ' — https://..." />';
          h += '<button class="blk-link-open" data-link-open="' + block.id + '" data-link-lang="' + lang + '" title="Deschide link">' + ICONS.externalLink + '</button></div>';
          if (domain) h += '<div class="blk-link-preview">' + ICONS.globe + '<span>' + escHtml(domain) + '</span></div>';
          h += '</div>';
        });
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
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var tv = (val && val[lang]) || { cols: ["Coloana 1","Coloana 2"], rows: [["",""]] };
          if (!tv || !tv.cols) tv = { cols: ["Coloana 1","Coloana 2"], rows: [["",""]] };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-table-wrap"><table class="blk-table"><thead><tr>';
          tv.cols.forEach(function(c, ci) {
            h += '<th><input type="text" value="' + escAttr(c) + '" data-tbl-col="' + block.id + '" data-col-idx="' + ci + '" data-lang="' + lang + '" /></th>';
          });
          h += '</tr></thead><tbody>';
          tv.rows.forEach(function(row, ri) {
            h += '<tr>';
            row.forEach(function(cell, ci) {
              h += '<td><input type="text" value="' + escAttr(cell) + '" data-tbl-cell="' + block.id + '" data-row="' + ri + '" data-col="' + ci + '" data-lang="' + lang + '" /></td>';
            });
            h += '</tr>';
          });
          h += '</tbody></table></div>';
          h += '<div class="blk-table-actions">';
          h += '<button class="blk-table-btn" data-tbl-add-row="' + block.id + '" data-lang="' + lang + '">+ Rând</button>';
          h += '<button class="blk-table-btn" data-tbl-add-col="' + block.id + '" data-lang="' + lang + '">+ Coloană</button>';
          if (tv.rows.length > 1) h += '<button class="blk-table-btn danger" data-tbl-del-row="' + block.id + '" data-lang="' + lang + '">- Rând</button>';
          if (tv.cols.length > 1) h += '<button class="blk-table-btn danger" data-tbl-del-col="' + block.id + '" data-lang="' + lang + '">- Coloană</button>';
          h += '</div>';
          h += '</div>';
        });
        return h;

      case "dropdown":
        if (!val || typeof val !== "object" || val.ro !== undefined) val = val && val.category ? val : { category: "", value: "" };
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
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var nv = (val && val[lang]) || { label: "", value: "" };
          if (!nv || typeof nv !== "object") nv = { label: "", value: "" };
          var placeholders = { ro: "Titlu / Etichetă (ex: Total itemi)", en: "Title / Label (e.g.: Total items)", ru: "Название / Метка (напр.: Всего пунктов)" };
          var hints = { ro: "valoare numerică", en: "numeric value", ru: "числовое значение" };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-num-wrap"><input class="blk-num-title" type="text" data-num-label="' + block.id + '" data-lang="' + lang + '" value="' + escAttr(nv.label || '') + '" placeholder="' + placeholders[lang] + '" />';
          h += '<div class="blk-num-row"><input class="blk-num-input" type="text" data-num-val="' + block.id + '" data-lang="' + lang + '" value="' + escAttr(String(nv.value || '')) + '" inputmode="text" placeholder="ex: 3,63 sau 85%" />';
          h += '<span class="blk-num-label">' + (nv.label ? escHtml(nv.label) : hints[lang]) + '</span></div></div>';
          h += '</div>';
        });
        return h;

      case "date":
        return '<input class="blk-date" type="date" data-blk-val="' + block.id + '" value="' + escAttr(val || '') + '" />';

      case "code":
        var codeLangs = ["json","html","css","javascript","python","sql","bash","typescript","yaml","xml","markdown","csv","plaintext"];
        var h = renderLangTabs(block.id);
        LANGS.forEach(function(lang) {
          var lv = (val && val[lang]) || { lang: "json", code: "" };
          if (typeof lv !== "object") lv = { lang: "json", code: "" };
          h += '<div class="blk-lang-panel' + (activeLang === lang ? ' active' : '') + '" data-lang-panel="' + block.id + '" data-panel-lang="' + lang + '">';
          h += '<div class="blk-code-header">';
          h += '<select class="blk-code-lang" data-code-lang="' + block.id + '" data-lang="' + lang + '">';
          codeLangs.forEach(function(l) { h += '<option value="' + l + '"' + (lv.lang === l ? ' selected' : '') + '>' + l.toUpperCase() + '</option>'; });
          h += '</select>';
          h += '<button class="blk-code-copy" data-code-copy="' + block.id + '" data-copy-lang="' + lang + '">' + ICONS.copy + '<span>Copiază</span></button>';
          h += '</div>';
          h += '<textarea class="blk-code-area" data-code-val="' + block.id + '" data-lang="' + lang + '" placeholder="' + LANG_LABELS[lang] + ' // Introduceți cod aici..." spellcheck="false">' + escHtml(lv.code || '') + '</textarea>';
          h += '</div>';
        });
        return h;

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
        addBlock(key, btn.getAttribute("data-add-type"));
        pickerOpen = false;
        renderBlocks(key);
      });
    });

    // Move / Delete / Edit / Save / Cancel actions
    document.querySelectorAll("[data-action]").forEach(function(btn) {
      btn.addEventListener("click", function(e) {
        e.stopPropagation();
        var action = btn.getAttribute("data-action");
        var bid = btn.getAttribute("data-blk");
        if (action === "edit") {
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              editingSnapshots[bid] = JSON.parse(JSON.stringify(blocks[i].value));
              break;
            }
          }
          editingBlocks[bid] = true;
          renderBlocks(key);
        }
        else if (action === "save") {
          delete editingBlocks[bid];
          delete editingSnapshots[bid];
          saveBlocks();
          renderBlocks(key);
          renderNav();
        }
        else if (action === "cancel") {
          if (editingSnapshots[bid] !== undefined) {
            var blocks = getTaskBlocks(key);
            for (var i = 0; i < blocks.length; i++) {
              if (blocks[i].id === bid) { blocks[i].value = editingSnapshots[bid]; break; }
            }
          }
          delete editingBlocks[bid];
          delete editingSnapshots[bid];
          renderBlocks(key);
        }
        else if (action === "delete") { deleteBlock(key, bid); renderBlocks(key); renderNav(); }
        else if (action === "up") { moveBlock(key, bid, -1); renderBlocks(key); }
        else if (action === "down") { moveBlock(key, bid, 1); renderBlocks(key); }
      });
    });

    // ═══ LANG TABS — switch between RO/EN/RU ═══
    document.querySelectorAll("[data-lang-switch]").forEach(function(tab) {
      tab.addEventListener("click", function(e) {
        e.stopPropagation();
        var bid = tab.getAttribute("data-lang-switch");
        var lang = tab.getAttribute("data-lang");
        blockLangTab[bid] = lang;
        // Toggle tab active state (DOM only, no re-render)
        var tabGroup = tab.parentElement;
        tabGroup.querySelectorAll(".blk-lang-tab").forEach(function(t) { t.classList.remove("active"); });
        tab.classList.add("active");
        // Toggle panel visibility
        var blkEl = tab.closest(".blk");
        if (blkEl) {
          blkEl.querySelectorAll('[data-lang-panel="' + bid + '"]').forEach(function(panel) {
            panel.classList.toggle("active", panel.getAttribute("data-panel-lang") === lang);
          });
        }
      });
    });

    // ═══ TRILINGUAL text inputs — auto-save per lang ═══
    document.querySelectorAll("[data-blk-lang-val]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-blk-lang-val");
          var lang = input.getAttribute("data-lang");
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              if (!blocks[i].value || typeof blocks[i].value !== "object") blocks[i].value = { ro: "", en: "", ru: "" };
              blocks[i].value[lang] = input.value;
              saveBlocks();
              break;
            }
          }
        }, 300);
      });
    });

    // Link — name input (trilingual, auto-save per lang)
    document.querySelectorAll("[data-link-name]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-link-name");
          var lang = input.getAttribute("data-lang") || "ro";
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              if (!blocks[i].value || typeof blocks[i].value !== "object") blocks[i].value = makeTriVal("link");
              if (!blocks[i].value[lang] || typeof blocks[i].value[lang] === "string") blocks[i].value[lang] = { name: "", url: typeof blocks[i].value[lang] === "string" ? blocks[i].value[lang] : "" };
              blocks[i].value[lang].name = input.value;
              saveBlocks(); break;
            }
          }
        }, 300);
      });
    });

    // Link — url input (trilingual, auto-save per lang)
    document.querySelectorAll("[data-link-url]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-link-url");
          var lang = input.getAttribute("data-lang") || "ro";
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              if (!blocks[i].value || typeof blocks[i].value !== "object") blocks[i].value = makeTriVal("link");
              if (!blocks[i].value[lang] || typeof blocks[i].value[lang] === "string") blocks[i].value[lang] = { name: "", url: typeof blocks[i].value[lang] === "string" ? blocks[i].value[lang] : "" };
              blocks[i].value[lang].url = input.value;
              saveBlocks(); break;
            }
          }
        }, 300);
      });
    });

    // Link — update preview on blur (trilingual)
    document.querySelectorAll('input[type="url"][data-link-url]').forEach(function(input) {
      input.addEventListener("blur", function() { renderBlocks(key); });
    });

    // Link — open button (trilingual)
    document.querySelectorAll("[data-link-open]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-link-open");
        var lang = btn.getAttribute("data-link-lang") || (blockLangTab[bid] || "ro");
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid && blocks[i].value) {
            var langVal = blocks[i].value[lang];
            var url = "";
            if (typeof langVal === "object" && langVal !== null) url = langVal.url || "";
            else if (typeof langVal === "string") url = langVal;
            if (url && url.indexOf("://") === -1) url = "https://" + url;
            if (url) try { window.open(url, "_blank"); } catch(e) {}
            break;
          }
        }
      });
    });

    // Non-trilingual inputs (date) — auto-save
    document.querySelectorAll("[data-blk-val]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-blk-val");
          updateBlockValue(key, bid, input.value);
        }, 300);
      });
    });

    // Number — label + value (trilingual)
    document.querySelectorAll("[data-num-label]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-num-label");
          var lang = input.getAttribute("data-lang") || "ro";
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              if (!blocks[i].value[lang]) blocks[i].value[lang] = { label: "", value: 0 };
              blocks[i].value[lang].label = input.value;
              saveBlocks();
              var wrap = input.closest(".blk-num-wrap");
              var hints = { ro: "valoare numerică", en: "numeric value", ru: "числовое значение" };
              if (wrap) { var lbl = wrap.querySelector(".blk-num-label"); if (lbl) lbl.textContent = input.value || hints[lang]; }
              break;
            }
          }
        }, 300);
      });
    });
    document.querySelectorAll("[data-num-val]").forEach(function(input) {
      var debounce = null;
      input.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = input.getAttribute("data-num-val");
          var rawVal = input.value;
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              // Sync value across ALL languages (stored as string to allow commas, dots, %)
              LANGS.forEach(function(l) {
                if (!blocks[i].value[l]) blocks[i].value[l] = { label: "", value: "" };
                blocks[i].value[l].value = rawVal;
              });
              // Also update the other lang inputs in DOM
              document.querySelectorAll('[data-num-val="' + bid + '"]').forEach(function(other) {
                if (other !== input) other.value = input.value;
              });
              saveBlocks(); break;
            }
          }
        }, 300);
      });
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
      btn.addEventListener("click", function() { updateBlockValue(key, btn.getAttribute("data-file-remove"), null); renderBlocks(key); });
    });

    // Table — cell edits (trilingual)
    document.querySelectorAll("[data-tbl-cell]").forEach(function(input) {
      input.addEventListener("input", function() {
        var bid = input.getAttribute("data-tbl-cell");
        var lang = input.getAttribute("data-lang") || "ro";
        var ri = parseInt(input.getAttribute("data-row"), 10);
        var ci = parseInt(input.getAttribute("data-col"), 10);
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid) { if (blocks[i].value[lang]) blocks[i].value[lang].rows[ri][ci] = input.value; saveBlocks(); break; } }
      });
    });
    // Table — col header edits (trilingual)
    document.querySelectorAll("[data-tbl-col]").forEach(function(input) {
      input.addEventListener("input", function() {
        var bid = input.getAttribute("data-tbl-col");
        var lang = input.getAttribute("data-lang") || "ro";
        var ci = parseInt(input.getAttribute("data-col-idx"), 10);
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid) { if (blocks[i].value[lang]) blocks[i].value[lang].cols[ci] = input.value; saveBlocks(); break; } }
      });
    });
    // Table — add row (trilingual)
    document.querySelectorAll("[data-tbl-add-row]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-add-row");
        var lang = btn.getAttribute("data-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid && blocks[i].value[lang]) { var nCols = blocks[i].value[lang].cols.length; var nr = []; for (var c = 0; c < nCols; c++) nr.push(""); blocks[i].value[lang].rows.push(nr); saveBlocks(); renderBlocks(key); break; } }
      });
    });
    // Table — add col (trilingual)
    document.querySelectorAll("[data-tbl-add-col]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-add-col");
        var lang = btn.getAttribute("data-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid && blocks[i].value[lang]) { blocks[i].value[lang].cols.push("Coloana " + (blocks[i].value[lang].cols.length + 1)); blocks[i].value[lang].rows.forEach(function(r) { r.push(""); }); saveBlocks(); renderBlocks(key); break; } }
      });
    });
    // Table — delete last row (trilingual)
    document.querySelectorAll("[data-tbl-del-row]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-del-row");
        var lang = btn.getAttribute("data-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid && blocks[i].value[lang] && blocks[i].value[lang].rows.length > 1) { blocks[i].value[lang].rows.pop(); saveBlocks(); renderBlocks(key); break; } }
      });
    });
    // Table — delete last col (trilingual)
    document.querySelectorAll("[data-tbl-del-col]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-tbl-del-col");
        var lang = btn.getAttribute("data-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid && blocks[i].value[lang] && blocks[i].value[lang].cols.length > 1) { blocks[i].value[lang].cols.pop(); blocks[i].value[lang].rows.forEach(function(r) { r.pop(); }); saveBlocks(); renderBlocks(key); break; } }
      });
    });

    // Dropdown — category change
    document.querySelectorAll("[data-dd-cat]").forEach(function(sel) {
      sel.addEventListener("change", function() {
        var bid = sel.getAttribute("data-dd-cat"); var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid) { blocks[i].value = { category: sel.value, value: "" }; saveBlocks(); renderBlocks(key); break; } }
      });
    });
    // Dropdown — value change
    document.querySelectorAll("[data-dd-val]").forEach(function(sel) {
      sel.addEventListener("change", function() {
        var bid = sel.getAttribute("data-dd-val"); var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) { if (blocks[i].id === bid) { blocks[i].value.value = sel.value; saveBlocks(); break; } }
      });
    });

    // Code — language change (trilingual)
    document.querySelectorAll("[data-code-lang]").forEach(function(sel) {
      sel.addEventListener("change", function() {
        var bid = sel.getAttribute("data-code-lang");
        var lang = sel.getAttribute("data-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid) {
            if (blocks[i].value && blocks[i].value[lang]) blocks[i].value[lang].lang = sel.value;
            saveBlocks(); break;
          }
        }
      });
    });

    // Code — code input (trilingual, auto-save with debounce)
    document.querySelectorAll("[data-code-val]").forEach(function(textarea) {
      var debounce = null;
      textarea.addEventListener("input", function() {
        clearTimeout(debounce);
        debounce = setTimeout(function() {
          var bid = textarea.getAttribute("data-code-val");
          var lang = textarea.getAttribute("data-lang") || "ro";
          var blocks = getTaskBlocks(key);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].id === bid) {
              if (blocks[i].value && blocks[i].value[lang]) blocks[i].value[lang].code = textarea.value;
              saveBlocks(); break;
            }
          }
        }, 300);
      });
      // Tab key inserts 2 spaces
      textarea.addEventListener("keydown", function(e) {
        if (e.key === "Tab") {
          e.preventDefault();
          var start = textarea.selectionStart; var end = textarea.selectionEnd;
          textarea.value = textarea.value.substring(0, start) + "  " + textarea.value.substring(end);
          textarea.selectionStart = textarea.selectionEnd = start + 2;
          textarea.dispatchEvent(new Event("input"));
        }
      });
    });

    // Code — copy button (trilingual)
    document.querySelectorAll("[data-code-copy]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var bid = btn.getAttribute("data-code-copy");
        var lang = btn.getAttribute("data-copy-lang") || "ro";
        var blocks = getTaskBlocks(key);
        for (var i = 0; i < blocks.length; i++) {
          if (blocks[i].id === bid && blocks[i].value && blocks[i].value[lang] && blocks[i].value[lang].code) {
            var code = blocks[i].value[lang].code;
            function showCopied() { var span = btn.querySelector("span"); btn.classList.add("copied"); if (span) span.textContent = "Copiat!"; setTimeout(function() { btn.classList.remove("copied"); if (span) span.textContent = "Copiază"; }, 2000); }
            try { navigator.clipboard.writeText(code).then(showCopied); }
            catch(e) { var ta = document.createElement("textarea"); ta.value = code; ta.style.position = "fixed"; ta.style.left = "-9999px"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch(ex) {} document.body.removeChild(ta); showCopied(); }
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
    if (view === "articol" || view === "sondaj" || view === "aplicare") loadIframeIfNeeded(view);
  }
  function updateButtons() {
    var a = document.getElementById("btn-articol"); var s = document.getElementById("btn-sondaj"); var ap = document.getElementById("btn-aplicare");
    if (a) a.classList.toggle("active", currentView === "articol");
    if (s) s.classList.toggle("active", currentView === "sondaj");
    if (ap) ap.classList.toggle("active", currentView === "aplicare");
  }
  function loadIframeIfNeeded(view) {
    if (view === "articol") { var f = document.getElementById("iframe-articol"); if (f && (!f.src || f.src === "about:blank" || f.src.indexOf("/osf") === -1)) f.src = "/articolstiintific/osf"; }
    else if (view === "sondaj") { var f2 = document.getElementById("iframe-sondaj"); if (f2 && (!f2.src || f2.src === "about:blank" || f2.src.indexOf("/sondaj") === -1)) f2.src = "/articolstiintific/sondaj"; }
    else if (view === "aplicare") { var f3 = document.getElementById("iframe-aplicare"); if (f3 && (!f3.src || f3.src === "about:blank" || f3.src.indexOf("/aplicare") === -1)) f3.src = "/aplicare"; }
  }

  window.navigateTo = function(view) {
    activeStageId = null; activeTaskIdx = null; showView(view); updateParentUrl(view); renderNav();
  };
  function updateParentUrl(view) {
    try { var p = window.parent || window; var base = "/articolstiintific";
      var path = view === "articol" ? base + "/osf" : view === "sondaj" ? base + "/sondaj" : view === "aplicare" ? base + "/aplicare" : base;
      if (p.history && p.history.pushState) p.history.pushState({view: view}, "", path);
    } catch(e) {}
  }
  function detectRouteFromParent() {
    try { var pp = ""; try { pp = window.parent.location.pathname; } catch(e) { pp = window.location.pathname; }
      if (pp.indexOf("/osf") !== -1) currentView = "articol";
      else if (pp.indexOf("/sondaj") !== -1) currentView = "sondaj";
      else if (pp.indexOf("/aplicare") !== -1) currentView = "aplicare";
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
    seedBlocksIfNeeded();
    renderNav(); detectRouteFromParent();
    initFromServer();
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
