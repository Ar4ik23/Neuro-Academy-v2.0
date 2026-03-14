import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EnrollmentType } from '@prisma/client';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

  async checkAccess(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    return !!enrollment;
  }

  async grantAccess(userId: string, courseId: string, type: EnrollmentType, expiresAt?: Date) {
    return this.prisma.enrollment.create({
      data: {
        userId,
        courseId,
        type,
        expiresAt,
      },
    });
  }

  async validateAccess(userId: string, courseId: string) {
    const hasAccess = await this.checkAccess(userId, courseId);
    if (!hasAccess) {
      throw new ForbiddenException('No active enrollment for this course');
    }
    return true;
  }
}
