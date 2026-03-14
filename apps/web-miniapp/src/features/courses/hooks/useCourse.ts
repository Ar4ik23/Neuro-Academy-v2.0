import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';

export const useCourse = (id: string) => {
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCourse = async () => {
      try {
        const data = await apiClient.get<any>(`/courses/${id}`);
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  return { course, loading, error };
};
