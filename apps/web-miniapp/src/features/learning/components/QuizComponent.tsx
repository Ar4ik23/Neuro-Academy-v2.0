"use client";

import React, { useState } from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { QuizSubmissionDto } from '@neuro-academy/types';

export const QuizComponent: React.FC<{ 
  quizId: string; 
  onFinished: (passed: boolean) => void;
  onClose: () => void;
}> = ({ quizId, onFinished, onClose }) => {
  const { quiz, loading, submitQuiz } = useQuiz(quizId);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const submission: QuizSubmissionDto = {
      answers: Object.entries(answers).map(([qId, oId]) => ({
        questionId: qId,
        optionId: oId,
      })),
    };

    const res = await submitQuiz(submission);
    setResult(res);
  };

  if (loading && !quiz) return <div>Loading Quiz...</div>;
  if (!quiz) return null;

  if (result) {
    return (
      <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-6 animate-enter">
        <div className="glass-card premium-border rounded-[40px] p-8 w-full max-w-md flex flex-col items-center gap-6 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg ${result.isPassed ? 'bg-green-500 shadow-green-500/20' : 'bg-red-500 shadow-red-500/20'}`}>
            {result.isPassed ? '✅' : '❌'}
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-black text-white">{result.isPassed ? 'Congratulations!' : 'Try Again'}</h2>
            <p className="text-slate-400 text-sm">
              You scored {result.score}% ({result.correctAnswers}/{result.totalQuestions})
            </p>
          </div>
          <button 
            onClick={() => onFinished(result.isPassed)}
            className="w-full py-4 rounded-2xl bg-white text-black font-black"
          >
            {result.isPassed ? 'CONTINUE' : 'BACK TO LESSON'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background p-4 overflow-y-auto animate-enter">
      <div className="flex flex-col gap-8 max-w-2xl mx-auto pb-10">
        <header className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
          <button onClick={onClose} className="text-slate-400">Close</button>
        </header>

        <div className="flex flex-col gap-8">
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="flex flex-col gap-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Question {idx + 1}</span>
              <p className="text-lg text-white font-medium">{q.text}</p>
              <div className="grid grid-cols-1 gap-3">
                {q.options.map(opt => (
                  <div 
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer twa-tap-active ${
                      answers[q.id] === opt.id 
                      ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < quiz.questions.length}
          className="mt-4 w-full py-5 rounded-3xl bg-indigo-500 disabled:opacity-50 disabled:grayscale font-black text-white shadow-xl shadow-indigo-500/20"
        >
          SUBMIT QUIZ
        </button>
      </div>
    </div>
  );
};
