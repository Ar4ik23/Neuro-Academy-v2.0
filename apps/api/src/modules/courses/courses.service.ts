import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CourseDto, CourseDetailDto } from '@neuro-academy/types';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CourseDto[]> {
    const courses = await this.prisma.course.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    
    return courses.map(c => ({
      ...c,
      price:           Number(c.price),
      description:     c.description     ?? undefined,
      thumbnail:       c.thumbnail       ?? undefined,
      category:        c.category        ?? undefined,
      subtitle:        c.subtitle        ?? undefined,
      fullDescription: c.fullDescription ?? undefined,
      status:          c.status          ?? undefined,
    }));
  }

  async findOne(id: string): Promise<CourseDetailDto> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                moduleId: true,
                title: true,
                order: true,
                lessonType: true,
                duration: true,
                isFree: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return {
      ...course,
      price:           Number(course.price),
      description:     course.description     ?? undefined,
      thumbnail:       course.thumbnail       ?? undefined,
      category:        course.category        ?? undefined,
      subtitle:        course.subtitle        ?? undefined,
      fullDescription: course.fullDescription ?? undefined,
      status:          course.status          ?? undefined,
      modules: course.modules.map(m => ({
        ...m,
        description: m.description ?? undefined,
        emoji:       m.emoji       ?? undefined,
        lessons: m.lessons.map(l => ({
          ...l,
          lessonType: l.lessonType ?? undefined,
          duration:   l.duration   ?? undefined,
        })),
      })),
    };
  }
}
