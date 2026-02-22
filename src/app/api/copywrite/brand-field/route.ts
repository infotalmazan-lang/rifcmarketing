import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { ExtendedBrandProfile } from "@/types/copywrite";
import { CW_FIELD_META } from "@/lib/constants/copywrite";

export const maxDuration = 30;

interface BrandFieldRequest {
  fieldKey: string;
  brand: ExtendedBrandProfile;
  brandName: string;
  helpers: Record<string, string>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BrandFieldRequest;
    const { fieldKey, brand, brandName, helpers } = body;

    const meta = CW_FIELD_META[fieldKey];
    if (!meta) {
      return NextResponse.json(
        { error: "invalid_field", message: "Camp necunoscut" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-YOUR_KEY_HERE") {
      return NextResponse.json(
        { error: "no_api_key", message: "API key not configured" },
        { status: 500 }
      );
    }

    // Build context from existing brand fields
    const brandContext = Object.entries(brand)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    // Build helper context
    const helperContext = Object.entries(helpers)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const anthropic = new Anthropic({ apiKey });

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: `You are a brand strategy expert. Generate 3 variants for a brand profile field.
Respond in STRICT JSON (no markdown):
{
  "variants": [
    { "text": "<generated text>", "label": "V1 — Concis", "note": "<why this works>" },
    { "text": "<generated text>", "label": "V2 — Detaliat", "note": "<why this works>" },
    { "text": "<generated text>", "label": "V3 — Creativ", "note": "<why this works>" }
  ]
}
Respond in Romanian.`,
      messages: [
        {
          role: "user",
          content: `Brand: ${brandName}

Camp de completat: ${fieldKey} (${meta.why})
Exemplu: ${meta.example}

Context brand existent:
${brandContext || "Niciun camp completat inca."}

Informatii auxiliare:
${helperContext || "Nicio informatie auxiliara."}

Genereaza 3 variante pentru campul "${fieldKey}".`,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    let parsed;
    try {
      const jsonStr = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "parse_error", message: "Raspuns AI nevalid." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      variants: parsed.variants || [],
    });
  } catch (error) {
    console.error("Brand field API error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "Eroare interna." },
      { status: 500 }
    );
  }
}
