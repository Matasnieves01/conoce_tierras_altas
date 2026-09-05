alter table public.reservations
  add column if not exists receipt_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'payment-receipts',
  'payment-receipts',
  false,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 1048576,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Clients can upload payment receipts" on storage.objects;
drop policy if exists "Admins can read payment receipts" on storage.objects;
drop policy if exists "Admins can delete payment receipts" on storage.objects;

create policy "Clients can upload payment receipts"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'payment-receipts');

create policy "Admins can read payment receipts"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'payment-receipts' and public.is_admin());

create policy "Admins can delete payment receipts"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'payment-receipts' and public.is_admin());