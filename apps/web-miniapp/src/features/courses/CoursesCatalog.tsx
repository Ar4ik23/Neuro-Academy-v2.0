"use client";

import React from 'react';
import { useCourses } from '@/hooks/useCourses';
import { CourseDto } from '@neuro-academy/types';

export const CoursesCatalog: React.FC = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Academy...</div>;

  return (
    <div className="flex flex-col gap-6 p-5">
      <header className="mb-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Neuro Academy
        </h1>
        <p className="text-white/60">Unlock your cognitive potential</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

const CourseCard: React.FC<{ course: CourseDto }> = ({ course }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95">
      <div className="relative h-48 w-full overflow-hidden rounded-2xl">
        <img 
          src={course.thumbnail || 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80'} 
          alt={course.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 backdrop-blur-md">
            Academy
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-white">{course.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-white/60">{course.description}</p>
        
        <div className="mt-6 flex items-center justify-between">
          <span className="text-lg font-bold text-white">${course.price}</span>
          <button className="rounded-xl bg-white px-6 py-2 text-sm font-bold text-slate-950 transition-colors hover:bg-blue-400 hover:text-white">
            View Course
          </button>
        </div>
      </div>
    </div>
  );
};
