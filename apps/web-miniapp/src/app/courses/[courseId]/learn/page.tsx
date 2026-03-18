'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCourse } from '@/hooks/useCourse';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { getExamState } from '@/store/examProgress';
import { getLastLesson } from '@/data/course-map';
import { useVipStatus } from '@/hooks/useVipStatus';
import { PaymentModal } from '@/components/PaymentModal';
import type { ModuleDto, LessonSummaryDto } from '@neuro-academy/types';

// ── Layout constants ──────────────────────────────────────────────────────────
const NODE_D        = 64;
const NODE_R        = 32;
const CHECKPOINT_H  = 60;   // module banner height
const LESSON_ROW_H  = 124;
const CP_GAP        = 16;   // padding above/below checkpoint when between modules
const VIP_GATE_H    = 88;   // height of VIP gate banner in the path

// Zigzag: 0=left(14%), 1=center(50%), 2=right(86%)
// Pattern starts at center so first lesson is always centered
const LANE_FRACS = [0.14, 0.50, 0.86];
const ZZ_PATTERN = [1, 0, 1, 2, 1, 0, 1, 2];

type LessonStatus = 'completed' | 'current' | 'locked';
type ModStatus    = 'completed' | 'current' | 'locked';

function nodeBg(s: LessonStatus) {
  if (s === 'completed') return 'linear-gradient(135deg,#7C5CFF,#FF6BD6)';
  if (s === 'current')   return 'linear-gradient(135deg,#6366f1,#a855f7)';
  return 'rgba(20,26,60,0.88)';
}
function nodeBorder(s: LessonStatus) {
  if (s === 'completed') return '2.5px solid rgba(124,92,255,0.55)';
  if (s === 'current')   return '3px solid rgba(168,85,247,0.90)';
  return '2px solid rgba(180,200,255,0.09)';
}
function nodeGlow(s: LessonStatus) {
  if (s === 'current')   return '0 0 28px rgba(124,92,255,0.55),0 0 56px rgba(124,92,255,0.22)';
  if (s === 'completed') return '0 0 14px rgba(124,92,255,0.28)';
  return 'none';
}
// Lesson is free if it's in module 0, or module 1 lessons 0-1 (first 2)
function isFree(modOrder: number, lessonIdx: number) {
  return modOrder === 0 || (modOrder === 1 && lessonIdx <= 1);
}

function lessonIcon(lesson: LessonSummaryDto, s: LessonStatus) {
  if (s === 'locked') return '🔒';
  if (lesson.title === 'Конспект') return '📄';
  if (lesson.title === 'Квиз')     return '🧠';
  if (lesson.lessonType === 'VIDEO') return '🎬';
  if (lesson.lessonType === 'PDF')   return '📑';
  return '📄';
}

export default function CourseLearnPage() {
  const router   = useRouter();
  const params   = useParams();
  const courseId = params.courseId as string;

  const { course, loading }                                                 = useCourse(courseId);
  const { percent: rawPercent, isCompleted, progress, completeModuleById } = useCourseProgress(courseId);
  const examState = getExamState(courseId);
  const percent   = examState.passed ? 100 : rawPercent;

  const [congratsModule, setCongratsModule] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const isVip = useVipStatus(courseId);

  const containerRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(332);
  // Перезапускаем observer когда course загрузился (containerRef.current null во время скелетона)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    setCw(el.clientWidth || 332);
    const ro = new ResizeObserver(() => setCw(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, [course?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Скроллим к текущему уроку (#path-current), или к низу если не найден
  useEffect(() => {
    if (!course) return;
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (cancelled) return;
        const main = document.querySelector('main');
        if (!main) return;
        const node = document.getElementById('path-current');
        if (node) {
          // Центрируем текущий урок в видимой области
          const mainRect = main.getBoundingClientRect();
          const nodeRect = node.getBoundingClientRect();
          const nodeTopInMain = nodeRect.top - mainRect.top + main.scrollTop;
          main.scrollTop = nodeTopInMain - main.clientHeight / 2 + node.offsetHeight / 2;
        } else {
          // Нет текущего урока — показываем начало (модуль 0 снизу)
          main.scrollTop = main.scrollHeight;
        }
      });
    });
    return () => { cancelled = true; };
  }, [course?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!course || !progress) return;
    const mods = course.modules as (ModuleDto & { lessons: LessonSummaryDto[] })[];
    for (const mod of mods) {
      if (progress?.completedModuleIds?.includes(mod.id)) continue;
      if (mod.lessons.length > 0 && mod.lessons.every(l => isCompleted(l.id))) {
        completeModuleById(mod.id);
        setCongratsModule(mod.id);
        break;
      }
    }
  }, [progress?.currentLessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  const getModStatus = (id: string): ModStatus =>
    progress?.completedModuleIds?.includes(id) ? 'completed' :
    id === progress?.currentModuleId           ? 'current'   :
    !progress ? (id === 'm1' ? 'current' : 'locked') : 'locked';

  if (loading || !course) {
    return (
      <div className="pb-24 flex flex-col">
        <div className="px-4 pt-10 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/5 animate-pulse" />
          <div className="flex-1">
            <div className="h-3 w-16 rounded bg-white/5 animate-pulse mb-1" />
            <div className="h-5 w-40 rounded bg-white/5 animate-pulse" />
          </div>
        </div>
        <div className="mx-4 mb-6 rounded-2xl h-16 bg-white/5 animate-pulse" />
        <div className="px-4 flex flex-col gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-14 rounded-2xl bg-white/5 animate-pulse" />)}
        </div>
      </div>
    );
  }

  const modules = course.modules as (ModuleDto & { lessons: LessonSummaryDto[] })[];

  // ── Build flat path items ─────────────────────────────────────────────────
  // Checkpoints are placed BETWEEN modules so the path line passes through them
  type Item =
    | { k: 'cp';     mod: typeof modules[0]; ms: ModStatus; y: number }
    | { k: 'lesson'; mod: typeof modules[0]; lesson: LessonSummaryDto; ls: LessonStatus; lane: number; cx: number; y: number; lessonIdx: number }
    | { k: 'vip';    y: number };

  const items: Item[] = [];
  let y  = 0;

  modules.forEach((mod, modIdx) => {
    const ms = getModStatus(mod.id);

    // Module 0 checkpoint appears at the very top (no previous module)
    if (modIdx === 0) {
      items.push({ k: 'cp', mod, ms, y });
      y += CHECKPOINT_H + CP_GAP;
    }
    // Subsequent module checkpoints are added AFTER the previous module's lessons (see end of loop)

    // Reset zigzag counter at each module start so first lesson is always center (index 0 → lane 1)
    let lc = 0;

    // ALL lessons go into the path (including Конспект and Квиз)
    for (const lesson of mod.lessons) {
      // Insert VIP gate before lesson index 2 of module 1 (non-VIP only)
      if (mod.order === 1 && lc === 2 && !isVip) {
        items.push({ k: 'vip', y });
        y += VIP_GATE_H;
      }

      // First lesson of each module is always centered (cx = 50%), rest follow ZZ pattern
      const lane = lc === 0 ? 1 : ZZ_PATTERN[lc % ZZ_PATTERN.length];
      const cx   = lc === 0 ? Math.round(cw / 2) : Math.round(LANE_FRACS[lane] * cw);
      const ls: LessonStatus =
        ms === 'completed'                      ? 'completed' :
        isCompleted(lesson.id)                  ? 'completed' :
        lesson.id === progress?.currentLessonId ? 'current'   : 'locked';

      items.push({ k: 'lesson', mod, lesson, ls, lane, cx, y, lessonIdx: lc });
      y += LESSON_ROW_H;
      lc++;
    }

    // After this module's lessons: place the NEXT module's checkpoint between modules
    if (modIdx < modules.length - 1) {
      const nextMod = modules[modIdx + 1];
      const nextMs  = getModStatus(nextMod.id);
      y += CP_GAP;
      items.push({ k: 'cp', mod: nextMod, ms: nextMs, y });
      y += CHECKPOINT_H + CP_GAP;
    }
  });

  const totalH = y;

  // ── Flip y so path goes bottom→top (ascending journey) ───────────────────
  const flippedItems = items.map(item =>
    item.k === 'cp'     ? { ...item, y: totalH - item.y - CHECKPOINT_H } :
    item.k === 'lesson' ? { ...item, y: totalH - item.y - LESSON_ROW_H } :
    item.k === 'vip'    ? { ...item, y: totalH - item.y - VIP_GATE_H }   :
    item
  );

  // ── SVG path ─────────────────────────────────────────────────────────────
  const nodes = flippedItems.filter((it): it is Extract<Item, { k: 'lesson' }> => it.k === 'lesson');

  // Path breaks at module boundaries — no line crossing between modules
  function buildPath(upTo: number): string {
    if (!nodes.length || upTo < 0) return '';
    const limit = Math.min(upTo, nodes.length - 1);
    let d = '';
    for (let i = 0; i <= limit; i++) {
      const cur = nodes[i];
      const cy  = cur.y + NODE_R;
      if (i === 0) {
        d = `M ${cur.cx} ${cy}`;
      } else {
        const prev = nodes[i - 1];
        if (prev.mod.id !== cur.mod.id) {
          // Module boundary — lift pen, start new sub-path
          d += ` M ${cur.cx} ${cy}`;
        } else {
          const py  = prev.y + NODE_R;
          const mid = py + (cy - py) * 0.5;
          d += ` C ${prev.cx} ${mid}, ${cur.cx} ${mid}, ${cur.cx} ${cy}`;
        }
      }
    }
    return d;
  }

  // fullPath: gray guide line — exactly node[0] to node[last]
  const fullPath   = nodes.length >= 2 ? buildPath(nodes.length - 1) : '';
  // donePath: colored progress line — node[0] to last non-locked node
  const lastActive = nodes.reduce((best, n, i) => n.ls !== 'locked' ? i : best, -1);
  const donePath   = lastActive >= 1 ? buildPath(lastActive) : '';

  const lastLesson   = getLastLesson();
  const examUnlocked = isCompleted(lastLesson.lessonId);

  return (
    <div className="pb-36 pt-20">

      {/* ── Header (fixed) — высота 52px = root header ───────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, zIndex: 40,
        height: 52, padding: '0 16px',
        background: 'rgba(8,11,34,0.88)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(124,92,255,0.18)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(32,42,92,0.45)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(180,200,255,0.14)', color: 'rgba(220,228,255,0.80)' }}
        >
          ←
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(190,200,235,0.45)' }}>Курс</p>
          <h1 className="font-bold text-lg leading-tight" style={{ color: 'rgba(255,255,255,0.96)' }}>{course.title}</h1>
        </div>
      </div>

      {/* ── Финальный экзамен (вверху — цель пути) ──────────────────────────── */}
      <div className="px-4 pb-2">
        <div style={{
          background: examState.passed ? 'rgba(16,185,129,0.08)' : examUnlocked ? 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(168,85,247,0.10))' : 'rgba(255,255,255,0.03)',
          border: examState.passed ? '1px solid rgba(16,185,129,0.30)' : examUnlocked ? '1px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 20, padding: '16px', opacity: examUnlocked ? 1 : 0.55,
        }}>
          <div className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: 24 }}>{examState.passed ? '🏆' : examUnlocked ? '🎓' : '🔒'}</span>
            <div className="flex-1">
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: examState.passed ? '#34d399' : examUnlocked ? '#a5b4fc' : 'rgba(190,200,235,0.58)' }}>
                {examState.passed ? 'Пройден' : examUnlocked ? 'Доступен' : 'Заблокирован'}
              </p>
              <p style={{ color: examUnlocked ? '#e2e8f0' : 'rgba(220,228,255,0.72)', fontWeight: 700, fontSize: 15 }}>
                Финальный экзамен
              </p>
            </div>
            <button
              disabled={!examUnlocked}
              onClick={() => examUnlocked && router.push(`/courses/${courseId}/exam`)}
              style={{
                padding: '8px 14px', borderRadius: 12, fontWeight: 700, fontSize: 12,
                background: examState.passed ? 'linear-gradient(135deg,#10b981,#34d399)' : examUnlocked ? 'linear-gradient(135deg,#6366f1,#a855f7)' : 'rgba(255,255,255,0.06)',
                color: examUnlocked ? '#fff' : 'rgba(190,200,235,0.60)',
                boxShadow: examUnlocked && !examState.passed ? '0 0 16px rgba(99,102,241,0.30)' : 'none',
                border: 'none', cursor: examUnlocked ? 'pointer' : 'default', whiteSpace: 'nowrap',
              }}
            >
              {examState.passed ? '🏆 Сертификат' : examUnlocked ? 'Начать →' : '🔒'}
            </button>
          </div>
          {!examState.passed && (
            <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.4 }}>
              {examUnlocked ? '30 вопросов · 45 минут · нужно 26/30 правильных ответов' : 'Пройди все уроки последнего модуля чтобы разблокировать экзамен'}
            </p>
          )}
        </div>
        {/* Коннектор вниз к пути */}
        <div className="flex justify-center mt-2">
          <div style={{ width: 2, height: 20, background: examUnlocked ? 'rgba(99,102,241,0.50)' : 'rgba(255,255,255,0.08)' }} />
        </div>
      </div>

      {/* ── Adventure Path ──────────────────────────────────────────────────── */}
      <div ref={containerRef} className="relative mx-[15%] mb-4" style={{ height: totalH }}>

        {/* SVG winding road */}
        <svg width={cw} height={totalH} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" />
              <stop offset="100%" stopColor="#FF6BD6" />
            </linearGradient>
          </defs>
          {fullPath && <path d={fullPath} fill="none" stroke="rgba(180,200,255,0.07)" strokeWidth={6} strokeLinecap="round" />}
          {donePath && <>
            <path d={donePath} fill="none" stroke="url(#pathGrad)" strokeWidth={10} strokeLinecap="round" opacity={0.13} />
            <path d={donePath} fill="none" stroke="url(#pathGrad)" strokeWidth={5}  strokeLinecap="round" opacity={0.60} />
          </>}
        </svg>

        {flippedItems.map((item, idx) => {

          /* ── Checkpoint ── */
          if (item.k === 'cp') {
            const lineColor =
              item.ms === 'completed' ? 'rgba(52,211,153,0.25)' :
              item.ms === 'current'   ? 'rgba(124,92,255,0.30)' : 'rgba(180,200,255,0.08)';

            return (
              <div
                key={`cp-${item.mod.id}`}
                style={{ position: 'absolute', top: item.y, left: 0, right: 0, height: CHECKPOINT_H, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, zIndex: 2 }}
              >
                {/* Left line */}
                <div style={{ flex: 1, height: 1, background: lineColor }} />

                {/* Badge */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 16, flexShrink: 0,
                  background:
                    item.ms === 'completed' ? 'rgba(52,211,153,0.12)' :
                    item.ms === 'current'   ? 'rgba(124,92,255,0.16)' : 'rgba(14,18,48,0.80)',
                  border:
                    item.ms === 'completed' ? '1px solid rgba(52,211,153,0.30)' :
                    item.ms === 'current'   ? '1px solid rgba(124,92,255,0.40)' : '1px solid rgba(180,200,255,0.12)',
                  backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: item.ms === 'current' ? '0 0 20px rgba(124,92,255,0.20)' : 'none',
                }}>
                  <span style={{ fontSize: 18 }}>{item.mod.emoji}</span>
                  <div>
                    <p style={{ fontSize: 9, color: 'rgba(190,200,235,0.42)', textTransform: 'uppercase', letterSpacing: '0.10em', fontWeight: 700, lineHeight: 1 }}>
                      Модуль {item.mod.order}
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 700, color: item.ms === 'locked' ? 'rgba(190,200,235,0.45)' : '#e2e8f0', marginTop: 2 }}>
                      {item.mod.title}
                    </p>
                  </div>
                  {item.ms === 'completed' && <span style={{ fontSize: 12, color: '#34d399', fontWeight: 900 }}>✓</span>}
                </div>

                {/* Right line */}
                <div style={{ flex: 1, height: 1, background: lineColor }} />
              </div>
            );
          }


          /* ── VIP Gate ── */
          if (item.k === 'vip') {
            return (
              <div
                key="vip-gate"
                style={{ position: 'absolute', top: item.y, left: 0, right: 0, height: VIP_GATE_H, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px', zIndex: 2 }}
              >
                <button
                  onClick={() => setShowPayment(true)}
                  style={{
                    width: '100%', borderRadius: 16,
                    background: 'linear-gradient(135deg, rgba(20,16,60,0.92) 0%, rgba(35,22,80,0.92) 100%)',
                    border: '1px solid rgba(245,158,11,0.45)',
                    boxShadow: '0 0 24px rgba(245,158,11,0.10)',
                    padding: '10px 14px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.32)', flexShrink: 0 }}>
                    <span style={{ fontSize: 17 }}>👑</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                    <p style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#f59e0b' }}>VIP доступ</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(220,228,255,0.75)', marginTop: 2 }}>Следующие уроки требуют VIP</p>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right' }}>
                    <p style={{ fontSize: 15, fontWeight: 900, color: '#f59e0b' }}>$49</p>
                    <p style={{ fontSize: 9, color: 'rgba(220,228,255,0.35)' }}>навсегда →</p>
                  </div>
                </button>
              </div>
            );
          }

          /* ── Lesson node ── */
          if (item.k === 'lesson') {
            const { ls, cx, lesson } = item;
            const isCur = ls === 'current';
            const lk    = ls === 'locked';
            const lft   = cx - NODE_R;
            const isSpecial = lesson.title === 'Конспект' || lesson.title === 'Квиз';
            const free  = isFree(item.mod.order, item.lessonIdx);

            return (
              <div
                key={`l-${lesson.id}`}
                id={isCur ? 'path-current' : undefined}
                style={{ position: 'absolute', top: item.y, left: lft }}
              >
                {isCur && (
                  <>
                    <div className="path-pulse-ring"   style={{ position: 'absolute', inset: -10, borderRadius: 28, border: '2px solid rgba(124,92,255,0.45)' }} />
                    <div className="path-pulse-ring-2" style={{ position: 'absolute', inset: -20, borderRadius: 38, border: '1.5px solid rgba(124,92,255,0.20)' }} />
                  </>
                )}

                <button
                  disabled={lk && (isVip || free)}
                  onClick={() => {
                    if (!isVip && !free) { setShowPayment(true); return; }
                    if (!lk) router.push(`/courses/${courseId}/learn/${lesson.id}`);
                  }}
                  style={{
                    width: NODE_D, height: NODE_D, borderRadius: isSpecial ? 32 : 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: ls === 'completed' ? 22 : 20,
                    fontWeight: ls === 'completed' ? 900 : 400,
                    color: lk ? 'rgba(190,200,235,0.38)' : '#fff',
                    background: isSpecial && !lk && ls !== 'completed'
                      ? lesson.title === 'Конспект'
                        ? 'linear-gradient(135deg,rgba(245,158,11,0.30),rgba(245,158,11,0.15))'
                        : 'linear-gradient(135deg,rgba(168,85,247,0.30),rgba(168,85,247,0.15))'
                      : nodeBg(ls),
                    border: isSpecial && !lk && ls !== 'completed'
                      ? lesson.title === 'Конспект'
                        ? '2px solid rgba(245,158,11,0.45)'
                        : '2px solid rgba(168,85,247,0.45)'
                      : nodeBorder(ls),
                    boxShadow: nodeGlow(ls),
                    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
                    cursor: lk ? 'default' : 'pointer',
                    position: 'relative', zIndex: 1,
                  }}
                >
                  {lessonIcon(lesson, ls)}
                </button>

                {/* Label */}
                <div style={{ position: 'absolute', top: NODE_D + 6, left: -20, width: NODE_D + 40, textAlign: 'center', zIndex: 1 }}>
                  <p style={{
                    fontSize: 10, lineHeight: '13px',
                    color: lk ? 'rgba(190,200,235,0.32)' : isCur ? 'rgba(230,235,255,0.92)' : 'rgba(220,228,255,0.70)',
                    fontWeight: isCur ? 600 : 400,
                    display: '-webkit-box',
                    WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {lesson.title}
                  </p>
                  {ls === 'completed' && (
                    <p style={{ fontSize: 9, color: '#10b981', fontWeight: 700, marginTop: 2 }}>✓ Пройдено</p>
                  )}
                  {isCur && (
                    <>
                      <p style={{ fontSize: 9, color: '#a78bfa', fontWeight: 700, marginTop: 2 }}>● Текущий</p>
                      <button
                        onClick={() => {
                          if (!isVip && !free) { setShowPayment(true); return; }
                          router.push(`/courses/${courseId}/learn/${lesson.id}`);
                        }}
                        style={{ marginTop: 5, padding: '4px 10px', borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', fontSize: 9, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 0 10px rgba(99,102,241,0.40)', whiteSpace: 'nowrap' }}
                      >
                        {!isVip && !free ? '👑 VIP навсегда — $49' : 'Перейти →'}
                      </button>
                    </>
                  )}
                  {lk && (
                    <p style={{ fontSize: 9, color: 'rgba(190,200,235,0.38)', marginTop: 2 }}>○ Заблокировано</p>
                  )}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* ── Фиксированный прогресс над навигацией ───────────────────────────── */}
      <div style={{
        position: 'fixed', bottom: '15%', left: '50%', transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)', maxWidth: 432, zIndex: 30,
        padding: '12px 16px 20px',
        background: 'rgba(8,11,34,0.88)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(124,92,255,0.18)',
        borderRadius: 20,
      }}>
        <div className="flex justify-between items-center mb-1">
          <p style={{ color: 'rgba(148,163,184,0.80)', fontSize: 11 }}>Прогресс курса</p>
          <div className="flex items-center gap-2">
            {examState.passed && (
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.35)', borderRadius: 6, fontSize: 10, fontWeight: 700, padding: '2px 7px' }}>
                ✓ Пройден
              </span>
            )}
            <p style={{ color: '#6366f1', fontSize: 12, fontWeight: 600 }}>{percent}%</p>
          </div>
        </div>
        <div className="progress-track h-1.5 w-full">
          <div className="progress-fill" style={{ width: `${percent}%`, background: examState.passed ? 'linear-gradient(90deg,#10b981,#34d399)' : undefined }} />
        </div>
      </div>

      {/* ── Поздравление ────────────────────────────────────────────────────── */}
      {congratsModule && (() => {
        const mod         = modules.find(m => m.id === congratsModule);
        const moduleIndex = modules.findIndex(m => m.id === congratsModule);
        const nextModule  = modules[moduleIndex + 1];

        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 px-4" style={{ background: 'rgba(0,0,0,0.70)', backdropFilter: 'blur(4px)' }}>
            <div className="w-full rounded-3xl p-6 flex flex-col items-center text-center" style={{ background: '#161b2e', border: '1px solid rgba(99,102,241,0.30)', boxShadow: '0 0 60px rgba(99,102,241,0.20)' }}>
              <div className="text-5xl mb-4">🎉</div>
              <p className="text-[#6366f1] text-xs font-semibold uppercase tracking-widest mb-2">Модуль завершён</p>
              <h2 className="text-[#e2e8f0] text-xl font-bold">{mod?.emoji} {mod?.title}</h2>
              <p className="text-[#94a3b8] text-sm mt-2 leading-relaxed">Отлично! Ты прошёл этот модуль.</p>
              <div className="mt-4 rounded-2xl p-3 w-full text-left" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)' }}>
                <p className="text-[#f59e0b] text-xs font-semibold">🤖 Nero</p>
                <p className="text-[#e2e8f0] text-sm mt-1">Продолжай в том же темпе! Следующий модуль уже открыт.</p>
              </div>
              {nextModule && (
                <div className="mt-4 w-full rounded-2xl p-3 flex gap-3 items-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="text-2xl">{nextModule.emoji}</span>
                  <div className="text-left">
                    <p className="text-[#94a3b8] text-xs">Следующий модуль</p>
                    <p className="text-[#e2e8f0] text-sm font-semibold">{nextModule.title}</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => setCongratsModule(null)}
                className="mt-5 w-full py-4 rounded-2xl font-bold text-base"
                style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#ffffff', boxShadow: '0 0 28px rgba(99,102,241,0.35)' }}
              >
                {nextModule ? `Начать: ${nextModule.title} →` : 'Курс завершён 🏆'}
              </button>
            </div>
          </div>
        );
      })()}

      {showPayment && (
        <PaymentModal courseId={courseId} onClose={() => setShowPayment(false)} />
      )}

    </div>
  );
}
