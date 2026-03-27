-- ============================================================
-- Introhub Database Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text,
  headline text,
  bio text,
  avatar_url text,
  location text,
  whatsapp text,
  email_contact text,
  social_links jsonb default '{}'::jsonb,
  template_id integer default 1 check (template_id between 1 and 3),
  is_published boolean default false,
  plan text default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  image_url text,
  live_url text,
  github_url text,
  order_index integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- SERVICES TABLE
-- ============================================================
create table public.services (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  price text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- PAGE EVENTS (ANALYTICS)
-- ============================================================
create table public.page_events (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  event_type text not null check (event_type in ('page_view', 'whatsapp_click', 'email_click', 'github_click', 'live_url_click')),
  visitor_id text,
  referrer text,
  created_at timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
create index profiles_username_idx on public.profiles(username);
create index projects_profile_id_idx on public.projects(profile_id);
create index services_profile_id_idx on public.services(profile_id);
create index page_events_profile_id_idx on public.page_events(profile_id);
create index page_events_created_at_idx on public.page_events(created_at);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================================
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter integer := 0;
begin
  -- Generate username from email
  base_username := lower(split_part(new.email, '@', 1));
  base_username := regexp_replace(base_username, '[^a-z0-9_]', '', 'g');
  base_username := substring(base_username, 1, 20);
  final_username := base_username;

  -- Ensure uniqueness
  while exists (select 1 from public.profiles where username = final_username) loop
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (id, username, email_contact)
  values (new.id, final_username, new.email);

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using (is_published = true or auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Projects
alter table public.projects enable row level security;

create policy "Projects are viewable if profile is published or owner"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = projects.profile_id
      and (profiles.is_published = true or profiles.id = auth.uid())
    )
  );

create policy "Users can manage their own projects"
  on public.projects for all
  using (profile_id = auth.uid());

-- Services
alter table public.services enable row level security;

create policy "Services are viewable if profile is published or owner"
  on public.services for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = services.profile_id
      and (profiles.is_published = true or profiles.id = auth.uid())
    )
  );

create policy "Users can manage their own services"
  on public.services for all
  using (profile_id = auth.uid());

-- Page Events
alter table public.page_events enable row level security;

create policy "Anyone can insert page events"
  on public.page_events for insert
  with check (true);

create policy "Users can view their own page events"
  on public.page_events for select
  using (profile_id = auth.uid());

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Project images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'project-images');

create policy "Users can upload their own project images"
  on storage.objects for insert
  with check (bucket_id = 'project-images' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update their own project images"
  on storage.objects for update
  using (bucket_id = 'project-images' and auth.uid()::text = (storage.foldername(name))[1]);
