# Product Scope: Neuro-Academy v2.0

## 1. Project Vision
Neuro-Academy v2.0 is a premium educational platform engineered specifically for the Telegram Mini App (TWA) ecosystem. It leverages Telegram's native functionality to deliver a high-quality, interactive learning experience that feels native to the user's messaging environment.

## 2. Target Audience
- **Students**: Seeking advanced knowledge in neuro-technologies and personal growth through a convenient mobile-first interface.
- **Instructors/Admins**: Managing curriculum, tracking student progress, and analyzing engagement through a specialized dashboard.

## 3. Core Features (MVP)
### 3.1 Course Discovery & Management
- **Universal Catalog**: A sleek, card-based interface for browsing available neuro-courses.
- **Dynamic Curriculum**: Courses divided into modules and lessons with flexible block-based content.
- **Enrollment Layer**: Decoupled access management allowing for Trial, Purchased, and Admin-granted access.

### 3.2 Learning Experience
- **Interactive Lesson Renderer**: Supports multiple content types (Video, Markdown Text, PDF, Quotes, Checklists).
- **In-Lesson AI Helper**: Selection-based context explanations using LLMs to clarify complex neuro-scientific terms.
- **Knowledge Assessment**: Integrated quizzes with automatic scoring and progress gating.
- **Personal Notes**: Encrypted, lesson-specific annotations for students.

### 3.3 Progress & Analytics
- **Granular Progress Tracking**: Status updates per lesson and aggregated course completion percentage.
- **Admin Dashboard**: Comprehensive control over content creation, user enrollment management, and financial reporting.

### 3.4 Financials
- **Telegram Stars Integration**: Native, frictionless payment system for purchasing course access.

## 4. Technical Constraints
- **Platform**: Must run seamlessly within Telegram (Android, iOS, Desktop).
- **Design**: Strict adherence to "Aurora Bloom" premium design guidelines (glassmorphism, vibrant gradients).
- **Performance**: Near-instant loading states and optimized content delivery for mobile networks.

## 5. Non-Functional Requirements
- **Scalability**: Monorepo structure capable of supporting multiple related platforms (TWA, Admin, API).
- **Security**: JWT-based authentication validated via Telegram `initData`.
- **Maintainability**: Strict domain-driven architecture with shared TypeScript types.