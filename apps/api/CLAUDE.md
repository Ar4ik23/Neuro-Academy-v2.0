# CLAUDE.md — apps/api (NestJS Backend)

## Роль в системе

Центральный backbone. Единственное место бизнес-логики.
Обрабатывает все домены: аутентификация, контент, прогресс, платежи, AI.
Фронты обращаются только сюда через REST. Никакой прямой связи фронта с БД.

**Stack**: NestJS 10, Prisma 5, Passport.js JWT, PostgreSQL
**Порт**: 3000, **Префикс**: `/api`

---

## Структура модулей

```
src/
├── main.ts                    # Bootstrap: port 3000, globalPrefix '/api', CORS
├── app.module.ts              # Root: импортирует все domain modules
├── prisma/
│   ├── prisma.module.ts       # Global, экспортирует PrismaService везде
│   └── prisma.service.ts      # extends PrismaClient, onModuleInit/Destroy
└── modules/
    ├── auth/                  # JWT + Telegram initData валидация
    ├── courses/               # Course CRUD и listing
    ├── lessons/               # Lesson content + LessonBlocks
    ├── modules/               # Course modules management
    ├── progress/              # LessonProgress + CourseProgress
    ├── quizzes/               # Quiz logic + scoring
    ├── enrollments/           # Enrollment management + access check
    ├── payments/              # Telegram Stars + webhook
    ├── notes/                 # User annotations
    ├── ai/                    # AI Helper integration + AIRequest audit
    ├── users/                 # User management
    ├── admin/                 # Admin-only endpoints
    ├── certificates/          # Course completion certificates
    └── files/                 # File uploads
```

---

## Анатомия модуля (обязательная структура)

Каждый модуль содержит:
```
{domain}/
├── {domain}.module.ts          # Imports, Controllers, Providers
├── {domain}.controller.ts      # HTTP routing, Guards, validation pipe
├── {domain}.service.ts         # Business logic, Prisma queries
├── dto/
│   ├── create-{domain}.dto.ts  # class-validator декораторы
│   └── update-{domain}.dto.ts
└── guards/ (если нужен специфичный guard)
```

**Не класть бизнес-логику в controller. Только в service.**

---

## API Контракты (все endpoints)

### Auth `/auth`
| Method | Path | Auth | Описание |
|---|---|---|---|
| POST | `/auth/login` | ❌ | `{ initData: string }` → `{ accessToken, user: UserDto }` |

### Courses `/courses`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/courses` | ✅ | Список курсов (`published: true`) → `CourseDto[]` |
| GET | `/courses/:id` | ✅ | Детали курса с модулями → `CourseDetailDto` |

### Lessons `/lessons`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/lessons/:id` | ✅ | Контент урока + блоки + quiz → `LessonDetailDto` ⚠️ Требует Enrollment |

### Progress `/progress`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/progress/:courseId` | ✅ | Прогресс по курсу → `CourseProgressDto` |
| POST | `/progress/lesson/:id/complete` | ✅ | Завершить урок → пересчёт CourseProgress |

### Enrollments `/enrollments`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/enrollments` | ✅ | Курсы с доступом у пользователя → `EnrollmentDto[]` |

### Quizzes `/quizzes`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/quizzes/:id` | ✅ | Вопросы и варианты ответов |
| POST | `/quizzes/:id/submit` | ✅ | `{ answers[] }` → `{ passed, score }` |

### Payments `/payments`
| Method | Path | Auth | Описание |
|---|---|---|---|
| POST | `/payments/invoice/:courseId` | ✅ | Создать инвойс TG Stars → `{ invoiceLink }` |
| POST | `/payments/webhook` | ❌ | Webhook: сохранить Purchase → создать Enrollment |

### Notes `/notes`
| Method | Path | Auth | Описание |
|---|---|---|---|
| GET | `/notes/:lessonId` | ✅ | Заметки пользователя к уроку |
| POST | `/notes` | ✅ | Сохранить заметку |

### AI `/ai`
| Method | Path | Auth | Описание |
|---|---|---|---|
| POST | `/ai/explain` | ✅ | `{ contextText, prompt }` → `{ response }` |

---

## Правила написания кода

### Guards и Auth
```typescript
// Защита endpoint
@UseGuards(JwtAuthGuard)
@Get('protected')

// Получить текущего пользователя
@GetUser() user: User

// Проверка роли
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
```

### Prisma в Service
```typescript
// PrismaModule глобальный — просто inject:
constructor(private prisma: PrismaService) {}

// Всегда include связанные данные явно, не делать N+1
const lesson = await this.prisma.lesson.findUnique({
  where: { id },
  include: { blocks: { orderBy: { order: 'asc' } }, quiz: true }
});
```

### Проверка доступа к контенту (ОБЯЗАТЕЛЬНО)
```typescript
// В LessonsService перед возвратом контента:
const enrollment = await this.prisma.enrollment.findFirst({
  where: { userId, courseId, expiresAt: { gte: new Date() } }
});
if (!enrollment) throw new ForbiddenException('No active enrollment');
// Никогда не проверять через Purchase!
```

### DTO валидация
```typescript
import { IsString, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateNoteDto {
  @IsUUID() lessonId: string;
  @IsString() @IsNotEmpty() text: string;
}
```

### Ошибки
```typescript
throw new NotFoundException(`Course ${id} not found`);
throw new ForbiddenException('No active enrollment');
throw new BadRequestException('Invalid quiz submission');
// Не бросать голые Error(), только NestJS exceptions
```

---

## Workflow изменения домена

```
1. Обновить packages/database/prisma/schema.prisma
2. npm run db:migrate (из корня)
3. npm run db:generate (из корня)
4. Обновить @neuro-academy/types (DTOs/Enums)
5. Обновить Service (новые Prisma queries)
6. Обновить Controller (новые endpoints или response shapes)
7. Проверить: не нарушен ли Enrollment Gate
```

---

## Платёжный флоу (критически важно)

```
POST /payments/invoice/:courseId
  → Создать TG Stars invoice link

[Telegram вызывает webhook]
POST /payments/webhook
  → АТОМАРНО:
     1. Сохранить Purchase (финансовая запись)
     2. Создать Enrollment (доступ)
  → Использовать Prisma.$transaction()

НИКОГДА не создавать Enrollment без Purchase в webhookе
НИКОГДА не проверять доступ через Purchase.status
```

---

## Что запрещено в API

- Логику доступа в Controller (только в Service)
- Прямые SQL запросы в обход Prisma
- Смешивать admin и student endpoints в одном module/controller
- Возвращать пароли, внутренние ID, telegramId в публичных DTO
- Делать endpoint "под один экран фронта" вместо действия над сущностью
- Хранить состояние в памяти сервера (stateless!)
