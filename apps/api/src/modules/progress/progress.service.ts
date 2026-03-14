import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LessonsService } from '../lessons/lessons.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class ProgressService {
  constructor(
    private prisma: PrismaService,
    private lessonsService: LessonsService,
  ) {}

  async getCourseProgress(userId: string, courseId: string) {
    return this.prisma.courseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const lesson = await this.lessonsService.findOne(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Update lesson progress
    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { status: ProgressStatus.COMPLETED },
      create: { userId, lessonId, status: ProgressStatus.COMPLETED },
    });

    // Recalculate course progress
    await this.updateCourseProgress(userId, lesson.module.courseId);
  }

  private async updateCourseProgress(userId: string, courseId: string) {
    const allLessons = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });

    const completedLessons = await this.prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { module: { courseId } },
        status: ProgressStatus.COMPLETED,
      },
    });

    const percentage = allLessons > 0 ? Math.round((completedLessons / allLessons) * 100) : 0;
    const status = percentage === 100 ? ProgressStatus.COMPLETED : ProgressStatus.IN_PROGRESS;

    await this.prisma.courseProgress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { percentage, status },
      create: { userId, courseId, percentage, status },
    });
  }
}
