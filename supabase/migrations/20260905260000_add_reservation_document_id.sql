alter table public.reservations
  add column if not exists document_id text;
