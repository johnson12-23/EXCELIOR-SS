-- Run this migration in the Supabase SQL Editor to enable the website contact inbox.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  topic text not null check (topic in ('general', 'website', 'feedback', 'other')),
  message text not null check (char_length(message) between 1 and 3000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
alter table public.contact_messages enable row level security;
notify pgrst, 'reload schema';
