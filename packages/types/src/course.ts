export interface CourseDto {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  published: boolean;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ModuleDto {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LessonSummaryDto {
  id: string;
  moduleId: string;
  title: string;
  order: number;
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
  quiz?: any;
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
