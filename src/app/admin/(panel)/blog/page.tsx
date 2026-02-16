"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Folder,
} from "lucide-react";
import type { BlogPost } from "@/types";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("blog_posts")
      .select("*, category:blog_categories(*)")
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Esti sigur ca vrei sa stergi acest articol?")) return;
    setDeleting(id);
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeleting(null);
  };

  const togglePublish = async (post: BlogPost) => {
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null,
      }),
    });
    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id ? { ...p, is_published: !p.is_published } : p
        )
      );
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={18} className="text-text-ghost" />
            <h1 className="text-2xl font-light">Blog</h1>
          </div>
          <p className="font-body text-sm text-text-muted">
            Gestioneaza articolele blog
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/categories"
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-border-light text-text-muted rounded-sm hover:border-border-red-subtle hover:text-text-primary transition-all duration-200"
          >
            <Folder size={14} /> Categorii
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
          >
            <Plus size={14} /> Articol Nou
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="font-body text-sm text-text-ghost">Se incarca...</p>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 border border-border-light rounded-sm">
          <FileText
            size={32}
            className="text-text-ghost mx-auto mb-4 opacity-40"
          />
          <p className="font-body text-sm text-text-ghost mb-4">
            Niciun articol inca.
          </p>
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase px-4 py-2.5 border border-rifc-red text-rifc-red rounded-sm hover:bg-rifc-red hover:text-surface-bg transition-all duration-200"
          >
            <Plus size={14} /> Creeaza Primul Articol
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 border border-border-light rounded-sm hover:border-border-red-subtle transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-body text-sm font-medium text-text-primary truncate">
                    {post.title}
                  </h3>
                  {post.is_published ? (
                    <span className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-green-400/30 text-green-400 rounded-sm">
                      Publicat
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] tracking-[1px] uppercase px-2 py-0.5 border border-border-subtle text-text-ghost rounded-sm">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-text-ghost font-mono text-[10px]">
                  {post.category && (
                    <span className="text-text-muted">
                      {post.category.name}
                    </span>
                  )}
                  <span>
                    {new Date(post.created_at).toLocaleDateString("ro-RO")}
                  </span>
                  <span>/blog/{post.slug}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={() => togglePublish(post)}
                  className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                  title={post.is_published ? "Dezactiveaza" : "Publica"}
                >
                  {post.is_published ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
                <Link
                  href={`/admin/blog/${post.id}/edit`}
                  className="p-2 text-text-ghost hover:text-text-primary transition-colors"
                >
                  <Edit3 size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={deleting === post.id}
                  className="p-2 text-text-ghost hover:text-rifc-red transition-colors disabled:opacity-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
