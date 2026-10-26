-- Display helper: rupees derived from amount_paise (Razorpay source of truth).
-- Run once in Supabase → SQL Editor → Run.
-- App write path still uses amount_paise; this column is for Studio / reports.

alter table public.donations
  add column if not exists amount_inr integer
  generated always as (amount_paise / 100) stored;

comment on column public.donations.amount_inr is
  'Rupees for display/reporting; derived from amount_paise (do not write directly).';
