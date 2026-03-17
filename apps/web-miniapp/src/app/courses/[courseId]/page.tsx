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
  0: { bg: "rgba(124,92,255,0.16)",  border: "rgba(124,92,255,0.35)",  glow: "rgba(124,92,255,0.18)"  },
  1: { bg: "rgba(168,85,247,0.14)",  border: "rgba(168,85,247,0.32)",  glow: "rgba(168,85,247,0.16)"  },
  2: { bg: "rgba(96,165,250,0.14)",  border: "rgba(96,165,250,0.32)",  glow: "rgba(96,165,250,0.16)"  },
  3: { bg: "rgba(245,158,11,0.13)",  border: "rgba(245,158,11,0.32)",  glow: "rgba(245,158,11,0.16)"  },
  4: { bg: "rgba(52,211,153,0.13)",  border: "rgba(52,211,153,0.32)",  glow: "rgba(52,211,153,0.16)"  },
  5: { bg: "rgba(251,146,60,0.13)",  border: "rgba(251,146,60,0.32)",  glow: "rgba(251,146,60,0.16)"  },
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

      {/* ── СЕКЦИЯ 1 — Hero фото ────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: 200 }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(6,9,30,0.60) 0%, transparent 60%)',
        }} />
        <Link
          href="/courses"
          className="absolute top-4 left-4 w-9 h-9 rounded-full glass flex items-center justify-center text-[#e2e8f0] text-base active:scale-90 transition-all"
        >←</Link>
        <div className="absolute top-4 right-4">
          <span className="rounded-md border backdrop-blur-md px-2.5 py-1 text-[10px] font-black tracking-widest uppercase" style={{ background: 'rgba(18,22,58,0.55)', borderColor: 'rgba(180,200,255,0.18)', color: 'rgba(220,228,255,0.72)' }}>
            {course.category}
          </span>
        </div>
      </div>

      {/* ── СЕКЦИЯ 2 — Текст на фоне (не внутри фото) ───────────────────────── */}
      <div className="px-4 pt-5 pb-2">
        <h1 className="text-[22px] font-bold leading-tight" style={{ color: 'rgba(255,255,255,0.97)' }}>
          {course.title}
        </h1>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-sm">👨‍🎓</span>
          <span className="text-xs" style={{ color: 'rgba(220,228,255,0.70)' }}>1500+ студентов уже прошли курс</span>
        </div>
        <p className="text-sm leading-relaxed mt-2" style={{ color: 'rgba(220,228,255,0.75)' }}>
          Запусти собственную AI-модель и выстрой систему контента, трафика и монетизации.
        </p>
        <button
          onClick={() => setIsDescExpanded(!isDescExpanded)}
          className="flex items-center gap-1 mt-2 text-sm font-medium"
          style={{ color: '#c4b5fd' }}
        >
          {isDescExpanded ? "Свернуть ↑" : "Подробнее ↓"}
        </button>
      </div>

      {/* ── СЕКЦИЯ 2b — Расширенное описание ────────────────────────────────── */}
      <div className="px-4 pb-2">
        {isDescExpanded && (
          <div className="mt-4 flex flex-col gap-5">

            {/* Полное описание */}
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.72)' }}>
              <p>В этом курсе ты пройдёшь полный путь создания и развития собственного AI-проекта. Мы начнём с самого начала — создания AI-персонажа и настройки моделей, которые будут генерировать контент. Ты научишься создавать визуальные образы, работать с генерацией фото и видео, а также выстраивать уникальный стиль персонажа, который будет выделяться среди других.</p>
              <p>Далее ты узнаешь, как выстроить систему регулярного контента и подготовить её к масштабированию. Мы разберём инструменты, которые позволяют быстро создавать десятки единиц контента, автоматизировать часть процессов и поддерживать стабильный поток публикаций.</p>
              <p>Следующий этап — привлечение аудитории. В курсе подробно показывается, как запускать трафик, продвигать AI-персонажа и превращать просмотры в активную аудиторию. Ты узнаешь, какие платформы лучше всего подходят для роста, какие форматы контента работают лучше всего и как правильно выстраивать стратегию продвижения.</p>
              <p>После этого мы переходим к монетизации. Ты поймёшь, какие способы заработка работают в этой нише, как подключать платные подписки, продавать контент и выстраивать систему дохода вокруг AI-персонажа.</p>
              <p>При правильном выполнении всех шагов и активной работе с контентом многие ученики начинают получать первые результаты уже в первый месяц. У некоторых получается выйти на доход около $500–$1000, а дальше масштабирование системы позволяет постепенно увеличивать эти показатели.</p>
              <p>Курс построен пошагово: каждый модуль — это следующий этап развития проекта, поэтому ты не просто изучаешь теорию, а постепенно создаёшь полноценную рабочую систему вокруг своего AI-персонажа.</p>
            </div>

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
              <p className="text-[11px] font-medium tracking-widest uppercase mb-3" style={{ color: 'rgba(190,200,235,0.52)' }}>Из чего состоит</p>
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
              <p className="text-[11px] font-medium tracking-widest uppercase mb-3" style={{ color: 'rgba(190,200,235,0.52)' }}>Как проходить</p>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(32,42,92,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(180,200,255,0.12)' }}>
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
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(190,200,235,0.50)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Что ты получишь */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(124,92,255,0.12)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(124,92,255,0.28)' }}>
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
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.72)' }}>{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Об авторе */}
            <div className="rounded-2xl p-4 flex flex-col gap-3" style={{ background: 'rgba(32,42,92,0.38)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(180,200,255,0.12)' }}>
              <p className="text-[11px] font-black tracking-widest uppercase" style={{ color: 'rgba(190,200,235,0.52)' }}>Об авторе</p>
              <div className="flex items-center gap-3">
                {/* Gradient ring like Instagram */}
                <img
                  src="/autor.png"
                  alt="Ilya Chernyshov"
                  style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', display: 'block', flexShrink: 0 }}
                />
                <div>
                  <p className="text-[#e2e8f0] font-bold text-sm leading-tight">Ilya Chernyshov</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(196,181,253,0.70)' }}>Автор курса AI-model 2.0</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.68)' }}>
                Практик в области AI-контента и цифровых персонажей. Специализируется на работе с генеративными нейросетями, создании визуального контента и разработке систем, позволяющих масштабировать производство материалов для социальных платформ.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,228,255,0.68)' }}>
                В курсе он делится опытом создания AI-контента и показывает пошаговую систему, которая помогает пройти путь от идеи и разработки персонажа до запуска контента, привлечения аудитории и первых результатов.
              </p>
              <a
                href="https://www.instagram.com/voss.kres/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl self-start"
                style={{ background: 'linear-gradient(135deg,rgba(225,48,108,0.18),rgba(255,122,0,0.14))', border: '1px solid rgba(225,48,108,0.30)', color: '#f9a8d4', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
              >
                <span>📸</span> Instagram
              </a>
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

      {/* ── Блок Nero-бота — только до старта курса ─────────────────────────── */}
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
                  Nero
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
        <p className="text-[11px] font-medium tracking-widest uppercase mb-5" style={{ color: 'rgba(190,200,235,0.52)' }}>
          Программа курса
        </p>

        <div className="flex flex-col">
          {course.modules.map((mod: ModuleDto & { lessons: LessonSummaryDto[] }, index: number) => {
            const accent     = MODULE_ACCENTS[mod.order] ?? MODULE_ACCENTS[0];
            const isFirst    = index === 0;
            const isVipStart = index === 1;
            const isExpanded = expandedModule === mod.id;

            return (
              <div key={mod.id}>

                {/* ── VIP divider — один раз перед модулем 1 ── */}
                {isVipStart && (
                  <div className="flex items-center gap-3 mb-3 mt-1">
                    <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.50))' }} />
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.40)', letterSpacing: '0.12em' }}>
                      VIP
                    </span>
                    <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(245,158,11,0.50), transparent)' }} />
                  </div>
                )}

              <div className="flex gap-3">

                {/* ── Left: emoji + line ── */}
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
                  <div style={{ width: 2, flexGrow: 1, minHeight: 12, background: 'rgba(255,255,255,0.08)' }} />
                </div>

                {/* ── Right: карточка ── */}
                <div className="flex-1 pb-3">
                  <div
                    className="rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-[0.98]"
                    style={{
                      background: isFirst ? accent.bg : "rgba(32,42,92,0.28)",
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: isFirst ? `1px solid ${accent.border}` : "1px solid rgba(180,200,255,0.10)",
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
                          {isFirst && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.30)' }}>
                              FREE
                            </span>
                          )}
                        </div>
                        <h3 className="text-[14px] font-semibold text-[#e2e8f0] leading-tight mt-0.5">
                          {mod.title}
                        </h3>
                        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(190,200,235,0.45)' }}>
                          {mod.lessons.filter((l: LessonSummaryDto) => !['Конспект','Квиз'].includes(l.title)).length} уроков
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
                    {isExpanded && (() => {
                      const SPECIAL = ['Конспект', 'Квиз'];
                      const regular = mod.lessons.filter((l: LessonSummaryDto) => !SPECIAL.includes(l.title));
                      const special = mod.lessons.filter((l: LessonSummaryDto) => SPECIAL.includes(l.title));
                      const SPECIAL_META: Record<string, { icon: string; color: string; border: string; bg: string }> = {
                        'Конспект': { icon: '📄', color: '#fcd34d', border: 'rgba(245,158,11,0.30)', bg: 'rgba(245,158,11,0.10)' },
                        'Квиз':     { icon: '🧠', color: '#d8b4fe', border: 'rgba(168,85,247,0.30)', bg: 'rgba(168,85,247,0.10)' },
                      };
                      return (
                        <div className="border-t border-[rgba(255,255,255,0.07)] px-3.5 pb-3.5 pt-3 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                          {/* Обычные уроки */}
                          {regular.map((lesson: LessonSummaryDto, i: number) => (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors"
                              style={{ background: 'rgba(255,255,255,0.04)' }}
                            >
                              <span className="text-[11px] font-bold w-4 shrink-0 text-center" style={{ color: 'rgba(190,200,235,0.45)' }}>
                                {i + 1}
                              </span>
                              <span className="text-sm flex-1" style={{ color: 'rgba(220,228,255,0.90)' }}>{lesson.title}</span>
                            </div>
                          ))}

                          {/* Конспект / Квиз — в ряд под уроками */}
                          {special.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {special.map((lesson: LessonSummaryDto) => {
                                const meta = SPECIAL_META[lesson.title];
                                return (
                                  <div
                                    key={lesson.id}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                                    style={{ background: meta.bg, border: `1px solid ${meta.border}` }}
                                  >
                                    <span className="text-sm">{meta.icon}</span>
                                    <span className="text-xs font-semibold" style={{ color: meta.color }}>{lesson.title}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
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
