# Monorepo Structure

The project uses a standard monorepo layout with `npm workspaces`.

## Directory Overview
```text
neuro-academy/
├── apps/
│   ├── web-miniapp/     # Next.js App for Telegram
│   ├── admin/           # Admin dashboard (Next.js/React)
│   └── api/             # NestJS Backend API
├── packages/
│   ├── ui/              # Shared React components (Shadcn UI)
│   ├── config/          # Shared ESLint, TSConfig, etc.
│   ├── database/        # Prisma schema and shared client
│   ├── types/           # Shared TypeScript interfaces/enums
│   └── utils/           # Helper functions and constants
├── docs/                # Architecture and design documentation
└── package.json         # Workspace configuration
```

## Package Responsibilities

### `packages/types`
- Domain-specific types (e.g., `Course`, `LessonBlock`).
- API request/response DTOs.
- Enums for statuses and roles.

### `packages/database`
- Single source of truth for the Prisma schema.
- Exports a pre-configured `PrismaClient` singleton.
- Handles migrations.

### `packages/ui`
- Visual foundation: button, input, card, etc.
- Standardized lesson block components.

### `packages/config`
- Centralized build and linting rules to ensure consistency across apps.
