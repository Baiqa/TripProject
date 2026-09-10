# CLAUDE.md

## Проект

Веб-приложение для совместного планирования сложных групповых путешествий и разделения бюджета. Курсовой проект (сдача — январь 2027), дальше возможно развитие в диплом и портфолио.

Ключевая идея: маршрут состоит из сегментов с разным составом участников, и расходы по умолчанию делятся между участниками сегмента.

Полное ТЗ — `docs/tz.md`. Перед работой над фичей читай соответствующий раздел. Используй ID требований (`EXP-04`, `BR-02`) в коммитах, тестах и обсуждении. Приоритеты: M — обязательно, S — желательно, C — не делать без моей просьбы.

## Общение

- Отвечай на русском. Код, идентификаторы, комментарии, коммиты, названия веток — на английском. Тексты интерфейса — на русском.
- Я параллельно учусь: при нетривиальных решениях коротко объясняй «почему», а не только «что».
- Перед крупной задачей (новая таблица, новый модуль, изменения больше чем в 3 файлах) сначала покажи план и дождись подтверждения.
- Если требование в ТЗ неоднозначно или противоречит коду — спроси, не додумывай.

## Стек

Next.js (App Router) + TypeScript strict · Tailwind CSS + shadcn/ui · TanStack Query · react-hook-form + Zod · Supabase (Postgres, Auth, RLS, Realtime, Storage) через `@supabase/ssr` · Vitest · pgTAP · Playwright · Vercel · GitHub Actions.

Отдельного бэкенда нет и не будет в рамках курса. Не предлагай NestJS, Express, Redis, Prisma, Yjs.

## Команды

```bash
npm run dev             # dev-сервер
npm run build
npm run lint
npm run typecheck       # tsc --noEmit
npm run test            # Vitest
npm run test:e2e        # Playwright
npm run db:types        # supabase gen types typescript --local > src/types/database.ts

npx supabase start      # локальный Supabase (нужен запущенный Docker)
npx supabase db reset   # пересоздать локальную БД из миграций + seed.sql
npx supabase migration new <name>
npx supabase test db    # pgTAP-тесты из supabase/tests
```

Если нужного скрипта нет в `package.json` — добавь его.

## Структура

```
src/
  app/                    # маршруты App Router
    (auth)/               # login, register, reset-password
    trips/[tripId]/       # overview, itinerary, expenses, balances, members, settings
    invite/[token]/
  components/ui/          # shadcn/ui, добавлять через `npx shadcn@latest add`
  components/<feature>/   # trips, itinerary, expenses, balances, members
  lib/money/              # чистая денежная логика + тесты рядом (*.test.ts)
  lib/supabase/           # client.ts (браузер), server.ts (серверные компоненты и route handlers)
  lib/validation/         # Zod-схемы
  lib/query-keys.ts       # все ключи TanStack Query
  types/database.ts       # сгенерирован, вручную не редактировать
supabase/
  migrations/
  seed.sql                # тестовые пользователи и демо-поездка из раздела 14 ТЗ
  tests/                  # pgTAP
tests/e2e/                # Playwright; Page Objects в tests/e2e/pages/
docs/tz.md
```

## Деньги — критичные правила

- Все суммы — целые числа в минимальных единицах валюты: поля `*_minor`, `bigint` в БД, `number` в TypeScript. Никаких float, `parseFloat`, `toFixed` в расчётах.
- Вся денежная арифметика — только в `src/lib/money/`. Модуль чистый: без React, Supabase и текущей даты. Любая функция там покрыта тестами.
- Округление — строго по BR-02 и BR-03 из ТЗ. Остаток раздаётся детерминированно. Инвариант: сумма долей === сумма расхода.
- Отображение сумм — только через `formatMoney()` (`Intl.NumberFormat`), разбор ввода — только через `parseMoneyInput()`. Число знаков валюты — из таблицы ISO 4217 в `lib/money/currencies.ts`.
- Создание и изменение расхода — только через RPC `create_expense` / `update_expense` (Postgres-функции, одна транзакция, проверка суммы долей). Никогда не вставляй в `expenses` и `expense_splits` напрямую с клиента.
- Для каждого расхода храним `amount_original_minor`, `currency`, `rate_to_base`, `amount_base_minor`. Пока мультивалютность (EXP-10) не реализована: валюта = базовая, курс = 1.

## База данных

- Изменения схемы — только новой миграцией. Уже применённые миграции не редактировать.
- Каждая новая таблица: `enable row level security`, политики в той же миграции и pgTAP-тест (участник видит, посторонний не видит, наблюдатель не может писать).
- Проверку членства в политиках делай через `security definer` функции `is_trip_member(trip_id)` и `trip_role(trip_id)` — это исключает рекурсию политик на `trip_members`.
- После изменения схемы — `npm run db:types`.
- Именование: таблицы в snake_case во множественном числе, `id uuid default gen_random_uuid()`, `created_at timestamptz default now()`.
- Даты поездок и сегментов — `date`. Время элементов маршрута — `timestamp` без часового пояса (BR-12).
- Ключ `service_role` никогда не попадает в клиентский код и в переменные `NEXT_PUBLIC_*`.

## Код

- Server Components по умолчанию, `'use client'` — только для форм, realtime и интерактива.
- Данные на клиенте — TanStack Query, ключи только из `lib/query-keys.ts`. После мутации инвалидируй все зависимые ключи (расход → список расходов и балансы).
- Формы: react-hook-form + Zod; одна и та же схема проверяет форму и данные перед отправкой.
- Без `any`. `@ts-ignore` и `eslint-disable` — только с комментарием-причиной.
- Компонент не длиннее ~200 строк, бизнес-логику выносить из компонентов.
- Ключевым интерактивным элементам (кнопки сохранения, поля сумм, строки балансов, пункты навигации) добавляй `data-testid` в kebab-case.
- Mobile-first: проверяй вёрстку на ширине 360 px.

## Тесты

- Новая функция в `lib/money` → тесты в том же изменении. Обязательные случаи: один участник, сумма меньше числа участников (1 тиын на троих), остаток при делении, очень большие суммы, пустые и некорректные входные данные.
- Исправление бага: сначала падающий тест, потом исправление.
- Имена тестов на английском со ссылкой на требование: `it('EXP-04: rejects exact split when shares do not sum to total')`.
- E2E только через Page Objects, селекторы только по `data-testid` или ролям, никаких CSS-селекторов и `waitForTimeout`.

## Перед тем как сказать «готово»

1. `npm run typecheck && npm run lint && npm run test`
2. Если менялась БД: `npx supabase db reset && npx supabase test db`
3. Коротко перечисли, что изменено, какие требования закрыты и что стоит проверить руками.

## Git

- Conventional Commits: `feat(expenses): add exact split (EXP-04)`, `fix(money): ...`, `test(rls): ...`.
- Не коммить и не пушь, пока я не попрошу.
- Не читай и не изменяй файлы `.env*`.
- Новые npm-зависимости — только после согласования со мной.

## Текущий статус

Этап 0 — подготовка (см. раздел 11 ТЗ). Обновляй эту строку, когда я говорю, что этап завершён.