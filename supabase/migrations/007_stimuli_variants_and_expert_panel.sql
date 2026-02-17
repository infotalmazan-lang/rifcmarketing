-- ============================================
-- STIMULI: Add variant_label and execution_quality
-- For the 3-variant design (strong/moderate/weak)
-- ============================================
alter table public.survey_stimuli
  add column if not exists variant_label text check (variant_label in ('A', 'B', 'C')),
  add column if not exists execution_quality text check (execution_quality in ('strong', 'moderate', 'weak'));

create index if not exists idx_stimuli_variant on public.survey_stimuli(variant_label);
create index if not exists idx_stimuli_quality on public.survey_stimuli(execution_quality);

-- ============================================
-- EXPERT PANEL EVALUATIONS (Layer 1)
-- Marketing experts score stimuli with rubric
-- ============================================
create table if not exists public.survey_expert_evaluations (
  id uuid primary key default uuid_generate_v4(),
  stimulus_id uuid references public.survey_stimuli(id) on delete cascade not null,
  expert_name text not null,
  expert_role text,
  r_score smallint not null check (r_score >= 1 and r_score <= 10),
  i_score smallint not null check (i_score >= 1 and i_score <= 10),
  f_score smallint not null check (f_score >= 1 and f_score <= 10),
  c_computed smallint generated always as (r_score + i_score * f_score) stored,
  r_justification text,
  i_justification text,
  f_justification text,
  notes text,
  evaluated_at timestamptz not null default now(),
  unique(stimulus_id, expert_name)
);

alter table public.survey_expert_evaluations enable row level security;

create policy "Expert evals viewable by everyone"
  on public.survey_expert_evaluations for select using (true);
create policy "Expert evals insertable by everyone"
  on public.survey_expert_evaluations for insert with check (true);
create policy "Expert evals updatable by everyone"
  on public.survey_expert_evaluations for update using (true);
create policy "Expert evals deletable by everyone"
  on public.survey_expert_evaluations for delete using (true);

create index if not exists idx_expert_eval_stimulus on public.survey_expert_evaluations(stimulus_id);

-- ============================================
-- ATTENTION CHECKS table (optional tracking)
-- ============================================
alter table public.survey_respondents
  add column if not exists attention_check_passed boolean;
