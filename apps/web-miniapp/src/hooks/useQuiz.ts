import { useState, useCallback } from 'react';
import { apiClient } from '../services/api';
import { QuizDto, QuizSubmissionDto, QuizResultDto } from '@neuro-academy/types';

export const useQuiz = (id: string | undefined) => {
  const [quiz, setQuiz] = useState<QuizDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await apiClient.get<QuizDto>(`/quizzes/${id}`);
      setQuiz(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const submitQuiz = async (submission: QuizSubmissionDto): Promise<QuizResultDto> => {
    if (!id) throw new Error('Quiz ID is missing');
    setLoading(true);
    try {
      const result = await apiClient.post<QuizResultDto>(`/quizzes/${id}/submit`, submission);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { quiz, loading, error, fetchQuiz, submitQuiz };
};
