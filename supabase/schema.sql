create table if not exists public.bjsnake_control (
  id int primary key default 1 check (id = 1),
  paused boolean not null default false,
  start_blocked boolean not null default false,
  message text not null default '' check (char_length(message) <= 200),
  end_all_at timestamptz,
  move_delay int not null default 180 check (move_delay between 60 and 600),
  spawn_delay int not null default 2000 check (spawn_delay between 250 and 20000),
  spawn_chance real not null default 0.8 check (spawn_chance between 0 and 1),
  waiting_screen boolean not null default true,
  question_chance real not null default 0 check (question_chance between 0 and 1),
  weird_chance real not null default 0.1 check (weird_chance between 0 and 1),
  eyes_up boolean not null default false,
  show_leaderboard boolean not null default true,
  slide int not null default 0 check (slide between 0 and 500),
  step int not null default 0 check (step between 0 and 50),
  timer_end timestamptz,
  timer_total int not null default 0,
  data_epoch bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.bjsnake_control (id) values (1) on conflict (id) do nothing;

alter table public.bjsnake_control enable row level security;

drop policy if exists "Anyone can read game control" on public.bjsnake_control;
create policy "Anyone can read game control"
  on public.bjsnake_control for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.bjsnake_control from anon, authenticated;
grant select on public.bjsnake_control to anon, authenticated;

create table if not exists public.bjsnake_players (
  id uuid primary key,
  secret text not null,
  name text not null default '',
  status text not null default 'watching',
  best int not null default 0,
  q_asked int not null default 0,
  q_correct int not null default 0,
  q_wrong int not null default 0,
  q_weird int not null default 0,
  exp_spawned int not null default 0,
  exp_ms int not null default 0,
  created_at timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.bjsnake_votes (
  player_id uuid not null references public.bjsnake_players(id) on delete cascade,
  poll text not null,
  choice int not null,
  updated_at timestamptz not null default now(),
  primary key (player_id, poll)
);

alter table public.bjsnake_players enable row level security;
alter table public.bjsnake_votes enable row level security;
revoke all on public.bjsnake_players from anon, authenticated;
revoke all on public.bjsnake_votes from anon, authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bjsnake_control'
  ) then
    alter publication supabase_realtime add table public.bjsnake_control;
  end if;
end $$;
