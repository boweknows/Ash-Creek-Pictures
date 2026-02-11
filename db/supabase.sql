-- Ash Creek Career OS schema + RLS
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('doc', 'narrative', 'career', 'admin')),
  status text not null default 'active' check (status in ('active', 'paused', 'done')),
  priority int not null default 2 check (priority between 1 and 3),
  next_action text not null,
  due_date date,
  tags text[],
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  category text not null check (category in ('ship', 'network', 'create', 'admin')),
  status text not null default 'todo' check (status in ('todo', 'done')),
  due_date date,
  week_start date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  shipped_text text,
  blocked_text text,
  tomorrow_first_move text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create table if not exists public.sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  duration_minutes int not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  org text,
  role text,
  email text,
  tags text[],
  last_contacted_at date,
  next_followup_at date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  film_title text not null,
  festival_name text not null,
  deadline date,
  status text not null default 'planned' check (status in ('planned', 'submitted', 'accepted', 'rejected')),
  submission_fee numeric,
  submission_date date,
  notes text,
  filmfreeway_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.weekly_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start date not null,
  deliverable text not null,
  outreach_target_1 text,
  outreach_target_2 text,
  ship_target int not null default 1,
  network_target int not null default 2,
  create_target int not null default 3,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_user_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- attach helper triggers
create trigger set_user_id_projects before insert on public.projects for each row execute procedure public.set_user_id();
create trigger set_user_id_tasks before insert on public.tasks for each row execute procedure public.set_user_id();
create trigger set_user_id_daily_checkins before insert on public.daily_checkins for each row execute procedure public.set_user_id();
create trigger set_user_id_sprints before insert on public.sprints for each row execute procedure public.set_user_id();
create trigger set_user_id_contacts before insert on public.contacts for each row execute procedure public.set_user_id();
create trigger set_user_id_submissions before insert on public.submissions for each row execute procedure public.set_user_id();
create trigger set_user_id_weekly_plans before insert on public.weekly_plans for each row execute procedure public.set_user_id();

create trigger touch_projects before update on public.projects for each row execute procedure public.touch_updated_at();
create trigger touch_tasks before update on public.tasks for each row execute procedure public.touch_updated_at();
create trigger touch_contacts before update on public.contacts for each row execute procedure public.touch_updated_at();
create trigger touch_submissions before update on public.submissions for each row execute procedure public.touch_updated_at();
create trigger touch_weekly_plans before update on public.weekly_plans for each row execute procedure public.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.daily_checkins enable row level security;
alter table public.sprints enable row level security;
alter table public.contacts enable row level security;
alter table public.submissions enable row level security;
alter table public.weekly_plans enable row level security;

create policy "profiles owner read" on public.profiles for select using (id = auth.uid());
create policy "profiles owner update" on public.profiles for update using (id = auth.uid());

create policy "projects own rows" on public.projects for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "tasks own rows" on public.tasks for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_checkins own rows" on public.daily_checkins for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "sprints own rows" on public.sprints for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "contacts own rows" on public.contacts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "submissions own rows" on public.submissions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weekly_plans own rows" on public.weekly_plans for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create or replace function public.seed_demo_data()
returns void
language plpgsql
security definer
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Must be authenticated';
  end if;

  insert into public.projects (user_id, name, type, status, priority, next_action, tags)
  values
    (uid, 'Alpha Station Short', 'narrative', 'active', 1, 'Lock cut for festival screeners', array['film','urgent']),
    (uid, 'Mountain Voices Doc', 'doc', 'active', 2, 'Schedule rough cut feedback call', array['doc']),
    (uid, 'Career Pipeline', 'career', 'active', 2, 'Send one intro email to producer', array['network'])
  on conflict do nothing;

  insert into public.tasks (user_id, title, category, status, due_date)
  values
    (uid, 'Export teaser and upload v2', 'ship', 'todo', current_date),
    (uid, 'Ping editor for coffee chat', 'network', 'todo', current_date),
    (uid, 'Write 20 minutes of Act 2', 'create', 'todo', current_date)
  on conflict do nothing;
end;
$$;
