import type { Section, Zone, Archetype, Comparison, ScoreRange } from "@/types";

export const SECTIONS: Section[] = [
  { id: "hero", label: "Home" },
  { id: "philosophy", label: "Philosophy" },
  { id: "equation", label: "The Equation" },
  { id: "methodology", label: "Methodology" },
  { id: "relevance-gate", label: "Relevance Gate" },
  { id: "application", label: "Application Matrix" },
  { id: "archetypes", label: "Failure Archetypes" },
  { id: "comparison", label: "R IF C vs Others" },
  { id: "implementation", label: "Implementation" },
  { id: "case-studies", label: "Case Studies" },
  { id: "ai-prompts", label: "AI Integration" },
  { id: "resources", label: "Resources" },
  { id: "author", label: "About" },
];

export const ZONES: Zone[] = [
  { name: "Landing Page", r: "Traffic from correct source", i: "Clear promise in 5 sec", f: "Layout & visible CTA", archetype: "Invisible Phantom", color: "#DC2626" },
  { name: "Social Media", r: "Relevance in feed", i: "Powerful hook, line 1", f: "Optimal format per platform", archetype: "Aesthetic Noise", color: "#2563EB" },
  { name: "Email Marketing", r: "Correct segmentation", i: "Subject + real value", f: "Scannable & 1 CTA", archetype: "Buried Diamond", color: "#059669" },
  { name: "Paid Ads", r: "Precise targeting", i: "Distinct offer in 2 sec", f: "Scroll-stopping creative", archetype: "Invisible Phantom", color: "#D97706" },
  { name: "Pitch / Sales", r: "Their problem, not yours", i: '"Aha" moment', f: "Clear narrative slides", archetype: "Buried Diamond", color: "#EC4899" },
  { name: "Website / Homepage", r: '"This is for me" in 5 sec', i: "Unique value vs competitors", f: "Intuitive nav & trust", archetype: "Medium Clarity", color: "#6C3FA0" },
];

export const ARCHETYPES: Archetype[] = [
  {
    name: "The Invisible Phantom",
    formula: "R = 0",
    description: "Perfectly executed campaign sent to the wrong audience. Like building a 5-star restaurant in an abandoned desert. No one who needs it will ever find it.",
    icon: "ghost",
    score: "0 + (I\u00d7F) = Irrelevant",
    color: "#DC2626",
  },
  {
    name: "The Aesthetic Noise",
    formula: "I = 1, F = 10",
    description: "Stunning, cinematic ads that win design awards but nobody knows what they sell. Beautiful confusion. Expensive emptiness.",
    icon: "theater",
    score: "R + (1\u00d710) = Weak",
    color: "#D97706",
  },
  {
    name: "The Buried Diamond",
    formula: "I = 10, F = 1",
    description: "Extraordinary value hidden under boring formatting. The genius professor without a microphone. The cure nobody can read about.",
    icon: "gem",
    score: "R + (10\u00d71) = Wasted",
    color: "#2563EB",
  },
];

export const COMPARISONS: Comparison[] = [
  {
    model: "AIDA",
    full: "Attention \u2192 Interest \u2192 Desire \u2192 Action",
    weakness: "Linear funnel model. Treats conversion as manipulation endpoint. No diagnostic scoring.",
    rifc: "R IF C replaces linear persuasion with clarity measurement. Action is a natural consequence, not a forced step.",
  },
  {
    model: "RACE",
    full: "Reach \u2192 Act \u2192 Convert \u2192 Engage",
    weakness: "Process-oriented, no quality measurement. Tells you WHAT to do, not HOW WELL you\u2019re doing it.",
    rifc: "R IF C provides a numerical diagnostic at every stage. You know exactly which variable is failing.",
  },
  {
    model: "StoryBrand",
    full: "Customer is the Hero, Brand is the Guide",
    weakness: "Narrative-only framework. Powerful for messaging, but no scoring system. Subjective evaluation.",
    rifc: "R IF C quantifies what StoryBrand describes qualitatively. Both can coexist \u2014 StoryBrand builds the story, R IF C scores it.",
  },
  {
    model: "4Ps",
    full: "Product \u2192 Price \u2192 Place \u2192 Promotion",
    weakness: "Business model framework, not communication diagnostic. Doesn\u2019t measure message effectiveness.",
    rifc: "R IF C operates at the communication layer that sits ON TOP of the 4Ps. Your 4Ps can be perfect but your messaging unclear.",
  },
];

export const SCORE_RANGES: ScoreRange[] = [
  { min: 0, max: 20, label: "Total Confusion", status: "Critical Failure", statusColor: "#DC2626", impact: "100% budget burned. Message is invisible." },
  { min: 21, max: 50, label: "Background Noise", status: "Inefficient", statusColor: "#D97706", impact: "Massive cost per lead. Negative ROI." },
  { min: 51, max: 80, label: "Medium Clarity", status: "Functional", statusColor: "#2563EB", impact: "Minimal profit. Correct but ignorable." },
  { min: 81, max: 110, label: "Supreme Clarity", status: "Success", statusColor: "#059669", impact: "Maximum profit. Minimum cost per lead." },
];

export const RELEVANCE_GATE_THRESHOLD = 3;

export const AI_PROMPTS = [
  {
    label: "Diagnostic Prompt",
    text: 'Act as an R IF C Marketing expert. Analyze this message and score each variable: R (Relevance 1-10), I (Interest 1-10), F (Form 1-10). Calculate C = R + (I \u00d7 F). Identify the weakest variable and suggest one specific improvement. Apply The Relevance Gate: if R < 3, flag as Critical Failure.',
  },
  {
    label: "Rewrite Prompt",
    text: 'Act as an R IF C Marketing expert. Rewrite this message: increase variable I by adding a unique, specific benefit and maximize variable F using an airy structure (no jargon) that amplifies clarity. Maintain the same R targeting.',
  },
  {
    label: "Landing Page Audit",
    text: 'Audit this landing page using R IF C methodology. Score R (is the traffic source aligned with the page message?), I (is the promise clear and unique in the first 5 seconds?), F (does the layout guide the eye to a single CTA?). Provide the C score and identify which Failure Archetype applies, if any.',
  },
  {
    label: "Ad Creative Scoring",
    text: 'Score this ad creative using R IF C. Check: R \u2014 does it match the target audience\'s current priority? I \u2014 does the offer stand out in 2 seconds of scroll? F \u2014 is the format optimized for this platform? Calculate C and recommend whether to launch, revise, or kill.',
  },
  {
    label: "Email Optimization",
    text: 'Analyze this email using R IF C. R \u2014 is the segmentation correct for this message? I \u2014 does the subject line create enough curiosity? Does the body deliver real value? F \u2014 is the email scannable with a single clear CTA? Diagnose using failure archetypes if C < 51.',
  },
];
