import { useState } from 'react';
import { apiClient } from '../../../services/api';

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createInvoice = async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ invoiceUrl: string; purchaseId: string }>('/payments/create-invoice', {
        courseId,
      });
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createInvoice, loading, error };
};
