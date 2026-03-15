"use client";

import Link from "next/link";
import { useState } from "react";
import { getMockCourse } from "@/data/mock-courses";
import type { MockModule, MockLesson } from "@/data/mock-courses";

// ─── What's inside ─────────────────────────────────────────────────────────────
const INSIDE_ITEMS = [
  { icon: "📦", label: "6 модулей" },
  { icon: "🎬", label: "25+ уроков" },
  { icon: "📄", label: "Конспекты" },
  { icon: "🧠", label: "Квизы" },
  { icon: "🏆", label: "Экзамен" },
];

// ─── Page ───────────────────────────────────────────────────────────────────────
export default function CourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = getMockCourse(params.courseId);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-8 text-center">
        <span className="text-4xl">🔍</span>
        <h2 className="text-xl font-bold text-white">Курс не найден</h2>
        <Link href="/courses" className="text-blue-400 text-sm hover:underline">
          ← Вернуться к курсам
        </Link>
      </div>
    );
  }

  const totalLessons = course.modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="flex flex-col min-h-screen pb-10">

      {/* ── 1. Обложка ── */}
      <div className="relative w-full h-56 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <Link
          href="/courses"
          className="absolute top-5 left-4 flex items-center justify-center w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-white text-lg transition-all active:scale-90"
        >
          ←
        </Link>
        {/* category badge */}
        <div className="absolute top-5 right-4">
          <span className="rounded-md bg-black/40 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-black tracking-widest text-white/70 uppercase">
            {course.category}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-5 -mt-8 relative z-10 flex flex-col gap-6">

        {/* ── 2. Название + описание ── */}
        <div className="flex flex-col gap-3">
          <h1 className="text-[26px] font-black text-white leading-tight">{course.title}</h1>
          <p className="text-base font-semibold text-white/70 leading-snug">{course.subtitle}</p>
          <p className="text-sm text-white/45 leading-relaxed whitespace-pre-line">
            {course.fullDescription}
          </p>
        </div>

        {/* ── 3. Прогресс ── */}
        <div className="rounded-2xl bg-white/5 border border-white/8 px-4 py-3 flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs text-white/40">
              <span>Прогресс курса</span>
              <span>0 / {totalLessons} уроков</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full" />
            </div>
          </div>
          <span className="text-lg font-black text-white/20">0%</span>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-white/25 font-medium tracking-widest uppercase">Состав курса</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── 4. Что внутри ── */}
        <div className="grid grid-cols-5 gap-2">
          {INSIDE_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-white/5 border border-white/8 py-3 px-1"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] text-white/50 font-medium text-center leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/8" />
          <span className="text-[11px] text-white/25 font-medium tracking-widest uppercase">Программа</span>
          <div className="flex-1 h-px bg-white/8" />
        </div>

        {/* ── 5. Модули ── */}
        <div className="flex flex-col gap-3">
          {course.modules.map((mod: MockModule) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              isExpanded={expandedModule === mod.id}
              onToggle={() =>
                setExpandedModule(expandedModule === mod.id ? null : mod.id)
              }
            />
          ))}
        </div>

        {/* ── 6. Финальный экзамен ── */}
        <div className="rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-yellow-500/15 flex items-center justify-center text-2xl shrink-0">
            🏆
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-yellow-400/70 font-black tracking-widest uppercase mb-0.5">
              После 6 модуля
            </p>
            <h3 className="text-base font-black text-white">Финальный экзамен</h3>
            <p className="text-xs text-white/40 mt-0.5">25 вопросов · по всему курсу · сертификат</p>
          </div>
          <span className="text-white/20 text-lg">🔒</span>
        </div>

        {/* ── 7. CTA ── */}
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-black text-base tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20">
          Начать обучение
        </button>
      </div>
    </div>
  );
}

// ─── Module Card ────────────────────────────────────────────────────────────────
function ModuleCard({
  mod,
  isExpanded,
  onToggle,
}: {
  mod: MockModule;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const lessonCount = mod.lessons.length;
  const extraLabel = mod.hasQuiz ? `${lessonCount} уроков + квиз` : `${lessonCount} урока`;

  return (
    <div
      onClick={onToggle}
      className={`rounded-2xl border ${mod.border} bg-gradient-to-br ${mod.color} backdrop-blur-xl overflow-hidden cursor-pointer transition-all active:scale-[0.985]`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
          {mod.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-white/30 font-black tracking-widest uppercase">
            Модуль {mod.number}
            {mod.isFree && (
              <span className="ml-2 text-emerald-400/80">· бесплатно</span>
            )}
          </p>
          <h3 className="text-[15px] font-bold text-white leading-tight truncate">
            {mod.title}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
          <span className="text-[11px] text-white/35">{extraLabel}</span>
          <span
            className={`text-white/40 text-base leading-none transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 flex flex-col gap-2 border-t border-white/8 pt-3">
          {/* Description */}
          <p className="text-sm text-white/50 leading-relaxed mb-1">{mod.description}</p>

          {/* Lessons */}
          {mod.lessons.map((lesson: MockLesson) => (
            <div
              key={lesson.id}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
            >
              <span className="text-[11px] text-white/25 font-bold w-5 shrink-0 text-center">
                {lesson.order}
              </span>
              <span className="text-sm text-slate-300 flex-1">{lesson.title}</span>
              {lesson.isFree ? (
                <span className="text-[10px] text-emerald-400 font-bold">FREE</span>
              ) : (
                <span className="text-white/20 text-xs">→</span>
              )}
            </div>
          ))}

          {/* Notes + Quiz row */}
          <div className="flex gap-2 mt-1">
            {mod.hasNotes && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
              >
                <span className="text-sm">📄</span>
                <span className="text-xs text-white/50 font-medium">Конспект</span>
              </div>
            )}
            {mod.hasQuiz && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors"
              >
                <span className="text-sm">🧠</span>
                <span className="text-xs text-white/50 font-medium">Квиз</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
