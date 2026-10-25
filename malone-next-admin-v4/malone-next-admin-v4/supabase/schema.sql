create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  location text,
  budget text,
  property_address text,
  timeline text,
  notes text
);
