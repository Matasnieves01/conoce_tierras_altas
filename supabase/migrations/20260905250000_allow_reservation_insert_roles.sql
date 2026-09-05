drop policy if exists "Clients can create reservations" on public.reservations;

create policy "Clients can create reservations"
  on public.reservations for insert
  to anon, authenticated
  with check (status = 'pendiente');
