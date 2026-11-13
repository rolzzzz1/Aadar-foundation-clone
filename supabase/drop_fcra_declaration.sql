-- Remove the unused fcra_declaration column.
-- Receipts still print the fixed FCRA notice; that text does not come from this column.
-- Run once in Supabase → SQL Editor → Run, after the site code that stops writing this column is deployed.

alter table public.donations drop column if exists fcra_declaration;
