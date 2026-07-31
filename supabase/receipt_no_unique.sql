-- Optional migration for existing Supabase projects that already ran donations.sql.
-- Run once in Supabase → SQL Editor → Run.
--
-- Enforces uniqueness of donations.receipt_no so concurrent inserts cannot share
-- the same AADAR-YYYY-###### value. Empty/null legacy values are allowed.

create unique index if not exists donations_receipt_no_key
  on public.donations (receipt_no)
  where receipt_no is not null and receipt_no <> '';

comment on column public.donations.receipt_no is
  'Official receipt number AADAR-YYYY-000001; single source of truth for PDF/email/UI.';
