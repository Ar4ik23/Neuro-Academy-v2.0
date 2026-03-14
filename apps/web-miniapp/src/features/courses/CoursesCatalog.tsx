"use client";

import React from 'react';
import { useCourses } from '@/hooks/useCourses';
import { CourseCard } from './components/CourseCard';

export const CoursesCatalog: React.FC<{ onSelectCourse: (id: string) => void }> = ({ onSelectCourse }) => {
  const { courses, loading, error } = useCourses();

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-sm text-slate-400 animate-pulse">Loading Academy...</p>
    </div>
  );

  if (error) return (
    <div className="p-4 glass-card m-4 border-red-500/30">
      <p className="text-red-400 text-sm">Failed to load courses: {error}</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-8 p-4 pt-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Neuro-Academy
        </h1>
        <p className="text-slate-400 text-sm italic">Master the future of education.</p>
      </header>

      <section className="grid grid-cols-1 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard 
              key={course.id}
              title={course.title}
              description={course.description || ''}
              price={course.price}
              thumbnail={course.thumbnail}
              onClick={() => onSelectCourse(course.id)}
            />
          ))
        ) : (
          <div className="py-12 text-center glass-card rounded-3xl opacity-50">
            <p className="text-slate-400 text-sm">No courses available yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
