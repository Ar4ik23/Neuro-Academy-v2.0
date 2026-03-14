import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findByLesson(userId: string, lessonId: string) {
    return this.prisma.note.findMany({
      where: { userId, lessonId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, data: { lessonId: string; text: string; highlightedText?: string }) {
    return this.prisma.note.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async delete(userId: string, id: string) {
    return this.prisma.note.delete({
      where: { id, userId },
    });
  }
}
