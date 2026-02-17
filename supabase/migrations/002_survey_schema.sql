-- ============================================
-- SURVEY STIMULI
-- Marketing materials that respondents evaluate
-- ============================================
create table public.survey_stimuli (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  type text not null check (type in (
    'LP','Social','Email','Ads','Video','Billboard','Print','SMS','PitchDeck','Radio'
  )),
  industry text,
  description text,
  image_url text,
  video_url text,
  text_content text,
  pdf_url text,
  site_url text,
  display_order smallint not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.survey_stimuli enable row level security;

create policy "Active stimuli viewable by everyone"
  on public.survey_stimuli for select using (is_active = true);

create index idx_survey_stimuli_active on public.survey_stimuli(is_active, display_order);

-- ============================================
-- SURVEY RESPONDENTS
-- Each person who starts the survey gets a row
-- ============================================
create table public.survey_respondents (
  id uuid primary key default uuid_generate_v4(),
  session_id text not null unique,
  step_completed smallint not null default 0,
  demographics jsonb default '{}',
  behavioral jsonb default '{}',
  psychographic jsonb default '{}',
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  ip_hash text,
  user_agent text,
  device_type text
);

alter table public.survey_respondents enable row level security;

create policy "Anyone can create respondent"
  on public.survey_respondents for insert with check (true);

create policy "Anyone can update respondent"
  on public.survey_respondents for update using (true);

create policy "Anyone can select own respondent by session"
  on public.survey_respondents for select using (true);

create index idx_respondents_session on public.survey_respondents(session_id);
create index idx_respondents_completed on public.survey_respondents(completed_at);

-- ============================================
-- SURVEY RESPONSES
-- Individual R, I, F scores per stimulus per respondent
-- ============================================
create table public.survey_responses (
  id uuid primary key default uuid_generate_v4(),
  respondent_id uuid references public.survey_respondents(id) on delete cascade not null,
  stimulus_id uuid references public.survey_stimuli(id) on delete cascade not null,
  r_score smallint not null check (r_score >= 1 and r_score <= 10),
  i_score smallint not null check (i_score >= 1 and i_score <= 10),
  f_score smallint not null check (f_score >= 1 and f_score <= 10),
  c_computed smallint generated always as (r_score + i_score * f_score) stored,
  time_spent_seconds integer,
  created_at timestamptz not null default now(),
  unique(respondent_id, stimulus_id)
);

alter table public.survey_responses enable row level security;

create policy "Anyone can insert response"
  on public.survey_responses for insert with check (true);

create policy "Anyone can select responses"
  on public.survey_responses for select using (true);

create index idx_responses_respondent on public.survey_responses(respondent_id);
create index idx_responses_stimulus on public.survey_responses(stimulus_id);

-- ============================================
-- SURVEY AI EVALUATIONS
-- Manual AI scores per stimulus per model
-- ============================================
create table public.survey_ai_evaluations (
  id uuid primary key default uuid_generate_v4(),
  stimulus_id uuid references public.survey_stimuli(id) on delete cascade not null,
  model_name text not null,
  r_score numeric(4,2) not null,
  i_score numeric(4,2) not null,
  f_score numeric(4,2) not null,
  c_computed numeric(6,2) generated always as (r_score + i_score * f_score) stored,
  justification jsonb default '{}',
  prompt_version text not null default 'v1',
  evaluated_at timestamptz not null default now(),
  unique(stimulus_id, model_name, prompt_version)
);

alter table public.survey_ai_evaluations enable row level security;

create policy "Anyone can view ai evaluations"
  on public.survey_ai_evaluations for select using (true);

create policy "Anyone can insert ai evaluations"
  on public.survey_ai_evaluations for insert with check (true);

create index idx_ai_eval_stimulus on public.survey_ai_evaluations(stimulus_id);

-- ============================================
-- SEED: Initial 8 stimuli from pilot data
-- ============================================
insert into public.survey_stimuli (name, type, industry, description, display_order, is_active) values
  ('Maison Noir — FB Ad Restaurant', 'Social', 'Restaurant', 'Reclamă Facebook pentru un restaurant exclusivist. Imagine cu preparate gourmet și ofertă de deschidere.', 1, true),
  ('CloudMetric — Landing Page SaaS', 'LP', 'SaaS B2B', 'Landing page pentru platformă de analytics cloud. Header cu propunere de valoare, secțiune features, CTA trial gratuit.', 2, true),
  ('CodeNest — Video Ad EdTech', 'Video', 'EdTech', 'Spot video 30 secunde pentru platformă de cursuri de programare. Testimoniale studenți + demo produs.', 3, true),
  ('VELA Fashion — Instagram Story', 'Social', 'Fashion', 'Instagram Story cu noua colecție de primăvară. Carousel cu 5 ținute, swipe-up link.', 4, true),
  ('Mentor Biz — Email Campaign', 'Email', 'Consultanță', 'Email de nurturing pentru servicii de consultanță business. Subject line + body cu studiu de caz client.', 5, true),
  ('TechPro — Billboard Outdoor', 'Billboard', 'Telecom', 'Billboard pentru abonament telefonie mobilă. Headline mare, preț promoțional, QR code.', 6, true),
  ('GreenLife — Print Ad Revistă', 'Print', 'Organic Food', 'Reclamă print în revista Femeia. Produse bio cu certificare, visual lifestyle, CTA magazin online.', 7, true),
  ('QuickDelivery — SMS Promo', 'SMS', 'Delivery', 'SMS promoțional: "-30% la prima comandă. Folosește codul QUICK30. Livrare gratuită azi!"', 8, true);
