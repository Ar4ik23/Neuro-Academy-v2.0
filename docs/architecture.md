# Architecture: Neuro-Academy v2.0

## 1. System Vision
Neuro-Academy v2.0 is designed as a high-performance, modular educational platform strictly integrated within the Telegram Mini App ecosystem. The primary focus is on a superior user experience (premium UI), scalability (monorepo structure), and maintainable domain logic.

## 2. Monorepo Organization
We use a workspace-based monorepo to manage applications and shared infrastructure:

### Applications (`apps/`)
- **`api/`**: NestJS monolithic-modular backend. Provides RESTful services.
- **`web-miniapp/`**: Next.js 14 specialized for the Telegram interface. Uses Tailwind CSS and glassmorphism.
- **`admin/`**: Internal management portal for curriculum and analytics.

### Shared Packages (`packages/`)
- **`database/`**: Single source of truth for the Prisma schema and client.
- **`types/`**: Shared TypeScript contracts (DTOs, Enums) ensures API-Frontend sync.
- **`ui/`**: Baseline design tokens and reusable low-level components.
- **`utils/`**: Shared logic (slugification, date formatting, validation).
- **`config/`**: Unified `tsconfig`, `eslint`, and `tailwind` base settings.

## 3. Core Architectural Rules
1. **Rule of Isolation**: Domain modules in `apps/api` must not have cross-service circular dependencies.
2. **Rule of Contracts**: All API communication must use shared DTOs from `@neuro-academy/types`.
3. **Rule of Content**: Lessons are never monolithic strings; they are structured arrays of `LessonBlock`.
4. **Rule of Progress**: User progress is calculated server-side based on atomic lesson completion and total syllabus weight.
5. **Rule of Access**: `Enrollment` is the decoupling layer between payments and course content.

## 4. Scalability Logic
- **Horizontally Scalable API**: Stateless JWT-based authentication.
- **Optimized Content Delivery**: Block-based rendering allows for varying content types (Video, PDF, Quizzes) without UI debt.
- **Relational Integrity**: PostgreSQL ensures strict consistency for user progress and financial records.
