-- Excelior Solutions Services: quote intake and admin dashboard schema.
create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 254),
  phone text check (char_length(phone) <= 40),
  service text not null check (char_length(service) <= 100),
  message text check (char_length(message) <= 2000),
  created_at timestamptz not null default now()
);

alter table public.quote_requests add column if not exists status text not null default 'pending';
alter table public.quote_requests add column if not exists requested_date date;
alter table public.quote_requests add column if not exists requested_time text;
alter table public.quote_requests add column if not exists location text;
alter table public.quote_requests add column if not exists internal_note text;
alter table public.quote_requests add column if not exists updated_at timestamptz not null default now();

alter table public.quote_requests drop constraint if exists quote_requests_status_check;
alter table public.quote_requests add constraint quote_requests_status_check
  check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled'));

create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at desc);
create index if not exists quote_requests_status_idx on public.quote_requests (status);
create index if not exists quote_requests_email_idx on public.quote_requests (lower(email));
alter table public.quote_requests enable row level security;

create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null unique check (char_length(name) <= 100),
  description text not null default '',
  price_label text not null default 'Custom quote',
  image_path text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.service_catalog enable row level security;

insert into public.service_catalog (name, description, price_label, image_path, sort_order)
values
  ('Home cleaning', 'Regular care for the rooms you live in, shaped around your routine and the details that matter to you.', 'Custom quote', '/residential.jpg', 1),
  ('Commercial cleaning', 'A well-kept workplace that feels ready for the people who use it, day after day.', 'Custom quote', '/workspaces.jpg', 2),
  ('Deep cleaning', 'A careful reset for places that need extra attention, including move-in and move-out visits.', 'Custom quote', '/fresh starts.jpg', 3),
  ('Shallow cleaning', 'A practical surface-level refresh for well-maintained spaces and everyday upkeep.', 'Custom quote', '/routine care.jpg', 4),
  ('Post-renovation cleaning', 'A careful clean to clear renovation dust and leave updated rooms ready to enjoy.', 'Custom quote', '/after renovation.jpg', 5),
  ('Floor cleaning and polishing', 'Focused floor care to lift everyday dirt and bring back a smooth, polished finish.', 'Custom quote', '/Floor care.jpg', 6),
  ('Something else', 'Tell us about the service you have in mind and we will prepare a considered quote.', 'Custom quote', null, 7)
on conflict (name) do nothing;

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 120),
  email text,
  phone text,
  role text not null default 'Cleaning professional',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.team_members enable row level security;

create table if not exists public.business_settings (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'Excelior Solution Services',
  business_email text not null default '',
  business_phone text not null default '',
  service_areas text not null default '',
  booking_policy text not null default '',
  email_notifications boolean not null default true,
  updated_at timestamptz not null default now()
);
alter table public.business_settings enable row level security;
insert into public.business_settings (id) values (1) on conflict (id) do nothing;

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

-- No payment processor is currently configured. This table is intentionally not
-- used to mark bookings paid; verified payment integration must write trusted data.
create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid references public.quote_requests(id) on delete set null,
  provider text not null,
  reference text not null unique,
  amount_minor bigint not null check (amount_minor >= 0),
  currency text not null default 'GHS',
  status text not null check (status in ('pending', 'successful', 'failed', 'refunded')),
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.payment_transactions enable row level security;

notify pgrst, 'reload schema';
