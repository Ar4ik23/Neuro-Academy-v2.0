import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NoteDto, CreateNoteDto } from '@neuro-academy/types';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async findAllByUser(userId: string, lessonId?: string): Promise<NoteDto[]> {
    return this.prisma.note.findMany({
      where: {
        userId,
        ...(lessonId ? { lessonId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(userId: string, dto: CreateNoteDto): Promise<NoteDto> {
    return this.prisma.note.create({
      data: {
        userId,
        lessonId: dto.lessonId,
        text: dto.text,
        highlightedText: dto.highlightedText,
      },
    });
  }

  async remove(userId: string, id: string): Promise<void> {
    const note = await this.prisma.note.findUnique({ where: { id } });
    if (!note || note.userId !== userId) {
      throw new NotFoundException('Note not found');
    }
    await this.prisma.note.delete({ where: { id } });
  }
}
