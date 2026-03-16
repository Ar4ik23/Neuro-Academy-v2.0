/**
 * Course navigation map for AI-model 2.0.
 * Contains the ordered structure of modules and lessons —
 * used by useCourseProgress for progress calculation and lesson navigation.
 * No content here (video URLs, text, quizzes are in lesson-content.ts).
 */

export const COURSE_ID = 'ai-model-2';

interface ModuleMap {
  id: string;
  lessonIds: string[];
}

export const MODULE_MAP: ModuleMap[] = [
  { id: 'm1', lessonIds: ['l1-video', 'l1-text'] },
  { id: 'm2', lessonIds: ['l2-1', 'l2-2', 'l2-3', 'l2-4', 'l2-5', 'l2-6', 'l2-5b', 'l2-5c', 'l2-7', 'l2-8'] },
  { id: 'm3', lessonIds: ['l3-1', 'l3-2', 'l3-3', 'l3-4', 'l3-5', 'l3-6'] },
  { id: 'm4', lessonIds: ['l4-1', 'l4-2', 'l4-3', 'l4-4', 'l4-5', 'l4-6', 'l4-7', 'l4-8', 'l4-9', 'l4-10', 'l4-11'] },
  { id: 'm5', lessonIds: ['l5-1', 'l5-2', 'l5-3', 'l5-4', 'l5-5', 'l5-6', 'l5-7'] },
  { id: 'm6', lessonIds: ['l6-1', 'l6-2', 'l6-3', 'l6-4', 'l6-5', 'l6-6', 'l6-7', 'l6-8', 'l6-9', 'l6-10'] },
];

export const TOTAL_LESSONS = MODULE_MAP.reduce((acc, m) => acc + m.lessonIds.length, 0); // 46

export interface LessonEntry {
  lessonId: string;
  moduleId: string;
}

export function getOrderedLessons(): LessonEntry[] {
  return MODULE_MAP.flatMap((m) =>
    m.lessonIds.map((lessonId) => ({ lessonId, moduleId: m.id }))
  );
}

export function findNextLesson(currentLessonId: string): { lessonId: string | null; moduleId: string | null } {
  const lessons = getOrderedLessons();
  const idx = lessons.findIndex((l) => l.lessonId === currentLessonId);
  if (idx === -1 || idx >= lessons.length - 1) return { lessonId: null, moduleId: null };
  return { lessonId: lessons[idx + 1].lessonId, moduleId: lessons[idx + 1].moduleId };
}

export function getLastLesson(): LessonEntry {
  const lessons = getOrderedLessons();
  return lessons[lessons.length - 1];
}
