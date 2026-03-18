'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

/** Вызывает auth при монтировании layout — токен сохраняется в localStorage */
export function AuthInit() {
  useAuth();

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
  }, []);

  return null;
}
