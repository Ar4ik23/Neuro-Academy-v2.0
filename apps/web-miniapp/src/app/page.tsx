"use client";

import React, { useState } from 'react';
import { CoursesCatalog } from '@/features/courses/CoursesCatalog';
import { CourseDetail } from '@/features/courses/CourseDetail';
import { LessonScreen } from '@/features/learning/LessonScreen';
import { QuizComponent } from '@/features/learning/components/QuizComponent';
import { AISelectionHelper } from '@/features/social/AISelectionHelper';

type NavState = 
  | { type: 'CATALOG' }
  | { type: 'COURSE'; id: string }
  | { type: 'LESSON'; id: string; courseId: string }
  | { type: 'QUIZ'; id: string; lessonId: string };

export default function Home() {
  const [nav, setNav] = useState<NavState>({ type: 'CATALOG' });

  // Override logic in features to trigger this navigation
  // For actual production, a real router or a nested state would be better
  // but for TWA single-page feel, this is highly effective.

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="relative z-10">
        {nav.type === 'CATALOG' && (
          <CoursesCatalog onSelectCourse={(id) => setNav({ type: 'COURSE', id })} />
        )}

        {nav.type === 'COURSE' && (
          <CourseDetail 
            courseId={nav.id} 
            onBack={() => setNav({ type: 'CATALOG' })} 
            onSelectLesson={(lessonId) => setNav({ type: 'LESSON', id: lessonId, courseId: nav.id })}
          />
        )}

        {nav.type === 'LESSON' && (
          <LessonScreen 
            lessonId={nav.id}
            onBack={() => setNav({ type: 'COURSE', id: nav.courseId })}
            onComplete={() => setNav({ type: 'QUIZ', id: 'some-quiz-id', lessonId: nav.id })} // Simplified
          />
        )}

        {nav.type === 'QUIZ' && (
          <QuizComponent 
            quizId={nav.id}
            onClose={() => setNav({ type: 'LESSON', id: nav.lessonId, courseId: '' })}
            onFinished={(passed) => {
               if(passed) setNav({ type: 'CATALOG' });
            }}
          />
        )}
      </div>

      {/* Global AI Overlay */}
      <AISelectionHelper />

      {/* Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />
    </main>
  );
}
