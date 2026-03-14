import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuizDto, QuizResultDto, QuizSubmissionDto } from '@neuro-academy/types';
import { ProgressService } from '../progress/progress.service';
import { ProgressStatus } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(
    private prisma: PrismaService,
    private progressService: ProgressService,
  ) {}

  async findOne(id: string): Promise<QuizDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          include: {
            options: {
              select: { id: true, text: true },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz as any;
  }

  async submit(userId: string, quizId: string, submission: QuizSubmissionDto): Promise<QuizResultDto> {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    let correctCount = 0;
    const totalQuestions = quiz.questions.length;

    for (const question of quiz.questions) {
      const userAnswer = submission.answers.find((a: { questionId: string; optionId: string }) => a.questionId === question.id);
      const correctOption = question.options.find((o: { isCorrect: boolean }) => o.isCorrect);

      if (userAnswer && correctOption && userAnswer.optionId === correctOption.id) {
        correctCount++;
      }
    }

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const isPassed = score >= quiz.passingScore;

    // Record attempt
    await this.prisma.quizAttempt.create({
      data: {
        userId,
        quizId,
        score,
        isPassed,
      },
    });

    // If passed, mark associated lesson as completed
    if (isPassed) {
      await this.progressService.updateLessonProgress(userId, quiz.lessonId, ProgressStatus.COMPLETED);
    }

    return {
      score,
      isPassed,
      correctAnswers: correctCount,
      totalQuestions,
    };
  }
}
