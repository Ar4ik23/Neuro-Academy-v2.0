"use client";

import Link from "next/link";
import { MOCK_COURSES, MockCourse } from "@/data/mock-courses";

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6 p-5">
      <header className="mb-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          Курсы
        </h1>
        <p className="text-white/50 text-sm mt-1">Выбери свой путь</p>
      </header>

      <div className="flex flex-col gap-5">
        {MOCK_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: MockCourse }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all hover:bg-white/8 active:scale-[0.98]">
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Category badge — top left */}
        <div className="absolute top-4 left-4">
          <span className="rounded-md bg-black/40 border border-white/20 backdrop-blur-md px-2.5 py-1 text-[10px] font-black tracking-widest text-white/70 uppercase">
            {course.category}
          </span>
        </div>

        {/* Status badge — top right */}
        <div className="absolute top-4 right-4">
          <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-300">
            {course.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        {/* Title */}
        <h3 className="text-xl font-black text-white leading-tight">{course.title}</h3>

        {/* Description */}
        <p className="text-sm text-white/55 leading-relaxed">{course.description}</p>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2">
          {course.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-white/8 border border-white/10 px-2.5 py-1 text-xs text-white/50 font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link href={`/courses/${course.id}`} className="mt-1 block">
          <button className="w-full py-3 rounded-2xl bg-white text-slate-950 text-sm font-black tracking-wide transition-all group-hover:bg-blue-400 group-hover:text-white active:scale-95">
            Подробнее
          </button>
        </Link>
      </div>
    </div>
  );
}
