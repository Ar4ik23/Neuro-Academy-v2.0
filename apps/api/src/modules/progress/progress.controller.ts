import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get(':courseId')
  async getCourseProgress(@Req() req: any, @Param('courseId') courseId: string) {
    // Note: Request object will have user populated by an AuthGuard in the future
    const userId = req.user.sub; 
    return this.progressService.getCourseProgress(userId, courseId);
  }

  @Post('lesson/:lessonId/complete')
  async markComplete(@Req() req: any, @Param('lessonId') lessonId: string) {
    const userId = req.user.sub;
    return this.progressService.markLessonComplete(userId, lessonId);
  }
}
