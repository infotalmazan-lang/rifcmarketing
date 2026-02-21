"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  X,
  ExternalLink,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Award,
  BookOpen,
  Users,
  Globe,
  Lightbulb,
  Trophy,
  GraduationCap,
  Mic2,
  Gift,
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Star,
  Tag,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   R IF C — Aplicare Programe
   7 tabs: ALL | Conferinte Academice | Granturi | Competitii cu Premii | Forumuri | Premii | Oportunitati
   Password: APLICARE2026
   ═══════════════════════════════════════════════════════════ */

// ── Types ──────────────────────────────────────────────────
interface Program {
  id: string;
  title: string;
  category: CategoryKey;
  description: string;
  deadline: string | null;
  location: string | null;
  url: string | null;
  budget: string | null;
  organizer: string | null;
  status: "open" | "closed" | "upcoming";
  tags: string[];
  notes: string | null;
  created_at: string;
}

type CategoryKey = "conferinte" | "granturi" | "competitii" | "forumuri" | "premii" | "oportunitati";

interface CategoryDef {
  key: CategoryKey;
  label: string;
  icon: typeof BookOpen;
  color: string;
  gradient: string;
}

const CATEGORIES: CategoryDef[] = [
  { key: "conferinte", label: "Conferinte Academice", icon: Mic2, color: "#2563EB", gradient: "linear-gradient(135deg, #2563EB, #1D4ED8)" },
  { key: "granturi", label: "Granturi", icon: DollarSign, color: "#059669", gradient: "linear-gradient(135deg, #059669, #047857)" },
  { key: "competitii", label: "Competitii cu Premii", icon: Trophy, color: "#D97706", gradient: "linear-gradient(135deg, #D97706, #B45309)" },
  { key: "forumuri", label: "Forumuri", icon: Users, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
  { key: "premii", label: "Premii", icon: Award, color: "#DC2626", gradient: "linear-gradient(135deg, #DC2626, #B91C1C)" },
  { key: "oportunitati", label: "Oportunitati", icon: Lightbulb, color: "#0891B2", gradient: "linear-gradient(135deg, #0891B2, #0E7490)" },
];

type TabKey = "all" | CategoryKey;

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "ALL" },
  ...CATEGORIES.map((c) => ({ key: c.key as TabKey, label: c.label })),
];

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  open: { bg: "#f0fdf4", text: "#16a34a", label: "Deschis" },
  closed: { bg: "#fef2f2", text: "#dc2626", label: "Inchis" },
  upcoming: { bg: "#eff6ff", text: "#2563eb", label: "In curand" },
};

const ACCESS_CODE = "APLICARE2026";
const STORAGE_KEY = "rifc-aplicare-access";
const DATA_KEY = "rifc-aplicare-programs";

// ── Styles ─────────────────────────────────────────────────
const S: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#FAFAFA",
    fontFamily: "'Inter', sans-serif",
  },
  // Access gate
  accessOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  accessCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    maxWidth: 400,
    width: "100%",
    textAlign: "center" as const,
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },
  accessLogo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14,
    color: "#DC2626",
    letterSpacing: 4,
    fontWeight: 700,
    marginBottom: 8,
  },
  accessTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
    marginBottom: 8,
  },
  accessSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 28,
  },
  accessInput: {
    width: "100%",
    padding: "14px 16px",
    fontSize: 15,
    border: "2px solid #E5E7EB",
    borderRadius: 10,
    outline: "none",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: 2,
    textAlign: "center" as const,
    marginBottom: 16,
    transition: "border-color 0.2s",
  },
  accessBtn: {
    width: "100%",
    padding: "14px 24px",
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #DC2626, #B91C1C)",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 1,
    transition: "all 0.2s",
  },
  accessError: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: 12,
    fontWeight: 600,
  },
  // Header
  header: {
    padding: "28px 36px 0",
    borderBottom: "1px solid #E5E7EB",
    background: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(20px)",
    position: "sticky" as const,
    top: 0,
    zIndex: 50,
  },
  headerTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  logo: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: "#DC2626",
    letterSpacing: 4,
    fontWeight: 700,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
  },
  pageSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    fontSize: 12,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #DC2626, #B91C1C)",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    letterSpacing: 0.5,
    transition: "all 0.2s",
  },
  searchWrap: {
    position: "relative" as const,
    display: "flex",
    alignItems: "center",
  },
  searchInput: {
    padding: "9px 14px 9px 36px",
    fontSize: 13,
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    outline: "none",
    width: 240,
    background: "#F9FAFB",
    transition: "all 0.2s",
  },
  searchIcon: {
    position: "absolute" as const,
    left: 12,
    color: "#9CA3AF",
    pointerEvents: "none" as const,
  },
  // Tabs
  tabsRow: {
    display: "flex",
    gap: 0,
    overflowX: "auto" as const,
  },
  tab: {
    padding: "12px 18px",
    fontSize: 12,
    fontWeight: 600,
    color: "#6B7280",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    transition: "all 0.2s",
    whiteSpace: "nowrap" as const,
    letterSpacing: 0.3,
  },
  tabActive: {
    color: "#DC2626",
    borderBottomColor: "#DC2626",
  },
  tabCount: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 10,
    background: "#F3F4F6",
    color: "#6B7280",
    marginLeft: 6,
  },
  tabCountActive: {
    background: "#FEE2E2",
    color: "#DC2626",
  },
  // Content
  content: {
    padding: "28px 36px 80px",
    maxWidth: 1200,
  },
  // Stats bar
  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 12,
    padding: "16px 18px",
    textAlign: "center" as const,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 800,
    fontFamily: "'JetBrains Mono', monospace",
    color: "#111827",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 600,
    color: "#9CA3AF",
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginTop: 4,
  },
  // Cards grid
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: 14,
    overflow: "hidden",
    transition: "all 0.2s",
    cursor: "pointer",
    position: "relative" as const,
  },
  cardTop: {
    height: 4,
  },
  cardBody: {
    padding: "18px 20px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111827",
    lineHeight: 1.4,
    flex: 1,
  },
  cardBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 10,
    letterSpacing: 0.5,
    flexShrink: 0,
    marginLeft: 10,
  },
  cardDesc: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 1.6,
    marginBottom: 14,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical" as const,
    overflow: "hidden",
  },
  cardMeta: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
    fontSize: 11,
    color: "#9CA3AF",
  },
  cardMetaItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  cardTags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 4,
    marginTop: 12,
  },
  cardTag: {
    fontSize: 10,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 6,
    background: "#F3F4F6",
    color: "#6B7280",
  },
  cardActions: {
    display: "flex",
    gap: 6,
    padding: "12px 20px",
    borderTop: "1px solid #F3F4F6",
  },
  cardActionBtn: {
    fontSize: 11,
    fontWeight: 600,
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #E5E7EB",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
    transition: "all 0.15s",
  },
  // Empty state
  emptyState: {
    textAlign: "center" as const,
    padding: "80px 20px",
    color: "#9CA3AF",
  },
  // Modal
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: 20,
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    maxWidth: 600,
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid #E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },
  modalCloseBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    padding: 4,
  },
  modalBody: {
    padding: "20px 24px",
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    marginBottom: 6,
    display: "block",
  },
  formInput: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    transition: "border-color 0.2s",
  },
  formSelect: {
    width: "100%",
    padding: "10px 14px",
    fontSize: 14,
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    outline: "none",
    fontFamily: "'Inter', sans-serif",
    background: "#fff",
    cursor: "pointer",
  },
  formRow2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    padding: "16px 24px",
    borderTop: "1px solid #E5E7EB",
  },
  btnCancel: {
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#6B7280",
    background: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: 8,
    cursor: "pointer",
  },
  btnSave: {
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 700,
    color: "#fff",
    background: "linear-gradient(135deg, #DC2626, #B91C1C)",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    letterSpacing: 0.3,
  },
  btnDelete: {
    padding: "10px 20px",
    fontSize: 13,
    fontWeight: 600,
    color: "#DC2626",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: 8,
    cursor: "pointer",
    marginRight: "auto",
  },
  // Detail modal
  detailSection: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#9CA3AF",
    letterSpacing: 1,
    textTransform: "uppercase" as const,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 1.7,
  },
};

// ── Helpers ────────────────────────────────────────────────
function generateId(): string {
  return "ap-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function getCategoryDef(key: CategoryKey): CategoryDef {
  return CATEGORIES.find((c) => c.key === key) || CATEGORIES[0];
}

function loadPrograms(): Program[] {
  try {
    const raw = localStorage.getItem(DATA_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function savePrograms(programs: Program[]): void {
  localStorage.setItem(DATA_KEY, JSON.stringify(programs));
}

// ── Component ──────────────────────────────────────────────
export default function AplicareProgramePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [accessInput, setAccessInput] = useState("");
  const [accessError, setAccessError] = useState("");

  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState<Program[]>([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<Partial<Program>>({});
  const [tagsInput, setTagsInput] = useState("");

  // Check access on mount
  useEffect(() => {
    const granted = localStorage.getItem(STORAGE_KEY);
    if (granted === "granted") {
      setHasAccess(true);
    }
  }, []);

  // Load data on access
  useEffect(() => {
    if (hasAccess) {
      setPrograms(loadPrograms());
    }
  }, [hasAccess]);

  const validateAccess = useCallback(() => {
    if (accessInput.trim() === ACCESS_CODE) {
      localStorage.setItem(STORAGE_KEY, "granted");
      setHasAccess(true);
      setAccessError("");
    } else {
      setAccessError("Cod incorect. Incearca din nou.");
      setAccessInput("");
    }
  }, [accessInput]);

  // Filter programs
  const filtered = programs.filter((p) => {
    if (activeTab !== "all" && p.category !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.organizer && p.organizer.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Stats
  const totalPrograms = programs.length;
  const openPrograms = programs.filter((p) => p.status === "open").length;
  const categoryCounts: Record<string, number> = {};
  CATEGORIES.forEach((c) => {
    categoryCounts[c.key] = programs.filter((p) => p.category === c.key).length;
  });

  // Add/Edit modal
  const openAddModal = (category?: CategoryKey) => {
    setFormData({ category: category || "conferinte", status: "open", tags: [] });
    setTagsInput("");
    setEditingProgram(null);
    setShowAddModal(true);
  };

  const openEditModal = (program: Program) => {
    setFormData({ ...program });
    setTagsInput(program.tags.join(", "));
    setEditingProgram(program);
    setShowAddModal(true);
  };

  const saveProgram = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingProgram) {
      const updated = programs.map((p) =>
        p.id === editingProgram.id ? { ...p, ...formData, tags } : p
      );
      setPrograms(updated);
      savePrograms(updated);
    } else {
      const newProgram: Program = {
        id: generateId(),
        title: formData.title || "Program nou",
        category: (formData.category as CategoryKey) || "conferinte",
        description: formData.description || "",
        deadline: formData.deadline || null,
        location: formData.location || null,
        url: formData.url || null,
        budget: formData.budget || null,
        organizer: formData.organizer || null,
        status: (formData.status as "open" | "closed" | "upcoming") || "open",
        tags,
        notes: formData.notes || null,
        created_at: new Date().toISOString(),
      };
      const updated = [...programs, newProgram];
      setPrograms(updated);
      savePrograms(updated);
    }
    setShowAddModal(false);
    setEditingProgram(null);
    setFormData({});
  };

  const deleteProgram = (id: string) => {
    const updated = programs.filter((p) => p.id !== id);
    setPrograms(updated);
    savePrograms(updated);
    setShowAddModal(false);
    setViewingProgram(null);
    setEditingProgram(null);
  };

  // ── Access Gate ──────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div style={S.accessOverlay}>
        <div style={S.accessCard}>
          <div style={S.accessLogo}>R IF C</div>
          <h2 style={S.accessTitle}>Aplicare Programe</h2>
          <p style={S.accessSubtitle}>Introduceti codul de acces pentru a continua</p>
          <input
            type="password"
            style={S.accessInput}
            value={accessInput}
            onChange={(e) => setAccessInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && validateAccess()}
            placeholder="Cod de acces"
            autoFocus
          />
          <button style={S.accessBtn} onClick={validateAccess}>
            ACCES
          </button>
          {accessError && <p style={S.accessError}>{accessError}</p>}
        </div>
      </div>
    );
  }

  // ── Main UI ──────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.headerTop}>
          <div style={S.headerLeft}>
            <div>
              <div style={S.logo}>R IF C</div>
              <h1 style={S.pageTitle}>Aplicare Programe</h1>
              <p style={S.pageSubtitle}>
                {totalPrograms} programe &middot; {openPrograms} deschise
              </p>
            </div>
          </div>
          <div style={S.headerRight}>
            <div style={S.searchWrap}>
              <Search size={14} style={S.searchIcon} />
              <input
                type="text"
                style={S.searchInput}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cauta programe..."
              />
            </div>
            <button style={S.addBtn} onClick={() => openAddModal()}>
              <Plus size={14} />
              <span>ADAUGA</span>
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div style={S.tabsRow}>
          {TABS.map((t) => {
            const count = t.key === "all" ? totalPrograms : categoryCounts[t.key] || 0;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                style={{ ...S.tab, ...(isActive ? S.tabActive : {}) }}
                onClick={() => setActiveTab(t.key)}
              >
                {t.label}
                <span style={{ ...S.tabCount, ...(isActive ? S.tabCountActive : {}) }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={S.content}>
        {/* Stats */}
        <div style={S.statsBar}>
          {CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.key] || 0;
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                style={{ ...S.statCard, borderTop: `3px solid ${cat.color}`, cursor: "pointer" }}
                onClick={() => setActiveTab(cat.key)}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                  <Icon size={16} style={{ color: cat.color }} />
                </div>
                <div style={S.statValue}>{count}</div>
                <div style={S.statLabel}>{cat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={S.emptyState}>
            <Briefcase size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
            <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 8 }}>
              {search ? "Niciun program gasit pentru cautarea ta." : "Niciun program in aceasta categorie."}
            </p>
            <button style={S.addBtn} onClick={() => openAddModal(activeTab !== "all" ? (activeTab as CategoryKey) : undefined)}>
              <Plus size={14} />
              <span>Adauga program</span>
            </button>
          </div>
        ) : (
          <div style={S.grid}>
            {filtered
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((program) => {
                const cat = getCategoryDef(program.category);
                const status = STATUS_COLORS[program.status] || STATUS_COLORS.open;
                const Icon = cat.icon;
                return (
                  <div
                    key={program.id}
                    style={S.card}
                    onClick={() => setViewingProgram(program)}
                  >
                    <div style={{ ...S.cardTop, background: cat.gradient }} />
                    <div style={S.cardBody}>
                      <div style={S.cardHeader}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <Icon size={16} style={{ color: cat.color, flexShrink: 0 }} />
                          <span style={S.cardTitle}>{program.title}</span>
                        </div>
                        <span style={{ ...S.cardBadge, background: status.bg, color: status.text }}>
                          {status.label}
                        </span>
                      </div>
                      {program.description && (
                        <p style={S.cardDesc}>{program.description}</p>
                      )}
                      <div style={S.cardMeta}>
                        {program.deadline && (
                          <span style={S.cardMetaItem}>
                            <Calendar size={12} /> {program.deadline}
                          </span>
                        )}
                        {program.location && (
                          <span style={S.cardMetaItem}>
                            <MapPin size={12} /> {program.location}
                          </span>
                        )}
                        {program.budget && (
                          <span style={S.cardMetaItem}>
                            <DollarSign size={12} /> {program.budget}
                          </span>
                        )}
                        {program.organizer && (
                          <span style={S.cardMetaItem}>
                            <Users size={12} /> {program.organizer}
                          </span>
                        )}
                      </div>
                      {program.tags.length > 0 && (
                        <div style={S.cardTags}>
                          {program.tags.map((tag, i) => (
                            <span key={i} style={S.cardTag}>{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* ═══ View Program Modal ═══ */}
      {viewingProgram && !showAddModal && (() => {
        const cat = getCategoryDef(viewingProgram.category);
        const status = STATUS_COLORS[viewingProgram.status] || STATUS_COLORS.open;
        const Icon = cat.icon;
        return (
          <div style={S.modalOverlay} onClick={() => setViewingProgram(null)}>
            <div style={S.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ ...S.modalHeader, borderTop: `4px solid ${cat.color}`, borderRadius: "16px 16px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon size={20} style={{ color: cat.color }} />
                  <h3 style={S.modalTitle}>{viewingProgram.title}</h3>
                </div>
                <button style={S.modalCloseBtn} onClick={() => setViewingProgram(null)}>
                  <X size={18} />
                </button>
              </div>
              <div style={S.modalBody}>
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  <span style={{ ...S.cardBadge, background: status.bg, color: status.text }}>{status.label}</span>
                  <span style={{ ...S.cardBadge, background: `${cat.color}14`, color: cat.color }}>{cat.label}</span>
                </div>

                {viewingProgram.description && (
                  <div style={S.detailSection}>
                    <div style={S.detailLabel}>Descriere</div>
                    <p style={S.detailText}>{viewingProgram.description}</p>
                  </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {viewingProgram.deadline && (
                    <div>
                      <div style={S.detailLabel}>Deadline</div>
                      <div style={{ ...S.detailText, display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} style={{ color: "#6B7280" }} /> {viewingProgram.deadline}
                      </div>
                    </div>
                  )}
                  {viewingProgram.location && (
                    <div>
                      <div style={S.detailLabel}>Locatie</div>
                      <div style={{ ...S.detailText, display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} style={{ color: "#6B7280" }} /> {viewingProgram.location}
                      </div>
                    </div>
                  )}
                  {viewingProgram.budget && (
                    <div>
                      <div style={S.detailLabel}>Buget / Valoare</div>
                      <div style={{ ...S.detailText, display: "flex", alignItems: "center", gap: 6 }}>
                        <DollarSign size={14} style={{ color: "#6B7280" }} /> {viewingProgram.budget}
                      </div>
                    </div>
                  )}
                  {viewingProgram.organizer && (
                    <div>
                      <div style={S.detailLabel}>Organizator</div>
                      <div style={{ ...S.detailText, display: "flex", alignItems: "center", gap: 6 }}>
                        <Users size={14} style={{ color: "#6B7280" }} /> {viewingProgram.organizer}
                      </div>
                    </div>
                  )}
                </div>

                {viewingProgram.url && (
                  <div style={S.detailSection}>
                    <div style={S.detailLabel}>Link</div>
                    <a href={viewingProgram.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#2563EB", display: "flex", alignItems: "center", gap: 6 }}>
                      <ExternalLink size={14} /> {viewingProgram.url}
                    </a>
                  </div>
                )}

                {viewingProgram.notes && (
                  <div style={S.detailSection}>
                    <div style={S.detailLabel}>Note</div>
                    <p style={{ ...S.detailText, whiteSpace: "pre-wrap" }}>{viewingProgram.notes}</p>
                  </div>
                )}

                {viewingProgram.tags.length > 0 && (
                  <div style={S.detailSection}>
                    <div style={S.detailLabel}>Tags</div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                      {viewingProgram.tags.map((tag, i) => (
                        <span key={i} style={{ ...S.cardTag, fontSize: 12, padding: "4px 12px" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div style={S.modalFooter}>
                <button style={S.btnDelete} onClick={() => deleteProgram(viewingProgram.id)}>
                  Sterge
                </button>
                <button style={S.btnCancel} onClick={() => setViewingProgram(null)}>
                  Inchide
                </button>
                <button
                  style={S.btnSave}
                  onClick={() => {
                    setViewingProgram(null);
                    openEditModal(viewingProgram);
                  }}
                >
                  Editeaza
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ Add/Edit Modal ═══ */}
      {showAddModal && (
        <div style={S.modalOverlay} onClick={() => setShowAddModal(false)}>
          <div style={S.modal} onClick={(e) => e.stopPropagation()}>
            <div style={S.modalHeader}>
              <h3 style={S.modalTitle}>
                {editingProgram ? "Editeaza program" : "Adauga program nou"}
              </h3>
              <button style={S.modalCloseBtn} onClick={() => setShowAddModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div style={S.modalBody}>
              <div style={S.formField}>
                <label style={S.formLabel}>Titlu *</label>
                <input
                  style={S.formInput}
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Numele programului"
                  autoFocus
                />
              </div>

              <div style={S.formRow2}>
                <div style={S.formField}>
                  <label style={S.formLabel}>Categorie</label>
                  <select
                    style={S.formSelect}
                    value={formData.category || "conferinte"}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryKey })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Status</label>
                  <select
                    style={S.formSelect}
                    value={formData.status || "open"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as "open" | "closed" | "upcoming" })}
                  >
                    <option value="open">Deschis</option>
                    <option value="upcoming">In curand</option>
                    <option value="closed">Inchis</option>
                  </select>
                </div>
              </div>

              <div style={S.formField}>
                <label style={S.formLabel}>Descriere</label>
                <textarea
                  style={{ ...S.formInput, minHeight: 100, resize: "vertical" as const }}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descriere detaliata a programului"
                />
              </div>

              <div style={S.formRow2}>
                <div style={S.formField}>
                  <label style={S.formLabel}>Deadline</label>
                  <input
                    style={S.formInput}
                    value={formData.deadline || ""}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    placeholder="Ex: 15 Martie 2026"
                  />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Locatie</label>
                  <input
                    style={S.formInput}
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Ex: Online / Berlin, Germania"
                  />
                </div>
              </div>

              <div style={S.formRow2}>
                <div style={S.formField}>
                  <label style={S.formLabel}>Buget / Valoare</label>
                  <input
                    style={S.formInput}
                    value={formData.budget || ""}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="Ex: 5000 EUR"
                  />
                </div>
                <div style={S.formField}>
                  <label style={S.formLabel}>Organizator</label>
                  <input
                    style={S.formInput}
                    value={formData.organizer || ""}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Ex: European Commission"
                  />
                </div>
              </div>

              <div style={S.formField}>
                <label style={S.formLabel}>URL</label>
                <input
                  style={S.formInput}
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div style={S.formField}>
                <label style={S.formLabel}>Tags (separate cu virgula)</label>
                <input
                  style={S.formInput}
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Ex: marketing, digital, EU"
                />
              </div>

              <div style={S.formField}>
                <label style={S.formLabel}>Note</label>
                <textarea
                  style={{ ...S.formInput, minHeight: 80, resize: "vertical" as const }}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Note interne..."
                />
              </div>
            </div>
            <div style={S.modalFooter}>
              {editingProgram && (
                <button style={S.btnDelete} onClick={() => deleteProgram(editingProgram.id)}>
                  Sterge
                </button>
              )}
              <button style={S.btnCancel} onClick={() => setShowAddModal(false)}>
                Anuleaza
              </button>
              <button
                style={{ ...S.btnSave, opacity: !formData.title ? 0.5 : 1 }}
                onClick={saveProgram}
                disabled={!formData.title}
              >
                {editingProgram ? "Salveaza" : "Adauga"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
