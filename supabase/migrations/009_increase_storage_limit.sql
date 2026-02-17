-- ============================================
-- Increase storage bucket file size limit to 500MB
-- Needed for large video uploads
-- ============================================
update storage.buckets
set file_size_limit = 524288000  -- 500MB in bytes
where id = 'survey-media';
