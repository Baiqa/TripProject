# Макеты экранов

Соответствует разделу 9 ТЗ («Пользовательский интерфейс») и пункту 13.5 («Макеты основных экранов»). Это не отдельные картинки — макеты реализованы как настоящие страницы Next.js (`src/app/...`) на статичных мок-данных из `src/mocks/demo-trip.ts` (демо-сценарий раздела 14: Айдос, Дана, Ерлан и Мадина едут в Турцию). На этапах 1–3 та же разметка и компоненты переключаются на реальные запросы к Supabase — сами страницы не переписываются с нуля.

Скриншоты сняты с продакшен-сборки (`next build && next start`) внутри Docker (`mcr.microsoft.com/playwright`) на двух ширинах — 360px (мобильный, минимальная ширина по NFR-04) и 1280px (десктоп). Проверено: все 15 маршрутов отвечают HTTP 200 и не выбрасывают ошибок в консоль браузера (разовый скрипт `tmp/screenshot-mockups.mjs`, не коммитится).

| Маршрут | Требования ТЗ | Мобильный (360px) | Десктоп (1280px) |
|---|---|---|---|
| `/login` | AUTH-01, AUTH-02 | [скриншот](screenshots/login-360.png) | [скриншот](screenshots/login-1280.png) |
| `/register` | AUTH-01 | [скриншот](screenshots/register-360.png) | [скриншот](screenshots/register-1280.png) |
| `/reset-password` | AUTH-03 | [скриншот](screenshots/reset-password-360.png) | [скриншот](screenshots/reset-password-1280.png) |
| `/trips` | TRIP-02 | [скриншот](screenshots/trips-list-360.png) | [скриншот](screenshots/trips-list-1280.png) |
| `/trips/new` | TRIP-01 | [скриншот](screenshots/trips-new-360.png) | [скриншот](screenshots/trips-new-1280.png) |
| `/trips/[tripId]` | TRIP-05 | [скриншот](screenshots/trip-overview-360.png) | [скриншот](screenshots/trip-overview-1280.png) |
| `/trips/[tripId]/itinerary` | SEG-01…05, ITEM-01…02 | [скриншот](screenshots/trip-itinerary-360.png) | [скриншот](screenshots/trip-itinerary-1280.png) |
| `/trips/[tripId]/expenses` | EXP-05 | [скриншот](screenshots/trip-expenses-360.png) | [скриншот](screenshots/trip-expenses-1280.png) |
| `/trips/[tripId]/expenses/new` | EXP-01…04 | [скриншот](screenshots/trip-expense-new-360.png) | [скриншот](screenshots/trip-expense-new-1280.png) |
| `/trips/[tripId]/expenses/[expenseId]` | EXP-01…04, EXP-06 | [скриншот](screenshots/trip-expense-edit-360.png) | [скриншот](screenshots/trip-expense-edit-1280.png) |
| `/trips/[tripId]/balances` | BAL-01…04 | [скриншот](screenshots/trip-balances-360.png) | [скриншот](screenshots/trip-balances-1280.png) |
| `/trips/[tripId]/members` | MEM-04, MEM-05 | [скриншот](screenshots/trip-members-360.png) | [скриншот](screenshots/trip-members-1280.png) |
| `/trips/[tripId]/settings` | TRIP-03, TRIP-04 | [скриншот](screenshots/trip-settings-360.png) | [скриншот](screenshots/trip-settings-1280.png) |
| `/invite/[token]` | MEM-02 | [скриншот](screenshots/invite-360.png) | [скриншот](screenshots/invite-1280.png) |
| `/profile` | AUTH-04, AUTH-06 | [скриншот](screenshots/profile-360.png) | [скриншот](screenshots/profile-1280.png) |

## Что демонстрируют макеты (не только вёрстку)

- **Подгруппы и пересекающиеся сегменты (SEG-02, SEG-03).** На `/itinerary` дни 5–8 показывают одновременно «Каппадокия · 3 чел.» и «Анталья · 1 чел.» — разные подгруппы участников в одни и те же даты.
- **Деление поровну с остатком (BR-02).** Расход «Такси до кемпинга», 100 000 тиын на троих (Айдос, Дана, Ерлан) → 33 334 / 33 333 / 33 333. Первым по порядку вступления (Айдос) достаётся лишний тиын.
- **Точное деление и инвариант суммы (BR-04, EXP-04).** Расход «Ужин в Стамбуле» на `/expenses/exp-dinner` — 5000/5000/5000/9000 ₸ = 24 000 ₸, индикатор «Сумма долей сходится с суммой расхода». Форма расхода (`ExpenseForm`, `'use client'`) считает остаток и было бы заблокировано сохранение при расхождении — единственный интерактивный (не только визуальный) элемент среди макетов, специально ради демонстрации этого правила.
- **Баланс и упрощение долгов (BR-05, BR-06).** На `/balances` балансы четырёх участников (+38 166,66 / +213 166,67 / −122 333,33 / −129 000,00 ₸) в сумме дают ноль, а рекомендованных переводов — три при четырёх участниках (≤ n − 1), как и требует жадный алгоритм.
- **Мультивалютность (EXP-10, BR-07).** Расходы «Отель в Стамбуле» (USD) и «Воздушный шар» (TRY) в `demo-trip.ts` хранят исходную сумму, курс на дату расхода и сумму в базовой валюте отдельно.

## Известные ограничения макетов

- Все данные статичны (`src/mocks/demo-trip.ts`), кнопки сохранения/удаления ничего не отправляют — RPC `create_expense`/`update_expense` и реальные Supabase-запросы появятся на этапах 1–3.
- Валидация форм (react-hook-form + Zod) не подключена — только визуальные подсказки и disabled-состояния.
- На мобильной ширине таблица участников (`/members`) заменяется списком карточек — обычная HTML-таблица с 5 колонками физически не помещается в 360px без горизонтальной прокрутки; это обнаружено и исправлено по факту скриншот-проверки, а не заложено с самого начала.
