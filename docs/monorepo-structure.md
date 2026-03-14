# Monorepo Structure Specification: Neuro-Academy v2.0

## 1. Directory Blueprint
```text
neuro-academy-v2/
├── apps/
│   ├── api/             # NestJS Backend (Domain logic, Persistence, Bot API)
│   ├── web-miniapp/     # Next.js 14 TWA (Student UI, Glassmorphism, Framer Motion)
│   └── admin/           # Next.js 14 Admin Panel (Management, Analytics)
├── packages/
│   ├── database/        # Shared Prisma schema, Client generation, and Database index
│   ├── types/           # Shared TypeScript Contracts (DTOs, Enums, Interfaces)
│   ├── ui/              # Shared UI Design System (Tailwind primitives, React components)
│   ├── config/          # Shared Configuration (Tsconfig base, Eslint rules)
│   └── utils/           # Shared Functional Utilities (Slugify, Date formatting)
├── docs/                # Technical Specifications & Guidelines
├── package.json         # Root orchestrator (Monorepo scripts, Workspace management)
└── tsconfig.base.json   # Global TypeScript base configuration
```

## 2. Dependency Matrix
- **`apps/api`**: Consumes `@neuro-academy/database`, `@neuro-academy/types`, `@neuro-academy/utils`.
- **`apps/web-miniapp`**: Consumes `@neuro-academy/ui`, `@neuro-academy/types`, `@neuro-academy/utils`.
- **`apps/admin`**: Consumes `@neuro-academy/ui`, `@neuro-academy/types`, `@neuro-academy/utils`.

## 3. Core Workspace Rules
1. **Vertical Isolation**: Apps should never import from other apps. Communication is strictly via API.
2. **Shared Contract First**: Any changes to data structures must be applied to `@neuro-academy/types` before implementation in apps.
3. **Ghost Package Prohibition**: Shared packages must always contain active `src` directories and baseline logic; placeholder folders are forbidden.
