create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 40),
  service text not null check (char_length(service) <= 100),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.quote_requests enable row level security;
-- Requests are inserted by the server API using a service-role key.
-- Do not expose that key in NEXT_PUBLIC_* variables.

notify pgrst, 'reload schema';

