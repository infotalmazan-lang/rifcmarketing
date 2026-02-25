-- =====================================================
-- Article Progress — Single-row JSONB persistence
-- RIFC Marketing Protocol · Dumitru Talmazan, 2026
-- =====================================================

CREATE TABLE IF NOT EXISTS article_progress (
  id          text PRIMARY KEY DEFAULT 'singleton',
  tasks       jsonb DEFAULT '{}'::jsonb,
  blocks      jsonb DEFAULT '{}'::jsonb,
  updated_at  timestamptz DEFAULT now()
);

-- Insert the singleton row
INSERT INTO article_progress (id, tasks, blocks)
VALUES ('singleton', '{}'::jsonb, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;
