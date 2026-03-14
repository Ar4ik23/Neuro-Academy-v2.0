"use client";

import { useEffect, useState } from 'react';

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    onClick: (fn: () => void) => void;
  };
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);

  useEffect(() => {
    const wa = (window as any).Telegram?.WebApp;
    if (wa) {
      wa.ready();
      wa.expand();
      setWebApp(wa);
    }
  }, []);

  return {
    webApp,
    user: webApp?.initDataUnsafe?.user || null,
    initData: webApp?.initData || '',
  };
};
