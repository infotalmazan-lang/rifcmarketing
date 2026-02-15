export interface Section {
  id: string;
  label: string;
}

export interface Zone {
  name: string;
  r: string;
  i: string;
  f: string;
  archetype: string;
  color: string;
}

export interface Archetype {
  name: string;
  formula: string;
  description: string;
  icon: string;
  score: string;
  color: string;
}

export interface Comparison {
  model: string;
  full: string;
  weakness: string;
  rifc: string;
}

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

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  file_size: string | null;
  type: "whitepaper" | "template" | "card" | "paper";
  status: "available" | "coming_soon" | "in_development";
  download_count: number;
  created_at: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industry: string;
  description: string;
  before_r: number;
  before_i: number;
  before_f: number;
  before_c: number;
  after_r: number;
  after_i: number;
  after_f: number;
  after_c: number;
  metric_improvement: string;
  is_published: boolean;
  created_at: string;
}

export interface ConsultingRequest {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string;
  budget_range: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  confirmed: boolean;
  unsubscribed_at: string | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  role: string;
  created_at: string;
}

export interface AuditRecommendation {
  variable: "R" | "I" | "F";
  action: string;
  impact: string;
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
}
