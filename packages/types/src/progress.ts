export enum ProgressStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export interface LessonProgressDto {
  id: string;
  userId: string;
  lessonId: string;
  status: ProgressStatus;
  updatedAt: Date;
}

export interface CourseProgressDto {
  id: string;
  userId: string;
  courseId: string;
  percentage: number;
  status: ProgressStatus;
  updatedAt: Date;
}
