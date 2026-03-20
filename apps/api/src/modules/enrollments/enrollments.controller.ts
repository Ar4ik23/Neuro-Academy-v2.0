import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  async getMyEnrollments(@Req() req: any) {
    return this.enrollmentsService.getUserEnrollments(req.user.id);
  }

  @Get('check/:courseId')
  async check(@Req() req: any, @Param('courseId') courseId: string) {
    return { hasAccess: await this.enrollmentsService.checkAccess(req.user.id, courseId) };
  }
}
