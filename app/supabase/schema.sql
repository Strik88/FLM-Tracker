-- Enable required extension for UUID generation
create extension if not exists "pgcrypto";

-- profiles
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles
  for select using (user_id = auth.uid());
create policy "profiles_insert_own" on public.profiles
  for insert with check (user_id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update using (user_id = auth.uid());

-- metascripts
create table if not exists public.metascripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date timestamptz not null default now(),
  scan1 text,
  scan2 text,
  scan3 text,
  heart_shift text,
  head_shift_options text,
  head_shift_resonant text,
  hat_shift_identity text,
  hat_shift_wisdom text,
  integration_action text,
  integration_embodiment text,
  duration_minutes int,
  created_at timestamptz default now()
);

alter table public.metascripts enable row level security;
create policy "metascripts_select_own" on public.metascripts
  for select using (user_id = auth.uid());
create policy "metascripts_insert_own" on public.metascripts
  for insert with check (user_id = auth.uid());
create policy "metascripts_update_own" on public.metascripts
  for update using (user_id = auth.uid());
create policy "metascripts_delete_own" on public.metascripts
  for delete using (user_id = auth.uid());

-- scopes
create table if not exists public.scopes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date timestamptz default now(),
  apex_vision text,
  apex_resonance int,
  quarterly_goals text[],
  week_priorities text[],
  time_blocks jsonb,
  daily_focus jsonb,
  daily_energy int,
  created_at timestamptz default now()
);

alter table public.scopes enable row level security;
create policy "scopes_select_own" on public.scopes
  for select using (user_id = auth.uid());
create policy "scopes_insert_own" on public.scopes
  for insert with check (user_id = auth.uid());
create policy "scopes_update_own" on public.scopes
  for update using (user_id = auth.uid());
create policy "scopes_delete_own" on public.scopes
  for delete using (user_id = auth.uid());

-- habits
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  kind text check (kind in ('hardline','mainline')),
  icon text,
  created_at timestamptz default now()
);

alter table public.habits enable row level security;
create policy "habits_select_own" on public.habits
  for select using (user_id = auth.uid());
create policy "habits_insert_own" on public.habits
  for insert with check (user_id = auth.uid());
create policy "habits_update_own" on public.habits
  for update using (user_id = auth.uid());
create policy "habits_delete_own" on public.habits
  for delete using (user_id = auth.uid());

-- habit_logs
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  date date not null,
  status text check (status in ('checked','missed','not_checked')),
  created_at timestamptz default now(),
  unique (user_id, habit_id, date)
);

alter table public.habit_logs enable row level security;
create policy "habit_logs_select_own" on public.habit_logs
  for select using (user_id = auth.uid());
create policy "habit_logs_insert_own" on public.habit_logs
  for insert with check (user_id = auth.uid());
create policy "habit_logs_update_own" on public.habit_logs
  for update using (user_id = auth.uid());
create policy "habit_logs_delete_own" on public.habit_logs
  for delete using (user_id = auth.uid());

-- weekly_reviews
create table if not exists public.weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week int not null,
  year int not null,
  resonance int,
  fields jsonb,
  created_at timestamptz default now(),
  unique (user_id, week, year)
);

alter table public.weekly_reviews enable row level security;
create policy "weekly_reviews_select_own" on public.weekly_reviews
  for select using (user_id = auth.uid());
create policy "weekly_reviews_insert_own" on public.weekly_reviews
  for insert with check (user_id = auth.uid());
create policy "weekly_reviews_update_own" on public.weekly_reviews
  for update using (user_id = auth.uid());
create policy "weekly_reviews_delete_own" on public.weekly_reviews
  for delete using (user_id = auth.uid());
