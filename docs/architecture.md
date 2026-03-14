# Architecture Specification: Neuro-Academy v2.0

## 1. System Overview
Neuro-Academy v2.0 is a modern, full-stack monorepo application designed to live within the Telegram ecosystem. It follows a modular architecture that separates business domains from UI representations and infrastructure.

## 2. Monorepo Organization (npm Workspaces)
The project is structured to maximize code reuse while maintaining strict boundaries between applications and shared logic.

### 2.1 Applications (`apps/`)
- **`api/` (NestJS)**: The central backbone. Handles all domain logic, persistence via Prisma, and external integrations (Telegram Bot API, Stars).
- **`web-miniapp/` (Next.js 14)**: The student interface. A high-performance TWA optimized for mobile interaction.
- **`admin/` (Next.js 14)**: The manager's cockpit. Focused on content management and analytics.

### 2.2 Shared Packages (`packages/`)
- **`database/`**: Logic-less layer containing the Prisma schema and generated client. Ensures type-safe DB access across all services.
- **`types/`**: The "Contract" of the system. Shared TypeScript interfaces (DTOs, Enums) that ensure the API and Frontends speak the same language.
- **`ui/`**: Atomic design system. Contains primitive components (Buttons, Inputs, Glass containers) used by all frontends.
- **`utils/`**: Pure functional helpers (Validation, Formatting, Cryptography) with zero external dependencies.
- **`config/`**: Shared development environment settings (ESLint base, Tsconfig base).

## 3. Communication Patterns
### 3.1 Client to Server
- **RESTful API**: Standard communication between TWA/Admin and the NestJS backend.
- **Authentication**: JWT tokens issued upon validation of Telegram `initData`. HMAC-SHA256 signature verification is mandatory for every request.

### 3.2 Internal (Package-to-App)
- **Direct Workspace Imports**: Apps import packages via their namespaced aliases (e.g., `@neuro-academy/types`).

## 4. Architectural Constraints & Rules
- **Domain Decoupling**: Business logic must reside in `api` services. Frontends are purely representational.
- **Rule of Enrollment**: Access to content must always be checked against the `Enrollment` entity, never directly against `Purchase` history.
- **Block-Based Content**: Lesson content must never be hard-coded. It must always be stored and retrieved as a structured array of `LessonBlock`.
- **Statelessness**: The API must remain stateless, relying on JWTs and the database for all user context.

## 5. Technology Stack
- **Backend**: NestJS, Prisma ORM, Passport.js (JWT).
- **Frontend**: Next.js 14 (App Router), Tailwind CSS (Vanilla CSS variables), Framer Motion.
- **Database**: PostgreSQL (Relational integrity for financials/progress).
- **Infrastructure**: Telegram Mini App SDK.

## 6. Deployment & Dev-Ops
- **Standardized Scripts**: All critical operations (database migration, generation, development environment) are unified in the root `package.json`.
- **Type Safety**: Any change to the domain model must be reflected in `@neuro-academy/types` before being consumed by apps, preventing runtime contract breaks.
