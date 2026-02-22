import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CW_AGENTS, CW_SF_DESCRIPTIONS, CW_OBJECTIVE_WEIGHTS } from "@/lib/constants/copywrite";
import type { CWAgentKey, ExtendedBrandProfile } from "@/types/copywrite";

export const maxDuration = 60;

// Rate limiting
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
  return request.headers.get("x-real-ip") || "unknown";
}

// ─── Agent keys in analysis order ────────────────────────
const AGENT_KEYS: CWAgentKey[] = ["R", "I", "F", "C", "CTA"];

// ─── Build system prompt with 40 subfactors ─────────────
function buildSystemPrompt(
  objective: string,
  brand: ExtendedBrandProfile,
  brandName: string,
  industry: string,
  contentType: string
): string {
  const weights = CW_OBJECTIVE_WEIGHTS[objective as keyof typeof CW_OBJECTIVE_WEIGHTS] || CW_OBJECTIVE_WEIGHTS.conversion;

  // Build subfactor blocks per agent
  const agentBlocks = AGENT_KEYS.map((key) => {
    const agent = CW_AGENTS[key];
    const sfList = agent.subfactors
      .map((sfName, i) => {
        const sfId = `${key}${i + 1}`;
        const desc = CW_SF_DESCRIPTIONS[sfId];
        return `  - ${sfId}: ${sfName}${desc ? ` — ${desc.d}` : ""}`;
      })
      .join("\n");
    return `### ${key} — ${agent.name} (${agent.subfactors.length} subfactori)\n${sfList}`;
  }).join("\n\n");

  // Build brand context
  const brandFields = Object.entries(brand)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");

  return `You are a 5-agent Copywriting ADN Analyzer using the RIFC framework (created by Dumitru Talmazan).

## RIFC Equation
R + (I × F) = C | CTA amplifier

## 5 Agents & 40 Subfactors
Each agent analyzes specific subfactors. Score each subfactor 1-10.

${agentBlocks}

## Objective: ${objective}
Weight distribution: R=${weights.R}%, I=${weights.I}%, F=${weights.F}%, C=${weights.C}%
Adjust scoring emphasis based on these weights.

## Brand Context
Brand: ${brandName}
Industry: ${industry}
Content Type: ${contentType}
${brandFields ? `\nBrand Profile:\n${brandFields}` : ""}

## Clarity Levels
- 0-20: Critical — budget burned completely
- 21-50: Noise — negative ROI
- 51-80: Medium — functional but uncompetitive
- 81-110: Supreme — cult brand zone

## Failure Archetypes
1. **Invisible Phantom** (R < 3): Wrong audience
2. **Aesthetic Noise** (I low, F high): Beautiful but empty
3. **Buried Diamond** (I high, F low): Great value, terrible packaging

## Response Format
Respond with STRICT JSON (no markdown, no code blocks):
{
  "agents": {
    "R": {
      "score": <1-10>,
      "justification": "<2-3 sentences>",
      "subfactors": [
        { "id": "R1", "name": "<name>", "score": <1-10>, "justification": "<1 sentence>" },
        ...
      ]
    },
    "I": { ... },
    "F": { ... },
    "C": { ... },
    "CTA": { ... }
  },
  "diagnosis": "<3-4 sentence overall assessment>",
  "archetype": "invisible_phantom" | "aesthetic_noise" | "buried_diamond" | "none",
  "recommendations": [
    { "agent": "R"|"I"|"F"|"C"|"CTA", "action": "<specific recommendation>", "impact": "<expected improvement>", "priority": "high"|"medium"|"low" }
  ]
}

Score ALL 40 subfactors. Provide 5-8 recommendations. Be specific, Romanian language.`;
}

// ─── POST Handler ────────────────────────────────────────
interface AuditRequest {
  text: string;
  brand: ExtendedBrandProfile;
  brandName: string;
  industry: string;
  contentType: string;
  objective: string;
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "rate_limit", message: "Prea multe cereri. Asteapta un minut." },
        { status: 429 }
      );
    }

    const body = (await request.json()) as AuditRequest;
    const { text, brand, brandName, industry, contentType, objective } = body;

    if (!text || text.trim().length < 20) {
      return NextResponse.json(
        { error: "empty_content", message: "Textul trebuie sa aiba minim 20 caractere." },
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

    const anthropic = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt(objective, brand, brandName, industry, contentType);
    const startTime = Date.now();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 6000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Analizeaza urmatorul text copywriting:\n\n---\n${text.slice(0, 5000)}\n---\n\nScoreaza toti 40 subfactorii si ofera diagnosticul complet in romana.`,
        },
      ],
    });

    const responseText =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Parse JSON
    let parsed;
    try {
      const jsonStr = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "parse_error", message: "Raspuns AI nevalid. Reincearca." },
        { status: 500 }
      );
    }

    const duration = Date.now() - startTime;

    // Build agent results with validated scores
    const agentResults: Record<string, {
      key: string;
      score: number;
      subfactors: { id: string; name: string; score: number; justification: string }[];
      justification: string;
      duration: number;
    }> = {};

    for (const key of AGENT_KEYS) {
      const agentData = parsed.agents?.[key] || {};
      const agent = CW_AGENTS[key];
      const rawSfs = Array.isArray(agentData.subfactors) ? agentData.subfactors : [];

      const subfactors = agent.subfactors.map((sfName, i) => {
        const sfId = `${key}${i + 1}`;
        const found = rawSfs.find((s: { id: string }) => s.id === sfId);
        return {
          id: sfId,
          name: sfName,
          score: found ? Math.min(10, Math.max(1, Math.round(found.score || 5))) : 5,
          justification: found?.justification || "",
        };
      });

      const avgScore =
        subfactors.reduce((sum, sf) => sum + sf.score, 0) / subfactors.length;

      agentResults[key] = {
        key,
        score: Math.round(avgScore * 10) / 10,
        subfactors,
        justification: agentData.justification || "",
        duration: Math.round(duration / 5),
      };
    }

    // Calculate final scores
    const r = agentResults.R.score;
    const i = agentResults.I.score;
    const f = agentResults.F.score;
    const c = agentResults.C.score;
    const cta = agentResults.CTA.score;
    const rifc = Math.round((r + i * f) * 10) / 10;

    // Determine archetype
    let archetype = parsed.archetype || "none";
    if (r < 3) archetype = "invisible_phantom";
    else if (i <= 3 && f >= 7) archetype = "aesthetic_noise";
    else if (i >= 7 && f <= 3) archetype = "buried_diamond";

    // Clarity level
    let clarityLevel: string;
    if (rifc <= 20) clarityLevel = "critical";
    else if (rifc <= 50) clarityLevel = "noise";
    else if (rifc <= 80) clarityLevel = "medium";
    else clarityLevel = "supreme";

    return NextResponse.json({
      success: true,
      result: {
        r,
        i,
        f,
        c,
        cta,
        rifc,
        agents: agentResults,
        archetype,
        clarityLevel,
        diagnosis: parsed.diagnosis || "",
        recommendations: (parsed.recommendations || []).slice(0, 8),
        duration,
        timestamp: new Date().toISOString(),
        config: { brand: brandName, industry, contentType, objective, textLength: text.length },
      },
    });
  } catch (error) {
    console.error("Copywrite audit API error:", error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "auth_error", message: "API key invalid" },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "ai_rate_limit", message: "Serviciu AI suprasolicitat." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "internal_error", message: "Eroare interna." },
      { status: 500 }
    );
  }
}
