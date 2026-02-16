import { verifyAdmin } from "@/lib/admin";
import { createServiceRole } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { error } = await verifyAdmin();
  if (error) return error;

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const supabase = createServiceRole();

  // Sanitize filename: remove special chars, keep extension
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const baseName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 80);
  const fileName = `${baseName}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("resources")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("resources")
    .getPublicUrl(fileName);

  // Format file size
  const sizeBytes = file.size;
  const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(1);
  const fileSize = sizeBytes > 1024 * 1024 ? `${sizeMB} MB` : `${(sizeBytes / 1024).toFixed(0)} KB`;

  return NextResponse.json({
    url: urlData.publicUrl,
    fileName,
    fileSize,
  });
}
