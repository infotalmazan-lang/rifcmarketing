export type StimulusType =
  | "Site"
  | "Social"
  | "Email"
  | "Google"
  | "Video"
  | "Billboard"
  | "Ambalaj"
  | "SMS"
  | "RadioTV"
  | "Influencer";

export interface SurveyStimulus {
  id: string;
  name: string;
  type: StimulusType;
  industry: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  text_content: string | null;
  pdf_url: string | null;
  site_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface DemographicData {
  ageRange: string;
  gender: string;
  locationType: string;
  incomeRange: string;
  education: string;
  occupation: string;
}

export interface BehavioralData {
  purchaseFrequency: string;
  preferredChannels: string[];
  dailyOnlineTime: string;
  primaryDevice: string;
}

export interface PsychographicData {
  adReceptivity: number;
  visualPreference: number;
  impulseBuying: number;
  irrelevanceAnnoyance: number;
  attentionCapture: number;
}

export interface StimulusResponse {
  stimulusId: string;
  rScore: number;
  iScore: number;
  fScore: number;
  cComputed: number;
  timeSpentSeconds: number;
}

export interface SurveySession {
  sessionId: string;
  currentStep: number;
  stimuliOrder: string[];
}

export interface AIEvaluation {
  id: string;
  stimulus_id: string;
  model_name: string;
  r_score: number;
  i_score: number;
  f_score: number;
  c_computed: number;
  justification: Record<string, string>;
  prompt_version: string;
  evaluated_at: string;
}

export interface StimulusResult {
  id: string;
  name: string;
  type: string;
  industry: string | null;
  response_count: number;
  avg_r: number;
  avg_i: number;
  avg_f: number;
  avg_c: number;
  sd_c: number;
}

export interface SurveyResults {
  totalRespondents: number;
  completedRespondents: number;
  completionRate: number;
  totalResponses: number;
  stimuliResults: StimulusResult[];
  aiEvaluations: AIEvaluation[];
}
