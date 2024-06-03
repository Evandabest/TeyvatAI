# Teyvat AI

## What is this

This is a user to user social media app and AI reccomender.

Some intended features for the first release:

- Users can signup for an account, add friends, and chat with them
- Users can make, like, and comment on posts
- Users can store Artifacts, Characters and Teams
- Users can ask Teyvat's Tinker (AI Chatbot) to make artifact and team reccomendations

Features for the far future:

- Users can chat with Models trained on content creators (Tuonto, Brax, Zyox...)
- Allow anonymous users to chat temporarily
- Users can use their device camera to scan in artifacts
- Mobile app version

## Project Details

This project is built in NextJs using TypeScript. The database for this project is Supabase. This is still a work in progress, but feel free to clone and run it on your own. This project is technically open source but I won't be entertaining pull request/issue fixes just yet. I want to get the core features of the app out first and then work on optimization for the user.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# Setting up Supabase

Go to https://supabase.com and create an account
Start an project and go to the SQL editor

Make a new query and enter the following:

```plpgsql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  updated_at timestamp with time zone,
  username text,
  friends json
);
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check ((select auth.uid()) = id);

create policy "Users can update own profile." on profiles
  for update using ((select auth.uid()) = id);

-- This trigger automatically creates a profile entry when a new user signs up via Supabase Auth.
-- See https://supabase.com/docs/guides/auth/managing-user-data#using-triggers for more details.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

This query will handle new user signups and enter their email and uuid to the profiles table. (There will be more tables that are updated by this trigger soon)

It is very barebones right now so there isn't much to do
