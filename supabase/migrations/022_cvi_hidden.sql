-- ═══════════════════════════════════════════════════════════
-- CVI Expert: Add hidden column for temporary exclusion from calculations
-- Allows admin to hide/unhide experts without deleting them
-- ═══════════════════════════════════════════════════════════
ALTER TABLE cvi_experts ADD COLUMN IF NOT EXISTS hidden boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_cvi_experts_hidden ON cvi_experts(hidden);
