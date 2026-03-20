'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { waitForTelegramSDK } from '@/lib/telegram';

/** Triggers authentication on layout mount. Runs once, result stored in localStorage. */
export function AuthInit() {
  useAuth();

  useEffect(() => {
    waitForTelegramSDK(3000).then((twa) => {
      if (!twa) return;
      twa.ready();
      twa.expand();
    });
  }, []);

  return null;
}
