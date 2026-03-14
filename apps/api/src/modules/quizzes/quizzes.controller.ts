import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizDto, QuizResultDto, QuizSubmissionDto } from '@neuro-academy/types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<QuizDto> {
    return this.quizzesService.findOne(id);
  }

  @Post(':id/submit')
  async submit(
    @Req() req: any,
    @Param('id') id: string,
    @Body() submission: QuizSubmissionDto,
  ): Promise<QuizResultDto> {
    return this.quizzesService.submit(req.user.id, id, submission);
  }
}
