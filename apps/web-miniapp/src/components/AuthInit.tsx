'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { waitForTelegramSDK } from '@/lib/telegram';

/** Activates VIP via token and updates localStorage + dispatches event. */
function tryActivateVipToken(vipToken: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  return fetch(`${apiUrl}/payments/activate?token=${vipToken}`)
    .then(r => {
      if (!r.ok) return false;
      return r.json();
    })
    .then(data => {
      if (data?.courseId) {
        const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
        if (!vip.includes(data.courseId)) vip.push(data.courseId);
        localStorage.setItem('na_vip', JSON.stringify(vip));
        window.dispatchEvent(new Event('vip-status-changed'));
        return true;
      }
      return false;
    })
    .catch(() => false);
}

/** Triggers authentication on layout mount. Runs once, result stored in localStorage. */
export function AuthInit() {
  useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vipToken = params.get('vip');

    if (vipToken) {
      // Try to activate VIP token immediately
      tryActivateVipToken(vipToken).then(activated => {
        if (activated) {
          // Clean URL to prevent re-activation
          window.history.replaceState({}, '', window.location.pathname);
        }
      });

      // Also retry after auth completes (token may need fresh JWT context,
      // or enrollment already exists in DB and will be picked up by useVipStatus)
      const onAuthCompleted = () => {
        // After auth, useVipStatus will re-check the API automatically.
        // But also retry token activation in case first attempt failed.
        tryActivateVipToken(vipToken).then(activated => {
          if (activated) {
            window.history.replaceState({}, '', window.location.pathname);
          }
        });
      };
      window.addEventListener('auth-completed', onAuthCompleted, { once: true });
    }

    waitForTelegramSDK(3000).then((twa) => {
      if (!twa) return;
      twa.ready();
      twa.expand();
    });
  }, []);

  return null;
}
