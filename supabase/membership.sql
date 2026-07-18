-- Aadar Foundation — recurring membership (Razorpay Subscriptions).
-- Run once in Supabase → SQL Editor → Run. Requires supabase/donations.sql to already exist.
-- Used by api/membership-subscription-create.js, api/membership-subscription-verify.js and
-- api/razorpay-webhook.js via the service role key (server only).

-- 1) Extend `donations` so each recurring charge (first + every later auto-charge) can be
--    stored alongside one-time gifts and reuse the existing receipt/admin tooling.
alter table public.donations add column if not exists subscription_id text;
alter table public.donations add column if not exists is_recurring boolean not null default false;
alter table public.donations add column if not exists frequency text;

create index if not exists donations_subscription_id_idx on public.donations (subscription_id);

-- 2) Cache of Razorpay Plan IDs — one Plan per (tier, frequency); created lazily on first
--    checkout and reused after that instead of creating a duplicate Plan every time.
create table if not exists public.membership_plans (
  id bigint generated always as identity primary key,
  tier_key text not null,
  frequency text not null,
  razorpay_plan_id text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  created_at timestamptz not null default now(),
  constraint membership_plans_tier_frequency_key unique (tier_key, frequency),
  constraint membership_plans_plan_id_key unique (razorpay_plan_id)
);

-- 3) One row per donor Subscription — lifecycle/status tracking (separate from the
--    per-charge `donations` rows above).
create table if not exists public.membership_subscriptions (
  id bigint generated always as identity primary key,
  subscription_id text not null,
  plan_id text not null,
  tier_key text not null,
  frequency text not null,
  amount_paise integer not null,
  currency text not null default 'INR',
  status text not null default 'created',
  donor_name text,
  donor_father_or_husband text,
  donor_email text,
  donor_contact text,
  donor_pan text,
  donor_address text,
  donor_state text,
  donor_city text,
  donor_pin text,
  fcra_declaration text,
  current_start timestamptz,
  current_end timestamptz,
  charge_at timestamptz,
  paid_count integer not null default 0,
  total_count integer,
  source text not null default 'create',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint membership_subscriptions_subscription_id_key unique (subscription_id)
);

create index if not exists membership_subscriptions_created_at_idx
  on public.membership_subscriptions (created_at desc);
create index if not exists membership_subscriptions_status_idx
  on public.membership_subscriptions (status);
create index if not exists membership_subscriptions_donor_email_idx
  on public.membership_subscriptions (donor_email);

comment on table public.membership_plans is 'Cache of Razorpay Plan IDs by (tier_key, frequency); written by Vercel API (service role).';
comment on table public.membership_subscriptions is 'Razorpay recurring membership subscriptions (lifecycle/status); written by Vercel API (service role).';

-- Lock down public access; the Node API uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
alter table public.membership_plans enable row level security;
alter table public.membership_subscriptions enable row level security;

grant select, insert, update on table public.membership_plans to service_role;
grant select, insert, update on table public.membership_subscriptions to service_role;
grant usage, select on all sequences in schema public to service_role;
