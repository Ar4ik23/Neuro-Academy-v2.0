import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getLessonProgress(userId: string, lessonId: string) {
    return this.prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId },
      },
    });
  }

  async updateLessonProgress(userId: string, lessonId: string, status: ProgressStatus) {
    const progress = await this.prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: { status },
      create: { userId, lessonId, status },
    });

    // Trigger Course Progress recalculation
    await this.recalculateCourseProgress(userId, lessonId);

    return progress;
  }

  private async recalculateCourseProgress(userId: string, lessonId: string) {
    // 1. Find the course for this lesson
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { select: { courseId: true } } },
    });

    if (!lesson) return;
    const courseId = lesson.module.courseId;

    // 2. Count total lessons in course
    const totalLessons = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });

    // 3. Count completed lessons by user in this course
    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        status: ProgressStatus.COMPLETED,
        lesson: { module: { courseId } },
      },
    });

    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // 4. Update CourseProgress
    await this.prisma.courseProgress.upsert({
      where: {
        userId_courseId: { userId, courseId },
      },
      update: {
        percentage,
        status: percentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
      },
      create: {
        userId,
        courseId,
        percentage,
        status: percentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS,
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string) {
    return this.prisma.courseProgress.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });
  }
}
