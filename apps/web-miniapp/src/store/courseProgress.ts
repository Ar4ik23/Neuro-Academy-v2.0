/**
 * Course progress store.
 * Primary: API calls (POST /progress/...).
 * Fallback: localStorage when API is unavailable (no auth or network error).
 */

import { apiClient } from '@/services/api';
import type { CourseProgressDetailDto } from '@neuro-academy/types';

/* ── Shared interface ────────────────────────────────────────────────────── */

export interface CourseProgressData {
  courseId: string;
  completedLessonIds: string[];
  completedModuleIds: string[];
  currentLessonId: string | null;
  currentModuleId: string | null;
}

/* ── localStorage helpers (fallback) ────────────────────────────────────── */

const LS_KEY = 'na_course_progress';

function lsGetAll(): Record<string, CourseProgressData> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}

function lsSave(courseId: string, data: CourseProgressData) {
  const all = lsGetAll();
  all[courseId] = data;
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

function lsGet(courseId: string): CourseProgressData | null {
  return lsGetAll()[courseId] ?? null;
}

function lsDelete(courseId: string) {
  const all = lsGetAll();
  delete all[courseId];
  localStorage.setItem(LS_KEY, JSON.stringify(all));
}

function apiToLocal(dto: CourseProgressDetailDto): CourseProgressData {
  return {
    courseId: dto.courseId,
    completedLessonIds: dto.completedLessonIds,
    completedModuleIds: dto.completedModuleIds,
    currentLessonId: dto.currentLessonId,
    currentModuleId: dto.currentModuleId,
  };
}

/* ── Public API ──────────────────────────────────────────────────────────── */

export async function getCourseProgress(courseId: string): Promise<CourseProgressData | null> {
  try {
    const { data } = await apiClient.get<CourseProgressDetailDto | null>(
      `/progress/course/${courseId}`,
    );
    if (!data) return null;
    const local = apiToLocal(data);
    lsSave(courseId, local); // keep localStorage in sync
    return local;
  } catch {
    return lsGet(courseId);
  }
}

export async function startCourse(
  courseId: string,
  firstLessonId: string,
  firstModuleId: string,
): Promise<void> {
  const initial: CourseProgressData = {
    courseId,
    completedLessonIds: [],
    completedModuleIds: [],
    currentLessonId: firstLessonId,
    currentModuleId: firstModuleId,
  };

  // Optimistically write to localStorage immediately
  if (!lsGet(courseId)) lsSave(courseId, initial);

  try {
    await apiClient.post(`/progress/course/${courseId}/start`, { firstLessonId });
  } catch {
    // localStorage already updated — fine for offline
  }
}

export async function completeLesson(
  courseId: string,
  lessonId: string,
  nextLessonId: string | null,
  nextModuleId: string | null,
): Promise<void> {
  // Optimistic localStorage update
  const local = lsGet(courseId);
  if (local) {
    if (!local.completedLessonIds.includes(lessonId)) {
      local.completedLessonIds.push(lessonId);
    }
    if (nextLessonId && nextModuleId && nextModuleId !== local.currentModuleId) {
      if (!local.completedModuleIds.includes(local.currentModuleId ?? '')) {
        if (local.currentModuleId) local.completedModuleIds.push(local.currentModuleId);
      }
    }
    local.currentLessonId = nextLessonId;
    local.currentModuleId = nextModuleId ?? local.currentModuleId;
    lsSave(courseId, local);
  }

  try {
    await apiClient.post(`/progress/lesson/${lessonId}/complete`);
  } catch {
    // localStorage already updated — fine for offline
  }
}

export async function completeModule(courseId: string, moduleId: string): Promise<void> {
  // Module completion is derived on the API from LessonProgress.
  // Just update localStorage optimistically.
  const local = lsGet(courseId);
  if (local && !local.completedModuleIds.includes(moduleId)) {
    local.completedModuleIds.push(moduleId);
    lsSave(courseId, local);
  }
}

export async function resetCourseProgress(courseId: string): Promise<void> {
  lsDelete(courseId);
  try {
    await apiClient.delete(`/progress/course/${courseId}`);
  } catch {
    // localStorage already cleared
  }
}

export function calcPercent(courseId: string, totalLessons: number): number {
  const progress = lsGet(courseId);
  if (!progress || totalLessons === 0) return 0;
  return Math.round((progress.completedLessonIds.length / totalLessons) * 100);
}
