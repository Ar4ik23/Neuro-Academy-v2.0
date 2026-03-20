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
        // Not in Telegram Mini App — use saved token if available
        console.warn('[Auth] initData missing. Diagnostics:', getTelegramDiagnostics());
        if (savedToken) {
          window.dispatchEvent(new Event('auth-completed'));
        }
        setLoading(false);
        return;
      }

      // In Telegram — always re-authenticate with fresh initData
      // (saved JWT may be expired; Telegram provides fresh initData every time)
      try {
        const response = await apiClient.post<AuthResponseDto>('/auth/login', { initData });
        const { token, user: loggedInUser } = response.data;
        localStorage.setItem('auth_token', token);
        window.dispatchEvent(new Event('auth-completed'));
        setUser(loggedInUser);
      } catch (err) {
        console.error('[Auth] Login failed:', err);
        // If re-auth failed but we had a saved token, still notify listeners
        if (savedToken) {
          window.dispatchEvent(new Event('auth-completed'));
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return { user, loading };
};
