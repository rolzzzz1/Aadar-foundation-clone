-- Aadar Foundation — donation records (run once in Supabase → SQL Editor → Run)
-- Used by /api/razorpay-verify and /api/razorpay-webhook via service role key (server only).

create table if not exists public.donations (
  id bigint generated always as identity primary key,
  payment_id text not null,
  order_id text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null,
  donor_name text,
  donor_email text,
  donor_contact text,
  donor_pan text,
  program_label text,
  purpose text,
  source text not null,
  created_at timestamptz not null default now(),
  constraint donations_payment_id_key unique (payment_id)
);

create index if not exists donations_created_at_idx on public.donations (created_at desc);
create index if not exists donations_order_id_idx on public.donations (order_id);

comment on table public.donations is 'Razorpay captured donations; written by Vercel API (service role).';

-- Lock down public access; your Node API uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
alter table public.donations enable row level security;

-- Server API uses the service role / secret key — grant table access (no public policies).
grant select, insert, update on table public.donations to service_role;
grant usage, select on all sequences in schema public to service_role;
