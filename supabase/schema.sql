-- Soft Passport community data. Run this in the Supabase SQL editor.
create table if not exists public.visa_stories (
  id uuid primary key default gen_random_uuid(),
  passport char(2) not null,
  destination char(2) not null,
  visa_type text not null check (visa_type in ('tourist','business','student','transit','work')),
  outcome text not null check (outcome in ('approved','refused','pending')),
  applied_at text,
  days_waited int check (days_waited between 0 and 730),
  total_cost_usd int check (total_cost_usd between 0 and 20000),
  documents text[] not null default '{}',
  refusal_reason text,
  advice text,
  approved_for_display boolean not null default false,  -- moderate before publishing
  created_at timestamptz not null default now()
);

create index if not exists visa_stories_route on public.visa_stories (passport, destination, created_at desc);

-- The website talks to this table only from the server with the service role key.
-- Keep row level security on so the public anon key can't read or write it directly.
alter table public.visa_stories enable row level security;

create table if not exists public.newsletter (
  email text primary key,
  passport char(2),
  created_at timestamptz not null default now()
);
alter table public.newsletter enable row level security;
