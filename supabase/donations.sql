-- Aadar Foundation — donation records (run once in Supabase → SQL Editor → Run)
-- Used by /api/razorpay-verify and /api/razorpay-webhook via service role key (server only).

create table if not exists public.donations (
  id bigint generated always as identity primary key,
  payment_id text not null,
  order_id text not null,
  receipt_no text,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null,
  donor_name text,
  donor_father_or_husband text,
  donor_email text,
  donor_contact text,
  donor_pan text,
  donor_address text,
  donor_state text,
  donor_city text,
  donor_pin text,
  program_label text,
  purpose text,
  fcra_declaration text,
  -- Analytics: actual payment method/mode (upi/card/netbanking/wallet/bank_transfer/upi_qr)
  payment_method text,
  source text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  receipt_email_sent_at timestamptz,
  constraint donations_payment_id_key unique (payment_id)
);

create index if not exists donations_created_at_idx on public.donations (created_at desc);
create index if not exists donations_order_id_idx on public.donations (order_id);

comment on table public.donations is 'Razorpay captured donations; written by Vercel API (service role).';

-- Recurring membership (Razorpay Subscriptions) adds subscription_id/is_recurring/frequency
-- columns to this table plus two new tables — see supabase/membership.sql.

-- If the table already exists from an earlier deploy, run this once in SQL Editor:
-- alter table public.donations add column if not exists receipt_no text;
-- alter table public.donations add column if not exists donor_father_or_husband text;
-- alter table public.donations add column if not exists fcra_declaration text;
-- alter table public.donations add column if not exists donor_address text;
-- alter table public.donations add column if not exists donor_state text;
-- alter table public.donations add column if not exists donor_city text;
-- alter table public.donations add column if not exists donor_pin text;
-- alter table public.donations add column if not exists payment_method text;
-- alter table public.donations add column if not exists updated_at timestamptz not null default now();
-- alter table public.donations add column if not exists receipt_email_sent_at timestamptz;

-- Lock down public access; your Node API uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
alter table public.donations enable row level security;

-- Server API uses the service role / secret key — grant table access (no public policies).
grant select, insert, update on table public.donations to service_role;
grant usage, select on all sequences in schema public to service_role;
