import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://rifcmarketing.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/calculator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/resources`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/consulting`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // TODO: Fetch blog slugs from Supabase and add dynamic pages
  // const supabase = createServiceRole();
  // const { data: posts } = await supabase.from('blog_posts').select('slug, updated_at').eq('is_published', true);
  // const blogPages = posts?.map(post => ({
  //   url: `${SITE_URL}/blog/${post.slug}`,
  //   lastModified: new Date(post.updated_at),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.6,
  // })) || [];

  return [...staticPages];
}
