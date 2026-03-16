/**
 * Lesson block content for the AI-model 2.0 course.
 * Contains actual video URLs, text (конспекты) and quiz data.
 *
 * Served from this file until LessonBlock API integration is complete.
 * TODO: Replace with API calls to GET /lessons/:id when lesson blocks are seeded in DB.
 */

export {
  MOCK_COURSE as LESSON_CONTENT,
  EXAM_QUESTIONS,
  EXAM_CONFIG,
} from './mock-courses';

export type {
  LessonBlock,
  VideoBlockData,
  TextBlockData,
  QuizBlockData,
  PdfBlockData,
  ModuleQuizBlockData,
  LearningCourse,
  LearningModule,
  LearningLesson,
  BlockType,
} from './mock-courses';
