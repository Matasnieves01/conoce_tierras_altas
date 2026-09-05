drop policy if exists "Clients can upload payment receipts" on storage.objects;

create policy "Clients can upload payment receipts"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'payment-receipts');
