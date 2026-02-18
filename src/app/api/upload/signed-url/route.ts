import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

// Returns upload config for tus resumable upload to Supabase Storage
// Browser uses tus-js-client to upload directly, bypassing Vercel limits
export async function POST(req: NextRequest) {
  try {
    const { filename, contentType } = await req.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename required" },
        { status: 400 }
      );
    }

    const supabase = createServiceRole();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    // Use anon key for tus upload — it's a valid JWT (service role key is not a JWT)
    // RLS policy on storage.objects allows INSERT for bucket_id = 'survey-media'
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const ext = filename.split(".").pop() || "bin";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = `materials/${uniqueName}`;

    // Get public URL for after upload
    const { data: urlData } = supabase.storage
      .from("survey-media")
      .getPublicUrl(path);

    return NextResponse.json({
      // tus endpoint for resumable uploads
      tusEndpoint: `${supabaseUrl}/storage/v1/upload/resumable`,
      // Auth token (anon key = valid JWT, RLS allows insert on survey-media)
      authToken: anonKey,
      // Bucket and path
      bucketId: "survey-media",
      objectPath: path,
      // Public URL after upload completes
      publicUrl: urlData.publicUrl,
      contentType: contentType || "application/octet-stream",
    });
  } catch {
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
