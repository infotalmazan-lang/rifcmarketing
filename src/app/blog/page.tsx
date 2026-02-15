import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogPost } from "@/types";

export const metadata: Metadata = createMetadata({
  title: "Blog — R IF C Marketing Insights",
  description:
    "Articles on marketing clarity, the R IF C framework, case studies, and practical guides for measuring and improving your marketing effectiveness.",
  path: "/blog",
});

// Placeholder posts until Supabase is connected
const PLACEHOLDER_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "what-is-rifc-complete-guide",
    title: "What is R IF C? The Complete Guide to Marketing Clarity",
    excerpt:
      "Discover the first marketing framework that mathematically proves Form is an exponential Multiplier. Learn how R + (I \u00d7 F) = C transforms your approach to communication.",
    content:
      "R IF C is a revolutionary marketing framework...",
    featured_image: null,
    category_id: "1",
    tags: ["framework", "guide", "clarity"],
    author_name: "Dumitru Talmazan",
    is_published: true,
    published_at: "2026-02-01T00:00:00Z",
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
    meta_title: null,
    meta_description: null,
    category: { id: "1", name: "Framework", slug: "framework", description: null, sort_order: 1 },
  },
  {
    id: "2",
    slug: "why-aida-is-dead",
    title: "Why AIDA is Dead: The Case for Clarity-Based Marketing",
    excerpt:
      "The AIDA model treats conversion as a manipulation endpoint. R IF C replaces linear persuasion with clarity measurement. Here\u2019s why that matters.",
    content: "For decades, AIDA has been the default...",
    featured_image: null,
    category_id: "4",
    tags: ["comparison", "aida", "industry"],
    author_name: "Dumitru Talmazan",
    is_published: true,
    published_at: "2026-02-08T00:00:00Z",
    created_at: "2026-02-08T00:00:00Z",
    updated_at: "2026-02-08T00:00:00Z",
    meta_title: null,
    meta_description: null,
    category: { id: "4", name: "Industry", slug: "industry", description: null, sort_order: 4 },
  },
  {
    id: "3",
    slug: "score-your-campaign-60-seconds",
    title: "How to Score Your Next Campaign in 60 Seconds",
    excerpt:
      "A practical, step-by-step walkthrough of using the R IF C Calculator to diagnose any marketing message. No theory \u2014 just results.",
    content: "Open the R IF C Calculator...",
    featured_image: null,
    category_id: "3",
    tags: ["tutorial", "calculator", "practical"],
    author_name: "Dumitru Talmazan",
    is_published: true,
    published_at: "2026-02-15T00:00:00Z",
    created_at: "2026-02-15T00:00:00Z",
    updated_at: "2026-02-15T00:00:00Z",
    meta_title: null,
    meta_description: null,
    category: { id: "3", name: "Tutorials", slug: "tutorials", description: null, sort_order: 3 },
  },
];

export default async function BlogPage() {
  // TODO: Replace with Supabase fetch
  // const supabase = createServerSupabase();
  // const { data: posts } = await supabase
  //   .from('blog_posts')
  //   .select('*, category:blog_categories(*)')
  //   .eq('is_published', true)
  //   .order('published_at', { ascending: false });
  const posts = PLACEHOLDER_POSTS;

  return (
    <>
      <Navbar />
      <main className="pt-[120px] pb-[80px] px-6 md:px-10 max-w-content mx-auto">
        <span className="block font-mono text-[11px] tracking-[6px] uppercase text-rifc-red mb-5">
          Insights
        </span>
        <h1 className="text-[clamp(32px,4vw,56px)] font-light leading-[1.2] tracking-[-1px] mb-4">
          <strong className="font-semibold">Blog</strong>
        </h1>
        <p className="text-lg leading-[1.9] text-text-secondary max-w-prose mb-12 font-light">
          Deep dives into marketing clarity, framework applications, and
          practical guides for measuring your marketing effectiveness.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="font-mono text-text-ghost tracking-[2px]">
              No articles yet. Check back soon.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
