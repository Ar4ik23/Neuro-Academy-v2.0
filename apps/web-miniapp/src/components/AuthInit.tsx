'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/api';
import { waitForTelegramSDK } from '@/lib/telegram';
import { COURSE_ID } from '@/data/course-map';

/** After auth, check enrollment on server and sync VIP to localStorage. */
async function syncVipFromServer() {
  const token = localStorage.getItem('auth_token');
  if (!token) return;
  try {
    const res = await apiClient.get<{ hasAccess: boolean }>(`/enrollments/check/${COURSE_ID}`);
    if (res.data.hasAccess) {
      const vip: string[] = JSON.parse(localStorage.getItem('na_vip') || '[]');
      if (!vip.includes(COURSE_ID)) {
        vip.push(COURSE_ID);
        localStorage.setItem('na_vip', JSON.stringify(vip));
      }
      window.dispatchEvent(new Event('vip-status-changed'));
    }
  } catch {
    // No connection or invalid token — skip
  }
}

/** Triggers authentication on layout mount. Runs once, result stored in localStorage. */
export function AuthInit() {
  useAuth();

  useEffect(() => {
    // After auth completes, always sync VIP status from server.
    // This covers the main case: admin granted VIP → enrollment exists in DB
    // → user opens app via bot button → auth → enrollment detected → VIP active.
    window.addEventListener('auth-completed', syncVipFromServer, { once: true });

    // Also handle ?vip=TOKEN links (browser activation)
    const params = new URLSearchParams(window.location.search);
    const vipToken = params.get('vip');
    if (vipToken) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
      fetch(`${apiUrl}/payments/activate?token=${vipToken}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data?.courseId) {
            const vip: string[] = JSON.parse(localStorage.getItem('na_vip') || '[]');
            if (!vip.includes(data.courseId)) vip.push(data.courseId);
            localStorage.setItem('na_vip', JSON.stringify(vip));
            window.dispatchEvent(new Event('vip-status-changed'));
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
