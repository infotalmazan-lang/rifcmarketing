-- ═══════════════════════════════════════════════════════════
-- CVI (Content Validity Index) — Expert Panel Tables
-- RIFC Marketing Protocol · Dumitru Talmazan, 2026
-- ═══════════════════════════════════════════════════════════

-- Table 1: CVI Experts (invited evaluators)
CREATE TABLE IF NOT EXISTS cvi_experts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token           text UNIQUE NOT NULL,
  name            text,
  org             text,
  role            text,
  experience      text,
  email           text,
  status          text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'revoked')),
  created_at      timestamptz DEFAULT now(),
  completed_at    timestamptz,
  invited_by      text DEFAULT 'talmazan'
);

-- Table 2: CVI Responses (35 item ratings per expert)
CREATE TABLE IF NOT EXISTS cvi_responses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expert_id       uuid REFERENCES cvi_experts(id) ON DELETE CASCADE,
  token           text NOT NULL,
  -- Dimension R: Relevanță (7 items)
  "R1" int2, "R2" int2, "R3" int2, "R4" int2, "R5" int2, "R6" int2, "R7" int2,
  -- Dimension I: Interes (10 items)
  "I1" int2, "I2" int2, "I3" int2, "I4" int2, "I5" int2, "I6" int2, "I7" int2, "I8" int2, "I9" int2, "I10" int2,
  -- Dimension F: Formă (11 items)
  "F1" int2, "F2" int2, "F3" int2, "F4" int2, "F5" int2, "F6" int2, "F7" int2, "F8" int2, "F9" int2, "F10" int2, "F11" int2,
  -- Dimension C: Claritate (7 items)
  "C1" int2, "C2" int2, "C3" int2, "C4" int2, "C5" int2, "C6" int2, "C7" int2,
  -- CVI scores per dimension
  cvi_r           numeric(4,2),
  cvi_i           numeric(4,2),
  cvi_f           numeric(4,2),
  cvi_c           numeric(4,2),
  cvi_total       numeric(4,2),
  -- Metadata
  submitted_at    timestamptz DEFAULT now(),
  ip_hash         text,
  user_agent      text
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cvi_experts_token ON cvi_experts(token);
CREATE INDEX IF NOT EXISTS idx_cvi_experts_status ON cvi_experts(status);
CREATE INDEX IF NOT EXISTS idx_cvi_responses_expert ON cvi_responses(expert_id);
CREATE INDEX IF NOT EXISTS idx_cvi_responses_token ON cvi_responses(token);

-- Insert test token for development
INSERT INTO cvi_experts (token, name, invited_by)
VALUES ('test-token-001', NULL, 'talmazan')
ON CONFLICT (token) DO NOTHING;
