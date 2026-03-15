# CLAUDE.md — apps/admin (Admin Panel)

## Роль в системе

Панель управления для контент-менеджеров и администраторов.
Только для пользователей с `UserRole.ADMIN`.
Управляет: курсами, модулями, уроками, блоками контента, пользователями, аналитикой.

**Stack**: Next.js 14 App Router, React 18, Tailwind CSS 3.4, Lucide React иконки
**API**: обращается к `apps/api` через `NEXT_PUBLIC_API_URL`

---

## Структура директорий (ожидаемая)

```
src/
├── app/
│   ├── layout.tsx               # Admin layout с sidebar навигацией
│   ├── page.tsx                 # Dashboard / analytics overview
│   ├── courses/
│   │   ├── page.tsx             # Список курсов с управлением
│   │   ├── new/page.tsx         # Создание курса
│   │   └── [courseId]/
│   │       ├── page.tsx         # Редактор курса
│   │       └── lessons/
│   │           └── [lessonId]/  # Редактор урока и блоков
│   ├── users/                   # Управление пользователями
│   └── analytics/               # Статистика и метрики
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Боковая навигация
│   │   └── Header.tsx
│   └── editors/
│       ├── BlockEditor.tsx      # Редактор LessonBlock
│       └── CourseEditor.tsx
├── features/
│   ├── courses/                 # CRUD курсов
│   ├── lessons/                 # CRUD уроков и блоков
│   └── users/                  # Управление пользователями
└── services/
    └── api.ts                   # Axios клиент (такой же паттерн как web-miniapp)
```

---

## Правила

### Доступ
- Все страницы защищены `UserRole.ADMIN`
- Middleware или layout должен проверять роль и редиректить не-admin
- Никогда не показывать admin endpoints в web-miniapp

### Редактор блоков (LessonBlock Editor)
Редактор должен поддерживать все типы блоков:
`TEXT | VIDEO | IMAGE | PDF | PRESENTATION | CHECKLIST | QUOTE | DOWNLOAD | CALLOUT`

Паттерн: drag-and-drop порядка блоков через `order` поле.
Каждый тип блока — отдельный editor component, не один монолитный компонент.

### Изменения данных — только через API
```typescript
// ПРАВИЛЬНО: через API
await api.post('/courses', courseData);
await api.patch(`/lessons/${id}`, lessonData);

// ЗАПРЕЩЕНО: прямой доступ к БД
import { prisma } from '@neuro-academy/database'; // НИКОГДА в admin app
```

### Публикация курса
- Курс по умолчанию `published: false`
- Явное действие "Опубликовать" меняет `published: true` через `PATCH /courses/:id`
- Только опубликованные курсы видны в web-miniapp

### Управление Enrollment
- Admin может выдавать доступ вручную: `EnrollmentType.ADMIN_GRANT`
- Это создаёт Enrollment запись, не Purchase
- Endpoint: `POST /enrollments` (admin only)

---

## Компоненты из @neuro-academy/ui

Использовать готовые компоненты из пакета `@neuro-academy/ui`:
```typescript
import { Button, Input, GlassContainer } from '@neuro-academy/ui';
```

Не дублировать эти компоненты внутри admin app.
Если нужен новый переиспользуемый компонент → добавить в `packages/ui`.

---

## Что запрещено в admin

- Прямой доступ к `@neuro-academy/database` (Prisma) — только через API
- Смешивать student и admin логику
- Удалять курс/урок без подтверждения (деструктивные операции)
- Обходить `UserRole.ADMIN` проверку на любом route
