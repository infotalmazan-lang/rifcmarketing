"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "../../components/BlogEditor";
import type { BlogPost } from "@/types";

export default function EditBlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const res = await fetch(`/api/admin/blog/${id}`);
    if (res.ok) {
      const data = await res.json();
      setPost(data);
    }
    setLoading(false);
  };

  if (loading)
    return (
      <p className="font-body text-sm text-text-ghost">Se incarca...</p>
    );
  if (!post)
    return (
      <p className="font-body text-sm text-rifc-red">
        Articolul nu a fost gasit.
      </p>
    );

  return <BlogEditor post={post} />;
}
