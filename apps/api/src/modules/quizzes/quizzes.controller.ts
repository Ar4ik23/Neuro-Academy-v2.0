import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Post(':id/submit')
  async submit(@Req() req: any, @Param('id') id: string, @Body('answers') answers: any[]) {
    // Note: req.user.sub will be available via JwtAuthGuard
    const userId = req.user.sub;
    return this.quizzesService.submitAttempt(userId, id, answers);
  }
}
