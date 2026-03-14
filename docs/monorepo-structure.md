# Monorepo Structure: Neuro-Academy v2.0

```text
neuro-academy-v2/
├── apps/
│   ├── api/             # NestJS Backend
│   ├── web-miniapp/     # Next.js Telegram Mini App
│   └── admin/           # Next.js Admin Panel
├── packages/
│   ├── database/        # Prisma Schema & Client
│   ├── types/           # Shared TypeScript interfaces
│   ├── ui/              # Shared React Components
│   ├── config/          # Shared Eslint/Tsconfig/Tailwind config
│   └── utils/           # Shared utility functions
├── docs/                # Architecture & Design Docs
├── package.json         # Root scripts & workspaces
└── tsconfig.base.json   # Base TypeScript configuration
```

## Internal Dependencies
- `api` depends on `database`, `types`, `utils`.
- `web-miniapp` depends on `ui`, `types`, `utils`.
- `admin` depends on `ui`, `types`, `utils`.
