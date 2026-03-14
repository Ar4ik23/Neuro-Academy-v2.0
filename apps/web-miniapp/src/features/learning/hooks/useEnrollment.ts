import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';

export const useEnrollment = (courseId?: string) => {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAccess = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await apiClient.get<{ hasAccess: boolean }>(`/enrollments/check/${courseId}`);
      setHasAccess(data.hasAccess);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId) {
      checkAccess();
    }
  }, [courseId, checkAccess]);

  return { hasAccess, loading, error, refresh: checkAccess };
};
