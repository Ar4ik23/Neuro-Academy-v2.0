'use client';

import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollReset() {
  const pathname = usePathname();
  // useLayoutEffect: срабатывает синхронно до paint — пользователь не видит прыжка
  useLayoutEffect(() => {
    if (pathname.includes('/learn')) return;
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [pathname]);
  return null;
}
