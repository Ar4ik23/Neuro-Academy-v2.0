import { useState, useEffect } from 'react';
import { apiClient } from '../../../services/api';

export const useLesson = (id: string) => {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLesson = async () => {
      try {
        const data = await apiClient.get<any>(`/lessons/${id}`);
        setLesson(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [id]);

  return { lesson, loading, error };
};
