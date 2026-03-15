import { useState } from 'react';
import { apiClient } from '../../../services/api';
import type { AIExplainDto, AIResponseDto } from '@neuro-academy/types';

export const useAIHelper = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAssistant = async (payload: AIExplainDto): Promise<string | undefined> => {
    setLoading(true);
    setError(null);
    try {
      // API: POST /ai/explain
      const { data } = await apiClient.post<AIResponseDto>('/ai/explain', payload);
      return data.response;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI request failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { requestAssistant, loading, error };
};
