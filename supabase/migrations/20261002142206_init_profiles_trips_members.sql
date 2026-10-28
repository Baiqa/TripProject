-- Этап 1 (Основа): profiles, trips, trip_members + RLS-функции членства.
-- Схема соответствует docs/er-diagram.md.

-- ===== profiles =====

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_authenticated" on public.profiles
  for select
  to authenticated
  using (true);

create policy "profiles_insert_self" on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

create policy "profiles_update_self" on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- AUTH-04: отображаемое имя обязательно и приходит из данных регистрации
-- (raw_user_meta_data.display_name), профиль создаётся автоматически.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ===== trips =====

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 100),
  description text check (char_length(description) <= 1000),
  start_date date not null,
  end_date date not null,
  base_currency text not null default 'KZT',
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now(),
  constraint trips_end_after_start check (end_date >= start_date)
);

alter table public.trips enable row level security;

-- ===== trip_members =====

create table public.trip_members (
  trip_id uuid not null references public.trips (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('organizer', 'member', 'observer')),
  status text not null default 'active' check (status in ('active', 'left')),
  joined_at timestamptz not null default now(),
  primary key (trip_id, user_id)
);

alter table public.trip_members enable row level security;

-- ===== RLS helper-функции (security definer, чтобы не рекурсировать политики) =====

create function public.is_trip_member(_trip_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.trip_members tm
    where tm.trip_id = _trip_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
  );
$$;

create function public.trip_role(_trip_id uuid)
returns text
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select tm.role
  from public.trip_members tm
  where tm.trip_id = _trip_id
    and tm.user_id = auth.uid()
    and tm.status = 'active';
$$;

-- ===== политики trips =====

-- created_by = auth.uid() добавлено, чтобы создатель видел свою поездку
-- до того, как появится первая строка trip_members (иначе bootstrap-вставка
-- организатора невозможна: EXISTS-проверка в политике trip_members ниже
-- тоже идёт через RLS и иначе не увидит свежесозданную поездку).
create policy "trips_select_members" on public.trips
  for select
  to authenticated
  using (public.is_trip_member(id) or created_by = auth.uid());

create policy "trips_insert_any_authenticated" on public.trips
  for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "trips_update_organizer" on public.trips
  for update
  to authenticated
  using (public.trip_role(id) = 'organizer')
  with check (public.trip_role(id) = 'organizer');

create policy "trips_delete_organizer" on public.trips
  for delete
  to authenticated
  using (public.trip_role(id) = 'organizer');

-- ===== политики trip_members =====

create policy "trip_members_select_members" on public.trip_members
  for select
  to authenticated
  using (public.is_trip_member(trip_id));

-- Вставка разрешена в двух случаях: создатель поездки добавляет себя
-- организатором (иначе первую строку в пустой trip_members не создать),
-- либо действующий организатор добавляет участника.
create policy "trip_members_insert_organizer_or_bootstrap" on public.trip_members
  for insert
  to authenticated
  with check (
    public.trip_role(trip_id) = 'organizer'
    or (
      user_id = auth.uid()
      and role = 'organizer'
      and exists (
        select 1 from public.trips t
        where t.id = trip_id and t.created_by = auth.uid()
      )
    )
  );

create policy "trip_members_update_organizer" on public.trip_members
  for update
  to authenticated
  using (public.trip_role(trip_id) = 'organizer')
  with check (public.trip_role(trip_id) = 'organizer');

create policy "trip_members_delete_organizer" on public.trip_members
  for delete
  to authenticated
  using (public.trip_role(trip_id) = 'organizer');

-- ===== grants =====
-- RLS-политики ограничивают видимость строк, но доступ к самой таблице
-- нужно выдать явно — для новых таблиц он не наследуется автоматически.
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.trips to authenticated;
grant select, insert, update, delete on public.trip_members to authenticated;
grant execute on function public.is_trip_member(uuid) to authenticated;
grant execute on function public.trip_role(uuid) to authenticated;
