-- Add locale column to track respondent's selected language (ro/en/ru)
ALTER TABLE survey_respondents
ADD COLUMN IF NOT EXISTS locale text DEFAULT 'ro';
