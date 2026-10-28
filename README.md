# TripProject

Веб-приложение для совместного планирования сложных групповых путешествий и разделения бюджета. Курсовой проект (см. `docs/tz.md`).

Статус: Этап 0 — подготовка окружения (раздел 11 ТЗ).

## Стек

Next.js (App Router) + TypeScript strict · Tailwind CSS + shadcn/ui · TanStack Query · react-hook-form + Zod · Supabase (Postgres, Auth, RLS, Realtime, Storage) через `@supabase/ssr` · Vitest · pgTAP · Playwright · Vercel · GitHub Actions.

Полный контекст, бизнес-правила и структура — в [`CLAUDE.md`](./CLAUDE.md) и [`docs/tz.md`](./docs/tz.md).

Правила работы с ветками, коммитами и PR — в [`CONTRIBUTING.md`](./CONTRIBUTING.md). Матрица компетенций команды и распределение функций (задание 4) — в [`docs/team/zadanie-4-otchet.docx`](./docs/team/zadanie-4-otchet.docx).

## Документация

| Документ | Что внутри |
|---|---|
| [`docs/tz.md`](./docs/tz.md) | Полное техническое задание: требования (`EXP-04`, `BR-02` и т.д.), бизнес-правила, разделы 1–14 |
| [`docs/er-diagram.md`](./docs/er-diagram.md) | ER-диаграмма базы данных (раздел 8 ТЗ) — таблицы, связи, инварианты (`BR-04`, `BR-08`, `BR-11`) |
| [`docs/mockups.md`](./docs/mockups.md) | Макеты всех экранов (раздел 9 и 13.5 ТЗ) — рабочие страницы Next.js на мок-данных, скриншоты 360px и 1280px для каждого маршрута |

## Запуск локально

Требуется: Node.js 20+, Docker Desktop (для локального Supabase).

```bash
npm install

# в отдельном терминале — локальный Supabase (нужен запущенный Docker)
npx supabase start
# выведет API_URL, ANON_KEY, SERVICE_ROLE_KEY — скопируйте их в .env.local (см. .env.example)

cp .env.example .env.local   # и заполните значениями из вывода supabase start

npm run dev                  # http://localhost:3000
```

Остановить локальный Supabase: `npx supabase stop`.

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

## Деплой (Vercel)

Автоматического деплоя из этого окружения нет — проект нужно подключить вручную:

1. Зайти на [vercel.com](https://vercel.com), импортировать репозиторий.
2. Указать переменные окружения из `.env.example` (значения — из вашего Supabase-проекта, не из локального `supabase start`).
3. Deploy. Framework Preset определится автоматически (Next.js).

## Структура

См. раздел «Структура» в [`CLAUDE.md`](./CLAUDE.md).
