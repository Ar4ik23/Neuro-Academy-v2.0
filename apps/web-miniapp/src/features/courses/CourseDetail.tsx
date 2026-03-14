"use client";

import React from 'react';
import { useCourseDetail } from '@/hooks/useCourses';

export const CourseDetail: React.FC<{ 
  courseId: string; 
  onBack: () => void;
  onSelectLesson: (id: string) => void;
}> = ({ courseId, onBack, onSelectLesson }) => {
  const { course, loading, error } = useCourseDetail(courseId);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  if (!course) return null;

  return (
    <div className="flex flex-col animate-enter min-h-screen pb-10">
      <div className="relative w-full aspect-video">
        <img src={course.thumbnail} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-4 glass-card p-3 rounded-2xl twa-tap-active"
        >
          <span className="text-white">←</span>
        </button>
      </div>

      <div className="px-5 -mt-12 relative z-10 flex flex-col gap-6">
        <div className="glass-card premium-border rounded-3xl p-6 flex flex-col gap-2">
          <h1 className="text-2xl font-black text-white">{course.title}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">{course.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-white px-2">Course Modules</h2>
          <div className="flex flex-col gap-3">
            {course.modules.map((module) => (
              <div key={module.id} className="glass-card premium-border rounded-2xl p-4 flex flex-col gap-2">
                <h3 className="text-md font-bold text-white">{module.title}</h3>
                <div className="flex flex-col gap-2">
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id} 
                      onClick={() => onSelectLesson(lesson.id)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer twa-tap-active"
                    >
                      <span className="text-sm text-slate-300">{lesson.title}</span>
                      <span className="text-xs text-indigo-400 font-bold italic">Start →</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
