import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';

export const useLesson = (id: string) => {
  const [lesson, setLesson] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLesson = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiClient.get<any>(`/lessons/${id}`);
      setLesson(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLesson();
  }, [fetchLesson]);

  return { lesson, loading, error, refresh: fetchLesson };
};

export const useProgress = (courseId?: string) => {
  const [progress, setProgress] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await apiClient.get<any>(`/progress/course/${courseId}`);
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const completeLesson = async (lessonId: string) => {
    try {
      await apiClient.post(`/progress/lesson/${lessonId}/complete`, {});
      if (courseId) await fetchProgress();
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchProgress();
    }
  }, [courseId, fetchProgress]);

  return { progress, loading, error, completeLesson, refresh: fetchProgress };
};
