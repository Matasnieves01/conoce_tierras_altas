create or replace function public.get_booked_dates()
returns table (reservation_date date)
language sql
security definer
set search_path = public
stable
as $$
  select r.reservation_date
  from public.reservations r
  where r.status in ('pendiente', 'aprobado')
  group by r.reservation_date
  order by r.reservation_date;
$$;

grant execute on function public.get_booked_dates() to anon, authenticated;

alter table public.reservations
  alter column package_id type text using package_id::text;

alter table public.reservations
  drop constraint if exists reservations_package_id_fkey;

alter table public.reservations
  add constraint reservations_package_id_fkey
  foreign key (package_id) references public.packages(id)
  on update cascade
  on delete restrict;
