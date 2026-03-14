# Domain Model: Neuro-Academy v2.0

## 1. Curriculum Domain
The foundational structure of learning content.

- **Course**: The top-level product. Contains marketing metadata (price, thumbnail, description).
- **Module**: Logical grouping (e.g., "Week 1", "Advanced Techniques").
- **Lesson**: The actionable learning page.
- **LessonBlock**: Atomic content unit. Types: `TEXT`, `VIDEO`, `IMAGE`, `QUIZ_SUMMARY`, etc.

## 2. Learning Domain
Tracks the interaction between a User and the Curriculum.

- **Enrollment**: The "Permission" entity. A user must have an active enrollment to access a course.
  - *Types*: `TRIAL`, `PURCHASED`, `ADMIN_GRANT`.
- **LessonProgress**: Tracks completion of individual lessons.
- **CourseProgress**: Aggregated status (percentage) calculated from completed lessons.

## 3. Assessment Domain
Verification of knowledge.

- **Quiz**: A set of questions attached to a lesson.
- **QuizQuestion**: A prompt with multiple choice `QuizOption`.
- **QuizAttempt**: A record of a user's answers and calculated score. Passing a quiz usually triggers `LessonProgress: COMPLETED`.

## 4. Financial & Social Domain
External and supportive logic.

- **Purchase**: Immutable record of a Telegram Star or TON transaction. Triggers `Enrollment`.
- **Note**: User-specific annotations tied to specific lesson context.
- **AIRequest**: Logging for selection-based AI helper interactions.

## 5. User Domain
- **User**: Telegram-verified identity.
- **Role**: `USER` (Student) or `ADMIN` (Manager).
