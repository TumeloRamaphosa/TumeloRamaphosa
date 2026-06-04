-- ============================================================
-- Aviar VIP — invite-only access (Phase 1)
-- ============================================================

create table if not exists invite_codes (
  code         text primary key,
  note         text,                       -- who/what this invite is for
  created_by   uuid references profiles(id),
  redeemed_by  uuid references profiles(id),
  redeemed_at  timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists invite_codes_unredeemed_idx
  on invite_codes (code) where redeemed_at is null;

alter table invite_codes enable row level security;

-- Anyone can check a code's validity during onboarding (read-only).
-- Redemption is performed by an authenticated user updating their own claim.
create policy "invite codes readable" on invite_codes for select using (true);
create policy "invite codes redeem" on invite_codes
  for update using (redeemed_at is null)
  with check (auth.uid() = redeemed_by);

-- Seed a few showcase codes (remove in production).
insert into invite_codes (code, note) values
  ('AVIAR-VIP', 'Showcase invite'),
  ('SOVEREIGN', 'Showcase invite'),
  ('ORTAMBO',   'Showcase invite')
on conflict (code) do nothing;
