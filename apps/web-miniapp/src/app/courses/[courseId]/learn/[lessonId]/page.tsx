'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from '@/services/api';
import { LESSON_CONTENT } from '@/data/lesson-content';
import type { LessonBlock, VideoBlockData, TextBlockData, QuizBlockData, PdfBlockData, ModuleQuizBlockData } from '@/data/lesson-content';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { getNote, saveNote } from '@/store/notes';
import { ArtemisWidget } from '@/features/learning/components/ArtemisWidget';

/* ─────────────────────────────────────────────────────────────────────────────
   BLOCK REGISTRY — рендер по типу блока, без if-else (Правило №3)
───────────────────────────────────────────────────────────────────────────── */

function VideoBlock({ block }: { block: VideoBlockData }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden w-full" style={{ background: '#000', aspectRatio: '16/9' }}>
        <video
          className="w-full h-full"
          controls
          controlsList="nodownload"
          playsInline
          preload="metadata"
          style={{ display: 'block' }}
        >
          <source src={block.videoUrl} type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
      </div>
      {block.duration && (
        <p className="text-[#475569] text-xs text-center">⏱ {block.duration}</p>
      )}
    </div>
  );
}

function TextBlock({ block }: { block: TextBlockData }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {block.content.split('\n').map((line, i) => {
        if (line.startsWith('## '))
          return (
            <h2 key={i} style={{ color: '#e2e8f0', fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
              {line.slice(3)}
            </h2>
          );
        if (line.startsWith('> '))
          return (
            <blockquote
              key={i}
              style={{ borderLeft: '3px solid #6366f1', paddingLeft: 12, color: '#94a3b8', fontStyle: 'italic' }}
            >
              {line.slice(2)}
            </blockquote>
          );
        if (line.startsWith('- '))
          return (
            <p key={i} style={{ color: '#94a3b8', paddingLeft: 12, fontSize: '0.875rem' }}>
              · {line.slice(2)}
            </p>
          );
        if (line.startsWith('**') && line.endsWith('**'))
          return (
            <p key={i} style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.875rem' }}>
              {line.slice(2, -2)}
            </p>
          );
        if (line.trim() === '') return <div key={i} style={{ height: 4 }} />;
        return (
          <p key={i} style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.65 }}>
            {line}
          </p>
        );
      })}
    </div>
  );
}

const OPTION_LABELS = ['А', 'Б', 'В', 'Г'];

function QuizBlock({ block, onAnswer }: { block: QuizBlockData; onAnswer: (correct: boolean) => void }) {
  const [selected,   setSelected]   = useState<string | null>(null);
  const [confirmed,  setConfirmed]  = useState(false);

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    const isCorrect = block.options.find(o => o.id === selected)?.correct ?? false;
    setTimeout(() => onAnswer(isCorrect), 700);
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider mb-3">🧠 Квиз</p>
        <p className="text-white font-semibold text-base">{block.question}</p>
      </div>

      <div className="flex flex-col gap-3">
        {block.options.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const showResult = confirmed;
          return (
            <button
              key={opt.id}
              onClick={() => { if (!confirmed) setSelected(opt.id); }}
              className="w-full text-left rounded-2xl px-4 py-4 text-sm font-medium transition-all flex items-center gap-3"
              style={{
                background: showResult
                  ? (opt.correct ? 'rgba(16,185,129,0.15)' : isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)')
                  : isSelected ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.05)',
                border: showResult
                  ? (opt.correct ? '1px solid rgba(16,185,129,0.40)' : isSelected ? '1px solid rgba(239,68,68,0.40)' : '1px solid rgba(255,255,255,0.06)')
                  : isSelected ? '1px solid rgba(99,102,241,0.60)' : '1px solid rgba(255,255,255,0.10)',
                color: showResult
                  ? (opt.correct ? '#34d399' : isSelected ? '#f87171' : '#475569')
                  : isSelected ? '#ffffff' : '#e2e8f0',
              }}
            >
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: showResult
                    ? (opt.correct ? 'rgba(16,185,129,0.25)' : isSelected ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)')
                    : isSelected ? 'rgba(99,102,241,0.50)' : 'rgba(255,255,255,0.08)',
                  color: showResult
                    ? (opt.correct ? '#34d399' : isSelected ? '#f87171' : '#475569')
                    : isSelected ? '#ffffff' : '#94a3b8',
                }}
              >
                {OPTION_LABELS[idx]}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {!confirmed && (
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: selected ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
            color: selected ? '#ffffff' : '#334155',
            boxShadow: selected ? '0 0 20px rgba(99,102,241,0.30)' : 'none',
          }}
        >
          Ответить
        </button>
      )}
    </div>
  );
}

function PdfBlock({ block }: { block: PdfBlockData }) {
  if (!block.pdfUrl) {
    return (
      <div
        className="rounded-2xl p-8 flex flex-col items-center justify-center gap-3"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', minHeight: 200 }}
      >
        <span className="text-4xl">📄</span>
        <p className="text-[#94a3b8] text-sm text-center">Презентация скоро будет добавлена</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div
        className="rounded-2xl overflow-hidden w-full"
        style={{ height: '70vh', background: '#000' }}
      >
        <iframe
          src={`${block.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="w-full h-full"
          title={block.title}
          style={{ border: 'none' }}
        />
      </div>
      <a
        href={block.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-center text-xs py-2 rounded-xl"
        style={{ color: '#6366f1', background: 'rgba(99,102,241,0.10)', border: '1px solid rgba(99,102,241,0.20)' }}
      >
        Открыть в полном размере ↗
      </a>
    </div>
  );
}

function ModuleQuizBlock({ block, onAnswer }: { block: ModuleQuizBlockData; onAnswer: (correct: boolean) => void }) {
  const [current,   setCurrent]   = useState(0);
  const [selected,  setSelected]  = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correct,   setCorrect]   = useState(0);
  const [done,      setDone]      = useState(false);
  const [answers,   setAnswers]   = useState<{ questionId: string; optionId: string }[]>([]);

  const q     = block.questions[current];
  const total = block.questions.length;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    const isCorrect = q.options.find(o => o.id === selected)?.correct ?? false;
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newAnswers = [...answers, { questionId: q.id, optionId: selected }];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent(c => c + 1);
        setSelected(null);
        setConfirmed(false);
        setCorrect(newCorrect);
      } else {
        setCorrect(newCorrect);
        setDone(true);
        // Submit to API (fire-and-forget — silent on failure / API unavailable)
        if (block.quizId) {
          apiClient.post(`/quizzes/${block.quizId}/submit`, { answers: newAnswers }).catch(() => {});
        }
        onAnswer(newCorrect >= block.passThreshold);
      }
    }, 900);
  };

  if (done) {
    const passed = correct >= block.passThreshold;
    return (
      <div
        className="rounded-2xl p-6 flex flex-col items-center gap-4 text-center"
        style={{ background: passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${passed ? 'rgba(16,185,129,0.30)' : 'rgba(239,68,68,0.30)'}` }}
      >
        <div className="text-5xl">{passed ? '🎉' : '😓'}</div>
        <h3 className="text-[#e2e8f0] text-xl font-bold">{passed ? 'Квиз пройден!' : 'Не прошёл'}</h3>
        <p className="text-[#94a3b8] text-sm">
          Правильных ответов: <span className="text-[#e2e8f0] font-bold">{correct}</span> из {total}
        </p>
        <p style={{ color: passed ? '#34d399' : '#f87171', fontSize: '0.75rem', fontWeight: 600 }}>
          {passed ? `Нужно было ${block.passThreshold}/${total} — ты справился ✓` : `Нужно ${block.passThreshold}/${total} — попробуй ещё раз`}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center justify-between mb-1">
        <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">🧠 Вопрос {current + 1} / {total}</p>
        <p className="text-[#475569] text-xs">Нужно {block.passThreshold}/{total}</p>
      </div>
      <div className="progress-track h-1.5 w-full mb-2">
        <div className="progress-fill" style={{ width: `${(current / total) * 100}%` }} />
      </div>

      {/* Question */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
      >
        <p className="text-white font-semibold text-base">{q.text}</p>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {q.options.map((opt, idx) => {
          const isSelected = selected === opt.id;
          const showResult = confirmed;
          return (
            <button
              key={opt.id}
              onClick={() => { if (!confirmed) setSelected(opt.id); }}
              className="w-full text-left rounded-2xl px-4 py-4 text-sm font-medium transition-all flex items-center gap-3"
              style={{
                background: showResult
                  ? (opt.correct ? 'rgba(16,185,129,0.15)' : isSelected ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)')
                  : isSelected ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.05)',
                border: showResult
                  ? (opt.correct ? '1px solid rgba(16,185,129,0.40)' : isSelected ? '1px solid rgba(239,68,68,0.40)' : '1px solid rgba(255,255,255,0.06)')
                  : isSelected ? '1px solid rgba(99,102,241,0.60)' : '1px solid rgba(255,255,255,0.10)',
                color: showResult
                  ? (opt.correct ? '#34d399' : isSelected ? '#f87171' : '#475569')
                  : isSelected ? '#ffffff' : '#e2e8f0',
              }}
            >
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                style={{
                  background: showResult
                    ? (opt.correct ? 'rgba(16,185,129,0.25)' : isSelected ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)')
                    : isSelected ? 'rgba(99,102,241,0.50)' : 'rgba(255,255,255,0.08)',
                  color: showResult
                    ? (opt.correct ? '#34d399' : isSelected ? '#f87171' : '#475569')
                    : isSelected ? '#ffffff' : '#94a3b8',
                }}
              >
                {OPTION_LABELS[idx]}
              </span>
              {opt.text}
            </button>
          );
        })}
      </div>

      {/* Confirm button */}
      {!confirmed && (
        <button
          onClick={handleConfirm}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: selected ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
            color: selected ? '#ffffff' : '#334155',
            boxShadow: selected ? '0 0 20px rgba(99,102,241,0.30)' : 'none',
          }}
        >
          Ответить
        </button>
      )}
    </div>
  );
}

/* ─── Registry map ───────────────────────────────────────────────────────── */
type BlockProps = {
  block: LessonBlock;
  onAnswer?: (correct: boolean) => void;
};

const BLOCK_REGISTRY: Record<string, React.ComponentType<BlockProps>> = {
  VIDEO:       ({ block })           => <VideoBlock       block={block as VideoBlockData}       />,
  TEXT:        ({ block })           => <TextBlock        block={block as TextBlockData}        />,
  QUIZ:        ({ block, onAnswer }) => <QuizBlock        block={block as QuizBlockData}        onAnswer={onAnswer!} />,
  PDF:         ({ block })           => <PdfBlock         block={block as PdfBlockData}         />,
  MODULE_QUIZ: ({ block, onAnswer }) => <ModuleQuizBlock  block={block as ModuleQuizBlockData}  onAnswer={onAnswer!} />,
};

/* ─── Note Section ────────────────────────────────────────────────────────── */
function NoteSection({
  courseId, lessonId, lessonTitle, moduleTitle,
}: { courseId: string; lessonId: string; lessonTitle: string; moduleTitle: string }) {
  const [text,   setText]   = useState('');
  const [saved,  setSaved]  = useState(false);
  const [open,   setOpen]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const existing = getNote(courseId, lessonId);
    if (existing) { setText(existing.text); setOpen(true); }
  }, [courseId, lessonId]);

  const handleChange = (val: string) => {
    setText(val);
    setSaved(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveNote({ courseId, lessonId, lessonTitle, moduleTitle, text: val, savedAt: new Date().toISOString() });
      setSaved(true);
    }, 800);
  };

  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all"
        style={{ background: open ? 'rgba(245,158,11,0.10)' : 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.20)', color: '#f59e0b' }}
      >
        <span>✏️</span>
        <span className="flex-1 text-left">Моя заметка к уроку</span>
        <span style={{ fontSize: 10, opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={e => handleChange(e.target.value)}
            placeholder="Запиши главное из урока, свои мысли или вопросы…"
            rows={5}
            className="w-full rounded-2xl px-4 py-3 text-sm resize-none outline-none transition-all"
            style={{
              background: 'rgba(245,158,11,0.06)',
              border: '1px solid rgba(245,158,11,0.20)',
              color: '#e2e8f0',
              lineHeight: 1.6,
            }}
          />
          <p className="text-right text-xs" style={{ color: saved ? '#34d399' : '#475569' }}>
            {saved ? '✓ Сохранено' : text.trim() ? 'Сохраняю…' : 'Начни писать — сохранится автоматически'}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─── Module Complete Screen ──────────────────────────────────────────────── */
function ModuleCompleteScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-[#e2e8f0] text-2xl font-bold">Модуль завершён!</h2>
      <p className="text-[#94a3b8] text-sm mt-3 leading-relaxed">
        Отличная работа. Следующий модуль разблокирован.
      </p>
      <div
        className="mt-6 rounded-2xl p-4 w-full"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}
      >
        <p className="text-[#f59e0b] text-xs font-semibold uppercase tracking-wider">🤖 Артемиус</p>
        <p className="text-[#e2e8f0] text-sm mt-2 leading-relaxed">Ты справился. Продолжай в том же темпе!</p>
      </div>
      <button
        onClick={onNext}
        className="mt-8 w-full h-14 rounded-2xl font-bold text-base"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#ffffff', boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}
      >
        Начать следующий модуль →
      </button>
    </div>
  );
}

/* ─── Основной компонент ──────────────────────────────────────────────────── */
export default function LessonPage() {
  const router   = useRouter();
  const params   = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  // Найти урок и индекс модуля
  let currentLesson = null as (typeof LESSON_CONTENT.modules[0]['lessons'][0]) | null;
  let currentModuleIndex = 0;

  for (const [mi, mod] of LESSON_CONTENT.modules.entries()) {
    for (const lesson of mod.lessons) {
      if (lesson.id === lessonId) {
        currentLesson      = lesson;
        currentModuleIndex = mi;
      }
    }
  }

  const [blockIndex,       setBlockIndex]       = useState(0);
  const [isModuleComplete, setIsModuleComplete]  = useState(false);
  const [quizAnswered,     setQuizAnswered]      = useState(false);
  const [artemiosPrefill,  setArtemiosPrefill]   = useState('');
  const [selectionPopup,   setSelectionPopup]    = useState<{ x: number; y: number; text: string } | null>(null);
  const [noteModal,        setNoteModal]         = useState<{ open: boolean; selectedText: string; comment: string }>({ open: false, selectedText: '', comment: '' });

  const { complete } = useCourseProgress(courseId);
  const isQuizLesson = currentLesson?.type === 'QUIZ';

  // Text selection popup (only in non-quiz lessons)
  useEffect(() => {
    if (isQuizLesson) return;
    const handleSelection = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim();
      if (!text || text.length < 3) { setSelectionPopup(null); return; }
      const range = sel!.getRangeAt(0);
      const rect  = range.getBoundingClientRect();
      setSelectionPopup({ x: rect.left + rect.width / 2, y: rect.top, text });
    };
    document.addEventListener('mouseup',  handleSelection);
    document.addEventListener('touchend', handleSelection);
    return () => {
      document.removeEventListener('mouseup',  handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [isQuizLesson]);

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0b0f1a' }}>
        <p className="text-[#475569] text-sm">Урок не найден</p>
      </div>
    );
  }

  const blocks       = currentLesson.blocks;
  const currentBlock = blocks[blockIndex];
  const isLastBlock  = blockIndex === blocks.length - 1;
  const BlockComp    = BLOCK_REGISTRY[currentBlock?.type];
  const canContinue  = (currentBlock?.type === 'QUIZ' || currentBlock?.type === 'MODULE_QUIZ') ? quizAnswered : true;

  const handleFinishLesson = () => {
    complete(lessonId);
    router.push(`/courses/${courseId}/learn`);
  };

  const handleContinue = () => {
    if (isLastBlock) {
      handleFinishLesson();
    } else {
      setBlockIndex((prev) => prev + 1);
      setQuizAnswered(false);
    }
  };

  const handleNextModule = () => {
    const nextMod = LESSON_CONTENT.modules[currentModuleIndex + 1];
    if (nextMod?.lessons[0]) {
      router.push(`/courses/${courseId}/learn/${(nextMod.lessons[0] as any).id}`);
    } else {
      router.push(`/courses/${courseId}/learn`);
    }
  };

  if (isModuleComplete) {
    return (
      <div className="min-h-screen flex flex-col pb-8" style={{ background: '#0b0f1a' }}>
        <ModuleCompleteScreen onNext={handleNextModule} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0b0f1a' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[#475569] text-xs truncate">
            {LESSON_CONTENT.modules[currentModuleIndex]?.title}
          </p>
          <p className="text-[#e2e8f0] font-semibold text-sm truncate">
            {currentBlock?.title}
          </p>
        </div>
        <p className="text-[#475569] text-xs shrink-0">
          {blockIndex + 1} / {blocks.length}
        </p>
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────── */}
      <div className="px-4 mb-6">
        <div className="progress-track h-1.5 w-full">
          <div
            className="progress-fill"
            style={{ width: `${((blockIndex + 1) / blocks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Block content ───────────────────────────────────────────────── */}
      <div className="flex-1 px-4 overflow-y-auto pb-4">
        {BlockComp && (
          <BlockComp
            block={currentBlock}
            onAnswer={() => setQuizAnswered(true)}
          />
        )}
        {isLastBlock && !isQuizLesson && (
          <NoteSection
            courseId={courseId}
            lessonId={lessonId}
            lessonTitle={currentLesson.title}
            moduleTitle={LESSON_CONTENT.modules[currentModuleIndex]?.title ?? ''}
          />
        )}
      </div>

      {/* ── Button ──────────────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full h-14 rounded-2xl font-bold text-base transition-all"
          style={{
            background: canContinue ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
            color:      canContinue ? '#ffffff' : '#334155',
            boxShadow:  canContinue ? '0 0 28px rgba(99,102,241,0.30)' : 'none',
          }}
        >
          {isLastBlock ? (isQuizLesson ? 'Пройти модуль ✓' : 'Закончить урок ✓') : 'Продолжить →'}
        </button>
      </div>

      {/* ── Text selection popup — iOS style ────────────────────────────── */}
      {selectionPopup && !isQuizLesson && (
        <div
          style={{
            position: 'fixed',
            top: Math.max(selectionPopup.y - 50, 8),
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            whiteSpace: 'nowrap',
          }}
        >
          {/* Bubble */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#2c2c2e',
            borderRadius: '8px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            overflow: 'hidden',
          }}>
            <button
              onMouseDown={e => {
                e.preventDefault();
                const text = selectionPopup.text;
                setSelectionPopup(null);
                setArtemiosPrefill(`Вопрос по теме: "${text}"`);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              Спросить у Артемиуса
            </button>
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
            <button
              onMouseDown={e => {
                e.preventDefault();
                const text = selectionPopup.text;
                setSelectionPopup(null);
                setNoteModal({ open: true, selectedText: text, comment: '' });
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 14px',
                cursor: 'pointer',
              }}
            >
              Сделать заметку
            </button>
          </div>
          {/* Arrow */}
          <div style={{
            width: 0,
            height: 0,
            margin: '0 auto',
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid #2c2c2e',
          }} />
        </div>
      )}

      {/* ── Note from selection modal ────────────────────────────────────── */}
      {noteModal.open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 2100,
            display: 'flex',
            alignItems: 'flex-end',
            padding: '0 8px 72px',
          }}
          onClick={() => setNoteModal(m => ({ ...m, open: false }))}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '464px',
              margin: '0 auto',
              background: '#1e1b2e',
              borderRadius: '16px',
              border: '1px solid rgba(245,158,11,0.25)',
              padding: '20px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px' }}>✏️ Заметка</p>
            {noteModal.selectedText && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderLeft: '3px solid rgba(245,158,11,0.50)',
                borderRadius: '4px',
                padding: '8px 10px',
                color: '#94a3b8',
                fontSize: '12px',
                lineHeight: 1.5,
              }}>
                {noteModal.selectedText.slice(0, 120)}{noteModal.selectedText.length > 120 ? '…' : ''}
              </div>
            )}
            <textarea
              autoFocus
              value={noteModal.comment}
              onChange={e => setNoteModal(m => ({ ...m, comment: e.target.value }))}
              placeholder="Добавь свой комментарий…"
              rows={4}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(245,158,11,0.20)',
                borderRadius: '10px',
                color: '#e2e8f0',
                fontSize: '13px',
                padding: '10px 12px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'inherit',
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setNoteModal(m => ({ ...m, open: false }))}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.06)',
                  border: 'none',
                  color: '#475569',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  const text = [noteModal.selectedText, noteModal.comment].filter(Boolean).join('\n\n— ');
                  saveNote({
                    courseId,
                    lessonId,
                    lessonTitle: currentLesson!.title,
                    moduleTitle: LESSON_CONTENT.modules[currentModuleIndex]?.title ?? '',
                    text,
                    savedAt: new Date().toISOString(),
                  });
                  setNoteModal({ open: false, selectedText: '', comment: '' });
                }}
                style={{
                  flex: 2,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Сохранить заметку
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Artemius widget (only non-quiz lessons) ──────────────────────── */}
      {!isQuizLesson && (
        <ArtemisWidget
          lessonContext={`${LESSON_CONTENT.modules[currentModuleIndex]?.title} — ${currentLesson.title}`}
          prefill={artemiosPrefill}
          onPrefillUsed={() => setArtemiosPrefill('')}
        />
      )}
    </div>
  );
}
