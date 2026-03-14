import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressService } from '../progress/progress.service';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService,
  ) {}

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');
    return quiz;
  }

  async submitAttempt(userId: string, quizId: string, answers: { questionId: string; optionId: string }[]) {
    const quiz = await this.findOne(quizId);
    
    let correctCount = 0;
    for (const question of quiz.questions) {
      const userAnswer = answers.find(a => a.questionId === question.id);
      const correctOption = question.options.find(o => o.isCorrect);
      
      if (userAnswer && userAnswer.optionId === correctOption?.id) {
        correctCount++;
      }
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passingScore;

    const attempt = await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        isPassed,
      },
    });

    if (isPassed) {
      // Mark the associated lesson as complete
      await this.progressService.markLessonComplete(userId, quiz.lessonId);
    }

    return attempt;
  }
}
