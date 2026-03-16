"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Главная",  path: "/",         icon: "🏠",  isArtemius: false },
  { label: "Курсы",    path: "/courses",  icon: "🎓",  isArtemius: false },
  { label: "Артемиус", path: "/artemius", icon: "🤖",  isArtemius: true  },
  { label: "Профиль",  path: "/profile",  icon: "👤",  isArtemius: false },
];

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 h-16 flex items-center justify-around px-2 z-50 glass border-t border-[rgba(255,255,255,0.07)] rounded-none"
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.path ||
          (item.path !== "/" && pathname.startsWith(item.path));

        const activeColor  = item.isArtemius ? "text-[#f59e0b]" : "text-[#6366f1]";
        const activeGlow   = item.isArtemius
          ? "drop-shadow-[0_0_8px_rgba(245,158,11,0.50)]"
          : "drop-shadow-[0_0_8px_rgba(99,102,241,0.50)]";
        const activeDot    = item.isArtemius ? "bg-[#f59e0b]" : "bg-[#6366f1]";

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full py-2 transition-all ${
              isActive ? activeColor : "text-[#475569] hover:text-[#94a3b8]"
            }`}
          >
            {isActive && (
              <div className={`absolute top-0 w-8 h-0.5 rounded-full ${activeDot} blur-[3px] opacity-60`} />
            )}

            <span
              className={`text-xl transition-all ${
                isActive ? `scale-110 ${activeGlow}` : "scale-100"
              }`}
            >
              {item.icon}
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
