'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourse } from '@/hooks/useCourse';
import { COURSE_ID } from '@/data/course-map';
import { getExamState } from '@/store/examProgress';

export default function Home() {
  const router = useRouter();
  const courseId = COURSE_ID;
  const { isStarted, percent: rawPercent, progress } = useCourseProgress(courseId);
  const { course } = useCourse(courseId);
  const [examPassed, setExamPassed] = useState(false);

  useEffect(() => {
    setExamPassed(getExamState(courseId).passed);
  }, [courseId]);

  const percent = examPassed ? 100 : rawPercent;

  const currentLesson = course?.modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === progress?.currentLessonId);

  return (
    <div className="flex flex-col p-4 pt-10 pb-24 gap-4" style={{ minHeight: '100%' }}>

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-0.5">
          Главная
        </h1>
        <p className="text-xs" style={{ color: 'rgba(220,228,255,0.55)' }}>Добро пожаловать</p>
      </div>

      <div style={{ flexGrow: 1, minHeight: '45vh' }} />

      {isStarted && (
        <div
          className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
          style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)' }}
          onClick={() => router.push(`/courses/${courseId}/learn`)}
        >
          <div className="flex justify-between items-center mb-1">
            <p className="text-[#e2e8f0] font-semibold text-sm">{course?.title}</p>
            <p className="text-xs font-bold" style={{ color: examPassed ? '#10b981' : '#6366f1' }}>
              {examPassed ? '✓ Пройден' : `${percent}%`}
            </p>
          </div>
          <p className="text-[#94a3b8] text-xs mb-3">Продолжить обучение</p>
          <div className="progress-track h-1.5 mb-3">
            <div
              className="progress-fill"
              style={{
                width: `${percent}%`,
                background: examPassed ? 'linear-gradient(90deg,#10b981,#34d399)' : undefined,
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs" style={{ color: 'rgba(220,228,255,0.72)' }}>
              Следующий: {currentLesson?.title || 'Урок'}
            </p>
            <span className="text-[#6366f1] text-sm font-semibold">→</span>
          </div>
        </div>
      )}

      {!isStarted && (
        <div
          className="rounded-2xl p-4 text-center"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.18)' }}
        >
          <p className="text-xs" style={{ color: '#475569' }}>Начни курс, чтобы отслеживать прогресс</p>
        </div>
      )}

    </div>
  );
}
