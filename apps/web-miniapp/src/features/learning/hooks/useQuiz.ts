import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';
import type { QuizDto, QuizResultDto } from '@neuro-academy/types';

export const useQuiz = (quizId?: string) => {
  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultDto | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!quizId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.get<QuizDto>(`/quizzes/${quizId}`);
      setQuiz(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  const submitQuiz = async (answers: { questionId: string; optionId: string }[]) => {
    if (!quizId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.post<QuizResultDto>(`/quizzes/${quizId}/submit`, { answers });
      setResult(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) fetchQuiz();
  }, [quizId, fetchQuiz]);

  return { quiz, loading, error, submitQuiz, result, refresh: fetchQuiz };
};
