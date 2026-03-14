# Domain Model: Neuro-Academy v2.0

## 1. Core Entities
### User
- Identity (Telegram ID)
- Profile (Name, Bio)
- Role (User, Admin)

### Educational Content
- **Course**: Title, Image, Price, Category.
- **Module**: Thematic grouping of lessons within a course.
- **Lesson**: The primary learning unit.
- **LessonBlock**: Content inside a lesson (Text, Video, Quote, etc.).

### Assessment
- **Quiz**: Collection of questions tied to a lesson.
- **QuizQuestion**: Text + Options.
- **QuizAttempt**: Score, Time, Status.

## 2. Business Logic Entities
### Enrollment / Access
- **AccessGrant**: Links a User to a Course.
- **EnrollmentType**: TRIAL, PURCHASED, ADMIN_GRANT.

### Progress Tracking
- **LessonProgress**: COMPLETED, IN_PROGRESS.
- **CourseProgress**: Cumulative % calculation.

### Financials
- **Purchase**: Payment record, status, provider transaction ID.
- **PriceAdjustment**: Discounts/Campaigns (future).

### User Interaction
- **Note**: User's private text tied to a lesson.
- **AIRequest**: Logging for the AI Assistant's context and response.
