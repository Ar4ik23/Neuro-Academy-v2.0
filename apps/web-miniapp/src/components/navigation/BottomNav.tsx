"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Icons ─────────────────────────────────────────────────────────────────
   All icons use viewBox="0 0 24 24", symmetric around x=12, y=12.
   strokeWidth varies active/inactive; fill="none" unless noted.
────────────────────────────────────────────────────────────────────────── */

function IconProfile({ active }: { active: boolean }) {
  const sw = active ? 2 : 1.6;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

function IconHome({ active }: { active: boolean }) {
  const sw = active ? 2 : 1.6;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Roof + walls — peak at (12,3), walls 3..21, bottom at y=22 */}
      <path d="M3 10L12 3l9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" />
      {/* Door — centered: x=9..15, y=15..22 */}
      <path d="M9 22V15h6v7" />
    </svg>
  );
}

function IconCourses({ active }: { active: boolean }) {
  const sw = active ? 2 : 1.6;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {/* Open book — two symmetric pages, spine at x=12 */}
      <path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2V4z" />
      <path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7V4z" />
    </svg>
  );
}

/* ── Nav items: Nero | Главная (center) | Курсы ─────────────────────────── */
const navItems = [
  { label: "Профиль", path: "/profile", Icon: IconProfile },
  { label: "Главная", path: "/",        Icon: IconHome    },
  { label: "Курсы",   path: "/courses", Icon: IconCourses },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(path);

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-around px-1 z-50 border-t"
      style={{
        background: 'rgba(10,12,40,0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            href={item.path}
            className="relative flex flex-col items-center justify-center gap-1 flex-1 h-full py-2 transition-all"
            style={{ color: active ? '#7C5CFF' : '#475569' }}
          >
            {active && (
              <div style={{
                position: 'absolute', top: 0,
                width: 24, height: 2, borderRadius: 999,
                background: '#7C5CFF', filter: 'blur(2px)', opacity: 0.9,
              }} />
            )}
            <span style={{
              transition: 'transform 0.2s, filter 0.2s',
              transform: active ? 'scale(1.12)' : 'scale(1)',
              filter: active ? 'drop-shadow(0 0 8px rgba(124,92,255,0.60))' : 'none',
              display: 'flex',
            }}>
              <item.Icon active={active} />
            </span>
            <span className="text-[10px] font-medium tracking-tight whitespace-nowrap">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
