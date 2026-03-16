// TODO: заменить на API вызовы когда бэкенд готов

export interface Note {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  text: string;
  savedAt: string;
}

const STORAGE_KEY = 'na_notes';

export function getAllNotes(): Note[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getNote(courseId: string, lessonId: string): Note | null {
  return getAllNotes().find(n => n.courseId === courseId && n.lessonId === lessonId) || null;
}

export function saveNote(note: Note): void {
  const all = getAllNotes().filter(n => !(n.courseId === note.courseId && n.lessonId === note.lessonId));
  if (note.text.trim()) {
    all.unshift({ ...note, savedAt: new Date().toISOString() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteNote(courseId: string, lessonId: string): void {
  const all = getAllNotes().filter(n => !(n.courseId === courseId && n.lessonId === lessonId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}
