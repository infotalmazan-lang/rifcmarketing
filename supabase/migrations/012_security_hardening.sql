-- ============================================
-- SECURITY HARDENING
-- Fix 3 function search_path + tighten 24 RLS policies
-- All API routes use createServiceRole() which bypasses RLS,
-- so these policies are a defense-in-depth safety net against
-- direct anon-key access to Supabase from the browser.
-- ============================================

-- ============================================
-- PART 1: Fix function search_path (3 functions)
-- ============================================

-- 1a. handle_new_user — security definer, add search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 1b. update_updated_at — add search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 1c. increment_download_count — security definer, add search_path
CREATE OR REPLACE FUNCTION public.increment_download_count()
RETURNS trigger AS $$
BEGIN
  UPDATE public.resources SET download_count = download_count + 1 WHERE id = new.resource_id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- ============================================
-- PART 2: Tighten RLS policies
-- Strategy: Keep public SELECT where needed for the survey wizard,
-- restrict INSERT/UPDATE/DELETE to authenticated admin only.
-- Service role bypasses all RLS, so admin API routes are unaffected.
-- ============================================

-- Helper: check if current user is admin
-- (Only used in RLS policies, not in app code)

-- ----------------------------------------
-- 2a. survey_categories
-- SELECT: keep public (wizard needs category metadata)
-- INSERT/UPDATE/DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Categories updatable by everyone" ON public.survey_categories;
DROP POLICY IF EXISTS "Categories insertable by everyone" ON public.survey_categories;
DROP POLICY IF EXISTS "Categories deletable by everyone" ON public.survey_categories;

CREATE POLICY "Admin can insert categories"
  ON public.survey_categories FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update categories"
  ON public.survey_categories FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete categories"
  ON public.survey_categories FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2b. survey_stimuli
-- SELECT: keep public (wizard displays stimuli)
-- INSERT/UPDATE/DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Stimuli viewable by everyone" ON public.survey_stimuli;
DROP POLICY IF EXISTS "Stimuli insertable by everyone" ON public.survey_stimuli;
DROP POLICY IF EXISTS "Stimuli updatable by everyone" ON public.survey_stimuli;
DROP POLICY IF EXISTS "Stimuli deletable by everyone" ON public.survey_stimuli;

CREATE POLICY "Stimuli viewable by everyone"
  ON public.survey_stimuli FOR SELECT USING (true);

CREATE POLICY "Admin can insert stimuli"
  ON public.survey_stimuli FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update stimuli"
  ON public.survey_stimuli FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete stimuli"
  ON public.survey_stimuli FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2c. survey_respondents
-- SELECT/INSERT/UPDATE: keep public (wizard creates and updates respondents)
-- DELETE: admin only (no anonymous delete needed)
-- ----------------------------------------
-- Note: SELECT, INSERT, UPDATE must remain public for the anonymous survey wizard.
-- These 3 policies with USING(true) are intentional and necessary.
-- We add a restrictive DELETE policy.
CREATE POLICY "Admin can delete respondents"
  ON public.survey_respondents FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2d. survey_responses
-- INSERT/SELECT: keep public (wizard inserts responses, needs to check existing)
-- UPDATE: keep public (wizard upserts via ON CONFLICT)
-- DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Anyone can update own response" ON public.survey_responses;

CREATE POLICY "Anyone can update response"
  ON public.survey_responses FOR UPDATE USING (true);

CREATE POLICY "Admin can delete responses"
  ON public.survey_responses FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2e. survey_ai_evaluations
-- SELECT: keep public (results page shows AI scores)
-- INSERT/UPDATE/DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Anyone can view ai evaluations" ON public.survey_ai_evaluations;
DROP POLICY IF EXISTS "Anyone can insert ai evaluations" ON public.survey_ai_evaluations;

CREATE POLICY "AI evaluations viewable by everyone"
  ON public.survey_ai_evaluations FOR SELECT USING (true);

CREATE POLICY "Admin can insert ai evaluations"
  ON public.survey_ai_evaluations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update ai evaluations"
  ON public.survey_ai_evaluations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete ai evaluations"
  ON public.survey_ai_evaluations FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2f. survey_distributions
-- SELECT: keep public (wizard reads distribution by tag)
-- INSERT/UPDATE/DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Anyone can view distributions" ON public.survey_distributions;
DROP POLICY IF EXISTS "Anyone can insert distributions" ON public.survey_distributions;
DROP POLICY IF EXISTS "Anyone can update distributions" ON public.survey_distributions;
DROP POLICY IF EXISTS "Anyone can delete distributions" ON public.survey_distributions;

CREATE POLICY "Distributions viewable by everyone"
  ON public.survey_distributions FOR SELECT USING (true);

CREATE POLICY "Admin can insert distributions"
  ON public.survey_distributions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update distributions"
  ON public.survey_distributions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete distributions"
  ON public.survey_distributions FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2g. survey_expert_evaluations
-- SELECT: keep public (results page)
-- INSERT/UPDATE/DELETE: admin only
-- ----------------------------------------
DROP POLICY IF EXISTS "Expert evals viewable by everyone" ON public.survey_expert_evaluations;
DROP POLICY IF EXISTS "Expert evals insertable by everyone" ON public.survey_expert_evaluations;
DROP POLICY IF EXISTS "Expert evals updatable by everyone" ON public.survey_expert_evaluations;
DROP POLICY IF EXISTS "Expert evals deletable by everyone" ON public.survey_expert_evaluations;

CREATE POLICY "Expert evals viewable by everyone"
  ON public.survey_expert_evaluations FOR SELECT USING (true);

CREATE POLICY "Admin can insert expert evals"
  ON public.survey_expert_evaluations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can update expert evals"
  ON public.survey_expert_evaluations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin can delete expert evals"
  ON public.survey_expert_evaluations FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- ----------------------------------------
-- 2h. consulting_requests — INSERT: keep public (contact form)
-- Already has admin-only SELECT and UPDATE, just needs to stay as-is.
-- The INSERT with check(true) is intentional for the contact form.
-- ----------------------------------------
-- No changes needed — INSERT(true) is correct for public contact form.


-- ----------------------------------------
-- 2i. newsletter_subscribers — INSERT: keep public (subscribe form)
-- Already has admin-only SELECT.
-- ----------------------------------------
-- No changes needed — INSERT(true) is correct for public subscribe form.


-- ----------------------------------------
-- 2j. downloads — INSERT: keep public (download tracking)
-- Already has user-scoped SELECT.
-- ----------------------------------------
-- No changes needed — INSERT(true) is correct for public download tracking.
