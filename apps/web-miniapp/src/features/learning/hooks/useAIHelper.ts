import { useState } from 'react';
import { apiClient } from '../../../services/api';

export const useAIHelper = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAssistant = async (data: { contextText: string; prompt: string; selection?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<any>('/ai/request', data);
      return response.response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { requestAssistant, loading, error };
};
