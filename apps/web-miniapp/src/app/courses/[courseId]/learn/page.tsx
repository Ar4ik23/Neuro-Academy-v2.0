'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCourse } from '@/hooks/useCourse';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { getExamState } from '@/store/examProgress';
import { getLastLesson } from '@/data/course-map';
import type { ModuleDto, LessonSummaryDto } from '@neuro-academy/types';

export default function CourseLearnPage() {
  const router   = useRouter();
  const params   = useParams();
  const courseId = params.courseId as string;

  const { course, loading } = useCourse(courseId);
  const { percent: rawPercent, isCompleted, progress, completeModuleById, refresh } = useCourseProgress(courseId);
  const examState = getExamState(courseId);
  const percent = examState.passed ? 100 : rawPercent;

  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    progress?.currentModuleId || 'm1'
  );
  const [congratsModule, setCongratsModule] = useState<string | null>(null);

  // Раскрыть модуль с текущим уроком когда прогресс загрузится из localStorage
  useEffect(() => {
    if (progress?.currentModuleId) {
      setExpandedModuleId(progress.currentModuleId);
    }
  }, [progress?.currentModuleId]);

  // Проскроллить к текущему уроку
  useEffect(() => {
    if (!progress?.currentLessonId) return;
    setTimeout(() => {
      const el = document.getElementById('current-lesson');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }, [progress?.currentLessonId]);

  // Статус модуля из прогресса
  const getModuleStatus = (moduleId: string): 'completed' | 'current' | 'locked' =>
    progress?.completedModuleIds?.includes(moduleId) ? 'completed' :
    moduleId === progress?.currentModuleId           ? 'current'   :
    !progress                                        ? (moduleId === 'm1' ? 'current' : 'locked') :
                                                       'locked';

  if (loading || !course) {
    return (
      <div className="min-h-screen pb-24 flex flex-col" style={{ background: '#0b0f1a' }}>
        <div className="px-4 pt-10 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-16 rounded bg-white/5 animate-pulse mb-1" />
            <div className="h-5 w-40 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="mx-4 mb-6 rounded-2xl h-16 bg-white/5 animate-pulse" />
        <div className="px-4 flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const modules = course.modules as (ModuleDto & { lessons: LessonSummaryDto[] })[];

  // Кнопка "Завершить модуль" — все уроки модуля пройдены и модуль ещё не завершён
  const currentExpandedModule = modules.find((m) => m.id === expandedModuleId);
  const allLessonsCompleted =
    (currentExpandedModule?.lessons.length ?? 0) > 0 &&
    (currentExpandedModule?.lessons.every((l) => isCompleted(l.id)) ?? false);
  const isModuleAlreadyCompleted =
    progress?.completedModuleIds?.includes(expandedModuleId || '') ?? false;
  const showFinishModule = allLessonsCompleted && !isModuleAlreadyCompleted;

  const handleFinishModule = (moduleId: string) => {
    completeModuleById(moduleId);
    setCongratsModule(moduleId);
  };

  // Последний урок последнего модуля (для разблокировки экзамена)
  const lastLesson = getLastLesson();

  return (
    <div className="min-h-screen pb-24" style={{ background: '#0b0f1a' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="px-4 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
        >
          ←
        </button>
        <div>
          <p className="text-[#475569] text-xs uppercase tracking-widest">Курс</p>
          <h1 className="text-[#e2e8f0] font-bold text-lg leading-tight">{course.title}</h1>
        </div>
      </div>

      {/* ── Общий прогресс ────────────────────────────────────────────────── */}
      <div
        className="mx-4 mb-6 rounded-2xl p-4"
        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <p className="text-[#94a3b8] text-xs">Прогресс курса</p>
          <div className="flex items-center gap-2">
            {examState.passed && (
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 6, fontSize: 10, fontWeight: 700, padding: '2px 7px' }}>
                ✓ Пройден
              </span>
            )}
            <p className="text-[#6366f1] text-xs font-semibold">{percent}%</p>
          </div>
        </div>
        <div className="progress-track h-2 w-full">
          <div className="progress-fill" style={{ width: `${percent}%`, background: examState.passed ? 'linear-gradient(90deg,#10b981,#34d399)' : undefined }} />
        </div>
      </div>

      {/* ── Вертикальный путь ─────────────────────────────────────────────── */}
      <div className="px-4">
        <div className="flex flex-col gap-1">
          {modules.map((mod, index) => {
            const moduleStatus = getModuleStatus(mod.id);
            const isExpanded   = expandedModuleId === mod.id;
            const isClickable  = moduleStatus !== 'locked';

            return (
              <div key={mod.id}>

                {/* ── Строка модуля ── */}
                <div
                  className="flex gap-4 items-center py-3 relative"
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                  onClick={() => {
                    if (!isClickable) return;
                    setExpandedModuleId(isExpanded ? null : mod.id);
                  }}
                >
                  {/* Иконка модуля */}
                  <div
                    className="w-10 h-10 rounded-2xl flex-shrink-0 flex items-center justify-center z-10 text-lg"
                    style={{
                      background:
                        moduleStatus === 'completed' ? 'rgba(16,185,129,0.15)' :
                        moduleStatus === 'current'   ? 'rgba(99,102,241,0.20)' :
                                                       'rgba(255,255,255,0.04)',
                      border:
                        moduleStatus === 'completed' ? '1px solid rgba(16,185,129,0.40)' :
                        moduleStatus === 'current'   ? '1px solid rgba(99,102,241,0.50)' :
                                                       '1px solid rgba(255,255,255,0.08)',
                      boxShadow:
                        moduleStatus === 'completed' ? '0 0 16px rgba(16,185,129,0.40)' :
                        moduleStatus === 'current'   ? '0 0 16px rgba(99,102,241,0.20)' :
                                                       'none',
                    }}
                  >
                    {mod.emoji}
                  </div>

                  {/* Карточка модуля */}
                  <div
                    className="flex-1 rounded-2xl px-4 py-3"
                    style={{
                      background:
                        moduleStatus === 'completed' ? 'rgba(16,185,129,0.06)' :
                        moduleStatus === 'current'   ? 'rgba(99,102,241,0.10)' :
                                                       'rgba(255,255,255,0.03)',
                      border:
                        moduleStatus === 'completed' ? '1px solid rgba(16,185,129,0.20)' :
                        moduleStatus === 'current'   ? '1px solid rgba(99,102,241,0.25)' :
                                                       '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="flex justify-between items-center gap-2">
                      <p
                        className="text-sm font-semibold truncate"
                        style={{ color: moduleStatus === 'locked' ? '#334155' : '#e2e8f0' }}
                      >
                        {mod.title}
                      </p>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {mod.isFree ? (
                          <span
                            className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md"
                            style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)' }}
                          >
                            FREE
                          </span>
                        ) : (
                          <span
                            className="text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-md"
                            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.30)' }}
                          >
                            VIP
                          </span>
                        )}
                        {moduleStatus !== 'locked' && (
                          <span
                            className="text-[#475569] text-sm"
                            style={{
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease',
                              display: 'inline-block',
                            }}
                          >
                            →
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color:
                          moduleStatus === 'completed' ? '#10b981' :
                          moduleStatus === 'current'   ? '#818cf8' :
                                                         '#1e293b',
                      }}
                    >
                      {moduleStatus === 'completed' ? '✓ Пройдено'   :
                       moduleStatus === 'current'   ? '● Текущий'    :
                                                      '○ Заблокировано'}
                    </p>
                  </div>
                </div>

                {/* Сегмент линии между модулями */}
                {index < modules.length - 1 && !isExpanded && (
                  <div style={{ paddingLeft: '19px' }}>
                    <div
                      style={{
                        width: '2px',
                        height: '24px',
                        background:
                          moduleStatus === 'completed'
                            ? 'linear-gradient(180deg, #10b981, rgba(16,185,129,0.30))'
                            : 'rgba(255,255,255,0.06)',
                        boxShadow:
                          moduleStatus === 'completed'
                            ? '0 0 6px rgba(16,185,129,0.50)'
                            : 'none',
                        transition: 'background 0.4s ease, box-shadow 0.4s ease',
                      }}
                    />
                  </div>
                )}

                {/* ── Раскрытые уроки ── */}
                {isExpanded && mod.lessons.length > 0 && (
                  <div className="ml-14 mb-2 flex flex-col">

                    {mod.lessons.map((lesson, lessonIndex) => {
                      const effectiveLessonStatus =
                        moduleStatus === 'completed'                      ? 'completed' :
                        isCompleted(lesson.id)                            ? 'completed' :
                        lesson.id === progress?.currentLessonId           ? 'current'   :
                                                                            'locked';
                      const isCurrent = effectiveLessonStatus === 'current';
                      const locked    = effectiveLessonStatus === 'locked';
                      const status    = effectiveLessonStatus;

                      return (
                        <div key={lesson.id} className="flex flex-col">
                        <div
                          id={isCurrent ? 'current-lesson' : undefined}
                          className="flex gap-3 items-center"
                          style={{ cursor: !locked ? 'pointer' : 'default' }}
                          onClick={() => {
                            if (locked) return;
                            router.push(`/courses/${courseId}/learn/${lesson.id}`);
                          }}
                        >
                          {/* Иконка урока */}
                          <div
                            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center z-10 text-base"
                            style={{
                              background:
                                status === 'completed' ? 'rgba(16,185,129,0.15)' :
                                status === 'current'   ? 'rgba(99,102,241,0.15)' :
                                                         'rgba(255,255,255,0.03)',
                              border:
                                status === 'completed' ? '1px solid rgba(16,185,129,0.35)' :
                                status === 'current'   ? '1px solid rgba(99,102,241,0.35)' :
                                                         '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            {lesson.lessonType === 'VIDEO' ? '🎬' :
                             lesson.lessonType === 'PDF'   ? '📑' :
                             lesson.lessonType === 'QUIZ'  ? '🧠' : '📄'}
                          </div>

                          {/* Название урока + кнопка внутри рамки */}
                          <div
                            className="flex-1 rounded-xl px-3 py-2.5 flex items-center justify-between"
                            style={{
                              background:
                                locked           ? 'rgba(255,255,255,0.02)' :
                                isCurrent        ? 'rgba(99,102,241,0.08)'  :
                                                   'rgba(16,185,129,0.06)',
                              border:
                                locked           ? '1px solid rgba(255,255,255,0.04)' :
                                isCurrent        ? '1px solid rgba(99,102,241,0.20)'  :
                                                   '1px solid rgba(16,185,129,0.20)',
                            }}
                          >
                            <div className="min-w-0">
                              <p
                                className="text-sm font-medium truncate"
                                style={{ color: locked ? '#1e293b' : '#e2e8f0' }}
                              >
                                {lesson.title}
                              </p>
                              {locked && (
                              <p className="text-xs mt-0.5" style={{ color: '#0f172a' }}>
                                ○ Заблокировано
                              </p>
                            )}
                            </div>

                            {isCurrent && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/courses/${courseId}/learn/${lesson.id}`);
                                }}
                                className="flex-shrink-0 ml-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
                                style={{
                                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                                  color: '#ffffff',
                                }}
                              >
                                Перейти →
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Линия между уроками */}
                        {lessonIndex < mod.lessons.length - 1 && (
                          <div style={{ paddingLeft: '19px' }}>
                            <div style={{
                              width: '2px',
                              height: '10px',
                              background: status === 'completed'
                                ? 'linear-gradient(180deg, #10b981, rgba(16,185,129,0.30))'
                                : 'rgba(255,255,255,0.06)',
                              boxShadow: status === 'completed'
                                ? '0 0 6px rgba(16,185,129,0.50)'
                                : 'none',
                              transition: 'background 0.4s ease, box-shadow 0.4s ease',
                            }} />
                          </div>
                        )}

                        </div>
                      );
                    })}

                    {/* Кнопка "Завершить модуль" */}
                    {showFinishModule && expandedModuleId === mod.id && (
                      <button
                        onClick={() => handleFinishModule(mod.id)}
                        className="w-full mt-1 py-3 rounded-2xl font-bold text-sm"
                        style={{
                          background: 'linear-gradient(135deg, #10b981, #059669)',
                          color: '#ffffff',
                          boxShadow: '0 0 20px rgba(16,185,129,0.35)',
                        }}
                      >
                        Завершить модуль ✓
                      </button>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* ── Финальный экзамен ─────────────────────────────────────────────── */}
      {(() => {
        const allDone = isCompleted(lastLesson.lessonId);

        return (
          <div className="px-4 pb-6 mt-4">
            {/* Соединительная линия сверху */}
            <div className="flex justify-center mb-3">
              <div style={{ width: 2, height: 24, background: allDone ? 'rgba(99,102,241,0.50)' : 'rgba(255,255,255,0.08)' }} />
            </div>

            <div
              style={{
                background: examState.passed
                  ? 'rgba(16,185,129,0.08)'
                  : allDone
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.10))'
                    : 'rgba(255,255,255,0.03)',
                border: examState.passed
                  ? '1px solid rgba(16,185,129,0.30)'
                  : allDone
                    ? '1px solid rgba(99,102,241,0.35)'
                    : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: '20px 16px',
                opacity: allDone ? 1 : 0.55,
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span style={{ fontSize: 28 }}>
                  {examState.passed ? '🏆' : allDone ? '🎓' : '🔒'}
                </span>
                <div>
                  <p style={{
                    fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                    color: examState.passed ? '#34d399' : allDone ? '#a5b4fc' : '#475569',
                  }}>
                    {examState.passed ? 'Пройден' : allDone ? 'Доступен' : 'Заблокирован'}
                  </p>
                  <p style={{ color: allDone ? '#e2e8f0' : '#475569', fontWeight: 700, fontSize: 16 }}>
                    Финальный экзамен
                  </p>
                </div>
              </div>

              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.5, marginBottom: 14 }}>
                {examState.passed
                  ? 'Ты успешно сдал финальный экзамен и получил сертификат!'
                  : allDone
                    ? '30 вопросов · 45 минут · нужно 26/30 правильных ответов'
                    : 'Пройди все уроки последнего модуля чтобы разблокировать экзамен'}
              </p>

              <button
                disabled={!allDone}
                onClick={() => allDone && router.push(`/courses/${courseId}/exam`)}
                className="w-full h-12 rounded-2xl font-bold text-sm"
                style={{
                  background: examState.passed
                    ? 'linear-gradient(135deg, #10b981, #34d399)'
                    : allDone
                      ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                      : 'rgba(255,255,255,0.06)',
                  color: allDone ? '#fff' : '#334155',
                  boxShadow: allDone && !examState.passed ? '0 0 20px rgba(99,102,241,0.30)' : 'none',
                  border: 'none',
                  cursor: allDone ? 'pointer' : 'default',
                }}
              >
                {examState.passed ? '🏆 Посмотреть сертификат' : allDone ? 'Начать экзамен →' : '🔒 Заблокировано'}
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── Overlay поздравления ──────────────────────────────────────────── */}
      {congratsModule && (() => {
        const mod         = modules.find((m) => m.id === congratsModule);
        const moduleIndex = modules.findIndex((m) => m.id === congratsModule);
        const nextModule  = modules[moduleIndex + 1];

        return (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4"
            style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(4px)' }}
          >
            <div
              className="w-full rounded-3xl p-6 flex flex-col items-center text-center"
              style={{
                background: '#161b2e',
                border: '1px solid rgba(99,102,241,0.30)',
                boxShadow: '0 0 60px rgba(99,102,241,0.20)',
              }}
            >
              <div className="text-5xl mb-4">🎉</div>

              <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-2">
                Модуль завершён
              </p>
              <h2 className="text-[#e2e8f0] text-xl font-bold">
                {mod?.emoji} {mod?.title}
              </h2>
              <p className="text-[#94a3b8] text-sm mt-2 leading-relaxed">
                Отлично! Ты прошёл этот модуль.
              </p>

              {/* Артемиус */}
              <div
                className="mt-4 rounded-2xl p-3 w-full text-left"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}
              >
                <p className="text-[#f59e0b] text-xs font-semibold">🤖 Артемиус</p>
                <p className="text-[#e2e8f0] text-sm mt-1">
                  Продолжай в том же темпе! Следующий модуль уже открыт.
                </p>
              </div>

              {/* Следующий модуль */}
              {nextModule && (
                <div
                  className="mt-4 w-full rounded-2xl p-3 flex gap-3 items-center"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-2xl">{nextModule.emoji}</span>
                  <div className="text-left">
                    <p className="text-[#94a3b8] text-xs">Следующий модуль</p>
                    <p className="text-[#e2e8f0] text-sm font-semibold">{nextModule.title}</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setCongratsModule(null);
                  if (nextModule) {
                    setExpandedModuleId(nextModule.id);
                    setTimeout(() => {
                      const el = document.getElementById('current-lesson');
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 200);
                  }
                }}
                className="mt-5 w-full py-4 rounded-2xl font-bold text-base"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#ffffff',
                  boxShadow: '0 0 28px rgba(99,102,241,0.35)',
                }}
              >
                {nextModule ? `Начать: ${nextModule.title} →` : 'Курс завершён 🏆'}
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
