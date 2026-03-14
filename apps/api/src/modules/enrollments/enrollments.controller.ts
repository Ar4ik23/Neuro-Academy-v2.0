import { Controller, Get, Param, Req } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  async getMyEnrollments(@Req() req: any) {
    const userId = req.user.sub;
    return this.enrollmentsService.getUserEnrollments(userId);
  }

  @Get('check/:courseId')
  async check(@Req() req: any, @Param('courseId') courseId: string) {
    const userId = req.user.sub;
    return { hasAccess: await this.enrollmentsService.checkAccess(userId, courseId) };
  }
}
