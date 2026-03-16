// TODO: заменить на API вызовы когда бэкенд готов

export interface ExamState {
  courseId: string;
  attempts: number;           // сколько раз пытался
  blockedUntil: string | null; // ISO — заблокирован до
  passed: boolean;
  needsRetake: boolean;       // true = нужно перепройти курс
  certificate: {
    name: string;
    email: string;
    issuedAt: string;
  } | null;
}

const KEY = 'na_exam';

function getAll(): ExamState[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

function saveAll(data: ExamState[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getExamState(courseId: string): ExamState {
  return (
    getAll().find(e => e.courseId === courseId) ?? {
      courseId,
      attempts: 0,
      blockedUntil: null,
      passed: false,
      needsRetake: false,
      certificate: null,
    }
  );
}

export function isExamBlocked(state: ExamState): boolean {
  if (!state.blockedUntil) return false;
  return new Date(state.blockedUntil) > new Date();
}

export function blockTimeRemaining(state: ExamState): number {
  if (!state.blockedUntil) return 0;
  return Math.max(0, new Date(state.blockedUntil).getTime() - Date.now());
}

export function recordExamFail(courseId: string): ExamState {
  const all = getAll();
  const idx = all.findIndex(e => e.courseId === courseId);
  const prev = idx >= 0 ? all[idx] : getExamState(courseId);
  const newAttempts = prev.attempts + 1;

  const updated: ExamState = {
    ...prev,
    attempts: newAttempts,
    blockedUntil: newAttempts === 1
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      : null,
    needsRetake: newAttempts >= 2,
  };

  if (idx >= 0) all[idx] = updated; else all.push(updated);
  saveAll(all);
  return updated;
}

export function recordExamPass(courseId: string): ExamState {
  const all = getAll();
  const idx = all.findIndex(e => e.courseId === courseId);
  const prev = idx >= 0 ? all[idx] : getExamState(courseId);
  const updated: ExamState = { ...prev, passed: true, blockedUntil: null, needsRetake: false };
  if (idx >= 0) all[idx] = updated; else all.push(updated);
  saveAll(all);
  return updated;
}

export function saveCertificate(courseId: string, name: string, email: string): ExamState {
  const all = getAll();
  const idx = all.findIndex(e => e.courseId === courseId);
  if (idx < 0) return getExamState(courseId);
  all[idx] = { ...all[idx], certificate: { name, email, issuedAt: new Date().toISOString() } };
  saveAll(all);
  return all[idx];
}

export function resetExamForRetake(courseId: string): void {
  const all = getAll().filter(e => e.courseId !== courseId);
  saveAll(all);
}
