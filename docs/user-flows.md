# User Flows: Neuro-Academy v2.0

## 1. Authorization & Onboarding
1. User enters the Telegram Bot.
2. Bot provides a button to open the Mini App.
3. Mini App initializes, validates `initData` with the API.
4. User is auto-logged in (or created in the DB).

## 2. Course Discovery & Learning
1. User browses the Course Catalog.
2. User selects a Course.

### Enrollment & Access
1. User selects a course.
2. System checks `Enrollment`.
3. If not enrolled, user sees "Purchase" button.
4. After purchase (Telegram Stars/TON), an `Enrollment` record is created.

4. User views Modules and starts a Lesson.
5. User consumes `LessonBlocks`.
6. Lesson is marked as "Completed" upon reading all blocks or passing a Quiz.

## 3. Purchase Flow (Stars/TON)
1. User selects "Buy Course".
2. API generates a Telegram Stars invoice.
3. User pays within the Telegram interface.
4. Telegram Webhook notifies the API.
5. API creates a `Purchase` record and grants Course Access.

## 4. AI Assistant Interaction
1. User highlights text within a Lesson.
2. User clicks "Explain" or "Summarize".
3. TWA sends the highlighted text + lesson context to the API.
4. API calls the LLM and returns the response.
5. Response is displayed in an overlay.
