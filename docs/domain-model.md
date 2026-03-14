# Domain Model

## Core Education Entities
- **Course**: Title, description, slug, thumbnail, price, published status.
- **Module**: Grouping of lessons, order, description.
- **Lesson**: Title, order, module ID.
- **LessonBlock**: Content type (text, video, etc.), JSON payload, order.
- **FileAsset**: URL, file type, size, owner ID.

## User & Access
- **User**: Telegram ID, username, roles (user, admin), profile data.
- **Enrollment**: Link between User and Course, access type (trial, paid, admin), expiry date.
- **AccessGrant**: Granular permission level (read, write, audit).

## Progress & Assessment
- **LessonProgress**: Link between User and Lesson, status (unlocked, completed), timestamp.
- **CourseProgress**: Aggregated metrics (percentage, current module).
- **Quiz**: Title, lesson ID, passing score requirements.
- **QuizQuestion**: Text, type (single, multiple), order.
- **QuizOption**: Text, correctness, explanation.
- **QuizAttempt**: Score, user ID, quiz ID, pass status, start/end time.

## Finance & Interaction
- **Purchase**: Amount, currency, provider (Telegram Stars, TON), status, transaction ID.
- **Certificate**: Unique code, generation date, PDF link.
- **Note**: User ID, lesson ID, text, context selection.
- **AIRequest**: User ID, prompt, AI response, token usage, context.
