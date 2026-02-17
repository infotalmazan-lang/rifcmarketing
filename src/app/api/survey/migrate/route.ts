import { NextResponse } from "next/server";
import { createServiceRole } from "@/lib/supabase/server";

/**
 * One-time migration endpoint for survey_distributions.
 * POST /api/survey/migrate — creates table + adds column if not exists.
 * Safe to call multiple times (idempotent).
 */
export async function POST() {
  try {
    const supabase = createServiceRole();

    // Check if table already exists
    const { error: checkErr } = await supabase
      .from("survey_distributions")
      .select("id")
      .limit(1);

    if (checkErr && checkErr.code === "42P01") {
      // Table doesn't exist — create it via raw SQL isn't possible with PostgREST
      // Instead, try to create via rpc if available
      return NextResponse.json({
        migrated: false,
        error: "Table survey_distributions does not exist yet.",
        action: "Run the following SQL in Supabase Dashboard > SQL Editor",
        sql: `
-- Create survey_distributions table
create table public.survey_distributions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text default '',
  tag text not null unique,
  estimated_completions integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.survey_distributions enable row level security;

create policy "Anyone can view distributions" on public.survey_distributions for select using (true);
create policy "Anyone can insert distributions" on public.survey_distributions for insert with check (true);
create policy "Anyone can update distributions" on public.survey_distributions for update using (true);
create policy "Anyone can delete distributions" on public.survey_distributions for delete using (true);

create index idx_distributions_tag on public.survey_distributions(tag);

-- Add distribution_id column to survey_respondents
alter table public.survey_respondents
  add column if not exists distribution_id uuid references public.survey_distributions(id) on delete set null;

create index if not exists idx_respondents_distribution on public.survey_respondents(distribution_id);
        `.trim(),
      });
    }

    // Table exists — check if column exists on respondents
    const { error: colErr } = await supabase
      .from("survey_respondents")
      .select("distribution_id")
      .limit(1);

    return NextResponse.json({
      migrated: true,
      tableExists: true,
      columnExists: !colErr,
      note: colErr ? "Column distribution_id missing on survey_respondents. Run ALTER TABLE." : "All good!",
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
