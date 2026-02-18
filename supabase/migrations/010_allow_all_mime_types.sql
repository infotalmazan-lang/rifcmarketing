-- ============================================
-- Allow ALL mime types on survey-media bucket
-- Needed for MOV, MP4, and other video formats
-- ============================================
update storage.buckets
set allowed_mime_types = null
where id = 'survey-media';
