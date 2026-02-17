"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Settings,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Trash2,
  Pencil,
  ChevronRight,
  ChevronDown as ChevronExpand,
  GripVertical,
  Plus,
  X,
  Check,
  ClipboardList,
  BarChart3,
  Share2,
  PlayCircle,
  Image,
  Video,
  FileText,
  Link,
  Globe,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   R IF C — Studiu Admin — Structura Sondaj
   4 tabs: SONDAJ | REZULTATE | DISTRIBUTIE | PREVIEW
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
interface Category {
  id: string;
  type: string;
  label: string;
  short_code: string;
  color: string;
  display_order: number;
  is_visible: boolean;
  max_materials: number;
}

interface Stimulus {
  id: string;
  name: string;
  type: string;
  industry: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  text_content: string | null;
  pdf_url: string | null;
  site_url: string | null;
  display_order: number;
  is_active: boolean;
}

type TabKey = "sondaj" | "rezultate" | "distributie" | "preview";

const TABS: { key: TabKey; label: string; icon: typeof ClipboardList }[] = [
  { key: "sondaj", label: "SONDAJ", icon: ClipboardList },
  { key: "rezultate", label: "REZULTATE", icon: BarChart3 },
  { key: "distributie", label: "DISTRIBUTIE", icon: Share2 },
  { key: "preview", label: "PREVIEW", icon: PlayCircle },
];

// ── Empty stimulus template ─────────────────────────────────
const emptyStimulus = (type: string, order: number): Partial<Stimulus> => ({
  name: "",
  type,
  industry: "",
  description: "",
  image_url: "",
  video_url: "",
  text_content: "",
  pdf_url: "",
  site_url: "",
  display_order: order,
});

// ── Main Component ─────────────────────────────────────────
export default function StudiuAdminPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("sondaj");
  const [categories, setCategories] = useState<Category[]>([]);
  const [stimuli, setStimuli] = useState<Stimulus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editCatLabel, setEditCatLabel] = useState("");
  const [editCatColor, setEditCatColor] = useState("");
  const [editingStimId, setEditingStimId] = useState<string | null>(null);
  const [editStimData, setEditStimData] = useState<Partial<Stimulus>>({});
  const [addingToType, setAddingToType] = useState<string | null>(null);
  const [newStimData, setNewStimData] = useState<Partial<Stimulus>>({});
  const [saving, setSaving] = useState(false);
  const [activeMatIdx, setActiveMatIdx] = useState(0); // active material tab index

  // ── Fetch data ─────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, stimRes] = await Promise.all([
        fetch("/api/survey/categories"),
        fetch("/api/survey/stimuli?all=true"),
      ]);
      const catData = await catRes.json();
      const stimData = await stimRes.json();

      if (catData.categories) setCategories(catData.categories);
      if (stimData.stimuli) setStimuli(stimData.stimuli);
    } catch {
      setError("Eroare la incarcarea datelor.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Helpers ────────────────────────────────────────────
  const getStimuliForType = (type: string) =>
    stimuli.filter((s) => s.type === type && s.is_active);

  const totalMaterials = stimuli.filter((s) => s.is_active).length;
  const visibleCategories = categories.filter((c) => c.is_visible).length;

  // ── Category actions ───────────────────────────────────
  const toggleVisibility = async (cat: Category) => {
    const res = await fetch("/api/survey/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, is_visible: !cat.is_visible }),
    });
    if ((await res.json()).success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? { ...c, is_visible: !c.is_visible } : c))
      );
    }
  };

  const moveCategory = async (cat: Category, direction: "up" | "down") => {
    const sorted = [...categories].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex((c) => c.id === cat.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const other = sorted[swapIdx];
    const myOrder = cat.display_order;
    const otherOrder = other.display_order;

    await Promise.all([
      fetch("/api/survey/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cat.id, display_order: otherOrder }),
      }),
      fetch("/api/survey/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: other.id, display_order: myOrder }),
      }),
    ]);

    setCategories((prev) =>
      prev
        .map((c) => {
          if (c.id === cat.id) return { ...c, display_order: otherOrder };
          if (c.id === other.id) return { ...c, display_order: myOrder };
          return c;
        })
        .sort((a, b) => a.display_order - b.display_order)
    );
  };

  const deleteCategory = async (cat: Category) => {
    if (!confirm(`Stergi categoria "${cat.label}"? Materialele din ea vor ramane in baza de date.`)) return;
    const res = await fetch(`/api/survey/categories?id=${cat.id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    }
  };

  const startEditCategory = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditCatLabel(cat.label);
    setEditCatColor(cat.color);
  };

  const saveEditCategory = async () => {
    if (!editingCatId) return;
    setSaving(true);
    const res = await fetch("/api/survey/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingCatId, label: editCatLabel, color: editCatColor }),
    });
    if ((await res.json()).success) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCatId ? { ...c, label: editCatLabel, color: editCatColor } : c
        )
      );
    }
    setEditingCatId(null);
    setSaving(false);
  };

  // ── Stimulus actions ───────────────────────────────────
  const startEditStimulus = (stim: Stimulus) => {
    setEditingStimId(stim.id);
    setEditStimData({ ...stim });
  };

  const saveEditStimulus = async () => {
    if (!editingStimId) return;
    setSaving(true);
    const res = await fetch("/api/survey/stimuli", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingStimId, ...editStimData }),
    });
    const result = await res.json();
    if (result.success) {
      setStimuli((prev) =>
        prev.map((s) => (s.id === editingStimId ? { ...s, ...editStimData } : s))
      );
    }
    setEditingStimId(null);
    setSaving(false);
  };

  const deleteStimulus = async (stim: Stimulus) => {
    if (!confirm(`Stergi materialul "${stim.name}"?`)) return;
    const res = await fetch(`/api/survey/stimuli?id=${stim.id}`, { method: "DELETE" });
    if ((await res.json()).success) {
      setStimuli((prev) => prev.map((s) => (s.id === stim.id ? { ...s, is_active: false } : s)));
    }
  };

  const startAddStimulus = (type: string) => {
    const materialsCount = getStimuliForType(type).length;
    setAddingToType(type);
    setNewStimData(emptyStimulus(type, materialsCount + 1));
  };

  const saveNewStimulus = async () => {
    if (!newStimData.name || !addingToType) return;
    setSaving(true);
    const res = await fetch("/api/survey/stimuli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStimData),
    });
    const result = await res.json();
    if (result.success && result.stimulus) {
      setStimuli((prev) => [...prev, result.stimulus]);
    }
    setAddingToType(null);
    setNewStimData({});
    setSaving(false);
  };

  // ── Media icons helper ─────────────────────────────────
  const getMediaIcons = (stim: Stimulus) => {
    const icons: { icon: typeof Image; label: string }[] = [];
    if (stim.image_url) icons.push({ icon: Image, label: "Imagine" });
    if (stim.video_url) icons.push({ icon: Video, label: "Video" });
    if (stim.text_content) icons.push({ icon: FileText, label: "Text" });
    if (stim.pdf_url) icons.push({ icon: FileText, label: "PDF" });
    if (stim.site_url) icons.push({ icon: Link, label: "Site" });
    return icons;
  };

  // ── Render ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header bar */}
      <div style={S.headerBar}>
        <div style={S.logo}>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>R</span>
          <span style={{ color: "#6B7280", fontWeight: 300 }}> IF </span>
          <span style={{ color: "#DC2626", fontWeight: 800 }}>C</span>
        </div>
        <div style={S.headerBadge}>SONDAJ</div>
        <div style={{ flex: 1 }} />
        <button style={S.langBtn} onClick={() => {}}>
          <Globe size={14} />
          <span>RO</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={S.tabsBar}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              style={{
                ...S.tab,
                ...(isActive ? S.tabActive : {}),
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content area */}
      <div style={S.content}>
        {activeTab === "sondaj" && (
          <>
            {/* Header */}
            <div style={S.sectionHeader}>
              <div>
                <h1 style={S.pageTitle}>Structura Sondaj</h1>
                <p style={S.pageSubtitle}>
                  {visibleCategories} categorii &middot; {totalMaterials} materiale
                </p>
              </div>
              <button style={S.addCatBtn} onClick={() => {/* TODO: add new category type */}}>
                <Plus size={16} />
                <span>ADAUGA CATEGORIE</span>
              </button>
            </div>

            {/* Configuration card */}
            <div style={S.configCard}>
              <div style={S.configHeader}>
                <Settings size={16} style={{ color: "#6B7280" }} />
                <span style={S.configTitle}>CONFIGURATIE</span>
              </div>
              <div style={S.configGrid}>
                <div style={S.configItem}>
                  <span style={S.configLabel}>FORMULA</span>
                  <div style={S.configFormula}>
                    <span style={{ color: "#DC2626" }}>R</span>
                    <span style={{ color: "#6B7280" }}> + </span>
                    <span style={{ color: "#6B7280" }}>(</span>
                    <span style={{ color: "#D97706" }}>I</span>
                    <span style={{ color: "#6B7280" }}> &times; </span>
                    <span style={{ color: "#7C3AED" }}>F</span>
                    <span style={{ color: "#6B7280" }}>)</span>
                    <span style={{ color: "#6B7280" }}> = </span>
                    <span style={{ color: "#DC2626", fontWeight: 800 }}>C</span>
                  </div>
                </div>
                <div style={S.configItem}>
                  <span style={S.configLabel}>BUTOANE PER MATERIAL</span>
                  <div style={S.configValue}>R, I, F, C, CTA (1-10)</div>
                </div>
                <div style={S.configItem}>
                  <span style={S.configLabel}>PER CATEGORIE</span>
                  <div style={S.configValue}>Max 3 materiale</div>
                </div>
              </div>
            </div>

            {/* Loading / Error */}
            {loading && <p style={{ textAlign: "center", color: "#6B7280", padding: 40 }}>Se incarca...</p>}
            {error && <p style={{ textAlign: "center", color: "#DC2626", padding: 20 }}>{error}</p>}

            {/* Categories — compact strip when editing, full gallery otherwise */}
            {!loading && !expandedCat && (
              <div style={S.galleryGrid}>
                {categories
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((cat, catIdx) => {
                    const catStimuli = getStimuliForType(cat.type);
                    const maxMat = cat.max_materials;
                    return (
                      <div key={cat.id} style={{ ...S.galleryCard, borderTopColor: cat.color, opacity: cat.is_visible ? 1 : 0.5 }}>
                        <div style={{ ...S.galleryNum, background: cat.color }}>{String(catIdx + 1).padStart(2, "0")}</div>
                        <button style={S.galleryVisBtn} title={cat.is_visible ? "Ascunde" : "Arata"} onClick={(e) => { e.stopPropagation(); toggleVisibility(cat); }}>
                          {cat.is_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <div style={S.galleryTop}><span style={{ ...S.galleryBadge, background: cat.color }}>{cat.short_code}</span></div>
                        <div style={S.galleryName}>{cat.label}</div>
                        <div style={S.galleryCounter}>
                          <div style={S.counterBar}><div style={{ ...S.counterFill, width: `${(catStimuli.length / maxMat) * 100}%`, background: cat.color }} /></div>
                          <span style={S.counterText}>{catStimuli.length}/{maxMat} materiale</span>
                        </div>
                        <button style={{ ...S.galleryEditBtn, width: "100%", justifyContent: "center" }} onClick={() => { setExpandedCat(cat.id); setEditingStimId(null); setAddingToType(null); setEditingCatId(null); setActiveMatIdx(0); }}>
                          <Pencil size={13} /><span>Editeaza</span>
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}

            {/* ═══ COMPACT STRIP + FULL WORKSPACE ═══ */}
            {!loading && expandedCat && (() => {
              const cat = categories.find((c) => c.id === expandedCat);
              if (!cat) return null;
              const catStimuli = getStimuliForType(cat.type);
              const maxMat = cat.max_materials;
              const isEditingName = editingCatId === cat.id;
              const sortedCats = [...categories].sort((a, b) => a.display_order - b.display_order);
              const activeStim = catStimuli[activeMatIdx] || null;
              const isAdding = addingToType === cat.type;

              return (
                <>
                  {/* Compact horizontal category strip */}
                  <div style={S.catStrip}>
                    {sortedCats.map((c) => {
                      const isSel = c.id === expandedCat;
                      const cStim = getStimuliForType(c.type);
                      return (
                        <button
                          key={c.id}
                          style={{
                            ...S.catChip,
                            borderColor: isSel ? c.color : "#e5e7eb",
                            background: isSel ? c.color : "#fff",
                            color: isSel ? "#fff" : "#374151",
                            opacity: c.is_visible ? 1 : 0.4,
                          }}
                          onClick={() => { setExpandedCat(c.id); setEditingStimId(null); setAddingToType(null); setEditingCatId(null); setActiveMatIdx(0); }}
                        >
                          <span style={{ ...S.chipBadge, background: isSel ? "rgba(255,255,255,0.25)" : c.color, color: isSel ? "#fff" : "#fff" }}>{c.short_code}</span>
                          <span style={S.chipCount}>{cStim.length}/{c.max_materials}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Full-width workspace */}
                  <div style={{ ...S.workspace, borderColor: cat.color }}>
                    {/* Workspace header */}
                    <div style={S.wsHeader}>
                      <div style={S.wsHeaderLeft}>
                        <span style={{ ...S.galleryBadge, background: cat.color, fontSize: 13, padding: "6px 16px" }}>{cat.short_code}</span>
                        {isEditingName ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input type="color" value={editCatColor} onChange={(e) => setEditCatColor(e.target.value)} style={S.colorPicker} />
                            <input type="text" value={editCatLabel} onChange={(e) => setEditCatLabel(e.target.value)} style={{ ...S.catEditInput, fontSize: 18, fontWeight: 700 }} autoFocus />
                            <button style={S.iconBtnSave} onClick={saveEditCategory} disabled={saving}><Check size={14} /></button>
                            <button style={S.iconBtnCancel} onClick={() => setEditingCatId(null)}><X size={14} /></button>
                          </div>
                        ) : (
                          <h2 style={{ ...S.wsTitle, fontSize: 22 }}>{cat.label}</h2>
                        )}
                        <span style={S.wsMaterialCount}>{catStimuli.length}/{maxMat}</span>
                      </div>
                      <div style={S.wsHeaderRight}>
                        {!isEditingName && (
                          <>
                            <button style={S.wsActionBtn} onClick={() => startEditCategory(cat)} title="Redenumeste"><Pencil size={14} /><span>Redenumeste</span></button>
                            <button style={S.iconBtnSm} title="Muta sus" onClick={() => moveCategory(cat, "up")}><ChevronUp size={14} /></button>
                            <button style={S.iconBtnSm} title="Muta jos" onClick={() => moveCategory(cat, "down")}><ChevronDown size={14} /></button>
                            <button style={{ ...S.wsActionBtn, color: "#DC2626", borderColor: "#fecaca" }} onClick={() => deleteCategory(cat)}><Trash2 size={14} /><span>Sterge</span></button>
                            <button style={{ ...S.wsActionBtn, color: "#6B7280" }} onClick={() => { setExpandedCat(null); setEditingCatId(null); }}><X size={14} /><span>Inchide</span></button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Material tabs bar */}
                    <div style={S.matTabsBar}>
                      {catStimuli.map((stim, idx) => (
                        <button
                          key={stim.id}
                          style={{
                            ...S.matTab,
                            ...(activeMatIdx === idx && !isAdding ? { color: cat.color, borderBottomColor: cat.color, background: "#fff" } : {}),
                          }}
                          onClick={() => { setActiveMatIdx(idx); setEditingStimId(null); setAddingToType(null); }}
                        >
                          <span style={{ ...S.matTabNum, background: activeMatIdx === idx && !isAdding ? cat.color : "#e5e7eb", color: activeMatIdx === idx && !isAdding ? "#fff" : "#6B7280" }}>{idx + 1}</span>
                          <span style={S.matTabName}>{stim.name || "Material " + (idx + 1)}</span>
                          {getMediaIcons(stim).length > 0 && <span style={S.matTabMediaCount}>{getMediaIcons(stim).length}</span>}
                        </button>
                      ))}
                      {catStimuli.length < maxMat && (
                        <button
                          style={{ ...S.matTab, color: "#059669", ...(isAdding ? { borderBottomColor: "#059669", background: "#fff" } : {}) }}
                          onClick={() => { startAddStimulus(cat.type); setActiveMatIdx(-1); }}
                        >
                          <Plus size={14} />
                          <span>Adauga</span>
                          <span style={{ fontSize: 10, color: "#9CA3AF" }}>({catStimuli.length + 1}/{maxMat})</span>
                        </button>
                      )}
                    </div>

                    {/* Active material — full width editing area */}
                    <div style={S.matWorkArea}>
                      {isAdding ? (
                        /* ── Adding new material ── */
                        <div>
                          <h3 style={S.matWorkTitle}>Material nou</h3>
                          <div style={S.matFormWide}>
                            <div style={S.formRow3}>
                              <div style={S.formField}><label style={S.formLabel}>Nume *</label><input style={S.formInput} value={newStimData.name || ""} onChange={(e) => setNewStimData({ ...newStimData, name: e.target.value })} autoFocus placeholder="Ex: Maison Noir — FB Ad" /></div>
                              <div style={S.formField}><label style={S.formLabel}>Industrie</label><input style={S.formInput} value={newStimData.industry || ""} onChange={(e) => setNewStimData({ ...newStimData, industry: e.target.value })} placeholder="Ex: Restaurant, SaaS" /></div>
                              <div style={S.formField}><label style={S.formLabel}>Display Order</label><input style={S.formInput} type="number" value={newStimData.display_order || 0} onChange={(e) => setNewStimData({ ...newStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                            </div>
                            <div style={S.formField}><label style={S.formLabel}>Descriere</label><textarea style={{ ...S.formInput, minHeight: 100, resize: "vertical" as const }} value={newStimData.description || ""} onChange={(e) => setNewStimData({ ...newStimData, description: e.target.value })} /></div>
                            <div style={S.formRow2}>
                              <div style={S.formField}><label style={S.formLabel}>URL Imagine</label><input style={S.formInput} value={newStimData.image_url || ""} onChange={(e) => setNewStimData({ ...newStimData, image_url: e.target.value })} placeholder="https://..." /></div>
                              <div style={S.formField}><label style={S.formLabel}>URL Video</label><input style={S.formInput} value={newStimData.video_url || ""} onChange={(e) => setNewStimData({ ...newStimData, video_url: e.target.value })} placeholder="https://youtube.com/..." /></div>
                            </div>
                            <div style={S.formRow2}>
                              <div style={S.formField}><label style={S.formLabel}>URL PDF</label><input style={S.formInput} value={newStimData.pdf_url || ""} onChange={(e) => setNewStimData({ ...newStimData, pdf_url: e.target.value })} placeholder="https://..." /></div>
                              <div style={S.formField}><label style={S.formLabel}>URL Site</label><input style={S.formInput} value={newStimData.site_url || ""} onChange={(e) => setNewStimData({ ...newStimData, site_url: e.target.value })} placeholder="https://..." /></div>
                            </div>
                            <div style={S.formField}><label style={S.formLabel}>Text Content</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={newStimData.text_content || ""} onChange={(e) => setNewStimData({ ...newStimData, text_content: e.target.value })} /></div>
                          </div>
                          <div style={{ ...S.stimEditActions, marginTop: 20 }}>
                            <button style={S.btnCancel} onClick={() => { setAddingToType(null); setNewStimData({}); setActiveMatIdx(0); }}>Anuleaza</button>
                            <button style={{ ...S.btnSave, opacity: !newStimData.name ? 0.5 : 1 }} onClick={saveNewStimulus} disabled={saving || !newStimData.name}>{saving ? "Se salveaza..." : "Adauga Material"}</button>
                          </div>
                        </div>
                      ) : activeStim ? (
                        /* ── Existing material — always editable ── */
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <span style={{ ...S.matNum, background: cat.color, width: 36, height: 36, fontSize: 16 }}>{activeMatIdx + 1}</span>
                              <h3 style={S.matWorkTitle}>{activeStim.name}</h3>
                              {activeStim.industry && <span style={S.stimIndustry}>{activeStim.industry}</span>}
                              <div style={S.matMediaRow}>
                                {getMediaIcons(activeStim).map((m, i) => { const MIcon = m.icon; return <span key={i} title={m.label} style={S.matMediaTag}><MIcon size={12} /> {m.label}</span>; })}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              {editingStimId === activeStim.id ? (
                                <>
                                  <button style={S.btnCancel} onClick={() => setEditingStimId(null)}>Anuleaza</button>
                                  <button style={S.btnSave} onClick={saveEditStimulus} disabled={saving}>{saving ? "Se salveaza..." : "Salveaza"}</button>
                                </>
                              ) : (
                                <>
                                  <button style={S.wsActionBtn} onClick={() => startEditStimulus(activeStim)}><Pencil size={14} /><span>Editeaza</span></button>
                                  <button style={{ ...S.wsActionBtn, color: "#DC2626", borderColor: "#fecaca" }} onClick={() => deleteStimulus(activeStim)}><Trash2 size={14} /><span>Sterge</span></button>
                                </>
                              )}
                            </div>
                          </div>

                          {editingStimId === activeStim.id ? (
                            <div style={S.matFormWide}>
                              <div style={S.formRow3}>
                                <div style={S.formField}><label style={S.formLabel}>Nume</label><input style={S.formInput} value={editStimData.name || ""} onChange={(e) => setEditStimData({ ...editStimData, name: e.target.value })} /></div>
                                <div style={S.formField}><label style={S.formLabel}>Industrie</label><input style={S.formInput} value={editStimData.industry || ""} onChange={(e) => setEditStimData({ ...editStimData, industry: e.target.value })} /></div>
                                <div style={S.formField}><label style={S.formLabel}>Display Order</label><input style={S.formInput} type="number" value={editStimData.display_order || 0} onChange={(e) => setEditStimData({ ...editStimData, display_order: parseInt(e.target.value) || 0 })} /></div>
                              </div>
                              <div style={S.formField}><label style={S.formLabel}>Descriere</label><textarea style={{ ...S.formInput, minHeight: 100, resize: "vertical" as const }} value={editStimData.description || ""} onChange={(e) => setEditStimData({ ...editStimData, description: e.target.value })} /></div>
                              <div style={S.formRow2}>
                                <div style={S.formField}><label style={S.formLabel}>URL Imagine</label><input style={S.formInput} value={editStimData.image_url || ""} onChange={(e) => setEditStimData({ ...editStimData, image_url: e.target.value })} placeholder="https://..." /></div>
                                <div style={S.formField}><label style={S.formLabel}>URL Video</label><input style={S.formInput} value={editStimData.video_url || ""} onChange={(e) => setEditStimData({ ...editStimData, video_url: e.target.value })} placeholder="https://youtube.com/..." /></div>
                              </div>
                              <div style={S.formRow2}>
                                <div style={S.formField}><label style={S.formLabel}>URL PDF</label><input style={S.formInput} value={editStimData.pdf_url || ""} onChange={(e) => setEditStimData({ ...editStimData, pdf_url: e.target.value })} placeholder="https://..." /></div>
                                <div style={S.formField}><label style={S.formLabel}>URL Site</label><input style={S.formInput} value={editStimData.site_url || ""} onChange={(e) => setEditStimData({ ...editStimData, site_url: e.target.value })} placeholder="https://..." /></div>
                              </div>
                              <div style={S.formField}><label style={S.formLabel}>Text Content</label><textarea style={{ ...S.formInput, minHeight: 120, resize: "vertical" as const }} value={editStimData.text_content || ""} onChange={(e) => setEditStimData({ ...editStimData, text_content: e.target.value })} /></div>
                            </div>
                          ) : (
                            <div style={S.matPreview}>
                              {activeStim.description && <div style={S.previewSection}><label style={S.previewLabel}>DESCRIERE</label><p style={S.previewText}>{activeStim.description}</p></div>}
                              <div style={S.previewGrid}>
                                {activeStim.image_url && <div style={S.previewItem}><label style={S.previewLabel}>IMAGINE</label><a href={activeStim.image_url} target="_blank" rel="noreferrer" style={S.previewLink}>{activeStim.image_url}</a></div>}
                                {activeStim.video_url && <div style={S.previewItem}><label style={S.previewLabel}>VIDEO</label><a href={activeStim.video_url} target="_blank" rel="noreferrer" style={S.previewLink}>{activeStim.video_url}</a></div>}
                                {activeStim.pdf_url && <div style={S.previewItem}><label style={S.previewLabel}>PDF</label><a href={activeStim.pdf_url} target="_blank" rel="noreferrer" style={S.previewLink}>{activeStim.pdf_url}</a></div>}
                                {activeStim.site_url && <div style={S.previewItem}><label style={S.previewLabel}>SITE</label><a href={activeStim.site_url} target="_blank" rel="noreferrer" style={S.previewLink}>{activeStim.site_url}</a></div>}
                              </div>
                              {activeStim.text_content && <div style={S.previewSection}><label style={S.previewLabel}>TEXT CONTENT</label><p style={S.previewText}>{activeStim.text_content}</p></div>}
                              {!activeStim.description && !activeStim.image_url && !activeStim.video_url && !activeStim.text_content && !activeStim.pdf_url && !activeStim.site_url && (
                                <div style={{ textAlign: "center" as const, padding: "40px 20px", color: "#9CA3AF" }}>
                                  <p style={{ fontSize: 14, marginBottom: 12 }}>Materialul nu are continut inca.</p>
                                  <button style={S.wsActionBtn} onClick={() => startEditStimulus(activeStim)}><Pencil size={14} /><span>Adauga continut</span></button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ textAlign: "center" as const, padding: "60px 20px", color: "#9CA3AF" }}>
                          <Plus size={40} style={{ opacity: 0.3, marginBottom: 12 }} />
                          <p style={{ fontSize: 15 }}>Niciun material in aceasta categorie.</p>
                          <p style={{ fontSize: 13, marginTop: 4 }}>Apasa <strong>Adauga</strong> pentru a crea primul material.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </>
        )}

        {activeTab === "rezultate" && (
          <div style={S.placeholderTab}>
            <BarChart3 size={48} style={{ color: "#d1d5db" }} />
            <h2 style={{ fontSize: 20, color: "#374151", marginTop: 16 }}>Rezultate Sondaj</h2>
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              Vizualizeaza rezultatele agregate ale sondajului — scoruri R, I, F, C pe fiecare material.
            </p>
          </div>
        )}

        {activeTab === "distributie" && (
          <div style={S.placeholderTab}>
            <Share2 size={48} style={{ color: "#d1d5db" }} />
            <h2 style={{ fontSize: 20, color: "#374151", marginTop: 16 }}>Distributie Sondaj</h2>
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              Link-ul public al sondajului:{" "}
              <a href="/studiu/wizard" style={{ color: "#DC2626", fontWeight: 600 }}>
                rifcmarketing.com/studiu/wizard
              </a>
            </p>
          </div>
        )}

        {activeTab === "preview" && (
          <div style={{ width: "100%", height: "80vh", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
            <iframe
              src="/studiu/wizard"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Preview Sondaj"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f8f9fa",
    fontFamily: "Outfit, system-ui, sans-serif",
  },
  headerBar: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "12px 24px",
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
  },
  logo: {
    fontSize: 22,
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: 2,
  },
  headerBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    padding: "4px 12px",
    borderRadius: 6,
    background: "#DC2626",
    color: "#fff",
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
  },
  tabsBar: {
    display: "flex",
    gap: 0,
    padding: "0 24px",
    background: "#fff",
    borderBottom: "2px solid #e5e7eb",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "14px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  tabActive: {
    color: "#DC2626",
    borderBottomColor: "#DC2626",
  },
  content: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px 24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  addCatBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#fff",
    background: "#DC2626",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  configCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  configHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  configTitle: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: "#6B7280",
  },
  configGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },
  configItem: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 14,
  },
  configLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: 1,
    color: "#9CA3AF",
    display: "block",
    marginBottom: 8,
  },
  configFormula: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: "JetBrains Mono, monospace",
  },
  configValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#374151",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  },
  galleryCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderTop: "4px solid transparent",
    borderRadius: 14,
    padding: 20,
    display: "flex",
    flexDirection: "column" as const,
    gap: 12,
    position: "relative" as const,
    transition: "box-shadow 0.2s, transform 0.2s",
  },
  galleryNum: {
    position: "absolute" as const,
    top: -14,
    left: 16,
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "JetBrains Mono, monospace",
    letterSpacing: 0.5,
  },
  galleryVisBtn: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: 6,
    background: "#f3f4f6",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  galleryTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  galleryBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
    padding: "4px 12px",
    borderRadius: 6,
    color: "#fff",
    whiteSpace: "nowrap" as const,
  },
  galleryName: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.3,
  },
  galleryCounter: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 6,
  },
  counterBar: {
    height: 4,
    background: "#f3f4f6",
    borderRadius: 2,
    overflow: "hidden",
  },
  counterFill: {
    height: "100%",
    borderRadius: 2,
    transition: "width 0.3s",
  },
  counterText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
  },
  galleryActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  galleryEditBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#374151",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  galleryExpandBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.15s",
    width: "100%",
  },
  galleryMaterials: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: 12,
  },
  galleryEditWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  iconBtnSm: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 26,
    height: 26,
    border: "none",
    borderRadius: 5,
    background: "#f3f4f6",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  catEditRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  catEditInput: {
    flex: 1,
    padding: "6px 10px",
    fontSize: 14,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    color: "#111827",
  },
  colorPicker: {
    width: 32,
    height: 32,
    padding: 0,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  iconBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#6B7280",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  iconBtnDanger: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 30,
    height: 30,
    border: "none",
    borderRadius: 6,
    background: "transparent",
    color: "#DC2626",
    cursor: "pointer",
    transition: "background 0.15s",
  },
  iconBtnSave: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 6,
    background: "#059669",
    color: "#fff",
    cursor: "pointer",
  },
  iconBtnCancel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 28,
    border: "none",
    borderRadius: 6,
    background: "#e5e7eb",
    color: "#6B7280",
    cursor: "pointer",
  },
  materialsWrap: {
    padding: "0 0 0 0",
    borderTop: "1px solid #f3f4f6",
  },
  emptyMsg: {
    fontSize: 13,
    color: "#9CA3AF",
    padding: "16px 0 8px",
    fontStyle: "italic",
  },
  stimCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    marginTop: 8,
  },
  stimIdx: {
    fontSize: 12,
    fontWeight: 700,
    color: "#9CA3AF",
    fontFamily: "JetBrains Mono, monospace",
    minWidth: 20,
  },
  stimName: {
    fontSize: 14,
    fontWeight: 500,
    color: "#111827",
    flex: 1,
  },
  stimIndustry: {
    fontSize: 11,
    fontWeight: 500,
    padding: "2px 8px",
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#374151",
  },
  stimMediaIcons: {
    display: "flex",
    gap: 4,
  },
  mediaIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#6B7280",
  },
  stimActions: {
    display: "flex",
    gap: 2,
  },
  stimEditForm: {
    background: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },
  stimEditHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  stimEditTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },
  stimEditGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  },
  formField: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 4,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6B7280",
  },
  formInput: {
    padding: "8px 10px",
    fontSize: 13,
    border: "1px solid #d1d5db",
    borderRadius: 6,
    background: "#fff",
    color: "#111827",
    boxSizing: "border-box" as const,
    width: "100%",
    fontFamily: "inherit",
  },
  stimEditActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 14,
    paddingTop: 12,
    borderTop: "1px solid #e5e7eb",
  },
  btnCancel: {
    padding: "8px 16px",
    fontSize: 13,
    fontWeight: 500,
    color: "#6B7280",
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    cursor: "pointer",
  },
  btnSave: {
    padding: "8px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#fff",
    background: "#DC2626",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  addStimBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    color: "#059669",
    background: "transparent",
    border: "1px dashed #bbf7d0",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
    width: "100%",
    justifyContent: "center",
  },
  placeholderTab: {
    textAlign: "center" as const,
    padding: 60,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
  },
  /* ═══ WORKSPACE ═══ */
  workspace: {
    marginTop: 24,
    background: "#fff",
    border: "2px solid #e5e7eb",
    borderRadius: 16,
    padding: 24,
  },
  wsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #e5e7eb",
  },
  wsHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  wsTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  wsMaterialCount: {
    fontSize: 12,
    fontWeight: 700,
    color: "#6B7280",
    background: "#f3f4f6",
    padding: "3px 10px",
    borderRadius: 12,
    fontFamily: "JetBrains Mono, monospace",
  },
  wsHeaderRight: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  wsActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 500,
    color: "#374151",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  /* ═══ MATERIAL CARDS ═══ */
  matGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 16,
  },
  matCard: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 18,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  matCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  matNum: {
    width: 28,
    height: 28,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    color: "#fff",
    fontFamily: "JetBrains Mono, monospace",
    flexShrink: 0,
  },
  matCardName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  matDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.5,
    margin: 0,
  },
  matMediaRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginTop: 4,
  },
  matMediaTag: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 8px",
    borderRadius: 4,
    background: "#e5e7eb",
    color: "#374151",
  },
  matAddCard: {
    background: "#fff",
    border: "2px dashed #e5e7eb",
    borderRadius: 12,
    padding: 32,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    transition: "all 0.2s",
    minHeight: 180,
  },
  /* ═══ COMPACT CATEGORY STRIP ═══ */
  catStrip: {
    display: "flex",
    gap: 6,
    flexWrap: "wrap" as const,
    marginBottom: 16,
  },
  catChip: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 12px",
    border: "2px solid #e5e7eb",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    background: "#fff",
  },
  chipBadge: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 0.5,
    padding: "2px 6px",
    borderRadius: 4,
    color: "#fff",
  },
  chipCount: {
    fontSize: 10,
    fontWeight: 600,
    opacity: 0.7,
    fontFamily: "JetBrains Mono, monospace",
  },
  /* ═══ MATERIAL TABS BAR ═══ */
  matTabsBar: {
    display: "flex",
    gap: 0,
    borderBottom: "2px solid #e5e7eb",
    marginBottom: 0,
    overflowX: "auto" as const,
  },
  matTab: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    background: "#f9fafb",
    border: "none",
    borderBottom: "2px solid transparent",
    marginBottom: -2,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  },
  matTabNum: {
    width: 22,
    height: 22,
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    fontFamily: "JetBrains Mono, monospace",
    flexShrink: 0,
  },
  matTabName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  matTabMediaCount: {
    fontSize: 10,
    fontWeight: 700,
    padding: "1px 6px",
    borderRadius: 10,
    background: "#e5e7eb",
    color: "#6B7280",
  },
  /* ═══ MATERIAL WORK AREA ═══ */
  matWorkArea: {
    padding: "28px 4px",
    minHeight: 300,
  },
  matWorkTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  matFormWide: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
  },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: 16,
  },
  /* ═══ MATERIAL PREVIEW ═══ */
  matPreview: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 16,
  },
  previewSection: {
    padding: "16px 20px",
    background: "#f9fafb",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },
  previewLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#9CA3AF",
    display: "block",
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.7,
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  previewGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  previewItem: {
    padding: "12px 16px",
    background: "#f9fafb",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
  previewLink: {
    fontSize: 13,
    color: "#2563EB",
    wordBreak: "break-all" as const,
    textDecoration: "none",
  },
};
