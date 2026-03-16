export interface CourseDto {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  published: boolean;
  price: number;
  category?: string;
  subtitle?: string;
  fullDescription?: string;
  status?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleDto {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  emoji?: string;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonSummaryDto {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  lessonType?: string;
  duration?: string;
  isFree: boolean;
}

export interface CourseDetailDto extends CourseDto {
  modules: (ModuleDto & {
    lessons: LessonSummaryDto[];
  })[];
}

export enum BlockType {
  TEXT = 'TEXT',
  VIDEO = 'VIDEO',
  IMAGE = 'IMAGE',
  PDF = 'PDF',
  PRESENTATION = 'PRESENTATION',
  CHECKLIST = 'CHECKLIST',
  QUOTE = 'QUOTE',
  DOWNLOAD = 'DOWNLOAD',
  CALLOUT = 'CALLOUT',
}

export interface LessonBlock {
  id: string;
  lessonId: string;
  type: BlockType | string;
  content: any;
  order: number;
}

export interface LessonDetailDto extends LessonSummaryDto {
  blocks: LessonBlock[];
  quiz?: import('./quiz').QuizDto;
}

export interface CreateCourseDto {
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
}

export interface CreateModuleDto {
  courseId: string;
  title: string;
  description?: string;
  order: number;
}
