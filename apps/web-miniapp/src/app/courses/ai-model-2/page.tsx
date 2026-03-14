"use client";

import Link from "next/link";
import { useState } from "react";

const COURSE = {
  id: "ai-model-2",
  title: "AI-model 2.0",
  description:
    "Глубокое погружение в современные языковые модели: архитектура трансформеров, fine-tuning, RAG, агенты и практическое применение AI в продуктах.",
  thumbnail:
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800",
  modules: [
    {
      id: "m1",
      number: 1,
      title: "Основы LLM",
      description: "Как устроены большие языковые модели. Токенизация, внимание и архитектура трансформера.",
      lessons: 4,
      icon: "🧠",
      color: "from-blue-500/20 to-blue-600/5",
      border: "border-blue-500/30",
    },
    {
      id: "m2",
      number: 2,
      title: "Prompt Engineering",
      description: "Продвинутые техники промптинга: Chain-of-Thought, Few-shot, ReAct и система промптов.",
      lessons: 5,
      icon: "✍️",
      color: "from-violet-500/20 to-violet-600/5",
      border: "border-violet-500/30",
    },
    {
      id: "m3",
      number: 3,
      title: "RAG и Embeddings",
      description: "Retrieval-Augmented Generation: векторные базы данных, семантический поиск и построение RAG-систем.",
      lessons: 6,
      icon: "🔍",
      color: "from-emerald-500/20 to-emerald-600/5",
      border: "border-emerald-500/30",
    },
    {
      id: "m4",
      number: 4,
      title: "Fine-tuning моделей",
      description: "Дообучение LLM под свои задачи: LoRA, QLoRA, PEFT. Практика на реальных датасетах.",
      lessons: 5,
      icon: "⚙️",
      color: "from-amber-500/20 to-amber-600/5",
      border: "border-amber-500/30",
    },
    {
      id: "m5",
      number: 5,
      title: "AI-агенты и продукты",
      description: "Создание автономных агентов, инструменты (tools), мультиагентные системы и деплой AI-продуктов.",
      lessons: 7,
      icon: "🤖",
      color: "from-rose-500/20 to-rose-600/5",
      border: "border-rose-500/30",
    },
  ],
};

export default function CourseDetailPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen pb-10">
      {/* Hero */}
      <div className="relative w-full h-52 overflow-hidden">
        <img
          src={COURSE.thumbnail}
          alt={COURSE.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        <Link
          href="/courses"
          className="absolute top-5 left-4 flex items-center justify-center w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 active:scale-90"
        >
          ←
        </Link>
      </div>

      {/* Content */}
      <div className="px-5 -mt-10 relative z-10 flex flex-col gap-5">
        {/* Title card */}
        <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-medium">
              AI & LLM
            </span>
            <span className="text-xs text-white/30">5 модулей</span>
          </div>
          <h1 className="text-2xl font-black text-white">{COURSE.title}</h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            {COURSE.description}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-0 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full" />
            </div>
            <span className="text-xs text-white/40">0%</span>
          </div>
        </div>

        {/* Modules */}
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-white px-1">Программа курса</h2>

          {COURSE.modules.map((mod) => (
            <div
              key={mod.id}
              onClick={() =>
                setExpandedModule(expandedModule === mod.id ? null : mod.id)
              }
              className={`rounded-2xl border ${mod.border} bg-gradient-to-br ${mod.color} backdrop-blur-xl p-4 cursor-pointer transition-all active:scale-[0.98]`}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-xl shrink-0">
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30 font-medium">
                      Модуль {mod.number}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {mod.title}
                  </h3>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-xs text-white/40">{mod.lessons} ур.</span>
                  <span
                    className={`text-white/60 text-sm transition-transform ${
                      expandedModule === mod.id ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </div>
              </div>

              {/* Expanded description */}
              {expandedModule === mod.id && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-sm text-white/60 leading-relaxed">
                    {mod.description}
                  </p>
                  <button className="mt-3 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-sm font-semibold text-white transition-colors">
                    Начать модуль →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg shadow-blue-500/20">
          Начать обучение
        </button>
      </div>
    </div>
  );
}
