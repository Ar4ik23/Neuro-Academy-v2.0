import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressStatus } from '@prisma/client';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('course/:courseId')
  async getCourseProgress(@Req() req: any, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(req.user.id, courseId);
  }

  @Post('lesson/:lessonId/complete')
  async completeLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.updateLessonProgress(req.user.id, lessonId, ProgressStatus.COMPLETED);
  }
}
