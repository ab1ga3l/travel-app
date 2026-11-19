-- Tokende database. Run this once in the Supabase SQL editor.
-- Then in Authentication → Providers turn on: Phone (SMS, e.g. via Twilio or Africa's Talking-compatible provider),
-- Email (OTP code), Google and Apple. Add your site URL and /auth to the redirect allow list.

-- Upgrading from the first version? The old `trips` table held map pins. Move it first:
--   alter table public.trips rename to places;
--   alter policy "own trips" on public.places rename to "own places";

-- ---------- Traveller profiles and map places (private to each user) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);

-- Countries on "My map": been / going / dream.
create table if not exists public.places (
  id uuid primary key,
  user_id uuid not null references auth.users on delete cascade,
  country char(2) not null,
  status text not null check (status in ('been','going','dream')),
  start_date date,
  end_date date,
  note text,
  created_at timestamptz not null default now()
);
alter table public.places enable row level security;
create policy "own places" on public.places for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Opt-in "been there" card shown in the community. Only first name, home country and countries visited.
create table if not exists public.public_profiles (
  user_id uuid primary key references auth.users on delete cascade,
  display_name text not null check (char_length(display_name) <= 40),
  home_country char(2),
  been text[] not null default '{}',
  is_public boolean not null default false,
  updated_at timestamptz not null default now()
);
create index if not exists public_profiles_been on public.public_profiles using gin (been);
alter table public.public_profiles enable row level security;
create policy "read public cards" on public.public_profiles for select using (is_public or auth.uid() = user_id);
create policy "write own card" on public.public_profiles for insert with check (auth.uid() = user_id);
create policy "update own card" on public.public_profiles for update using (auth.uid() = user_id);
create policy "delete own card" on public.public_profiles for delete using (auth.uid() = user_id);

-- ---------- Group trips (shared with members) ----------
-- The whole trip (plan, checklist, pot tracker, split, proposals) lives in `data`.
create table if not exists public.trips (
  id uuid primary key,
  code text not null unique check (code ~ '^[A-Z0-9]{6}$'),
  owner uuid not null references auth.users on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.trip_members (
  trip_id uuid not null references public.trips on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  member_id text, -- the member's id inside trips.data.members
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

-- Membership check that doesn't trigger RLS recursion.
create or replace function public.is_trip_member(p_trip uuid) returns boolean
language sql security definer stable set search_path = public as $$
  select exists (select 1 from trip_members where trip_id = p_trip and user_id = auth.uid());
$$;

alter table public.trips enable row level security;
create policy "members read trips" on public.trips for select using (owner = auth.uid() or public.is_trip_member(id));
create policy "owner creates trips" on public.trips for insert with check (owner = auth.uid());
create policy "members update trips" on public.trips for update using (owner = auth.uid() or public.is_trip_member(id)) with check (owner = (select t.owner from public.trips t where t.id = trips.id));
create policy "owner deletes trips" on public.trips for delete using (owner = auth.uid());

alter table public.trip_members enable row level security;
create policy "members see members" on public.trip_members for select using (public.is_trip_member(trip_id));
create policy "owner adds self" on public.trip_members for insert with check (
  user_id = auth.uid() and exists (select 1 from public.trips t where t.id = trip_id and t.owner = auth.uid())
);
create policy "leave trip" on public.trip_members for delete using (user_id = auth.uid());

-- Join with a 6-letter code: adds you as a member and to the trip's member list.
create or replace function public.join_trip(p_code text, p_name text, p_passport text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare t trips; mid text;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  select * into t from trips where code = upper(p_code);
  if not found then return null; end if;
  if exists (select 1 from trip_members where trip_id = t.id and user_id = auth.uid()) or t.owner = auth.uid() then
    return t.data || jsonb_build_object('id', t.id);
  end if;
  mid := gen_random_uuid()::text;
  insert into trip_members (trip_id, user_id, member_id) values (t.id, auth.uid(), mid);
  update trips set
    data = jsonb_set(data, '{members}', coalesce(data->'members', '[]'::jsonb) || jsonb_build_array(jsonb_build_object(
      'id', mid, 'name', left(coalesce(nullif(p_name, ''), 'Traveller'), 40), 'passport', upper(left(p_passport, 2)), 'userId', auth.uid(), 'role', 'member'))),
    updated_at = now()
  where id = t.id returning * into t;
  return t.data || jsonb_build_object('id', t.id);
end $$;
revoke all on function public.join_trip(text, text, text) from public;
grant execute on function public.join_trip(text, text, text) to authenticated;

-- Sealed votes: each person sees only their own vote...
create table if not exists public.trip_votes (
  trip_id uuid not null references public.trips on delete cascade,
  proposal_id text not null,
  user_id uuid not null references auth.users on delete cascade,
  choice text not null check (choice in ('yes','no','abstain')),
  updated_at timestamptz not null default now(),
  primary key (trip_id, proposal_id, user_id)
);
alter table public.trip_votes enable row level security;
create policy "see own vote" on public.trip_votes for select using (user_id = auth.uid());
create policy "cast own vote" on public.trip_votes for insert with check (user_id = auth.uid() and public.is_trip_member(trip_id));
create policy "change own vote" on public.trip_votes for update using (user_id = auth.uid());

-- ...and totals appear only once a vote is unsealed, past its deadline, or revealed by the organiser.
create or replace function public.trip_vote_results(p_trip uuid)
returns table (proposal_id text, yes int, no int, abstain int)
language sql security definer stable set search_path = public as $$
  select v.proposal_id,
         count(*) filter (where v.choice = 'yes')::int,
         count(*) filter (where v.choice = 'no')::int,
         count(*) filter (where v.choice = 'abstain')::int
  from trip_votes v
  join trips t on t.id = v.trip_id
  cross join lateral (select p from jsonb_array_elements(t.data->'proposals') p where p->>'id' = v.proposal_id) pr
  where v.trip_id = p_trip
    and (t.owner = auth.uid() or exists (select 1 from trip_members m where m.trip_id = p_trip and m.user_id = auth.uid()))
    and (
      coalesce((pr.p->>'sealed')::boolean, false) = false
      or coalesce((pr.p->>'revealed')::boolean, false)
      or (pr.p->>'deadline' is not null and (pr.p->>'deadline')::timestamptz <= now())
    )
  group by v.proposal_id;
$$;
grant execute on function public.trip_vote_results(uuid) to authenticated;

-- Live updates for group trips: Database → Replication → enable `trips` (or run the line below).
-- alter publication supabase_realtime add table public.trips;

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
