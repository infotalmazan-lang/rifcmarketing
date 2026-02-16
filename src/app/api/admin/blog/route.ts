import { verifyAdmin } from "@/lib/admin";
import { NextResponse } from "next/server";

export async function GET() {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const { data, error: dbError } = await supabase
    .from("blog_posts")
    .select("*, category:blog_categories(*)")
    .order("created_at", { ascending: false });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { error, supabase } = await verifyAdmin();
  if (error) return error;

  const body = await request.json();
  const {
    title,
    slug,
    excerpt,
    content,
    featured_image,
    category_id,
    tags,
    is_published,
    published_at,
    meta_title,
    meta_description,
  } = body;

  if (!title || !content) {
    return NextResponse.json(
      { error: "Title and content are required" },
      { status: 400 }
    );
  }

  const { data, error: dbError } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image: featured_image || null,
      category_id: category_id || null,
      tags: tags || [],
      is_published: is_published || false,
      published_at: published_at || null,
      meta_title: meta_title || null,
      meta_description: meta_description || null,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
