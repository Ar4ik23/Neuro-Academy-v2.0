'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Pages where the background stays sharp (no blur)
const SHARP_ROUTES = ['/', '/courses', '/profile'];

export function DynamicBackground() {
  const pathname = usePathname();
  const isSharp  = SHARP_ROUTES.includes(pathname);

  // Set background image once on mount
  useEffect(() => {
    const layer = document.getElementById('app-bg-layer');
    if (!layer) return;
    layer.style.backgroundImage = 'url(/bg.jpg)';
  }, []);

  // Only change blur/brightness — no position changes (prevents snap)
  useEffect(() => {
    const layer = document.getElementById('app-bg-layer');
    if (!layer) return;
    layer.style.filter = isSharp ? 'brightness(0.82)' : 'blur(2px) brightness(0.78)';
  }, [isSharp]);

  return null;
}
