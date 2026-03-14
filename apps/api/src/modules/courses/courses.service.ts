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
      price: Number(c.price),
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
      price: Number(course.price),
      modules: course.modules.map(m => ({
        ...m,
        lessons: m.lessons,
      })),
    };
  }
}
