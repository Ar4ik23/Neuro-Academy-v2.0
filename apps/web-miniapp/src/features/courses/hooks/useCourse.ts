import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';
import type { CourseDetailDto } from '@neuro-academy/types';

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<CourseDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const { data } = await apiClient.get<CourseDetailDto>(`/courses/${id}`);
        setCourse(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading, error };
};
