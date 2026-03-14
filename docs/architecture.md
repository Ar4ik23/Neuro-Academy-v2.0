# Architecture Overview: Neuro-Academy v2.0

## 1. Principles
- **Strict Modularity**: Every business domain is a separate logical unit.
- **Micro-Frontend Architecture**: TWA and Admin are separate apps sharing a core UI package.
- **API First**: The backend (NestJS) provides a clean, documented REST interface.
- **Domain Driven Design (DDD) Lite**: Entities, Services, and Controllers are grouped by business domain.

## 2. Technology Stack
- **Frameworks**: NestJS (API), Next.js 14 (TWA & Admin).
- **Language**: TypeScript throughout.
- **ORM**: Prisma for type-safe database access.
- **Database**: PostgreSQL.
- **Styling**: Vanilla CSS / Tailwind (for Admin/TWA layouts).
- **Communication**: REST for client-server.

## 3. Deployment & Scalability
- **Monorepo**: Managed via npm workspaces for shared code.
- **Asset Storage**: Separate S3/Cloud Storage for course materials.
- **Telegram Integration**: WebApp SDK for TWA, Bot API for notifications/payments.
