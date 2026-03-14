"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { AuthResponseDto } from '@neuro-academy/types';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponseDto['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check if we have a token in localStorage
      const savedToken = localStorage.getItem('auth_token');
      
      // 2. Get initData from Telegram WebApp
      const tg = (window as any).Telegram?.WebApp;
      const initData = tg?.initData || '';

      if (!initData && !savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.post<AuthResponseDto>('/auth/login', {
          initData: initData || 'DEBUG_DATA' // Fallback for local dev if needed
        });

        const { token, user: loggedInUser } = response.data;
        localStorage.setItem('auth_token', token);
        setUser(loggedInUser);
      } catch (error) {
        console.error('Auth failed', error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return { user, loading };
};
