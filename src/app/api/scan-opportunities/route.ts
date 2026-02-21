import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 120; // Allow 2 min for web search + AI processing

// Rate limit: 3 scans per hour
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + 3600_000 });
    return true;
  }
  if (entry.count >= 3) return false;
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

/* ─── Researcher Profile ───────────────────────────────────── */

const RESEARCHER_PROFILE = `
## RESEARCHER PROFILE
- Domain: Marketing research, marketing measurement, diagnostic frameworks, psychometric validation
- Research stage: Pre-publication / Working paper / Framework pre-registered (OSF: osf.io/9y75d)
- Organization: University (UTM/USM) + SRL (CONTINUUM GRUP)
- Country: Moldova (Widening country, Eastern Partnership, ITC eligible, Horizon Associated Country)
- Role: University lecturer + Entrepreneur
- Experience: Early career researcher (0-2 years post-doc)
- Revenue: 52K EUR / 3 years (relevant for business/commercialization grants)

## RELEVANCE KEYWORDS
marketing measurement, campaign diagnostics, marketing ROI, marketing effectiveness, advertising failure, marketing framework, marketing audit, marketing research methodology, AI in marketing, psychometric validation, scale development, Likert scale, factor analysis, marketing SaaS, MarTech

## ACCEPTED STAGES
working paper, abstract, extended abstract, pre-publication, pre-registered, early-stage research

## LANGUAGES: RO, EN, FR, DE, RU
## PERSONAL BUDGET: 0-5000 EUR
## INSTITUTIONAL GRANTS: any amount
## GEOGRAPHIC PRIORITY: Moldova > Romania > EU > Global
## SPECIAL ELIGIBILITY: EU Widening, Eastern Partnership, ITC country, Associated Country

## EXCLUSION CRITERIA
- PhD-only calls
- Post-doc >7 years experience required
- Non-marketing domains
- Grants only for NGOs
- Calls only for EU citizens
`;

/* ─── System Prompt ───────────────────────────────────────── */

const SCAN_SYSTEM_PROMPT = `You are an academic opportunity scanner for a marketing researcher. Your job is to find REAL, CURRENT opportunities that match the researcher profile.

${RESEARCHER_PROFILE}

## CATEGORIES (classify each opportunity into ONE):
1. conferinte - Conference call for papers, abstract submission, poster session
2. granturi - Non-refundable funding, research grants, budget >5K EUR
3. competitii - Prize, competition, pitch, award with financial prize
4. forumuri - Speaker opportunity, panel, keynote, workshop
5. premii - Post-facto recognition, award, distinction, best paper award
6. oportunitati - Professional opportunities: visiting positions, residencies, fellowships, open calls
7. publicatii - Journal submission, special issue, book chapter, call for papers journal
8. parteneriate - Collaboration call, consortium building, MoU, Erasmus+/Horizon co-applicant search
9. acceleratoare - Incubation, acceleration, mentoring program, COST STSM
10. retele - Membership associations, research networks, academic communities, COST Actions

## OUTPUT FORMAT
Return a JSON array of opportunities. Each opportunity must have:
{
  "title": "Short descriptive title",
  "category": "one of the 10 category keys above",
  "description": "2-3 sentence description of the opportunity",
  "deadline": "Deadline date or null if ongoing/unknown",
  "location": "City, Country or Online",
  "url": "Direct URL to the opportunity page",
  "organizer": "Organization name",
  "budget": "Prize/funding amount or null",
  "tags": ["tag1", "tag2", "tag3"],
  "relevanceScore": 1-10,
  "relevanceReason": "Why this matches the researcher profile",
  "source": "Domain name of the source (e.g. emac.org)"
}

## IMPORTANT RULES:
- Find 8-15 opportunities
- Only include REAL opportunities with REAL URLs that you are confident exist
- Prioritize by relevance to the researcher profile
- Include mix of categories
- Do NOT invent fake URLs - if unsure about URL, use the organization's main website
- Sort by relevanceScore descending
- Current date context: February 2026
- ALL text fields (title, description, relevanceReason) MUST be in ROMANIAN (limba romana)
- Titles should be clear and descriptive in Romanian
- Description should explain what the opportunity is and why it matters, in Romanian

RESPOND WITH ONLY THE JSON ARRAY, no markdown, no code blocks.`;

/* ─── POST Handler ────────────────────────────────────────── */

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "rate_limit", message: "Maximum 3 scanari pe ora. Asteapta." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { blockedSources = [], existingTitles = [], customQuery = "", rules = {} } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey || apiKey === "sk-ant-YOUR_KEY_HERE") {
      return NextResponse.json(
        { error: "no_api_key", message: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    // Build user message with context, incorporating user-defined rules
    let userMessage = "Search for current academic and professional opportunities for a marketing researcher in Moldova. Focus on opportunities available NOW or in the near future (2026).\n\n";

    // Apply user-customized rules
    if (rules.keywords) {
      userMessage += `PRIORITY KEYWORDS: ${rules.keywords}\n\n`;
    }
    if (rules.excludeKeywords) {
      userMessage += `EXCLUDE: ${rules.excludeKeywords}\n\n`;
    }
    if (rules.languages) {
      userMessage += `LANGUAGES: ${rules.languages}\n\n`;
    }
    if (rules.budgetPersonal) {
      userMessage += `PERSONAL BUDGET RANGE: ${rules.budgetPersonal}\n\n`;
    }
    if (rules.geography) {
      userMessage += `GEOGRAPHIC PRIORITY: ${rules.geography}\n\n`;
    }
    if (rules.eligibility) {
      userMessage += `SPECIAL ELIGIBILITY: ${rules.eligibility}\n\n`;
    }
    if (rules.stage) {
      userMessage += `ACCEPTED RESEARCH STAGES: ${rules.stage}\n\n`;
    }
    if (rules.customNotes) {
      userMessage += `ADDITIONAL RULES: ${rules.customNotes}\n\n`;
    }

    if (customQuery) {
      userMessage += `ADDITIONAL FOCUS: ${customQuery}\n\n`;
    }

    if (blockedSources.length > 0) {
      userMessage += `BLOCKED SOURCES (exclude these domains): ${blockedSources.join(", ")}\n\n`;
    }

    if (existingTitles.length > 0) {
      userMessage += `ALREADY TRACKED (do not duplicate these): ${existingTitles.slice(0, 30).join("; ")}\n\n`;
    }

    userMessage += "Find diverse opportunities across conferences, grants, journals, networks, partnerships. Prioritize EU Widening-eligible and Eastern Partnership opportunities.";

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: SCAN_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const responseText = response.content[0].type === "text" ? response.content[0].text : "";

    let opportunities;
    try {
      const jsonStr = responseText
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      opportunities = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { error: "parse_error", message: "AI returned unexpected format. Try again." },
        { status: 500 }
      );
    }

    if (!Array.isArray(opportunities)) {
      return NextResponse.json(
        { error: "invalid_response", message: "Invalid response format" },
        { status: 500 }
      );
    }

    // Validate and clean each opportunity
    const cleaned = opportunities
      .filter((o: Record<string, unknown>) => o.title && o.category && o.description)
      .map((o: Record<string, unknown>, i: number) => ({
        id: `auto-${Date.now()}-${i}`,
        title: String(o.title || ""),
        category: String(o.category || "oportunitati"),
        description: String(o.description || ""),
        deadline: o.deadline ? String(o.deadline) : null,
        location: o.location ? String(o.location) : null,
        url: o.url ? String(o.url) : null,
        organizer: o.organizer ? String(o.organizer) : null,
        budget: o.budget ? String(o.budget) : null,
        tags: Array.isArray(o.tags) ? o.tags.map(String) : [],
        relevanceScore: Math.min(10, Math.max(1, Number(o.relevanceScore) || 5)),
        relevanceReason: String(o.relevanceReason || ""),
        source: String(o.source || ""),
        scannedAt: new Date().toISOString(),
        status: "new" as const,
      }));

    return NextResponse.json({
      success: true,
      count: cleaned.length,
      opportunities: cleaned,
      scannedAt: new Date().toISOString(),
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      if (error.status === 401) {
        return NextResponse.json(
          { error: "auth_error", message: "Invalid API key" },
          { status: 500 }
        );
      }
      if (error.status === 429) {
        return NextResponse.json(
          { error: "ai_rate_limit", message: "AI service rate limited. Wait a moment." },
          { status: 429 }
        );
      }
    }
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
