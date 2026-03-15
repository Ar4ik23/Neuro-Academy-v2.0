import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import type { CourseProgressDto } from '@neuro-academy/types';

export const useProgress = (courseId?: string) => {
  const [progress, setProgress] = useState<CourseProgressDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.get<CourseProgressDto>(`/progress/course/${courseId}`);
      setProgress(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const markComplete = async (lessonId: string) => {
    try {
      await apiClient.post(`/progress/lesson/${lessonId}/complete`, {});
      await fetchProgress();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to mark lesson complete');
    }
  };

  useEffect(() => {
    if (courseId) fetchProgress();
  }, [courseId, fetchProgress]);

  return { progress, loading, error, markComplete, refresh: fetchProgress };
};
