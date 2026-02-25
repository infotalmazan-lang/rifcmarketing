-- Add browser fingerprint for duplicate detection
ALTER TABLE survey_respondents
  ADD COLUMN IF NOT EXISTS browser_fingerprint text;

-- Add flagging system for suspicious/duplicate respondents
ALTER TABLE survey_respondents
  ADD COLUMN IF NOT EXISTS is_flagged boolean DEFAULT false;

-- Add optional flag reason
ALTER TABLE survey_respondents
  ADD COLUMN IF NOT EXISTS flag_reason text;

-- Index for fast lookups on fingerprint + IP
CREATE INDEX IF NOT EXISTS idx_respondents_fingerprint ON survey_respondents(browser_fingerprint);
CREATE INDEX IF NOT EXISTS idx_respondents_ip_address ON survey_respondents(ip_address);
CREATE INDEX IF NOT EXISTS idx_respondents_is_flagged ON survey_respondents(is_flagged);
