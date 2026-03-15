# CLAUDE.md — apps/web-miniapp (Telegram Mini App)

## Роль в системе

Студенческий интерфейс. Работает внутри Telegram как TWA (Telegram Web App).
Чисто представительский слой — никакой бизнес-логики, никакого прямого доступа к БД.
Оптимизирован для мобильных: тёмная тема, max-width 480px, Bottom Navigation.

**Stack**: Next.js 14 App Router, React 18, Tailwind CSS 3.4, Axios
**API**: `NEXT_PUBLIC_API_URL` (по умолчанию http://localhost:3000/api)

---

## Структура директорий

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root: TWA SDK, тёмная тема, BottomNav, ErrorBoundary
│   ├── page.tsx                 # Welcome / Home
│   ├── courses/
│   │   ├── page.tsx             # Каталог курсов
│   │   └── [courseId]/          # Детали курса (динамический роут)
│   ├── artemius/                # AI Helper секция
│   └── profile/                 # Профиль пользователя
├── components/
│   ├── ErrorBoundary.tsx        # Оборачивает основной контент
│   └── navigation/
│       └── BottomNav.tsx        # Фиксированная навигация снизу
├── features/                    # Бизнес-фичи (компоненты + хуки)
│   ├── auth/                    # Аутентификация через Telegram initData
│   ├── courses/
│   │   ├── CoursesCatalog.tsx
│   │   ├── CourseDetail.tsx
│   │   └── hooks/
│   │       └── useCourse.ts     # Хук данных курса
│   ├── learning/
│   │   ├── LessonScreen.tsx     # Универсальный экран урока
│   │   ├── components/
│   │   │   ├── BlockRenderer.tsx     # Registry рендера блоков по типу
│   │   │   ├── LessonRenderer.tsx    # Итерация по blocks[]
│   │   │   └── QuizComponent.tsx     # UI квиза
│   │   └── hooks/
│   │       ├── useLesson.ts          # Контент урока
│   │       ├── useQuiz.ts            # Квиз состояние
│   │       ├── useProgress.ts        # Прогресс по курсу/уроку
│   │       ├── useEnrollment.ts      # Проверка доступа
│   │       ├── useNotes.ts           # Заметки
│   │       ├── useAIHelper.ts        # AI запросы
│   │       └── useCertificates.ts    # Сертификаты
│   └── social/
│       └── AISelectionHelper.tsx     # AI помощник для выделенного текста
├── services/
│   └── api.ts                   # Axios клиент (единственный способ обращения к API)
├── data/
│   └── mock-courses.ts          # Mock данные для разработки без API
└── lib/                         # Утилиты специфичные для этого app
```

---

## Правила написания компонентов

### 'use client' — когда обязательно
```typescript
'use client'
// Требуется если компонент использует:
// - localStorage / sessionStorage
// - window.Telegram.WebApp
// - useState, useEffect, хуки
// - event handlers (onClick и т.д.)
// Серверные компоненты (без 'use client') — только для статичного контента
```

### Все API вызовы — только через services/api.ts
```typescript
// ПРАВИЛЬНО
import { api } from '@/services/api';
const { data } = await api.get('/courses');

// ЗАПРЕЩЕНО
const res = await fetch('http://localhost:3000/api/courses'); // прямой fetch
```

### Состояние — в хуках features/*/hooks/
```typescript
// Перед созданием нового хука — проверить существующие:
// useLesson, useQuiz, useProgress, useEnrollment, useNotes, useAIHelper, useCourse

// Паттерн хука:
export function useLesson(lessonId: string) {
  const [lesson, setLesson] = useState<LessonDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(`/lessons/${lessonId}`)
      .then(r => setLesson(r.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { lesson, loading, error };
}
```

### Стили — только Tailwind классы
```typescript
// ПРАВИЛЬНО
<div className="bg-slate-900 text-white rounded-xl p-4">

// ЗАПРЕЩЕНО
<div style={{ backgroundColor: '#0f172a' }}>  // inline styles без крайней необходимости
```

---

## Система рендера LessonBlock (критически важно)

Контент урока приходит как массив блоков. Рендерить через registry:

```typescript
// components/BlockRenderer.tsx — паттерн registry
const BLOCK_RENDERERS: Record<BlockType, React.FC<{ content: any }>> = {
  TEXT:         TextBlock,
  VIDEO:        VideoBlock,
  IMAGE:        ImageBlock,
  PDF:          PdfBlock,
  PRESENTATION: PresentationBlock,
  CHECKLIST:    ChecklistBlock,
  QUOTE:        QuoteBlock,
  DOWNLOAD:     DownloadBlock,
  CALLOUT:      CalloutBlock,
};

export function BlockRenderer({ block }: { block: LessonBlock }) {
  const Component = BLOCK_RENDERERS[block.type];
  if (!Component) return null;
  return <Component content={block.content} />;
}

// LessonRenderer.tsx
{lesson.blocks.map(block => (
  <BlockRenderer key={block.id} block={block} />
))}
```

**Запрещено**: if-else / switch на весь экран урока вместо registry.

---

## Telegram Web App SDK

```typescript
// Доступ к SDK (загружается в layout.tsx через script tag)
const twa = window.Telegram?.WebApp;

// Полезные методы:
twa?.ready()                    // Сообщить TG что app готов
twa?.BackButton.show()          // Показать кнопку назад
twa?.BackButton.onClick(fn)     // Обработчик кнопки назад
twa?.HapticFeedback.impactOccurred('light')  // Тактильный отклик
twa?.initData                   // Строка для /auth/login
twa?.initDataUnsafe.user        // Данные пользователя (НЕ для auth!)

// Проверка перед использованием:
if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
  // safe to use TWA SDK
}
```

---

## Навигация

Bottom Navigation (фиксированная, поверх контента):
- **Курсы** → `/courses`
- **Артемиус** → `/artemius` (AI Helper)
- **Профиль** → `/profile`

Высота BottomNav: `h-16` (64px). Контент должен иметь `pb-16` чтобы не перекрываться.

---

## API клиент (services/api.ts)

```typescript
// Axios instance с автоматическим Bearer token
// Токен берётся из localStorage['accessToken']
// При 401 → автоматический logout (очистка localStorage, редирект)

// Использование:
import { api } from '@/services/api';

// GET
const courses = await api.get<CourseDto[]>('/courses');

// POST
const result = await api.post<QuizResultDto>(`/quizzes/${id}/submit`, { answers });
```

---

## Аутентификация

```typescript
// При первом запуске приложения:
// 1. Получить window.Telegram.WebApp.initData
// 2. POST /auth/login { initData }
// 3. Сохранить accessToken в localStorage
// 4. Axios автоматически добавит его в следующие запросы

// Проверять наличие токена перед protected pages
const token = localStorage.getItem('accessToken');
if (!token) redirect('/'); // на welcome/login страницу
```

---

## Mock данные для разработки

`src/data/mock-courses.ts` — используется когда API недоступен.
При работе с реальным API закомментировать mock-подстановки в хуках.

---

## Что запрещено в web-miniapp

- Бизнес-логику в компонентах (if enrolled then show, расчёт прогресса и т.д.)
- Прямой импорт `@neuro-academy/database`
- Отдельный hardcoded layout под каждый урок
- Смешивать прогресс + контент + доступ в одном useState хаосе
- Делать fetch напрямую, минуя services/api.ts
- Рендерить LessonBlock через длинный if-else вместо registry
- Глобальный стейт без необходимости (использовать локальные хуки)
