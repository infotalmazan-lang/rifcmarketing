export interface ScoreRange {
  min: number;
  max: number;
  label: string;
  status: string;
  statusColor: string;
  impact: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  meta_title: string | null;
  meta_description: string | null;
  category?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
}

export interface Calculation {
  id: string;
  user_id: string | null;
  r_score: number;
  i_score: number;
  f_score: number;
  c_score: number;
  channel: string | null;
  notes: string | null;
  diagnosis: string | null;
  created_at: string;
}

export interface AuditRecommendation {
  variable: "R" | "I" | "F";
  action: string;
  impact: string;
}

export interface SubfactorScore {
  id: string;
  score: number;
  justification: string;
  critical: boolean;
}

export interface BrandProfile {
  name: string;
  industry: string;
  targetAudience: string;
  tone: string;
  uvp: string;
}

export interface AuditResult {
  r: number;
  i: number;
  f: number;
  c: number;
  rJustification: string;
  iJustification: string;
  fJustification: string;
  diagnosis: string;
  archetype: "invisible_phantom" | "aesthetic_noise" | "buried_diamond" | "none";
  clarityLevel: "critical" | "noise" | "medium" | "supreme";
  recommendations: AuditRecommendation[];
  summary: string;
  subfactors?: SubfactorScore[];
  objective?: string;
  brandContext?: BrandProfile;
  ctaSuggestion?: string;
}
