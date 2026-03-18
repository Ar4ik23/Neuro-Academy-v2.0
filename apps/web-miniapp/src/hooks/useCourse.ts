'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import { MOCK_COURSES } from '@/data/mock-courses';
import { LESSON_CONTENT } from '@/data/lesson-content';
import type { CourseDto, CourseDetailDto, ModuleDto, LessonSummaryDto } from '@neuro-academy/types';

/* ── Mock → DTO adapters (fallback when API is unavailable) ─────────────── */

// Build a lessonType lookup from the detailed LESSON_CONTENT (has type per lesson)
function buildLessonTypeMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const mod of LESSON_CONTENT.modules) {
    for (const lesson of mod.lessons) {
      if (lesson.type) map[lesson.id] = lesson.type;
    }
  }
  return map;
}

function adaptToCourseDtoList(): CourseDto[] {
  return MOCK_COURSES.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnail: c.thumbnail,
    published: true,
    price: 0,
    category: c.category,
    subtitle: c.subtitle,
    fullDescription: c.fullDescription,
    status: c.status,
    tags: c.tags,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  }));
}

function adaptToCourseDetailDto(courseId: string): CourseDetailDto | null {
  const mock = MOCK_COURSES.find((c) => c.id === courseId);
  if (!mock) return null;

  const lessonTypeMap = buildLessonTypeMap();

  const modules = mock.modules.map((mod, modIdx): ModuleDto & { lessons: LessonSummaryDto[] } => ({
    id: mod.id,
    courseId: mock.id,
    title: mod.title,
    description: mod.description,
    order: modIdx,
    emoji: mod.icon,
    isFree: mod.isFree ?? false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    lessons: mod.lessons.map((l): LessonSummaryDto => ({
      id: l.id,
      moduleId: mod.id,
      title: l.title,
      order: l.order,
      lessonType: lessonTypeMap[l.id],
      duration: undefined,
      isFree: l.isFree ?? false,
    })),
  }));

  return {
    id: mock.id,
    title: mock.title,
    description: mock.description,
    thumbnail: mock.thumbnail,
    published: true,
    price: 0,
    category: mock.category,
    subtitle: mock.subtitle,
    fullDescription: mock.fullDescription,
    status: mock.status,
    tags: mock.tags,
    createdAt: new Date(0),
    updatedAt: new Date(0),
    modules,
  };
}

/* ── Hooks ──────────────────────────────────────────────────────────────── */

/**
 * Fetches the full course structure (modules + lessons) from the real API.
 * Falls back to mock data if the API is unavailable.
 */
export function useCourse(courseId: string) {
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    apiClient
      .get<CourseDetailDto>(`/courses/${courseId}`)
      .then((r) => setCourse(r.data))
      .catch(() => {
        // API unavailable — fall back to mock data
        setCourse(adaptToCourseDetailDto(courseId));
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  return { course, loading, error };
}

/**
 * Fetches the list of published courses from the real API.
 * Falls back to mock data if the API is unavailable.
 */
export function useCoursesList() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<CourseDto[]>('/courses')
      .then((r) => setCourses(r.data))
      .catch(() => {
        // API unavailable — fall back to mock data
        setCourses(adaptToCourseDtoList());
      })
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}
