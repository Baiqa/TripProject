begin;
select plan(11);

-- Фикстуры: четыре пользователя auth.users -> триггер handle_new_user создаёт profiles.
insert into auth.users (id, email, raw_user_meta_data) values
  ('11111111-1111-1111-1111-111111111111', 'organizer@test.local', '{"display_name": "Organizer"}'),
  ('22222222-2222-2222-2222-222222222222', 'member@test.local', '{"display_name": "Member"}'),
  ('33333333-3333-3333-3333-333333333333', 'observer@test.local', '{"display_name": "Observer"}'),
  ('44444444-4444-4444-4444-444444444444', 'outsider@test.local', '{"display_name": "Outsider"}');

select is(
  (select count(*)::int from public.profiles),
  4,
  'триггер handle_new_user создал 4 профиля из auth.users'
);

-- Поездку и первую строку trip_members (организатор) создаём от имени
-- postgres (owner таблиц), чтобы не зависеть от RLS на этапе подготовки фикстур.
insert into public.trips (id, title, start_date, end_date, created_by) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Турция', '2026-06-01', '2026-06-10',
   '11111111-1111-1111-1111-111111111111');

insert into public.trip_members (trip_id, user_id, role) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'organizer'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'member'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333', 'observer');

-- ===== участник (member) видит поездку =====
set local role authenticated;
set local request.jwt.claim.sub = '22222222-2222-2222-2222-222222222222';

select is(
  (select count(*)::int from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  1,
  'участник поездки видит её в trips'
);

select is(
  (select count(*)::int from public.trip_members where trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  3,
  'участник видит всех участников поездки'
);

reset role;

-- ===== посторонний (outsider) не видит поездку =====
set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-4444-444444444444';

select is(
  (select count(*)::int from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0,
  'посторонний не видит поездку в trips'
);

select is(
  (select count(*)::int from public.trip_members where trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  0,
  'посторонний не видит участников поездки'
);

select throws_ok(
  $$ insert into public.trip_members (trip_id, user_id, role)
     values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'organizer') $$,
  '42501',
  'new row violates row-level security policy for table "trip_members"',
  'посторонний не может сам добавить себя в чужую поездку'
);

reset role;

-- ===== наблюдатель (observer) не может писать =====
set local role authenticated;
set local request.jwt.claim.sub = '33333333-3333-3333-3333-333333333333';

update public.trips set title = 'Hacked'
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

select is(
  (select title from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'Турция',
  'наблюдатель не может изменить поездку (RLS молча не даёт строк на update)'
);

update public.trip_members set role = 'organizer'
  where trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    and user_id = '33333333-3333-3333-3333-333333333333';

select is(
  (select role from public.trip_members
   where trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
     and user_id = '33333333-3333-3333-3333-333333333333'),
  'observer',
  'наблюдатель не может сам себе назначить роль организатора'
);

reset role;

-- ===== организатор может писать =====
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-1111-1111-111111111111';

update public.trips set title = 'Турция (обновлено)'
  where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

select is(
  (select title from public.trips where id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  'Турция (обновлено)',
  'организатор может изменить название поездки'
);

insert into public.trip_members (trip_id, user_id, role)
  values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '44444444-4444-4444-4444-444444444444', 'member');

select is(
  (select count(*)::int from public.trip_members where trip_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  4,
  'организатор может добавить нового участника'
);

reset role;

-- ===== bootstrap: создатель новой поездки сам становится организатором =====
set local role authenticated;
set local request.jwt.claim.sub = '44444444-4444-4444-4444-444444444444';

insert into public.trips (id, title, start_date, end_date, created_by) values
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Казахстан', '2026-07-01', '2026-07-05',
   '44444444-4444-4444-4444-444444444444');

insert into public.trip_members (trip_id, user_id, role)
  values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'organizer');

select is(
  (select role from public.trip_members
   where trip_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
     and user_id = '44444444-4444-4444-4444-444444444444'),
  'organizer',
  'создатель новой поездки может вставить себя как организатора (bootstrap)'
);

reset role;

select * from finish();
rollback;
