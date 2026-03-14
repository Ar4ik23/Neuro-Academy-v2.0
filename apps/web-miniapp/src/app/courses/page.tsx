"use client";

import Link from "next/link";

const COURSES = [
  {
    id: "ai-model-2",
    title: "AI-model 2.0",
    description:
      "Глубокое погружение в современные языковые модели: архитектура трансформеров, fine-tuning, RAG, агенты и практическое применение AI в продуктах.",
    thumbnail:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800",
    tag: "AI & LLM",
    modules: 5,
    price: "Бесплатно",
  },
];

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
        {COURSES.map((course) => (
          <Link key={course.id} href={`/courses/${course.id}`}>
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl transition-all hover:bg-white/10 active:scale-95 cursor-pointer">
              <div className="relative h-48 w-full overflow-hidden rounded-2xl">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-lg bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300 backdrop-blur-md">
                    {course.tag}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{course.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-white/60">
                  {course.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <span>📚</span>
                    <span>{course.modules} модулей</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-400">
                      {course.price}
                    </span>
                    <span className="rounded-xl bg-white px-5 py-2 text-sm font-bold text-slate-950 transition-colors group-hover:bg-blue-400 group-hover:text-white">
                      Открыть →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
