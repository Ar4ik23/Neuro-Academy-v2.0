# API Map: Neuro-Academy v2.0

## Base URL: `/api`

### Auth
- `POST /auth/login` (body: initData) -> JWT

### Courses
- `GET /courses` (list of published courses)
- `GET /courses/:id` (full course details with modules/lessons summary)

### Lessons
- `GET /lessons/:id` (retrieves all blocks and quiz metadata)
- `POST /lessons/:id/complete` (marks lesson as done)

### Progress
- `GET /progress/:courseId` (percentage and list of completed lessons)

### Quizzes
- `GET /quizzes/:id` (questions)
- `POST /quizzes/:id/submit` (answers) -> score/status

### Admin (Restricted)
- `POST /admin/courses/create`
- `PATCH /admin/lessons/:id`
- `GET /admin/analytics`

### Payments
- `POST /payments/invoice` (creates Stars invoice)
- `POST /payments/webhook` (incoming payment notification)
