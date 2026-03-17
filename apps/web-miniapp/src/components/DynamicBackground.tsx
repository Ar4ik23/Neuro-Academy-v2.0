'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const BACKGROUNDS = ['/bg.jpg'];

// Pages where the background stays sharp (no blur)
const SHARP_ROUTES = ['/', '/courses', '/profile'];

// Pages where background is fixed (no parallax scroll)
const STATIC_BG_PREFIXES = ['/courses/'];

export function DynamicBackground() {
  const pathname = usePathname();
  const isSharp  = SHARP_ROUTES.includes(pathname);
  const isStatic = STATIC_BG_PREFIXES.some(p => pathname.startsWith(p));

  // Inject background image and set blur based on route
  useEffect(() => {
    const bg = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const layer = document.getElementById('app-bg-layer');
    if (!layer) return;
    layer.style.backgroundImage = `url(${bg})`;
    layer.style.filter = isSharp ? 'brightness(0.82)' : 'blur(2px) brightness(0.78)';
    // Reset position to static when entering course pages
    if (isStatic) {
      layer.style.backgroundPositionY = '100%';
    }
  }, [isSharp, isStatic]);

  // Subtle parallax on scroll — disabled on course detail/learn pages
  useEffect(() => {
    if (isStatic) return;
    const main = document.querySelector('main');
    if (!main) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const layer = document.getElementById('app-bg-layer');
        if (layer) {
          const offset = main.scrollTop * 0.22;
          layer.style.backgroundPositionY = `calc(100% - ${offset}px)`;
        }
        ticking = false;
      });
    };

    main.addEventListener('scroll', handleScroll, { passive: true });
    return () => main.removeEventListener('scroll', handleScroll);
  }, [isStatic]);

  return null;
}
