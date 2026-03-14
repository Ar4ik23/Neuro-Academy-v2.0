"use client";

import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from './useTelegram';
import { apiClient } from '../services/api';
import { AuthResponseDto, UserDto } from '@neuro-academy/types';

export const useAuth = () => {
  const { initData } = useTelegram();
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    if (!initData) return;

    try {
      setLoading(true);
      const data = await apiClient.post<AuthResponseDto>('/auth/login', { initData });
      
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [initData]);

  useEffect(() => {
    if (initData) {
      login();
    }
  }, [initData, login]);

  return { user, loading, error, refresh: login };
};
