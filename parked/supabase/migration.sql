-- FFB Hub Database Schema
-- Run this in the Supabase SQL Editor to set up all tables

-- ── User Profiles ──
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  trust_level text not null default 'new' check (trust_level in ('new', 'trusted', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── FFB Profiles (community uploads) ──
create table public.ffb_profiles (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  game_slug text not null,
  wheelbase_slug text not null,
  vendor_slug text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  vendor_settings jsonb default '{}',
  ingame_settings jsonb default '{}',
  config_file_url text,
  config_file_name text,
  difficulty text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  driving_style text check (driving_style in ('Smooth', 'Aggressive', 'Drift', 'All-around')),
  notes text,
  download_count integer not null default 0,
  avg_rating numeric(3,2) not null default 0,
  rating_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Profile Ratings ──
create table public.profile_ratings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.ffb_profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  created_at timestamptz not null default now(),
  unique(profile_id, user_id)
);

-- ── Profile Comments ──
create table public.profile_comments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.ffb_profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  is_edited boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Profile Downloads ──
create table public.profile_downloads (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.ffb_profiles(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  downloaded_at timestamptz not null default now()
);

-- ── Profile Favorites ──
create table public.profile_favorites (
  profile_id uuid not null references public.ffb_profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, user_id)
);

-- ── Indexes ──
create index idx_ffb_profiles_game on public.ffb_profiles(game_slug);
create index idx_ffb_profiles_wheelbase on public.ffb_profiles(wheelbase_slug);
create index idx_ffb_profiles_vendor on public.ffb_profiles(vendor_slug);
create index idx_ffb_profiles_status on public.ffb_profiles(status);
create index idx_ffb_profiles_author on public.ffb_profiles(author_id);
create index idx_ffb_profiles_rating on public.ffb_profiles(avg_rating desc);
create index idx_ffb_profiles_downloads on public.ffb_profiles(download_count desc);
create index idx_profile_ratings_profile on public.profile_ratings(profile_id);
create index idx_profile_comments_profile on public.profile_comments(profile_id);

-- ── Functions ──

-- Auto-set status based on trust level
create or replace function public.set_profile_status()
returns trigger as $$
begin
  if exists (
    select 1 from public.profiles
    where id = new.author_id and trust_level in ('trusted', 'admin')
  ) then
    new.status := 'approved';
  else
    new.status := 'pending';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_ffb_profile_insert
  before insert on public.ffb_profiles
  for each row execute function public.set_profile_status();

-- Update avg_rating when ratings change
create or replace function public.update_profile_rating()
returns trigger as $$
declare
  target_id uuid;
begin
  target_id := coalesce(new.profile_id, old.profile_id);
  update public.ffb_profiles
  set
    avg_rating = coalesce((select avg(rating)::numeric(3,2) from public.profile_ratings where profile_id = target_id), 0),
    rating_count = (select count(*) from public.profile_ratings where profile_id = target_id)
  where id = target_id;
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

create trigger on_rating_change
  after insert or update or delete on public.profile_ratings
  for each row execute function public.update_profile_rating();

-- Increment download count
create or replace function public.increment_download_count()
returns trigger as $$
begin
  update public.ffb_profiles
  set download_count = download_count + 1
  where id = new.profile_id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_download_insert
  after insert on public.profile_downloads
  for each row execute function public.increment_download_count();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'preferred_username', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.ffb_profiles
  for each row execute function public.update_updated_at();
create trigger set_updated_at before update on public.profile_comments
  for each row execute function public.update_updated_at();

-- ── Row Level Security ──

alter table public.profiles enable row level security;
alter table public.ffb_profiles enable row level security;
alter table public.profile_ratings enable row level security;
alter table public.profile_comments enable row level security;
alter table public.profile_downloads enable row level security;
alter table public.profile_favorites enable row level security;

-- Profiles
create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- FFB Profiles
create policy "Approved profiles are viewable by everyone"
  on public.ffb_profiles for select using (status = 'approved' or author_id = auth.uid());
create policy "Admins can view all profiles"
  on public.ffb_profiles for select using (
    exists (select 1 from public.profiles where id = auth.uid() and trust_level = 'admin')
  );
create policy "Authenticated users can create profiles"
  on public.ffb_profiles for insert with check (auth.uid() = author_id);
create policy "Users can update their own profiles"
  on public.ffb_profiles for update using (author_id = auth.uid());
create policy "Admins can update any profile"
  on public.ffb_profiles for update using (
    exists (select 1 from public.profiles where id = auth.uid() and trust_level = 'admin')
  );
create policy "Users can delete their own profiles"
  on public.ffb_profiles for delete using (author_id = auth.uid());

-- Ratings
create policy "Ratings are viewable by everyone"
  on public.profile_ratings for select using (true);
create policy "Authenticated users can rate"
  on public.profile_ratings for insert with check (auth.uid() = user_id);
create policy "Users can update their own rating"
  on public.profile_ratings for update using (auth.uid() = user_id);
create policy "Users can delete their own rating"
  on public.profile_ratings for delete using (auth.uid() = user_id);

-- Comments
create policy "Comments are viewable by everyone"
  on public.profile_comments for select using (true);
create policy "Authenticated users can comment"
  on public.profile_comments for insert with check (auth.uid() = user_id);
create policy "Users can update their own comments"
  on public.profile_comments for update using (auth.uid() = user_id);
create policy "Users can delete their own comments"
  on public.profile_comments for delete using (auth.uid() = user_id);

-- Downloads
create policy "Downloads are viewable by profile author"
  on public.profile_downloads for select using (
    exists (select 1 from public.ffb_profiles where id = profile_id and author_id = auth.uid())
  );
create policy "Anyone can record a download"
  on public.profile_downloads for insert with check (true);

-- Favorites
create policy "Users can view their own favorites"
  on public.profile_favorites for select using (auth.uid() = user_id);
create policy "Users can add favorites"
  on public.profile_favorites for insert with check (auth.uid() = user_id);
create policy "Users can remove favorites"
  on public.profile_favorites for delete using (auth.uid() = user_id);

-- ── Storage ──
-- Run this separately in Supabase dashboard or via API:
-- Create bucket: profile-files (public: true, file size limit: 5MB)
-- Allowed MIME types: application/json, text/xml, text/plain, application/xml
