# API Specification: Neuro-Academy v2.0

## 1. General Principles
- **Base URL**: `/api` (Backend running on port 3001).
- **Format**: All requests/responses use JSON.
- **Auth**: Bearer Token (JWT) in `Authorization` header.

## 2. Authentication Domain (`/auth`)
Handles identity verification via Telegram.

### 2.1 Login
- **Endpoint**: `POST /auth/login`
- **Body**: `{ initData: string }` (The string provided by TG Webview).
- **Returns**: `{ accessToken: string, user: UserDto }`.
- **Logic**: Backend validates the signature against the `BOT_TOKEN`.

## 3. Curriculum Domain (`/courses`, `/lessons`)
Retrieves structured educational content.

### 3.1 List Courses
- **Endpoint**: `GET /courses`
- **Returns**: `CourseDto[]` (Only `published: true` courses).

### 3.2 Course Detail
- **Endpoint**: `GET /courses/:id`
- **Returns**: `CourseDetailDto` (Incl. Modules and Lesson summaries).

### 3.3 Lesson Content
- **Endpoint**: `GET /lessons/:id`
- **Returns**: `LessonDetailDto` (Incl. ordered `LessonBlocks` and Quiz metadata).
- **Constraint**: Requires active `Enrollment` for the parent course.

## 4. Learning Domain (`/progress`, `/enrollments`)
Tracks the user's educational journey.

### 4.1 Get Course Progress
- **Endpoint**: `GET /progress/:courseId`
- **Returns**: `CourseProgressDto`.

### 4.2 Complete Lesson
- **Endpoint**: `POST /progress/lesson/:id/complete`
- **Side Effects**: Sets `LessonProgress: COMPLETED`, recalculates `CourseProgress.percentage`.

### 4.3 My Enrollments
- **Endpoint**: `GET /enrollments`
- **Returns**: `EnrollmentDto[]` (Courses user has access to).

## 5. Assessment Domain (`/quizzes`)
### 5.1 Get Quiz
- **Endpoint**: `GET /quizzes/:id`
- **Returns**: `QuizDto` (Questions and options).

### 5.2 Submit Quiz
- **Endpoint**: `POST /quizzes/:id/submit`
- **Body**: `{ answers: { questionId: string, optionId: string }[] }`
- **Returns**: `{ passed: boolean, score: number }`.

## 6. Financial Domain (`/payments`)
### 6.1 Create Invoice
- **Endpoint**: `POST /payments/invoice/:courseId`
- **Returns**: `{ invoiceLink: string }` (Telegram Stars invoice).

### 6.2 Provider Webhook
- **Endpoint**: `POST /payments/webhook`
- **Logic**: Atomic update: Saves `Purchase` record -> Creates `Enrollment`.

## 7. Social Domain (`/notes`, `/ai`)
### 7.1 Notes Management
- **`GET /notes/:lessonId`**: List user's notes for a lesson.
- **`POST /notes`**: Save a new note.

### 7.2 AI Helper
- **Endpoint**: `POST /ai/explain`
- **Body**: `{ contextText: string, prompt: string }`
- **Returns**: `{ response: string }`.
