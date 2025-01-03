-- Drop existing table if exists
drop table if exists public.profiles;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  type text not null check (type in ('client', 'barbershop')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
on profiles for select
using ( true );

create policy "Users can insert their own profile"
on profiles for insert
with check ( auth.uid() = id );

create policy "Users can update own profile"
on profiles for update using (
  auth.uid() = id
);

-- Set up triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at(); 