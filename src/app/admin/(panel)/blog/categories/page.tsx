"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, Folder } from "lucide-react";
import type { BlogCategory } from "@/types";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState({ name: "", slug: "", description: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "", description: "" });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/blog/categories");
    if (res.ok) {
      setCategories(await res.json());
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newCat.name) return;
    const slug =
      newCat.slug ||
      newCat.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const res = await fetch("/api/admin/blog/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newCat, slug }),
    });
    if (res.ok) {
      setNewCat({ name: "", slug: "", description: "" });
      fetchCategories();
    }
  };

  const handleEdit = async (id: string) => {
    const res = await fetch(`/api/admin/blog/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEditing(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur ca vrei sa stergi aceasta categorie?")) return;
    const res = await fetch(`/api/admin/blog/categories/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchCategories();
    }
  };

  const startEdit = (cat: BlogCategory) => {
    setEditing(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
  };

  return (
    <div>
      <button
        onClick={() => router.push("/admin/blog")}
        className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Inapoi la Blog
      </button>

      <div className="flex items-center gap-2 mb-8">
        <Folder size={18} className="text-text-ghost" />
        <h1 className="text-2xl font-light">Categorii Blog</h1>
      </div>

      {/* Add new */}
      <div className="border border-border-light rounded-sm p-4 mb-6">
        <h3 className="font-mono text-[11px] tracking-[2px] uppercase text-text-ghost mb-3">
          Categorie noua
        </h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <input
              type="text"
              value={newCat.name}
              onChange={(e) =>
                setNewCat((c) => ({ ...c, name: e.target.value }))
              }
              placeholder="Nume categorie..."
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={newCat.description}
              onChange={(e) =>
                setNewCat((c) => ({ ...c, description: e.target.value }))
              }
              placeholder="Descriere..."
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!newCat.name}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200 disabled:opacity-50"
          >
            <Plus size={14} /> Adauga
          </button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-4 border border-border-light rounded-sm"
            >
              {editing === cat.id ? (
                <div className="flex gap-3 items-center flex-1">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="flex-1 bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
                  />
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({
                        ...f,
                        description: e.target.value,
                      }))
                    }
                    className="flex-1 bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
                  />
                  <button
                    onClick={() => handleEdit(cat.id)}
                    className="p-2 text-green-400 hover:text-green-300"
                  >
                    <Save size={14} />
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="p-2 text-text-ghost hover:text-text-primary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-body text-sm text-text-primary">
                      {cat.name}
                    </span>
                    <span className="font-mono text-[10px] text-text-ghost ml-3">
                      /{cat.slug}
                    </span>
                    {cat.description && (
                      <span className="font-body text-xs text-text-muted ml-3">
                        {cat.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                    >
                      <Save size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-text-ghost hover:text-rifc-red transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
