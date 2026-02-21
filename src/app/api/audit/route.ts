import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ALL_SUBFACTORS, R_SUBFACTORS, I_SUBFACTORS, F_SUBFACTORS, C_SUBFACTORS } from "@/lib/constants/subfactors";
import { OBJECTIVE_MAP } from "@/lib/constants/objectives";
import type { BrandProfile } from "@/types";

// Allow longer processing for images/PDFs
export const maxDuration = 60;

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

async function extractTextFromUrl(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; RIFCAuditBot/1.0; +https://rifcmarketing.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Strip scripts, styles, comments
    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<!--[\s\S]*?-->/g, "");

    // Extract title
    const titleMatch = text.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract meta description
    const metaMatch = text.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
    );
    const metaDesc = metaMatch ? metaMatch[1].trim() : "";

    // Extract headings
    const headings: string[] = [];
    const headingRegex = /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi;
    let match;
    while ((match = headingRegex.exec(text)) !== null) {
      headings.push(match[1].replace(/<[^>]+>/g, "").trim());
    }

    // Extract paragraph text
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    while ((match = pRegex.exec(text)) !== null) {
      const cleaned = match[1].replace(/<[^>]+>/g, "").trim();
      if (cleaned.length > 10) paragraphs.push(cleaned);
    }

    // Extract button/CTA text
    const buttons: string[] = [];
    const btnRegex = /<(?:button|a)[^>]*class[^>]*(?:btn|cta|button)[^>]*>([\s\S]*?)<\/(?:button|a)>/gi;
    while ((match = btnRegex.exec(text)) !== null) {
      const cleaned = match[1].replace(/<[^>]+>/g, "").trim();
      if (cleaned.length > 1 && cleaned.length < 100) buttons.push(cleaned);
    }

    // Extract image alt texts
    const alts: string[] = [];
    const imgRegex = /<img[^>]*alt=["']([^"']+)["']/gi;
    while ((match = imgRegex.exec(text)) !== null) {
      if (match[1].trim().length > 3) alts.push(match[1].trim());
    }

    // Build structured content
    const parts: string[] = [];
    if (title) parts.push(`Page Title: ${title}`);
    if (metaDesc) parts.push(`Meta Description: ${metaDesc}`);
    if (headings.length > 0)
      parts.push(`Headings:\n${headings.slice(0, 10).join("\n")}`);
    if (paragraphs.length > 0)
      parts.push(`Body Content:\n${paragraphs.slice(0, 20).join("\n\n")}`);
    if (buttons.length > 0)
      parts.push(`CTAs/Buttons: ${buttons.slice(0, 10).join(", ")}`);
    if (alts.length > 0)
      parts.push(`Image Descriptions: ${alts.slice(0, 10).join(", ")}`);

    const result = parts.join("\n\n---\n\n");

    // Truncate to ~4000 chars for efficient context usage
    return result.slice(0, 4000);
  } finally {
    clearTimeout(timeout);
  }
}

/* ─── YouTube Transcript Extraction ───────────────────────── */

function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function extractYoutubeTranscript(url: string): Promise<string> {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  // Dynamic import to avoid issues with module resolution
  const { YoutubeTranscript } = await import("youtube-transcript");
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);

  if (!transcript || transcript.length === 0) {
    throw new Error("No transcript available");
  }

  // Join all text segments, truncate to 4000 chars
  const fullText = transcript.map((t: { text: string }) => t.text).join(" ");
  return fullText.slice(0, 4000);
}

/* ─── System Prompt Builder ────────────────────────────────── */

function buildSubfactorList(variable: string, factors: readonly { id: string; name: string; critical: boolean }[]): string {
  return factors.map(sf => `  - ${sf.id}: ${sf.name}${sf.critical ? " [CRITICAL]" : ""}`).join("\n");
}

function buildSystemPrompt(objectiveId?: string, brand?: BrandProfile): string {
  const objective = objectiveId ? OBJECTIVE_MAP.get(objectiveId) : null;

  let prompt = `You are an R IF C Marketing expert consultant. R IF C is a marketing diagnostic framework created by Dumitru Talmazan.

## The R IF C Equation
R + (I × F) = C

Where:
- **R (Relevance)** — Score 1-10. Is this message reaching the RIGHT audience at the RIGHT time?
  RULE: If R < 3, the entire message fails regardless of other scores (Relevance Gate = Critical Failure)
- **I (Interest)** — Score 1-10. Does the message create genuine curiosity and desire to learn more?
- **F (Form)** — Score 1-10. Is the message presented in the optimal format for its channel?
  RULE: F is a MULTIPLIER — it amplifies or kills Interest. Zero Rule: if F=0 or I=0, then I×F=0.
- **C (Clarity)** — The output score (0-110). The ultimate measure of message effectiveness.

## 35 Sub-factors (score each 1-10)
You MUST score EVERY sub-factor individually. Sub-factors marked [CRITICAL] carry extra weight — a low score on a critical sub-factor drags the entire variable down.

### R — Relevance (7 sub-factors)
${buildSubfactorList("R", R_SUBFACTORS)}

### I — Interest (10 sub-factors)
${buildSubfactorList("I", I_SUBFACTORS)}

### F — Form (11 sub-factors)
${buildSubfactorList("F", F_SUBFACTORS)}

### C — Clarity (7 sub-factors — diagnostic tests, not inputs)
${buildSubfactorList("C", C_SUBFACTORS)}
NOTE: C sub-factors are verification tests. They measure whether R, I, F converge into a clear message.

## Clarity Levels
- 0-20: Critical Failure — 100% budget burned
- 21-50: Noise — CPL 5-10x above average, negative ROI
- 51-80: Medium — Functional but uncompetitive
- 81-110: Supreme — Cult brand zone, maximum ROI

## Failure Archetypes
1. **Invisible Phantom** (R < 3): Perfect execution, wrong audience.
2. **Aesthetic Noise** (I low, F high): Beautiful but empty.
3. **Buried Diamond** (I high, F low): Great value, terrible packaging.`;

  if (objective) {
    prompt += `

## Active Objective: ${objectiveId}
Weight adjustments: R×${objective.weights.R}, I×${objective.weights.I}, F×${objective.weights.F}
When scoring, give extra attention to sub-factors that align with this objective.
KPIs to consider: ${objective.kpis.join(", ")}`;
  }

  if (brand) {
    prompt += `

## Brand Context (Layer 3)
- Brand: ${brand.name}
- Industry: ${brand.industry}
- Target Audience: ${brand.targetAudience}
- Tone: ${brand.tone}
- UVP: ${brand.uvp}
Use this brand context when evaluating relevance, interest alignment, and tone consistency.`;
  }

  prompt += `

## Visual Content Analysis
When analyzing images, screenshots, or PDF pages:
- Read ALL visible text (headlines, body copy, CTAs, captions, fine print)
- Evaluate visual hierarchy, layout, color usage for F sub-factors
- Assess target audience alignment from visual cues for R sub-factors
- Judge value proposition clarity from both text and visuals for I sub-factors

## Your Task
Analyze the marketing message/content provided. Score ALL 35 sub-factors individually. Be specific, data-driven, and actionable.

RESPOND IN STRICT JSON FORMAT (no markdown, no code blocks, just raw JSON):
{
  "r": <number 1-10 — weighted average of R sub-factors>,
  "i": <number 1-10 — weighted average of I sub-factors>,
  "f": <number 1-10 — weighted average of F sub-factors>,
  "c": <number — calculated as r + (i * f)>,
  "rJustification": "<1-2 sentences explaining R score>",
  "iJustification": "<1-2 sentences explaining I score>",
  "fJustification": "<1-2 sentences explaining F score>",
  "diagnosis": "<2-3 sentence overall assessment>",
  "archetype": "invisible_phantom" | "aesthetic_noise" | "buried_diamond" | "none",
  "clarityLevel": "critical" | "noise" | "medium" | "supreme",
  "recommendations": [
    { "variable": "R" | "I" | "F", "action": "<specific actionable recommendation>", "impact": "<expected improvement>" }
  ],
  "summary": "<1 sentence summary of what was analyzed>",
  "subfactors": [
    { "id": "R1", "score": <1-10>, "justification": "<1 sentence>" },
    { "id": "R2", "score": <1-10>, "justification": "<1 sentence>" },
    ... (all ${ALL_SUBFACTORS.length} sub-factors)
  ],
  "ctaSuggestion": "<specific CTA recommendation for the analyzed content>"
}

Provide exactly 3-5 recommendations, prioritized by impact. Be specific — no generic advice.
Score ALL ${ALL_SUBFACTORS.length} sub-factors in the "subfactors" array. Do NOT skip any.`;

  return prompt;
}

/* ─── Types ───────────────────────────────────────────────── */

type AuditType = "text" | "url" | "youtube" | "image" | "pdf";

interface AuditRequestBody {
  type: AuditType;
  content: string;
  channel?: string;
  language?: "ro" | "en";
  images?: { base64: string; mediaType: string }[];
  objective?: string;
  brandProfile?: BrandProfile;
}

/* ─── POST Handler ────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "rate_limit", message: "Too many requests. Please wait a minute." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as AuditRequestBody;
    const { type, content, channel, language, images, objective, brandProfile } = body;

    // Validate type
    const validTypes: AuditType[] = ["text", "url", "youtube", "image", "pdf"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "invalid_type", message: "Invalid audit type" },
        { status: 400 }
      );
    }

    // Validate content for text-based types
    if (["text", "url", "youtube"].includes(type) && (!content || !content.trim())) {
      return NextResponse.json(
        { error: "empty_content", message: "Content is required" },
        { status: 400 }
      );
    }

    // Validate images for visual types
    if (["image", "pdf"].includes(type)) {
      if (!images || images.length === 0) {
        return NextResponse.json(
          { error: "no_images", message: "No images provided" },
          { status: 400 }
        );
      }
      if (type === "pdf" && images.length > 5) {
        return NextResponse.json(
          { error: "too_many_pages", message: "Maximum 5 pages allowed" },
          { status: 400 }
        );
      }
    }

    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-YOUR_KEY_HERE") {
      return NextResponse.json(
        { error: "no_api_key", message: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    // Process content and build Claude messages
    const anthropic = new Anthropic({ apiKey });
    let claudeMessages: Anthropic.MessageCreateParams["messages"];

    if (type === "text" || type === "url" || type === "youtube") {
      // ─── Text-based analysis ───
      let textToAnalyze = content.trim();

      if (type === "url") {
        try {
          new URL(content);
          textToAnalyze = await extractTextFromUrl(content);
          if (!textToAnalyze || textToAnalyze.length < 30) {
            return NextResponse.json(
              { error: "url_extraction_failed", message: "Could not extract enough content from the URL" },
              { status: 400 }
            );
          }
        } catch (urlError) {
          if (urlError instanceof TypeError) {
            return NextResponse.json(
              { error: "invalid_url", message: "Invalid URL format" },
              { status: 400 }
            );
          }
          return NextResponse.json(
            { error: "url_fetch_failed", message: "Could not fetch the URL. Check if the site is accessible." },
            { status: 400 }
          );
        }
      }

      if (type === "youtube") {
        try {
          const videoId = extractYoutubeVideoId(content);
          if (!videoId) {
            return NextResponse.json(
              { error: "invalid_youtube_url", message: "Invalid YouTube URL" },
              { status: 400 }
            );
          }
          textToAnalyze = await extractYoutubeTranscript(content);
          if (!textToAnalyze || textToAnalyze.length < 30) {
            return NextResponse.json(
              { error: "youtube_no_transcript", message: "No transcript available for this video" },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { error: "youtube_extraction_failed", message: "Could not extract YouTube transcript" },
            { status: 400 }
          );
        }
      }

      // Truncate text input to 4000 chars
      if (textToAnalyze.length > 4000) {
        textToAnalyze = textToAnalyze.slice(0, 4000);
      }

      // Build user message
      let userMessage = "";
      if (channel) userMessage += `Channel context: ${channel}\n\n`;
      if (type === "url") {
        userMessage += `URL analyzed: ${content}\n\nExtracted content:\n---\n`;
      } else if (type === "youtube") {
        userMessage += `YouTube video transcript analyzed: ${content}\n\nTranscript:\n---\n`;
      }
      userMessage += textToAnalyze;

      claudeMessages = [{ role: "user", content: userMessage }];
    } else {
      // ─── Visual analysis (image / pdf) ───
      const contentBlocks: Anthropic.ContentBlockParam[] = [];

      for (const img of images!) {
        contentBlocks.push({
          type: "image",
          source: {
            type: "base64",
            media_type: img.mediaType as "image/png" | "image/jpeg" | "image/webp" | "image/gif",
            data: img.base64,
          },
        });
      }

      // Add text instruction
      let instruction = "";
      if (channel) instruction += `Channel context: ${channel}\n\n`;
      if (type === "image") {
        instruction +=
          "Analyze this marketing visual (ad, social media post, email screenshot, banner, or landing page screenshot). Evaluate the visual design, all visible text/copy, CTA clarity, and overall marketing effectiveness using the R IF C framework.";
      } else {
        instruction += `Analyze this ${images!.length}-page PDF marketing document. Evaluate the content, structure, messaging clarity, design quality, and marketing effectiveness across all pages using the R IF C framework.`;
      }
      contentBlocks.push({ type: "text", text: instruction });

      claudeMessages = [{ role: "user", content: contentBlocks }];
    }

    // Build dynamic system prompt with subfactors + optional objective/brand
    const systemPrompt = buildSystemPrompt(objective, brandProfile);

    const langInstruction =
      language === "ro"
        ? "\n\nIMPORTANT: Respond with ALL text fields (justifications, diagnosis, recommendations, summary, subfactor justifications, ctaSuggestion) in Romanian (limba română)."
        : "\n\nIMPORTANT: Respond with ALL text fields (justifications, diagnosis, recommendations, summary, subfactor justifications, ctaSuggestion) in English.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: systemPrompt + langInstruction,
      messages: claudeMessages,
    });

    // Parse response
    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Try to parse JSON from response
    let auditResult;
    try {
      // Handle potential markdown code blocks in response
      const jsonStr = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      auditResult = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        {
          error: "parse_error",
          message: "AI returned an unexpected format. Please try again.",
        },
        { status: 500 }
      );
    }

    // Validate and ensure correct C calculation
    const r = Math.min(10, Math.max(1, Math.round(auditResult.r || 1)));
    const i = Math.min(10, Math.max(1, Math.round(auditResult.i || 1)));
    const f = Math.min(10, Math.max(1, Math.round(auditResult.f || 1)));
    const c = r + i * f;

    // Determine archetype
    let archetype = auditResult.archetype || "none";
    if (r < 3) archetype = "invisible_phantom";
    else if (i <= 3 && f >= 7) archetype = "aesthetic_noise";
    else if (i >= 7 && f <= 3) archetype = "buried_diamond";

    // Determine clarity level
    let clarityLevel: string;
    if (c <= 20) clarityLevel = "critical";
    else if (c <= 50) clarityLevel = "noise";
    else if (c <= 80) clarityLevel = "medium";
    else clarityLevel = "supreme";

    // Parse and validate subfactor scores
    const rawSubfactors = Array.isArray(auditResult.subfactors) ? auditResult.subfactors : [];
    const subfactors = ALL_SUBFACTORS.map((sf) => {
      const found = rawSubfactors.find((rs: { id: string; score?: number; justification?: string }) => rs.id === sf.id);
      return {
        id: sf.id,
        score: found ? Math.min(10, Math.max(1, Math.round(found.score || 5))) : 5,
        justification: found?.justification || "",
        critical: sf.critical,
      };
    });

    return NextResponse.json({
      success: true,
      result: {
        r,
        i,
        f,
        c,
        rJustification: auditResult.rJustification || "",
        iJustification: auditResult.iJustification || "",
        fJustification: auditResult.fJustification || "",
        diagnosis: auditResult.diagnosis || "",
        archetype,
        clarityLevel,
        recommendations: (auditResult.recommendations || []).slice(0, 5),
        summary: auditResult.summary || "",
        subfactors,
        objective: objective || undefined,
        brandContext: brandProfile || undefined,
        ctaSuggestion: auditResult.ctaSuggestion || "",
      },
    });
  } catch (error) {
    console.error("Audit API error:", error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "auth_error", message: "Invalid API key" },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "ai_rate_limit", message: "AI service rate limited. Please wait." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
