'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';

export function useVipStatus(courseId: string) {
  const [isVip, setIsVip] = useState(() => {
    // Быстрая проверка из localStorage при инициализации
    if (typeof window === 'undefined') return false;
    const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
    return vip.includes(courseId);
  });

  useEffect(() => {
    const checkLocal = () => {
      const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
      setIsVip(vip.includes(courseId));
    };

    // Проверяем API если есть токен
    const checkApi = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;
      try {
        const res = await apiClient.get<{ hasAccess: boolean }>(`/enrollments/check/${courseId}`);
        if (res.data.hasAccess) {
          // Синхронизируем с localStorage
          const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
          if (!vip.includes(courseId)) {
            vip.push(courseId);
            localStorage.setItem('na_vip', JSON.stringify(vip));
          }
          setIsVip(true);
        }
      } catch {
        // Нет интернета или нет токена — используем localStorage
      }
    };

    checkLocal();
    checkApi();

    window.addEventListener('storage', checkLocal);
    window.addEventListener('vip-status-changed', checkLocal);
    return () => {
      window.removeEventListener('storage', checkLocal);
      window.removeEventListener('vip-status-changed', checkLocal);
    };
  }, [courseId]);

  return isVip;
}
