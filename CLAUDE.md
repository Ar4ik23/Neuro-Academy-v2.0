# CLAUDE.md — Neuro-Academy v2.0 (Root)

## Что это за проект

Telegram-native образовательная платформа. Монорепо на npm workspaces.
Студент учится через Telegram Mini App (TWA). Контент управляется через Admin Panel.
Весь домен — в NestJS API. Фронты — чисто представительский слой.

---

## Структура монорепо

```
neuro-academy-v2/
├── apps/
│   ├── api/             → NestJS backend (порт 3000, /api префикс)
│   ├── web-miniapp/     → Next.js 14 TWA для студентов (мобильный, 480px)
│   └── admin/           → Next.js 14 панель управления контентом
├── packages/
│   ├── database/        → Prisma schema + generated client (PostgreSQL)
│   ├── types/           → Единственный источник TypeScript контрактов (DTOs, Enums)
│   ├── ui/              → Shared компоненты (кнопки, инпуты, glass-контейнеры)
│   ├── utils/           → Чистые утилиты без внешних зависимостей
│   └── config/          → Базовые конфиги (tsconfig, eslint)
├── docs/                → Архитектурные спецификации (читать перед реализацией)
├── tsconfig.base.json
└── package.json         → Корневой оркестратор
```

## Матрица зависимостей

| App / Package | database | types | ui | utils |
|---|---|---|---|---|
| apps/api | ✅ | ✅ | ❌ | ✅ |
| apps/web-miniapp | ❌ | ✅ | ✅ | ✅ |
| apps/admin | ❌ | ✅ | ✅ | ✅ |

**Правило**: apps никогда не импортируют друг друга. Только через API.

---

## Команды разработки

```bash
# Запуск
npm run dev:api        # NestJS watch mode
npm run dev:web        # Next.js студенческий app
npm run dev:admin      # Next.js admin panel

# База данных
npm run db:generate    # Regenerate Prisma client после изменений schema
npm run db:migrate     # Применить новые миграции (dev mode)

# Сборка и проверка
npm run build          # Собрать все workspaces
npm run lint           # Lint всего монорепо
```

---

## Переменные окружения

**apps/api/.env**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
BOT_TOKEN=...           # Telegram Bot Token для HMAC-SHA256 валидации
PORT=3000
```

**apps/web-miniapp/.env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

---

## Доменная модель (краткая карта)

```
User (telegramId unique)
  ├── Enrollment[] → Course (TRIAL | PURCHASED | ADMIN_GRANT)
  ├── Purchase[]   → Course (финансовая запись, НЕ доступ)
  ├── CourseProgress[] → Course (percentage 0-100, IN_PROGRESS | COMPLETED)
  ├── LessonProgress[] → Lesson (IN_PROGRESS | COMPLETED)
  ├── Note[]       → Lesson
  └── AIRequest[]  (аудит запросов к AI)

Course
  └── Module[] (ordered)
       └── Lesson[] (ordered)
            ├── LessonBlock[] (ordered: TEXT|VIDEO|IMAGE|PDF|PRESENTATION|CHECKLIST|QUOTE|DOWNLOAD|CALLOUT)
            └── Quiz? (1:1) → QuizQuestion[] → QuizOption[]
```

---

## Архитектурные правила (ОБЯЗАТЕЛЬНО соблюдать)

### Правило 1 — Порядок изменений
Перед написанием кода определить:
1. К какому домену относится задача
2. Затрагивает ли: domain model → database → API → shared types → UI
3. Изменения идут строго в этом порядке: schema → migration → types → API → UI

### Правило 2 — Enrollment Gate
Доступ к контенту урока **всегда** проверяется через `Enrollment`.
Никогда не через `Purchase`. Никогда в UI. Только в API service слое.

### Правило 3 — Block-Based Content
Контент урока — **всегда массив `LessonBlock[]`**.
Запрещено хардкодить контент. Запрещено делать урок одним текстовым полем.
Рендер — через registry/map по типу блока, не через if-else цепочку.

### Правило 4 — Shared Contract First
Любое изменение структуры данных → сначала `@neuro-academy/types`, потом реализация.
Никогда не дублировать типы между пакетами.

### Правило 5 — Stateless API
API не хранит состояние в памяти. Всё через JWT + PostgreSQL.
JWT верифицируется через Telegram HMAC-SHA256 на `/auth/login`.

### Правило 6 — Вертикальная изоляция
apps/api и apps/web-miniapp не знают друг о друге напрямую.
Никаких прямых импортов между apps.

---

## Запрещено делать

- Бизнес-логику внутри React-компонентов
- Прямую зависимость фронта от `@neuro-academy/database`
- Смешивать DB entity + API DTO + UI model в один тип
- Логику "if paid then allow" в UI или controller
- Отдельный hardcoded layout под каждый урок
- Строить API "под один экран" вместо действия над сущностью
- Смешивать student и admin логику в одном модуле
- Временные костыли без явного TODO с объяснением причины

---

## Процесс добавления новой фичи (обязательный чеклист)

```
1. [ ] Определить домен и затронутые сущности
2. [ ] Обновить schema.prisma (если нужно)
3. [ ] npm run db:migrate
4. [ ] Обновить @neuro-academy/types
5. [ ] Реализовать в API (DTO → Service → Controller)
6. [ ] Обновить UI (hooks → components → pages)
7. [ ] Проверить архитектурные правила
```

---

## Документация проекта (читать перед реализацией)

| Файл | Содержание |
|---|---|
| `docs/architecture.md` | Системный обзор, паттерны коммуникации |
| `docs/domain-model.md` | Полная спецификация сущностей |
| `docs/api-map.md` | Все endpoints с контрактами |
| `docs/architecture-rules.md` | 10 шаблонов для выполнения задач |
| `docs/monorepo-structure.md` | Структура и правила workspace |
| `docs/content-model.md` | Детали контентной модели |
| `docs/user-flows.md` | Пользовательские сценарии |

---

## После каждого крупного шага сообщить

1. Что сделано
2. Какие файлы изменены/созданы
3. Какое архитектурное решение принято и почему
4. Что является следующим корректным шагом
