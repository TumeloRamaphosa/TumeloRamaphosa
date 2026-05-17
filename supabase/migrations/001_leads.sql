-- LAISA — leads, waitlist & auth-ready profiles
create extension if not exists "uuid-ossp";

-- Inbound leads (Book a walkthrough)
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  message text,
  source text not null default 'laisa',
  status text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  created_at timestamptz not null default now()
);
create index if not exists idx_leads_created on leads(created_at desc);
create index if not exists idx_leads_source on leads(source);

-- Early-access waitlist
create table if not exists waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  source text not null default 'laisa',
  created_at timestamptz not null default now()
);

-- Profiles for the future client dashboard (auth-ready)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  company text,
  role text not null default 'client',
  created_at timestamptz not null default now()
);

alter table leads enable row level security;
alter table waitlist enable row level security;
alter table profiles enable row level security;

-- Anonymous visitors may submit a lead / join the waitlist (insert only).
create policy "Anyone can submit a lead" on leads
  for insert with check (true);
create policy "Anyone can join the waitlist" on waitlist
  for insert with check (true);

-- Leads/waitlist are readable only via the service role (bypasses RLS),
-- so no select policy is granted to anon/authenticated on purpose.

-- A signed-in user can read & update only their own profile.
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row on signup.
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, company)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'company')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
