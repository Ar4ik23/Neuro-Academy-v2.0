'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { waitForTelegramSDK } from '@/lib/telegram';

/** Triggers authentication on layout mount. Runs once, result stored in localStorage. */
export function AuthInit() {
  useAuth();

  useEffect(() => {
    // Активация VIP по одноразовой ссылке ?vip=TOKEN
    const params = new URLSearchParams(window.location.search);
    const vipToken = params.get('vip');
    if (vipToken) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      fetch(`${apiUrl}/payments/activate?token=${vipToken}`)
        .then(r => r.json())
        .then(data => {
          if (data?.courseId) {
            const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
            if (!vip.includes(data.courseId)) vip.push(data.courseId);
            localStorage.setItem('na_vip', JSON.stringify(vip));
            window.dispatchEvent(new Event('vip-status-changed'));
            // Убираем токен из URL
            window.history.replaceState({}, '', window.location.pathname);
          }
        })
        .catch(() => {});
    }

    waitForTelegramSDK(3000).then((twa) => {
      if (!twa) return;
      twa.ready();
      twa.expand();
    });
  }, []);

  return null;
}
