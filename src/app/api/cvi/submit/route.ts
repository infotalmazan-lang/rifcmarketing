import { NextRequest, NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";
import { createHash } from "crypto";
import { CVI_ITEMS, calcDimensionCvi, calcTotalCvi } from "@/lib/cvi-calculations";

export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, expert, ratings, comments, cvi: clientCvi } = body;

    // ── Validate token ──
    if (!token) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const supabase = createServiceRole();

    const { data: expertRow, error: expError } = await supabase
      .from("cvi_experts")
      .select("id, status")
      .eq("token", token)
      .single();

    if (expError || !expertRow) {
      return NextResponse.json(
        { error: "Token invalid sau expirat" },
        { status: 404 }
      );
    }

    if (expertRow.status === "completed") {
      return NextResponse.json(
        { error: "Acest token a fost deja utilizat" },
        { status: 409 }
      );
    }

    if (expertRow.status === "revoked") {
      return NextResponse.json(
        { error: "Acest token a fost revocat" },
        { status: 403 }
      );
    }

    // ── Validate ratings completeness ──
    const missingItems = CVI_ITEMS.filter(
      item => !ratings[item] || ratings[item] < 1 || ratings[item] > 4
    );
    if (missingItems.length > 0) {
      return NextResponse.json(
        { error: `Lipsesc evaluări pentru: ${missingItems.join(", ")}` },
        { status: 422 }
      );
    }

    // ── Validate comments completeness (min 50 chars each) ──
    const MIN_COMMENT_CHARS = 50;
    if (comments && typeof comments === "object") {
      const missingComments = CVI_ITEMS.filter(
        item => !comments[item] || !String(comments[item]).trim()
      );
      if (missingComments.length > 0) {
        return NextResponse.json(
          { error: `Lipsesc comentarii pentru: ${missingComments.slice(0, 10).join(", ")}${missingComments.length > 10 ? ` + inca ${missingComments.length - 10}` : ""}` },
          { status: 422 }
        );
      }
      const shortComments = CVI_ITEMS.filter(
        item => comments[item] && String(comments[item]).trim().length < MIN_COMMENT_CHARS
      );
      if (shortComments.length > 0) {
        return NextResponse.json(
          { error: `Comentarii prea scurte (min. ${MIN_COMMENT_CHARS} caractere) la: ${shortComments.slice(0, 10).join(", ")}${shortComments.length > 10 ? ` + inca ${shortComments.length - 10}` : ""}` },
          { status: 422 }
        );
      }
    }

    // ── Validate expert profile ──
    if (!expert?.name?.trim() || !expert?.role || !expert?.experience) {
      return NextResponse.json(
        { error: "Profilul expert este incomplet" },
        { status: 422 }
      );
    }

    // ── Calculate CVI server-side ──
    const cviR = calcDimensionCvi(ratings, "R");
    const cviI = calcDimensionCvi(ratings, "I");
    const cviF = calcDimensionCvi(ratings, "F");
    const cviC = calcDimensionCvi(ratings, "C");
    const cviTotal = calcTotalCvi(cviR, cviI, cviF, cviC);

    // ── Get metadata ──
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";
    const ipHash = createHash("sha256").update(ip).digest("hex").slice(0, 16);
    const ua = req.headers.get("user-agent")?.slice(0, 255) || "";

    // ── Update expert profile ──
    await supabase
      .from("cvi_experts")
      .update({
        name: expert.name.trim(),
        org: expert.org?.trim() || null,
        role: expert.role,
        experience: expert.experience,
        email: expert.email?.trim() || null,
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", expertRow.id);

    // ── Insert response ──
    const responseRow: Record<string, unknown> = {
      expert_id: expertRow.id,
      token,
      cvi_r: Number(cviR.toFixed(2)),
      cvi_i: Number(cviI.toFixed(2)),
      cvi_f: Number(cviF.toFixed(2)),
      cvi_c: Number(cviC.toFixed(2)),
      cvi_total: Number(cviTotal.toFixed(2)),
      ip_hash: ipHash,
      user_agent: ua,
    };

    // Add all 35 item scores
    for (const item of CVI_ITEMS) {
      responseRow[item] = ratings[item];
    }

    // Add comments if provided (requires JSONB column 'comments' in cvi_responses)
    if (comments && typeof comments === "object" && Object.keys(comments).length > 0) {
      responseRow.comments = comments;
    }

    const { error: insertError } = await supabase
      .from("cvi_responses")
      .insert(responseRow);

    // If insert failed because of 'comments' column not existing, retry without it
    if (insertError && insertError.message?.includes("comments")) {
      delete responseRow.comments;
      const { error: retryError } = await supabase
        .from("cvi_responses")
        .insert(responseRow);
      if (retryError) {
        return NextResponse.json(
          { error: "Eroare la salvarea răspunsului" },
          { status: 500 }
        );
      }
      // Still return success even without comments stored in DB
      return NextResponse.json({
        success: true,
        cvi: {
          R: Number(cviR.toFixed(2)),
          I: Number(cviI.toFixed(2)),
          F: Number(cviF.toFixed(2)),
          C: Number(cviC.toFixed(2)),
          total: Number(cviTotal.toFixed(2)),
        },
        warning: "Comments not stored — add 'comments' JSONB column to cvi_responses",
      });
    }

    if (insertError) {
      return NextResponse.json(
        { error: "Eroare la salvarea răspunsului" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      cvi: {
        R: Number(cviR.toFixed(2)),
        I: Number(cviI.toFixed(2)),
        F: Number(cviF.toFixed(2)),
        C: Number(cviC.toFixed(2)),
        total: Number(cviTotal.toFixed(2)),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
