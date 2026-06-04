-- ============================================================
-- Aviar VIP — invite-only access (Phase 1)
--
-- Security model: the invite_codes table is NOT directly readable or writable
-- by clients (RLS on, no permissive policies). All access goes through two
-- SECURITY DEFINER functions so we never expose the code list and redemption
-- is atomic and self-scoped:
--   check_invite(code)  -> boolean   (anon/auth; validity only, no data leak)
--   redeem_invite(code) -> boolean   (auth only; claims the code for auth.uid())
-- ============================================================

create table if not exists invite_codes (
  code         text primary key,
  note         text,
  created_by   uuid references profiles(id),
  redeemed_by  uuid references profiles(id),
  redeemed_at  timestamptz,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists invite_codes_unredeemed_idx
  on invite_codes (code) where redeemed_at is null;

-- RLS on, with NO policies → PostgREST denies all direct client access.
-- (The SECURITY DEFINER functions below bypass RLS in a controlled way.)
alter table invite_codes enable row level security;

-- Validity check: returns true only for an existing, unredeemed, unexpired code.
-- Leaks nothing about other codes and cannot enumerate the table.
create or replace function public.check_invite(p_code text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from invite_codes
    where code = upper(trim(p_code))
      and redeemed_at is null
      and (expires_at is null or expires_at > now())
  );
$$;

-- Atomic redemption: claims the code for the current user. The single UPDATE
-- with the `redeemed_at is null` predicate is race-safe (only one caller wins).
create or replace function public.redeem_invite(p_code text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_rows int;
begin
  if v_uid is null then
    return false; -- must be authenticated to redeem
  end if;
  update invite_codes
     set redeemed_by = v_uid, redeemed_at = now()
   where code = upper(trim(p_code))
     and redeemed_at is null
     and (expires_at is null or expires_at > now());
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

revoke all on function public.check_invite(text) from public;
revoke all on function public.redeem_invite(text) from public;
grant execute on function public.check_invite(text) to anon, authenticated;
grant execute on function public.redeem_invite(text) to authenticated;

-- Seed a few showcase codes (remove in production).
insert into invite_codes (code, note) values
  ('AVIAR-VIP', 'Showcase invite'),
  ('SOVEREIGN', 'Showcase invite'),
  ('ORTAMBO',   'Showcase invite')
on conflict (code) do nothing;
