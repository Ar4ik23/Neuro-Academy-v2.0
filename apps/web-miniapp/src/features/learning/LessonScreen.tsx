"use client";

import React from 'react';
import { useLesson } from './hooks/useLesson';
import { LessonRenderer } from './components/LessonRenderer';

export const LessonScreen: React.FC<{ 
  lessonId: string; 
  onBack: () => void;
  onComplete: () => void;
}> = ({ lessonId, onBack, onComplete }) => {
  const { lesson, loading } = useLesson(lessonId);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!lesson) return null;

  return (
    <div className="flex flex-col animate-enter min-h-screen">
      <header className="sticky top-0 z-50 glass-card p-4 flex items-center gap-4">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 transition-colors">
          <span className="text-white">←</span>
        </button>
        <h1 className="text-md font-bold text-white truncate">{lesson.title}</h1>
      </header>

      <div className="flex-1">
        <LessonRenderer blocks={lesson.blocks} />
      </div>

      <footer className="sticky bottom-0 p-4 glass-card border-t border-white/5">
        <button 
          onClick={onComplete}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 font-black text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-transform"
        >
          COMPLETE LESSON
        </button>
      </footer>
    </div>
  );
};
