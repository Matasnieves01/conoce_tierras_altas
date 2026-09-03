alter table public.reservations enable row level security;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

drop policy if exists "Public can create reservations" on public.reservations;
drop policy if exists "Public can read reservations" on public.reservations;
drop policy if exists "Public can update reservations" on public.reservations;
drop policy if exists "Public can delete reservations" on public.reservations;
drop policy if exists "Clients can create reservations" on public.reservations;
drop policy if exists "Admin can read reservations" on public.reservations;
drop policy if exists "Admin can update reservations" on public.reservations;
drop policy if exists "Admin can delete reservations" on public.reservations;

create policy "Clients can create reservations"
  on public.reservations for insert
  to anon
  with check (status = 'pendiente');

create policy "Admin can read reservations"
  on public.reservations for select
  to authenticated
  using (public.is_admin());

create policy "Admin can update reservations"
  on public.reservations for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete reservations"
  on public.reservations for delete
  to authenticated
  using (public.is_admin());

create unique index if not exists one_active_reservation_per_day
  on public.reservations (reservation_date)
  where status in ('pendiente', 'aprobado');