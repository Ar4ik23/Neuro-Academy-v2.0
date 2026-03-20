"use client";

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import { waitForTelegramSDK, getTelegramDiagnostics } from '@/lib/telegram';
import type { AuthResponseDto } from '@neuro-academy/types';

export const useAuth = () => {
  const [user, setUser] = useState<AuthResponseDto['user'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');

      // Wait up to 3 s for Telegram SDK (covers beforeInteractive script + TWA injection)
      const twa = await waitForTelegramSDK(3000);
      const initData = twa?.initData ?? '';

      if (!initData) {
        // Not in Telegram Mini App — proceed with saved token if any
        console.warn('[Auth] initData missing. Diagnostics:', getTelegramDiagnostics());
        setLoading(false);
        return;
      }

      if (savedToken) {
        // Already authenticated in this session — skip re-login
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.post<AuthResponseDto>('/auth/login', { initData });
        const { token, user: loggedInUser } = response.data;
        localStorage.setItem('auth_token', token);
        window.dispatchEvent(new Event('auth-completed'));
        setUser(loggedInUser);
      } catch (err) {
        console.error('[Auth] Login failed:', err);
        // Keep existing token intact — it may still be valid
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return { user, loading };
};
