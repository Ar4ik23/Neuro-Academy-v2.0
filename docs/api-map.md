# API Map

Root: `/api`

## Auth Domain
- `POST /auth/validate` - Validate TWA initData, return JWT.
- `GET /auth/me` - Get current user profile.

## Content Domain (Public/Authorized)
- `GET /courses` - List published courses.
- `GET /courses/:id` - Detailed course info + modules list.
- `GET /modules/:id/lessons` - List lessons in a module.
- `GET /lessons/:id` - Get lesson content (blocks).

## Progress Domain (Private)
- `GET /progress/:courseId` - Get course completion status.
- `POST /progress/lesson/:id/complete` - Mark lesson as finished.

## Quiz Domain (Private)
- `GET /quizzes/:id` - Get quiz questions.
- `POST /quizzes/:id/submit` - Submit answers and get result.

## Social & AI (Private)
- `POST /notes` - Create a note.
- `GET /notes/:lessonId` - Get notes for a lesson.
- `POST /ai/explain` - Send text for AI explanation.

## Payments (Private)
- `POST /payments/create-invoice` - Create Telegram Stars invoice.
- `POST /payments/webhook` - System webhook for payment updates.

## Admin (Admin Only)
- `POST /admin/courses` - Create/Update course.
- `GET /admin/analytics` - System growth metrics.
- `POST /admin/users/grant-access` - Manual enrollment.
