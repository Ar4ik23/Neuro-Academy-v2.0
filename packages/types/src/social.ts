export interface NoteDto {
  id: string;
  userId: string;
  lessonId: string;
  text: string;
  highlightedText?: string | null;
  createdAt: Date;
}

export interface CreateNoteDto {
  lessonId: string;
  text: string;
  highlightedText?: string;
}

export interface AIExplainDto {
  lessonId: string;
  contextText: string;
  highlightedText: string;
}

export interface AIResponseDto {
  response: string;
}
