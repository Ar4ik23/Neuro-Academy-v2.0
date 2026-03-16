import { Controller, Get, Post, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProgressStatus } from '@prisma/client';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('course/:courseId')
  async getCourseProgress(@Req() req: any, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgressDetail(req.user.id, courseId);
  }

  @Post('course/:courseId/start')
  async startCourse(
    @Req() req: any,
    @Param('courseId') courseId: string,
    @Body() body: { firstLessonId: string },
  ) {
    await this.progressService.startCourse(req.user.id, courseId, body.firstLessonId);
    return { ok: true };
  }

  @Delete('course/:courseId')
  async resetCourse(@Req() req: any, @Param('courseId') courseId: string) {
    await this.progressService.resetCourseProgress(req.user.id, courseId);
    return { ok: true };
  }

  @Post('lesson/:lessonId/complete')
  async completeLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.updateLessonProgress(req.user.id, lessonId, ProgressStatus.COMPLETED);
  }
}
