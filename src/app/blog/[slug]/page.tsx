import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { createMetadata, articleJsonLd } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { formatDate, readingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

// TODO: Replace with Supabase fetch
async function getPost(slug: string): Promise<BlogPost | null> {
  // const supabase = createServerSupabase();
  // const { data } = await supabase
  //   .from('blog_posts')
  //   .select('*, category:blog_categories(*)')
  //   .eq('slug', slug)
  //   .eq('is_published', true)
  //   .single();
  // return data;
  void slug;
  return null; // Will return 404 until Supabase is connected
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return createMetadata({ title: "Article Not Found" });
  }
  return createMetadata({
    title: post.meta_title || `${post.title} — R IF C Blog`,
    description: post.meta_description || post.excerpt || "",
    path: `/blog/${post.slug}`,
    openGraph: {
      type: "article",
      publishedTime: post.published_at || undefined,
      authors: [post.author_name],
    },
  });
}

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-prose mx-auto">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              articleJsonLd({
                title: post.title,
                description: post.excerpt || "",
                slug: post.slug,
                publishedAt: post.published_at || post.created_at,
                updatedAt: post.updated_at,
                author: post.author_name,
              })
            ),
          }}
        />

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[2px] uppercase text-text-ghost hover:text-rifc-red transition-colors duration-300 mb-8"
        >
          <ArrowLeft size={14} /> Back to Blog
        </Link>

        {post.category && (
          <span className="font-mono inline-block text-[10px] tracking-[2px] uppercase px-2 py-0.5 border border-border-red-subtle text-rifc-red rounded-sm mb-4">
            {post.category.name}
          </span>
        )}

        <h1 className="text-[clamp(28px,4vw,48px)] font-light leading-[1.2] tracking-[-1px] mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-text-ghost mb-12 pb-8 border-b border-border-subtle">
          <span className="flex items-center gap-1.5">
            <User size={12} /> {post.author_name}
          </span>
          {post.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} /> {formatDate(post.published_at)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock size={12} /> {readingTime(post.content)} min read
          </span>
        </div>

        <article className="font-body text-base leading-[1.9] text-text-secondary prose-headings:text-text-primary prose-headings:font-heading prose-strong:text-text-primary prose-a:text-rifc-red">
          {/* TODO: Use react-markdown for proper rendering */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border-subtle">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="font-mono text-[10px] tracking-[1px] uppercase px-3 py-1 border border-border-subtle text-text-ghost rounded-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
