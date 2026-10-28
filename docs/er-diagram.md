# ER-диаграмма базы данных

Соответствует разделу 8 ТЗ («Логическая модель данных»). Все суммы — `bigint` в минимальных единицах валюты (BR-01). Курсивом отмечены поля, которые заполняются только после реализации соответствующих требований (например, `currency`/`rate_to_base` в `expenses` — до EXP-10 всегда базовая валюта и курс 1).

```mermaid
erDiagram
    PROFILES ||--o{ TRIP_MEMBERS : "состоит в"
    TRIPS ||--o{ TRIP_MEMBERS : "участники"
    TRIPS ||--o{ INVITES : "приглашения"
    PROFILES ||--o{ INVITES : "создал"
    TRIPS ||--o{ SEGMENTS : "сегменты"
    SEGMENTS ||--o{ SEGMENT_MEMBERS : "состав"
    PROFILES ||--o{ SEGMENT_MEMBERS : "участвует"
    SEGMENTS ||--o{ ITINERARY_ITEMS : "элементы"
    ITINERARY_ITEMS ||--o{ ATTACHMENTS : "вложения"
    TRIPS ||--o{ EXPENSES : "расходы"
    SEGMENTS o|--o{ EXPENSES : "привязан к (необязательно)"
    PROFILES ||--o{ EXPENSES : "оплатил"
    EXPENSES ||--o{ EXPENSE_SPLITS : "доли"
    PROFILES ||--o{ EXPENSE_SPLITS : "должен по доле"
    EXPENSES ||--o{ EXPENSE_HISTORY : "история изменений"
    TRIPS ||--o{ SETTLEMENTS : "переводы"
    PROFILES ||--o{ SETTLEMENTS : "отправитель"
    PROFILES ||--o{ SETTLEMENTS : "получатель"
    TRIPS ||--o{ BUDGETS : "плановый бюджет"

    PROFILES {
        uuid id PK "= auth.users.id"
        text display_name
        text avatar_url
    }

    TRIPS {
        uuid id PK
        text title
        text description
        date start_date
        date end_date
        text base_currency
        uuid created_by FK
    }

    TRIP_MEMBERS {
        uuid trip_id PK,FK
        uuid user_id PK,FK
        text role "organizer | member | observer"
        text status "active | left"
        timestamptz joined_at
    }

    INVITES {
        uuid id PK
        uuid trip_id FK
        text token
        timestamptz expires_at
        timestamptz revoked_at
        uuid created_by FK
    }

    SEGMENTS {
        uuid id PK
        uuid trip_id FK
        text title
        text place
        date start_date
        date end_date
        int position
    }

    SEGMENT_MEMBERS {
        uuid segment_id PK,FK
        uuid user_id PK,FK
    }

    ITINERARY_ITEMS {
        uuid id PK
        uuid segment_id FK
        text type "flight|train|bus|transfer|accommodation|activity|other"
        text title
        timestamp starts_at "локальное время события, BR-12"
        timestamp ends_at
        text place
        text booking_url
        text note
        bigint planned_cost_minor
    }

    EXPENSES {
        uuid id PK
        uuid trip_id FK
        uuid segment_id FK "необязательно"
        uuid payer_id FK
        text title
        text category
        date expense_date "может выходить за даты поездки, BR-13"
        bigint amount_original_minor
        text currency
        numeric rate_to_base "= 1 до EXP-10"
        bigint amount_base_minor
        text split_type "equal | exact | shares | percent"
        uuid created_by FK
    }

    EXPENSE_SPLITS {
        uuid expense_id PK,FK
        uuid user_id PK,FK
        bigint share_minor
        numeric weight "для деления по долям/процентам"
    }

    SETTLEMENTS {
        uuid id PK
        uuid trip_id FK
        uuid from_user FK
        uuid to_user FK
        bigint amount_minor
        date settled_on
        uuid created_by FK
    }

    BUDGETS {
        uuid trip_id PK,FK
        text category PK
        bigint planned_minor
    }

    EXPENSE_HISTORY {
        uuid id PK
        uuid expense_id FK
        uuid changed_by FK
        timestamptz changed_at
        jsonb diff
    }

    ATTACHMENTS {
        uuid id PK
        uuid item_id FK
        text storage_path
        text file_name
        int size
    }

    EXCHANGE_RATES {
        text currency_from PK
        text currency_to PK
        date rate_date PK
        numeric rate
    }
```

## Примечания к схеме

- **BR-04 (инвариант расхода)** — сумма `expense_splits.share_minor` по `expense_id` должна строго равняться `expenses.amount_base_minor`. Проверяется в Postgres-функциях `create_expense`/`update_expense`, а не на уровне схемы (агрегатный CHECK по строкам в Postgres не выразить напрямую).
- **BR-08** — `trips.base_currency` неизменна после первого `expenses` по этой поездке; проверяется в RPC `update_trip`, а не constraint'ом.
- **BR-11** — `expense_splits` не зависит от текущего состава `segment_members`: доли фиксируются на момент создания расхода и не пересчитываются при изменении сегмента.
- `SEGMENTS o|--o{ EXPENSES` — связь необязательная: `expenses.segment_id` может быть `NULL` (расход без привязки к сегменту).
- `EXCHANGE_RATES` не привязана к конкретной поездке — общий кэш курсов на дату, используется при создании расхода (EXP-10, BR-07) и не связана внешними ключами с остальными таблицами.
- Проверка членства в RLS-политиках всех таблиц выполняется через `security definer`-функции `is_trip_member(trip_id)` / `trip_role(trip_id)`, а не прямым JOIN на `trip_members` (см. CLAUDE.md) — на диаграмме это не отображено, так как относится к политикам, а не к структуре таблиц.
