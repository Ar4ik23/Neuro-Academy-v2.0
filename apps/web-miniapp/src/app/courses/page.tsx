"use client";

import { memo } from "react";
import Link from "next/link";
import { useCoursesList } from "@/hooks/useCourse";
import { useCourseProgress } from "@/hooks/useCourseProgress";
import { getExamState } from "@/store/examProgress";
import type { CourseDto } from "@neuro-academy/types";

export default function CoursesPage() {
  const { courses, loading } = useCoursesList();

  return (
    <div className="flex flex-col gap-6 p-5">
      <header className="mb-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Курсы
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(220,228,255,0.55)' }}>Выбери свой путь</p>
      </header>

      {loading ? (
        <div className="flex flex-col gap-5">
          {[1].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-44 w-full rounded-t-2xl bg-white/5" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-5 w-3/4 rounded bg-white/5" />
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-10 w-full rounded-2xl bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

const CourseCard = memo(function CourseCard({ course }: { course: CourseDto }) {
  const { isStarted, percent: rawPercent } = useCourseProgress(course.id);
  const examState = getExamState(course.id);
  const percent = examState.passed ? 100 : rawPercent;
  return (
    <div className="group relative overflow-hidden rounded-[20px] overflow-hidden" style={{ background: 'rgba(14,18,50,0.55)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 10px 30px rgba(0,0,0,0.45), 0 0 15px rgba(124,92,255,0.10)' }}>
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span className="rounded-md bg-black/40 border border-border-subtle backdrop-blur-md px-2.5 py-1 text-[10px] font-black tracking-widest text-text-2 uppercase">
            {course.category}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          {examState.passed ? (
            <span className="rounded-lg backdrop-blur-md px-3 py-1 text-xs font-bold" style={{ background: 'rgba(16,185,129,0.20)', border: '1px solid rgba(16,185,129,0.40)', color: '#34d399' }}>
              ✓ Пройден
            </span>
          ) : (
            <span className="rounded-lg bg-success/15 border border-success/25 backdrop-blur-md px-3 py-1 text-xs font-bold text-success">
              {course.status}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <h3 className="text-xl font-black text-text-1 leading-tight">{course.title}</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-xs">👤</span>
          <span className="text-xs font-medium" style={{ color: 'rgba(196,181,253,0.80)' }}>Ilya Chernyshov</span>
        </div>
        <p className="text-sm text-text-2 leading-relaxed">{course.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(255,255,255,0.08)", color: "#94a3b8" }}>
            6 модулей
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8",
                         border: "1px solid rgba(99,102,241,0.30)" }}>
            AI 2026
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa",
                         border: "1px solid rgba(59,130,246,0.30)" }}>
            Тренд
          </span>
          <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24",
                         border: "1px solid rgba(245,158,11,0.30)" }}>
            от 3000$
          </span>
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <p className="text-[#94a3b8] text-[11px]">Прогресс</p>
              <p className="text-[#6366f1] text-[11px] font-semibold">{percent}%</p>
            </div>
            <div className="progress-track h-1.5">
              <div className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}

        {/* CTA */}
        <Link href={`/courses/${course.id}`} className="mt-1 block">
          <button
            className="w-full py-3 text-sm font-black tracking-wide active:scale-95 rounded-2xl"
            style={examState.passed
              ? { background: 'linear-gradient(135deg,#10b981,#34d399)', color: '#fff' }
              : { background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,0.45)' }
            }
          >
            {examState.passed ? '🏆 Курс пройден' : 'Подробнее'}
          </button>
        </Link>
      </div>
    </div>
  );
});
