'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { startCourse } from '@/store/courseProgress';
import { MODULE_MAP } from '@/data/course-map';

const STEPS = ['welcome', 'goals', 'artemius', 'map'] as const;
type Step = typeof STEPS[number];

const COURSE_MOCK = {
  title: 'AI-model 2.0',
  duration: '~18–22 часов',
  result: 'AI-модель и система монетизации',
  goals: [
    'Создать собственную AI-модель',
    'Генерировать контент автоматически',
    'Привлекать трафик через TikTok и Threads',
    'Получить первые доходы $500–$1000',
  ],
  modules: [
    { id: '1', title: 'Введение',            emoji: '💡', lessonsCount: 2  },
    { id: '2', title: 'Создание AI-модели',  emoji: '🧠', lessonsCount: 10 },
    { id: '3', title: 'Создание контента',   emoji: '🎬', lessonsCount: 6  },
    { id: '4', title: 'Трафик',              emoji: '🚀', lessonsCount: 11 },
    { id: '5', title: 'Монетизация',         emoji: '💰', lessonsCount: 7  },
    { id: '6', title: 'Масштабирование',     emoji: '📈', lessonsCount: 10 },
  ],
};

export default function CourseStartPage() {
  const router    = useRouter();
  const params    = useParams();
  const courseId  = params.courseId as string;
  const [currentStep, setCurrentStep] = useState(0);

  const handleStartCourse = () => {
    const firstModule = MODULE_MAP[0];
    const firstLessonId = firstModule.lessonIds[0];
    startCourse(courseId, firstLessonId, firstModule.id);
    router.push(`/courses/${courseId}/learn`);
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleStartCourse();
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0b0f1a' }}>

      {/* ── Progress dots ────────────────────────────────────────────────── */}
      <div className="flex justify-center gap-2 pt-8 pb-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width:      i === currentStep ? '24px' : '8px',
              height:     '8px',
              background: i <= currentStep
                ? '#6366f1'
                : 'rgba(255,255,255,0.12)',
            }}
          />
        ))}
      </div>

      {/* ── Step content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col px-5 pt-8">

        {/* ШАГ 0 — Welcome */}
        {currentStep === 0 && (
          <div className="flex flex-col flex-1">
            <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-3">
              Добро пожаловать
            </p>
            <h1 className="text-[#e2e8f0] text-2xl font-bold leading-tight">
              {COURSE_MOCK.title}
            </h1>
            <p className="text-[#94a3b8] text-sm mt-3 leading-relaxed">
              Этот курс покажет, как запустить AI-модель
              и получить первые результаты.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <div
                className="rounded-2xl p-4 flex gap-4 items-center"
                style={{ background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.25)' }}
              >
                <span className="text-2xl">⏱</span>
                <div>
                  <p className="text-[#94a3b8] text-xs">Время прохождения</p>
                  <p className="text-[#e2e8f0] font-semibold text-sm mt-0.5">{COURSE_MOCK.duration}</p>
                </div>
              </div>

              <div
                className="rounded-2xl p-4 flex gap-4 items-center"
                style={{ background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.25)' }}
              >
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="text-[#94a3b8] text-xs">Результат</p>
                  <p className="text-[#e2e8f0] font-semibold text-sm mt-0.5">{COURSE_MOCK.result}</p>
                </div>
              </div>

              <div
                className="rounded-2xl p-4 flex gap-4 items-center"
                style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-[#94a3b8] text-xs">Первый модуль</p>
                  <p className="text-[#e2e8f0] font-semibold text-sm mt-0.5">2 урока · ~15 минут</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ШАГ 1 — Goals */}
        {currentStep === 1 && (
          <div className="flex flex-col flex-1">
            <p className="text-3xl mb-4">🎯</p>
            <h2 className="text-[#e2e8f0] text-2xl font-bold leading-tight">
              Результат курса
            </h2>
            <p className="text-[#94a3b8] text-sm mt-2">После прохождения ты сможешь:</p>

            <div className="mt-6 flex flex-col gap-3">
              {COURSE_MOCK.goals.map((goal, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
                    style={{ background: 'rgba(99,102,241,0.20)', border: '1px solid rgba(99,102,241,0.40)' }}
                  >
                    <span className="text-[#6366f1] text-xs font-bold">{i + 1}</span>
                  </div>
                  <p className="text-[#e2e8f0] text-sm leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ШАГ 2 — Nero */}
        {currentStep === 2 && (
          <div className="flex flex-col flex-1 items-center text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
              style={{
                background:  'rgba(245,158,11,0.15)',
                border:      '2px solid rgba(245,158,11,0.40)',
                boxShadow:   '0 0 40px rgba(245,158,11,0.20)',
              }}
            >
              🤖
            </div>

            <p className="text-[#f59e0b] text-xs font-semibold uppercase tracking-widest mb-3">
              Nero
            </p>
            <h2 className="text-[#e2e8f0] text-xl font-bold">Я буду рядом</h2>
            <p className="text-[#94a3b8] text-sm mt-3 leading-relaxed max-w-[280px]">
              Я сопровожу тебя в этом курсе.
              После каждого модуля — небольшой квиз,
              чтобы знания закрепились.
            </p>

            <div
              className="mt-6 rounded-2xl p-4 w-full text-left"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}
            >
              <p className="text-[#fbbf24] text-sm italic">
                "Главное — не скорость, а движение вперёд."
              </p>
              <p className="text-[#78716c] text-xs mt-1">— Nero</p>
            </div>
          </div>
        )}

        {/* ШАГ 3 — Карта курса */}
        {currentStep === 3 && (
          <div className="flex flex-col flex-1">
            <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-3">
              Твой путь
            </p>
            <h2 className="text-[#e2e8f0] text-2xl font-bold">{COURSE_MOCK.title}</h2>
            <p className="text-[#94a3b8] text-sm mt-1">
              {COURSE_MOCK.modules.length} модулей · всё начинается сейчас
            </p>

            <div className="relative mt-6">
              <div
                className="absolute left-[27px] top-10 bottom-0 w-[2px]"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />

              <div className="flex flex-col gap-3">
                {COURSE_MOCK.modules.map((mod, i) => (
                  <div key={mod.id} className="flex gap-4 items-center relative">
                    <div
                      className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center z-10 text-xl"
                      style={{
                        background: i === 0 ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.04)',
                        border:     i === 0 ? '1px solid rgba(99,102,241,0.50)' : '1px solid rgba(255,255,255,0.08)',
                        boxShadow:  i === 0 ? '0 0 20px rgba(99,102,241,0.20)' : 'none',
                      }}
                    >
                      {mod.emoji}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold" style={{ color: i === 0 ? '#e2e8f0' : '#475569' }}>
                        {mod.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: i === 0 ? '#6366f1' : '#334155' }}>
                        {i === 0 ? '● Доступно · ' : '○ '}
                        {mod.lessonsCount} уроков
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Navigation buttons ───────────────────────────────────────────── */}
      <div className="px-5 pb-8 pt-6 flex gap-3">
        {currentStep > 0 && (
          <button
            onClick={goBack}
            className="w-12 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border:     '1px solid rgba(255,255,255,0.08)',
              color:      '#94a3b8',
            }}
          >
            ←
          </button>
        )}

        <button
          onClick={goNext}
          className="flex-1 h-14 rounded-2xl font-bold text-base"
          style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            color:      '#ffffff',
            boxShadow:  '0 0 28px rgba(99,102,241,0.35)',
          }}
        >
          {currentStep === 0 && 'Начать модуль 1 →'}
          {currentStep === 1 && 'Продолжить →'}
          {currentStep === 2 && 'Погнали →'}
          {currentStep === 3 && 'Начать первый урок →'}
        </button>
      </div>
    </div>
  );
}
