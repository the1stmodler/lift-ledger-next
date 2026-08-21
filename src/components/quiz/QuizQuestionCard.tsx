'use client';

import { cn } from '@/lib/utils';
import type { QuizQuestion } from '@/types';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  index: number;
  selectedOption: string | null;
  onAnswer: (questionId: string, option: string) => void;
}

/** Une question à choix multiple du quiz, avec réponse verrouillée une fois choisie. */
export default function QuizQuestionCard({ question, index, selectedOption, onAnswer }: QuizQuestionCardProps) {
  return (
    <div className="rounded-m border border-metal-line bg-steel-1 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-platinum">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-electric-line bg-electric-soft font-mono text-[10px] text-electric-bright">
          Q{index + 1}
        </span>
        {question.prompt}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {question.options.map((option) => {
          const isSelected = selectedOption === option;
          return (
            <button
              key={option}
              onClick={() => onAnswer(question.id, option)}
              className={cn(
                'rounded-s border px-3 py-2.5 text-center text-xs font-semibold transition-colors',
                isSelected
                  ? 'border-electric-bright bg-electric-soft text-electric-bright'
                  : 'border-metal-lineStrong bg-steel-2 text-mute hover:text-platinum',
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
