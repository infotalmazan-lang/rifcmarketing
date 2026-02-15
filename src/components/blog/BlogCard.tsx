"use client";

import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { BlogPost } from "@/types";
import { formatDate, readingTime } from "@/lib/utils";

interface Props {
  post: BlogPost;
}

export default function BlogCard({ post }: Props) {
  const { t } = useTranslation();

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-surface-card border border-border-light rounded-sm p-8 transition-all duration-400 group-hover:border-border-red-subtle group-hover:bg-surface-card-hover group-hover:-translate-y-0.5">
        {post.category && (
          <span
            className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-2 py-0.5 border border-border-red-subtle text-rifc-red rounded-sm mb-4"
          >
            {post.category.name}
          </span>
        )}

        <h2 className="text-xl font-medium leading-[1.4] mb-3 group-hover:text-rifc-red transition-colors duration-300">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="font-body text-sm leading-[1.7] text-text-muted mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 font-mono text-[11px] text-text-ghost">
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              {formatDate(post.published_at)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {readingTime(post.content)} {t.blog.minRead}
          </span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[9px] tracking-[1px] uppercase px-2 py-0.5 border border-border-subtle text-text-ghost rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
