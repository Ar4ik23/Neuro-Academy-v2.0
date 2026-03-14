import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';

export const useProgress = (courseId?: string) => {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await apiClient.get<any>(`/progress/${courseId}`);
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const markComplete = async (lessonId: string) => {
    try {
      await apiClient.post(`/progress/lesson/${lessonId}/complete`, {});
      await fetchProgress(); // Refresh stats
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchProgress();
    }
  }, [courseId, fetchProgress]);

  return { progress, loading, error, markComplete, refresh: fetchProgress };
};
