-- ============================================
-- STORAGE BUCKET for survey media files
-- Images, videos, PDFs uploaded for stimuli
-- ============================================
insert into storage.buckets (id, name, public)
values ('survey-media', 'survey-media', true)
on conflict (id) do nothing;

-- Public read access
create policy "Public read access on survey-media"
  on storage.objects for select
  using (bucket_id = 'survey-media');

-- Service role can upload
create policy "Service role upload on survey-media"
  on storage.objects for insert
  with check (bucket_id = 'survey-media');

-- Service role can delete
create policy "Service role delete on survey-media"
  on storage.objects for delete
  using (bucket_id = 'survey-media');
