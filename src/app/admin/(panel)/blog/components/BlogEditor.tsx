"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Save,
  Eye,
  Edit3,
  X,
  Tag,
  ArrowLeft,
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@/types";

interface BlogEditorProps {
  post?: BlogPost;
  isNew?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function BlogEditor({ post, isNew }: BlogEditorProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    featured_image: post?.featured_image || "",
    category_id: post?.category_id || "",
    tags: post?.tags || ([] as string[]),
    is_published: post?.is_published || false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/blog/categories");
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  const handleTitleChange = (title: string) => {
    setForm((f) => ({
      ...f,
      title,
      slug: isNew ? slugify(title) : f.slug,
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.content) return;
    setSaving(true);

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/blog" : `/api/admin/blog/${post?.id}`;

    const body = {
      ...form,
      published_at: form.is_published ? new Date().toISOString() : null,
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.push("/admin/blog");
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push("/admin/blog")}
          className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} /> Inapoi
        </button>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) =>
                setForm((f) => ({ ...f, is_published: e.target.checked }))
              }
              className="accent-rifc-red"
            />
            Publicat
          </label>
          <button
            onClick={handleSave}
            disabled={saving || !form.title || !form.content}
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 bg-rifc-red text-surface-bg border border-rifc-red rounded-sm transition-all duration-200 hover:bg-rifc-red-light disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Se salveaza..." : "Salveaza"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Titlu articol..."
            className="w-full bg-transparent border-none text-2xl font-light text-text-primary focus:outline-none placeholder:text-text-ghost"
          />

          {/* Slug */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-[2px] uppercase text-text-ghost">
              /blog/
            </span>
            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({ ...f, slug: e.target.value }))
              }
              className="flex-1 bg-surface-card border border-border-light rounded-sm px-3 py-1.5 font-mono text-xs text-text-muted focus:outline-none focus:border-border-red-subtle"
            />
          </div>

          {/* Excerpt */}
          <textarea
            value={form.excerpt}
            onChange={(e) =>
              setForm((f) => ({ ...f, excerpt: e.target.value }))
            }
            rows={2}
            placeholder="Rezumat scurt..."
            className="w-full bg-surface-card border border-border-light rounded-sm p-3 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
          />

          {/* Content editor with preview toggle */}
          <div className="border border-border-light rounded-sm">
            <div className="flex border-b border-border-light">
              <button
                onClick={() => setTab("edit")}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[2px] uppercase transition-colors ${
                  tab === "edit"
                    ? "text-text-primary bg-surface-card"
                    : "text-text-ghost hover:text-text-muted"
                }`}
              >
                <Edit3 size={14} /> Editor
              </button>
              <button
                onClick={() => setTab("preview")}
                className={`flex items-center gap-2 px-4 py-2.5 font-mono text-[11px] tracking-[2px] uppercase transition-colors ${
                  tab === "preview"
                    ? "text-text-primary bg-surface-card"
                    : "text-text-ghost hover:text-text-muted"
                }`}
              >
                <Eye size={14} /> Preview
              </button>
            </div>

            {tab === "edit" ? (
              <textarea
                value={form.content}
                onChange={(e) =>
                  setForm((f) => ({ ...f, content: e.target.value }))
                }
                rows={20}
                placeholder="Continut in format Markdown..."
                className="w-full bg-transparent p-4 font-mono text-sm text-text-primary focus:outline-none placeholder:text-text-ghost resize-none"
              />
            ) : (
              <div className="p-4 prose prose-invert prose-sm max-w-none font-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {form.content || "*Niciun continut inca...*"}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category */}
          <div className="border border-border-light rounded-sm p-4">
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Categorie
            </label>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, category_id: e.target.value }))
              }
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:border-border-red-subtle"
            >
              <option value="">Fara categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="border border-border-light rounded-sm p-4">
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Taguri
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 font-mono text-[10px] tracking-[1px] px-2 py-1 border border-border-light rounded-sm text-text-muted"
                >
                  <Tag size={10} /> {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-text-ghost hover:text-rifc-red ml-1"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Adauga tag..."
                className="flex-1 bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="border border-border-light rounded-sm p-4">
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-2">
              Imagine Featured
            </label>
            <input
              type="url"
              value={form.featured_image}
              onChange={(e) =>
                setForm((f) => ({ ...f, featured_image: e.target.value }))
              }
              placeholder="URL imagine..."
              className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2.5 font-body text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
            />
          </div>

          {/* SEO */}
          <div className="border border-border-light rounded-sm p-4">
            <label className="block font-mono text-[10px] tracking-[2px] uppercase text-text-ghost mb-3">
              SEO
            </label>
            <div className="space-y-3">
              <input
                type="text"
                value={form.meta_title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, meta_title: e.target.value }))
                }
                placeholder="Meta Title..."
                className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost"
              />
              <textarea
                value={form.meta_description}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    meta_description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Meta Description..."
                className="w-full bg-surface-card border border-border-light rounded-sm px-3 py-2 font-body text-xs text-text-primary focus:outline-none focus:border-border-red-subtle placeholder:text-text-ghost resize-none"
              />
              {form.meta_description && (
                <div className="font-mono text-[10px] text-text-ghost">
                  {form.meta_description.length}/160 caractere
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
