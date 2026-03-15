import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import type { LessonDetailDto } from '@neuro-academy/types';

export const useLesson = (id: string) => {
  const [lesson, setLesson] = useState<LessonDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      try {
        const { data } = await apiClient.get<LessonDetailDto>(`/lessons/${id}`);
        setLesson(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load lesson');
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  return { lesson, loading, error };
};
