'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getCourseProgress,
  startCourse,
  completeLesson,
  completeModule,
  resetCourseProgress,
  CourseProgressData,
} from '@/store/courseProgress';
import { TOTAL_LESSONS, findNextLesson as findNextFromMap } from '@/data/course-map';

export function resetProgress(courseId: string): void {
  resetCourseProgress(courseId);
}

function getTotalLessons(): number {
  return TOTAL_LESSONS;
}

export function findNextLesson(currentLessonId: string): {
  lessonId: string | null;
  moduleId: string | null;
} {
  return findNextFromMap(currentLessonId);
}

export function useCourseProgress(courseId: string) {
  const [progress, setProgress] = useState<CourseProgressData | null>(null);
  const [percent, setPercent] = useState(0);
  const totalLessons = getTotalLessons();

  const refresh = useCallback(async () => {
    const p = await getCourseProgress(courseId);
    setProgress(p);
    setPercent(p ? Math.round((p.completedLessonIds.length / totalLessons) * 100) : 0);
  }, [courseId, totalLessons]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const start = useCallback(
    async (firstLessonId: string, firstModuleId: string) => {
      await startCourse(courseId, firstLessonId, firstModuleId);
      await refresh();
    },
    [courseId, refresh],
  );

  const complete = useCallback(
    async (lessonId: string) => {
      const { lessonId: nextLessonId, moduleId: nextModuleId } = findNextLesson(lessonId);
      await completeLesson(courseId, lessonId, nextLessonId, nextModuleId);
      await refresh();
    },
    [courseId, refresh],
  );

  const completeModuleById = useCallback(
    async (moduleId: string) => {
      await completeModule(courseId, moduleId);
      await refresh();
    },
    [courseId, refresh],
  );

  const isStarted = progress !== null;
  const isCompleted = (id: string) => progress?.completedLessonIds.includes(id) ?? false;

  return { progress, percent, isStarted, isCompleted, start, complete, completeModuleById, refresh };
}
