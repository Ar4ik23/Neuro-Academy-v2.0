'use client';

import { useState, useEffect } from 'react';

export function useVipStatus(courseId: string) {
  const [isVip, setIsVip] = useState(false);

  useEffect(() => {
    const check = () => {
      const vip = JSON.parse(localStorage.getItem('na_vip') || '[]');
      setIsVip(vip.includes(courseId));
    };
    check();
    window.addEventListener('storage', check);
    window.addEventListener('vip-status-changed', check);
    return () => {
      window.removeEventListener('storage', check);
      window.removeEventListener('vip-status-changed', check);
    };
  }, [courseId]);

  return isVip;
}
