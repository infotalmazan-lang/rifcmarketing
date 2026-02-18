import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

// Creates a signed upload URL using service role (bypasses RLS)
// Browser uploads directly to Supabase via XHR PUT with progress tracking
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

    const ext = filename.split(".").pop() || "bin";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const path = `materials/${uniqueName}`;

    // Create signed upload URL using service role (valid for 10 minutes)
    const { data, error } = await supabase.storage
      .from("survey-media")
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error("Signed URL error:", error);
      return NextResponse.json(
        { error: `Failed to create upload URL: ${error?.message || "unknown"}` },
        { status: 500 }
      );
    }

    // Get public URL for after upload
    const { data: urlData } = supabase.storage
      .from("survey-media")
      .getPublicUrl(path);

    return NextResponse.json({
      signedUrl: data.signedUrl,
      token: data.token,
      path,
      publicUrl: urlData.publicUrl,
      contentType: contentType || "application/octet-stream",
    });
  } catch (err) {
    console.error("Upload config error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
