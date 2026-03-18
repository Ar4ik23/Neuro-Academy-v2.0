'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollReset() {
  const pathname = usePathname();
  useEffect(() => {
    // Learn-страница сама управляет скроллом
    if (pathname.includes('/learn')) return;
    const main = document.querySelector('main');
    if (!main) return;
    // Скрываем на один кадр чтобы сброс скролла не был виден
    main.style.visibility = 'hidden';
    main.scrollTop = 0;
    requestAnimationFrame(() => {
      main.style.visibility = '';
    });
  }, [pathname]);
  return null;
}
