alter table public.reservations
  drop constraint if exists reservations_status_check;

alter table public.reservations
  add constraint reservations_status_check
  check (status in ('pendiente', 'aprobado', 'rechazado', 'cancelado', 'completado'));

create unique index if not exists one_active_reservation_per_day
  on public.reservations (reservation_date)
  where status in ('pendiente', 'aprobado');
