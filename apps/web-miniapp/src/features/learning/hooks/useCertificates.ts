import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../../services/api';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get<any[]>('/certificates');
      setCertificates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const issueCertificate = async (courseId: string) => {
    setLoading(true);
    try {
      const response = await apiClient.post<any>(`/certificates/issue/${courseId}`, {});
      setCertificates(prev => [response, ...prev]);
      return response;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  return { certificates, loading, error, issueCertificate, refresh: fetchCertificates };
};
