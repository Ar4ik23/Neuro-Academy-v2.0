"use client";

import { useAuth } from '@/hooks/useAuth';
import { CoursesCatalog } from '@/features/courses/CoursesCatalog';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-xl font-medium text-white/40 animate-pulse">
          Initializing Academy...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-24">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_50%)]" />
      
      {/* Top Banner for User */}
      <div className="flex items-center justify-between p-5 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 p-[2px]">
            <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-white">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Welcome, {user?.firstName || 'Explorer'}</div>
            <div className="text-[10px] text-white/40">Student ID: {user?.telegramId?.substring(0, 8)}...</div>
          </div>
        </div>
        <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
          Online
        </div>
      </div>

      <CoursesCatalog />

      {/* Navigation Bar Placeholder */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-8 rounded-2xl border border-white/10 bg-slate-900/80 px-8 py-4 backdrop-blur-2xl">
        <NavItem active label="Academy" icon="🎓" />
        <NavItem label="Progress" icon="📈" />
        <NavItem label="Profile" icon="👤" />
      </div>
    </main>
  );
}

const NavItem = ({ label, icon, active = false }: { label: string; icon: string; active?: boolean }) => (
  <button className={`flex flex-col items-center gap-1 transition-all ${active ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    {active && <div className="h-1 w-1 rounded-full bg-blue-400 mt-1" />}
  </button>
);
