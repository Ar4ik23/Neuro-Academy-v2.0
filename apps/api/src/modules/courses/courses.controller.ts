import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseDto, CourseDetailDto } from '@neuro-academy/types';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  async findAll(): Promise<CourseDto[]> {
    return this.coursesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CourseDetailDto> {
    return this.coursesService.findOne(id);
  }
}
