'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EXAM_QUESTIONS, EXAM_CONFIG } from '@/data/lesson-content';
import {
  getExamState, isExamBlocked, blockTimeRemaining,
  recordExamFail, recordExamPass, saveCertificate, resetExamForRetake,
} from '@/store/examProgress';
import { resetProgress } from '@/hooks/useCourseProgress';

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatBlockTime(ms: number) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h > 0) return `${h} ч ${m} мин`;
  return `${m} мин`;
}

const OPTION_LABELS = ['А', 'Б', 'В', 'Г'];

/* ─── Экран: ознакомление ─────────────────────────────────────────────────── */
function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col gap-5 px-4 pt-8 pb-24">
      <div className="text-center">
        <div style={{ fontSize: 52 }}>🎓</div>
        <h1 className="text-[#e2e8f0] text-2xl font-bold mt-3">Финальный экзамен</h1>
        <p className="text-[#64748b] text-sm mt-1">AI-model 2.0</p>
      </div>

      <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 16 }} className="p-5 flex flex-col gap-3">
        <p className="text-[#a5b4fc] font-semibold text-sm uppercase tracking-wider">📋 Условия экзамена</p>
        {[
          ['🧠', '30 вопросов', 'по материалу всего курса'],
          ['✅', '26 правильных ответов', 'необходимо для прохождения'],
          ['⏱', '45 минут', 'на весь экзамен'],
          ['🏆', 'Сертификат', 'выдаётся после успешного прохождения'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="flex items-start gap-3">
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
            <span className="text-[#e2e8f0] text-sm"><strong>{title}</strong> — {desc}</span>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.20)', borderRadius: 16 }} className="p-5 flex flex-col gap-2">
        <p className="text-[#f87171] font-semibold text-sm">⚠️ Важно знать</p>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          При первом провале — <strong className="text-[#fca5a5]">блокировка на 24 часа</strong>.
        </p>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          При втором провале — потребуется <strong className="text-[#fca5a5]">повторное прохождение курса</strong>.
        </p>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Если время вышло — экзамен считается проваленным.
        </p>
      </div>

      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)', borderRadius: 16 }} className="p-4">
        <p className="text-[#fbbf24] text-sm leading-relaxed text-center">
          💡 Перед стартом убедись что у тебя есть 45 минут и стабильное соединение
        </p>
      </div>

      <button
        onClick={onStart}
        className="w-full h-14 rounded-2xl font-bold text-base mt-2"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}
      >
        Начать экзамен →
      </button>
    </div>
  );
}

/* ─── Экран: заблокирован ─────────────────────────────────────────────────── */
function BlockedScreen({ remaining, onBack }: { remaining: number; onBack: () => void }) {
  const [left, setLeft] = useState(remaining);
  useEffect(() => {
    const t = setInterval(() => setLeft(p => Math.max(0, p - 1000)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-6">
      <div style={{ fontSize: 60 }}>🔒</div>
      <h2 className="text-[#e2e8f0] text-xl font-bold">Экзамен заблокирован</h2>
      <p className="text-[#94a3b8] text-sm leading-relaxed">
        Ты не прошёл экзамен с первой попытки.<br />Следующая попытка будет доступна через:
      </p>
      <div style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 16 }} className="px-8 py-4">
        <p className="text-[#f87171] text-3xl font-bold font-mono">{formatBlockTime(left)}</p>
      </div>
      <button onClick={onBack} style={{ color: '#64748b', background: 'none', border: 'none', fontSize: 14, cursor: 'pointer' }}>
        ← Вернуться к курсу
      </button>
    </div>
  );
}

/* ─── Экран: нужно перепройти курс ───────────────────────────────────────── */
function RetakeScreen({ courseId, onRetake }: { courseId: string; onRetake: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-6">
      <div style={{ fontSize: 60 }}>😔</div>
      <h2 className="text-[#e2e8f0] text-xl font-bold">Курс нужно пройти заново</h2>
      <p className="text-[#94a3b8] text-sm leading-relaxed">
        Ты не смог сдать экзамен с двух попыток. Чтобы попробовать снова — нужно перепройти весь курс.
      </p>
      <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.20)', borderRadius: 16 }} className="p-4 w-full">
        <p className="text-[#fbbf24] text-sm">Это не наказание — это возможность закрепить материал и сдать экзамен уверенно.</p>
      </div>
      <button
        onClick={onRetake}
        className="w-full h-14 rounded-2xl font-bold text-base"
        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}
      >
        Начать курс заново
      </button>
    </div>
  );
}

/* ─── Экран: вопрос ───────────────────────────────────────────────────────── */
function QuestionScreen({
  question, index, total, timeLeft, selected, confirmed, onSelect, onConfirm,
}: {
  question: typeof EXAM_QUESTIONS[0];
  index: number; total: number; timeLeft: number;
  selected: string | null; confirmed: boolean;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}) {
  const pct = (timeLeft / (EXAM_CONFIG.timeLimitMinutes * 60 * 1000)) * 100;
  const isUrgent = timeLeft < 5 * 60 * 1000;

  return (
    <div className="flex flex-col h-full">
      {/* Timer + progress */}
      <div className="px-4 pt-6 pb-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[#64748b] text-xs">Вопрос {index + 1} / {total}</p>
          <p className="font-mono text-sm font-bold" style={{ color: isUrgent ? '#f87171' : '#94a3b8' }}>
            ⏱ {formatTime(timeLeft)}
          </p>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: isUrgent ? '#ef4444' : 'linear-gradient(90deg,#6366f1,#a855f7)', transition: 'width 1s linear', borderRadius: 4 }} />
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((index) / total) * 100}%`, background: 'rgba(99,102,241,0.5)', borderRadius: 4 }} />
        </div>
      </div>

      {/* Question */}
      <div className="px-4 flex-1 overflow-y-auto pb-4 flex flex-col gap-4">
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16 }} className="p-5">
          <p style={{ color: '#6366f1', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>🧠 Вопрос {index + 1}</p>
          <p style={{ color: '#ffffff', fontWeight: 600, fontSize: '1rem', lineHeight: 1.6 }}>{question.text}</p>
        </div>

        <div className="flex flex-col gap-3">
          {question.options.map((opt, i) => {
            const isSel = selected === opt.id;
            const showResult = confirmed;
            return (
              <button
                key={opt.id}
                onClick={() => { if (!confirmed) onSelect(opt.id); }}
                className="w-full text-left rounded-2xl px-4 py-4 text-sm font-medium flex items-center gap-3"
                style={{
                  background: showResult
                    ? (opt.correct ? 'rgba(16,185,129,0.15)' : isSel ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.03)')
                    : isSel ? 'rgba(99,102,241,0.20)' : 'rgba(255,255,255,0.05)',
                  border: showResult
                    ? (opt.correct ? '1px solid rgba(16,185,129,0.40)' : isSel ? '1px solid rgba(239,68,68,0.40)' : '1px solid rgba(255,255,255,0.06)')
                    : isSel ? '1px solid rgba(99,102,241,0.60)' : '1px solid rgba(255,255,255,0.10)',
                  color: showResult
                    ? (opt.correct ? '#34d399' : isSel ? '#f87171' : '#475569')
                    : isSel ? '#fff' : '#e2e8f0',
                  transition: 'all 0.15s',
                }}
              >
                <span
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: showResult
                      ? (opt.correct ? 'rgba(16,185,129,0.25)' : isSel ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)')
                      : isSel ? 'rgba(99,102,241,0.50)' : 'rgba(255,255,255,0.08)',
                    color: showResult
                      ? (opt.correct ? '#34d399' : isSel ? '#f87171' : '#475569')
                      : isSel ? '#fff' : '#94a3b8',
                  }}
                >
                  {OPTION_LABELS[i]}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>

        {!confirmed && (
          <button
            onClick={onConfirm}
            disabled={!selected}
            className="w-full h-14 rounded-2xl font-bold text-sm mt-2"
            style={{
              background: selected ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'rgba(255,255,255,0.06)',
              color: selected ? '#fff' : '#334155',
              boxShadow: selected ? '0 0 20px rgba(99,102,241,0.30)' : 'none',
            }}
          >
            Ответить
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Экран: результаты ───────────────────────────────────────────────────── */
function ResultScreen({
  correct, total, passed, onCertificate, onFail,
}: {
  correct: number; total: number; passed: boolean;
  onCertificate: () => void; onFail: () => void;
}) {
  const pct = Math.round((correct / total) * 100);
  return (
    <div className="flex flex-col items-center px-4 pt-10 pb-24 gap-6 text-center">
      <div style={{ fontSize: 64 }}>{passed ? '🎉' : '😓'}</div>
      <h2 className="text-[#e2e8f0] text-2xl font-bold">{passed ? 'Экзамен сдан!' : 'Не сдан'}</h2>

      <div style={{ background: passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${passed ? 'rgba(16,185,129,0.30)' : 'rgba(239,68,68,0.30)'}`, borderRadius: 16 }} className="p-6 w-full flex flex-col gap-3">
        <div style={{ fontSize: 40, fontWeight: 800, color: passed ? '#34d399' : '#f87171' }}>
          {correct} / {total}
        </div>
        <p className="text-[#94a3b8] text-sm">правильных ответов ({pct}%)</p>
        <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: passed ? 'linear-gradient(90deg,#10b981,#34d399)' : 'linear-gradient(90deg,#ef4444,#f87171)', borderRadius: 8 }} />
        </div>
        <p style={{ color: passed ? '#34d399' : '#f87171', fontSize: 12, fontWeight: 600 }}>
          {passed ? `Порог ${EXAM_CONFIG.passThreshold}/${total} — пройден ✓` : `Нужно ${EXAM_CONFIG.passThreshold}/${total} — не хватило ${EXAM_CONFIG.passThreshold - correct} ответа(ов)`}
        </p>
      </div>

      {passed ? (
        <button
          onClick={onCertificate}
          className="w-full h-14 rounded-2xl font-bold text-base"
          style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', color: '#fff', boxShadow: '0 0 28px rgba(16,185,129,0.35)' }}
        >
          🏆 Получить сертификат
        </button>
      ) : (
        <button
          onClick={onFail}
          className="w-full h-14 rounded-2xl font-bold text-base"
          style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8' }}
        >
          Понял, закрыть
        </button>
      )}
    </div>
  );
}

/* ─── Экран: сертификат ───────────────────────────────────────────────────── */
function CertificateScreen({
  courseId, onDone,
}: { courseId: string; onDone: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) return;
    saveCertificate(courseId, name.trim(), email.trim());
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center px-6 pt-12 pb-24 gap-6 text-center">
        <div style={{ fontSize: 64 }}>🏆</div>
        <h2 className="text-[#e2e8f0] text-2xl font-bold">Сертификат отправлен!</h2>
        <p className="text-[#94a3b8] text-sm leading-relaxed">
          Сертификат об окончании курса <strong className="text-[#e2e8f0]">AI-model 2.0</strong> отправлен на <strong className="text-[#a5b4fc]">{email}</strong>.
        </p>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 16 }} className="p-5 w-full">
          <p className="text-[#34d399] text-sm font-semibold mb-1">Поздравляем, {name}!</p>
          <p className="text-[#94a3b8] text-sm leading-relaxed">
            Ты прошёл полный курс и успешно сдал финальный экзамен. Теперь у тебя есть все инструменты для запуска и масштабирования AI-модели.
          </p>
        </div>
        <button
          onClick={onDone}
          className="w-full h-14 rounded-2xl font-bold text-base"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff' }}
        >
          Завершить курс 🎓
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 pt-8 pb-24 gap-5">
      <div className="text-center">
        <div style={{ fontSize: 52 }}>🏆</div>
        <h2 className="text-[#e2e8f0] text-xl font-bold mt-3">Получи сертификат</h2>
        <p className="text-[#64748b] text-sm mt-1">Введи данные для выдачи сертификата</p>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <p className="text-[#94a3b8] text-xs mb-1.5 ml-1">Имя и Фамилия</p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Иван Иванов"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, color: '#e2e8f0', fontSize: 14, padding: '12px 14px', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
        <div>
          <p className="text-[#94a3b8] text-xs mb-1.5 ml-1">Email для получения</p>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            style={{
              width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12, color: '#e2e8f0', fontSize: 14, padding: '12px 14px', outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim() || !email.trim()}
        className="w-full h-14 rounded-2xl font-bold text-base mt-2"
        style={{
          background: name.trim() && email.trim() ? 'linear-gradient(135deg, #10b981, #34d399)' : 'rgba(255,255,255,0.06)',
          color: name.trim() && email.trim() ? '#fff' : '#334155',
          boxShadow: name.trim() && email.trim() ? '0 0 24px rgba(16,185,129,0.30)' : 'none',
        }}
      >
        Получить сертификат
      </button>
    </div>
  );
}

/* ─── Основной компонент ──────────────────────────────────────────────────── */
type Screen = 'intro' | 'blocked' | 'retake' | 'exam' | 'result' | 'certificate';

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const [screen, setScreen] = useState<Screen>('intro');
  const [examState, setExamState] = useState(() => getExamState(courseId));

  // Shuffle options once per session
  const shuffledQuestions = useMemo(() => EXAM_QUESTIONS.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5),
  })), []);

  // exam state
  const [qIndex, setQIndex]     = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXAM_CONFIG.timeLimitMinutes * 60 * 1000);
  const [examResult, setExamResult] = useState<{ correct: number; passed: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check block / retake on mount
  useEffect(() => {
    const s = getExamState(courseId);
    setExamState(s);
    if (s.passed) { setScreen('certificate'); return; }
    if (s.needsRetake) { setScreen('retake'); return; }
    if (isExamBlocked(s)) { setScreen('blocked'); return; }
  }, [courseId]);

  // Timer
  useEffect(() => {
    if (screen !== 'exam') { if (timerRef.current) clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1000) {
          clearInterval(timerRef.current!);
          handleTimeUp();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screen]);

  const handleTimeUp = () => {
    const state = recordExamFail(courseId);
    setExamState(state);
    setExamResult({ correct: correctCount, passed: false });
    setScreen('result');
  };

  const handleStart = () => {
    setQIndex(0); setSelected(null); setConfirmed(false);
    setCorrectCount(0); setTimeLeft(EXAM_CONFIG.timeLimitMinutes * 60 * 1000);
    setScreen('exam');
  };

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    setConfirmed(true);
    const isCorrect = EXAM_QUESTIONS[qIndex].options.find(o => o.id === selected)?.correct ?? false;
    const newCorrect = correctCount + (isCorrect ? 1 : 0);

    setTimeout(() => {
      if (qIndex + 1 < shuffledQuestions.length) {
        setQIndex(i => i + 1);
        setSelected(null);
        setConfirmed(false);
        setCorrectCount(newCorrect);
      } else {
        // finished
        if (timerRef.current) clearInterval(timerRef.current);
        const passed = newCorrect >= EXAM_CONFIG.passThreshold;
        if (passed) {
          recordExamPass(courseId);
        } else {
          const state = recordExamFail(courseId);
          setExamState(state);
        }
        setExamResult({ correct: newCorrect, passed });
        setScreen('result');
      }
    }, 900);
  };

  const handleRetake = () => {
    resetExamForRetake(courseId);
    resetProgress(courseId);
    router.push(`/courses/${courseId}/learn`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0b0f1a' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4 shrink-0">
        <button
          onClick={() => router.push(`/courses/${courseId}/learn`)}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-[#475569] text-xs">AI-model 2.0</p>
          <p className="text-[#e2e8f0] font-semibold text-sm">Финальный экзамен</p>
        </div>
        {screen === 'exam' && (
          <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.30)', borderRadius: 8, padding: '4px 10px' }}>
            <p className="text-[#a5b4fc] text-xs font-bold">{qIndex + 1}/30</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {screen === 'intro' && <IntroScreen onStart={handleStart} />}
        {screen === 'blocked' && (
          <BlockedScreen
            remaining={blockTimeRemaining(examState)}
            onBack={() => router.push(`/courses/${courseId}/learn`)}
          />
        )}
        {screen === 'retake' && (
          <RetakeScreen courseId={courseId} onRetake={handleRetake} />
        )}
        {screen === 'exam' && (
          <QuestionScreen
            question={shuffledQuestions[qIndex]}
            index={qIndex}
            total={shuffledQuestions.length}
            timeLeft={timeLeft}
            selected={selected}
            confirmed={confirmed}
            onSelect={setSelected}
            onConfirm={handleConfirm}
          />
        )}
        {screen === 'result' && examResult && (
          <ResultScreen
            correct={examResult.correct}
            total={shuffledQuestions.length}
            passed={examResult.passed}
            onCertificate={() => setScreen('certificate')}
            onFail={() => {
              const s = getExamState(courseId);
              if (s.needsRetake) setScreen('retake');
              else if (isExamBlocked(s)) setScreen('blocked');
              else router.push(`/courses/${courseId}/learn`);
            }}
          />
        )}
        {screen === 'certificate' && (
          <CertificateScreen
            courseId={courseId}
            onDone={() => router.push(`/courses/${courseId}`)}
          />
        )}
      </div>
    </div>
  );
}
