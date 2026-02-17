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

            {/* Categories list */}
            {!loading &&
              categories
                .sort((a, b) => a.display_order - b.display_order)
                .map((cat) => {
                  const catStimuli = getStimuliForType(cat.type);
                  const isExpanded = expandedCat === cat.id;
                  const isEditing = editingCatId === cat.id;
                  const maxMat = cat.max_materials;

                  return (
                    <div key={cat.id} style={S.catCard}>
                      {/* Category row */}
                      <div style={S.catRow}>
                        <div style={S.catDrag}>
                          <GripVertical size={16} style={{ color: "#d1d5db" }} />
                        </div>

                        {isEditing ? (
                          /* Edit mode */
                          <div style={S.catEditRow}>
                            <input
                              type="color"
                              value={editCatColor}
                              onChange={(e) => setEditCatColor(e.target.value)}
                              style={S.colorPicker}
                            />
                            <input
                              type="text"
                              value={editCatLabel}
                              onChange={(e) => setEditCatLabel(e.target.value)}
                              style={S.catEditInput}
                              autoFocus
                            />
                            <button style={S.iconBtnSave} onClick={saveEditCategory} disabled={saving}>
                              <Check size={14} />
                            </button>
                            <button style={S.iconBtnCancel} onClick={() => setEditingCatId(null)}>
                              <X size={14} />
                            </button>
                          </div>
                        ) : (
                          /* Display mode */
                          <>
                            <span
                              style={{
                                ...S.catBadge,
                                background: cat.color,
                              }}
                            >
                              {cat.short_code}
                            </span>
                            <span style={S.catName}>{cat.label}</span>
                            <span style={S.catCount}>
                              {catStimuli.length}/{maxMat} materiale
                            </span>

                            {/* Action buttons */}
                            <div style={S.catActions}>
                              <button
                                style={S.iconBtn}
                                title={cat.is_visible ? "Ascunde" : "Arata"}
                                onClick={() => toggleVisibility(cat)}
                              >
                                {cat.is_visible ? (
                                  <Eye size={15} style={{ color: "#059669" }} />
                                ) : (
                                  <EyeOff size={15} style={{ color: "#9CA3AF" }} />
                                )}
                              </button>
                              <button style={S.iconBtn} title="Muta sus" onClick={() => moveCategory(cat, "up")}>
                                <ChevronUp size={15} />
                              </button>
                              <button style={S.iconBtn} title="Muta jos" onClick={() => moveCategory(cat, "down")}>
                                <ChevronDown size={15} />
                              </button>
                              <button style={S.iconBtn} title="Editeaza" onClick={() => startEditCategory(cat)}>
                                <Pencil size={14} />
                              </button>
                              <button style={S.iconBtnDanger} title="Sterge" onClick={() => deleteCategory(cat)}>
                                <Trash2 size={14} />
                              </button>
                              <button
                                style={S.iconBtn}
                                title={isExpanded ? "Restringe" : "Expandeaza"}
                                onClick={() => setExpandedCat(isExpanded ? null : cat.id)}
                              >
                                {isExpanded ? (
                                  <ChevronExpand size={16} style={{ transform: "rotate(180deg)" }} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Expanded materials */}
                      {isExpanded && (
                        <div style={S.materialsWrap}>
                          {catStimuli.length === 0 && addingToType !== cat.type && (
                            <p style={S.emptyMsg}>
                              Niciun material adaugat. Adauga primul material de marketing.
                            </p>
                          )}

                          {catStimuli.map((stim, idx) => (
                            <div key={stim.id}>
                              {editingStimId === stim.id ? (
                                /* Edit stimulus form */
                                <div style={S.stimEditForm}>
                                  <div style={S.stimEditHeader}>
                                    <Pencil size={14} style={{ color: "#6B7280" }} />
                                    <span style={S.stimEditTitle}>Editare Material</span>
                                  </div>
                                  <div style={S.stimEditGrid}>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>Nume</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.name || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, name: e.target.value })}
                                      />
                                    </div>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>Industrie</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.industry || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, industry: e.target.value })}
                                      />
                                    </div>
                                    <div style={{ ...S.formField, gridColumn: "1 / -1" }}>
                                      <label style={S.formLabel}>Descriere</label>
                                      <textarea
                                        style={{ ...S.formInput, minHeight: 60, resize: "vertical" as const }}
                                        value={editStimData.description || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, description: e.target.value })}
                                      />
                                    </div>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>URL Imagine</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.image_url || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, image_url: e.target.value })}
                                        placeholder="https://..."
                                      />
                                    </div>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>URL Video (YouTube)</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.video_url || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, video_url: e.target.value })}
                                        placeholder="https://youtube.com/..."
                                      />
                                    </div>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>URL PDF</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.pdf_url || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, pdf_url: e.target.value })}
                                        placeholder="https://..."
                                      />
                                    </div>
                                    <div style={S.formField}>
                                      <label style={S.formLabel}>URL Site</label>
                                      <input
                                        style={S.formInput}
                                        value={editStimData.site_url || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, site_url: e.target.value })}
                                        placeholder="https://..."
                                      />
                                    </div>
                                    <div style={{ ...S.formField, gridColumn: "1 / -1" }}>
                                      <label style={S.formLabel}>Text Content</label>
                                      <textarea
                                        style={{ ...S.formInput, minHeight: 60, resize: "vertical" as const }}
                                        value={editStimData.text_content || ""}
                                        onChange={(e) => setEditStimData({ ...editStimData, text_content: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div style={S.stimEditActions}>
                                    <button style={S.btnCancel} onClick={() => setEditingStimId(null)}>
                                      Anuleaza
                                    </button>
                                    <button style={S.btnSave} onClick={saveEditStimulus} disabled={saving}>
                                      {saving ? "Se salveaza..." : "Salveaza"}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                /* Display stimulus */
                                <div style={S.stimCard}>
                                  <span style={S.stimIdx}>{idx + 1}.</span>
                                  <span style={S.stimName}>{stim.name}</span>
                                  {stim.industry && (
                                    <span style={S.stimIndustry}>{stim.industry}</span>
                                  )}
                                  <div style={S.stimMediaIcons}>
                                    {getMediaIcons(stim).map((m, i) => {
                                      const MIcon = m.icon;
                                      return (
                                        <span key={i} title={m.label} style={S.mediaIcon}>
                                          <MIcon size={13} />
                                        </span>
                                      );
                                    })}
                                  </div>
                                  <div style={S.stimActions}>
                                    <button style={S.iconBtn} title="Editeaza" onClick={() => startEditStimulus(stim)}>
                                      <Pencil size={13} />
                                    </button>
                                    <button style={S.iconBtnDanger} title="Sterge" onClick={() => deleteStimulus(stim)}>
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Add new stimulus form */}
                          {addingToType === cat.type ? (
                            <div style={S.stimEditForm}>
                              <div style={S.stimEditHeader}>
                                <Plus size={14} style={{ color: "#059669" }} />
                                <span style={S.stimEditTitle}>Material nou</span>
                              </div>
                              <div style={S.stimEditGrid}>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>Nume *</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.name || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, name: e.target.value })}
                                    autoFocus
                                    placeholder="Ex: Maison Noir — FB Ad"
                                  />
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>Industrie</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.industry || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, industry: e.target.value })}
                                    placeholder="Ex: Restaurant, SaaS, Fashion"
                                  />
                                </div>
                                <div style={{ ...S.formField, gridColumn: "1 / -1" }}>
                                  <label style={S.formLabel}>Descriere</label>
                                  <textarea
                                    style={{ ...S.formInput, minHeight: 60, resize: "vertical" as const }}
                                    value={newStimData.description || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, description: e.target.value })}
                                    placeholder="Scurta descriere a materialului..."
                                  />
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>URL Imagine</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.image_url || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, image_url: e.target.value })}
                                    placeholder="https://..."
                                  />
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>URL Video (YouTube)</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.video_url || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, video_url: e.target.value })}
                                    placeholder="https://youtube.com/..."
                                  />
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>URL PDF</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.pdf_url || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, pdf_url: e.target.value })}
                                    placeholder="https://..."
                                  />
                                </div>
                                <div style={S.formField}>
                                  <label style={S.formLabel}>URL Site</label>
                                  <input
                                    style={S.formInput}
                                    value={newStimData.site_url || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, site_url: e.target.value })}
                                    placeholder="https://..."
                                  />
                                </div>
                                <div style={{ ...S.formField, gridColumn: "1 / -1" }}>
                                  <label style={S.formLabel}>Text Content</label>
                                  <textarea
                                    style={{ ...S.formInput, minHeight: 60, resize: "vertical" as const }}
                                    value={newStimData.text_content || ""}
                                    onChange={(e) => setNewStimData({ ...newStimData, text_content: e.target.value })}
                                    placeholder="Continut text al materialului..."
                                  />
                                </div>
                              </div>
                              <div style={S.stimEditActions}>
                                <button
                                  style={S.btnCancel}
                                  onClick={() => {
                                    setAddingToType(null);
                                    setNewStimData({});
                                  }}
                                >
                                  Anuleaza
                                </button>
                                <button
                                  style={{
                                    ...S.btnSave,
                                    opacity: !newStimData.name ? 0.5 : 1,
                                  }}
                                  onClick={saveNewStimulus}
                                  disabled={saving || !newStimData.name}
                                >
                                  {saving ? "Se salveaza..." : "Adauga"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            catStimuli.length < maxMat && (
                              <button style={S.addStimBtn} onClick={() => startAddStimulus(cat.type)}>
                                <Plus size={14} />
                                <span>Adauga material</span>
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
    maxWidth: 960,
    margin: "0 auto",
    padding: "24px 16px",
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
  catCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
    borderLeft: "3px solid transparent",
  },
  catRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
    minHeight: 52,
  },
  catDrag: {
    cursor: "grab",
    display: "flex",
    alignItems: "center",
    padding: "2px 0",
  },
  catBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 0.5,
    padding: "4px 10px",
    borderRadius: 4,
    color: "#fff",
    whiteSpace: "nowrap" as const,
  },
  catName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
    flex: 1,
  },
  catCount: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: 500,
    whiteSpace: "nowrap" as const,
    padding: "3px 10px",
    background: "#f3f4f6",
    borderRadius: 12,
  },
  catActions: {
    display: "flex",
    alignItems: "center",
    gap: 2,
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
    padding: "0 16px 16px 56px",
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
};
