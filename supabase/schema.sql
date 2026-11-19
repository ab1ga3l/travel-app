-- Aviora database. Run this once in the Supabase SQL editor.
-- Then turn on Email sign-in (Authentication → Providers → Email, "magic link").

-- ---------- Traveller profiles and trips (private to each user) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

create table if not exists public.trips (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade,
  country char(2) not null,
  status text not null check (status in ('been','going','dream')),
  start_date date,
  end_date date,
  note text,
  created_at timestamptz not null default now()
);
alter table public.trips enable row level security;
create policy "own trips" on public.trips for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- Community posts and replies (public to read, signed-in to write) ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  author_name text not null check (char_length(author_name) <= 40),
  country char(2),
  topic text not null check (topic in ('visa','money','safety','gems','transport','moving','meetups','deals')),
  body text not null check (char_length(body) between 5 and 1500),
  link text check (link is null or link ~ '^https?://'),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists posts_recent on public.posts (created_at desc);
alter table public.posts enable row level security;
create policy "read visible posts" on public.posts for select using (not hidden);
create policy "write own posts" on public.posts for insert with check (auth.uid() = user_id);
create policy "delete own posts" on public.posts for delete using (auth.uid() = user_id);

create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  author_name text not null check (char_length(author_name) <= 40),
  body text not null check (char_length(body) between 2 and 1000),
  created_at timestamptz not null default now()
);
alter table public.replies enable row level security;
create policy "read replies" on public.replies for select using (true);
create policy "write own replies" on public.replies for insert with check (auth.uid() = user_id);
create policy "delete own replies" on public.replies for delete using (auth.uid() = user_id);

-- ---------- Worth it / Skip it verdicts on gems (one per user per gem) ----------
create table if not exists public.gem_votes (
  gem_id text not null,
  user_id uuid not null references auth.users on delete cascade,
  verdict text not null check (verdict in ('worth','skip')),
  note text check (note is null or char_length(note) <= 500),
  paid_usd int check (paid_usd between 0 and 10000),
  crowd text,
  best_time text,
  felt_safe text check (felt_safe is null or felt_safe in ('yes','no','na')),
  created_at timestamptz not null default now(),
  primary key (gem_id, user_id)
);
alter table public.gem_votes enable row level security;
create policy "read votes" on public.gem_votes for select using (true);
create policy "write own vote" on public.gem_votes for insert with check (auth.uid() = user_id);
create policy "update own vote" on public.gem_votes for update using (auth.uid() = user_id);

-- ---------- Visa stories (written by the server, shown after moderation) ----------
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
  approved_for_display boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists visa_stories_route on public.visa_stories (passport, destination, created_at desc);
alter table public.visa_stories enable row level security; -- server-only access with the service role key

create table if not exists public.newsletter (
  email text primary key,
  passport char(2),
  created_at timestamptz not null default now()
);
alter table public.newsletter enable row level security;
