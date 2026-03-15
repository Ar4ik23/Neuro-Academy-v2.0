# CLAUDE.md — packages/database (Prisma + PostgreSQL)

## Роль в системе

Единственный источник истины для схемы БД.
Содержит Prisma schema и генерирует typed client.
Импортируется только в `apps/api`. Фронты никогда не касаются этого пакета.

**ORM**: Prisma 5.11.0
**БД**: PostgreSQL
**Экспорт**: `PrismaClient` через `index.js`

---

## Файлы

```
packages/database/
├── prisma/
│   ├── schema.prisma        # ЕДИНСТВЕННЫЙ источник схемы
│   └── migrations/          # История миграций (не редактировать вручную)
├── index.js                 # export { PrismaClient } from '@prisma/client'
└── package.json             # @neuro-academy/database
```

---

## Полная схема (текущее состояние)

### Enums
```prisma
enum UserRole        { USER ADMIN }
enum BlockType       { TEXT VIDEO IMAGE PDF PRESENTATION CHECKLIST QUOTE DOWNLOAD CALLOUT }
enum EnrollmentType  { TRIAL PURCHASED ADMIN_GRANT }
enum ProgressStatus  { IN_PROGRESS COMPLETED }
```

### Модели и их связи

```
User (id: UUID, telegramId: BigInt @unique, firstName, lastName?, username?, role: UserRole)
  ├── enrollments    Enrollment[]
  ├── courseProgress CourseProgress[]
  ├── lessonProgress LessonProgress[]
  ├── purchases      Purchase[]
  ├── notes          Note[]
  └── aiRequests     AIRequest[]

Course (id: UUID, title, description?, thumbnail?, published: Boolean, price: Decimal)
  ├── modules    Module[]
  ├── enrollments Enrollment[]
  ├── progress   CourseProgress[]
  └── purchases  Purchase[]

Module (id: UUID, courseId→Course, title, description?, order: Int)
  └── lessons Lesson[]

Lesson (id: UUID, moduleId→Module, title, order: Int)
  ├── blocks   LessonBlock[]
  ├── quiz     Quiz?         (1:1)
  ├── progress LessonProgress[]
  └── notes    Note[]

LessonBlock (id: UUID, lessonId→Lesson, type: BlockType, content: Json, order: Int)

Quiz (id: UUID, lessonId→Lesson @unique, title, passingScore: Int = 80)
  └── questions QuizQuestion[]
       └── options QuizOption[] (isCorrect: Boolean)

Enrollment (id: UUID, userId→User, courseId→Course, type: EnrollmentType, expiresAt?: DateTime)

LessonProgress (id: UUID, userId→User, lessonId→Lesson, status: ProgressStatus)
  @@unique([userId, lessonId])

CourseProgress (id: UUID, userId→User, courseId→Course, percentage: Int, status: ProgressStatus)
  @@unique([userId, courseId])

Purchase (id: UUID, userId→User, courseId→Course, amount: Decimal, currency, status, providerTxId?)

Note (id: UUID, userId→User, lessonId→Lesson, text, highlightedText?)

AIRequest (id: UUID, userId→User, contextText, prompt, response)
```

---

## Workflow изменений схемы (строгий порядок)

```bash
# 1. Отредактировать schema.prisma
# 2. Создать и применить миграцию:
npm run db:migrate      # из корня монорепо
# (вводит имя миграции когда спросит)

# 3. Регенерировать Prisma client:
npm run db:generate     # из корня монорепо

# 4. Обновить @neuro-academy/types если изменился публичный контракт
# 5. Обновить API service слой
```

**НИКОГДА** не редактировать файлы в `prisma/migrations/` вручную.
**НИКОГДА** не менять схему в бою без миграции.

---

## Ключевые бизнес-правила в схеме

### 1. Enrollment Gate
`Enrollment` — это разрешение на доступ.
`Purchase` — это финансовая запись.
Они разные. Один Purchase → один Enrollment, но не наоборот (ADMIN_GRANT, TRIAL).

### 2. Уникальные составные ключи
```prisma
@@unique([userId, lessonId])   // LessonProgress — один прогресс на урок
@@unique([userId, courseId])   // CourseProgress — один прогресс на курс
```
При upsert использовать эти ключи как where условие.

### 3. Порядок (order: Int)
`Module.order`, `Lesson.order`, `LessonBlock.order` — всегда сортировать ASC.
```typescript
orderBy: { order: 'asc' }
```

### 4. LessonBlock.content (Json)
Payload зависит от типа блока. Примеры:
```json
// TEXT:         { "html": "<p>...</p>" }
// VIDEO:        { "url": "https://...", "duration": 120 }
// IMAGE:        { "url": "https://...", "alt": "..." }
// CHECKLIST:    { "items": [{ "text": "...", "checked": false }] }
// QUOTE:        { "text": "...", "author": "..." }
// DOWNLOAD:     { "url": "...", "filename": "...", "size": 1024 }
// CALLOUT:      { "type": "info|warning|tip", "text": "..." }
```

### 5. telegramId — BigInt
Telegram user IDs могут превышать Int32. Использовать `BigInt` в схеме.
В JavaScript: `BigInt(telegramId)`, в JSON сериализовать как строку.

### 6. Quiz passingScore
По умолчанию 80 (%). Проходной балл проверяется в `QuizzesService`, не в БД.

---

## Как использовать в apps/api

```typescript
// prisma.service.ts уже настроен глобально
// Просто inject PrismaService:
constructor(private prisma: PrismaService) {}

// Пример сложного запроса:
const course = await this.prisma.course.findUnique({
  where: { id, published: true },
  include: {
    modules: {
      orderBy: { order: 'asc' },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
          select: { id: true, title: true, order: true }
        }
      }
    }
  }
});

// upsert прогресса урока:
await this.prisma.lessonProgress.upsert({
  where: { userId_lessonId: { userId, lessonId } },
  update: { status: 'COMPLETED' },
  create: { userId, lessonId, status: 'COMPLETED' }
});

// Атомарная транзакция (payments webhook):
await this.prisma.$transaction([
  this.prisma.purchase.create({ data: purchaseData }),
  this.prisma.enrollment.create({ data: enrollmentData }),
]);
```

---

## Что запрещено

- Импортировать `@neuro-academy/database` в `apps/web-miniapp` или `apps/admin`
- Редактировать файлы миграций вручную
- Создавать второй инстанс PrismaClient (использовать глобальный PrismaService)
- Делать raw SQL в обход Prisma без крайней необходимости
- Хранить бизнес-логику в схеме (только структура данных)
