"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Главная', path: '/', icon: '🏠' },
  { label: 'Курсы', path: '/courses', icon: '🎓' },
  { label: 'Артемиус', path: '/artemius', icon: '🤖' },
  { label: 'Профиль', path: '/profile', icon: '👤' },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-[70px] bg-slate-900/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full ${
              isActive ? 'text-blue-400' : 'text-white/40 hover:text-white/60'
            }`}
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110' : ''}`}>
              {item.icon}
            </span>
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 w-8 h-1 bg-blue-400 rounded-full blur-[2px] opacity-50" />
            )}
          </Link>
        );
      })}
    </nav>
  );
};
