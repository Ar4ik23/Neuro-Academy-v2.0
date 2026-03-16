"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCourse } from "@/hooks/useCourse";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { getExamState } from "@/store/examProgress";
import type { ModuleDto, LessonSummaryDto } from "@neuro-academy/types";

// ─── Module accent config ────────────────────────────────────────────────────
const MODULE_ACCENTS: Record<number, { bg: string; border: string; glow: string }> = {
  0: { bg: "rgba(99,102,241,0.12)",  border: "rgba(99,102,241,0.35)",  glow: "rgba(99,102,241,0.20)"  },
  1: { bg: "rgba(168,85,247,0.10)",  border: "rgba(168,85,247,0.30)",  glow: "rgba(168,85,247,0.18)"  },
  2: { bg: "rgba(59,130,246,0.10)",  border: "rgba(59,130,246,0.30)",  glow: "rgba(59,130,246,0.18)"  },
  3: { bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.30)",  glow: "rgba(245,158,11,0.18)"  },
  4: { bg: "rgba(16,185,129,0.10)",  border: "rgba(16,185,129,0.30)",  glow: "rgba(16,185,129,0.18)"  },
  5: { bg: "rgba(251,146,60,0.10)",  border: "rgba(251,146,60,0.30)",  glow: "rgba(251,146,60,0.18)"  },
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { course, loading } = useCourse(params.courseId);
  const router = useRouter();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const { percent: rawPercent, isStarted } = useCourseProgress(params.courseId);
  const [examPassed, setExamPassed] = useState(false);
  useEffect(() => {
    setExamPassed(getExamState(params.courseId).passed);
  }, [params.courseId]);
  const percent = examPassed ? 100 : rawPercent;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen animate-enter">
        <div className="w-full h-[200px] bg-white/5 animate-pulse" />
        <div className="px-4 pt-5 flex flex-col gap-3">
          <div className="h-7 w-3/4 rounded bg-white/5 animate-pulse" />
          <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-[#e2e8f0]">Курс не найден</h2>
        <Link href="/courses" className="text-[#6366f1] text-sm hover:underline">
          ← Вернуться к курсам
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-10 animate-enter">

      {/* ── СЕКЦИЯ 1 — Hero ─────────────────────────────────────────────────── */}
      <div className="relative w-full h-[200px] overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] via-[#0b0f1a]/30 to-transparent" />
        <Link
          href="/courses"
          className="absolute top-4 left-4 w-9 h-9 rounded-full glass flex items-center justify-center text-[#e2e8f0] text-base active:scale-90 transition-all"
        >
          ←
        </Link>
        <div className="absolute top-4 right-4">
          <span className="rounded-md bg-black/50 border border-white/15 backdrop-blur-md px-2.5 py-1 text-[10px] font-black tracking-widest text-white/60 uppercase">
            {course.category}
          </span>
        </div>
      </div>

      {/* ── СЕКЦИЯ 2 — Заголовок + бейджи + соц.доказательство ─────────────── */}
      <div className="px-4 pt-5 pb-2">

        {/* Название */}
        <h1 className="text-[#e2e8f0] text-[22px] font-bold leading-tight">
          {course.title}
        </h1>

        {/* Социальное доказательство */}
        <div className="flex items-center gap-1 mt-3">
          <span className="text-base">👨‍🎓</span>
          <span className="text-[#94a3b8] text-xs">1 200+ студентов уже проходят курс</span>
        </div>

        {/* Сворачиваемое описание */}
        <p className="text-[#94a3b8] text-sm leading-relaxed mt-3">
          Запусти собственную AI-модель и выстрой систему контента,
          трафика и монетизации.
        </p>

        <button
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="flex items-center gap-1 mt-2 text-[#6366f1] text-sm font-medium"
        >
          {isDescExpanded ? "Свернуть ↑" : "Подробнее ↓"}
        </button>

        {isDescExpanded && (
          <div className="mt-4 flex flex-col gap-5">

            {/* Полное описание */}
            <p className="text-[#94a3b8] text-sm leading-relaxed">
              В этом курсе ты пройдёшь полный путь: от создания AI-персонажа
              и генерации контента до привлечения аудитории и первых доходов.
              При правильном выполнении шагов многие ученики выходят на $500–$1000
              уже в первый месяц.
            </p>

            {/* 3 блока тем */}
            <div className="flex flex-col gap-2">
              {[
                { icon: '🚀', title: 'Запуск AI-модели', desc: 'Создание персонажа · Генерация фото и видео · Подготовка аккаунтов', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.30)' },
                { icon: '📈', title: 'Трафик и аудитория', desc: 'TikTok · Threads · Алгоритмы продвижения', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.30)' },
                { icon: '💰', title: 'Монетизация', desc: 'Переписка · Воронка · Fanvue и платформы', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.30)' },
              ].map(({ icon, title, desc, bg, border }) => (
                <div key={title} className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: bg, border: `1px solid ${border}` }}>
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-[#e2e8f0] font-semibold text-sm">{title}</p>
                    <p className="text-[#94a3b8] text-xs mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[rgba(255,255,255,0.06)]" />

            {/* Из чего состоит — 4 блока */}
            <div>
              <p className="text-[#475569] text-[11px] font-medium tracking-widest uppercase mb-3">Из чего состоит</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { icon: '🎬', label: 'Видео',    bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.28)',  color: '#a5b4fc' },
                  { icon: '📑', label: 'Презент.', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.28)',  color: '#93c5fd' },
                  { icon: '📄', label: 'Конспект', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.28)', color: '#fcd34d' },
                  { icon: '🧠', label: 'Квиз',     bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.28)', color: '#d8b4fe' },
                ].map(({ icon, label, bg, border, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 py-3.5 rounded-2xl" style={{ background: bg, border: `1px solid ${border}` }}>
                    <span className="text-[22px] leading-none">{icon}</span>
                    <span className="text-[10px] font-semibold text-center leading-tight" style={{ color }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Как проходить */}
            <div>
              <p className="text-[#475569] text-[11px] font-medium tracking-widest uppercase mb-3">Как проходить</p>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                {[
                  { n: '01', icon: '🎬', title: 'Смотри видеоурок',   desc: 'Короткие практические видео без воды' },
                  { n: '02', icon: '📑', title: 'Изучи презентацию',  desc: 'Визуальные схемы и разборы инструментов' },
                  { n: '03', icon: '📄', title: 'Читай конспект',     desc: 'Ключевые шаги и инструкции в тексте' },
                  { n: '04', icon: '🧠', title: 'Проверяй знания',    desc: 'Квиз в конце каждого модуля' },
                ].map(({ n, icon, title, desc }, i, arr) => (
                  <div
                    key={n}
                    className="flex items-center gap-3 px-4 py-3.5"
                    style={{
                      background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                      borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    }}
                  >
                    <span className="text-[11px] font-black w-6 shrink-0" style={{ color: 'rgba(99,102,241,0.7)' }}>{n}</span>
                    <span className="text-base shrink-0">{icon}</span>
                    <div className="min-w-0">
                      <p className="text-[#e2e8f0] text-sm font-semibold leading-tight">{title}</p>
                      <p className="text-[#475569] text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Что ты получишь */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.20)' }}>
              <p className="text-[#818cf8] text-[11px] font-black tracking-widest uppercase mb-3">🎯 Что ты получишь</p>
              <div className="flex flex-col gap-2">
                {[
                  'Работающую AI-модель под твоим управлением',
                  'Систему генерации контента на автопилоте',
                  'Трафик из TikTok и Threads без бюджета',
                  'Первые $500–$1000 уже в первый месяц',
                  'Сертификат об окончании курса',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-[#6366f1] text-xs mt-0.5 shrink-0">✓</span>
                    <p className="text-[#94a3b8] text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* ── CTA кнопка ──────────────────────────────────────────────────────── */}
      <div className="px-4 mt-5">
        {isStarted && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1.5">
              <p className="text-[#94a3b8] text-xs">Прогресс</p>
              <p className="text-xs font-semibold" style={{ color: examPassed ? '#10b981' : '#6366f1' }}>
                {examPassed ? '✓ Пройден' : `${percent}%`}
              </p>
            </div>
            <div className="progress-track h-2">
              <div
                className="progress-fill"
                style={{
                  width: `${percent}%`,
                  background: examPassed ? 'linear-gradient(90deg,#10b981,#34d399)' : undefined,
                }}
              />
            </div>
          </div>
        )}
        <button
          onClick={() => {
            if (isStarted) {
              router.push(`/courses/${params.courseId}/learn`);
            } else {
              router.push(`/courses/${params.courseId}/start`);
            }
          }}
          className="btn-primary w-full py-4 text-center rounded-2xl tracking-wide"
          style={examPassed ? { background: 'linear-gradient(135deg,#10b981,#34d399)' } : undefined}
        >
          {examPassed ? '🏆 Курс пройден' : isStarted ? 'Продолжить →' : 'Начать курс →'}
        </button>
      </div>

      {/* ── Блок Артемиуса — только до старта курса ─────────────────────────── */}
      {!isStarted && (
        <>
          <div className="mx-4 mt-6 border-t border-[rgba(255,255,255,0.06)]" />
          <div
            className="mx-4 mt-4 rounded-2xl p-4"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}
          >
            <div className="flex gap-3 items-start">
              <span className="text-2xl">🤖</span>
              <div className="flex-1">
                <p className="text-[#f59e0b] text-xs font-semibold uppercase tracking-wider">
                  Артемиус
                </p>
                <p className="text-[#e2e8f0] text-sm mt-1 leading-relaxed">
                  Начни с первого модуля.<br />
                  Он займёт всего 20 минут.
                </p>
                <button
                  onClick={() => router.push(`/courses/${params.courseId}/start`)}
                  className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{ background: "rgba(245,158,11,0.20)", color: "#f59e0b",
                           border: "1px solid rgba(245,158,11,0.35)" }}
                >
                  Начать →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── СЕКЦИЯ 6 — Путь модулей ─────────────────────────────────────────── */}
      <div className="px-4 mt-6 pb-6">
        <p className="text-[#475569] text-[11px] font-medium tracking-widest uppercase mb-5">
          Программа курса
        </p>

        <div className="flex flex-col">
          {course.modules.map((mod: ModuleDto & { lessons: LessonSummaryDto[] }, index: number) => {
            const accent     = MODULE_ACCENTS[mod.order] ?? MODULE_ACCENTS[0];
            const isFirst    = index === 0;
            const isExpanded = expandedModule === mod.id;

            return (
              <div key={mod.id} className="flex gap-3">

                {/* ── Left: emoji + line (line растягивается до высоты карточки) ── */}
                <div className="flex flex-col items-center flex-shrink-0 w-14">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl transition-all"
                    style={{
                      background: isFirst ? accent.bg : "rgba(255,255,255,0.04)",
                      border: isFirst ? `1px solid ${accent.border}` : "1px solid rgba(255,255,255,0.08)",
                      boxShadow: isFirst ? `0 0 20px ${accent.glow}` : "none",
                    }}
                  >
                    {mod.emoji}
                  </div>
                  {/* Line от низа эмодзи до верха следующего (растягивается автоматически) */}
                  <div style={{ width: 2, flexGrow: 1, minHeight: 12, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* ── Right: карточка + отступ снизу (создаёт место для линии) ── */}
                <div className="flex-1 pb-3">
                  <div
                    className="rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
                    style={{
                      background: isFirst ? accent.bg : "rgba(255,255,255,0.03)",
                      border: isFirst ? `1px solid ${accent.border}` : "1px solid rgba(255,255,255,0.07)",
                    }}
                    onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-3.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[10px] text-[#475569] font-black tracking-widest uppercase">
                            Модуль {mod.order}
                          </p>
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
                        </div>
                        <h3 className="text-[14px] font-semibold text-[#e2e8f0] leading-tight mt-0.5">
                          {mod.title}
                        </h3>
                        <p className="text-[11px] text-[#475569] mt-0.5">
                          {mod.lessons.length} уроков
                        </p>
                      </div>
                      <span
                        className={`text-[#475569] text-sm ml-2 shrink-0 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </div>

                    {/* Expanded lessons */}
                    {isExpanded && (
                      <div className="border-t border-[rgba(255,255,255,0.07)] px-3.5 pb-3.5 pt-3 flex flex-col gap-1.5">
                        {mod.lessons.map((lesson: LessonSummaryDto) => (
                          <div
                            key={lesson.id}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.07)] transition-colors"
                          >
                            <span className="text-[11px] text-[#475569] font-bold w-4 shrink-0 text-center">
                              {lesson.order}
                            </span>
                            <span className="text-sm text-[#e2e8f0] flex-1">{lesson.title}</span>
                            {lesson.isFree ? (
                              <span className="text-[10px] text-[#10b981] font-bold">FREE</span>
                            ) : (
                              <span className="text-[#475569] text-xs">→</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}

          {/* ── Финальный экзамен ── */}
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-14 flex justify-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}
              >
                🏆
              </div>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className="flex-1 rounded-2xl p-3.5"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}
              >
                <p className="text-[10px] text-[#f59e0b] font-black tracking-widest uppercase">
                  После модуля 5
                </p>
                <h3 className="text-[14px] font-semibold text-[#e2e8f0] leading-tight mt-0.5">
                  Финальный экзамен
                </h3>
                <p className="text-[11px] text-[#475569] mt-0.5">
                  25 вопросов · по всему курсу · сертификат
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
