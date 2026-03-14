import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';

export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const data = await apiClient.get<any>(`/quizzes/${quizId}`);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const submitQuiz = async (answers: { questionId: string; optionId: string }[]) => {
    if (!quizId) return;
    setLoading(true);
    try {
      const response = await apiClient.post<any>(`/quizzes/${quizId}/submit`, {
        answers,
      });
      setResult(response);
      return response;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId, fetchQuiz]);

  return { quiz, loading, error, submitQuiz, result, refresh: fetchQuiz };
};
