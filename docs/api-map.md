# API Specification: Neuro-Academy v2.0

## 1. Authentication (`/auth`)
- **`POST /auth/login`**: Validates Telegram `initData`. Returns JWT.
  - *Response*: `{ accessToken: string, user: UserDto }`

## 2. Curriculum (`/courses`, `/lessons`)
- **`GET /courses`**: List of all published courses.
- **`GET /courses/:id`**: Detailed course syllabus including modules and lesson summaries.
- **`GET /lessons/:id`**: Complete lesson content (blocks) + Quiz summary.
  - *Internal*: Validates that user has an active `Enrollment`.

## 3. Progress & Learning (`/progress`, `/enrollments`)
- **`GET /progress/:courseId`**: Returns user's course completion percentage.
- **`POST /progress/lesson/:id/complete`**: Marks a lesson as finished. Recalculates course progress.
- **`GET /enrollments`**: List of user-owned courses and their types (TRIAL/PURCHASED).

## 4. Assessments (`/quizzes`)
- **`GET /quizzes/:id`**: Returns quiz questions (blocks).
- **`POST /quizzes/:id/submit`**: Submits user answers. Returns score.
  - *Side Effect*: If `score >= passingScore`, marks linked lesson as completed.

## 5. Social & AI (`/notes`, `/ai`)
- **`POST /notes`**: Create a new personal annotation.
- **`GET /notes/:lessonId`**: Retrieve personal notes for a specific lesson.
- **`POST /ai/explain`**: Request an AI summary of highlighted text within a lesson context.

## 6. Financials (`/payments`)
- **`POST /payments/invoice/:courseId`**: Generates a Telegram Star payment invoice.
- **`POST /payments/webhook`**: Handler for provider-sent transaction updates.
