# System Architecture

## Overview
Neuro-Academy v2.0 is designed as a modular educational platform served through a Telegram Mini App. The architecture prioritizes strict separation of concerns, scalability, and maintainability.

## Core Principles
1.  **Strict Domain Isolation**: Every functional area (courses, progress, payments, etc.) is a self-contained module. Modules do not share business logic directly; communication happens through defined interfaces or services.
2.  **Stateless API**: The backend is a stateless REST API, ensuring horizontal scalability.
3.  **Content-Progress Decoupling**: Educational content (lessons, blocks) is treated as a static/immutable resource relative to user-specific progress, which is stored in a separate tracking domain.
4.  **Enrollment-Based Access**: Access to content is managed by an `Enrollment` entity. Purchases create enrollments, but are not synonymous with them.
5.  **Polymorphic Content**: Lessons are heterogeneous containers of `LessonBlocks`. This allows for various content types (video, text, quiz) without schema changes to the `Lesson` entity.

## Component Layout
- **Frontend (TWA)**: Next.js application using a feature-based structure.
- **Backend (API)**: NestJS application with domain-driven modularity.
- **Admin Panel**: Separate management interface for content and analytics.
- **Database**: PostgreSQL with Prisma ORM for type-safe data access.
- **Shared Packages**: Local packages for shared types, configurations, and UI components across apps.

## Scalability Strategy
- **Database**: Relational structure with clear foreign keys and indices for performance.
- **Assets**: All binary assets (video, images, pdfs) are stored in object storage (S3), with references in the database (`FileAsset`).
- **AI**: Asynchronous integration for AI requests to ensure platform responsiveness.
