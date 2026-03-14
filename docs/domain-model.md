# Domain Model Specification: Neuro-Academy v2.0

## 1. Curriculum Domain
The foundational structures representing the educational content.

### 1.1 Course
Represents a standalone educational product.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `title`: String (Display name)
  - `description`: Text (Marketing copy)
  - `thumbnail`: URL (Cover image)
  - `published`: Boolean (Visibility toggle)
  - `price`: Decimal (Cost in units)
- **Relationships**:
  - Has many **Modules** (Ordered)
  - Has many **Enrollments**
  - Has many **Purchases**
  - Has many **CourseProgress** records

### 1.2 Module
A thematic section within a course.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `title`: String
  - `description`: Text
  - `order`: Integer (Sequence position)
- **Relationships**:
  - Belongs to **Course**
  - Has many **Lessons** (Ordered)

### 1.3 Lesson
The primary unit of learning content.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `title`: String
  - `order`: Integer (Sequence position)
- **Relationships**:
  - Belongs to **Module**
  - Has many **LessonBlocks** (Ordered)
  - Optional **Quiz** linkage
  - Has many **LessonProgress** records
  - Has many **Notes**

### 1.4 LessonBlock
Atomic content components that make up a lesson.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `type`: Enum (`TEXT`, `VIDEO`, `IMAGE`, `PDF`, etc.)
  - `content`: JSON (Payload specific to type)
  - `order`: Integer (Render order)
- **Relationships**:
  - Belongs to **Lesson**

## 2. User & Identity Domain
### 2.1 User
A Telegram-verified individual.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `telegramId`: BigInt (Unique identifier from TG)
  - `username`: String (Optional)
  - `firstName`: String
  - `lastName`: String (Optional)
  - `role`: Enum (`USER`, `ADMIN`)
- **Relationships**:
  - Has many **Enrollments**
  - Has many **CourseProgress**
  - Has many **LessonProgress**
  - Has many **Purchases**
  - Has many **Notes**

## 3. Learning & Progress Domain
The bridge between Users and Curriculum.

### 3.1 Enrollment
Decouples the act of purchasing from the permission to learn.
- **Attributes**:
  - `id`: UUID (Primary Key)
  - `type`: Enum (`TRIAL`, `PURCHASED`, `ADMIN_GRANT`)
  - `expiresAt`: DateTime (Optional)
- **Relationships**:
  - Connects **User** to **Course**

### 3.2 LessonProgress
Tracks individual lesson completion status.
- **Attributes**:
  - `status`: Enum (`IN_PROGRESS`, `COMPLETED`)
- **Relationships**:
  - Connects **User** to **Lesson**

### 3.3 CourseProgress
Aggregated completion data for a user's journey in a course.
- **Attributes**:
  - `percentage`: Integer (0-100)
  - `status`: Enum (`IN_PROGRESS`, `COMPLETED`)
- **Relationships**:
  - Connects **User** to **Course**

## 4. Assessment Domain
### 4.1 Quiz
A knowledge check tied to a lesson.
- **Relationships**: One-to-one with **Lesson**.
- **Contains**: Many **QuizQuestions**, each with many **QuizOptions**.

## 5. Financial & Social Domain
### 5.1 Purchase
Historical record of a successful transaction.
- **Attributes**: `amount`, `currency`, `providerTxId`, `status`.
- **Side effects**: Triggers creation of an `Enrollment`.

### 5.2 Note
User-generated lesson annotations.
- **Attributes**: `text`, `highlightedText` (context).

### 5.3 AIRequest
Audit log for AI Helper interactions.
- **Attributes**: `contextText`, `prompt`, `response`.
