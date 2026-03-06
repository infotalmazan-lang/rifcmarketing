-- ═══════════════════════════════════════════════════════════
-- Add comments JSONB column to cvi_responses
-- Stores per-item qualitative justifications from experts
-- Structure: { "R1": "comment text", "R2": "...", ... }
-- ═══════════════════════════════════════════════════════════

ALTER TABLE cvi_responses ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '{}';

-- Add index for JSONB queries (contains, key existence)
CREATE INDEX IF NOT EXISTS idx_cvi_responses_comments ON cvi_responses USING gin (comments);
