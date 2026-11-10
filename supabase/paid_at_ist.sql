-- India payment time for the Supabase table grid.
-- Run once in Supabase → SQL Editor → Run.
-- created_at stays in UTC. paid_at_ist is the same moment in Asia/Kolkata, 24-hour clock.
-- 20:18 means 8:18 PM. Do not write this column; it is derived.

alter table public.donations
  add column if not exists paid_at_ist timestamp without time zone
  generated always as (created_at at time zone 'Asia/Kolkata') stored;

comment on column public.donations.paid_at_ist is
  'Payment time in India (IST), derived from created_at. 24-hour clock. Do not write directly.';
