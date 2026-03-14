# User Flows

## 1. Onboarding & Authentication
1. User opens Telegram Mini App via bot or link.
2. App reads `window.Telegram.WebApp.initData`.
3. Frontend sends initData to `POST /api/auth/validate`.
4. Backend verifies hash, finds or creates User, returns JWT.
5. User enters Dashboard.

## 2. Course Discovery & Enrollment
1. User browses Core Catalog.
2. User clicks on a Course.
3. System checks for active `Enrollment`.
4. If not enrolled, User sees "Lock" icon or Pricing.
5. User completes payment flow (Telegram Stars).
6. Success webhook creates `Enrollment`.
7. User can now access Modules.

## 3. Learning Path
1. User opens a Lesson.
2. Frontend fetches `LessonBlocks` for the lesson.
3. User interacts with blocks (reads text, watches video).
4. User clicks "Mark as Complete".
5. Request sent to `POST /api/progress/lesson/:id/complete`.
6. System checks if this was the last lesson in a Module/Course.
7. If Course complete, `Certificate` is generated.

## 4. Assessment (Quiz)
1. Lesson ends with a mandatory Quiz.
2. User answers questions.
3. Submission to `POST /api/quizzes/:id/submit`.
4. If passed, Lesson marked as complete.
5. If failed, User can re-attempt.

## 5. Interaction (Notes & AI)
1. User highlights text in a lesson.
2. User selects "Ask AI" or "Create Note".
3. AI flow: Prompt sent to `POST /api/ai/explain`, response displayed.
4. Note flow: text saved to `POST /api/notes`.
5. User can view all notes in "My Notes" section.
