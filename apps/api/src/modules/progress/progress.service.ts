import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';
import { CourseProgressDetailDto, ProgressStatus as TypesProgressStatus } from '@neuro-academy/types';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getLessonProgress(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  }

  async updateLessonProgress(userId: string, lessonId: string, status: ProgressStatus) {
    const progress = await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status },
      create: { userId, lessonId, status },
    });
    await this.recalculateCourseProgress(userId, lessonId);
    return progress;
  }

  private async recalculateCourseProgress(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    });
    if (!lesson) return;
    const courseId = lesson.module.courseId;

    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });
    const completedLessons = await this.prisma.lessonProgress.count({
      where: { userId, status: ProgressStatus.COMPLETED, lesson: { module: { courseId } } },
    });
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await this.prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { percentage, status: percentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS },
      create: { userId, courseId, percentage, status: percentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS },
    });
  }

  async getCourseProgressDetail(userId: string, courseId: string): Promise<CourseProgressDetailDto | null> {
    // Get completed lesson IDs for this user in this course
    const lessonProgresses = await this.prisma.lessonProgress.findMany({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
        lesson: { module: { courseId } },
      },
      select: { lessonId: true },
    });
    const completedLessonIds = lessonProgresses.map((lp) => lp.lessonId);

    // Get course structure in order to compute current lesson and completed modules
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' }, select: { id: true } },
          },
        },
      },
    });
    if (!course) return null;

    // Compute completedModuleIds and find currentLessonId
    const completedModuleIds: string[] = [];
    let currentLessonId: string | null = null;
    let currentModuleId: string | null = null;

    for (const mod of course.modules) {
      const allComplete =
        mod.lessons.length > 0 && mod.lessons.every((l) => completedLessonIds.includes(l.id));
      if (allComplete) {
        completedModuleIds.push(mod.id);
      }
      if (!currentLessonId) {
        const firstIncomplete = mod.lessons.find((l) => !completedLessonIds.includes(l.id));
        if (firstIncomplete) {
          currentLessonId = firstIncomplete.id;
          currentModuleId = mod.id;
        }
      }
    }

    // Get CourseProgress for percentage
    const courseProgress = await this.prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    // Not started if no CourseProgress and no lesson progresses
    if (!courseProgress && completedLessonIds.length === 0) return null;

    return {
      courseId,
      percentage: courseProgress?.percentage ?? 0,
      status: (courseProgress?.status ?? ProgressStatus.IN_PROGRESS) as unknown as TypesProgressStatus,
      completedLessonIds,
      completedModuleIds,
      currentLessonId,
      currentModuleId,
      updatedAt: courseProgress?.updatedAt ?? new Date(),
    };
  }

  async startCourse(userId: string, courseId: string, firstLessonId: string): Promise<void> {
    await this.prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId, percentage: 0, status: ProgressStatus.IN_PROGRESS },
    });
    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: firstLessonId } },
      update: {},
      create: { userId, lessonId: firstLessonId, status: ProgressStatus.IN_PROGRESS },
    });
  }

  async resetCourseProgress(userId: string, courseId: string): Promise<void> {
    // Delete all lesson progresses for this user in this course
    const lessons = await this.prisma.lesson.findMany({
      where: { module: { courseId } },
      select: { id: true },
    });
    const lessonIds = lessons.map((l) => l.id);

    await this.prisma.lessonProgress.deleteMany({
      where: { userId, lessonId: { in: lessonIds } },
    });
    await this.prisma.courseProgress.deleteMany({
      where: { userId, courseId },
    });
  }
}
