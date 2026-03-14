export interface QuizOptionDto {
  id: string;
  text: string;
}

export interface QuizQuestionDto {
  id: string;
  text: string;
  order: number;
  options: QuizOptionDto[];
}

export interface QuizDto {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  questions: QuizQuestionDto[];
}

export interface QuizSubmissionDto {
  answers: {
    questionId: string;
    optionId: string;
  }[];
}

export interface QuizResultDto {
  score: number;
  isPassed: boolean;
  correctAnswers: number;
  totalQuestions: number;
}
