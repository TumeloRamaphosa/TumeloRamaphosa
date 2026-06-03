-- ============================================================
-- Aviar VIP — initial schema
-- Run with: supabase db push   (or paste into the SQL editor)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Enums ----------
create type user_role as enum ('rider', 'driver', 'vip_agent');
create type vip_tier as enum ('member', 'gold', 'platinum', 'sovereign');
create type service_level as enum ('executive', 'first_class', 'sovereign');
create type ride_status as enum (
  'requested', 'accepted', 'arriving', 'in_progress',
  'arrived_airport', 'vip_handover', 'completed', 'cancelled'
);
create type handover_step as enum (
  'pending', 'met_at_curb', 'baggage_assist', 'fast_track_security',
  'lounge', 'boarding_walk', 'at_aircraft', 'complete'
);
create type payment_status as enum (
  'pending', 'authorized', 'paid', 'failed', 'refunded'
);

-- ---------- Profiles ----------
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'rider',
  full_name   text not null default '',
  phone       text,
  avatar_url  text,
  vip_tier    vip_tier not null default 'member',
  created_at  timestamptz not null default now()
);

-- ---------- Driver profiles ----------
create table driver_profiles (
  id               uuid primary key references profiles(id) on delete cascade,
  vehicle_make     text not null,
  vehicle_model    text not null,
  vehicle_color    text not null,
  plate            text not null,
  rating           numeric(3,2) not null default 5.00,
  trips_completed  int not null default 0,
  is_online        boolean not null default false,
  lat              double precision,
  lng              double precision,
  updated_at       timestamptz not null default now()
);

-- ---------- Rides ----------
create table rides (
  id             uuid primary key default gen_random_uuid(),
  rider_id       uuid not null references profiles(id) on delete cascade,
  driver_id      uuid references profiles(id),
  agent_id       uuid references profiles(id),
  status         ride_status not null default 'requested',
  service_level  service_level not null,
  pickup         jsonb not null,        -- { label, address, lat, lng }
  destination    jsonb not null,        -- airport terminal
  airport_code   text not null default 'JNB',
  terminal       text,
  airline        text,
  flight_number  text,
  scheduled_at   timestamptz,
  distance_km    numeric(6,2) not null default 0,
  fare_zar       numeric(10,2) not null default 0,
  eta_minutes    int not null default 0,
  payment_id     uuid,
  created_at     timestamptz not null default now()
);
create index rides_rider_idx on rides(rider_id);
create index rides_driver_idx on rides(driver_id);
create index rides_status_idx on rides(status);

-- ---------- VIP hand-offs ----------
create table vip_handovers (
  id             uuid primary key default gen_random_uuid(),
  ride_id        uuid not null references rides(id) on delete cascade,
  agent_id       uuid references profiles(id),
  agent_name     text,
  step           handover_step not null default 'pending',
  waypoint_index int not null default 0,
  notes          text,
  updated_at     timestamptz not null default now()
);
create index handovers_ride_idx on vip_handovers(ride_id);

-- ---------- Payments (Stitch) ----------
create table payments (
  id                uuid primary key default gen_random_uuid(),
  ride_id           uuid not null references rides(id) on delete cascade,
  amount_zar        numeric(10,2) not null,
  currency          text not null default 'ZAR',
  provider          text not null default 'stitch',
  status            payment_status not null default 'pending',
  stitch_payment_id text,
  checkout_url      text,
  created_at        timestamptz not null default now()
);
create index payments_ride_idx on payments(ride_id);

alter table rides
  add constraint rides_payment_fk
  foreign key (payment_id) references payments(id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table profiles        enable row level security;
alter table driver_profiles enable row level security;
alter table rides           enable row level security;
alter table vip_handovers   enable row level security;
alter table payments        enable row level security;

-- Profiles: a user manages their own row; everyone can read basic profiles.
create policy "profiles readable" on profiles for select using (true);
create policy "profiles self upsert" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles self update" on profiles
  for update using (auth.uid() = id);

-- Driver profiles: the driver manages their own; readable by all (for matching).
create policy "driver profiles readable" on driver_profiles for select using (true);
create policy "driver self manage" on driver_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- Rides: visible to the rider, the assigned driver, or the assigned agent.
create policy "rides participant read" on rides for select using (
  auth.uid() = rider_id or auth.uid() = driver_id or auth.uid() = agent_id
);
create policy "rides rider insert" on rides
  for insert with check (auth.uid() = rider_id);
create policy "rides participant update" on rides for update using (
  auth.uid() = rider_id or auth.uid() = driver_id or auth.uid() = agent_id
);

-- Hand-offs: visible/editable by ride participants.
create policy "handover participant read" on vip_handovers for select using (
  exists (
    select 1 from rides r
    where r.id = ride_id
      and (auth.uid() = r.rider_id or auth.uid() = r.driver_id or auth.uid() = r.agent_id)
  )
);
create policy "handover agent update" on vip_handovers for update using (
  exists (
    select 1 from rides r
    where r.id = ride_id
      and (auth.uid() = r.driver_id or auth.uid() = r.agent_id)
  )
);

-- Payments: readable by the paying rider. Writes happen via the service role
-- (Edge Function), which bypasses RLS.
create policy "payments rider read" on payments for select using (
  exists (
    select 1 from rides r where r.id = ride_id and auth.uid() = r.rider_id
  )
);

-- ============================================================
-- New-user trigger: create a profile row automatically.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
